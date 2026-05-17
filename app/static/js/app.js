let CATALOG = null;
let state = {
  id:null,
  adviser:{}, client:{}, questionnaire:{}, activity:null,
  extended_client:{}, insurance_settings:{}, insured_persons:[], liability_params:[], special_clauses:[],
  risks:[], selected_insurers:[], additional_requirements:[], offers:{}, ai_imports:[],
  title:"", status:"rozpracováno", comparison_strategy:"bezpecnost", report:{advisor_note:"", client_selected_offer:"", client_choice_reason:""}
};
let currentRiskIndex = null;
let currentUser = null;
let currentAdminDetail = null;

const DEFAULT_LIABILITY_PARAMS = [
  {
    "subject": "Obecná (provozní) odpovědnosti za újmu  (škodu)",
    "limit": "1 000 000 Kč",
    "sublimit": "společný limit na smlouvě pro odpovědnost z činnosti, odp. za výrobek a stažení výrobku z trhu",
    "deductible": "10 000 Kč",
    "note": "2 x ročně"
  },
  {
    "subject": "Pojištění odpovědnosti za újmu (škodu) způsobenou vadou výrobku a vadou práce po předání",
    "limit": "1 000 000 Kč",
    "sublimit": "sublimit z celkového limitu",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Následná finanční škoda - včetně škod způsobených vadou výrobku a vadou práce po předání",
    "limit": "1 000 000 Kč",
    "sublimit": "sublimit z celkového limitu",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Čisté finanční škody - včetně škod způsobených vadou výrobku a vadou práce po předání",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Nemajetková újma neoprávněným zásahem do práva na ochranu osobnosti (psychická újma)",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Škoda na užívané nemovitostti",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Cizí věci převzaté a Majetková újma v souvislostí s vykonávanou objednanou činností",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Cizí věci užívané movité",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Regresy zdravotní pojišťovny a regresy dávek nemocenského pojištění - zaměstnanci",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Regresy zdravotní pojišťovny a regresy dávek nemocenského pojištění - třetí osoby",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Znečištění životního prostředí",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Regres pojišťovny POV v případě, že řidič pojištěného požil aplkohol, nebo se odmítl podrobit dechové zkoušce, nebo odjel z místa nehody",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Odpojednost za škody způsobené při nakládce a vykládce",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Odpovědnost za škodu na věci odložené a vnesené",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Odpovědnost obchodní korporace za újmu členům statutárních orgánů v souvislosti s výkonem jejich funkce",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Odpovědnosti členů statutárních orgánů za jinou než čistou finanční škodu způsobenou organizaci",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Škody na věcech zaměstnanců",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Křížová odpovědnost mezi spolupojištěnými",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Odpovědnost za škodu způsobenou majetkově propojené osobě",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Škoda způsobená vadně vyrobeným strojem pjištěného",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Náhrada smluvní pokuty  do výše skutečné škody",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Pokuty a penále",
    "limit": "",
    "sublimit": "",
    "deductible": "",
    "note": ""
  },
  {
    "subject": "Čistá finanční škoda v souvislostí s poskytnutím rady",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Újma způsobená motorovými vozidly nad rámec POV",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Újma vzniklá na oprávněně užívaném dopravním prostředku a vozidle",
    "limit": "500 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1 x ročně"
  },
  {
    "subject": "Stažení výrobku z trhu organizované první stranou",
    "limit": "1 000 000 Kč",
    "sublimit": "v rámci celkového limitu PS",
    "deductible": "100 000 Kč",
    "note": "1xročně"
  },
  {
    "subject": "Stažení výrobku z trhu organizované třetí stranou",
    "limit": "1 000 000 Kč",
    "sublimit": "v rámci celkového limitu PS",
    "deductible": "100 000 Kč",
    "note": "1xročně"
  },
  {
    "subject": "Spojení nebo smísení vadného výrobku s jinou bezvadnou věcí",
    "limit": "1 000 000 Kč",
    "sublimit": "v rámci celkového limitu PS",
    "deductible": "100 000 Kč",
    "note": "1xročně"
  },
  {
    "subject": "Náklady na demontáž vadného výrobku a montáž bezvadného výrobku",
    "limit": "1 000 000 Kč",
    "sublimit": "v rámci celkového limitu PS",
    "deductible": "100 000 Kč",
    "note": "1xročně"
  },
  {
    "subject": "Škoda vzniklá dalším opracováním vadného výrobku dodaného pojištěným, aniž došlo k jeho spojení či smísení, nebo montáží s dalšími výrobky.",
    "limit": "1 000 000 Kč",
    "sublimit": "sublimit",
    "deductible": "100 000 Kč",
    "note": "1xročně"
  },
  {
    "subject": "Náklady na kontrolu, zkoušení a třídění vadných výrobků",
    "limit": "100 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1xročně"
  },
  {
    "subject": "Náklady  na reklamaci u zákazníka pojištěného",
    "limit": "100 000 Kč",
    "sublimit": "sublimit",
    "deductible": "10 000 Kč",
    "note": "1xročně"
  }
];
const DEFAULT_SPECIAL_CLAUSES = [
  {
    "name": "Věci převzaté a užívané:",
    "text": "Pojištění se vztahuje i na následnou finanční újmu vyplývající z poškození veci převzaté nebo užívané.  Pojištění se nevztahuje na újmu vzniklou ztrátou věci.",
    "note": "",
    "include": false
  },
  {
    "name": "Újma vzniklá na oprávněně užívaném dopravním prostředku a vozidle",
    "text": "Pojištění se vztahuje na újmu vzniklou na oprávněně užívaném dopravním prostředku. Pojištění se nevztahuje na škody na vozidle, které nemá sjednáno havarijní pojištění. Pojištění se dále nevztahuje na odpovědnost za škodu vzniklou na pneumatikách, discích a kolových šroubech nebo přepravovaných věcech. Pro škodu na vozidle pojistitel poskytne pojistné plnění jen v případě, že událost bude šetřena policií.",
    "note": "",
    "include": false
  },
  {
    "name": "Majetková újma v souvislostí s vykonávanou objednanou činností",
    "text": "Pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému majetkovou újmu vzniklou na věci, na které pojištěný vykonával objednanou činnost, pokud k poškození nebo zničení věci došlo tím, že objednaná činnost byla provedena vadně. Pojištění se vztahuje i na následnou finanční újmu z toho vyplývající.",
    "note": "",
    "include": false
  },
  {
    "name": "Přirozená práva člověka",
    "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému újmu vzniklou na přirozených právech člověka případně i způsobené duševní útrapy, nesouvisející s újmou při ublížení na zdraví a při usmrcení. Pojistné plnění bude poskytnuto pouze na základě pravomocného rozhodnutí soudu.",
    "note": "",
    "include": false
  },
  {
    "name": "Újma způsobená motorovými vozidly nad rámec POV",
    "text": "pojištění se vztahuje i na povinnost pojištěného nahradit poškozenému újmu způsobenou motorovými vozidly ve vlastnictví pojistníka nebo vozidly, které pojištěný po právu užívá na základě smlouvy, vzniklou při dopravní nehodě šetřené policií. Pojištění se vztahuje rovněž na újmu způsobenou při práci vozidla jako pracovního stroje, včetně stacionárního pracovního stroje. Pojistitel neposkytne pojistné plnění za újmu způsobenou provozem motorových vozidel v rozsahu, v jakém vznikl nárok na pojistné plnění z povinně smluvního pojištění odpovědnosti za újmu způsobenou provozem vozidla. Pojištění dle tohoto ujednání se nevztahuje na újmu způsobenou na samotném vozidle, jimž byla újma způsobena a na újmu způsobenou provozem motorových vozidel při jejich účasti na organizovaném motoristickém závodu .",
    "note": "",
    "include": false
  },
  {
    "name": "Újma způsobená žáku/studentu, ke které došlo při praktickém vyučování",
    "text": "pojištění se vztahuje i na odpovědnost za újmu způsobenou žáku/studentu, ke které došlo při praktickém vyučování u pojištěného nebo v přímé souvislosti s ním, příp. k této škodě došlo v souvislosti s jeho účastí na zájmovém vzdělávání. Ujednává se, že pojištění se vztahuje i na odpovědnost studenta/žáka za újmu způsobenou jakékoliv třetí osobě při praktickém vyučování u právnické nebo fyzické osoby anebo v přímé souvislosti s ním. Pojištění se vztahuje i na újmy způsobené pojistníkovi.",
    "note": "",
    "include": false
  },
  {
    "name": "Čistá finanční škoda",
    "text": "pojištění obecné odpovědnosti a pojištění odpovědnosti za újmu způsobenou vadou poskytnuté práce, jež se projeví po jejím předání a pojištění odpovědnosti za újmu způsobenou vadou výrobku se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému čistou finanční škodu, tj. majetkovou újmu na jmění vyjádřenou v penězích, která vznikla poškozenému jinak než při ublížení na zdraví, usmrcení nebo na jmění jeho poškozením, zničením nebo pohřešováním nebo následná finanční újma z toho vyplývající.",
    "note": "",
    "include": false
  },
  {
    "name": "Pokuty a penále",
    "text": "pojištění se vztahuje i na povinnost pojištěného nahradit poškozenému újmu vzniklou tím, že v důsledku vady pojištěným poskytnuté odborné služby nebo dodáním vadného výrobku byly poškozenému uloženy nebo proti němu uplatňovány pokuty, penále nebo jiné správní sankce k tomu oprávněným orgánem přímo na základě právního předpisu.",
    "note": "",
    "include": false
  },
  {
    "name": "Montáž a demontáž",
    "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému čistou finanční škodu, tj. majetkovou újmu na jmění vyjádřenou v penězích, spočívající v nákladech na odstranění, demontáž, vyjmutí nebo uvolnění vadného výrobku a v nákladech na montáž, připevnění nebo osazení bezvadného výrobku, která vznikla poškozenému jinak než při ublížení na zdraví, usmrcení nebo na jmění jeho poškozením, zničením nebo pohřešováním nebo následná finanční újma z toho vyplývající. Pojištění se vztahuje také na náhradu nákladů na přepravu výrobku bez vad určeného k výměně za vadný výrobek, náhradu nákladů na přepravu vadného výrobku a na náhradu nákladů na přepravu jiné věci, která obsahuje vadný výrobek.",
    "note": "",
    "include": false
  },
  {
    "name": "Spojení, smísení",
    "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit poškozenému čistou finanční škodu, tj. majetkovou újmu na jmění vyjádřenou v penězích nastalou v důsledku toho, že věc vzniklá spojením nebo smísením jiné věci s vadným výrobkem vyrobeným nebo dodaným pojištěným je vadná, nebo nastalou v důsledku toho, že věc vzniklá v důsledku dalšího zpracování nebo opracování vadného výrobku vyrobeného nebo dodaného pojištěným je vadná (dále jen „vyrobená vadná věc“).",
    "note": "",
    "include": false
  },
  {
    "name": "Činnosti bez živnostenského oprávnění",
    "text": "Pojištění se sjednává i pro případ povinnosti pojištěného uhradit škodu a v případě ublížení na zdraví nebo při usmrcení též újmu vzniklou jinému v souvislosti s činnostmi, pro jejichž výkon se živnostenské oprávnění nevyžaduje.",
    "note": "",
    "include": false
  },
  {
    "name": "Propojené osoby, křížová odpovědnost",
    "text": "pojištění se vztahuje i na právním předpisem stanovenou povinnost pojištěného nahradit újmu vzniklou: - spolupojištěné osobě; - právnické osobě, ve které má pojištěný nebo osoby jemu blízké majetkovou účast; - právnické osobě, ve které pojištěný vykonává funkci statutárního orgánu; - osobě, která je v pozici společníka pojištěného.",
    "note": "",
    "include": false
  },
  {
    "name": "Náklady  na reklamaci u zákazníka pojištěného",
    "text": "Pojišťovna zaplatí  administrativní náklady zákazníka pojištěného s dokladováním škody, které požaduje poškozený zákazník po pojištěném, pokud tyto náklady souvisí s dokladováním pojistné události.",
    "note": "",
    "include": false
  },
  {
    "name": "Smluvní ujednání k ručení vlastníka pozemní komunikace za správce pozemní komunikace",
    "text": "Pojištění se vztahuje i na povinnost pojištěného uhradit poškozenému peněžní částku, pokud mu tato povinnost vznikla ve smyslu § 27 odst.6 zákona č. 13/1997 Sb., o pozemních komunikacích, z důvodu ručení pojištěného za splnění povinnosti správce pozemní komunikace nahradit škodu (újmu). Pojistitel však poskytne pojistné plnění maximálně v rozsahu, v jakém by je poskytl v případě, kdy by výkon správy pozemní komunikace nebyl zajišťován prostřednictvím správce, ale přímo pojištěným.",
    "note": "",
    "include": false
  },
  {
    "name": "Pojištění nákladů na kontrolu nebo zkoušení výrobku poškozeného",
    "text": "pojištění se vztahuje i na povinnost pojištěného nahradit škodu (újmu na jmění) spočívající výlučně v nákladech vzniklých při kontrole nebo zkoušení výrobků poškozeného, která vznikla jinému.",
    "note": "",
    "include": false
  },
  {
    "name": "Připojištění odpovědnosti za újmu způsobenou vyrobením vadné věci pomocí vadného stroje",
    "text": "připojištění se vztahuje na právním předpisem stanovenou povinnost pojištěného nahradit újmu na jmění (škodu) vzniklou v důsledku toho, že věc vzniklá vyrobením/zpracováním/opracováním pomocí vadného stroje, který vadně vyrobil, dodal, (s)montoval nebo vadně udržoval či opravil pojištěný (dále jen \"vadný stroj\") je vadná (dále jen \"vyrobená vadná věc\").",
    "note": "",
    "include": false
  }
];

const $ = (id)=>document.getElementById(id);
const text = (v)=> (v ?? "").toString().trim();
function safeUpdateAll(){ try { updateAll(); } catch(e) { console.error('ASTORIE update error:', e); } }
function flashStatus(msg){ const el=$('saveStatus')||$('importStatus'); if(el){ el.textContent=msg; setTimeout(()=>{ if(el.textContent===msg) el.textContent=''; }, 2500); } }
function updateLiabilityModuleSummary(){
  const include = !!$('includeLiabilityModule')?.checked;
  const pCount = document.querySelectorAll('.liability-param-row .lpInclude:checked').length;
  const cCount = document.querySelectorAll('.special-clause-row .scInclude:checked').length;
  if($('liabilityParamCount')) $('liabilityParamCount').textContent = String(pCount);
  if($('specialClauseCount')) $('specialClauseCount').textContent = String(cCount);
  if($('liabilityModuleStatus')) $('liabilityModuleStatus').textContent = include ? (pCount || cCount ? 'Rozpracováno / připraveno k ověření' : 'Zahrnuto bez doplněných detailů') : 'Nezahrnuto do poptávky';
}
function toggleLiabilityModule(){
  const body=$('liabilityModuleBody');
  const btn=$('toggleLiabilityModuleBtn');
  if(!body) return;
  body.classList.toggle('hidden');
  if(btn) btn.textContent = body.classList.contains('hidden') ? 'Rozbalit odpovědnost' : 'Sbalit odpovědnost';
  updateLiabilityModuleSummary();
}

async function api(path, opts={}){
  const r = await fetch(path, {headers:{"Content-Type":"application/json"}, ...opts});
  const data = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.detail || data.message || "Chyba požadavku");
  return data;
}

async function init(){
  CATALOG = await api('/api/catalog');
  bindLogin();
  bindUI();
  bindDynamicButtonsHard();
  const savedUser = JSON.parse(localStorage.getItem('arh_user') || 'null');
  if(savedUser) enterApp(savedUser);
}

function bindLogin(){
  $('loginBtn').onclick = ()=>{
    const email = text($('loginEmail').value).toLowerCase();
    const pass = $('loginPassword').value;
    const user = (CATALOG.advisers||[]).find(u=>(u.email||'').toLowerCase()===email && u.password===pass);
    if(!user){ alert('Neplatné přihlášení.'); return; }
    localStorage.setItem('arh_user', JSON.stringify(user));
    enterApp(user);
  };
  $('logoutBtn').onclick = ()=>{ localStorage.removeItem('arh_user'); location.reload(); };
}

function enterApp(user){
  currentUser = user;
  $('loginView').classList.add('hidden');
  $('appView').classList.remove('hidden');
  $('logoutBtn').classList.remove('hidden');
  state.adviser = {name:user.name,email:user.email,role:user.role,company:user.company,registration:user.registration};
  document.querySelectorAll('.admin-only').forEach(x=>x.classList.toggle('hidden', user.role !== 'admin'));
  fillAdviser();
  renderCatalogs();
  resetInquiry(false);
  renderAdmin();
  bindDynamicButtonsHard();
  showView('dashboardView');
}

function fillAdviser(){
  $('adviserName').value = state.adviser.name || '';
  $('adviserEmail').value = state.adviser.email || '';
  $('adviserRole').value = state.adviser.role === 'admin' ? 'Admin / makléř' : 'Poradce / makléř';
  $('adviserCompany').value = state.adviser.company || 'ASTORIE a.s.';
  $('adviserRegistration').value = state.adviser.registration || 'samostatný zprostředkovatel';
}

function bindUI(){
  document.querySelectorAll('.nav-btn').forEach(btn=>btn.onclick=()=>showView(btn.dataset.view));
  document.querySelectorAll('[data-open-view]').forEach(btn=>btn.onclick=()=>showView(btn.dataset.openView));
  if($('dashboardSaveBtn')) $('dashboardSaveBtn').onclick = saveInquiry;
  $('aresBtn').onclick = loadAres;
  $('activitySelect').onchange = ()=>selectActivity($('activitySelect').value);
  $('addRiskBtn').onclick = addCustomRisk;
  $('addRequirementBtn').onclick = ()=>addRequirement();
  $('saveInquiryBtn').onclick = saveInquiry;
  $('loadListBtn').onclick = loadInquiries;
  if($('changeInquiryBtn')) $('changeInquiryBtn').onclick = loadInquiries;
  if($('closeInquiryBtn')) $('closeInquiryBtn').onclick = closeActiveInquiry;
  if($('inquiryStatusSelect')) $('inquiryStatusSelect').onchange = ()=>{ state.status=$('inquiryStatusSelect').value; updateActiveInquiryBanner(); };
  if($('refreshMyInquiriesBtn')) $('refreshMyInquiriesBtn').onclick = renderMyInquiries;
  if($('myInquiryStatusFilter')) $('myInquiryStatusFilter').onchange = renderMyInquiries;
  if($('myInquirySearch')) $('myInquirySearch').oninput = renderMyInquiries;
  if($('toggleLiabilityModuleBtn')) $('toggleLiabilityModuleBtn').onclick = toggleLiabilityModule;
  if($('includeLiabilityModule')) $('includeLiabilityModule').onchange = ()=>{ updateLiabilityModuleSummary(); safeUpdateAll(); };
  if($('refreshAdminInquiriesBtn')) $('refreshAdminInquiriesBtn').onclick = renderAdminInquiries;
  if($('adminInquiryStatusFilter')) $('adminInquiryStatusFilter').onchange = renderAdminInquiries;
  if($('adminInquirySearch')) $('adminInquirySearch').oninput = renderAdminInquiries;
  $('newInquiryBtn').onclick = startNewInquiry;
  $('refreshOffersBtn').onclick = renderOffers;
  if($('copyAiPromptBtn')) $('copyAiPromptBtn').onclick = copyAIPrompt;
  if($('importAiJsonBtn')) $('importAiJsonBtn').onclick = importAIJson;
  if($('aiInsurerSelect')) $('aiInsurerSelect').onchange = renderAIPrompt;
  if($('aiOfferLabel')) $('aiOfferLabel').addEventListener('input', renderAIPrompt);
  if($('aiDocsLabel')) $('aiDocsLabel').addEventListener('input', renderAIPrompt);
  $('closeModal').onclick = ()=>$('riskModal').classList.add('hidden');
  $('saveRiskDetail').onclick = saveRiskModal;
  if($('closeSavedModal')) $('closeSavedModal').onclick = ()=>$('savedInquiryModal').classList.add('hidden');
  if($('closeAdminDetail')) $('closeAdminDetail').onclick = ()=>$('adminDetailModal').classList.add('hidden');
  if($('cancelAdminDetail')) $('cancelAdminDetail').onclick = ()=>$('adminDetailModal').classList.add('hidden');
  if($('saveAdminDetail')) $('saveAdminDetail').onclick = saveAdminDetailModal;
  setupAdminDetailObserver();
  document.querySelectorAll('.tab').forEach(btn=>btn.onclick=()=>showTab(btn.dataset.tab));
  document.querySelectorAll('.admin-tab').forEach(btn=>btn.onclick=()=>showAdminTab(btn.dataset.adminTab));
  $('addInsurerAdmin').onclick = addAdminInsurer;
  $('addAdviserAdmin').onclick = addAdminAdviser;
  $('addReqTypeAdmin').onclick = addAdminReqType;
  $('saveAdminCatalogs').onclick = saveAdminCatalogs;
  if($('addRiskModelAdmin')) $('addRiskModelAdmin').onclick = addRiskModelRule;
  if($('addActivityAdmin')) $('addActivityAdmin').onclick = addAdminActivity;
  if($('addRiskAdmin')) $('addRiskAdmin').onclick = addAdminRisk;
  if($('addDictionaryAdmin')) $('addDictionaryAdmin').onclick = addAdminDictionary;
  if($('addPolicyRefAdmin')) $('addPolicyRefAdmin').onclick = addAdminPolicyRef;
  if($('runImportAdmin')) $('runImportAdmin').onclick = runCatalogImport;
  if($('exportCatalogAdmin')) $('exportCatalogAdmin').onclick = exportCatalogJson;
  if($('recalcComparisonBtn')) $('recalcComparisonBtn').onclick = renderComparison;
  if($('generateReportBtn')) $('generateReportBtn').onclick = renderClientReport;
  if($('copyReportBtn')) $('copyReportBtn').onclick = copyClientReport;
  if($('printClientPdfBtn')) $('printClientPdfBtn').onclick = printClientPdfReport;
  if($('advisorReportNote')) $('advisorReportNote').addEventListener('input', ()=>{ state.report=state.report||{}; state.report.advisor_note=$('advisorReportNote').value; });
  if($('clientSelectedOffer')) $('clientSelectedOffer').addEventListener('input', ()=>{ state.report=state.report||{}; state.report.client_selected_offer=$('clientSelectedOffer').value; });
  if($('clientChoiceReason')) $('clientChoiceReason').addEventListener('input', ()=>{ state.report=state.report||{}; state.report.client_choice_reason=$('clientChoiceReason').value; });
  if($('comparisonStrategy')) $('comparisonStrategy').onchange = ()=>{ state.comparison_strategy=$('comparisonStrategy').value; renderComparison(); };
  if($('comparisonStrictness')) $('comparisonStrictness').onchange = renderComparison;
  if($('reportMode')) $('reportMode').onchange = renderClientReport;
  if($('refreshGuideBtn')) $('refreshGuideBtn').onclick = renderGuide;
  if($('saveSuggestionBtn')) $('saveSuggestionBtn').onclick = saveSuggestion;
  if($('loadSuggestionsBtn')) $('loadSuggestionsBtn').onclick = loadSuggestions;
  document.querySelectorAll('input[name=advisorMode]').forEach(r=>r.onchange=renderGuide);
  ['insuranceStart','insurancePeriodSelect','insurancePeriodCustom','turnover','employees','territorySelect','territoryCustom','exportSelect','exportCustom','clientIco','clientName','clientLegal','clientAddress','clientDataBox','clientContact','clientEmail','clientPhone','clientWeb','adviserName','adviserEmail','adviserCompany','adviserRegistration','clientRepresentedBy','clientSigner','signatureMethod','signatureMethodCustom','commercialRegister','fiscalYearFrom','fiscalYearTo','mainBusinessActivity','additionalBusinessActivities','clientAttachments','clientExtraNotes','policyPeriod','premiumDue','premiumDueCustom','currency','premiumCollection','premiumCollectionCustom','brokerAccount','brokerPaymentNote','jurisdiction','retroactivity','timeScope','attOrExtract','attAstoriePower','attInsuranceDocs','attClaimsHistory','attContracts'].forEach(id=>{ if($(id)) $(id).addEventListener('input', updateAll); if($(id)) $(id).addEventListener('change', updateAll); });
  ['turnover'].forEach(id=>$(id).addEventListener('blur', e=>{ normaliseMoneyInput(e.target); updateAll(); }));
}



function hasActiveInquiryContext(){
  return !!(state._active || state.id);
}
function hasUnsavedActiveInquiry(){
  collectForm();
  return !!(state._active && !state.id && (text(state.client?.name) || text(state.client?.ico) || state.activity || (state.selected_insurers||[]).length || activeRisks().length));
}
function startNewInquiry(){
  if(hasUnsavedActiveInquiry() && !confirm('Máte rozpracovanou neuloženou poptávku. Chcete ji opustit a založit novou?')) return;
  resetInquiry(false);
  state._active = true;
  $('saveStatus').textContent = 'Nová rozpracovaná poptávka – zatím neuloženo do DB.';
  showView('inquiryView');
  updateActiveInquiryBanner();
}
function closeActiveInquiry(){
  if(hasUnsavedActiveInquiry() && !confirm('Máte rozpracovanou neuloženou poptávku. Opravdu ji chcete zavřít?')) return;
  resetInquiry(false);
  state._active = false;
  $('saveStatus').textContent = 'Není vybrána žádná aktivní poptávka.';
  showView('inquiryView');
  updateActiveInquiryBanner();
}
function protectedViewName(id){
  return {aiView:'AI zpracování', offersView:'Nabídky', comparisonView:'Porovnání', reportView:'Zpráva pro klienta'}[id] || '';
}
function requireActiveInquiryForView(id){
  const name = protectedViewName(id);
  if(!name) return true;
  if(hasActiveInquiryContext()) return true;
  const msg = `Nejprve založte nebo načtěte poptávku. Sekce „${name}“ vždy pracuje s aktivní poptávkou.`;
  if($('saveStatus')) $('saveStatus').textContent = msg;
  showView('inquiryView');
  return false;
}
function showView(id){
  collectForm();
  if(protectedViewName(id) && !hasActiveInquiryContext()){
    const msg = `Nejprve založte nebo načtěte poptávku. Sekce „${protectedViewName(id)}“ se váže ke konkrétní aktivní poptávce.`;
    if($('saveStatus')) $('saveStatus').textContent = msg;
    id='inquiryView';
  }
  document.querySelectorAll('.app-section').forEach(x=>x.classList.add('hidden'));
  $(id).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===id));
  if(id==='dashboardView') renderInquiryDashboard();
  if(id==='myInquiriesView') renderMyInquiries();
  if(id==='aiView') renderAIWorkflow();
  if(id==='offersView') { renderOffers(); renderOffersWorkspaceV72(); }
  if(id==='comparisonView') { renderComparison(); renderOfferComparisonV72(); }
  if(id==='reportView') renderClientReport();
  if(id==='guideView') renderGuide();
  if(id==='documentsView') { renderDocumentsWorkspace(); renderCaseDocuments(); renderCaseCommandCenter(); }
  if(id==='textationsView') renderTextationsWorkspace();
  if(id==='checklistView') { renderUnderwritingChecklist(); bindChecklistV70(); renderCaseCommandCenter(); }
  if(id==='riskModelView') renderRiskModelWorkspace();
  if(id==='suggestionsView') loadSuggestions();
  if(id==='adminView') renderAdmin();
  updateActiveInquiryBanner();
  try { updateAdvisorNavState(); } catch(e) { console.error('Chyba stavu menu:', e); }
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderCatalogs(){
  $('activitySelect').innerHTML = '<option value="">Vyberte činnost klienta</option>' + (CATALOG.activities||[]).map(a=>`<option value="${a.code}">${a.name}</option>`).join('');
  $('insurersList').innerHTML = (CATALOG.insurers||[]).filter(i=>i.active).map(i=>`<label class="check"><input type="checkbox" value="${i.id}"> <b>${i.short||''}</b> ${i.name||''}</label>`).join('');
  if($('aiInsurerSelect')) $('aiInsurerSelect').innerHTML = (CATALOG.insurers||[]).filter(i=>i.active).map(i=>`<option value="${i.id}">${i.short||''} – ${i.name||''}</option>`).join('');
  $('insurersList').querySelectorAll('input').forEach(cb=>cb.onchange=()=>{ syncSelectedInsurers(); renderOffers(); updateAll(); });
}

function resetInquiry(confirmIt){
  if(confirmIt && !confirm('Opravdu založit novou poptávku? Neuložené změny se ztratí.')) return;
  const user = state.adviser;
  state = { _active:false, id:null, adviser:user, client:{}, questionnaire:{}, activity:null, extended_client:{}, insurance_settings:{}, insured_persons:[], liability_params:[], special_clauses:[], risks:[], selected_insurers:[], additional_requirements:[], offers:{}, ai_imports:[], title:"", status:"rozpracováno", comparison_strategy:"bezpecnost", report:{advisor_note:"", client_selected_offer:"", client_choice_reason:""} };
  $('inquiryId').value = '';
  ['clientIco','clientName','clientLegal','clientAddress','clientDataBox','clientContact','clientEmail','clientPhone','clientWeb','insuranceStart','insurancePeriodCustom','turnover','employees','territoryCustom','exportCustom','clientRepresentedBy','clientSigner','signatureMethodCustom','commercialRegister','fiscalYearFrom','fiscalYearTo','mainBusinessActivity','additionalBusinessActivities','clientAttachments','clientExtraNotes','policyPeriod','premiumDue','premiumCollectionCustom','brokerAccount','brokerPaymentNote','jurisdiction','retroactivity','timeScope'].forEach(id=>{ if($(id)) $(id).value=''; });
  $('insurancePeriodSelect').value=''; $('territorySelect').value=''; $('exportSelect').value='';
  if($('signatureMethod')) $('signatureMethod').value=''; if($('currency')) $('currency').value=''; if($('premiumCollection')) $('premiumCollection').value=''; if($('premiumDue')) $('premiumDue').value=''; if($('premiumDueCustom')) $('premiumDueCustom').value=''; ['attOrExtract','attAstoriePower','attInsuranceDocs','attClaimsHistory','attContracts'].forEach(id=>{ if($(id)) $(id).checked=false; });
  ['clientExtraRows','insuredPersonsList','liabilityParamsList','specialClausesList'].forEach(id=>{ if($(id)) $(id).innerHTML=''; });
  populateDefaultLiabilityAndClauses();
  if($('includeLiabilityModule')) $('includeLiabilityModule').checked = false;
  if($('liabilityModuleBody')) $('liabilityModuleBody').classList.add('hidden');
  if($('toggleLiabilityModuleBtn')) $('toggleLiabilityModuleBtn').textContent = 'Rozbalit odpovědnost';
  updateLiabilityModuleSummary();
  $('insurersList').querySelectorAll('input').forEach(cb=>cb.checked=false);
  $('requirementsList').innerHTML='';
  $('inquiriesList').innerHTML='';
  fillAdviser();
  if($('activitySelect')) $('activitySelect').value='';
  if($('activityProfile')) $('activityProfile').innerHTML='<p class="muted">Vyberte typ klienta / činnost. Teprve potom aplikace navrhne relevantní rizika.</p>';
  renderRisks();
  updateActiveInquiryBanner();
  updateAll();
}

