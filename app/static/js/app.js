const VERSION = '4.9.8';
let CATALOG = {insurers:[], risks:[], riskModel:[], activities:[], textTemplates:[]};
let cases = [];
let clients = [];
let currentTab = 'client';
let state = blankCase();

function blankCase(){return {id:null,title:'',status:'rozpracováno',adviser:{name:'Administrátor ASTORIE',email:'admin@astorie.local',phone:'',role:'Poradce / zpracovatel',company:'ASTORIE a.s.',company_ico:'48293776',note:''},client:{ico:'',name:'',legal_form:'',address:'',data_box:'',contact_person:'',contact_email:'',contact_phone:'',website:'',registered_office:'',billing_email:''},activity:{code:'',name:''},questionnaire:{turnover:'',employees:'',territory:'Česká republika',insurance_start:'',insurance_period:'1 rok',payment_frequency:'ročně',export_info:'',main_activity_detail:'',side_activities:'',annual_revenue_breakdown:'',payroll:'',locations:'',property_description:'',security:'',claims_history:'',current_insurance:'',requested_scope:'',deductible_preference:'',special_notes:'',attachments_note:''},risks:[],selected_insurers:[],offers:{},insurer_requests:{},liability_agreements:[],case_textations:[],documents:[],report:{advisor_note:'',client_selected_offer:'',client_choice_reason:''},audit:[]};}
function $(id){return document.getElementById(id)}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),3600)}
function esc(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function norm(v){return String(v??'').trim()}


function asArray(v){
  if(Array.isArray(v)) return v;
  if(!v) return [];
  if(typeof v === 'object'){
    const out=[];
    Object.entries(v).forEach(([group, arr])=>{
      if(Array.isArray(arr)) arr.forEach(x=>out.push(Object.assign({group}, x)));
      else if(arr && typeof arr==='object') out.push(Object.assign({group}, arr));
    });
    return out;
  }
  return [];
}
function normalizeCatalog(){
  CATALOG.insurers = asArray(CATALOG.insurers).map(i=>Object.assign({}, i, {code: i.code || i.short || i.shortcut || i.zkratka || i.id || i.name}));
  CATALOG.risks = asArray(CATALOG.risks).map(r=>Object.assign({}, r, {risk_key: r.risk_key || r.key || r.id || (r.group&&r.id?`${r.group}_${r.id}`:'')}));
  CATALOG.activities = asArray(CATALOG.activities);
  CATALOG.riskModel = asArray(CATALOG.riskModel);
  CATALOG.textTemplates = asArray(CATALOG.textTemplates).map(t=>Object.assign({type:'centrální',title:t.name||t.title||'Textace',area:t.area||t.category||'',text:t.text||t.body||''}, t));
}
function activityOptions(){return (CATALOG.activities||[]).map(a=>`<option value="${esc(a.name||a.activity_name||'')}" data-code="${esc(a.code||a.id||a.activity_code||'')}">${esc(a.name||a.activity_name||a.code||'')}</option>`).join('')}
function riskOptions(){return (CATALOG.risks||[]).map(r=>`<option value="${esc(riskKey(r))}">${esc(r.group?`${r.group} – `:'')}${esc(riskName(r))}</option>`).join('')}
function riskByKey(key){return (CATALOG.risks||[]).find(x=>riskKey(x)===key)||{};}
function caseInsuranceCard(){
  return `<p class="eyebrow">2. Karta pro pojištění</p><h2>Údaje pro poptávku a pojišťovny</h2><p class="muted">Tato část nahrazuje odborný vstupní dotazník z původního formuláře. Nejedná se o identifikaci klienta, ale o data důležitá pro pojištění, poptávku, nabídky a pozdější report.</p>
  <div class="section-soft"><h3>Základ pojištění</h3><div class="grid3"><label>Typ činnosti<input id="activity_name" list="activityList" value="${esc(state.activity.name)}" placeholder="např. Bezpečnostní agentura"><datalist id="activityList">${activityOptions()}</datalist></label><label>Kód činnosti<input id="activity_code" value="${esc(state.activity.code)}"></label><label>Území<input id="q_territory" value="${esc(state.questionnaire.territory)}"></label></div><label>Detail hlavní činnosti<textarea id="q_main_activity_detail" placeholder="Popis skutečné činnosti klienta, provoz, služby, výrobky, specifika...">${esc(state.questionnaire.main_activity_detail)}</textarea></label><label>Vedlejší činnosti<textarea id="q_side_activities" placeholder="Vedlejší nebo okrajové činnosti, které mají být zahrnuté v poptávce...">${esc(state.questionnaire.side_activities)}</textarea></label></div>
  <div class="section-soft"><h3>Ekonomické a provozní údaje</h3><div class="grid4"><label>Obrat<input id="q_turnover" value="${esc(state.questionnaire.turnover)}" placeholder="např. 10 000 000 Kč"></label><label>Mzdy / payroll<input id="q_payroll" value="${esc(state.questionnaire.payroll)}"></label><label>Zaměstnanci<input id="q_employees" value="${esc(state.questionnaire.employees)}"></label><label>Pojistné období<input id="q_insurance_period" value="${esc(state.questionnaire.insurance_period)}"></label><label>Frekvence placení<input id="q_payment_frequency" value="${esc(state.questionnaire.payment_frequency||'ročně')}" placeholder="ročně / pololetně / čtvrtletně"></label></div><label>Členění obratu / export / zahraničí<textarea id="q_annual_revenue_breakdown" placeholder="Tuzemsko, EU, mimo EU, obrat podle činností...">${esc(state.questionnaire.annual_revenue_breakdown||state.questionnaire.export_info)}</textarea></label></div>
  <div class="section-soft"><h3>Majetek, provozovny a zabezpečení</h3><label>Provozovny / místa pojištění<textarea id="q_locations" placeholder="Adresy provozoven, sklady, kanceláře, výrobní prostory...">${esc(state.questionnaire.locations)}</textarea></label><label>Popis majetku / vybavení / zásob<textarea id="q_property_description" placeholder="Budovy, stroje, technologie, zásoby, odpovědnostní vazby...">${esc(state.questionnaire.property_description)}</textarea></label><label>Zabezpečení<textarea id="q_security" placeholder="EPS, EZS, ostraha, kamerový systém, požární ochrana...">${esc(state.questionnaire.security)}</textarea></label></div>
  <div class="section-soft"><h3>Požadovaný rozsah a podklady</h3><div class="grid3"><label>Počátek pojištění<input id="q_insurance_start" type="date" value="${esc(state.questionnaire.insurance_start)}"></label><label>Preferovaná spoluúčast<input id="q_deductible_preference" value="${esc(state.questionnaire.deductible_preference)}"></label><label>Současné pojištění<input id="q_current_insurance" value="${esc(state.questionnaire.current_insurance)}"></label></div><label>Požadovaný rozsah pojištění<textarea id="q_requested_scope" placeholder="Co má být určitě poptáno, limity, připojištění, požadované klauzule...">${esc(state.questionnaire.requested_scope)}</textarea></label><label>Škodní průběh<textarea id="q_claims_history" placeholder="Škody za poslední roky, frekvence, výše, poznámky...">${esc(state.questionnaire.claims_history)}</textarea></label><label>Přílohy / podklady<textarea id="q_attachments_note" placeholder="Dotazníky, revize, smlouvy, stávající pojistky, výpisy, fotodokumentace...">${esc(state.questionnaire.attachments_note)}</textarea></label><label>Speciální poznámka pro poptávku<textarea id="q_special_notes">${esc(state.questionnaire.special_notes||state.questionnaire.export_info)}</textarea></label></div>
  <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu pro pojištění</button><button class="btn secondary" onclick="readCurrentTab();currentTab='liability';renderWorkspace()">Pokračovat na modul odpovědnosti</button></div>`;
}

async function init(){
  bindNav(); bindButtons();
  await loadCatalog();
  await loadCases(false);
  renderAll();
}
function bindNav(){
  document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{readCurrentTab();currentTab=b.dataset.tab;renderWorkspace();}));
}
function bindButtons(){
  ['newCaseBtn','newCaseBtn2'].forEach(id=>$(id)?.addEventListener('click',()=>{newCase(true);showView('workspace')}));
  $('saveCaseBtn')?.addEventListener('click',saveCase);
  $('loadCasesBtn')?.addEventListener('click',()=>loadCases(true));
}
function showView(view){
  document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  $(`${view}View`)?.classList.add('active');
  if(view==='workspace') renderWorkspace();
  if(view==='admin') renderAdmin();
  if(view==='textations') renderTextationsBox();
}
async function fetchJson(url,opts){const r=await fetch(url,opts);let data={};try{data=await r.json()}catch(e){} if(!r.ok) throw new Error(data.detail||data.message||`HTTP ${r.status}`); return data;}
async function loadCatalog(){
  try{CATALOG=await fetchJson('/api/catalog');}
  catch(e){toast('Číselníky se nepodařilo načíst: '+e.message);}
  normalizeCatalog();
}
async function loadCases(showToast=true){
  try{const data=await fetchJson('/api/inquiries');cases=data.items||[];renderAll();if(showToast) toast(data.message || 'Obchodní případy načteny.');}
  catch(e){cases=[];renderAll();toast('Obchodní případy se nepodařilo načíst: '+e.message);}
}
async function openCase(id){
  try{const data=await fetchJson(`/api/inquiries/${id}`);state=normalizeCase(data.item||blankCase());currentTab='client';showView('workspace');renderAll();toast('Obchodní případ načten.');}
  catch(e){toast('Případ se nepodařilo otevřít: '+e.message);}
}
async function saveCase(){
  readCurrentTab();
  if(!norm(state.client.name)){toast('Nejdříve vyplňte název klienta.');currentTab='client';showView('workspace');return;}
  state.title = `Obchodní případ – ${state.client.name}`;
  try{const data=await fetchJson('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)}); if(data.id) state.id=data.id; toast(data.message||'Případ uložen.'); await loadCases(false); renderAll();}
  catch(e){toast('Uložení se nepodařilo: '+e.message);}
}
function newCase(msg=true){state=blankCase();currentTab='client';if(msg) toast('Založen nový pracovní případ.');renderAll();}
function normalizeCase(item){
  const s=Object.assign(blankCase(),item||{}); s.client=Object.assign(blankCase().client,s.client||{}); s.adviser=Object.assign(blankCase().adviser,s.adviser||{}); s.activity=Object.assign(blankCase().activity,s.activity||{}); s.questionnaire=Object.assign(blankCase().questionnaire,s.questionnaire||{}); s.risks=Array.isArray(s.risks)?s.risks:[]; s.selected_insurers=uniqueInsurerCodes(Array.isArray(s.selected_insurers)?s.selected_insurers:[]); s.offers=(s.offers&&typeof s.offers==='object'&&!Array.isArray(s.offers))?s.offers:{}; s.insurer_requests=(s.insurer_requests&&typeof s.insurer_requests==='object'&&!Array.isArray(s.insurer_requests))?s.insurer_requests:{}; s.liability_agreements=Array.isArray(s.liability_agreements)?s.liability_agreements:[]; s.case_textations=Array.isArray(s.case_textations)?s.case_textations:[]; s.risks=s.risks.map(migrateRiskRecord); s.report=Object.assign(blankCase().report,s.report||{}); s.documents=Array.isArray(s.documents)?s.documents:[]; return s;
}
function readiness(){let score=0;if(state.client.name)score+=18;if(state.client.ico)score+=8;if(state.activity.name)score+=8;if(state.questionnaire.main_activity_detail||state.questionnaire.turnover||state.questionnaire.locations)score+=8;if(state.risks.length)score+=18;if(selectedInsurerCodes().length)score+=16;if(Object.keys(state.offers||{}).length)score+=16;if(state.report.client_selected_offer)score+=14;return Math.min(100,score)}
function offerCount(){return Object.keys(state.offers||{}).filter(k=>selectedInsurerCodes().includes(k)||state.offers[k]).length}
function insurerCode(i){return i.code||i.shortcut||i.zkratka||i.key||i.name}

function uniqueInsurerCodes(arr){
  const out=[];
  (arr||[]).forEach(code=>{
    const c=String(code||'').trim();
    if(c && !out.includes(c)) out.push(c);
  });
  return out;
}
function selectedInsurerCodes(){
  state.selected_insurers = uniqueInsurerCodes(state.selected_insurers||[]);
  return state.selected_insurers;
}
function insurerByCode(code){return (CATALOG.insurers||[]).find(i=>insurerCode(i)===code)||{code,name:code}}
function riskName(r){return r.name||r.label||r.risk_name||r.key||r.risk_key||'Riziko'}
function riskKey(r){return r.key||r.risk_key||riskName(r).toUpperCase().replace(/[^A-Z0-9]+/g,'_')}
function riskSpecification(r){return r.specification ?? r.client_note ?? ''}
function riskMethodNote(r){return r.method_note ?? r.internal_note ?? r.note ?? r.reason ?? ''}
function migrateRiskRecord(r){
  const out=Object.assign({}, r||{});
  if(out.note && !out.method_note && !out.specification){out.method_note=out.note; out.specification='';}
  if(out.reason && !out.method_note) out.method_note=out.reason;
  if(out.description && !out.method_note) out.method_note=out.description;
  return out;
}
function selectedTextations(target){return (state.case_textations||[]).filter(t=>!target || (t.targets||[]).includes(target));}
function textationContent(t){return t.text || t.body || t.content || '';}

function renderAll(){renderHeader();renderDashboard();renderCases();renderWorkspace();renderRiskModel();renderAdmin();}
function renderHeader(){
  const name=state.client?.name||'Není vybrán žádný případ'; $('stripTitle').textContent=state.id?`#${state.id} – ${name}`:name;
  $('stripMeta').textContent=state.id?`${state.activity?.name||'typ činnosti není vyplněn'} · stav: ${state.status}`:'Založte nebo otevřete obchodní případ.';
  $('caseTitle').textContent=state.client?.name||'Nový obchodní případ'; $('caseSubtitle').textContent=state.id?`CASE_ID #${state.id} · ${state.activity?.name||'typ činnosti není vyplněn'} · ${state.status}`:'Nový případ zatím není uložen v DB.'; $('readyScore').textContent=readiness()+'%';
}
function renderDashboard(){
  $('mCases').textContent=cases.length; $('mOpen').textContent=cases.filter(c=>!['uzavřeno','zrušeno','archiv'].includes(c.status)).length; $('mOffers').textContent=cases.reduce((a,c)=>a+(Number(c.offer_count)||0),0); $('mReady').textContent=readiness()+'%'; $('recentCases').innerHTML=cases.length?cases.slice(0,6).map(caseRow).join(''):'Zatím nejsou načtené žádné případy.';
}
function renderCases(){ $('casesList').innerHTML=cases.length?cases.map(caseRow).join(''):'Případy nejsou načtené. Klikněte na „Načíst případy“ nebo založte nový případ.'; }
function caseRow(c){return `<div class="case-row"><div><strong>${esc(c.client_name||c.title||'Bez názvu')}</strong><small>CASE_ID #${esc(c.id)} · ${esc(c.activity_name||'bez typu činnosti')} · ${esc(c.status||'rozpracováno')} · pojišťovny: ${esc(c.selected_insurer_count||0)} · nabídky: ${esc(c.offer_count||0)}</small></div><button class="btn primary" onclick="openCase(${Number(c.id)})">Otevřít</button></div>`}
function renderWorkspace(){state.selected_insurers=uniqueInsurerCodes(state.selected_insurers||[]);document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab)); const map={advisor:tabAdvisor,client:tabClient,insurance:tabInsurance,liability:tabLiability,risks:tabRisks,insurers:tabInsurers,attachments:tabAttachments,requests:tabInsurerRequests,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit}; $('tabContent').innerHTML=(map[currentTab]||tabClient)(); renderHeader();}
function readCurrentTab(){
  if(currentTab==='advisor'){
    ['name','email','phone','role','company','company_ico','note'].forEach(k=>{const el=$('adviser_'+k); if(el) state.adviser[k]=el.value});
  }
  if(currentTab==='client'){
    ['ico','name','legal_form','address','data_box','contact_person','contact_email','contact_phone','website','registered_office','billing_email'].forEach(k=>{const el=$('client_'+k); if(el) state.client[k]=el.value});
    ['name','email','phone','role'].forEach(k=>{const el=$('adviser_'+k); if(el) state.adviser[k]=el.value});
  }
  if(currentTab==='insurance'){
    ['name','code'].forEach(k=>{const el=$('activity_'+k); if(el) state.activity[k]=el.value});
    ['turnover','employees','territory','insurance_start','insurance_period','payment_frequency','export_info','main_activity_detail','side_activities','annual_revenue_breakdown','payroll','locations','property_description','security','claims_history','current_insurance','requested_scope','deductible_preference','special_notes','attachments_note'].forEach(k=>{const el=$('q_'+k); if(el) state.questionnaire[k]=el.value});
  }
  if(currentTab==='liability'){ /* data se zapisují průběžně přes onchange; zde záměrně bez duplicitního čtení */ }
  if(currentTab==='recommendation'){state.report.advisor_note=$('advisor_note')?.value||''; state.report.client_selected_offer=$('selected_offer')?.value||''; state.report.client_choice_reason=$('choice_reason')?.value||'';}
}
async function loadAres(){
  const ico=norm($('client_ico')?.value); if(!ico){toast('Nejdříve zadejte IČO.');return;}
  try{const d=await fetchJson(`/api/ares/${encodeURIComponent(ico)}`); state.client.ico=d.ico||ico; state.client.name=d.name||state.client.name; state.client.legal_form=d.legal_form||state.client.legal_form; state.client.address=d.address||state.client.address; state.client.data_box=d.data_box||state.client.data_box; renderWorkspace(); toast('Data z ARES byla načtena.');}
  catch(e){toast('ARES se nepodařilo načíst: '+e.message);}
}
async function searchClients(){
  const q=norm($('clientSearch')?.value); try{const d=await fetchJson('/api/clients?q='+encodeURIComponent(q)); clients=d.items||[]; renderWorkspace(); toast(clients.length?`Načteno klientů: ${clients.length}`:'V DB nebyl nalezen žádný klient.');}
  catch(e){toast('Klienty se nepodařilo načíst: '+e.message);}
}
function useClient(i){const c=clients[i]; if(!c)return; state.client=Object.assign(state.client,{ico:c.ico||'',name:c.name||'',legal_form:c.legal_form||'',address:c.address||'',data_box:c.data_box||'',contact_person:c.contact_person||'',contact_email:c.contact_email||'',contact_phone:c.contact_phone||'',website:c.website||''}); renderWorkspace(); toast('Klient načten do případu.');}

function tabAdvisor(){
  state.adviser = Object.assign({
    name:'Administrátor ASTORIE',
    email:'admin@astorie.local',
    phone:'',
    role:'Poradce / zpracovatel',
    company:'ASTORIE a.s.',
    company_ico:'48293776',
    note:''
  }, state.adviser||{});

  return `<p class="eyebrow">0. Karta poradce</p>
  <div class="advisor-hero">
    <div>
      <h2>Profesionální karta poradce</h2>
      <p>Poradce je navázán na aktuální obchodní případ, doporučení a klientský výstup. Společnost se uvádí pouze jako ASTORIE a.s., IČO 48293776.</p>
    </div>
    <div class="advisor-case-badge">CASE<br>${esc(state.id||'nový')}</div>
  </div>

  <div class="section-soft advisor-card">
    <p class="eyebrow">Identifikace poradce</p>
    <div class="grid2">
      <label>Společnost<input id="adviser_company" value="${esc(state.adviser.company||'ASTORIE a.s.')}" readonly></label>
      <label>IČO společnosti<input id="adviser_company_ico" value="${esc(state.adviser.company_ico||'48293776')}" readonly></label>
    </div>
    <div class="grid4">
      <label>Jméno poradce<input id="adviser_name" value="${esc(state.adviser.name)}" placeholder="Jméno poradce"></label>
      <label>E-mail poradce<input id="adviser_email" value="${esc(state.adviser.email)}" placeholder="E-mail poradce"></label>
      <label>Telefon<input id="adviser_phone" value="${esc(state.adviser.phone||'')}" placeholder="Telefon poradce"></label>
      <label>Role v případu<input id="adviser_role" value="${esc(state.adviser.role||'Poradce / zpracovatel')}" placeholder="Role v případu"></label>
    </div>
    <label>Poznámka poradce<textarea id="adviser_note" placeholder="Interní poznámka poradce, vazba na doporučení, klientský výstup, další postup...">${esc(state.adviser.note||'')}</textarea></label>
  </div>

  <div class="tools">
    <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu poradce</button>
    <button class="btn secondary" onclick="readCurrentTab();currentTab='client';renderWorkspace()">Pokračovat na kartu klienta</button>
  </div>`;
}

function tabAttachments(){
  state.documents = Array.isArray(state.documents) ? state.documents : [];
  return `<p class="eyebrow">6. Přílohy</p>
  <h2>Přílohy a povinné podklady</h2>
  <p class="muted">Přílohy jsou vázané na aktuální CASE_ID. Tato karta je připravena pro budoucí napojení na úložiště, nyní slouží jako kontrolní seznam podkladů.</p>
  <div class="grid2">
    <label class="form-card check-card"><input type="checkbox"> Plná moc</label>
    <label class="form-card check-card"><input type="checkbox"> Výpis z OR / evidence</label>
    <label class="form-card check-card"><input type="checkbox"> Škodní průběh</label>
    <label class="form-card check-card"><input type="checkbox"> Stávající pojistné smlouvy / nabídky</label>
  </div>
  <label>Další požadované přílohy / poznámka<textarea id="q_attachments_note" placeholder="Doplňující podklady, revize, fotodokumentace, technické zprávy...">${esc(state.questionnaire.attachments_note||'')}</textarea></label>
  <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit přílohy</button></div>`;
}

function tabClient(){
  const clientRows=clients.length?`<div class="client-results">${clients.map((c,i)=>`<div class="case-row"><div><strong>${esc(c.name)}</strong><small>IČO: ${esc(c.ico||'neuvedeno')} · ${esc(c.address||'')}</small></div><button class="btn secondary" onclick="useClient(${i})">Použít klienta</button></div>`).join('')}</div>`:'';
  return `<p class="eyebrow">1. Karta klienta</p><h2>Identifikace a kontakt klienta</h2><p class="muted">Tady je pouze obchodní a identifikační karta klienta. Odborné údaje pro pojištění jsou v samostatné záložce „Karta pro pojištění“.</p><div class="tools"><input id="clientSearch" class="grow" placeholder="Vyhledat klienta v DB podle názvu nebo IČO"><button class="btn secondary" onclick="searchClients()">Načíst klienta z DB</button></div>${clientRows}<div class="section-soft"><p class="eyebrow">Identifikace klienta</p><div class="grid3"><label>Název klienta<input id="client_name" value="${esc(state.client.name)}"></label><label>IČO<div class="inline-field"><input id="client_ico" value="${esc(state.client.ico)}"><button class="btn secondary small" onclick="loadAres()">ARES</button></div></label><label>Právní forma<input id="client_legal_form" value="${esc(state.client.legal_form)}"></label></div><label>Sídlo / adresa<input id="client_address" value="${esc(state.client.address)}"></label><div class="grid4"><label>Datová schránka<input id="client_data_box" value="${esc(state.client.data_box)}"></label><label>Kontaktní osoba<input id="client_contact_person" value="${esc(state.client.contact_person)}"></label><label>E-mail<input id="client_contact_email" value="${esc(state.client.contact_email)}"></label><label>Telefon<input id="client_contact_phone" value="${esc(state.client.contact_phone)}"></label></div><div class="grid3"><label>Web<input id="client_website" value="${esc(state.client.website)}"></label><label>Fakturační / obecný e-mail<input id="client_billing_email" value="${esc(state.client.billing_email)}"></label><label>Další adresa / poznámka<input id="client_registered_office" value="${esc(state.client.registered_office)}"></label></div><div class="grid2"><label>Poradce<input id="adviser_name" value="${esc(state.adviser.name)}"></label><label>E-mail poradce<input id="adviser_email" value="${esc(state.adviser.email)}"></label></div></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu klienta</button><button class="btn secondary" onclick="readCurrentTab();currentTab='insurance';renderWorkspace()">Pokračovat na kartu pro pojištění</button></div>`;
}
function tabInsurance(){ return caseInsuranceCard(); }


const LIABILITY_RISKS = [
  ['provoz','Provozní odpovědnost','10 000 000 Kč','Základní krytí škod způsobených provozní činností.'],
  ['vadna_prace','Vadná práce po předání','5 000 000 Kč','Vada práce projevená po dokončení a předání.'],
  ['vyrobek','Odpovědnost za výrobek','10 000 000 Kč','Škoda způsobená vadou výrobku po dodání.'],
  ['prevzate_veci','Věci převzaté','2 000 000 Kč','Cizí věci převzaté za účelem provedení činnosti.'],
  ['uzivane_veci','Věci užívané','1 000 000 Kč','Cizí věci užívané klientem, nájem, vypůjčení.'],
  ['cista_financni_skoda','Čistá finanční škoda','1 000 000 Kč','Finanční škoda bez škody na věci nebo zdraví.'],
  ['krizova_odpovednost','Křížová odpovědnost','5 000 000 Kč','Škody mezi pojištěnými osobami v rámci projektu/skupiny.'],
  ['subdodavatele','Subdodavatelé','dle hlavního limitu','Rozšíření na škody způsobené subdodavateli.'],
  ['regresy','Regresy zdravotních pojišťoven a dávek','dle hlavního limitu','Regresní nároky zdravotních pojišťoven a orgánů.'],
  ['pronajate_prostory','Škody na pronajatých prostorách','1 000 000 Kč','Škody na pronajatých nebo užívaných nemovitostech.'],
  ['veci_odlozene','Věci odložené / vnesené','500 000 Kč','Věci klientů nebo třetích osob odložené v provozovně.'],
  ['demontaz_montaz','Demontáž a montáž vadného výrobku','1 000 000 Kč','Náklady spojené s demontáží/montáží při vadě výrobku/práce.'],
  ['stazeni_vyrobku','Stažení výrobku z trhu','1 000 000 Kč','Náklady na stažení vadného výrobku.'],
  ['spojeni_smisení','Spojení, smísení, další zpracování','5 000 000 Kč','B2B výrobní riziko při začlenění vadné věci.'],
  ['nemajetkova_ujma','Nemajetková újma','dle hlavního limitu','Nemajetková újma související s pojištěnou činností.'],
  ['zivotni_prostredi','Škody na životním prostředí','1 000 000 Kč','Odpovědnost za náhlé a nahodilé znečištění.'],
  ['smluvni_odpovednost','Smluvně převzatá odpovědnost','ověřit','Požadavky ze smluv s odběrateli/investory.'],
  ['usa_kanada','Územní rozsah USA/Kanada','ověřit','Nutno výslovně ověřit územní platnost a výluky.']
];
const LIABILITY_AGREEMENTS = [
  ['Rozšíření vadné práce po předání','U stavebních, montážních a servisních činností výslovně požadovat.'],
  ['Rozšíření odpovědnosti za výrobek','U výrobních a obchodních činností ověřit rozsah a výluky.'],
  ['Křížová odpovědnost','Požadovat u projektů, skupin firem a více pojištěných osob.'],
  ['Subdodavatelé','Ověřit, zda pojistitel kryje škody způsobené subdodavateli.'],
  ['Čisté finanční škody','Ověřit samostatný sublimit a výluky.'],
  ['Věci převzaté / užívané','Požadovat samostatné sublimity a jasný rozsah krytí.'],
  ['Regresy zdravotních pojišťoven','Ověřit včetně dávek nemocenského pojištění, pokud relevantní.'],
  ['Demontáž a montáž','Důležité u výrobků a prací zabudovaných do jiné věci.'],
  ['Stažení výrobku z trhu','Ověřit podmínky, náklady a samostatný limit.'],
  ['Smluvní odpovědnost','Ověřit, zda pojistitel akceptuje smluvně převzaté závazky.'],
  ['Územní rozsah a export','Výslovně uvést EU / mimo EU / USA / Kanada.'],
  ['Výluky a VPP/DPP/ZPP','Požadovat uvedení článků VPP/DPP/ZPP k zásadním výlukám.']
];
function addLiabilityRisk(key,name,limit,note){
  if(state.risks.some(r=>String(r.risk_key)===String(key))){toast('Riziko už je v poptávce.');return;}
  state.risks.push({risk_key:key,name:name,requested_limit:limit||'',deductible:'',note:note||''}); renderWorkspace();
}
function addAllLiabilityRisks(){ LIABILITY_RISKS.forEach(r=>{ if(!state.risks.some(x=>x.risk_key===r[0])) state.risks.push({risk_key:r[0],name:r[1],requested_limit:r[2],deductible:'',note:r[3]}); }); renderWorkspace(); toast('Doplněna profesionální sada rizik odpovědnosti.'); }
function addLiabilityAgreement(title,text){ state.liability_agreements ||= []; state.liability_agreements.push({title,limit:'',text}); renderWorkspace(); }
function addAllLiabilityAgreements(){ state.liability_agreements ||= []; LIABILITY_AGREEMENTS.forEach(a=>{ if(!state.liability_agreements.some(x=>x.title===a[0])) state.liability_agreements.push({title:a[0],limit:'',text:a[1]}); }); renderWorkspace(); toast('Doplněna sada zvláštních ujednání odpovědnosti.'); }
function addCustomLiabilityAgreement(){ state.liability_agreements ||= []; state.liability_agreements.push({title:'Vlastní zvláštní ujednání',limit:'',text:''}); renderWorkspace(); }
function removeLiabilityAgreement(i){ state.liability_agreements.splice(i,1); renderWorkspace(); }
function liabilitySelectedSet(){ return new Set((state.risks||[]).map(r=>String(r.risk_key))); }
function tabLiability(){
  const selected=liabilitySelectedSet();
  const riskCards=LIABILITY_RISKS.map(r=>`<button class="chip ${selected.has(r[0])?'selected':''}" onclick="addLiabilityRisk('${esc(r[0])}','${esc(r[1])}','${esc(r[2])}','${esc(r[3])}')">+ ${esc(r[1])}</button>`).join('');
  const agre=(state.liability_agreements||[]).map((a,i)=>`<tr><td><input value="${esc(a.title)}" onchange="state.liability_agreements[${i}].title=this.value"></td><td><input value="${esc(a.limit||'')}" onchange="state.liability_agreements[${i}].limit=this.value" placeholder="limit / sublimit"></td><td><textarea onchange="state.liability_agreements[${i}].text=this.value">${esc(a.text||'')}</textarea></td><td><button class="btn danger" onclick="removeLiabilityAgreement(${i})">Smazat</button></td></tr>`).join('');
  const chosen=(state.risks||[]).filter(r=>LIABILITY_RISKS.some(x=>x[0]===r.risk_key)||String(r.risk_key||'').startsWith('CUSTOM'));
  return `<p class="eyebrow">3. Modul pojištění odpovědnosti PROFI</p><h2>Rizika a zvláštní ujednání odpovědnosti</h2><p class="muted">Modul přebírá profesionální katalog rizik odpovědnosti a zároveň ponechává poradci možnost doplnit vlastní riziko nebo zvláštní ujednání. Zdroj dat je stále jeden CASE_ID.</p>
  <div class="section-soft"><div class="section-head"><div><h3>Katalog rizik odpovědnosti</h3><p class="muted">Vyberte konkrétní rizika, která mají být součástí poptávky. Již vybraná rizika jsou zvýrazněna.</p></div><button class="btn primary" onclick="addAllLiabilityRisks()">+ Přidat celou sadu</button></div><div class="chip-row">${riskCards}</div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Vybraná rizika odpovědnosti</h3><p class="muted">Limity, spoluúčasti a poznámky se dále používají v poptávce pojišťovnám, nabídkách i porovnání.</p></div><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Poznámka</th><th></th></tr></thead><tbody>${chosen.length?chosen.map((r,i)=>{const idx=state.risks.indexOf(r);return `<tr><td><input value="${esc(r.risk_key)}" onchange="state.risks[${idx}].risk_key=this.value"></td><td><input value="${esc(r.name)}" onchange="state.risks[${idx}].name=this.value"></td><td><input value="${esc(r.requested_limit||'')}" onchange="state.risks[${idx}].requested_limit=this.value"></td><td><input value="${esc(r.deductible||'')}" onchange="state.risks[${idx}].deductible=this.value"></td><td><input value="${esc(r.note||'')}" onchange="state.risks[${idx}].note=this.value"></td><td><button class="btn danger" onclick="removeRisk(${idx})">Smazat</button></td></tr>`}).join(''):'<tr><td colspan="6" class="muted">Zatím není vybrané žádné riziko odpovědnosti.</td></tr>'}</tbody></table></div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Zvláštní ujednání a doložky</h3><p class="muted">Tato část se přenáší do poptávky pojišťovnám a slouží i jako podklad pro kontrolu nabídky.</p></div><div class="tools"><button class="btn secondary" onclick="addAllLiabilityAgreements()">+ Doporučená ujednání</button><button class="btn secondary" onclick="addCustomLiabilityAgreement()">+ Vlastní ujednání</button></div></div><div class="table-wrap"><table><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Poznámka / požadavek</th><th></th></tr></thead><tbody>${agre||'<tr><td colspan="4" class="muted">Zatím nejsou doplněna žádná zvláštní ujednání.</td></tr>'}</tbody></table></div></div>
  <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit modul odpovědnosti</button><button class="btn secondary" onclick="currentTab='risks';renderWorkspace()">Přejít na obecná rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}

function tabRisks(){
  const options=riskOptions();
  const suggested = suggestedRisks();
  return `<p class="eyebrow">2. Rizika a požadavky klienta</p><h2>Vstupní dotazník rizik</h2><p class="muted">Toto je odborná část poptávky. Každé riziko musí mít risk_key, požadovaný limit a poznámku k rozsahu. Z těchto dat se skládají nabídky i porovnání.</p><div class="section-soft"><h3>Doporučená rizika podle činnosti</h3>${suggested.length?`<div class="chip-row">${suggested.map(r=>`<button class="chip" onclick="addRiskByKey('${esc(r.risk_key)}')">+ ${esc(r.risk_name||r.name||r.risk_key)}</button>`).join('')}</div>`:'<div class="info-box">Vyplňte typ činnosti na kartě klienta nebo použijte ruční výběr z knihovny rizik.</div>'}</div><div class="tools"><select id="addRiskSelect"><option value="">Vyberte riziko z knihovny</option>${options}</select><button class="btn primary" onclick="addRiskFromSelect()">+ Přidat riziko</button><button class="btn secondary" onclick="addDefaultRisks()">+ Doporučená sada</button><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název rizika</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Poznámka / požadavek</th><th></th></tr></thead><tbody>${state.risks.map((r,i)=>`<tr><td><input onchange="state.risks[${i}].risk_key=this.value" value="${esc(r.risk_key||r.key)}"></td><td><input onchange="state.risks[${i}].name=this.value" value="${esc(r.name||r.label)}"></td><td><input onchange="state.risks[${i}].requested_limit=this.value" value="${esc(r.requested_limit||r.limit)}"></td><td><input onchange="state.risks[${i}].deductible=this.value" value="${esc(r.deductible||'')}"></td><td><input onchange="state.risks[${i}].note=this.value" value="${esc(r.note||r.reason||'')}"></td><td><button class="btn danger" onclick="removeRisk(${i})">Smazat</button></td></tr>`).join('')||'<tr><td colspan="6" class="muted">Zatím není doplněné žádné riziko.</td></tr>'}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function suggestedRisks(){
  const code=norm(state.activity.code).toLowerCase(); const name=norm(state.activity.name).toLowerCase();
  let rows=(CATALOG.riskModel||[]).filter(r=>String(r.activity_code||'').toLowerCase()===code || String(r.activity_name||'').toLowerCase()===name);
  if(!rows.length && code) rows=(CATALOG.riskModel||[]).filter(r=>String(r.activity_code||'').toLowerCase().includes(code));
  return rows.slice(0,12).map(r=>({risk_key:r.risk_key||r.risk_id||r.key||`${r.activity_code||'risk'}_${r.risk_id||r.risk_name||''}`, risk_name:r.risk_name||r.name, recommended_limit:r.recommended_limit||r.min_limit||'', note:r.recommendation_text||r.warning_text||''}));
}
function addRiskByKey(key){
  if(!key) return;
  if(state.risks.some(r=>String(r.risk_key)===String(key))){toast('Riziko už je v poptávce.');return;}
  const cat=riskByKey(key); const model=suggestedRisks().find(r=>r.risk_key===key)||{};
  state.risks.push({risk_key:key,name:model.risk_name||riskName(cat)||key,requested_limit:model.recommended_limit||cat.limit||'',deductible:'',note:model.note||cat.reason||cat.description||''});
  renderWorkspace();
}
function addDefaultRisks(){ const arr=suggestedRisks(); if(!arr.length){toast('Pro tuto činnost není připravená doporučená sada.');return;} arr.forEach(r=>{if(!state.risks.some(x=>x.risk_key===r.risk_key)) state.risks.push({risk_key:r.risk_key,name:r.risk_name,requested_limit:r.recommended_limit||'',deductible:'',note:r.note||''});}); renderWorkspace(); }
function addRiskFromSelect(){const key=$('addRiskSelect').value;if(!key)return;addRiskByKey(key);}
function addCustomRisk(){state.risks.push({risk_key:'CUSTOM_'+(state.risks.length+1),name:'Vlastní riziko',requested_limit:'',deductible:'',note:''});renderWorkspace();}
function removeRisk(i){state.risks.splice(i,1);renderWorkspace();}
function tabInsurers(){const list=(CATALOG.insurers||[]).map(ins=>{const code=insurerCode(ins);const checked=state.selected_insurers.includes(code)?'checked':'';return `<label class="form-card check-card"><input type="checkbox" ${checked} onchange="toggleInsurer('${esc(code)}',this.checked)"> <b>${esc(code)}</b><br>${esc(ins.name||code)}<br><span class="muted">${esc(ins.email||ins.request_email||'e-mail není doplněn')}</span></label>`}).join(''); return `<p class="eyebrow">3. Pojišťovny v poptávce</p><h2>Komu se bude poptávka posílat</h2><div class="grid3">${list||'<div class="empty">V číselníku nejsou pojišťovny.</div>'}</div><div class="tools"><button class="btn secondary" onclick="addManualInsurer()">+ Pojišťovna mimo seznam</button><button class="btn primary" onclick="currentTab='requests';renderWorkspace()">Pokračovat na poptávky pojišťovnám</button></div>`;}
function toggleInsurer(code,on){if(on&&!state.selected_insurers.includes(code))state.selected_insurers.push(code); if(!on)state.selected_insurers=state.selected_insurers.filter(x=>x!==code); state.selected_insurers=uniqueInsurerCodes(state.selected_insurers); renderHeader();}
function addManualInsurer(){const code=prompt('Zkratka pojišťovny mimo seznam:'); if(code&&!state.selected_insurers.includes(code)){state.selected_insurers.push(code);state.selected_insurers=uniqueInsurerCodes(state.selected_insurers);renderWorkspace();}}
function ensureOffer(code){state.offers[code] ||= {premium:'',deductible:'',valid_until:'',note:'',risks:{}}; return state.offers[code];}

function ensureInsurerRequest(code){
  state.insurer_requests ||= {};
  state.insurer_requests[code] ||= {status:'připraveno',sent_at:'',subject:'',email_note:'',internal_note:''};
  return state.insurer_requests[code];
}
function requestSubject(code){return `Poptávka pojištění podnikatelských rizik – ${state.client.name||'klient'} – ${code}`}
function selectedInsurerRows(){return selectedInsurerCodes().map(code=>{const ins=insurerByCode(code); const req=ensureInsurerRequest(code); return {code, ins, req};});}
function requestCompleteness(){
  const missing=[]; if(!state.client.name) missing.push('klient'); if(!state.risks.length) missing.push('rizika'); if(!state.selected_insurers.length) missing.push('pojišťovny');
  return missing;
}
function tabInsurerRequests(){
  const missing=requestCompleteness();
  if(missing.length) return `<p class="eyebrow">5. Poptávky pojišťovnám</p><h2>Nejdříve doplňte povinné části</h2><div class="info-box">Pro generování poptávek chybí: ${esc(missing.join(', '))}.</div>`;
  const cards=selectedInsurerRows().map(({code,ins,req})=>`<div class="request-card"><div class="section-head"><div><p class="eyebrow">Pojišťovna</p><h2>${esc(ins.name||code)}</h2><p class="muted"><b>${esc(code)}</b> · ${esc(ins.email||ins.request_email||'e-mail není doplněn')}</p></div><span class="badge">${esc(req.status||'připraveno')}</span></div><div class="grid3"><label>Předmět e-mailu<input value="${esc(req.subject||requestSubject(code))}" onchange="ensureInsurerRequest('${esc(code)}').subject=this.value"></label><label>Stav poptávky<select onchange="ensureInsurerRequest('${esc(code)}').status=this.value"><option ${req.status==='připraveno'?'selected':''}>připraveno</option><option ${req.status==='odesláno'?'selected':''}>odesláno</option><option ${req.status==='čekáme na nabídku'?'selected':''}>čekáme na nabídku</option><option ${req.status==='nabídka přijata'?'selected':''}>nabídka přijata</option></select></label><label>Datum odeslání<input type="date" value="${esc(req.sent_at||'')}" onchange="ensureInsurerRequest('${esc(code)}').sent_at=this.value"></label></div><label>Doprovodný text pro pojišťovnu<textarea onchange="ensureInsurerRequest('${esc(code)}').email_note=this.value" placeholder="Krátká poznámka k poptávce, termín pro nabídku, specifika komunikace...">${esc(req.email_note||defaultEmailNote(code))}</textarea></label><div class="tools"><button class="btn primary" onclick="printInsurerRequest('${esc(code)}')">PDF / tisk poptávky</button><button class="btn secondary" onclick="exportInsurerRequestExcel('${esc(code)}')">Excel pro pojišťovnu</button><button class="btn secondary" onclick="copyInsurerEmail('${esc(code)}')">Kopírovat e-mail</button><button class="btn ghost" onclick="ensureInsurerRequest('${esc(code)}').status='odesláno';ensureInsurerRequest('${esc(code)}').sent_at=new Date().toISOString().slice(0,10);readCurrentTab();saveCase()">Označit jako odesláno</button></div></div>`).join('');
  return `<p class="eyebrow">5. Samostatné poptávky pojišťovnám</p><h2>Generování poptávky pro každou pojišťovnu zvlášť</h2><p class="muted">Poradce zde připraví podklad pro konkrétní pojišťovnu. Data se berou z jedné karty případu: klient, karta pro pojištění, rizika a vybrané přílohy. Nabídky se následně zapisují až v další společné tabulce.</p><div class="warning"><b>Důležité:</b> pro každou pojišťovnu vzniká samostatný výstup, ale zdroj dat zůstává jeden CASE_ID. Nevznikají duplicitní požadavky ani limity.</div>${cards}<div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit stav poptávek</button><button class="btn secondary" onclick="currentTab='offers';renderWorkspace()">Pokračovat na nabídky</button></div>`;
}
function defaultEmailNote(code){return `Dobrý den,\n\nprosíme o zpracování nabídky pojištění podnikatelských rizik dle přiložené poptávky pro klienta ${state.client.name||''}.\n\nV případě potřeby doplnění podkladů nás prosím kontaktujte.\n\nDěkujeme.\nASTORIE a.s.`}
function requestDataRows(){
  const q=state.questionnaire||{}; const c=state.client||{};
  const rows=[['Klient',c.name],['IČO',c.ico],['Adresa',c.address],['Kontaktní osoba',c.contact_person],['E-mail',c.contact_email],['Telefon',c.contact_phone],['Typ činnosti',state.activity?.name],['Detail činnosti',q.main_activity_detail],['Vedlejší činnosti',q.side_activities],['Obrat',q.turnover],['Zaměstnanci',q.employees],['Území',q.territory],['Počátek pojištění',q.insurance_start],['Pojistné období',q.insurance_period],['Frekvence placení',q.payment_frequency],['Export / zahraničí',q.annual_revenue_breakdown||q.export_info],['Provozovny',q.locations],['Popis majetku',q.property_description],['Zabezpečení',q.security],['Škodní průběh',q.claims_history],['Současné pojištění',q.current_insurance],['Požadovaný rozsah',q.requested_scope],['Preferovaná spoluúčast',q.deductible_preference],['Speciální poznámka',q.special_notes],['Přílohy / podklady',q.attachments_note]];
  return rows.filter(r=>norm(r[1]));
}
function liabilityAgreementRows(){ return (state.liability_agreements||[]).filter(a=>norm(a.title)||norm(a.text)); }
function insurerRequestHtml(code, forPrint=false){
  const ins=insurerByCode(code); const req=ensureInsurerRequest(code); const rows=requestDataRows();
  const risks=(state.risks||[]).map(r=>`<tr><td>${esc(r.risk_key||'')}</td><td>${esc(r.name||'')}</td><td>${esc(r.requested_limit||'')}</td><td>${esc(r.deductible||'')}</td><td>${esc(r.note||'')}</td></tr>`).join('');
  const agreements=liabilityAgreementRows().map(a=>`<tr><td>${esc(a.title||'')}</td><td>${esc(a.limit||'')}</td><td>${esc(a.text||'')}</td></tr>`).join('');
  return `<div class="request-print"><div class="print-head"><div><h1>ASTORIE a.s.</h1><p>Poptávka pojištění podnikatelských rizik</p></div><div><b>${esc(ins.name||code)}</b><br>${esc(code)}<br>${esc(ins.email||ins.request_email||'')}</div></div><h2>${esc(state.client.name||'Klient')}</h2><p><b>CASE_ID:</b> ${esc(state.id||'nový případ')} · <b>Poradce:</b> ${esc(state.adviser?.name||'')} · <b>Datum:</b> ${new Date().toLocaleDateString('cs-CZ')}</p><h3>Základní údaje pro pojištění</h3><table>${rows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table><h3>Požadovaná rizika a limity</h3><table><thead><tr><th>Risk key</th><th>Riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Poznámka</th></tr></thead><tbody>${risks||'<tr><td colspan="5">Rizika nejsou doplněna.</td></tr>'}</tbody></table><h3>Zvláštní ujednání / požadované doložky odpovědnosti</h3><table><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Poznámka</th></tr></thead><tbody>${agreements||'<tr><td colspan="3">Zvláštní ujednání nejsou doplněna.</td></tr>'}</tbody></table><h3>Doprovodná poznámka</h3><p>${esc(req.email_note||defaultEmailNote(code)).replace(/\n/g,'<br>')}</p><p class="muted"></p></div>`;
}
function printInsurerRequest(code){
  readCurrentTab();
  const w=window.open('', '_blank');
  if(!w){toast('Prohlížeč zablokoval otevření tisku.');return;}
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(requestSubject(code))}</title><style>body{font-family:Arial,sans-serif;color:#073E4A;margin:30px}.print-head{display:flex;justify-content:space-between;gap:20px;border-bottom:4px solid #FC4C02;padding-bottom:18px;margin-bottom:20px}h1{letter-spacing:8px;margin:0;color:#003D4C}h2,h3{color:#003D4C}table{border-collapse:collapse;width:100%;margin:12px 0 22px}th{background:#003D4C;color:white;text-align:left}th,td{border:1px solid #D7E8EC;padding:9px;vertical-align:top}.muted{color:#607783}@media print{button{display:none}}</style></head><body>${insurerRequestHtml(code,true)}<button onclick="window.print()">Tisk / uložit jako PDF</button></body></html>`);
  w.document.close();
}
function exportInsurerRequestExcel(code){
  readCurrentTab();
  const html=`<html><head><meta charset="utf-8"></head><body>${insurerRequestHtml(code,false)}</body></html>`;
  const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`poptavka_${safeFile(state.client.name)}_${safeFile(code)}.xls`; document.body.appendChild(a); a.click(); const href=a.href; a.remove(); setTimeout(()=>URL.revokeObjectURL(href),500); toast('Excel poptávky byl připraven.');
}
function safeFile(v){return String(v||'klient').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,80)||'poptavka'}
function copyInsurerEmail(code){
  const req=ensureInsurerRequest(code); const txt=`${req.subject||requestSubject(code)}\n\n${req.email_note||defaultEmailNote(code)}\n\nSoučástí poptávky jsou požadovaná rizika a limity z případu CASE_ID ${state.id||'nový případ'}.`;
  navigator.clipboard?.writeText(txt); toast('Text e-mailu pro pojišťovnu zkopírován.');
}

function tabOffers(){if(!selectedInsurerCodes().length)return `<p class="eyebrow">6. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven v kroku 3.</div>`; if(!state.risks.length)return `<p class="eyebrow">6. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v kroku 2.</div>`; const heads=selectedInsurerCodes().map(code=>`<th class="offer-head">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div><input placeholder="Pojistné" onchange="ensureOffer('${esc(code)}').premium=this.value" value="${esc(ensureOffer(code).premium)}"><input placeholder="Platnost nabídky" onchange="ensureOffer('${esc(code)}').valid_until=this.value" value="${esc(ensureOffer(code).valid_until)}"><input placeholder="Celková spoluúčast / pozn." onchange="ensureOffer('${esc(code)}').deductible=this.value" value="${esc(ensureOffer(code).deductible)}"></th>`).join(''); const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br><span class="badge">${esc(r.risk_key)}</span><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||'není uvedena')}</td>${selectedInsurerCodes().map(code=>offerCell(code,r,i)).join('')}</tr>`).join(''); return `<p class="eyebrow">6. Nabídky v jedné tabulce</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Toto je hlavní pracovní tabulka. Poradce vidí vedle sebe, co bylo poptáno a co nabídla každá pojišťovna.</p><div class="table-wrap"><table><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button><button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button></div>`;}
function offerCell(code,r,i){const k=r.risk_key||riskKey(r);const o=ensureOffer(code);o.risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};const x=o.risks[k];return `<td><select onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].status=this.value"><option ${x.status==='splněno'?'selected':''}>splněno</option><option ${x.status==='omezeno'?'selected':''}>omezeno</option><option ${x.status==='výluka'?'selected':''}>výluka</option><option ${x.status==='nutno ověřit'?'selected':''}>nutno ověřit</option></select><input placeholder="Nabídnutý limit" value="${esc(x.offered_limit)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].offered_limit=this.value"><input placeholder="Spoluúčast" value="${esc(x.deductible)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].deductible=this.value"><textarea placeholder="Výluky / sublimity / zdroj VPP" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].note=this.value">${esc(x.note)}</textarea></td>`}
function tabComparison(){if(!state.selected_insurers.length||!state.risks.length)return `<p class="eyebrow">5. Porovnání</p><h2>Porovnání zatím nelze sestavit</h2><div class="info-box">Nejdříve doplňte rizika, pojišťovny a nabídky.</div>`; const rows=state.risks.map(r=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>${esc(r.requested_limit||'limit neuveden')}</td>${state.selected_insurers.map(code=>{const x=ensureOffer(code).risks[r.risk_key]||{};return `<td><b>${esc(x.status||'nutno ověřit')}</b><br>Limit: ${esc(x.offered_limit||'–')}<br>Spoluúčast: ${esc(x.deductible||'–')}<br>${esc(x.note||'')}</td>`}).join('')}</tr>`).join('');return `<p class="eyebrow">7. Makléřské porovnání</p><h2>Rozdíly mezi nabídkami</h2><div class="warning">Systém pouze zvýrazňuje rozdíly. Doporučení potvrzuje výhradně poradce.</div><div class="table-wrap"><table><thead><tr><th>Riziko / požadavek</th>${state.selected_insurers.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;}
function tabRecommendation(){return `<p class="eyebrow">8. Doporučení poradce</p><h2>Doporučení nevytváří AI automaticky</h2><label>Doporučená varianta<select id="selected_offer"><option value="">Není potvrzeno</option>${selectedInsurerCodes().map(c=>`<option value="${esc(c)}" ${state.report.client_selected_offer===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Odůvodnění poradce<textarea id="choice_reason">${esc(state.report.client_choice_reason)}</textarea></label><label>Poznámka poradce<textarea id="advisor_note">${esc(state.report.advisor_note)}</textarea></label><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit doporučení</button></div>`}
function tabOutput(){return `<p class="eyebrow">9. Klientský výstup</p><h2>Podklad pro klientský report</h2><div class="info-box"><b>Klient:</b> ${esc(state.client.name||'není vyplněn')}<br><b>Doporučení poradce:</b> ${esc(state.report.client_selected_offer||'není potvrzeno')}<br><b>Počet nabídek:</b> ${offerCount()}<br><b>Počet rizik:</b> ${state.risks.length}</div><p class="muted">PDF engine bude navázán v další fázi nad tímto jediným zdrojem dat.</p>`}
function tabAudit(){const warnings=[];if(!state.client.name)warnings.push('Chybí klient.');if(!state.risks.length)warnings.push('Chybí rizika.');if(!state.selected_insurers.length)warnings.push('Nejsou vybrány pojišťovny.');if(!offerCount())warnings.push('Nejsou vloženy nabídky.');if(!state.report.client_selected_offer)warnings.push('Není potvrzeno doporučení poradce.');return `<p class="eyebrow">10. Kontrola případu</p><h2>Provozní kontrola</h2>${warnings.length?warnings.map(w=>`<div class="warning">${esc(w)}</div>`).join(''):'<div class="info-box">Případ je provozně kompletní.</div>'}`}
function renderRiskModel(){const risks=CATALOG.risks||[];$('riskModelBox').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název</th></tr></thead><tbody>${risks.map(r=>`<tr><td><b>${esc(riskKey(r))}</b></td><td>${esc(riskName(r))}</td></tr>`).join('')}</tbody></table></div>`}
function renderAdmin(){
  const ins=CATALOG.insurers||[]; const risks=CATALOG.risks||[]; const acts=CATALOG.activities||[]; const texts=CATALOG.textTemplates||[];
  $('adminBox').innerHTML=`<div class="metric-grid"><div><b>${ins.length}</b><span>pojišťoven</span></div><div><b>${risks.length}</b><span>rizik</span></div><div><b>${acts.length}</b><span>činností</span></div><div><b>${texts.length}</b><span>textací</span></div></div><div class="admin-tabs"><button class="chip active" onclick="adminPanel('insurers')">Pojišťovny</button><button class="chip" onclick="adminPanel('advisers')">Poradci</button><button class="chip" onclick="adminPanel('activities')">Typy klientů / činnosti</button><button class="chip" onclick="adminPanel('risks')">Rizika</button><button class="chip" onclick="adminPanel('riskModel')">Rizikový model</button><button class="chip" onclick="adminPanel('texts')">Textace</button><button class="chip" onclick="adminPanel('documents')">Dokumenty</button><button class="chip" onclick="adminPanel('json')">Import / export JSON</button></div><div id="adminPanel"></div>`;
  adminPanel('insurers');
}
function adminPanel(type){
  document.querySelectorAll('.admin-tabs .chip').forEach(b=>b.classList.remove('active'));
  const box=$('adminPanel'); if(!box) return;
  if(type==='insurers') box.innerHTML=`<h2>Pojišťovny v číselníku</h2><p class="muted">Správa pojišťoven pro výběr v poptávce. Zachováno z původního Adminu v provozním zobrazení.</p><div class="table-wrap"><table><thead><tr><th>ID / zkratka</th><th>Název</th><th>E-mail pro poptávky</th><th>Portál</th><th>Aktivní</th></tr></thead><tbody>${(CATALOG.insurers||[]).map((i,idx)=>`<tr><td><input onchange="CATALOG.insurers[${idx}].code=this.value;CATALOG.insurers[${idx}].short=this.value" value="${esc(insurerCode(i)||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].name=this.value" value="${esc(i.name||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].email=this.value;CATALOG.insurers[${idx}].request_email=this.value" value="${esc(i.email||i.request_email||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].portal=this.value" value="${esc(i.portal||i.url||'')}"></td><td><select onchange="CATALOG.insurers[${idx}].active=this.value==='ano'"><option ${i.active!==false?'selected':''}>ano</option><option ${i.active===false?'selected':''}>ne</option></select></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.insurers.push({code:'',short:'',name:'',email:'',request_email:'',portal:'',active:true});adminPanel('insurers')">+ Přidat pojišťovnu</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='advisers') box.innerHTML=`<h2>Poradci</h2><p class="muted">Základní seznam poradců pro budoucí role a workflow.</p><div class="table-wrap"><table><thead><tr><th>Jméno</th><th>E-mail</th><th>Role</th><th>Společnost</th></tr></thead><tbody>${(CATALOG.advisers||[]).map((a,idx)=>`<tr><td><input onchange="CATALOG.advisers[${idx}].name=this.value" value="${esc(a.name||'')}"></td><td><input onchange="CATALOG.advisers[${idx}].email=this.value" value="${esc(a.email||'')}"></td><td><input onchange="CATALOG.advisers[${idx}].role=this.value" value="${esc(a.role||'advisor')}"></td><td><input onchange="CATALOG.advisers[${idx}].company=this.value" value="${esc(a.company||'ASTORIE a.s.')}"></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.advisers=(CATALOG.advisers||[]);CATALOG.advisers.push({name:'Nový poradce',email:'',role:'advisor',company:'ASTORIE a.s.'});adminPanel('advisers')">+ Přidat poradce</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='activities') box.innerHTML=`<h2>Typy klientů / činností</h2><div class="table-wrap"><table><thead><tr><th>Kód</th><th>Název</th><th>Popis</th></tr></thead><tbody>${(CATALOG.activities||[]).map((a,idx)=>`<tr><td><input onchange="CATALOG.activities[${idx}].code=this.value" value="${esc(a.code||a.id||a.activity_code||'')}"></td><td><input onchange="CATALOG.activities[${idx}].name=this.value" value="${esc(a.name||a.activity_name||'')}"></td><td><input onchange="CATALOG.activities[${idx}].description=this.value" value="${esc(a.description||'')}"></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.activities.push({code:'',name:'',description:''});adminPanel('activities')">+ Přidat činnost</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='risks') box.innerHTML=`<h2>Knihovna rizik</h2><p class="muted">Každé riziko musí mít jednoznačný risk_key. Bez risk_key se nesmí dostat do nabídky ani porovnání.</p><div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název</th><th>Skupina</th><th>Výchozí limit</th><th>Popis</th></tr></thead><tbody>${(CATALOG.risks||[]).map((r,idx)=>`<tr><td><input onchange="CATALOG.risks[${idx}].risk_key=this.value;CATALOG.risks[${idx}].key=this.value" value="${esc(riskKey(r))}"></td><td><input onchange="CATALOG.risks[${idx}].name=this.value" value="${esc(riskName(r))}"></td><td><input onchange="CATALOG.risks[${idx}].group=this.value" value="${esc(r.group||'')}"></td><td><input onchange="CATALOG.risks[${idx}].limit=this.value" value="${esc(r.limit||'')}"></td><td><textarea onchange="CATALOG.risks[${idx}].description=this.value">${esc(r.description||r.reason||'')}</textarea></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.risks.push({risk_key:'',key:'',name:'',group:'',limit:'',description:''});adminPanel('risks')">+ Přidat riziko</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='riskModel') box.innerHTML=`<h2>Rizikový model</h2><p class="muted">Mapování typů činností na doporučená rizika. Toto řídí tlačítko „Doporučená sada“ ve vstupním dotazníku.</p><div class="table-wrap"><table><thead><tr><th>Kód činnosti</th><th>Název činnosti</th><th>Risk key</th><th>Název rizika</th><th>Doporučený limit</th><th>Poznámka</th></tr></thead><tbody>${(CATALOG.riskModel||[]).map((r,idx)=>`<tr><td><input onchange="CATALOG.riskModel[${idx}].activity_code=this.value" value="${esc(r.activity_code||'')}"></td><td><input onchange="CATALOG.riskModel[${idx}].activity_name=this.value" value="${esc(r.activity_name||'')}"></td><td><input onchange="CATALOG.riskModel[${idx}].risk_key=this.value" value="${esc(r.risk_key||r.risk_id||'')}"></td><td><input onchange="CATALOG.riskModel[${idx}].risk_name=this.value" value="${esc(r.risk_name||r.name||'')}"></td><td><input onchange="CATALOG.riskModel[${idx}].recommended_limit=this.value" value="${esc(r.recommended_limit||r.min_limit||'')}"></td><td><textarea onchange="CATALOG.riskModel[${idx}].recommendation_text=this.value">${esc(r.recommendation_text||r.warning_text||'')}</textarea></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.riskModel.push({activity_code:'',activity_name:'',risk_key:'',risk_name:'',recommended_limit:'',recommendation_text:''});adminPanel('riskModel')">+ Přidat pravidlo</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='texts') box.innerHTML=renderTextationAdmin();
  if(type==='documents') box.innerHTML=`<h2>Dokumenty</h2><p class="muted">Modul dokumentů je zachovaný. V této stabilizační verzi se dokumenty vážou na CASE_ID a další fáze doplní upload/storage.</p><div class="info-box">Dokumentová knihovna nebyla odstraněna. Nyní je připravená pro napojení na objektové úložiště.</div>`;
  if(type==='json') box.innerHTML=`<h2>Import / export číselníků</h2><label>Kompletní katalog JSON<textarea id="adminAllJson" class="codearea">${esc(JSON.stringify(CATALOG,null,2))}</textarea></label><div class="tools"><button class="btn primary" onclick="saveAllCatalogJson()">Uložit celý katalog</button></div>`;
}
async function saveAdminCatalog(){
  try{
    normalizeCatalog();
    const payload={insurers:CATALOG.insurers, advisers:CATALOG.advisers, requirementTypes:CATALOG.requirementTypes, coverageDictionary:CATALOG.coverageDictionary, policyReferences:CATALOG.policyReferences, risks:CATALOG.risks, activities:CATALOG.activities, riskModel:CATALOG.riskModel, textTemplates:CATALOG.textTemplates, actor_email:state.adviser.email||''};
    const data=await fetchJson('/api/admin/catalogs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    toast(data.message||'Admin číselníky uloženy.'); renderAll();
  }catch(e){toast('Admin se nepodařilo uložit: '+e.message);}
}
async function saveAllCatalogJson(){
  try{ CATALOG=JSON.parse($('adminAllJson').value); normalizeCatalog(); await saveAdminCatalog(); }
  catch(e){toast('JSON není platný: '+e.message);}
}
function renderTextationAdmin(){
  return `<h2>Textace a šablony</h2><p class="muted">Moje textace, centrální textace a návrhy ke schválení. Textace se ukládají do admin katalogu a lze je použít v klientském výstupu.</p><div class="tools"><button class="btn secondary" onclick="CATALOG.textTemplates.push({id:'txt_'+Date.now(),type:'moje',title:'Nová textace',area:'',text:''});adminPanel('texts')">+ Nová textace</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit textace</button></div><div class="table-wrap"><table><thead><tr><th>Typ</th><th>Název</th><th>Oblast</th><th>Text</th></tr></thead><tbody>${(CATALOG.textTemplates||[]).map((t,idx)=>`<tr><td><select onchange="CATALOG.textTemplates[${idx}].type=this.value"><option ${t.type==='moje'?'selected':''}>moje</option><option ${t.type==='centrální'?'selected':''}>centrální</option><option ${t.type==='návrh ke schválení'?'selected':''}>návrh ke schválení</option></select></td><td><input onchange="CATALOG.textTemplates[${idx}].title=this.value" value="${esc(t.title||'')}"></td><td><input onchange="CATALOG.textTemplates[${idx}].area=this.value" value="${esc(t.area||'')}"></td><td><textarea onchange="CATALOG.textTemplates[${idx}].text=this.value">${esc(t.text||'')}</textarea></td></tr>`).join('')}</tbody></table></div>`;
}
function renderTextationsBox(){ const box=$('textationsBox'); if(box) box.innerHTML=renderTextations(); }
function copyTextation(idx){ const t=(CATALOG.textTemplates||[])[idx]; navigator.clipboard?.writeText(t?.text||''); toast('Textace zkopírována.'); }
function renderTextations(){
  const all=(CATALOG.textTemplates||[]);
  const card=(x,idx)=>`<div class="form-card"><div class="section-head"><div><b>${esc(x.title||'Bez názvu')}</b><small>${esc(x.area||x.category||'')}</small></div><span class="badge">${esc(x.type||'centrální')}</span></div><p>${esc(x.text||'')}</p><button class="btn secondary" onclick="copyTextation(${idx})">Kopírovat</button></div>`;
  const groups=[['centrální','Centrální databáze'],['moje','Moje textace'],['návrh ke schválení','Návrhy ke schválení']];
  return `<p class="eyebrow">Textace</p><h1>Textace a šablony</h1><p class="muted">Textace jsou zobrazené přímo zde a zároveň je lze spravovat v Adminu. Slouží pro poptávky pojišťovnám, interní poznámky i klientský výstup.</p><div class="tools"><button class="btn primary" onclick="showView('admin');adminPanel('texts')">Spravovat textace v Adminu</button><button class="btn secondary" onclick="CATALOG.textTemplates.push({id:'txt_'+Date.now(),type:'moje',title:'Nová textace',area:'',text:''});showView('admin');adminPanel('texts')">+ Nová textace</button></div>${groups.map(([key,title])=>{const rows=all.map((t,idx)=>({t,idx})).filter(x=>(x.t.type||'centrální')===key);return `<div class="section-soft"><h2>${title}</h2>${rows.length?rows.map(x=>card(x.t,x.idx)).join(''):'<div class="empty">Zatím nejsou žádné položky.</div>'}</div>`}).join('')}`;
}


/* === BRH 3.2.0 – Risk UX Professionalization Stable & Textation Engine === */
function liabilityHelp(key){ const row=LIABILITY_RISKS.find(x=>x[0]===key)||[]; return row[3]||''; }
function addLiabilityRisk(key,name,limit,methodNote){
  if(state.risks.some(r=>String(r.risk_key)===String(key))){toast('Riziko už je v poptávce.');return;}
  state.risks.push({risk_key:key,name:name,requested_limit:limit||'',deductible:'',specification:'',method_note:methodNote||''});
  renderWorkspace();
}
function addAllLiabilityRisks(){
  LIABILITY_RISKS.forEach(r=>{ if(!state.risks.some(x=>x.risk_key===r[0])) state.risks.push({risk_key:r[0],name:r[1],requested_limit:r[2],deductible:'',specification:'',method_note:r[3]}); });
  renderWorkspace(); toast('Doplněna profesionální sada rizik odpovědnosti.');
}
function clearAllLiabilityRisks(){
  if(!confirm('Opravdu odebrat všechna rizika odpovědnosti z tohoto případu?')) return;
  const keys=new Set(LIABILITY_RISKS.map(r=>r[0]));
  state.risks=(state.risks||[]).filter(r=>!keys.has(r.risk_key) && !String(r.risk_key||'').startsWith('CUSTOM'));
  renderWorkspace(); toast('Rizika odpovědnosti byla odebrána.');
}
function clearAllLiabilityAgreements(){
  if(!confirm('Opravdu smazat všechna zvláštní ujednání odpovědnosti?')) return;
  state.liability_agreements=[]; renderWorkspace(); toast('Zvláštní ujednání byla odebrána.');
}
function addRiskByKey(key){
  if(!key) return;
  if(state.risks.some(r=>String(r.risk_key)===String(key))){toast('Riziko už je v poptávce.');return;}
  const cat=riskByKey(key); const model=suggestedRisks().find(r=>r.risk_key===key)||{};
  state.risks.push({risk_key:key,name:model.risk_name||riskName(cat)||key,requested_limit:model.recommended_limit||cat.limit||'',deductible:'',specification:'',method_note:model.note||cat.reason||cat.description||''});
  renderWorkspace();
}
function addDefaultRisks(){
  const arr=suggestedRisks(); if(!arr.length){toast('Pro tuto činnost není připravená doporučená sada.');return;}
  arr.forEach(r=>{if(!state.risks.some(x=>x.risk_key===r.risk_key)) state.risks.push({risk_key:r.risk_key,name:r.risk_name,requested_limit:r.recommended_limit||'',deductible:'',specification:'',method_note:r.note||''});});
  renderWorkspace();
}
function addCustomRisk(){state.risks.push({risk_key:'CUSTOM_'+(state.risks.length+1),name:'Vlastní riziko',requested_limit:'',deductible:'',specification:'',method_note:''});renderWorkspace();}
function tabLiability(){
  const selected=liabilitySelectedSet();
  const riskCards=LIABILITY_RISKS.map(r=>`<button class="risk-tile ${selected.has(r[0])?'selected':''}" title="${esc(r[3])}" onclick="addLiabilityRisk('${esc(r[0])}','${esc(r[1])}','${esc(r[2])}','${esc(r[3])}')"><span>${esc(r[1])}</span><small>Doporučený limit: ${esc(r[2])}</small><em>${esc(r[3])}</em></button>`).join('');
  const agre=(state.liability_agreements||[]).map((a,i)=>`<tr><td><textarea class="fit" onchange="state.liability_agreements[${i}].title=this.value">${esc(a.title)}</textarea></td><td><textarea class="fit" onchange="state.liability_agreements[${i}].limit=this.value" placeholder="limit / sublimit">${esc(a.limit||'')}</textarea></td><td><textarea class="fit" onchange="state.liability_agreements[${i}].text=this.value">${esc(a.text||'')}</textarea></td><td><button class="btn danger" onclick="removeLiabilityAgreement(${i})">Smazat</button></td></tr>`).join('');
  const chosen=(state.risks||[]).filter(r=>LIABILITY_RISKS.some(x=>x[0]===r.risk_key)||String(r.risk_key||'').startsWith('CUSTOM'));
  return `<p class="eyebrow">3. Modul pojištění odpovědnosti PROFI</p><h2>Rizika a zvláštní ujednání odpovědnosti</h2><p class="muted">Interní metodika slouží pouze jako nápověda poradce. Do poptávek, nabídek a výstupů se propisuje jen pole „Specifikace / doplnění pro pojišťovnu“.</p>
  <div class="section-soft"><div class="section-head"><div><h3>Profesionální katalog rizik odpovědnosti</h3><p class="muted">Riziko přidáte kliknutím. Detail metodiky je viditelný přímo v kartě a také jako nápověda při najetí myší.</p></div><div class="tools"><button class="btn primary" onclick="addAllLiabilityRisks()">+ Přidat celou sadu</button><button class="btn danger" onclick="clearAllLiabilityRisks()">Odebrat všechna rizika</button></div></div><div class="risk-catalog-grid">${riskCards}</div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Vybraná rizika odpovědnosti</h3><p class="muted">Specifikace je text určený pro komunikaci s pojišťovnou. Interní metodika se nikam neexportuje.</p></div><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Risk key</th><th>Název</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění pro pojišťovnu</th><th>Interní nápověda</th><th></th></tr></thead><tbody>${chosen.length?chosen.map((r,i)=>{const idx=state.risks.indexOf(r);return `<tr><td><textarea class="fit codefield" onchange="state.risks[${idx}].risk_key=this.value">${esc(r.risk_key)}</textarea></td><td><textarea class="fit" onchange="state.risks[${idx}].name=this.value">${esc(r.name)}</textarea></td><td><textarea class="fit" onchange="state.risks[${idx}].requested_limit=this.value">${esc(r.requested_limit||'')}</textarea></td><td><textarea class="fit" onchange="state.risks[${idx}].deductible=this.value">${esc(r.deductible||'')}</textarea></td><td><textarea class="fit tall" onchange="state.risks[${idx}].specification=this.value" placeholder="Text určený pro pojišťovnu / poptávku">${esc(riskSpecification(r))}</textarea></td><td><div class="advisor-help">${esc(riskMethodNote(r))}</div></td><td><button class="btn danger" onclick="removeRisk(${idx})">Smazat</button></td></tr>`}).join(''):'<tr><td colspan="7" class="muted">Zatím není vybrané žádné riziko odpovědnosti.</td></tr>'}</tbody></table></div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Zvláštní ujednání a doložky</h3><p class="muted">Tato část se přenáší do poptávky pojišťovnám a slouží i jako podklad pro kontrolu nabídky.</p></div><div class="tools"><button class="btn secondary" onclick="addAllLiabilityAgreements()">+ Doporučená ujednání</button><button class="btn secondary" onclick="addCustomLiabilityAgreement()">+ Vlastní ujednání</button><button class="btn danger" onclick="clearAllLiabilityAgreements()">Smazat všechna ujednání</button></div></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th><th></th></tr></thead><tbody>${agre||'<tr><td colspan="4" class="muted">Zatím nejsou doplněna žádná zvláštní ujednání.</td></tr>'}</tbody></table></div></div>
  <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit modul odpovědnosti</button><button class="btn secondary" onclick="currentTab='risks';renderWorkspace()">Přejít na obecná rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function tabRisks(){
  const options=riskOptions(); const suggested=suggestedRisks();
  return `<p class="eyebrow">4. Ostatní rizika a požadavky klienta</p><h2>Vstupní dotazník rizik</h2><p class="muted">Každé riziko má oddělenou interní metodiku a externí specifikaci pro pojišťovnu.</p><div class="section-soft"><h3>Doporučená rizika podle činnosti</h3>${suggested.length?`<div class="chip-row">${suggested.map(r=>`<button class="chip" title="${esc(r.note||'')}" onclick="addRiskByKey('${esc(r.risk_key)}')">+ ${esc(r.risk_name||r.name||r.risk_key)}</button>`).join('')}</div>`:'<div class="info-box">Vyplňte typ činnosti na kartě klienta nebo použijte ruční výběr z knihovny rizik.</div>'}</div><div class="tools"><select id="addRiskSelect"><option value="">Vyberte riziko z knihovny</option>${options}</select><button class="btn primary" onclick="addRiskFromSelect()">+ Přidat riziko</button><button class="btn secondary" onclick="addDefaultRisks()">+ Doporučená sada</button><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Risk key</th><th>Název rizika</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění pro pojišťovnu</th><th>Interní nápověda</th><th></th></tr></thead><tbody>${state.risks.map((r,i)=>`<tr><td><textarea class="fit codefield" onchange="state.risks[${i}].risk_key=this.value">${esc(r.risk_key||r.key)}</textarea></td><td><textarea class="fit" onchange="state.risks[${i}].name=this.value">${esc(r.name||r.label)}</textarea></td><td><textarea class="fit" onchange="state.risks[${i}].requested_limit=this.value">${esc(r.requested_limit||r.limit)}</textarea></td><td><textarea class="fit" onchange="state.risks[${i}].deductible=this.value">${esc(r.deductible||'')}</textarea></td><td><textarea class="fit tall" onchange="state.risks[${i}].specification=this.value">${esc(riskSpecification(r))}</textarea></td><td><div class="advisor-help">${esc(riskMethodNote(r))}</div></td><td><button class="btn danger" onclick="removeRisk(${i})">Smazat</button></td></tr>`).join('')||'<tr><td colspan="7" class="muted">Zatím není doplněné žádné riziko.</td></tr>'}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function insurerRequestHtml(code, forPrint=false){
  const ins=insurerByCode(code); const req=ensureInsurerRequest(code); const rows=requestDataRows();
  const risks=(state.risks||[]).map(r=>`<tr><td>${esc(r.risk_key||'')}</td><td>${esc(r.name||'')}</td><td>${esc(r.requested_limit||'')}</td><td>${esc(r.deductible||'')}</td><td>${esc(riskSpecification(r))}</td></tr>`).join('');
  const agreements=liabilityAgreementRows().map(a=>`<tr><td>${esc(a.title||'')}</td><td>${esc(a.limit||'')}</td><td>${esc(a.text||'')}</td></tr>`).join('');
  const texts=selectedTextations('request').map(t=>`<h4>${esc(t.title||'Textace')}</h4><p>${esc(textationContent(t)).replace(/\n/g,'<br>')}</p>`).join('');
  return `<div class="request-print"><div class="print-head"><div><h1>ASTORIE a.s.</h1><p>Poptávka pojištění podnikatelských rizik</p></div><div><b>${esc(ins.name||code)}</b><br>${esc(code)}<br>${esc(ins.email||ins.request_email||'')}</div></div><h2>${esc(state.client.name||'Klient')}</h2><p><b>CASE_ID:</b> ${esc(state.id||'nový případ')} · <b>Poradce:</b> ${esc(state.adviser?.name||'')} · <b>Datum:</b> ${new Date().toLocaleDateString('cs-CZ')}</p><h3>Základní údaje pro pojištění</h3><table>${rows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table><h3>Požadovaná rizika a limity</h3><table><thead><tr><th>Risk key</th><th>Riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění</th></tr></thead><tbody>${risks||'<tr><td colspan="5">Rizika nejsou doplněna.</td></tr>'}</tbody></table><h3>Zvláštní ujednání / požadované doložky odpovědnosti</h3><table><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th></tr></thead><tbody>${agreements||'<tr><td colspan="3">Zvláštní ujednání nejsou doplněna.</td></tr>'}</tbody></table>${texts?`<h3>Doplněné textace pro pojišťovnu</h3>${texts}`:''}<h3>Doprovodná poznámka</h3><p>${esc(req.email_note||defaultEmailNote(code)).replace(/\n/g,'<br>')}</p><p class="muted"></p></div>`;
}
function setOfferRiskStatus(code,k,status){
  const risk=(state.risks||[]).find(r=>String(r.risk_key||riskKey(r))===String(k))||{};
  const cell=ensureOffer(code).risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};
  cell.status=status;
  if(status==='splněno'){
    if(!cell.offered_limit) cell.offered_limit=risk.requested_limit||'';
    if(!cell.deductible) cell.deductible=risk.deductible||state.questionnaire.deductible_preference||'';
  }
  renderWorkspace();
}
function applyCommonOfferData(){
  (state.selected_insurers||[]).forEach(code=>{ const o=ensureOffer(code); o.insurance_start=state.questionnaire.insurance_start||o.insurance_start||''; o.insurance_period=state.questionnaire.insurance_period||o.insurance_period||''; o.payment_frequency=state.questionnaire.payment_frequency||o.payment_frequency||''; o.deductible=o.deductible||state.questionnaire.deductible_preference||''; });
  renderWorkspace(); toast('Společné údaje byly propsány do nabídek.');
}
function tabOffers(){
  if(!selectedInsurerCodes().length)return `<p class="eyebrow">7. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven.</div>`;
  if(!state.risks.length)return `<p class="eyebrow">7. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v modulu odpovědnosti nebo v ostatních rizicích.</div>`;
  const common=`<div class="section-soft"><div class="section-head"><div><h3>Společné údaje z poptávky</h3><p class="muted">Tyto údaje platí pro všechny pojišťovny. Není nutné je opisovat u každé nabídky.</p></div><button class="btn secondary" onclick="applyCommonOfferData()">Propsat do všech nabídek</button></div><div class="grid4"><div class="stat"><span>Počátek</span><b>${esc(state.questionnaire.insurance_start||'není uveden')}</b></div><div class="stat"><span>Pojistné období</span><b>${esc(state.questionnaire.insurance_period||'není uvedeno')}</b></div><div class="stat"><span>Frekvence</span><b>${esc(state.questionnaire.payment_frequency||'ročně')}</b></div><div class="stat"><span>Preferovaná spoluúčast</span><b>${esc(state.questionnaire.deductible_preference||'není uvedena')}</b></div></div></div>`;
  const heads=state.selected_insurers.map(code=>{const o=ensureOffer(code);return `<th class="offer-head">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div><input placeholder="Nabídnuté pojistné" onchange="ensureOffer('${esc(code)}').premium=this.value" value="${esc(o.premium)}"><input placeholder="Počátek pojištění" onchange="ensureOffer('${esc(code)}').insurance_start=this.value" value="${esc(o.insurance_start||state.questionnaire.insurance_start||'')}"><input placeholder="Frekvence placení" onchange="ensureOffer('${esc(code)}').payment_frequency=this.value" value="${esc(o.payment_frequency||state.questionnaire.payment_frequency||'ročně')}"><input placeholder="Celková spoluúčast / pozn." onchange="ensureOffer('${esc(code)}').deductible=this.value" value="${esc(o.deductible||state.questionnaire.deductible_preference||'')}"></th>`}).join('');
  const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br><span class="badge">${esc(r.risk_key)}</span><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||'není uvedena')}<br>${riskSpecification(r)?`<small>Specifikace: ${esc(riskSpecification(r))}</small>`:''}</td>${selectedInsurerCodes().map(code=>offerCell(code,r,i)).join('')}</tr>`).join('');
  return `<p class="eyebrow">7. Nabídky v jedné tabulce</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Při volbě „splněno“ se automaticky doplní požadovaný limit a spoluúčast z poptávky. Poradce doplňuje jen rozdíly, výluky a specifika nabídky.</p>${common}<div class="table-wrap"><table class="offer-table pro-table"><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button><button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button></div>`;
}
function offerCell(code,r,i){
  const k=r.risk_key||riskKey(r);const o=ensureOffer(code);o.risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};const x=o.risks[k];
  return `<td><select onchange="setOfferRiskStatus('${esc(code)}','${esc(k)}',this.value)"><option ${x.status==='splněno'?'selected':''}>splněno</option><option ${x.status==='omezeno'?'selected':''}>omezeno</option><option ${x.status==='výluka'?'selected':''}>výluka</option><option ${x.status==='nutno ověřit'?'selected':''}>nutno ověřit</option></select><input placeholder="Nabídnutý limit" value="${esc(x.offered_limit)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].offered_limit=this.value"><input placeholder="Spoluúčast" value="${esc(x.deductible)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].deductible=this.value"><textarea class="fit tall" placeholder="Výluky / sublimity / zdroj VPP" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].note=this.value">${esc(x.note)}</textarea></td>`;
}
function addTextationToCase(idx,target){
  const t=(CATALOG.textTemplates||[])[idx]; if(!t) return;
  state.case_textations ||= [];
  const id=t.id || ('txt_'+idx);
  const existing=state.case_textations.find(x=>String(x.id)===String(id));
  if(existing){ if(!existing.targets.includes(target)) existing.targets.push(target); }
  else state.case_textations.push({id,title:t.title||t.name||'Textace',area:t.area||t.category||'',type:t.type||'centrální',text:textationContent(t),targets:[target]});
  renderTextationsBox(); toast('Textace byla přidána do případu.');
}
function removeCaseTextation(i){state.case_textations.splice(i,1); renderTextationsBox();}
function renderTextations(){
  const all=(CATALOG.textTemplates||[]);
  const targetName={request:'poptávka pojišťovně',offer:'nabídky',report:'klientský výstup',internal:'interní poznámka'};
  const caseRows=(state.case_textations||[]).map((t,i)=>`<div class="textation-case-row"><div><b>${esc(t.title)}</b><small>${esc((t.targets||[]).map(x=>targetName[x]||x).join(', '))}</small><p>${esc(t.text||'')}</p></div><button class="btn danger" onclick="removeCaseTextation(${i})">Odebrat</button></div>`).join('');
  const card=(x,idx)=>`<div class="textation-card"><div class="section-head"><div><b>${esc(x.title||'Bez názvu')}</b><small>${esc(x.area||x.category||'')}</small></div><span class="badge">${esc(x.type||'centrální')}</span></div><p>${esc(textationContent(x))}</p><div class="tools"><button class="btn secondary" onclick="copyTextation(${idx})">Kopírovat</button><button class="btn primary" onclick="addTextationToCase(${idx},'request')">Do poptávky</button><button class="btn secondary" onclick="addTextationToCase(${idx},'offer')">Do nabídky</button><button class="btn secondary" onclick="addTextationToCase(${idx},'report')">Do klientského výstupu</button></div></div>`;
  const groups=[['centrální','Centrální databáze'],['moje','Moje textace'],['návrh ke schválení','Návrhy ke schválení']];
  return `<p class="eyebrow">Textace</p><h1>Textace a šablony</h1><p class="muted">Poradce může textaci vložit přímo do případu a určit, zda se má použít do poptávky pojišťovně, nabídky nebo klientského výstupu.</p><div class="tools"><button class="btn primary" onclick="showView('admin');adminPanel('texts')">Spravovat textace v Adminu</button><button class="btn secondary" onclick="CATALOG.textTemplates.push({id:'txt_'+Date.now(),type:'moje',title:'Nová textace',area:'',text:''});showView('admin');adminPanel('texts')">+ Nová textace</button></div><div class="section-soft"><h2>Textace přiřazené k aktivnímu případu</h2>${caseRows||'<div class="empty">Zatím není přiřazena žádná textace k tomuto případu.</div>'}</div>${groups.map(([key,title])=>{const rows=all.map((t,idx)=>({t,idx})).filter(x=>(x.t.type||'centrální')===key);return `<div class="section-soft"><h2>${title}</h2><div class="textation-grid">${rows.length?rows.map(x=>card(x.t,x.idx)).join(''):'<div class="empty">Zatím nejsou žádné položky.</div>'}</div></div>`}).join('')}`;
}


/* BRH 3.3.1d – Risk UX Professionalization Stable */
function smartOfferDefaults(code){
  const o=ensureOffer(code);
  const q=state.questionnaire||{};
  o.insurance_start = o.insurance_start || q.insurance_start || '';
  o.insurance_period = o.insurance_period || q.insurance_period || '1 rok';
  o.payment_frequency = o.payment_frequency || q.payment_frequency || 'ročně';
  o.territory = o.territory || q.territory || 'Česká republika';
  o.deductible = o.deductible || q.deductible_preference || '';
  o.workflow_status = o.workflow_status || 'rozpracováno';
  (state.risks||[]).forEach(r=>{
    const k=r.risk_key||riskKey(r);
    o.risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};
  });
  return o;
}
function smartPrefillAllOffers(){
  (state.selected_insurers||[]).forEach(code=>smartOfferDefaults(code));
  renderWorkspace();
  toast('Nabídky byly chytře předvyplněny z poptávky.');
}
function fulfillAllRisksForInsurer(code){
  const o=smartOfferDefaults(code);
  (state.risks||[]).forEach(r=>{
    const k=r.risk_key||riskKey(r);
    const x=o.risks[k] ||= {};
    x.status='splněno';
    x.offered_limit = r.requested_limit || x.offered_limit || '';
    x.deductible = r.deductible || state.questionnaire.deductible_preference || x.deductible || '';
  });
  renderWorkspace();
  toast('U pojišťovny bylo nastaveno splněno a převzaty požadavky z poptávky.');
}
function fulfillAllRisksEverywhere(){
  (state.selected_insurers||[]).forEach(code=>fulfillAllRisksForInsurer(code));
}
function offerWorkflowBadge(code){
  const o=smartOfferDefaults(code);
  const st=o.workflow_status||'rozpracováno';
  return `<select class="mini-select" onchange="ensureOffer('${esc(code)}').workflow_status=this.value"><option ${st==='rozpracováno'?'selected':''}>rozpracováno</option><option ${st==='nabídka přijata'?'selected':''}>nabídka přijata</option><option ${st==='nutné doplnění'?'selected':''}>nutné doplnění</option><option ${st==='finální nabídka'?'selected':''}>finální nabídka</option><option ${st==='zamítnuto'?'selected':''}>zamítnuto</option></select>`;
}
function selectedCaseTextations(target){return (state.case_textations||[]).filter(t=>(t.targets||[]).includes(target));}
function smartRequestTextationBlock(target='request'){
  const rows=selectedCaseTextations(target);
  if(!rows.length) return '';
  const label=target==='request'?'poptávky':target==='offer'?'nabídky':'výstupu';
  return `<div class="section-soft"><h3>Textace vložené do ${label}</h3>${rows.map(t=>`<div class="textation-case-row"><div><b>${esc(t.title)}</b><small>${esc(t.area||'')}</small><p>${esc(t.text||'')}</p></div></div>`).join('')}</div>`;
}
function tabOffers(){
  if(!state.selected_insurers.length)return `<p class="eyebrow">7. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven.</div>`;
  if(!state.risks.length)return `<p class="eyebrow">7. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v modulu odpovědnosti nebo v ostatních rizicích.</div>`;
  (state.selected_insurers||[]).forEach(code=>smartOfferDefaults(code));
  const common=`<div class="section-soft smart-panel"><div class="section-head"><div><h3>Smart předvyplnění nabídek</h3><p class="muted">Počátek, období, frekvence, území, spoluúčast a rizika se přebírají z poptávky. Poradce doplňuje pouze rozdíly, výluky a specifika pojišťovny.</p></div><div class="tools"><button class="btn secondary" onclick="smartPrefillAllOffers()">Předvyplnit společné údaje</button><button class="btn secondary" onclick="fulfillAllRisksEverywhere()">Všude nastavit splněno</button></div></div><div class="grid4"><div class="stat"><span>Počátek</span><b>${esc(state.questionnaire.insurance_start||'není uveden')}</b></div><div class="stat"><span>Pojistné období</span><b>${esc(state.questionnaire.insurance_period||'není uvedeno')}</b></div><div class="stat"><span>Frekvence</span><b>${esc(state.questionnaire.payment_frequency||'ročně')}</b></div><div class="stat"><span>Spoluúčast</span><b>${esc(state.questionnaire.deductible_preference||'není uvedena')}</b></div></div></div>${smartRequestTextationBlock('offer')}`;
  const heads=state.selected_insurers.map(code=>{const o=smartOfferDefaults(code);return `<th class="offer-head"><div class="insurer-title">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div></div>${offerWorkflowBadge(code)}<button class="btn small secondary" onclick="fulfillAllRisksForInsurer('${esc(code)}')">Tato pojišťovna splňuje vše</button><input placeholder="Nabídnuté pojistné" onchange="ensureOffer('${esc(code)}').premium=this.value" value="${esc(o.premium)}"><input placeholder="Počátek pojištění" onchange="ensureOffer('${esc(code)}').insurance_start=this.value" value="${esc(o.insurance_start||state.questionnaire.insurance_start||'')}"><input placeholder="Frekvence placení" onchange="ensureOffer('${esc(code)}').payment_frequency=this.value" value="${esc(o.payment_frequency||state.questionnaire.payment_frequency||'ročně')}"><input placeholder="Celková spoluúčast / pozn." onchange="ensureOffer('${esc(code)}').deductible=this.value" value="${esc(o.deductible||state.questionnaire.deductible_preference||'')}"></th>`}).join('');
  const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br><span class="badge">${esc(r.risk_key)}</span><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||state.questionnaire.deductible_preference||'není uvedena')}<br>${riskSpecification(r)?`<small>Specifikace: ${esc(riskSpecification(r))}</small>`:''}</td>${state.selected_insurers.map(code=>offerCell(code,r,i)).join('')}</tr>`).join('');
  return `<p class="eyebrow">7. Smart nabídky</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Při volbě „splněno“ se automaticky doplní požadovaný limit a spoluúčast z poptávky. Poradce řeší pouze odchylky.</p>${common}<div class="table-wrap"><table class="offer-table pro-table"><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button><button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button></div>`;
}
function tabInsurerRequests(){
  const missing=requestCompleteness();
  if(missing.length) return `<p class="eyebrow">6. Poptávky pojišťovnám</p><h2>Nejdříve doplňte povinné části</h2><div class="info-box">Pro generování poptávek chybí: ${esc(missing.join(', '))}.</div>`;
  const textBlock=smartRequestTextationBlock('request');
  const cards=selectedInsurerRows().map(({code,ins,req})=>`<div class="request-card"><div class="section-head"><div><p class="eyebrow">Pojišťovna</p><h2>${esc(ins.name||code)}</h2><p class="muted"><b>${esc(code)}</b> · ${esc(ins.email||ins.request_email||'e-mail není doplněn')}</p></div><span class="badge">${esc(req.status||'připraveno')}</span></div><div class="grid3"><label>Předmět e-mailu<input value="${esc(req.subject||requestSubject(code))}" onchange="ensureInsurerRequest('${esc(code)}').subject=this.value"></label><label>Stav poptávky<select onchange="ensureInsurerRequest('${esc(code)}').status=this.value"><option ${req.status==='připraveno'?'selected':''}>připraveno</option><option ${req.status==='odesláno'?'selected':''}>odesláno</option><option ${req.status==='čekáme na nabídku'?'selected':''}>čekáme na nabídku</option><option ${req.status==='nabídka přijata'?'selected':''}>nabídka přijata</option><option ${req.status==='nutné doplnění'?'selected':''}>nutné doplnění</option></select></label><label>Datum odeslání<input type="date" value="${esc(req.sent_at||'')}" onchange="ensureInsurerRequest('${esc(code)}').sent_at=this.value"></label></div><label>Doprovodný text pro pojišťovnu<textarea onchange="ensureInsurerRequest('${esc(code)}').email_note=this.value" placeholder="Krátká poznámka k poptávce, termín pro nabídku, specifika komunikace...">${esc(req.email_note||defaultEmailNote(code))}</textarea></label><div class="tools"><button class="btn primary" onclick="printInsurerRequest('${esc(code)}')">PDF / tisk poptávky</button><button class="btn secondary" onclick="exportInsurerRequestExcel('${esc(code)}')">Excel pro pojišťovnu</button><button class="btn secondary" onclick="copyInsurerEmail('${esc(code)}')">Kopírovat e-mail</button><button class="btn ghost" onclick="ensureInsurerRequest('${esc(code)}').status='odesláno';ensureInsurerRequest('${esc(code)}').sent_at=new Date().toISOString().slice(0,10);readCurrentTab();saveCase()">Označit jako odesláno</button></div></div>`).join('');
  return `<p class="eyebrow">6. Smart poptávky pojišťovnám</p><h2>Samostatná poptávka pro každou pojišťovnu</h2><p class="muted">Poptávka se skládá automaticky z karty klienta, karty pro pojištění, modulu odpovědnosti a textací vložených do případu.</p><div class="warning"><b>Důležité:</b> interní metodická nápověda se do poptávky nepropíše. Do výstupu jde pouze pole „Specifikace / doplnění pro pojišťovnu“ a zvolené textace.</div>${textBlock}${cards}<div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit stav poptávek</button><button class="btn secondary" onclick="currentTab='offers';renderWorkspace()">Pokračovat na nabídky</button></div>`;
}

window.openCase=openCase;window.ensureInsurerRequest=ensureInsurerRequest;window.printInsurerRequest=printInsurerRequest;window.exportInsurerRequestExcel=exportInsurerRequestExcel;window.copyInsurerEmail=copyInsurerEmail;window.ensureOffer=ensureOffer;window.toggleInsurer=toggleInsurer;window.addRiskFromSelect=addRiskFromSelect;window.addCustomRisk=addCustomRisk;window.removeRisk=removeRisk;window.addManualInsurer=addManualInsurer;window.saveCase=saveCase;window.loadAres=loadAres;window.searchClients=searchClients;window.useClient=useClient;window.saveAdminCatalog=saveAdminCatalog;window.adminPanel=adminPanel;window.saveAllCatalogJson=saveAllCatalogJson;window.copyTextation=copyTextation;window.addRiskByKey=addRiskByKey;window.addDefaultRisks=addDefaultRisks;window.clearAllLiabilityRisks=clearAllLiabilityRisks;window.clearAllLiabilityAgreements=clearAllLiabilityAgreements;window.setOfferRiskStatus=setOfferRiskStatus;window.applyCommonOfferData=applyCommonOfferData;window.smartPrefillAllOffers=smartPrefillAllOffers;window.fulfillAllRisksForInsurer=fulfillAllRisksForInsurer;window.fulfillAllRisksEverywhere=fulfillAllRisksEverywhere;window.addTextationToCase=addTextationToCase;window.removeCaseTextation=removeCaseTextation;
document.addEventListener('DOMContentLoaded',init);


/* === BRH 3.3.1d – SAFE Risk UX Professionalization overrides ===
   Pouze bezpečné předefinování UX funkcí nad stabilním 3.3.0. Nemění DB, neruší init/bindButtons. */
function riskUxInternalNote(r){
  return r.method_note || r.internal_note || r.advisor_note || r.reason || r.note_internal || liabilityHelp(r.risk_key) || '';
}
function liabilityRiskByKey(key){ return (LIABILITY_RISKS||[]).find(x=>String(x[0])===String(key)) || []; }
function liabilityRiskMeta(key){ const r=liabilityRiskByKey(key); return {key:r[0]||key, name:r[1]||key, limit:r[2]||'', help:r[3]||''}; }
function toggleLiabilityRisk(key,name,limit,methodNote){
  const idx=(state.risks||[]).findIndex(r=>String(r.risk_key)===String(key));
  if(idx>=0){ state.risks.splice(idx,1); renderWorkspace(); toast('Riziko bylo odebráno z poptávky.'); return; }
  state.risks.push({risk_key:key,name:name,requested_limit:limit||'',deductible:'',specification:'',method_note:methodNote||''});
  renderWorkspace(); toast('Riziko bylo přidáno do poptávky.');
}
function addLiabilityRisk(key,name,limit,methodNote){ toggleLiabilityRisk(key,name,limit,methodNote); }
function riskProductCell(r, idx){
  const note=riskUxInternalNote(r);
  return `<div class="risk-product-cell"><textarea class="fit risk-name-field" onchange="state.risks[${idx}].name=this.value">${esc(r.name||r.label||'')}</textarea>${note?`<details class="risk-help"><summary>Interní metodika / nápověda poradce</summary><div>${esc(note)}</div></details>`:''}</div>`;
}
function tabLiability(){
  const selected=liabilitySelectedSet();
  const riskCards=LIABILITY_RISKS.map(r=>`<button class="risk-tile ${selected.has(r[0])?'selected':''}" title="${esc(r[3])}" onclick="toggleLiabilityRisk('${esc(r[0])}','${esc(r[1])}','${esc(r[2])}','${esc(r[3])}')"><span>${selected.has(r[0])?'✓ ':''}${esc(r[1])}</span><small>Doporučený limit: ${esc(r[2])}</small><em>${esc(r[3])}</em><b class="tile-action">${selected.has(r[0])?'Kliknutím odebrat':'Kliknutím přidat'}</b></button>`).join('');
  const agre=(state.liability_agreements||[]).map((a,i)=>`<tr><td><textarea class="fit" onchange="state.liability_agreements[${i}].title=this.value">${esc(a.title)}</textarea></td><td><textarea class="fit" onchange="state.liability_agreements[${i}].limit=this.value" placeholder="limit / sublimit">${esc(a.limit||'')}</textarea></td><td><textarea class="fit tall" onchange="state.liability_agreements[${i}].text=this.value">${esc(a.text||'')}</textarea></td><td><button class="btn danger" onclick="removeLiabilityAgreement(${i})">Smazat</button></td></tr>`).join('');
  const chosen=(state.risks||[]).filter(r=>LIABILITY_RISKS.some(x=>x[0]===r.risk_key)||String(r.risk_key||'').startsWith('CUSTOM'));
  return `<p class="eyebrow">3. Modul pojištění odpovědnosti PROFI</p><h2>Rizika a zvláštní ujednání odpovědnosti</h2><p class="muted">Interní metodika slouží pouze jako nápověda poradce. Do poptávek, nabídek a výstupů se propisuje jen pole „Specifikace / doplnění pro pojišťovnu“.</p>
  <div class="section-soft"><div class="section-head"><div><h3>Profesionální katalog rizik odpovědnosti</h3><p class="muted">Riziko přidáte kliknutím. Opakovaným kliknutím aktivní riziko odeberete. Interní nápověda se do výstupů nepropisuje.</p></div><div class="tools"><button class="btn primary" onclick="addAllLiabilityRisks()">+ Přidat celou sadu</button><button class="btn danger" onclick="clearAllLiabilityRisks()">Odebrat všechna rizika</button></div></div><div class="risk-catalog-grid">${riskCards}</div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Vybraná rizika odpovědnosti</h3><p class="muted">Specifikace je text určený pro pojišťovnu. Interní metodika je dostupná jen v detailu rizika.</p></div><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table class="pro-table risk-pro-table"><thead><tr><th class="risk-product-col">Produkt / riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th class="spec-col">Specifikace / doplnění pro pojišťovnu</th><th></th></tr></thead><tbody>${chosen.length?chosen.map((r)=>{const idx=state.risks.indexOf(r);return `<tr><td>${riskProductCell(r,idx)}</td><td><textarea class="fit" onchange="state.risks[${idx}].requested_limit=this.value">${esc(r.requested_limit||'')}</textarea></td><td><textarea class="fit" onchange="state.risks[${idx}].deductible=this.value">${esc(r.deductible||'')}</textarea></td><td><textarea class="fit tall spec-field" onchange="state.risks[${idx}].specification=this.value" placeholder="Text určený pro pojišťovnu / poptávku">${esc(riskSpecification(r))}</textarea></td><td><button class="btn danger" onclick="removeRisk(${idx})">Smazat</button></td></tr>`}).join(''):'<tr><td colspan="5" class="muted">Zatím není vybrané žádné riziko odpovědnosti.</td></tr>'}</tbody></table></div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Zvláštní ujednání a doložky</h3><p class="muted">Tato část se přenáší do poptávky pojišťovnám a slouží i jako podklad pro kontrolu nabídky.</p></div><div class="tools"><button class="btn secondary" onclick="addAllLiabilityAgreements()">+ Doporučená ujednání</button><button class="btn secondary" onclick="addCustomLiabilityAgreement()">+ Vlastní ujednání</button><button class="btn danger" onclick="clearAllLiabilityAgreements()">Smazat všechna ujednání</button></div></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th><th></th></tr></thead><tbody>${agre||'<tr><td colspan="4" class="muted">Zatím nejsou doplněna žádná zvláštní ujednání.</td></tr>'}</tbody></table></div></div>
  <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit modul odpovědnosti</button><button class="btn secondary" onclick="currentTab='risks';renderWorkspace()">Přejít na obecná rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function tabRisks(){
  const options=riskOptions();
  const suggested = suggestedRisks();
  const chipHtml=suggested.length?`<div class="chip-row">${suggested.map(r=>{const active=(state.risks||[]).some(x=>String(x.risk_key)===String(r.risk_key));return `<button class="chip ${active?'selected':''}" onclick="addRiskByKey('${esc(r.risk_key)}')">${active?'✓ ':'+'} ${esc(r.risk_name||r.name||r.risk_key)}</button>`}).join('')}</div>`:'<div class="info-box">Vyplňte typ činnosti na kartě klienta nebo použijte ruční výběr z knihovny rizik.</div>';
  return `<p class="eyebrow">4. Ostatní rizika a požadavky klienta</p><h2>Vstupní dotazník rizik</h2><p class="muted">Risk key zůstává interně v systému. Poradce pracuje s názvem rizika, limitem, spoluúčastí a specifikací pro pojišťovnu.</p><div class="section-soft"><h3>Doporučená rizika podle činnosti</h3>${chipHtml}</div><div class="tools"><select id="addRiskSelect"><option value="">Vyberte riziko z knihovny</option>${options}</select><button class="btn primary" onclick="addRiskFromSelect()">+ Přidat riziko</button><button class="btn secondary" onclick="addDefaultRisks()">+ Doporučená sada</button><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table class="pro-table risk-pro-table"><thead><tr><th class="risk-product-col">Produkt / riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th class="spec-col">Specifikace / doplnění pro pojišťovnu</th><th></th></tr></thead><tbody>${state.risks.map((r,i)=>`<tr><td>${riskProductCell(r,i)}</td><td><textarea class="fit" onchange="state.risks[${i}].requested_limit=this.value">${esc(r.requested_limit||r.limit)}</textarea></td><td><textarea class="fit" onchange="state.risks[${i}].deductible=this.value">${esc(r.deductible||'')}</textarea></td><td><textarea class="fit tall spec-field" onchange="state.risks[${i}].specification=this.value" placeholder="Text určený pro pojišťovnu / poptávku">${esc(riskSpecification(r))}</textarea></td><td><button class="btn danger" onclick="removeRisk(${i})">Smazat</button></td></tr>`).join('')||'<tr><td colspan="5" class="muted">Zatím není doplněné žádné riziko.</td></tr>'}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function insurerRequestHtml(code, forPrint=false){
  const ins=insurerByCode(code); const req=ensureInsurerRequest(code); const rows=requestDataRows();
  const risks=(state.risks||[]).map(r=>`<tr><td>${esc(r.name||'')}</td><td>${esc(r.requested_limit||'')}</td><td>${esc(r.deductible||'')}</td><td>${esc(riskSpecification(r))}</td></tr>`).join('');
  const agreements=liabilityAgreementRows().map(a=>`<tr><td>${esc(a.title||'')}</td><td>${esc(a.limit||'')}</td><td>${esc(a.text||'')}</td></tr>`).join('');
  const texts=(typeof selectedTextations==='function'?selectedTextations('request'):[]).map(t=>`<h4>${esc(t.title||'Textace')}</h4><p>${esc(textationContent(t)).replace(/\n/g,'<br>')}</p>`).join('');
  return `<div class="request-print"><div class="print-head"><div><h1>ASTORIE a.s.</h1><p>Poptávka pojištění podnikatelských rizik</p></div><div><b>${esc(ins.name||code)}</b><br>${esc(code)}<br>${esc(ins.email||ins.request_email||'')}</div></div><h2>${esc(state.client.name||'Klient')}</h2><p><b>CASE_ID:</b> ${esc(state.id||'nový případ')} · <b>Poradce:</b> ${esc(state.adviser?.name||'')} · <b>Datum:</b> ${new Date().toLocaleDateString('cs-CZ')}</p><h3>Základní údaje pro pojištění</h3><table>${rows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table><h3>Požadovaná rizika a limity</h3><table><thead><tr><th>Riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění</th></tr></thead><tbody>${risks||'<tr><td colspan="4">Rizika nejsou doplněna.</td></tr>'}</tbody></table><h3>Zvláštní ujednání / požadované doložky odpovědnosti</h3><table><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th></tr></thead><tbody>${agreements||'<tr><td colspan="3">Zvláštní ujednání nejsou doplněna.</td></tr>'}</tbody></table>${texts?`<h3>Doplněné textace pro pojišťovnu</h3>${texts}`:''}<h3>Doprovodná poznámka</h3><p>${esc(req.email_note||defaultEmailNote(code)).replace(/\n/g,'<br>')}</p><p class="muted"></p></div>`;
}
window.toggleLiabilityRisk=toggleLiabilityRisk;
window.addLiabilityRisk=addLiabilityRisk;
window.tabLiability=tabLiability;
window.tabRisks=tabRisks;
window.insurerRequestHtml=insurerRequestHtml;


/* === BRH 3.3.2a – SAFE professional risk table + hover tooltip ===
   Bez zásahu do init/bindButtons. Pouze předefinování renderu tabulek rizik. */
function riskTooltipText(r){
  return riskUxInternalNote(r) || 'Interní metodika k tomuto riziku zatím není doplněna. Nápověda je určena pouze pro poradce a nepropisuje se do poptávky, nabídky ani klientského výstupu.';
}
function riskNameInteractive(r, idx){
  const name = r.name || r.label || 'Riziko';
  const note = riskTooltipText(r);
  return `<div class="risk-name-pro" tabindex="0" aria-label="Interní nápověda k riziku">
    <textarea class="risk-name-pro-input" onchange="state.risks[${idx}].name=this.value">${esc(name)}</textarea>
    <span class="risk-info-pill">i</span>
    <div class="risk-hover-panel"><b>${esc(name)}</b><p>${esc(note)}</p><small>Interní nápověda – nezobrazuje se v poptávce, nabídce ani klientském výstupu.</small></div>
  </div>`;
}
function riskProfessionalCard(r, idx){
  return `<div class="risk-work-row">
    <div class="risk-work-product">${riskNameInteractive(r,idx)}</div>
    <div class="risk-work-limit"><textarea class="fit" onchange="state.risks[${idx}].requested_limit=this.value" placeholder="Požadovaný limit">${esc(r.requested_limit||r.limit||'')}</textarea></div>
    <div class="risk-work-deductible"><textarea class="fit" onchange="state.risks[${idx}].deductible=this.value" placeholder="Spoluúčast">${esc(r.deductible||'')}</textarea></div>
    <div class="risk-work-spec"><textarea class="fit tall spec-field" onchange="state.risks[${idx}].specification=this.value" placeholder="Specifikace / doplnění určené pro pojišťovnu a poptávku">${esc(riskSpecification(r))}</textarea></div>
    <div class="risk-work-action"><button class="btn danger compact-danger" onclick="removeRisk(${idx})">Smazat</button></div>
  </div>`;
}
function riskProfessionalList(rows, emptyText){
  return `<div class="risk-work-table">
    <div class="risk-work-head"><div>Produkt / riziko</div><div>Požadovaný limit</div><div>Spoluúčast</div><div>Specifikace / doplnění pro pojišťovnu</div><div>Akce</div></div>
    ${rows || `<div class="empty">${esc(emptyText)}</div>`}
  </div>`;
}
function tabLiability(){
  const selected=liabilitySelectedSet();
  const riskCards=LIABILITY_RISKS.map(r=>`<button class="risk-tile ${selected.has(r[0])?'selected':''}" title="${esc(r[3])}" onclick="toggleLiabilityRisk('${esc(r[0])}','${esc(r[1])}','${esc(r[2])}','${esc(r[3])}')"><span>${selected.has(r[0])?'✓ Odebrat: ':'+ '}${esc(r[1])}</span><small>Doporučený limit: ${esc(r[2])}</small><b class="tile-action">${selected.has(r[0])?'Kliknutím odebrat':'Kliknutím přidat'}</b></button>`).join('');
  const agre=(state.liability_agreements||[]).map((a,i)=>`<tr><td><textarea class="fit" onchange="state.liability_agreements[${i}].title=this.value">${esc(a.title)}</textarea></td><td><textarea class="fit" onchange="state.liability_agreements[${i}].limit=this.value" placeholder="limit / sublimit">${esc(a.limit||'')}</textarea></td><td><textarea class="fit tall" onchange="state.liability_agreements[${i}].text=this.value">${esc(a.text||'')}</textarea></td><td><button class="btn danger" onclick="removeLiabilityAgreement(${i})">Smazat</button></td></tr>`).join('');
  const chosen=(state.risks||[]).filter(r=>LIABILITY_RISKS.some(x=>x[0]===r.risk_key)||String(r.risk_key||'').startsWith('CUSTOM'));
  const rows=chosen.map(r=>riskProfessionalCard(r,state.risks.indexOf(r))).join('');
  return `<p class="eyebrow">3. Modul pojištění odpovědnosti PROFI</p><h2>Rizika a zvláštní ujednání odpovědnosti</h2><p class="muted">Interní metodika je dostupná najetím myší na název produktu/rizika. Do poptávek, nabídek a klientského výstupu se propisuje pouze pole „Specifikace / doplnění pro pojišťovnu“.</p>
  <div class="section-soft"><div class="section-head"><div><h3>Profesionální katalog rizik odpovědnosti</h3><p class="muted">Riziko přidáte kliknutím. Pokud je už vybrané, dalším kliknutím ho z případu odeberete.</p></div><div class="tools"><button class="btn primary" onclick="addAllLiabilityRisks()">+ Přidat celou sadu</button><button class="btn danger" onclick="clearAllLiabilityRisks()">Odebrat všechna rizika</button></div></div><div class="risk-catalog-grid risk-catalog-compact">${riskCards}</div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Vybraná rizika odpovědnosti</h3><p class="muted">Tabulka je bez technického Risk key. Všechny texty jsou viditelné a pole Specifikace je určené pro komunikaci s pojišťovnou.</p></div><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div>${riskProfessionalList(rows,'Zatím není vybrané žádné riziko odpovědnosti.')}</div>
  <div class="section-soft"><div class="section-head"><div><h3>Zvláštní ujednání a doložky</h3><p class="muted">Tato část se přenáší do poptávky pojišťovnám a slouží i jako podklad pro kontrolu nabídky.</p></div><div class="tools"><button class="btn secondary" onclick="addAllLiabilityAgreements()">+ Doporučená ujednání</button><button class="btn secondary" onclick="addCustomLiabilityAgreement()">+ Vlastní ujednání</button><button class="btn danger" onclick="clearAllLiabilityAgreements()">Smazat všechna ujednání</button></div></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th><th></th></tr></thead><tbody>${agre||'<tr><td colspan="4" class="muted">Zatím nejsou doplněna žádná zvláštní ujednání.</td></tr>'}</tbody></table></div></div>
  <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit modul odpovědnosti</button><button class="btn secondary" onclick="currentTab='risks';renderWorkspace()">Přejít na obecná rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function tabRisks(){
  const options=riskOptions();
  const suggested=suggestedRisks();
  const chipHtml=suggested.length?`<div class="chip-row">${suggested.map(r=>{const active=(state.risks||[]).some(x=>String(x.risk_key)===String(r.risk_key));return `<button class="chip ${active?'selected':''}" onclick="addRiskByKey('${esc(r.risk_key)}')">${active?'✓ ':'+'} ${esc(r.risk_name||r.name||r.risk_key)}</button>`}).join('')}</div>`:'<div class="info-box">Vyplňte typ činnosti na kartě klienta nebo použijte ruční výběr z knihovny rizik.</div>';
  const rows=(state.risks||[]).map((r,i)=>riskProfessionalCard(r,i)).join('');
  return `<p class="eyebrow">4. Ostatní rizika a požadavky klienta</p><h2>Vstupní dotazník rizik</h2><p class="muted">Risk key zůstává interně v systému. Poradce pracuje s názvem rizika, limitem, spoluúčastí a specifikací pro pojišťovnu.</p><div class="section-soft"><h3>Doporučená rizika podle činnosti</h3>${chipHtml}</div><div class="tools"><select id="addRiskSelect"><option value="">Vyberte riziko z knihovny</option>${options}</select><button class="btn primary" onclick="addRiskFromSelect()">+ Přidat riziko</button><button class="btn secondary" onclick="addDefaultRisks()">+ Doporučená sada</button><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="section-soft"><div class="section-head"><div><h3>Všechna rizika případu</h3><p class="muted">Najeďte myší na název rizika pro interní metodiku. Do poptávky se propisuje pouze specifikace pro pojišťovnu.</p></div><button class="btn danger" onclick="clearAllLiabilityRisks()">Odebrat všechna rizika odpovědnosti</button></div>${riskProfessionalList(rows,'Zatím není doplněné žádné riziko.')}</div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
window.tabLiability=tabLiability;
window.tabRisks=tabRisks;

/* === BRH 3.4.0 – Intelligent Workflow Engine PRO ===
   Bezpečný nadstavbový patch nad funkční větví 3.3.2a.
   Nemění DB destruktivně. Doplňuje: kontaktní osoby, přílohy, admin příloh,
   ARES údaje pojišťoven, doporučení UX, smart propagaci údajů v nabídkách. */
(function(){
  const PREV_VERSION = (typeof VERSION !== 'undefined') ? VERSION : '';
  window.BRH_VERSION = '3.4.0';

  function ensureEnhancedCase(){
    state.client ||= {};
    state.client.contacts = Array.isArray(state.client.contacts) ? state.client.contacts : [];
    state.attachments = Array.isArray(state.attachments) ? state.attachments : [];
    CATALOG.attachmentTypes = Array.isArray(CATALOG.attachmentTypes) ? CATALOG.attachmentTypes : [
      {id:'plna_moc', title:'Plná moc', category:'Základní', required:true, scope:'all', note:'Základní podklad pro jednání s pojišťovnou.'},
      {id:'vypis_or', title:'Výpis z OR', category:'Základní', required:true, scope:'all', note:'Aktuální výpis z obchodního rejstříku nebo obdobný identifikační doklad.'},
      {id:'skodni_prubeh', title:'Škodní průběh', category:'Pojištění odpovědnosti', required:true, scope:'liability', note:'Škodní průběh za poslední období dle požadavku pojišťovny.'}
    ];
    state.report ||= {};
  }

  const oldNormalizeCase = typeof normalizeCase === 'function' ? normalizeCase : null;
  window.normalizeCase = normalizeCase = function(item){
    const s = oldNormalizeCase ? oldNormalizeCase(item) : (item || blankCase());
    s.client ||= {}; s.client.contacts = Array.isArray(s.client.contacts) ? s.client.contacts : [];
    s.attachments = Array.isArray(s.attachments) ? s.attachments : [];
    return s;
  };

  const oldBlankCase = typeof blankCase === 'function' ? blankCase : null;
  window.blankCase = blankCase = function(){
    const s = oldBlankCase ? oldBlankCase() : {};
    s.client ||= {}; s.client.contacts = Array.isArray(s.client.contacts) ? s.client.contacts : [];
    s.attachments = Array.isArray(s.attachments) ? s.attachments : [];
    return s;
  };

  function helpIcon(text){
    return `<span class="help-dot" tabindex="0" aria-label="Nápověda">i<span class="help-popover">${esc(text||'Nápověda není doplněna.')}</span></span>`;
  }
  window.helpIcon = helpIcon;

  const oldReadCurrentTab = typeof readCurrentTab === 'function' ? readCurrentTab : function(){};
  window.readCurrentTab = readCurrentTab = function(){
    ensureEnhancedCase();
    oldReadCurrentTab();
    if(currentTab==='client'){
      ['name','ico','legal_form','address','data_box','contact_person','contact_email','contact_phone','website','billing_email','registered_office'].forEach(k=>{const el=$('client_'+k); if(el) state.client[k]=el.value;});
      ['name','email'].forEach(k=>{const el=$('adviser_'+k); if(el) state.adviser[k]=el.value;});
      state.client.contacts = Array.from(document.querySelectorAll('[data-contact-row]')).map(row=>({
        surname_name: row.querySelector('[data-contact="surname_name"]')?.value || '',
        email: row.querySelector('[data-contact="email"]')?.value || '',
        phone: row.querySelector('[data-contact="phone"]')?.value || '',
        insurance_area: row.querySelector('[data-contact="insurance_area"]')?.value || ''
      })).filter(c=>c.surname_name || c.email || c.phone || c.insurance_area);
    }
    if(currentTab==='attachments'){
      state.attachments = Array.from(document.querySelectorAll('[data-attachment-row]')).map(row=>({
        id: row.dataset.attachmentId || ('att_'+Date.now()),
        title: row.querySelector('[data-att="title"]')?.value || '',
        category: row.querySelector('[data-att="category"]')?.value || '',
        required: row.querySelector('[data-att="required"]')?.checked || false,
        status: row.querySelector('[data-att="status"]')?.value || 'chybí',
        note: row.querySelector('[data-att="note"]')?.value || '',
        file_name: row.querySelector('[data-att="file_name"]')?.value || ''
      })).filter(a=>a.title || a.note || a.file_name);
    }
  };

  window.addClientContact = function(){
    ensureEnhancedCase();
    state.client.contacts.push({surname_name:'',email:'',phone:'',insurance_area:''});
    renderWorkspace();
  };
  window.removeClientContact = function(i){
    ensureEnhancedCase();
    state.client.contacts.splice(i,1);
    renderWorkspace();
  };

  window.tabClient = tabClient = function(){
    ensureEnhancedCase();
    const clientRows=clients.length?`<div class="client-results">${clients.map((c,i)=>`<div class="case-row"><div><strong>${esc(c.name)}</strong><small>IČO: ${esc(c.ico||'neuvedeno')} · ${esc(c.address||'')}</small></div><button class="btn secondary" onclick="useClient(${i})">Použít klienta</button></div>`).join('')}</div>`:'';
    const contacts=(state.client.contacts||[]).map((c,i)=>`<div class="contact-row" data-contact-row><label>Příjmení a jméno<input data-contact="surname_name" value="${esc(c.surname_name||'')}" placeholder="např. Novák Jan"></label><label>E-mail<input data-contact="email" value="${esc(c.email||'')}" placeholder="jmeno@firma.cz"></label><label>Telefon<input data-contact="phone" value="${esc(c.phone||'')}" placeholder="+420..."></label><label>Oblast pojištění<input data-contact="insurance_area" value="${esc(c.insurance_area||'')}" placeholder="odpovědnost / majetek / flotila..."></label><button class="btn danger contact-del" onclick="removeClientContact(${i})">Smazat</button></div>`).join('') || '<div class="empty">Zatím není doplněna žádná kontaktní osoba pro jednání.</div>';
    return `<p class="eyebrow">1. Karta klienta</p><div class="client-card-pro"><div><h2>Profesionální karta klienta</h2><p class="muted">Identifikační a kontaktní část klienta. Odborné údaje pro pojištění zůstávají v samostatné kartě pro pojištění.</p></div><div class="client-card-badge">CASE ${esc(state.id||'nový')}</div></div>
    <div class="tools"><input id="clientSearch" class="grow" placeholder="Vyhledat klienta v DB podle názvu nebo IČO"><button class="btn secondary" onclick="searchClients()">Načíst klienta z DB</button></div>${clientRows}
    <div class="section-soft pro-form-block"><p class="eyebrow">Identifikace klienta</p><div class="grid3"><label>Název klienta<input id="client_name" value="${esc(state.client.name)}"></label><label>IČO<div class="inline-field"><input id="client_ico" value="${esc(state.client.ico)}"><button class="btn secondary small" onclick="loadAres()">ARES</button></div></label><label>Právní forma<input id="client_legal_form" value="${esc(state.client.legal_form)}"></label></div><label>Sídlo / adresa<input id="client_address" value="${esc(state.client.address)}"></label><div class="grid4"><label>Datová schránka<input id="client_data_box" value="${esc(state.client.data_box)}"></label><label>Hlavní kontaktní osoba<input id="client_contact_person" value="${esc(state.client.contact_person)}"></label><label>E-mail<input id="client_contact_email" value="${esc(state.client.contact_email)}"></label><label>Telefon<input id="client_contact_phone" value="${esc(state.client.contact_phone)}"></label></div><div class="grid3"><label>Web<input id="client_website" value="${esc(state.client.website)}"></label><label>Fakturační / obecný e-mail<input id="client_billing_email" value="${esc(state.client.billing_email)}"></label><label>Další adresa / poznámka<input id="client_registered_office" value="${esc(state.client.registered_office)}"></label></div><div class="grid2"><label>Poradce<input id="adviser_name" value="${esc(state.adviser.name)}"></label><label>E-mail poradce<input id="adviser_email" value="${esc(state.adviser.email)}"></label></div></div>
    <div class="section-soft"><div class="section-head"><div><h3>Kontaktní osoby pro jednání o pojistné smlouvě ${helpIcon('Zde se evidují osoby klienta, se kterými poradce řeší pojistnou smlouvu. Tyto kontakty se použijí při přípravě poptávky a komunikace.')}</h3><p class="muted">Ke každé osobě uveďte oblast pojištění, které se týká.</p></div><button class="btn secondary" onclick="addClientContact()">+ Přidat kontaktní osobu</button></div><div class="contact-table-pro">${contacts}</div></div>
    <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu klienta</button><button class="btn secondary" onclick="readCurrentTab();currentTab='insurance';renderWorkspace()">Pokračovat na kartu pro pojištění</button></div>`;
  };

  window.defaultAttachmentTypes = function(){
    ensureEnhancedCase();
    return CATALOG.attachmentTypes || [];
  };
  window.ensureDefaultAttachments = function(){
    ensureEnhancedCase();
    defaultAttachmentTypes().forEach(t=>{
      const include = t.scope==='all' || (t.scope==='liability' && (state.risks||[]).some(r=>String(r.risk_key||'').includes('provoz') || String(r.risk_key||'').includes('vadna') || String(r.risk_key||'').includes('vyrobek')));
      if(include && !state.attachments.some(a=>a.id===t.id || a.title===t.title)) state.attachments.push({id:t.id,title:t.title,category:t.category,required:!!t.required,status:'chybí',note:t.note||'',file_name:''});
    });
    renderWorkspace();
  };
  window.addCustomAttachment = function(){ensureEnhancedCase();state.attachments.push({id:'custom_'+Date.now(),title:'Vlastní příloha',category:'Vlastní',required:false,status:'chybí',note:'',file_name:''});renderWorkspace();};
  window.removeAttachment = function(i){ensureEnhancedCase();state.attachments.splice(i,1);renderWorkspace();};
  window.tabAttachments = function(){
    ensureEnhancedCase();
    const rows=(state.attachments||[]).map((a,i)=>`<div class="attachment-row" data-attachment-row data-attachment-id="${esc(a.id||'')}"><label>Název přílohy<input data-att="title" value="${esc(a.title||'')}"></label><label>Kategorie<input data-att="category" value="${esc(a.category||'')}"></label><label>Stav<select data-att="status"><option ${a.status==='chybí'?'selected':''}>chybí</option><option ${a.status==='dodá klient'?'selected':''}>dodá klient</option><option ${a.status==='nahráno'?'selected':''}>nahráno</option><option ${a.status==='zkontrolováno'?'selected':''}>zkontrolováno</option></select></label><label class="check-inline"><input type="checkbox" data-att="required" ${a.required?'checked':''}> povinná</label><label>Soubor / odkaz<input data-att="file_name" value="${esc(a.file_name||'')}" placeholder="název souboru nebo URL"></label><label class="attachment-note">Poznámka<textarea data-att="note">${esc(a.note||'')}</textarea></label><button class="btn danger" onclick="removeAttachment(${i})">Smazat</button></div>`).join('') || '<div class="empty">Zatím nejsou doplněné žádné přílohy.</div>';
    return `<p class="eyebrow">6. Přílohy</p><h2>Přílohy k obchodnímu případu</h2><p class="muted">Základní a produktové přílohy. Poradce může vždy doplnit další přílohu ručně.</p><div class="tools"><button class="btn primary" onclick="ensureDefaultAttachments()">Doplnit povinné přílohy</button><button class="btn secondary" onclick="addCustomAttachment()">+ Vlastní příloha</button><button class="btn secondary" onclick="showView('admin');adminPanel('attachments')">Spravovat číselník příloh</button></div><div class="attachment-board">${rows}</div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit přílohy</button><button class="btn secondary" onclick="currentTab='requests';renderWorkspace()">Pokračovat na poptávky</button></div>`;
  };

  window.propagateOfferField = function(sourceCode, field, value){
    ensureEnhancedCase();
    (state.selected_insurers||[]).forEach(code=>{ if(code!==sourceCode){ ensureOffer(code)[field]=value; }});
    renderWorkspace(); toast('Údaj byl propsán do ostatních pojišťoven.');
  };
  window.setOfferCommonField = function(code, field, value){
    const o=ensureOffer(code); o[field]=value;
    if(['insurance_start','payment_frequency','deductible'].includes(field)){
      if(confirm('Propsat tento údaj i do ostatních pojišťoven?')) propagateOfferField(code, field, value);
    }
  };

  function statusBadge(status){
    const s=String(status||'nutno ověřit');
    const cls=s.includes('splněno')?'ok':s.includes('omezeno')?'warn':s.includes('výluka')?'bad':'check';
    return `<span class="status-badge ${cls}">${esc(s)}</span>`;
  }
  window.statusBadge = statusBadge;

  window.toggleRecommendedInsurer = function(code){
    ensureEnhancedCase();
    state.report.client_selected_offer = state.report.client_selected_offer===code ? '' : code;
    renderWorkspace();
  };

  window.offerCell = offerCell = function(code,r,i){
    const k=r.risk_key||riskKey(r); const o=ensureOffer(code);
    o.risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};
    const x=o.risks[k];
    return `<td class="offer-cell-pro"><select onchange="setOfferRiskStatus('${esc(code)}','${esc(k)}',this.value)"><option ${x.status==='splněno'?'selected':''}>splněno</option><option ${x.status==='omezeno'?'selected':''}>omezeno</option><option ${x.status==='výluka'?'selected':''}>výluka</option><option ${x.status==='nutno ověřit'?'selected':''}>nutno ověřit</option></select><input placeholder="Nabídnutý limit" value="${esc(x.offered_limit)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].offered_limit=this.value"><input placeholder="Spoluúčast" value="${esc(x.deductible)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].deductible=this.value"><textarea placeholder="Výluky / sublimity / zdroj VPP" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].note=this.value">${esc(x.note)}</textarea></td>`;
  };

  window.tabOffers = tabOffers = function(){
    ensureEnhancedCase();
    if(!selectedInsurerCodes().length)return `<p class="eyebrow">8. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven.</div>`;
    if(!state.risks.length)return `<p class="eyebrow">8. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v modulu odpovědnosti nebo v ostatních rizicích.</div>`;
    (state.selected_insurers||[]).forEach(code=>smartOfferDefaults(code));
    const heads=state.selected_insurers.map(code=>{const o=smartOfferDefaults(code);return `<th class="offer-head ${state.report.client_selected_offer===code?'recommended-head':''}"><div class="insurer-title">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div></div>${state.report.client_selected_offer===code?'<div class="recommended-ribbon">DOPORUČENO</div>':''}${offerWorkflowBadge(code)}<button class="btn small secondary" onclick="fulfillAllRisksForInsurer('${esc(code)}')">Tato pojišťovna splňuje vše</button><button class="btn small ${state.report.client_selected_offer===code?'danger':'primary'}" onclick="toggleRecommendedInsurer('${esc(code)}')">${state.report.client_selected_offer===code?'Zrušit doporučení':'Doporučit'}</button><input placeholder="Nabídnuté pojistné" onchange="setOfferCommonField('${esc(code)}','premium',this.value)" value="${esc(o.premium)}"><input placeholder="Počátek pojištění" onchange="setOfferCommonField('${esc(code)}','insurance_start',this.value)" value="${esc(o.insurance_start||state.questionnaire.insurance_start||'')}"><input placeholder="Frekvence placení" onchange="setOfferCommonField('${esc(code)}','payment_frequency',this.value)" value="${esc(o.payment_frequency||state.questionnaire.payment_frequency||'ročně')}"><input placeholder="Celková spoluúčast / pozn." onchange="setOfferCommonField('${esc(code)}','deductible',this.value)" value="${esc(o.deductible||state.questionnaire.deductible_preference||'')}"></th>`}).join('');
    const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||state.questionnaire.deductible_preference||'není uvedena')}<br>${riskSpecification(r)?`<small>Specifikace: ${esc(riskSpecification(r))}</small>`:''}</td>${selectedInsurerCodes().map(code=>offerCell(code,r,i)).join('')}</tr>`).join('');
    return `<p class="eyebrow">8. Smart nabídky</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Při volbě „splněno“ se automaticky doplní požadovaný limit a spoluúčast z poptávky. Základní údaje lze jedním potvrzením propsat do všech pojišťoven.</p><div class="tools"><button class="btn secondary" onclick="smartPrefillAllOffers()">Předvyplnit společné údaje</button><button class="btn secondary" onclick="fulfillAllRisksEverywhere()">Všude nastavit splněno</button></div>${smartRequestTextationBlock('offer')}<div class="table-wrap"><table class="offer-table pro-table"><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button><button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button></div>`;
  };

  window.tabComparison = tabComparison = function(){
    ensureEnhancedCase();
    if(!state.selected_insurers.length||!state.risks.length)return `<p class="eyebrow">9. Porovnání</p><h2>Porovnání zatím nelze sestavit</h2><div class="info-box">Nejdříve doplňte rizika, pojišťovny a nabídky.</div>`;
    const rows=state.risks.map(r=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>${esc(r.requested_limit||'limit neuveden')}</td>${selectedInsurerCodes().map(code=>{const x=ensureOffer(code).risks[r.risk_key]||{};return `<td>${statusBadge(x.status)}<br>Limit: ${esc(x.offered_limit||'–')}<br>Spoluúčast: ${esc(x.deductible||'–')}<br>${esc(x.note||'')}</td>`}).join('')}</tr>`).join('');
    return `<p class="eyebrow">9. Makléřské porovnání</p><h2>Rozdíly mezi nabídkami</h2><div class="warning">Systém pouze zvýrazňuje rozdíly. Doporučení potvrzuje výhradně poradce.</div><div class="table-wrap"><table class="comparison-table pro-table"><thead><tr><th>Riziko / požadavek</th>${state.selected_insurers.map(c=>`<th class="${state.report.client_selected_offer===c?'recommended-head':''}">${esc(c)} ${state.report.client_selected_offer===c?'<span class="recommended-ribbon compact">DOPORUČENO</span>':''}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
  };

  window.tabRecommendation = tabRecommendation = function(){
    ensureEnhancedCase();
    const cards=(state.selected_insurers||[]).map(code=>`<button class="recommend-card ${state.report.client_selected_offer===code?'selected':''}" onclick="toggleRecommendedInsurer('${esc(code)}')"><strong>${esc(insurerByCode(code).name||code)}</strong><span>${state.report.client_selected_offer===code?'✓ DOPORUČENO – kliknutím zrušíte':'Vybrat jako doporučenou variantu'}</span></button>`).join('') || '<div class="empty">Nejdříve vyberte pojišťovny.</div>';
    return `<p class="eyebrow">10. Doporučení poradce</p><h2>Doporučená varianta</h2><p class="muted">Doporučení vždy potvrzuje poradce. Vybraná pojišťovna je zřetelně zvýrazněna a lze ji dalším kliknutím zrušit.</p><div class="recommend-grid">${cards}</div><input type="hidden" id="selected_offer" value="${esc(state.report.client_selected_offer||'')}"><label>Odůvodnění poradce<textarea id="choice_reason">${esc(state.report.client_choice_reason)}</textarea></label><label>Poznámka poradce<textarea id="advisor_note">${esc(state.report.advisor_note)}</textarea></label><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit doporučení</button></div>`;
  };

  const oldRenderAdmin = typeof renderAdmin === 'function' ? renderAdmin : null;
  window.renderAdmin = renderAdmin = function(){
    ensureEnhancedCase();
    const ins=CATALOG.insurers||[], risks=CATALOG.risks||[], acts=CATALOG.activities||[], texts=CATALOG.textTemplates||[], atts=CATALOG.attachmentTypes||[];
    $('adminBox').innerHTML=`<div class="metric-grid"><div><b>${ins.length}</b><span>pojišťoven</span></div><div><b>${risks.length}</b><span>rizik</span></div><div><b>${acts.length}</b><span>činností</span></div><div><b>${texts.length}</b><span>textací</span></div><div><b>${atts.length}</b><span>příloh</span></div></div><div class="admin-tabs"><button class="chip active" onclick="adminPanel('insurers')">Pojišťovny</button><button class="chip" onclick="adminPanel('attachments')">Přílohy</button><button class="chip" onclick="adminPanel('advisers')">Poradci</button><button class="chip" onclick="adminPanel('activities')">Typy klientů / činnosti</button><button class="chip" onclick="adminPanel('risks')">Rizika</button><button class="chip" onclick="adminPanel('riskModel')">Rizikový model</button><button class="chip" onclick="adminPanel('texts')">Textace</button><button class="chip" onclick="adminPanel('documents')">Dokumenty</button><button class="chip" onclick="adminPanel('json')">Import / export JSON</button></div><div id="adminPanel"></div>`;
    adminPanel('insurers');
  };

  const oldAdminPanel = typeof adminPanel === 'function' ? adminPanel : function(){};
  window.adminPanel = adminPanel = function(type){
    document.querySelectorAll('.admin-tabs .chip').forEach(b=>b.classList.remove('active'));
    const box=$('adminPanel'); if(!box) return;
    if(type==='insurers'){
      box.innerHTML=`<h2>Pojišťovny v číselníku</h2><p class="muted">Rozšířený číselník pojišťoven pro poptávky, nabídky a komunikaci.</p><div class="table-wrap"><table class="admin-wide-table"><thead><tr><th>Zkratka</th><th>Název</th><th>IČO</th><th>Adresa</th><th>E-mail</th><th>Web / portál</th><th>Aktivní</th></tr></thead><tbody>${(CATALOG.insurers||[]).map((i,idx)=>`<tr><td><input onchange="CATALOG.insurers[${idx}].code=this.value;CATALOG.insurers[${idx}].short=this.value" value="${esc(insurerCode(i)||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].name=this.value" value="${esc(i.name||'')}"></td><td><div class="inline-field"><input onchange="CATALOG.insurers[${idx}].ico=this.value" value="${esc(i.ico||'')}"><button class="btn secondary small" onclick="toast('ARES pro pojišťovny bude napojen v další integrační vrstvě.')">ARES</button></div></td><td><textarea onchange="CATALOG.insurers[${idx}].address=this.value">${esc(i.address||'')}</textarea></td><td><input onchange="CATALOG.insurers[${idx}].email=this.value;CATALOG.insurers[${idx}].request_email=this.value" value="${esc(i.email||i.request_email||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].portal=this.value;CATALOG.insurers[${idx}].web=this.value" value="${esc(i.portal||i.url||i.web||'')}"></td><td><select onchange="CATALOG.insurers[${idx}].active=this.value==='ano'"><option ${i.active!==false?'selected':''}>ano</option><option ${i.active===false?'selected':''}>ne</option></select></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.insurers.push({code:'',short:'',name:'',ico:'',address:'',email:'',request_email:'',portal:'',web:'',active:true});adminPanel('insurers')">+ Přidat pojišťovnu</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
      return;
    }
    if(type==='attachments'){
      ensureEnhancedCase();
      box.innerHTML=`<h2>Číselník příloh</h2><p class="muted">Admin může spravovat základní i produktové povinné přílohy. Poradce může v případu vždy doplnit další vlastní přílohu.</p><div class="table-wrap"><table><thead><tr><th>ID</th><th>Název</th><th>Kategorie</th><th>Rozsah</th><th>Povinná</th><th>Nápověda</th><th></th></tr></thead><tbody>${(CATALOG.attachmentTypes||[]).map((a,idx)=>`<tr><td><input onchange="CATALOG.attachmentTypes[${idx}].id=this.value" value="${esc(a.id||'')}"></td><td><input onchange="CATALOG.attachmentTypes[${idx}].title=this.value" value="${esc(a.title||'')}"></td><td><input onchange="CATALOG.attachmentTypes[${idx}].category=this.value" value="${esc(a.category||'')}"></td><td><select onchange="CATALOG.attachmentTypes[${idx}].scope=this.value"><option ${a.scope==='all'?'selected':''} value="all">obecné</option><option ${a.scope==='liability'?'selected':''} value="liability">odpovědnost</option><option ${a.scope==='property'?'selected':''} value="property">majetek</option><option ${a.scope==='custom'?'selected':''} value="custom">vlastní</option></select></td><td><input type="checkbox" ${a.required?'checked':''} onchange="CATALOG.attachmentTypes[${idx}].required=this.checked"></td><td><textarea onchange="CATALOG.attachmentTypes[${idx}].note=this.value">${esc(a.note||'')}</textarea></td><td><button class="btn danger" onclick="CATALOG.attachmentTypes.splice(${idx},1);adminPanel('attachments')">Smazat</button></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.attachmentTypes.push({id:'att_'+Date.now(),title:'Nová příloha',category:'Vlastní',scope:'custom',required:false,note:''});adminPanel('attachments')">+ Přidat přílohu</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit přílohy</button></div>`;
      return;
    }
    oldAdminPanel(type);
  };

  const oldSaveAdminCatalog = typeof saveAdminCatalog === 'function' ? saveAdminCatalog : null;
  window.saveAdminCatalog = saveAdminCatalog = async function(){
    try{
      normalizeCatalog(); ensureEnhancedCase();
      const payload={insurers:CATALOG.insurers, advisers:CATALOG.advisers, requirementTypes:CATALOG.requirementTypes, coverageDictionary:CATALOG.coverageDictionary, policyReferences:CATALOG.policyReferences, risks:CATALOG.risks, activities:CATALOG.activities, riskModel:CATALOG.riskModel, textTemplates:CATALOG.textTemplates, attachmentTypes:CATALOG.attachmentTypes, actor_email:state.adviser.email||''};
      const data=await fetchJson('/api/admin/catalogs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      toast(data.message||'Admin číselníky uloženy.'); renderAll();
    }catch(e){toast('Admin se nepodařilo uložit: '+e.message);}
  };

  const oldRenderWorkspace = typeof renderWorkspace === 'function' ? renderWorkspace : null;
  window.renderWorkspace = renderWorkspace = function(){
    ensureEnhancedCase();
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab));
    const map={client:tabClient,insurance:tabInsurance,liability:tabLiability,risks:tabRisks,insurers:tabInsurers,attachments:tabAttachments,requests:tabInsurerRequests,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit};
    if($('tabContent')) $('tabContent').innerHTML=(map[currentTab]||tabClient)();
    renderHeader();
  };

  const oldRenderAll = typeof renderAll === 'function' ? renderAll : null;
  window.renderAll = renderAll = function(){ ensureEnhancedCase(); if(oldRenderAll) oldRenderAll(); };
})();


/* ==========================================================
   Business Risk Hub 4.9.8 – Release Identity Fix & Visible Build Check
   Bezpečný patch nad funkční větví: nepřepisuje DB destruktivně,
   pouze rozšiřuje klientský payload a Admin číselníky.
   ========================================================== */
(function(){
  function safeArray(v){ return Array.isArray(v) ? v : []; }
  function ensure350(){
    state.client ||= {};
    state.client.contacts = safeArray(state.client.contacts);
    state.attachments = safeArray(state.attachments);
    state.permissions ||= {};
    CATALOG.attachmentTypes = safeArray(CATALOG.attachmentTypes);
    CATALOG.users = safeArray(CATALOG.users);
    CATALOG.roleProfiles = safeArray(CATALOG.roleProfiles);
    CATALOG.modulePermissions = safeArray(CATALOG.modulePermissions);
    if(!CATALOG.attachmentTypes.length){
      CATALOG.attachmentTypes = [
        {id:'plna_moc', title:'Plná moc', category:'Základní', scope:'all', required:true, note:'Plná moc klienta pro jednání s pojišťovnami a získání podkladů.'},
        {id:'vypis_or', title:'Výpis z OR', category:'Základní', scope:'all', required:true, note:'Aktuální výpis z obchodního rejstříku nebo obdobný identifikační doklad.'},
        {id:'skodni_prubeh', title:'Škodní průběh', category:'Pojištění odpovědnosti', scope:'liability', required:true, note:'Škodní průběh za poslední období dle požadavku pojišťovny.'},
        {id:'seznam_cinnosti', title:'Seznam činností klienta', category:'Pojištění odpovědnosti', scope:'liability', required:false, note:'Detailní seznam činností, které mají být zahrnuty do odpovědnostního programu.'}
      ];
    }
    if(!CATALOG.roleProfiles.length){
      CATALOG.roleProfiles = [
        {code:'PORADCE', name:'Poradce'}, {code:'SPECIALISTA', name:'Specialista'}, {code:'BACKOFFICE', name:'Backoffice'}, {code:'MANAGEMENT', name:'Management'}, {code:'ADMIN', name:'Administrátor'}
      ];
    }
    if(!CATALOG.users.length){
      CATALOG.users = (CATALOG.advisers||[]).slice(0,20).map((a,i)=>({
        id:a.id||String(i+1), name:a.name||a.full_name||'', email:a.email||'', position:a.position||'Poradce', roles:a.roles||['PORADCE'], active:a.active!==false
      }));
      if(!CATALOG.users.length) CATALOG.users.push({id:'admin',name:'Administrátor ASTORIE',email:'admin@astorie.local',position:'Administrátor',roles:['ADMIN'],active:true});
    }
    if(!CATALOG.modulePermissions.length){
      CATALOG.modulePermissions = defaultModulePermissions350();
    }
  }
  window.ensure350 = ensure350;

  function defaultModulePermissions350(){
    const roles=['PORADCE','SPECIALISTA','BACKOFFICE','MANAGEMENT','ADMIN'];
    const defs=[
      ['dashboard','Dashboard'],['cases','Obchodní případy'],['workspace','Pracovní prostor'],['client','Karta klienta'],['insurance','Karta pro pojištění'],['liability','Modul odpovědnosti'],['attachments','Přílohy'],['requests','Poptávky pojišťovnám'],['offers','Nabídky'],['comparison','Porovnání'],['recommendation','Doporučení poradce'],['output','Klientský výstup'],['documents','Dokumenty'],['textations','Textace'],['riskModel','Rizikový model'],['admin','Admin']
    ];
    return defs.map(([module,label])=>{
      const row={module,label};
      roles.forEach(role=>{
        const isAdmin=role==='ADMIN';
        const isMgmt=role==='MANAGEMENT';
        const adminOnly=['admin','riskModel'].includes(module);
        row[role]={view:isAdmin || (!adminOnly && role!=='MANAGEMENT') || isMgmt, edit:isAdmin || (['cases','workspace','client','insurance','liability','attachments','requests','offers','comparison','recommendation','output','textations'].includes(module)&&!isMgmt), delete:isAdmin, export:isAdmin||isMgmt||['PORADCE','SPECIALISTA','BACKOFFICE'].includes(role), approve:isAdmin||role==='SPECIALISTA'||role==='BACKOFFICE'};
      });
      return row;
    });
  }

  const oldNormalizeCatalog350 = normalizeCatalog;
  window.normalizeCatalog = normalizeCatalog = function(){
    oldNormalizeCatalog350();
    CATALOG.attachmentTypes = safeArray(CATALOG.attachmentTypes);
    CATALOG.users = safeArray(CATALOG.users);
    CATALOG.roleProfiles = safeArray(CATALOG.roleProfiles);
    CATALOG.modulePermissions = safeArray(CATALOG.modulePermissions);
    ensure350();
  };

  const oldNormalizeCase350 = normalizeCase;
  window.normalizeCase = normalizeCase = function(item){
    const s = oldNormalizeCase350(item);
    s.client ||= {};
    s.client.contacts = safeArray(s.client.contacts);
    s.attachments = safeArray(s.attachments);
    return s;
  };

  const oldBlankCase350 = blankCase;
  window.blankCase = blankCase = function(){
    const s = oldBlankCase350();
    s.client ||= {};
    s.client.contacts = safeArray(s.client.contacts);
    s.attachments = safeArray(s.attachments);
    return s;
  };

  function help350(txt){ return `<span class="help-mini" tabindex="0">i<span>${esc(txt||'Nápověda není doplněna.')}</span></span>`; }
  window.help350 = help350;

  const oldReadCurrentTab350 = readCurrentTab;
  window.readCurrentTab = readCurrentTab = function(){
    ensure350();
    oldReadCurrentTab350();
    if(currentTab==='client'){
      state.client.contacts = Array.from(document.querySelectorAll('[data-contact-row]')).map(row=>({
        surname_name: row.querySelector('[data-contact="surname_name"]')?.value || '',
        email: row.querySelector('[data-contact="email"]')?.value || '',
        phone: row.querySelector('[data-contact="phone"]')?.value || '',
        insurance_area: row.querySelector('[data-contact="insurance_area"]')?.value || ''
      })).filter(c=>c.surname_name || c.email || c.phone || c.insurance_area);
    }
    if(currentTab==='attachments'){
      state.attachments = Array.from(document.querySelectorAll('[data-attachment-row]')).map(row=>({
        id: row.dataset.attachmentId || ('att_'+Date.now()),
        title: row.querySelector('[data-att="title"]')?.value || '',
        category: row.querySelector('[data-att="category"]')?.value || '',
        required: row.querySelector('[data-att="required"]')?.checked || false,
        status: row.querySelector('[data-att="status"]')?.value || 'chybí',
        note: row.querySelector('[data-att="note"]')?.value || '',
        file_name: row.querySelector('[data-att="file_name"]')?.value || ''
      })).filter(a=>a.title || a.note || a.file_name);
    }
  };

  window.addClientContact = function(){ ensure350(); state.client.contacts.push({surname_name:'',email:'',phone:'',insurance_area:''}); renderWorkspace(); };
  window.removeClientContact = function(i){ ensure350(); state.client.contacts.splice(i,1); renderWorkspace(); };

  window.tabClient = tabClient = function(){
    ensure350();
    const clientRows=clients.length?`<div class="client-results">${clients.map((c,i)=>`<div class="case-row"><div><strong>${esc(c.name)}</strong><small>IČO: ${esc(c.ico||'neuvedeno')} · ${esc(c.address||'')}</small></div><button class="btn secondary" onclick="useClient(${i})">Použít klienta</button></div>`).join('')}</div>`:'';
    const contacts=(state.client.contacts||[]).map((c,i)=>`<div class="contact-card-pro" data-contact-row><label>Příjmení a jméno<input data-contact="surname_name" value="${esc(c.surname_name||'')}" placeholder="např. Novák Jan"></label><label>E-mail<input data-contact="email" value="${esc(c.email||'')}" placeholder="jmeno@firma.cz"></label><label>Telefon<input data-contact="phone" value="${esc(c.phone||'')}" placeholder="+420..."></label><label>Oblast pojištění<input data-contact="insurance_area" value="${esc(c.insurance_area||'')}" placeholder="odpovědnost / majetek / flotila"></label><button class="btn danger" onclick="removeClientContact(${i})">Smazat</button></div>`).join('') || '<div class="empty">Zatím není doplněna žádná kontaktní osoba pro jednání.</div>';
    return `<p class="eyebrow">1. Karta klienta</p><div class="client-card-pro premium"><div><h2>Profesionální karta klienta</h2><p class="muted">Identifikace klienta, kontakty pro jednání a základní obchodní vazby. Odborná pojistná data jsou oddělená v kartě pro pojištění.</p></div><div class="client-card-badge">CASE ${esc(state.id||'nový')}</div></div>
    <div class="tools"><input id="clientSearch" class="grow" placeholder="Vyhledat klienta v DB podle názvu nebo IČO"><button class="btn secondary" onclick="searchClients()">Načíst klienta z DB</button></div>${clientRows}
    <div class="section-soft pro-form-block"><p class="eyebrow">Identifikace klienta</p><div class="grid3"><label>Název klienta<input id="client_name" value="${esc(state.client.name)}"></label><label>IČO<div class="inline-field"><input id="client_ico" value="${esc(state.client.ico)}"><button class="btn secondary small" onclick="loadAres()">ARES</button></div></label><label>Právní forma<input id="client_legal_form" value="${esc(state.client.legal_form)}"></label></div><label>Sídlo / adresa<input id="client_address" value="${esc(state.client.address)}"></label><div class="grid4"><label>Datová schránka<input id="client_data_box" value="${esc(state.client.data_box)}"></label><label>Hlavní kontaktní osoba<input id="client_contact_person" value="${esc(state.client.contact_person)}"></label><label>E-mail<input id="client_contact_email" value="${esc(state.client.contact_email)}"></label><label>Telefon<input id="client_contact_phone" value="${esc(state.client.contact_phone)}"></label></div><div class="grid3"><label>Web<input id="client_website" value="${esc(state.client.website)}"></label><label>Fakturační / obecný e-mail<input id="client_billing_email" value="${esc(state.client.billing_email)}"></label><label>Další adresa / poznámka<input id="client_registered_office" value="${esc(state.client.registered_office)}"></label></div><div class="grid2"><label>Poradce<input id="adviser_name" value="${esc(state.adviser.name)}"></label><label>E-mail poradce<input id="adviser_email" value="${esc(state.adviser.email)}"></label></div></div>
    <div class="section-soft"><div class="section-head"><div><h3>Kontaktní osoby pro jednání o pojistné smlouvě ${help350('Ke klientovi lze vést více osob pro různá pojištění. Tyto kontakty se použijí v poptávce a komunikaci, ale poradce může vždy vybrat relevantní osobu.')}</h3><p class="muted">Přidávejte a mažte osoby podle skutečné komunikace s klientem.</p></div><button class="btn secondary" onclick="addClientContact()">+ Přidat kontaktní osobu</button></div><div class="contact-grid-pro">${contacts}</div></div>
    <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu klienta</button><button class="btn secondary" onclick="readCurrentTab();currentTab='insurance';renderWorkspace()">Pokračovat na kartu pro pojištění</button></div>`;
  };

  function attachmentDefaultsForCase(){
    ensure350();
    const hasLiability = (state.risks||[]).some(r=>['provoz','vadna_prace','vyrobek','prevzate_veci','smluvni_odpovednost'].includes(String(r.risk_key||'')));
    return (CATALOG.attachmentTypes||[]).filter(t=>t.scope==='all' || (t.scope==='liability' && hasLiability));
  }
  window.ensureDefaultAttachments = function(){
    ensure350();
    attachmentDefaultsForCase().forEach(t=>{
      if(!state.attachments.some(a=>a.id===t.id || a.title===t.title)) state.attachments.push({id:t.id,title:t.title,category:t.category,required:!!t.required,status:'chybí',note:t.note||'',file_name:''});
    });
    renderWorkspace();
    toast('Doplněny povinné přílohy podle případu.');
  };
  window.addCustomAttachment = function(){ ensure350(); state.attachments.push({id:'custom_'+Date.now(),title:'Vlastní příloha',category:'Vlastní',required:false,status:'chybí',note:'',file_name:''}); renderWorkspace(); };
  window.removeAttachment = function(i){ ensure350(); state.attachments.splice(i,1); renderWorkspace(); };
  function attStatusBadge(status){
    const s=String(status||'chybí').toLowerCase();
    const cls=s.includes('nahr')||s.includes('zkontrol')?'ok':s.includes('dod')?'warn':'bad';
    return `<span class="att-status ${cls}">${esc(status||'chybí')}</span>`;
  }
  window.tabAttachments = function(){
    ensure350();
    const defaults=attachmentDefaultsForCase();
    const rows=(state.attachments||[]).map((a,i)=>`<div class="attachment-card-pro" data-attachment-row data-attachment-id="${esc(a.id||'')}"><div><strong>${esc(a.title||'Příloha')}</strong>${a.required?'<span class="badge">povinná</span>':''}<small>${esc(a.category||'')}</small>${attStatusBadge(a.status)}</div><label>Název<input data-att="title" value="${esc(a.title||'')}"></label><label>Kategorie<input data-att="category" value="${esc(a.category||'')}"></label><label>Stav<select data-att="status"><option ${a.status==='chybí'?'selected':''}>chybí</option><option ${a.status==='dodá klient'?'selected':''}>dodá klient</option><option ${a.status==='nahráno'?'selected':''}>nahráno</option><option ${a.status==='zkontrolováno'?'selected':''}>zkontrolováno</option></select></label><label class="check-inline"><input type="checkbox" data-att="required" ${a.required?'checked':''}> povinná</label><label>Soubor / odkaz<input data-att="file_name" value="${esc(a.file_name||'')}" placeholder="název souboru nebo URL"></label><label class="attachment-note">Poznámka<textarea data-att="note">${esc(a.note||'')}</textarea></label><button class="btn danger" onclick="removeAttachment(${i})">Smazat</button></div>`).join('') || '<div class="empty">Zatím nejsou doplněné žádné přílohy.</div>';
    const chips=defaults.map(d=>`<span class="attachment-chip ${d.required?'required':''}">${esc(d.title)} ${help350(d.note||'')}</span>`).join('');
    return `<p class="eyebrow">6. Přílohy</p><h2>Přílohy k obchodnímu případu</h2><p class="muted">Základní přílohy: Plná moc, Výpis z OR. Produktové přílohy se doplňují podle typu pojištění. Poradce může vždy přidat vlastní přílohu.</p><div class="section-soft"><h3>Doporučené / povinné přílohy pro tento případ</h3><div class="attachment-chip-row">${chips || '<span class="muted">Zatím není doporučena žádná příloha.</span>'}</div></div><div class="tools"><button class="btn primary" onclick="ensureDefaultAttachments()">Doplnit povinné přílohy</button><button class="btn secondary" onclick="addCustomAttachment()">+ Vlastní příloha</button></div><div class="attachment-list-pro">${rows}</div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit přílohy</button><button class="btn secondary" onclick="currentTab='requests';renderWorkspace()">Pokračovat na poptávky</button></div>`;
  };

  window.deleteCase = async function(id){
    if(!id) return;
    if(!confirm('Opravdu chcete obchodní případ odstranit z aktivního přehledu? Půjde o bezpečné soft delete, ne fyzické smazání DB.')) return;
    try{
      const data=await fetchJson(`/api/inquiries/${Number(id)}/delete`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actor_email:state.adviser?.email||'',actor_role:'admin'})});
      toast(data.message||'Obchodní případ byl odstraněn z aktivního přehledu.');
      if(state.id===id) newCase(false);
      await loadCases(false); renderAll();
    }catch(e){toast('Odstranění případu se nepodařilo: '+e.message);}
  };
  window.caseRow = function(c){
    return `<div class="case-row"><div><strong>${esc(c.client_name||c.title||'Bez názvu')}</strong><small>CASE_ID #${esc(c.id)} · ${esc(c.activity_name||'bez typu činnosti')} · ${esc(c.status||'rozpracováno')} · pojišťovny: ${esc(c.selected_insurer_count||0)} · nabídky: ${esc(c.offer_count||0)}</small></div><div class="row-actions"><button class="btn primary" onclick="openCase(${Number(c.id)})">Otevřít</button><button class="btn danger" onclick="deleteCase(${Number(c.id)})">Smazat</button></div></div>`;
  };

  window.renderAdmin = function(){
    ensure350();
    const ins=CATALOG.insurers||[], users=CATALOG.users||[], roles=CATALOG.roleProfiles||[], perms=CATALOG.modulePermissions||[], atts=CATALOG.attachmentTypes||[];
    $('adminBox').innerHTML=`<div class="metric-grid"><div><b>${users.length}</b><span>uživatelů</span></div><div><b>${roles.length}</b><span>pozic</span></div><div><b>${perms.length}</b><span>modulů práv</span></div><div><b>${ins.length}</b><span>pojišťoven</span></div><div><b>${atts.length}</b><span>typů příloh</span></div></div><div class="admin-tabs"><button class="chip active" onclick="adminPanel('users')">Uživatelé</button><button class="chip" onclick="adminPanel('permissions')">Oprávnění / pozice</button><button class="chip" onclick="adminPanel('insurers')">Pojišťovny</button><button class="chip" onclick="adminPanel('attachments')">Přílohy</button><button class="chip" onclick="adminPanel('texts')">Textace</button><button class="chip" onclick="adminPanel('riskModel')">Rizikový model</button><button class="chip" onclick="adminPanel('json')">Import / export JSON</button></div><div id="adminPanel"></div>`;
    adminPanel('users');
  };

  const oldAdminPanel350 = adminPanel;
  window.adminPanel = function(type){
    ensure350();
    document.querySelectorAll('.admin-tabs .chip').forEach(b=>b.classList.remove('active'));
    const box=$('adminPanel'); if(!box) return;
    if(type==='users'){
      box.innerHTML=`<h2>Uživatelé a role</h2><p class="muted">Správa uživatelů včetně pozic a rolí. Jeden uživatel může mít více rolí.</p><div class="table-wrap"><table class="admin-users-table"><thead><tr><th>ID</th><th>Jméno</th><th>E-mail</th><th>Pozice</th><th>Role</th><th>Aktivní</th><th></th></tr></thead><tbody>${(CATALOG.users||[]).map((u,idx)=>`<tr><td><input value="${esc(u.id||'')}" onchange="CATALOG.users[${idx}].id=this.value"></td><td><input value="${esc(u.name||'')}" onchange="CATALOG.users[${idx}].name=this.value"></td><td><input value="${esc(u.email||'')}" onchange="CATALOG.users[${idx}].email=this.value"></td><td><select onchange="CATALOG.users[${idx}].position=this.value"><option></option>${CATALOG.roleProfiles.map(r=>`<option ${u.position===r.name?'selected':''}>${esc(r.name)}</option>`).join('')}</select></td><td><div class="role-checks">${CATALOG.roleProfiles.map(r=>`<label><input type="checkbox" ${safeArray(u.roles).includes(r.code)?'checked':''} onchange="toggleUserRole(${idx},'${esc(r.code)}',this.checked)"> ${esc(r.code)}</label>`).join('')}</div></td><td><input type="checkbox" ${u.active!==false?'checked':''} onchange="CATALOG.users[${idx}].active=this.checked"></td><td><button class="btn danger" onclick="CATALOG.users.splice(${idx},1);adminPanel('users')">Smazat</button></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.users.push({id:'u_'+Date.now(),name:'',email:'',position:'Poradce',roles:['PORADCE'],active:true});adminPanel('users')">+ Nový uživatel</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit uživatele</button></div>`;
      return;
    }
    if(type==='permissions'){
      const actions=[['view','vidí'],['edit','edí'],['delete','maže'],['export','exportuje'],['approve','schvaluje']];
      box.innerHTML=`<h2>Oprávnění podle pozic</h2><p class="muted">Zaklikněte, co může daná pozice vidět nebo provádět. Oranžově označená administrátorská práva používejte opatrně.</p><div class="table-wrap"><table class="permissions-table"><thead><tr><th>Modul</th>${CATALOG.roleProfiles.map(r=>`<th>${esc(r.name||r.code)}</th>`).join('')}</tr></thead><tbody>${(CATALOG.modulePermissions||[]).map((m,mi)=>`<tr><td><b>${esc(m.label||m.module)}</b><small>${esc(m.module)}</small></td>${CATALOG.roleProfiles.map(r=>`<td>${actions.map(([a,l])=>`<label class="perm"><input type="checkbox" ${m[r.code]?.[a]?'checked':''} onchange="setPermission(${mi},'${esc(r.code)}','${a}',this.checked)"> ${l}</label>`).join('')}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.modulePermissions.push({module:'novy_modul',label:'Nový modul'});adminPanel('permissions')">+ Přidat modul práv</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit oprávnění</button></div>`;
      return;
    }
    if(type==='attachments'){
      box.innerHTML=`<h2>Číselník příloh</h2><p class="muted">Admin spravuje základní i produktové přílohy. Poradce v případu může vždy doplnit další vlastní přílohu.</p><div class="table-wrap"><table><thead><tr><th>ID</th><th>Název</th><th>Kategorie</th><th>Rozsah</th><th>Povinná</th><th>Nápověda</th><th></th></tr></thead><tbody>${(CATALOG.attachmentTypes||[]).map((a,idx)=>`<tr><td><input onchange="CATALOG.attachmentTypes[${idx}].id=this.value" value="${esc(a.id||'')}"></td><td><input onchange="CATALOG.attachmentTypes[${idx}].title=this.value" value="${esc(a.title||'')}"></td><td><input onchange="CATALOG.attachmentTypes[${idx}].category=this.value" value="${esc(a.category||'')}"></td><td><select onchange="CATALOG.attachmentTypes[${idx}].scope=this.value"><option ${a.scope==='all'?'selected':''} value="all">obecné</option><option ${a.scope==='liability'?'selected':''} value="liability">odpovědnost</option><option ${a.scope==='property'?'selected':''} value="property">majetek</option><option ${a.scope==='custom'?'selected':''} value="custom">vlastní</option></select></td><td><input type="checkbox" ${a.required?'checked':''} onchange="CATALOG.attachmentTypes[${idx}].required=this.checked"></td><td><textarea onchange="CATALOG.attachmentTypes[${idx}].note=this.value">${esc(a.note||'')}</textarea></td><td><button class="btn danger" onclick="CATALOG.attachmentTypes.splice(${idx},1);adminPanel('attachments')">Smazat</button></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.attachmentTypes.push({id:'att_'+Date.now(),title:'Nová příloha',category:'Vlastní',scope:'custom',required:false,note:''});adminPanel('attachments')">+ Přidat přílohu</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit přílohy</button></div>`;
      return;
    }
    oldAdminPanel350(type);
  };
  window.toggleUserRole = function(idx,role,checked){ ensure350(); const u=CATALOG.users[idx]; u.roles=safeArray(u.roles); if(checked && !u.roles.includes(role)) u.roles.push(role); if(!checked) u.roles=u.roles.filter(r=>r!==role); };
  window.setPermission = function(mi,role,action,checked){ ensure350(); const m=CATALOG.modulePermissions[mi]; m[role] ||= {}; m[role][action]=checked; };

  const oldSaveAdminCatalog350 = saveAdminCatalog;
  window.saveAdminCatalog = async function(){
    try{
      normalizeCatalog(); ensure350();
      const payload={
        insurers:CATALOG.insurers, advisers:CATALOG.advisers, requirementTypes:CATALOG.requirementTypes, coverageDictionary:CATALOG.coverageDictionary, policyReferences:CATALOG.policyReferences,
        risks:CATALOG.risks, activities:CATALOG.activities, riskModel:CATALOG.riskModel, textTemplates:CATALOG.textTemplates,
        attachmentTypes:CATALOG.attachmentTypes, users:CATALOG.users, modulePermissions:CATALOG.modulePermissions, roleProfiles:CATALOG.roleProfiles,
        actor_email:state.adviser?.email||''
      };
      const data=await fetchJson('/api/admin/catalogs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      toast(data.message||'Admin číselníky byly uloženy.'); renderAll();
    }catch(e){toast('Admin se nepodařilo uložit: '+e.message);}
  };

  const oldRenderWorkspace350 = renderWorkspace;
  window.renderWorkspace = function(){
    ensure350();
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab));
    const map={client:tabClient,insurance:tabInsurance,liability:tabLiability,risks:tabRisks,insurers:tabInsurers,attachments:tabAttachments,requests:tabInsurerRequests,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit};
    if($('tabContent')) $('tabContent').innerHTML=(map[currentTab]||tabClient)();
    renderHeader();
  };

  const oldRenderAll350 = renderAll;
  window.renderAll = function(){ ensure350(); oldRenderAll350(); };
})();

/* ==========================================================
   Business Risk Hub 4.9.8 – Release Identity Fix & Visible Build Check
   Cíl: opravit regresi poptávek/porovnání/exportů bez zásahu do DB.
   - Porovnání renderuje pouze compare engine, ne poptávky.
   - Poptávky mají jen jeden vizuální blok pro každou pojišťovnu.
   - PDF/XLS export iteruje všechna dynamická rizika z CASE_ID.
   - Doporučená varianta má viditelný a zrušitelný stav.
   ========================================================== */
(function(){
  const VERSION_351 = '4.0.2';

  function riskId351(r){
    return String((r && (r.risk_key || r.key || r.id || r.name)) || '').trim();
  }
  function displayInsurer351(code){
    const raw = String(code||'').trim();
    const list = CATALOG.insurers || [];
    const ins = list.find(i => String(insurerCode(i)||'').toLowerCase() === raw.toLowerCase())
      || list.find(i => String(i.name||i.title||'').toLowerCase() === raw.toLowerCase())
      || insurerByCode(raw) || {};
    const cleanCode = String(ins.code || ins.shortcut || ins.zkratka || raw || '').trim();
    const cleanName = String(ins.name || ins.title || raw || cleanCode || '').trim();
    return { code: cleanCode, name: cleanName, email: ins.email || ins.request_email || '', portal: ins.portal || ins.web || ins.url || '', ico: ins.ico || '', address: ins.address || '' };
  }
  function canonicalSelectedInsurers351(){
    const seen = new Set();
    const out = [];
    (state.selected_insurers || []).forEach(code => {
      const d = displayInsurer351(code);
      const key = String(d.code || d.name || code).toLowerCase();
      if(!seen.has(key)){ seen.add(key); out.push(d.code || code); }
    });
    state.selected_insurers = out;
    return out;
  }

  function offerRisk351(code, r){
    const o = ensureOffer(code);
    o.risks ||= {};
    const key = riskId351(r);
    o.risks[key] ||= {status:'nutno ověřit', offered_limit:'', deductible:'', note:'', sublimits:'', exclusions:'', source_reference:''};
    return o.risks[key];
  }
  function allRequestRisks351(){
    return (state.risks || []).filter(r => (r && (norm(r.name)||norm(r.risk_key)||norm(r.requested_limit)||norm(r.specification)||norm(r.client_note))));
  }
  function allAgreements351(){
    return (state.liability_agreements || []).filter(a => norm(a.title)||norm(a.text)||norm(a.limit));
  }
  function contactRows351(){
    const base = [];
    if(state.client?.contact_person || state.client?.contact_email || state.client?.contact_phone){
      base.push({surname_name:state.client.contact_person||'', email:state.client.contact_email||'', phone:state.client.contact_phone||'', insurance_area:'hlavní kontakt'});
    }
    (state.client?.contacts || []).forEach(c=>base.push(c));
    return base.filter(c=>norm(c.surname_name)||norm(c.email)||norm(c.phone)||norm(c.insurance_area));
  }
  function requestDataRows351(){
    const q=state.questionnaire||{}, c=state.client||{};
    const contacts = contactRows351().map(c=>[c.surname_name, c.email, c.phone, c.insurance_area].filter(Boolean).join(' · ')).join('\n');
    const rows=[
      ['Klient',c.name],['IČO',c.ico],['Adresa',c.address],['Kontaktní osoby pro jednání', contacts],
      ['Typ činnosti',state.activity?.name],['Detail činnosti',q.main_activity_detail],['Vedlejší činnosti',q.side_activities],
      ['Obrat',q.turnover],['Zaměstnanci',q.employees],['Území',q.territory],['Počátek pojištění',q.insurance_start],
      ['Pojistné období',q.insurance_period],['Frekvence placení',q.payment_frequency],['Export / zahraničí',q.annual_revenue_breakdown||q.export_info],
      ['Provozovny',q.locations],['Škodní průběh',q.claims_history],['Současné pojištění',q.current_insurance],
      ['Požadovaný rozsah',q.requested_scope],['Preferovaná spoluúčast',q.deductible_preference],['Speciální poznámka',q.special_notes]
    ];
    return rows.filter(r=>norm(r[1]));
  }
  function attachmentSummary351(){
    const arr = state.attachments || [];
    if(!arr.length) return '';
    const rows = arr.map(a=>`<tr><td>${esc(a.title||'')}</td><td>${esc(a.category||'')}</td><td>${esc(a.required?'ano':'ne')}</td><td>${esc(a.status||'chybí')}</td><td>${esc(a.file_name||a.note||'')}</td></tr>`).join('');
    return `<h3>Přílohy / podklady</h3><table><thead><tr><th>Příloha</th><th>Kategorie</th><th>Povinná</th><th>Stav</th><th>Poznámka / soubor</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function textationsHtml351(target){
    const list = (typeof selectedTextations === 'function' ? selectedTextations(target) : []).filter(Boolean);
    return list.map(t=>`<h4>${esc(t.title||'Textace')}</h4><p>${esc(textationContent(t)).replace(/\n/g,'<br>')}</p>`).join('');
  }

  window.insurerRequestHtml = insurerRequestHtml = function(code, forPrint=false){
    const ins = displayInsurer351(code);
    const req = ensureInsurerRequest(code);
    const rows = requestDataRows351();
    const risks = allRequestRisks351().map(r=>`<tr><td>${esc(r.name||r.label||r.risk_key||'')}</td><td>${esc(r.requested_limit||r.limit||'')}</td><td>${esc(r.deductible||state.questionnaire?.deductible_preference||'')}</td><td>${esc(riskSpecification(r)||'')}</td></tr>`).join('');
    const agreements = allAgreements351().map(a=>`<tr><td>${esc(a.title||'')}</td><td>${esc(a.limit||'')}</td><td>${esc(a.text||'')}</td></tr>`).join('');
    const texts = textationsHtml351('request');
    return `<div class="request-print brh-print-351"><div class="print-head"><div><h1>ASTORIE a.s.</h1><p>Poptávka pojištění podnikatelských rizik</p></div><div><b>${esc(ins.name)}</b><br>${esc(ins.code)}<br>${esc(ins.email)}</div></div>
      <h2>${esc(state.client.name||'Klient')}</h2><p><b>CASE_ID:</b> ${esc(state.id||'nový případ')} · <b>Poradce:</b> ${esc(state.adviser?.name||'')} · <b>Datum:</b> ${new Date().toLocaleDateString('cs-CZ')}</p>
      <h3>Základní údaje pro pojištění</h3><table>${rows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v).replace(/\n/g,'<br>')}</td></tr>`).join('')}</table>
      <h3>Požadovaná rizika a limity</h3><table><thead><tr><th>Riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění</th></tr></thead><tbody>${risks||'<tr><td colspan="4">Rizika nejsou doplněna.</td></tr>'}</tbody></table>
      <h3>Zvláštní ujednání / požadované doložky odpovědnosti</h3><table><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th></tr></thead><tbody>${agreements||'<tr><td colspan="3">Zvláštní ujednání nejsou doplněna.</td></tr>'}</tbody></table>
      ${attachmentSummary351()}${texts?`<h3>Doplněné textace pro pojišťovnu</h3>${texts}`:''}
      <h3>Doprovodná poznámka</h3><p>${esc(req.email_note||defaultEmailNote(code)).replace(/\n/g,'<br>')}</p><p class="muted"></p></div>`;
  };

  window.printInsurerRequest = printInsurerRequest = function(code){
    readCurrentTab();
    const w=window.open('', '_blank');
    if(!w){toast('Prohlížeč zablokoval otevření tisku.');return;}
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(requestSubject(code))}</title><style>body{font-family:Arial,sans-serif;color:#073E4A;margin:30px}.print-head{display:flex;justify-content:space-between;gap:20px;border-bottom:4px solid #FC4C02;padding-bottom:18px;margin-bottom:20px}h1{letter-spacing:8px;margin:0;color:#003D4C}h2,h3{color:#003D4C}table{border-collapse:collapse;width:100%;margin:12px 0 22px;page-break-inside:auto}tr{page-break-inside:avoid}th{background:#003D4C;color:white;text-align:left}th,td{border:1px solid #D7E8EC;padding:9px;vertical-align:top;white-space:normal}.muted{color:#607783}@media print{button{display:none}}</style></head><body>${insurerRequestHtml(code,true)}<button onclick="window.print()">Tisk / uložit jako PDF</button></body></html>`);
    w.document.close();
  };

  window.exportInsurerRequestExcel = exportInsurerRequestExcel = function(code){
    readCurrentTab();
    const html=`<html><head><meta charset="utf-8"></head><body>${insurerRequestHtml(code,false)}</body></html>`;
    const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download=`poptavka_${safeFile(state.client.name)}_${safeFile(code)}.xls`;
    document.body.appendChild(a); a.click(); const href=a.href; a.remove(); setTimeout(()=>URL.revokeObjectURL(href),500);
    toast('Excel poptávky byl připraven včetně všech rizik.');
  };

  window.tabInsurerRequests = tabInsurerRequests = function(){
    const missing=requestCompleteness();
    if(missing.length) return `<p class="eyebrow">7. Poptávky pojišťovnám</p><h2>Nejdříve doplňte povinné části</h2><div class="info-box">Pro generování poptávek chybí: ${esc(missing.join(', '))}.</div>`;
    const cards=selectedInsurerRows().map(({code,ins,req})=>{
      const display = displayInsurer351(code);
      return `<div class="request-card request-card-351"><div class="section-head"><div><p class="eyebrow">Pojišťovna</p><h2>${esc(display.name)}</h2><p class="muted"><b>${esc(display.code)}</b> · ${esc(display.email||'e-mail není doplněn')}</p></div><span class="badge">${esc(req.status||'připraveno')}</span></div><div class="grid3"><label>Předmět e-mailu<input value="${esc(req.subject||requestSubject(code))}" onchange="ensureInsurerRequest('${esc(code)}').subject=this.value"></label><label>Stav poptávky<select onchange="ensureInsurerRequest('${esc(code)}').status=this.value"><option ${req.status==='připraveno'?'selected':''}>připraveno</option><option ${req.status==='odesláno'?'selected':''}>odesláno</option><option ${req.status==='čekáme na nabídku'?'selected':''}>čekáme na nabídku</option><option ${req.status==='nabídka přijata'?'selected':''}>nabídka přijata</option></select></label><label>Datum odeslání<input type="date" value="${esc(req.sent_at||'')}" onchange="ensureInsurerRequest('${esc(code)}').sent_at=this.value"></label></div><label>Doprovodný text pro pojišťovnu<textarea onchange="ensureInsurerRequest('${esc(code)}').email_note=this.value" placeholder="Krátká poznámka k poptávce, termín pro nabídku, specifika komunikace...">${esc(req.email_note||defaultEmailNote(code))}</textarea></label><div class="tools"><button class="btn primary" onclick="printInsurerRequest('${esc(code)}')">PDF / tisk poptávky</button><button class="btn secondary" onclick="exportInsurerRequestExcel('${esc(code)}')">Excel pro pojišťovnu</button><button class="btn secondary" onclick="copyInsurerEmail('${esc(code)}')">Kopírovat e-mail</button><button class="btn ghost" onclick="ensureInsurerRequest('${esc(code)}').status='odesláno';ensureInsurerRequest('${esc(code)}').sent_at=new Date().toISOString().slice(0,10);readCurrentTab();saveCase()">Označit jako odesláno</button></div></div>`;
    }).join('');
    return `<p class="eyebrow">7. Smart poptávky pojišťovnám</p><h2>Samostatná poptávka pro každou pojišťovnu</h2><p class="muted">Poptávka se skládá z jednoho zdroje dat: karta klienta, karta pro pojištění, rizika, ujednání, textace a přílohy. Interní metodické nápovědy se neexportují.</p><div class="warning"><b>Důležité:</b> do PDF/XLS se propisují všechna dynamická rizika z aktuálního CASE_ID.</div>${cards}<div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit stav poptávek</button><button class="btn secondary" onclick="currentTab='offers';renderWorkspace()">Pokračovat na nabídky</button></div>`;
  };

  function comparisonCell351(code, r){
    const x = offerRisk351(code, r);
    const status = x.status || 'nutno ověřit';
    return `<td class="compare-cell ${status.includes('splněno')?'is-ok':status.includes('omezeno')?'is-warn':status.includes('výluka')?'is-bad':'is-check'}">${statusBadge(status)}<div><b>Limit:</b> ${esc(x.offered_limit||'–')}</div><div><b>Spoluúčast:</b> ${esc(x.deductible||'–')}</div>${x.note?`<div class="compare-note">${esc(x.note)}</div>`:''}</td>`;
  }
  window.tabComparison = tabComparison = function(){
    if(!state.selected_insurers.length||!allRequestRisks351().length) return `<p class="eyebrow">9. Porovnání</p><h2>Porovnání zatím nelze sestavit</h2><div class="info-box">Nejdříve doplňte rizika, pojišťovny a nabídky.</div>`;
    const risks = allRequestRisks351();
    const rows=risks.map(r=>`<tr><td class="risk-request"><b>${esc(r.name||r.label||r.risk_key)}</b><br>${esc(r.requested_limit||'limit neuveden')}${riskSpecification(r)?`<br><small>${esc(riskSpecification(r))}</small>`:''}</td>${canonicalSelectedInsurers351().map(code=>comparisonCell351(code,r)).join('')}</tr>`).join('');
    return `<p class="eyebrow">9. Makléřské porovnání</p><h2>Rozdíly mezi nabídkami</h2><div class="warning">Systém pouze zvýrazňuje rozdíly. Doporučení potvrzuje výhradně poradce.</div><div class="table-wrap"><table class="comparison-table pro-table"><thead><tr><th>Riziko / požadavek</th>${canonicalSelectedInsurers351().map(c=>{const ins=displayInsurer351(c);return `<th class="${state.report.client_selected_offer===c?'recommended-head':''}">${esc(ins.name)}${state.report.client_selected_offer===c?'<span class="recommended-ribbon compact">DOPORUČENO</span>':''}</th>`}).join('')}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="currentTab='recommendation';renderWorkspace()">Přejít na doporučení poradce</button></div>`;
  };

  window.toggleRecommendedInsurer = function(code){
    state.report ||= {};
    state.report.client_selected_offer = state.report.client_selected_offer===code ? '' : code;
    renderWorkspace();
    toast(state.report.client_selected_offer ? 'Doporučená varianta nastavena.' : 'Doporučená varianta byla zrušena.');
  };
  window.tabRecommendation = tabRecommendation = function(){
    const cards=canonicalSelectedInsurers351().map(code=>{const ins=displayInsurer351(code); const sel=state.report.client_selected_offer===code; return `<button class="recommend-card ${sel?'selected':''}" onclick="toggleRecommendedInsurer('${esc(code)}')"><span class="recommend-mark">${sel?'✓':'○'}</span><strong>${esc(ins.name)}</strong><small>${esc(ins.code)}</small><span>${sel?'DOPORUČENO – kliknutím zrušíte':'Vybrat jako doporučenou variantu'}</span></button>`}).join('') || '<div class="empty">Nejdříve vyberte pojišťovny.</div>';
    return `<p class="eyebrow">10. Doporučení poradce</p><h2>Doporučená varianta</h2><p class="muted">Doporučení vždy potvrzuje poradce. Vybraná pojišťovna je zřetelně zvýrazněna a lze ji dalším kliknutím zrušit.</p><div class="recommend-grid">${cards}</div><input type="hidden" id="selected_offer" value="${esc(state.report.client_selected_offer||'')}"><label>Odůvodnění poradce<textarea id="choice_reason">${esc(state.report.client_choice_reason||'')}</textarea></label><label>Poznámka poradce<textarea id="advisor_note">${esc(state.report.advisor_note||'')}</textarea></label><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit doporučení</button><button class="btn secondary" onclick="currentTab='output';renderWorkspace()">Pokračovat na klientský výstup</button></div>`;
  };

  const oldRenderWorkspace351 = renderWorkspace;
  window.renderWorkspace = renderWorkspace = function(){
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab));
    const map={client:tabClient,insurance:tabInsurance,liability:tabLiability,risks:tabRisks,insurers:tabInsurers,attachments:tabAttachments,requests:tabInsurerRequests,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit};
    if($('tabContent')) $('tabContent').innerHTML=(map[currentTab]||tabClient)();
    renderHeader();
  };
})();


/* BRH 4.0.2 – deployment identity runtime check */
(function(){
  async function refreshBuildIdentity(){
    try{
      const res = await fetch('/version', {cache:'no-store'});
      if(!res.ok) return;
      const v = await res.json();
      const badge = document.getElementById('versionBadge');
      if(badge){
        badge.textContent = `Business Risk Hub ${v.version} · ${v.environment || 'TEST'} · ${v.build_id || ''}`;
        badge.title = `${v.name || ''} | DB: ${v.database_configured ? 'configured' : 'not configured'}`;
      }
      window.BRH_BUILD_IDENTITY = v;
    }catch(e){ console.warn('BRH version check failed', e); }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshBuildIdentity);
  else refreshBuildIdentity();
})();


/* BRH 4.0.2 – Request Cards Stabilization
   Cíl: jedna karta poptávky pro jednu pojišťovnu, bez duplicitních kódů/názvů,
   profesionální kompaktní zobrazení a bezpečné zachování exportů. */
(function(){
  function cleanText351b(v){ return String(v || '').trim(); }
  function normalizeKey351b(v){
    return cleanText351b(v).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'');
  }
  function insurerCode351b(i){
    return cleanText351b(i && (i.code || i.short || i.shortcut || i.zkratka || i.id || i.key || i.name));
  }
  function displayInsurer351b(code){
    const raw = cleanText351b(code);
    const list = Array.isArray(CATALOG.insurers) ? CATALOG.insurers : [];
    const rawKey = normalizeKey351b(raw);
    let ins = list.find(i => normalizeKey351b(insurerCode351b(i)) === rawKey)
      || list.find(i => normalizeKey351b(i.name || i.title) === rawKey)
      || list.find(i => normalizeKey351b(i.name || '').includes(rawKey) && rawKey)
      || {};
    const codeClean = cleanText351b(ins.code || ins.short || ins.shortcut || ins.zkratka || raw);
    const nameClean = cleanText351b(ins.name || ins.title || raw || codeClean);
    return {
      code: codeClean,
      name: nameClean,
      email: cleanText351b(ins.email || ins.request_email),
      portal: cleanText351b(ins.portal || ins.web || ins.url),
      ico: cleanText351b(ins.ico),
      address: cleanText351b(ins.address)
    };
  }
  function canonicalSelectedInsurers351b(){
    const source = Array.isArray(state.selected_insurers) ? state.selected_insurers : [];
    const seen = new Set();
    const out = [];
    source.forEach(code => {
      const d = displayInsurer351b(code);
      const key = normalizeKey351b(d.code || d.name || code);
      if(key && !seen.has(key)){
        seen.add(key);
        out.push(d.code || code);
      }
    });
    state.selected_insurers = out;
    return out;
  }
  window.canonicalSelectedInsurers351b = canonicalSelectedInsurers351b;

  function requestCompleteness351b(){
    const missing=[];
    if(!cleanText351b(state.client && state.client.name)) missing.push('karta klienta');
    const riskCount = (typeof allRequestRisks351 === 'function') ? allRequestRisks351().length : (state.risks||[]).length;
    if(!riskCount) missing.push('rizika / modul odpovědnosti');
    if(!canonicalSelectedInsurers351b().length) missing.push('vybrané pojišťovny');
    return missing;
  }
  function reqFor351b(code){ return ensureInsurerRequest(code); }
  function requestSubject351b(code){
    return (typeof requestSubject === 'function') ? requestSubject(code) : `Poptávka pojištění podnikatelských rizik – ${state.client?.name || 'klient'} – ${code}`;
  }
  function defaultNote351b(code){
    return (typeof defaultEmailNote === 'function') ? defaultEmailNote(code) : `Dobrý den,\n\nprosíme o zpracování nabídky pojištění podnikatelských rizik dle přiložené poptávky.\n\nDěkujeme.\nASTORIE a.s.`;
  }
  function card351b(code){
    const d = displayInsurer351b(code);
    const req = reqFor351b(code);
    const email = d.email || 'e-mail není doplněn';
    return `<details class="request-card request-card-351b" open>
      <summary class="request-summary-351b">
        <div><p class="eyebrow">Pojišťovna</p><h2>${esc(d.name || d.code)}</h2><p class="muted"><b>${esc(d.code)}</b> · ${esc(email)}</p></div>
        <span class="badge">${esc(req.status || 'připraveno')}</span>
      </summary>
      <div class="request-body-351b">
        <div class="grid3">
          <label>Předmět e-mailu<input value="${esc(req.subject || requestSubject351b(d.code))}" onchange="ensureInsurerRequest('${esc(d.code)}').subject=this.value"></label>
          <label>Stav poptávky<select onchange="ensureInsurerRequest('${esc(d.code)}').status=this.value;renderWorkspace()">
            <option ${req.status==='připraveno'?'selected':''}>připraveno</option>
            <option ${req.status==='odesláno'?'selected':''}>odesláno</option>
            <option ${req.status==='čekáme na nabídku'?'selected':''}>čekáme na nabídku</option>
            <option ${req.status==='nabídka přijata'?'selected':''}>nabídka přijata</option>
          </select></label>
          <label>Datum odeslání<input type="date" value="${esc(req.sent_at || '')}" onchange="ensureInsurerRequest('${esc(d.code)}').sent_at=this.value"></label>
        </div>
        <label>Doprovodný text pro pojišťovnu<textarea class="request-note-351b" onchange="ensureInsurerRequest('${esc(d.code)}').email_note=this.value" placeholder="Krátká poznámka k poptávce, termín pro nabídku, specifika komunikace...">${esc(req.email_note || defaultNote351b(d.code))}</textarea></label>
        <div class="tools request-tools-351b">
          <button class="btn primary" onclick="printInsurerRequest('${esc(d.code)}')">PDF / tisk poptávky</button>
          <button class="btn secondary" onclick="exportInsurerRequestExcel('${esc(d.code)}')">Excel pro pojišťovnu</button>
          <button class="btn secondary" onclick="copyInsurerEmail('${esc(d.code)}')">Kopírovat e-mail</button>
          <button class="btn ghost" onclick="ensureInsurerRequest('${esc(d.code)}').status='odesláno';ensureInsurerRequest('${esc(d.code)}').sent_at=new Date().toISOString().slice(0,10);readCurrentTab();saveCase();renderWorkspace()">Označit jako odesláno</button>
        </div>
      </div>
    </details>`;
  }
  window.tabInsurerRequests = tabInsurerRequests = function(){
    const missing = requestCompleteness351b();
    if(missing.length){
      return `<p class="eyebrow">7. Poptávky pojišťovnám</p><h2>Nejdříve doplňte povinné části</h2><div class="info-box">Pro generování poptávek chybí: ${esc(missing.join(', '))}.</div>`;
    }
    const codes = canonicalSelectedInsurers351b();
    const cards = codes.map(card351b).join('');
    return `<p class="eyebrow">7. Smart poptávky pojišťovnám</p>
      <h2>Samostatná poptávka pro každou pojišťovnu</h2>
      <p class="muted">Každá pojišťovna má jednu samostatnou kartu. Zdroj dat zůstává jeden obchodní případ: karta klienta, karta pro pojištění, rizika, ujednání, textace a přílohy. Interní metodické nápovědy se neexportují.</p>
      <div class="warning"><b>Důležité:</b> do PDF/XLS se propisují všechna dynamická rizika z aktuálního CASE_ID. Duplicitní pojišťovny jsou automaticky sloučeny.</div>
      <div class="request-list-351b">${cards}</div>
      <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit stav poptávek</button><button class="btn secondary" onclick="currentTab='offers';renderWorkspace()">Pokračovat na nabídky</button></div>`;
  };

  const _oldRenderWorkspace351b = window.renderWorkspace || renderWorkspace;
  window.renderWorkspace = renderWorkspace = function(){
    canonicalSelectedInsurers351b();
    return _oldRenderWorkspace351b();
  };
})();



/* ==========================================================
   Business Risk Hub 4.9.8 – Advisor Professional Cards Workflow SAFE
   Bezpečný nedestruktivní vývoj nad 4.0.2.
   - kompletní katalog odpovědnosti z původního Excelu poradce
   - admin editace rizik a ujednání
   - risk key pouze interně
   - interní metodika jako tooltip, neexportuje se
   ========================================================== */
(function(){
  window.BRH_VERSION = '4.4.0';
  const LIABILITY_RISKS_410_DEFAULT = [{"risk_key": "obecna_provozni_odpovednosti_za_ujmu_skodu", "name": "Obecná (provozní) odpovědnosti za újmu (škodu)", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "společný limit na smlouvě pro odpovědnost z činnosti, odp. za výrobek a stažení výrobku z trhu", "recommended_deductible": "10 000 Kč", "internal_note": "2 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 1, "active": true}, {"risk_key": "pojisteni_odpovednosti_za_ujmu_skodu_zpuso", "name": "Pojištění odpovědnosti za újmu (škodu) způsobenou vadou výrobku a vadou práce po předání", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "sublimit z celkového limitu", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 2, "active": true}, {"risk_key": "nasledna_financni_skoda_vcetne_skod_zpusob", "name": "Následná finanční škoda - včetně škod způsobených vadou výrobku a vadou práce po předání", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "sublimit z celkového limitu", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 3, "active": true}, {"risk_key": "ciste_financni_skody_vcetne_skod_zpusobeny", "name": "Čisté finanční škody - včetně škod způsobených vadou výrobku a vadou práce po předání", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 4, "active": true}, {"risk_key": "nemajetkova_ujma_neopravnenym_zasahem_do_p", "name": "Nemajetková újma neoprávněným zásahem do práva na ochranu osobnosti (psychická újma)", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 5, "active": true}, {"risk_key": "skoda_na_uzivane_nemovitostti", "name": "Škoda na užívané nemovitostti", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 6, "active": true}, {"risk_key": "cizi_veci_prevzate_a_majetkova_ujma_v_souv", "name": "Cizí věci převzaté a Majetková újma v souvislostí s vykonávanou objednanou činností", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 7, "active": true}, {"risk_key": "cizi_veci_uzivane_movite", "name": "Cizí věci užívané movité", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 8, "active": true}, {"risk_key": "regresy_zdravotni_pojistovny_a_regresy_dav", "name": "Regresy zdravotní pojišťovny a regresy dávek nemocenského pojištění - zaměstnanci", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 9, "active": true}, {"risk_key": "regresy_zdravotni_pojistovny_a_regresy_dav", "name": "Regresy zdravotní pojišťovny a regresy dávek nemocenského pojištění - třetí osoby", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 10, "active": true}, {"risk_key": "znecisteni_zivotniho_prostredi", "name": "Znečištění životního prostředí", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 11, "active": true}, {"risk_key": "regres_pojistovny_pov_v_pripade_ze_ridic_p", "name": "Regres pojišťovny POV v případě, že řidič pojištěného požil aplkohol, nebo se odmítl podrobit dechové zkoušce, nebo odjel z místa nehody", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 12, "active": true}, {"risk_key": "odpojednost_za_skody_zpusobene_pri_nakladc", "name": "Odpojednost za škody způsobené při nakládce a vykládce", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 13, "active": true}, {"risk_key": "odpovednost_za_skodu_na_veci_odlozene_a_vn", "name": "Odpovědnost za škodu na věci odložené a vnesené", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 14, "active": true}, {"risk_key": "odpovednost_obchodni_korporace_za_ujmu_cle", "name": "Odpovědnost obchodní korporace za újmu členům statutárních orgánů v souvislosti s výkonem jejich funkce", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 15, "active": true}, {"risk_key": "odpovednosti_clenu_statutarnich_organu_za_", "name": "Odpovědnosti členů statutárních orgánů za jinou než čistou finanční škodu způsobenou organizaci", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 16, "active": true}, {"risk_key": "skody_na_vecech_zamestnancu", "name": "Škody na věcech zaměstnanců", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 17, "active": true}, {"risk_key": "krizova_odpovednost_mezi_spolupojistenymi", "name": "Křížová odpovědnost mezi spolupojištěnými", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 18, "active": true}, {"risk_key": "odpovednost_za_skodu_zpusobenou_majetkove_", "name": "Odpovědnost za škodu způsobenou majetkově propojené osobě", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 19, "active": true}, {"risk_key": "skoda_zpusobena_vadne_vyrobenym_strojem_pj", "name": "Škoda způsobená vadně vyrobeným strojem pjištěného", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 20, "active": true}, {"risk_key": "nahrada_smluvni_pokuty_do_vyse_skutecne_sk", "name": "Náhrada smluvní pokuty do výše skutečné škody", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 21, "active": true}, {"risk_key": "pokuty_a_penale", "name": "Pokuty a penále", "recommended_limit": "", "recommended_sublimit": "", "recommended_deductible": "", "internal_note": "", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 22, "active": true}, {"risk_key": "cista_financni_skoda_v_souvislosti_s_posky", "name": "Čistá finanční škoda v souvislostí s poskytnutím rady", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 23, "active": true}, {"risk_key": "ujma_zpusobena_motorovymi_vozidly_nad_rame", "name": "Újma způsobená motorovými vozidly nad rámec POV", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 24, "active": true}, {"risk_key": "ujma_vznikla_na_opravnene_uzivanem_dopravn", "name": "Újma vzniklá na oprávněně užívaném dopravním prostředku a vozidle", "recommended_limit": "500 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1 x ročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 25, "active": true}, {"risk_key": "stazeni_vyrobku_z_trhu_organizovane_prvni_", "name": "Stažení výrobku z trhu organizované první stranou", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "v rámci celkového limitu PS", "recommended_deductible": "100 000 Kč", "internal_note": "1xročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 26, "active": true}, {"risk_key": "stazeni_vyrobku_z_trhu_organizovane_treti_", "name": "Stažení výrobku z trhu organizované třetí stranou", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "v rámci celkového limitu PS", "recommended_deductible": "100 000 Kč", "internal_note": "1xročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 27, "active": true}, {"risk_key": "spojeni_nebo_smiseni_vadneho_vyrobku_s_jin", "name": "Spojení nebo smísení vadného výrobku s jinou bezvadnou věcí", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "v rámci celkového limitu PS", "recommended_deductible": "100 000 Kč", "internal_note": "1xročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 28, "active": true}, {"risk_key": "naklady_na_demontaz_vadneho_vyrobku_a_mont", "name": "Náklady na demontáž vadného výrobku a montáž bezvadného výrobku", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "v rámci celkového limitu PS", "recommended_deductible": "100 000 Kč", "internal_note": "1xročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 29, "active": true}, {"risk_key": "skoda_vznikla_dalsim_opracovanim_vadneho_v", "name": "Škoda vzniklá dalším opracováním vadného výrobku dodaného pojištěným, aniž došlo k jeho spojení či smísení, nebo montáží s dalšími výrobky.", "recommended_limit": "1 000 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "100 000 Kč", "internal_note": "1xročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 30, "active": true}, {"risk_key": "naklady_na_kontrolu_zkouseni_a_trideni_vad", "name": "Náklady na kontrolu, zkoušení a třídění vadných výrobků", "recommended_limit": "100 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1xročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 31, "active": true}, {"risk_key": "naklady_na_reklamaci_u_zakaznika_pojistene", "name": "Náklady na reklamaci u zákazníka pojištěného", "recommended_limit": "100 000 Kč", "recommended_sublimit": "sublimit", "recommended_deductible": "10 000 Kč", "internal_note": "1xročně", "source": "Excel poradce – Poptávka odpovědnost 20.04.2026", "module": "liability", "order": 32, "active": true}];
  const LIABILITY_AGREEMENTS_410_DEFAULT = [{"id": "veci_prevzate_a_uzivane", "title": "Věci převzaté a užívané:", "text": "Pojištění se vztahuje i na následnou finanční újmu vyplývající z poškození veci převzaté nebo užívané.  Pojištění se nevztahuje na újmu vzniklou ztrátou věci.", "limit": "", "module": "liability", "order": 1, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "ujma_vznikla_na_opravnene_uzivanem_dopravn", "title": "Újma vzniklá na oprávněně užívaném dopravním prostředku a vozidle", "text": "Pojištění se vztahuje na újmu vzniklou na oprávněně užívaném dopravním prostředku. Pojištění se nevztahuje na škody na vozidle, které nemá sjednáno havarijní pojištění. Pojištění se dále nevztahuje na odpovědnost za škodu vzniklou na pneumatikách, discích a kolových šroubech nebo přepravovaných věcech. Pro škodu na vozidle pojistitel poskytne pojistné plnění jen v případě, že událost bude šetřena policií.", "limit": "", "module": "liability", "order": 2, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "majetkova_ujma_v_souvislosti_s_vykonavanou", "title": "Majetková újma v souvislostí s vykonávanou objednanou činností", "text": "Pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému majetkovou újmu vzniklou na věci, na které pojištěný vykonával objednanou činnost, pokud k poškození nebo zničení věci došlo tím, že objednaná činnost byla provedena vadně. Pojištění se vztahuje i na následnou finanční újmu z toho vyplývající.", "limit": "", "module": "liability", "order": 3, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "prirozena_prava_cloveka", "title": "Přirozená práva člověka", "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému újmu vzniklou na přirozených právech člověka případně i způsobené duševní útrapy, nesouvisející s újmou při ublížení na zdraví a při usmrcení. Pojistné plnění bude poskytnuto pouze na základě pravomocného rozhodnutí soudu.", "limit": "", "module": "liability", "order": 4, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "ujma_zpusobena_motorovymi_vozidly_nad_rame", "title": "Újma způsobená motorovými vozidly nad rámec POV", "text": "pojištění se vztahuje i na povinnost pojištěného nahradit poškozenému újmu způsobenou motorovými vozidly ve vlastnictví pojistníka nebo vozidly, které pojištěný po právu užívá na základě smlouvy, vzniklou při dopravní nehodě šetřené policií. Pojištění se vztahuje rovněž na újmu způsobenou při práci vozidla jako pracovního stroje, včetně stacionárního pracovního stroje. Pojistitel neposkytne pojistné plnění za újmu způsobenou provozem motorových vozidel v rozsahu, v jakém vznikl nárok na pojistné plnění z povinně smluvního pojištění odpovědnosti za újmu způsobenou provozem vozidla. Pojištění dle tohoto ujednání se nevztahuje na újmu způsobenou na samotném vozidle, jimž byla újma způsobena a na újmu způsobenou provozem motorových vozidel při jejich účasti na organizovaném motoristickém závodu .", "limit": "", "module": "liability", "order": 5, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "ujma_zpusobena_zaku_studentu_ke_ktere_dosl", "title": "Újma způsobená žáku/studentu, ke které došlo při praktickém vyučování", "text": "pojištění se vztahuje i na odpovědnost za újmu způsobenou žáku/studentu, ke které došlo při praktickém vyučování u pojištěného nebo v přímé souvislosti s ním, příp. k této škodě došlo v souvislosti s jeho účastí na zájmovém vzdělávání. Ujednává se, že pojištění se vztahuje i na odpovědnost studenta/žáka za újmu způsobenou jakékoliv třetí osobě při praktickém vyučování u právnické nebo fyzické osoby anebo v přímé souvislosti s ním. Pojištění se vztahuje i na újmy způsobené pojistníkovi.", "limit": "", "module": "liability", "order": 6, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "cista_financni_skoda", "title": "Čistá finanční škoda", "text": "pojištění obecné odpovědnosti a pojištění odpovědnosti za újmu způsobenou vadou poskytnuté práce, jež se projeví po jejím předání a pojištění odpovědnosti za újmu způsobenou vadou výrobku se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému čistou finanční škodu, tj. majetkovou újmu na jmění vyjádřenou v penězích, která vznikla poškozenému jinak než při ublížení na zdraví, usmrcení nebo na jmění jeho poškozením, zničením nebo pohřešováním nebo následná finanční újma z toho vyplývající.", "limit": "", "module": "liability", "order": 7, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "pokuty_a_penale", "title": "Pokuty a penále", "text": "pojištění se vztahuje i na povinnost pojištěného nahradit poškozenému újmu vzniklou tím, že v důsledku vady pojištěným poskytnuté odborné služby nebo dodáním vadného výrobku byly poškozenému uloženy nebo proti němu uplatňovány pokuty, penále nebo jiné správní sankce k tomu oprávněným orgánem přímo na základě právního předpisu.", "limit": "", "module": "liability", "order": 8, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "montaz_a_demontaz", "title": "Montáž a demontáž", "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému čistou finanční škodu, tj. majetkovou újmu na jmění vyjádřenou v penězích, spočívající v nákladech na odstranění, demontáž, vyjmutí nebo uvolnění vadného výrobku a v nákladech na montáž, připevnění nebo osazení bezvadného výrobku, která vznikla poškozenému jinak než při ublížení na zdraví, usmrcení nebo na jmění jeho poškozením, zničením nebo pohřešováním nebo následná finanční újma z toho vyplývající. Pojištění se vztahuje také na náhradu nákladů na přepravu výrobku bez vad určeného k výměně za vadný výrobek, náhradu nákladů na přepravu vadného výrobku a na náhradu nákladů na přepravu jiné věci, která obsahuje vadný výrobek.", "limit": "", "module": "liability", "order": 9, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "spojeni_smiseni", "title": "Spojení, smísení", "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému čistou finanční škodu, tj. majetkovou újmu na jmění vyjádřenou v penězích nastalou v důsledku toho, že věc vzniklá spojením nebo smísením jiné věci s vadným výrobkem vyrobeným nebo dodaným pojištěným je vadná, nebo nastalou v důsledku toho, že věc vzniklá v důsledku dalšího zpracování nebo opracování vadného výrobku vyrobeného nebo dodaného pojištěným je vadná (dále jen „vyrobená vadná věc“).", "limit": "", "module": "liability", "order": 10, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "cinnosti_bez_zivnostenskeho_opravneni", "title": "Činnosti bez živnostenského oprávnění", "text": "Pojištění se sjednává i pro případ povinnosti pojištěného uhradit škodu a v případě ublížení na zdraví nebo při usmrcení též újmu vzniklou jinému v souvislosti s činnostmi, pro jejichž výkon se živnostenské oprávnění nevyžaduje.", "limit": "", "module": "liability", "order": 11, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "propojene_osoby_krizova_odpovednost", "title": "Propojené osoby, křížová odpovědnost", "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit újmu vzniklou: - spolupojištěné osobě; - právnické osobě, ve které má pojištěný nebo osoby jemu blízké majetkovou účast; - právnické osobě, ve které pojištěný vykonává funkci statutárního orgánu; - osobě, která je v pozici společníka pojištěného.", "limit": "", "module": "liability", "order": 12, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "naklady_na_reklamaci_u_zakaznika_pojistene", "title": "Náklady  na reklamaci u zákazníka pojištěného", "text": "Pojišťovna zaplatí  administrativní náklady zákazníka pojištěného s dokladováním škody, které požaduje poškozený zákazník po pojištěném, pokud tyto náklady souvisí s dokladováním pojistné události.", "limit": "", "module": "liability", "order": 13, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "smluvni_ujednani_k_ruceni_vlastnika_pozemn", "title": "Smluvní ujednání k ručení vlastníka pozemní komunikace za správce pozemní komunikace", "text": "Pojištění se vztahuje i na povinnost pojištěného uhradit poškozenému peněžní částku, pokud mu tato povinnost vznikla ve smyslu § 27 odst.6 zákona č. 13/1997 Sb., o pozemních komunikacích, z důvodu ručení pojištěného za splnění povinnosti správce pozemní komunikace nahradit škodu (újmu). Pojistitel však poskytne pojistné plnění maximálně v rozsahu, v jakém by je poskytl v případě, kdy by výkon správy pozemní komunikace nebyl zajišťován prostřednictvím správce, ale přímo pojištěným.", "limit": "", "module": "liability", "order": 14, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "pojisteni_nakladu_na_kontrolu_nebo_zkousen", "title": "Pojištění nákladů na kontrolu nebo zkoušení výrobku poškozeného", "text": "pojištění se vztahuje i na povinnost pojištěného nahradit škodu (újmu na jmění) spočívající výlučně v nákladech vzniklých při kontrole nebo zkoušení výrobků poškozeného, která vznikla jinému.", "limit": "", "module": "liability", "order": 15, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}, {"id": "pripojisteni_odpovednosti_za_ujmu_zpusoben", "title": "Připojištění odpovědnosti za újmu způsobenou vyrobením vadné věci pomocí vadného stroje", "text": "připojištění se vztahuje na právním předpisem stanovenou povinnost pojištěného nahradit újmu na jmění (škodu) vzniklou v důsledku toho, že věc vzniklá vyrobením/zpracováním/opracováním pomocí vadného stroje, který vadně vyrobil, dodal, (s)montoval nebo vadně udržoval či opravil pojištěný (dále jen \"vadný stroj\") je vadná (dále jen \"vyrobená vadná věc\").", "limit": "", "module": "liability", "order": 16, "active": true, "source": "Excel poradce – Poptávka odpovědnost 20.04.2026"}];

  function arr(v){ return Array.isArray(v) ? v : []; }
  function safeText(v){ return String(v || '').trim(); }
  function risk410List(){
    CATALOG.liabilityRisks = arr(CATALOG.liabilityRisks);
    if(!CATALOG.liabilityRisks.length) CATALOG.liabilityRisks = LIABILITY_RISKS_410_DEFAULT.slice();
    return CATALOG.liabilityRisks.filter(r => r && r.active !== false).sort((a,b)=>(a.order||999)-(b.order||999));
  }
  function agreement410List(){
    CATALOG.liabilityAgreements = arr(CATALOG.liabilityAgreements);
    if(!CATALOG.liabilityAgreements.length) CATALOG.liabilityAgreements = LIABILITY_AGREEMENTS_410_DEFAULT.slice();
    return CATALOG.liabilityAgreements.filter(a => a && a.active !== false).sort((a,b)=>(a.order||999)-(b.order||999));
  }
  function risk410Key(r){ return safeText(r.risk_key || r.key || r.id); }
  function risk410Name(r){ return safeText(r.name || r.title || r.label || risk410Key(r)); }
  function risk410Limit(r){ return safeText(r.recommended_limit || r.limit || r.requested_limit); }
  function risk410Deductible(r){ return safeText(r.recommended_deductible || r.deductible); }
  function risk410Help(r){
    return safeText(r.internal_note || r.recommended_sublimit || r.description || r.note || 'Interní metodika není doplněna. Nápověda je určena pouze pro poradce a nepropíše se do poptávky ani klientského výstupu.');
  }
  function findRisk410(key){ return risk410List().find(r => risk410Key(r) === String(key)); }
  function caseRiskKeys410(){ return new Set((state.risks || []).map(r => String(r.risk_key || ''))); }
  function makeCaseRisk410(r){
    return {
      risk_key: risk410Key(r),
      name: risk410Name(r),
      requested_limit: risk410Limit(r),
      deductible: '',
      specification: '',
      method_note: risk410Help(r),
      recommended_sublimit: safeText(r.recommended_sublimit || ''),
      source: safeText(r.source || 'Advisor Professional Cards Workflow SAFE 4.4.0')
    };
  }

  window.liabilitySelectedSet = liabilitySelectedSet = function(){ return caseRiskKeys410(); };
  window.liabilityHelp = liabilityHelp = function(key){ const r=findRisk410(key); return r ? risk410Help(r) : ''; };
  window.liabilityRiskByKey = liabilityRiskByKey = function(key){ const r=findRisk410(key); return r ? [risk410Key(r), risk410Name(r), risk410Limit(r), risk410Help(r)] : []; };
  window.liabilityRiskMeta = liabilityRiskMeta = function(key){ const r=findRisk410(key)||{}; return {key:risk410Key(r)||key, name:risk410Name(r)||key, limit:risk410Limit(r), help:risk410Help(r)}; };

  window.toggleLiabilityRisk = toggleLiabilityRisk = function(key){
    const k=String(key);
    const idx=(state.risks||[]).findIndex(x => String(x.risk_key)===k);
    if(idx >= 0){ state.risks.splice(idx,1); renderWorkspace(); toast('Riziko bylo odebráno z případu.'); return; }
    const r=findRisk410(k);
    if(!r){ toast('Riziko nebylo v katalogu nalezeno.'); return; }
    state.risks.push(makeCaseRisk410(r));
    renderWorkspace();
  };
  window.addLiabilityRisk = addLiabilityRisk = function(key,name,limit,methodNote){
    const r=findRisk410(key) || {risk_key:key,name:name,recommended_limit:limit,internal_note:methodNote,active:true};
    if((state.risks||[]).some(x => String(x.risk_key)===String(risk410Key(r)))){ toast('Riziko už je v poptávce.'); return; }
    state.risks.push(makeCaseRisk410(r));
    renderWorkspace();
  };
  window.addAllLiabilityRisks = addAllLiabilityRisks = function(){
    const keys=caseRiskKeys410();
    risk410List().forEach(r=>{ if(!keys.has(risk410Key(r))) state.risks.push(makeCaseRisk410(r)); });
    renderWorkspace(); toast('Doplněna kompletní sada rizik odpovědnosti z profesionálního katalogu.');
  };
  window.clearAllLiabilityRisks = clearAllLiabilityRisks = function(){
    if(!confirm('Opravdu odebrat všechna rizika odpovědnosti z tohoto případu?')) return;
    const keys=new Set(risk410List().map(risk410Key));
    state.risks=(state.risks||[]).filter(r=>!keys.has(String(r.risk_key||'')) && !String(r.risk_key||'').startsWith('CUSTOM'));
    renderWorkspace(); toast('Rizika odpovědnosti byla odebrána.');
  };
  window.addAllLiabilityAgreements = addAllLiabilityAgreements = function(){
    state.liability_agreements = arr(state.liability_agreements);
    const existing=new Set(state.liability_agreements.map(a=>safeText(a.title).toLowerCase()));
    agreement410List().forEach(a=>{ const k=safeText(a.title).toLowerCase(); if(k && !existing.has(k)) state.liability_agreements.push({title:a.title, limit:a.limit||'', text:a.text||'', source:a.source||'Advisor Professional Cards Workflow SAFE 4.4.0'}); });
    renderWorkspace(); toast('Doplněna kompletní sada zvláštních ujednání odpovědnosti.');
  };

  function selectedLiabilityRisks410(){
    const keys=new Set(risk410List().map(risk410Key));
    return (state.risks||[]).filter(r => keys.has(String(r.risk_key||'')) || String(r.risk_key||'').startsWith('CUSTOM'));
  }
  function riskTile410(r){
    const key=risk410Key(r), selected=caseRiskKeys410().has(key);
    const cls=selected?'risk-card410 selected':'risk-card410';
    return `<button class="${cls}" onclick="toggleLiabilityRisk('${esc(key)}')">
      <span class="risk-card-title">${selected?'✓ ':''}${esc(risk410Name(r))}</span>
      <span class="risk-card-limit">${esc(risk410Limit(r) || 'limit dle individuálního zadání')}</span>
      <span class="risk-card-hint">${selected?'Kliknutím odebrat':'Kliknutím přidat'}</span>
      <span class="help-dot" title="${esc(risk410Help(r))}">i</span>
    </button>`;
  }
  function riskEditorRow410(r, idx){
    const help = riskMethodNote(r) || liabilityHelp(r.risk_key);
    return `<div class="risk-row410">
      <div class="risk-name-cell410">
        <label>Produkt / riziko</label>
        <textarea class="fit risk-title410" onchange="state.risks[${idx}].name=this.value">${esc(r.name||'')}</textarea>
        <span class="help-dot inline" title="${esc(help)}">i</span>
      </div>
      <div><label>Požadovaný limit</label><textarea class="fit" onchange="state.risks[${idx}].requested_limit=this.value">${esc(r.requested_limit||'')}</textarea></div>
      <div><label>Spoluúčast</label><textarea class="fit" onchange="state.risks[${idx}].deductible=this.value" placeholder="Spoluúčast">${esc(r.deductible||'')}</textarea></div>
      <div class="spec410"><label>Specifikace / doplnění pro pojišťovnu</label><textarea class="fit tall" onchange="state.risks[${idx}].specification=this.value" placeholder="Text určený pro pojišťovnu / poptávku">${esc(riskSpecification(r))}</textarea></div>
      <div class="risk-actions410"><button class="btn danger" onclick="removeRisk(${idx})">Smazat</button></div>
    </div>`;
  }
  function riskEditorTable410(risks, emptyText){
    const rows=risks.map(r=>riskEditorRow410(r, state.risks.indexOf(r))).join('');
    return `<div class="risk-table410">${rows || `<div class="empty">${esc(emptyText)}</div>`}</div>`;
  }

  window.tabLiability = tabLiability = function(){
    const cards=risk410List().map(riskTile410).join('');
    const selected=selectedLiabilityRisks410();
    const agre=(state.liability_agreements||[]).map((a,i)=>`<tr><td><textarea class="fit" onchange="state.liability_agreements[${i}].title=this.value">${esc(a.title||'')}</textarea></td><td><textarea class="fit" onchange="state.liability_agreements[${i}].limit=this.value" placeholder="limit / sublimit">${esc(a.limit||'')}</textarea></td><td><textarea class="fit tall" onchange="state.liability_agreements[${i}].text=this.value">${esc(a.text||'')}</textarea></td><td><button class="btn danger" onclick="removeLiabilityAgreement(${i})">Smazat</button></td></tr>`).join('');
    return `<p class="eyebrow">3. Modul pojištění odpovědnosti PROFI · 4.4.0</p>
      <h2>Advisor Professional Cards Workflow SAFE</h2>
      <p class="muted">Katalog odpovědnosti vychází z původního Excelu poradce. Interní metodika je dostupná přes malou ikonku „i“ a nikdy se neexportuje. Do poptávky jde pouze pole Specifikace / doplnění pro pojišťovnu.</p>
      <div class="section-soft"><div class="section-head"><div><h3>Katalog rizik odpovědnosti</h3><p class="muted">Kliknutím riziko přidáte, dalším kliknutím odeberete. Katalog obsahuje ${risk410List().length} položek.</p></div><div class="tools"><button class="btn primary" onclick="addAllLiabilityRisks()">+ Přidat celou sadu</button><button class="btn danger" onclick="clearAllLiabilityRisks()">Odebrat všechna rizika</button></div></div><div class="risk-grid410">${cards}</div></div>
      <div class="section-soft"><div class="section-head"><div><h3>Vybraná rizika odpovědnosti</h3><p class="muted">Bez technického risk key. Všechna textová pole jsou viditelná a použitelná pro práci poradce.</p></div><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div>${riskEditorTable410(selected,'Zatím není vybrané žádné riziko odpovědnosti.')}</div>
      <div class="section-soft"><div class="section-head"><div><h3>Zvláštní ujednání a doložky odpovědnosti</h3><p class="muted">Katalog obsahuje ${agreement410List().length} položek z původního Excelu. Poradce může přidat vlastní text.</p></div><div class="tools"><button class="btn secondary" onclick="addAllLiabilityAgreements()">+ Doporučená ujednání</button><button class="btn secondary" onclick="addCustomLiabilityAgreement()">+ Vlastní ujednání</button><button class="btn danger" onclick="clearAllLiabilityAgreements()">Smazat všechna ujednání</button></div></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th><th></th></tr></thead><tbody>${agre||'<tr><td colspan="4" class="muted">Zatím nejsou doplněna žádná zvláštní ujednání.</td></tr>'}</tbody></table></div></div>
      <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit modul odpovědnosti</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
  };

  window.tabRisks = tabRisks = function(){
    const options=riskOptions();
    const suggested=suggestedRisks();
    const chipHtml=suggested.length?`<div class="chip-row">${suggested.map(r=>{const active=(state.risks||[]).some(x=>String(x.risk_key)===String(r.risk_key));return `<button class="chip ${active?'selected':''}" onclick="addRiskByKey('${esc(r.risk_key)}')">${active?'✓ ':'+'} ${esc(r.risk_name||r.name||r.risk_key)}</button>`}).join('')}</div>`:'<div class="info-box">Vyplňte typ činnosti na kartě klienta nebo použijte ruční výběr z knihovny rizik.</div>';
    const rows=(state.risks||[]);
    return `<p class="eyebrow">4. Ostatní rizika a požadavky klienta</p><h2>Vstupní dotazník rizik</h2><p class="muted">Technický risk key zůstává pouze interně. Poradce pracuje s názvem rizika, limitem, spoluúčastí a specifikací pro pojišťovnu.</p><div class="section-soft"><h3>Doporučená rizika podle činnosti</h3>${chipHtml}</div><div class="tools"><select id="addRiskSelect"><option value="">Vyberte riziko z knihovny</option>${options}</select><button class="btn primary" onclick="addRiskFromSelect()">+ Přidat riziko</button><button class="btn secondary" onclick="addDefaultRisks()">+ Doporučená sada</button><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="section-soft"><div class="section-head"><div><h3>Všechna rizika případu</h3><p class="muted">Nápověda je interní a neexportuje se. Do poptávky se propisuje pouze specifikace pro pojišťovnu.</p></div><button class="btn danger" onclick="clearAllLiabilityRisks()">Odebrat všechna rizika odpovědnosti</button></div>${riskEditorTable410(rows,'Zatím není doplněné žádné riziko.')}</div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
  };

  const oldAdminPanel410 = window.adminPanel || adminPanel;
  window.adminPanel = adminPanel = function(type){
    if(type==='risks'){
      const box=$('adminPanel'); if(!box) return;
      const rows=risk410List().map((r,idx)=>`<tr><td><input value="${esc(r.risk_key||'')}" onchange="CATALOG.liabilityRisks[${idx}].risk_key=this.value"></td><td><textarea class="fit" onchange="CATALOG.liabilityRisks[${idx}].name=this.value">${esc(r.name||'')}</textarea></td><td><input value="${esc(r.recommended_limit||'')}" onchange="CATALOG.liabilityRisks[${idx}].recommended_limit=this.value"></td><td><input value="${esc(r.recommended_sublimit||'')}" onchange="CATALOG.liabilityRisks[${idx}].recommended_sublimit=this.value"></td><td><textarea class="fit tall" onchange="CATALOG.liabilityRisks[${idx}].internal_note=this.value">${esc(r.internal_note||'')}</textarea></td><td><select onchange="CATALOG.liabilityRisks[${idx}].active=this.value==='ano'"><option ${r.active!==false?'selected':''}>ano</option><option ${r.active===false?'selected':''}>ne</option></select></td></tr>`).join('');
      box.innerHTML=`<h2>Modul Odpovědnost – rizika</h2><p class="muted">Admin číselník rizik odpovědnosti. Katalog je modulový a připravený pro další pojistné moduly.</p><div class="tools"><button class="btn secondary" onclick="CATALOG.liabilityRisks.push({risk_key:'custom_'+Date.now(),name:'Nové riziko',recommended_limit:'',recommended_sublimit:'',internal_note:'',module:'liability',active:true,order:CATALOG.liabilityRisks.length+1});adminPanel('risks')">+ Přidat riziko</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit číselník</button></div><div class="table-wrap"><table class="admin-wide-table"><thead><tr><th>Interní klíč</th><th>Název rizika</th><th>Doporučený limit</th><th>Sublimit</th><th>Interní metodika / tooltip</th><th>Aktivní</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      return;
    }
    if(type==='liabilityAgreements'){
      const box=$('adminPanel'); if(!box) return;
      CATALOG.liabilityAgreements=arr(CATALOG.liabilityAgreements); if(!CATALOG.liabilityAgreements.length) CATALOG.liabilityAgreements=LIABILITY_AGREEMENTS_410_DEFAULT.slice();
      const rows=CATALOG.liabilityAgreements.map((a,idx)=>`<tr><td><textarea class="fit" onchange="CATALOG.liabilityAgreements[${idx}].title=this.value">${esc(a.title||'')}</textarea></td><td><textarea class="fit tall" onchange="CATALOG.liabilityAgreements[${idx}].text=this.value">${esc(a.text||'')}</textarea></td><td><input value="${esc(a.limit||'')}" onchange="CATALOG.liabilityAgreements[${idx}].limit=this.value"></td><td><select onchange="CATALOG.liabilityAgreements[${idx}].active=this.value==='ano'"><option ${a.active!==false?'selected':''}>ano</option><option ${a.active===false?'selected':''}>ne</option></select></td></tr>`).join('');
      box.innerHTML=`<h2>Modul Odpovědnost – zvláštní ujednání</h2><p class="muted">Textace a doložky pro odpovědnostní modul. Poradce je může vložit do konkrétního případu.</p><div class="tools"><button class="btn secondary" onclick="CATALOG.liabilityAgreements.push({id:'agr_'+Date.now(),title:'Nové ujednání',text:'',limit:'',module:'liability',active:true,order:CATALOG.liabilityAgreements.length+1});adminPanel('liabilityAgreements')">+ Přidat ujednání</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit ujednání</button></div><div class="table-wrap"><table class="admin-wide-table"><thead><tr><th>Název</th><th>Text</th><th>Limit</th><th>Aktivní</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      return;
    }
    oldAdminPanel410(type);
    const tabs=document.querySelector('.admin-tabs');
    if(tabs && !tabs.querySelector('[data-liability-agreements]')){
      const btn=document.createElement('button'); btn.className='chip'; btn.dataset.liabilityAgreements='1'; btn.textContent='Ujednání odpovědnosti'; btn.onclick=()=>adminPanel('liabilityAgreements'); tabs.appendChild(btn);
    }
  };

  const oldRenderAdmin410 = window.renderAdmin || renderAdmin;
  window.renderAdmin = renderAdmin = function(){ oldRenderAdmin410(); const tabs=document.querySelector('.admin-tabs'); if(tabs && !tabs.querySelector('[data-liability-agreements]')){ const btn=document.createElement('button'); btn.className='chip'; btn.dataset.liabilityAgreements='1'; btn.textContent='Ujednání odpovědnosti'; btn.onclick=()=>adminPanel('liabilityAgreements'); tabs.appendChild(btn); } };

  window.saveAdminCatalog = saveAdminCatalog = async function(){
    try{
      if(typeof normalizeCatalog==='function') normalizeCatalog();
      const payload={insurers:CATALOG.insurers, advisers:CATALOG.advisers, requirementTypes:CATALOG.requirementTypes, coverageDictionary:CATALOG.coverageDictionary, policyReferences:CATALOG.policyReferences, risks:CATALOG.risks, activities:CATALOG.activities, riskModel:CATALOG.riskModel, textTemplates:CATALOG.textTemplates, attachmentTypes:CATALOG.attachmentTypes, liabilityRisks:CATALOG.liabilityRisks, liabilityAgreements:CATALOG.liabilityAgreements, users:CATALOG.users, modulePermissions:CATALOG.modulePermissions, roleProfiles:CATALOG.roleProfiles, actor_email:state.adviser?.email||''};
      const data=await fetchJson('/api/admin/catalogs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      toast(data.message||'Admin číselníky uloženy.'); renderAll();
    }catch(e){ toast('Admin se nepodařilo uložit: '+e.message); }
  };

  const oldRenderWorkspace410 = window.renderWorkspace || renderWorkspace;
  window.renderWorkspace = renderWorkspace = function(){
    risk410List(); agreement410List();
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab));
    const map={client:tabClient,insurance:tabInsurance,liability:tabLiability,risks:tabRisks,insurers:tabInsurers,attachments:tabAttachments,requests:tabInsurerRequests,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit};
    if($('tabContent')) $('tabContent').innerHTML=(map[currentTab]||tabClient)();
    renderHeader();
  };

  // Aktivace katalogu při načtení bez přepisování existujících dat případu.
  risk410List(); agreement410List();
})();


/* =====================================================================
   BRH 4.4.0 – Advisor Professional Cards Workflow SAFE
   Nedestruktivní oprava viditelnosti Adminu.
   - Nemění DB schéma.
   - Nezasahuje do pracovního prostoru, případů ani modulu odpovědnosti.
   - Přidává pouze finální bezpečné vykreslení Adminu s přehlednými záložkami.
   ===================================================================== */
(function(){
  window.BRH_VERSION = '4.4.0';

  function brh422Arr(x){ return Array.isArray(x) ? x : []; }
  function brh422Esc(v){
    return String(v ?? '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }
  function brh422EnsureCatalog(){
    window.CATALOG = window.CATALOG || {};
    CATALOG.users = brh422Arr(CATALOG.users);
    CATALOG.roleProfiles = brh422Arr(CATALOG.roleProfiles);
    CATALOG.modulePermissions = brh422Arr(CATALOG.modulePermissions);
    CATALOG.insurers = brh422Arr(CATALOG.insurers);
    CATALOG.attachmentTypes = brh422Arr(CATALOG.attachmentTypes);
    CATALOG.textTemplates = brh422Arr(CATALOG.textTemplates);
    CATALOG.liabilityRisks = brh422Arr(CATALOG.liabilityRisks);
    CATALOG.liabilityAgreements = brh422Arr(CATALOG.liabilityAgreements);
    if(!CATALOG.roleProfiles.length){
      CATALOG.roleProfiles = [
        {code:'PORADCE', name:'Poradce', description:'Práce s případy a klienty.'},
        {code:'SPECIALISTA', name:'Specialista', description:'Odborné posouzení a nabídky.'},
        {code:'BACKOFFICE', name:'Backoffice', description:'Podpora a kontrola.'},
        {code:'MANAGEMENT', name:'Management', description:'Přehled a kontrola.'},
        {code:'ADMIN', name:'Administrátor', description:'Správa systému.'}
      ];
    }
    if(!CATALOG.users.length){
      CATALOG.users.push({id:'admin', name:'Administrátor ASTORIE', email:'admin@astorie.local', position:'Administrátor', roles:['ADMIN'], active:true});
    }
  }
  function brh422TabButton(key, label){
    return `<button class="chip" data-admin-tab="${brh422Esc(key)}" onclick="adminPanel('${brh422Esc(key)}')">${brh422Esc(label)}</button>`;
  }
  function brh422SetActiveTab(key){
    document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.toggle('active', b.dataset.adminTab === key));
  }
  function brh422RoleCheckboxes(u, idx){
    return CATALOG.roleProfiles.map(r => {
      const code = r.code || r.name || '';
      const checked = brh422Arr(u.roles).includes(code) ? 'checked' : '';
      return `<label class="role-pill"><input type="checkbox" ${checked} onchange="brh422ToggleUserRole(${idx},'${brh422Esc(code)}',this.checked)"> ${brh422Esc(code)}</label>`;
    }).join('');
  }
  window.brh422ToggleUserRole = function(idx, role, checked){
    brh422EnsureCatalog();
    const u = CATALOG.users[idx];
    if(!u) return;
    u.roles = brh422Arr(u.roles);
    if(checked && !u.roles.includes(role)) u.roles.push(role);
    if(!checked) u.roles = u.roles.filter(r => r !== role);
  };
  window.brh422SetPerm = function(mi, role, action, checked){
    brh422EnsureCatalog();
    const m = CATALOG.modulePermissions[mi];
    if(!m) return;
    m[role] = m[role] || {};
    m[role][action] = checked;
  };

  window.renderAdmin = function(){
    brh422EnsureCatalog();
    const box = document.getElementById('adminBox');
    if(!box) return;
    box.innerHTML = `
      <div class="admin-safe-head">
        <div>
          <p class="eyebrow">Administrace · 4.4.0 SAFE</p>
          <h2>Admin Control Center</h2>
          <p class="muted">Bezpečné zobrazení všech správcovských sekcí. Tato verze nemění databázové schéma ani pracovní workflow.</p>
        </div>
      </div>
      <div class="metric-grid">
        <div><b>${CATALOG.users.length}</b><span>uživatelů</span></div>
        <div><b>${CATALOG.roleProfiles.length}</b><span>pozic</span></div>
        <div><b>${CATALOG.modulePermissions.length}</b><span>modulů práv</span></div>
        <div><b>${CATALOG.insurers.length}</b><span>pojišťoven</span></div>
        <div><b>${CATALOG.attachmentTypes.length}</b><span>typů příloh</span></div>
        <div><b>${CATALOG.liabilityRisks.length}</b><span>rizik odpovědnosti</span></div>
      </div>
      <div class="admin-tabs admin-tabs-safe">
        ${brh422TabButton('users','Uživatelé')}
        ${brh422TabButton('permissions','Oprávnění / pozice')}
        ${brh422TabButton('insurers','Pojišťovny')}
        ${brh422TabButton('attachments','Přílohy')}
        ${brh422TabButton('texts','Textace')}
        ${brh422TabButton('liabilityRisks','Rizika odpovědnosti')}
        ${brh422TabButton('liabilityAgreements','Ujednání odpovědnosti')}
        ${brh422TabButton('json','Import / export JSON')}
      </div>
      <div id="adminPanel"></div>
    `;
    adminPanel('users');
  };

  window.adminPanel = function(type){
    brh422EnsureCatalog();
    brh422SetActiveTab(type);
    const box = document.getElementById('adminPanel');
    if(!box) return;

    if(type === 'users'){
      box.innerHTML = `
        <h2>Uživatelé a role</h2>
        <p class="muted">Správa oprávněných osob. Jeden uživatel může mít více rolí.</p>
        <div class="table-wrap admin-safe-table"><table>
          <thead><tr><th>ID</th><th>Jméno</th><th>E-mail</th><th>Pozice</th><th>Role</th><th>Aktivní</th><th>Akce</th></tr></thead>
          <tbody>${CATALOG.users.map((u,idx)=>`
            <tr>
              <td><input value="${brh422Esc(u.id||'')}" onchange="CATALOG.users[${idx}].id=this.value"></td>
              <td><input value="${brh422Esc(u.name||'')}" onchange="CATALOG.users[${idx}].name=this.value"></td>
              <td><input value="${brh422Esc(u.email||'')}" onchange="CATALOG.users[${idx}].email=this.value"></td>
              <td><input value="${brh422Esc(u.position||'')}" onchange="CATALOG.users[${idx}].position=this.value"></td>
              <td><div class="role-checks">${brh422RoleCheckboxes(u,idx)}</div></td>
              <td><input type="checkbox" ${u.active!==false?'checked':''} onchange="CATALOG.users[${idx}].active=this.checked"></td>
              <td><button class="btn danger" onclick="CATALOG.users.splice(${idx},1);adminPanel('users')">Smazat</button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.users.push({id:'u_'+Date.now(),name:'',email:'',position:'Poradce',roles:['PORADCE'],active:true});adminPanel('users')">+ Nový uživatel</button>
          <button class="btn primary" onclick="saveAdminCatalog()">Uložit uživatele</button>
        </div>`;
      return;
    }

    if(type === 'permissions'){
      const actions = [['view','Vidí'],['edit','Upravuje'],['delete','Maže'],['export','Export'],['approve','Schvaluje']];
      if(!CATALOG.modulePermissions.length){
        ['dashboard','cases','workspace','documents','textations','riskModel','admin'].forEach(m => {
          CATALOG.modulePermissions.push({module:m,label:m});
        });
      }
      box.innerHTML = `
        <h2>Oprávnění podle pozic</h2>
        <p class="muted">Zaklikněte, co může daná pozice vidět a provádět. Administrátorská práva upravujte opatrně.</p>
        <div class="table-wrap admin-safe-table"><table>
          <thead><tr><th>Modul</th>${CATALOG.roleProfiles.map(r=>`<th>${brh422Esc(r.name||r.code)}</th>`).join('')}</tr></thead>
          <tbody>${CATALOG.modulePermissions.map((m,mi)=>`
            <tr>
              <td><b>${brh422Esc(m.label||m.module)}</b><small>${brh422Esc(m.module||'')}</small></td>
              ${CATALOG.roleProfiles.map(r=>{
                const code = r.code || r.name || '';
                return `<td>${actions.map(([a,l])=>`<label class="perm"><input type="checkbox" ${(m[code] && m[code][a])?'checked':''} onchange="brh422SetPerm(${mi},'${brh422Esc(code)}','${a}',this.checked)"> ${l}</label>`).join('')}</td>`;
              }).join('')}
            </tr>`).join('')}
          </tbody>
        </table></div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.modulePermissions.push({module:'novy_modul',label:'Nový modul'});adminPanel('permissions')">+ Přidat modul práv</button>
          <button class="btn primary" onclick="saveAdminCatalog()">Uložit oprávnění</button>
        </div>`;
      return;
    }

    if(type === 'insurers'){
      box.innerHTML = `
        <h2>Pojišťovny v číselníku</h2>
        <p class="muted">Rozšířený číselník pro poptávky. ARES napojení bude doplněno v samostatném kroku nad IČO.</p>
        <div class="table-wrap admin-safe-table"><table>
          <thead><tr><th>Zkratka</th><th>Název</th><th>IČO</th><th>Adresa</th><th>E-mail</th><th>Web / portál</th><th>Aktivní</th></tr></thead>
          <tbody>${CATALOG.insurers.map((i,idx)=>`
            <tr>
              <td><input value="${brh422Esc(i.code||i.short||'')}" onchange="CATALOG.insurers[${idx}].code=this.value;CATALOG.insurers[${idx}].short=this.value"></td>
              <td><input value="${brh422Esc(i.name||'')}" onchange="CATALOG.insurers[${idx}].name=this.value"></td>
              <td><input value="${brh422Esc(i.ico||'')}" onchange="CATALOG.insurers[${idx}].ico=this.value"></td>
              <td><input value="${brh422Esc(i.address||'')}" onchange="CATALOG.insurers[${idx}].address=this.value"></td>
              <td><input value="${brh422Esc(i.email||i.request_email||'')}" onchange="CATALOG.insurers[${idx}].email=this.value;CATALOG.insurers[${idx}].request_email=this.value"></td>
              <td><input value="${brh422Esc(i.portal||i.url||i.web||'')}" onchange="CATALOG.insurers[${idx}].portal=this.value;CATALOG.insurers[${idx}].web=this.value"></td>
              <td><select onchange="CATALOG.insurers[${idx}].active=this.value==='ano'"><option ${i.active!==false?'selected':''}>ano</option><option ${i.active===false?'selected':''}>ne</option></select></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.insurers.push({code:'',short:'',name:'',ico:'',address:'',email:'',request_email:'',portal:'',web:'',active:true});adminPanel('insurers')">+ Přidat pojišťovnu</button>
          <button class="btn primary" onclick="saveAdminCatalog()">Uložit pojišťovny</button>
        </div>`;
      return;
    }

    if(type === 'attachments'){
      box.innerHTML = `
        <h2>Číselník příloh</h2>
        <p class="muted">Základní přílohy i přílohy podle modulu. Poradce může v případu vždy doplnit vlastní přílohu.</p>
        <div class="table-wrap admin-safe-table"><table>
          <thead><tr><th>ID</th><th>Název</th><th>Kategorie</th><th>Rozsah</th><th>Povinná</th><th>Nápověda</th><th>Akce</th></tr></thead>
          <tbody>${CATALOG.attachmentTypes.map((a,idx)=>`
            <tr>
              <td><input value="${brh422Esc(a.id||'')}" onchange="CATALOG.attachmentTypes[${idx}].id=this.value"></td>
              <td><input value="${brh422Esc(a.title||a.name||'')}" onchange="CATALOG.attachmentTypes[${idx}].title=this.value;CATALOG.attachmentTypes[${idx}].name=this.value"></td>
              <td><input value="${brh422Esc(a.category||'')}" onchange="CATALOG.attachmentTypes[${idx}].category=this.value"></td>
              <td><select onchange="CATALOG.attachmentTypes[${idx}].scope=this.value"><option ${a.scope==='all'?'selected':''} value="all">obecné</option><option ${a.scope==='liability'?'selected':''} value="liability">odpovědnost</option><option ${a.scope==='property'?'selected':''} value="property">majetek</option><option ${a.scope==='custom'?'selected':''} value="custom">vlastní</option></select></td>
              <td><input type="checkbox" ${a.required?'checked':''} onchange="CATALOG.attachmentTypes[${idx}].required=this.checked"></td>
              <td><textarea onchange="CATALOG.attachmentTypes[${idx}].note=this.value">${brh422Esc(a.note||'')}</textarea></td>
              <td><button class="btn danger" onclick="CATALOG.attachmentTypes.splice(${idx},1);adminPanel('attachments')">Smazat</button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.attachmentTypes.push({id:'att_'+Date.now(),title:'Nová příloha',category:'Vlastní',scope:'custom',required:false,note:''});adminPanel('attachments')">+ Přidat přílohu</button>
          <button class="btn primary" onclick="saveAdminCatalog()">Uložit přílohy</button>
        </div>`;
      return;
    }

    if(type === 'texts'){
      box.innerHTML = `
        <h2>Textace</h2>
        <p class="muted">Centrální textace pro poptávky, nabídky, zprávy klientovi a interní práci.</p>
        <div class="table-wrap admin-safe-table"><table>
          <thead><tr><th>Název</th><th>Typ</th><th>Kategorie</th><th>Text</th><th>Aktivní</th><th>Akce</th></tr></thead>
          <tbody>${CATALOG.textTemplates.map((t,idx)=>`
            <tr>
              <td><input value="${brh422Esc(t.title||t.name||'')}" onchange="CATALOG.textTemplates[${idx}].title=this.value;CATALOG.textTemplates[${idx}].name=this.value"></td>
              <td><input value="${brh422Esc(t.type||'')}" onchange="CATALOG.textTemplates[${idx}].type=this.value"></td>
              <td><input value="${brh422Esc(t.category||'')}" onchange="CATALOG.textTemplates[${idx}].category=this.value"></td>
              <td><textarea class="tall" onchange="CATALOG.textTemplates[${idx}].text=this.value">${brh422Esc(t.text||t.body||'')}</textarea></td>
              <td><select onchange="CATALOG.textTemplates[${idx}].active=this.value==='ano'"><option ${t.active!==false?'selected':''}>ano</option><option ${t.active===false?'selected':''}>ne</option></select></td>
              <td><button class="btn danger" onclick="CATALOG.textTemplates.splice(${idx},1);adminPanel('texts')">Smazat</button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.textTemplates.push({title:'Nová textace',type:'poptávka',category:'obecné',text:'',active:true});adminPanel('texts')">+ Nová textace</button>
          <button class="btn primary" onclick="saveAdminCatalog()">Uložit textace</button>
        </div>`;
      return;
    }

    if(type === 'liabilityRisks'){
      box.innerHTML = `
        <h2>Modul Odpovědnost – rizika</h2>
        <p class="muted">Dynamický číselník odpovědnostních rizik. Interní metodika slouží jako nápověda a neexportuje se do poptávky.</p>
        <div class="table-wrap admin-safe-table"><table>
          <thead><tr><th>Interní klíč</th><th>Název rizika</th><th>Doporučený limit</th><th>Sublimit</th><th>Interní metodika</th><th>Aktivní</th><th>Akce</th></tr></thead>
          <tbody>${CATALOG.liabilityRisks.map((r,idx)=>`
            <tr>
              <td><input value="${brh422Esc(r.risk_key||r.key||'')}" onchange="CATALOG.liabilityRisks[${idx}].risk_key=this.value;CATALOG.liabilityRisks[${idx}].key=this.value"></td>
              <td><textarea onchange="CATALOG.liabilityRisks[${idx}].name=this.value">${brh422Esc(r.name||'')}</textarea></td>
              <td><input value="${brh422Esc(r.recommended_limit||r.limit||'')}" onchange="CATALOG.liabilityRisks[${idx}].recommended_limit=this.value"></td>
              <td><input value="${brh422Esc(r.recommended_sublimit||'')}" onchange="CATALOG.liabilityRisks[${idx}].recommended_sublimit=this.value"></td>
              <td><textarea class="tall" onchange="CATALOG.liabilityRisks[${idx}].internal_note=this.value">${brh422Esc(r.internal_note||r.description||'')}</textarea></td>
              <td><select onchange="CATALOG.liabilityRisks[${idx}].active=this.value==='ano'"><option ${r.active!==false?'selected':''}>ano</option><option ${r.active===false?'selected':''}>ne</option></select></td>
              <td><button class="btn danger" onclick="CATALOG.liabilityRisks.splice(${idx},1);adminPanel('liabilityRisks')">Smazat</button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.liabilityRisks.push({risk_key:'custom_'+Date.now(),name:'Nové riziko',recommended_limit:'',recommended_sublimit:'',internal_note:'',module:'liability',active:true});adminPanel('liabilityRisks')">+ Přidat riziko</button>
          <button class="btn primary" onclick="saveAdminCatalog()">Uložit rizika</button>
        </div>`;
      return;
    }

    if(type === 'liabilityAgreements'){
      box.innerHTML = `
        <h2>Modul Odpovědnost – zvláštní ujednání</h2>
        <p class="muted">Textace a doložky, které poradce může vložit do konkrétního obchodního případu.</p>
        <div class="table-wrap admin-safe-table"><table>
          <thead><tr><th>Název</th><th>Text ujednání</th><th>Limit / sublimit</th><th>Aktivní</th><th>Akce</th></tr></thead>
          <tbody>${CATALOG.liabilityAgreements.map((a,idx)=>`
            <tr>
              <td><textarea onchange="CATALOG.liabilityAgreements[${idx}].title=this.value">${brh422Esc(a.title||a.name||'')}</textarea></td>
              <td><textarea class="tall" onchange="CATALOG.liabilityAgreements[${idx}].text=this.value">${brh422Esc(a.text||'')}</textarea></td>
              <td><input value="${brh422Esc(a.limit||'')}" onchange="CATALOG.liabilityAgreements[${idx}].limit=this.value"></td>
              <td><select onchange="CATALOG.liabilityAgreements[${idx}].active=this.value==='ano'"><option ${a.active!==false?'selected':''}>ano</option><option ${a.active===false?'selected':''}>ne</option></select></td>
              <td><button class="btn danger" onclick="CATALOG.liabilityAgreements.splice(${idx},1);adminPanel('liabilityAgreements')">Smazat</button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.liabilityAgreements.push({id:'agr_'+Date.now(),title:'Nové ujednání',text:'',limit:'',module:'liability',active:true});adminPanel('liabilityAgreements')">+ Přidat ujednání</button>
          <button class="btn primary" onclick="saveAdminCatalog()">Uložit ujednání</button>
        </div>`;
      return;
    }

    if(type === 'json'){
      box.innerHTML = `
        <h2>Import / export JSON</h2>
        <p class="muted">Servisní náhled aktuálních číselníků. Slouží pro kontrolu, ne pro běžnou práci poradce.</p>
        <textarea class="json-box" readonly>${brh422Esc(JSON.stringify(CATALOG, null, 2))}</textarea>`;
      return;
    }
  };

  const brh422OldSave = window.saveAdminCatalog;
  window.saveAdminCatalog = async function(){
    brh422EnsureCatalog();
    if(typeof brh422OldSave === 'function'){
      return brh422OldSave();
    }
    if(typeof fetchJson === 'function'){
      const payload = {
        insurers: CATALOG.insurers,
        advisers: CATALOG.advisers,
        activities: CATALOG.activities,
        risks: CATALOG.risks,
        riskModel: CATALOG.riskModel,
        textTemplates: CATALOG.textTemplates,
        attachmentTypes: CATALOG.attachmentTypes,
        liabilityRisks: CATALOG.liabilityRisks,
        liabilityAgreements: CATALOG.liabilityAgreements,
        users: CATALOG.users,
        modulePermissions: CATALOG.modulePermissions,
        roleProfiles: CATALOG.roleProfiles,
        actor_email: (window.state && state.adviser && state.adviser.email) || ''
      };
      const data = await fetchJson('/api/admin/catalogs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(typeof toast === 'function') toast(data.message || 'Admin číselníky byly uloženy.');
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    if(document.getElementById('adminBox') && document.querySelector('[data-view="admin"].active')){
      renderAdmin();
    }
  });
})();


/* =====================================================================
   BRH 4.4.0 – Advisor Professional Cards Workflow SAFE
   Bezpečná oprava po 4.3.0:
   - NEPŘEPISUJE hlavní renderWorkspace.
   - NEPŘIDÁVÁ globální click listener.
   - NEBLOKUJE žádná tlačítka.
   - Přidává jen izolované funkce pro profesionální karty.
   ===================================================================== */
(function(){
  window.BRH_VERSION = '4.4.0';

  function brh431Esc(v){
    return String(v ?? '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }
  function brh431Arr(x){ return Array.isArray(x) ? x : []; }
  function brh431State(){ window.state = window.state || {}; return window.state; }
  function brh431Case(){
    const s = brh431State();
    s.currentCase = s.currentCase || {};
    return s.currentCase;
  }
  function brh431Client(){
    const c = brh431Case();
    c.client = c.client || {};
    c.client.contacts = brh431Arr(c.client.contacts);
    c.client.signers = brh431Arr(c.client.signers);
    return c.client;
  }
  function brh431Insurance(){
    const c = brh431Case();
    c.insuranceCard = c.insuranceCard || {};
    c.insuranceCard.businessPremises = brh431Arr(c.insuranceCard.businessPremises);
    c.insuranceCard.activities = brh431Arr(c.insuranceCard.activities);
    c.insuranceCard.claimsHistory = brh431Arr(c.insuranceCard.claimsHistory);
    return c.insuranceCard;
  }
  function brh431Adviser(){
    const s = brh431State();
    const a = s.adviser || s.user || {};
    return {
      name: a.name || a.full_name || a.displayName || 'Administrátor ASTORIE',
      email: a.email || 'admin@astorie.local',
      phone: a.phone || a.tel || '',
      role: a.role || a.position || 'Poradce / zpracovatel',
      note: 'Načítá se automaticky z přihlášení.'
    };
  }
  function brh431Input(label, value, attr){
    return '<label class="field431"><span>'+brh431Esc(label)+'</span><input value="'+brh431Esc(value)+'" '+attr+'></label>';
  }
  function brh431Textarea(label, value, attr){
    return '<label class="field431 wide431"><span>'+brh431Esc(label)+'</span><textarea '+attr+'>'+brh431Esc(value)+'</textarea></label>';
  }

  window.brh431SetClient = function(key, value){
    brh431Client()[key] = value;
  };
  window.brh431SetInsurance = function(key, value){
    brh431Insurance()[key] = value;
  };
  window.brh431AddClientContact = function(){
    brh431Client().contacts.push({name:'', email:'', phone:'', insurance_area:''});
    if(typeof window.brh431RefreshCards === 'function') window.brh431RefreshCards('client');
  };
  window.brh431RemoveClientContact = function(idx){
    brh431Client().contacts.splice(idx, 1);
    if(typeof window.brh431RefreshCards === 'function') window.brh431RefreshCards('client');
  };
  window.brh431AddPremise = function(){
    brh431Insurance().businessPremises.push({address:'', use:'', note:''});
    if(typeof window.brh431RefreshCards === 'function') window.brh431RefreshCards('insurance');
  };
  window.brh431RemovePremise = function(idx){
    brh431Insurance().businessPremises.splice(idx, 1);
    if(typeof window.brh431RefreshCards === 'function') window.brh431RefreshCards('insurance');
  };

  window.brh431RenderAdviserCard = function(){
    const a = brh431Adviser();
    return ''+
      '<section class="card431 adviser431">'+
        '<div class="card431head"><div><p class="eyebrow">Karta poradce / zpracovatele</p><h3>'+brh431Esc(a.name)+'</h3><p class="muted">'+brh431Esc(a.note)+'</p></div><div class="badge431">ASTORIE</div></div>'+
        '<div class="grid431 four431">'+
          '<div class="info431"><span>Role</span><b>'+brh431Esc(a.role)+'</b></div>'+
          '<div class="info431"><span>E-mail</span><b>'+brh431Esc(a.email)+'</b></div>'+
          '<div class="info431"><span>Telefon</span><b>'+brh431Esc(a.phone || 'není uveden')+'</b></div>'+
          '<div class="info431"><span>Zdroj</span><b>Přihlášení</b></div>'+
        '</div>'+
      '</section>';
  };

  window.brh431RenderClientCard = function(){
    const c = brh431Client();
    const contacts = brh431Arr(c.contacts);
    return ''+
      '<section class="card431">'+
        '<div class="card431head"><div><p class="eyebrow">Profesionální karta klienta</p><h3>Identifikace klienta</h3><p class="muted">Klientská část je oddělena od odborných pojistných údajů.</p></div></div>'+
        '<div class="grid431 three431">'+
          brh431Input('Název klienta', c.name || c.client_name || '', 'onchange="brh431SetClient(\'name\',this.value)"')+
          brh431Input('IČO', c.ico || c.ic || '', 'onchange="brh431SetClient(\'ico\',this.value)"')+
          brh431Input('Právní forma', c.legal_form || '', 'onchange="brh431SetClient(\'legal_form\',this.value)"')+
        '</div>'+
        '<div class="grid431 two431">'+
          brh431Input('Sídlo / adresa', c.address || '', 'onchange="brh431SetClient(\'address\',this.value)"')+
          brh431Input('Datová schránka', c.data_box || '', 'onchange="brh431SetClient(\'data_box\',this.value)"')+
        '</div>'+
        '<div class="grid431 three431">'+
          brh431Input('Web', c.web || '', 'onchange="brh431SetClient(\'web\',this.value)"')+
          brh431Input('Obecný e-mail', c.general_email || '', 'onchange="brh431SetClient(\'general_email\',this.value)"')+
          brh431Input('Další poznámka', c.other_address_note || '', 'onchange="brh431SetClient(\'other_address_note\',this.value)"')+
        '</div>'+
      '</section>'+
      '<section class="card431" id="brh431ClientContacts">'+
        '<div class="card431head"><div><p class="eyebrow">Kontaktní osoby</p><h3>Kontaktní osoby pro jednání o pojistné smlouvě</h3></div><button class="btn secondary" type="button" onclick="brh431AddClientContact()">+ Přidat kontaktní osobu</button></div>'+
        (contacts.length ? contacts.map(function(p,idx){
          return '<div class="row431 contact431">'+
            '<label><span>Příjmení a jméno</span><input value="'+brh431Esc(p.name||'')+'" onchange="brh431Client().contacts['+idx+'].name=this.value"></label>'+
            '<label><span>E-mail</span><input value="'+brh431Esc(p.email||'')+'" onchange="brh431Client().contacts['+idx+'].email=this.value"></label>'+
            '<label><span>Telefon</span><input value="'+brh431Esc(p.phone||'')+'" onchange="brh431Client().contacts['+idx+'].phone=this.value"></label>'+
            '<label><span>Oblast pojištění</span><input value="'+brh431Esc(p.insurance_area||'')+'" onchange="brh431Client().contacts['+idx+'].insurance_area=this.value"></label>'+
            '<button class="btn danger" type="button" onclick="brh431RemoveClientContact('+idx+')">Smazat</button>'+
          '</div>';
        }).join('') : '<div class="empty431">Zatím není doplněna žádná kontaktní osoba.</div>')+
      '</section>';
  };

  window.brh431RenderInsuranceCard = function(){
    const i = brh431Insurance();
    const premises = brh431Arr(i.businessPremises);
    return ''+
      '<section class="card431">'+
        '<div class="card431head"><div><p class="eyebrow">Karta pro pojištění</p><h3>Údaje pro poptávku a pojišťovny</h3><p class="muted">Společná odborná data pro poptávky, nabídky, porovnání a výstupy.</p></div></div>'+
        '<div class="grid431 four431">'+
          brh431Input('Typ činnosti', i.activity_type || '', 'onchange="brh431SetInsurance(\'activity_type\',this.value)"')+
          brh431Input('Kód činnosti', i.activity_code || '', 'onchange="brh431SetInsurance(\'activity_code\',this.value)"')+
          brh431Input('Územní rozsah', i.territory || 'Česká republika', 'onchange="brh431SetInsurance(\'territory\',this.value)"')+
          brh431Input('Pojistné období', i.insurance_period || '1 rok', 'onchange="brh431SetInsurance(\'insurance_period\',this.value)"')+
          brh431Input('Počátek pojištění', i.start_date || '', 'onchange="brh431SetInsurance(\'start_date\',this.value)"')+
          brh431Input('Frekvence placení', i.payment_frequency || 'ročně', 'onchange="brh431SetInsurance(\'payment_frequency\',this.value)"')+
          brh431Input('Obrat', i.turnover || '', 'onchange="brh431SetInsurance(\'turnover\',this.value)"')+
          brh431Input('Počet zaměstnanců', i.employees || '', 'onchange="brh431SetInsurance(\'employees\',this.value)"')+
        '</div>'+
        brh431Textarea('Export / zahraničí / poznámka', i.export_note || '', 'onchange="brh431SetInsurance(\'export_note\',this.value)"')+
      '</section>'+
      '<section class="card431">'+
        '<div class="card431head"><div><p class="eyebrow">Provozovny</p><h3>Provozovny a místa pojištění</h3></div><button class="btn secondary" type="button" onclick="brh431AddPremise()">+ Přidat provozovnu</button></div>'+
        (premises.length ? premises.map(function(p,idx){
          return '<div class="row431 premise431">'+
            '<label><span>Adresa</span><input value="'+brh431Esc(p.address||'')+'" onchange="brh431Insurance().businessPremises['+idx+'].address=this.value"></label>'+
            '<label><span>Využití</span><input value="'+brh431Esc(p.use||'')+'" onchange="brh431Insurance().businessPremises['+idx+'].use=this.value"></label>'+
            '<label><span>Poznámka</span><input value="'+brh431Esc(p.note||'')+'" onchange="brh431Insurance().businessPremises['+idx+'].note=this.value"></label>'+
            '<button class="btn danger" type="button" onclick="brh431RemovePremise('+idx+')">Smazat</button>'+
          '</div>';
        }).join('') : '<div class="empty431">Zatím není doplněna žádná provozovna.</div>')+
      '</section>';
  };

  window.brh431RefreshCards = function(kind){
    const box = document.getElementById('brh431CardsBox');
    if(!box) return;
    if(kind === 'insurance'){
      box.innerHTML = brh431RenderAdviserCard() + brh431RenderInsuranceCard();
    } else {
      box.innerHTML = brh431RenderAdviserCard() + brh431RenderClientCard();
    }
  };

  window.brh431OpenProfessionalCards = function(kind){
    const target =
      document.getElementById('workspaceBody') ||
      document.getElementById('workspaceContent') ||
      document.getElementById('appContent') ||
      document.querySelector('.workspace-body');

    if(!target) return false;

    const isInsurance = kind === 'insurance';
    target.innerHTML =
      '<section class="hero431"><div><p class="eyebrow">'+(isInsurance?'2 · Karta pro pojištění':'1 · Karta klienta')+'</p><h2>'+(isInsurance?'Karta pro pojištění':'Karta klienta')+'</h2><p>Bezpečný režim karet 4.4.0. Hlavní workflow ani tlačítka nejsou přepsána.</p></div></section>'+
      '<div id="brh431CardsBox"></div>';

    brh431RefreshCards(isInsurance ? 'insurance' : 'client');
    return true;
  };
})();


/* ======================================================================
   BRH 4.9.8 – REAL PROFESSIONAL CARDS SAFE
   Poslední přebíjecí vrstva načtená až na konci souboru.
   Opravuje: Karta poradce bez formuláře, stará karta klienta, stará karta pojištění,
   a duplicity pojišťoven v nabídkách/porovnání.
   Bez DB migrace a bez změny API.
   ====================================================================== */
(function(){
  window.BRH_RENDER_VERSION = '480';
  window.BRH_REAL_PRO_CARDS_SAFE = true;

  function A(v){ return Array.isArray(v) ? v : []; }
  function E(v){ return String(v ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m])); }
  function byId(id){ return document.getElementById(id); }

  window.brhUniqueInsurerCodes480 = function(arr){
    const seen = new Set(), out = [];
    (arr || []).forEach(x => {
      let c = String(x || '').trim();
      if(!c) return;
      const k = c.toLowerCase();
      if(!seen.has(k)){ seen.add(k); out.push(c); }
    });
    return out;
  };

  window.selectedInsurerCodes = selectedInsurerCodes = function(){
    state.selected_insurers = brhUniqueInsurerCodes480(state.selected_insurers || []);
    return state.selected_insurers;
  };

  function ensureCardsState480(){
    state.adviser = Object.assign({
      company:'ASTORIE a.s.',
      company_ico:'48293776',
      name:'Administrátor ASTORIE',
      email:'admin@astorie.local',
      phone:'',
      role:'Poradce / zpracovatel',
      note:''
    }, state.adviser || {});

    state.client = Object.assign({
      ico:'', name:'', legal_form:'', address:'', data_box:'',
      contact_person:'', contact_email:'', contact_phone:'',
      website:'', registered_office:'', billing_email:'',
      contact_persons:[],
      signing_persons:[]
    }, state.client || {});

    if(!Array.isArray(state.client.contact_persons)){
      state.client.contact_persons = [];
      if(state.client.contact_person || state.client.contact_email || state.client.contact_phone){
        state.client.contact_persons.push({
          name: state.client.contact_person || '',
          email: state.client.contact_email || '',
          phone: state.client.contact_phone || '',
          area: 'Jednání o pojistné smlouvě'
        });
      }
    }

    if(!Array.isArray(state.client.signing_persons)){
      state.client.signing_persons = [];
    }

    state.questionnaire = Object.assign({
      main_activity_detail:'', side_activities:'', turnover:'', payroll:'', employees:'',
      territory:'Česká republika', locations:'', property_description:'', security:'',
      insurance_start:'', insurance_period:'1 rok', payment_frequency:'ročně',
      annual_revenue_breakdown:'', current_insurance:'', deductible_preference:'',
      requested_scope:'', claims_history:'', attachments_note:'', special_notes:''
    }, state.questionnaire || {});

    state.selected_insurers = brhUniqueInsurerCodes480(state.selected_insurers || []);
  }

  window.brh480AddContactPerson = function(){
    ensureCardsState480();
    state.client.contact_persons.push({name:'', email:'', phone:'', area:'Jednání o pojistné smlouvě'});
    renderWorkspace();
  };
  window.brh480RemoveContactPerson = function(i){
    ensureCardsState480();
    state.client.contact_persons.splice(i,1);
    renderWorkspace();
  };
  window.brh480AddSigningPerson = function(){
    ensureCardsState480();
    state.client.signing_persons.push({name:'', role:'', email:'', phone:''});
    renderWorkspace();
  };
  window.brh480RemoveSigningPerson = function(i){
    ensureCardsState480();
    state.client.signing_persons.splice(i,1);
    renderWorkspace();
  };

  function contactRows480(){
    ensureCardsState480();
    return state.client.contact_persons.map((p,i)=>`
      <div class="pro-contact-row">
        <label>Příjmení a jméno<input id="cp_${i}_name" value="${E(p.name)}" placeholder="Jméno a příjmení"></label>
        <label>E-mail<input id="cp_${i}_email" value="${E(p.email)}" placeholder="e-mail"></label>
        <label>Telefon<input id="cp_${i}_phone" value="${E(p.phone)}" placeholder="telefon"></label>
        <label>Oblast pojištění<input id="cp_${i}_area" value="${E(p.area)}" placeholder="např. odpovědnost, majetek, flotila"></label>
        <button class="btn danger small" onclick="brh480RemoveContactPerson(${i})">Smazat</button>
      </div>
    `).join('') || `<div class="empty">Zatím není doplněna žádná kontaktní osoba.</div>`;
  }

  function signingRows480(){
    ensureCardsState480();
    return state.client.signing_persons.map((p,i)=>`
      <div class="pro-contact-row">
        <label>Příjmení a jméno<input id="sp_${i}_name" value="${E(p.name)}" placeholder="Podepisující osoba"></label>
        <label>Funkce / oprávnění<input id="sp_${i}_role" value="${E(p.role)}" placeholder="jednatel / prokurista / pověřená osoba"></label>
        <label>E-mail<input id="sp_${i}_email" value="${E(p.email)}"></label>
        <label>Telefon<input id="sp_${i}_phone" value="${E(p.phone)}"></label>
        <button class="btn danger small" onclick="brh480RemoveSigningPerson(${i})">Smazat</button>
      </div>
    `).join('') || `<div class="empty">Podepisující osoby zatím nejsou doplněny.</div>`;
  }

  window.tabAdvisor = tabAdvisor = function(){
    ensureCardsState480();
    return `<p class="eyebrow">0. KARTA PORADCE</p>
    <div class="pro-card-hero">
      <div>
        <h2>Karta poradce</h2>
        <p>Údaje poradce a jeho vazba na obchodní případ. Tyto údaje se používají pro pracovní řízení případu, poptávky a výstupy.</p>
      </div>
      <div class="pro-case-badge">CASE<br>${E(state.id || 'nový')}</div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Vazba na společnost</h3><p class="muted">Poradce vystupuje pod ASTORIE a.s.</p></div></div>
      <div class="grid2">
        <label>Společnost<input id="adviser_company" value="ASTORIE a.s." readonly></label>
        <label>IČO společnosti<input id="adviser_company_ico" value="48293776" readonly></label>
      </div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Poradce / vlastník případu</h3><p class="muted">Později lze napojit automaticky z přihlášení.</p></div></div>
      <div class="grid4">
        <label>Jméno poradce<input id="adviser_name" value="${E(state.adviser.name)}" placeholder="Jméno poradce"></label>
        <label>E-mail poradce<input id="adviser_email" value="${E(state.adviser.email)}" placeholder="e-mail poradce"></label>
        <label>Telefon<input id="adviser_phone" value="${E(state.adviser.phone)}" placeholder="telefon"></label>
        <label>Role v případu<input id="adviser_role" value="${E(state.adviser.role)}" placeholder="např. poradce / zpracovatel"></label>
      </div>
      <label>Poznámka poradce<textarea id="adviser_note" placeholder="Interní poznámka k případu, doporučení, další postup...">${E(state.adviser.note)}</textarea></label>
    </div>

    <div class="tools">
      <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu poradce</button>
      <button class="btn secondary" onclick="readCurrentTab();currentTab='client';renderWorkspace()">Pokračovat na kartu klienta</button>
    </div>`;
  };

  window.tabClient = tabClient = function(){
    ensureCardsState480();
    const clientRows = clients.length ? `<div class="client-results">${clients.map((c,i)=>`<div class="case-row"><div><strong>${E(c.name)}</strong><small>IČO: ${E(c.ico||'neuvedeno')} · ${E(c.address||'')}</small></div><button class="btn secondary" onclick="useClient(${i})">Použít klienta</button></div>`).join('')}</div>` : '';
    return `<p class="eyebrow">1. KARTA KLIENTA</p>
    <div class="pro-card-hero">
      <div>
        <h2>Profesionální karta klienta</h2>
        <p>Identifikace klienta, kontakty pro jednání o pojistné smlouvě, osoby podepisující dokumenty a obchodní vazby.</p>
      </div>
      <div class="pro-case-badge">CASE<br>${E(state.id || 'nový')}</div>
    </div>

    <div class="tools pro-search">
      <input id="clientSearch" class="grow" placeholder="Vyhledat klienta v DB podle názvu nebo IČO">
      <button class="btn secondary" onclick="searchClients()">Načíst klienta z DB</button>
    </div>
    ${clientRows}

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Identifikace klienta</h3><p class="muted">Základní obchodní a právní identifikace klienta.</p></div></div>
      <div class="grid3">
        <label>Název klienta<input id="client_name" value="${E(state.client.name)}"></label>
        <label>IČO<div class="inline-field"><input id="client_ico" value="${E(state.client.ico)}"><button class="btn secondary small" onclick="loadAres()">ARES</button></div></label>
        <label>Právní forma<input id="client_legal_form" value="${E(state.client.legal_form)}"></label>
      </div>
      <label>Sídlo / adresa<input id="client_address" value="${E(state.client.address)}"></label>
      <div class="grid4">
        <label>Datová schránka<input id="client_data_box" value="${E(state.client.data_box)}"></label>
        <label>Web<input id="client_website" value="${E(state.client.website)}"></label>
        <label>Fakturační / obecný e-mail<input id="client_billing_email" value="${E(state.client.billing_email)}"></label>
        <label>Další adresa / poznámka<input id="client_registered_office" value="${E(state.client.registered_office)}"></label>
      </div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head">
        <div><h3>Kontaktní osoby pro jednání o pojistné smlouvě</h3><p class="muted">Každá osoba může mít vlastní oblast pojištění.</p></div>
        <button class="btn secondary" onclick="brh480AddContactPerson()">+ Přidat kontaktní osobu</button>
      </div>
      ${contactRows480()}
    </div>

    <div class="section-soft pro-section">
      <div class="section-head">
        <div><h3>Osoby podepisující dokumenty</h3><p class="muted">Zachováno jako samostatná část karty klienta.</p></div>
        <button class="btn secondary" onclick="brh480AddSigningPerson()">+ Přidat podepisující osobu</button>
      </div>
      ${signingRows480()}
    </div>

    <div class="tools">
      <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu klienta</button>
      <button class="btn secondary" onclick="readCurrentTab();currentTab='insurance';renderWorkspace()">Pokračovat na kartu pro pojištění</button>
    </div>`;
  };

  window.tabInsurance = tabInsurance = function(){
    ensureCardsState480();
    return `<p class="eyebrow">2. KARTA PRO POJIŠTĚNÍ</p>
    <div class="pro-card-hero">
      <div>
        <h2>Profesionální karta pro pojištění</h2>
        <p>Odborná underwriting data pro poptávku pojišťovnám, nabídky, porovnání a klientský výstup. Nejde o identifikační kartu klienta.</p>
      </div>
      <div class="pro-case-badge">CASE<br>${E(state.id || 'nový')}</div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Činnost klienta</h3><p class="muted">Popis skutečné činnosti je klíčový pro pojistitele.</p></div></div>
      <div class="grid3">
        <label>Typ činnosti<input id="activity_name" list="activityList" value="${E(state.activity?.name||'')}" placeholder="např. Bezpečnostní agentura"><datalist id="activityList">${activityOptions()}</datalist></label>
        <label>Kód činnosti<input id="activity_code" value="${E(state.activity?.code||'')}"></label>
        <label>Území<input id="q_territory" value="${E(state.questionnaire.territory)}"></label>
      </div>
      <label>Detail hlavní činnosti<textarea id="q_main_activity_detail" placeholder="Co klient skutečně dělá, jaký je provoz, služby, výrobky, dodavatelé, odběratelé...">${E(state.questionnaire.main_activity_detail)}</textarea></label>
      <label>Vedlejší činnosti<textarea id="q_side_activities" placeholder="Vedlejší nebo okrajové činnosti, které mají být zahrnuty do poptávky...">${E(state.questionnaire.side_activities)}</textarea></label>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Ekonomické a provozní údaje</h3><p class="muted">Údaje se propisují do poptávek a pracovních výstupů.</p></div></div>
      <div class="grid4">
        <label>Obrat<input id="q_turnover" value="${E(state.questionnaire.turnover)}" placeholder="např. 10 000 000 Kč"></label>
        <label>Mzdy / payroll<input id="q_payroll" value="${E(state.questionnaire.payroll)}"></label>
        <label>Zaměstnanci<input id="q_employees" value="${E(state.questionnaire.employees)}"></label>
        <label>Pojistné období<input id="q_insurance_period" value="${E(state.questionnaire.insurance_period)}"></label>
        <label>Frekvence placení<input id="q_payment_frequency" value="${E(state.questionnaire.payment_frequency || 'ročně')}"></label>
      </div>
      <label>Členění obratu / export / zahraničí<textarea id="q_annual_revenue_breakdown" placeholder="Tuzemsko, EU, mimo EU, obrat podle činností...">${E(state.questionnaire.annual_revenue_breakdown || state.questionnaire.export_info)}</textarea></label>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Majetek, provozovny a zabezpečení</h3><p class="muted">Důležité pro majetek, odpovědnost i zvláštní ujednání.</p></div></div>
      <label>Provozovny / místa pojištění<textarea id="q_locations" placeholder="Adresy provozoven, sklady, kanceláře, výrobní prostory...">${E(state.questionnaire.locations)}</textarea></label>
      <label>Popis majetku / vybavení / zásob<textarea id="q_property_description" placeholder="Budovy, stroje, technologie, zásoby, vybavení...">${E(state.questionnaire.property_description)}</textarea></label>
      <label>Zabezpečení<textarea id="q_security" placeholder="EPS, EZS, ostraha, kamerový systém, požární ochrana...">${E(state.questionnaire.security)}</textarea></label>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Požadovaný rozsah a podklady</h3><p class="muted">Základ pro samostatné poptávky pojišťovnám.</p></div></div>
      <div class="grid3">
        <label>Počátek pojištění<input id="q_insurance_start" type="date" value="${E(state.questionnaire.insurance_start)}"></label>
        <label>Preferovaná spoluúčast<input id="q_deductible_preference" value="${E(state.questionnaire.deductible_preference)}"></label>
        <label>Současné pojištění<input id="q_current_insurance" value="${E(state.questionnaire.current_insurance)}"></label>
      </div>
      <label>Požadovaný rozsah pojištění<textarea id="q_requested_scope" placeholder="Co má být určitě poptáno, limity, připojištění, požadované klauzule...">${E(state.questionnaire.requested_scope)}</textarea></label>
      <label>Škodní průběh<textarea id="q_claims_history" placeholder="Škody za poslední roky, frekvence, výše, poznámky...">${E(state.questionnaire.claims_history)}</textarea></label>
      <label>Přílohy / podklady<textarea id="q_attachments_note" placeholder="Dotazníky, revize, smlouvy, stávající pojistky, výpisy, fotodokumentace...">${E(state.questionnaire.attachments_note)}</textarea></label>
      <label>Speciální poznámka pro poptávku<textarea id="q_special_notes">${E(state.questionnaire.special_notes || state.questionnaire.export_info)}</textarea></label>
    </div>

    <div class="tools">
      <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu pro pojištění</button>
      <button class="btn secondary" onclick="readCurrentTab();currentTab='liability';renderWorkspace()">Pokračovat na modul odpovědnosti</button>
    </div>`;
  };

  function readContacts480(){
    ensureCardsState480();
    state.client.contact_persons = state.client.contact_persons.map((p,i)=>({
      name: byId(`cp_${i}_name`)?.value || '',
      email: byId(`cp_${i}_email`)?.value || '',
      phone: byId(`cp_${i}_phone`)?.value || '',
      area: byId(`cp_${i}_area`)?.value || ''
    }));
    if(state.client.contact_persons[0]){
      state.client.contact_person = state.client.contact_persons[0].name || '';
      state.client.contact_email = state.client.contact_persons[0].email || '';
      state.client.contact_phone = state.client.contact_persons[0].phone || '';
    }
    state.client.signing_persons = state.client.signing_persons.map((p,i)=>({
      name: byId(`sp_${i}_name`)?.value || '',
      role: byId(`sp_${i}_role`)?.value || '',
      email: byId(`sp_${i}_email`)?.value || '',
      phone: byId(`sp_${i}_phone`)?.value || ''
    }));
  }

  window.readCurrentTab = readCurrentTab = function(){
    ensureCardsState480();

    if(currentTab === 'advisor'){
      ['name','email','phone','role','company','company_ico','note'].forEach(k => {
        const el = byId('adviser_' + k);
        if(el) state.adviser[k] = el.value;
      });
    }

    if(currentTab === 'client'){
      ['ico','name','legal_form','address','data_box','contact_person','contact_email','contact_phone','website','registered_office','billing_email'].forEach(k => {
        const el = byId('client_' + k);
        if(el) state.client[k] = el.value;
      });
      readContacts480();
    }

    if(currentTab === 'insurance'){
      ['name','code'].forEach(k => {
        const el = byId('activity_' + k);
        if(el) state.activity[k] = el.value;
      });
      ['turnover','employees','territory','insurance_start','insurance_period','payment_frequency','export_info','main_activity_detail','side_activities','annual_revenue_breakdown','payroll','locations','property_description','security','claims_history','current_insurance','requested_scope','deductible_preference','special_notes','attachments_note'].forEach(k => {
        const el = byId('q_' + k);
        if(el) state.questionnaire[k] = el.value;
      });
    }

    if(currentTab === 'attachments'){
      const el = byId('q_attachments_note');
      if(el) state.questionnaire.attachments_note = el.value;
    }

    if(currentTab === 'recommendation'){
      state.report.advisor_note = byId('advisor_note')?.value || '';
      state.report.client_selected_offer = byId('selected_offer')?.value || state.report.client_selected_offer || '';
      state.report.client_choice_reason = byId('choice_reason')?.value || '';
    }

    state.selected_insurers = brhUniqueInsurerCodes480(state.selected_insurers || []);
  };

  // Přepis finálních rendererů po starších patch vrstvách.
  window.renderWorkspace = renderWorkspace = function(){
    ensureCardsState480();
    state.selected_insurers = brhUniqueInsurerCodes480(state.selected_insurers || []);
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === currentTab));
    const map = {
      advisor: tabAdvisor,
      client: tabClient,
      insurance: tabInsurance,
      liability: tabLiability,
      risks: tabRisks,
      insurers: tabInsurers,
      attachments: tabAttachments,
      requests: tabInsurerRequests,
      offers: tabOffers,
      comparison: tabComparison,
      recommendation: tabRecommendation,
      output: tabOutput,
      audit: tabAudit
    };
    const box = byId('tabContent');
    if(box) box.innerHTML = (map[currentTab] || tabClient)();
    renderHeader();
  };

  // Oprava nabídek/porovnání: vždy jen unikátní pojišťovny.
  const oldTabOffers480 = tabOffers;
  window.tabOffers = tabOffers = function(){
    state.selected_insurers = brhUniqueInsurerCodes480(state.selected_insurers || []);
    return oldTabOffers480();
  };

  const oldTabComparison480 = tabComparison;
  window.tabComparison = tabComparison = function(){
    state.selected_insurers = brhUniqueInsurerCodes480(state.selected_insurers || []);
    return oldTabComparison480();
  };

  const oldTabRecommendation480 = tabRecommendation;
  window.tabRecommendation = tabRecommendation = function(){
    state.selected_insurers = brhUniqueInsurerCodes480(state.selected_insurers || []);
    return oldTabRecommendation480();
  };

})();


/* ======================================================================
   BRH 4.9.8 – ADVISOR SPECIFICATION REPAIR SAFE
   Oprava po chybné 4.8.1. Základ je stabilní 4.8.0.
   - Kontaktní osoby ponechány v původní dynamické architektuře.
   - Podepisující osoby ponechány v původní dynamické architektuře.
   - Doplněna požadovaná pole poradce do karty klienta a karty pojištění.
   - Bez DB migrace, bez změny API, bez zásahu do modulů nabídky/porovnání.
   ====================================================================== */
(function(){
  window.BRH_RENDER_VERSION = '482';
  window.BRH_ADVISOR_SPEC_REPAIR_SAFE = true;

  function E482(v){
    return String(v ?? '').replace(/[&<>'"]/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m];
    });
  }
  function byId482(id){ return document.getElementById(id); }

  function ensureState482(){
    state.client = Object.assign({
      ico:'', name:'', legal_form:'', address:'', file_no:'', data_box:'',
      website:'', billing_email:'', registered_office:'', relation:'',
      internal_note:'', sign_type:'Ručně',
      contact_persons:[], signing_persons:[]
    }, state.client || {});

    state.client.contact_persons = Array.isArray(state.client.contact_persons) ? state.client.contact_persons : [];
    state.client.signing_persons = Array.isArray(state.client.signing_persons) ? state.client.signing_persons : [];

    // zachování kompatibility se staršími single poli
    if(!state.client.contact_persons.length && (state.client.contact_person || state.client.contact_email || state.client.contact_phone)){
      state.client.contact_persons.push({
        name: state.client.contact_person || '',
        email: state.client.contact_email || '',
        phone: state.client.contact_phone || '',
        area: 'Jednání o pojistné smlouvě'
      });
    }

    state.questionnaire = Object.assign({
      main_activity_detail:'', side_activities:'', territory:'Česká republika',
      customers:'', suppliers:'', export_info:'', annual_revenue_breakdown:'',
      turnover:'', payroll:'', employees:'', accounting_from:'', accounting_to:'',
      insurance_start:'', insurance_end:'', insurance_indefinite:false,
      insurance_period:'1 rok', payment_due:'', payment_frequency:'ročně',
      currency:'CZK', collection:'', claim_discount:'', long_term_discount:'',
      locations:'', property_description:'', security:'', claims_history:'',
      requested_scope:'', current_insurance:'', deductible_preference:'',
      special_notes:'', attachments_note:''
    }, state.questionnaire || {});

    state.activity = Object.assign({name:'', code:''}, state.activity || {});
  }

  function contactRows482(){
    ensureState482();
    if(!state.client.contact_persons.length){
      return `<div class="empty">Zatím není doplněna žádná kontaktní osoba.</div>`;
    }
    return state.client.contact_persons.map(function(p,i){
      return `<div class="pro-contact-row">
        <label>Jméno<input id="cp_${i}_name" value="${E482(p.name||'')}" placeholder="Jméno a příjmení"></label>
        <label>E-mail<input id="cp_${i}_email" value="${E482(p.email||'')}" placeholder="e-mail"></label>
        <label>Telefon<input id="cp_${i}_phone" value="${E482(p.phone||'')}" placeholder="telefon"></label>
        <label>Oblast pojištění<input id="cp_${i}_area" value="${E482(p.area||'')}" placeholder="např. odpovědnost, majetek, flotila"></label>
        <button class="btn danger small" onclick="brh480RemoveContactPerson(${i})">Smazat</button>
      </div>`;
    }).join('');
  }

  function signingRows482(){
    ensureState482();
    if(!state.client.signing_persons.length){
      return `<div class="empty">Podepisující osoby zatím nejsou doplněny.</div>`;
    }
    return state.client.signing_persons.map(function(p,i){
      return `<div class="pro-contact-row">
        <label>Jméno<input id="sp_${i}_name" value="${E482(p.name||'')}" placeholder="Podepisující osoba"></label>
        <label>Funkce / oprávnění<input id="sp_${i}_role" value="${E482(p.role||'')}" placeholder="jednatel / prokurista / pověřená osoba"></label>
        <label>E-mail<input id="sp_${i}_email" value="${E482(p.email||'')}" placeholder="e-mail"></label>
        <label>Telefon<input id="sp_${i}_phone" value="${E482(p.phone||'')}" placeholder="telefon"></label>
        <button class="btn danger small" onclick="brh480RemoveSigningPerson(${i})">Smazat</button>
      </div>`;
    }).join('');
  }

  // OPRAVA: skutečná karta klienta podle zadání poradce, ale se zachováním Kontaktních a Podepisujících osob.
  window.tabClient = tabClient = function(){
    ensureState482();
    const clientRows = (clients && clients.length) ? `<div class="client-results">${clients.map((c,i)=>`<div class="case-row"><div><strong>${E482(c.name)}</strong><small>IČO: ${E482(c.ico||'neuvedeno')} · ${E482(c.address||'')}</small></div><button class="btn secondary" onclick="useClient(${i})">Použít klienta</button></div>`).join('')}</div>` : '';

    return `<p class="eyebrow">1. KARTA KLIENTA</p>
    <div class="pro-card-hero">
      <div>
        <h2>Profesionální karta klienta</h2>
        <p>Identifikace klienta, obchodní údaje, forma podpisu a vazba na osoby pro jednání i podpis dokumentů.</p>
      </div>
      <div class="pro-case-badge">CASE<br>${E482(state.id || 'nový')}</div>
    </div>

    <div class="tools pro-search">
      <input id="clientSearch" class="grow" placeholder="Vyhledat klienta v DB podle názvu nebo IČO">
      <button class="btn secondary" onclick="searchClients()">Načíst klienta z DB</button>
    </div>
    ${clientRows}

    <div class="section-soft pro-section">
      <div class="section-head">
        <div>
          <h3>Identifikace klienta</h3>
          <p class="muted">Základní právní a obchodní identifikace klienta.</p>
        </div>
      </div>

      <div class="grid3">
        <label>IČO<div class="inline-field"><input id="client_ico" value="${E482(state.client.ico)}"><button class="btn secondary small" onclick="loadAres()">ARES</button></div></label>
        <label>Obchodní název<input id="client_name" value="${E482(state.client.name)}"></label>
        <label>Právní forma<input id="client_legal_form" value="${E482(state.client.legal_form)}"></label>
      </div>

      <label>Sídlo / adresa<input id="client_address" value="${E482(state.client.address)}"></label>

      <div class="grid4">
        <label>Spisová značka<input id="client_file_no" value="${E482(state.client.file_no)}" placeholder="např. C 12345 vedená u ..."></label>
        <label>Datová schránka<input id="client_data_box" value="${E482(state.client.data_box)}"></label>
        <label>Web<input id="client_website" value="${E482(state.client.website)}"></label>
        <label>Fakturační / obecný e-mail<input id="client_billing_email" value="${E482(state.client.billing_email)}"></label>
      </div>

      <div class="grid3">
        <label>Forma podpisu
          <select id="client_sign_type">
            <option value="Ručně" ${state.client.sign_type==='Ručně'?'selected':''}>Ručně</option>
            <option value="Elektronicky" ${state.client.sign_type==='Elektronicky'?'selected':''}>Elektronicky</option>
          </select>
        </label>
        <label>Obchodní vazba<input id="client_relation" value="${E482(state.client.relation)}" placeholder="např. nový klient / stávající klient / skupina"></label>
        <label>Další adresa / poznámka<input id="client_registered_office" value="${E482(state.client.registered_office)}"></label>
      </div>

      <label>Interní poznámka ke klientovi<textarea id="client_internal_note" placeholder="Obchodní vazby, interní souvislosti, poznámky pro underwriting...">${E482(state.client.internal_note)}</textarea></label>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head">
        <div>
          <h3>Kontaktní osoby pro jednání o pojistné smlouvě</h3>
          <p class="muted">Osoby důležité pro sjednání, správu a podpis pojistné smlouvy. Každá osoba může mít vlastní oblast pojištění.</p>
        </div>
        <button class="btn secondary" onclick="brh480AddContactPerson()">+ Přidat kontaktní osobu</button>
      </div>
      ${contactRows482()}
    </div>

    <div class="section-soft pro-section">
      <div class="section-head">
        <div>
          <h3>Osoby oprávněné podepisovat dokumenty</h3>
          <p class="muted">Osoby důležité pro sjednání, správu a podpis pojistné smlouvy. Neměněna původní logika ani vazby.</p>
        </div>
        <button class="btn secondary" onclick="brh480AddSigningPerson()">+ Přidat podepisující osobu</button>
      </div>
      ${signingRows482()}
    </div>

    <div class="tools">
      <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu klienta</button>
      <button class="btn secondary" onclick="readCurrentTab();currentTab='insurance';renderWorkspace()">Pokračovat na kartu pro pojištění</button>
    </div>`;
  };

  // OPRAVA: karta pro pojištění podle zadání poradce, bez zničení underwriting a návazností.
  window.tabInsurance = tabInsurance = function(){
    ensureState482();

    return `<p class="eyebrow">2. KARTA PRO POJIŠTĚNÍ</p>
    <div class="pro-card-hero">
      <div>
        <h2>Profesionální karta pro pojištění</h2>
        <p>Odborná underwriting data pro poptávku, nabídky, porovnání a klientský výstup. Nejde o identifikační kartu klienta.</p>
      </div>
      <div class="pro-case-badge">CASE<br>${E482(state.id || 'nový')}</div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Činnost klienta</h3><p class="muted">Popis skutečné činnosti je klíčový pro pojistitele.</p></div></div>
      <div class="grid3">
        <label>Hlavní činnost<input id="activity_name" list="activityList" value="${E482(state.activity.name)}" placeholder="např. Bezpečnostní agentura"><datalist id="activityList">${activityOptions()}</datalist></label>
        <label>Kód činnosti<input id="activity_code" value="${E482(state.activity.code)}"></label>
        <label>Územní rozsah<input id="q_territory" value="${E482(state.questionnaire.territory)}"></label>
      </div>
      <label>Detail hlavní činnosti<textarea id="q_main_activity_detail" placeholder="Co klient skutečně dělá, jaký je provoz, služby, výrobky, dodavatelé, odběratelé...">${E482(state.questionnaire.main_activity_detail)}</textarea></label>
      <div class="grid2">
        <label>Vedlejší činnosti<textarea id="q_side_activities" placeholder="Vedlejší nebo okrajové činnosti, které mají být zahrnuté v poptávce...">${E482(state.questionnaire.side_activities)}</textarea></label>
        <label>Export / zahraničí<textarea id="q_export_info" placeholder="Tuzemsko, EU, mimo EU, export, práce v zahraničí...">${E482(state.questionnaire.export_info || state.questionnaire.annual_revenue_breakdown)}</textarea></label>
      </div>
      <div class="grid2">
        <label>Odběratelé<input id="q_customers" value="${E482(state.questionnaire.customers)}" placeholder="typ odběratelů / hlavní klienti / segment"></label>
        <label>Dodavatelé<input id="q_suppliers" value="${E482(state.questionnaire.suppliers)}" placeholder="subdodavatelé, dodavatelský řetězec"></label>
      </div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Ekonomické údaje</h3><p class="muted">Údaje pro pojistitele a tarifní výpočet.</p></div></div>
      <div class="grid4">
        <label>Obrat za poslední účetní období<input id="q_turnover" value="${E482(state.questionnaire.turnover)}" placeholder="např. 10 000 000 Kč"></label>
        <label>Mzdy / payroll<input id="q_payroll" value="${E482(state.questionnaire.payroll)}"></label>
        <label>Počet zaměstnanců<input id="q_employees" value="${E482(state.questionnaire.employees)}"></label>
        <label>Měna<input id="q_currency" value="${E482(state.questionnaire.currency || 'CZK')}"></label>
      </div>
      <div class="grid2">
        <label>Účetní období OD<input id="q_accounting_from" type="date" value="${E482(state.questionnaire.accounting_from)}"></label>
        <label>Účetní období DO<input id="q_accounting_to" type="date" value="${E482(state.questionnaire.accounting_to)}"></label>
      </div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Parametry pojistné smlouvy</h3><p class="muted">Parametry budoucí pojistné smlouvy a plateb.</p></div></div>
      <div class="grid4">
        <label>Počátek pojištění<input id="q_insurance_start" type="date" value="${E482(state.questionnaire.insurance_start)}"></label>
        <label>Konec pojištění<input id="q_insurance_end" type="date" value="${E482(state.questionnaire.insurance_end)}"></label>
        <label>Pojistné období<input id="q_insurance_period" value="${E482(state.questionnaire.insurance_period || '1 rok')}"></label>
        <label>Splatnost / frekvence<input id="q_payment_frequency" value="${E482(state.questionnaire.payment_frequency || 'ročně')}"></label>
      </div>
      <div class="grid4">
        <label>Neurčito
          <select id="q_insurance_indefinite">
            <option value="ne" ${state.questionnaire.insurance_indefinite?'':'selected'}>Ne</option>
            <option value="ano" ${state.questionnaire.insurance_indefinite?'selected':''}>Ano</option>
          </select>
        </label>
        <label>Inkaso pojistného<input id="q_collection" value="${E482(state.questionnaire.collection)}" placeholder="ano/ne, účet, poznámka"></label>
        <label>Sleva za škodní průběh<input id="q_claim_discount" value="${E482(state.questionnaire.claim_discount)}"></label>
        <label>Sleva za dlouhodobost<input id="q_long_term_discount" value="${E482(state.questionnaire.long_term_discount)}"></label>
      </div>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Majetek, provozovny a zabezpečení</h3><p class="muted">Důležité pro majetek, odpovědnost i zvláštní ujednání.</p></div></div>
      <label>Provozovny / místa pojištění<textarea id="q_locations" placeholder="Adresy provozoven, sklady, kanceláře, výrobní prostory...">${E482(state.questionnaire.locations)}</textarea></label>
      <label>Popis majetku / vybavení / zásob<textarea id="q_property_description" placeholder="Budovy, stroje, technologie, zásoby, vybavení...">${E482(state.questionnaire.property_description)}</textarea></label>
      <label>Zabezpečení<textarea id="q_security" placeholder="EPS, EZS, ostraha, kamerový systém, požární ochrana...">${E482(state.questionnaire.security)}</textarea></label>
    </div>

    <div class="section-soft pro-section">
      <div class="section-head"><div><h3>Rizikové informace a poptávkové podklady</h3><p class="muted">Podklady pro pojišťovny a následné porovnání.</p></div></div>
      <label>Požadovaný rozsah pojištění<textarea id="q_requested_scope" placeholder="Co má být určitě poptáno, limity, připojištění, požadované klauzule...">${E482(state.questionnaire.requested_scope)}</textarea></label>
      <label>Škodní průběh<textarea id="q_claims_history" placeholder="Škody za poslední roky, frekvence, výše, poznámky...">${E482(state.questionnaire.claims_history)}</textarea></label>
      <div class="grid2">
        <label>Preferovaná spoluúčast<input id="q_deductible_preference" value="${E482(state.questionnaire.deductible_preference)}"></label>
        <label>Současné pojištění<input id="q_current_insurance" value="${E482(state.questionnaire.current_insurance)}"></label>
      </div>
      <label>Přílohy / podklady<textarea id="q_attachments_note" placeholder="Dotazníky, revize, smlouvy, stávající pojistky, výpisy, fotodokumentace...">${E482(state.questionnaire.attachments_note)}</textarea></label>
      <label>Underwriting poznámka / zvláštní podmínky<textarea id="q_special_notes" placeholder="Zvláštní požadavky, interní metodika, poznámky pro poptávku...">${E482(state.questionnaire.special_notes)}</textarea></label>
    </div>

    <div class="tools">
      <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu pro pojištění</button>
      <button class="btn secondary" onclick="readCurrentTab();currentTab='liability';renderWorkspace()">Pokračovat na modul odpovědnosti</button>
    </div>`;
  };

  // Bezpečné dočtení nových polí, včetně původních polí používaných tisky/poptávkami.
  window.readCurrentTab = readCurrentTab = function(){
    ensureState482();

    if(currentTab === 'advisor'){
      ['name','email','phone','role','company','company_ico','note'].forEach(function(k){
        const el = byId482('adviser_' + k);
        if(el) state.adviser[k] = el.value;
      });
    }

    if(currentTab === 'client'){
      ['ico','name','legal_form','address','data_box','website','billing_email','registered_office','file_no','relation','internal_note','sign_type'].forEach(function(k){
        const el = byId482('client_' + k);
        if(el) state.client[k] = el.value;
      });

      state.client.contact_persons = state.client.contact_persons.map(function(p,i){
        return {
          name: byId482(`cp_${i}_name`)?.value || '',
          email: byId482(`cp_${i}_email`)?.value || '',
          phone: byId482(`cp_${i}_phone`)?.value || '',
          area: byId482(`cp_${i}_area`)?.value || ''
        };
      });
      state.client.signing_persons = state.client.signing_persons.map(function(p,i){
        return {
          name: byId482(`sp_${i}_name`)?.value || '',
          role: byId482(`sp_${i}_role`)?.value || '',
          email: byId482(`sp_${i}_email`)?.value || '',
          phone: byId482(`sp_${i}_phone`)?.value || ''
        };
      });

      if(state.client.contact_persons[0]){
        state.client.contact_person = state.client.contact_persons[0].name || '';
        state.client.contact_email = state.client.contact_persons[0].email || '';
        state.client.contact_phone = state.client.contact_persons[0].phone || '';
      }
    }

    if(currentTab === 'insurance'){
      ['name','code'].forEach(function(k){
        const el = byId482('activity_' + k);
        if(el) state.activity[k] = el.value;
      });

      ['territory','main_activity_detail','side_activities','customers','suppliers','export_info','turnover','payroll','employees','currency','accounting_from','accounting_to','insurance_start','insurance_end','insurance_period','payment_frequency','collection','claim_discount','long_term_discount','locations','property_description','security','requested_scope','claims_history','deductible_preference','current_insurance','attachments_note','special_notes'].forEach(function(k){
        const el = byId482('q_' + k);
        if(el) state.questionnaire[k] = el.value;
      });

      const ind = byId482('q_insurance_indefinite');
      if(ind) state.questionnaire.insurance_indefinite = ind.value === 'ano';

      // kompatibilita pro starší výstupy
      state.questionnaire.annual_revenue_breakdown = state.questionnaire.export_info || state.questionnaire.annual_revenue_breakdown || '';
    }

    if(currentTab === 'recommendation'){
      state.report.advisor_note = byId482('advisor_note')?.value || '';
      state.report.client_selected_offer = byId482('selected_offer')?.value || state.report.client_selected_offer || '';
      state.report.client_choice_reason = byId482('choice_reason')?.value || '';
    }

    if(window.brhUniqueInsurerCodes480){
      state.selected_insurers = window.brhUniqueInsurerCodes480(state.selected_insurers || []);
    }
  };

})();

/* BRH 4.9.8 – CARDS UX AND ADVISOR FIELDS SAFE */
(function(){
window.BRH_RENDER_VERSION='483';
function E483(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
function q483(id){return document.getElementById(id);}
function badge483(t){return `<span class="field-badge">${E483(t)}</span>`;}
function ensure483(){
 state.client=Object.assign({ico:'',dic:'',name:'',legal_form:'',address:'',file_no:'',data_box:'',website:'',billing_email:'',registered_office:'',relation:'',internal_note:'',sign_type:'Ručně',contact_persons:[],signing_persons:[]},state.client||{});
 state.client.contact_persons=Array.isArray(state.client.contact_persons)?state.client.contact_persons:[];
 state.client.signing_persons=Array.isArray(state.client.signing_persons)?state.client.signing_persons:[];
 state.questionnaire=Object.assign({main_activity_detail:'',side_activities:'',territory:'Česká republika',customers:'',suppliers:'',export_info:'',annual_revenue_breakdown:'',turnover:'',payroll:'',employees:'',currency:'CZK',accounting_from:'',accounting_to:'',insurance_start:'',insurance_end:'',insurance_indefinite:false,insurance_period:'1 rok',payment_frequency:'ročně',collection:'',claim_discount:'',long_term_discount:'',locations:'',property_description:'',security:'',claims_history:'',requested_scope:'',current_insurance:'',deductible_preference:'',special_notes:'',attachments_note:'',additional_insured:[],custom_fields:[]},state.questionnaire||{});
 state.questionnaire.additional_insured=Array.isArray(state.questionnaire.additional_insured)?state.questionnaire.additional_insured:[];
 state.questionnaire.custom_fields=Array.isArray(state.questionnaire.custom_fields)?state.questionnaire.custom_fields:[];
 state.activity=Object.assign({name:'',code:''},state.activity||{});
}
function contactRows483(){ensure483();return state.client.contact_persons.length?state.client.contact_persons.map((p,i)=>`<div class="pro-contact-row"><label>Jméno<input id="cp_${i}_name" value="${E483(p.name||'')}"></label><label>E-mail<input id="cp_${i}_email" value="${E483(p.email||'')}"></label><label>Telefon<input id="cp_${i}_phone" value="${E483(p.phone||'')}"></label><label>Oblast pojištění<input id="cp_${i}_area" value="${E483(p.area||'')}"></label><button class="btn danger small" onclick="brh480RemoveContactPerson(${i})">Smazat</button></div>`).join(''):`<div class="empty">Zatím není doplněna žádná kontaktní osoba.</div>`;}
function signingRows483(){ensure483();return state.client.signing_persons.length?state.client.signing_persons.map((p,i)=>`<div class="pro-contact-row"><label>Jméno<input id="sp_${i}_name" value="${E483(p.name||'')}"></label><label>Funkce / oprávnění<input id="sp_${i}_role" value="${E483(p.role||'')}"></label><label>E-mail<input id="sp_${i}_email" value="${E483(p.email||'')}"></label><label>Telefon<input id="sp_${i}_phone" value="${E483(p.phone||'')}"></label><button class="btn danger small" onclick="brh480RemoveSigningPerson(${i})">Smazat</button></div>`).join(''):`<div class="empty">Podepisující osoby zatím nejsou doplněny.</div>`;}
window.brh483AddCustomField=function(section){ensure483();state.questionnaire.custom_fields.push({section,label:'',value:''});renderWorkspace();};
window.brh483RemoveCustomField=function(i){ensure483();state.questionnaire.custom_fields.splice(i,1);renderWorkspace();};
function customRows483(section){ensure483();let rows=state.questionnaire.custom_fields.filter(x=>(x.section||'')===section);return rows.length?rows.map(x=>{let i=state.questionnaire.custom_fields.indexOf(x);return `<div class="custom-row"><label>Název údaje<input id="cf_${i}_label" value="${E483(x.label||'')}"></label><label>Hodnota / poznámka<input id="cf_${i}_value" value="${E483(x.value||'')}"></label><button class="btn danger small" onclick="brh483RemoveCustomField(${i})">Smazat</button></div>`}).join(''):`<div class="empty small-empty">Zatím není přidán vlastní údaj.</div>`;}
window.brh483AddAdditionalInsured=function(){ensure483();state.questionnaire.additional_insured.push({name:'',ico:'',relation:'',note:''});renderWorkspace();};
window.brh483RemoveAdditionalInsured=function(i){ensure483();state.questionnaire.additional_insured.splice(i,1);renderWorkspace();};
function additionalInsuredRows483(){ensure483();return state.questionnaire.additional_insured.length?state.questionnaire.additional_insured.map((p,i)=>`<div class="pro-contact-row additional-insured-row"><label>Název / osoba<input id="ai_${i}_name" value="${E483(p.name||'')}"></label><label>IČO / identifikace<input id="ai_${i}_ico" value="${E483(p.ico||'')}"></label><label>Vztah ke klientovi<input id="ai_${i}_relation" value="${E483(p.relation||'')}"></label><label>Poznámka<input id="ai_${i}_note" value="${E483(p.note||'')}"></label><button class="btn danger small" onclick="brh483RemoveAdditionalInsured(${i})">Smazat</button></div>`).join(''):`<div class="empty">Zatím není doplněna žádná další pojištěná osoba.</div>`;}
function details483(title,sub,key,open,body){return `<details class="uw-section" ${open?'open':''}><summary><span><strong>${E483(title)}</strong><small>${E483(sub)}</small></span><span class="summary-badges">${badge483('Poptávka')}${badge483('Nabídky')}</span></summary><div class="uw-section-body">${body}<div class="custom-fields-box"><div class="section-head compact-head"><div><h4>Vlastní údaje poradce</h4><p class="muted">Volná pole pro doplnění chybějících údajů.</p></div><button class="btn secondary small" onclick="brh483AddCustomField('${key}')">+ Přidat údaj</button></div>${customRows483(key)}</div></div></details>`;}
window.tabClient=tabClient=function(){ensure483();const clientRows=(clients&&clients.length)?`<div class="client-results">${clients.map((c,i)=>`<div class="case-row"><div><strong>${E483(c.name)}</strong><small>IČO: ${E483(c.ico||'neuvedeno')} · ${E483(c.address||'')}</small></div><button class="btn secondary" onclick="useClient(${i})">Použít klienta</button></div>`).join('')}</div>`:'';return `<p class="eyebrow">1. KARTA KLIENTA</p><div class="pro-card-hero"><div><h2>Profesionální karta klienta</h2><p>Identifikace klienta, obchodní údaje, forma podpisu a vazba na osoby pro jednání i podpis dokumentů.</p></div><div class="pro-case-badge">CASE<br>${E483(state.id||'nový')}</div></div><div class="tools pro-search"><input id="clientSearch" class="grow" placeholder="Vyhledat klienta v DB podle názvu nebo IČO"><button class="btn secondary" onclick="searchClients()">Načíst klienta z DB</button></div>${clientRows}<div class="section-soft pro-section"><div class="section-head"><div><h3>Identifikace klienta</h3><p class="muted">Přehled právních, obchodních a komunikačních údajů klienta.</p></div><span class="section-tag">${badge483('Poptávka')}${badge483('Výstup')}</span></div><div class="grid4 compact-grid"><label>IČO<div class="inline-field"><input id="client_ico" value="${E483(state.client.ico)}"><button class="btn secondary small" onclick="loadAres()">ARES</button></div></label><label>DIČ<input id="client_dic" value="${E483(state.client.dic)}" placeholder="např. CZ48293776"></label><label>Obchodní název<input id="client_name" value="${E483(state.client.name)}"></label><label>Právní forma<input id="client_legal_form" value="${E483(state.client.legal_form)}"></label></div><label>Sídlo / adresa<input id="client_address" value="${E483(state.client.address)}"></label><div class="grid4 compact-grid"><label>Spisová značka<input id="client_file_no" value="${E483(state.client.file_no)}"></label><label>Datová schránka<input id="client_data_box" value="${E483(state.client.data_box)}"></label><label>Web<input id="client_website" value="${E483(state.client.website)}"></label><label>Fakturační / obecný e-mail<input id="client_billing_email" value="${E483(state.client.billing_email)}"></label></div><div class="grid3 compact-grid"><label>Forma podpisu<select id="client_sign_type"><option value="Ručně" ${state.client.sign_type==='Ručně'?'selected':''}>Ručně</option><option value="Elektronicky" ${state.client.sign_type==='Elektronicky'?'selected':''}>Elektronicky</option></select></label><label>Obchodní vazba<input id="client_relation" value="${E483(state.client.relation)}"></label><label>Další adresa / poznámka<input id="client_registered_office" value="${E483(state.client.registered_office)}"></label></div><label>Interní poznámka ke klientovi<textarea id="client_internal_note">${E483(state.client.internal_note)}</textarea></label></div><div class="section-soft pro-section"><div class="section-head"><div><h3>Kontaktní osoby pro jednání o pojistné smlouvě</h3><p class="muted">Osoby důležité pro sjednání, správu a podpis pojistné smlouvy.</p></div><button class="btn secondary" onclick="brh480AddContactPerson()">+ Přidat kontaktní osobu</button></div>${contactRows483()}</div><div class="section-soft pro-section"><div class="section-head"><div><h3>Osoby oprávněné podepisovat dokumenty</h3><p class="muted">Osoby důležité pro sjednání, správu a podpis pojistné smlouvy.</p></div><button class="btn secondary" onclick="brh480AddSigningPerson()">+ Přidat podepisující osobu</button></div>${signingRows483()}</div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu klienta</button><button class="btn secondary" onclick="readCurrentTab();currentTab='insurance';renderWorkspace()">Pokračovat na kartu pro pojištění</button></div>`;};
window.tabInsurance=tabInsurance=function(){ensure483();return `<p class="eyebrow">2. KARTA PRO POJIŠTĚNÍ</p><div class="pro-card-hero"><div><h2>Profesionální karta pro pojištění</h2><p>Rozklikávací underwriting karta. Štítky ukazují, co se propisuje do poptávky, nabídek a klientského výstupu.</p></div><div class="pro-case-badge">CASE<br>${E483(state.id||'nový')}</div></div>${details483('Činnost klienta','Hlavní činnost, vedlejší činnosti, území, export a obchodní vazby.','activity',true,`<div class="grid3 compact-grid"><label>Hlavní činnost ${badge483('Poptávka')}<input id="activity_name" list="activityList" value="${E483(state.activity.name)}"><datalist id="activityList">${activityOptions()}</datalist></label><label>Kód činnosti<input id="activity_code" value="${E483(state.activity.code)}"></label><label>Územní rozsah ${badge483('Poptávka')}<input id="q_territory" value="${E483(state.questionnaire.territory)}"></label></div><label>Detail hlavní činnosti ${badge483('Poptávka')}<textarea id="q_main_activity_detail">${E483(state.questionnaire.main_activity_detail)}</textarea></label><div class="grid2"><label>Vedlejší činnosti<textarea id="q_side_activities">${E483(state.questionnaire.side_activities)}</textarea></label><label>Export / zahraničí<textarea id="q_export_info">${E483(state.questionnaire.export_info||state.questionnaire.annual_revenue_breakdown)}</textarea></label></div><div class="grid2 compact-grid"><label>Odběratelé<input id="q_customers" value="${E483(state.questionnaire.customers)}"></label><label>Dodavatelé<input id="q_suppliers" value="${E483(state.questionnaire.suppliers)}"></label></div>`)}${details483('Ekonomické údaje','Obrat, mzdy, zaměstnanci, účetní období a měna.','economy',true,`<div class="grid4 compact-grid"><label>Obrat za poslední účetní období ${badge483('Poptávka')}<input id="q_turnover" value="${E483(state.questionnaire.turnover)}"></label><label>Mzdy / payroll<input id="q_payroll" value="${E483(state.questionnaire.payroll)}"></label><label>Počet zaměstnanců ${badge483('Poptávka')}<input id="q_employees" value="${E483(state.questionnaire.employees)}"></label><label>Měna<input id="q_currency" value="${E483(state.questionnaire.currency||'CZK')}"></label></div><div class="grid2 compact-grid"><label>Účetní období OD<input id="q_accounting_from" type="date" value="${E483(state.questionnaire.accounting_from)}"></label><label>Účetní období DO<input id="q_accounting_to" type="date" value="${E483(state.questionnaire.accounting_to)}"></label></div>`)}${details483('Parametry pojistné smlouvy','Počátek, konec, neurčito, splatnost, inkaso a slevy.','contract',false,`<div class="grid4 compact-grid"><label>Počátek pojištění ${badge483('Poptávka')}<input id="q_insurance_start" type="date" value="${E483(state.questionnaire.insurance_start)}"></label><label>Konec pojištění<input id="q_insurance_end" type="date" value="${E483(state.questionnaire.insurance_end)}"></label><label>Pojistné období<input id="q_insurance_period" value="${E483(state.questionnaire.insurance_period||'1 rok')}"></label><label>Splatnost / frekvence<input id="q_payment_frequency" value="${E483(state.questionnaire.payment_frequency||'ročně')}"></label></div><div class="grid4 compact-grid"><label>Neurčito<select id="q_insurance_indefinite"><option value="ne" ${state.questionnaire.insurance_indefinite?'':'selected'}>Ne</option><option value="ano" ${state.questionnaire.insurance_indefinite?'selected':''}>Ano</option></select></label><label>Inkaso pojistného<input id="q_collection" value="${E483(state.questionnaire.collection)}"></label><label>Sleva za škodní průběh<input id="q_claim_discount" value="${E483(state.questionnaire.claim_discount)}"></label><label>Sleva za dlouhodobost<input id="q_long_term_discount" value="${E483(state.questionnaire.long_term_discount)}"></label></div>`)}${details483('Další pojištěné osoby','Další osoby nebo subjekty, které mají být zahrnuty do pojištění.','additional_insured',false,`<div class="section-head compact-head"><div><h4>Seznam dalších pojištěných osob</h4><p class="muted">Např. dceřiné společnosti, vlastníci, provozovatelé, další subjekty ve skupině.</p></div><button class="btn secondary small" onclick="brh483AddAdditionalInsured()">+ Přidat pojištěnou osobu</button></div>${additionalInsuredRows483()}`)}${details483('Majetek, provozovny a zabezpečení','Provozovny, majetek, technologie, zásoby a zabezpečení.','property',false,`<label>Provozovny / místa pojištění ${badge483('Poptávka')}<textarea id="q_locations">${E483(state.questionnaire.locations)}</textarea></label><label>Popis majetku / vybavení / zásob<textarea id="q_property_description">${E483(state.questionnaire.property_description)}</textarea></label><label>Zabezpečení<textarea id="q_security">${E483(state.questionnaire.security)}</textarea></label>`)}${details483('Rizikové informace a podklady','Rozsah pojištění, škodní průběh, přílohy a underwriting poznámky.','risk_documents',false,`<label>Požadovaný rozsah pojištění ${badge483('Poptávka')}<textarea id="q_requested_scope">${E483(state.questionnaire.requested_scope)}</textarea></label><label>Škodní průběh ${badge483('Poptávka')}<textarea id="q_claims_history">${E483(state.questionnaire.claims_history)}</textarea></label><div class="grid2 compact-grid"><label>Preferovaná spoluúčast<input id="q_deductible_preference" value="${E483(state.questionnaire.deductible_preference)}"></label><label>Současné pojištění<input id="q_current_insurance" value="${E483(state.questionnaire.current_insurance)}"></label></div><label>Přílohy / podklady<textarea id="q_attachments_note">${E483(state.questionnaire.attachments_note)}</textarea></label><label>Underwriting poznámka / zvláštní podmínky<textarea id="q_special_notes">${E483(state.questionnaire.special_notes)}</textarea></label>`) }<div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit kartu pro pojištění</button><button class="btn secondary" onclick="readCurrentTab();currentTab='liability';renderWorkspace()">Pokračovat na modul odpovědnosti</button></div>`;};
window.readCurrentTab=readCurrentTab=function(){ensure483();if(currentTab==='advisor'){['name','email','phone','role','company','company_ico','note'].forEach(k=>{const el=q483('adviser_'+k);if(el)state.adviser[k]=el.value;});}if(currentTab==='client'){['ico','dic','name','legal_form','address','data_box','website','billing_email','registered_office','file_no','relation','internal_note','sign_type'].forEach(k=>{const el=q483('client_'+k);if(el)state.client[k]=el.value;});state.client.contact_persons=state.client.contact_persons.map((p,i)=>({name:q483(`cp_${i}_name`)?.value||'',email:q483(`cp_${i}_email`)?.value||'',phone:q483(`cp_${i}_phone`)?.value||'',area:q483(`cp_${i}_area`)?.value||''}));state.client.signing_persons=state.client.signing_persons.map((p,i)=>({name:q483(`sp_${i}_name`)?.value||'',role:q483(`sp_${i}_role`)?.value||'',email:q483(`sp_${i}_email`)?.value||'',phone:q483(`sp_${i}_phone`)?.value||''}));if(state.client.contact_persons[0]){state.client.contact_person=state.client.contact_persons[0].name||'';state.client.contact_email=state.client.contact_persons[0].email||'';state.client.contact_phone=state.client.contact_persons[0].phone||'';}}if(currentTab==='insurance'){['name','code'].forEach(k=>{const el=q483('activity_'+k);if(el)state.activity[k]=el.value;});['territory','main_activity_detail','side_activities','customers','suppliers','export_info','turnover','payroll','employees','currency','accounting_from','accounting_to','insurance_start','insurance_end','insurance_period','payment_frequency','collection','claim_discount','long_term_discount','locations','property_description','security','requested_scope','claims_history','deductible_preference','current_insurance','attachments_note','special_notes'].forEach(k=>{const el=q483('q_'+k);if(el)state.questionnaire[k]=el.value;});const ind=q483('q_insurance_indefinite');if(ind)state.questionnaire.insurance_indefinite=ind.value==='ano';state.questionnaire.additional_insured=state.questionnaire.additional_insured.map((p,i)=>({name:q483(`ai_${i}_name`)?.value||'',ico:q483(`ai_${i}_ico`)?.value||'',relation:q483(`ai_${i}_relation`)?.value||'',note:q483(`ai_${i}_note`)?.value||''}));state.questionnaire.custom_fields=state.questionnaire.custom_fields.map((x,i)=>({section:x.section||'',label:q483(`cf_${i}_label`)?.value||x.label||'',value:q483(`cf_${i}_value`)?.value||x.value||''}));state.questionnaire.annual_revenue_breakdown=state.questionnaire.export_info||state.questionnaire.annual_revenue_breakdown||'';}if(currentTab==='recommendation'){state.report.advisor_note=q483('advisor_note')?.value||'';state.report.client_selected_offer=q483('selected_offer')?.value||state.report.client_selected_offer||'';state.report.client_choice_reason=q483('choice_reason')?.value||'';}if(window.brhUniqueInsurerCodes480)state.selected_insurers=window.brhUniqueInsurerCodes480(state.selected_insurers||[]);};
})();

/* BRH 4.9.8 – ENTERPRISE BROKER UNDERWRITING PLATFORM SAFE */
(function(){
  window.BRH_RENDER_VERSION = '490';
  window.BRH_ENTERPRISE_BROKER_UW_SAFE = true;

  function E490(v){return String(v ?? '').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
  function q490(id){return document.getElementById(id);}
  function uniq490(arr){const s=new Set(),o=[];(arr||[]).forEach(x=>{const v=String(x||'').trim();const k=v.toLowerCase();if(v&&!s.has(k)){s.add(k);o.push(v)}});return o;}
  window.selectedInsurerCodes = selectedInsurerCodes = function(){state.selected_insurers=uniq490(state.selected_insurers||[]);return state.selected_insurers;};
  function insurerName490(code){try{const i=insurerByCode(code);return i?(i.name||i.shortcut||i.code||code):code}catch(e){return code}}
  function offer490(code){state.offers=state.offers||{};state.offers[code]=state.offers[code]||{status:'rozpracováno',risks:{}};return state.offers[code];}
  function status490(v){const s=String(v||'').toLowerCase();if(s.includes('doporu')||s.includes('splně')||s.includes('přij'))return'ok';if(s.includes('nespl')||s.includes('odmít')||s.includes('výl'))return'bad';return'mid';}
  function strip490(){const n=selectedInsurerCodes().length,r=(state.liability_items||[]).length,rd=(typeof readiness==='function'?readiness():0);return `<div class="broker-workflow-strip"><div class="broker-pill"><strong>${E490(state.status||'rozpracováno')}</strong><span>stav případu</span></div><div class="broker-pill"><strong>${E490(rd)} %</strong><span>připravenost</span></div><div class="broker-pill"><strong>${E490(n)}</strong><span>pojišťoven</span></div><div class="broker-pill"><strong>${E490(r)}</strong><span>rizik</span></div></div>`;}

  if(typeof tabClient==='function'){
    const oldClient490=tabClient;
    window.tabClient=tabClient=function(){
      let h=oldClient490();
      h=h.replaceAll('Správa osob a jejich rolí v obchodním případu.','Osoby důležité pro sjednání, správu a podpis pojistné smlouvy.');
      h=h.replaceAll('Zachováno ve stávající architektuře.','Osoby důležité pro sjednání, správu a podpis pojistné smlouvy.');
      h=h.replace('<p class="eyebrow">1. KARTA KLIENTA</p>','<p class="eyebrow">1. KARTA KLIENTA</p>'+strip490());
      return h;
    };
  }

  window.tabOffers=tabOffers=function(){
    const codes=selectedInsurerCodes();
    if(!codes.length){return `<p class="eyebrow">8. SMART NABÍDKY</p><div class="executive-panel"><h2>Nabídky pojišťoven</h2><p>Nejprve vyberte pojišťovny v kartě „Pojišťovny“. Poté zde vznikne srovnávací matice nabídek.</p><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Vybrat pojišťovny</button></div>`;}
    const rows=[
      ['premium','Nabídnuté pojistné','částka'],
      ['start','Počátek pojištění','datum'],
      ['frequency','Frekvence placení','ročně / pololetně'],
      ['deductible','Spoluúčast','částka / %'],
      ['scope','Rozsah krytí','splněno / částečně / nesplněno'],
      ['exclusions','Výluky / omezení','důležité výluky'],
      ['notes','Poznámka k nabídce','komentář poradce']
    ];
    const body=rows.map(r=>`<tr><th>${E490(r[1])}</th>${codes.map(c=>{const o=offer490(c);return `<td><input data-offer="${E490(c)}" data-field="${E490(r[0])}" value="${E490(o[r[0]]||'')}" placeholder="${E490(r[2])}"></td>`}).join('')}</tr>`).join('');
    const rec=`<tr class="recommend-row"><th>Doporučení poradce</th>${codes.map(c=>{const o=offer490(c);return `<td><select data-offer="${E490(c)}" data-field="advisor_status"><option value="rozpracováno" ${o.advisor_status==='rozpracováno'?'selected':''}>Rozpracováno</option><option value="doporučeno" ${o.advisor_status==='doporučeno'?'selected':''}>Doporučeno</option><option value="alternativa" ${o.advisor_status==='alternativa'?'selected':''}>Alternativa</option><option value="nedoporučeno" ${o.advisor_status==='nedoporučeno'?'selected':''}>Nedoporučeno</option></select></td>`}).join('')}</tr>`;
    return `<p class="eyebrow">8. SMART NABÍDKY</p>${strip490()}<div class="executive-panel"><div class="section-head"><div><h2>Nabídky pojišťoven</h2><p class="muted">Srovnávací pracovní matice pro vyhodnocení nabídek. Hodnoty se používají pro doporučení a klientský výstup.</p></div><div class="quick-actions"><button class="btn secondary" onclick="brh490PrefillOffers()">Předvyplnit společné údaje</button><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button></div></div><div class="comparison-scroll"><table class="broker-matrix"><thead><tr><th>Kritérium</th>${codes.map(c=>`<th><strong>${E490(insurerName490(c))}</strong><small>${E490(c)}</small></th>`).join('')}</tr></thead><tbody>${body}${rec}</tbody></table></div></div>`;
  };

  window.brh490PrefillOffers=function(){
    selectedInsurerCodes().forEach(c=>{const o=offer490(c);o.start=o.start||state.questionnaire?.insurance_start||'';o.frequency=o.frequency||state.questionnaire?.payment_frequency||'ročně';o.deductible=o.deductible||state.questionnaire?.deductible_preference||'';o.scope=o.scope||'rozpracováno';});
    renderWorkspace();
  };

  window.tabOutput=tabOutput=function(){
    const codes=selectedInsurerCodes();
    const recommended=codes.filter(c=>String(offer490(c).advisor_status||'').toLowerCase()==='doporučeno');
    const chosen=recommended[0]||state.report?.client_selected_offer||'';
    const chosenName=chosen?insurerName490(chosen):'není potvrzeno';
    const offerRows=codes.map(c=>{const o=offer490(c);return `<tr><td><strong>${E490(insurerName490(c))}</strong><small>${E490(c)}</small></td><td>${E490(o.premium||'—')}</td><td>${E490(o.deductible||'—')}</td><td><span class="state-dot ${status490(o.scope||o.status)}">${E490(o.scope||o.status||'rozpracováno')}</span></td><td><span class="state-dot ${status490(o.advisor_status)}">${E490(o.advisor_status||'rozpracováno')}</span></td></tr>`}).join('');
    return `<p class="eyebrow">11. KLIENTSKÝ VÝSTUP</p>${strip490()}<div class="client-report"><div class="report-cover"><div><p class="eyebrow">ASTORIE – klientský report</p><h2>Doporučení pojistného řešení</h2><p>${E490(state.client?.name||'Klient')} · ${E490(state.activity?.name||'oblast podnikatelských rizik')}</p></div><div class="report-badge">${E490(typeof readiness==='function'?readiness():0)} %<span>připravenost</span></div></div><div class="report-grid"><div class="report-card"><h3>Klient</h3><p><strong>${E490(state.client?.name||'—')}</strong></p><p>IČO: ${E490(state.client?.ico||'—')} · DIČ: ${E490(state.client?.dic||'—')}</p><p>${E490(state.client?.address||'')}</p></div><div class="report-card"><h3>Doporučení poradce</h3><p><strong>${E490(chosenName)}</strong></p><p>${E490(state.report?.advisor_note||'Doporučení bude doplněno po vyhodnocení nabídek a požadavků klienta.')}</p></div><div class="report-card"><h3>Rizikový profil</h3><p>Činnost: ${E490(state.activity?.name||'—')}</p><p>Obrat: ${E490(state.questionnaire?.turnover||'—')}</p><p>Škodní průběh: ${E490(state.questionnaire?.claims_history||'nezadáno')}</p></div></div><div class="executive-panel"><h3>Souhrn nabídek</h3><div class="comparison-scroll"><table class="client-report-table"><thead><tr><th>Pojišťovna</th><th>Pojistné</th><th>Spoluúčast</th><th>Rozsah</th><th>Doporučení</th></tr></thead><tbody>${offerRows||'<tr><td colspan="5">Nabídky zatím nejsou doplněny.</td></tr>'}</tbody></table></div></div><div class="executive-panel"><h3>Obchodní komentář</h3><textarea id="advisor_note" placeholder="Doplňte finální komentář poradce pro klientský výstup...">${E490(state.report?.advisor_note||'')}</textarea><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit klientský výstup</button><button class="btn secondary" onclick="currentTab='audit';renderWorkspace()">Zkontrolovat úplnost</button></div></div></div>`;
  };

  const readBefore490=readCurrentTab;
  window.readCurrentTab=readCurrentTab=function(){
    if(currentTab==='offers'){
      document.querySelectorAll('[data-offer][data-field]').forEach(el=>{const c=el.getAttribute('data-offer'),f=el.getAttribute('data-field');offer490(c)[f]=el.value;});
      return;
    }
    if(currentTab==='output'){
      state.report=state.report||{};
      const n=q490('advisor_note'); if(n) state.report.advisor_note=n.value;
      return;
    }
    return readBefore490();
  };
})();

/* ======================================================================
   BRH 4.9.8 – SAFE STABILIZATION RELEASE
   Stabilizace bez mazání funkčního jádra:
   - profesionální tisk poptávky bez interních textů,
   - podpis poradce, nikoli obecný podpis ASTORIE,
   - karta 8 doplněna o rizikový underwriting blok,
   - dokumenty jako pracovní knihovna CASE,
   - textace doplněny o 6 profesionálních vzorů,
   - admin tabulky stabilizovány CSS vrstvou.
   ====================================================================== */
(function(){
  window.BRH_RENDER_VERSION = '491';
  window.BRH_SAFE_STABILIZATION_491 = true;

  function E491(v){
    return String(v ?? '').replace(/[&<>'"]/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m];
    });
  }
  function q491(id){ return document.getElementById(id); }

  function uniq491(arr){
    const seen = new Set(), out = [];
    (arr || []).forEach(x => {
      const v = String(x || '').trim();
      const k = v.toLowerCase();
      if(v && !seen.has(k)){ seen.add(k); out.push(v); }
    });
    return out;
  }

  function adviser491(){
    state.adviser = state.adviser || {};
    return {
      name: state.adviser.name || state.adviser.full_name || 'Administrátor ASTORIE',
      email: state.adviser.email || 'admin@astorie.local',
      phone: state.adviser.phone || '',
      role: state.adviser.role || 'Poradce',
      company: state.adviser.company || 'ASTORIE a.s.',
      company_ico: state.adviser.company_ico || '48293776'
    };
  }

  function insurerName491(code){
    try{
      const i = insurerByCode(code);
      return i ? (i.name || i.shortcut || i.code || code) : code;
    }catch(e){ return code; }
  }

  function selectedCodes491(){
    state.selected_insurers = uniq491(state.selected_insurers || []);
    return state.selected_insurers;
  }

  function offer491(code){
    state.offers = state.offers || {};
    state.offers[code] = state.offers[code] || {status:'rozpracováno', risks:{}};
    state.offers[code].risks = state.offers[code].risks || {};
    return state.offers[code];
  }

  function liabilityItems491(){
    const items = Array.isArray(state.liability_items) ? state.liability_items : [];
    if(items.length) return items;
    return [
      {name:'Provozní odpovědnost', limit:'', deductible:'', specification:''},
      {name:'Škody způsobené zaměstnanci', limit:'', deductible:'', specification:''},
      {name:'Čistá finanční škoda', limit:'', deductible:'', specification:''},
      {name:'Vadná práce po předání', limit:'', deductible:'', specification:''},
      {name:'Věci převzaté', limit:'', deductible:'', specification:''}
    ];
  }

  function statusClass491(v){
    const s = String(v || '').toLowerCase();
    if(s.includes('splně') || s.includes('doporu') || s.includes('ano')) return 'ok';
    if(s.includes('nespl') || s.includes('ne ') || s.includes('výluka') || s.includes('odmít')) return 'bad';
    return 'mid';
  }

  function requestPrintHtml491(code){
    const a = adviser491();
    const client = state.client || {};
    const q = state.questionnaire || {};
    const activity = state.activity || {};
    const risks = liabilityItems491();

    const riskRows = risks.map(r => `
      <tr>
        <td>${E491(r.name || r.title || '')}</td>
        <td>${E491(r.limit || r.default_limit || '')}</td>
        <td>${E491(r.deductible || '')}</td>
        <td>${E491(r.specification || r.note || '')}</td>
      </tr>`).join('');

    const contacts = (client.contact_persons || []).map(p => 
      `${E491(p.name || '')}${p.email ? ' · ' + E491(p.email) : ''}${p.phone ? ' · ' + E491(p.phone) : ''}`
    ).filter(Boolean).join('<br>') || E491(client.contact_person || '');

    return `<!doctype html><html><head><meta charset="utf-8">
      <title>Poptávka pojištění podnikatelských rizik</title>
      <style>
        body{font-family:Arial,sans-serif;color:#003D4C;margin:28px;font-size:14px}
        h1{letter-spacing:.28em;font-size:24px;margin:0 0 8px}
        h2{font-size:22px;margin:26px 0 8px}
        h3{font-size:17px;margin:24px 0 10px}
        .top{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}
        .orange{height:4px;background:#FC4C02;margin:28px 0}
        .meta{font-weight:700;margin-bottom:14px}
        table{width:100%;border-collapse:collapse;margin:10px 0 20px}
        th{background:#003D4C;color:#fff;text-align:left;padding:9px}
        td{border:1px solid #d7e9ed;padding:9px;vertical-align:top}
        .label{background:#003D4C;color:#fff;font-weight:700;width:28%}
        .signature{margin-top:30px;line-height:1.55}
        .footer{margin-top:26px;border-top:2px solid #FC4C02;padding-top:12px;color:#607783}
        @media print{button{display:none}body{margin:16px}}
      </style></head><body>
      <div class="top">
        <div><h1>ASTORIE a.s.</h1><div>Poptávka pojištění podnikatelských rizik</div></div>
        <div><strong>${E491(insurerName491(code))}</strong><br>${E491(code || '')}</div>
      </div>
      <div class="orange"></div>

      <h2>${E491(client.name || 'Klient')}</h2>
      <div class="meta">CASE_ID: ${E491(state.id || '')} · Datum: ${new Date().toLocaleDateString('cs-CZ')}</div>

      <h3>Údaje o poradci</h3>
      <table>
        <tr><td class="label">Poradce</td><td>${E491(a.name)}</td></tr>
        <tr><td class="label">E-mail</td><td>${E491(a.email)}</td></tr>
        <tr><td class="label">Telefon</td><td>${E491(a.phone)}</td></tr>
        <tr><td class="label">Společnost</td><td>${E491(a.company)} · IČO ${E491(a.company_ico)}</td></tr>
      </table>

      <h3>Základní údaje pro pojištění</h3>
      <table>
        <tr><td class="label">Klient</td><td>${E491(client.name || '')}</td></tr>
        <tr><td class="label">IČO / DIČ</td><td>${E491(client.ico || '')}${client.dic ? ' / ' + E491(client.dic) : ''}</td></tr>
        <tr><td class="label">Adresa</td><td>${E491(client.address || '')}</td></tr>
        <tr><td class="label">Kontaktní osoby</td><td>${contacts}</td></tr>
        <tr><td class="label">Typ činnosti</td><td>${E491(activity.name || '')}</td></tr>
        <tr><td class="label">Detail činnosti</td><td>${E491(q.main_activity_detail || '')}</td></tr>
        <tr><td class="label">Obrat</td><td>${E491(q.turnover || '')}</td></tr>
        <tr><td class="label">Zaměstnanci</td><td>${E491(q.employees || '')}</td></tr>
        <tr><td class="label">Území</td><td>${E491(q.territory || '')}</td></tr>
        <tr><td class="label">Počátek pojištění</td><td>${E491(q.insurance_start || '')}</td></tr>
        <tr><td class="label">Pojistné období</td><td>${E491(q.insurance_period || '')}</td></tr>
        <tr><td class="label">Frekvence placení</td><td>${E491(q.payment_frequency || '')}</td></tr>
        <tr><td class="label">Export / zahraničí</td><td>${E491(q.export_info || q.annual_revenue_breakdown || '')}</td></tr>
      </table>

      <h3>Požadovaná rizika a limity</h3>
      <table>
        <thead><tr><th>Riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění</th></tr></thead>
        <tbody>${riskRows || '<tr><td colspan="4">Rizika zatím nejsou doplněna.</td></tr>'}</tbody>
      </table>

      <h3>Zvláštní požadavky a podklady</h3>
      <table>
        <tr><td class="label">Požadovaný rozsah</td><td>${E491(q.requested_scope || '')}</td></tr>
        <tr><td class="label">Škodní průběh</td><td>${E491(q.claims_history || '')}</td></tr>
        <tr><td class="label">Přílohy / podklady</td><td>${E491(q.attachments_note || '')}</td></tr>
        <tr><td class="label">Poznámka</td><td>${E491(q.special_notes || '')}</td></tr>
      </table>

      <h3>Doprovodná zpráva</h3>
      <p>Dobrý den,</p>
      <p>prosíme o zpracování nabídky pojištění podnikatelských rizik dle výše uvedených údajů a přiložených podkladů pro klienta <strong>${E491(client.name || '')}</strong>.</p>
      <p>V případě potřeby doplnění informací prosím kontaktujte přímo poradce uvedeného v této poptávce.</p>
      <div class="signature">
        Děkujeme.<br><br>
        <strong>${E491(a.name)}</strong><br>
        ${E491(a.role)}<br>
        ${E491(a.company)}<br>
        ${a.email ? 'E-mail: ' + E491(a.email) + '<br>' : ''}
        ${a.phone ? 'Telefon: ' + E491(a.phone) : ''}
      </div>
      <div class="footer">ASTORIE a.s. · IČO 48293776</div>
      <button onclick="window.print()">Tisk / uložit jako PDF</button>
      </body></html>`;
  }

  window.brh491PrintRequest = function(code){
    const w = window.open('', '_blank');
    if(!w){ alert('Prohlížeč zablokoval otevření tiskového okna.'); return; }
    w.document.open();
    w.document.write(requestPrintHtml491(code || selectedCodes491()[0] || ''));
    w.document.close();
  };

  // Karta 7: profesionální tisk poptávky, bez interních poznámek.
  if(typeof tabRequests === 'function'){
    const oldRequests491 = tabRequests;
    window.tabRequests = tabRequests = function(){
      let h = oldRequests491();
      h = h.replaceAll('', '');
      const codes = selectedCodes491();
      const buttons = codes.map(c => `<button class="btn secondary" onclick="brh491PrintRequest('${E491(c)}')">Tisk poptávky – ${E491(insurerName491(c))}</button>`).join('');
      return h + `<div class="executive-panel request-print-panel">
        <div class="section-head">
          <div>
            <h3>Tisk poptávky pojišťovně</h3>
            <p class="muted">Poptávka obsahuje údaje o klientovi, požadovaných rizicích, podkladech a kontakt na poradce.</p>
          </div>
        </div>
        <div class="quick-actions">${buttons || '<span class="muted">Nejprve vyberte pojišťovny.</span>'}</div>
      </div>`;
    };
  }

  // Karta 8: vrácení rizikové části + zachování nové nabídkové matice.
  if(typeof tabOffers === 'function'){
    const oldOffers491 = tabOffers;
    window.tabOffers = tabOffers = function(){
      const h = oldOffers491();
      const codes = selectedCodes491();
      const risks = liabilityItems491();
      const riskRows = risks.map((r,ri) => `<tr>
        <th>${E491(r.name || r.title || '')}<small>${E491(r.limit || r.default_limit || '')}</small></th>
        ${codes.map(c => {
          const o = offer491(c);
          o.risks = o.risks || {};
          o.risks[ri] = o.risks[ri] || {};
          const rv = o.risks[ri];
          return `<td>
            <select data-risk-offer="${E491(c)}" data-risk="${ri}" data-risk-field="status">
              <option value="rozpracováno" ${rv.status==='rozpracováno'?'selected':''}>Rozpracováno</option>
              <option value="splněno" ${rv.status==='splněno'?'selected':''}>Splněno</option>
              <option value="částečně" ${rv.status==='částečně'?'selected':''}>Částečně</option>
              <option value="nesplněno" ${rv.status==='nesplněno'?'selected':''}>Nesplněno</option>
            </select>
            <input data-risk-offer="${E491(c)}" data-risk="${ri}" data-risk-field="limit" value="${E491(rv.limit || '')}" placeholder="nabídnutý limit">
            <input data-risk-offer="${E491(c)}" data-risk="${ri}" data-risk-field="deductible" value="${E491(rv.deductible || '')}" placeholder="spoluúčast">
            <textarea data-risk-offer="${E491(c)}" data-risk="${ri}" data-risk-field="note" placeholder="výluky, omezení, poznámka">${E491(rv.note || '')}</textarea>
          </td>`;
        }).join('')}
      </tr>`).join('');

      const riskBlock = `<div class="executive-panel underwriting-risk-matrix">
        <div class="section-head">
          <div>
            <h3>Rizika, limity a underwriting rozdíly</h3>
            <p class="muted">Tato část doplňuje nabídky o vyhodnocení rizik, limitů, spoluúčastí, výluk a rozdílů mezi pojišťovnami.</p>
          </div>
          <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit rizikové vyhodnocení</button>
        </div>
        <div class="comparison-scroll">
          <table class="broker-matrix risk-offer-matrix">
            <thead><tr><th>Riziko / požadavek</th>${codes.map(c => `<th><strong>${E491(insurerName491(c))}</strong><small>${E491(c)}</small></th>`).join('')}</tr></thead>
            <tbody>${riskRows || '<tr><td>Nejsou vybrána rizika.</td></tr>'}</tbody>
          </table>
        </div>
      </div>`;
      return h + riskBlock;
    };
  }

  // Dokumenty: vrácení pracovní dokumentové knihovny místo placeholderu.
  window.tabDocuments = tabDocuments = function(){
    state.documents = Array.isArray(state.documents) ? state.documents : [];
    const cats = ['Plná moc','Výpis z OR','Nabídka pojišťovny','Smlouva','Stávající pojistka','Fotodokumentace','Doložka','VPP / pojistné podmínky','Interní podklad'];
    const rows = state.documents.map((d,i) => `<tr>
      <td><input id="doc_${i}_name" value="${E491(d.name || '')}" placeholder="Název dokumentu"></td>
      <td><select id="doc_${i}_category">${cats.map(c => `<option ${d.category===c?'selected':''}>${E491(c)}</option>`).join('')}</select></td>
      <td><select id="doc_${i}_status"><option ${d.status==='chybí'?'selected':''}>chybí</option><option ${d.status==='dodáno'?'selected':''}>dodáno</option><option ${d.status==='ke kontrole'?'selected':''}>ke kontrole</option></select></td>
      <td><input id="doc_${i}_note" value="${E491(d.note || '')}" placeholder="Poznámka / odkaz na soubor"></td>
      <td><button class="btn danger small" onclick="brh491RemoveDocument(${i})">Smazat</button></td>
    </tr>`).join('');

    return `<p class="eyebrow">DOKUMENTOVÁ KNIHOVNA</p>
    <div class="executive-panel">
      <div class="section-head">
        <div>
          <h2>Dokumenty</h2>
          <p class="muted">Evidence podkladů k obchodnímu případu, poptávkám, nabídkám a klientskému výstupu.</p>
        </div>
        <button class="btn secondary" onclick="brh491AddDocument()">+ Přidat dokument</button>
      </div>
      <div class="comparison-scroll">
        <table class="admin-stable-table">
          <thead><tr><th>Dokument</th><th>Kategorie</th><th>Stav</th><th>Poznámka / soubor</th><th></th></tr></thead>
          <tbody>${rows || '<tr><td colspan="5">Zatím není evidován žádný dokument.</td></tr>'}</tbody>
        </table>
      </div>
      <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit dokumenty</button></div>
    </div>`;
  };

  window.brh491AddDocument = function(){
    state.documents = Array.isArray(state.documents) ? state.documents : [];
    state.documents.push({name:'', category:'Plná moc', status:'chybí', note:''});
    renderWorkspace();
  };
  window.brh491RemoveDocument = function(i){
    state.documents = Array.isArray(state.documents) ? state.documents : [];
    state.documents.splice(i,1);
    renderWorkspace();
  };

  const textTemplates491 = [
    {
      title:'Poptávka podnikatelských rizik',
      body:'Dobrý den,\n\nprosíme o zpracování nabídky pojištění podnikatelských rizik pro klienta [KLIENT]. Podklady a požadovaný rozsah pojištění zasíláme v návaznosti na obchodní případ [CASE_ID].\n\nV případě potřeby doplnění informací prosím kontaktujte poradce: [PORADCE], [EMAIL], [TELEFON].\n\nDěkujeme.\n[PORADCE]'
    },
    {
      title:'Výzva k doplnění podkladů',
      body:'Dobrý den,\n\npro dokončení posouzení pojištění klienta [KLIENT] prosíme o doplnění následujících podkladů:\n\n– [PODKLADY]\n\nPo obdržení podkladů budeme pokračovat ve zpracování nabídky.\n\nDěkujeme za spolupráci.\n[PORADCE]'
    },
    {
      title:'Upomínka pojišťovně',
      body:'Dobrý den,\n\nnavazujeme na naši poptávku k obchodnímu případu [CASE_ID] pro klienta [KLIENT]. Prosíme o informaci, zda je nabídka již připravena, případně jaké doplňující údaje potřebujete.\n\nDěkujeme.\n[PORADCE]'
    },
    {
      title:'Předání nabídky klientovi',
      body:'Dobrý den,\n\nzasíláme Vám souhrn zpracovaných nabídek pojištění podnikatelských rizik. Doporučená varianta byla vybrána s ohledem na rozsah krytí, limity, výluky, spoluúčast a cenu.\n\nV případě dotazů jsme Vám k dispozici.\n\nS pozdravem\n[PORADCE]'
    },
    {
      title:'Doporučení poradce',
      body:'Na základě porovnání nabídek doporučujeme variantu [POJIŠŤOVNA], protože nejlépe odpovídá požadovanému rozsahu pojištění, nabízí vhodné limity a má přijatelné podmínky z pohledu výluk a spoluúčastí.'
    },
    {
      title:'Zamítnutí / nepojistitelné riziko',
      body:'Dobrý den,\n\nna základě posouzení dostupných podkladů a vyjádření pojišťovny není možné za aktuálních podmínek riziko pojistit v požadovaném rozsahu. Doporučujeme doplnit podklady, upravit rozsah požadavku nebo prověřit alternativní řešení.\n\nS pozdravem\n[PORADCE]'
    }
  ];

  window.tabTexts = tabTexts = function(){
    state.texts = Array.isArray(state.texts) ? state.texts : [];
    if(!state.texts.length) state.texts = JSON.parse(JSON.stringify(textTemplates491));
    const rows = state.texts.map((t,i) => `<div class="text-template-card">
      <label>Název textace<input id="txt_${i}_title" value="${E491(t.title || '')}"></label>
      <label>Text<textarea id="txt_${i}_body">${E491(t.body || '')}</textarea></label>
      <button class="btn danger small" onclick="brh491RemoveText(${i})">Smazat</button>
    </div>`).join('');

    return `<p class="eyebrow">CENTRÁLNÍ TEXTACE</p>
    <div class="executive-panel">
      <div class="section-head">
        <div>
          <h2>Textace</h2>
          <p class="muted">Profesionální vzory pro komunikaci s pojišťovnami a klienty.</p>
        </div>
        <div class="quick-actions">
          <button class="btn secondary" onclick="brh491ResetTextTemplates()">Načíst 6 vzorů</button>
          <button class="btn secondary" onclick="brh491AddText()">+ Přidat textaci</button>
        </div>
      </div>
      <div class="text-template-grid">${rows}</div>
      <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit textace</button></div>
    </div>`;
  };

  window.brh491ResetTextTemplates = function(){ state.texts = JSON.parse(JSON.stringify(textTemplates491)); renderWorkspace(); };
  window.brh491AddText = function(){ state.texts = Array.isArray(state.texts) ? state.texts : []; state.texts.push({title:'', body:''}); renderWorkspace(); };
  window.brh491RemoveText = function(i){ state.texts.splice(i,1); renderWorkspace(); };

  const readBefore491 = readCurrentTab;
  window.readCurrentTab = readCurrentTab = function(){
    if(currentTab === 'offers'){
      if(typeof readBefore491 === 'function') readBefore491();
      document.querySelectorAll('[data-risk-offer][data-risk][data-risk-field]').forEach(el => {
        const c = el.getAttribute('data-risk-offer');
        const ri = el.getAttribute('data-risk');
        const f = el.getAttribute('data-risk-field');
        const o = offer491(c);
        o.risks = o.risks || {};
        o.risks[ri] = o.risks[ri] || {};
        o.risks[ri][f] = el.value;
      });
      return;
    }

    if(currentTab === 'documents'){
      state.documents = Array.isArray(state.documents) ? state.documents : [];
      state.documents = state.documents.map((d,i) => ({
        name: q491(`doc_${i}_name`)?.value || '',
        category: q491(`doc_${i}_category`)?.value || '',
        status: q491(`doc_${i}_status`)?.value || '',
        note: q491(`doc_${i}_note`)?.value || ''
      }));
      return;
    }

    if(currentTab === 'texts'){
      state.texts = Array.isArray(state.texts) ? state.texts : [];
      state.texts = state.texts.map((t,i) => ({
        title: q491(`txt_${i}_title`)?.value || '',
        body: q491(`txt_${i}_body`)?.value || ''
      }));
      return;
    }

    return readBefore491();
  };

})();

/* ======================================================================
   BRH 4.9.8 – SMART OFFERS RESTORE SAFE
   Vrací vychytávky v Nabídkách a Porovnání:
   - pojišťovny normalizované bez duplicit,
   - smart předvyplnění z poptávky,
   - tlačítko "Tato pojišťovna splňuje vše",
   - tlačítko "Všude nastavit splněno",
   - při stavu splněno se doplní limit a spoluúčast,
   - karta 9 Porovnání čte stejnou rizikovou strukturu jako karta 8.
   ====================================================================== */
(function(){
  window.BRH_RENDER_VERSION = '492';
  window.BRH_SMART_OFFERS_RESTORE_SAFE = true;

  function E492(v){
    return String(v ?? '').replace(/[&<>'"]/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m];
    });
  }

  function insurerId492(raw){
    const v = String(raw || '').trim();
    if(!v) return '';
    const k = v.toLowerCase();

    const aliases = {
      'koop':'koop',
      'kooperativa':'koop',
      'kooperativa pojišťovna, a.s.':'koop',
      'kooperativa pojišťovna, a.s':'koop',
      'gcp':'gcp',
      'gčp':'gcp',
      'generali':'gcp',
      'generali česká pojišťovna a.s.':'gcp',
      'generali česká pojišťovna a.s':'gcp',
      'cpp':'cpp',
      'čpp':'cpp',
      'česká podnikatelská pojišťovna, a.s.':'cpp',
      'česká podnikatelská pojišťovna, a.s':'cpp',
      'allianz':'allianz',
      'allianz pojišťovna, a.s.':'allianz',
      'uniqa':'uniqa',
      'uniqa pojišťovna, a.s.':'uniqa'
    };
    if(aliases[k]) return aliases[k];

    const list = CATALOG.insurers || [];
    const found = list.find(i => {
      const vals = [i.id, i.code, i.short, i.shortcut, i.zkratka, i.key, i.name].filter(Boolean).map(x => String(x).toLowerCase());
      return vals.includes(k);
    });
    return found ? (found.id || found.code || found.short || found.shortcut || found.name) : v;
  }

  function selectedCodes492(){
    const seen = new Set(), out = [];
    (state.selected_insurers || []).forEach(x => {
      const id = insurerId492(x);
      if(!id) return;
      const key = String(id).toLowerCase();
      if(!seen.has(key)){ seen.add(key); out.push(id); }
    });
    state.selected_insurers = out;
    return out;
  }

  window.selectedInsurerCodes = selectedInsurerCodes = selectedCodes492;

  window.insurerByCode = insurerByCode = function(code){
    const id = insurerId492(code);
    const list = CATALOG.insurers || [];
    return list.find(i => {
      const vals = [i.id, i.code, i.short, i.shortcut, i.zkratka, i.key, i.name].filter(Boolean).map(x => String(x).toLowerCase());
      return vals.includes(String(id).toLowerCase());
    }) || {id:id, code:id, short:id, name:code || id};
  };

  function insurerLabel492(code){
    const i = insurerByCode(code);
    return {
      name: i.name || code,
      short: i.short || i.shortcut || i.zkratka || i.code || i.id || code
    };
  }

  function ensureOffer492(code){
    state.offers = state.offers || {};
    const id = insurerId492(code);
    if(code !== id && state.offers[code] && !state.offers[id]){
      state.offers[id] = state.offers[code];
    }
    state.offers[id] = state.offers[id] || {status:'rozpracováno', workflow_status:'rozpracováno', risks:{}};
    state.offers[id].risks = state.offers[id].risks || {};
    return state.offers[id];
  }

  window.ensureOffer = ensureOffer = ensureOffer492;

  function riskKey492(r){
    if(typeof riskKey === 'function') return riskKey(r);
    return r.key || r.risk_key || String(r.name || 'RIZIKO').toUpperCase().replace(/[^A-Z0-9]+/g,'_');
  }

  function riskSpec492(r){
    if(typeof riskSpecification === 'function') return riskSpecification(r);
    return r.specification || r.client_note || r.note || '';
  }

  function smartOfferDefaults492(code){
    const o = ensureOffer492(code);
    const q = state.questionnaire || {};
    o.insurance_start = o.insurance_start || q.insurance_start || '';
    o.insurance_period = o.insurance_period || q.insurance_period || '1 rok';
    o.payment_frequency = o.payment_frequency || q.payment_frequency || 'ročně';
    o.territory = o.territory || q.territory || 'Česká republika';
    o.deductible = o.deductible || q.deductible_preference || '';
    o.workflow_status = o.workflow_status || 'rozpracováno';

    (state.risks || []).forEach(r => {
      const k = riskKey492(r);
      o.risks[k] = o.risks[k] || {status:'nutno ověřit', offered_limit:'', deductible:'', exclusions:'', sublimits:'', source_reference:'', note:''};
    });
    return o;
  }

  window.smartOfferDefaults = smartOfferDefaults492;

  window.smartPrefillAllOffers = function(){
    selectedCodes492().forEach(code => smartOfferDefaults492(code));
    renderWorkspace();
    if(typeof toast === 'function') toast('Nabídky byly předvyplněny z poptávky.');
  };

  window.fulfillAllRisksForInsurer = function(code){
    const id = insurerId492(code);
    const o = smartOfferDefaults492(id);
    (state.risks || []).forEach(r => {
      const k = riskKey492(r);
      const x = o.risks[k] = o.risks[k] || {};
      x.status = 'splněno';
      x.offered_limit = r.requested_limit || x.offered_limit || '';
      x.deductible = r.deductible || (state.questionnaire || {}).deductible_preference || x.deductible || '';
    });
    renderWorkspace();
    if(typeof toast === 'function') toast('U pojišťovny bylo nastaveno splněno a převzaty požadavky z poptávky.');
  };

  window.fulfillAllRisksEverywhere = function(){
    selectedCodes492().forEach(code => {
      const o = smartOfferDefaults492(code);
      (state.risks || []).forEach(r => {
        const k = riskKey492(r);
        const x = o.risks[k] = o.risks[k] || {};
        x.status = 'splněno';
        x.offered_limit = r.requested_limit || x.offered_limit || '';
        x.deductible = r.deductible || (state.questionnaire || {}).deductible_preference || x.deductible || '';
      });
    });
    renderWorkspace();
    if(typeof toast === 'function') toast('Všechny pojišťovny byly nastaveny jako splněné a převzaly limity z poptávky.');
  };

  window.brh492SetRiskStatus = function(code, key, value){
    const o = ensureOffer492(code);
    const x = o.risks[key] = o.risks[key] || {};
    x.status = value;

    const r = (state.risks || []).find(rr => riskKey492(rr) === key) || {};
    if(value === 'splněno'){
      x.offered_limit = x.offered_limit || r.requested_limit || '';
      x.deductible = x.deductible || r.deductible || (state.questionnaire || {}).deductible_preference || '';
      const lim = document.querySelector(`[data-offer-code="${CSS.escape(insurerId492(code))}"][data-risk-key="${CSS.escape(key)}"][data-risk-field="offered_limit"]`);
      const ded = document.querySelector(`[data-offer-code="${CSS.escape(insurerId492(code))}"][data-risk-key="${CSS.escape(key)}"][data-risk-field="deductible"]`);
      if(lim) lim.value = x.offered_limit || '';
      if(ded) ded.value = x.deductible || '';
    }
  };

  window.offerWorkflowBadge = function(code){
    const o = smartOfferDefaults492(code);
    const st = o.workflow_status || 'rozpracováno';
    return `<select class="mini-select" onchange="ensureOffer('${E492(code)}').workflow_status=this.value">
      <option ${st==='rozpracováno'?'selected':''}>rozpracováno</option>
      <option ${st==='nabídka přijata'?'selected':''}>nabídka přijata</option>
      <option ${st==='nutné doplnění'?'selected':''}>nutné doplnění</option>
      <option ${st==='finální nabídka'?'selected':''}>finální nabídka</option>
      <option ${st==='zamítnuto'?'selected':''}>zamítnuto</option>
    </select>`;
  };

  window.offerCell = offerCell = function(code, r, i){
    const id = insurerId492(code);
    const k = riskKey492(r);
    const o = ensureOffer492(id);
    o.risks[k] = o.risks[k] || {status:'nutno ověřit', offered_limit:'', deductible:'', exclusions:'', sublimits:'', source_reference:'', note:''};
    const x = o.risks[k];

    return `<td>
      <select onchange="brh492SetRiskStatus('${E492(id)}','${E492(k)}',this.value)">
        <option ${x.status==='splněno'?'selected':''}>splněno</option>
        <option ${x.status==='omezeno'?'selected':''}>omezeno</option>
        <option ${x.status==='výluka'?'selected':''}>výluka</option>
        <option ${x.status==='nutno ověřit'?'selected':''}>nutno ověřit</option>
      </select>
      <input data-offer-code="${E492(id)}" data-risk-key="${E492(k)}" data-risk-field="offered_limit" placeholder="Nabídnutý limit" value="${E492(x.offered_limit || '')}" onchange="ensureOffer('${E492(id)}').risks['${E492(k)}'].offered_limit=this.value">
      <input data-offer-code="${E492(id)}" data-risk-key="${E492(k)}" data-risk-field="deductible" placeholder="Spoluúčast" value="${E492(x.deductible || '')}" onchange="ensureOffer('${E492(id)}').risks['${E492(k)}'].deductible=this.value">
      <textarea data-offer-code="${E492(id)}" data-risk-key="${E492(k)}" data-risk-field="note" placeholder="Výluky / sublimity / zdroj VPP" onchange="ensureOffer('${E492(id)}').risks['${E492(k)}'].note=this.value">${E492(x.note || '')}</textarea>
    </td>`;
  };

  window.tabOffers = tabOffers = function(){
    const codes = selectedCodes492();

    if(!codes.length){
      return `<p class="eyebrow">8. NABÍDKY V JEDNÉ TABULCE</p>
      <div class="executive-panel"><h2>Nejdříve vyberte pojišťovny</h2><p>Tabulka nabídek se zobrazí po výběru pojišťoven v kartě „Pojišťovny“.</p></div>`;
    }

    if(!state.risks || !state.risks.length){
      return `<p class="eyebrow">8. NABÍDKY V JEDNÉ TABULCE</p>
      <div class="executive-panel"><h2>Nejdříve vyplňte rizika</h2><p>Tabulka nabídek vychází z požadavků klienta. Doplňte rizika v modulu odpovědnosti nebo v ostatních rizicích.</p></div>`;
    }

    codes.forEach(code => smartOfferDefaults492(code));

    const q = state.questionnaire || {};
    const smartPanel = `<div class="section-soft smart-panel">
      <div class="section-head">
        <div>
          <h3>Smart předvyplnění nabídek</h3>
          <p class="muted">Počátek, období, frekvence, území, spoluúčast a rizika se přebírají z poptávky. Poradce doplňuje pouze rozdíly, výluky a specifika pojišťovny.</p>
        </div>
        <div class="tools">
          <button class="btn secondary" onclick="smartPrefillAllOffers()">Předvyplnit společné údaje</button>
          <button class="btn secondary" onclick="fulfillAllRisksEverywhere()">Všude nastavit splněno</button>
        </div>
      </div>
      <div class="grid4">
        <div class="stat"><span>Počátek</span><b>${E492(q.insurance_start || 'není uveden')}</b></div>
        <div class="stat"><span>Pojistné období</span><b>${E492(q.insurance_period || 'není uvedeno')}</b></div>
        <div class="stat"><span>Frekvence</span><b>${E492(q.payment_frequency || 'ročně')}</b></div>
        <div class="stat"><span>Spoluúčast</span><b>${E492(q.deductible_preference || 'není uvedena')}</b></div>
      </div>
    </div>`;

    const heads = codes.map(code => {
      const o = smartOfferDefaults492(code);
      const ins = insurerLabel492(code);
      return `<th class="offer-head">
        <div class="insurer-title">${E492(ins.name)}<div class="mini">${E492(ins.short)}</div></div>
        ${offerWorkflowBadge(code)}
        <button class="btn small secondary" onclick="fulfillAllRisksForInsurer('${E492(code)}')">Tato pojišťovna splňuje vše</button>
        <input placeholder="Nabídnuté pojistné" onchange="ensureOffer('${E492(code)}').premium=this.value" value="${E492(o.premium || '')}">
        <input placeholder="Počátek pojištění" onchange="ensureOffer('${E492(code)}').insurance_start=this.value" value="${E492(o.insurance_start || q.insurance_start || '')}">
        <input placeholder="Frekvence placení" onchange="ensureOffer('${E492(code)}').payment_frequency=this.value" value="${E492(o.payment_frequency || q.payment_frequency || 'ročně')}">
        <input placeholder="Celková spoluúčast / pozn." onchange="ensureOffer('${E492(code)}').deductible=this.value" value="${E492(o.deductible || q.deductible_preference || '')}">
      </th>`;
    }).join('');

    const rows = (state.risks || []).map((r,i) => {
      const k = riskKey492(r);
      return `<tr>
        <td class="risk-request">
          <b>${E492(r.name || r.title || '')}</b><br>
          <span class="badge">${E492(k)}</span><br>
          Požadavek: ${E492(r.requested_limit || 'není uveden')}<br>
          Spoluúčast: ${E492(r.deductible || q.deductible_preference || 'není uvedena')}
          ${riskSpec492(r) ? `<br><small>Specifikace: ${E492(riskSpec492(r))}</small>` : ''}
        </td>
        ${codes.map(code => offerCell(code,r,i)).join('')}
      </tr>`;
    }).join('');

    return `<p class="eyebrow">8. NABÍDKY V JEDNÉ TABULCE</p>
    <div class="executive-panel">
      <div class="section-head">
        <div>
          <h2>Požadavek klienta × nabídky pojišťoven</h2>
          <p class="muted">Při volbě „splněno“ se automaticky doplní požadovaný limit a spoluúčast z poptávky. Poradce řeší pouze odchylky.</p>
        </div>
        <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button>
      </div>
      ${smartPanel}
      <div class="table-wrap">
        <table class="offer-table pro-table">
          <thead><tr><th>Požadavek klienta</th>${heads}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="tools">
        <button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button>
        <button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button>
      </div>
    </div>`;
  };

  window.tabComparison = tabComparison = function(){
    const codes = selectedCodes492();

    if(!codes.length || !state.risks || !state.risks.length){
      return `<p class="eyebrow">9. MAKLÉŘSKÉ POROVNÁNÍ</p>
      <div class="executive-panel"><h2>Porovnání zatím nelze sestavit</h2><p>Nejdříve doplňte rizika, pojišťovny a nabídky.</p></div>`;
    }

    const rows = (state.risks || []).map(r => {
      const k = riskKey492(r);
      return `<tr>
        <td class="risk-request"><b>${E492(r.name || r.title || '')}</b><br>${E492(r.requested_limit || 'limit neuveden')}</td>
        ${codes.map(code => {
          const x = (ensureOffer492(code).risks || {})[k] || {};
          return `<td>
            <span class="state-dot ${statusClass492(x.status)}">${E492(x.status || 'nutno ověřit')}</span><br>
            <b>Limit:</b> ${E492(x.offered_limit || '–')}<br>
            <b>Spoluúčast:</b> ${E492(x.deductible || '–')}<br>
            ${x.note ? `<small>${E492(x.note)}</small>` : ''}
          </td>`;
        }).join('')}
      </tr>`;
    }).join('');

    return `<p class="eyebrow">9. MAKLÉŘSKÉ POROVNÁNÍ</p>
    <div class="executive-panel">
      <h2>Rozdíly mezi nabídkami</h2>
      <div class="warning">Systém zvýrazňuje rozdíly. Finální doporučení potvrzuje poradce.</div>
      <div class="table-wrap">
        <table class="offer-table pro-table comparison-table">
          <thead><tr><th>Riziko / požadavek</th>${codes.map(c => {const ins=insurerLabel492(c); return `<th>${E492(ins.name)}<div class="mini">${E492(ins.short)}</div></th>`}).join('')}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
  };

  function statusClass492(v){
    const s = String(v || '').toLowerCase();
    if(s.includes('splněno')) return 'ok';
    if(s.includes('výluka') || s.includes('nesplněno')) return 'bad';
    return 'mid';
  }

  const readBefore492 = readCurrentTab;
  window.readCurrentTab = readCurrentTab = function(){
    if(currentTab === 'offers'){
      selectedCodes492().forEach(code => smartOfferDefaults492(code));
      return;
    }
    return readBefore492();
  };

})();

/* ============================================================================
   BRH 4.9.8 – ADMIN EMERGENCY RESTORE SAFE
   Zdrojová báze: 4.9.8, aby se nezdědilo poškození Adminu z 4.9.8.
   Princip:
   - NEmaže původní adminPanel.
   - Pro běžné admin sekce používá původní plnohodnotné editory.
   - Přepisuje pouze: Uživatelé, Dokumenty, Textace.
   ============================================================================ */
(function(){
  window.BRH_ADMIN_EMERGENCY_RESTORE_SAFE_495 = true;
  window.BRH_RENDER_VERSION = '495';

  const previousAdminPanel495 = window.adminPanel;
  const previousRenderAdmin495 = window.renderAdmin;

  function H495(v){
    return String(v ?? '').replace(/[&<>'"]/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m];
    });
  }
  function arr495(v){ return Array.isArray(v) ? v : []; }

  function ensure495(){
    window.CATALOG = window.CATALOG || {};
    CATALOG.users = arr495(CATALOG.users);
    CATALOG.roleProfiles = arr495(CATALOG.roleProfiles);
    CATALOG.modulePermissions = arr495(CATALOG.modulePermissions);
    CATALOG.insurers = arr495(CATALOG.insurers);
    CATALOG.attachmentTypes = arr495(CATALOG.attachmentTypes);
    CATALOG.textTemplates = arr495(CATALOG.textTemplates);
    CATALOG.liabilityRisks = arr495(CATALOG.liabilityRisks);
    CATALOG.liabilityAgreements = arr495(CATALOG.liabilityAgreements);

    if(!CATALOG.roleProfiles.length){
      CATALOG.roleProfiles = [
        {code:'PORADCE', name:'Poradce'},
        {code:'SPECIALISTA', name:'Specialista'},
        {code:'BACKOFFICE', name:'Backoffice'},
        {code:'MANAGEMENT', name:'Management'},
        {code:'ADMIN', name:'Administrátor'}
      ];
    }
    if(!CATALOG.users.length){
      CATALOG.users = [
        {id:'admin', name:'Administrátor ASTORIE', email:'admin@astorie.local', position:'Administrátor', roles:['ADMIN'], active:true},
        {id:'bo', name:'Backoffice ASTORIE', email:'backoffice@astorie.local', position:'Backoffice', roles:['BACKOFFICE'], active:true}
      ];
    }
    seedTextTemplates495(false);
  }

  function sampleTexts495(){
    return [
      {
        title:'Odpovědnost z provozní činnosti – potvrzení rozsahu',
        type:'Poptávka pojišťovně',
        category:'Požadavky na pojišťovnu',
        text:'Prosíme o výslovné potvrzení, zda se nabízené pojištění vztahuje na odpovědnost za újmu způsobenou provozní činností klienta v rozsahu uvedeném v poptávce, včetně uvedení případných výluk, sublimitu nebo zvláštních podmínek.',
        tags:['odpovědnost','pojišťovna'],
        active:true
      },
      {
        title:'Věci převzaté / užívané – požadavek na krytí',
        type:'Poptávka / nabídka',
        category:'Zvláštní ujednání',
        text:'Klient požaduje posouzení a případné zahrnutí odpovědnosti za škody na věcech převzatých, užívaných nebo jinak nacházejících se v dispozici klienta. Prosíme o uvedení limitu, sublimitu, spoluúčasti a případných omezení.',
        tags:['odpovědnost','převzaté věci'],
        active:true
      },
      {
        title:'Odpovědnost za výrobek / vadnou práci',
        type:'Rizika / porovnání',
        category:'Odpovědnost',
        text:'U nabídky je nutné ověřit, zda a v jakém rozsahu kryje odpovědnost za škodu způsobenou vadou výrobku nebo vadně provedenou prací po předání. Prosíme o uvedení všech omezení, výluk, územního rozsahu a případných sublimitu.',
        tags:['výrobek','vadná práce'],
        active:true
      },
      {
        title:'Výzva k doplnění podkladů',
        type:'Komunikace',
        category:'Podklady',
        text:'Pro dokončení posouzení pojištění klienta prosíme o doplnění chybějících podkladů uvedených v přehledu příloh. Po jejich obdržení budeme pokračovat ve zpracování poptávky nebo nabídky.',
        tags:['podklady','komunikace'],
        active:true
      },
      {
        title:'Předání nabídky klientovi',
        type:'Klientský výstup',
        category:'Zpráva klientovi',
        text:'Zasíláme Vám souhrn zpracovaných nabídek pojištění podnikatelských rizik. Doporučená varianta byla vybrána s ohledem na rozsah krytí, limity, výluky, spoluúčast a cenu.',
        tags:['klient','nabídka'],
        active:true
      },
      {
        title:'Doporučení poradce',
        type:'Doporučení',
        category:'Porovnání',
        text:'Na základě porovnání nabídek doporučujeme variantu, která nejlépe odpovídá požadovanému rozsahu pojištění, nabízí vhodné limity a má přijatelné podmínky z pohledu výluk a spoluúčastí.',
        tags:['doporučení','porovnání'],
        active:true
      }
    ];
  }

  function seedTextTemplates495(force){
    CATALOG.textTemplates = arr495(CATALOG.textTemplates);
    const samples = sampleTexts495();
    if(force){
      CATALOG.textTemplates = samples;
      return;
    }
    samples.forEach(s => {
      const exists = CATALOG.textTemplates.some(t => String(t.title || t.name || '').trim().toLowerCase() === s.title.toLowerCase());
      if(!exists) CATALOG.textTemplates.push(s);
    });
  }

  function setActive495(type){
    document.querySelectorAll('[data-admin-tab], [data-admin-tab-495], .admin-tabs .chip').forEach(b => {
      const key = b.getAttribute('data-admin-tab') || b.getAttribute('data-admin-tab-495') || '';
      b.classList.toggle('active', key === type);
    });
  }

  function tab495(type,label){
    return `<button class="chip" data-admin-tab="${H495(type)}" data-admin-tab-495="${H495(type)}" onclick="adminPanel('${H495(type)}')">${H495(label)}</button>`;
  }

  window.renderAdmin = function(){
    ensure495();
    const box = document.getElementById('adminBox');
    if(!box){
      if(typeof previousRenderAdmin495 === 'function') return previousRenderAdmin495();
      return;
    }
    box.innerHTML = `
      <div class="admin-safe-head admin-head-495">
        <div>
          <p class="eyebrow">Administrace · 4.9.8 SAFE</p>
          <h2>Admin Control Center</h2>
          <p class="muted">Obnovený Admin. Běžné číselníky běží přes původní editory, upraveny jsou pouze Textace, Dokumenty a Uživatelé.</p>
        </div>
      </div>

      <div class="metric-grid">
        <div><b>${CATALOG.users.length}</b><span>uživatelů</span></div>
        <div><b>${CATALOG.roleProfiles.length}</b><span>pozic</span></div>
        <div><b>${CATALOG.modulePermissions.length || 4}</b><span>modulů práv</span></div>
        <div><b>${CATALOG.insurers.length}</b><span>pojišťoven</span></div>
        <div><b>${CATALOG.attachmentTypes.length}</b><span>typů příloh</span></div>
        <div><b>${CATALOG.liabilityRisks.length}</b><span>rizik odpovědnosti</span></div>
      </div>

      <div class="admin-tabs admin-tabs-safe admin-tabs-495">
        ${tab495('users','Uživatelé')}
        ${tab495('permissions','Oprávnění / pozice')}
        ${tab495('insurers','Pojišťovny')}
        ${tab495('attachments','Přílohy')}
        ${tab495('documents','Dokumenty')}
        ${tab495('texts','Textace')}
        ${tab495('liabilityRisks','Rizika odpovědnosti')}
        ${tab495('liabilityAgreements','Ujednání odpovědnosti')}
        ${tab495('json','Import / export JSON')}
      </div>
      <div id="adminPanel"></div>
    `;
    window.adminPanel('users');
  };

  window.adminPanel = function(type){
    ensure495();
    setActive495(type);
    const box = document.getElementById('adminPanel');
    if(!box) return;

    if(type === 'users'){
      box.innerHTML = renderUsers495();
      return;
    }
    if(type === 'documents'){
      box.innerHTML = renderDocuments495();
      return;
    }
    if(type === 'texts'){
      box.innerHTML = renderTexts495();
      return;
    }

    // DŮLEŽITÉ: všechny ostatní sekce vracíme původnímu plnohodnotnému Adminu.
    if(typeof previousAdminPanel495 === 'function'){
      previousAdminPanel495(type);
      setActive495(type);
      return;
    }

    box.innerHTML = `<h2>${H495(type)}</h2><p class="muted">Sekce není dostupná.</p>`;
  };

  function renderUsers495(){
    return `
      <div class="admin-pro-panel-495">
        <h2>Uživatelé a role</h2>
        <p class="muted">Přehledná správa oprávněných osob. Jeden uživatel může mít více rolí.</p>
        <div class="table-wrap">
          <table class="users-table-495">
            <thead><tr><th>ID</th><th>Jméno</th><th>E-mail</th><th>Pozice</th><th>Role</th><th>Aktivní</th><th>Akce</th></tr></thead>
            <tbody>${CATALOG.users.map((u,idx)=>`
              <tr>
                <td><input value="${H495(u.id||'')}" onchange="CATALOG.users[${idx}].id=this.value"></td>
                <td><input value="${H495(u.name||'')}" onchange="CATALOG.users[${idx}].name=this.value"></td>
                <td><input value="${H495(u.email||'')}" onchange="CATALOG.users[${idx}].email=this.value"></td>
                <td><input value="${H495(u.position||'')}" onchange="CATALOG.users[${idx}].position=this.value"></td>
                <td>${roleChecks495(u,idx)}</td>
                <td><select onchange="CATALOG.users[${idx}].active=this.value==='ano'"><option ${u.active!==false?'selected':''}>ano</option><option ${u.active===false?'selected':''}>ne</option></select></td>
                <td><button class="btn danger" onclick="CATALOG.users.splice(${idx},1);adminPanel('users')">Smazat</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.users.push({id:'u_'+Date.now(),name:'',email:'',position:'Poradce',roles:['PORADCE'],active:true});adminPanel('users')">+ Nový uživatel</button>
          <button class="btn primary" onclick="saveAdminCatalog && saveAdminCatalog()">Uložit uživatele</button>
        </div>
      </div>`;
  }

  function roleChecks495(u,idx){
    const userRoles = arr495(u.roles);
    return `<div class="roles-grid-495">${
      CATALOG.roleProfiles.map(r => {
        const code = r.code || r.name || '';
        return `<label class="role-chip-495"><input type="checkbox" ${userRoles.includes(code)?'checked':''} onchange="brh495ToggleRole(${idx},'${H495(code)}',this.checked)"> ${H495(code)}</label>`;
      }).join('')
    }</div>`;
  }

  window.brh495ToggleRole = function(idx, role, checked){
    const u = CATALOG.users[idx]; if(!u) return;
    u.roles = arr495(u.roles);
    if(checked && !u.roles.includes(role)) u.roles.push(role);
    if(!checked) u.roles = u.roles.filter(r => r !== role);
  };

  function renderDocuments495(){
    const docs = [
      ['VPP / DPP / ZPP','pojistné podmínky, doložky, zvláštní podmínky'],
      ['Nabídky pojišťoven','PDF, e-maily, přílohy k nabídce'],
      ['Škodní průběh','historie škod, potvrzení, tabulky'],
      ['Revize / technické podklady','revize elektro, BOZP, zabezpečení, technika'],
      ['Fotodokumentace','fotky provozu, zařízení, objektů'],
      ['Dotazníky a ostatní','vyplněné dotazníky, komunikace, poznámky']
    ];
    return `
      <div class="admin-pro-panel-495">
        <div class="section-head">
          <div>
            <p class="eyebrow">DOKUMENTOVÝ MODUL</p>
            <h2>Dokumenty k obchodnímu případu</h2>
            <p class="muted">Jedno místo pro VPP/DPP/ZPP, nabídky pojišťoven, škodní průběh, revize, fotodokumentaci a další podklady.</p>
          </div>
          <button class="btn secondary">+ Přidat dokument</button>
        </div>
        <div class="doc-grid-495">
          ${docs.map(([title,note])=>`<div class="doc-card-495"><h3>${H495(title)}</h3><p>${H495(note)}</p></div>`).join('')}
        </div>
      </div>`;
  }

  function renderTexts495(){
    seedTextTemplates495(false);
    return `
      <div class="admin-pro-panel-495">
        <div class="section-head">
          <div>
            <p class="eyebrow">CENTRÁLNÍ DATABÁZE · TEXTACE</p>
            <h2>Správa knihovny textací</h2>
            <p class="muted">Centrální pracovní správa textací pro poradce. Textace lze kopírovat, upravit, smazat nebo doplnit.</p>
          </div>
          <button class="btn secondary" onclick="CATALOG.textTemplates.push({title:'Nová textace',type:'Poptávka',category:'Obecné',text:'',tags:[],active:true});adminPanel('texts')">+ Přidat textaci</button>
        </div>

        <div class="textation-toolbar-495">
          <input placeholder="Hledat textaci..." disabled>
          <select disabled><option>Všechny kategorie</option></select>
          <button class="btn secondary" onclick="brh495ResetTextTemplates()">Obnovit vzorové</button>
        </div>

        <div class="table-wrap">
          <table class="textation-table-495">
            <thead><tr><th>Název</th><th>Kategorie</th><th>Použití</th><th>Text</th><th>Tagy / stav</th><th>Akce</th></tr></thead>
            <tbody>${CATALOG.textTemplates.map((t,idx)=>`
              <tr>
                <td><input value="${H495(t.title||t.name||'')}" onchange="CATALOG.textTemplates[${idx}].title=this.value;CATALOG.textTemplates[${idx}].name=this.value"></td>
                <td><input value="${H495(t.category||'')}" onchange="CATALOG.textTemplates[${idx}].category=this.value"></td>
                <td><input value="${H495(t.type||'')}" onchange="CATALOG.textTemplates[${idx}].type=this.value"></td>
                <td><textarea onchange="CATALOG.textTemplates[${idx}].text=this.value;CATALOG.textTemplates[${idx}].body=this.value">${H495(t.text||t.body||'')}</textarea></td>
                <td>
                  <input value="${H495(arr495(t.tags).join(', '))}" onchange="CATALOG.textTemplates[${idx}].tags=this.value.split(',').map(x=>x.trim()).filter(Boolean)" placeholder="tagy">
                  <select onchange="CATALOG.textTemplates[${idx}].active=this.value==='ano'"><option ${t.active!==false?'selected':''}>ano</option><option ${t.active===false?'selected':''}>ne</option></select>
                </td>
                <td>
                  <button class="btn secondary small" onclick="navigator.clipboard && navigator.clipboard.writeText(CATALOG.textTemplates[${idx}].text || CATALOG.textTemplates[${idx}].body || '')">Kopírovat</button>
                  <button class="btn danger small" onclick="CATALOG.textTemplates.splice(${idx},1);adminPanel('texts')">Smazat</button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="tools">
          <button class="btn secondary" onclick="CATALOG.textTemplates.push({title:'Nová textace',type:'Poptávka',category:'Obecné',text:'',tags:[],active:true});adminPanel('texts')">+ Nová textace</button>
          <button class="btn primary" onclick="saveAdminCatalog && saveAdminCatalog()">Uložit textace</button>
        </div>
      </div>`;
  }

  window.brh495ResetTextTemplates = function(){
    seedTextTemplates495(true);
    adminPanel('texts');
  };

})();


/* ============================================================================
   BRH 4.9.8 – FUNCTIONAL OFFERS + TEXTACE/DOCUMENTS RESTORE SAFE
   - Nabídky/Porovnání převzaty z poslední nalezené funkční větve 3.5.1b.
   - Textace/Dokumenty doplněny ve stylu 2.6.1 bez zásahu do ostatních částí.
   ============================================================================ */
(function(){
  window.BRH_497_FUNCTIONAL_RESTORE_SAFE = true;
  window.BRH_RENDER_VERSION = '497';
  if (typeof smartOfferDefaults === 'function') window.smartOfferDefaults = smartOfferDefaults;
  if (typeof smartPrefillAllOffers === 'function') window.smartPrefillAllOffers = smartPrefillAllOffers;
  if (typeof fulfillAllRisksForInsurer === 'function') window.fulfillAllRisksForInsurer = fulfillAllRisksForInsurer;
  if (typeof fulfillAllRisksEverywhere === 'function') window.fulfillAllRisksEverywhere = fulfillAllRisksEverywhere;
  if (typeof tabOffers === 'function') window.tabOffers = tabOffers;
  if (typeof tabComparison === 'function') window.tabComparison = tabComparison;

  function h497(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
  function arr497(v){return Array.isArray(v)?v:[];}
  function st497(){return (typeof state!=='undefined'&&state)?state:(window.state=window.state||{});}
  const TEXT_KEY_497='astorie_textations_v497';

  function defaults497(){
    return [
      {id:'odp-provoz',title:'Odpovědnost z provozní činnosti – potvrzení rozsahu',category:'Požadavky na pojišťovnu',usage:'Poptávka pojišťovně',tags:['odpovědnost','pojišťovna'],text:'Prosíme o výslovné potvrzení, zda se nabízené pojištění vztahuje na odpovědnost za újmu způsobenou provozní činností klienta v rozsahu uvedeném v poptávce, včetně uvedení případných výluk, sublimitu nebo zvláštních podmínek.'},
      {id:'veci-prevzate',title:'Věci převzaté / užívané – požadavek na krytí',category:'Zvláštní ujednání',usage:'Poptávka / nabídka',tags:['převzaté věci','odpovědnost'],text:'Klient požaduje posouzení a případné zahrnutí odpovědnosti za škody na věcech převzatých, užívaných nebo jinak nacházejících se v dispozici klienta. Prosíme o uvedení limitu, sublimitu, spoluúčasti a případných omezení.'},
      {id:'vadny-vyrobek',title:'Odpovědnost za výrobek / vadnou práci',category:'Odpovědnost',usage:'Rizika / porovnání',tags:['výrobek','vadná práce'],text:'U nabídky je nutné ověřit, zda a v jakém rozsahu kryje odpovědnost za škodu způsobenou vadou výrobku nebo vadně provedenou prací po předání. Zvláštní pozornost je třeba věnovat výlukám, sériové škodě, čistým finančním škodám a nákladům na stažení výrobku.'},
      {id:'cista-financni-skoda',title:'Čistá finanční škoda – upozornění pro klienta',category:'Klientská zpráva',usage:'Zpráva klientovi',tags:['odpovědnost','finanční škoda','klient'],text:'U čistých finančních škod doporučujeme ověřit, zda jsou v nabídce kryty samostatně, nebo pouze jako doplňkové krytí se sublimitem. Pokud je krytí omezené nebo zcela vyloučené, je vhodné klienta na tuto skutečnost výslovně upozornit.'},
      {id:'vyluky',title:'Výluky – obecné upozornění do zprávy',category:'Výluky a omezení',usage:'Zpráva klientovi',tags:['výluky','klient'],text:'Před uzavřením pojištění doporučujeme věnovat pozornost výlukám a omezením uvedeným v pojistných podmínkách a nabídce. Rozsah pojištění není dán pouze limitem a cenou, ale zejména konkrétními podmínkami krytí.'},
      {id:'fve',title:'FVE – technické podklady a revize',category:'Drony / FVE / speciální rizika',usage:'Poptávka pojišťovně',tags:['FVE','podklady'],text:'Pro posouzení rizika FVE doporučujeme doložit technickou specifikaci, instalovaný výkon, umístění technologie, způsob zabezpečení, revizní zprávy a informaci o provozovateli.'}
    ];
  }
  window.getTextationLibrary=function(){
    try{const saved=localStorage.getItem(TEXT_KEY_497); if(saved) return JSON.parse(saved);}catch(e){}
    return defaults497();
  };
  window.saveTextationLibrary=function(items){localStorage.setItem(TEXT_KEY_497,JSON.stringify(items||[]));};
  window.resetTextationLibrary=function(){if(confirm('Obnovit vzorové textace?')){saveTextationLibrary(defaults497()); renderTextationLibrary497();}};
  window.findTextation=function(id){return getTextationLibrary().find(i=>i.id===id);};
  window.renderTextationLibrary497=function(){
    const list=document.getElementById('textationList497'); if(!list) return;
    let items=getTextationLibrary();
    const q=(document.getElementById('textationSearch497')?.value||'').toLowerCase().trim();
    if(q) items=items.filter(i=>[i.title,i.category,i.usage,i.text,arr497(i.tags).join(' ')].join(' ').toLowerCase().includes(q));
    list.innerHTML=items.map(i=>`<button type="button" class="textation-item-497" onclick="showTextationDetail497('${h497(i.id)}')"><span>${h497(i.category)}</span><b>${h497(i.title)}</b><small>${h497(arr497(i.tags).join(' · '))}</small></button>`).join('') || '<div class="empty">Nenalezena žádná textace.</div>';
  };
  window.showTextationDetail497=function(id){
    const i=findTextation(id); const box=document.getElementById('textationDetail497'); if(!i||!box)return;
    box.innerHTML=`<p class="eyebrow">${h497(i.category)}</p><h3>${h497(i.title)}</h3><p><b>Použití:</b> ${h497(i.usage||'obecně')}</p><div class="textation-fulltext-497">${h497(i.text).replace(/\n/g,'<br>')}</div><div class="textation-actions-497"><button class="btn primary" onclick="insertTextationToNotes497('${h497(i.id)}')">Vložit do poznámek</button><button class="btn secondary" onclick="navigator.clipboard&&navigator.clipboard.writeText(findTextation('${h497(i.id)}').text)">Zkopírovat</button><button class="btn secondary" onclick="editTextation497('${h497(i.id)}')">Upravit</button><button class="btn danger" onclick="deleteTextation497('${h497(i.id)}')">Smazat</button></div>`;
  };
  window.insertTextationToNotes497=function(id){const i=findTextation(id), n=document.getElementById('caseTextationNotes497'); if(i&&n){n.value+=(n.value?'\n\n---\n':'')+i.title+'\n'+i.text;}};
  window.openTextationEditor497=function(id){
    const i=id?findTextation(id):{id:'',title:'',category:'Zvláštní ujednání',usage:'Poptávka pojišťovně',tags:[],text:''};
    const p=document.getElementById('textationEditorPanel497'); if(!p)return; p.classList.remove('hidden');
    p.innerHTML=`<p class="eyebrow">${id?'Upravit textaci':'Nová textace'}</p><div class="grid4"><label>Název<input id="te497_id" type="hidden" value="${h497(i.id)}"><input id="te497_title" value="${h497(i.title)}"></label><label>Kategorie<input id="te497_category" value="${h497(i.category)}"></label><label>Použití<input id="te497_usage" value="${h497(i.usage)}"></label><label>Tagy<input id="te497_tags" value="${h497(arr497(i.tags).join(', '))}"></label></div><label>Text<textarea id="te497_text">${h497(i.text)}</textarea></label><div class="tools"><button class="btn primary" onclick="saveTextationFromEditor497()">Uložit textaci</button><button class="btn secondary" onclick="document.getElementById('textationEditorPanel497').classList.add('hidden')">Zrušit</button></div>`;
  };
  window.editTextation497=function(id){openTextationEditor497(id);};
  window.saveTextationFromEditor497=function(){
    const items=getTextationLibrary(); const id=document.getElementById('te497_id').value || ('custom-'+Date.now());
    const item={id,title:document.getElementById('te497_title').value,category:document.getElementById('te497_category').value,usage:document.getElementById('te497_usage').value,tags:document.getElementById('te497_tags').value.split(',').map(x=>x.trim()).filter(Boolean),text:document.getElementById('te497_text').value};
    const idx=items.findIndex(x=>x.id===id); if(idx>=0) items[idx]=item; else items.unshift(item);
    saveTextationLibrary(items); document.getElementById('textationEditorPanel497').classList.add('hidden'); renderTextationLibrary497(); showTextationDetail497(id);
  };
  window.deleteTextation497=function(id){if(!confirm('Opravdu smazat textaci?'))return; saveTextationLibrary(getTextationLibrary().filter(i=>i.id!==id)); renderTextationLibrary497(); document.getElementById('textationDetail497').innerHTML='<p class="muted">Vyberte textaci.</p>';};

  window.renderTextationsWorkspace=function(){
    const box=document.getElementById('tabContent'); if(!box)return;
    box.innerHTML=`<p class="eyebrow">TEXTACE</p><h2>Knihovna textací</h2><p class="muted">Textace pro poptávky, nabídky, zprávy klientovi a interní práci poradce.</p><div class="tools"><button class="btn primary" onclick="openTextationEditor497()">+ Přidat textaci</button><button class="btn secondary" onclick="resetTextationLibrary()">Obnovit vzorové</button></div><div id="textationEditorPanel497" class="hidden"></div><div class="textation-layout-497"><div><input id="textationSearch497" placeholder="Hledat textaci..." oninput="renderTextationLibrary497()"><div id="textationList497"></div></div><div id="textationDetail497" class="textation-detail-497"><p class="muted">Vyberte textaci.</p></div></div><div class="section-soft"><h3>Pracovní poznámky k aktivnímu případu</h3><textarea id="caseTextationNotes497" placeholder="Zde se skládají vybrané textace..."></textarea></div>`;
    renderTextationLibrary497();
  };

  window.renderDocumentsWorkspace=function(){
    const box=document.getElementById('tabContent'); if(!box)return;
    box.innerHTML=`<p class="eyebrow">DOKUMENTOVÝ MODUL</p><h2>Dokumenty k obchodnímu případu</h2><p class="muted">Jedno místo pro VPP/DPP/ZPP, nabídky pojišťoven, škodní průběh, revize, fotodokumentaci a další podklady.</p><div class="doc-grid-497">${['VPP / DPP / ZPP','Nabídky pojišťoven','Škodní průběh','Revize / technické podklady','Fotodokumentace','Dotazníky a ostatní'].map(x=>`<div class="doc-card-497"><h3>${x}</h3><p>Podklady vázané na aktivní obchodní případ.</p></div>`).join('')}</div><div class="section-soft"><h3>Archiv dokumentů</h3><p class="muted">Dokumenty se vztahují k aktivnímu obchodnímu případu.</p><button class="btn secondary">+ Přidat dokument</button></div>`;
  };

  const prevShowView497=window.showView;
  window.showView=function(view){
    if(view==='textationsView' || view==='textaceView'){ currentView=view; document.querySelectorAll('.side-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===view)); renderTextationsWorkspace(); return; }
    if(view==='documentsView' || view==='docsView'){ currentView=view; document.querySelectorAll('.side-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===view)); renderDocumentsWorkspace(); return; }
    return prevShowView497 ? prevShowView497(view) : undefined;
  };

  const prevAdminPanel497=window.adminPanel;
  window.adminPanel=function(type){
    if(type==='texts' || type==='textace'){
      const box=document.getElementById('adminPanel'); if(!box)return;
      box.innerHTML=`<div class="admin-textations-497"><div class="section-head"><div><p class="eyebrow">CENTRÁLNÍ DATABÁZE · POŽADAVKY NA POJIŠŤOVNU</p><h2>Správa knihovny textací</h2><p class="muted">Admin spravuje vzorové textace pro poradce.</p></div><button class="btn primary" onclick="openTextationEditor497()">+ Přidat textaci</button></div><div id="textationEditorPanel497" class="hidden"></div><div class="textation-layout-497"><div><input id="textationSearch497" placeholder="Hledat textaci..." oninput="renderTextationLibrary497()"><div id="textationList497"></div></div><div id="textationDetail497" class="textation-detail-497"><p class="muted">Vyberte textaci.</p></div></div></div>`;
      renderTextationLibrary497(); return;
    }
    if(type==='documents'){
      const box=document.getElementById('adminPanel'); if(!box)return;
      box.innerHTML=`<div class="admin-documents-497">${renderDocumentsWorkspace.toString() && ''}<p class="eyebrow">DOKUMENTOVÝ MODUL</p><h2>Dokumenty k obchodnímu případu</h2><p class="muted">Správa kategorií dokumentů pro obchodní případ.</p><div class="doc-grid-497">${['VPP / DPP / ZPP','Nabídky pojišťoven','Škodní průběh','Revize / technické podklady','Fotodokumentace','Dotazníky a ostatní'].map(x=>`<div class="doc-card-497"><h3>${x}</h3><p>Dokumentová kategorie.</p></div>`).join('')}</div></div>`;
      return;
    }
    if(prevAdminPanel497) return prevAdminPanel497(type);
  };

})();

/* ============================================================================
   BRH 4.9.8 – SMART OFFER TOGGLE SAFE
   Oprava karty 8 Nabídky:
   - tlačítko „Tato pojišťovna splňuje vše“ je skutečný přepínač
   - po použití je viditelně zvýrazněné
   - dalším kliknutím se stav vrátí zpět
   - při zapnutí se automaticky doplní limit a spoluúčast z poptávky
   - ukládá předchozí hodnoty, aby se poradce nemusel ručně vracet zpět
   ============================================================================ */
(function(){
  window.BRH_498_SMART_OFFER_TOGGLE_SAFE = true;
  window.BRH_RENDER_VERSION = '498';

  const originalFulfill498 = window.fulfillAllRisksForInsurer;
  const originalRenderWorkspace498 = window.renderWorkspace;

  function st498(){ return (typeof state !== 'undefined' && state) ? state : (window.state = window.state || {}); }
  function arr498(v){ return Array.isArray(v) ? v : []; }
  function norm498(code){
    let v = String(code || '').trim().toLowerCase();
    v = v.replace(/\s+/g,' ');
    if(v.includes('koop') || v.includes('kooperativa')) return 'koop';
    if(v.includes('gcp') || v.includes('gčp') || v.includes('generali')) return 'gcp';
    if(v.includes('cpp') || v.includes('čpp') || v.includes('podnikatelsk')) return 'cpp';
    return v;
  }
  function riskKey498(r){
    return String((r && (r.risk_key || r.key || r.code || r.name || r.title)) || '').trim();
  }
  function getOffer498(code){
    const st = st498();
    st.offers = arr498(st.offers);
    const id = norm498(code);
    let o = st.offers.find(x => norm498(x.insurer_code || x.code || x.insurer || x.name) === id);
    if(!o){
      o = {insurer_code:id, code:id, risks:{}};
      st.offers.push(o);
    }
    o.insurer_code = id;
    o.code = id;
    o.risks = o.risks || {};
    return o;
  }
  function isAllFulfilled498(code){
    const st = st498();
    const o = getOffer498(code);
    const risks = arr498(st.risks).filter(r => riskKey498(r));
    if(!risks.length) return !!o._all_fulfilled;
    return !!o._all_fulfilled && risks.every(r => {
      const x = o.risks[riskKey498(r)] || {};
      return String(x.status || '').toLowerCase() === 'splněno';
    });
  }
  function setDomField498(el, value){
    if(!el) return;
    el.value = value || '';
    el.dispatchEvent(new Event('input', {bubbles:true}));
    el.dispatchEvent(new Event('change', {bubbles:true}));
  }

  window.fulfillAllRisksForInsurer = function(code){
    const st = st498();
    const id = norm498(code);
    const o = getOffer498(id);
    const risks = arr498(st.risks).filter(r => riskKey498(r));
    const already = isAllFulfilled498(id);

    if(already){
      // Vrácení do původního stavu
      const backup = o._before_fulfill || {};
      risks.forEach(r => {
        const k = riskKey498(r);
        const prev = backup[k] || {};
        const x = o.risks[k] = o.risks[k] || {};
        x.status = prev.status || 'nutno ověřit';
        x.offered_limit = prev.offered_limit || '';
        x.deductible = prev.deductible || '';
        x.exclusions = prev.exclusions || x.exclusions || '';
        x.sublimits = prev.sublimits || x.sublimits || '';
        x.source_reference = prev.source_reference || x.source_reference || '';
        x.note = prev.note || x.note || '';
        x._auto_fulfilled = false;
      });
      o._all_fulfilled = false;
      o._before_fulfill = {};
      if(typeof toast === 'function') toast('Nastavení „splňuje vše“ bylo vráceno zpět.');
    } else {
      // Uložit původní stav, ať se dá jedním klikem vrátit.
      o._before_fulfill = {};
      risks.forEach(r => {
        const k = riskKey498(r);
        const x = o.risks[k] = o.risks[k] || {};
        o._before_fulfill[k] = {
          status: x.status || 'nutno ověřit',
          offered_limit: x.offered_limit || '',
          deductible: x.deductible || '',
          exclusions: x.exclusions || '',
          sublimits: x.sublimits || '',
          source_reference: x.source_reference || '',
          note: x.note || ''
        };
        x.status = 'splněno';
        x.offered_limit = r.requested_limit || r.limit || x.offered_limit || '';
        x.deductible = r.deductible || (st.questionnaire && st.questionnaire.deductible_preference) || x.deductible || '';
        x._auto_fulfilled = true;
      });
      o.workflow_status = 'splněno';
      o._all_fulfilled = true;
      if(typeof toast === 'function') toast('Pojišťovna je označena jako splněná. Limity a spoluúčasti byly převzaty z poptávky.');
    }

    // Původní aplikace je stavově renderovaná, takže po přepnutí překreslíme kartu.
    if(typeof renderWorkspace === 'function'){
      renderWorkspace();
    }
    setTimeout(window.brh498MarkFulfilledButtons, 80);
  };

  window.fulfillAllRisksEverywhere = function(){
    const st = st498();
    const codes = arr498(st.selected_insurers).length ? arr498(st.selected_insurers) : arr498(st.offers).map(o => o.insurer_code || o.code);
    codes.forEach(c => {
      const o = getOffer498(c);
      if(!isAllFulfilled498(c)) window.fulfillAllRisksForInsurer(c);
    });
    setTimeout(window.brh498MarkFulfilledButtons, 120);
  };

  window.brh498MarkFulfilledButtons = function(){
    const st = st498();

    // Záhlaví pojišťoven v kartě 8.
    document.querySelectorAll('th.offer-head, th').forEach(th => {
      const btns = Array.from(th.querySelectorAll('button')).filter(b => (b.textContent || '').toLowerCase().includes('pojišťovna splňuje vše') || b.classList.contains('offer-fulfilled-toggle-498'));
      if(!btns.length) return;

      let code = '';
      const mini = th.querySelector('.mini');
      if(mini) code = mini.textContent || '';
      if(!code){
        const onclick = btns[0].getAttribute('onclick') || '';
        const m = onclick.match(/fulfillAllRisksForInsurer\(['"]([^'"]+)['"]\)/);
        if(m) code = m[1];
      }
      if(!code) code = th.textContent || '';

      const active = isAllFulfilled498(code);
      btns.forEach(btn => {
        btn.classList.add('offer-fulfilled-toggle-498');
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.title = active
          ? 'Kliknutím vrátíte rizika této pojišťovny zpět do původního stavu.'
          : 'Kliknutím nastavíte všechna rizika této pojišťovny jako splněná a doplníte limity ze zadání.';
        btn.innerHTML = active ? '✓ Splňuje vše – vrátit zpět' : 'Tato pojišťovna splňuje vše';
      });
    });

    // Selecty ve sloupcích – vizuální podbarvení splněných buněk.
    document.querySelectorAll('td').forEach(td => {
      const sel = td.querySelector('select');
      if(!sel) return;
      const val = String(sel.value || '').toLowerCase();
      td.classList.toggle('risk-cell-fulfilled-498', val === 'splněno');
    });
  };

  // Zachytit kliknutí i tehdy, kdy starý inline onclick neodpovídá.
  document.addEventListener('click', function(ev){
    const btn = ev.target && ev.target.closest ? ev.target.closest('button.offer-fulfilled-toggle-498') : null;
    if(!btn) return;
    const th = btn.closest('th');
    let code = '';
    const mini = th ? th.querySelector('.mini') : null;
    if(mini) code = mini.textContent || '';
    if(!code){
      const onclick = btn.getAttribute('onclick') || '';
      const m = onclick.match(/fulfillAllRisksForInsurer\(['"]([^'"]+)['"]\)/);
      if(m) code = m[1];
    }
    if(code){
      ev.preventDefault();
      ev.stopPropagation();
      window.fulfillAllRisksForInsurer(code);
    }
  }, true);

  // Po každém renderu označit aktivní tlačítka a splněné buňky.
  if(typeof originalRenderWorkspace498 === 'function'){
    window.renderWorkspace = function(){
      const res = originalRenderWorkspace498.apply(this, arguments);
      setTimeout(window.brh498MarkFulfilledButtons, 80);
      return res;
    };
  }
  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(window.brh498MarkFulfilledButtons, 300);
  });
  setTimeout(window.brh498MarkFulfilledButtons, 300);
})();
