const VERSION = '3.1.0';
let CATALOG = {insurers:[], risks:[], riskModel:[], activities:[], textTemplates:[]};
let cases = [];
let clients = [];
let currentTab = 'client';
let state = blankCase();

function blankCase(){return {id:null,title:'',status:'rozpracováno',adviser:{name:'Administrátor ASTORIE',email:'admin@astorie.local'},client:{ico:'',name:'',legal_form:'',address:'',data_box:'',contact_person:'',contact_email:'',contact_phone:'',website:'',registered_office:'',billing_email:''},activity:{code:'',name:''},questionnaire:{turnover:'',employees:'',territory:'Česká republika',insurance_start:'',insurance_period:'1 rok',export_info:'',main_activity_detail:'',side_activities:'',annual_revenue_breakdown:'',payroll:'',locations:'',property_description:'',security:'',claims_history:'',current_insurance:'',requested_scope:'',deductible_preference:'',special_notes:'',attachments_note:''},risks:[],selected_insurers:[],offers:{},insurer_requests:{},liability_agreements:[],documents:[],report:{advisor_note:'',client_selected_offer:'',client_choice_reason:''},audit:[]};}
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
  <div class="section-soft"><h3>Ekonomické a provozní údaje</h3><div class="grid4"><label>Obrat<input id="q_turnover" value="${esc(state.questionnaire.turnover)}" placeholder="např. 10 000 000 Kč"></label><label>Mzdy / payroll<input id="q_payroll" value="${esc(state.questionnaire.payroll)}"></label><label>Zaměstnanci<input id="q_employees" value="${esc(state.questionnaire.employees)}"></label><label>Pojistné období<input id="q_insurance_period" value="${esc(state.questionnaire.insurance_period)}"></label></div><label>Členění obratu / export / zahraničí<textarea id="q_annual_revenue_breakdown" placeholder="Tuzemsko, EU, mimo EU, obrat podle činností...">${esc(state.questionnaire.annual_revenue_breakdown||state.questionnaire.export_info)}</textarea></label></div>
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
  const s=Object.assign(blankCase(),item||{}); s.client=Object.assign(blankCase().client,s.client||{}); s.adviser=Object.assign(blankCase().adviser,s.adviser||{}); s.activity=Object.assign(blankCase().activity,s.activity||{}); s.questionnaire=Object.assign(blankCase().questionnaire,s.questionnaire||{}); s.risks=Array.isArray(s.risks)?s.risks:[]; s.selected_insurers=Array.isArray(s.selected_insurers)?s.selected_insurers:[]; s.offers=(s.offers&&typeof s.offers==='object'&&!Array.isArray(s.offers))?s.offers:{}; s.insurer_requests=(s.insurer_requests&&typeof s.insurer_requests==='object'&&!Array.isArray(s.insurer_requests))?s.insurer_requests:{}; s.liability_agreements=Array.isArray(s.liability_agreements)?s.liability_agreements:[]; s.report=Object.assign(blankCase().report,s.report||{}); s.documents=Array.isArray(s.documents)?s.documents:[]; return s;
}
function readiness(){let score=0;if(state.client.name)score+=18;if(state.client.ico)score+=8;if(state.activity.name)score+=8;if(state.questionnaire.main_activity_detail||state.questionnaire.turnover||state.questionnaire.locations)score+=8;if(state.risks.length)score+=18;if(state.selected_insurers.length)score+=16;if(Object.keys(state.offers||{}).length)score+=16;if(state.report.client_selected_offer)score+=14;return Math.min(100,score)}
function offerCount(){return Object.keys(state.offers||{}).filter(k=>state.selected_insurers.includes(k)||state.offers[k]).length}
function insurerCode(i){return i.code||i.shortcut||i.zkratka||i.key||i.name}
function insurerByCode(code){return (CATALOG.insurers||[]).find(i=>insurerCode(i)===code)||{code,name:code}}
function riskName(r){return r.name||r.label||r.risk_name||r.key||r.risk_key||'Riziko'}
function riskKey(r){return r.key||r.risk_key||riskName(r).toUpperCase().replace(/[^A-Z0-9]+/g,'_')}
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
    ['turnover','employees','territory','insurance_start','insurance_period','export_info','main_activity_detail','side_activities','annual_revenue_breakdown','payroll','locations','property_description','security','claims_history','current_insurance','requested_scope','deductible_preference','special_notes','attachments_note'].forEach(k=>{const el=$('q_'+k); if(el) state.questionnaire[k]=el.value});
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
function toggleInsurer(code,on){if(on&&!state.selected_insurers.includes(code))state.selected_insurers.push(code); if(!on)state.selected_insurers=state.selected_insurers.filter(x=>x!==code);renderHeader();}
function addManualInsurer(){const code=prompt('Zkratka pojišťovny mimo seznam:'); if(code&&!state.selected_insurers.includes(code)){state.selected_insurers.push(code);renderWorkspace();}}
function ensureOffer(code){state.offers[code] ||= {premium:'',deductible:'',valid_until:'',note:'',risks:{}}; return state.offers[code];}

