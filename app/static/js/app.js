const VERSION = '3.0.2';
let CATALOG = {insurers:[], risks:[], riskModel:[], activities:[], textTemplates:[]};
let cases = [];
let clients = [];
let currentTab = 'client';
let state = blankCase();

function blankCase(){return {id:null,title:'',status:'rozpracováno',adviser:{name:'Administrátor ASTORIE',email:'admin@astorie.local'},client:{ico:'',name:'',legal_form:'',address:'',data_box:'',contact_person:'',contact_email:'',contact_phone:'',website:''},activity:{code:'',name:''},questionnaire:{turnover:'',employees:'',territory:'Česká republika',insurance_start:'',insurance_period:'1 rok',export_info:''},risks:[],selected_insurers:[],offers:{},documents:[],report:{advisor_note:'',client_selected_offer:'',client_choice_reason:''},audit:[]};}
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
  CATALOG.textTemplates = asArray(CATALOG.textTemplates);
}
function activityOptions(){return (CATALOG.activities||[]).map(a=>`<option value="${esc(a.name||a.activity_name||'')}" data-code="${esc(a.code||a.id||a.activity_code||'')}">${esc(a.name||a.activity_name||a.code||'')}</option>`).join('')}
function riskOptions(){return (CATALOG.risks||[]).map(r=>`<option value="${esc(riskKey(r))}">${esc(r.group?`${r.group} – `:'')}${esc(riskName(r))}</option>`).join('')}
function riskByKey(key){return (CATALOG.risks||[]).find(x=>riskKey(x)===key)||{};}
function caseInsuranceCard(){
  return `<div class="section-soft"><p class="eyebrow">Karta pro pojištění</p><h3>Údaje pro poptávku a pojišťovny</h3><div class="grid3"><label>Typ činnosti<input id="activity_name" list="activityList" value="${esc(state.activity.name)}" placeholder="např. Bezpečnostní agentura"><datalist id="activityList">${activityOptions()}</datalist></label><label>Kód činnosti<input id="activity_code" value="${esc(state.activity.code)}"></label><label>Území<input id="q_territory" value="${esc(state.questionnaire.territory)}"></label></div><div class="grid4"><label>Obrat<input id="q_turnover" value="${esc(state.questionnaire.turnover)}" placeholder="např. 10 000 000 Kč"></label><label>Zaměstnanci<input id="q_employees" value="${esc(state.questionnaire.employees)}"></label><label>Počátek pojištění<input id="q_insurance_start" type="date" value="${esc(state.questionnaire.insurance_start)}"></label><label>Pojistné období<input id="q_insurance_period" value="${esc(state.questionnaire.insurance_period)}"></label></div><label>Export / zahraničí / specifická poznámka<input id="q_export_info" value="${esc(state.questionnaire.export_info)}"></label><div class="info-box">Přílohy a dokumenty z původního formuláře zůstanou navázané v části Dokumenty. V další fázi se doplní členění podle druhu pojištění.</div></div>`;
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
  const s=Object.assign(blankCase(),item||{}); s.client=Object.assign(blankCase().client,s.client||{}); s.adviser=Object.assign(blankCase().adviser,s.adviser||{}); s.activity=Object.assign(blankCase().activity,s.activity||{}); s.questionnaire=Object.assign(blankCase().questionnaire,s.questionnaire||{}); s.risks=Array.isArray(s.risks)?s.risks:[]; s.selected_insurers=Array.isArray(s.selected_insurers)?s.selected_insurers:[]; s.offers=(s.offers&&typeof s.offers==='object'&&!Array.isArray(s.offers))?s.offers:{}; s.report=Object.assign(blankCase().report,s.report||{}); s.documents=Array.isArray(s.documents)?s.documents:[]; return s;
}
function readiness(){let score=0;if(state.client.name)score+=18;if(state.client.ico)score+=8;if(state.activity.name)score+=10;if(state.risks.length)score+=18;if(state.selected_insurers.length)score+=16;if(Object.keys(state.offers||{}).length)score+=16;if(state.report.client_selected_offer)score+=14;return Math.min(100,score)}
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
function renderWorkspace(){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab)); const map={client:tabClient,risks:tabRisks,insurers:tabInsurers,offers:tabOffers,comparison:tabComparison,recommendation:tabRecommendation,output:tabOutput,audit:tabAudit}; $('tabContent').innerHTML=(map[currentTab]||tabClient)(); renderHeader();}
function readCurrentTab(){
  if(currentTab==='client'){['ico','name','legal_form','address','data_box','contact_person','contact_email','contact_phone','website'].forEach(k=>{const el=$('client_'+k); if(el) state.client[k]=el.value}); ['name','email'].forEach(k=>{const el=$('adviser_'+k); if(el) state.adviser[k]=el.value}); ['name','code'].forEach(k=>{const el=$('activity_'+k); if(el) state.activity[k]=el.value}); ['turnover','employees','territory','insurance_start','insurance_period','export_info'].forEach(k=>{const el=$('q_'+k); if(el) state.questionnaire[k]=el.value});}
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
  return `<p class="eyebrow">1. Klient a základ případu</p><h2>Karta klienta</h2><p class="muted">Karta klienta obsahuje identifikační a kontaktní údaje. Údaje pro pojištění jsou oddělené níže, aby se nemíchala evidence klienta s odborným dotazníkem.</p><div class="tools"><input id="clientSearch" class="grow" placeholder="Vyhledat klienta v DB podle názvu nebo IČO"><button class="btn secondary" onclick="searchClients()">Načíst klienta z DB</button></div>${clientRows}<div class="section-soft"><p class="eyebrow">Identifikace klienta</p><div class="grid3"><label>Název klienta<input id="client_name" value="${esc(state.client.name)}"></label><label>IČO<div class="inline-field"><input id="client_ico" value="${esc(state.client.ico)}"><button class="btn secondary small" onclick="loadAres()">ARES</button></div></label><label>Právní forma<input id="client_legal_form" value="${esc(state.client.legal_form)}"></label></div><label>Adresa<input id="client_address" value="${esc(state.client.address)}"></label><div class="grid4"><label>Datová schránka<input id="client_data_box" value="${esc(state.client.data_box)}"></label><label>Kontaktní osoba<input id="client_contact_person" value="${esc(state.client.contact_person)}"></label><label>E-mail<input id="client_contact_email" value="${esc(state.client.contact_email)}"></label><label>Telefon<input id="client_contact_phone" value="${esc(state.client.contact_phone)}"></label></div><div class="grid3"><label>Web<input id="client_website" value="${esc(state.client.website)}"></label><label>Poradce<input id="adviser_name" value="${esc(state.adviser.name)}"></label><label>E-mail poradce<input id="adviser_email" value="${esc(state.adviser.email)}"></label></div></div>${caseInsuranceCard()}<div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit případ</button><button class="btn secondary" onclick="readCurrentTab();currentTab='risks';renderWorkspace()">Pokračovat na rizika</button></div>`;
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
function tabInsurers(){const list=(CATALOG.insurers||[]).map(ins=>{const code=insurerCode(ins);const checked=state.selected_insurers.includes(code)?'checked':'';return `<label class="form-card check-card"><input type="checkbox" ${checked} onchange="toggleInsurer('${esc(code)}',this.checked)"> <b>${esc(code)}</b><br>${esc(ins.name||code)}<br><span class="muted">${esc(ins.email||ins.request_email||'e-mail není doplněn')}</span></label>`}).join(''); return `<p class="eyebrow">3. Pojišťovny v poptávce</p><h2>Komu se bude poptávka posílat</h2><div class="grid3">${list||'<div class="empty">V číselníku nejsou pojišťovny.</div>'}</div><div class="tools"><button class="btn secondary" onclick="addManualInsurer()">+ Pojišťovna mimo seznam</button><button class="btn primary" onclick="currentTab='offers';renderWorkspace()">Pokračovat na nabídky</button></div>`;}
function toggleInsurer(code,on){if(on&&!state.selected_insurers.includes(code))state.selected_insurers.push(code); if(!on)state.selected_insurers=state.selected_insurers.filter(x=>x!==code);renderHeader();}
function addManualInsurer(){const code=prompt('Zkratka pojišťovny mimo seznam:'); if(code&&!state.selected_insurers.includes(code)){state.selected_insurers.push(code);renderWorkspace();}}
function ensureOffer(code){state.offers[code] ||= {premium:'',deductible:'',valid_until:'',note:'',risks:{}}; return state.offers[code];}
function tabOffers(){if(!state.selected_insurers.length)return `<p class="eyebrow">4. Nabídky</p><h2>Nejdříve vyberte pojišťovny</h2><div class="info-box">Nabídky se zobrazí v jedné společné tabulce až po výběru pojišťoven v kroku 3.</div>`; if(!state.risks.length)return `<p class="eyebrow">4. Nabídky</p><h2>Nejdříve vyplňte rizika</h2><div class="info-box">Tabulka nabídek musí vycházet z požadavků klienta. Doplňte rizika v kroku 2.</div>`; const heads=state.selected_insurers.map(code=>`<th class="offer-head">${esc(insurerByCode(code).name||code)}<div class="mini">${esc(code)}</div><input placeholder="Pojistné" onchange="ensureOffer('${esc(code)}').premium=this.value" value="${esc(ensureOffer(code).premium)}"><input placeholder="Platnost nabídky" onchange="ensureOffer('${esc(code)}').valid_until=this.value" value="${esc(ensureOffer(code).valid_until)}"><input placeholder="Celková spoluúčast / pozn." onchange="ensureOffer('${esc(code)}').deductible=this.value" value="${esc(ensureOffer(code).deductible)}"></th>`).join(''); const rows=state.risks.map((r,i)=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br><span class="badge">${esc(r.risk_key)}</span><br>Požadavek: ${esc(r.requested_limit||'není uveden')}<br>Spoluúčast: ${esc(r.deductible||'není uvedena')}</td>${state.selected_insurers.map(code=>offerCell(code,r,i)).join('')}</tr>`).join(''); return `<p class="eyebrow">4. Nabídky v jedné tabulce</p><h2>Požadavek klienta × nabídky pojišťoven</h2><p class="muted">Toto je hlavní pracovní tabulka. Poradce vidí vedle sebe, co bylo poptáno a co nabídla každá pojišťovna.</p><div class="table-wrap"><table><thead><tr><th>Požadavek klienta</th>${heads}</tr></thead><tbody>${rows}</tbody></table></div><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit nabídky</button><button class="btn secondary" onclick="currentTab='comparison';renderWorkspace()">Přejít na porovnání</button></div>`;}
function offerCell(code,r,i){const k=r.risk_key||riskKey(r);const o=ensureOffer(code);o.risks[k] ||= {status:'nutno ověřit',offered_limit:'',deductible:'',exclusions:'',sublimits:'',source_reference:'',note:''};const x=o.risks[k];return `<td><select onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].status=this.value"><option ${x.status==='splněno'?'selected':''}>splněno</option><option ${x.status==='omezeno'?'selected':''}>omezeno</option><option ${x.status==='výluka'?'selected':''}>výluka</option><option ${x.status==='nutno ověřit'?'selected':''}>nutno ověřit</option></select><input placeholder="Nabídnutý limit" value="${esc(x.offered_limit)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].offered_limit=this.value"><input placeholder="Spoluúčast" value="${esc(x.deductible)}" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].deductible=this.value"><textarea placeholder="Výluky / sublimity / zdroj VPP" onchange="ensureOffer('${esc(code)}').risks['${esc(k)}'].note=this.value">${esc(x.note)}</textarea></td>`}
function tabComparison(){if(!state.selected_insurers.length||!state.risks.length)return `<p class="eyebrow">5. Porovnání</p><h2>Porovnání zatím nelze sestavit</h2><div class="info-box">Nejdříve doplňte rizika, pojišťovny a nabídky.</div>`; const rows=state.risks.map(r=>`<tr><td class="risk-request"><b>${esc(r.name)}</b><br>${esc(r.requested_limit||'limit neuveden')}</td>${state.selected_insurers.map(code=>{const x=ensureOffer(code).risks[r.risk_key]||{};return `<td><b>${esc(x.status||'nutno ověřit')}</b><br>Limit: ${esc(x.offered_limit||'–')}<br>Spoluúčast: ${esc(x.deductible||'–')}<br>${esc(x.note||'')}</td>`}).join('')}</tr>`).join('');return `<p class="eyebrow">5. Makléřské porovnání</p><h2>Rozdíly mezi nabídkami</h2><div class="warning">Systém pouze zvýrazňuje rozdíly. Doporučení potvrzuje výhradně poradce.</div><div class="table-wrap"><table><thead><tr><th>Riziko / požadavek</th>${state.selected_insurers.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;}
function tabRecommendation(){return `<p class="eyebrow">6. Doporučení poradce</p><h2>Doporučení nevytváří AI automaticky</h2><label>Doporučená varianta<select id="selected_offer"><option value="">Není potvrzeno</option>${state.selected_insurers.map(c=>`<option value="${esc(c)}" ${state.report.client_selected_offer===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Odůvodnění poradce<textarea id="choice_reason">${esc(state.report.client_choice_reason)}</textarea></label><label>Poznámka poradce<textarea id="advisor_note">${esc(state.report.advisor_note)}</textarea></label><div class="tools"><button class="btn primary" onclick="readCurrentTab();saveCase()">Uložit doporučení</button></div>`}
function tabOutput(){return `<p class="eyebrow">7. Klientský výstup</p><h2>Podklad pro klientský report</h2><div class="info-box"><b>Klient:</b> ${esc(state.client.name||'není vyplněn')}<br><b>Doporučení poradce:</b> ${esc(state.report.client_selected_offer||'není potvrzeno')}<br><b>Počet nabídek:</b> ${offerCount()}<br><b>Počet rizik:</b> ${state.risks.length}</div><p class="muted">PDF engine bude navázán v další fázi nad tímto jediným zdrojem dat.</p>`}
function tabAudit(){const warnings=[];if(!state.client.name)warnings.push('Chybí klient.');if(!state.risks.length)warnings.push('Chybí rizika.');if(!state.selected_insurers.length)warnings.push('Nejsou vybrány pojišťovny.');if(!offerCount())warnings.push('Nejsou vloženy nabídky.');if(!state.report.client_selected_offer)warnings.push('Není potvrzeno doporučení poradce.');return `<p class="eyebrow">8. Kontrola případu</p><h2>Provozní kontrola</h2>${warnings.length?warnings.map(w=>`<div class="warning">${esc(w)}</div>`).join(''):'<div class="info-box">Případ je provozně kompletní.</div>'}`}
function renderRiskModel(){const risks=CATALOG.risks||[];$('riskModelBox').innerHTML=`<div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název</th></tr></thead><tbody>${risks.map(r=>`<tr><td><b>${esc(riskKey(r))}</b></td><td>${esc(riskName(r))}</td></tr>`).join('')}</tbody></table></div>`}
function renderAdmin(){
  const ins=CATALOG.insurers||[]; const risks=CATALOG.risks||[]; const acts=CATALOG.activities||[];
  $('adminBox').innerHTML=`<div class="metric-grid"><div><b>${ins.length}</b><span>pojišťoven</span></div><div><b>${risks.length}</b><span>rizik</span></div><div><b>${acts.length}</b><span>činností</span></div><div><b>${cases.length}</b><span>případů</span></div></div><div class="admin-tabs"><button class="chip active" onclick="adminPanel('insurers')">Pojišťovny</button><button class="chip" onclick="adminPanel('risks')">Rizika</button><button class="chip" onclick="adminPanel('activities')">Typy činností</button><button class="chip" onclick="adminPanel('texts')">Textace</button><button class="chip" onclick="adminPanel('json')">Import / export JSON</button></div><div id="adminPanel"></div>`;
  adminPanel('insurers');
}
function adminPanel(type){
  document.querySelectorAll('.admin-tabs .chip').forEach(b=>b.classList.toggle('active', (b.textContent||'').toLowerCase().includes(type==='insurers'?'pojišť':type==='risks'?'rizika':type==='activities'?'činnost':type==='texts'?'textace':'json')));
  const box=$('adminPanel'); if(!box) return;
  if(type==='insurers') box.innerHTML=`<h2>Pojišťovny v číselníku</h2><p class="muted">Provozní editace bez zásahu do DB struktury.</p><div class="table-wrap"><table><thead><tr><th>Zkratka</th><th>Název</th><th>E-mail pro poptávky</th><th>Portál</th></tr></thead><tbody>${(CATALOG.insurers||[]).map((i,idx)=>`<tr><td><input onchange="CATALOG.insurers[${idx}].code=this.value" value="${esc(insurerCode(i)||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].name=this.value" value="${esc(i.name||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].email=this.value" value="${esc(i.email||i.request_email||'')}"></td><td><input onchange="CATALOG.insurers[${idx}].portal=this.value" value="${esc(i.portal||i.url||'')}"></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.insurers.push({code:'',name:'',email:'',portal:'',active:true});adminPanel('insurers')">+ Přidat pojišťovnu</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='risks') box.innerHTML=`<h2>Knihovna rizik</h2><div class="table-wrap"><table><thead><tr><th>Risk key</th><th>Název</th><th>Skupina</th><th>Výchozí limit</th></tr></thead><tbody>${(CATALOG.risks||[]).map((r,idx)=>`<tr><td><input onchange="CATALOG.risks[${idx}].risk_key=this.value" value="${esc(riskKey(r))}"></td><td><input onchange="CATALOG.risks[${idx}].name=this.value" value="${esc(riskName(r))}"></td><td><input onchange="CATALOG.risks[${idx}].group=this.value" value="${esc(r.group||'')}"></td><td><input onchange="CATALOG.risks[${idx}].limit=this.value" value="${esc(r.limit||'')}"></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.risks.push({risk_key:'',name:'',group:'',limit:''});adminPanel('risks')">+ Přidat riziko</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='activities') box.innerHTML=`<h2>Typy klientů / činností</h2><div class="table-wrap"><table><thead><tr><th>Kód</th><th>Název</th></tr></thead><tbody>${(CATALOG.activities||[]).map((a,idx)=>`<tr><td><input onchange="CATALOG.activities[${idx}].code=this.value" value="${esc(a.code||a.id||a.activity_code||'')}"></td><td><input onchange="CATALOG.activities[${idx}].name=this.value" value="${esc(a.name||a.activity_name||'')}"></td></tr>`).join('')}</tbody></table></div><div class="tools"><button class="btn secondary" onclick="CATALOG.activities.push({code:'',name:''});adminPanel('activities')">+ Přidat činnost</button><button class="btn primary" onclick="saveAdminCatalog()">Uložit admin</button></div>`;
  if(type==='texts') box.innerHTML=renderTextationAdmin();
  if(type==='json') box.innerHTML=`<h2>Import / export číselníků</h2><label>Kompletní katalog JSON<textarea id="adminAllJson" class="codearea">${esc(JSON.stringify(CATALOG,null,2))}</textarea></label><div class="tools"><button class="btn primary" onclick="saveAllCatalogJson()">Uložit celý katalog</button></div>`;
}
async function saveAdminCatalog(){
  try{
    normalizeCatalog();
    const payload={insurers:CATALOG.insurers, risks:CATALOG.risks, activities:CATALOG.activities, riskModel:CATALOG.riskModel, textTemplates:CATALOG.textTemplates, actor_email:state.adviser.email||''};
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
  const grouped=['centrální','moje','návrh ke schválení'];
  return `<p class="eyebrow">Textace</p><h1>Textace a šablony</h1><p class="muted">Funkční pracovní knihovna textací. Nové textace se spravují v Adminu a jsou připravené pro klientský výstup.</p><div class="tools"><button class="btn primary" onclick="showView('admin');adminPanel('texts')">Spravovat textace v Adminu</button></div>${grouped.map(g=>`<div class="section-soft"><h2>${esc(g.charAt(0).toUpperCase()+g.slice(1))}</h2>${(CATALOG.textTemplates||[]).map((t,idx)=>({t,idx})).filter(x=>(x.t.type||'centrální')===g).map(x=>`<div class="form-card"><b>${esc(x.t.title)}</b><small>${esc(x.t.area||'')}</small><p>${esc(x.t.text||'')}</p><button class="btn secondary" onclick="copyTextation(${x.idx})">Kopírovat</button></div>`).join('')||'<div class="empty">Zatím nejsou žádné položky.</div>'}</div>`).join('')}`;
}
window.openCase=openCase;window.ensureOffer=ensureOffer;window.toggleInsurer=toggleInsurer;window.addRiskFromSelect=addRiskFromSelect;window.addCustomRisk=addCustomRisk;window.removeRisk=removeRisk;window.addManualInsurer=addManualInsurer;window.saveCase=saveCase;window.loadAres=loadAres;window.searchClients=searchClients;window.useClient=useClient;window.saveAdminCatalog=saveAdminCatalog;window.adminPanel=adminPanel;window.saveAllCatalogJson=saveAllCatalogJson;window.copyTextation=copyTextation;window.addRiskByKey=addRiskByKey;window.addDefaultRisks=addDefaultRisks;
document.addEventListener('DOMContentLoaded',init);