async function loadAres(){
  $('aresMsg').textContent = 'Načítám údaje z ARES...';
  try{
    const d = await api('/api/ares/' + encodeURIComponent($('clientIco').value));
    $('clientIco').value = d.ico || $('clientIco').value;
    $('clientName').value = d.name || '';
    $('clientLegal').value = d.legal_form || '';
    $('clientAddress').value = d.address || '';
    $('clientDataBox').value = d.data_box || '';
    $('aresMsg').textContent = 'Údaje z ARES byly načteny. Zkontrolujte je a doplňte chybějící informace.';
  }catch(e){ $('aresMsg').textContent = e.message; }
  updateAll();
}


async function loadAresForInsuredRow(row){
  const icoInput = row.querySelector('.ipId');
  const msg = row.querySelector('.ipAresMsg');
  const ico = text(icoInput?.value || '');
  if(!ico){ if(msg) msg.textContent='Doplňte IČ.'; return; }
  if(msg) msg.textContent='Načítám ARES...';
  try{
    const d = await api('/api/ares/' + encodeURIComponent(ico));
    row.querySelector('.ipName').value = d.name || row.querySelector('.ipName').value || '';
    row.querySelector('.ipId').value = d.ico || row.querySelector('.ipId').value || '';
    row.querySelector('.ipAddress').value = d.address || row.querySelector('.ipAddress').value || '';
    if(msg) msg.textContent='ARES načten.';
    safeUpdateAll();
  }catch(e){ if(msg) msg.textContent = e.message || 'ARES se nepodařilo načíst.'; }
}

function selectActivity(code){
  if(!code){ state.activity=null; state.risks=[]; if($('activityProfile')) $('activityProfile').innerHTML='<p class="muted">Vyberte typ klienta / činnost. Teprve potom aplikace navrhne relevantní rizika.</p>'; renderRisks(); updateAll(); return; }
  const activity = (CATALOG.activities||[]).find(a=>a.code===code);
  if(!activity) return;
  state.activity = activity;
  $('activitySelect').value = activity.code;
  $('activityProfile').innerHTML = `<h3>${activity.name}</h3><p>${activity.description||''}</p><p><b>Rizikovost:</b> ${activity.risk_level||''}</p><p><b>Orientační limit:</b> ${activity.limit_hint||''}</p>`;
  state.risks = JSON.parse(JSON.stringify((CATALOG.risks||{})[activity.code] || [])).map(r=>({...r, enabled: false, note:''}));
  renderRisks(); updateAll();
}

function renderRisks(){
  $('risksGrid').innerHTML = state.risks.map((r,i)=>`<div class="risk-card ${r.enabled?'':'off'}" data-i="${i}"><span class="pill">${r.priority||'VLASTNÍ'}</span><h3>${r.name}</h3><p>${r.description||''}</p><p><b>Limit:</b> ${r.limit||''}</p><p>${r.enabled?'Zahrnuto do poptávky':'Vyřazeno z poptávky'}</p></div>`).join('');
  $('risksGrid').querySelectorAll('.risk-card').forEach(card=>card.onclick=()=>openRisk(+card.dataset.i));
}
function openRisk(i){
  currentRiskIndex=i; const r=state.risks[i];
  $('modalTitle').textContent = r.name; $('modalEnabled').value=String(!!r.enabled); $('modalLimit').value=r.limit||''; $('modalQuestion').value=r.question||''; $('modalDescription').value=r.description||''; $('modalReason').value=r.reason||''; $('modalNote').value=r.note||''; $('riskModal').classList.remove('hidden');
}
function saveRiskModal(){
  const r=state.risks[currentRiskIndex];
  r.enabled = $('modalEnabled').value === 'true'; r.limit=$('modalLimit').value; r.question=$('modalQuestion').value; r.description=$('modalDescription').value; r.reason=$('modalReason').value; r.note=$('modalNote').value;
  $('riskModal').classList.add('hidden'); renderRisks(); renderOffers(); updateAll();
}
function addCustomRisk(){
  state.risks.push({id:'custom_'+Date.now(),name:'Vlastní riziko',priority:'VLASTNÍ',enabled:true,description:'Doplňte popis rizika.',limit:'dle dohody s klientem a požadavků pojišťovny',question:'Doplňte otázku pro klienta.',reason:'Doplňte důvod doporučení.',note:''});
  renderRisks(); openRisk(state.risks.length-1);
}

function addRequirement(req={}){
  const id='req_'+Date.now()+'_'+Math.random().toString(16).slice(2);
  const types = (CATALOG.requirementTypes||[]).map(t=>`<option value="${t.id}" ${req.type===t.id?'selected':''}>${t.name}</option>`).join('');
  const div=document.createElement('div'); div.className='req-row'; div.dataset.id=id;
  div.innerHTML = `<label>Typ<select class="reqType">${types}</select></label><label>Text požadavku<input class="reqText" value="${req.text||''}" placeholder="např. požadavek na vyloučení konkrétní výluky"></label><label>Propisovat<select class="reqOutput"><option value="all">všude</option><option value="insurer">jen pojišťovně</option><option value="client">jen klientovi</option><option value="zzj">jen ZZJ</option></select></label><button class="secondary reqDel">Smazat</button>`;
  $('requirementsList').appendChild(div);
  if(req.output) div.querySelector('.reqOutput').value=req.output;
  div.querySelector('.reqDel').onclick=()=>{div.remove(); safeUpdateAll();};
  div.querySelectorAll('input,select').forEach(el=>el.oninput=safeUpdateAll);
  updateAll();
}