function ensureInsurerRequest(code){
  state.insurer_requests ||= {};
  state.insurer_requests[code] ||= {status:'připraveno',sent_at:'',subject:'',email_note:'',internal_note:''};
  return state.insurer_requests[code];
}
function requestSubject(code){return `Poptávka pojištění podnikatelských rizik – ${state.client.name||'klient'} – ${code}`}
function selectedInsurerRows(){return (state.selected_insurers||[]).map(code=>{const ins=insurerByCode(code); const req=ensureInsurerRequest(code); return {code, ins, req};});}
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
  const rows=[['Klient',c.name],['IČO',c.ico],['Adresa',c.address],['Kontaktní osoba',c.contact_person],['E-mail',c.contact_email],['Telefon',c.contact_phone],['Typ činnosti',state.activity?.name],['Detail činnosti',q.main_activity_detail],['Vedlejší činnosti',q.side_activities],['Obrat',q.turnover],['Zaměstnanci',q.employees],['Území',q.territory],['Počátek pojištění',q.insurance_start],['Pojistné období',q.insurance_period],['Export / zahraničí',q.annual_revenue_breakdown||q.export_info],['Provozovny',q.locations],['Popis majetku',q.property_description],['Zabezpečení',q.security],['Škodní průběh',q.claims_history],['Současné pojištění',q.current_insurance],['Požadovaný rozsah',q.requested_scope],['Preferovaná spoluúčast',q.deductible_preference],['Speciální poznámka',q.special_notes],['Přílohy / podklady',q.attachments_note]];
  return rows.filter(r=>norm(r[1]));
}
function liabilityAgreementRows(){ return (state.liability_agreements||[]).filter(a=>norm(a.title)||norm(a.text)); }
function insurerRequestHtml(code, forPrint=false){
  const ins=insurerByCode(code); const req=ensureInsurerRequest(code); const rows=requestDataRows();
  const risks=(state.risks||[]).map(r=>`<tr><td>${esc(r.risk_key||'')}</td><td>${esc(r.name||'')}</td><td>${esc(r.requested_limit||'')}</td><td>${esc(r.deductible||'')}</td><td>${esc(r.note||'')}</td></tr>`).join('');
  const agreements=liabilityAgreementRows().map(a=>`<tr><td>${esc(a.title||'')}</td><td>${esc(a.limit||'')}</td><td>${esc(a.text||'')}</td></tr>`).join('');
  return `<div class="request-print"><div class="print-head"><div><h1>ASTORIE a.s.</h1><p>Poptávka pojištění podnikatelských rizik</p></div><div><b>${esc(ins.name||code)}</b><br>${esc(code)}<br>${esc(ins.email||ins.request_email||'')}</div></div><h2>${esc(state.client.name||'Klient')}</h2><p><b>CASE_ID:</b> ${esc(state.id||'nový případ')} · <b>Poradce:</b> ${esc(state.adviser?.name||'')} · <b>Datum:</b> ${new Date().toLocaleDateString('cs-CZ')}</p><h3>Základní údaje pro pojištění</h3><table>${rows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table><h3>Požadovaná rizika a limity</h3><table><thead><tr><th>Risk key</th><th>Riziko</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Poznámka</th></tr></thead><tbody>${risks||'<tr><td colspan="5">Rizika nejsou doplněna.</td></tr>'}</tbody></table><h3>Zvláštní ujednání / požadované doložky odpovědnosti</h3><table><thead><tr><th>Ujednání</th><th>Limit / sublimit</th><th>Poznámka</th></tr></thead><tbody>${agreements||'<tr><td colspan="3">Zvláštní ujednání nejsou doplněna.</td></tr>'}</tbody></table><h3>Doprovodná poznámka</h3><p>${esc(req.email_note||defaultEmailNote(code)).replace(/\n/g,'<br>')}</p><p class="muted">Tento výstup je pracovní poptávka pro pojišťovnu. Zdrojem dat je jeden obchodní případ v Business Risk Hubu.</p></div>`;
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

function tabOffers(){if(!state.selected_insurers.length)return `<p class="eyebrow">6. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven v kroku 3.</div>`; if(!state.risks.length)return `<p class="eyebrow">6. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v kroku 2.</div>`; const heads=state.selected_insurers.map(code=>`<th class="offer-head">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div><input placeholder="Pojistné" onchange="ensureOffer('${esc(code)}').premium=this.value" value="${esc(ensureOffer(code).premium)}"><input placeholder="Platnost nabídky" onchange="ensureOffer('${esc(code)}').valid_until=this.value" value="${esc(ensureOffer(code).valid_until)}"><input placeholder="Celková spoluúčast / pozn." onchange="ensureOffer('${esc(code)}').deductible=this.value" value="${esc(ensureOffer(code).deductible)}"></th>`).join(''); const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br><span class="badge">${esc(r.risk_key)}</span><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||'není uvedena')}</td>${state.selected_insurers.map(code=>offerCell(code,r,i)).join('')}</tr>`).join(''); return `<p class="eyebrow">6. Nabídky v jedné tabulce</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Toto je hlavní pracovní tabulka. Poradce vidí vedle sebe, co bylo poptáno a co nabídla každá pojišťovna.</p><div class="table-wrap"><table><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button><button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button></div>`;}
function offerCell(code,r,i){const k=r.risk_key||riskKey(r);const o=ensureOffer(code);o.risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};const x=o.risks[k];return `<td><select onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].status=this.value"><option ${x.status==='splněno'?'selected':''}>splněno</option><option ${x.status==='omezeno'?'selected':''}>omezeno</option><option ${x.status==='výluka'?'selected':''}>výluka</option><option ${x.status==='nutno ověřit'?'selected':''}>nutno ověřit</option></select><input placeholder="Nabídnutý limit" value="${esc(x.offered_limit)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].offered_limit=this.value"><input placeholder="Spoluúčast" value="${esc(x.deductible)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].deductible=this.value"><textarea placeholder="Výluky / sublimity / zdroj VPP" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].note=this.value">${esc(x.note)}</textarea></td>`}
function tabComparison(){if(!state.selected_insurers.length||!state.risks.length)return `<p class="eyebrow">5. Porovnání</p><h2>Porovnání zatím nelze sestavit</h2><div class="info-box">Nejdříve doplňte rizika, pojišťovny a nabídky.</div>`; const rows=state.risks.map(r=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>${esc(r.requested_limit||'limit neuveden')}</td>${state.selected_insurers.map(code=>{const x=ensureOffer(code).risks[r.risk_key]||{};return `<td><b>${esc(x.status||'nutno ověřit')}</b><br>Limit: ${esc(x.offered_limit||'–')}<br>Spoluúčast: ${esc(x.deductible||'–')}<br>${esc(x.note||'')}</td>`}).join('')}</tr>`).join('');return `<p class="eyebrow">7. Makléřské porovnání</p><h2>Rozdíly mezi nabídkami</h2><div class="warning">Systém pouze zvýrazňuje rozdíly. Doporučení potvrzuje výhradně poradce.</div><div class="table-wrap"><table><thead><tr><th>Riziko / požadavek</th>${state.selected_insurers.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;}
function tabRecommendation(){return `<p class="eyebrow">8. Doporučení poradce</p><h2>Doporučení nevytváří AI automaticky</h2><label>Doporučená varianta<select id="selected_offer"><option value="">Není potvrzeno</option>${state.selected_insurers.map(c=>`<option value="${esc(c)}" ${state.report.client_selected_offer===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Odůvodnění poradce<textarea id="choice_reason">${esc(state.report.client_choice_reason)}</textarea></label><label>Poznámka poradce<textarea id="advisor_note">${esc(state.report.advisor_note)}</textarea></label><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit doporučení</button></div>`}
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

window.openCase=openCase;window.ensureInsurerRequest=ensureInsurerRequest;window.printInsurerRequest=printInsurerRequest;window.exportInsurerRequestExcel=exportInsurerRequestExcel;window.copyInsurerEmail=copyInsurerEmail;window.ensureOffer=ensureOffer;window.toggleInsurer=toggleInsurer;window.addRiskFromSelect=addRiskFromSelect;window.addCustomRisk=addCustomRisk;window.removeRisk=removeRisk;window.addManualInsurer=addManualInsurer;window.saveCase=saveCase;window.loadAres=loadAres;window.searchClients=searchClients;window.useClient=useClient;window.saveAdminCatalog=saveAdminCatalog;window.adminPanel=adminPanel;window.saveAllCatalogJson=saveAllCatalogJson;window.copyTextation=copyTextation;window.addRiskByKey=addRiskByKey;window.addDefaultRisks=addDefaultRisks;
document.addEventListener('DOMContentLoaded',init);
