const VERSION = '3.3.1c';
let CATALOG = {insurers:[], risks:[], riskModel:[], activities:[], textTemplates:[]};
let cases = [];
let clients = [];
let currentTab = 'client';
let state = blankCase();

function blankCase(){return {id:null,title:'',status:'rozpracováno',adviser:{name:'Administrátor ASTORIE',email:'admin@astorie.local'},client:{ico:'',name:'',legal_form:'',address:'',data_box:'',contact_person:'',contact_email:'',contact_phone:'',website:'',registered_office:'',billing_email:''},activity:{code:'',name:''},questionnaire:{turnover:'',employees:'',territory:'Česká republika',insurance_start:'',insurance_period:'1 rok',payment_frequency:'ročně',export_info:'',main_activity_detail:'',side_activities:'',annual_revenue_breakdown:'',payroll:'',locations:'',property_description:'',security:'',claims_history:'',current_insurance:'',requested_scope:'',deductible_preference:'',special_notes:'',attachments_note:''},risks:[],selected_insurers:[],offers:{},insurer_requests:{},liability_agreements:[],case_textations:[],documents:[],report:{advisor_note:'',client_selected_offer:'',client_choice_reason:''},audit:[]};}
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
  const s=Object.assign(blankCase(),item||{}); s.client=Object.assign(blankCase().client,s.client||{}); s.adviser=Object.assign(blankCase().adviser,s.adviser||{}); s.activity=Object.assign(blankCase().activity,s.activity||{}); s.questionnaire=Object.assign(blankCase().questionnaire,s.questionnaire||{}); s.risks=Array.isArray(s.risks)?s.risks:[]; s.selected_insurers=Array.isArray(s.selected_insurers)?s.selected_insurers:[]; s.offers=(s.offers&&typeof s.offers==='object'&&!Array.isArray(s.offers))?s.offers:{}; s.insurer_requests=(s.insurer_requests&&typeof s.insurer_requests==='object'&&!Array.isArray(s.insurer_requests))?s.insurer_requests:{}; s.liability_agreements=Array.isArray(s.liability_agreements)?s.liability_agreements:[]; s.case_textations=Array.isArray(s.case_textations)?s.case_textations:[]; s.risks=s.risks.map(migrateRiskRecord); s.report=Object.assign(blankCase().report,s.report||{}); s.documents=Array.isArray(s.documents)?s.documents:[]; return s;
}
function readiness(){let score=0;if(state.client.name)score+=18;if(state.client.ico)score+=8;if(state.activity.name)score+=8;if(state.questionnaire.main_activity_detail||state.questionnaire.turnover||state.questionnaire.locations)score+=8;if(state.risks.length)score+=18;if(state.selected_insurers.length)score+=16;if(Object.keys(state.offers||{}).length)score+=16;if(state.report.client_selected_offer)score+=14;return Math.min(100,score)}
function offerCount(){return Object.keys(state.offers||{}).filter(k=>state.selected_insurers.includes(k)||state.offers[k]).length}
function insurerCode(i){return i.code||i.shortcut||i.zkratka||i.key||i.name}
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
function renderWorkspace(){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab)); const map={client:tabClient,insurance:tabInsurance,liability:tabLiability,risks:tabRisks,insurers:tabInsurers,requests:tabInsurerRequests,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit}; $('tabContent').innerHTML=(map[currentTab]||tabClient)(); renderHeader();}
function readCurrentTab(){
  if(currentTab==='client'){
    ['ico','name','legal_form','address','data_box','contact_person','contact_email','contact_phone','website','registered_office','billing_email'].forEach(k=>{const el=$('client_'+k); if(el) state.client[k]=el.value});
    ['name','email'].forEach(k=>{const el=$('adviser_'+k); if(el) state.adviser[k]=el.value});
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

function riskProductCell(r, idx){
  const note=riskMethodNote(r);
  return `<div class="risk-product-cell"><textarea class="fit risk-name-field" onchange="state.risks[${idx}].name=this.value">${esc(r.name||r.label||'')}</textarea>${note?`<details class="risk-help"><summary>Interní metodika / nápověda poradce</summary><div>${esc(note)}</div></details>`:''}</div>`;
}
function riskTileLabel(key, name){
  const selected=liabilitySelectedSet().has(key);
  return `${selected?'✓ ':''}${name}`;
}

function tabLiability(){
  const selected=liabilitySelectedSet();
  const riskCards=LIABILITY_RISKS.map(r=>`<button class="risk-tile ${selected.has(r[0])?'selected':''}" title="${esc(r[3])}" onclick="addLiabilityRisk('${esc(r[0])}','${esc(r[1])}','${esc(r[2])}','${esc(r[3])}')"><span>${selected.has(r[0])?'✓ ':''}${esc(r[1])}</span><small>Doporučený limit: ${esc(r[2])}</small><em>${esc(r[3])}</em><b class="tile-action">${selected.has(r[0])?'Kliknutím odebrat':'Kliknutím přidat'}</b></button>`).join('');
  const agre=(state.liability_agreements||[]).map((a,i)=>`<tr><td><textarea class="fit" onchange="state.liability_agreements[${i}].title=this.value">${esc(a.title)}</textarea></td><td><textarea class="fit" onchange="state.liability_agreements[${i}].limit=this.value" placeholder="limit / sublimit">${esc(a.limit||'')}</textarea></td><td><textarea class="fit tall" onchange="state.liability_agreements[${i}].text=this.value">${esc(a.text||'')}</textarea></td><td><button class="btn danger" onclick="removeLiabilityAgreement(${i})">Smazat</button></td></tr>`).join('');
  const chosen=(state.risks||[]).filter(r=>LIABILITY_RISKS.some(x=>x[0]===r.risk_key)||String(r.risk_key||'').startsWith('CUSTOM'));
  return `<p class="eyebrow">3. Modul pojištění odpovědnosti PROFI</p><h2>Rizika a zvláštní ujednání odpovědnosti</h2><p class="muted">Interní metodika slouží pouze jako nápověda poradce. Do poptávek, nabídek a výstupů se propisuje jen pole „Specifikace / doplnění pro pojišťovnu“.</p>
  <div class="section-soft"><div class="section-head"><div><h3>Profesionální katalog rizik odpovědnosti</h3><p class="muted">Riziko přidáte kliknutím. Pokud je už vybrané, dalším kliknutím ho odeberete. Interní metodika je viditelná v detailu rizika a nejde do výstupů.</p></div><div class="tools"><button class="btn primary" onclick="addAllLiabilityRisks()">+ Přidat celou sadu</button><button class="btn danger" onclick="clearAllLiabilityRisks()">Odebrat všechna rizika</button></div></div><div class="risk-catalog-grid">${riskCards}</div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Vybraná rizika odpovědnosti</h3><p class="muted">Sloupec Produkt/Riziko obsahuje rozbalovací interní nápovědu. Do komunikace s pojišťovnou jde pouze specifikace.</p></div><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table class="pro-table risk-pro-table"><thead><tr><th class="risk-product-col">Produkt / riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th class="spec-col">Specifikace / doplnění pro pojišťovnu</th><th></th></tr></thead><tbody>${chosen.length?chosen.map((r,i)=>{const idx=state.risks.indexOf(r);return `<tr><td>${riskProductCell(r,idx)}</td><td><textarea class="fit" onchange="state.risks[${idx}].requested_limit=this.value">${esc(r.requested_limit||'')}</textarea></td><td><textarea class="fit" onchange="state.risks[${idx}].deductible=this.value">${esc(r.deductible||'')}</textarea></td><td><textarea class="fit tall spec-field" onchange="state.risks[${idx}].specification=this.value" placeholder="Text určený pro pojišťovnu / poptávku">${esc(riskSpecification(r))}</textarea></td><td><button class="btn danger" onclick="removeRisk(${idx})">Smazat</button></td></tr>`}).join(''):'<tr><td colspan="5" class="muted">Zatím není vybrané žádné riziko odpovědnosti.</td></tr>'}</tbody></table></div></div>
  <div class="section-soft"><div class="section-head"><div><h3>Zvláštní ujednání a doložky</h3><p class="muted">Tato část se přenáší do poptávky pojišťovnám a slouží i jako podklad pro kontrolu nabídky.</p></div><div class="tools"><button class="btn secondary" onclick="addAllLiabilityAgreements()">+ Doporučená ujednání</button><button class="btn secondary" onclick="addCustomLiabilityAgreement()">+ Vlastní ujednání</button><button class="btn danger" onclick="clearAllLiabilityAgreements()">Smazat všechna ujednání</button></div></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th><th></th></tr></thead><tbody>${agre||'<tr><td colspan="4" class="muted">Zatím nejsou doplněna žádná zvláštní ujednání.</td></tr>'}</tbody></table></div></div>
  <div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit modul odpovědnosti</button><button class="btn secondary" onclick="currentTab='risks';renderWorkspace()">Přejít na obecná rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}

function tabRisks(){
  const options=riskOptions(); const suggested=suggestedRisks();
  return `<p class="eyebrow">4. Ostatní rizika a požadavky klienta</p><h2>Vstupní dotazník rizik</h2><p class="muted">Každé riziko má oddělenou interní metodiku a externí specifikaci pro pojišťovnu.</p><div class="section-soft"><h3>Doporučená rizika podle činnosti</h3>${suggested.length?`<div class="chip-row">${suggested.map(r=>`<button class="chip" title="${esc(r.note||'')}" onclick="addRiskByKey('${esc(r.risk_key)}')">+ ${esc(r.risk_name||r.name||r.risk_key)}</button>`).join('')}</div>`:'<div class="info-box">Vyplňte typ činnosti na kartě klienta nebo použijte ruční výběr z knihovny rizik.</div>'}</div><div class="tools"><select id="addRiskSelect"><option value="">Vyberte riziko z knihovny</option>${options}</select><button class="btn primary" onclick="addRiskFromSelect()">+ Přidat riziko</button><button class="btn secondary" onclick="addDefaultRisks()">+ Doporučená sada</button><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table class="pro-table"><thead><tr><th>Risk key</th><th>Název rizika</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění pro pojišťovnu</th><th>Interní nápověda</th><th></th></tr></thead><tbody>${state.risks.map((r,i)=>`<tr><td><textarea class="fit codefield" onchange="state.risks[${i}].risk_key=this.value">${esc(r.risk_key||r.key)}</textarea></td><td><textarea class="fit" onchange="state.risks[${i}].name=this.value">${esc(r.name||r.label)}</textarea></td><td><textarea class="fit" onchange="state.risks[${i}].requested_limit=this.value">${esc(r.requested_limit||r.limit)}</textarea></td><td><textarea class="fit" onchange="state.risks[${i}].deductible=this.value">${esc(r.deductible||'')}</textarea></td><td><textarea class="fit tall" onchange="state.risks[${i}].specification=this.value">${esc(riskSpecification(r))}</textarea></td><td><div class="advisor-help">${esc(riskMethodNote(r))}</div></td><td><button class="btn danger" onclick="removeRisk(${i})">Smazat</button></td></tr>`).join('')||'<tr><td colspan="7" class="muted">Zatím není doplněné žádné riziko.</td></tr>'}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit rizika</button><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function insurerRequestHtml(code, forPrint=false){
  const ins=insurerByCode(code); const req=ensureInsurerRequest(code); const rows=requestDataRows();
  const risks=(state.risks||[]).map(r=>`<tr><td>${esc(r.name||'')}</td><td>${esc(r.requested_limit||'')}</td><td>${esc(r.deductible||'')}</td><td>${esc(riskSpecification(r))}</td></tr>`).join('');
  const agreements=liabilityAgreementRows().map(a=>`<tr><td>${esc(a.title||'')}</td><td>${esc(a.limit||'')}</td><td>${esc(a.text||'')}</td></tr>`).join('');
  const texts=selectedTextations('request').map(t=>`<h4>${esc(t.title||'Textace')}</h4><p>${esc(textationContent(t)).replace(/\n/g,'<br>')}</p>`).join('');
  return `<div class="request-print"><div class="print-head"><div><h1>ASTORIE a.s.</h1><p>Poptávka pojištění podnikatelských rizik</p></div><div><b>${esc(ins.name||code)}</b><br>${esc(code)}<br>${esc(ins.email||ins.request_email||'')}</div></div><h2>${esc(state.client.name||'Klient')}</h2><p><b>CASE_ID:</b> ${esc(state.id||'nový případ')} · <b>Poradce:</b> ${esc(state.adviser?.name||'')} · <b>Datum:</b> ${new Date().toLocaleDateString('cs-CZ')}</p><h3>Základní údaje pro pojištění</h3><table>${rows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table><h3>Požadovaná rizika a limity</h3><table><thead><tr><th>Riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Specifikace / doplnění</th></tr></thead><tbody>${risks||'<tr><td colspan="4">Rizika nejsou doplněna.</td></tr>'}</tbody></table><h3>Zvláštní ujednání / požadované doložky odpovědnosti</h3><table><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Specifikace / požadavek</th></tr></thead><tbody>${agreements||'<tr><td colspan="3">Zvláštní ujednání nejsou doplněna.</td></tr>'}</tbody></table>${texts?`<h3>Doplněné textace pro pojišťovnu</h3>${texts}`:''}<h3>Doprovodná poznámka</h3><p>${esc(req.email_note||defaultEmailNote(code)).replace(/\n/g,'<br>')}</p><p class="muted">Tento výstup je pracovní poptávka pro pojišťovnu. Zdrojem dat je jeden obchodní případ v Business Risk Hubu.</p></div>`;
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
  if(!state.selected_insurers.length)return `<p class="eyebrow">7. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven.</div>`;
  if(!state.risks.length)return `<p class="eyebrow">7. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v modulu odpovědnosti nebo v ostatních rizicích.</div>`;
  const common=`<div class="section-soft"><div class="section-head"><div><h3>Společné údaje z poptávky</h3><p class="muted">Tyto údaje platí pro všechny pojišťovny. Není nutné je opisovat u každé nabídky.</p></div><button class="btn secondary" onclick="applyCommonOfferData()">Propsat do všech nabídek</button></div><div class="grid4"><div class="stat"><span>Počátek</span><b>${esc(state.questionnaire.insurance_start||'není uveden')}</b></div><div class="stat"><span>Pojistné období</span><b>${esc(state.questionnaire.insurance_period||'není uvedeno')}</b></div><div class="stat"><span>Frekvence</span><b>${esc(state.questionnaire.payment_frequency||'ročně')}</b></div><div class="stat"><span>Preferovaná spoluúčast</span><b>${esc(state.questionnaire.deductible_preference||'není uvedena')}</b></div></div></div>`;
  const heads=state.selected_insurers.map(code=>{const o=ensureOffer(code);return `<th class="offer-head">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div><input placeholder="Nabídnuté pojistné" onchange="ensureOffer('${esc(code)}').premium=this.value" value="${esc(o.premium)}"><input placeholder="Počátek pojištění" onchange="ensureOffer('${esc(code)}').insurance_start=this.value" value="${esc(o.insurance_start||state.questionnaire.insurance_start||'')}"><input placeholder="Frekvence placení" onchange="ensureOffer('${esc(code)}').payment_frequency=this.value" value="${esc(o.payment_frequency||state.questionnaire.payment_frequency||'ročně')}"><input placeholder="Celková spoluúčast / pozn." onchange="ensureOffer('${esc(code)}').deductible=this.value" value="${esc(o.deductible||state.questionnaire.deductible_preference||'')}"></th>`}).join('');
  const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||'není uvedena')}<br>${riskSpecification(r)?`<small>Specifikace: ${esc(riskSpecification(r))}</small>`:''}</td>${state.selected_insurers.map(code=>offerCell(code,r,i)).join('')}</tr>`).join('');
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


/* BRH 3.3.0 – Smart Nabídky & Textation Workflow PRO */
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
  const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||state.questionnaire.deductible_preference||'není uvedena')}<br>${riskSpecification(r)?`<small>Specifikace: ${esc(riskSpecification(r))}</small>`:''}</td>${state.selected_insurers.map(code=>offerCell(code,r,i)).join('')}</tr>`).join('');
  return `<p class="eyebrow">7. Smart nabídky</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Při volbě „splněno“ se automaticky doplní požadovaný limit a spoluúčast z poptávky. Poradce řeší pouze odchylky.</p>${common}<div class="table-wrap"><table class="offer-table pro-table"><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button><button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button></div>`;
}
function tabInsurerRequests(){
  const missing=requestCompleteness();
  if(missing.length) return `<p class="eyebrow">6. Poptávky pojišťovnám</p><h2>Nejdříve doplňte povinné části</h2><div class="info-box">Pro generování poptávek chybí: ${esc(missing.join(', '))}.</div>`;
  const textBlock=smartRequestTextationBlock('request');
  const cards=selectedInsurerRows().map(({code,ins,req})=>`<div class="request-card"><div class="section-head"><div><p class="eyebrow">Pojišťovna</p><h2>${esc(ins.name||code)}</h2><p class="muted"><b>${esc(code)}</b> · ${esc(ins.email||ins.request_email||'e-mail není doplněn')}</p></div><span class="badge">${esc(req.status||'připraveno')}</span></div><div class="grid3"><label>Předmět e-mailu<input value="${esc(req.subject||requestSubject(code))}" onchange="ensureInsurerRequest('${esc(code)}').subject=this.value"></label><label>Stav poptávky<select onchange="ensureInsurerRequest('${esc(code)}').status=this.value"><option ${req.status==='připraveno'?'selected':''}>připraveno</option><option ${req.status==='odesláno'?'selected':''}>odesláno</option><option ${req.status==='čekáme na nabídku'?'selected':''}>čekáme na nabídku</option><option ${req.status==='nabídka přijata'?'selected':''}>nabídka přijata</option><option ${req.status==='nutné doplnění'?'selected':''}>nutné doplnění</option></select></label><label>Datum odeslání<input type="date" value="${esc(req.sent_at||'')}" onchange="ensureInsurerRequest('${esc(code)}').sent_at=this.value"></label></div><label>Doprovodný text pro pojišťovnu<textarea onchange="ensureInsurerRequest('${esc(code)}').email_note=this.value" placeholder="Krátká poznámka k poptávce, termín pro nabídku, specifika komunikace...">${esc(req.email_note||defaultEmailNote(code))}</textarea></label><div class="tools"><button class="btn primary" onclick="printInsurerRequest('${esc(code)}')">PDF / tisk poptávky</button><button class="btn secondary" onclick="exportInsurerRequestExcel('${esc(code)}')">Excel pro pojišťovnu</button><button class="btn secondary" onclick="copyInsurerEmail('${esc(code)}')">Kopírovat e-mail</button><button class="btn ghost" onclick="ensureInsurerRequest('${esc(code)}').status='odesláno';ensureInsurerRequest('${esc(code)}').sent_at=new Date().toISOString().slice(0,10);readCurrentTab();saveCase()">Označit jako odesláno</button></div></div>`).join('');
  return `<p class="eyebrow">6. Smart poptávky pojišťovnám</p><h2>Samostatná poptávka pro každou pojišťovnu</h2><p class="muted">Poptávka se skládá automaticky z karty klienta, karty pro pojištění, modulu odpovědnosti a textací vložených do případu.</p><div class="warning"><b>Důležité:</b> interní metodická nápověda se do poptávky nepropíše. Do výstupu jde pouze pole „Specifikace / doplnění pro pojišťovnu“ a zvolené textace.</div>${textBlock}${cards}<div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit stav poptávek</button><button class="btn secondary" onclick="currentTab='offers';renderWorkspace()">Pokračovat na nabídky</button></div>`;
}