function escAttr(v){ return (v ?? '').toString().replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escTextArea(v){ return (v ?? '').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function ensureWrap(wrapId, buttonId){
  let wrap=$(wrapId);
  if(!wrap && buttonId && $(buttonId)){
    wrap=document.createElement('div');
    wrap.id=wrapId;
    wrap.className='dynamic-list';
    $(buttonId).closest('.section-head')?.after(wrap);
  }
  return wrap;
}
function bindDynamicRow(div){
  const del=div.querySelector('.delRow');
  if(del) del.addEventListener('click',(e)=>{ e.preventDefault(); div.remove(); safeUpdateAll(); });
  const dup=div.querySelector('.dupRow');
  if(dup) dup.addEventListener('click',(e)=>{
    e.preventDefault();
    if(div.classList.contains('liability-param-row')){
      addLiabilityParam({
        include: !!div.querySelector('.lpInclude')?.checked,
        subject: div.querySelector('.lpSubject')?.value || '',
        limit: div.querySelector('.lpLimit')?.value || '',
        sublimit: div.querySelector('.lpSublimit')?.value || '',
        deductible: div.querySelector('.lpDeductible')?.value || '',
        note: div.querySelector('.lpNote')?.value || '',
        catalog: false
      });
    }
    if(div.classList.contains('special-clause-row')){
      addSpecialClause({
        include: !!div.querySelector('.scInclude')?.checked,
        name: div.querySelector('.scName')?.value || '',
        text: div.querySelector('.scText')?.value || '',
        note: div.querySelector('.scNote')?.value || '',
        catalog: false
      });
    }
    safeUpdateAll();
  });
  div.querySelectorAll('input,textarea,select').forEach(el=>{
    el.addEventListener('input', safeUpdateAll);
    el.addEventListener('change', safeUpdateAll);
  });
  updateLiabilityModuleSummary();
  div.scrollIntoView({behavior:'smooth', block:'center'});
}
function makeExtraRow(wrapId, className, keyClass, valueClass, row={}, buttonId){
  const wrap=ensureWrap(wrapId, buttonId); if(!wrap) throw new Error('Chybí kontejner ' + wrapId);
  const div=document.createElement('div'); div.className='dynamic-row two '+className;
  div.innerHTML=`<label>Název údaje<input class="${keyClass}" value="${escAttr(row.key||'')}" placeholder="např. další místo pojištění, skladování, certifikace"></label><label>Hodnota / poznámka<textarea class="${valueClass}" placeholder="doplňující údaj">${escTextArea(row.value||'')}</textarea></label><button type="button" class="secondary delRow">Smazat</button>`;
  wrap.appendChild(div); bindDynamicRow(div); return div;
}
function addQuestionnaireExtraRow(row={}){ return makeExtraRow('questionnaireExtraRows','questionnaire-extra-row','qeKey','qeValue',row,'addQuestionnaireExtraRowBtn'); }
function addInsuranceExtraRow(row={}){ return makeExtraRow('insuranceExtraRows','insurance-extra-row','ieKey','ieValue',row,'addInsuranceExtraRowBtn'); }
function addClientExtraRow(row={}){ return makeExtraRow('clientExtraRows','client-extra-row','extraKey','extraValue',row,'addClientExtraRowBtn'); }
function addInsuredPerson(row={}){
  const wrap=ensureWrap('insuredPersonsList','addInsuredPersonBtn'); if(!wrap) throw new Error('Chybí kontejner pro další pojištěné osoby');
  const div=document.createElement('div');
  div.className='insured-person-row insured-person-card enterprise-person-card';
  div.innerHTML=`
    <div class="insured-card-head professional-card-head">
      <div>
        <div class="card-label">Subjekt zahrnutý do pojištění</div>
        <h3>${escAttr(row.name||'Nová osoba / subjekt')}</h3>
      </div>
      <button type="button" class="secondary delRow">Smazat</button>
    </div>
    <div class="insured-client-grid real-client-grid">
      <label>Název / jméno osoby<input class="ipName" value="${escAttr(row.name||'')}" placeholder="Název společnosti nebo jméno osoby"></label>
      <label>Identifikační číslo / rodné číslo<input class="ipId" value="${escAttr(row.id_number||'')}" placeholder="IČO nebo rodné číslo"></label>
      <button type="button" class="secondary ipAresBtn ares-inline-btn">Načíst z ARES</button>

      <label>Vztah ke klientovi<select class="ipRelation">
        <option value="">Vyberte vztah</option>
        <option>dceřiná společnost</option>
        <option>mateřská společnost</option>
        <option>propojená osoba / skupina</option>
        <option>subdodavatel</option>
        <option>objednatel / investor</option>
        <option>zaměstnanec / fyzická osoba</option>
        <option value="custom">jiný vztah</option>
      </select></label>
      <label>Roční obrat<input class="ipTurnover" value="${escAttr(row.turnover||'')}" placeholder="Roční obrat v Kč"></label>
      <label>Předmět činnosti<input class="ipActivity" value="${escAttr(row.activity||'')}" placeholder="Hlavní činnost osoby nebo subjektu"></label>

      <label class="span2">Sídlo / adresa<input class="ipAddress" value="${escAttr(row.address||'')}" placeholder="Sídlo nebo kontaktní adresa"></label>
      <label>Upřesnění vztahu / rozsahu pojištění<input class="ipRelationCustom" value="${escAttr(row.relation_custom||'')}" placeholder="Poznámka k rozsahu krytí nebo vztahu ke klientovi"></label>
    </div>
    <div class="ipAresMsg dynamic-hint"></div>`;
  wrap.appendChild(div);
  if(row.relation){ div.querySelector('.ipRelation').value=row.relation; }
  bindDynamicRow(div);
  const syncTitle=()=>{ div.querySelector('.insured-card-head h3').textContent = div.querySelector('.ipName')?.value || 'Nová osoba / subjekt'; };
  div.querySelector('.ipName')?.addEventListener('input', syncTitle);
  div.querySelector('.ipAresBtn')?.addEventListener('click', async(e)=>{
    e.preventDefault(); e.stopPropagation();
    const id=(div.querySelector('.ipId')?.value||'').replace(/\D/g,'');
    const msg=div.querySelector('.ipAresMsg');
    if(!id){ if(msg) msg.textContent='Zadejte identifikační číslo subjektu.'; return; }
    if(msg) msg.textContent='Načítám údaje z ARES...';
    try{
      const res=await fetch('/api/ares/'+encodeURIComponent(id));
      const data=await res.json();
      if(!res.ok || !data.ok) throw new Error(data.detail||'ARES údaje se nepodařilo načíst.');
      if(data.name) div.querySelector('.ipName').value=data.name;
      if(data.address) div.querySelector('.ipAddress').value=data.address;
      syncTitle();
      if(msg) msg.textContent='Údaje z ARES byly načteny. Zkontrolujte je a doplňte chybějící informace.';
      safeUpdateAll();
    }catch(err){ if(msg) msg.textContent='ARES se nepodařilo načíst: '+err.message; }
  });
  return div;
}
function addLiabilityParam(row={}){
  const wrap=ensureWrap('liabilityParamsList','addLiabilityParamBtn'); if(!wrap) throw new Error('Chybí kontejner pro parametry odpovědnosti');
  const div=document.createElement('div'); div.className='dynamic-row liability-param-row';
  const subject = row.subject || '';
  const subjectField = row.catalog
    ? `<label class="liability-subject-label">Předmět / parametr<input type="hidden" class="lpSubject" value="${escAttr(subject)}"><div class="param-readable" title="${escAttr(subject)}">${escTextArea(subject)}</div></label>`
    : `<label class="liability-subject-label">Předmět / parametr<textarea class="lpSubject subject-edit" placeholder="Doplňte vlastní parametr odpovědnosti">${escTextArea(subject)}</textarea></label>`;
  div.innerHTML=`<label class="checkline liability-pick"><input type="checkbox" class="lpInclude" ${row.include?'checked':''}> Zahrnout do poptávky</label>${subjectField}<label>Limit<input class="lpLimit" value="${escAttr(row.limit||'')}"></label><label>Sublimit<input class="lpSublimit" value="${escAttr(row.sublimit||'')}"></label><label>Spoluúčast<input class="lpDeductible" value="${escAttr(row.deductible||'')}"></label><label class="liability-note">Poznámka<textarea class="lpNote">${escTextArea(row.note||'')}</textarea></label><div class="liability-row-actions">${row.catalog?'<span class="muted catalog-note">Katalogová položka</span>':'<button type="button" class="secondary delRow">Smazat</button>'}<button type="button" class="secondary dupRow">Duplikovat</button></div>`;
  wrap.appendChild(div); bindDynamicRow(div); updateLiabilityModuleSummary(); return div;
}
function addSpecialClause(row={}){
  const wrap=ensureWrap('specialClausesList','addSpecialClauseBtn'); if(!wrap) throw new Error('Chybí kontejner pro speciální ujednání');
  const div=document.createElement('div'); div.className='dynamic-row special-clause-row';
  div.innerHTML=`<label>Název<input class="scName" value="${escAttr(row.name||'')}"></label><label>Text ujednání<textarea class="scText">${escTextArea(row.text||'')}</textarea></label><label>Poznámka / vazba<textarea class="scNote">${escTextArea(row.note||'')}</textarea></label><label class="checkline"><input type="checkbox" class="scInclude" ${row.include?'checked':''}> zahrnout do poptávky</label>${row.catalog?'<span class="muted catalog-note">katalog</span>':'<button type="button" class="secondary delRow">Smazat</button>'}`;
  wrap.appendChild(div); bindDynamicRow(div); updateLiabilityModuleSummary(); return div;
}
window.addQuestionnaireExtraRow=addQuestionnaireExtraRow;
window.addInsuranceExtraRow=addInsuranceExtraRow;
window.addClientExtraRow=addClientExtraRow;
window.addInsuredPerson=addInsuredPerson;
window.addLiabilityParam=addLiabilityParam;
window.addSpecialClause=addSpecialClause;

function populateDefaultLiabilityAndClauses(){
  if(!$('liabilityParamsList') || $('liabilityParamsList').children.length===0){
    DEFAULT_LIABILITY_PARAMS.forEach(r=>addLiabilityParam({...r, include:false, catalog:true}));
  }
  if(!$('specialClausesList') || $('specialClausesList').children.length===0){
    DEFAULT_SPECIAL_CLAUSES.forEach(r=>addSpecialClause({...r, include:false, catalog:true}));
  }
}

function bindDynamicButtonsHard(){
  const map = {
    addQuestionnaireExtraRowBtn: addQuestionnaireExtraRow,
    addClientExtraRowBtn: addClientExtraRow,
    addInsuranceExtraRowBtn: addInsuranceExtraRow,
    addInsuredPersonBtn: addInsuredPerson,
    addLiabilityParamBtn: addLiabilityParam,
    addSpecialClauseBtn: addSpecialClause
  };
  Object.entries(map).forEach(([id, fn])=>{
    const btn = document.getElementById(id);
    if(!btn || btn.dataset.hardBound === '1') return;
    btn.dataset.hardBound = '1';
    btn.setAttribute('type','button');
    btn.addEventListener('click', function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
      try {
        const now = Date.now();
        if (btn.dataset.lastClick && (now - Number(btn.dataset.lastClick) < 400)) return;
        btn.dataset.lastClick = String(now);
        fn();
        try { updateAll(); } catch(e) { console.error('ASTORIE updateAll po přidání řádku:', e); }
        const msg = (btn.textContent || 'Řádek').replace('+','').trim();
        flashStatus(msg ? (msg + ' přidáno.') : 'Řádek přidán.');
      } catch(err) {
        console.error('ASTORIE dynamic add hard error:', err);
        alert('Nepodařilo se přidat řádek: ' + (err && err.message ? err.message : err));
      }
    });
  });
}

function collectDynamicBlocks(){
  state.extended_client = {
    represented_by:$('clientRepresentedBy')?.value||'', signer:$('clientSigner')?.value||'',
    signature_method:($('signatureMethod')?.value==='custom' ? $('signatureMethodCustom')?.value : $('signatureMethod')?.value)||'',
    commercial_register:$('commercialRegister')?.value||'', fiscal_year_from:$('fiscalYearFrom')?.value||'', fiscal_year_to:$('fiscalYearTo')?.value||'',
    main_business_activity:$('mainBusinessActivity')?.value||'', additional_business_activities:$('additionalBusinessActivities')?.value||'',
    attachments:$('clientAttachments')?.value||'', attachment_presets:{or_extract:!!$('attOrExtract')?.checked, astorie_power:!!$('attAstoriePower')?.checked, insurance_docs:!!$('attInsuranceDocs')?.checked, claims_history:!!$('attClaimsHistory')?.checked, contracts:!!$('attContracts')?.checked}, notes:$('clientExtraNotes')?.value||'',
    extra_rows:Array.from(document.querySelectorAll('.client-extra-row')).map(r=>({key:r.querySelector('.extraKey').value,value:r.querySelector('.extraValue').value})).filter(x=>text(x.key)||text(x.value))
  };
  state.insurance_settings = {
    policy_period:$('policyPeriod')?.value||'', premium_due:($('premiumDue')?.value==='custom' ? $('premiumDueCustom')?.value : $('premiumDue')?.value)||'', currency:$('currency')?.value||'',
    premium_collection:($('premiumCollection')?.value==='custom' ? $('premiumCollectionCustom')?.value : $('premiumCollection')?.value)||'',
    broker_account:$('brokerAccount')?.value||'', broker_payment_note:$('brokerPaymentNote')?.value||'',
    jurisdiction:$('jurisdiction')?.value||'', retroactivity:$('retroactivity')?.value||'', time_scope:$('timeScope')?.value||'',
    extra_rows:Array.from(document.querySelectorAll('.insurance-extra-row')).map(r=>({key:r.querySelector('.ieKey').value,value:r.querySelector('.ieValue').value})).filter(x=>text(x.key)||text(x.value))
  };
  state.insured_persons = Array.from(document.querySelectorAll('.insured-person-row')).map(r=>({name:r.querySelector('.ipName')?.value||'',id_number:r.querySelector('.ipId')?.value||'',relation:r.querySelector('.ipRelation')?.value||'',relation_custom:r.querySelector('.ipRelationCustom')?.value||'',address:r.querySelector('.ipAddress')?.value||'',activity:r.querySelector('.ipActivity')?.value||'',turnover:r.querySelector('.ipTurnover')?.value||''})).filter(x=>Object.values(x).some(text));
  state.liability_included = !!$('includeLiabilityModule')?.checked;
  if(state.liability_included){
    state.liability_params = Array.from(document.querySelectorAll('.liability-param-row')).map(r=>({include:!!r.querySelector('.lpInclude')?.checked, subject:r.querySelector('.lpSubject').value,limit:r.querySelector('.lpLimit').value,sublimit:r.querySelector('.lpSublimit').value,deductible:r.querySelector('.lpDeductible').value,note:r.querySelector('.lpNote').value})).filter(x=>x.include && Object.values(x).some(text));
    state.special_clauses = Array.from(document.querySelectorAll('.special-clause-row')).map(r=>({name:r.querySelector('.scName').value,text:r.querySelector('.scText').value,note:r.querySelector('.scNote').value,include:r.querySelector('.scInclude').checked})).filter(x=>x.include && (text(x.name)||text(x.text)||text(x.note)));
  } else {
    state.liability_params = [];
    state.special_clauses = [];
  }
  updateLiabilityModuleSummary();
}
function renderDynamicBlocksFromState(){
  if(!$('clientExtraRows')) return;
  $('clientRepresentedBy').value=state.extended_client?.represented_by||''; $('clientSigner').value=state.extended_client?.signer||''; setSelectOrCustom('signatureMethod','signatureMethodCustom',state.extended_client?.signature_method||''); $('commercialRegister').value=state.extended_client?.commercial_register||''; $('fiscalYearFrom').value=state.extended_client?.fiscal_year_from||''; $('fiscalYearTo').value=state.extended_client?.fiscal_year_to||''; $('mainBusinessActivity').value=state.extended_client?.main_business_activity||''; $('additionalBusinessActivities').value=state.extended_client?.additional_business_activities||''; $('clientAttachments').value=state.extended_client?.attachments||''; $('clientExtraNotes').value=state.extended_client?.notes||''; const ap=state.extended_client?.attachment_presets||{}; if($('attOrExtract')) $('attOrExtract').checked = !!ap.or_extract; if($('attAstoriePower')) $('attAstoriePower').checked = !!ap.astorie_power; if($('attInsuranceDocs')) $('attInsuranceDocs').checked=!!ap.insurance_docs; if($('attClaimsHistory')) $('attClaimsHistory').checked=!!ap.claims_history; if($('attContracts')) $('attContracts').checked=!!ap.contracts;
  $('policyPeriod').value=state.insurance_settings?.policy_period||''; setSelectOrCustom('premiumDue','premiumDueCustom',state.insurance_settings?.premium_due||''); $('currency').value=state.insurance_settings?.currency||''; setSelectOrCustom('premiumCollection','premiumCollectionCustom',state.insurance_settings?.premium_collection||''); if($('brokerAccount')) $('brokerAccount').value=state.insurance_settings?.broker_account||''; if($('brokerPaymentNote')) $('brokerPaymentNote').value=state.insurance_settings?.broker_payment_note||''; $('jurisdiction').value=state.insurance_settings?.jurisdiction||''; $('retroactivity').value=state.insurance_settings?.retroactivity||''; $('timeScope').value=state.insurance_settings?.time_scope||'';
  if($('questionnaireExtraRows')) { $('questionnaireExtraRows').innerHTML=''; (state.questionnaire?.extra_rows||[]).forEach(addQuestionnaireExtraRow); }
  if($('insuranceExtraRows')) { $('insuranceExtraRows').innerHTML=''; (state.insurance_settings?.extra_rows||[]).forEach(addInsuranceExtraRow); }
  $('clientExtraRows').innerHTML=''; (state.extended_client?.extra_rows||[]).forEach(addClientExtraRow);
  $('insuredPersonsList').innerHTML=''; (state.insured_persons||[]).forEach(addInsuredPerson);
  $('liabilityParamsList').innerHTML=''; (state.liability_params&&state.liability_params.length?state.liability_params:DEFAULT_LIABILITY_PARAMS.map(r=>({...r, include:false, catalog:true}))).forEach(addLiabilityParam);
  $('specialClausesList').innerHTML=''; (state.special_clauses&&state.special_clauses.length?state.special_clauses:DEFAULT_SPECIAL_CLAUSES.map(r=>({...r, include:false, catalog:true}))).forEach(addSpecialClause);
  if($('includeLiabilityModule')) $('includeLiabilityModule').checked = !!state.liability_included;
  updateLiabilityModuleSummary();
}

function formatAttachmentsForReport(e){
  const ap=e?.attachment_presets||{};
  const arr=[];
  if(ap.or_extract) arr.push('Výpis z OR / evidence');
  if(ap.astorie_power) arr.push('Plná moc ASTORIE');
  if(ap.insurance_docs) arr.push('Dosavadní pojistné smlouvy / pojistky');
  if(ap.claims_history) arr.push('Škodní průběh');
  if(ap.contracts) arr.push('Smlouvy / obchodní podmínky klienta');
  if(e?.attachments) arr.push(e.attachments);
  return arr.join('<br>');
}

function rowsTable(rows, cols){
  if(!rows || !rows.length) return '';
  return `<table><thead><tr>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${r[c[1]]||''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function extendedClientHtml(){
  const e=state.extended_client||{}, ins=state.insurance_settings||{};
  const extra=(e.extra_rows||[]).map(x=>`<tr><th>${x.key||''}</th><td>${x.value||''}</td></tr>`).join('');
  const qExtra=(state.questionnaire?.extra_rows||[]).map(x=>`<tr><th>${x.key||''}</th><td>${x.value||''}</td></tr>`).join('');
  const insExtra=(state.insurance_settings?.extra_rows||[]).map(x=>`<tr><th>${x.key||''}</th><td>${x.value||''}</td></tr>`).join('');
  return `<h3>Doplňující informace o klientovi</h3><table><tr><th>Zastupující osoba</th><td>${e.represented_by||''}</td></tr><tr><th>Podepisující osoba</th><td>${e.signer||''}</td></tr><tr><th>Způsob podpisu</th><td>${e.signature_method||''}</td></tr><tr><th>OR / evidence</th><td>${e.commercial_register||''}</td></tr><tr><th>Účetní rok</th><td>${e.fiscal_year_from||''} – ${e.fiscal_year_to||''}</td></tr><tr><th>Hlavní / další činnost</th><td>${e.main_business_activity||''} ${e.additional_business_activities?'<br>'+e.additional_business_activities:''}</td></tr><tr><th>Přílohy</th><td>${formatAttachmentsForReport(e)}</td></tr><tr><th>Poznámky</th><td>${e.notes||''}</td></tr>${extra}</table><h3>Pojistné nastavení</h3><table><tr><th>Pojistné období</th><td>${ins.policy_period||''}</td></tr><tr><th>Splatnost</th><td>${ins.premium_due||''}</td></tr><tr><th>Měna</th><td>${ins.currency||''}</td></tr><tr><th>Inkaso</th><td>${ins.premium_collection||''}</td></tr><tr><th>Účet / poznámka k inkasu</th><td>${[ins.broker_account,ins.broker_payment_note].filter(Boolean).join('<br>')}</td></tr><tr><th>Jurisdikce</th><td>${ins.jurisdiction||''}</td></tr><tr><th>Retroaktivita</th><td>${ins.retroactivity||''}</td></tr><tr><th>Časová působnost</th><td>${ins.time_scope||''}</td></tr>${insExtra}</table>${rowsTable(state.insured_persons,[['Název/osoba','name'],['IČ/RČ','id_number'],['Vztah','relation'],['Vlastní vztah / poznámka','relation_custom'],['Sídlo','address'],['Činnost','activity'],['Obrat','turnover']])}${rowsTable(state.liability_params,[['Parametr','subject'],['Limit','limit'],['Sublimit','sublimit'],['Spoluúčast','deductible'],['Poznámka','note']])}${rowsTable((state.special_clauses||[]).filter(x=>x.include!==false),[['Ujednání','name'],['Text','text'],['Poznámka','note']])}`;
}

function syncSelectedInsurers(){
  state.selected_insurers = Array.from($('insurersList').querySelectorAll('input:checked')).map(cb=>cb.value);
}
function collectForm(){
  state.id = $('inquiryId').value ? Number($('inquiryId').value) : null;
  state.adviser = {name:$('adviserName').value,email:$('adviserEmail').value,role:$('adviserRole').value,company:$('adviserCompany').value,registration:$('adviserRegistration').value};
  state.client = {ico:$('clientIco').value,name:$('clientName').value,legal_form:$('clientLegal').value,address:$('clientAddress').value,data_box:$('clientDataBox').value,contact_person:$('clientContact').value,contact_email:$('clientEmail').value,contact_phone:$('clientPhone').value,website:$('clientWeb').value};
  const period = $('insurancePeriodSelect').value === 'custom' ? $('insurancePeriodCustom').value : $('insurancePeriodSelect').value;
  const territory = $('territorySelect').value === 'custom' ? $('territoryCustom').value : $('territorySelect').value;
  const exp = $('exportSelect').value === 'custom' ? $('exportCustom').value : $('exportSelect').value;
  state.questionnaire = {insurance_start:$('insuranceStart').value,insurance_period:period,turnover:$('turnover').value,employees:$('employees').value,territory,export_info:exp, extra_rows:Array.from(document.querySelectorAll('.questionnaire-extra-row')).map(r=>({key:r.querySelector('.qeKey').value,value:r.querySelector('.qeValue').value})).filter(x=>text(x.key)||text(x.value))};
  collectDynamicBlocks();
  syncSelectedInsurers();
  state.additional_requirements = Array.from(document.querySelectorAll('.req-row')).map(row=>({type:row.querySelector('.reqType').value,text:row.querySelector('.reqText').value,output:row.querySelector('.reqOutput').value})).filter(r=>text(r.text));
  collectOffers(false);
  state.title = `Poptávka – ${state.client.name || 'klient'} – ${state.activity?.name || ''}`;
}

function insurerName(id){ const i=(CATALOG.insurers||[]).find(x=>x.id===id); return i ? `${i.short||''} ${i.name||''}`.trim() : id; }
function activeRisks(){ return (state.risks||[]).filter(r=>r.enabled); }
function selectedInsurers(){ return (state.selected_insurers||[]).map(id=>(CATALOG.insurers||[]).find(i=>i.id===id)).filter(Boolean); }

function updateAll(){
  collectForm();
  updateActiveInquiryBanner();
  try { updateAdvisorNavState(); } catch(e) { console.error('Chyba stavu menu:', e); }
  try { updateDocs(); } catch(e) { console.error('Chyba aktualizace dokumentů:', e); }
  try { renderComparison(); } catch(e) { console.error('Chyba aktualizace porovnání:', e); }
  if(document.getElementById('guideView') && !document.getElementById('guideView').classList.contains('hidden')) {
    try { renderGuide(); } catch(e) { console.error('Chyba průvodce:', e); }
  }
}
function showTab(id){
  document.querySelectorAll('.doc-view').forEach(x=>x.classList.add('hidden'));
  $(id).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===id));
}
function renderReqRows(output){
  const rows = state.additional_requirements.filter(r=>r.output==='all'||r.output===output).map(r=>`<tr><td>${labelReqType(r.type)}</td><td>${r.text}</td></tr>`).join('');
  return rows || `<tr><td colspan="2">Bez dalších požadavků nebo poznámek.</td></tr>`;
}
function labelReqType(id){ return ((CATALOG.requirementTypes||[]).find(t=>t.id===id)||{}).name || id || 'Poznámka'; }
function risksTable(){
  return activeRisks().map(r=>`<tr><td><b>${r.name}</b></td><td>${r.reason||r.description||''}${r.note?`<br><span class="muted">Pozn.: ${r.note}</span>`:''}</td><td>${r.limit||''}</td></tr>`).join('') || `<tr><td colspan="3">Zatím nejsou vybrána rizika.</td></tr>`;
}
function updateDocs(){
  collectForm();
  const insurers = selectedInsurers().map(i=>`${i.short||''} – ${i.name||''}`).join(', ') || 'Zatím nevybráno';
  const qExtra = (state.questionnaire?.extra_rows||[]).map(x=>`<tr><th>${x.key||''}</th><td>${x.value||''}</td></tr>`).join('');
  const clientBlock = `<table><tr><th>Klient</th><td>${state.client.name||''}</td></tr><tr><th>IČO</th><td>${state.client.ico||''}</td></tr><tr><th>Sídlo</th><td>${state.client.address||''}</td></tr><tr><th>Kontakt</th><td>${state.client.contact_person||''} ${state.client.contact_email||''} ${state.client.contact_phone||''}</td></tr><tr><th>Činnost</th><td>${state.activity?.name||''}</td></tr><tr><th>Obrat / zaměstnanci</th><td>${state.questionnaire.turnover||''} / ${state.questionnaire.employees||''}</td></tr><tr><th>Územní rozsah</th><td>${state.questionnaire.territory||''}; export: ${state.questionnaire.export_info||''}</td></tr><tr><th>Pojistná doba</th><td>${state.questionnaire.insurance_period||''}; počátek: ${state.questionnaire.insurance_start||''}</td></tr>${qExtra}<tr><th>Oslovené pojišťovny</th><td>${insurers}</td></tr></table>`;
  const extBlock = extendedClientHtml();
  $('insurerDoc').innerHTML = `<h2>Poptávka pro pojišťovny</h2><p class="muted">Tento výstup je určený pro zaslání vybraným pojišťovnám. Obsahuje jednotné názvosloví ASTORIE, aby bylo možné nabídky následně porovnat.</p>${clientBlock}${extBlock}<h3>Požadovaná rizika a limity</h3><table><thead><tr><th>Riziko</th><th>Proč jej řešíme</th><th>Orientační limit</th></tr></thead><tbody>${risksTable()}</tbody></table><h3>Doplňující požadavky pro pojišťovnu</h3><table><thead><tr><th>Typ</th><th>Požadavek / poznámka</th></tr></thead><tbody>${renderReqRows('insurer')}</tbody></table>`;
  $('clientDoc').innerHTML = `<h2>Klientské shrnutí</h2><p>Na základě zjištěných údajů doporučujeme poptat níže uvedený rozsah pojištění. Konečné doporučení bude připraveno po vyhodnocení nabídek pojišťoven.</p>${clientBlock}${extBlock}<h3>Hlavní identifikovaná rizika</h3><table><thead><tr><th>Riziko</th><th>Proč je důležité</th><th>Limit</th></tr></thead><tbody>${risksTable()}</tbody></table><h3>Poznámky pro klienta</h3><table><tbody>${renderReqRows('client')}</tbody></table>`;
  $('zzjDoc').innerHTML = `<h2>Podklad pro záznam z jednání</h2><table><tr><th>Poradce</th><td>${state.adviser.name||''} (${state.adviser.email||''})</td></tr><tr><th>Klient</th><td>${state.client.name||''}, IČO ${state.client.ico||''}</td></tr><tr><th>Požadavky a potřeby</th><td>Klient požaduje poptání podnikatelského pojištění pro činnost: ${state.activity?.name||''}. Územní rozsah: ${state.questionnaire.territory||''}. Pojistná doba: ${state.questionnaire.insurance_period||''}.</td></tr><tr><th>Oslovené pojišťovny</th><td>${insurers}</td></tr></table>${extBlock}<h3>Rizika zahrnutá do doporučení</h3><table><thead><tr><th>Riziko</th><th>Důvod</th><th>Limit</th></tr></thead><tbody>${risksTable()}</tbody></table><h3>Doplňující poznámky pro ZZJ</h3><table><tbody>${renderReqRows('zzj')}</tbody></table>`;
}

function renderOffers(){
  collectForm();
  const insurers = selectedInsurers();
  if(!insurers.length){ $('offersList').innerHTML='<div class="empty">Nejdříve vyber pojišťovny v poptávce.</div>'; return; }
  insurers.forEach(i=>{ if(!state.offers[i.id]) state.offers[i.id]={premium:'',deductible:'',valid_until:'',status:'čekáme na nabídku',note:'',coverages:{}}; });
  $('offersList').innerHTML = insurers.map(i=>offerCardHtml(i)).join('');
  $('offersList').querySelectorAll('input,select,textarea').forEach(el=>el.oninput=()=>{ collectOffers(true); renderComparison(); scheduleOfferAutosave(); });
  $('offersList').querySelectorAll('.money-input').forEach(el=>el.onblur=()=>{ normaliseMoneyInput(el); collectOffers(true); renderComparison(); scheduleOfferAutosave(); });
}
function getPolicyReference(insurerId, riskId){
  return (CATALOG.policyReferences||[]).find(x=>x.insurer_id===insurerId && x.risk_id===riskId) || null;
}
function getDictionary(riskId){
  return (CATALOG.coverageDictionary||[]).find(x=>x.risk_id===riskId) || null;
}
function offerCardHtml(insurer){
  const o = state.offers[insurer.id] || {};
  const coverageRows = activeRisks().map(r=>{
    const c=(o.coverages||{})[r.id]||{state:'nevyhodnoceno',limit:r.limit||'',note:'',original:'',source:''};
    const dict=getDictionary(r.id);
    const ref=getPolicyReference(insurer.id, r.id);
    const aliases=dict?.aliases?.length ? `<small>Možné názvy: ${dict.aliases.slice(0,4).join(', ')}</small>` : '';
    const sourceHint=ref ? `${ref.document}; ${ref.article}` : 'doplnit VPP/DPP, článek/odstavec';
    return `<div class="coverage-row rich" data-risk-id="${r.id}"><div><b>${r.name}</b><small>Požadavek: ${r.limit||''}</small>${aliases}</div><select class="cov-state"><option ${c.state==='nevyhodnoceno'?'selected':''}>nevyhodnoceno</option><option ${c.state==='splněno'?'selected':''}>splněno</option><option ${c.state==='částečně'?'selected':''}>částečně</option><option ${c.state==='nesplněno'?'selected':''}>nesplněno</option><option ${c.state==='výluka'?'selected':''}>výluka</option></select><input class="cov-limit" value="${c.limit||''}" placeholder="limit v nabídce"><input class="cov-original" value="${c.original||''}" placeholder="název v nabídce pojišťovny"><input class="cov-source" value="${c.source||sourceHint}" placeholder="VPP/DPP, článek"><input class="cov-note" value="${c.note||''}" placeholder="poznámka / rozdíl / výluka"></div>`;
  }).join('');
  return `<div class="offer-card" data-insurer-id="${insurer.id}"><div class="section-head"><div><h3>${insurer.short||''} – ${insurer.name||''}</h3><p class="muted">Nabídku nepřepisujeme volným textem. Každou položku párujeme na jednotné riziko ASTORIE, zapisujeme původní název z nabídky a zdroj ve VPP/DPP.</p></div><span class="pill">nabídka</span></div><div class="grid4"><label>Stav nabídky<select class="off-status"><option ${o.status==='čekáme na nabídku'?'selected':''}>čekáme na nabídku</option><option ${o.status==='doručeno'?'selected':''}>doručeno</option><option ${o.status==='doplnit dotaz'?'selected':''}>doplnit dotaz</option><option ${o.status==='nepoptáno/nepodáno'?'selected':''}>nepoptáno/nepodáno</option></select></label><label>Roční pojistné<input class="off-premium money-input" value="${o.premium||''}" placeholder="např. 48 000 Kč"></label><label>Spoluúčast<input class="off-deductible money-input" value="${o.deductible||''}" placeholder="např. 10 000 Kč"></label><label>Platnost nabídky<input class="off-valid date-input" type="date" value="${o.valid_until||''}"></label></div><label>Manažerské shrnutí nabídky<textarea class="off-note" placeholder="silné/slabé stránky, dotazy na pojišťovnu, podstatné výluky...">${o.note||''}</textarea></label><h4>Krytí podle jednotných rizik ASTORIE</h4><div class="coverage-table rich"><div class="coverage-head rich"><b>Riziko</b><b>Stav</b><b>Limit</b><b>Název v nabídce</b><b>Zdroj VPP/DPP</b><b>Poznámka</b></div>${coverageRows}</div></div>`;
}
function collectOffers(updateState){
  document.querySelectorAll('.offer-card').forEach(card=>{
    const id=card.dataset.insurerId;
    if(!state.offers[id]) state.offers[id]={coverages:{}};
    state.offers[id].status=card.querySelector('.off-status')?.value || state.offers[id].status || '';
    state.offers[id].premium=card.querySelector('.off-premium')?.value || '';
    state.offers[id].deductible=card.querySelector('.off-deductible')?.value || '';
    state.offers[id].valid_until=card.querySelector('.off-valid')?.value || '';
    state.offers[id].note=card.querySelector('.off-note')?.value || '';
    state.offers[id].coverages={};
    card.querySelectorAll('.coverage-row').forEach(row=>{
      state.offers[id].coverages[row.dataset.riskId]={state:row.querySelector('.cov-state').value,limit:row.querySelector('.cov-limit').value,original:row.querySelector('.cov-original')?.value||'',source:row.querySelector('.cov-source')?.value||'',note:row.querySelector('.cov-note').value};
    });
  });
}
function getRiskModel(riskId, activityCode){
  const rows = CATALOG.riskModel || [];
  return rows.find(x=>x.active!==false && x.risk_id===riskId && x.activity_code===activityCode) || rows.find(x=>x.active!==false && x.risk_id===riskId) || {};
}
function moneyNumber(v){
  const n = parseFloat((v||'').toString().replace(/[^0-9,.-]/g,'').replace(',', '.'));
  return isNaN(n) ? null : n;
}
function formatMoney(value){
  if(value === null || value === undefined || value === '') return '—';
  const n = moneyNumber(value);
  if(n === null) return value;
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(n) + ' Kč';
}
function formatMoneyMaybe(value){
  if(!value) return '—';
  return formatMoney(value);
}
function normaliseMoneyInput(el){
  const n = moneyNumber(el.value);
  if(n !== null) el.value = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(n) + ' Kč';
}
function formatDateCz(value){
  if(!value) return '—';
  if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
    const parts=value.split('-');
    return parts[2]+'.'+parts[1]+'.'+parts[0];
  }
  return value;
}

function formatDateTimeCz(value){
  if(!value) return '';
  try{
    const d = new Date(value);
    if(isNaN(d.getTime())) return String(value);
    return d.toLocaleString('cs-CZ', {
      day:'2-digit', month:'2-digit', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    });
  }catch(e){ return String(value); }
}
function coverageBase(c){
  const st=(c?.state||'').toLowerCase();
  if(st==='splněno') return 1;
  if(st==='částečně') return 0.55;
  if(st==='nesplněno') return 0;
  if(st==='výluka') return -0.6;
  return 0.15;
}
function priceScore(insurer, insurers){
  const vals = insurers.map(i=>moneyNumber(state.offers[i.id]?.premium)).filter(v=>v && v>0);
  const my = moneyNumber(state.offers[insurer.id]?.premium);
  if(!vals.length || !my) return 50;
  const min = Math.min(...vals), max=Math.max(...vals);
  if(max===min) return 100;
  return Math.max(0, Math.round(100 - ((my-min)/(max-min))*100));
}
function strategyWeights(){
  const strategy = $('comparisonStrategy')?.value || state.comparison_strategy || 'bezpecnost';
  if(strategy==='cena') return {coverage:0.30, price:0.70, label:'Cena'};
  if(strategy==='vyvazeny') return {coverage:0.50, price:0.50, label:'Vyvážený'};
  return {coverage:0.70, price:0.30, label:'Bezpečnost'};
}
function riskCoveragePoints(r, c){
  const m = getRiskModel(r.id, state.activity?.code);
  let weight = Number(m.weight || 50);
  if((m.criticality||'').toLowerCase()==='kritická') weight *= 1.25;
  if((m.obligation||'').toLowerCase()==='nutné') weight *= 1.15;
  return coverageBase(c) * weight;
}
function offerQuality(insurer){
  const offer=state.offers[insurer.id]||{};
  const risks=activeRisks();
  let earned=0, possible=0, missing=[], warnings=[];
  risks.forEach(r=>{
    const c=offer.coverages?.[r.id]||{};
    const m=getRiskModel(r.id, state.activity?.code);
    let weight=Number(m.weight||50);
    if((m.criticality||'').toLowerCase()==='kritická') weight*=1.25;
    if((m.obligation||'').toLowerCase()==='nutné') weight*=1.15;
    possible += Math.max(weight,1);
    earned += Math.max(0, riskCoveragePoints(r,c));
    const st=(c.state||'').toLowerCase();
    if(['nesplněno','výluka','nevyhodnoceno',''].includes(st)){
      missing.push(r.name);
      if(['kritická','vysoká'].includes((m.criticality||'').toLowerCase())) warnings.push(`${r.name}: ${st||'nevyhodnoceno'} – ${m.warning_text||'ověřit krytí a zdroj'}`);
    }
    if(st==='částečně' && ['kritická','vysoká'].includes((m.criticality||'').toLowerCase())) warnings.push(`${r.name}: částečné krytí – ověřit limit, sublimit a výluky.`);
  });
  const coverageScore = possible ? Math.round((earned/possible)*100) : 0;
  const insurers = selectedInsurers();
  const pScore = priceScore(insurer, insurers);
  const w = strategyWeights();
  const total = Math.round(coverageScore*w.coverage + pScore*w.price);
  let verdict = total>=80 ? 'Vhodná' : total>=55 ? 'S výhradami' : 'Nedoporučená';
  if(warnings.length && ($('comparisonStrictness')?.value==='strict')) verdict = total>=70 ? 'S výhradami' : 'Nedoporučená';
  return {score:total, coverageScore, priceScore:pScore, missing, warnings, verdict};
}
function recommendedInsurer(insurers){
  return insurers.map(i=>({insurer:i,...offerQuality(i)})).sort((a,b)=>b.score-a.score)[0] || null;
}
function renderComparison(){
  collectForm();
  const insurers = selectedInsurers();
  if(!insurers.length){ $('comparisonDoc').innerHTML='<h2>Porovnání nabídek</h2><p class="muted">Nejdříve vyber pojišťovny v poptávce.</p>'; return; }
  const rec = recommendedInsurer(insurers);
  const head = `<tr><th>Kritérium / riziko</th>${insurers.map(i=>`<th>${i.short||i.name}</th>`).join('')}</tr>`;
  const summaryRows = [
    ['Stav nabídky', i=>state.offers[i.id]?.status||'čekáme na nabídku'],
    ['Roční pojistné', i=>formatMoneyMaybe(state.offers[i.id]?.premium)],
    ['Spoluúčast', i=>formatMoneyMaybe(state.offers[i.id]?.deductible)],
    ['Platnost nabídky', i=>formatDateCz(state.offers[i.id]?.valid_until)],
    ['Celkové skóre', i=>offerQuality(i).score + ' / 100'],
    ['Skóre krytí', i=>offerQuality(i).coverageScore + ' / 100'],
    ['Skóre ceny', i=>offerQuality(i).priceScore + ' / 100'],
    ['Verdikt', i=>offerQuality(i).verdict],
    ['Poznámka', i=>state.offers[i.id]?.note||'—']
  ].map(([label,fn])=>`<tr><td><b>${label}</b></td>${insurers.map(i=>`<td>${fn(i)}</td>`).join('')}</tr>`).join('');
  const riskRows = activeRisks().map(r=>`<tr><td><b>${r.name}</b><br><span class="muted">Požadavek ASTORIE: ${formatMoneyMaybe(r.limit)}</span><br><small>${(()=>{const m=getRiskModel(r.id,state.activity?.code); return 'Kritičnost: '+(m.criticality||'—')+' · váha: '+(m.weight||'—')+' · povinnost: '+(m.obligation||'—');})()}</small></td>${insurers.map(i=>{ const c=state.offers[i.id]?.coverages?.[r.id]||{}; const src=c.source?`<br><small>Zdroj: ${c.source}</small>`:''; const orig=c.original?`<br><small>Název v nabídce: ${c.original}</small>`:''; return `<td><b class="cov ${slug(c.state)}">${c.state||'nevyhodnoceno'}</b><br>${formatMoneyMaybe(c.limit)}${orig}${src}${c.note?`<br><span class="muted">${c.note}</span>`:''}</td>`; }).join('')}</tr>`).join('');
  const strategy = strategyWeights();
  const recommendation = rec ? `<div class="recommend-box"><h3>Pracovní analytické upozornění systému</h3><p><b>Nejvyšší analytické skóre má: ${rec.insurer.short||rec.insurer.name}</b> – celkové skóre ${rec.score}/100, krytí ${rec.coverageScore}/100, cena ${rec.priceScore}/100. Režim: ${strategy.label}.</p><p>Toto není finální doporučení ani rozhodnutí. Poradce musí ověřit VPP/DPP/ZPP, sublimity, výluky a skutečné potřeby klienta.</p>${rec.warnings.length?`<p><b>Kritické body k ověření:</b><br>${rec.warnings.map(x=>'• '+x).join('<br>')}</p>`:(rec.missing.length?`<p><b>Body k ověření:</b> ${rec.missing.join(', ')}</p>`:'<p>U nabídky s nejvyšším skóre nejsou zatím evidována nesplněná hlavní rizika.</p>')}</div>` : '';
  $('comparisonDoc').innerHTML = `<h2>Porovnání nabídek</h2><p class="muted">Srovnání pracuje s jednotným názvoslovím ASTORIE. U každé položky zůstává původní název z nabídky pojišťovny a zdroj ve VPP/DPP, aby poradce mohl vše ověřit.</p>${recommendation}<h3>Základní parametry</h3><table><tbody>${head}${summaryRows}</tbody></table><h3>Krytí rizik + zdroje</h3><table><tbody>${head}${riskRows}</tbody></table>`;
}
function slug(v){ return (v||'').replaceAll('ě','e').replaceAll('š','s').replaceAll('č','c').replaceAll('ř','r').replaceAll('ž','z').replaceAll('ý','y').replaceAll('á','a').replaceAll('í','i').replaceAll('é','e').replaceAll('ů','u').replaceAll('ú','u').replace(/\s+/g,'-'); }


function coverageLabel(stateVal){
  const st=(stateVal||'nevyhodnoceno').toLowerCase();
  if(st==='splněno') return 'splněno';
  if(st==='částečně') return 'částečně splněno';
  if(st==='výluka') return 'výluka / nekryto';
  if(st==='nesplněno') return 'nesplněno';
  return 'nutno ověřit';
}
function buildAdvisoryAlerts(){
  const insurers=selectedInsurers();
  const alerts=[];
  activeRisks().forEach(r=>{
    const m=getRiskModel(r.id,state.activity?.code);
    insurers.forEach(i=>{
      const c=state.offers[i.id]?.coverages?.[r.id]||{};
      const st=(c.state||'').toLowerCase();
      const critical=['kritická','vysoká'].includes((m.criticality||'').toLowerCase());
      if(critical && (!st || st==='nesplněno' || st==='výluka')) alerts.push(`${i.short||i.name}: ${r.name} – ${coverageLabel(st)}. ${m.recommendation||m.warning_text||'Doporučujeme ověřit s pojišťovnou a doplnit zdroj.'}`);
      if(critical && st==='částečně') alerts.push(`${i.short||i.name}: ${r.name} – krytí pouze částečně. Ověřit limit, sublimit, spoluúčast a výluky.`);
    });
  });
  return alerts;
}
function renderClientReport(){
  collectForm(); collectOffers(true);
  const insurers=selectedInsurers();
  const client=state.client||{};
  const q=state.questionnaire||{};
  const activity=state.activity||{};
  const risks=activeRisks();
  if($('advisorReportNote')) $('advisorReportNote').value = state.report?.advisor_note || '';
  if($('clientSelectedOffer')) $('clientSelectedOffer').value = state.report?.client_selected_offer || '';
  if($('clientChoiceReason')) $('clientChoiceReason').value = state.report?.client_choice_reason || '';
  if(!insurers.length){ $('clientReportDoc').innerHTML='<h2>Srovnávací zpráva</h2><p class="muted">Nejdříve vyber pojišťovny v poptávce.</p>'; return; }
  const mode = $('reportMode')?.value || 'internal';
  const isClientMode = mode === 'client';
  const alerts=buildAdvisoryAlerts();
  const summaryRows = insurers.map(i=>{
    const o=state.offers[i.id]||{}; const ql=offerQuality(i);
    return `<tr><td><b>${i.short||i.name}</b><br><span class="muted">${i.name||''}</span></td><td>${o.status||'čekáme na nabídku'}</td><td>${formatMoneyMaybe(o.premium)}</td><td>${formatMoneyMaybe(o.deductible)}</td><td>${ql.verdict}<br><small>analytické skóre ${ql.score}/100</small></td><td>${o.note||'—'}</td></tr>`;
  }).join('');
  const riskRows = risks.map(r=>{
    const m=getRiskModel(r.id,state.activity?.code);
    return `<tr><td><b>${r.name}</b><br><small>${m.obligation||'doporučené'} · ${m.criticality||'—'} · limit: ${formatMoneyMaybe(r.limit||m.default_limit)}</small></td>${insurers.map(i=>{ const c=state.offers[i.id]?.coverages?.[r.id]||{}; return `<td><b class="cov ${slug(c.state)}">${coverageLabel(c.state)}</b><br>${c.limit?formatMoneyMaybe(c.limit):'limit neuveden'}${c.original?`<br><small>Název v nabídce: ${c.original}</small>`:''}${c.source?`<br><small>Zdroj: ${c.source}</small>`:''}${c.note?`<br><span class="muted">${c.note}</span>`:''}</td>`; }).join('')}</tr>`;
  }).join('');
  const alertsHtml = isClientMode
    ? (alerts.length ? '<p>U některých variant byly identifikovány rozdíly v rozsahu krytí, limitech nebo výlukách. Tyto body budou s klientem projednány před výběrem finální varianty.</p>' : '<p>V zadaných podkladech nebyly evidovány zásadní rozdíly vyžadující zvláštní upozornění. Přesto je nutné finální variantu vždy projednat s klientem.</p>')
    : (alerts.length ? `<ul>${alerts.map(a=>`<li>${a}</li>`).join('')}</ul>` : '<p>V aktuálně zadaných datech nejsou evidována kritická upozornění. To nenahrazuje kontrolu nabídky, VPP/DPP/ZPP a případných výluk.</p>');
  const selected = state.report?.client_selected_offer || 'bude doplněno po projednání s klientem';
  const reason = state.report?.client_choice_reason || 'bude doplněno po projednání s klientem';
  $('clientReportDoc').innerHTML = `
    <h2>Srovnávací zpráva k nabídkám pojištění</h2>
    <p class="muted">${isClientMode ? 'Tento dokument shrnuje obdržené nabídky a hlavní rozdíly v rozsahu krytí, limitech a spoluúčastech. Slouží jako podklad pro společné projednání variant s klientem.' : 'Tento dokument je pracovní analytický podklad pro poradce. Aplikace strukturuje nabídky, upozorňuje na rozdíly a uvádí dostupné zdroje. Finální doporučení a volbu řešení potvrzuje poradce s klientem.'}</p>
    <h3>1. Identifikace klienta</h3>
    <table><tbody>
      <tr><td>Klient</td><td><b>${client.name||'—'}</b></td></tr>
      <tr><td>IČO</td><td>${client.ico||'—'}</td></tr>
      <tr><td>Činnost / typ klienta</td><td>${activity.name||'—'}</td></tr>
      <tr><td>Obrat / zaměstnanci</td><td>${q.turnover||'—'} / ${q.employees||'—'}</td></tr>
      <tr><td>Územní rozsah / export</td><td>${q.territory||'—'} / ${q.export_info||'—'}</td></tr>
      <tr><td>Poradce</td><td>${state.adviser?.name||'—'} (${state.adviser?.email||'—'})</td></tr>
    </tbody></table>
    <h3>2. Přehled nabídek</h3>
    <table><thead><tr><th>Pojišťovna</th><th>Stav</th><th>Roční pojistné</th><th>Spoluúčast</th><th>Analytické vyhodnocení</th><th>Poznámka</th></tr></thead><tbody>${summaryRows}</tbody></table>
    <h3>3. Porovnání krytí rizik</h3>
    <table><thead><tr><th>Riziko / požadavek</th>${insurers.map(i=>`<th>${i.short||i.name}</th>`).join('')}</tr></thead><tbody>${riskRows}</tbody></table>
    <h3>4. ${isClientMode ? 'Hlavní rozdíly k projednání' : 'Upozornění k ověření poradcem'}</h3>
    <div class="warning-list">${alertsHtml}</div>
    <h3>5. Další postup</h3>
    <p><b>Varianta zvolená klientem:</b> ${selected}</p>
    <p><b>Důvod volby klienta:</b> ${reason}</p>
    <p><b>Závěr poradce:</b> ${state.report?.advisor_note || 'bude doplněno poradcem po projednání s klientem.'}</p>
    ${isClientMode ? '<div class="client-note"><b>Poznámka:</b> Finální varianta bude zvolena po projednání rozsahu krytí, limitů, spoluúčastí a pojistného s klientem.</div>' : '<div class="legal-note"><b>Interní upozornění:</b> Výstup aplikace je analytická pomůcka. Nenahrazuje odborné posouzení poradcem, kontrolu pojistných podmínek ani záznam z jednání. Finální doporučení klientovi musí vycházet z jeho požadavků, cílů a potřeb.</div>'}
  `;
}

function escapeHtmlPdf(v){
  return String(v ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}
function formatDateForPdf(){
  try { return new Date().toLocaleDateString('cs-CZ', {day:'2-digit', month:'2-digit', year:'numeric'}); } catch(e){ return ''; }
}
function buildPdfTitlePage(){
  const client = state.client || {};
  const activity = state.activity || {};
  const adviser = state.adviser || {};
  const inquiryId = state.id ? ('#' + state.id) : 'rozpracovaná poptávka';
  return `
    <section class="pdf-cover">
      <div class="pdf-cover-top">
        <div class="pdf-cover-brand-mark">ASTORIE</div>
        <img class="pdf-cover-logo" src="${location.origin}/static/logo_astorie.png" alt="ASTORIE">
      </div>
      <div class="pdf-cover-main">
        <div class="pdf-kicker">Klientský výstup</div>
        <h1>Návrh a porovnání pojištění</h1>
        <p class="pdf-subtitle">Přehled nabídek připravený na základě poptávky klienta.</p>
        <div class="pdf-meta-grid">
          <div><span>Klient</span><strong>${escapeHtmlPdf(client.name || '—')}</strong></div>
          <div><span>Činnost</span><strong>${escapeHtmlPdf(activity.name || '—')}</strong></div>
          <div><span>ID poptávky</span><strong>${escapeHtmlPdf(inquiryId)}</strong></div>
          <div><span>Datum zpracování</span><strong>${formatDateForPdf()}</strong></div>
          <div><span>Poradce</span><strong>${escapeHtmlPdf(adviser.name || '—')}</strong></div>
          <div><span>Společnost</span><strong>ASTORIE a.s.</strong></div>
        </div>
      </div>
      <div class="pdf-cover-footer">
        Tento dokument je určen jako podklad pro projednání návrhu pojištění s klientem. Finální rozsah pojištění je vždy sjednáván podle potřeb, požadavků a rozhodnutí klienta.
      </div>
    </section>`;
}
function printClientPdfReport(){
  const oldMode = $('reportMode') ? $('reportMode').value : null;
  if($('reportMode')) $('reportMode').value = 'client';
  renderClientReport();
  const reportHtml = $('clientReportDoc')?.innerHTML || '<p>Zpráva zatím není vygenerována.</p>';
  if($('reportMode') && oldMode) $('reportMode').value = oldMode;
  const win = window.open('', '_blank');
  if(!win){ alert('Prohlížeč zablokoval otevření tiskového okna. Povolte vyskakovací okna pro tuto aplikaci.'); return; }
  const html = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>ASTORIE – PDF zpráva klientovi</title>
  <style>
    @page { size: A4; margin: 16mm 15mm 16mm 15mm; }
    *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#003D4C;margin:0;background:white;font-size:12.5px;line-height:1.45} table{width:100%;border-collapse:collapse;margin:10px 0 18px} th,td{border:1px solid #d8e8eb;padding:7px 8px;text-align:left;vertical-align:top} th{background:#edf6f7;color:#003D4C} h1,h2,h3{color:#003D4C;margin:16px 0 8px} h1{font-size:28px} h2{font-size:22px} h3{font-size:15px}.muted{color:#55717a}.cov,.workflow-badge{border-radius:999px;padding:3px 7px;background:#eef6f7;display:inline-block}.splněno{background:#d9f5e3;color:#116b36}.nesplněno,.výluka{background:#fde2e1;color:#9a1d16}.částečně{background:#fff2c7;color:#775600}.client-note{border-left:4px solid #FC4C02;background:#fff7f0;padding:10px 12px;margin-top:10px}.pdf-cover{min-height:267mm;position:relative;padding:4mm 2mm;color:#003D4C;page-break-after:always}.pdf-cover-top{display:flex;justify-content:space-between;align-items:flex-start}.pdf-cover-brand-mark{font-size:12px;letter-spacing:4px;color:#FC4C02;font-weight:800;text-transform:uppercase}.pdf-cover-logo{height:58px;object-fit:contain}.pdf-cover-main{margin-top:45mm;border-top:7px solid #FC4C02;padding-top:22mm}.pdf-kicker{text-transform:uppercase;letter-spacing:3px;color:#FC4C02;font-weight:900;font-size:13px}.pdf-cover h1{font-size:38px;line-height:1.08;margin:10px 0 14px;color:#003D4C;max-width:150mm}.pdf-subtitle{font-size:17px;color:#55717a;margin-bottom:22mm}.pdf-meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;max-width:170mm}.pdf-meta-grid div{border:1px solid #d8e8eb;border-radius:10px;padding:10px 12px}.pdf-meta-grid span{display:block;color:#55717a;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}.pdf-meta-grid strong{font-size:15px;color:#003D4C}.pdf-cover-footer{position:absolute;left:2mm;right:2mm;bottom:8mm;border-top:1px solid #d8e8eb;padding-top:8mm;color:#55717a;font-size:12px}.pdf-report{padding-top:0}.pdf-report-header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #003D4C;padding-bottom:8px;margin-bottom:14px}.pdf-report-header img{height:34px}.pdf-report-title{font-weight:900;color:#003D4C}.legal-note{display:none!important}@media print{button{display:none!important}.pdf-cover{page-break-after:always}.pdf-report{page-break-before:auto}}
  </style></head><body>${buildPdfTitlePage()}<section class="pdf-report"><div class="pdf-report-header"><div class="pdf-report-title">Srovnávací zpráva k nabídkám pojištění</div><img src="${location.origin}/static/logo_astorie.png" alt="ASTORIE"></div>${reportHtml}</section><script>window.onload=function(){setTimeout(function(){window.print();},300);};</script></body></html>`;
  win.document.open(); win.document.write(html); win.document.close();
}

function copyClientReport(){
  renderClientReport();
  const t = $('clientReportDoc')?.innerText || '';
  navigator.clipboard.writeText(t).then(()=>alert('Srovnávací zpráva byla zkopírována.'));
}

async function saveInquiry(){
  collectForm();
  $('saveStatus').textContent='Ukládám...';
  try{
    const res = await api('/api/inquiries', {method:'POST', body:JSON.stringify(state)});
    if(res.id){ state.id=res.id; $('inquiryId').value=res.id; }
    state._active = true;
    backupInquiryLocally(state);
    $('saveStatus').textContent=res.message || 'Uloženo. Poptávka je nyní aktivní a všechny sekce pracují s touto poptávkou.';
    updateActiveInquiryBanner();
  }catch(e){
    backupInquiryLocally(state);
    $('saveStatus').textContent='DB chyba, uloženo alespoň lokálně v prohlížeči: '+e.message;
  }
}
function localInquiryBackups(){
  try{return JSON.parse(localStorage.getItem('arh_inquiry_backups')||'[]')}catch(e){return []}
}
function backupInquiryLocally(item){
  const backups=localInquiryBackups();
  const key = item.id ? 'db_'+item.id : 'local_'+Date.now();
  const clean = JSON.parse(JSON.stringify({...item, local_key:key, local_saved_at:new Date().toISOString()}));
  const idx=backups.findIndex(x=>(item.id && x.id===item.id) || x.local_key===key);
  if(idx>=0) backups[idx]=clean; else backups.unshift(clean);
  localStorage.setItem('arh_inquiry_backups', JSON.stringify(backups.slice(0,30)));
}
async function loadInquiries(){
  const target = $('savedInquiryModalList') || $('inquiriesList');
  if($('savedInquiryModal')) $('savedInquiryModal').classList.remove('hidden');
  target.innerHTML='Načítám uložené poptávky...';
  try{
    const res = await api('/api/inquiries');
    const dbItems=(res.items||[]).map(x=>({...x, source:'db'}));
    window.__lastInquiryItems = dbItems;
    const localItems=localInquiryBackups().map(x=>({id:x.id||'', local_key:x.local_key, title:x.title||('Poptávka – '+(x.client?.name||'klient')), client_name:x.client?.name||'', activity_name:x.activity?.name||'', updated_at:x.local_saved_at||'', source:'local'}));
    const seen=new Set();
    const items=[...dbItems,...localItems].filter(i=>{const k=(i.source==='db'?'db_'+i.id:(i.local_key||'')); if(seen.has(k)) return false; seen.add(k); return true;});
    renderInquiryList(items, target);
    if($('inquiriesList') && target!==$('inquiriesList')) renderInquiryList(items, $('inquiriesList'));
  }catch(e){
    const localItems=localInquiryBackups().map(x=>({id:x.id||'', local_key:x.local_key, title:x.title||('Poptávka – '+(x.client?.name||'klient')), client_name:x.client?.name||'', activity_name:x.activity?.name||'', updated_at:x.local_saved_at||'', source:'local'}));
    target.innerHTML='<p class="warning"><b>Databáze se nepodařila načíst.</b><br>'+e.message+'</p>';
    if(localItems.length){ target.innerHTML += '<h3>Lokální záloha v tomto prohlížeči</h3>'; renderInquiryList(localItems, target, true); }
  }
}
function renderInquiryList(items, container, append=false){
  const html = items.length ? items.map(i=>`<div class="item"><div><b>${i.source==='db'?'#'+i.id:'Lokální záloha'} ${i.title||''}</b><br><span class="muted">${i.client_name||''} · ${i.activity_name||''} · ${formatDateTimeCz(i.updated_at)||i.updated_at||''}</span><br><small>Stav: <b>${i.status||'rozpracováno'}</b> · Nabídek: <b>${i.offer_count ?? countOffersFromLocal(i)}</b></small></div><div class="item-actions"><span class="pill">${i.source==='db'?'DB':'lokálně'}</span><button class="secondary" data-id="${i.id||''}" data-local="${i.local_key||''}" data-source="${i.source}">Otevřít</button><button class="ghost delete-inquiry-btn" data-del-id="${i.id||''}" data-local="${i.local_key||''}" data-source="${i.source}">Smazat</button></div></div>`).join('') : '<p class="muted">Zatím nejsou uložené poptávky.</p>';
  if(append) container.innerHTML += html; else container.innerHTML = html;
  container.querySelectorAll('button[data-source]:not(.delete-inquiry-btn)').forEach(b=>b.onclick=()=>openInquiry(b.dataset.id,b.dataset.source,b.dataset.local));
  container.querySelectorAll('.delete-inquiry-btn').forEach(b=>b.onclick=()=>deleteInquiry(b.dataset.delId,b.dataset.source,b.dataset.local));
}
function countOffersFromLocal(i){ try{return Object.keys(i.offers||{}).length}catch(e){return 0} }
async function deleteInquiry(id, source='db', localKey=''){
  if(!confirm('Opravdu chcete smazat tuto poptávku z aktivního přehledu? Tato akce ji nevratně neodstraňuje z auditní historie.')) return;
  try{
    if(source==='local'){
      const backups=localInquiryBackups().filter(x=>x.local_key!==localKey && String(x.id||'')!==String(id||''));
      localStorage.setItem('arh_inquiry_backups', JSON.stringify(backups));
      flashStatus('Lokální poptávka byla odstraněna z tohoto prohlížeče.');
    } else {
      await api('/api/inquiries/'+id+'/delete', {method:'POST', body:JSON.stringify({actor_email:currentUser?.email||'', actor_role:currentUser?.role||''})});
      flashStatus('Poptávka byla odstraněna z aktivního přehledu.');
      if(String(state.id||'')===String(id||'')) closeActiveInquiry();
    }
    renderMyInquiries();
    if(currentUser?.role==='admin') renderAdminInquiries();
    if($('savedInquiryModal') && !$('savedInquiryModal').classList.contains('hidden')) loadInquiries();
  }catch(e){ alert('Poptávku se nepodařilo smazat: '+(e.message||e)); }
}
async function openInquiry(id, source='db', localKey=''){
  if(source==='local'){
    const item=localInquiryBackups().find(x=>x.local_key===localKey || String(x.id||'')===String(id));
    if(!item){ alert('Lokální záloha nebyla nalezena.'); return; }
    applyState(item);
  } else {
    const res = await api('/api/inquiries/'+id);
    applyState(res.item);
  }
  if($('savedInquiryModal')) $('savedInquiryModal').classList.add('hidden');
  showView('inquiryView');
  $('saveStatus').textContent='Poptávka načtena. Nabídky, porovnání a zpráva se nyní vztahují k této aktivní poptávce.';
  updateActiveInquiryBanner();
}
function applyState(s){
  state = {...state, ...s, offers:s.offers||{}};
  state._active = true;
  if((!state.offers || !Object.keys(state.offers).length) && state.id){
    const local = localInquiryBackups().find(x=>String(x.id||'')===String(state.id) && x.offers && Object.keys(x.offers).length);
    if(local){ state.offers = local.offers; $('saveStatus').textContent='Nabídky byly doplněny z lokální zálohy prohlížeče.'; }
  }
  $('inquiryId').value = state.id || '';
  if($('inquiryStatusSelect')) $('inquiryStatusSelect').value = state.status || 'rozpracováno';
  fillAdviser();
  $('clientIco').value=state.client?.ico||''; $('clientName').value=state.client?.name||''; $('clientLegal').value=state.client?.legal_form||''; $('clientAddress').value=state.client?.address||''; $('clientDataBox').value=state.client?.data_box||''; $('clientContact').value=state.client?.contact_person||''; $('clientEmail').value=state.client?.contact_email||''; $('clientPhone').value=state.client?.contact_phone||''; $('clientWeb').value=state.client?.website||'';
  $('insuranceStart').value=state.questionnaire?.insurance_start||''; $('turnover').value=state.questionnaire?.turnover||''; $('employees').value=state.questionnaire?.employees||'';
  setSelectOrCustom('insurancePeriodSelect','insurancePeriodCustom',state.questionnaire?.insurance_period||''); setSelectOrCustom('territorySelect','territoryCustom',state.questionnaire?.territory||''); setSelectOrCustom('exportSelect','exportCustom',state.questionnaire?.export_info||'');
  renderDynamicBlocksFromState();
  const act=state.activity?.code || (CATALOG.activities||[])[0]?.code; if(act) { $('activitySelect').value=act; $('activityProfile').innerHTML=`<h3>${state.activity?.name||''}</h3><p>${state.activity?.description||''}</p>`; }
  renderRisks();
  $('requirementsList').innerHTML=''; (state.additional_requirements||[]).forEach(r=>addRequirement(r));
  $('insurersList').querySelectorAll('input').forEach(cb=>cb.checked=(state.selected_insurers||[]).includes(cb.value));
  renderOffers(); updateAll();
}
function setSelectOrCustom(selectId, customId, value){
  const sel=$(selectId); const exists=Array.from(sel.options).some(o=>o.value===value||o.text===value);
  if(exists) sel.value=value; else {sel.value='custom'; $(customId).value=value;}
}


function statusClass(st){
  const s=(st||'rozpracováno').toLowerCase();
  if(s.includes('uzav')) return 'done';
  if(s.includes('zru')) return 'bad';
  if(s.includes('klient')) return 'client';
  if(s.includes('nabíd')) return 'offers';
  if(s.includes('poji')) return 'sent';
  return 'draft';
}
function updateActiveInquiryBanner(){
  const b=$('activeInquiryBanner'); if(!b) return;
  b.classList.remove('hidden');
  const has=hasActiveInquiryContext();
  b.classList.toggle('no-active', !has);
  if(!has){
    $('activeInquiryTitle').textContent = 'Není vybrána žádná poptávka';
    $('activeInquiryMeta').innerHTML = '<span class="workflow-badge draft">bez aktivního případu</span>';
    if($('activeInquiryHint')) $('activeInquiryHint').textContent = 'Založte novou poptávku nebo otevřete uloženou z přehledu. Návazné sekce se aktivují až po výběru poptávky.';
    if($('inquiryStatusSelect')) $('inquiryStatusSelect').value = 'rozpracováno';
    return;
  }
  const offerCount=Object.keys(state.offers||{}).length;
  const client=state.client?.name || (state.client?.ico ? `IČO ${state.client.ico}` : 'Nová rozpracovaná poptávka');
  const activity=state.activity?.name || 'činnost zatím nevybrána';
  const sourceLabel = state.id ? `DB #${state.id}` : 'rozpracováno – dosud neuloženo do DB';
  $('activeInquiryTitle').textContent = state.id ? `#${state.id} – ${client}` : client;
  $('activeInquiryMeta').innerHTML = `<span class="workflow-badge ${statusClass(state.status)}">${state.status||'rozpracováno'}</span> · ${activity} · Nabídky: ${offerCount} · ${sourceLabel}`;
  if($('activeInquiryHint')) $('activeInquiryHint').textContent = 'Menu vlevo vždy pracuje s touto aktivní poptávkou. Pro stabilní práci ji uložte do DB.';
  if($('inquiryStatusSelect')) $('inquiryStatusSelect').value = state.status || 'rozpracováno';
}
function inquiryMatchesFilters(i, status, search){
  if(status && (i.status||'')!==status) return false;
  if(!search) return true;
  return JSON.stringify(i||{}).toLowerCase().includes(search.toLowerCase().trim());
}
async function getInquiryItems(){
  try{ const res=await api('/api/inquiries'); window.__lastInquiryItems=(res.items||[]).map(x=>({...x,source:'db'})); return window.__lastInquiryItems; }
  catch(e){ return localInquiryBackups().map(x=>({id:x.id||'', local_key:x.local_key, title:x.title||('Poptávka – '+(x.client?.name||'klient')), client_name:x.client?.name||'', activity_name:x.activity?.name||'', adviser_name:x.adviser?.name||'', adviser_email:x.adviser?.email||'', status:x.status||'rozpracováno', offer_count:Object.keys(x.offers||{}).length, updated_at:x.local_saved_at||'', source:'local'})); }
}

function workflowTilesHtml(items){
  const statuses=['rozpracováno','odesláno pojišťovnám','nabídky přijaty','odesláno klientovi','uzavřeno','zrušeno'];
  const counts=Object.fromEntries(statuses.map(s=>[s,0]));
  (items||[]).forEach(i=>{ const st=i.status||'rozpracováno'; counts[st]=(counts[st]||0)+1; });
  return `<div class="tile-row compact">${statuses.map(st=>`<div class="workflow-tile ${statusClass(st)}"><div>${st}</div><strong>${counts[st]||0}</strong></div>`).join('')}</div>`;
}
function workflowTableHtml(items, showAdvisor){
  if(!items.length) return '<div class="admin-empty">Žádná poptávka neodpovídá filtru.</div>';
  return `<table><thead><tr><th>ID</th><th>Klient</th><th>Činnost</th>${showAdvisor?'<th>Poradce</th>':''}<th>Stav</th><th>Nabídky</th><th>Poslední změna</th><th>Akce</th></tr></thead><tbody>${items.map(i=>`<tr><td>${i.source==='db'?'#'+i.id:'lokální'}</td><td><b>${i.client_name||i.title||'Bez názvu'}</b><br><small>${i.ico||''}</small></td><td>${i.activity_name||'—'}</td>${showAdvisor?`<td>${i.adviser_name||'—'}<br><small>${i.adviser_email||''}</small></td>`:''}<td><span class="workflow-badge ${statusClass(i.status)}">${i.status||'rozpracováno'}</span></td><td>${i.offer_count ?? 0}</td><td>${formatDateTimeCz(i.updated_at)||'—'}</td><td><button class="secondary small-open" data-id="${i.id||''}" data-local="${i.local_key||''}" data-source="${i.source||'db'}">Otevřít</button><button class="ghost delete-inquiry-btn" data-del-id="${i.id||''}" data-local="${i.local_key||''}" data-source="${i.source||'db'}">Smazat</button></td></tr>`).join('')}</tbody></table>`;
}
async function renderMyInquiries(){
  const el=$('myInquiriesTable'); if(!el) return;
  el.innerHTML='Načítám...';
  const items=(await getInquiryItems()).filter(i=>(i.adviser_email||'').toLowerCase()===(currentUser?.email||'').toLowerCase() || currentUser?.role==='admin');
  const status=$('myInquiryStatusFilter')?.value||''; const search=$('myInquirySearch')?.value||'';
  const filtered=items.filter(i=>inquiryMatchesFilters(i,status,search));
  if($('myInquiryTiles')) $('myInquiryTiles').innerHTML=workflowTilesHtml(items);
  el.innerHTML=workflowTableHtml(filtered,false);
  el.querySelectorAll('button[data-source]:not(.delete-inquiry-btn)').forEach(b=>b.onclick=()=>openInquiry(b.dataset.id,b.dataset.source,b.dataset.local));
  el.querySelectorAll('.delete-inquiry-btn').forEach(b=>b.onclick=()=>deleteInquiry(b.dataset.delId,b.dataset.source,b.dataset.local));
}
async function renderAdminInquiries(){
  const el=$('adminInquiriesTable'); if(!el) return;
  el.innerHTML='Načítám...';
  const status=$('adminInquiryStatusFilter')?.value||''; const search=$('adminInquirySearch')?.value||'';
  const items=(await getInquiryItems()).filter(i=>inquiryMatchesFilters(i,status,search));
  if($('adminInquiryTiles')) $('adminInquiryTiles').innerHTML=workflowTilesHtml(items);
  if($('adminInquiryCount')) $('adminInquiryCount').textContent=`Zobrazeno ${items.length} poptávek`;
  el.innerHTML=workflowTableHtml(items,true);
  el.querySelectorAll('button[data-source]:not(.delete-inquiry-btn)').forEach(b=>b.onclick=()=>openInquiry(b.dataset.id,b.dataset.source,b.dataset.local));
  el.querySelectorAll('.delete-inquiry-btn').forEach(b=>b.onclick=()=>deleteInquiry(b.dataset.delId,b.dataset.source,b.dataset.local));
}

function showAdminTab(id){
  document.querySelectorAll('.admin-section').forEach(x=>x.classList.add('hidden'));
  $(id).classList.remove('hidden');
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.toggle('active', t.dataset.adminTab===id));
}
function renderAdmin(){ ensureAdminFilters(); renderAdminInquiries(); renderAdminInsurers(); renderAdminAdvisers(); renderAdminActivities(); renderAdminRisks(); renderAdminReqTypes(); renderAdminDictionary(); renderAdminPolicyRefs(); renderRiskModelAdmin(); enhanceAdminDetailButtons(); }
function renderAdminInsurers(){
  ensureAdminFilters();
  const search = adminFilterText('adminInsurerSearch');
  const list = (CATALOG.insurers||[]).map((i,idx)=>({...i,_idx:idx})).filter(i=>rowMatchesSearch(i,search));
  const rows = list.map((i)=>`<div class="admin-row insurer" data-idx="${i._idx}"><input class="adm-id" value="${i.id||''}" placeholder="id"><input class="adm-name" value="${i.name||''}" placeholder="název pojišťovny"><input class="adm-short" value="${i.short||''}" placeholder="zkratka"><select class="adm-active"><option value="true" ${i.active?'selected':''}>aktivní</option><option value="false" ${!i.active?'selected':''}>neaktivní</option></select><button class="secondary adm-del">Smazat</button></div>`).join('');
  $('insurersAdminTable').innerHTML = `<div class="admin-row insurer admin-head"><div>ID</div><div>Název</div><div>Zkratka</div><div>Stav</div><div></div></div>${rows || '<div class="admin-empty">Žádná pojišťovna neodpovídá filtru.</div>'}`;
  $('insurersAdminTable').querySelectorAll('.adm-del').forEach(btn=>btn.onclick=()=>{ CATALOG.insurers.splice(+btn.closest('.admin-row').dataset.idx,1); renderAdminInsurers(); renderCatalogs(); updateAll(); });
  $('insurersAdminTable').querySelectorAll('input,select').forEach(el=>el.oninput=collectAdminInsurers);
  enhanceAdminDetailButtons();
}
function collectAdminInsurers(){
  CATALOG.insurers = Array.from(document.querySelectorAll('#insurersAdminTable .admin-row.insurer:not(.admin-head)')).map(row=>({id:row.querySelector('.adm-id').value.trim() || ('ins_'+Date.now()), name:row.querySelector('.adm-name').value.trim(), short:row.querySelector('.adm-short').value.trim(), active:row.querySelector('.adm-active').value==='true'}));
  renderCatalogs(); updateAll();
}
function addAdminInsurer(){ collectAdminInsurers(); CATALOG.insurers.push({id:'nova_'+Date.now(), name:'Nová pojišťovna', short:'', active:true}); renderAdminInsurers(); renderCatalogs(); }
function renderAdminAdvisers(){
  ensureAdminFilters();
  const search = adminFilterText('adminAdviserSearch');
  const role = $('adminAdviserRoleFilter')?.value || '';
  const list = (CATALOG.advisers||[]).map((a,idx)=>({...a,_idx:idx})).filter(a=>(!role || a.role===role) && rowMatchesSearch(a,search));
  const rows = list.map((a)=>`<div class="admin-row adviser" data-idx="${a._idx}"><input class="adm-email" value="${a.email||''}" placeholder="email"><input class="adm-name" value="${a.name||''}" placeholder="jméno"><select class="adm-role"><option value="advisor" ${a.role!=='admin'?'selected':''}>poradce</option><option value="admin" ${a.role==='admin'?'selected':''}>admin</option></select><input class="adm-company" value="${a.company||'ASTORIE a.s.'}" placeholder="společnost"><input class="adm-reg" value="${a.registration||''}" placeholder="registrace"><button class="secondary adm-del">Smazat</button></div>`).join('');
  $('advisersAdminTable').innerHTML = `<div class="admin-row adviser admin-head"><div>E-mail</div><div>Jméno</div><div>Role</div><div>Společnost</div><div>Status</div><div></div></div>${rows || '<div class="admin-empty">Žádný poradce neodpovídá filtru.</div>'}`;
  $('advisersAdminTable').querySelectorAll('.adm-del').forEach(btn=>btn.onclick=()=>{ CATALOG.advisers.splice(+btn.closest('.admin-row').dataset.idx,1); renderAdminAdvisers(); });
  $('advisersAdminTable').querySelectorAll('input,select').forEach(el=>el.oninput=collectAdminAdvisers);
  enhanceAdminDetailButtons();
}
function collectAdminAdvisers(){
  const oldByEmail = Object.fromEntries((CATALOG.advisers||[]).map(a=>[a.email,a]));
  CATALOG.advisers = Array.from(document.querySelectorAll('#advisersAdminTable .admin-row.adviser:not(.admin-head)')).map(row=>{ const email=row.querySelector('.adm-email').value.trim(); return {email, name:row.querySelector('.adm-name').value.trim(), role:row.querySelector('.adm-role').value, company:row.querySelector('.adm-company').value.trim(), registration:row.querySelector('.adm-reg').value.trim(), password:(oldByEmail[email]?.password || 'Astorie2026!')}; });
}
function addAdminAdviser(){ collectAdminAdvisers(); CATALOG.advisers.push({email:'novy.poradce@astorie.local', name:'Nový poradce', role:'advisor', company:'ASTORIE a.s.', registration:'samostatný zprostředkovatel', password:'Astorie2026!'}); renderAdminAdvisers(); }
function renderAdminReqTypes(){
  ensureAdminFilters();
  const search = adminFilterText('adminReqTypeSearch');
  const list = (CATALOG.requirementTypes||[]).map((r,idx)=>({...r,_idx:idx})).filter(r=>rowMatchesSearch(r,search));
  const rows = list.map((r)=>`<div class="admin-row reqtype" data-idx="${r._idx}"><input class="adm-id" value="${r.id||''}" placeholder="id"><input class="adm-name" value="${r.name||''}" placeholder="název"><button class="secondary adm-del">Smazat</button></div>`).join('');
  $('reqTypesAdminTable').innerHTML = `<div class="admin-row reqtype admin-head"><div>ID</div><div>Název</div><div></div></div>${rows || '<div class="admin-empty">Žádný typ neodpovídá filtru.</div>'}`;
  $('reqTypesAdminTable').querySelectorAll('.adm-del').forEach(btn=>btn.onclick=()=>{ CATALOG.requirementTypes.splice(+btn.closest('.admin-row').dataset.idx,1); renderAdminReqTypes(); });
  $('reqTypesAdminTable').querySelectorAll('input').forEach(el=>el.oninput=collectAdminReqTypes);
  enhanceAdminDetailButtons();
}
function collectAdminReqTypes(){ CATALOG.requirementTypes = Array.from(document.querySelectorAll('#reqTypesAdminTable .admin-row.reqtype:not(.admin-head)')).map(row=>({id:row.querySelector('.adm-id').value.trim() || ('typ_'+Date.now()), name:row.querySelector('.adm-name').value.trim()})); }
function addAdminReqType(){ collectAdminReqTypes(); CATALOG.requirementTypes.push({id:'novy_'+Date.now(), name:'Nový typ doplňující informace'}); renderAdminReqTypes(); }

