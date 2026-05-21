const VERSION = '3.0.0';
let CATALOG = {insurers:[], risks:[], riskModel:{}, activities:[]};
let cases = [];
let currentTab = 'client';
let state = blankCase();

function blankCase(){return {id:null,title:'',status:'rozpracováno',adviser:{name:'',email:''},client:{ico:'',name:'',legal_form:'',address:'',contact_person:'',contact_email:'',contact_phone:'',website:''},activity:{code:'',name:''},questionnaire:{turnover:'',employees:'',territory:'',insurance_start:'',insurance_period:'',export_info:''},risks:[],selected_insurers:[],offers:{},documents:[],report:{advisor_note:'',client_selected_offer:'',client_choice_reason:''},audit:[]};}
function $(id){return document.getElementById(id)}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),3200)}
function esc(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function norm(v){return String(v??'').trim()}

async function init(){
  bindNav(); bindButtons();
  await loadCatalog();
  await loadCases();
  newCase(false);
  renderAll();
}

function bindNav(){
  document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{currentTab=b.dataset.tab;renderWorkspace();}));
}
function bindButtons(){
  ['newCaseBtn','newCaseBtn2'].forEach(id=>$(id)?.addEventListener('click',()=>{newCase(true);showView('workspace')}));
  $('saveCaseBtn')?.addEventListener('click',saveCase);
  $('loadCasesBtn')?.addEventListener('click',loadCases);
}
function showView(view){
  document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  $(`${view}View`)?.classList.add('active');
  if(view==='workspace') renderWorkspace();
}

async function loadCatalog(){
  try{const r=await fetch('/api/catalog');CATALOG=await r.json();}
  catch(e){toast('Číselníky se nepodařilo načíst, aplikace běží v lokálním režimu.');}
  CATALOG.insurers ||= []; CATALOG.risks ||= []; CATALOG.activities ||= [];
}
async function loadCases(){
  try{const r=await fetch('/api/inquiries');const data=await r.json();cases=data.items||[];renderAll();toast('Případy načteny.');}
  catch(e){cases=[];toast('Případy se nepodařilo načíst.');}
}
async function openCase(id){
  try{const r=await fetch(`/api/inquiries/${id}`);const data=await r.json();state = normalizeCase(data.item||blankCase());currentTab='client';showView('workspace');renderAll();}
  catch(e){toast('Případ se nepodařilo otevřít.');}
}
async function saveCase(){
  readCurrentTab();
  const titleName = state.client?.name || 'klient';
  state.title = state.title || `Obchodní případ – ${titleName}`;
  try{
    const r=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)});
    const data=await r.json();
    if(data.id) state.id=data.id;
    toast(data.message || 'Případ uložen.');
    await loadCases();
    renderAll();
  }catch(e){toast('Uložení se nepodařilo.');}
}
function newCase(msg=true){state=blankCase();currentTab='client';if(msg) toast('Založen nový pracovní případ.');renderAll();}
function normalizeCase(item){
  const s = Object.assign(blankCase(), item||{});
  s.client = Object.assign(blankCase().client, s.client||{});
  s.adviser = Object.assign(blankCase().adviser, s.adviser||{});
  s.activity = Object.assign(blankCase().activity, s.activity||{});
  s.questionnaire = Object.assign(blankCase().questionnaire, s.questionnaire||{});
  s.risks = Array.isArray(s.risks)?s.risks:[];
  s.selected_insurers = Array.isArray(s.selected_insurers)?s.selected_insurers:[];
  s.offers = (s.offers && typeof s.offers==='object' && !Array.isArray(s.offers))?s.offers:{};
  s.report = Object.assign(blankCase().report, s.report||{});
  s.documents = Array.isArray(s.documents)?s.documents:[];
  return s;
}
function readiness(){let score=0;if(state.client.name)score+=18;if(state.client.ico)score+=8;if(state.activity.name)score+=10;if(state.risks.length)score+=18;if(state.selected_insurers.length)score+=16;if(Object.keys(state.offers||{}).length)score+=16;if(state.report.client_selected_offer)score+=14;return Math.min(100,score)}
function offerCount(){return Object.keys(state.offers||{}).length}
function insurerByCode(code){return (CATALOG.insurers||[]).find(i=>(i.code||i.shortcut||i.zkratka||i.name)===code)||{code,name:code}}
function riskName(r){return r.name||r.label||r.risk_name||r.key||r.risk_key||'Riziko'}
function riskKey(r){return r.key||r.risk_key||riskName(r).toUpperCase().replace(/[^A-Z0-9]+/g,'_')}