window.addLiabilityRisk=addLiabilityRisk;window.openCase=openCase;window.ensureInsurerRequest=ensureInsurerRequest;window.printInsurerRequest=printInsurerRequest;window.exportInsurerRequestExcel=exportInsurerRequestExcel;window.copyInsurerEmail=copyInsurerEmail;window.ensureOffer=ensureOffer;window.toggleInsurer=toggleInsurer;window.addRiskFromSelect=addRiskFromSelect;window.addCustomRisk=addCustomRisk;window.removeRisk=removeRisk;window.addManualInsurer=addManualInsurer;window.saveCase=saveCase;window.loadAres=loadAres;window.searchClients=searchClients;window.useClient=useClient;window.saveAdminCatalog=saveAdminCatalog;window.adminPanel=adminPanel;window.saveAllCatalogJson=saveAllCatalogJson;window.copyTextation=copyTextation;window.addRiskByKey=addRiskByKey;window.addDefaultRisks=addDefaultRisks;window.clearAllLiabilityRisks=clearAllLiabilityRisks;window.clearAllLiabilityAgreements=clearAllLiabilityAgreements;window.setOfferRiskStatus=setOfferRiskStatus;window.applyCommonOfferData=applyCommonOfferData;window.smartPrefillAllOffers=smartPrefillAllOffers;window.fulfillAllRisksForInsurer=fulfillAllRisksForInsurer;window.fulfillAllRisksEverywhere=fulfillAllRisksEverywhere;window.addTextationToCase=addTextationToCase;window.removeCaseTextation=removeCaseTextation;
document.addEventListener('DOMContentLoaded',init);