function renderRiskModelAdmin(){
  ensureAdminFilters();
  const activity = $('adminRiskModelActivityFilter')?.value || '';
  const search = adminFilterText('adminRiskModelSearch');
  const all = (CATALOG.riskModel||[]).map((m,idx)=>({...m,_idx:idx}));
  const filtered = all.filter(m=>(!activity || m.activity_code===activity) && rowMatchesSearch(m,search));
  if($('adminRiskModelCount')) $('adminRiskModelCount').textContent = `Zobrazeno ${filtered.length} z ${all.length} pravidel`;
  const rows = filtered.map((m)=>`<div class="admin-row riskmodel" data-idx="${m._idx}">
    <input class="rm-act" value="${m.activity_code||''}" placeholder="kód činnosti">
    <input class="rm-risk" value="${m.risk_id||''}" placeholder="id rizika">
    <input class="rm-name" value="${m.risk_name||''}" placeholder="název rizika">
    <select class="rm-critical"><option ${m.criticality==='nízká'?'selected':''}>nízká</option><option ${m.criticality==='střední'?'selected':''}>střední</option><option ${m.criticality==='vysoká'?'selected':''}>vysoká</option><option ${m.criticality==='kritická'?'selected':''}>kritická</option></select>
    <select class="rm-obligation"><option ${m.obligation==='doporučené'?'selected':''}>doporučené</option><option ${m.obligation==='důležité'?'selected':''}>důležité</option><option ${m.obligation==='nutné'?'selected':''}>nutné</option><option ${m.obligation==='povinné'?'selected':''}>povinné</option></select>
    <input class="rm-weight" type="number" min="0" max="150" value="${m.weight||50}" placeholder="váha">
    <input class="rm-limit" value="${m.recommended_limit||''}" placeholder="doporučený limit">
    <textarea class="rm-rec" placeholder="text doporučení">${m.recommendation_text||''}</textarea>
    <button type="button" class="secondary adm-del">Smazat</button>
  </div>`).join('');
  $('riskModelAdminTable').innerHTML = `<div class="admin-row riskmodel admin-head"><div>Činnost</div><div>Riziko ID</div><div>Název</div><div>Kritičnost</div><div>Povinnost</div><div>Váha</div><div>Limit</div><div>Doporučení</div><div></div></div>${rows || '<div class="admin-empty">Žádné pravidlo neodpovídá filtru.</div>'}`;
  $('riskModelAdminTable').querySelectorAll('.adm-del').forEach(btn=>btn.onclick=()=>{ CATALOG.riskModel.splice(+btn.closest('.admin-row').dataset.idx,1); renderRiskModelAdmin(); updateAll(); });
  $('riskModelAdminTable').querySelectorAll('input,select,textarea').forEach(el=>el.oninput=collectRiskModelAdmin);
  enhanceAdminDetailButtons();
}
function collectRiskModelAdmin(){
  CATALOG.riskModel = Array.from(document.querySelectorAll('#riskModelAdminTable .admin-row.riskmodel:not(.admin-head)')).map(row=>({
    activity_code: row.querySelector('.rm-act').value.trim(),
    risk_id: row.querySelector('.rm-risk').value.trim(),
    risk_name: row.querySelector('.rm-name').value.trim(),
    criticality: row.querySelector('.rm-critical').value,
    obligation: row.querySelector('.rm-obligation').value,
    weight: Number(row.querySelector('.rm-weight').value || 50),
    recommended_limit: row.querySelector('.rm-limit').value.trim(),
    evaluation_type: 'kombinace',
    recommendation_text: row.querySelector('.rm-rec').value.trim(),
    warning_text: 'Ověřte krytí, limit, sublimit, výluky a zdroj v pojistných podmínkách.',
    active: true
  }));
}
function addRiskModelRule(){
  collectRiskModelAdmin();
  const act=$('adminRiskModelActivityFilter')?.value || state.activity?.code || 'stavba';
  CATALOG.riskModel.push({activity_code:act, risk_id:'nove_riziko', risk_name:'Nové riziko', criticality:'střední', obligation:'doporučené', weight:50, recommended_limit:'', evaluation_type:'kombinace', recommendation_text:'', warning_text:'Ověřit v podmínkách.', active:true});
  renderRiskModelAdmin();
}

async function saveAdminCatalogs(){
  collectAdminInsurers(); collectAdminAdvisers(); collectAdminActivities(); collectAdminRisks(); collectAdminReqTypes(); collectAdminDictionary(); collectAdminPolicyRefs(); collectRiskModelAdmin();
  $('adminSaveStatus').textContent='Ukládám do databáze...';
  try{
    const res = await api('/api/admin/catalogs', {method:'POST', body:JSON.stringify({actor_email:state.adviser?.email||'', insurers:CATALOG.insurers, advisers:CATALOG.advisers, activities:CATALOG.activities, risks:CATALOG.risks, requirementTypes:CATALOG.requirementTypes, coverageDictionary:CATALOG.coverageDictionary, policyReferences:CATALOG.policyReferences, riskModel:CATALOG.riskModel})});
    $('adminSaveStatus').textContent=res.message || 'Uloženo.';
    renderCatalogs(); renderOffers(); updateAll();
  }catch(e){ $('adminSaveStatus').textContent='Chyba: '+e.message; }
}


function activityOptionsHtml(selected='', includeAll=true){
  const opts = (CATALOG.activities||[]).map(a=>`<option value="${a.code||''}" ${selected===(a.code||'')?'selected':''}>${a.name||a.code||''}</option>`).join('');
  return (includeAll?'<option value="">Všechny činnosti</option>':'') + opts;
}
function adminFilterText(id){ return ($(id)?.value || '').toLowerCase().trim(); }
function ensureAdminFilters(){
  const bind = (id, fn)=>{ const el=$(id); if(el && el.dataset.bound!=='1'){ el.dataset.bound='1'; el.oninput=fn; el.onchange=fn; }};
  if($('adminRiskActivityFilter')) $('adminRiskActivityFilter').innerHTML = activityOptionsHtml($('adminRiskActivityFilter').value||'', true);
  if($('adminRiskModelActivityFilter')) $('adminRiskModelActivityFilter').innerHTML = activityOptionsHtml($('adminRiskModelActivityFilter').value||'', true);
  if($('adminPolicyInsurerFilter')) $('adminPolicyInsurerFilter').innerHTML = '<option value="">Všechny pojišťovny</option>' + (CATALOG.insurers||[]).map(i=>`<option value="${i.id||''}" ${($('adminPolicyInsurerFilter').value||'')===(i.id||'')?'selected':''}>${i.short||''} – ${i.name||''}</option>`).join('');
  bind('adminInsurerSearch', renderAdminInsurers);
  bind('adminAdviserSearch', renderAdminAdvisers);
  bind('adminAdviserRoleFilter', renderAdminAdvisers);
  bind('adminReqTypeSearch', renderAdminReqTypes);
  bind('adminActivitySearch', renderAdminActivities);
  bind('adminRiskActivityFilter', renderAdminRisks);
  bind('adminRiskSearch', renderAdminRisks);
  bind('adminRiskModelActivityFilter', renderRiskModelAdmin);
  bind('adminRiskModelSearch', renderRiskModelAdmin);
  bind('adminDictionarySearch', renderAdminDictionary);
  bind('adminPolicyInsurerFilter', renderAdminPolicyRefs);
  bind('adminPolicySearch', renderAdminPolicyRefs);
}
function rowMatchesSearch(obj, search){
  if(!search) return true;
  return JSON.stringify(obj||{}).toLowerCase().includes(search);
}
function saveCurrentWorkLocally(){
  try{ collectForm(); collectOffers(true); backupInquiryLocally(state); }catch(e){ console.warn('Lokální záloha se nepodařila', e); }
}
let offerAutosaveTimer=null;
function scheduleOfferAutosave(){
  saveCurrentWorkLocally();
  if(!state.id) return;
  clearTimeout(offerAutosaveTimer);
  offerAutosaveTimer=setTimeout(async()=>{
    try{ collectForm(); collectOffers(true); await api('/api/inquiries', {method:'POST', body:JSON.stringify(state)}); $('saveStatus').textContent='Nabídky byly automaticky uloženy.'; }
    catch(e){ $('saveStatus').textContent='Nabídky jsou v lokální záloze. DB uložení selhalo: '+e.message; }
  }, 900);
}