function renderAll(){renderHeader();renderDashboard();renderCases();renderWorkspace();renderRiskModel();renderAdmin();}
function renderHeader(){
  const name=state.client?.name||'Není vybrán žádný případ';
  $('stripTitle').textContent=state.id?`#${state.id} – ${name}`:name;
  $('stripMeta').textContent=state.activity?.name?`${state.activity.name} · stav: ${state.status}`:'Založte nebo otevřete obchodní případ.';
  $('caseTitle').textContent=state.client?.name||'Nový obchodní případ';
  $('caseSubtitle').textContent=state.id?`CASE_ID #${state.id} · ${state.activity?.name||'typ činnosti není vyplněn'} · ${state.status}`:'Nový případ zatím není uložen v DB.';
  $('readyScore').textContent=readiness()+'%';
}
function renderDashboard(){
  $('mCases').textContent=cases.length;
  $('mOpen').textContent=cases.filter(c=>!['uzavřeno','zrušeno','archiv'].includes(c.status)).length;
  $('mOffers').textContent=cases.reduce((a,c)=>a+(Number(c.offer_count)||0),0);
  $('mReady').textContent=readiness()+'%';
  $('recentCases').innerHTML = cases.length? cases.slice(0,6).map(caseRow).join('') : 'Zatím nejsou načtené žádné případy.';
}
function renderCases(){ $('casesList').innerHTML = cases.length? cases.map(caseRow).join('') : 'Případy nejsou načtené.'; }
function caseRow(c){return `<div class="case-row"><div><strong>${esc(c.client_name||c.title||'Bez názvu')}</strong><small>CASE_ID #${esc(c.id)} · ${esc(c.activity_name||'bez typu činnosti')} · ${esc(c.status||'rozpracováno')} · nabídky: ${esc(c.offer_count||0)}</small></div><button class="btn primary" onclick="openCase(${Number(c.id)})">Otevřít</button></div>`}
function renderWorkspace(){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab));
  const map={client:tabClient,risks:tabRisks,insurers:tabInsurers,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit};
  $('tabContent').innerHTML = (map[currentTab]||tabClient)();
  renderHeader();
}
function readCurrentTab(){
  if(currentTab==='client'){
    ['ico','name','legal_form','address','contact_person','contact_email','contact_phone','website'].forEach(k=>{const el=$('client_'+k); if(el) state.client[k]=el.value});
    ['name','email'].forEach(k=>{const el=$('adviser_'+k); if(el) state.adviser[k]=el.value});
    ['name','code'].forEach(k=>{const el=$('activity_'+k); if(el) state.activity[k]=el.value});
    ['turnover','employees','territory','insurance_start','insurance_period','export_info'].forEach(k=>{const el=$('q_'+k); if(el) state.questionnaire[k]=el.value});
  }
  if(currentTab==='recommendation'){
    state.report.advisor_note=$('advisor_note')?.value||''; state.report.client_selected_offer=$('selected_offer')?.value||''; state.report.client_choice_reason=$('choice_reason')?.value||'';
  }
}
function tabClient(){
  return `<p class="eyebrow">1. Klient a základ případu</p><h2>Karta klienta je kořen obchodního případu</h2><div class="grid3"><label>Název klienta<input id="client_name" value="${esc(state.client.name)}"></label><label>IČO<input id="client_ico" value="${esc(state.client.ico)}"></label><label>Právní forma<input id="client_legal_form" value="${esc(state.client.legal_form)}"></label></div><label>Adresa<input id="client_address" value="${esc(state.client.address)}"></label><div class="grid3"><label>Kontaktní osoba<input id="client_contact_person" value="${esc(state.client.contact_person)}"></label><label>E-mail<input id="client_contact_email" value="${esc(state.client.contact_email)}"></label><label>Telefon<input id="client_contact_phone" value="${esc(state.client.contact_phone)}"></label></div><div class="grid3"><label>Web<input id="client_website" value="${esc(state.client.website)}"></label><label>Poradce<input id="adviser_name" value="${esc(state.adviser.name)}"></label><label>E-mail poradce<input id="adviser_email" value="${esc(state.adviser.email)}"></label></div><div class="grid3"><label>Typ činnosti<input id="activity_name" value="${esc(state.activity.name)}" placeholder="např. Bezpečnostní agentura"></label><label>Kód činnosti<input id="activity_code" value="${esc(state.activity.code)}"></label><label>Území<input id="q_territory" value="${esc(state.questionnaire.territory)}"></label></div><div class="grid4"><label>Obrat<input id="q_turnover" value="${esc(state.questionnaire.turnover)}"></label><label>Zaměstnanci<input id="q_employees" value="${esc(state.questionnaire.employees)}"></label><label>Počátek pojištění<input id="q_insurance_start" value="${esc(state.questionnaire.insurance_start)}"></label><label>Pojistné období<input id="q_insurance_period" value="${esc(state.questionnaire.insurance_period)}"></label></div><label>Export / zahraničí / poznámka<input id="q_export_info" value="${esc(state.questionnaire.export_info)}"></label><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit případ</button><button class="btn secondary" onclick="readCurrentTab();currentTab='risks';renderWorkspace()">Pokračovat na rizika</button></div>`;
}
function tabRisks(){
  const options=(CATALOG.risks||[]).map(r=>`<option value="${esc(riskKey(r))}">${esc(riskName(r))}</option>`).join('');
  return `<p class="eyebrow">2. Rizika a požadavky klienta</p><h2>Co klient požaduje</h2><p class="muted">Každý řádek musí mít risk_key. Z těchto požadavků se generuje tabulka nabídek i porovnání.</p><div class="tools"><select id="addRiskSelect"><option value="">Vyberte riziko z knihovny</option>${options}</select><button class="btn primary" onclick="addRiskFromSelect()">+ Přidat riziko</button><button class="btn secondary" onclick="addCustomRisk()">+ Vlastní riziko</button></div><div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název rizika</th><th>Požadovaný limit</th><th>Spoluúčast</th><th>Poznámka</th><th></th></tr></thead><tbody>${state.risks.map((r,i)=>`<tr><td><input onchange="state.risks[${i}].risk_key=this.value" value="${esc(r.risk_key||r.key)}"></td><td><input onchange="state.risks[${i}].name=this.value" value="${esc(r.name||r.label)}"></td><td><input onchange="state.risks[${i}].requested_limit=this.value" value="${esc(r.requested_limit||r.limit)}"></td><td><input onchange="state.risks[${i}].deductible=this.value" value="${esc(r.deductible||'')}"></td><td><input onchange="state.risks[${i}].note=this.value" value="${esc(r.note||'')}"></td><td><button class="btn danger" onclick="removeRisk(${i})">Smazat</button></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="currentTab='insurers';renderWorkspace()">Pokračovat na pojišťovny</button></div>`;
}
function addRiskFromSelect(){const key=$('addRiskSelect').value;if(!key)return;const r=(CATALOG.risks||[]).find(x=>riskKey(x)===key)||{};state.risks.push({risk_key:key,name:riskName(r),requested_limit:'',deductible:'',note:''});renderWorkspace();}
function addCustomRisk(){state.risks.push({risk_key:'CUSTOM_'+(state.risks.length+1),name:'Vlastní riziko',requested_limit:'',deductible:'',note:''});renderWorkspace();}
function removeRisk(i){state.risks.splice(i,1);renderWorkspace();}
function tabInsurers(){
  const list=(CATALOG.insurers||[]).map(ins=>{const code=ins.code||ins.shortcut||ins.zkratka||ins.name;const checked=state.selected_insurers.includes(code)?'checked':'';return `<label class="form-card"><input type="checkbox" ${checked} onchange="toggleInsurer('${esc(code)}',this.checked)"> <b>${esc(code)}</b><br>${esc(ins.name||code)}<br><span class="muted">${esc(ins.email||ins.request_email||'e-mail není doplněn')}</span></label>`}).join('');
  return `<p class="eyebrow">3. Pojišťovny v poptávce</p><h2>Komu se bude poptávka posílat</h2><div class="grid3">${list||'<div class="empty">V číselníku nejsou pojišťovny.</div>'}</div><div class="tools"><button class="btn secondary" onclick="addManualInsurer()">+ Pojišťovna mimo seznam</button><button class="btn primary" onclick="currentTab='offers';renderWorkspace()">Pokračovat na nabídky</button></div>`;
}
function toggleInsurer(code,on){if(on&&!state.selected_insurers.includes(code))state.selected_insurers.push(code); if(!on)state.selected_insurers=state.selected_insurers.filter(x=>x!==code);renderHeader();}
function addManualInsurer(){const code=prompt('Zkratka pojišťovny mimo seznam:'); if(code && !state.selected_insurers.includes(code)){state.selected_insurers.push(code);renderWorkspace();}}
function ensureOffer(code){state.offers[code] ||= {premium:'',deductible:'',valid_until:'',note:'',risks:{}}; return state.offers[code];}
function tabOffers(){
  if(!state.selected_insurers.length) return `<p class="eyebrow">4. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven v kroku 3.</div>`;
  if(!state.risks.length) return `<p class="eyebrow">4. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v kroku 2.</div>`;
  const heads=state.selected_insurers.map(code=>`<th class="offer-head">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div><input placeholder="Pojistné" onchange="ensureOffer('${esc(code)}').premium=this.value" value="${esc(ensureOffer(code).premium)}"><input placeholder="Platnost nabídky" onchange="ensureOffer('${esc(code)}').valid_until=this.value" value="${esc(ensureOffer(code).valid_until)}"></th>`).join('');
  const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br><span class="badge">${esc(r.risk_key)}</span><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||'není uvedena')}</td>${state.selected_insurers.map(code=>offerCell(code,r,i)).join('')}</tr>`).join('');
  return `<p class="eyebrow">4. Nabídky v jedné tabulce</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Toto je hlavní pracovní tabulka. Poradce vidí vedle sebe, co bylo poptáno a co nabídla každá pojišťovna.</p><div class="table-wrap"><table><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button><button class="btn secondary" onclick="saveCase()">Uložit nabídky</button></div>`;
}
function offerCell(code,r,i){const k=r.risk_key||riskKey(r);const o=ensureOffer(code);o.risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};const x=o.risks[k];return `<td><select onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].status=this.value"><option ${x.status==='splněno'?'selected':''}>splněno</option><option ${x.status==='omezeno'?'selected':''}>omezeno</option><option ${x.status==='výluka'?'selected':''}>výluka</option><option ${x.status==='nutno ověřit'?'selected':''}>nutno ověřit</option></select><input placeholder="Nabídnutý limit" value="${esc(x.offered_limit)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].offered_limit=this.value"><input placeholder="Spoluúčast" value="${esc(x.deductible)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].deductible=this.value"><textarea placeholder="Výluky / sublimity / zdroj VPP" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].note=this.value">${esc(x.note)}</textarea></td>`}
function tabComparison(){
  if(!state.selected_insurers.length||!state.risks.length) return `<p class="eyebrow">5. Porovnání</p><h2>Porovnání zatím nelze sestavit</h2><div class="info-box">Nejdříve doplňte rizika, pojišťovny a nabídky.</div>`;
  const rows=state.risks.map(r=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>${esc(r.requested_limit||'limit neuveden')}</td>${state.selected_insurers.map(code=>{const x=ensureOffer(code).risks[r.risk_key]||{};return `<td><b>${esc(x.status||'nutno ověřit')}</b><br>Limit: ${esc(x.offered_limit||'–')}<br>${esc(x.note||'')}</td>`}).join('')}</tr>`).join('');
  return `<p class="eyebrow">5. Makléřské porovnání</p><h2>Rozdíly mezi nabídkami</h2><div class="warning">Systém pouze zvýrazňuje rozdíly. Doporučení potvrzuje výhradně poradce.</div><div class="table-wrap"><table><thead><tr><th>Riziko / požadavek</th>${state.selected_insurers.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function tabRecommendation(){return `<p class="eyebrow">6. Doporučení poradce</p><h2>Doporučení nevytváří AI automaticky</h2><label>Doporučená varianta<select id="selected_offer"><option value="">Není potvrzeno</option>${state.selected_insurers.map(c=>`<option value="${esc(c)}" ${state.report.client_selected_offer===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Odůvodnění poradce<textarea id="choice_reason">${esc(state.report.client_choice_reason)}</textarea></label><label>Poznámka poradce<textarea id="advisor_note">${esc(state.report.advisor_note)}</textarea></label><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit doporučení</button></div>`}
function tabOutput(){return `<p class="eyebrow">7. Klientský výstup</p><h2>Podklad pro klientský report</h2><div class="info-box"><b>Klient:</b> ${esc(state.client.name||'není vyplněn')}<br><b>Doporučení poradce:</b> ${esc(state.report.client_selected_offer||'není potvrzeno')}<br><b>Počet nabídek:</b> ${offerCount()}<br><b>Počet rizik:</b> ${state.risks.length}</div><p class="muted">PDF engine bude navázán v další fázi nad tímto jediným zdrojem dat.</p>`}
function tabAudit(){const warnings=[];if(!state.client.name)warnings.push('Chybí klient.');if(!state.risks.length)warnings.push('Chybí rizika.');if(!state.selected_insurers.length)warnings.push('Nejsou vybrány pojišťovny.');if(!offerCount())warnings.push('Nejsou vloženy nabídky.');if(!state.report.client_selected_offer)warnings.push('Není potvrzeno doporučení poradce.');return `<p class="eyebrow">8. Kontrola případu</p><h2>Provozní kontrola</h2>${warnings.length?warnings.map(w=>`<div class="warning">${esc(w)}</div>`).join(''):'<div class="info-box">Případ je provozně kompletní.</div>'}`}
function renderRiskModel(){const risks=CATALOG.risks||[];$('riskModelBox').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název</th></tr></thead><tbody>${risks.map(r=>`<tr><td><b>${esc(riskKey(r))}</b></td><td>${esc(riskName(r))}</td></tr>`).join('')}</tbody></table></div>`}
function renderAdmin(){const ins=CATALOG.insurers||[];$('adminBox').innerHTML=`<h2>Pojišťovny v číselníku</h2><div class="table-wrap"><table><thead><tr><th>Zkratka</th><th>Název</th><th>E-mail</th></tr></thead><tbody>${ins.map(i=>`<tr><td>${esc(i.code||i.shortcut||i.zkratka||'')}</td><td>${esc(i.name||'')}</td><td>${esc(i.email||i.request_email||'')}</td></tr>`).join('')}</tbody></table></div>`}

window.openCase=openCase;window.ensureOffer=ensureOffer;window.toggleInsurer=toggleInsurer;window.addRiskFromSelect=addRiskFromSelect;window.addCustomRisk=addCustomRisk;window.removeRisk=removeRisk;window.addManualInsurer=addManualInsurer;window.saveCase=saveCase;
document.addEventListener('DOMContentLoaded',init);