function renderAdminActivities(){
  ensureAdminFilters();
  const search = adminFilterText('adminActivitySearch');
  const base = (CATALOG.activities||[]).map((a,idx)=>({...a,_idx:idx})).filter(a=>rowMatchesSearch(a,search));
  const rows = base.map((a)=>`<div class="admin-row activity" data-idx="${a._idx}">
    <input class="act-code" value="${a.code||''}" placeholder="kód">
    <input class="act-name" value="${a.name||''}" placeholder="název činnosti">
    <textarea class="act-desc" placeholder="laický popis pro poradce">${a.description||''}</textarea>
    <input class="act-risk" value="${a.risk_level||''}" placeholder="rizikovost">
    <input class="act-limit" value="${a.limit_hint||''}" placeholder="orientační limit">
    <button type="button" class="secondary adm-del">Smazat</button>
  </div>`).join('');
  const el=$('activitiesAdminTable'); if(!el) return;
  el.innerHTML = `<div class="admin-row activity admin-head"><div>Kód</div><div>Název</div><div>Popis</div><div>Rizikovost</div><div>Limit</div><div></div></div>${rows || '<div class="admin-empty">Žádný záznam neodpovídá filtru.</div>'}`;
  el.querySelectorAll('.adm-del').forEach(btn=>btn.onclick=()=>{ CATALOG.activities.splice(+btn.closest('.admin-row').dataset.idx,1); renderAdminActivities(); renderCatalogs(); updateAll(); });
  el.querySelectorAll('input,textarea').forEach(x=>x.oninput=collectAdminActivities);
  enhanceAdminDetailButtons();
}
function collectAdminActivities(){
  const el=$('activitiesAdminTable'); if(!el) return;
  CATALOG.activities = Array.from(el.querySelectorAll('.admin-row.activity:not(.admin-head)')).map(row=>({
    code: row.querySelector('.act-code').value.trim() || ('typ_'+Date.now()),
    name: row.querySelector('.act-name').value.trim(),
    description: row.querySelector('.act-desc').value.trim(),
    risk_level: row.querySelector('.act-risk').value.trim(),
    limit_hint: row.querySelector('.act-limit').value.trim()
  })).filter(a=>a.name || a.code);
}
function addAdminActivity(){ collectAdminActivities(); CATALOG.activities.push({code:'novy_typ_'+Date.now(), name:'Nový typ klienta', description:'Doplňte popis činnosti pro poradce.', risk_level:'střední', limit_hint:''}); renderAdminActivities(); renderCatalogs(); }

function allRiskRows(){
  const out=[]; const risks=CATALOG.risks||{};
  Object.keys(risks).forEach(activity_code => (risks[activity_code]||[]).forEach(r=>out.push({...r, activity_code})));
  return out;
}
function setRisksFromRows(rows){
  const grouped={};
  rows.forEach(r=>{ const act=r.activity_code||state.activity?.code||'univerzal'; if(!grouped[act]) grouped[act]=[]; const copy={...r}; delete copy.activity_code; grouped[act].push(copy); });
  CATALOG.risks = grouped;
}
function renderAdminRisks(){
  ensureAdminFilters();
  const activity = $('adminRiskActivityFilter')?.value || '';
  const search = adminFilterText('adminRiskSearch');
  const all = allRiskRows().map((r,idx)=>({...r,_idx:idx}));
  const filtered = all.filter(r=>(!activity || r.activity_code===activity) && rowMatchesSearch(r,search));
  if($('adminRiskCount')) $('adminRiskCount').textContent = `Zobrazeno ${filtered.length} z ${all.length} rizik`;
  const rows = filtered.map((r)=>`<div class="admin-row riskdef" data-idx="${r._idx}">
    <input class="risk-act" value="${r.activity_code||''}" placeholder="kód činnosti">
    <input class="risk-id" value="${r.id||''}" placeholder="id rizika">
    <input class="risk-name" value="${r.name||''}" placeholder="název rizika">
    <input class="risk-priority" value="${r.priority||''}" placeholder="priorita">
    <textarea class="risk-desc" placeholder="vysvětlení pro poradce">${r.description||''}</textarea>
    <input class="risk-limit" value="${r.limit||''}" placeholder="limit">
    <textarea class="risk-question" placeholder="otázka pro klienta">${r.question||''}</textarea>
    <textarea class="risk-reason" placeholder="důvod doporučení">${r.reason||''}</textarea>
    <select class="risk-default"><option value="true" ${r.default_on!==false?'selected':''}>předvolit</option><option value="false" ${r.default_on===false?'selected':''}>nepředvolit</option></select>
    <button type="button" class="secondary adm-del">Smazat</button>
  </div>`).join('');
  const el=$('risksAdminTable'); if(!el) return;
  el.innerHTML = `<div class="admin-row riskdef admin-head"><div>Činnost</div><div>ID</div><div>Název</div><div>Priorita</div><div>Popis</div><div>Limit</div><div>Otázka</div><div>Důvod</div><div>Stav</div><div></div></div>${rows || '<div class="admin-empty">Žádné riziko neodpovídá filtru.</div>'}`;
  el.querySelectorAll('.adm-del').forEach(btn=>{ btn.onclick=()=>{ const arr=allRiskRows(); arr.splice(+btn.closest('.admin-row').dataset.idx,1); setRisksFromRows(arr); renderAdminRisks(); renderCatalogs(); updateAll(); }; });
  el.querySelectorAll('input,select,textarea').forEach(x=>x.oninput=collectAdminRisks);
  enhanceAdminDetailButtons();
}
function collectAdminRisks(){
  const el=$('risksAdminTable'); if(!el) return;
  const rows = Array.from(el.querySelectorAll('.admin-row.riskdef:not(.admin-head)')).map(row=>({
    activity_code: row.querySelector('.risk-act').value.trim(),
    id: row.querySelector('.risk-id').value.trim() || ('risk_'+Date.now()),
    name: row.querySelector('.risk-name').value.trim(),
    priority: row.querySelector('.risk-priority').value.trim() || 'DOPORUČENÉ',
    description: row.querySelector('.risk-desc').value.trim(),
    limit: row.querySelector('.risk-limit').value.trim(),
    question: row.querySelector('.risk-question').value.trim(),
    reason: row.querySelector('.risk-reason').value.trim(),
    default_on: row.querySelector('.risk-default').value==='true'
  })).filter(r=>r.name || r.id);
  setRisksFromRows(rows);
}
function addAdminRisk(){ collectAdminRisks(); const rows=allRiskRows(); const act=$('adminRiskActivityFilter')?.value || state.activity?.code || 'univerzal'; rows.push({activity_code:act, id:'nove_riziko_'+Date.now(), name:'Nové riziko', priority:'DOPORUČENÉ', description:'Doplňte vysvětlení pro poradce.', limit:'', question:'Doplňte otázku pro klienta.', reason:'Doplňte důvod doporučení.', default_on:true}); setRisksFromRows(rows); renderAdminRisks(); renderCatalogs(); }

function renderAdminDictionary(){
  ensureAdminFilters();
  const search = adminFilterText('adminDictionarySearch');
  const data=(CATALOG.coverageDictionary||[]).map((d,idx)=>({...d,_idx:idx})).filter(d=>rowMatchesSearch(d,search));
  const rows = data.map((d)=>`<div class="admin-row dictionary" data-idx="${d._idx}"><input class="dict-risk" value="${d.risk_id||''}" placeholder="risk_id"><input class="dict-standard" value="${d.standard_name||''}" placeholder="jednotný název"><textarea class="dict-aliases" placeholder="alternativní názvy oddělené čárkou">${(d.aliases||[]).join(', ')}</textarea><button type="button" class="secondary adm-del">Smazat</button></div>`).join('');
  const el=$('dictionaryAdminTable'); if(!el) return;
  el.innerHTML = `<div class="admin-row dictionary admin-head"><div>Risk ID</div><div>Název ASTORIE</div><div>Názvy pojišťoven / synonyma</div><div></div></div>${rows || '<div class="admin-empty">Žádné mapování neodpovídá filtru.</div>'}`;
  el.querySelectorAll('.adm-del').forEach(btn=>btn.onclick=()=>{ CATALOG.coverageDictionary.splice(+btn.closest('.admin-row').dataset.idx,1); renderAdminDictionary(); });
  el.querySelectorAll('input,textarea').forEach(x=>x.oninput=collectAdminDictionary);
  enhanceAdminDetailButtons();
}
function collectAdminDictionary(){
  const el=$('dictionaryAdminTable'); if(!el) return;
  CATALOG.coverageDictionary = Array.from(el.querySelectorAll('.admin-row.dictionary:not(.admin-head)')).map(row=>({risk_id:row.querySelector('.dict-risk').value.trim(), standard_name:row.querySelector('.dict-standard').value.trim(), aliases:row.querySelector('.dict-aliases').value.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean)})).filter(d=>d.risk_id || d.standard_name);
}
function addAdminDictionary(){ collectAdminDictionary(); CATALOG.coverageDictionary.push({risk_id:'nove_riziko', standard_name:'Nové mapování', aliases:[]}); renderAdminDictionary(); }

function renderAdminPolicyRefs(){
  ensureAdminFilters();
  const insurer=$('adminPolicyInsurerFilter')?.value || '';
  const search=adminFilterText('adminPolicySearch');
  const data=(CATALOG.policyReferences||[]).map((r,idx)=>({...r,_idx:idx})).filter(r=>(!insurer || r.insurer_id===insurer) && rowMatchesSearch(r,search));
  const rows = data.map((r)=>`<div class="admin-row policyref" data-idx="${r._idx}"><input class="pr-insurer" value="${r.insurer_id||''}" placeholder="pojišťovna ID"><input class="pr-risk" value="${r.risk_id||''}" placeholder="risk_id"><input class="pr-doc" value="${r.document||''}" placeholder="dokument"><input class="pr-article" value="${r.article||''}" placeholder="článek/odstavec/strana"><textarea class="pr-note" placeholder="poznámka / výklad">${r.note||''}</textarea><input class="pr-url" value="${r.url||''}" placeholder="odkaz"><button type="button" class="secondary adm-del">Smazat</button></div>`).join('');
  const el=$('policyRefsAdminTable'); if(!el) return;
  el.innerHTML = `<div class="admin-row policyref admin-head"><div>Pojišťovna</div><div>Risk ID</div><div>Dokument</div><div>Článek</div><div>Poznámka</div><div>Odkaz</div><div></div></div>${rows || '<div class="admin-empty">Žádný zdroj neodpovídá filtru.</div>'}`;
  el.querySelectorAll('.adm-del').forEach(btn=>btn.onclick=()=>{ CATALOG.policyReferences.splice(+btn.closest('.admin-row').dataset.idx,1); renderAdminPolicyRefs(); });
  el.querySelectorAll('input,textarea').forEach(x=>x.oninput=collectAdminPolicyRefs);
  enhanceAdminDetailButtons();
}
function collectAdminPolicyRefs(){
  const el=$('policyRefsAdminTable'); if(!el) return;
  CATALOG.policyReferences = Array.from(el.querySelectorAll('.admin-row.policyref:not(.admin-head)')).map(row=>({insurer_id:row.querySelector('.pr-insurer').value.trim(), risk_id:row.querySelector('.pr-risk').value.trim(), document:row.querySelector('.pr-doc').value.trim(), article:row.querySelector('.pr-article').value.trim(), note:row.querySelector('.pr-note').value.trim(), url:row.querySelector('.pr-url').value.trim()})).filter(r=>r.insurer_id || r.risk_id || r.document);
}
function addAdminPolicyRef(){ collectAdminPolicyRefs(); CATALOG.policyReferences.push({insurer_id:'', risk_id:'', document:'', article:'', note:'', url:''}); renderAdminPolicyRefs(); }


function setupAdminDetailObserver(){
  const root = $('adminView');
  if(!root || root.dataset.detailObserver==='1') return;
  root.dataset.detailObserver='1';
  const obs = new MutationObserver(()=>enhanceAdminDetailButtons());
  obs.observe(root,{childList:true,subtree:true});
}
function enhanceAdminDetailButtons(){
  document.querySelectorAll('#adminView .admin-row:not(.admin-head)').forEach(row=>{
    if(row.querySelector('.adm-open-detail')) return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='secondary adm-open-detail';
    btn.textContent='Upravit detail';
    btn.onclick=(ev)=>{ev.preventDefault(); openAdminDetailModal(row);};
    const del=row.querySelector('.adm-del');
    if(del) row.insertBefore(btn,del); else row.appendChild(btn);
  });
}
function niceAdminLabel(el, idx){
  const ph = el.getAttribute('placeholder');
  if(ph) return ph.charAt(0).toUpperCase()+ph.slice(1);
  const cls=[...el.classList].find(c=>!['adm-open-detail','adm-del'].includes(c));
  const map={
    'adm-id':'ID','adm-name':'Název','adm-short':'Zkratka','adm-active':'Stav','adm-email':'E-mail','adm-role':'Role','adm-company':'Společnost','adm-reg':'Registrace / status',
    'act-code':'Kód činnosti','act-name':'Název činnosti','act-desc':'Popis činnosti','act-risk':'Rizikovost','act-limit':'Orientační limit',
    'risk-act':'Činnost','risk-id':'ID rizika','risk-name':'Název rizika','risk-priority':'Priorita','risk-desc':'Popis pro poradce','risk-limit':'Limit','risk-question':'Otázka pro klienta','risk-reason':'Důvod doporučení','risk-default':'Předvolba',
    'rm-act':'Činnost','rm-risk':'ID rizika','rm-name':'Název rizika','rm-critical':'Kritičnost','rm-obligation':'Povinnost','rm-weight':'Váha','rm-limit':'Doporučený limit','rm-rec':'Doporučení / upozornění',
    'dict-risk':'ID rizika','dict-standard':'Jednotný název ASTORIE','dict-aliases':'Synonyma / názvy pojišťoven',
    'pr-insurer':'Pojišťovna','pr-risk':'ID rizika','pr-doc':'Dokument','pr-article':'Článek / odstavec / strana','pr-note':'Poznámka / výklad','pr-url':'Odkaz'
  };
  return map[cls] || ('Pole '+(idx+1));
}
function openAdminDetailModal(row){
  currentAdminDetail = {row, fields:[]};
  const title = row.querySelector('input[value], textarea')?.value || row.querySelector('input')?.value || 'Detail záznamu';
  $('adminDetailTitle').textContent = 'Detail záznamu – ' + (title || 'úprava');
  const form=$('adminDetailForm'); form.innerHTML='';
  const fields=[...row.querySelectorAll('input, textarea, select')].filter(el=>!el.classList.contains('adm-open-detail') && !el.classList.contains('adm-del'));
  fields.forEach((el,idx)=>{
    const label=document.createElement('label');
    if(el.tagName==='TEXTAREA') label.classList.add('full');
    label.textContent=niceAdminLabel(el,idx);
    let clone;
    if(el.tagName==='SELECT'){
      clone=document.createElement('select');
      [...el.options].forEach(o=>{const no=document.createElement('option'); no.value=o.value; no.textContent=o.textContent; no.selected=o.selected; clone.appendChild(no);});
    }else if(el.tagName==='TEXTAREA'){
      clone=document.createElement('textarea'); clone.value=el.value || '';
    }else{
      clone=document.createElement('input'); clone.type=el.type||'text'; clone.value=el.value || '';
    }
    clone.dataset.fieldIndex=idx;
    label.appendChild(clone); form.appendChild(label);
    currentAdminDetail.fields.push({source:el, edit:clone});
  });
  $('adminDetailModal').classList.remove('hidden');
}
function saveAdminDetailModal(){
  if(!currentAdminDetail) return;
  currentAdminDetail.fields.forEach(f=>{
    f.source.value=f.edit.value;
    f.source.dispatchEvent(new Event('input',{bubbles:true}));
    f.source.dispatchEvent(new Event('change',{bubbles:true}));
  });
  $('adminDetailModal').classList.add('hidden');
  collectAdminInsurers(); collectAdminAdvisers(); collectAdminActivities(); collectAdminRisks(); collectAdminReqTypes(); collectAdminDictionary(); collectAdminPolicyRefs(); collectRiskModelAdmin();
  renderCatalogs(); updateAll(); enhanceAdminDetailButtons();
}

function parseDelimitedTable(raw){
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  if(lines.length<2) return [];
  const delim = lines[0].includes('\t') ? '\t' : (lines[0].includes(';') ? ';' : ',');
  const split = (line)=> line.split(delim).map(x=>x.trim().replace(/^"|"$/g,''));
  const headers = split(lines[0]).map(h=>h.trim());
  return lines.slice(1).map(line=>{ const vals=split(line); const o={}; headers.forEach((h,i)=>o[h]=vals[i]||''); return o; });
}
function normalizeBool(v){ return String(v||'').toLowerCase().trim(); }
function runCatalogImport(){
  const type=$('importCatalogType').value, fmt=$('importFormat').value, raw=$('importDataBox').value.trim();
  if(!raw){ $('importStatus').textContent='Vlož data k importu.'; return; }
  try{
    let data = fmt==='json' ? JSON.parse(raw) : parseDelimitedTable(raw);
    if(fmt==='json' && data[type]) data=data[type];
    if(type==='activities') CATALOG.activities = data.map(x=>({code:x.code||x.kod||x.id||'', name:x.name||x.nazev||'', description:x.description||x.popis||'', risk_level:x.risk_level||x.rizikovost||'', limit_hint:x.limit_hint||x.limit||''}));
    if(type==='risks'){
      const rows=data.map(x=>({activity_code:x.activity_code||x.cinnost||x.typ_klienta||'', id:x.id||x.risk_id||'', name:x.name||x.nazev||'', priority:x.priority||x.priorita||'DOPORUČENÉ', description:x.description||x.popis||'', limit:x.limit||x.limit_hint||'', question:x.question||x.otazka||'', reason:x.reason||x.duvod||'', default_on: !['ne','false','0'].includes(normalizeBool(x.default_on||x.predvolit))}));
      setRisksFromRows(rows);
    }
    if(type==='coverageDictionary') CATALOG.coverageDictionary = data.map(x=>({risk_id:x.risk_id||x.id||'', standard_name:x.standard_name||x.nazev_astorie||x.name||'', aliases:String(x.aliases||x.synonyma||x.nazvy||'').split(/[,;|]/).map(a=>a.trim()).filter(Boolean)}));
    if(type==='policyReferences') CATALOG.policyReferences = data.map(x=>({insurer_id:x.insurer_id||x.pojistovna||'', risk_id:x.risk_id||'', document:x.document||x.dokument||'', article:x.article||x.clanek||x.odstavec||'', note:x.note||x.poznamka||'', url:x.url||x.odkaz||''}));
    if(type==='riskModel') CATALOG.riskModel = data.map(x=>({activity_code:x.activity_code||x.cinnost||'', risk_id:x.risk_id||'', risk_name:x.risk_name||x.name||x.nazev||'', criticality:x.criticality||x.kriticnost||'střední', obligation:x.obligation||x.povinnost||'doporučené', weight:Number(x.weight||x.vaha||50), recommended_limit:x.recommended_limit||x.limit||'', evaluation_type:x.evaluation_type||'kombinace', recommendation_text:x.recommendation_text||x.doporuceni||'', warning_text:x.warning_text||x.upozorneni||'Ověřit v podmínkách.', active:true}));
    if(type==='insurers') CATALOG.insurers = data.map(x=>({id:x.id||x.short||x.zkratka||'', name:x.name||x.nazev||'', short:x.short||x.zkratka||'', active: !['ne','false','0'].includes(normalizeBool(x.active||x.aktivni))}));
    if(type==='advisers') CATALOG.advisers = data.map(x=>({email:x.email||'', name:x.name||x.jmeno||'', role:x.role||'advisor', company:x.company||'ASTORIE a.s.', registration:x.registration||'', password:x.password||'Poradce2026!'}));
    renderAdmin(); renderCatalogs(); updateAll();
    $('importStatus').textContent='Import načten do adminu. Pro trvalé uložení klikni na „Uložit admin číselníky do DB“.';
  }catch(e){ $('importStatus').textContent='Import se nepodařil: '+e.message; }
}
async function exportCatalogJson(){
  const type=$('importCatalogType').value; collectAdminInsurers(); collectAdminAdvisers(); collectAdminActivities(); collectAdminRisks(); collectAdminReqTypes(); collectAdminDictionary(); collectAdminPolicyRefs(); collectRiskModelAdmin();
  const data = JSON.stringify(CATALOG[type] || {}, null, 2);
  $('importDataBox').value = data;
  try{ await navigator.clipboard.writeText(data); $('importStatus').textContent='JSON zkopírován do schránky.'; }catch(e){ $('importStatus').textContent='JSON je připraven v poli.'; }
}

function renderAIWorkflow(){
  collectForm();
  if($('aiInsurerSelect')){
    const selected = selectedInsurers();
    const source = selected.length ? selected : (CATALOG.insurers||[]).filter(i=>i.active);
    const current = $('aiInsurerSelect').value;
    $('aiInsurerSelect').innerHTML = source.map(i=>`<option value="${i.id}">${i.short||''} – ${i.name||''}</option>`).join('');
    if(current && source.some(i=>i.id===current)) $('aiInsurerSelect').value=current;
  }
  renderAIPrompt();
  renderAIProtocol();
}
function aiRiskSchema(){
  return activeRisks().map(r=>{
    const dict=getDictionary(r.id);
    const aliases=(dict?.aliases||[]).join(', ');
    const m=getRiskModel(r.id, state.activity?.code);
    return `- risk_id: ${r.id}; jednotný název ASTORIE: ${r.name}; kritičnost: ${m.criticality||'—'}; povinnost: ${m.obligation||'—'}; váha: ${m.weight||'—'}; požadovaný/orientační limit: ${m.recommended_limit||r.limit||''}; možné názvy v nabídce: ${aliases||'nejsou předvyplněny'}`;
  }).join('\n');
}
function buildAIPrompt(){
  collectForm();
  const insurerId = $('aiInsurerSelect')?.value || (state.selected_insurers||[])[0] || '';
  const insurer = (CATALOG.insurers||[]).find(i=>i.id===insurerId) || {};
  const offerLabel = $('aiOfferLabel')?.value || 'nabídka pojišťovny';
  const docsLabel = $('aiDocsLabel')?.value || 'nabídka + VPP/DPP/ZPP/IPID přiložené v chatu';
  const requirements = (state.additional_requirements||[]).map(r=>`- ${labelReqType(r.type)}: ${r.text}`).join('\n') || '- bez doplňujících požadavků';
  return `Jsi seniorní pojistný analytik a specialista na podnikatelská pojištění. Zpracuj přiloženou nabídku pojišťovny a pojistné podmínky do jednotné struktury ASTORIE.

KONTEXT POPTÁVKY:
Klient: ${state.client?.name||''}, IČO: ${state.client?.ico||''}
Činnost: ${state.activity?.name||''}
Obrat / zaměstnanci: ${state.questionnaire?.turnover||''} / ${state.questionnaire?.employees||''}
Územní rozsah: ${state.questionnaire?.territory||''}; export: ${state.questionnaire?.export_info||''}
Pojistná doba: ${state.questionnaire?.insurance_period||''}; počátek: ${state.questionnaire?.insurance_start||''}
Pojišťovna: ${insurer.short||''} – ${insurer.name||''}
Nabídka: ${offerLabel}
Dokumenty: ${docsLabel}

DOPLŇUJÍCÍ POŽADAVKY KLIENTA:
${requirements}

JEDNOTNÁ RIZIKA ASTORIE, do kterých musíš nabídku namapovat:
${aiRiskSchema()}

ÚKOL:
1. Najdi v nabídce a pojistných podmínkách odpovídající krytí pro každé jednotné riziko ASTORIE.
2. Sjednoť rozdílné názvosloví pojišťovny na risk_id ASTORIE.
3. U každé položky uveď stav: "splněno", "částečně", "nesplněno", "výluka" nebo "nevyhodnoceno".
4. Uveď limit, sublimit, spoluúčast, původní název v nabídce pojišťovny a přesný zdroj: dokument, článek, odstavec/strana.
5. Pokud zdroj nelze ověřit, napiš "nutno ověřit" a nevymýšlej si článek.
6. Upozorni na výluky, omezení, rozpory, chybějící položky a dotazy na pojišťovnu.
7. Vrať POUZE validní JSON bez komentářů a bez markdownu.

POŽADOVANÝ JSON FORMÁT:
{
  "insurer_id": "${insurerId}",
  "insurer_name": "${insurer.name||''}",
  "offer_label": "${offerLabel}",
  "premium": "",
  "deductible": "",
  "valid_until": "",
  "status": "doručeno",
  "manager_summary": "stručné manažerské shrnutí silných a slabých míst nabídky",
  "questions_to_insurer": ["dotaz 1", "dotaz 2"],
  "exclusions_or_limits": ["výluka/omezení 1"],
  "coverages": [
    {
      "risk_id": "ID rizika z výše uvedeného seznamu",
      "state": "splněno|částečně|nesplněno|výluka|nevyhodnoceno",
      "limit": "limit/sublimit uvedený v nabídce",
      "deductible": "spoluúčast, pokud se liší nebo je relevantní",
      "original_name": "původní název v nabídce pojišťovny",
      "source": "název dokumentu, článek, odstavec, strana",
      "note": "praktický dopad pro klienta a poradce"
    }
  ]
}`;
}
function renderAIPrompt(){
  if(!$('aiPromptBox')) return;
  $('aiPromptBox').value = buildAIPrompt();
}
async function copyAIPrompt(){
  renderAIPrompt();
  try{ await navigator.clipboard.writeText($('aiPromptBox').value); $('aiImportStatus').textContent='Prompt zkopírován.'; }
  catch(e){ $('aiPromptBox').select(); document.execCommand('copy'); $('aiImportStatus').textContent='Prompt zkopírován.'; }
}
function importAIJson(){
  const raw = $('aiJsonInput').value.trim();
  if(!raw){ $('aiImportStatus').textContent='Vlož JSON výstup z ChatGPT.'; return; }
  let data;
  try{ data = JSON.parse(raw); }
  catch(e){ $('aiImportStatus').textContent='JSON není validní: '+e.message; return; }
  const insurerId = data.insurer_id || $('aiInsurerSelect')?.value;
  if(!insurerId){ $('aiImportStatus').textContent='Chybí insurer_id nebo výběr pojišťovny.'; return; }
  if(!state.offers[insurerId]) state.offers[insurerId]={premium:'',deductible:'',valid_until:'',status:'doručeno',note:'',coverages:{}};
  const offer = state.offers[insurerId];
  offer.status = data.status || 'doručeno';
  offer.premium = data.premium || offer.premium || '';
  offer.deductible = data.deductible || offer.deductible || '';
  offer.valid_until = data.valid_until || offer.valid_until || '';
  offer.note = data.manager_summary || data.note || offer.note || '';
  offer.ai_questions = data.questions_to_insurer || [];
  offer.ai_exclusions = data.exclusions_or_limits || [];
  offer.ai_offer_label = data.offer_label || '';
  (data.coverages||[]).forEach(c=>{
    if(!c.risk_id) return;
    offer.coverages[c.risk_id] = {
      state:c.state || 'nevyhodnoceno',
      limit:c.limit || '',
      original:c.original_name || c.original || '',
      source:c.source || '',
      note:[c.note, c.deductible ? ('Spoluúčast: '+c.deductible) : ''].filter(Boolean).join(' | ')
    };
  });
  state.ai_imports = state.ai_imports || [];
  state.ai_imports.push({insurer_id:insurerId, imported_at:new Date().toISOString(), offer_label:data.offer_label||'', warnings:[...(data.questions_to_insurer||[]), ...(data.exclusions_or_limits||[])]});
  $('aiImportStatus').textContent='AI výstup načten do nabídky. Zkontroluj modul Nabídky a Porovnání.';
  renderOffers(); renderComparison(); renderAIProtocol(); updateAll();
}
function renderAIProtocol(){
  if(!$('aiProtocol')) return;
  const items = state.ai_imports || [];
  if(!items.length){ $('aiProtocol').innerHTML='<p class="muted">Zatím nebyl načten žádný AI výstup. Po vložení JSON zde vznikne kontrolní protokol.</p>'; return; }
  $('aiProtocol').innerHTML = `<table><thead><tr><th>Pojišťovna</th><th>Čas importu</th><th>Nabídka</th><th>Body k ověření</th></tr></thead><tbody>${items.map(i=>`<tr><td>${insurerName(i.insurer_id)}</td><td>${i.imported_at||''}</td><td>${i.offer_label||''}</td><td>${(i.warnings||[]).join('<br>')||'—'}</td></tr>`).join('')}</tbody></table>`;
}


function dashboardStatus(label, ok, optional=false){
  if(ok) return {cls:'ok', text:'✓ Vyplněno', hint:label};
  if(optional) return {cls:'optional', text:'Volitelné', hint:label};
  return {cls:'warn', text:'⚠ Doplnit', hint:label};
}
function renderInquiryDashboard(){
  if(!$('inquiryDashboardGrid')) return;
  collectForm();

  const offersCount = Object.values(state.offers||{}).filter(o=>text(o.premium)||Object.keys(o.coverages||{}).length).length;
  const risksCount = activeRisks().length;
  const insurersCount = (state.selected_insurers||[]).length;
  const hasClient = !!(text(state.client?.name)||text(state.client?.ico));
  const hasActivity = !!(state.activity && state.activity.name);
  const hasRisks = risksCount>0;
  const hasInsurers = insurersCount>0;
  const hasInsurance = !!(text(state.questionnaire?.insurance_start)||text(state.questionnaire?.insurance_period)||text(state.insurance_settings?.premium_due)||text(state.insurance_settings?.premium_collection));
  const hasComparison = offersCount > 1;
  const hasReport = !!text(state.report?.advisor_note);
  const active = hasActiveInquiryContext();

  const clientName = text(state.client?.name) || 'Nová poptávka';
  const activityName = state.activity?.name || 'činnost není vybrána';
  const caseId = state.id ? `DB #${state.id}` : (active ? 'zatím neuloženo' : 'bez aktivní poptávky');
  const caseStatus = state.status || (active ? 'rozpracováno' : 'není vybráno');

  const steps = [
    {no:1,key:'client',title:'Klient', view:'inquiryView', ok:hasClient, hint:hasClient ? clientName : 'Doplnit klienta / načíst ARES', action:'Otevřít klienta', next:!hasClient},
    {no:2,key:'risks',title:'Rizika', view:'inquiryView', ok:hasActivity && hasRisks, hint:hasActivity ? `${activityName} · ${risksCount} rizik` : 'Vybrat činnost a rizika', action:'Otevřít rizika', next:hasClient && !(hasActivity && hasRisks)},
    {no:3,key:'request',title:'Poptávka', view:'inquiryView', ok:hasInsurance && hasInsurers, hint:hasInsurers ? `${insurersCount} pojišťoven` : 'Nastavení a pojišťovny', action:'Připravit poptávku', next:hasActivity && hasRisks && !(hasInsurance && hasInsurers)},
    {no:4,key:'offers',title:'Nabídky', view:'offersView', ok:offersCount>0, hint:offersCount ? `${offersCount} nabídek` : 'Doplnit přijaté nabídky', action:'Zapsat nabídky', next:hasInsurance && hasInsurers && offersCount===0},
    {no:5,key:'compare',title:'Porovnání', view:'comparisonView', ok:hasComparison, hint:hasComparison ? 'připraveno' : 'min. 2 nabídky', action:'Porovnat', next:offersCount>0 && !hasComparison},
    {no:6,key:'report',title:'Zpráva', view:'reportView', ok:hasReport, hint:hasReport ? 'rozpracována' : 'připravit pro klienta', action:'Připravit zprávu', next:hasComparison && !hasReport}
  ];
  const nextStep = steps.find(s=>s.next) || (active ? steps.find(s=>!s.ok) : steps[0]) || steps[5];
  const completedCount = steps.filter(s=>s.ok).length;
  const completion = Math.round((completedCount / steps.length) * 100);

  const blockers = [];
  if(!hasClient) blockers.push('chybí klient');
  if(hasClient && !(hasActivity && hasRisks)) blockers.push('chybí činnost/rizika');
  if(hasActivity && hasRisks && !hasInsurers) blockers.push('nejsou vybrané pojišťovny');
  if(hasInsurers && offersCount===0) blockers.push('čekáme na nabídky');

  $('inquiryDashboardGrid').innerHTML = `
    <div class="case-workpanel ${active ? 'active' : 'empty'}">
      <div class="case-main">
        <span class="mini-label">Obchodní případ</span>
        <h2>${active ? clientName : 'Není vybrána žádná poptávka'}</h2>
        <p>${active ? `${activityName} · ${caseId} · stav: ${caseStatus}` : 'Začněte novou poptávkou nebo otevřete uloženou. Nabídky, porovnání a zpráva se vždy vážou ke konkrétnímu případu.'}</p>
      </div>
      <div class="case-progress-compact">
        <b>${completion}%</b>
        <span>připravenost</span>
      </div>
      <div class="case-actions-row compact">
        <button type="button" class="secondary" id="dashNewCaseBtn">+ Nová poptávka</button>
        <button type="button" class="secondary" data-open-view="myInquiriesView">Otevřít uloženou</button>
        <button type="button" class="primary" id="dashSaveCaseBtn">Uložit</button>
      </div>
    </div>

    <div class="advisor-next-line">
      <div>
        <span class="mini-label">Doporučený další krok</span>
        <strong>${nextStep.no}. ${nextStep.title}</strong>
        <small>${nextStep.hint}</small>
      </div>
      <button type="button" class="primary" data-open-view="${nextStep.view}">${nextStep.action}</button>
    </div>

    <div class="workflow-compact" aria-label="Pracovní tok poradce">
      ${steps.map(s=>`
        <button type="button" class="workflow-step-compact ${s.ok?'done':'waiting'} ${s.next?'current':''}" data-open-view="${s.view}">
          <span>${s.ok?'✓':s.no}</span>
          <b>${s.title}</b>
          <small>${s.hint}</small>
        </button>
      `).join('')}
    </div>

    <div class="work-alerts">
      <div class="work-alert ${blockers.length ? 'warn' : 'ok'}">
        <b>${blockers.length ? 'Co brání dokončení' : 'Případ je připravený k dalšímu kroku'}</b>
        <span>${blockers.length ? blockers.join(' · ') : 'Pokračujte podle workflow nebo připravte klientský výstup.'}</span>
      </div>
      <div class="work-alert neutral">
        <b>Nabídky a porovnání</b>
        <span>${offersCount ? `${offersCount} nabídek je uloženo u této poptávky.` : 'Jakmile dorazí nabídky, vložte je do modulu Nabídky.'}</span>
      </div>
      <div class="work-alert neutral">
        <b>Režim pro klienta</b>
        <span>Pro jednání použijte klientský pohled ve Zprávě/PDF. Interní kontroly zůstávají skryté.</span>
      </div>
    </div>
  `;

  document.querySelectorAll('#inquiryDashboardGrid [data-open-view]').forEach(el=>el.onclick=()=>showView(el.dataset.openView));
  const newBtn = $('dashNewCaseBtn');
  if(newBtn) newBtn.onclick = () => $('newInquiryBtn')?.click();
  const saveBtn = $('dashSaveCaseBtn');
  if(saveBtn) saveBtn.onclick = saveInquiry;
  updateAdvisorNavState();
}

function updateAdvisorNavState(){
  try{
    const offersCount = Object.values(state.offers||{}).filter(o=>text(o.premium)||Object.keys(o.coverages||{}).length).length;
    const risksCount = activeRisks().length;
    const insurersCount = (state.selected_insurers||[]).length;
    const hasComparison = offersCount > 1;
    const hasReport = !!text(state.report?.advisor_note);
    const labels = {
      dashboardView:'Dashboard',
      inquiryView:'Poptávka',
      myInquiriesView:'Moje poptávky',
      aiView:'AI zpracování',
      offersView:`Nabídky ${offersCount?'<span class="nav-count">'+offersCount+'</span>':''}`,
      comparisonView:`Porovnání <span class="nav-dot ${hasComparison?'ok':'warn'}"></span>`,
      reportView:`Zpráva <span class="nav-dot ${hasReport?'ok':'warn'}"></span>`,
      guideView:'Průvodce',
      suggestionsView:'Náměty',
      adminView:'Admin'
    };
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      const id = btn.dataset.view;
      if(labels[id]) btn.innerHTML = labels[id];
      btn.classList.toggle('nav-disabled-soft', protectedViewName(id) && !hasActiveInquiryContext());
    });
    const activeBox = document.querySelector('.active-inquiry-card');
    if(activeBox){ activeBox.setAttribute('data-risks', risksCount); activeBox.setAttribute('data-insurers', insurersCount); activeBox.setAttribute('data-offers', offersCount); }
  }catch(e){ console.error('ASTORIE nav state error:', e); }
}



init();

// ===================== V0.13: průvodce pro nováčky + náměty poradců =====================
function currentAdvisorMode(){
  const checked = document.querySelector('input[name="advisorMode"]:checked');
  return checked ? checked.value : 'novice';
}
function renderGuide(){
  collectForm();
  const mode = currentAdvisorMode();
  const checks = [
    {label:'Klient', ok:!!text(state.client?.name), warn:!!text(state.client?.ico), hint:text(state.client?.name)?'Identifikace klienta je vyplněná.':'Doplňte název klienta nebo načtěte ARES.'},
    {label:'Kontakt', ok:!!(text(state.client?.contact_person)||text(state.client?.contact_email)||text(state.client?.contact_phone)), hint:'Doplňte alespoň kontaktní osobu, e-mail nebo telefon.'},
    {label:'Rizika', ok:activeRisks().length>0, hint: activeRisks().length ? `Vybráno ${activeRisks().length} rizik.` : 'Vyberte nebo přidejte alespoň jedno riziko.'},
    {label:'Pojišťovny', ok:(state.selected_insurers||[]).length>0, hint:(state.selected_insurers||[]).length ? `Vybráno ${(state.selected_insurers||[]).length} pojišťoven.` : 'Vyberte pojišťovny pro poptávku.'},
    {label:'Obrat', ok:!!text(state.questionnaire?.turnover), hint:'Obrat pomáhá orientačně posoudit limit.'},
    {label:'Území', ok:!!text(state.questionnaire?.territory), hint:'Územní rozsah je důležitý pro nabídku i výluky.'},
    {label:'Pojistná doba', ok:!!text(state.questionnaire?.insurance_period), hint:'Doplňte požadovanou dobu nebo vlastní variantu.'},
    {label:'Nabídky', ok:Object.values(state.offers||{}).some(o=>text(o.premium)||text(o.status)==='doručeno'), hint:'Po doručení nabídek vyplňte modul Nabídky.'}
  ];
  $('readinessBox').innerHTML = checks.map(c=>`<div class="ready-card ${c.ok?'ok':(c.warn?'warn':'bad')}"><b>${c.ok?'✓':'!'} ${c.label}</b><span>${c.ok?c.hint:c.hint}</span></div>`).join('');
  const baseQuestions = [
    ['Jaká je hlavní činnost klienta a co přesně klient fakturuje?', 'Pomáhá ověřit, zda vybraná činnost odpovídá reálnému riziku.'],
    ['Kde klient činnost vykonává – u sebe, u zákazníka, na stavbě, v zahraničí?', 'Mění se tím riziko odpovědnosti, územní rozsah i požadované doložky.'],
    ['Má klient smlouvy, kde je předepsaný minimální limit nebo konkrétní pojištění?', 'Smluvní požadavky mají přednost před orientačním limitem.'],
    ['Jaká je nejvyšší možná škoda z jedné události?', 'Tato odpověď je důležitější než samotný roční obrat.'],
    ['Byly v minulosti škody nebo reklamace?', 'Škodní průběh ovlivňuje nabídku i doporučení.']
  ];
  const riskQuestions = activeRisks().map(r=>[r.question || `Je pro klienta relevantní riziko: ${r.name}?`, r.reason || r.description || 'Riziko bylo navrženo podle činnosti klienta.']);
  const qs = mode==='expert' ? riskQuestions.slice(0,8) : baseQuestions.concat(riskQuestions).slice(0,18);
  $('advisorQuestions').innerHTML = qs.map((q,i)=>`<div class="question-item"><b>${i+1}. ${q[0]}</b><span class="why">Proč se ptáme: ${q[1]}</span></div>`).join('') || '<p class="muted">Nejdříve vyberte činnost a rizika.</p>';
  const warns = [];
  if(!text(state.client?.contact_email) && !text(state.client?.contact_phone)) warns.push(['Kontakt na klienta','Bez kontaktu se špatně dokládá jednání a doplnění údajů.', false]);
  if((state.selected_insurers||[]).length < 2) warns.push(['Pojišťovny','Pro kvalitní porovnání doporučujeme poptat více než jednu pojišťovnu.', false]);
  if(activeRisks().some(r=>/výrobek|stažení|export|usa|kanada/i.test((r.name+' '+r.description+' '+r.reason)))) warns.push(['Vyšší expozice','Zkontrolujte export, výrobkovou odpovědnost, USA/Kanada a smluvní požadavky odběratelů.', true]);
  if(!text(state.questionnaire?.turnover)) warns.push(['Obrat','Bez obratu je návrh limitu pouze velmi orientační.', false]);
  $('guideWarnings').innerHTML = warns.length ? warns.map(w=>`<div class="warning-item ${w[2]?'critical':''}"><b>${w[0]}</b><p>${w[1]}</p></div>`).join('') : '<div class="warning-item"><b>Bez zásadních upozornění</b><p>Poptávka zatím neobsahuje zjevné kritické mezery. Přesto ji před odesláním zkontrolujte.</p></div>';
}
async function saveSuggestion(){
  collectForm();
  const payload = {
    type: $('suggestionType').value,
    area: $('suggestionArea').value || state.activity?.name || '',
    priority: $('suggestionPriority').value,
    title: $('suggestionTitle').value,
    detail: $('suggestionDetail').value,
    actor_email: state.adviser?.email || currentUser?.email || ''
  };
  if(!text(payload.title) || !text(payload.detail)){ $('suggestionStatus').textContent='Doplňte název a popis námětu.'; return; }
  $('suggestionStatus').textContent='Ukládám...';
  try{
    const res = await api('/api/suggestions', {method:'POST', body:JSON.stringify(payload)});
    $('suggestionStatus').textContent=res.message || 'Námět uložen.';
    $('suggestionTitle').value=''; $('suggestionDetail').value='';
    await loadSuggestions();
  }catch(e){ $('suggestionStatus').textContent='Chyba: '+e.message; }
}
async function loadSuggestions(){
  if(!$('suggestionsList')) return;
  $('suggestionsList').innerHTML='Načítám...';
  try{
    const res = await api('/api/suggestions');
    const items = res.items || [];
    $('suggestionsList').innerHTML = items.length ? items.map(s=>`<div class="suggestion-card"><div class="meta">${s.type||''} · ${s.priority||''} · ${s.area||''}</div><h3>${s.title||''}</h3><p>${s.detail||''}</p><p class="muted">${s.actor_email||''} · ${s.created_at||''}</p></div>`).join('') : '<p class="muted">Zatím nejsou uložené žádné náměty.</p>';
  }catch(e){ $('suggestionsList').innerHTML='Chyba: '+e.message; }
}


// Fallback pro dynamická tlačítka – aby fungovala i při změně pořadí načítání skriptů.
window.addQuestionnaireExtraRow = addQuestionnaireExtraRow;
window.addClientExtraRow = addClientExtraRow;
window.addInsuranceExtraRow = addInsuranceExtraRow;
window.addInsuredPerson = addInsuredPerson;
window.addLiabilityParam = addLiabilityParam;
window.addSpecialClause = addSpecialClause;
window.safeUpdateAll = safeUpdateAll;


// MVP 0.36 fallback: dynamická tlačítka se navážou i po případném překreslení části stránky.
document.addEventListener('DOMContentLoaded', ()=>{ try { bindDynamicButtonsHard(); } catch(e) { console.error('ASTORIE dynamic init fallback:', e); } });


// MVP 0.58.1 – underwriting foundation workspaces
function renderDocumentsWorkspace(){
  updateActiveInquiryBanner();
}
function renderTextationsWorkspace(){
  const search = $('textationSearch');
  const cat = $('textationCategory');
  if(search && !search.dataset.bound){
    search.dataset.bound = '1';
    search.addEventListener('input', ()=>{});
  }
  if(cat && !cat.dataset.bound){
    cat.dataset.bound = '1';
    cat.addEventListener('change', ()=>{});
  }
}
function renderUnderwritingChecklist(){
  updateActiveInquiryBanner();
}


// MVP 0.59 – risk model workspace
function renderRiskModelWorkspace(){
  updateActiveInquiryBanner();
  const active = state.activeInquiry || {};
  const typeEl = $('rmClientType');
  if(typeEl){
    typeEl.textContent = active.clientActivity || active.businessType || active.clientName || 'dle aktivní poptávky';
  }
}

function renderProfessionalUnderwritingWorkspace(){
  const active = state.activeInquiry || {};
  const offers = Array.isArray(state.offers) ? state.offers.length : 0;
  const risks = Array.isArray(state.selectedRisks) ? state.selectedRisks.length : 0;
  const title = active.clientName || state.form?.clientName || $('clientName')?.value || 'Není vybrána žádná poptávka';
  const ready = Math.min(100, ((title && title !== 'Není vybrána žádná poptávka') ? 20 : 0) + (risks ? 20 : 0) + (offers ? 25 : 0) + (offers >= 2 ? 20 : 0));
  if($('uwCaseTitle')) $('uwCaseTitle').textContent = title;
  if($('uwCaseMeta')) $('uwCaseMeta').textContent = [(active.businessType || active.clientActivity || 'typ činnosti není vyplněn'), active.id ? ('DB #' + active.id) : 'bez aktivního případu', offers + ' nabídek'].join(' · ');
  if($('uwOffersCount')) $('uwOffersCount').textContent = offers;
  if($('uwReadyPercent')) $('uwReadyPercent').textContent = ready + '%';
  if($('uwRiskLevel')) $('uwRiskLevel').textContent = risks >= 5 ? 'ZVÝŠENÉ' : (ready ? 'STANDARD' : 'NEURČENO');
  let nextTitle = 'Začněte klientem a načtením ARES', nextText = 'Bez klienta nemá smysl připravovat nabídky, porovnání ani zprávu.', nextView = 'inquiryView';
  if(ready >= 20 && !risks){ nextTitle = 'Doplňte rizika a činnost'; nextText = 'Vyberte hlavní činnost, potvrďte katalogová rizika a doplňte vlastní požadavky.'; }
  else if(risks && !offers){ nextTitle = 'Vložte přijaté nabídky'; nextText = 'Pojišťovny a nabídky musí být navázané na tento obchodní případ.'; nextView = 'offersView'; }
  else if(offers >= 2){ nextTitle = 'Připravte porovnání a klientskou zprávu'; nextText = 'Zkontrolujte rozdíly v limitech, výlukách, spoluúčastech a ceně.'; nextView = 'comparisonView'; }
  if($('uwNextStepTitle')) $('uwNextStepTitle').textContent = nextTitle;
  if($('uwNextStepText')) $('uwNextStepText').textContent = nextText;
  if($('uwNextStepBtn')) $('uwNextStepBtn').onclick = () => showView(nextView);
  if($('uwAlerts')){
    const alerts = [];
    if(!ready) alerts.push('Chybí klient / IČO / ARES.');
    if(ready >= 20 && !risks) alerts.push('Chybí potvrzená rizika a činnost.');
    if(risks && !offers) alerts.push('Čeká se na vložení nabídek pojišťoven.');
    if(offers === 1) alerts.push('Pro porovnání je potřeba doplnit další nabídku.');
    if(offers >= 2) alerts.push('Zkontrolujte rozdíly a připravte zprávu klientovi.');
    $('uwAlerts').innerHTML = (alerts.length ? alerts : ['Případ je připravený k dalšímu zpracování.']).map(a=>'<li>'+escapeHtml(a)+'</li>').join('');
  }
}


// MVP 0.61 – functional offer workspace
if(!window.quickOfferWorkspaceRows){ window.quickOfferWorkspaceRows = []; }

function moneyCz(value){
  const n = Number(String(value || '').replace(/[^\d.,-]/g,'').replace(',', '.'));
  if(!isFinite(n) || n <= 0) return '–';
  return n.toLocaleString('cs-CZ') + ' Kč';
}

function addQuickOfferRow(){
  const row = {
    insurer: '',
    premium: '',
    limit: '',
    deductible: '',
    exclusions: '',
    rating: 'k ověření',
    note: ''
  };
  window.quickOfferWorkspaceRows.push(row);
  renderOfferWorkspace();
}

function deleteQuickOfferRow(index){
  window.quickOfferWorkspaceRows.splice(index, 1);
  renderOfferWorkspace();
}

function updateQuickOfferRow(index, field, value){
  if(!window.quickOfferWorkspaceRows[index]) return;
  window.quickOfferWorkspaceRows[index][field] = value;
  renderOfferWorkspaceStats();
}

function renderOfferWorkspace(){
  const body = $('offerWorkspaceRows');
  if(!body) return;
  const rows = window.quickOfferWorkspaceRows || [];
  if(!rows.length){
    body.innerHTML = '<tr class="empty-row"><td colspan="8">Zatím nejsou vložené nabídky. Použijte „+ Rychlá nabídka“ nebo vložte nabídku standardním formulářem níže.</td></tr>';
    renderOfferWorkspaceStats();
    return;
  }
  body.innerHTML = rows.map((r,i)=>`
    <tr>
      <td><input value="${escapeHtml(r.insurer||'')}" placeholder="např. Kooperativa" oninput="updateQuickOfferRow(${i},'insurer',this.value)"></td>
      <td><input value="${escapeHtml(r.premium||'')}" placeholder="např. 25 000 Kč" oninput="updateQuickOfferRow(${i},'premium',this.value)"></td>
      <td><input value="${escapeHtml(r.limit||'')}" placeholder="např. 10 mil. Kč" oninput="updateQuickOfferRow(${i},'limit',this.value)"></td>
      <td><input value="${escapeHtml(r.deductible||'')}" placeholder="např. 10 000 Kč" oninput="updateQuickOfferRow(${i},'deductible',this.value)"></td>
      <td><textarea placeholder="výluky / omezení" oninput="updateQuickOfferRow(${i},'exclusions',this.value)">${escapeHtml(r.exclusions||'')}</textarea></td>
      <td>
        <select onchange="updateQuickOfferRow(${i},'rating',this.value)">
          <option ${r.rating==='k ověření'?'selected':''}>k ověření</option>
          <option ${r.rating==='vhodná'?'selected':''}>vhodná</option>
          <option ${r.rating==='omezená'?'selected':''}>omezená</option>
          <option ${r.rating==='nedoporučit'?'selected':''}>nedoporučit</option>
        </select>
      </td>
      <td><textarea placeholder="poznámka poradce" oninput="updateQuickOfferRow(${i},'note',this.value)">${escapeHtml(r.note||'')}</textarea></td>
      <td><button class="danger-light" type="button" onclick="deleteQuickOfferRow(${i})">Smazat</button></td>
    </tr>
  `).join('');
  renderOfferWorkspaceStats();
}

function renderOfferWorkspaceStats(){
  const rows = window.quickOfferWorkspaceRows || [];
  const appOffers = Array.isArray(state.offers) ? state.offers.length : 0;
  const total = rows.length + appOffers;
  if($('offerWsCount')) $('offerWsCount').textContent = total;
  const premiums = rows.map(r => Number(String(r.premium||'').replace(/[^\d.,-]/g,'').replace(',', '.'))).filter(n => isFinite(n) && n > 0);
  if($('offerWsBestPrice')) $('offerWsBestPrice').textContent = premiums.length ? moneyCz(Math.min(...premiums)) : '–';
  const missing = rows.filter(r => !r.insurer || !r.premium || !r.limit).length;
  if($('offerWsMissing')) $('offerWsMissing').textContent = missing ? String(missing) : '0';
  if($('offerWsReady')) $('offerWsReady').textContent = total >= 2 ? 'připraveno' : 'čeká';
  if($('offerWsNext')) $('offerWsNext').textContent = total >= 2 ? 'Otevřete Porovnání a zkontrolujte rozdíly v krytí, ceně a výlukách.' : 'Doplňte alespoň dvě nabídky pro plnohodnotné porovnání.';
  if($('offerWsAlerts')){
    const alerts = [];
    if(total < 2) alerts.push('Pro porovnání jsou potřeba alespoň dvě nabídky.');
    if(missing) alerts.push('Některé pracovní nabídky nemají doplněnou pojišťovnu, cenu nebo limit.');
    if(rows.some(r => r.rating === 'omezená' || r.rating === 'nedoporučit')) alerts.push('Některá nabídka má omezené nebo nedoporučené hodnocení.');
    if(!alerts.length) alerts.push('Nabídkový workspace je připravený pro porovnání.');
    $('offerWsAlerts').innerHTML = alerts.map(a=>'<li>'+escapeHtml(a)+'</li>').join('');
  }
}


// MVP 0.62 – functional textation library
const DEFAULT_TEXTATIONS = [
  {
    id:'odp-provoz',
    title:'Odpovědnost z provozní činnosti – potvrzení rozsahu',
    category:'Požadavky na pojišťovnu',
    tags:['odpovědnost','pojišťovna'],
    usage:'Poptávka pojišťovně',
    text:'Prosíme o výslovné potvrzení, zda se nabízené pojištění vztahuje na odpovědnost za újmu způsobenou provozní činností klienta v rozsahu uvedeném v poptávce, včetně uvedení případných výluk, sublimitu nebo zvláštních podmínek.'
  },
  {
    id:'prevzate-veci',
    title:'Věci převzaté / užívané – požadavek na krytí',
    category:'Zvláštní ujednání',
    tags:['odpovědnost','převzaté věci'],
    usage:'Poptávka / nabídka',
    text:'Klient požaduje posouzení a případné zahrnutí odpovědnosti za škody na věcech převzatých, užívaných nebo jinak nacházejících se v dispozici klienta při výkonu jeho činnosti. Prosíme o uvedení limitu, sublimitu, spoluúčasti a případných omezení.'
  },
  {
    id:'vadny-vyrobek',
    title:'Odpovědnost za výrobek / vadnou práci',
    category:'Odpovědnost',
    tags:['odpovědnost','výrobek'],
    usage:'Rizika / porovnání',
    text:'U nabídky je nutné ověřit, zda a v jakém rozsahu kryje odpovědnost za škodu způsobenou vadou výrobku nebo vadně provedenou prací po předání. Zvláštní pozornost je třeba věnovat výlukám, sériové škodě, čistým finančním škodám a nákladům na stažení výrobku.'
  },
  {
    id:'cista-financni-skoda',
    title:'Čistá finanční škoda – upozornění pro klienta',
    category:'Klientská zpráva',
    tags:['odpovědnost','finanční škoda','klient'],
    usage:'Zpráva klientovi',
    text:'U čistých finančních škod doporučujeme ověřit, zda jsou v nabídce kryty samostatně, nebo pouze jako doplňkové krytí se sublimitem. Pokud je krytí omezené nebo zcela vyloučené, je vhodné klienta na tuto skutečnost výslovně upozornit.'
  },
  {
    id:'vyluky',
    title:'Výluky – obecné upozornění do zprávy',
    category:'Výluky a omezení',
    tags:['výluky','klient'],
    usage:'Zpráva klientovi',
    text:'Před uzavřením pojištění doporučujeme věnovat pozornost výlukám a omezením uvedeným v pojistných podmínkách a nabídce. Rozsah pojištění není dán pouze limitem a cenou, ale zejména konkrétními podmínkami krytí.'
  },
  {
    id:'fve',
    title:'FVE – technické podklady a revize',
    category:'Drony / FVE / speciální rizika',
    tags:['FVE','podklady'],
    usage:'Poptávka pojišťovně',
    text:'Pro posouzení rizika FVE doporučujeme doložit technickou specifikaci, instalovaný výkon, umístění technologie, způsob zabezpečení, revizní zprávy a informaci o provozovateli. Pojišťovna může požadovat doplňující podklady podle rozsahu a typu instalace.'
  },
  {
    id:'drony',
    title:'Drony – odpovědnost provozovatele',
    category:'Drony / FVE / speciální rizika',
    tags:['drony','odpovědnost'],
    usage:'Poptávka / rizikový model',
    text:'U provozu dronů doporučujeme ověřit zejména účel použití, typ a hmotnost zařízení, územní rozsah provozu, oprávnění pilota, historii škod a požadovaný limit odpovědnosti za újmu způsobenou třetím osobám.'
  }
];

function getTextationLibrary(){
  try{
    const saved = localStorage.getItem('astorie_textations_v62');
    if(saved) return JSON.parse(saved);
  }catch(e){}
  return DEFAULT_TEXTATIONS.slice();
}
function saveTextationLibrary(items){
  localStorage.setItem('astorie_textations_v62', JSON.stringify(items || []));
}
function resetTextationLibrary(){
  if(confirm('Obnovit vzorové textace? Vlastní lokální úpravy v prohlížeči budou nahrazeny.')){
    saveTextationLibrary(DEFAULT_TEXTATIONS.slice());
    renderTextationLibrary();
  }
}
function renderTextationsWorkspace(){
  renderTextationLibrary();
}
function renderTextationLibrary(){
  const list = $('textationList');
  if(!list) return;
  let items = getTextationLibrary();
  const q = ($('textationSearch')?.value || '').toLowerCase().trim();
  const cat = $('textationCategory')?.value || '';
  const tag = $('textationTag')?.value || '';
  if(cat) items = items.filter(i => i.category === cat);
  if(tag) items = items.filter(i => (i.tags || []).includes(tag));
  if(q){
    items = items.filter(i => [i.title, i.category, i.usage, i.text, (i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q));
  }
  if(!items.length){
    list.innerHTML = '<div class="textation-empty">Nenalezena žádná textace. Zkuste jiný filtr nebo přidejte vlastní textaci.</div>';
    return;
  }
  list.innerHTML = items.map(i => `
    <button type="button" class="textation-item" onclick="showTextationDetail('${escapeHtml(i.id)}')">
      <span>${escapeHtml(i.category)}</span>
      <b>${escapeHtml(i.title)}</b>
      <small>${escapeHtml((i.tags||[]).join(' · '))}</small>
    </button>
  `).join('');
}
function findTextation(id){
  return getTextationLibrary().find(i => i.id === id);
}
function showTextationDetail(id){
  const item = findTextation(id);
  const box = $('textationDetail');
  if(!item || !box) return;
  box.innerHTML = `
    <p class="eyebrow">${escapeHtml(item.category)}</p>
    <h3>${escapeHtml(item.title)}</h3>
    <p class="textation-usage"><b>Použití:</b> ${escapeHtml(item.usage || 'obecně')}</p>
    <div class="textation-fulltext">${escapeHtml(item.text).replace(/\\n/g,'<br>')}</div>
    <div class="textation-tags">${(item.tags||[]).map(t=>'<span>'+escapeHtml(t)+'</span>').join('')}</div>
    <div class="textation-detail-actions">
      <button class="primary" type="button" onclick="insertTextationToNotes('${escapeHtml(item.id)}')">Vložit do poznámek</button>
      <button class="secondary" type="button" onclick="copyTextation('${escapeHtml(item.id)}')">Zkopírovat</button>
      <button class="secondary" type="button" onclick="editTextation('${escapeHtml(item.id)}')">Upravit</button>
      <button class="danger-light" type="button" onclick="deleteTextation('${escapeHtml(item.id)}')">Smazat</button>
    </div>
  `;
}
function insertTextationToNotes(id){
  const item = findTextation(id);
  const notes = $('caseTextationNotes');
  if(!item || !notes) return;
  const prefix = notes.value.trim() ? '\\n\\n---\\n' : '';
  notes.value += prefix + item.title + '\\n' + item.text;
  notes.focus();
}
function copyTextation(id){
  const item = findTextation(id);
  if(!item) return;
  navigator.clipboard?.writeText(item.text);
  alert('Textace zkopírována.');
}
function copyTextationNotes(){
  const notes = $('caseTextationNotes');
  if(!notes) return;
  navigator.clipboard?.writeText(notes.value || '');
  alert('Pracovní poznámky zkopírovány.');
}
function openTextationEditor(){
  const title = prompt('Název textace:');
  if(!title) return;
  const category = prompt('Kategorie:', 'Zvláštní ujednání') || 'Zvláštní ujednání';
  const tagsRaw = prompt('Tagy oddělené čárkou:', 'odpovědnost') || '';
  const text = prompt('Textace:');
  if(!text) return;
  const items = getTextationLibrary();
  const id = 'custom-' + Date.now();
  items.unshift({id, title, category, tags: tagsRaw.split(',').map(t=>t.trim()).filter(Boolean), usage:'vlastní textace', text});
  saveTextationLibrary(items);
  renderTextationLibrary();
  showTextationDetail(id);
}
function editTextation(id){
  const items = getTextationLibrary();
  const item = items.find(i => i.id === id);
  if(!item) return;
  const title = prompt('Název textace:', item.title);
  if(!title) return;
  const category = prompt('Kategorie:', item.category) || item.category;
  const tagsRaw = prompt('Tagy oddělené čárkou:', (item.tags||[]).join(', ')) || '';
  const text = prompt('Textace:', item.text);
  if(!text) return;
  item.title = title;
  item.category = category;
  item.tags = tagsRaw.split(',').map(t=>t.trim()).filter(Boolean);
  item.text = text;
  saveTextationLibrary(items);
  renderTextationLibrary();
  showTextationDetail(id);
}


// MVP 0.63 – professional textation editor and local persistence
function openTextationEditor(){
  const panel = $('textationEditorPanel');
  if(!panel) return;
  $('textationEditId').value = '';
  $('textationEditorTitle').textContent = 'Nová textace';
  $('textationEditTitle').value = '';
  $('textationEditCategory').value = 'Zvláštní ujednání';
  $('textationEditUsage').value = 'Poptávka pojišťovně';
  $('textationEditTags').value = '';
  $('textationEditText').value = '';
  panel.classList.remove('hidden');
  $('textationEditTitle').focus();
  panel.scrollIntoView({behavior:'smooth', block:'start'});
}
function closeTextationEditor(){
  const panel = $('textationEditorPanel');
  if(panel) panel.classList.add('hidden');
}
function editTextation(id){
  const item = findTextation(id);
  const panel = $('textationEditorPanel');
  if(!item || !panel) return;
  $('textationEditId').value = item.id;
  $('textationEditorTitle').textContent = 'Upravit textaci';
  $('textationEditTitle').value = item.title || '';
  $('textationEditCategory').value = item.category || 'Zvláštní ujednání';
  $('textationEditUsage').value = item.usage || 'Poptávka pojišťovně';
  $('textationEditTags').value = (item.tags || []).join(', ');
  $('textationEditText').value = item.text || '';
  panel.classList.remove('hidden');
  $('textationEditTitle').focus();
  panel.scrollIntoView({behavior:'smooth', block:'start'});
}
function saveTextationFromEditor(){
  const title = ($('textationEditTitle')?.value || '').trim();
  const category = ($('textationEditCategory')?.value || '').trim();
  const usage = ($('textationEditUsage')?.value || '').trim();
  const tagsRaw = ($('textationEditTags')?.value || '').trim();
  const text = ($('textationEditText')?.value || '').trim();
  const id = ($('textationEditId')?.value || '').trim();
  if(!title){ alert('Doplňte název textace.'); $('textationEditTitle')?.focus(); return; }
  if(!text){ alert('Doplňte textaci.'); $('textationEditText')?.focus(); return; }
  const items = getTextationLibrary();
  const payload = { id: id || ('custom-' + Date.now()), title, category: category || 'Zvláštní ujednání', usage: usage || 'Poptávka pojišťovně', tags: tagsRaw.split(',').map(t=>t.trim()).filter(Boolean), text };
  const idx = items.findIndex(i => i.id === payload.id);
  if(idx >= 0) items[idx] = payload; else items.unshift(payload);
  saveTextationLibrary(items);
  closeTextationEditor();
  renderTextationLibrary();
  showTextationDetail(payload.id);
  alert('Textace byla uložena do pracovní knihovny.');
}
function deleteTextation(id){
  const item = findTextation(id);
  if(!item) return;
  if(!confirm('Opravdu smazat textaci: ' + item.title + '?')) return;
  saveTextationLibrary(getTextationLibrary().filter(i => i.id !== id));
  renderTextationLibrary();
  const box = $('textationDetail');
  if(box) box.innerHTML = '<p class="eyebrow">Detail textace</p><h3>Vyberte textaci</h3><p>Po kliknutí na textaci se zobrazí celý text, možnost kopírování, vložení do pracovních poznámek a úprava.</p>';
}
function saveCaseTextationNotesLocal(){
  const notes = $('caseTextationNotes');
  if(notes) localStorage.setItem('astorie_case_textation_notes_v63', notes.value || '');
}
function loadCaseTextationNotesLocal(){
  const notes = $('caseTextationNotes');
  if(!notes) return;
  notes.value = localStorage.getItem('astorie_case_textation_notes_v63') || notes.value || '';
  if(!notes.dataset.bound){ notes.dataset.bound='1'; notes.addEventListener('input', saveCaseTextationNotesLocal); }
}


// MVP 0.64 – reliable textation save/render/admin functions
function clearTextationFilters(){
  if($('textationSearch')) $('textationSearch').value = '';
  if($('textationCategory')) $('textationCategory').value = '';
  if($('textationTag')) $('textationTag').value = '';
}

function normalizeTextationItem(item){
  return {
    id: item.id || ('custom-' + Date.now()),
    title: item.title || '',
    category: item.category || 'Zvláštní ujednání',
    usage: item.usage || 'Poptávka pojišťovně',
    tags: Array.isArray(item.tags) ? item.tags : String(item.tags || '').split(',').map(t=>t.trim()).filter(Boolean),
    text: item.text || ''
  };
}

// override save with reliable behavior
function saveTextationFromEditor(){
  const title = ($('textationEditTitle')?.value || '').trim();
  const category = ($('textationEditCategory')?.value || '').trim();
  const usage = ($('textationEditUsage')?.value || '').trim();
  const tagsRaw = ($('textationEditTags')?.value || '').trim();
  const text = ($('textationEditText')?.value || '').trim();
  const id = ($('textationEditId')?.value || '').trim();

  if(!title){
    alert('Doplňte název textace.');
    $('textationEditTitle')?.focus();
    return;
  }
  if(!text){
    alert('Doplňte textaci.');
    $('textationEditText')?.focus();
    return;
  }

  const items = getTextationLibrary().map(normalizeTextationItem);
  const payload = normalizeTextationItem({
    id: id || ('custom-' + Date.now()),
    title,
    category,
    usage,
    tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
    text
  });

  const idx = items.findIndex(i => i.id === payload.id);
  if(idx >= 0) items[idx] = payload;
  else items.unshift(payload);

  saveTextationLibrary(items);

  // důležité: po uložení vyčistit filtry, aby nová textace nebyla skrytá
  clearTextationFilters();
  closeTextationEditor();

  // zobrazit v poradenské knihovně
  renderTextationLibrary();
  showTextationDetail(payload.id);

  // zobrazit v adminu, pokud je admin otevřený
  renderAdminTextations();

  alert('Textace byla uložena a je viditelná v knihovně.');
}

function openAdminTextationEditor(){
  showView('textationsView');
  setTimeout(openTextationEditor, 80);
}

function renderAdminTextations(){
  const list = $('adminTextationList');
  if(!list) return;

  let items = getTextationLibrary().map(normalizeTextationItem);
  const q = ($('adminTextationSearch')?.value || '').toLowerCase().trim();
  const cat = $('adminTextationCategory')?.value || '';

  if(cat) items = items.filter(i => i.category === cat);
  if(q){
    items = items.filter(i =>
      [i.title, i.category, i.usage, i.text, (i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }

  if(!items.length){
    list.innerHTML = '<div class="admin-note">Nenalezena žádná textace. Použijte tlačítko „+ Přidat textaci“.</div>';
    return;
  }

  list.innerHTML = `
    <table class="admin-textation-table">
      <thead>
        <tr>
          <th>Název</th>
          <th>Kategorie</th>
          <th>Použití</th>
          <th>Tagy</th>
          <th>Akce</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td><b>${escapeHtml(i.title)}</b><br><small>${escapeHtml((i.text || '').slice(0, 140))}${(i.text||'').length > 140 ? '…' : ''}</small></td>
            <td>${escapeHtml(i.category)}</td>
            <td>${escapeHtml(i.usage)}</td>
            <td>${(i.tags||[]).map(t=>'<span class="mini-tag">'+escapeHtml(t)+'</span>').join('')}</td>
            <td>
              <button class="secondary small-btn" type="button" onclick="showView('textationsView'); setTimeout(()=>showTextationDetail('${escapeHtml(i.id)}'),80)">Detail</button>
              <button class="secondary small-btn" type="button" onclick="showView('textationsView'); setTimeout(()=>editTextation('${escapeHtml(i.id)}'),80)">Upravit</button>
              <button class="danger-light small-btn" type="button" onclick="deleteTextation('${escapeHtml(i.id)}'); renderAdminTextations();">Smazat</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// doplnění renderu při otevření adminu
(function(){
  const originalShowAdminTab = window.showAdminTab;
  if(typeof originalShowAdminTab === 'function' && !window.__adminTextationPatchApplied){
    window.__adminTextationPatchApplied = true;
    window.showAdminTab = function(tab){
      originalShowAdminTab(tab);
      if(tab === 'textationsAdmin') renderAdminTextations();
    }
  }
})();


// adminTextationClickBinding64
document.addEventListener('click', function(e){
  const btn = e.target && e.target.closest ? e.target.closest('[data-admin-tab="textationsAdmin"]') : null;
  if(btn) setTimeout(renderAdminTextations, 80);
});

// MVP 0.65 - definitive textation library fix
const TEXTATION_STORAGE_KEY_V65 = 'astorie_textations_v65';
const TEXTATION_LEGACY_KEYS_V65 = ['astorie_textations_v62', 'astorie_textations_v63', 'astorie_textations_v64'];

function textationStatus(message, type){
  const box = $('textationSaveStatus');
  if(!box) return;
  box.className = 'textation-save-status ' + (type || 'ok');
  box.textContent = message;
  box.classList.remove('hidden');
  setTimeout(()=>box.classList.add('hidden'), 4500);
}

function normalizeTextationItemV65(item){
  const tags = Array.isArray(item.tags)
    ? item.tags
    : String(item.tags || '').split(',').map(t=>t.trim()).filter(Boolean);
  return {
    id: item.id || ('custom-' + Date.now() + '-' + Math.random().toString(16).slice(2)),
    title: item.title || item.name || '',
    category: item.category || 'Zvláštní ujednání',
    usage: item.usage || item.type || 'Poptávka pojišťovně',
    tags: tags,
    text: item.text || item.fullText || item.body || ''
  };
}

function uniqueTextationsV65(items){
  const map = new Map();
  (items || []).map(normalizeTextationItemV65).forEach(item => {
    if(!item.title && !item.text) return;
    map.set(item.id, item);
  });
  return Array.from(map.values());
}

function migrateTextationsV65(){
  let existing = [];
  try {
    const raw = localStorage.getItem(TEXTATION_STORAGE_KEY_V65);
    if(raw) existing = JSON.parse(raw) || [];
  } catch(e){ existing = []; }

  let migrated = Array.isArray(existing) ? existing : [];
  TEXTATION_LEGACY_KEYS_V65.forEach(key => {
    try{
      const raw = localStorage.getItem(key);
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr)) migrated = migrated.concat(arr);
      }
    }catch(e){}
  });

  if(typeof DEFAULT_TEXTATIONS !== 'undefined' && Array.isArray(DEFAULT_TEXTATIONS)){
    migrated = migrated.concat(DEFAULT_TEXTATIONS);
  }

  migrated = uniqueTextationsV65(migrated);
  localStorage.setItem(TEXTATION_STORAGE_KEY_V65, JSON.stringify(migrated));
  return migrated;
}

function getTextationLibrary(){
  try{
    const raw = localStorage.getItem(TEXTATION_STORAGE_KEY_V65);
    if(raw){
      const items = uniqueTextationsV65(JSON.parse(raw));
      if(items.length) return items;
    }
  }catch(e){}
  return migrateTextationsV65();
}

function saveTextationLibrary(items){
  const clean = uniqueTextationsV65(items || []);
  localStorage.setItem(TEXTATION_STORAGE_KEY_V65, JSON.stringify(clean));
  localStorage.setItem('astorie_textations_v62', JSON.stringify(clean));
  localStorage.setItem('astorie_textations_v63', JSON.stringify(clean));
  localStorage.setItem('astorie_textations_v64', JSON.stringify(clean));
}

function clearTextationFilters(){
  if($('textationSearch')) $('textationSearch').value = '';
  if($('textationCategory')) $('textationCategory').value = '';
  if($('textationTag')) $('textationTag').value = '';
}

function renderTextationLibrary(selectedId){
  migrateTextationsV65();
  const list = $('textationList');
  if(!list) return;
  let items = getTextationLibrary();

  const q = ($('textationSearch')?.value || '').toLowerCase().trim();
  const cat = $('textationCategory')?.value || '';
  const tag = $('textationTag')?.value || '';

  if(cat) items = items.filter(i => i.category === cat);
  if(tag) items = items.filter(i => (i.tags || []).includes(tag));
  if(q){
    items = items.filter(i =>
      [i.title, i.category, i.usage, i.text, (i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }

  if(!items.length){
    list.innerHTML = '<div class="textation-empty">Nenalezena žádná textace. Zrušte filtry nebo přidejte novou textaci.</div>';
    return;
  }

  list.innerHTML = items.map(i => `
    <button type="button" class="textation-item ${selectedId === i.id ? 'active' : ''}" data-textation-id="${escapeHtml(i.id)}" onclick="showTextationDetail('${escapeHtml(i.id)}')">
      <span>${escapeHtml(i.category)}</span>
      <b>${escapeHtml(i.title)}</b>
      <small>${escapeHtml(i.usage || '')}${(i.tags||[]).length ? ' · ' + escapeHtml((i.tags||[]).join(' · ')) : ''}</small>
    </button>
  `).join('');

  if(selectedId && window.CSS && CSS.escape){
    const el = list.querySelector(`[data-textation-id="${CSS.escape(selectedId)}"]`);
    if(el) el.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

function findTextation(id){
  return getTextationLibrary().find(i => i.id === id);
}

function showTextationDetail(id){
  const item = findTextation(id);
  const box = $('textationDetail');
  if(!item || !box) return;

  document.querySelectorAll('.textation-item').forEach(btn => btn.classList.remove('active'));
  if(window.CSS && CSS.escape){
    const active = document.querySelector(`[data-textation-id="${CSS.escape(id)}"]`);
    if(active) active.classList.add('active');
  }

  box.innerHTML = `
    <p class="eyebrow">${escapeHtml(item.category)}</p>
    <h3>${escapeHtml(item.title)}</h3>
    <p class="textation-usage"><b>Použití:</b> ${escapeHtml(item.usage || 'obecně')}</p>
    <div class="textation-fulltext">${escapeHtml(item.text || '').replace(/\n/g,'<br>')}</div>
    <div class="textation-tags">${(item.tags||[]).map(t=>'<span>'+escapeHtml(t)+'</span>').join('')}</div>
    <div class="textation-detail-actions">
      <button class="primary" type="button" onclick="insertTextationToNotes('${escapeHtml(item.id)}')">Vložit do poznámek</button>
      <button class="secondary" type="button" onclick="copyTextation('${escapeHtml(item.id)}')">Zkopírovat</button>
      <button class="secondary" type="button" onclick="editTextation('${escapeHtml(item.id)}')">Upravit</button>
      <button class="danger-light" type="button" onclick="deleteTextation('${escapeHtml(item.id)}')">Smazat</button>
    </div>
  `;
}

function saveTextationFromEditor(){
  const title = ($('textationEditTitle')?.value || '').trim();
  const category = ($('textationEditCategory')?.value || '').trim();
  const usage = ($('textationEditUsage')?.value || '').trim();
  const tagsRaw = ($('textationEditTags')?.value || '').trim();
  const text = ($('textationEditText')?.value || '').trim();
  const id = ($('textationEditId')?.value || '').trim();

  if(!title){
    alert('Doplňte název textace.');
    $('textationEditTitle')?.focus();
    return;
  }
  if(!text){
    alert('Doplňte textaci.');
    $('textationEditText')?.focus();
    return;
  }

  const items = getTextationLibrary();
  const payload = normalizeTextationItemV65({
    id: id || ('custom-' + Date.now()),
    title, category, usage,
    tags: tagsRaw.split(',').map(t=>t.trim()).filter(Boolean),
    text
  });

  const idx = items.findIndex(i => i.id === payload.id);
  if(idx >= 0) items[idx] = payload;
  else items.unshift(payload);

  saveTextationLibrary(items);
  clearTextationFilters();
  closeTextationEditor();
  renderTextationLibrary(payload.id);
  showTextationDetail(payload.id);
  renderAdminTextations();
  textationStatus('Textace byla uložena a je viditelná v knihovně.', 'ok');
}

function deleteTextation(id){
  const item = findTextation(id);
  if(!item) return;
  if(!confirm('Opravdu smazat textaci: ' + item.title + '?')) return;
  saveTextationLibrary(getTextationLibrary().filter(i => i.id !== id));
  renderTextationLibrary();
  renderAdminTextations();
  const box = $('textationDetail');
  if(box) box.innerHTML = '<p class="eyebrow">Detail textace</p><h3>Vyberte textaci</h3><p>Po kliknutí na textaci se zobrazí celý text, možnost kopírování, vložení do pracovních poznámek a úprava.</p>';
  textationStatus('Textace byla smazána.', 'warn');
}

function resetTextationLibrary(){
  if(!confirm('Obnovit vzorové textace? Vlastní lokální úpravy v prohlížeči budou nahrazeny.')) return;
  const defaults = (typeof DEFAULT_TEXTATIONS !== 'undefined' && Array.isArray(DEFAULT_TEXTATIONS)) ? DEFAULT_TEXTATIONS : [];
  saveTextationLibrary(defaults);
  clearTextationFilters();
  renderTextationLibrary();
  renderAdminTextations();
  textationStatus('Vzorové textace byly obnoveny.', 'ok');
}

function renderAdminTextations(){
  const list = $('adminTextationList');
  if(!list) return;
  let items = getTextationLibrary();

  const q = ($('adminTextationSearch')?.value || '').toLowerCase().trim();
  const cat = $('adminTextationCategory')?.value || '';

  if(cat) items = items.filter(i => i.category === cat);
  if(q){
    items = items.filter(i =>
      [i.title, i.category, i.usage, i.text, (i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }

  if(!items.length){
    list.innerHTML = '<div class="admin-note">Nenalezena žádná textace. Použijte tlačítko „+ Přidat textaci“.</div>';
    return;
  }

  list.innerHTML = `
    <table class="admin-textation-table">
      <thead><tr><th>Název</th><th>Kategorie</th><th>Použití</th><th>Tagy</th><th>Akce</th></tr></thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td><b>${escapeHtml(i.title)}</b><br><small>${escapeHtml((i.text || '').slice(0, 140))}${(i.text||'').length > 140 ? '…' : ''}</small></td>
            <td>${escapeHtml(i.category)}</td>
            <td>${escapeHtml(i.usage || '')}</td>
            <td>${(i.tags||[]).map(t=>'<span class="mini-tag">'+escapeHtml(t)+'</span>').join('')}</td>
            <td>
              <button class="secondary small-btn" type="button" onclick="showView('textationsView'); setTimeout(()=>showTextationDetail('${escapeHtml(i.id)}'),80)">Detail</button>
              <button class="secondary small-btn" type="button" onclick="showView('textationsView'); setTimeout(()=>editTextation('${escapeHtml(i.id)}'),80)">Upravit</button>
              <button class="danger-light small-btn" type="button" onclick="deleteTextation('${escapeHtml(i.id)}')">Smazat</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderTextationsWorkspace(){
  migrateTextationsV65();
  renderTextationLibrary();
  loadCaseTextationNotesLocal();
}


// MVP 0.66 - stable saved textations list
const TEXTATION_STORAGE_KEY_V66 = 'astorie_textations_stable_v66';
const TEXTATION_ALL_KEYS_V66 = [
  'astorie_textations_stable_v66',
  'astorie_textations_v65',
  'astorie_textations_v64',
  'astorie_textations_v63',
  'astorie_textations_v62'
];

function stableNormalizeTextation(item){
  const tags = Array.isArray(item.tags)
    ? item.tags
    : String(item.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  return {
    id: item.id || ('custom-' + Date.now() + '-' + Math.random().toString(16).slice(2)),
    title: item.title || item.name || 'Bez názvu',
    category: item.category || 'Zvláštní ujednání',
    usage: item.usage || item.type || 'Poptávka pojišťovně',
    tags: tags,
    text: item.text || item.fullText || item.body || ''
  };
}

function stableUniqueTextations(items){
  const map = new Map();
  (items || []).forEach(raw => {
    const item = stableNormalizeTextation(raw || {});
    if(!item.title && !item.text) return;
    // pokud je vlastní uložená textace bez stabilního ID, zachovej jako položku dle id
    map.set(item.id, item);
  });
  return Array.from(map.values());
}

function stableReadTextations(){
  let merged = [];
  TEXTATION_ALL_KEYS_V66.forEach(key => {
    try{
      const raw = localStorage.getItem(key);
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr)) merged = merged.concat(arr);
      }
    }catch(e){}
  });
  if(typeof DEFAULT_TEXTATIONS !== 'undefined' && Array.isArray(DEFAULT_TEXTATIONS)){
    merged = merged.concat(DEFAULT_TEXTATIONS);
  }
  const clean = stableUniqueTextations(merged);
  stableWriteTextations(clean);
  return clean;
}

function stableWriteTextations(items){
  const clean = stableUniqueTextations(items || []);
  const data = JSON.stringify(clean);
  TEXTATION_ALL_KEYS_V66.forEach(key => {
    try{ localStorage.setItem(key, data); }catch(e){}
  });
}

// Override library accessors definitively
function getTextationLibrary(){
  return stableReadTextations();
}

function saveTextationLibrary(items){
  stableWriteTextations(items || []);
}

function forceRenderSavedTextations(){
  renderSavedTextations();
  renderTextationLibrary();
}

function renderSavedTextations(selectedId){
  const box = $('savedTextationList');
  if(!box) return;
  const items = stableReadTextations()
    .filter(i => String(i.id || '').indexOf('odp-') !== 0 || i.title)  // keep defaults too
    .sort((a,b) => {
      const ac = String(a.id || '').startsWith('custom-') ? 0 : 1;
      const bc = String(b.id || '').startsWith('custom-') ? 0 : 1;
      return ac - bc || String(a.title).localeCompare(String(b.title), 'cs');
    });

  if(!items.length){
    box.innerHTML = '<div class="textation-empty">Zatím není uložená žádná textace.</div>';
    return;
  }

  box.innerHTML = items.map(i => `
    <button type="button" class="saved-textation-item ${selectedId === i.id ? 'active' : ''}" data-saved-textation-id="${escapeHtml(i.id)}" onclick="showTextationDetailStable('${escapeHtml(i.id)}')">
      <b>${escapeHtml(i.title)}</b>
      <span>${escapeHtml(i.category)} · ${escapeHtml(i.usage || '')}</span>
      <small>${(i.tags||[]).map(t=>escapeHtml(t)).join(' · ')}</small>
    </button>
  `).join('');

  if(selectedId && window.CSS && CSS.escape){
    const el = box.querySelector(`[data-saved-textation-id="${CSS.escape(selectedId)}"]`);
    if(el) el.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

function renderTextationLibrary(selectedId){
  const list = $('textationList');
  if(!list) return;
  let items = stableReadTextations();

  const q = ($('textationSearch')?.value || '').toLowerCase().trim();
  const cat = $('textationCategory')?.value || '';
  const tag = $('textationTag')?.value || '';

  if(cat) items = items.filter(i => i.category === cat);
  if(tag) items = items.filter(i => (i.tags || []).includes(tag));
  if(q){
    items = items.filter(i =>
      [i.title, i.category, i.usage, i.text, (i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }

  if(!items.length){
    list.innerHTML = '<div class="textation-empty">Podle filtru není nalezena žádná textace. Všechny uložené textace najdete výše v bloku „Moje uložené textace“.</div>';
    return;
  }

  list.innerHTML = items.map(i => `
    <button type="button" class="textation-item ${selectedId === i.id ? 'active' : ''}" data-textation-id="${escapeHtml(i.id)}" onclick="showTextationDetailStable('${escapeHtml(i.id)}')">
      <span>${escapeHtml(i.category)}</span>
      <b>${escapeHtml(i.title)}</b>
      <small>${escapeHtml(i.usage || '')}${(i.tags||[]).length ? ' · ' + escapeHtml((i.tags||[]).join(' · ')) : ''}</small>
    </button>
  `).join('');
}

function findTextation(id){
  return stableReadTextations().find(i => i.id === id);
}

function showTextationDetailStable(id){
  showTextationDetail(id);
  document.querySelectorAll('.saved-textation-item').forEach(btn => btn.classList.remove('active'));
  if(window.CSS && CSS.escape){
    const active = document.querySelector(`[data-saved-textation-id="${CSS.escape(id)}"]`);
    if(active) active.classList.add('active');
  }
}

function saveTextationFromEditor(){
  const title = ($('textationEditTitle')?.value || '').trim();
  const category = ($('textationEditCategory')?.value || '').trim();
  const usage = ($('textationEditUsage')?.value || '').trim();
  const tagsRaw = ($('textationEditTags')?.value || '').trim();
  const text = ($('textationEditText')?.value || '').trim();
  const id = ($('textationEditId')?.value || '').trim();

  if(!title){
    alert('Doplňte název textace.');
    $('textationEditTitle')?.focus();
    return;
  }
  if(!text){
    alert('Doplňte textaci.');
    $('textationEditText')?.focus();
    return;
  }

  const items = stableReadTextations();
  const payload = stableNormalizeTextation({
    id: id || ('custom-' + Date.now()),
    title, category, usage,
    tags: tagsRaw.split(',').map(t=>t.trim()).filter(Boolean),
    text
  });

  const idx = items.findIndex(i => i.id === payload.id);
  if(idx >= 0) items[idx] = payload;
  else items.unshift(payload);

  stableWriteTextations(items);

  if($('textationSearch')) $('textationSearch').value = '';
  if($('textationCategory')) $('textationCategory').value = '';
  if($('textationTag')) $('textationTag').value = '';

  closeTextationEditor();

  renderSavedTextations(payload.id);
  renderTextationLibrary(payload.id);
  showTextationDetailStable(payload.id);
  renderAdminTextations();

  const status = $('textationSaveStatus');
  if(status){
    status.className = 'textation-save-status ok';
    status.textContent = 'Textace byla uložena. Najdete ji v bloku „Moje uložené textace“.';
    status.classList.remove('hidden');
  } else {
    alert('Textace byla uložena. Najdete ji v bloku Moje uložené textace.');
  }
}

function deleteTextation(id){
  const item = findTextation(id);
  if(!item) return;
  if(!confirm('Opravdu smazat textaci: ' + item.title + '?')) return;
  stableWriteTextations(stableReadTextations().filter(i => i.id !== id));
  renderSavedTextations();
  renderTextationLibrary();
  renderAdminTextations();
  const box = $('textationDetail');
  if(box) box.innerHTML = '<p class="eyebrow">Detail textace</p><h3>Vyberte textaci</h3><p>Po kliknutí na textaci se zobrazí celý text, možnost kopírování, vložení do pracovních poznámek a úprava.</p>';
}

function resetTextationLibrary(){
  if(!confirm('Obnovit vzorové textace? Vlastní lokální úpravy v prohlížeči budou nahrazeny.')) return;
  const defaults = (typeof DEFAULT_TEXTATIONS !== 'undefined' && Array.isArray(DEFAULT_TEXTATIONS)) ? DEFAULT_TEXTATIONS : [];
  stableWriteTextations(defaults);
  renderSavedTextations();
  renderTextationLibrary();
  renderAdminTextations();
}

function renderTextationsWorkspace(){
  stableReadTextations();
  renderSavedTextations();
  renderTextationLibrary();
  if(typeof loadCaseTextationNotesLocal === 'function') loadCaseTextationNotesLocal();
}

// render list when page is ready, if user is already on Textace
setTimeout(()=>{ if($('savedTextationList')) renderSavedTextations(); }, 300);


// MVP 0.67 HOTFIX - escapeHtml + safe render
if (typeof escapeHtml === 'undefined') {
  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/\"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
}

window.addEventListener('error', function(e){
  console.error('ASTORIE RENDER ERROR:', e.message);
});

function safeRenderTextations(){
  try{
    if(typeof renderSavedTextations === 'function'){
      renderSavedTextations();
    }
    if(typeof renderTextationLibrary === 'function'){
      renderTextationLibrary();
    }
  }catch(err){
    console.error('TEXTATION RENDER FAILED', err);
    const box = document.getElementById('savedTextationList');
    if(box){
      box.innerHTML = '<div class="textation-empty">Došlo k chybě rendereru textací. Obnovte stránku a zkuste textaci uložit znovu.</div>';
    }
  }
}

setTimeout(()=>safeRenderTextations(),200);



// MVP 0.68 - split My Textations / Central Database
function isCustomTextationV68(item){
  return String(item && item.id || '').startsWith('custom-');
}
function isSuggestedTextationV68(item){
  return !!(item && item.suggestedToCentral);
}
function getFilteredTextationsV68(){
  let items = (typeof stableReadTextations === 'function') ? stableReadTextations() : getTextationLibrary();
  const q = ($('textationSearch')?.value || '').toLowerCase().trim();
  const cat = $('textationCategory')?.value || '';
  const tag = $('textationTag')?.value || '';

  if(cat) items = items.filter(i => i.category === cat);
  if(tag) items = items.filter(i => (i.tags || []).includes(tag));
  if(q){
    items = items.filter(i =>
      [i.title, i.category, i.usage, i.text, (i.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }
  return items;
}

function renderTextationCardV68(item, mode, selectedId){
  const suggested = isSuggestedTextationV68(item) ? '<em class="proposal-chip">navrženo do centrální databáze</em>' : '';
  return `
    <button type="button" class="saved-textation-item ${selectedId === item.id ? 'active' : ''}" data-saved-textation-id="${escapeHtml(item.id)}" onclick="showTextationDetailStable('${escapeHtml(item.id)}')">
      <b>${escapeHtml(item.title)}</b>
      <span>${escapeHtml(item.category)} · ${escapeHtml(item.usage || '')}</span>
      <small>${(item.tags||[]).map(t=>escapeHtml(t)).join(' · ')}</small>
      ${suggested}
    </button>
  `;
}

function renderSavedTextations(selectedId){
  const myBox = $('myTextationList');
  const centralBox = $('centralTextationList');
  const legacyBox = $('savedTextationList');

  const items = getFilteredTextationsV68();
  const mine = items.filter(isCustomTextationV68);
  const central = items.filter(i => !isCustomTextationV68(i));

  if(myBox){
    myBox.innerHTML = mine.length
      ? mine.map(i => renderTextationCardV68(i, 'mine', selectedId)).join('')
      : '<div class="textation-empty">Zatím nemáte žádnou vlastní textaci. Klikněte na „+ Přidat textaci“.</div>';
  }

  if(centralBox){
    centralBox.innerHTML = central.length
      ? central.map(i => renderTextationCardV68(i, 'central', selectedId)).join('')
      : '<div class="textation-empty">Ve filtru není žádná centrální textace.</div>';
  }

  if(legacyBox && !myBox && !centralBox){
    legacyBox.innerHTML = items.length
      ? items.map(i => renderTextationCardV68(i, 'legacy', selectedId)).join('')
      : '<div class="textation-empty">Zatím není uložená žádná textace.</div>';
  }
}

function renderTextationLibrary(selectedId){
  // Duplicitní spodní seznam už nevykreslujeme. Filtry se promítají do Moje textace + Centrální databáze.
  renderSavedTextations(selectedId);
}

function showTextationDetail(id){
  const item = findTextation(id);
  const box = $('textationDetail');
  if(!item || !box) return;

  document.querySelectorAll('.saved-textation-item,.textation-item').forEach(btn => btn.classList.remove('active'));
  if(window.CSS && CSS.escape){
    document.querySelectorAll(`[data-saved-textation-id="${CSS.escape(id)}"],[data-textation-id="${CSS.escape(id)}"]`).forEach(el => el.classList.add('active'));
  }

  const custom = isCustomTextationV68(item);
  const actionButtons = custom
    ? `
      <button class="primary" type="button" onclick="insertTextationToNotes('${escapeHtml(item.id)}')">Vložit do poznámek</button>
      <button class="secondary" type="button" onclick="copyTextation('${escapeHtml(item.id)}')">Zkopírovat</button>
      <button class="secondary" type="button" onclick="editTextation('${escapeHtml(item.id)}')">Upravit</button>
      <button class="secondary" type="button" onclick="proposeTextationToCentral('${escapeHtml(item.id)}')">Navrhnout do centrální databáze</button>
      <button class="danger-light" type="button" onclick="deleteTextation('${escapeHtml(item.id)}')">Smazat</button>
    `
    : `
      <button class="primary" type="button" onclick="insertTextationToNotes('${escapeHtml(item.id)}')">Vložit do poznámek</button>
      <button class="secondary" type="button" onclick="copyTextation('${escapeHtml(item.id)}')">Zkopírovat</button>
    `;

  box.innerHTML = `
    <p class="eyebrow">${custom ? 'Moje textace' : 'Centrální databáze'} · ${escapeHtml(item.category)}</p>
    <h3>${escapeHtml(item.title)}</h3>
    <p class="textation-usage"><b>Použití:</b> ${escapeHtml(item.usage || 'obecně')}</p>
    ${isSuggestedTextationV68(item) ? '<div class="proposal-note">Tato textace byla odeslána jako návrh pro zařazení do centrální databáze.</div>' : ''}
    <div class="textation-fulltext">${escapeHtml(item.text || '').replace(/\n/g,'<br>')}</div>
    <div class="textation-tags">${(item.tags||[]).map(t=>'<span>'+escapeHtml(t)+'</span>').join('')}</div>
    <div class="textation-detail-actions">${actionButtons}</div>
  `;
}

function proposeTextationToCentral(id){
  const items = stableReadTextations();
  const idx = items.findIndex(i => i.id === id);
  if(idx < 0) return;
  items[idx].suggestedToCentral = true;
  items[idx].suggestedAt = new Date().toISOString();
  stableWriteTextations(items);
  renderSavedTextations(id);
  showTextationDetail(id);
  alert('Textace byla označena jako návrh pro zařazení do centrální databáze.');
}

function saveTextationFromEditor(){
  const title = ($('textationEditTitle')?.value || '').trim();
  const category = ($('textationEditCategory')?.value || '').trim();
  const usage = ($('textationEditUsage')?.value || '').trim();
  const tagsRaw = ($('textationEditTags')?.value || '').trim();
  const text = ($('textationEditText')?.value || '').trim();
  const id = ($('textationEditId')?.value || '').trim();

  if(!title){ alert('Doplňte název textace.'); $('textationEditTitle')?.focus(); return; }
  if(!text){ alert('Doplňte textaci.'); $('textationEditText')?.focus(); return; }

  const items = stableReadTextations();
  const payload = stableNormalizeTextation({
    id: id || ('custom-' + Date.now()),
    title, category, usage,
    tags: tagsRaw.split(',').map(t=>t.trim()).filter(Boolean),
    text
  });

  const idx = items.findIndex(i => i.id === payload.id);
  if(idx >= 0) items[idx] = {...items[idx], ...payload};
  else items.unshift(payload);

  stableWriteTextations(items);

  if($('textationSearch')) $('textationSearch').value = '';
  if($('textationCategory')) $('textationCategory').value = '';
  if($('textationTag')) $('textationTag').value = '';

  closeTextationEditor();
  renderSavedTextations(payload.id);
  showTextationDetail(payload.id);
  renderAdminTextations();

  const status = $('textationSaveStatus');
  if(status){
    status.className = 'textation-save-status ok';
    status.textContent = 'Textace byla uložena do sekce „Moje textace“.';
    status.classList.remove('hidden');
  }
}

function forceRenderSavedTextations(){
  renderSavedTextations();
  renderAdminTextations();
}

function renderTextationsWorkspace(){
  stableReadTextations();
  renderSavedTextations();
  if(typeof loadCaseTextationNotesLocal === 'function') loadCaseTextationNotesLocal();
}

setTimeout(()=>{ if($('myTextationList') || $('centralTextationList')) renderSavedTextations(); }, 300);


// MVP 0.69 - UX tabs for textations
window.currentTextationTab = window.currentTextationTab || 'mine';

function setTextationTab(tab){
  window.currentTextationTab = tab || 'mine';
  document.querySelectorAll('[data-textation-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.textationTab === window.currentTextationTab);
  });
  document.querySelectorAll('.textation-tab-panel').forEach(panel => {
    panel.classList.toggle('hidden', panel.dataset.panel !== window.currentTextationTab);
  });
  renderSavedTextations();
}

function renderTextationCardV68(item, mode, selectedId){
  const suggested = isSuggestedTextationV68(item) ? '<em class="proposal-chip">navrženo ke schválení</em>' : '';
  const source = isCustomTextationV68(item) ? 'Moje' : 'Centrální';
  return `
    <button type="button" class="saved-textation-item ${selectedId === item.id ? 'active' : ''}" data-saved-textation-id="${escapeHtml(item.id)}" onclick="showTextationDetailStable('${escapeHtml(item.id)}')">
      <span class="textation-source">${source}</span>
      <b>${escapeHtml(item.title)}</b>
      <span>${escapeHtml(item.category)}</span>
      <small>${escapeHtml(item.usage || '')}${(item.tags||[]).length ? ' · ' + escapeHtml((item.tags||[]).join(' · ')) : ''}</small>
      ${suggested}
    </button>
  `;
}

function renderSavedTextations(selectedId){
  const myBox = $('myTextationList');
  const centralBox = $('centralTextationList');
  const suggestedBox = $('suggestedTextationList');

  const items = getFilteredTextationsV68();
  const mine = items.filter(isCustomTextationV68);
  const central = items.filter(i => !isCustomTextationV68(i));
  const suggested = items.filter(isSuggestedTextationV68);

  if(myBox){
    myBox.innerHTML = mine.length
      ? mine.map(i => renderTextationCardV68(i, 'mine', selectedId)).join('')
      : '<div class="textation-empty">Zatím nemáte žádnou vlastní textaci. Klikněte na „+ Přidat textaci“.</div>';
  }

  if(centralBox){
    centralBox.innerHTML = central.length
      ? central.map(i => renderTextationCardV68(i, 'central', selectedId)).join('')
      : '<div class="textation-empty">Ve filtru není žádná centrální textace.</div>';
  }

  if(suggestedBox){
    suggestedBox.innerHTML = suggested.length
      ? suggested.map(i => renderTextationCardV68(i, 'suggested', selectedId)).join('')
      : '<div class="textation-empty">Zatím není žádná textace navržená ke schválení.</div>';
  }
}

function saveTextationFromEditor(){
  const title = ($('textationEditTitle')?.value || '').trim();
  const category = ($('textationEditCategory')?.value || '').trim();
  const usage = ($('textationEditUsage')?.value || '').trim();
  const tagsRaw = ($('textationEditTags')?.value || '').trim();
  const text = ($('textationEditText')?.value || '').trim();
  const id = ($('textationEditId')?.value || '').trim();

  if(!title){ alert('Doplňte název textace.'); $('textationEditTitle')?.focus(); return; }
  if(!text){ alert('Doplňte textaci.'); $('textationEditText')?.focus(); return; }

  const items = stableReadTextations();
  const payload = stableNormalizeTextation({
    id: id || ('custom-' + Date.now()),
    title, category, usage,
    tags: tagsRaw.split(',').map(t=>t.trim()).filter(Boolean),
    text
  });

  const idx = items.findIndex(i => i.id === payload.id);
  if(idx >= 0) items[idx] = {...items[idx], ...payload};
  else items.unshift(payload);

  stableWriteTextations(items);

  if($('textationSearch')) $('textationSearch').value = '';
  if($('textationCategory')) $('textationCategory').value = '';
  if($('textationTag')) $('textationTag').value = '';

  closeTextationEditor();
  setTextationTab('mine');
  renderSavedTextations(payload.id);
  showTextationDetail(payload.id);

  const status = $('textationSaveStatus');
  if(status){
    status.className = 'textation-save-status ok';
    status.textContent = 'Textace byla uložena do záložky „Moje textace“.';
    status.classList.remove('hidden');
  }
}

function proposeTextationToCentral(id){
  const items = stableReadTextations();
  const idx = items.findIndex(i => i.id === id);
  if(idx < 0) return;
  items[idx].suggestedToCentral = true;
  items[idx].suggestedAt = new Date().toISOString();
  stableWriteTextations(items);
  setTextationTab('suggested');
  renderSavedTextations(id);
  showTextationDetail(id);
  alert('Textace byla přesunuta do záložky „Návrhy ke schválení“.');
}

function renderTextationsWorkspace(){
  stableReadTextations();
  setTextationTab(window.currentTextationTab || 'mine');
  if(typeof loadCaseTextationNotesLocal === 'function') loadCaseTextationNotesLocal();
}

// MVP 0.70 - Active case workflow engine
const CASE_STAGE_KEY_V70 = 'astorie_case_stage_v70';
const CASE_DOCS_KEY_V70 = 'astorie_case_documents_v70';
const CASE_CHECKLIST_KEY_V70 = 'astorie_case_checklist_v70';

function getActiveCaseV70(){
  const active = state.activeInquiry || {};
  const clientName = active.clientName || state.form?.clientName || (document.getElementById('clientName')?.value || '');
  const businessType = active.businessType || active.clientActivity || state.form?.clientActivity || '';
  return { id: active.id || active.dbId || '', clientName, businessType, status: active.status || 'rozpracováno' };
}
function getCaseStage(){ return localStorage.getItem(CASE_STAGE_KEY_V70) || 'draft'; }
function setCaseStage(stage){ localStorage.setItem(CASE_STAGE_KEY_V70, stage || 'draft'); renderCaseCommandCenter(); }
function getCaseDocuments(){ try{ return JSON.parse(localStorage.getItem(CASE_DOCS_KEY_V70) || '[]'); }catch(e){ return []; } }
function saveCaseDocuments(items){ localStorage.setItem(CASE_DOCS_KEY_V70, JSON.stringify(items || [])); }
function openCaseDocumentEditor(){ document.getElementById('caseDocumentEditor')?.classList.remove('hidden'); document.getElementById('docTitle')?.focus(); }
function closeCaseDocumentEditor(){ document.getElementById('caseDocumentEditor')?.classList.add('hidden'); }
function saveCaseDocument(){
  const title = (document.getElementById('docTitle')?.value || '').trim();
  if(!title){ alert('Doplňte název dokumentu.'); document.getElementById('docTitle')?.focus(); return; }
  const item = { id:'doc-' + Date.now(), title, type:document.getElementById('docType')?.value || 'Ostatní', source:(document.getElementById('docSource')?.value || '').trim(), status:document.getElementById('docStatus')?.value || 'k ověření', note:(document.getElementById('docNote')?.value || '').trim(), createdAt:new Date().toISOString() };
  const docs = getCaseDocuments(); docs.unshift(item); saveCaseDocuments(docs);
  ['docTitle','docSource','docNote'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  closeCaseDocumentEditor(); renderCaseDocuments(); renderCaseCommandCenter();
}
function deleteCaseDocument(id){ if(!confirm('Smazat dokument z evidence případu?')) return; saveCaseDocuments(getCaseDocuments().filter(d => d.id !== id)); renderCaseDocuments(); renderCaseCommandCenter(); }
function renderCaseDocuments(){
  const box = document.getElementById('caseDocumentList'); if(!box) return;
  const docs = getCaseDocuments();
  if(!docs.length){ box.innerHTML = '<div class="textation-empty">Zatím není evidovaný žádný dokument k aktivnímu případu.</div>'; return; }
  box.innerHTML = docs.map(d => `
    <div class="case-document-item">
      <div><b>${escapeHtml(d.title)}</b><span>${escapeHtml(d.type)}${d.source ? ' · ' + escapeHtml(d.source) : ''}</span>${d.note ? '<small>'+escapeHtml(d.note)+'</small>' : ''}</div>
      <em class="doc-status">${escapeHtml(d.status)}</em>
      <button class="danger-light small-btn" type="button" onclick="deleteCaseDocument('${escapeHtml(d.id)}')">Smazat</button>
    </div>`).join('');
}
function getChecklistState(){ try{ return JSON.parse(localStorage.getItem(CASE_CHECKLIST_KEY_V70) || '{}'); }catch(e){ return {}; } }
function saveChecklistState(data){ localStorage.setItem(CASE_CHECKLIST_KEY_V70, JSON.stringify(data || {})); }
function bindChecklistV70(){
  const boxes = document.querySelectorAll('#checklistView .uw-checklist input[type="checkbox"]'); if(!boxes.length) return;
  const stateData = getChecklistState();
  boxes.forEach((cb, idx) => { const key='check-'+idx; cb.checked=!!stateData[key]; if(!cb.dataset.v70bound){ cb.dataset.v70bound='1'; cb.addEventListener('change',()=>{ const current=getChecklistState(); current[key]=cb.checked; saveChecklistState(current); renderChecklistSummaryV70(); renderCaseCommandCenter(); }); } });
  renderChecklistSummaryV70();
}
function renderChecklistSummaryV70(){
  const boxes = Array.from(document.querySelectorAll('#checklistView .uw-checklist input[type="checkbox"]'));
  const done = boxes.filter(b=>b.checked).length; const total = boxes.length || 8;
  if(document.getElementById('checklistDoneCount')) document.getElementById('checklistDoneCount').textContent = done + '/' + total;
  const docs = getCaseDocuments().length; const offers = Array.isArray(state.offers) ? state.offers.length : 0;
  let critical = 0; if(!docs) critical++; if(offers < 2) critical++; if(done < Math.ceil(total/2)) critical++;
  if(document.getElementById('checklistCriticalCount')) document.getElementById('checklistCriticalCount').textContent = critical;
  if(document.getElementById('checklistCaseState')) document.getElementById('checklistCaseState').textContent = critical ? 'doplnit' : 'připraveno';
}
function calculateCaseReadiness(){
  const active=getActiveCaseV70(); const docs=getCaseDocuments().length; const offers=Array.isArray(state.offers)?state.offers.length:0; const checklist=getChecklistState(); const checkedCount=Object.values(checklist).filter(Boolean).length;
  let score=0; if(active.clientName) score+=20; if(active.businessType) score+=10; if(docs>0) score+=20; if(offers>0) score+=15; if(offers>=2) score+=15; score+=Math.min(20, checkedCount*3); return Math.min(100, score);
}
function getMissingParts(){ const active=getActiveCaseV70(); const docs=getCaseDocuments().length; const offers=Array.isArray(state.offers)?state.offers.length:0; const checkedCount=Object.values(getChecklistState()).filter(Boolean).length; const missing=[]; if(!active.clientName) missing.push('klient'); if(!active.businessType) missing.push('činnost'); if(!docs) missing.push('dokumenty'); if(offers<2) missing.push('min. 2 nabídky'); if(checkedCount<4) missing.push('checklist'); return missing; }
function stageLabelV70(stage){ return ({draft:'rozpracování',documents:'sběr podkladů',inquiry:'poptávka',offers:'nabídky',comparison:'porovnání',report:'zpráva',closed:'uzavřeno'}[stage] || 'rozpracování'); }
function getRecommendedStepV70(){ const active=getActiveCaseV70(); const docs=getCaseDocuments().length; const offers=Array.isArray(state.offers)?state.offers.length:0; if(!active.clientName) return {title:'Doplňte klienta',text:'Začněte identifikací klienta a načtením ARES.',view:'inquiryView'}; if(!docs) return {title:'Doplňte dokumenty',text:'Přidejte škodní průběh, nabídky, VPP/ZPP nebo jiné podklady.',view:'documentsView'}; if(offers<2) return {title:'Doplňte nabídky',text:'Pro kvalitní porovnání jsou potřeba alespoň dvě nabídky.',view:'offersView'}; return {title:'Připravte porovnání a zprávu',text:'Zkontrolujte rozdíly v limitech, výlukách a ceně.',view:'comparisonView'}; }
function goToRecommendedStep(){ const next=getRecommendedStepV70(); showView(next.view || 'inquiryView'); }
function renderCaseCommandCenter(){
  const active=getActiveCaseV70(); const docs=getCaseDocuments().length; const offers=Array.isArray(state.offers)?state.offers.length:0; const readiness=calculateCaseReadiness(); const missing=getMissingParts();
  const title=active.clientName || 'Není vybrána žádná poptávka';
  if(document.getElementById('caseCCClient')) document.getElementById('caseCCClient').textContent=title;
  if(document.getElementById('caseCCMeta')) document.getElementById('caseCCMeta').textContent=[active.businessType||'typ činnosti není vyplněn', active.id?('DB #'+active.id):'bez DB ID', active.status||'rozpracováno', 'stav workflow: '+stageLabelV70(getCaseStage())].join(' · ');
  if(document.getElementById('caseCCReady')) document.getElementById('caseCCReady').textContent=readiness+'%';
  if(document.getElementById('caseCCDocs')) document.getElementById('caseCCDocs').textContent=docs;
  if(document.getElementById('caseCCOffers')) document.getElementById('caseCCOffers').textContent=offers;
  if(document.getElementById('caseCCMissing')) document.getElementById('caseCCMissing').textContent=missing.length?missing.length:'0';
  document.querySelectorAll('[data-case-step]').forEach(btn=>btn.classList.toggle('active', btn.dataset.caseStep===getCaseStage()));
  const next=getRecommendedStepV70();
  if(document.getElementById('nextActionTitle')) document.getElementById('nextActionTitle').textContent=next.title;
  if(document.getElementById('nextActionText')) document.getElementById('nextActionText').textContent=next.text;
  if(document.getElementById('riskSummaryText')) document.getElementById('riskSummaryText').textContent=readiness>=70?'Případ je pracovně připravený k porovnání / zprávě.':'Případ je rozpracovaný a vyžaduje doplnění podkladů.';
  if(document.getElementById('missingSummaryText')) document.getElementById('missingSummaryText').textContent=missing.length?('Chybí: '+missing.join(', ')):'Nejsou evidované zásadní chybějící části.';
}
function renderWorkflowEverywhereV70(){ renderCaseDocuments(); bindChecklistV70(); renderChecklistSummaryV70(); renderCaseCommandCenter(); }
setTimeout(renderWorkflowEverywhereV70,300);
document.addEventListener('click',function(e){ if(e.target && e.target.closest && e.target.closest('[data-view="documentsView"],[data-view="checklistView"],[data-view="dashboardView"]')) setTimeout(renderWorkflowEverywhereV70,120); });

// MVP 0.71 - client output and advisor recommendation
const CLIENT_REC_KEY_V71 = 'astorie_client_recommendation_v71';
const CLIENT_WARN_KEY_V71 = 'astorie_client_warnings_v71';

function loadClientOutputDraft(){
  const rec = document.getElementById('clientRecommendation');
  const warn = document.getElementById('clientWarnings');
  if(rec && !rec.dataset.bound){
    rec.value = localStorage.getItem(CLIENT_REC_KEY_V71) || '';
    rec.dataset.bound = '1';
    rec.addEventListener('input', () => localStorage.setItem(CLIENT_REC_KEY_V71, rec.value || ''));
  }
  if(warn && !warn.dataset.bound){
    warn.value = localStorage.getItem(CLIENT_WARN_KEY_V71) || '';
    warn.dataset.bound = '1';
    warn.addEventListener('input', () => localStorage.setItem(CLIENT_WARN_KEY_V71, warn.value || ''));
  }
}
function getClientCaseSummaryV71(){
  const active = typeof getActiveCaseV70 === 'function' ? getActiveCaseV70() : (state.activeInquiry || {});
  const docs = typeof getCaseDocuments === 'function' ? getCaseDocuments() : [];
  const offers = Array.isArray(state.offers) ? state.offers : [];
  const readiness = typeof calculateCaseReadiness === 'function' ? calculateCaseReadiness() : 0;
  const missing = typeof getMissingParts === 'function' ? getMissingParts() : [];
  return {active, docs, offers, readiness, missing};
}
function renderClientOutputStats(){
  const data = getClientCaseSummaryV71();
  if(document.getElementById('clientOutClient')) document.getElementById('clientOutClient').textContent = data.active.clientName || 'Klient není vybrán';
  if(document.getElementById('clientOutReadiness')) document.getElementById('clientOutReadiness').textContent = data.readiness + '%';
  if(document.getElementById('clientOutOffers')) document.getElementById('clientOutOffers').textContent = data.offers.length;
  if(document.getElementById('clientOutDocs')) document.getElementById('clientOutDocs').textContent = data.docs.length;
}
function buildClientPresentation(){
  loadClientOutputDraft();
  renderClientOutputStats();
  const data = getClientCaseSummaryV71();
  const rec = (document.getElementById('clientRecommendation')?.value || '').trim();
  const warn = (document.getElementById('clientWarnings')?.value || '').trim();
  const client = data.active.clientName || 'klienta';
  const activity = data.active.businessType || 'podnikatelská činnost není doplněna';
  const docsText = data.docs.length ? data.docs.map(d => `<li>${escapeHtml(d.type)} – ${escapeHtml(d.title)}${d.status ? ' ('+escapeHtml(d.status)+')' : ''}</li>`).join('') : '<li>Dokumenty zatím nejsou evidovány.</li>';
  const missingText = data.missing.length ? data.missing.map(m => `<li>${escapeHtml(m)}</li>`).join('') : '<li>Nejsou evidované zásadní chybějící části.</li>';
  let quality = 'Případ je rozpracovaný a je vhodné doplnit podklady před finálním doporučením.';
  if(data.readiness >= 70) quality = 'Případ je pracovně připravený pro porovnání nabídek a přípravu klientského doporučení.';
  if(data.readiness >= 90) quality = 'Případ je velmi dobře připravený pro projednání s klientem.';
  const html = `
    <div class="client-preview-header">
      <div><p>ASTORIE a.s. · S lehkostí světem financí</p><h2>Poradenské shrnutí k pojištění podnikatelských rizik</h2></div>
      <strong>${escapeHtml(data.readiness)} % připravenost</strong>
    </div>
    <div class="client-preview-body">
      <section><h3>1. Klient a účel posouzení</h3><p>Pro klienta <b>${escapeHtml(client)}</b> bylo připraveno pracovní posouzení podnikatelských rizik. Evidovaná činnost: <b>${escapeHtml(activity)}</b>.</p></section>
      <section><h3>2. Stav případu</h3><p>${escapeHtml(quality)}</p><ul>${missingText}</ul></section>
      <section><h3>3. Podklady a dokumenty</h3><ul>${docsText}</ul></section>
      <section><h3>4. Doporučení poradce</h3><p>${rec ? escapeHtml(rec) : 'Doporučení poradce zatím není doplněno. Doplňte hlavní závěr před předáním klientovi.'}</p></section>
      <section><h3>5. Důležitá upozornění</h3><p>${warn ? escapeHtml(warn) : 'Upozornění zatím nejsou doplněna. Doporučujeme ověřit limity, sublimity, spoluúčasti, výluky a územní rozsah.'}</p></section>
      <section class="client-preview-footer"><p>Tento výstup je poradenským shrnutím pro jednání s klientem. Finální doporučení, vysvětlení a volba řešení jsou vždy součástí odborného jednání poradce s klientem.</p></section>
    </div>`;
  const preview = document.getElementById('clientPresentationPreview');
  if(preview) preview.innerHTML = html;
}
function copyClientOutput(){
  buildClientPresentation();
  const preview = document.getElementById('clientPresentationPreview');
  if(!preview) return;
  navigator.clipboard?.writeText(preview.innerText || preview.textContent || '');
  alert('Klientský výstup byl zkopírován.');
}
setTimeout(()=>{ loadClientOutputDraft(); renderClientOutputStats(); }, 300);

// MVP 0.72 - Professional offer workspace
const OFFERS_V72_KEY = 'astorie_case_offers_v72';
function normalizeMoneyV72(value){ const n = Number(String(value || '').replace(/[^\d,.-]/g,'').replace(',', '.')); return isFinite(n) ? n : 0; }
function getOffersV72(){ try{ return JSON.parse(localStorage.getItem(OFFERS_V72_KEY) || '[]'); }catch(e){ return []; } }
function saveOffersV72(items){ localStorage.setItem(OFFERS_V72_KEY, JSON.stringify(items || [])); }
function openOfferEditorV72(id){
  const box = document.getElementById('offerEditorV72'); if(!box) return;
  const offer = id ? getOffersV72().find(o => o.id === id) : null;
  document.getElementById('offerEditorTitleV72').textContent = offer ? 'Upravit nabídku' : 'Nová nabídka';
  document.getElementById('offerEditIdV72').value = offer?.id || '';
  ['Insurer','Product','Premium','Limit','Deductible','Territory','Frequency','Rating','Sublimits','Exclusions','Strengths','Weaknesses','Note'].forEach(k=>{
    const el = document.getElementById('offer'+k+'V72');
    if(el){ const prop = k.charAt(0).toLowerCase()+k.slice(1); el.value = offer?.[prop] || (k==='Rating' ? 'k ověření' : ''); }
  });
  box.classList.remove('hidden'); document.getElementById('offerInsurerV72')?.focus(); box.scrollIntoView({behavior:'smooth', block:'start'});
}
function closeOfferEditorV72(){ document.getElementById('offerEditorV72')?.classList.add('hidden'); }
function saveOfferV72(){
  const insurer = (document.getElementById('offerInsurerV72')?.value || '').trim();
  if(!insurer){ alert('Doplňte pojišťovnu.'); document.getElementById('offerInsurerV72')?.focus(); return; }
  const id = document.getElementById('offerEditIdV72')?.value || '';
  const payload = {
    id: id || ('offer-' + Date.now()),
    insurer,
    product: (document.getElementById('offerProductV72')?.value || '').trim(),
    premium: (document.getElementById('offerPremiumV72')?.value || '').trim(),
    limit: (document.getElementById('offerLimitV72')?.value || '').trim(),
    deductible: (document.getElementById('offerDeductibleV72')?.value || '').trim(),
    territory: document.getElementById('offerTerritoryV72')?.value || '',
    frequency: document.getElementById('offerFrequencyV72')?.value || '',
    rating: document.getElementById('offerRatingV72')?.value || 'k ověření',
    sublimits: (document.getElementById('offerSublimitsV72')?.value || '').trim(),
    exclusions: (document.getElementById('offerExclusionsV72')?.value || '').trim(),
    strengths: (document.getElementById('offerStrengthsV72')?.value || '').trim(),
    weaknesses: (document.getElementById('offerWeaknessesV72')?.value || '').trim(),
    note: (document.getElementById('offerNoteV72')?.value || '').trim(),
    updatedAt: new Date().toISOString()
  };
  const offers = getOffersV72(); const idx = offers.findIndex(o => o.id === payload.id);
  if(idx >= 0) offers[idx] = {...offers[idx], ...payload}; else offers.unshift(payload);
  saveOffersV72(offers); closeOfferEditorV72(); renderOffersV72(payload.id); renderOfferComparisonV72(); if(typeof renderCaseCommandCenter === 'function') renderCaseCommandCenter();
}
function deleteOfferV72(id){ if(!confirm('Smazat nabídku?')) return; saveOffersV72(getOffersV72().filter(o => o.id !== id)); renderOffersV72(); renderOfferComparisonV72(); if(typeof renderCaseCommandCenter === 'function') renderCaseCommandCenter(); }
function duplicateOfferV72(id){ const offer = getOffersV72().find(o => o.id === id); if(!offer) return; const copy = {...offer, id:'offer-' + Date.now(), insurer: offer.insurer + ' – kopie', rating:'k ověření', recommended:false}; const offers=getOffersV72(); offers.unshift(copy); saveOffersV72(offers); renderOffersV72(copy.id); }
function recommendOfferV72(id){ const offers = getOffersV72().map(o => ({...o, recommended: o.id === id})); saveOffersV72(offers); renderOffersV72(id); renderOfferComparisonV72(); }
function offerWarningsV72(o){ const w=[]; if(!o.premium) w.push('chybí cena'); if(!o.limit) w.push('chybí limit'); if(!o.exclusions) w.push('neověřené výluky'); if(o.rating==='omezené krytí'||o.rating==='nedoporučit') w.push('slabé hodnocení'); return w; }
function renderOffersV72(selectedId){
  const box=document.getElementById('offerCardsV72'); if(!box) return; const offers=getOffersV72();
  if(document.getElementById('offerProCount')) document.getElementById('offerProCount').textContent=offers.length;
  const rec=offers.find(o=>o.recommended); if(document.getElementById('offerProRecommended')) document.getElementById('offerProRecommended').textContent=rec?rec.insurer:'–';
  const premiums=offers.map(o=>normalizeMoneyV72(o.premium)).filter(Boolean); if(document.getElementById('offerProBestPrice')) document.getElementById('offerProBestPrice').textContent=premiums.length?Math.min(...premiums).toLocaleString('cs-CZ')+' Kč':'–';
  if(document.getElementById('offerProWarnings')) document.getElementById('offerProWarnings').textContent=offers.reduce((s,o)=>s+offerWarningsV72(o).length,0);
  if(!offers.length){ box.innerHTML='<div class="textation-empty">Zatím není vložená žádná nabídka. Klikněte na „+ Přidat nabídku“.</div>'; return; }
  box.innerHTML=offers.map(o=>{ const warnings=offerWarningsV72(o); return `
    <article class="offer-card-v72 ${selectedId===o.id?'active':''} ${o.recommended?'recommended':''}">
      <div class="offer-card-head"><div><span class="offer-rating">${escapeHtml(o.rating||'k ověření')}</span><h3>${escapeHtml(o.insurer)}</h3><p>${escapeHtml(o.product||'produkt není doplněn')}</p></div>${o.recommended?'<strong class="recommended-badge">Doporučeno</strong>':''}</div>
      <div class="offer-card-metrics"><div><b>${escapeHtml(o.premium||'–')}</b><span>pojistné</span></div><div><b>${escapeHtml(o.limit||'–')}</b><span>limit</span></div><div><b>${escapeHtml(o.deductible||'–')}</b><span>spoluúčast</span></div></div>
      <div class="offer-card-details"><p><b>Území:</b> ${escapeHtml(o.territory||'není uvedeno')}</p><p><b>Frekvence:</b> ${escapeHtml(o.frequency||'není uvedena')}</p>${warnings.length?'<p class="offer-warnings"><b>Upozornění:</b> '+warnings.map(escapeHtml).join(', ')+'</p>':'<p class="offer-ok">Základní údaje jsou doplněné.</p>'}</div>
      <details><summary>Expert detail</summary><p><b>Sublimity:</b><br>${escapeHtml(o.sublimits||'není doplněno')}</p><p><b>Výluky:</b><br>${escapeHtml(o.exclusions||'není doplněno')}</p><p><b>Silné stránky:</b><br>${escapeHtml(o.strengths||'není doplněno')}</p><p><b>Slabá místa:</b><br>${escapeHtml(o.weaknesses||'není doplněno')}</p><p><b>Poznámka poradce:</b><br>${escapeHtml(o.note||'není doplněno')}</p></details>
      <div class="offer-card-actions"><button class="primary small-btn" type="button" onclick="recommendOfferV72('${escapeHtml(o.id)}')">Doporučit</button><button class="secondary small-btn" type="button" onclick="openOfferEditorV72('${escapeHtml(o.id)}')">Upravit</button><button class="secondary small-btn" type="button" onclick="duplicateOfferV72('${escapeHtml(o.id)}')">Kopie</button><button class="danger-light small-btn" type="button" onclick="deleteOfferV72('${escapeHtml(o.id)}')">Smazat</button></div>
    </article>`}).join('');
}
function renderOfferComparisonV72(){
  const box=document.getElementById('offerComparisonMatrixV72'); if(!box) return; const offers=getOffersV72();
  if(!offers.length){ box.innerHTML='<div class="textation-empty">Nejsou vložené nabídky pro porovnání.</div>'; return; }
  const rows=[['Pojistné',o=>o.premium||'–'],['Limit',o=>o.limit||'–'],['Spoluúčast',o=>o.deductible||'–'],['Území',o=>o.territory||'–'],['Frekvence',o=>o.frequency||'–'],['Hodnocení',o=>o.rating||'–'],['Výluky / omezení',o=>o.exclusions||'nevyplněno'],['Slabá místa',o=>o.weaknesses||'nevyplněno']];
  box.innerHTML=`<div class="comparison-table-wrap-v72"><table class="comparison-table-v72"><thead><tr><th>Parametr</th>${offers.map(o=>`<th>${escapeHtml(o.insurer)}${o.recommended?' ⭐':''}</th>`).join('')}<th>Makléřská poznámka</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${escapeHtml(r[0])}</b></td>${offers.map(o=>`<td>${escapeHtml(r[1](o))}</td>`).join('')}<td>${comparisonHintV72(r[0],offers)}</td></tr>`).join('')}</tbody></table></div>`;
}
function comparisonHintV72(param, offers){ if(param==='Pojistné') return 'Porovnat cenu proti rozsahu krytí, ne samostatně.'; if(param==='Výluky / omezení') return 'Zásadní výluky vždy vysvětlit klientovi.'; if(param==='Slabá místa') return 'Slabá místa promítnout do doporučení poradce.'; return 'Zkontrolovat rozdíly mezi nabídkami.'; }
function renderOffersWorkspaceV72(){ renderOffersV72(); renderOfferComparisonV72(); }
setTimeout(renderOffersWorkspaceV72,300);
