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
  if(id==='offersView') { migrateLegacyDataToActiveCaseV74(false); renderOffers(); renderUnifiedOfferWorkspaceV73(); renderCaseCommandCenter(); }
  if(id==='comparisonView') { migrateLegacyDataToActiveCaseV74(false); renderOfferComparisonV72(); suppressDuplicateComparisonV73(); renderCaseCommandCenter(); }
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

// MVP 0.73 - Unified Offer Workflow stabilizer
const OFFERS_UNIFIED_KEY_V73 = 'astorie_unified_offers_v73';
const OFFERS_LEGACY_KEYS_V73 = ['astorie_case_offers_v72', 'astorie_case_offers_v71', 'astorie_offers'];

function normalizeOfferV73(o){
  o = o || {};
  return {
    id: o.id || ('offer-' + Date.now() + '-' + Math.random().toString(16).slice(2)),
    insurer: o.insurer || o.company || o.pojistovna || '',
    product: o.product || o.produkt || '',
    premium: o.premium || o.price || o.pojistne || '',
    limit: o.limit || o.mainLimit || '',
    deductible: o.deductible || o.spoluucast || '',
    territory: o.territory || o.uzemi || '',
    frequency: o.frequency || o.frekvence || '',
    rating: o.rating || o.verdict || 'k ověření',
    sublimits: o.sublimits || '',
    exclusions: o.exclusions || o.vyluky || '',
    strengths: o.strengths || '',
    weaknesses: o.weaknesses || '',
    note: o.note || o.poznamka || '',
    recommended: !!o.recommended,
    updatedAt: o.updatedAt || new Date().toISOString()
  };
}

function readUnifiedOffersV73(){
  let merged = [];
  try {
    const raw = localStorage.getItem(OFFERS_UNIFIED_KEY_V73);
    if(raw) merged = JSON.parse(raw) || [];
  } catch(e) {}

  OFFERS_LEGACY_KEYS_V73.forEach(k => {
    try {
      const raw = localStorage.getItem(k);
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr)) merged = merged.concat(arr);
      }
    } catch(e) {}
  });

  const map = new Map();
  merged.map(normalizeOfferV73).forEach(o => {
    if(!o.insurer && !o.product) return;
    map.set(o.id, o);
  });
  const clean = Array.from(map.values());
  writeUnifiedOffersV73(clean);
  return clean;
}

function writeUnifiedOffersV73(items){
  const clean = (items || []).map(normalizeOfferV73);
  const data = JSON.stringify(clean);
  localStorage.setItem(OFFERS_UNIFIED_KEY_V73, data);
  localStorage.setItem('astorie_case_offers_v72', data);
}

function getOffersV72(){ return readUnifiedOffersV73(); }
function saveOffersV72(items){ writeUnifiedOffersV73(items); }

function suppressDuplicateComparisonV73(){
  const comparison = document.getElementById('comparisonView');
  if(!comparison) return;

  const unifiedPanel = comparison.querySelector('.offer-comparison-v72');
  if(!unifiedPanel) return;

  Array.from(comparison.children).forEach(child => {
    if(child === unifiedPanel) return;
    if(child.id === 'caseCommandCenter') return;
    if(child.classList && child.classList.contains('case-command-center')) return;

    const text = (child.innerText || '').toLowerCase();
    const isOldComparison =
      text.includes('krytí rizik + zdroje') ||
      text.includes('pracovní analytické upozornění') ||
      text.includes('základní parametry') ||
      text.includes('makléřské porovnání') ||
      text.includes('verdikt') ||
      text.includes('koop') ||
      text.includes('uniqa') ||
      text.includes('direct');

    if(isOldComparison && !child.querySelector('#offerComparisonMatrixV72')){
      child.classList.add('v73-hidden-legacy-comparison');
      child.style.display = 'none';
    }
  });
}

function renderUnifiedOfferSummaryV73(){
  const offers = readUnifiedOffersV73();
  const count = offers.length;
  const rec = offers.find(o => o.recommended);
  const warnings = offers.reduce((sum, o) => sum + (typeof offerWarningsV72 === 'function' ? offerWarningsV72(o).length : 0), 0);

  if(document.getElementById('caseCCOffers')) document.getElementById('caseCCOffers').textContent = count;
  if(document.getElementById('offerProCount')) document.getElementById('offerProCount').textContent = count;
  if(document.getElementById('offerProRecommended')) document.getElementById('offerProRecommended').textContent = rec ? rec.insurer : '–';
  if(document.getElementById('offerProWarnings')) document.getElementById('offerProWarnings').textContent = warnings;
}

function renderUnifiedOfferWorkspaceV73(selectedId){
  if(typeof renderOffersV72 === 'function') renderOffersV72(selectedId);
  if(typeof renderOfferComparisonV72 === 'function') renderOfferComparisonV72();
  renderUnifiedOfferSummaryV73();
  suppressDuplicateComparisonV73();
  if(typeof renderCaseCommandCenter === 'function') renderCaseCommandCenter();
}

function saveOfferV72(){
  const insurer = (document.getElementById('offerInsurerV72')?.value || '').trim();
  if(!insurer){
    alert('Doplňte pojišťovnu.');
    document.getElementById('offerInsurerV72')?.focus();
    return;
  }
  const id = document.getElementById('offerEditIdV72')?.value || '';
  const payload = normalizeOfferV73({
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
    note: (document.getElementById('offerNoteV72')?.value || '').trim()
  });

  const offers = readUnifiedOffersV73();
  const idx = offers.findIndex(o => o.id === payload.id);
  if(idx >= 0) offers[idx] = {...offers[idx], ...payload};
  else offers.unshift(payload);

  writeUnifiedOffersV73(offers);
  if(typeof closeOfferEditorV72 === 'function') closeOfferEditorV72();
  renderUnifiedOfferWorkspaceV73(payload.id);
}

function deleteOfferV72(id){
  if(!confirm('Smazat nabídku?')) return;
  writeUnifiedOffersV73(readUnifiedOffersV73().filter(o => o.id !== id));
  renderUnifiedOfferWorkspaceV73();
}

function duplicateOfferV72(id){
  const offer = readUnifiedOffersV73().find(o => o.id === id);
  if(!offer) return;
  const copy = {...offer, id:'offer-' + Date.now(), insurer: offer.insurer + ' – kopie', rating:'k ověření', recommended:false};
  const offers = readUnifiedOffersV73();
  offers.unshift(copy);
  writeUnifiedOffersV73(offers);
  renderUnifiedOfferWorkspaceV73(copy.id);
}

function recommendOfferV72(id){
  writeUnifiedOffersV73(readUnifiedOffersV73().map(o => ({...o, recommended:o.id === id})));
  renderUnifiedOfferWorkspaceV73(id);
}

function renderOfferComparisonV72(){
  const box = document.getElementById('offerComparisonMatrixV72');
  if(!box) return;
  const offers = readUnifiedOffersV73();

  if(!offers.length){
    box.innerHTML = '<div class="textation-empty">Nejsou vložené nabídky pro porovnání. Přejděte do Nabídky a vložte alespoň jednu nabídku.</div>';
    suppressDuplicateComparisonV73();
    return;
  }

  const rec = offers.find(o => o.recommended);
  const rows = [
    ['Pojistné', o => o.premium || '–'],
    ['Limit', o => o.limit || '–'],
    ['Spoluúčast', o => o.deductible || '–'],
    ['Území', o => o.territory || '–'],
    ['Frekvence', o => o.frequency || '–'],
    ['Hodnocení', o => o.rating || '–'],
    ['Výluky / omezení', o => o.exclusions || 'nevyplněno'],
    ['Silné stránky', o => o.strengths || 'nevyplněno'],
    ['Slabá místa', o => o.weaknesses || 'nevyplněno']
  ];

  const warningCount = offers.reduce((sum, o) => sum + (typeof offerWarningsV72 === 'function' ? offerWarningsV72(o).length : 0), 0);

  box.innerHTML = `
    <div class="unified-analysis-v73">
      <div>
        <p class="eyebrow">Makléřská analytika</p>
        <h3>${rec ? 'Doporučená varianta: ' + escapeHtml(rec.insurer) : 'Doporučená varianta zatím není vybraná'}</h3>
        <p>${rec ? 'Doporučení musí poradce vždy obhájit podle rozsahu krytí, výluk, ceny a potřeb klienta.' : 'Označte jednu nabídku jako doporučenou v sekci Nabídky.'}</p>
      </div>
      <div class="analysis-metrics-v73">
        <div><b>${offers.length}</b><span>nabídky</span></div>
        <div><b>${warningCount}</b><span>upozornění</span></div>
        <div><b>${rec ? 'ano' : 'ne'}</b><span>doporučení</span></div>
      </div>
    </div>
    <div class="comparison-table-wrap-v72">
      <table class="comparison-table-v72">
        <thead><tr><th>Parametr</th>${offers.map(o=>`<th>${escapeHtml(o.insurer)}${o.recommended?' ⭐':''}</th>`).join('')}<th>Makléřská poznámka</th></tr></thead>
        <tbody>${rows.map(r=>`<tr><td><b>${escapeHtml(r[0])}</b></td>${offers.map(o=>`<td>${escapeHtml(r[1](o))}</td>`).join('')}<td>${comparisonHintV72(r[0], offers)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
  suppressDuplicateComparisonV73();
}

function renderOffersWorkspaceV72(){
  renderUnifiedOfferWorkspaceV73();
}

function getClientCaseSummaryV71(){
  const active = typeof getActiveCaseV70 === 'function' ? getActiveCaseV70() : (state.activeInquiry || {});
  const docs = typeof getCaseDocuments === 'function' ? getCaseDocuments() : [];
  const offers = readUnifiedOffersV73();
  const readiness = typeof calculateCaseReadiness === 'function' ? calculateCaseReadiness() : 0;
  const missing = typeof getMissingParts === 'function' ? getMissingParts() : [];
  return {active, docs, offers, readiness, missing};
}

setTimeout(() => {
  renderUnifiedOfferWorkspaceV73();
  suppressDuplicateComparisonV73();
}, 400);

document.addEventListener('click', function(e){
  const viewBtn = e.target && e.target.closest ? e.target.closest('[data-view="comparisonView"],[data-view="offersView"]') : null;
  if(viewBtn) setTimeout(() => renderUnifiedOfferWorkspaceV73(), 150);
});

// MVP 0.74 - Case Engine Refactor
const CASE_STORE_KEY_V74 = 'astorie_case_engine_v74';
const CASE_ACTIVE_KEY_V74 = 'astorie_active_case_id_v74';
const CASE_MIGRATION_FLAG_V74 = 'astorie_case_engine_migrated_v74';
const CASE_LEGACY_OFFER_KEYS_V74 = ['astorie_unified_offers_v73','astorie_case_offers_v72','astorie_case_offers_v71','astorie_offers','offers','riskhub_offers'];
const CASE_LEGACY_DOC_KEYS_V74 = ['astorie_case_documents_v70','astorie_documents','riskhub_documents'];

function safeJsonParseV74(raw, fallback){ try { return raw ? JSON.parse(raw) : fallback; } catch(e) { return fallback; } }
function normalizeCaseIdV74(value){ const s = String(value || '').trim(); return s || 'local-active-case'; }

function getActiveCaseIdentityV74(){
  const active = (typeof state !== 'undefined' && state.activeInquiry) ? state.activeInquiry : {};
  const form = (typeof state !== 'undefined' && state.form) ? state.form : {};
  const id = normalizeCaseIdV74(active.id || active.dbId || active.caseId || document.getElementById('inquiryId')?.value || localStorage.getItem(CASE_ACTIVE_KEY_V74) || 'local-active-case');
  const clientName = active.clientName || active.client || form.clientName || document.getElementById('clientName')?.value || 'Není vybrána žádná poptávka';
  const businessType = active.businessType || active.clientActivity || form.clientActivity || document.getElementById('clientActivity')?.value || '';
  const status = active.status || form.status || 'rozpracováno';
  return {id, clientName, businessType, status};
}

function normalizeOfferV74(o){
  o = o || {};
  return {
    id: o.id || ('offer-' + Date.now() + '-' + Math.random().toString(16).slice(2)),
    insurer: o.insurer || o.company || o.pojistovna || o.insuranceCompany || '',
    product: o.product || o.produkt || '',
    premium: o.premium || o.price || o.pojistne || o.annualPremium || '',
    limit: o.limit || o.mainLimit || o.coverageLimit || '',
    deductible: o.deductible || o.spoluucast || '',
    territory: o.territory || o.uzemi || '',
    frequency: o.frequency || o.frekvence || '',
    rating: o.rating || o.verdict || o.status || 'k ověření',
    sublimits: o.sublimits || o.subLimits || '',
    exclusions: o.exclusions || o.vyluky || '',
    strengths: o.strengths || '',
    weaknesses: o.weaknesses || '',
    note: o.note || o.poznamka || '',
    recommended: !!o.recommended,
    updatedAt: o.updatedAt || new Date().toISOString()
  };
}
function normalizeDocumentV74(d){
  d = d || {};
  return {id:d.id || ('doc-' + Date.now() + '-' + Math.random().toString(16).slice(2)), title:d.title || d.name || d.filename || 'Dokument', type:d.type || d.category || 'Ostatní', source:d.source || '', status:d.status || 'k ověření', note:d.note || '', createdAt:d.createdAt || new Date().toISOString()};
}
function emptyCaseV74(identity){
  identity = identity || getActiveCaseIdentityV74();
  return {id:identity.id, clientName:identity.clientName, businessType:identity.businessType, status:identity.status, workflowStage:localStorage.getItem('astorie_case_stage_v70') || 'draft', offers:[], documents:[], checklist:safeJsonParseV74(localStorage.getItem('astorie_case_checklist_v70'), {}), notes:[], report:{recommendation:localStorage.getItem('astorie_client_recommendation_v71') || '', warnings:localStorage.getItem('astorie_client_warnings_v71') || ''}, updatedAt:new Date().toISOString()};
}
function readCaseStoreV74(){
  const store = safeJsonParseV74(localStorage.getItem(CASE_STORE_KEY_V74), null);
  return (store && Array.isArray(store.cases)) ? store : {activeCaseId:null, cases:[]};
}
function writeCaseStoreV74(store){ localStorage.setItem(CASE_STORE_KEY_V74, JSON.stringify(store || {activeCaseId:null, cases:[]})); }

function getOrCreateActiveCaseV74(){
  const identity = getActiveCaseIdentityV74();
  const store = readCaseStoreV74();
  const caseId = normalizeCaseIdV74(identity.id || store.activeCaseId);
  let c = store.cases.find(x => x.id === caseId);
  if(!c){ c = emptyCaseV74({...identity, id:caseId}); store.cases.unshift(c); }
  c.clientName = identity.clientName || c.clientName;
  c.businessType = identity.businessType || c.businessType;
  c.status = identity.status || c.status;
  c.workflowStage = localStorage.getItem('astorie_case_stage_v70') || c.workflowStage || 'draft';
  c.checklist = safeJsonParseV74(localStorage.getItem('astorie_case_checklist_v70'), c.checklist || {});
  c.report = c.report || {};
  c.report.recommendation = localStorage.getItem('astorie_client_recommendation_v71') || c.report.recommendation || '';
  c.report.warnings = localStorage.getItem('astorie_client_warnings_v71') || c.report.warnings || '';
  c.offers = Array.isArray(c.offers) ? c.offers.map(normalizeOfferV74) : [];
  c.documents = Array.isArray(c.documents) ? c.documents.map(normalizeDocumentV74) : [];
  c.updatedAt = new Date().toISOString();
  store.activeCaseId = caseId;
  localStorage.setItem(CASE_ACTIVE_KEY_V74, caseId);
  writeCaseStoreV74(store);
  return c;
}
function saveActiveCaseV74(c){
  const store = readCaseStoreV74();
  const caseId = normalizeCaseIdV74(c.id);
  const idx = store.cases.findIndex(x => x.id === caseId);
  c.updatedAt = new Date().toISOString();
  if(idx >= 0) store.cases[idx] = c; else store.cases.unshift(c);
  store.activeCaseId = caseId;
  localStorage.setItem(CASE_ACTIVE_KEY_V74, caseId);
  writeCaseStoreV74(store);
}
function collectLegacyOffersV74(){
  let all = [];
  CASE_LEGACY_OFFER_KEYS_V74.forEach(key => { const arr = safeJsonParseV74(localStorage.getItem(key), []); if(Array.isArray(arr)) all = all.concat(arr); });
  if(typeof state !== 'undefined' && Array.isArray(state.offers)) all = all.concat(state.offers);
  const map = new Map();
  all.map(normalizeOfferV74).forEach(o => { if(!o.insurer && !o.product) return; map.set(o.id, o); });
  return Array.from(map.values());
}
function collectLegacyDocumentsV74(){
  let all = [];
  CASE_LEGACY_DOC_KEYS_V74.forEach(key => { const arr = safeJsonParseV74(localStorage.getItem(key), []); if(Array.isArray(arr)) all = all.concat(arr); });
  const map = new Map();
  all.map(normalizeDocumentV74).forEach(d => { if(!d.title) return; map.set(d.id, d); });
  return Array.from(map.values());
}
function syncLegacyStoresFromCaseV74(c){
  c = c || getOrCreateActiveCaseV74();
  const offers = JSON.stringify(c.offers || []);
  localStorage.setItem('astorie_unified_offers_v73', offers);
  localStorage.setItem('astorie_case_offers_v72', offers);
  localStorage.setItem('astorie_case_offers_v71', offers);
  localStorage.setItem('astorie_case_documents_v70', JSON.stringify(c.documents || []));
  if(typeof state !== 'undefined') state.offers = c.offers || [];
}
function migrateLegacyDataToActiveCaseV74(force){
  const c = getOrCreateActiveCaseV74();
  if(localStorage.getItem(CASE_MIGRATION_FLAG_V74) && !force) return c;
  const offerIds = new Set((c.offers || []).map(o => o.id));
  collectLegacyOffersV74().forEach(o => { if(!offerIds.has(o.id)){ c.offers.push(o); offerIds.add(o.id); } });
  const docIds = new Set((c.documents || []).map(d => d.id));
  collectLegacyDocumentsV74().forEach(d => { if(!docIds.has(d.id)){ c.documents.push(d); docIds.add(d.id); } });
  saveActiveCaseV74(c);
  syncLegacyStoresFromCaseV74(c);
  localStorage.setItem(CASE_MIGRATION_FLAG_V74, new Date().toISOString());
  return c;
}
function getOffersV72(){ return migrateLegacyDataToActiveCaseV74(false).offers || []; }
function saveOffersV72(items){ const c=getOrCreateActiveCaseV74(); c.offers=(items||[]).map(normalizeOfferV74); saveActiveCaseV74(c); syncLegacyStoresFromCaseV74(c); renderCaseEngineStatusV74(); }
function getCaseDocuments(){ return migrateLegacyDataToActiveCaseV74(false).documents || []; }
function saveCaseDocuments(items){ const c=getOrCreateActiveCaseV74(); c.documents=(items||[]).map(normalizeDocumentV74); saveActiveCaseV74(c); syncLegacyStoresFromCaseV74(c); renderCaseEngineStatusV74(); }
function getActiveCaseV70(){ const c=migrateLegacyDataToActiveCaseV74(false); return {id:c.id, dbId:c.id, clientName:c.clientName, businessType:c.businessType, clientActivity:c.businessType, status:c.status}; }
function calculateCaseReadiness(){
  const c=migrateLegacyDataToActiveCaseV74(false);
  const checked=Object.values(c.checklist || {}).filter(Boolean).length;
  let score=0; if(c.clientName && c.clientName !== 'Není vybrána žádná poptávka') score+=20; if(c.businessType) score+=10; if((c.documents||[]).length>0) score+=20; if((c.offers||[]).length>0) score+=15; if((c.offers||[]).length>=2) score+=15; score+=Math.min(20, checked*3); return Math.min(100, score);
}
function getMissingParts(){ const c=migrateLegacyDataToActiveCaseV74(false); const missing=[]; if(!c.clientName || c.clientName==='Není vybrána žádná poptávka') missing.push('klient'); if(!c.businessType) missing.push('činnost'); if(!(c.documents||[]).length) missing.push('dokumenty'); if((c.offers||[]).length<2) missing.push('min. 2 nabídky'); if(Object.values(c.checklist||{}).filter(Boolean).length<4) missing.push('checklist'); return missing; }

function renderCaseEngineStatusV74(){
  const c=migrateLegacyDataToActiveCaseV74(false);
  if(document.getElementById('caseEngineCaseIdV74')) document.getElementById('caseEngineCaseIdV74').textContent = c.id || 'local';
  if(document.getElementById('caseEngineOffersV74')) document.getElementById('caseEngineOffersV74').textContent = (c.offers||[]).length;
  if(document.getElementById('caseEngineDocsV74')) document.getElementById('caseEngineDocsV74').textContent = (c.documents||[]).length;
  if(document.getElementById('caseEngineIntegrityV74')) document.getElementById('caseEngineIntegrityV74').textContent = 'OK';
  if(document.getElementById('offerCaseBindingV74')) document.getElementById('offerCaseBindingV74').innerHTML = `<div class="case-binding-card-v74"><b>Všechny nabídky jsou navázané na aktivní obchodní případ:</b><span>${escapeHtml(c.clientName || 'bez klienta')} · ${escapeHtml(c.id || 'local')} · ${(c.offers||[]).length} nabídek</span></div>`;
}
function renderCaseCommandCenter(){
  const c=migrateLegacyDataToActiveCaseV74(false); const readiness=calculateCaseReadiness(); const missing=getMissingParts();
  if(document.getElementById('caseCCClient')) document.getElementById('caseCCClient').textContent=c.clientName || 'Není vybrána žádná poptávka';
  if(document.getElementById('caseCCMeta')) document.getElementById('caseCCMeta').textContent=[c.businessType||'typ činnosti není vyplněn', c.id?('DB #'+c.id):'bez DB ID', c.status||'rozpracováno', 'stav workflow: '+(typeof stageLabelV70==='function'?stageLabelV70(localStorage.getItem('astorie_case_stage_v70')||c.workflowStage||'draft'):(c.workflowStage||'draft'))].join(' · ');
  if(document.getElementById('caseCCReady')) document.getElementById('caseCCReady').textContent=readiness+'%';
  if(document.getElementById('caseCCDocs')) document.getElementById('caseCCDocs').textContent=(c.documents||[]).length;
  if(document.getElementById('caseCCOffers')) document.getElementById('caseCCOffers').textContent=(c.offers||[]).length;
  if(document.getElementById('caseCCMissing')) document.getElementById('caseCCMissing').textContent=missing.length?missing.length:'0';
  document.querySelectorAll('[data-case-step]').forEach(btn=>btn.classList.toggle('active', btn.dataset.caseStep === (localStorage.getItem('astorie_case_stage_v70')||c.workflowStage||'draft')));
  renderCaseEngineStatusV74();
}

function renderOfferComparisonV72(){
  const box=document.getElementById('offerComparisonMatrixV72'); if(!box) return;
  const offers=getOffersV72();
  if(!offers.length){ box.innerHTML='<div class="textation-empty">Nejsou vložené nabídky pro porovnání. Přejděte do Nabídky a vložte alespoň jednu nabídku.</div>'; if(typeof suppressDuplicateComparisonV73==='function') suppressDuplicateComparisonV73(); return; }
  const rec=offers.find(o=>o.recommended);
  const rows=[['Pojistné',o=>o.premium||'–'],['Limit',o=>o.limit||'–'],['Spoluúčast',o=>o.deductible||'–'],['Území',o=>o.territory||'–'],['Frekvence',o=>o.frequency||'–'],['Hodnocení',o=>o.rating||'–'],['Sublimity',o=>o.sublimits||'nevyplněno'],['Výluky / omezení',o=>o.exclusions||'nevyplněno'],['Silné stránky',o=>o.strengths||'nevyplněno'],['Slabá místa',o=>o.weaknesses||'nevyplněno']];
  const warningCount=offers.reduce((sum,o)=>sum+(typeof offerWarningsV72==='function'?offerWarningsV72(o).length:0),0);
  box.innerHTML=`<div class="unified-analysis-v73 case-analysis-v74"><div><p class="eyebrow">Makléřská analytika z aktivního případu</p><h3>${rec?'Doporučená varianta: '+escapeHtml(rec.insurer):'Doporučená varianta zatím není vybraná'}</h3><p>${rec?'Doporučení je navázané na aktivní obchodní případ a použije se i v klientském výstupu.':'V sekci Nabídky označte jednu variantu jako doporučenou.'}</p></div><div class="analysis-metrics-v73"><div><b>${offers.length}</b><span>nabídky</span></div><div><b>${warningCount}</b><span>upozornění</span></div><div><b>${rec?'ano':'ne'}</b><span>doporučení</span></div></div></div><div class="comparison-table-wrap-v72"><table class="comparison-table-v72"><thead><tr><th>Parametr</th>${offers.map(o=>`<th>${escapeHtml(o.insurer)}${o.recommended?' ⭐':''}</th>`).join('')}<th>Makléřská poznámka</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${escapeHtml(r[0])}</b></td>${offers.map(o=>`<td>${escapeHtml(r[1](o))}</td>`).join('')}<td>${typeof comparisonHintV72==='function'?comparisonHintV72(r[0],offers):'Ověřit rozdíly v nabídce.'}</td></tr>`).join('')}</tbody></table></div>`;
  if(typeof suppressDuplicateComparisonV73==='function') suppressDuplicateComparisonV73();
}
function getClientCaseSummaryV71(){ const c=migrateLegacyDataToActiveCaseV74(false); return {active:{id:c.id, dbId:c.id, clientName:c.clientName, businessType:c.businessType, clientActivity:c.businessType, status:c.status}, docs:c.documents||[], offers:c.offers||[], readiness:calculateCaseReadiness(), missing:getMissingParts()}; }
function forceCaseMigrationV74(){ const c=migrateLegacyDataToActiveCaseV74(true); syncLegacyStoresFromCaseV74(c); renderCaseCommandCenter(); if(typeof renderCaseDocuments==='function') renderCaseDocuments(); if(typeof renderOffersWorkspaceV72==='function') renderOffersWorkspaceV72(); renderOfferComparisonV72(); if(typeof renderClientOutputStats==='function') renderClientOutputStats(); alert('Migrace a kontrola aktivního obchodního případu dokončena. Nabídky: '+(c.offers||[]).length+', dokumenty: '+(c.documents||[]).length+'.'); }
setTimeout(()=>{ migrateLegacyDataToActiveCaseV74(false); renderCaseCommandCenter(); renderCaseEngineStatusV74(); if(typeof renderOffersWorkspaceV72==='function') renderOffersWorkspaceV72(); if(typeof renderOfferComparisonV72==='function') renderOfferComparisonV72(); },500);

// MVP 0.75 - DB-first Case Bridge
// Cíl: historické nabídky z DB/state.offers zůstanou zachované a nový Case Engine je pouze načte jako pracovní pohled.

function isOfferObjectMapV75(value){
  return value && typeof value === 'object' && !Array.isArray(value);
}

function insurerByIdV75(id){
  const list = (typeof CATALOG !== 'undefined' && CATALOG && Array.isArray(CATALOG.insurers)) ? CATALOG.insurers : [];
  return list.find(i => String(i.id) === String(id) || String(i.code || '') === String(id) || String(i.short || '') === String(id)) || null;
}

function activeDbOfferMapV75(){
  if(typeof state === 'undefined') return {};
  if(isOfferObjectMapV75(state.offers)) return state.offers || {};
  return {};
}

function coverageValuesV75(offerObj){
  const cov = offerObj && offerObj.coverages && typeof offerObj.coverages === 'object' ? offerObj.coverages : {};
  return Object.values(cov || {});
}

function summarizeCoveragesV75(offerObj, type){
  const covs = coverageValuesV75(offerObj);
  if(!covs.length) return '';
  if(type === 'limits'){
    return covs.map(c => c.limit).filter(Boolean).slice(0,5).join(', ');
  }
  if(type === 'exclusions'){
    return covs.filter(c => String(c.state || '').toLowerCase().includes('výluka') || String(c.state || '').toLowerCase().includes('nesplněno'))
      .map(c => [c.original, c.note, c.source].filter(Boolean).join(' · '))
      .filter(Boolean)
      .slice(0,5)
      .join('\n');
  }
  if(type === 'weaknesses'){
    return covs.filter(c => ['částečně','výluka','nesplněno','nevyhodnoceno'].includes(String(c.state || '').toLowerCase()))
      .map(c => [c.state, c.limit, c.note].filter(Boolean).join(' · '))
      .filter(Boolean)
      .slice(0,6)
      .join('\n');
  }
  if(type === 'strengths'){
    return covs.filter(c => String(c.state || '').toLowerCase() === 'splněno')
      .map(c => [c.limit, c.source].filter(Boolean).join(' · '))
      .filter(Boolean)
      .slice(0,6)
      .join('\n');
  }
  return '';
}

function convertDbOfferMapToArrayV75(map){
  if(!isOfferObjectMapV75(map)) return [];
  return Object.entries(map).map(([insurerId, o]) => {
    o = o || {};
    const insurer = insurerByIdV75(insurerId);
    const insurerName = insurer ? ((insurer.short ? insurer.short + ' – ' : '') + insurer.name) : String(insurerId);
    const warnings = summarizeCoveragesV75(o, 'weaknesses');
    const exclusions = summarizeCoveragesV75(o, 'exclusions');
    return normalizeOfferV74({
      id: 'db-offer-' + insurerId,
      insurer: insurerName,
      product: o.product || o.product_name || 'nabídka pojišťovny',
      premium: o.premium || '',
      limit: summarizeCoveragesV75(o, 'limits') || '',
      deductible: o.deductible || '',
      territory: o.territory || '',
      frequency: o.frequency || '',
      rating: o.status || 'doručeno',
      sublimits: summarizeCoveragesV75(o, 'limits') || '',
      exclusions: exclusions || '',
      strengths: summarizeCoveragesV75(o, 'strengths') || '',
      weaknesses: warnings || '',
      note: o.note || '',
      recommended: !!o.recommended,
      updatedAt: o.updatedAt || new Date().toISOString()
    });
  }).filter(o => o.insurer && o.insurer !== '[object Object]');
}

function getDbOffersForActiveInquiryV75(){
  const direct = convertDbOfferMapToArrayV75(activeDbOfferMapV75());
  if(direct.length) return direct;

  // Fallback: lokální záloha stejného DB případu může obsahovat původní state.offers objekt.
  try{
    const currentId = String((typeof state !== 'undefined' && state.id) ? state.id : '');
    const backups = typeof localInquiryBackups === 'function' ? localInquiryBackups() : [];
    const local = backups.find(x => String(x.id || '') === currentId && isOfferObjectMapV75(x.offers));
    if(local) return convertDbOfferMapToArrayV75(local.offers);
  }catch(e){}
  return [];
}

function mergeOffersByIdV75(a,b){
  const map = new Map();
  (a || []).concat(b || []).map(normalizeOfferV74).forEach(o => {
    if(!o.insurer && !o.product) return;
    map.set(o.id, o);
  });
  return Array.from(map.values());
}

function collectLegacyOffersV74(){
  let all = [];
  // DB/state offers mají nejvyšší prioritu, protože uživatel právě otevřel konkrétní poptávku.
  all = all.concat(getDbOffersForActiveInquiryV75());

  CASE_LEGACY_OFFER_KEYS_V74.forEach(key => {
    const raw = localStorage.getItem(key);
    const arr = safeJsonParseV74(raw, []);
    if(Array.isArray(arr)) all = all.concat(arr);
    else if(isOfferObjectMapV75(arr)) all = all.concat(convertDbOfferMapToArrayV75(arr));
  });

  const map = new Map();
  all.map(normalizeOfferV74).forEach(o => {
    if(!o.insurer && !o.product) return;
    map.set(o.id, o);
  });
  return Array.from(map.values());
}

function migrateLegacyDataToActiveCaseV74(force){
  const c = getOrCreateActiveCaseV74();
  const dbOffers = getDbOffersForActiveInquiryV75();

  // Při otevření DB případu vždy preferujeme skutečné nabídky z načtené poptávky.
  if(dbOffers.length){
    c.offers = mergeOffersByIdV75(dbOffers, c.offers || []);
  } else if(force || !localStorage.getItem(CASE_MIGRATION_FLAG_V74)){
    c.offers = mergeOffersByIdV75(c.offers || [], collectLegacyOffersV74());
  }

  const docIds = new Set((c.documents || []).map(d => d.id));
  collectLegacyDocumentsV74().forEach(d => {
    if(!docIds.has(d.id)){
      c.documents.push(d);
      docIds.add(d.id);
    }
  });

  saveActiveCaseV74(c);
  syncLegacyStoresFromCaseV74(c);
  localStorage.setItem(CASE_MIGRATION_FLAG_V74, new Date().toISOString());
  return c;
}

function syncLegacyStoresFromCaseV74(c){
  // Nesaháme destruktivně na state.offers, protože původní DB modul používá objekt podle pojišťoven.
  c = c || getOrCreateActiveCaseV74();
  const offers = JSON.stringify(c.offers || []);
  localStorage.setItem('astorie_unified_offers_v73', offers);
  localStorage.setItem('astorie_case_offers_v72', offers);
  localStorage.setItem('astorie_case_offers_v71', offers);
  localStorage.setItem('astorie_case_documents_v70', JSON.stringify(c.documents || []));
}

function getOffersV72(){
  const c = migrateLegacyDataToActiveCaseV74(false);
  return c.offers || [];
}

function renderCaseCommandCenter(){
  const c = migrateLegacyDataToActiveCaseV74(false);
  const offers = getOffersV72();
  const readiness = calculateCaseReadiness();
  const missing = getMissingParts();

  if(document.getElementById('caseCCClient')) document.getElementById('caseCCClient').textContent = c.clientName || 'Není vybrána žádná poptávka';
  if(document.getElementById('caseCCMeta')) document.getElementById('caseCCMeta').textContent = [
    c.businessType || 'typ činnosti není vyplněn',
    c.id ? ('DB #' + c.id) : 'bez DB ID',
    c.status || 'rozpracováno',
    'stav workflow: ' + (typeof stageLabelV70 === 'function' ? stageLabelV70(localStorage.getItem('astorie_case_stage_v70') || c.workflowStage || 'draft') : (c.workflowStage || 'draft'))
  ].join(' · ');

  if(document.getElementById('caseCCReady')) document.getElementById('caseCCReady').textContent = readiness + '%';
  if(document.getElementById('caseCCDocs')) document.getElementById('caseCCDocs').textContent = (c.documents || []).length;
  if(document.getElementById('caseCCOffers')) document.getElementById('caseCCOffers').textContent = offers.length;
  if(document.getElementById('caseCCMissing')) document.getElementById('caseCCMissing').textContent = missing.length ? missing.length : '0';

  document.querySelectorAll('[data-case-step]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.caseStep === (localStorage.getItem('astorie_case_stage_v70') || c.workflowStage || 'draft'));
  });
  renderCaseEngineStatusV74();
}

function renderCaseEngineStatusV74(){
  const c = migrateLegacyDataToActiveCaseV74(false);
  const offers = getOffersV72();
  if(document.getElementById('caseEngineCaseIdV74')) document.getElementById('caseEngineCaseIdV74').textContent = c.id || 'local';
  if(document.getElementById('caseEngineOffersV74')) document.getElementById('caseEngineOffersV74').textContent = offers.length;
  if(document.getElementById('caseEngineDocsV74')) document.getElementById('caseEngineDocsV74').textContent = (c.documents || []).length;
  if(document.getElementById('caseEngineIntegrityV74')) document.getElementById('caseEngineIntegrityV74').textContent = 'OK';
  if(document.getElementById('offerCaseBindingV74')){
    document.getElementById('offerCaseBindingV74').innerHTML = `<div class="case-binding-card-v74"><b>Nabídky jsou načtené z aktivního obchodního případu:</b><span>${escapeHtml(c.clientName || 'bez klienta')} · ${escapeHtml(c.id || 'local')} · ${offers.length} nabídek</span></div>`;
  }
}

function countOffersFromLocal(i){
  try{
    if(Array.isArray(i.offers)) return i.offers.length;
    if(i.offers && typeof i.offers === 'object') return Object.keys(i.offers).length;
    return 0;
  }catch(e){ return 0; }
}

function getMissingParts(){
  const c = migrateLegacyDataToActiveCaseV74(false);
  const offers = getOffersV72();
  const missing = [];
  if(!c.clientName || c.clientName === 'Není vybrána žádná poptávka') missing.push('klient');
  if(!c.businessType) missing.push('činnost');
  if(!(c.documents || []).length) missing.push('dokumenty');
  if(offers.length < 2) missing.push('min. 2 nabídky');
  if(Object.values(c.checklist || {}).filter(Boolean).length < 4) missing.push('checklist');
  return missing;
}

function calculateCaseReadiness(){
  const c = migrateLegacyDataToActiveCaseV74(false);
  const offers = getOffersV72();
  const checkedCount = Object.values(c.checklist || {}).filter(Boolean).length;
  let score = 0;
  if(c.clientName && c.clientName !== 'Není vybrána žádná poptávka') score += 20;
  if(c.businessType) score += 10;
  if((c.documents || []).length > 0) score += 20;
  if(offers.length > 0) score += 15;
  if(offers.length >= 2) score += 15;
  score += Math.min(20, checkedCount * 3);
  return Math.min(100, score);
}

// Bezpečné napojení po načtení poptávky z DB.
if(typeof applyState === 'function' && !window.__applyStateV75Wrapped){
  window.__applyStateV75Wrapped = true;
  const originalApplyStateV75 = applyState;
  applyState = function(s){
    originalApplyStateV75(s);
    setTimeout(() => {
      migrateLegacyDataToActiveCaseV74(true);
      renderCaseCommandCenter();
      if(typeof renderOffersWorkspaceV72 === 'function') renderOffersWorkspaceV72();
      if(typeof renderOfferComparisonV72 === 'function') renderOfferComparisonV72();
      if(typeof renderClientOutputStats === 'function') renderClientOutputStats();
    }, 250);
  };
}

function forceCaseMigrationV74(){
  const c = migrateLegacyDataToActiveCaseV74(true);
  renderCaseCommandCenter();
  if(typeof renderCaseDocuments === 'function') renderCaseDocuments();
  if(typeof renderOffersWorkspaceV72 === 'function') renderOffersWorkspaceV72();
  if(typeof renderOfferComparisonV72 === 'function') renderOfferComparisonV72();
  if(typeof renderClientOutputStats === 'function') renderClientOutputStats();
  alert('Kontrola dokončena. V aktivním obchodním případu je načteno: ' + getOffersV72().length + ' nabídek.');
}

setTimeout(() => {
  migrateLegacyDataToActiveCaseV74(true);
  renderCaseCommandCenter();
  if(typeof renderOffersWorkspaceV72 === 'function') renderOffersWorkspaceV72();
  if(typeof renderOfferComparisonV72 === 'function') renderOfferComparisonV72();
}, 700);

// MVP 0.76 - Professional Advisor Cockpit + workflow stabilization
const ASTORIE_VERSION_V76 = '0.76';

function isPlainObjectV76(v){ return v && typeof v === 'object' && !Array.isArray(v); }
function safeArrayV76(v){ return Array.isArray(v) ? v : []; }
function normalizeMoneyNumberV76(value){
  const s = String(value || '').replace(/\s/g,'').replace(/[^\d,.-]/g,'').replace(',', '.');
  const n = Number(s);
  return isFinite(n) ? n : 0;
}
function insurerDisplayNameV76(id){
  try{
    const list = (typeof CATALOG !== 'undefined' && CATALOG && Array.isArray(CATALOG.insurers)) ? CATALOG.insurers : [];
    const item = list.find(i => String(i.id) === String(id) || String(i.code || '') === String(id) || String(i.short || '') === String(id));
    if(item) return (item.short ? item.short + ' – ' : '') + item.name;
  }catch(e){}
  return String(id || '').toUpperCase();
}
function normalizeOfferAnyV76(o, fallbackId){
  if(typeof normalizeOfferV74 === 'function'){
    return normalizeOfferV74({
      id: (o && o.id) || fallbackId,
      insurer: (o && (o.insurer || o.company || o.pojistovna || o.insuranceCompany || o.name)) || '',
      product: (o && (o.product || o.produkt || o.product_name)) || '',
      premium: (o && (o.premium || o.price || o.pojistne || o.annualPremium)) || '',
      limit: (o && (o.limit || o.mainLimit || o.coverageLimit)) || '',
      deductible: (o && (o.deductible || o.spoluucast)) || '',
      territory: (o && (o.territory || o.uzemi)) || '',
      frequency: (o && (o.frequency || o.frekvence)) || '',
      rating: (o && (o.rating || o.verdict || o.status)) || 'k ověření',
      sublimits: (o && (o.sublimits || o.subLimits)) || '',
      exclusions: (o && (o.exclusions || o.vyluky)) || '',
      strengths: (o && o.strengths) || '',
      weaknesses: (o && o.weaknesses) || '',
      note: (o && (o.note || o.poznamka)) || '',
      recommended: !!(o && o.recommended)
    });
  }
  return {
    id: (o && o.id) || fallbackId || ('offer-' + Date.now()),
    insurer: (o && o.insurer) || '',
    product: (o && o.product) || '',
    premium: (o && o.premium) || '',
    limit: (o && o.limit) || '',
    deductible: (o && o.deductible) || '',
    rating: (o && o.rating) || 'k ověření',
    recommended: !!(o && o.recommended)
  };
}
function offerFromDbMapEntryV76(insurerId, dbOffer){
  dbOffer = dbOffer || {};
  const cov = isPlainObjectV76(dbOffer.coverages) ? Object.values(dbOffer.coverages) : [];
  const limits = cov.map(c => c && c.limit).filter(Boolean).slice(0,5).join(', ');
  const exclusions = cov.filter(c => String((c && c.state) || '').toLowerCase().includes('výluka') || String((c && c.state) || '').toLowerCase().includes('nesplněno'))
    .map(c => [c.original, c.limit, c.note].filter(Boolean).join(' · ')).filter(Boolean).join('\n');
  const weaknesses = cov.filter(c => ['částečně','výluka','nesplněno','nevyhodnoceno'].includes(String((c && c.state) || '').toLowerCase()))
    .map(c => [c.state, c.limit, c.note].filter(Boolean).join(' · ')).filter(Boolean).join('\n');
  const strengths = cov.filter(c => String((c && c.state) || '').toLowerCase() === 'splněno')
    .map(c => [c.limit, c.source].filter(Boolean).join(' · ')).filter(Boolean).join('\n');
  return normalizeOfferAnyV76({
    id: 'db-offer-' + insurerId,
    insurer: insurerDisplayNameV76(insurerId),
    product: dbOffer.product || dbOffer.product_name || 'nabídka pojišťovny',
    premium: dbOffer.premium || '',
    limit: limits || '',
    deductible: dbOffer.deductible || '',
    territory: dbOffer.territory || '',
    frequency: dbOffer.frequency || '',
    rating: dbOffer.status || 'doručeno',
    sublimits: limits || '',
    exclusions: exclusions || '',
    strengths: strengths || '',
    weaknesses: weaknesses || '',
    note: dbOffer.note || '',
    recommended: !!dbOffer.recommended
  }, 'db-offer-' + insurerId);
}
function collectDbOffersV76(){
  let out = [];
  try{
    if(typeof state !== 'undefined' && isPlainObjectV76(state.offers)){
      Object.entries(state.offers).forEach(([id, val]) => out.push(offerFromDbMapEntryV76(id, val)));
    }
    if(typeof state !== 'undefined' && Array.isArray(state.offers)){
      out = out.concat(state.offers.map((o,i)=>normalizeOfferAnyV76(o, (o && o.id) || 'state-offer-' + i)));
    }
  }catch(e){}
  return out.filter(o => o.insurer || o.product);
}
function collectLocalOffersV76(){
  const keys = ['astorie_case_engine_v74','astorie_unified_offers_v73','astorie_case_offers_v72','astorie_case_offers_v71','astorie_offers','offers','riskhub_offers'];
  let out = [];
  keys.forEach(k => {
    try{
      const raw = localStorage.getItem(k);
      if(!raw) return;
      const parsed = JSON.parse(raw);
      if(k === 'astorie_case_engine_v74' && parsed && Array.isArray(parsed.cases)){
        const activeId = parsed.activeCaseId;
        const c = parsed.cases.find(x => String(x.id) === String(activeId)) || parsed.cases[0];
        if(c && Array.isArray(c.offers)) out = out.concat(c.offers.map((o,i)=>normalizeOfferAnyV76(o, (o && o.id) || 'case-offer-' + i)));
      }else if(Array.isArray(parsed)){
        out = out.concat(parsed.map((o,i)=>normalizeOfferAnyV76(o, (o && o.id) || k + '-' + i)));
      }else if(isPlainObjectV76(parsed)){
        Object.entries(parsed).forEach(([id,val]) => out.push(offerFromDbMapEntryV76(id, val)));
      }
    }catch(e){}
  });
  return out.filter(o => o.insurer || o.product);
}
function collectDomOffersV76(){
  const out = [];
  try{
    const offersView = document.getElementById('offersView') || document.body;
    const candidates = offersView.querySelectorAll('h2,h3');
    candidates.forEach((h, idx) => {
      const txt = (h.textContent || '').trim();
      if(!txt || !txt.includes('–')) return;
      const lower = txt.toLowerCase();
      if(lower.includes('nabídkový workspace') || lower.includes('aktivní')) return;
      const card = h.closest('section, article, div') || h.parentElement;
      const body = card ? (card.innerText || '') : txt;
      const premiumMatch = body.match(/(\d[\d\s]{2,}\s*Kč)/);
      out.push(normalizeOfferAnyV76({
        id: 'dom-offer-' + idx + '-' + txt.slice(0,10),
        insurer: txt,
        premium: premiumMatch ? premiumMatch[1] : '',
        rating: body.includes('doručeno') ? 'doručeno' : 'k ověření',
        note: 'Načteno z aktuálně zobrazené DB nabídky.'
      }, 'dom-offer-' + idx));
    });
  }catch(e){}
  return out;
}
function getProfessionalOffersV76(){
  const all = [].concat(collectDbOffersV76()).concat(collectLocalOffersV76()).concat(collectDomOffersV76());
  const map = new Map();
  all.forEach(o => {
    o = normalizeOfferAnyV76(o, o.id);
    if(!o.insurer && !o.product) return;
    const key = o.id || (o.insurer + '|' + o.product + '|' + o.premium);
    if(!map.has(key)) map.set(key, o);
    else {
      const prev = map.get(key);
      map.set(key, Object.assign({}, prev, o, {recommended: prev.recommended || o.recommended}));
    }
  });
  return Array.from(map.values());
}
function writeProfessionalOffersToCaseV76(){
  const offers = getProfessionalOffersV76();
  try{
    if(typeof getOrCreateActiveCaseV74 === 'function' && typeof saveActiveCaseV74 === 'function'){
      const c = getOrCreateActiveCaseV74();
      const byId = new Map();
      (c.offers || []).concat(offers).forEach(o => {
        o = normalizeOfferAnyV76(o, o.id);
        if(o.insurer || o.product) byId.set(o.id, o);
      });
      c.offers = Array.from(byId.values());
      saveActiveCaseV74(c);
      if(typeof syncLegacyStoresFromCaseV74 === 'function') syncLegacyStoresFromCaseV74(c);
    }
  }catch(e){
    console.warn('V76 case sync failed', e);
  }
  return offers;
}
function getOffersV72(){
  const offers = getProfessionalOffersV76();
  if(offers.length) return offers;
  try{
    const c = typeof migrateLegacyDataToActiveCaseV74 === 'function' ? migrateLegacyDataToActiveCaseV74(false) : null;
    return c && Array.isArray(c.offers) ? c.offers : [];
  }catch(e){ return []; }
}
function getActiveClientNameV76(){
  try{
    if(typeof state !== 'undefined' && state.activeInquiry && state.activeInquiry.clientName) return state.activeInquiry.clientName;
    if(typeof state !== 'undefined' && state.form && state.form.clientName) return state.form.clientName;
    if(typeof state !== 'undefined' && state.clientName) return state.clientName;
    const h = document.querySelector('#activeInquiryBanner h2, #caseCCClient');
    if(h && h.textContent.trim()) return h.textContent.trim().replace(/^#\d+\s*[–-]\s*/,'');
  }catch(e){}
  return 'Není vybrána žádná poptávka';
}
function getActiveActivityV76(){
  try{
    if(typeof state !== 'undefined' && state.activeInquiry && (state.activeInquiry.businessType || state.activeInquiry.clientActivity)) return state.activeInquiry.businessType || state.activeInquiry.clientActivity;
    if(typeof state !== 'undefined' && state.form && state.form.clientActivity) return state.form.clientActivity;
  }catch(e){}
  return '';
}
function calculateCaseReadiness(){
  const offers = getOffersV72();
  let docs = [];
  let checklist = {};
  try{
    const c = typeof getOrCreateActiveCaseV74 === 'function' ? getOrCreateActiveCaseV74() : {};
    docs = Array.isArray(c.documents) ? c.documents : [];
    checklist = c.checklist || {};
  }catch(e){}
  let score = 0;
  const client = getActiveClientNameV76();
  const activity = getActiveActivityV76();
  if(client && client !== 'Není vybrána žádná poptávka') score += 20;
  if(activity) score += 10;
  if(docs.length) score += 15;
  if(offers.length) score += 20;
  if(offers.length >= 2) score += 20;
  score += Math.min(15, Object.values(checklist).filter(Boolean).length * 3);
  return Math.min(100, score);
}
function getMissingParts(){
  const offers = getOffersV72();
  let docs = [];
  let checklist = {};
  try{
    const c = typeof getOrCreateActiveCaseV74 === 'function' ? getOrCreateActiveCaseV74() : {};
    docs = Array.isArray(c.documents) ? c.documents : [];
    checklist = c.checklist || {};
  }catch(e){}
  const missing = [];
  if(!getActiveClientNameV76() || getActiveClientNameV76() === 'Není vybrána žádná poptávka') missing.push('klient');
  if(!getActiveActivityV76()) missing.push('činnost');
  if(!docs.length) missing.push('dokumenty');
  if(offers.length < 2) missing.push('min. 2 nabídky');
  if(Object.values(checklist).filter(Boolean).length < 4) missing.push('checklist');
  return missing;
}
function professionalOfferWarningsV76(offer){
  const w = [];
  if(!offer.premium) w.push('chybí cena');
  if(!offer.limit && !offer.sublimits) w.push('chybí limit/sublimit');
  if(!offer.exclusions) w.push('ověřit výluky');
  if(String(offer.rating || '').toLowerCase().includes('nedoporu')) w.push('nedoporučená varianta');
  return w;
}
function renderAdvisorCockpitV76(){
  const offers = getOffersV72();
  const readiness = calculateCaseReadiness();
  const missing = getMissingParts();
  const client = getActiveClientNameV76();
  const activity = getActiveActivityV76();
  let docs = [];
  try{
    const c = typeof getOrCreateActiveCaseV74 === 'function' ? getOrCreateActiveCaseV74() : {};
    docs = Array.isArray(c.documents) ? c.documents : [];
  }catch(e){}
  const setText = (id, value) => { const el = document.getElementById(id); if(el) el.textContent = value; };
  setText('cockpitClientV76', client || 'Není vybrána žádná poptávka');
  setText('cockpitMetaV76', [activity || 'typ činnosti není vyplněn', offers.length + ' nabídek', docs.length + ' dokumentů'].join(' · '));
  setText('cockpitReadinessV76', readiness + '%');
  setText('cockpitDocsV76', docs.length + ' dokumentů');
  setText('cockpitOffersV76', offers.length + ' nabídek');
  setText('cockpitComparisonV76', offers.length >= 2 ? 'připraveno' : 'čeká na nabídky');
  setText('cockpitReportV76', readiness >= 70 ? 'lze připravit' : 'doplnit podklady');
  setText('cockpitDemandV76', client && client !== 'Není vybrána žádná poptávka' ? 'klient načten' : 'doplnit klienta');

  let title = 'Pokračujte v práci na případu';
  let text = 'Zkontrolujte podklady, nabídky a připravte porovnání.';
  if(!client || client === 'Není vybrána žádná poptávka'){
    title = 'Otevřete nebo založte obchodní případ';
    text = 'Bez aktivního případu se nemají kam ukládat nabídky ani klientský výstup.';
  }else if(offers.length < 1){
    title = 'Doplňte nabídky pojišťoven';
    text = 'Přejděte do Nabídek a vložte nebo zkontrolujte nabídky pojišťoven.';
  }else if(offers.length < 2){
    title = 'Doplňte alespoň druhou nabídku';
    text = 'Pro kvalitní makléřské porovnání jsou vhodné alespoň dvě varianty.';
  }else if(readiness < 70){
    title = 'Zkontrolujte podklady a checklist';
    text = 'Nabídky existují, ale případ ještě není dostatečně připravený pro klientský výstup.';
  }else{
    title = 'Připravte klientský výstup';
    text = 'Případ má dost podkladů pro porovnání a profesionální doporučení klientovi.';
  }
  setText('advisorNextTitleV76', title);
  setText('advisorNextTextV76', text);

  const warningsBox = document.getElementById('advisorWarningsV76');
  if(warningsBox){
    const warningList = missing.slice(0,5).map(x => `<span>⚠ ${escapeHtml(x)}</span>`).join('');
    warningsBox.innerHTML = warningList || '<span class="ok">✓ Bez zásadních blokací</span>';
  }

  setText('caseCCOffers', String(offers.length));
  setText('caseCCReady', readiness + '%');
  setText('caseCCMissing', String(missing.length));
  setText('offerProCount', String(offers.length));
  const rec = offers.find(o => o.recommended);
  setText('offerProRecommended', rec ? rec.insurer : '–');
  const premiums = offers.map(o => normalizeMoneyNumberV76(o.premium)).filter(Boolean);
  setText('offerProBestPrice', premiums.length ? Math.min(...premiums).toLocaleString('cs-CZ') + ' Kč' : '–');
  setText('offerProWarnings', String(offers.reduce((s,o)=>s+professionalOfferWarningsV76(o).length,0)));
}
function goNextAdvisorStepV76(){
  const offers = getOffersV72();
  const readiness = calculateCaseReadiness();
  if(!getActiveClientNameV76() || getActiveClientNameV76() === 'Není vybrána žádná poptávka') return showView('inquiryView');
  if(offers.length < 2) return showView('offersView');
  if(readiness < 70) return showView('checklistView');
  return showView('reportView');
}
function renderOfferComparisonV72(){
  const box = document.getElementById('offerComparisonMatrixV72');
  if(!box) return;
  const offers = getOffersV72();
  if(!offers.length){
    box.innerHTML = '<div class="textation-empty">Nejsou vložené nabídky pro porovnání. Přejděte do Nabídky a vložte alespoň jednu nabídku.</div>';
    return;
  }
  const rec = offers.find(o => o.recommended);
  const rows = [
    ['Pojistné', o => o.premium || '–'],
    ['Limit / sublimity', o => o.limit || o.sublimits || '–'],
    ['Spoluúčast', o => o.deductible || '–'],
    ['Území', o => o.territory || '–'],
    ['Frekvence', o => o.frequency || '–'],
    ['Hodnocení', o => o.rating || '–'],
    ['Výluky / omezení', o => o.exclusions || 'nevyplněno'],
    ['Silné stránky', o => o.strengths || 'nevyplněno'],
    ['Slabá místa', o => o.weaknesses || 'nevyplněno']
  ];
  const warningCount = offers.reduce((sum,o)=>sum+professionalOfferWarningsV76(o).length,0);
  box.innerHTML = `
    <div class="unified-analysis-v73 case-analysis-v74">
      <div>
        <p class="eyebrow">Makléřská analytika z aktivního případu</p>
        <h3>${rec ? 'Doporučená varianta: ' + escapeHtml(rec.insurer) : 'Doporučená varianta zatím není vybraná'}</h3>
        <p>${rec ? 'Doporučení je připravené pro klientský výstup.' : 'V sekci Nabídky označte jednu variantu jako doporučenou.'}</p>
      </div>
      <div class="analysis-metrics-v73">
        <div><b>${offers.length}</b><span>nabídky</span></div>
        <div><b>${warningCount}</b><span>upozornění</span></div>
        <div><b>${rec ? 'ano' : 'ne'}</b><span>doporučení</span></div>
      </div>
    </div>
    <div class="comparison-table-wrap-v72">
      <table class="comparison-table-v72">
        <thead><tr><th>Parametr</th>${offers.map(o=>`<th>${escapeHtml(o.insurer)}${o.recommended?' ⭐':''}</th>`).join('')}<th>Makléřská poznámka</th></tr></thead>
        <tbody>${rows.map(r=>`<tr><td><b>${escapeHtml(r[0])}</b></td>${offers.map(o=>`<td>${escapeHtml(r[1](o))}</td>`).join('')}<td>${typeof comparisonHintV72 === 'function' ? comparisonHintV72(r[0], offers) : 'Ověřit rozdíly v nabídce.'}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}
function getClientCaseSummaryV71(){
  const offers = getOffersV72();
  let docs = [];
  try{
    const c = typeof getOrCreateActiveCaseV74 === 'function' ? getOrCreateActiveCaseV74() : {};
    docs = Array.isArray(c.documents) ? c.documents : [];
  }catch(e){}
  return {
    active: {clientName: getActiveClientNameV76(), businessType: getActiveActivityV76(), clientActivity: getActiveActivityV76(), status: 'rozpracováno'},
    docs, offers, readiness: calculateCaseReadiness(), missing: getMissingParts()
  };
}
function refreshProfessionalWorkflowV76(){
  writeProfessionalOffersToCaseV76();
  renderAdvisorCockpitV76();
  if(typeof renderCaseCommandCenter === 'function') renderCaseCommandCenter();
  if(typeof renderOffersV72 === 'function') renderOffersV72();
  if(typeof renderOfferComparisonV72 === 'function') renderOfferComparisonV72();
  if(typeof renderClientOutputStats === 'function') renderClientOutputStats();
}
if(typeof applyState === 'function' && !window.__applyStateV76Wrapped){
  window.__applyStateV76Wrapped = true;
  const originalApplyStateV76 = applyState;
  applyState = function(s){
    originalApplyStateV76(s);
    setTimeout(refreshProfessionalWorkflowV76, 250);
  };
}
if(typeof showView === 'function' && !window.__showViewV76Wrapped){
  window.__showViewV76Wrapped = true;
  const originalShowViewV76 = showView;
  showView = function(id){
    originalShowViewV76(id);
    setTimeout(refreshProfessionalWorkflowV76, 160);
  };
}
setTimeout(refreshProfessionalWorkflowV76, 500);
setTimeout(refreshProfessionalWorkflowV76, 1500);

// MVP 0.77 - Active Case Data Fix
const ACTIVE_CASE_OFFERS_KEY_V77 = 'astorie_active_case_offers_v77';

function isPlainObjectV77(v){ return v && typeof v === 'object' && !Array.isArray(v); }
function getActiveCaseIdV77(){
  try{
    if(typeof state !== 'undefined'){
      if(state.id) return String(state.id);
      if(state.activeInquiry && (state.activeInquiry.id || state.activeInquiry.dbId)) return String(state.activeInquiry.id || state.activeInquiry.dbId);
    }
    const txt = document.body.innerText || '';
    const m = txt.match(/DB\s*#?(\d+)/i);
    if(m) return String(m[1]);
  }catch(e){}
  return localStorage.getItem('astorie_active_case_id_v77') || 'local';
}
function getActiveClientNameV77(){
  try{
    if(typeof state !== 'undefined'){
      if(state.activeInquiry && state.activeInquiry.clientName) return state.activeInquiry.clientName;
      if(state.form && state.form.clientName) return state.form.clientName;
      if(state.clientName) return state.clientName;
    }
    const el = document.querySelector('#caseCCClient, #activeInquiryBanner h2, .active-inquiry-banner h2');
    if(el && el.textContent.trim()) return el.textContent.trim().replace(/^#\d+\s*[–-]\s*/,'');
  }catch(e){}
  return 'Není vybrána žádná poptávka';
}
function getActiveActivityV77(){
  try{
    if(typeof state !== 'undefined'){
      if(state.activeInquiry && (state.activeInquiry.businessType || state.activeInquiry.clientActivity)) return state.activeInquiry.businessType || state.activeInquiry.clientActivity;
      if(state.form && state.form.clientActivity) return state.form.clientActivity;
    }
  }catch(e){}
  return '';
}
function insurerDisplayNameV77(id){
  try{
    const list = (typeof CATALOG !== 'undefined' && CATALOG && Array.isArray(CATALOG.insurers)) ? CATALOG.insurers : [];
    const item = list.find(i => String(i.id) === String(id) || String(i.code || '') === String(id) || String(i.short || '') === String(id));
    if(item) return (item.short ? item.short + ' – ' : '') + item.name;
  }catch(e){}
  return String(id || '').toUpperCase();
}
function normalizeOfferV77(o, fallbackId){
  o = o || {};
  return {
    id: o.id || fallbackId || ('offer-' + Date.now()),
    insurer: o.insurer || o.company || o.pojistovna || o.insuranceCompany || o.name || '',
    product: o.product || o.produkt || o.product_name || '',
    premium: o.premium || o.price || o.pojistne || o.annualPremium || '',
    limit: o.limit || o.mainLimit || o.coverageLimit || '',
    deductible: o.deductible || o.spoluucast || '',
    territory: o.territory || o.uzemi || '',
    frequency: o.frequency || o.frekvence || '',
    rating: o.rating || o.verdict || o.status || 'k ověření',
    sublimits: o.sublimits || o.subLimits || '',
    exclusions: o.exclusions || o.vyluky || '',
    strengths: o.strengths || '',
    weaknesses: o.weaknesses || '',
    note: o.note || o.poznamka || '',
    recommended: !!o.recommended,
    updatedAt: o.updatedAt || new Date().toISOString()
  };
}
function offerFromDbMapEntryV77(insurerId, dbOffer){
  dbOffer = dbOffer || {};
  const cov = isPlainObjectV77(dbOffer.coverages) ? Object.values(dbOffer.coverages) : [];
  const limits = cov.map(c => c && c.limit).filter(Boolean).slice(0,5).join(', ');
  const exclusions = cov.filter(c => String((c && c.state) || '').toLowerCase().includes('výluka') || String((c && c.state) || '').toLowerCase().includes('nesplněno'))
    .map(c => [c.original, c.limit, c.note].filter(Boolean).join(' · ')).filter(Boolean).slice(0,8).join('\n');
  const weaknesses = cov.filter(c => ['částečně','výluka','nesplněno','nevyhodnoceno'].includes(String((c && c.state) || '').toLowerCase()))
    .map(c => [c.state, c.limit, c.note].filter(Boolean).join(' · ')).filter(Boolean).slice(0,8).join('\n');
  const strengths = cov.filter(c => String((c && c.state) || '').toLowerCase() === 'splněno')
    .map(c => [c.limit, c.source].filter(Boolean).join(' · ')).filter(Boolean).slice(0,8).join('\n');
  return normalizeOfferV77({
    id: 'db-' + getActiveCaseIdV77() + '-' + insurerId,
    insurer: insurerDisplayNameV77(insurerId),
    product: dbOffer.product || dbOffer.product_name || 'nabídka pojišťovny',
    premium: dbOffer.premium || '',
    limit: limits || '',
    deductible: dbOffer.deductible || '',
    territory: dbOffer.territory || '',
    frequency: dbOffer.frequency || '',
    rating: dbOffer.status || 'doručeno',
    sublimits: limits || '',
    exclusions: exclusions || '',
    strengths: strengths || '',
    weaknesses: weaknesses || '',
    note: dbOffer.note || '',
    recommended: !!dbOffer.recommended
  }, 'db-' + getActiveCaseIdV77() + '-' + insurerId);
}
function getDbOffersActiveOnlyV77(){
  try{
    if(typeof state !== 'undefined' && isPlainObjectV77(state.offers)){
      return Object.entries(state.offers).map(([id, val]) => offerFromDbMapEntryV77(id, val)).filter(o => o.insurer || o.product);
    }
    if(typeof state !== 'undefined' && Array.isArray(state.offers)){
      return state.offers.map((o,i)=>normalizeOfferV77(o, o.id || ('state-' + getActiveCaseIdV77() + '-' + i))).filter(o => o.insurer || o.product);
    }
  }catch(e){}
  return [];
}
function getEditedOffersForActiveCaseV77(){
  const activeId = getActiveCaseIdV77() || 'local';
  try{
    const all = JSON.parse(localStorage.getItem(ACTIVE_CASE_OFFERS_KEY_V77) || '{}');
    return Array.isArray(all[activeId]) ? all[activeId] : [];
  }catch(e){ return []; }
}
function saveEditedOffersForActiveCaseV77(items){
  const activeId = getActiveCaseIdV77() || 'local';
  let all = {};
  try{ all = JSON.parse(localStorage.getItem(ACTIVE_CASE_OFFERS_KEY_V77) || '{}') || {}; }catch(e){ all = {}; }
  all[activeId] = (items || []).map(o => normalizeOfferV77(o, o.id));
  localStorage.setItem(ACTIVE_CASE_OFFERS_KEY_V77, JSON.stringify(all));
}
function getOffersV72(){
  const db = getDbOffersActiveOnlyV77();
  const edited = getEditedOffersForActiveCaseV77();
  const map = new Map();
  db.forEach(o => map.set(o.id, o));
  edited.forEach(o => { o = normalizeOfferV77(o, o.id); if(o.insurer || o.product) map.set(o.id, o); });
  return Array.from(map.values());
}
function saveOffersV72(items){ saveEditedOffersForActiveCaseV77(items || []); refreshActiveCaseWorkflowV77(); }
function openOfferEditorV72(id){
  const box = document.getElementById('offerEditorV72'); if(!box) return;
  const offer = id ? getOffersV72().find(o => o.id === id) : null;
  const set = (suffix, value) => { const el = document.getElementById('offer' + suffix + 'V72'); if(el) el.value = value || ''; };
  const title = document.getElementById('offerEditorTitleV72'); if(title) title.textContent = offer ? 'Upravit nabídku' : 'Nová nabídka';
  const idEl = document.getElementById('offerEditIdV72'); if(idEl) idEl.value = offer ? offer.id : '';
  set('Insurer', offer ? offer.insurer : ''); set('Product', offer ? offer.product : ''); set('Premium', offer ? offer.premium : '');
  set('Limit', offer ? offer.limit : ''); set('Deductible', offer ? offer.deductible : ''); set('Territory', offer ? offer.territory : '');
  set('Frequency', offer ? offer.frequency : ''); set('Rating', offer ? offer.rating : 'k ověření'); set('Sublimits', offer ? offer.sublimits : '');
  set('Exclusions', offer ? offer.exclusions : ''); set('Strengths', offer ? offer.strengths : ''); set('Weaknesses', offer ? offer.weaknesses : '');
  set('Note', offer ? offer.note : '');
  box.classList.remove('hidden'); box.scrollIntoView({behavior:'smooth', block:'start'});
}
function saveOfferV72(){
  const insurer = (document.getElementById('offerInsurerV72')?.value || '').trim();
  if(!insurer){ alert('Doplňte pojišťovnu.'); document.getElementById('offerInsurerV72')?.focus(); return; }
  const id = document.getElementById('offerEditIdV72')?.value || ('manual-' + getActiveCaseIdV77() + '-' + Date.now());
  const current = getOffersV72();
  const payload = normalizeOfferV77({
    id, insurer,
    product:(document.getElementById('offerProductV72')?.value || '').trim(),
    premium:(document.getElementById('offerPremiumV72')?.value || '').trim(),
    limit:(document.getElementById('offerLimitV72')?.value || '').trim(),
    deductible:(document.getElementById('offerDeductibleV72')?.value || '').trim(),
    territory:document.getElementById('offerTerritoryV72')?.value || '',
    frequency:document.getElementById('offerFrequencyV72')?.value || '',
    rating:document.getElementById('offerRatingV72')?.value || 'k ověření',
    sublimits:(document.getElementById('offerSublimitsV72')?.value || '').trim(),
    exclusions:(document.getElementById('offerExclusionsV72')?.value || '').trim(),
    strengths:(document.getElementById('offerStrengthsV72')?.value || '').trim(),
    weaknesses:(document.getElementById('offerWeaknessesV72')?.value || '').trim(),
    note:(document.getElementById('offerNoteV72')?.value || '').trim()
  }, id);
  const idx = current.findIndex(o => o.id === id);
  if(idx >= 0) current[idx] = payload; else current.unshift(payload);
  saveEditedOffersForActiveCaseV77(current);
  if(typeof closeOfferEditorV72 === 'function') closeOfferEditorV72();
  refreshActiveCaseWorkflowV77();
  alert('Nabídka byla uložena.');
}
function deleteOfferV72(id){ if(!confirm('Smazat nabídku z aktivního případu?')) return; saveEditedOffersForActiveCaseV77(getOffersV72().filter(o => o.id !== id)); refreshActiveCaseWorkflowV77(); }
function recommendOfferV72(id){ saveEditedOffersForActiveCaseV77(getOffersV72().map(o => Object.assign({}, o, {recommended:o.id === id}))); refreshActiveCaseWorkflowV77(); }
function duplicateOfferV72(id){
  const offer = getOffersV72().find(o => o.id === id); if(!offer) return;
  const copy = Object.assign({}, offer, {id:'manual-' + getActiveCaseIdV77() + '-' + Date.now(), insurer:offer.insurer + ' – kopie', recommended:false});
  const items = getOffersV72(); items.unshift(copy); saveEditedOffersForActiveCaseV77(items); refreshActiveCaseWorkflowV77();
}
function calculateCaseReadiness(){
  const offers = getOffersV72(); let score = 0;
  if(getActiveClientNameV77() && getActiveClientNameV77() !== 'Není vybrána žádná poptávka') score += 25;
  if(getActiveActivityV77()) score += 15;
  if(offers.length > 0) score += 20;
  if(offers.length >= 2) score += 25;
  if(offers.some(o => o.recommended)) score += 15;
  return Math.min(100, score);
}
function getMissingParts(){
  const offers = getOffersV72(); const missing = [];
  if(!getActiveClientNameV77() || getActiveClientNameV77() === 'Není vybrána žádná poptávka') missing.push('klient');
  if(!getActiveActivityV77()) missing.push('činnost');
  if(offers.length < 2) missing.push('min. 2 nabídky');
  if(!offers.some(o => o.recommended)) missing.push('doporučená varianta');
  return missing;
}
function renderCaseCommandCenter(){
  const offers = getOffersV72(); const readiness = calculateCaseReadiness(); const missing = getMissingParts();
  const set = (id,value)=>{ const el=document.getElementById(id); if(el) el.textContent=value; };
  set('caseCCClient', getActiveClientNameV77());
  set('caseCCMeta', [getActiveActivityV77() || 'typ činnosti není vyplněn', getActiveCaseIdV77() ? ('DB #' + getActiveCaseIdV77()) : 'bez DB ID', 'rozpracováno', 'stav workflow: aktivní'].join(' · '));
  set('caseCCReady', readiness + '%'); set('caseCCOffers', String(offers.length)); set('caseCCMissing', String(missing.length));
}
function professionalOfferWarningsV77(offer){
  const w=[]; if(!offer.premium) w.push('chybí cena'); if(!offer.limit && !offer.sublimits) w.push('chybí limit'); if(!offer.exclusions) w.push('neověřené výluky'); return w;
}
function renderOfferComparisonV72(){
  const box=document.getElementById('offerComparisonMatrixV72'); if(!box) return;
  const offers=getOffersV72();
  if(!offers.length){ box.innerHTML='<div class="textation-empty">Nejsou vložené nabídky pro porovnání. Přejděte do Nabídky a vložte alespoň jednu nabídku.</div>'; return; }
  const rec=offers.find(o=>o.recommended); const warningCount=offers.reduce((s,o)=>s+professionalOfferWarningsV77(o).length,0);
  const rows=[['Pojistné',o=>o.premium||'–'],['Limit / sublimity',o=>o.limit||o.sublimits||'–'],['Spoluúčast',o=>o.deductible||'–'],['Území',o=>o.territory||'–'],['Frekvence',o=>o.frequency||'–'],['Hodnocení',o=>o.rating||'–'],['Výluky / omezení',o=>o.exclusions||'nevyplněno'],['Silné stránky',o=>o.strengths||'nevyplněno'],['Slabá místa',o=>o.weaknesses||'nevyplněno']];
  box.innerHTML = `<div class="unified-analysis-v73 case-analysis-v74"><div><p class="eyebrow">Makléřská analytika aktivní poptávky</p><h3>${rec?'Doporučená varianta: '+escapeHtml(rec.insurer):'Doporučená varianta zatím není vybraná'}</h3><p>${rec?'Doporučení se použije v klientském výstupu.':'V Nabídkách označte jednu variantu jako doporučenou.'}</p></div><div class="analysis-metrics-v73"><div><b>${offers.length}</b><span>nabídky</span></div><div><b>${warningCount}</b><span>upozornění</span></div><div><b>${rec?'ano':'ne'}</b><span>doporučení</span></div></div></div><div class="comparison-table-wrap-v72"><table class="comparison-table-v72"><thead><tr><th>Parametr</th>${offers.map(o=>`<th>${escapeHtml(o.insurer)}${o.recommended?' ⭐':''}</th>`).join('')}<th>Makléřská poznámka</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${escapeHtml(r[0])}</b></td>${offers.map(o=>`<td>${escapeHtml(r[1](o))}</td>`).join('')}<td>Ověřit proti potřebám klienta a pojistným podmínkám.</td></tr>`).join('')}</tbody></table></div>`;
}
function renderOffersWorkspaceV72(){
  if(typeof renderOffersV72 === 'function') renderOffersV72();
  renderCaseCommandCenter();
  const set=(id,value)=>{ const el=document.getElementById(id); if(el) el.textContent=value; };
  const offers=getOffersV72();
  set('offerProCount', String(offers.length)); const rec=offers.find(o=>o.recommended); set('offerProRecommended', rec?rec.insurer:'–');
  set('offerProWarnings', String(offers.reduce((s,o)=>s+professionalOfferWarningsV77(o).length,0)));
  const bind=document.getElementById('offerCaseBindingV74');
  if(bind) bind.innerHTML=`<div class="case-binding-card-v74"><b>Nabídky aktivní poptávky:</b><span>${escapeHtml(getActiveClientNameV77())} · DB #${escapeHtml(getActiveCaseIdV77() || 'bez DB')} · ${offers.length} nabídek</span></div>`;
}
function getClientCaseSummaryV71(){ const offers=getOffersV72(); return {active:{clientName:getActiveClientNameV77(),businessType:getActiveActivityV77(),clientActivity:getActiveActivityV77(),status:'rozpracováno'},docs:[],offers,readiness:calculateCaseReadiness(),missing:getMissingParts()}; }
function renderAdvisorCockpitV76(){
  const offers=getOffersV72(); const readiness=calculateCaseReadiness(); const missing=getMissingParts(); const set=(id,value)=>{ const el=document.getElementById(id); if(el) el.textContent=value; };
  set('cockpitClientV76', getActiveClientNameV77()); set('cockpitMetaV76', [(getActiveActivityV77() || 'typ činnosti není vyplněn'), offers.length + ' nabídek'].join(' · '));
  set('cockpitReadinessV76', readiness + '%'); set('cockpitOffersV76', offers.length + ' nabídek'); set('cockpitComparisonV76', offers.length >= 2 ? 'připraveno' : 'čeká'); set('cockpitReportV76', offers.length >= 2 ? 'lze připravit' : 'čeká');
  set('advisorNextTitleV76', offers.length >= 2 ? 'Připravte porovnání a doporučení' : 'Doplňte nabídky k aktivní poptávce');
  set('advisorNextTextV76', offers.length >= 2 ? 'Vyberte doporučenou variantu a připravte klientský výstup.' : 'Pro porovnání jsou potřeba alespoň dvě nabídky.');
  const warningsBox=document.getElementById('advisorWarningsV76'); if(warningsBox) warningsBox.innerHTML = missing.map(x=>`<span>⚠ ${escapeHtml(x)}</span>`).join('') || '<span class="ok">✓ Bez zásadních blokací</span>';
}
function buildClientPresentation(){
  const data=getClientCaseSummaryV71(); const recText=(document.getElementById('clientRecommendation')?.value || '').trim(); const warnText=(document.getElementById('clientWarnings')?.value || '').trim(); const recOffer=(data.offers || []).find(o=>o.recommended); const preview=document.getElementById('clientPresentationPreview'); if(!preview) return;
  preview.innerHTML = `<div class="client-preview-header"><div><p>ASTORIE a.s. · S lehkostí světem financí</p><h2>Poradenské shrnutí k pojištění podnikatelských rizik</h2></div><strong>${escapeHtml(data.readiness)} % připravenost</strong></div><div class="client-preview-body"><section><h3>1. Klient</h3><p><b>${escapeHtml(data.active.clientName || '')}</b><br>${escapeHtml(data.active.businessType || 'typ činnosti není doplněn')}</p></section><section><h3>2. Nabídky</h3><p>Do porovnání jsou zahrnuty ${data.offers.length} nabídky.</p></section><section><h3>3. Doporučená varianta</h3><p>${recOffer ? escapeHtml(recOffer.insurer) : 'Doporučená varianta zatím není označena.'}</p></section><section><h3>4. Doporučení poradce</h3><p>${recText ? escapeHtml(recText) : 'Doplňte doporučení poradce.'}</p></section><section><h3>5. Upozornění pro klienta</h3><p>${warnText ? escapeHtml(warnText) : 'Doplňte upozornění na limity, výluky, sublimity a spoluúčasti.'}</p></section></div>`;
}
function copyClientOutput(){ buildClientPresentation(); const preview=document.getElementById('clientPresentationPreview'); if(!preview) return; navigator.clipboard?.writeText(preview.innerText || preview.textContent || ''); alert('Klientský výstup byl zkopírován.'); }
function refreshActiveCaseWorkflowV77(){ renderCaseCommandCenter(); if(typeof renderOffersWorkspaceV72==='function') renderOffersWorkspaceV72(); if(typeof renderOfferComparisonV72==='function') renderOfferComparisonV72(); if(typeof renderAdvisorCockpitV76==='function') renderAdvisorCockpitV76(); if(typeof renderClientOutputStats==='function') renderClientOutputStats(); }
if(typeof applyState === 'function' && !window.__applyStateV77Wrapped){ window.__applyStateV77Wrapped=true; const oldApplyStateV77=applyState; applyState=function(s){ oldApplyStateV77(s); localStorage.setItem('astorie_active_case_id_v77', getActiveCaseIdV77() || ''); setTimeout(refreshActiveCaseWorkflowV77,250); }; }
if(typeof showView === 'function' && !window.__showViewV77Wrapped){ window.__showViewV77Wrapped=true; const oldShowViewV77=showView; showView=function(id){ oldShowViewV77(id); setTimeout(refreshActiveCaseWorkflowV77,180); }; }
setTimeout(refreshActiveCaseWorkflowV77,500); setTimeout(refreshActiveCaseWorkflowV77,1400);



// ============================================================
// ASTORIE Business Risk Hub 1.0 - Core Stabilization
// ============================================================
// Stabilizační vrstva: jeden aktivní case, izolace dat podle DB ID,
// jednotný rebuild po každé změně, bez destruktivního mazání starých dat.

(function(){
  const VERSION = '1.0.0-core-stabilization';
  const STORE_KEY = 'brh1_case_store';
  const ACTIVE_KEY = 'brh1_active_case_id';
  const EDITED_OFFERS_KEY = 'brh1_edited_offers_by_case';
  const DOCS_KEY = 'brh1_documents_by_case';
  const REPORT_KEY = 'brh1_report_by_case';

  const $ = (id) => document.getElementById(id);
  const text = (id, value) => { const el = $(id); if(el) el.textContent = value; };
  const html = (id, value) => { const el = $(id); if(el) el.innerHTML = value; };
  const esc = (v) => {
    if(typeof escapeHtml === 'function') return escapeHtml(v);
    return String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  };
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const parse = (raw, fb) => { try { return raw ? JSON.parse(raw) : fb; } catch(e){ return fb; } };
  const moneyNum = (v) => {
    const s = String(v || '').replace(/\s/g,'').replace(/[^\d,.-]/g,'').replace(',','.');
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  function readMap(key){
    return parse(localStorage.getItem(key), {});
  }
  function writeMap(key, obj){
    localStorage.setItem(key, JSON.stringify(obj || {}));
  }

  function currentCaseId(){
    try{
      if(typeof state !== 'undefined'){
        if(state.id) return String(state.id);
        if(state.activeInquiry && (state.activeInquiry.id || state.activeInquiry.dbId)) return String(state.activeInquiry.id || state.activeInquiry.dbId);
        if(state.form && (state.form.id || state.form.dbId)) return String(state.form.id || state.form.dbId);
      }
    }catch(e){}
    const body = document.body ? (document.body.innerText || '') : '';
    const m = body.match(/DB\s*#?(\d+)/i);
    if(m) return String(m[1]);
    return localStorage.getItem(ACTIVE_KEY) || 'local';
  }

  function currentClient(){
    try{
      if(typeof state !== 'undefined'){
        if(state.activeInquiry && state.activeInquiry.clientName) return state.activeInquiry.clientName;
        if(state.form && state.form.clientName) return state.form.clientName;
        if(state.clientName) return state.clientName;
        if(state.form && state.form.companyName) return state.form.companyName;
      }
    }catch(e){}
    const activeBanner = document.querySelector('#activeInquiryBanner h2, .active-inquiry-banner h2, #caseCCClient');
    const t = activeBanner ? activeBanner.textContent.trim() : '';
    if(t && !/není vybrána/i.test(t)) return t.replace(/^#\d+\s*[–-]\s*/,'');
    return 'Není vybrána žádná poptávka';
  }

  function currentActivity(){
    try{
      if(typeof state !== 'undefined'){
        if(state.activeInquiry && (state.activeInquiry.businessType || state.activeInquiry.clientActivity)) return state.activeInquiry.businessType || state.activeInquiry.clientActivity;
        if(state.form && (state.form.businessType || state.form.clientActivity)) return state.form.businessType || state.form.clientActivity;
        if(state.businessType) return state.businessType;
      }
    }catch(e){}
    return '';
  }

  function insurerName(id){
    try{
      const list = (typeof CATALOG !== 'undefined' && CATALOG && Array.isArray(CATALOG.insurers)) ? CATALOG.insurers : [];
      const found = list.find(i => String(i.id) === String(id) || String(i.code || '') === String(id) || String(i.short || '') === String(id));
      if(found) return (found.short ? found.short + ' – ' : '') + found.name;
    }catch(e){}
    return String(id || '').toUpperCase();
  }

  function normalizeOffer(o, fallbackId){
    o = o || {};
    return {
      id: o.id || fallbackId || ('offer-' + Date.now()),
      insurer: o.insurer || o.company || o.pojistovna || o.insuranceCompany || o.name || '',
      product: o.product || o.produkt || o.product_name || 'nabídka pojišťovny',
      premium: o.premium || o.price || o.pojistne || o.annualPremium || '',
      limit: o.limit || o.mainLimit || o.coverageLimit || '',
      deductible: o.deductible || o.spoluucast || '',
      territory: o.territory || o.uzemi || '',
      frequency: o.frequency || o.frekvence || '',
      rating: o.rating || o.verdict || o.status || 'k ověření',
      sublimits: o.sublimits || o.subLimits || '',
      exclusions: o.exclusions || o.vyluky || '',
      strengths: o.strengths || '',
      weaknesses: o.weaknesses || '',
      note: o.note || o.poznamka || '',
      recommended: !!o.recommended,
      updatedAt: o.updatedAt || new Date().toISOString(),
      source: o.source || 'active-case'
    };
  }

  function offerFromDb(insurerId, dbOffer){
    dbOffer = dbOffer || {};
    const cov = isObj(dbOffer.coverages) ? Object.values(dbOffer.coverages) : [];
    const limits = cov.map(c => c && c.limit).filter(Boolean).slice(0,6).join(', ');
    const exclusions = cov.filter(c => /výluka|nesplněno/i.test(String(c && c.state || '')))
      .map(c => [c.original, c.limit, c.note].filter(Boolean).join(' · '))
      .filter(Boolean).slice(0,8).join('\n');
    const weak = cov.filter(c => /částečně|výluka|nesplněno|nevyhodnoceno/i.test(String(c && c.state || '')))
      .map(c => [c.state, c.limit, c.note].filter(Boolean).join(' · '))
      .filter(Boolean).slice(0,8).join('\n');
    const strong = cov.filter(c => String(c && c.state || '').toLowerCase() === 'splněno')
      .map(c => [c.limit, c.source].filter(Boolean).join(' · '))
      .filter(Boolean).slice(0,8).join('\n');
    const id = 'db-' + currentCaseId() + '-' + insurerId;
    return normalizeOffer({
      id,
      insurer: insurerName(insurerId),
      product: dbOffer.product || dbOffer.product_name || 'nabídka pojišťovny',
      premium: dbOffer.premium || '',
      limit: limits || '',
      deductible: dbOffer.deductible || '',
      territory: dbOffer.territory || '',
      frequency: dbOffer.frequency || '',
      rating: dbOffer.status || 'doručeno',
      sublimits: limits || '',
      exclusions,
      weaknesses: weak,
      strengths: strong,
      note: dbOffer.note || '',
      recommended: !!dbOffer.recommended,
      source: 'db-active'
    }, id);
  }

  function readDbOffers(){
    try{
      if(typeof state !== 'undefined' && isObj(state.offers)){
        return Object.entries(state.offers).map(([id, o]) => offerFromDb(id, o)).filter(o => o.insurer || o.product);
      }
      if(typeof state !== 'undefined' && Array.isArray(state.offers)){
        return state.offers.map((o,i) => normalizeOffer(o, o.id || ('db-array-' + currentCaseId() + '-' + i))).filter(o => o.insurer || o.product);
      }
    }catch(e){}
    return [];
  }

  function readEditedOffers(){
    const id = currentCaseId();
    const all = readMap(EDITED_OFFERS_KEY);
    return Array.isArray(all[id]) ? all[id].map((o,i)=>normalizeOffer(o, o.id || ('edited-' + id + '-' + i))) : [];
  }

  function writeEditedOffers(offers){
    const id = currentCaseId();
    const all = readMap(EDITED_OFFERS_KEY);
    all[id] = (offers || []).map(o => normalizeOffer(o, o.id));
    writeMap(EDITED_OFFERS_KEY, all);
  }

  function readDocs(){
    const id = currentCaseId();
    const all = readMap(DOCS_KEY);
    return Array.isArray(all[id]) ? all[id] : [];
  }

  function readReport(){
    const id = currentCaseId();
    const all = readMap(REPORT_KEY);
    return all[id] || {};
  }

  function writeReport(report){
    const id = currentCaseId();
    const all = readMap(REPORT_KEY);
    all[id] = Object.assign({}, all[id] || {}, report || {}, {updatedAt:new Date().toISOString()});
    writeMap(REPORT_KEY, all);
  }

  function activeOffers(){
    const db = readDbOffers();
    const edited = readEditedOffers();
    const map = new Map();

    // DB = základ konkrétního případu, edited = překryv jen pro stejný case
    db.forEach(o => map.set(o.id, o));
    edited.forEach(o => {
      o = normalizeOffer(o, o.id);
      if(o.insurer || o.product) map.set(o.id, o);
    });

    return Array.from(map.values());
  }

  function missingParts(){
    const offers = activeOffers();
    const docs = readDocs();
    const out = [];
    if(!currentClient() || /není vybrána/i.test(currentClient())) out.push('klient');
    if(!currentActivity()) out.push('typ činnosti');
    if(offers.length < 1) out.push('nabídky');
    if(offers.length < 2) out.push('alespoň 2 nabídky');
    if(!offers.some(o=>o.recommended)) out.push('doporučená varianta');
    if(!docs.length) out.push('podklady / dokumenty');
    return out;
  }

  function readiness(){
    const offers = activeOffers();
    const docs = readDocs();
    let score = 0;
    if(currentClient() && !/není vybrána/i.test(currentClient())) score += 25;
    if(currentActivity()) score += 15;
    if(offers.length >= 1) score += 20;
    if(offers.length >= 2) score += 15;
    if(offers.some(o=>o.recommended)) score += 15;
    if(docs.length) score += 10;
    return Math.min(100, score);
  }

  function warningsForOffer(o){
    const w = [];
    if(!o.premium) w.push('chybí pojistné');
    if(!o.limit && !o.sublimits) w.push('chybí limit');
    if(!o.exclusions) w.push('neověřené výluky');
    if(/výluka|nedoporu/i.test(String(o.rating))) w.push('rizikové hodnocení');
    return w;
  }

  function bestPrice(){
    const values = activeOffers().map(o=>moneyNum(o.premium)).filter(Boolean);
    return values.length ? Math.min(...values).toLocaleString('cs-CZ') + ' Kč' : '–';
  }

  function activeCase(){
    const offers = activeOffers();
    return {
      id: currentCaseId(),
      clientName: currentClient(),
      activity: currentActivity(),
      offers,
      documents: readDocs(),
      report: readReport(),
      readiness: readiness(),
      missing: missingParts(),
      recommended: offers.find(o=>o.recommended) || null,
      updatedAt: new Date().toISOString()
    };
  }

  function persistSnapshot(){
    const store = readMap(STORE_KEY);
    const c = activeCase();
    store[c.id] = c;
    writeMap(STORE_KEY, store);
    localStorage.setItem(ACTIVE_KEY, c.id);
    return c;
  }

  function updateTopPanels(){
    const c = activeCase();
    const offerWarnings = c.offers.reduce((s,o)=>s+warningsForOffer(o).length,0);

    text('brh1Client', c.clientName);
    text('brh1Meta', [c.activity || 'typ činnosti není vyplněn', 'DB #' + c.id, c.offers.length + ' nabídek'].join(' · '));
    text('brh1Score', c.readiness + '%');
    text('brh1Offers', String(c.offers.length));
    text('brh1Docs', String(c.documents.length));
    text('brh1Recommended', c.recommended ? 'ano' : 'ne');
    text('brh1Missing', String(c.missing.length));

    text('caseCCClient', c.clientName);
    text('caseCCMeta', [c.activity || 'typ činnosti není vyplněn', 'DB #' + c.id, 'rozpracováno', 'stav workflow: aktivní'].join(' · '));
    text('caseCCReady', c.readiness + '%');
    text('caseCCDocs', String(c.documents.length));
    text('caseCCOffers', String(c.offers.length));
    text('caseCCMissing', String(c.missing.length));

    text('offerProCount', String(c.offers.length));
    text('offerProRecommended', c.recommended ? c.recommended.insurer : '–');
    text('offerProBestPrice', bestPrice());
    text('offerProWarnings', String(offerWarnings));

    const warnings = $('brh1Warnings');
    if(warnings){
      warnings.innerHTML = c.missing.length ? c.missing.map(x=>`<span>⚠ ${esc(x)}</span>`).join('') : '<span class="ok">✓ Případ je připravený k dalšímu kroku</span>';
    }

    let title = 'Pokračujte v práci na případu';
    let note = 'Zkontrolujte nabídky, porovnání a klientský výstup.';
    if(/není vybrána/i.test(c.clientName)){
      title = 'Otevřete nebo založte obchodní případ';
      note = 'Všechny části aplikace se budou vázat na aktivní případ.';
    }else if(c.offers.length < 1){
      title = 'Doplňte nabídky pojišťoven';
      note = 'Bez nabídek nelze připravit porovnání ani klientskou zprávu.';
    }else if(c.offers.length < 2){
      title = 'Doplňte druhou nabídku';
      note = 'Pro relevantní makléřské porovnání je potřeba alespoň dvojice nabídek.';
    }else if(!c.recommended){
      title = 'Vyberte doporučenou variantu';
      note = 'Doporučená varianta se propíše do klientského výstupu.';
    }else if(c.readiness < 80){
      title = 'Zkontrolujte podklady a upozornění';
      note = 'Doplňte chybějící informace před finálním výstupem.';
    }else{
      title = 'Připravte klientský výstup';
      note = 'Případ je připravený pro profesionální shrnutí klientovi.';
    }
    text('brh1NextTitle', title);
    text('brh1NextText', note);

    document.querySelectorAll('[data-brh-step]').forEach(btn => {
      const step = btn.getAttribute('data-brh-step');
      const active = (c.offers.length < 1 && step === 'offers') ||
                     (c.offers.length >= 1 && c.offers.length < 2 && step === 'offers') ||
                     (c.offers.length >= 2 && !c.recommended && step === 'comparison') ||
                     (c.recommended && step === 'report');
      btn.classList.toggle('active', active);
    });

    const bind = $('offerCaseBindingV74');
    if(bind){
      bind.innerHTML = `<div class="case-binding-card-v74"><b>Nabídky aktivního obchodního případu:</b><span>${esc(c.clientName)} · DB #${esc(c.id)} · ${c.offers.length} nabídek</span></div>`;
    }
  }

  function renderComparison(){
    const box = $('offerComparisonMatrixV72');
    if(!box) return;
    const c = activeCase();
    if(!c.offers.length){
      box.innerHTML = '<div class="textation-empty">Nejsou vložené nabídky pro porovnání. Přejděte do Nabídky a vložte alespoň jednu nabídku.</div>';
      return;
    }
    const rows = [
      ['Pojistné', o => o.premium || '–'],
      ['Limit / sublimity', o => o.limit || o.sublimits || '–'],
      ['Spoluúčast', o => o.deductible || '–'],
      ['Území', o => o.territory || '–'],
      ['Frekvence', o => o.frequency || '–'],
      ['Hodnocení', o => o.rating || '–'],
      ['Výluky / omezení', o => o.exclusions || 'nevyplněno'],
      ['Silné stránky', o => o.strengths || 'nevyplněno'],
      ['Slabá místa', o => o.weaknesses || 'nevyplněno']
    ];
    const warns = c.offers.reduce((s,o)=>s+warningsForOffer(o).length,0);
    box.innerHTML = `
      <div class="unified-analysis-v73 case-analysis-v74 brh1-analysis">
        <div>
          <p class="eyebrow">Makléřská analytika aktivního případu</p>
          <h3>${c.recommended ? 'Doporučená varianta: ' + esc(c.recommended.insurer) : 'Doporučená varianta zatím není vybraná'}</h3>
          <p>${c.recommended ? 'Doporučení se propíše do klientského výstupu.' : 'V Nabídkách označte jednu variantu jako doporučenou.'}</p>
        </div>
        <div class="analysis-metrics-v73">
          <div><b>${c.offers.length}</b><span>nabídky</span></div>
          <div><b>${warns}</b><span>upozornění</span></div>
          <div><b>${c.recommended ? 'ano' : 'ne'}</b><span>doporučení</span></div>
        </div>
      </div>
      <div class="comparison-table-wrap-v72">
        <table class="comparison-table-v72">
          <thead>
            <tr><th>Parametr</th>${c.offers.map(o=>`<th>${esc(o.insurer)}${o.recommended ? ' ⭐' : ''}</th>`).join('')}<th>Makléřská poznámka</th></tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr><td><b>${esc(r[0])}</b></td>${c.offers.map(o=>`<td>${esc(r[1](o))}</td>`).join('')}<td>Ověřit podle potřeb klienta, rozsahu činnosti a VPP/DPP/ZPP.</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderClientReport(){
    const preview = $('clientPresentationPreview');
    if(!preview) return;
    const c = activeCase();
    const recText = ($('clientRecommendation')?.value || c.report.recommendation || '').trim();
    const warnText = ($('clientWarnings')?.value || c.report.warnings || '').trim();

    preview.innerHTML = `
      <div class="client-preview-header brh1-client-header">
        <div>
          <p>ASTORIE a.s. · Business Risk Hub</p>
          <h2>Poradenské shrnutí k pojištění podnikatelských rizik</h2>
        </div>
        <strong>${c.readiness}% připravenost</strong>
      </div>
      <div class="client-preview-body brh1-client-body">
        <section>
          <h3>1. Identifikace klienta</h3>
          <table>
            <tr><td>Klient</td><td><b>${esc(c.clientName)}</b></td></tr>
            <tr><td>Činnost / typ klienta</td><td>${esc(c.activity || 'není doplněno')}</td></tr>
            <tr><td>Počet porovnaných nabídek</td><td>${c.offers.length}</td></tr>
          </table>
        </section>
        <section>
          <h3>2. Přehled nabídek</h3>
          <table>
            <thead><tr><th>Pojišťovna</th><th>Pojistné</th><th>Limit</th><th>Hodnocení</th><th>Doporučení</th></tr></thead>
            <tbody>
              ${c.offers.map(o => `<tr><td>${esc(o.insurer)}</td><td>${esc(o.premium || '–')}</td><td>${esc(o.limit || o.sublimits || '–')}</td><td>${esc(o.rating || 'k ověření')}</td><td>${o.recommended ? 'doporučená varianta' : 'alternativa'}</td></tr>`).join('')}
            </tbody>
          </table>
        </section>
        <section>
          <h3>3. Doporučená varianta</h3>
          <p>${c.recommended ? esc(c.recommended.insurer) : 'Doporučená varianta zatím není označena.'}</p>
        </section>
        <section>
          <h3>4. Doporučení poradce</h3>
          <p>${recText ? esc(recText) : 'Doplní poradce po projednání s klientem.'}</p>
        </section>
        <section>
          <h3>5. Upozornění pro klienta</h3>
          <p>${warnText ? esc(warnText) : 'Doplnit limity, výluky, sublimity, spoluúčasti a body k ověření.'}</p>
        </section>
        <section class="brh1-disclaimer">
          <b>Interní upozornění:</b> Výstup aplikace je analytická pomůcka. Finální doporučení musí potvrdit poradce podle potřeb a cílů klienta.
        </section>
      </div>`;
  }

  function renderReportCounters(){
    const c = activeCase();
    const cards = document.querySelectorAll('.client-output-workspace .stat-card, .client-output-workspace [id*="client"]');
    text('clientOutputClient', c.clientName);
    text('clientOutputReadiness', c.readiness + '%');
    text('clientOutputOffers', String(c.offers.length));
    text('clientOutputDocs', String(c.documents.length));
  }

  function renderOffersSummary(){
    // Nezasahuje do původního renderu karet, jen opravuje horní souhrny a vazbu.
    const c = activeCase();
    text('offerProCount', String(c.offers.length));
    text('offerProRecommended', c.recommended ? c.recommended.insurer : '–');
    text('offerProBestPrice', bestPrice());
    text('offerProWarnings', String(c.offers.reduce((s,o)=>s+warningsForOffer(o).length,0)));
  }

  function rebuild(silent){
    persistSnapshot();
    updateTopPanels();
    renderOffersSummary();
    renderComparison();
    renderReportCounters();
    if(!silent) {
      const c = activeCase();
      alert('Kontrola dokončena. Aktivní případ: ' + c.clientName + ' / DB #' + c.id + ' / nabídky: ' + c.offers.length);
    }
  }

  function next(){
    const c = activeCase();
    if(/není vybrána/i.test(c.clientName)) return showView('inquiryView');
    if(c.offers.length < 2) return showView('offersView');
    if(!c.recommended) return showView('comparisonView');
    return showView('reportView');
  }

  function saveOfferFromEditor(){
    const insurer = ($('offerInsurerV72')?.value || '').trim();
    if(!insurer){
      alert('Doplňte pojišťovnu.');
      $('offerInsurerV72')?.focus();
      return;
    }
    const id = $('offerEditIdV72')?.value || ('manual-' + currentCaseId() + '-' + Date.now());
    const current = activeOffers();
    const payload = normalizeOffer({
      id,
      insurer,
      product: ($('offerProductV72')?.value || '').trim(),
      premium: ($('offerPremiumV72')?.value || '').trim(),
      limit: ($('offerLimitV72')?.value || '').trim(),
      deductible: ($('offerDeductibleV72')?.value || '').trim(),
      territory: $('offerTerritoryV72')?.value || '',
      frequency: $('offerFrequencyV72')?.value || '',
      rating: $('offerRatingV72')?.value || 'k ověření',
      sublimits: ($('offerSublimitsV72')?.value || '').trim(),
      exclusions: ($('offerExclusionsV72')?.value || '').trim(),
      strengths: ($('offerStrengthsV72')?.value || '').trim(),
      weaknesses: ($('offerWeaknessesV72')?.value || '').trim(),
      note: ($('offerNoteV72')?.value || '').trim(),
      source: 'manual-edit'
    }, id);
    const idx = current.findIndex(o => o.id === id);
    if(idx >= 0) current[idx] = payload; else current.unshift(payload);
    writeEditedOffers(current);
    if(typeof closeOfferEditorV72 === 'function') closeOfferEditorV72();
    rebuild(true);
    alert('Nabídka byla uložena do aktivního obchodního případu.');
  }

  function recommend(id){
    const items = activeOffers().map(o => Object.assign({}, o, {recommended: o.id === id}));
    writeEditedOffers(items);
    rebuild(true);
  }

  function removeOffer(id){
    if(!confirm('Smazat nabídku z aktivního obchodního případu?')) return;
    writeEditedOffers(activeOffers().filter(o => o.id !== id));
    rebuild(true);
  }

  function duplicate(id){
    const o = activeOffers().find(x => x.id === id);
    if(!o) return;
    const copy = Object.assign({}, o, {id:'manual-' + currentCaseId() + '-' + Date.now(), insurer:o.insurer + ' – kopie', recommended:false, source:'manual-copy'});
    writeEditedOffers([copy].concat(activeOffers()));
    rebuild(true);
  }

  function openOfferEditor(id){
    const box = $('offerEditorV72');
    if(!box) return;
    const offer = id ? activeOffers().find(o => o.id === id) : null;
    const set = (suffix, value) => { const el = $('offer' + suffix + 'V72'); if(el) el.value = value || ''; };
    text('offerEditorTitleV72', offer ? 'Upravit nabídku' : 'Nová nabídka');
    if($('offerEditIdV72')) $('offerEditIdV72').value = offer ? offer.id : '';
    set('Insurer', offer ? offer.insurer : '');
    set('Product', offer ? offer.product : '');
    set('Premium', offer ? offer.premium : '');
    set('Limit', offer ? offer.limit : '');
    set('Deductible', offer ? offer.deductible : '');
    set('Territory', offer ? offer.territory : '');
    set('Frequency', offer ? offer.frequency : '');
    set('Rating', offer ? offer.rating : 'k ověření');
    set('Sublimits', offer ? offer.sublimits : '');
    set('Exclusions', offer ? offer.exclusions : '');
    set('Strengths', offer ? offer.strengths : '');
    set('Weaknesses', offer ? offer.weaknesses : '');
    set('Note', offer ? offer.note : '');
    box.classList.remove('hidden');
    box.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function copyReport(){
    renderClientReport();
    const preview = $('clientPresentationPreview');
    if(!preview) return;
    const txt = preview.innerText || preview.textContent || '';
    if(navigator.clipboard) navigator.clipboard.writeText(txt);
    alert('Klientský výstup byl zkopírován.');
  }

  // Expose production API
  window.BRH1 = {
    version: VERSION,
    activeCase,
    offers: activeOffers,
    rebuild,
    next,
    saveOffer: saveOfferFromEditor,
    recommend,
    removeOffer,
    duplicate,
    openOfferEditor,
    renderClientReport,
    copyReport
  };

  // Override legacy public functions safely
  window.getOffersV72 = activeOffers;
  window.saveOffersV72 = writeEditedOffers;
  window.saveOfferV72 = saveOfferFromEditor;
  window.openOfferEditorV72 = openOfferEditor;
  window.recommendOfferV72 = recommend;
  window.deleteOfferV72 = removeOffer;
  window.duplicateOfferV72 = duplicate;
  window.renderOfferComparisonV72 = renderComparison;
  window.getClientCaseSummaryV71 = function(){ 
    const c = activeCase();
    return {active:{clientName:c.clientName,businessType:c.activity,clientActivity:c.activity,status:'rozpracováno'}, docs:c.documents, offers:c.offers, readiness:c.readiness, missing:c.missing};
  };
  window.buildClientPresentation = renderClientReport;
  window.copyClientOutput = copyReport;
  window.calculateCaseReadiness = readiness;
  window.getMissingParts = missingParts;

  // Wrap showView/applyState only once
  if(typeof window.showView === 'function' && !window.__BRH1_showViewWrapped){
    window.__BRH1_showViewWrapped = true;
    const old = window.showView;
    window.showView = function(id){
      old(id);
      setTimeout(()=>rebuild(true), 120);
      if(id === 'reportView') setTimeout(renderClientReport, 180);
    };
  }
  if(typeof window.applyState === 'function' && !window.__BRH1_applyStateWrapped){
    window.__BRH1_applyStateWrapped = true;
    const old = window.applyState;
    window.applyState = function(s){
      old(s);
      localStorage.setItem(ACTIVE_KEY, currentCaseId());
      setTimeout(()=>rebuild(true), 180);
    };
  }

  document.addEventListener('input', function(e){
    if(e.target && (e.target.id === 'clientRecommendation' || e.target.id === 'clientWarnings')){
      writeReport({
        recommendation: $('clientRecommendation')?.value || '',
        warnings: $('clientWarnings')?.value || ''
      });
    }
  });

  setTimeout(()=>rebuild(true), 300);
  setTimeout(()=>rebuild(true), 1000);
  setTimeout(()=>rebuild(true), 2200);
})();



// ============================================================
// ASTORIE Business Risk Hub 1.0.1 - Case Identity + Risk Mapping Fix
// ============================================================
(function(){
  const ACTIVE_KEY='brh101_active_case_id';
  const EDITED_KEY='brh1_edited_offers_by_case';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const parse=(raw,fb)=>{try{return raw?JSON.parse(raw):fb}catch(e){return fb}};
  const text=(id,v)=>{const el=$(id); if(el) el.textContent=v};
  const readMap=k=>parse(localStorage.getItem(k),{});
  const writeMap=(k,o)=>localStorage.setItem(k,JSON.stringify(o||{}));

  function cleanName(v){
    return String(v||'').replace(/^#\d+\s*[–-]\s*/,'').replace(/^DB\s*#?\d+\s*[–-]?\s*/i,'').trim();
  }
  function emptyName(v){return !String(v||'').trim()||/není\s+vybrána\s+žádná\s+poptávka/i.test(String(v||''));}

  function bannerText(){
    const selectors=['#activeInquiryBanner','.active-inquiry-banner','.active-case-banner','[data-active-inquiry]','[data-active-case]'];
    for(const s of selectors){const el=document.querySelector(s); if(el&&el.innerText&&el.innerText.trim()) return el.innerText.trim();}
    const nodes=Array.from(document.querySelectorAll('section,.panel,.card,div')).filter(el=>{
      const t=el.innerText||''; return /DB\s*#?\d+|Aktivní poptávka|obchodní případ/i.test(t)&&t.length<1400;
    });
    return nodes[0]?.innerText?.trim()||'';
  }

  function caseId(){
    try{
      if(typeof state!=='undefined'){
        if(state.activeInquiry&&(state.activeInquiry.id||state.activeInquiry.dbId)) return String(state.activeInquiry.id||state.activeInquiry.dbId);
        if(state.form&&(state.form.id||state.form.dbId)) return String(state.form.id||state.form.dbId);
        if(state.id) return String(state.id);
      }
    }catch(e){}
    const m=bannerText().match(/DB\s*#?(\d+)/i)||bannerText().match(/#(\d+)\s*[–-]/);
    if(m){localStorage.setItem(ACTIVE_KEY,String(m[1])); return String(m[1]);}
    return localStorage.getItem(ACTIVE_KEY)||'local';
  }

  function clientName(){
    const candidates=[];
    try{
      if(typeof state!=='undefined'){
        if(state.activeInquiry&&state.activeInquiry.clientName)candidates.push(state.activeInquiry.clientName);
        if(state.form&&state.form.clientName)candidates.push(state.form.clientName);
        if(state.form&&state.form.companyName)candidates.push(state.form.companyName);
        if(state.clientName)candidates.push(state.clientName);
      }
    }catch(e){}
    const b=bannerText();
    b.split(/\n+/).forEach(line=>{
      const m=line.match(/#\d+\s*[–-]\s*(.+)$/);
      if(m)candidates.unshift(m[1]);
      if(/\b(a\.s\.|s\.r\.o\.|spol\.|consulting|insurance|ASTORIE)\b/i.test(line)&&!/stav|nabíd|menu|aktivní/i.test(line))candidates.push(line);
    });
    const cc=$('caseCCClient'); if(cc&&!emptyName(cc.textContent)) candidates.push(cc.textContent);
    return candidates.map(cleanName).find(n=>!emptyName(n))||'Není vybrána žádná poptávka';
  }

  function activity(){
    try{
      if(typeof state!=='undefined'){
        if(state.activeInquiry&&(state.activeInquiry.businessType||state.activeInquiry.clientActivity)) return state.activeInquiry.businessType||state.activeInquiry.clientActivity;
        if(state.form&&(state.form.businessType||state.form.clientActivity)) return state.form.businessType||state.form.clientActivity;
      }
    }catch(e){}
    const m=bannerText().match(/·\s*([^·\n]+)\s*·\s*Nabídky/i);
    return m?m[1].trim():'';
  }

  function insurerName(id){
    try{
      const list=(typeof CATALOG!=='undefined'&&CATALOG&&Array.isArray(CATALOG.insurers))?CATALOG.insurers:[];
      const f=list.find(i=>String(i.id)===String(id)||String(i.code||'')===String(id)||String(i.short||'')===String(id));
      if(f)return (f.short?f.short+' – ':'')+f.name;
    }catch(e){}
    return String(id||'').toUpperCase();
  }

  function riskName(v,i){
    v=String(v||'').trim();
    if(v&&!/^\d[\d\s.,]*\s*Kč$/i.test(v)&&!/^limit$/i.test(v))return v;
    return ['Provozní odpovědnost','Odpovědnost za výrobek','Škody způsobené zaměstnanci','Čistá finanční škoda','Škody na převzatých věcech','Věci užívané'][i%6];
  }

  function normCov(c,i){
    c=c||{};
    return {
      risk:riskName(c.risk||c.riskName||c.name||c.title||c.original||c.label||c.requirement,i),
      limit:c.limit||c.value||c.amount||c.coverageLimit||'',
      state:c.state||c.status||c.result||'nutno ověřit',
      source:c.source||c.vpp||c.article||c.reference||'doplnit VPP/DPP, článek/odstavec',
      note:c.note||c.comment||c.poznamka||''
    };
  }

  function covsFromDb(o){
    if(!o)return[];
    if(Array.isArray(o.coverages))return o.coverages.map(normCov);
    if(isObj(o.coverages))return Object.entries(o.coverages).map(([k,v],i)=>normCov(Object.assign({risk:k},v||{}),i));
    if(Array.isArray(o.risks))return o.risks.map(normCov);
    return [];
  }

  function normOffer(o,id){
    o=o||{};
    const covs=Array.isArray(o.coverages)?o.coverages.map(normCov):[];
    const riskSummary=covs.map(c=>`${c.risk}: ${c.limit||'bez limitu'} (${c.state||'nutno ověřit'})`).join('\n');
    return {
      id:o.id||id||('offer-'+Date.now()),
      insurer:o.insurer||o.company||o.pojistovna||o.insuranceCompany||o.name||'',
      product:o.product||o.produkt||o.product_name||'nabídka pojišťovny',
      premium:o.premium||o.price||o.pojistne||o.annualPremium||'',
      limit:o.limit||o.mainLimit||o.coverageLimit||covs.map(c=>c.limit).filter(Boolean).slice(0,3).join(', '),
      deductible:o.deductible||o.spoluucast||'',
      territory:o.territory||o.uzemi||'',
      frequency:o.frequency||o.frekvence||'',
      rating:o.rating||o.verdict||o.status||'k ověření',
      sublimits:o.sublimits||o.subLimits||riskSummary||'',
      exclusions:o.exclusions||o.vyluky||'',
      strengths:o.strengths||'',
      weaknesses:o.weaknesses||'',
      note:o.note||o.poznamka||'',
      recommended:!!o.recommended,
      coverages:covs,
      updatedAt:o.updatedAt||new Date().toISOString()
    };
  }

  function offerFromDb(id,o){
    const covs=covsFromDb(o);
    const limitSummary=covs.map(c=>`${c.risk}: ${c.limit||'bez limitu'}`).join('\n');
    const weak=covs.filter(c=>/částečně|výluka|nesplněno|nevyhodnoceno|ověřit/i.test(String(c.state||''))).map(c=>`${c.risk}: ${c.state}${c.limit?' · '+c.limit:''}`).join('\n');
    return normOffer({
      id:'db-'+caseId()+'-'+id,
      insurer:insurerName(id),
      product:o?.product||o?.product_name||'nabídka pojišťovny',
      premium:o?.premium||'',
      limit:limitSummary,
      deductible:o?.deductible||'',
      territory:o?.territory||'',
      frequency:o?.frequency||'',
      rating:o?.status||'doručeno',
      sublimits:limitSummary,
      weaknesses:weak,
      exclusions:o?.exclusions||o?.vyluky||'',
      note:o?.note||'',
      recommended:!!o?.recommended,
      coverages:covs
    },'db-'+caseId()+'-'+id);
  }

  function dbOffers(){
    try{
      if(typeof state!=='undefined'&&isObj(state.offers))return Object.entries(state.offers).map(([id,o])=>offerFromDb(id,o)).filter(o=>o.insurer||o.product);
      if(typeof state!=='undefined'&&Array.isArray(state.offers))return state.offers.map((o,i)=>normOffer(o,o.id||('db-array-'+caseId()+'-'+i))).filter(o=>o.insurer||o.product);
    }catch(e){}
    return [];
  }

  function edited(){
    const all=readMap(EDITED_KEY);
    return (Array.isArray(all[caseId()])?all[caseId()]:[]).map((o,i)=>normOffer(o,o.id||('edited-'+caseId()+'-'+i)));
  }

  function saveEdited(items){
    const all=readMap(EDITED_KEY);
    all[caseId()]=(items||[]).map(o=>normOffer(o,o.id));
    writeMap(EDITED_KEY,all);
  }

  function offers(){
    const map=new Map();
    dbOffers().forEach(o=>map.set(o.id,o));
    edited().forEach(o=>map.set(o.id,normOffer(o,o.id)));
    return Array.from(map.values());
  }

  function warnings(){
    return offers().reduce((s,o)=>s+(!o.premium?1:0)+(!o.limit&&!o.sublimits&&!(o.coverages||[]).length?1:0)+(!o.exclusions?1:0),0);
  }

  function score(){
    const os=offers(); let sc=0;
    if(!emptyName(clientName()))sc+=30;
    if(activity())sc+=15;
    if(os.length>=1)sc+=20;
    if(os.length>=2)sc+=15;
    if(os.some(o=>o.recommended))sc+=20;
    return Math.min(100,sc);
  }

  function missing(){
    const os=offers(), out=[];
    if(emptyName(clientName()))out.push('klient');
    if(!activity())out.push('typ činnosti');
    if(os.length<2)out.push('alespoň 2 nabídky');
    if(!os.some(o=>o.recommended))out.push('doporučená varianta');
    return out;
  }

  function updateIdentity(){
    const c=clientName(), id=caseId(), act=activity(), os=offers(), rec=os.find(o=>o.recommended);
    text('brh1Client',c); text('brh1Meta',[act||'typ činnosti není vyplněn','DB #'+id,os.length+' nabídek'].join(' · '));
    text('brh1Score',score()+'%'); text('brh1Offers',String(os.length)); text('brh1Recommended',rec?'ano':'ne'); text('brh1Missing',String(missing().length));
    text('caseCCClient',c); text('caseCCMeta',[act||'typ činnosti není vyplněn','DB #'+id,'rozpracováno','stav workflow: aktivní'].join(' · '));
    text('caseCCReady',score()+'%'); text('caseCCOffers',String(os.length)); text('caseCCMissing',String(missing().length));
    text('offerProCount',String(os.length)); text('offerProRecommended',rec?rec.insurer:'–'); text('offerProWarnings',String(warnings()));
    const bind=$('offerCaseBindingV74');
    if(bind)bind.innerHTML=`<div class="case-binding-card-v74"><b>Nabídky aktivního obchodního případu:</b><span>${esc(c)} · DB #${esc(id)} · ${os.length} nabídek</span></div>`;
    if(!emptyName(c)){
      document.querySelectorAll('h2,h3,strong,b,td,span,div').forEach(el=>{
        if(el.children.length>0)return;
        if(/není\s+vybrána\s+žádná\s+poptávka/i.test(el.textContent||''))el.textContent=c;
      });
    }
  }

  function riskList(o){
    const covs=(o.coverages&&o.coverages.length)?o.coverages:String(o.limit||o.sublimits||'').split(/\n+/).filter(Boolean).map((line,i)=>{
      const p=line.split(':'); return p.length>1?normCov({risk:p[0],limit:p.slice(1).join(':')},i):normCov({risk:'Riziko k ověření',limit:line},i);
    });
    if(!covs.length)return '<div class="brh101-empty-risk">Rizika nejsou doplněna. Doplňte krytí podle jednotných rizik ASTORIE.</div>';
    return `<div class="brh101-risk-list">${covs.map(c=>`<div class="brh101-risk-row"><b>${esc(c.risk)}</b><span>${esc(c.limit||'bez limitu')}</span><em>${esc(c.state||'nutno ověřit')}</em></div>`).join('')}</div>`;
  }

  function renderComparison(){
    const box=$('offerComparisonMatrixV72'); if(!box)return;
    const os=offers(); if(!os.length){box.innerHTML='<div class="textation-empty">Nejsou vložené nabídky pro porovnání. Přejděte do Nabídky a vložte alespoň jednu nabídku.</div>';return;}
    const risks=[]; os.forEach(o=>(o.coverages||[]).forEach(c=>{if(c.risk&&!risks.includes(c.risk))risks.push(c.risk)}));
    if(!risks.length)risks.push('Provozní odpovědnost','Odpovědnost za výrobek');
    const rec=os.find(o=>o.recommended);
    box.innerHTML=`<div class="unified-analysis-v73 case-analysis-v74 brh101-analysis"><div><p class="eyebrow">Makléřská analytika aktivního případu</p><h3>${rec?'Doporučená varianta: '+esc(rec.insurer):'Doporučená varianta zatím není vybraná'}</h3><p>${rec?'Doporučení se propíše do klientského výstupu.':'V Nabídkách označte jednu variantu jako doporučenou.'}</p></div><div class="analysis-metrics-v73"><div><b>${os.length}</b><span>nabídky</span></div><div><b>${warnings()}</b><span>upozornění</span></div><div><b>${rec?'ano':'ne'}</b><span>doporučení</span></div></div></div><div class="comparison-table-wrap-v72"><table class="comparison-table-v72"><thead><tr><th>Riziko / požadavek</th>${os.map(o=>`<th>${esc(o.insurer)}${o.recommended?' ⭐':''}</th>`).join('')}<th>Makléřská poznámka</th></tr></thead><tbody>${risks.map(r=>`<tr><td><b>${esc(r)}</b></td>${os.map(o=>{const c=(o.coverages||[]).find(x=>x.risk===r);return `<td>${c?`<b>${esc(c.state||'nutno ověřit')}</b><br>${esc(c.limit||'bez limitu')}<br><small>${esc(c.source||'')}</small>`:'—'}</td>`}).join('')}<td>Ověřit rozsah, výluky, sublimity a návaznost na potřeby klienta.</td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderReport(){
    const p=$('clientPresentationPreview'); if(!p)return;
    const os=offers(), c=clientName(), act=activity(), rec=os.find(o=>o.recommended);
    const recText=($('clientRecommendation')?.value||'').trim(), warnText=($('clientWarnings')?.value||'').trim();
    p.innerHTML=`<div class="client-preview-header brh1-client-header"><div><p>ASTORIE a.s. · BUSINESS RISK HUB</p><h2>Poradenské shrnutí k pojištění podnikatelských rizik</h2></div><strong>${score()}% připravenost</strong></div><div class="client-preview-body brh1-client-body"><section><h3>1. Identifikace klienta</h3><table><tr><td>Klient</td><td><b>${esc(c)}</b></td></tr><tr><td>Činnost / typ klienta</td><td>${esc(act||'není doplněno')}</td></tr><tr><td>Počet porovnaných nabídek</td><td>${os.length}</td></tr></table></section><section><h3>2. Přehled nabídek</h3><table><thead><tr><th>Pojišťovna</th><th>Pojistné</th><th>Hlavní rizika / limity</th><th>Hodnocení</th><th>Doporučení</th></tr></thead><tbody>${os.map(o=>`<tr><td>${esc(o.insurer)}</td><td>${esc(o.premium||'—')}</td><td>${(o.coverages||[]).map(c=>`<b>${esc(c.risk)}</b>: ${esc(c.limit||'bez limitu')}`).join('<br>')||esc(o.limit||'—')}</td><td>${esc(o.rating||'k ověření')}</td><td>${o.recommended?'doporučená varianta':'alternativa'}</td></tr>`).join('')}</tbody></table></section><section><h3>3. Doporučená varianta</h3><p>${rec?esc(rec.insurer):'Doporučená varianta zatím není označena.'}</p></section><section><h3>4. Doporučení poradce</h3><p>${recText?esc(recText):'Doplní poradce po projednání s klientem.'}</p></section><section><h3>5. Upozornění pro klienta</h3><p>${warnText?esc(warnText):'Doplnit limity, výluky, sublimity, spoluúčasti a body k ověření.'}</p></section></div>`;
  }

  function patchCards(){
    offers().forEach(o=>{
      Array.from(document.querySelectorAll('h2,h3,strong,b')).filter(el=>(el.textContent||'').trim()===o.insurer).forEach(h=>{
        const card=h.closest('.offer-card-v72,.panel,section,article,div');
        if(!card||card.querySelector('.brh101-risk-list'))return;
        const wrap=document.createElement('div'); wrap.className='brh101-risk-block'; wrap.innerHTML='<h4>Rizika a limity v nabídce</h4>'+riskList(o);
        const before=card.querySelector('details,.offer-card-actions-v72,button');
        if(before&&before.parentNode)before.parentNode.insertBefore(wrap,before); else card.appendChild(wrap);
      });
    });
  }

  function rebuild(){localStorage.setItem(ACTIVE_KEY,caseId());updateIdentity();renderComparison();renderReport();setTimeout(patchCards,50);}

  function saveOffer(){
    const insurer=($('offerInsurerV72')?.value||'').trim();
    if(!insurer){alert('Doplňte pojišťovnu.');$('offerInsurerV72')?.focus();return;}
    const id=$('offerEditIdV72')?.value||('manual-'+caseId()+'-'+Date.now());
    const current=offers(), old=current.find(o=>o.id===id)||{};
    const payload=normOffer({id,insurer,product:($('offerProductV72')?.value||'').trim(),premium:($('offerPremiumV72')?.value||'').trim(),limit:($('offerLimitV72')?.value||'').trim(),deductible:($('offerDeductibleV72')?.value||'').trim(),territory:$('offerTerritoryV72')?.value||'',frequency:$('offerFrequencyV72')?.value||'',rating:$('offerRatingV72')?.value||'k ověření',sublimits:($('offerSublimitsV72')?.value||'').trim(),exclusions:($('offerExclusionsV72')?.value||'').trim(),strengths:($('offerStrengthsV72')?.value||'').trim(),weaknesses:($('offerWeaknessesV72')?.value||'').trim(),note:($('offerNoteV72')?.value||'').trim(),recommended:!!old.recommended,coverages:old.coverages||[]},id);
    const idx=current.findIndex(o=>o.id===id); if(idx>=0)current[idx]=payload; else current.unshift(payload);
    saveEdited(current); if(typeof closeOfferEditorV72==='function')closeOfferEditorV72(); rebuild(); alert('Nabídka byla uložena do aktivního obchodního případu.');
  }

  function recommend(id){saveEdited(offers().map(o=>Object.assign({},o,{recommended:o.id===id})));rebuild();}

  window.BRH101={version:'1.0.1',caseId,clientName,activity,offers,rebuild};
  window.getOffersV72=offers; window.saveOfferV72=saveOffer; window.recommendOfferV72=recommend; window.renderOfferComparisonV72=renderComparison; window.buildClientPresentation=renderReport; window.calculateCaseReadiness=score; window.getMissingParts=missing;
  window.getClientCaseSummaryV71=function(){return{active:{clientName:clientName(),businessType:activity(),clientActivity:activity(),status:'rozpracováno'},offers:offers(),docs:[],readiness:score(),missing:missing()}};

  if(typeof window.showView==='function'&&!window.__BRH101_showViewWrapped){window.__BRH101_showViewWrapped=true;const old=window.showView;window.showView=function(id){old(id);setTimeout(rebuild,150);setTimeout(rebuild,650);};}
  if(typeof window.applyState==='function'&&!window.__BRH101_applyStateWrapped){window.__BRH101_applyStateWrapped=true;const old=window.applyState;window.applyState=function(s){old(s);setTimeout(rebuild,150);setTimeout(rebuild,650);};}
  setTimeout(rebuild,200); setTimeout(rebuild,900); setTimeout(rebuild,1800);
})();



// ============================================================
// ASTORIE Business Risk Hub 1.0.2 - No Auto Recommendation + Limit Dedup Fix
// ============================================================
(function(){
  const ACTIVE_KEY='brh102_active_case_id';
  const EDITED_KEY='brh1_edited_offers_by_case';
  const MANUAL_REC_KEY='brh102_manual_recommendation_by_case';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const parse=(raw,fb)=>{try{return raw?JSON.parse(raw):fb}catch(e){return fb}};
  const readMap=k=>parse(localStorage.getItem(k),{});
  const writeMap=(k,o)=>localStorage.setItem(k,JSON.stringify(o||{}));
  const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const text=(id,v)=>{const el=$(id); if(el) el.textContent=v};

  function emptyName(v){return !String(v||'').trim()||/není\s+vybrána\s+žádná\s+poptávka/i.test(String(v||''));}
  function cleanName(v){return String(v||'').replace(/^#\d+\s*[–-]\s*/,'').replace(/^DB\s*#?\d+\s*[–-]?\s*/i,'').trim();}
  function bannerText(){
    for(const s of ['#activeInquiryBanner','.active-inquiry-banner','.active-case-banner','[data-active-inquiry]','[data-active-case]']){
      const el=document.querySelector(s); if(el&&el.innerText&&el.innerText.trim()) return el.innerText.trim();
    }
    const nodes=Array.from(document.querySelectorAll('section,.panel,.card,div')).filter(el=>{
      const t=el.innerText||''; return /DB\s*#?\d+|Aktivní poptávka|obchodní případ/i.test(t)&&t.length<1400;
    });
    return nodes[0]?.innerText?.trim()||'';
  }
  function caseId(){
    try{
      if(typeof state!=='undefined'){
        if(state.activeInquiry&&(state.activeInquiry.id||state.activeInquiry.dbId)) return String(state.activeInquiry.id||state.activeInquiry.dbId);
        if(state.form&&(state.form.id||state.form.dbId)) return String(state.form.id||state.form.dbId);
        if(state.id) return String(state.id);
      }
    }catch(e){}
    const b=bannerText(), m=b.match(/DB\s*#?(\d+)/i)||b.match(/#(\d+)\s*[–-]/);
    if(m){localStorage.setItem(ACTIVE_KEY,String(m[1])); return String(m[1]);}
    return localStorage.getItem(ACTIVE_KEY)||'local';
  }
  function clientName(){
    const c=[];
    try{
      if(typeof state!=='undefined'){
        if(state.activeInquiry&&state.activeInquiry.clientName)c.push(state.activeInquiry.clientName);
        if(state.form&&state.form.clientName)c.push(state.form.clientName);
        if(state.form&&state.form.companyName)c.push(state.form.companyName);
        if(state.clientName)c.push(state.clientName);
      }
    }catch(e){}
    bannerText().split(/\n+/).forEach(line=>{
      const m=line.match(/#\d+\s*[–-]\s*(.+)$/); if(m)c.unshift(m[1]);
      if(/\b(a\.s\.|s\.r\.o\.|spol\.|consulting|insurance|ASTORIE)\b/i.test(line)&&!/stav|nabíd|menu|aktivní/i.test(line))c.push(line);
    });
    const cc=$('caseCCClient'); if(cc&&!emptyName(cc.textContent))c.push(cc.textContent);
    return c.map(cleanName).find(n=>!emptyName(n))||'Není vybrána žádná poptávka';
  }
  function activity(){
    try{
      if(typeof state!=='undefined'){
        if(state.activeInquiry&&(state.activeInquiry.businessType||state.activeInquiry.clientActivity))return state.activeInquiry.businessType||state.activeInquiry.clientActivity;
        if(state.form&&(state.form.businessType||state.form.clientActivity))return state.form.businessType||state.form.clientActivity;
      }
    }catch(e){}
    const m=bannerText().match(/·\s*([^·\n]+)\s*·\s*Nabídky/i); return m?m[1].trim():'';
  }
  function insurerName(id){
    try{
      const list=(typeof CATALOG!=='undefined'&&CATALOG&&Array.isArray(CATALOG.insurers))?CATALOG.insurers:[];
      const f=list.find(i=>String(i.id)===String(id)||String(i.code||'')===String(id)||String(i.short||'')===String(id));
      if(f)return (f.short?f.short+' – ':'')+f.name;
    }catch(e){}
    return String(id||'').toUpperCase();
  }

  function unique(parts){
    const seen=new Set(), out=[];
    (parts||[]).forEach(p=>{
      p=String(p||'').trim();
      if(!p||p==='—'||p==='-')return;
      const key=p.toLowerCase().replace(/\s+/g,' ').replace(/[;,.]+$/,'');
      if(!seen.has(key)){seen.add(key);out.push(p);}
    });
    return out;
  }
  function normLimit(v){return unique(String(v||'').split(/\n|;|\|/)).join('\n');}
  function pureLimit(v){return /^[\d\s.,]+(?:Kč|CZK)?(?:\s*,\s*[\d\s.,]+(?:Kč|CZK)?)*$/i.test(String(v||'').trim());}
  function riskName(v,i){
    v=String(v||'').trim();
    if(v&&!pureLimit(v)&&!/^limit$/i.test(v)&&!/riziko k ověření/i.test(v))return v;
    return ['Provozní odpovědnost','Odpovědnost za výrobek','Škody způsobené zaměstnanci','Čistá finanční škoda','Škody na převzatých věcech','Věci užívané'][i%6];
  }
  function normCov(c,i){
    c=c||{};
    return {risk:riskName(c.risk||c.riskName||c.name||c.title||c.original||c.label||c.requirement,i),limit:normLimit(c.limit||c.value||c.amount||c.coverageLimit||''),state:c.state||c.status||c.result||'nutno ověřit',source:c.source||c.vpp||c.article||c.reference||'doplnit VPP/DPP, článek/odstavec',note:c.note||c.comment||c.poznamka||''};
  }
  function mergeCovs(covs){
    const map=new Map();
    (covs||[]).forEach((c,i)=>{
      c=normCov(c,i); const key=c.risk.toLowerCase();
      if(!map.has(key))map.set(key,c);
      else{
        const o=map.get(key);
        o.limit=unique([o.limit,c.limit]).join('\n');
        o.source=unique([o.source,c.source]).join('\n');
        o.note=unique([o.note,c.note]).join('\n');
      }
    });
    return Array.from(map.values());
  }
  function covsFromDb(o){
    if(!o)return[];
    if(Array.isArray(o.coverages))return mergeCovs(o.coverages);
    if(isObj(o.coverages))return mergeCovs(Object.entries(o.coverages).map(([k,v])=>Object.assign({risk:k},v||{})));
    if(Array.isArray(o.risks))return mergeCovs(o.risks);
    return [];
  }
  function manualRecId(){return readMap(MANUAL_REC_KEY)[caseId()]||'';}
  function setManualRec(id){const all=readMap(MANUAL_REC_KEY); all[caseId()]=id||''; writeMap(MANUAL_REC_KEY,all);}

  function normOffer(o,id){
    o=o||{};
    const covs=mergeCovs(Array.isArray(o.coverages)?o.coverages:[]);
    const plain=normLimit(o.limit||o.mainLimit||o.coverageLimit||'');
    const fromCov=covs.map(c=>c.limit).filter(Boolean);
    const finalLimit=unique([plain,...fromCov]).join('\n');
    const subs=normLimit(o.sublimits||o.subLimits||'');
    return {
      id:o.id||id||('offer-'+Date.now()),
      insurer:o.insurer||o.company||o.pojistovna||o.insuranceCompany||o.name||'',
      product:o.product||o.produkt||o.product_name||'nabídka pojišťovny',
      premium:o.premium||o.price||o.pojistne||o.annualPremium||'',
      limit:finalLimit,
      deductible:o.deductible||o.spoluucast||'',
      territory:o.territory||o.uzemi||'',
      frequency:o.frequency||o.frekvence||'',
      rating:o.rating||o.verdict||o.status||'k ověření',
      sublimits:subs&&subs!==finalLimit?subs:'',
      exclusions:o.exclusions||o.vyluky||'',
      strengths:o.strengths||'',
      weaknesses:o.weaknesses||'',
      note:o.note||o.poznamka||'',
      recommended:false,
      coverages:covs,
      updatedAt:o.updatedAt||new Date().toISOString()
    };
  }
  function offerFromDb(id,o){
    const covs=covsFromDb(o);
    return normOffer({id:'db-'+caseId()+'-'+id,insurer:insurerName(id),product:o?.product||o?.product_name||'nabídka pojišťovny',premium:o?.premium||'',limit:covs.map(c=>c.limit).filter(Boolean).join('\n'),deductible:o?.deductible||'',territory:o?.territory||'',frequency:o?.frequency||'',rating:o?.status||'doručeno',exclusions:o?.exclusions||o?.vyluky||'',note:o?.note||'',coverages:covs},'db-'+caseId()+'-'+id);
  }
  function dbOffers(){
    try{
      if(typeof state!=='undefined'&&isObj(state.offers))return Object.entries(state.offers).map(([id,o])=>offerFromDb(id,o)).filter(o=>o.insurer||o.product);
      if(typeof state!=='undefined'&&Array.isArray(state.offers))return state.offers.map((o,i)=>normOffer(o,o.id||('db-array-'+caseId()+'-'+i))).filter(o=>o.insurer||o.product);
    }catch(e){}
    return [];
  }
  function edited(){
    const all=readMap(EDITED_KEY);
    return (Array.isArray(all[caseId()])?all[caseId()]:[]).map((o,i)=>normOffer(o,o.id||('edited-'+caseId()+'-'+i)));
  }
  function saveEdited(items){
    const all=readMap(EDITED_KEY);
    all[caseId()]=(items||[]).map(o=>{const n=normOffer(o,o.id); n.recommended=(n.id===manualRecId()); return n;});
    writeMap(EDITED_KEY,all);
  }
  function offers(){
    const map=new Map();
    dbOffers().forEach(o=>map.set(o.id,o));
    edited().forEach(o=>map.set(o.id,o));
    const rec=manualRecId();
    return Array.from(map.values()).map(o=>Object.assign({},o,{recommended:!!rec&&o.id===rec}));
  }
  function recOffer(){const id=manualRecId(); return id?offers().find(o=>o.id===id)||null:null;}
  function coverageRows(o){
    let covs=(o.coverages||[]).filter(c=>c.risk||c.limit);
    if(!covs.length&&o.limit){covs=normLimit(o.limit).split(/\n+/).filter(Boolean).map((limit,i)=>({risk:riskName('',i),limit,state:'nutno ověřit',source:'doplnit VPP/DPP, článek/odstavec'}));}
    return mergeCovs(covs);
  }
  function warnings(){return offers().reduce((s,o)=>s+(!o.premium?1:0)+(!o.limit&&!(o.coverages||[]).length?1:0)+(!o.exclusions?1:0),0);}
  function score(){const os=offers();let sc=0;if(!emptyName(clientName()))sc+=30;if(activity())sc+=15;if(os.length>=1)sc+=20;if(os.length>=2)sc+=15;if(recOffer())sc+=20;return Math.min(100,sc);}
  function missing(){const os=offers(),out=[];if(emptyName(clientName()))out.push('klient');if(!activity())out.push('typ činnosti');if(os.length<2)out.push('alespoň 2 nabídky');if(!recOffer())out.push('doporučená varianta');return out;}

  function updateIdentity(){
    const c=clientName(), id=caseId(), act=activity(), os=offers(), rec=recOffer();
    text('brh1Client',c); text('brh1Meta',[act||'typ činnosti není vyplněn','DB #'+id,os.length+' nabídek'].join(' · '));
    text('brh1Score',score()+'%'); text('brh1Offers',String(os.length)); text('brh1Recommended',rec?'ano':'ne'); text('brh1Missing',String(missing().length));
    text('caseCCClient',c); text('caseCCMeta',[act||'typ činnosti není vyplněn','DB #'+id,'rozpracováno','stav workflow: aktivní'].join(' · '));
    text('caseCCReady',score()+'%'); text('caseCCOffers',String(os.length)); text('caseCCMissing',String(missing().length));
    text('offerProCount',String(os.length)); text('offerProRecommended',rec?rec.insurer:'–'); text('offerProWarnings',String(warnings()));
    const bind=$('offerCaseBindingV74'); if(bind)bind.innerHTML=`<div class="case-binding-card-v74"><b>Nabídky aktivního obchodního případu:</b><span>${esc(c)} · DB #${esc(id)} · ${os.length} nabídek</span></div>`;
  }
  function renderComparison(){
    const box=$('offerComparisonMatrixV72'); if(!box)return;
    const os=offers(); if(!os.length){box.innerHTML='<div class="textation-empty">Nejsou vložené nabídky pro porovnání.</div>';return;}
    const risks=[]; os.forEach(o=>coverageRows(o).forEach(c=>{if(c.risk&&!risks.includes(c.risk))risks.push(c.risk)}));
    if(!risks.length)risks.push('Provozní odpovědnost','Odpovědnost za výrobek');
    const rec=recOffer();
    box.innerHTML=`<div class="unified-analysis-v73 case-analysis-v74 brh102-analysis"><div><p class="eyebrow">Makléřská analytika aktivního případu</p><h3>${rec?'Doporučená varianta: '+esc(rec.insurer):'Doporučená varianta zatím není vybraná'}</h3><p>${rec?'Doporučení bylo označeno poradcem.':'Aplikace nic nedoporučuje automaticky. Doporučení musí ručně potvrdit poradce.'}</p></div><div class="analysis-metrics-v73"><div><b>${os.length}</b><span>nabídky</span></div><div><b>${warnings()}</b><span>upozornění</span></div><div><b>${rec?'ano':'ne'}</b><span>doporučení</span></div></div></div><div class="comparison-table-wrap-v72"><table class="comparison-table-v72"><thead><tr><th>Riziko / požadavek</th>${os.map(o=>`<th>${esc(o.insurer)}${o.recommended?' ⭐':''}</th>`).join('')}<th>Makléřská poznámka</th></tr></thead><tbody>${risks.map(r=>`<tr><td><b>${esc(r)}</b></td>${os.map(o=>{const c=coverageRows(o).find(x=>x.risk===r);return `<td>${c?`<b>${esc(c.state||'nutno ověřit')}</b><br>${esc(c.limit||'bez limitu')}<br><small>${esc(c.source||'')}</small>`:'—'}</td>`}).join('')}<td>Ověřit rozsah, výluky, sublimity a návaznost na potřeby klienta.</td></tr>`).join('')}</tbody></table></div>`;
  }
  function renderReport(){
    const p=$('clientPresentationPreview'); if(!p)return;
    const os=offers(), c=clientName(), act=activity(), rec=recOffer();
    const recText=($('clientRecommendation')?.value||'').trim(), warnText=($('clientWarnings')?.value||'').trim();
    p.innerHTML=`<div class="client-preview-header brh1-client-header"><div><p>ASTORIE a.s. · BUSINESS RISK HUB</p><h2>Poradenské shrnutí k pojištění podnikatelských rizik</h2></div><strong>${score()}% připravenost</strong></div><div class="client-preview-body brh1-client-body"><section><h3>1. Identifikace klienta</h3><table><tr><td>Klient</td><td><b>${esc(c)}</b></td></tr><tr><td>Činnost / typ klienta</td><td>${esc(act||'není doplněno')}</td></tr><tr><td>Počet porovnaných nabídek</td><td>${os.length}</td></tr></table></section><section><h3>2. Přehled nabídek</h3><table><thead><tr><th>Pojišťovna</th><th>Pojistné</th><th>Rizika / limity</th><th>Hodnocení</th><th>Doporučení</th></tr></thead><tbody>${os.map(o=>`<tr><td>${esc(o.insurer)}</td><td>${esc(o.premium||'—')}</td><td>${coverageRows(o).map(c=>`<b>${esc(c.risk)}</b>: ${esc(c.limit||'bez limitu')}`).join('<br>')||'—'}</td><td>${esc(o.rating||'k ověření')}</td><td>${o.recommended?'doporučená varianta poradce':'alternativa'}</td></tr>`).join('')}</tbody></table></section><section><h3>3. Doporučená varianta</h3><p>${rec?esc(rec.insurer):'Doporučená varianta zatím nebyla poradcem označena.'}</p></section><section><h3>4. Doporučení poradce</h3><p>${recText?esc(recText):'Doplní poradce po projednání s klientem.'}</p></section><section><h3>5. Upozornění pro klienta</h3><p>${warnText?esc(warnText):'Doplnit limity, výluky, sublimity, spoluúčasti a body k ověření.'}</p></section></div>`;
  }
  function riskList(o){
    const covs=coverageRows(o);
    if(!covs.length)return '<div class="brh102-empty-risk">Rizika nejsou doplněna.</div>';
    return `<div class="brh102-risk-list">${covs.map(c=>`<div class="brh102-risk-row"><b>${esc(c.risk)}</b><span>${esc(c.limit||'bez limitu')}</span><em>${esc(c.state||'nutno ověřit')}</em></div>`).join('')}</div>`;
  }
  function patchCards(){
    document.querySelectorAll('.brh101-risk-block,.brh101-risk-list,.brh102-risk-block').forEach(el=>el.remove());
    offers().forEach(o=>{
      Array.from(document.querySelectorAll('h2,h3,strong,b')).filter(el=>(el.textContent||'').trim()===o.insurer).forEach(h=>{
        const card=h.closest('.offer-card-v72,.panel,section,article,div');
        if(!card||card.classList.contains('stat-card')||card.querySelector('.brh102-risk-block'))return;
        const wrap=document.createElement('div');wrap.className='brh102-risk-block';wrap.innerHTML='<h4>Rizika a limity v nabídce</h4>'+riskList(o);
        const before=card.querySelector('.offer-card-actions-v72,details,textarea,.offer-fields-v72');
        if(before&&before.parentNode)before.parentNode.insertBefore(wrap,before);else card.appendChild(wrap);
      });
    });
  }
  function rebuild(){localStorage.setItem(ACTIVE_KEY,caseId());updateIdentity();renderComparison();renderReport();setTimeout(patchCards,80);}
  function recommend(id){setManualRec(id);saveEdited(offers().map(o=>Object.assign({},o,{recommended:o.id===id})));rebuild();}
  function clearRecommendation(){setManualRec('');saveEdited(offers().map(o=>Object.assign({},o,{recommended:false})));rebuild();}
  function saveOffer(){
    const insurer=($('offerInsurerV72')?.value||'').trim(); if(!insurer){alert('Doplňte pojišťovnu.');return;}
    const id=$('offerEditIdV72')?.value||('manual-'+caseId()+'-'+Date.now());
    const current=offers(), old=current.find(o=>o.id===id)||{};
    const payload=normOffer({id,insurer,product:($('offerProductV72')?.value||'').trim(),premium:($('offerPremiumV72')?.value||'').trim(),limit:($('offerLimitV72')?.value||'').trim(),deductible:($('offerDeductibleV72')?.value||'').trim(),territory:$('offerTerritoryV72')?.value||'',frequency:$('offerFrequencyV72')?.value||'',rating:$('offerRatingV72')?.value||'k ověření',sublimits:($('offerSublimitsV72')?.value||'').trim(),exclusions:($('offerExclusionsV72')?.value||'').trim(),strengths:($('offerStrengthsV72')?.value||'').trim(),weaknesses:($('offerWeaknessesV72')?.value||'').trim(),note:($('offerNoteV72')?.value||'').trim(),coverages:old.coverages||[]},id);
    const idx=current.findIndex(o=>o.id===id); if(idx>=0)current[idx]=payload; else current.unshift(payload);
    saveEdited(current); if(typeof closeOfferEditorV72==='function')closeOfferEditorV72(); rebuild(); alert('Nabídka byla uložena do aktivního obchodního případu.');
  }

  window.BRH102={version:'1.0.2',caseId,clientName,activity,offers,recommendedOffer:recOffer,rebuild,clearRecommendation};
  window.getOffersV72=offers; window.saveOfferV72=saveOffer; window.recommendOfferV72=recommend; window.renderOfferComparisonV72=renderComparison; window.buildClientPresentation=renderReport; window.calculateCaseReadiness=score; window.getMissingParts=missing;
  window.getClientCaseSummaryV71=function(){return{active:{clientName:clientName(),businessType:activity(),clientActivity:activity(),status:'rozpracováno'},offers:offers(),docs:[],readiness:score(),missing:missing()}};
  if(typeof window.showView==='function'&&!window.__BRH102_showViewWrapped){window.__BRH102_showViewWrapped=true;const old=window.showView;window.showView=function(id){old(id);setTimeout(rebuild,150);setTimeout(rebuild,700);};}
  if(typeof window.applyState==='function'&&!window.__BRH102_applyStateWrapped){window.__BRH102_applyStateWrapped=true;const old=window.applyState;window.applyState=function(s){old(s);setTimeout(rebuild,150);setTimeout(rebuild,700);};}
  setTimeout(rebuild,200);setTimeout(rebuild,900);setTimeout(rebuild,1800);
})();



// ============================================================
// ASTORIE Business Risk Hub 2.0.0 - Core Data Foundation
// Runtime bridge: zachovává UI, zavádí nové jádro.
// ============================================================
(function(){
  const VERSION='2.0.0-core-data-foundation',NS='brh2';
  const parse=(r,f)=>{try{return r?JSON.parse(r):f}catch(e){return f}}, save=(k,v)=>localStorage.setItem(NS+':'+k,JSON.stringify(v)), load=(k,f)=>parse(localStorage.getItem(NS+':'+k),f), now=()=>new Date().toISOString();
  const RISKS=[['LIABILITY_OPERATION','Provozní odpovědnost'],['LIABILITY_PRODUCT','Odpovědnost za výrobek'],['FINANCIAL_LOSS','Čistá finanční škoda'],['EMPLOYEE_DAMAGE','Škody způsobené zaměstnanci'],['TAKEN_ITEMS','Věci převzaté / užívané'],['PROPERTY','Majetek'],['MACHINERY','Stroje'],['ELECTRONICS','Elektronika'],['BUSINESS_INTERRUPTION','Přerušení provozu'],['CYBER','Kybernetická rizika']];
  const riskName=k=>(RISKS.find(r=>r[0]===k)||[k,k])[1];
  function normRisk(n){n=String(n||'').toLowerCase(); if(n.includes('provoz'))return'LIABILITY_OPERATION'; if(n.includes('výrob')||n.includes('vadn'))return'LIABILITY_PRODUCT'; if(n.includes('finan'))return'FINANCIAL_LOSS'; if(n.includes('zaměst'))return'EMPLOYEE_DAMAGE'; if(n.includes('převzat')||n.includes('užívan'))return'TAKEN_ITEMS'; if(n.includes('majet'))return'PROPERTY'; if(n.includes('stroj'))return'MACHINERY'; if(n.includes('elektr'))return'ELECTRONICS'; if(n.includes('přeruš'))return'BUSINESS_INTERRUPTION'; if(n.includes('kyber'))return'CYBER'; return'';}
  function caseId(){try{if(typeof state!=='undefined'){if(state.activeInquiry&&(state.activeInquiry.id||state.activeInquiry.dbId))return String(state.activeInquiry.id||state.activeInquiry.dbId); if(state.form&&(state.form.id||state.form.dbId))return String(state.form.id||state.form.dbId);}}catch(e){} const m=(document.body.innerText||'').match(/DB\s*#?(\d+)/i); return m?m[1]:(localStorage.getItem('brh2:last_case_id')||'local');}
  function getCoreCase(){const id=caseId(); localStorage.setItem('brh2:last_case_id',id); const cases=load('cases',{}); if(!cases[id]){cases[id]={id,source:'legacy-runtime',client:{},risk_model_id:'BUSINESS_RISKS',workflow_step:'rozpracováno',request:{risks:[]},case_insurers:[],offers:[],documents:[],text_usages:[],recommendation:{advisor_recommended_offer_id:null,advisor_comment:'',client_warning:''},created_at:now(),updated_at:now()}; save('cases',cases);} return cases[id];}
  function saveCoreCase(c){const cases=load('cases',{}); c.updated_at=now(); cases[c.id]=c; save('cases',cases);}
  function audit(type,id,action,oldValue,newValue){const log=load('audit_log',[]); log.unshift({type,id,action,oldValue,newValue,created_at:now()}); save('audit_log',log.slice(0,500));}
  function normalizeOffer(o){o=o||{}; const c=getCoreCase(); const arr=Array.isArray(o.coverages)?o.coverages:[]; let offer_risks=arr.map((x,i)=>{const key=x.risk_key||x.riskKey||normRisk(x.risk||x.name||x.title); return key?{id:x.id||`${o.id||'offer'}-risk-${i}`,risk_key:key,risk_name:riskName(key),requested_limit:x.requested_limit||'',offered_limit:x.offered_limit||x.limit||'',coverage_status:x.coverage_status||x.status||'nutno_ověřit',exclusions:x.exclusions||'',sublimits:x.sublimits||'',source_reference:x.source_reference||x.source||'',advisor_note:x.advisor_note||x.note||''}:null}).filter(Boolean);
    if(!offer_risks.length&&o.limit){const first=(c.request.risks||[])[0]||{risk_key:'LIABILITY_OPERATION'}; offer_risks.push({id:`${o.id||'offer'}-risk-default`,risk_key:first.risk_key,risk_name:riskName(first.risk_key),requested_limit:first.requested_limit||'',offered_limit:o.limit,coverage_status:'nutno_ověřit',source_reference:'',advisor_note:''});}
    return {id:o.id||('offer-'+Date.now()),case_id:c.id,insurer_id:o.insurer_id||'',insurer_name:o.insurer_name||o.insurer||o.company||'',product_name:o.product_name||o.product||'nabídka pojišťovny',status:o.status||o.rating||'čekáme_na_nabídku',annual_premium:o.annual_premium||o.premium||'',deductible:o.deductible||'',valid_until:o.valid_until||o.validUntil||'',advisor_summary:o.advisor_summary||o.note||'',ai_summary:o.ai_summary||'',is_advisor_recommended:false,offer_risks,created_at:o.created_at||now(),updated_at:now()};}
  function upsertOffer(o){const c=getCoreCase(),n=normalizeOffer(o),before=JSON.parse(JSON.stringify(c.offers||[])); c.offers=c.offers||[]; const i=c.offers.findIndex(x=>x.id===n.id); if(i>=0)c.offers[i]=Object.assign({},c.offers[i],n); else c.offers.push(n); const rec=c.recommendation&&c.recommendation.advisor_recommended_offer_id; c.offers=c.offers.map(x=>Object.assign({},x,{is_advisor_recommended:x.id===rec})); saveCoreCase(c); audit('offer',n.id,i>=0?'offer_updated':'offer_created',before,c.offers); return n;}
  function setAdvisorRecommendation(id){const c=getCoreCase(),before=JSON.parse(JSON.stringify(c.recommendation||{})); c.recommendation=c.recommendation||{}; c.recommendation.advisor_recommended_offer_id=id||null; c.offers=(c.offers||[]).map(o=>Object.assign({},o,{is_advisor_recommended:o.id===id})); saveCoreCase(c); audit('case',c.id,'advisor_recommendation_changed',before,c.recommendation);}
  function validateCase(){const c=getCoreCase(),errors=[]; if(!c.id)errors.push('Chybí CASE_ID.'); if(!c.risk_model_id)errors.push('Chybí risk model.'); (c.offers||[]).forEach(o=>(o.offer_risks||[]).forEach(r=>{if(!r.risk_key)errors.push('Krytí bez risk_key.')})); return{ok:!errors.length,errors,case_id:c.id,version:VERSION};}
  function createTextTemplate(t){const list=load('text_templates',[]),item=Object.assign({id:'txt-'+Date.now(),scope:'private',status:'draft',category:'',tag:'',title:'',body:'',risk_key:'',insurer_id:'',created_at:now(),updated_at:now()},t||{}); list.unshift(item); save('text_templates',list); audit('text_template',item.id,'created',null,item); return item;}
  function addDocument(d){const c=getCoreCase(),item=Object.assign({id:'doc-'+Date.now(),case_id:c.id,scope:'case',category:'',title:'',filename:'',file_url:'',document_type:'',insurer_id:'',risk_key:'',version:'',created_at:now(),archived_at:null},d||{}); c.documents.unshift(item); saveCoreCase(c); audit('document',item.id,'created',null,item); return item;}
  function badge(){document.querySelectorAll('header,.topbar,.app-header,*').forEach(x=>{if((x.textContent||'').match(/Business Risk Hub 1\.0\.2|MVP\s*0\./)&&x.textContent.length<160)x.textContent='Business Risk Hub 2.0.0 · Core Data Foundation';});}
  window.BRH2={version:VERSION,riskModels:{BUSINESS_RISKS:{id:'BUSINESS_RISKS',name:'Podnikatelská rizika',risks:RISKS.map(r=>({key:r[0],name:r[1]}))}},getCoreCase,saveCoreCase,validateCase,normalizeOffer,upsertOffer,setAdvisorRecommendation,createTextTemplate,addDocument,audit};
  if(typeof window.recommendOfferV72==='function'&&!window.__BRH2_rec){window.__BRH2_rec=true;const old=window.recommendOfferV72;window.recommendOfferV72=function(id){setAdvisorRecommendation(id);return old.apply(this,arguments)}}
  if(typeof window.saveOfferV72==='function'&&!window.__BRH2_save){window.__BRH2_save=true;const old=window.saveOfferV72;window.saveOfferV72=function(){const r=old.apply(this,arguments);setTimeout(()=>{try{if(typeof window.getOffersV72==='function')(window.getOffersV72()||[]).forEach(upsertOffer)}catch(e){}},250);return r}}
  setTimeout(()=>{badge();getCoreCase();validateCase()},250); setTimeout(badge,1200);
})();



// ============================================================
// ASTORIE Business Risk Hub 2.1.0 - Workflow Engine FULL
// Navazuje na Core Data Foundation 2.0.0 a neničí Admin, textace ani dokumenty.
// ============================================================
(function(){
  const VERSION = '2.1.0-workflow-engine-full';
  const NS = 'brh210';
  const $ = id => document.getElementById(id);
  const parse = (raw, fb) => { try { return raw ? JSON.parse(raw) : fb; } catch(e){ return fb; } };
  const load = (key, fb) => parse(localStorage.getItem(NS + ':' + key), fb);
  const save = (key, val) => localStorage.setItem(NS + ':' + key, JSON.stringify(val));
  const text = (id, value) => { const el = $(id); if(el) el.textContent = value; };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const WORKFLOW = [
    { key:'new_case', label:'Nový případ', view:'dashboardView' },
    { key:'collecting_data', label:'Sběr podkladů', view:'documentsView' },
    { key:'insurers_selected', label:'Výběr pojišťoven', view:'adminView' },
    { key:'request_ready', label:'Poptávka připravena', view:'inquiryView' },
    { key:'request_sent', label:'Poptávka odeslána', view:'inquiryView' },
    { key:'waiting_offers', label:'Čekáme na nabídky', view:'offersView' },
    { key:'offers_received', label:'Nabídky přijaty', view:'offersView' },
    { key:'comparison_ready', label:'Porovnání', view:'comparisonView' },
    { key:'advisor_recommendation', label:'Doporučení poradce', view:'comparisonView' },
    { key:'client_output', label:'Klientský výstup', view:'reportView' },
    { key:'closed', label:'Uzavřeno', view:'dashboardView' },
    { key:'archived', label:'Archiv', view:'dashboardView' }
  ];

  function caseId(){
    try{
      if(window.BRH2 && BRH2.getCoreCase) return String(BRH2.getCoreCase().id || 'local');
      if(window.BRH102 && BRH102.caseId) return String(BRH102.caseId());
      if(typeof state !== 'undefined'){
        if(state.activeInquiry && (state.activeInquiry.id || state.activeInquiry.dbId)) return String(state.activeInquiry.id || state.activeInquiry.dbId);
        if(state.id) return String(state.id);
      }
    }catch(e){}
    const body = document.body ? document.body.innerText || '' : '';
    const m = body.match(/DB\s*#?(\d+)/i) || body.match(/#(\d+)\s*[–-]/);
    return m ? String(m[1]) : 'local';
  }

  function getWorkflowMap(){
    return load('workflow_by_case', {});
  }

  function setWorkflowMap(map){
    save('workflow_by_case', map || {});
  }

  function getState(){
    const id = caseId();
    const map = getWorkflowMap();
    if(!map[id]){
      map[id] = {
        case_id: id,
        step: 'new_case',
        insurers: [],
        request_log: [],
        updated_at: new Date().toISOString()
      };
      setWorkflowMap(map);
    }
    return map[id];
  }

  function saveState(st){
    const map = getWorkflowMap();
    st.updated_at = new Date().toISOString();
    map[st.case_id || caseId()] = st;
    setWorkflowMap(map);
    audit('workflow_updated', st);
  }

  function audit(action, payload){
    const log = load('audit', []);
    log.unshift({ action, payload, created_at: new Date().toISOString() });
    save('audit', log.slice(0, 500));
    if(window.BRH2 && BRH2.audit){
      try { BRH2.audit('workflow', caseId(), action, null, payload); } catch(e) {}
    }
  }

  function currentStepIndex(){
    const st = getState();
    return Math.max(0, WORKFLOW.findIndex(x => x.key === st.step));
  }

  function setStep(step){
    const st = getState();
    if(!WORKFLOW.find(x => x.key === step)) return;
    const old = st.step;
    st.step = step;
    saveState(st);
    render();
    audit('workflow_step_changed', { old, step });
  }

  function nextStep(){
    const idx = currentStepIndex();
    const next = WORKFLOW[Math.min(WORKFLOW.length - 1, idx + 1)];
    setStep(next.key);
    if(window.showView && next.view) showView(next.view);
  }

  function previousStep(){
    const idx = currentStepIndex();
    const prev = WORKFLOW[Math.max(0, idx - 1)];
    setStep(prev.key);
    if(window.showView && prev.view) showView(prev.view);
  }

  function addCaseInsurer(insurer){
    const st = getState();
    insurer = Object.assign({
      id: 'ci-' + Date.now(),
      insurer_id: '',
      insurer_name: '',
      email: '',
      status: 'neodesláno',
      sent_at: null,
      answered_at: null,
      note: ''
    }, insurer || {});
    st.insurers = st.insurers || [];
    st.insurers.push(insurer);
    saveState(st);
    render();
    return insurer;
  }

  function markRequestSent(caseInsurerId, emailSubject, emailBody){
    const st = getState();
    st.insurers = st.insurers || [];
    const item = st.insurers.find(x => x.id === caseInsurerId);
    if(item){
      item.status = 'odesláno';
      item.sent_at = new Date().toISOString();
      item.request_email_subject = emailSubject || '';
      item.request_email_body = emailBody || '';
      st.request_log = st.request_log || [];
      st.request_log.unshift({
        case_insurer_id: caseInsurerId,
        action: 'sent',
        subject: emailSubject || '',
        body: emailBody || '',
        created_at: new Date().toISOString()
      });
      if(st.step === 'request_ready' || st.step === 'insurers_selected') st.step = 'request_sent';
      saveState(st);
      render();
    }
  }

  function generateRequestEmail(insurer){
    const client = getClientName();
    const activity = getActivity();
    const subject = `Poptávka pojištění podnikatelských rizik – ${client}`;
    const body = [
      'Dobrý den,',
      '',
      'obracíme se na Vás s poptávkou pojištění podnikatelských rizik pro klienta:',
      '',
      `Klient: ${client}`,
      `Činnost: ${activity || 'bude doplněno v podkladech'}`,
      '',
      'Prosíme o zpracování nabídky dle přiložených podkladů a požadovaných rizik.',
      '',
      'Děkujeme.',
      '',
      'ASTORIE a.s.'
    ].join('\n');
    return { to: insurer.email || '', subject, body };
  }

  function getClientName(){
    try{
      if(window.BRH2 && BRH2.getCoreCase){
        const c = BRH2.getCoreCase();
        if(c.client && c.client.name) return c.client.name;
      }
      if(window.BRH102 && BRH102.clientName) return BRH102.clientName();
      const cc = $('caseCCClient');
      if(cc && cc.textContent.trim()) return cc.textContent.trim();
    }catch(e){}
    return 'Není vybrána žádná poptávka';
  }

  function getActivity(){
    try{
      if(window.BRH102 && BRH102.activity) return BRH102.activity();
      const meta = $('caseCCMeta');
      if(meta && meta.textContent) return meta.textContent.split('·')[0].trim();
    }catch(e){}
    return '';
  }

  function getOfferCount(){
    try{
      if(window.getOffersV72) return (window.getOffersV72() || []).length;
      if(window.BRH2 && BRH2.listOffers) return (BRH2.listOffers() || []).length;
    }catch(e){}
    return 0;
  }

  function getRecommended(){
    try{
      if(window.BRH2 && BRH2.getAdvisorRecommendation) return !!BRH2.getAdvisorRecommendation();
      if(window.BRH102 && BRH102.recommendedOffer) return !!BRH102.recommendedOffer();
      const offers = window.getOffersV72 ? window.getOffersV72() : [];
      return offers.some(o => o.recommended || o.is_advisor_recommended);
    }catch(e){}
    return false;
  }

  function suggestedStep(){
    const st = getState();
    const offers = getOfferCount();
    const hasRec = getRecommended();
    if(!getClientName() || /není vybrána/i.test(getClientName())) return 'new_case';
    if(!st.insurers || !st.insurers.length) return 'insurers_selected';
    if(st.insurers.some(i => i.status === 'neodesláno')) return 'request_ready';
    if(offers < 1) return 'waiting_offers';
    if(offers >= 1 && offers < 2) return 'offers_received';
    if(!hasRec) return 'comparison_ready';
    return 'client_output';
  }

  function render(){
    const st = getState();
    const idx = currentStepIndex();
    const sent = (st.insurers || []).filter(i => i.status === 'odesláno').length;

    text('brh210Case', '#' + caseId());
    text('brh210Step', WORKFLOW[idx] ? WORKFLOW[idx].label : st.step);
    text('brh210Insurers', String((st.insurers || []).length));
    text('brh210Sent', String(sent));

    const flow = $('brh210Flow');
    if(flow){
      flow.innerHTML = WORKFLOW.map((step, i) => {
        const cls = i < idx ? 'done' : (i === idx ? 'active' : '');
        return `<button type="button" class="${cls}" onclick="BRH210.setStep('${step.key}')"><b>${i+1}</b><span>${esc(step.label)}</span></button>`;
      }).join('');
    }

    const suggested = suggestedStep();
    const sObj = WORKFLOW.find(x => x.key === suggested) || WORKFLOW[0];
    text('brh210NextTitle', 'Doporučený další krok: ' + sObj.label);
    let nextText = 'Pokračujte podle workflow aktivního obchodního případu.';
    if(suggested === 'insurers_selected') nextText = 'Vyberte pojišťovny pro poptávku. Musí být možné použít centrální DB i vlastní pojišťovnu mimo seznam.';
    if(suggested === 'request_ready') nextText = 'Připravte a odešlete poptávku vybraným pojišťovnám.';
    if(suggested === 'waiting_offers') nextText = 'Evidujte stav pojišťoven a čekejte na přijaté nabídky.';
    if(suggested === 'comparison_ready') nextText = 'Porovnejte nabídky podle rizik, limitů, výluk a zdrojů.';
    if(suggested === 'client_output') nextText = 'Připravte profesionální klientský výstup.';
    text('brh210NextText', nextText);
  }

  function exportWorkflow(){
    return {
      version: VERSION,
      case_id: caseId(),
      state: getState(),
      workflow: WORKFLOW,
      client: getClientName(),
      activity: getActivity(),
      offer_count: getOfferCount(),
      advisor_recommendation: getRecommended()
    };
  }

  window.BRH210 = {
    version: VERSION,
    workflow: WORKFLOW,
    getState,
    saveState,
    setStep,
    nextStep,
    previousStep,
    addCaseInsurer,
    markRequestSent,
    generateRequestEmail,
    suggestedStep,
    render,
    exportWorkflow
  };

  if(typeof window.showView === 'function' && !window.__BRH210_showViewWrapped){
    window.__BRH210_showViewWrapped = true;
    const oldShowView = window.showView;
    window.showView = function(id){
      oldShowView(id);
      setTimeout(render, 150);
      setTimeout(render, 700);
    };
  }

  if(typeof window.applyState === 'function' && !window.__BRH210_applyStateWrapped){
    window.__BRH210_applyStateWrapped = true;
    const oldApply = window.applyState;
    window.applyState = function(s){
      oldApply(s);
      setTimeout(render, 200);
      setTimeout(render, 900);
    };
  }

  setTimeout(render, 300);
  setTimeout(render, 1200);
})();



// ============================================================
// ASTORIE Business Risk Hub 2.2.0 - Offer Engine Foundation FULL
// Navazuje na 2.1.0 Workflow Engine. Neodstraňuje Admin, dokumenty ani textace.
// ============================================================
(function(){
  const VERSION = '2.2.0-offer-engine-foundation-full';
  const NS = 'brh220';
  const $ = id => document.getElementById(id);
  const parse = (raw, fb) => { try { return raw ? JSON.parse(raw) : fb; } catch(e){ return fb; } };
  const load = (key, fb) => parse(localStorage.getItem(NS + ':' + key), fb);
  const save = (key, val) => localStorage.setItem(NS + ':' + key, JSON.stringify(val));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const text = (id, val) => { const el = $(id); if(el) el.textContent = val; };

  const DEFAULT_RISKS = [
    { risk_key:'LIABILITY_OPERATION', risk_name:'Provozní odpovědnost', requested_limit:'' },
    { risk_key:'LIABILITY_PRODUCT', risk_name:'Odpovědnost za výrobek', requested_limit:'' },
    { risk_key:'FINANCIAL_LOSS', risk_name:'Čistá finanční škoda', requested_limit:'' },
    { risk_key:'EMPLOYEE_DAMAGE', risk_name:'Škody způsobené zaměstnanci', requested_limit:'' },
    { risk_key:'TAKEN_ITEMS', risk_name:'Věci převzaté / užívané', requested_limit:'' }
  ];

  function caseId(){
    try{
      if(window.BRH2 && BRH2.getCoreCase) return String(BRH2.getCoreCase().id || 'local');
      if(window.BRH210 && BRH210.exportWorkflow) return String(BRH210.exportWorkflow().case_id || 'local');
      if(typeof state !== 'undefined'){
        if(state.activeInquiry && (state.activeInquiry.id || state.activeInquiry.dbId)) return String(state.activeInquiry.id || state.activeInquiry.dbId);
        if(state.id) return String(state.id);
      }
    }catch(e){}
    const body = document.body ? document.body.innerText || '' : '';
    const m = body.match(/DB\s*#?(\d+)/i) || body.match(/#(\d+)\s*[–-]/);
    return m ? String(m[1]) : 'local';
  }

  function offersMap(){
    return load('offers_by_case', {});
  }

  function saveOffersMap(map){
    save('offers_by_case', map || {});
  }

  function requestRisks(){
    try{
      if(window.BRH2 && BRH2.listRequestRisks){
        const r = BRH2.listRequestRisks();
        if(Array.isArray(r) && r.length) return r.map(x => ({
          risk_key: x.risk_key || x.key,
          risk_name: x.risk_name || x.name || x.risk_key || x.key,
          requested_limit: x.requested_limit || x.limit || ''
        }));
      }
    }catch(e){}
    return DEFAULT_RISKS;
  }

  function listOffers(){
    const map = offersMap();
    const id = caseId();
    return Array.isArray(map[id]) ? map[id] : [];
  }

  function writeOffers(items){
    const map = offersMap();
    map[caseId()] = (items || []).map(normalizeOffer);
    saveOffersMap(map);
    syncToBRH2();
    render();
  }

  function uniqueRiskRows(rows){
    const map = new Map();
    (rows || []).forEach(r => {
      const key = r.risk_key || r.risk_name;
      if(!key) return;
      if(!map.has(key)){
        map.set(key, normalizeOfferRisk(r));
      }else{
        const old = map.get(key);
        old.offered_limit = old.offered_limit || r.offered_limit || '';
        old.coverage_status = old.coverage_status || r.coverage_status || 'nutno_ověřit';
        old.exclusions = old.exclusions || r.exclusions || '';
        old.sublimits = old.sublimits || r.sublimits || '';
        old.source_reference = old.source_reference || r.source_reference || '';
        old.advisor_note = old.advisor_note || r.advisor_note || '';
      }
    });
    return Array.from(map.values());
  }

  function normalizeOfferRisk(r){
    r = r || {};
    return {
      id: r.id || 'or-' + Date.now() + '-' + Math.random().toString(16).slice(2),
      risk_key: r.risk_key || r.key || '',
      risk_name: r.risk_name || r.name || r.risk_key || r.key || '',
      requested_limit: r.requested_limit || r.requestedLimit || '',
      offered_limit: r.offered_limit || r.offeredLimit || r.limit || '',
      coverage_status: r.coverage_status || r.status || 'nutno_ověřit',
      exclusions: r.exclusions || '',
      sublimits: r.sublimits || '',
      source_reference: r.source_reference || r.source || '',
      advisor_note: r.advisor_note || r.note || '',
      client_visible_note: r.client_visible_note || ''
    };
  }

  function normalizeOffer(o){
    o = o || {};
    return {
      id: o.id || 'offer-' + Date.now() + '-' + Math.random().toString(16).slice(2),
      case_id: caseId(),
      insurer_id: o.insurer_id || '',
      insurer_name: o.insurer_name || o.insurer || o.company || '',
      custom_insurer_name: o.custom_insurer_name || '',
      product_name: o.product_name || o.product || '',
      annual_premium: o.annual_premium || o.premium || '',
      deductible: o.deductible || '',
      status: o.status || 'rozpracováno',
      is_advisor_recommended: !!o.is_advisor_recommended,
      internal_note: o.internal_note || o.note || '',
      client_visible_note: o.client_visible_note || '',
      offer_risks: uniqueRiskRows(o.offer_risks || o.coverages || []),
      created_at: o.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  function seedOfferFromRequest(insurerName){
    const risks = requestRisks().map(r => normalizeOfferRisk({
      risk_key: r.risk_key,
      risk_name: r.risk_name,
      requested_limit: r.requested_limit,
      offered_limit: '',
      coverage_status: 'nutno_ověřit'
    }));
    const offer = normalizeOffer({
      insurer_name: insurerName || '',
      product_name: '',
      offer_risks: risks
    });
    writeOffers([offer].concat(listOffers()));
    return offer;
  }

  function openOfferWizard(offerId){
    const box = $('brh220OfferWizard');
    if(!box) return;
    const offer = offerId ? listOffers().find(o => o.id === offerId) : null;
    $('brh220OfferId').value = offer ? offer.id : '';
    $('brh220InsurerName').value = offer ? offer.insurer_name : '';
    $('brh220ProductName').value = offer ? offer.product_name : '';
    $('brh220Premium').value = offer ? offer.annual_premium : '';
    $('brh220Deductible').value = offer ? offer.deductible : '';
    $('brh220InternalNote').value = offer ? offer.internal_note : '';
    $('brh220ClientNote').value = offer ? offer.client_visible_note : '';

    const risks = offer ? offer.offer_risks : requestRisks().map(r => normalizeOfferRisk(r));
    renderRiskEditor(risks);
    box.classList.remove('hidden');
    box.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function closeOfferWizard(){
    const box = $('brh220OfferWizard');
    if(box) box.classList.add('hidden');
  }

  function renderRiskEditor(risks){
    const el = $('brh220RiskEditor');
    if(!el) return;
    el.innerHTML = `
      <div class="brh220-risk-editor-head">
        <b>Rizika v nabídce</b>
        <span>Každý řádek musí mít risk_key / riziko, požadavek klienta, nabídnutý limit, stav a zdroj.</span>
      </div>
      ${(risks || []).map((r, i) => `
        <div class="brh220-risk-row" data-risk-index="${i}">
          <input data-field="risk_key" value="${esc(r.risk_key || '')}" placeholder="risk_key">
          <input data-field="risk_name" value="${esc(r.risk_name || '')}" placeholder="název rizika">
          <input data-field="requested_limit" value="${esc(r.requested_limit || '')}" placeholder="požadovaný limit">
          <input data-field="offered_limit" value="${esc(r.offered_limit || '')}" placeholder="nabídnutý limit">
          <select data-field="coverage_status">
            ${['splněno','částečně','výluka','nutno_ověřit','nesplněno'].map(s => `<option value="${s}" ${r.coverage_status===s?'selected':''}>${s}</option>`).join('')}
          </select>
          <input data-field="source_reference" value="${esc(r.source_reference || '')}" placeholder="zdroj VPP/DPP">
          <textarea data-field="advisor_note" placeholder="poznámka poradce">${esc(r.advisor_note || '')}</textarea>
        </div>
      `).join('')}
    `;
  }

  function readRiskEditor(){
    const rows = [];
    document.querySelectorAll('#brh220RiskEditor .brh220-risk-row').forEach(row => {
      const get = field => row.querySelector(`[data-field="${field}"]`)?.value || '';
      rows.push(normalizeOfferRisk({
        risk_key: get('risk_key'),
        risk_name: get('risk_name'),
        requested_limit: get('requested_limit'),
        offered_limit: get('offered_limit'),
        coverage_status: get('coverage_status'),
        source_reference: get('source_reference'),
        advisor_note: get('advisor_note')
      }));
    });
    return rows;
  }

  function saveOfferFromWizard(){
    const id = $('brh220OfferId')?.value || '';
    const items = listOffers();
    const old = id ? items.find(o => o.id === id) : null;
    const offer = normalizeOffer({
      id: id || undefined,
      insurer_name: $('brh220InsurerName')?.value || '',
      product_name: $('brh220ProductName')?.value || '',
      annual_premium: $('brh220Premium')?.value || '',
      deductible: $('brh220Deductible')?.value || '',
      internal_note: $('brh220InternalNote')?.value || '',
      client_visible_note: $('brh220ClientNote')?.value || '',
      offer_risks: readRiskEditor(),
      is_advisor_recommended: old ? old.is_advisor_recommended : false
    });

    if(!offer.insurer_name){
      alert('Doplňte pojišťovnu.');
      return;
    }

    const idx = items.findIndex(o => o.id === offer.id);
    if(idx >= 0) items[idx] = offer;
    else items.unshift(offer);
    writeOffers(items);
    closeOfferWizard();
    alert('Nabídka byla uložena do Offer Engine.');
  }

  function deleteOffer(id){
    if(!confirm('Smazat nabídku z aktivního obchodního případu?')) return;
    writeOffers(listOffers().filter(o => o.id !== id));
  }

  function setAdvisorRecommendation(id){
    const items = listOffers().map(o => Object.assign({}, o, { is_advisor_recommended: o.id === id }));
    writeOffers(items);
    if(window.BRH2 && BRH2.setAdvisorRecommendation){
      try { BRH2.setAdvisorRecommendation(id); } catch(e) {}
    }
  }

  function clearAdvisorRecommendation(){
    writeOffers(listOffers().map(o => Object.assign({}, o, { is_advisor_recommended: false })));
    if(window.BRH2 && BRH2.setAdvisorRecommendation){
      try { BRH2.setAdvisorRecommendation(null); } catch(e) {}
    }
  }

  function validateOffers(){
    const errors = [];
    listOffers().forEach(o => {
      if(!o.case_id) errors.push(`Nabídka ${o.insurer_name || o.id}: chybí case_id.`);
      if(!o.insurer_name && !o.insurer_id) errors.push(`Nabídka ${o.id}: chybí pojišťovna.`);
      (o.offer_risks || []).forEach(r => {
        if(!r.risk_key) errors.push(`${o.insurer_name}: chybí risk_key u rizika ${r.risk_name || '(bez názvu)'}.`);
        if(!r.risk_name) errors.push(`${o.insurer_name}: chybí název rizika.`);
      });
    });
    const recommended = listOffers().filter(o => o.is_advisor_recommended);
    if(recommended.length > 1) errors.push('Více než jedna nabídka je označena jako doporučená.');
    return { ok: errors.length === 0, errors };
  }

  function validateAndRender(){
    const result = validateOffers();
    text('brh220Validation', result.ok ? 'OK' : 'chyby');
    if(!result.ok){
      alert('Validace našla chyby:\n\n' + result.errors.join('\n'));
    }
    render();
    return result;
  }

  function allRiskKeys(){
    const keys = [];
    listOffers().forEach(o => (o.offer_risks || []).forEach(r => {
      if(r.risk_key && !keys.includes(r.risk_key)) keys.push(r.risk_key);
    }));
    requestRisks().forEach(r => {
      if(r.risk_key && !keys.includes(r.risk_key)) keys.push(r.risk_key);
    });
    return keys;
  }

  function riskLabel(key){
    const req = requestRisks().find(r => r.risk_key === key);
    if(req) return req.risk_name || key;
    for(const offer of listOffers()){
      const r = (offer.offer_risks || []).find(x => x.risk_key === key);
      if(r) return r.risk_name || key;
    }
    return key;
  }

  function renderComparison(){
    const box = document.getElementById('offerComparisonMatrixV72');
    if(!box) return;
    const offers = listOffers();
    if(!offers.length){
      box.innerHTML = '<div class="textation-empty">Nejsou vložené nabídky pro porovnání. Vytvořte nabídku v Offer Engine.</div>';
      return;
    }
    const risks = allRiskKeys();
    const rec = offers.find(o => o.is_advisor_recommended);
    box.innerHTML = `
      <div class="unified-analysis-v73 case-analysis-v74 brh220-analysis">
        <div>
          <p class="eyebrow">Offer Engine 2.2.0</p>
          <h3>${rec ? 'Doporučená varianta poradce: ' + esc(rec.insurer_name) : 'Doporučená varianta zatím není vybraná'}</h3>
          <p>${rec ? 'Doporučení bylo potvrzeno poradcem.' : 'Aplikace nic nedoporučuje automaticky. Doporučení musí potvrdit poradce.'}</p>
        </div>
        <div class="analysis-metrics-v73">
          <div><b>${offers.length}</b><span>nabídky</span></div>
          <div><b>${risks.length}</b><span>rizika</span></div>
          <div><b>${rec ? 'ano' : 'ne'}</b><span>doporučení</span></div>
        </div>
      </div>
      <div class="comparison-table-wrap-v72">
        <table class="comparison-table-v72">
          <thead>
            <tr><th>Riziko / požadavek</th>${offers.map(o => `<th>${esc(o.insurer_name)}${o.is_advisor_recommended ? ' ⭐' : ''}</th>`).join('')}<th>Makléřská poznámka</th></tr>
          </thead>
          <tbody>
            ${risks.map(key => `<tr>
              <td><b>${esc(riskLabel(key))}</b><br><small>${esc(key)}</small></td>
              ${offers.map(o => {
                const r = (o.offer_risks || []).find(x => x.risk_key === key);
                return `<td>${r ? `<b>${esc(r.coverage_status)}</b><br>Pož.: ${esc(r.requested_limit || '—')}<br>Nab.: ${esc(r.offered_limit || '—')}<br><small>${esc(r.source_reference || '')}</small>` : '—'}</td>`;
              }).join('')}
              <td>Ověřit limit, stav krytí, výluky, sublimity a zdroj.</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderCards(){
    const box = $('brh220OfferCards');
    if(!box) return;
    const offers = listOffers();
    if(!offers.length){
      box.innerHTML = '<div class="textation-empty">Zatím není vytvořená žádná nabídka v Offer Engine.</div>';
      return;
    }
    box.innerHTML = offers.map(o => `
      <article class="brh220-offer-card ${o.is_advisor_recommended ? 'recommended' : ''}">
        <div class="brh220-offer-head">
          <div>
            <span>${esc(o.status || 'rozpracováno')}</span>
            <h3>${esc(o.insurer_name || 'bez pojišťovny')}</h3>
            <p>${esc(o.product_name || 'produkt není doplněn')}</p>
          </div>
          ${o.is_advisor_recommended ? '<strong>Doporučeno poradcem</strong>' : ''}
        </div>
        <div class="brh220-offer-metrics">
          <div><b>${esc(o.annual_premium || '—')}</b><span>pojistné</span></div>
          <div><b>${esc(o.deductible || '—')}</b><span>spoluúčast</span></div>
          <div><b>${(o.offer_risks || []).length}</b><span>rizik</span></div>
        </div>
        <div class="brh220-risk-list">
          ${(o.offer_risks || []).map(r => `
            <div class="brh220-risk-pill">
              <b>${esc(r.risk_name || r.risk_key)}</b>
              <span>${esc(r.offered_limit || 'bez limitu')} · ${esc(r.coverage_status)}</span>
            </div>`).join('')}
        </div>
        <div class="brh220-card-actions">
          <button class="primary small-btn" type="button" onclick="BRH220.setAdvisorRecommendation('${esc(o.id)}')">Doporučit</button>
          <button class="secondary small-btn" type="button" onclick="BRH220.openOfferWizard('${esc(o.id)}')">Upravit</button>
          <button class="secondary small-btn" type="button" onclick="BRH220.deleteOffer('${esc(o.id)}')">Smazat</button>
        </div>
      </article>
    `).join('');
  }

  function render(){
    const offers = listOffers();
    const riskRows = offers.reduce((s,o) => s + (o.offer_risks || []).length, 0);
    const valid = validateOffers();
    const rec = offers.find(o => o.is_advisor_recommended);
    text('brh220OfferCount', String(offers.length));
    text('brh220RiskRows', String(riskRows));
    text('brh220Validation', valid.ok ? 'OK' : 'chyby');
    text('brh220Recommendation', rec ? 'ano' : 'ne');
    renderCards();
    if(document.getElementById('offerComparisonMatrixV72')) renderComparison();
  }

  function syncToBRH2(){
    if(!window.BRH2 || !BRH2.upsertOffer) return;
    listOffers().forEach(o => {
      try{
        BRH2.upsertOffer({
          id: o.id,
          case_id: o.case_id,
          insurer_name: o.insurer_name,
          product_name: o.product_name,
          annual_premium: o.annual_premium,
          deductible: o.deductible,
          is_advisor_recommended: o.is_advisor_recommended,
          offer_risks: (o.offer_risks || []).map(r => ({
            risk_key: r.risk_key,
            risk_name: r.risk_name,
            requested_limit: r.requested_limit,
            offered_limit: r.offered_limit,
            coverage_status: r.coverage_status,
            source_reference: r.source_reference,
            advisor_note: r.advisor_note
          }))
        });
      }catch(e){}
    });
  }

  window.BRH220 = {
    version: VERSION,
    caseId,
    requestRisks,
    listOffers,
    writeOffers,
    seedOfferFromRequest,
    openOfferWizard,
    closeOfferWizard,
    saveOfferFromWizard,
    deleteOffer,
    setAdvisorRecommendation,
    clearAdvisorRecommendation,
    validateOffers,
    validateAndRender,
    renderComparison,
    render,
    normalizeOffer,
    normalizeOfferRisk
  };

  // Bezpečné přesměrování starších čteček nabídek na nový engine, pokud už jsou v něm data
  const oldGetOffers = window.getOffersV72;
  window.getOffersV72 = function(){
    const engineOffers = listOffers();
    if(engineOffers.length) {
      return engineOffers.map(o => ({
        id: o.id,
        insurer: o.insurer_name,
        product: o.product_name,
        premium: o.annual_premium,
        deductible: o.deductible,
        recommended: o.is_advisor_recommended,
        coverages: o.offer_risks.map(r => ({
          risk_key: r.risk_key,
          risk: r.risk_name,
          limit: r.offered_limit,
          state: r.coverage_status,
          source: r.source_reference,
          note: r.advisor_note
        }))
      }));
    }
    return oldGetOffers ? oldGetOffers() : [];
  };

  const oldRecommend = window.recommendOfferV72;
  window.recommendOfferV72 = function(id){
    const exists = listOffers().find(o => o.id === id);
    if(exists) return setAdvisorRecommendation(id);
    if(oldRecommend) return oldRecommend.apply(this, arguments);
  };

  if(typeof window.showView === 'function' && !window.__BRH220_showViewWrapped){
    window.__BRH220_showViewWrapped = true;
    const oldShow = window.showView;
    window.showView = function(id){
      oldShow(id);
      setTimeout(render, 180);
      setTimeout(render, 800);
    };
  }

  setTimeout(render, 300);
  setTimeout(render, 1200);
})();



// ============================================================
// ASTORIE Business Risk Hub 2.6.1 FINAL
// Production Merge on stable 2.2.0 core
// ============================================================
(function(){

  function isLoggedIn(){
    const login = document.getElementById('loginView');
    const app = document.getElementById('appView');

    const loginHidden = !login || login.classList.contains('hidden');
    const appVisible = app && !app.classList.contains('hidden');

    return loginHidden && appVisible;
  }

  function ensureWorkspace(){
    const app =
      document.getElementById('appView') ||
      document.querySelector('.app-shell') ||
      document.querySelector('main');

    if(!app) return null;

    let root = document.getElementById('brh261FinalWorkspace');

    if(!root){
      root = document.createElement('section');
      root.id = 'brh261FinalWorkspace';
      root.className = 'brh261-final-workspace';
      app.appendChild(root);
    }

    return root;
  }

  function renderIntegratedModules(){
    if(!isLoggedIn()) return;

    const root = ensureWorkspace();
    if(!root) return;

    if(root.dataset.loaded === '1') return;
    root.dataset.loaded = '1';

    root.innerHTML = `
      <section class="panel brh261-final-panel">

        <div class="section-head">
          <div>
            <p class="eyebrow">Business Risk Hub 2.6.1 FINAL</p>
            <h2>Produkční brokerský workspace</h2>
            <p class="muted">
              Stabilní core 2.2.0 + integrované workflow moduly 2.3–2.5 bez rozbití loginu a shellu.
            </p>
          </div>
        </div>

        <div class="brh261-final-grid">

          <article class="brh261-final-card">
            <span>2.3</span>
            <h3>Textace & dokumenty</h3>
            <ul>
              <li>Moje textace</li>
              <li>Centrální databáze</li>
              <li>Návrhy ke schválení</li>
              <li>Knihovna dokumentů</li>
            </ul>
          </article>

          <article class="brh261-final-card">
            <span>2.4</span>
            <h3>Klientský reporting</h3>
            <ul>
              <li>Porovnání nabídek</li>
              <li>Doporučení poradce</li>
              <li>Klientský výstup</li>
              <li>Makléřský report</li>
            </ul>
          </article>

          <article class="brh261-final-card">
            <span>2.5</span>
            <h3>Komunikace s pojišťovnami</h3>
            <ul>
              <li>Poptávky pojišťovnám</li>
              <li>Workflow komunikace</li>
              <li>Evidence odpovědí</li>
              <li>Termíny a timeline</li>
            </ul>
          </article>

          <article class="brh261-final-card">
            <span>CORE</span>
            <h3>Stabilní provozní základ</h3>
            <ul>
              <li>Stabilní login</li>
              <li>Stabilní router</li>
              <li>Stabilní dashboard</li>
              <li>Bez auth hacků</li>
            </ul>
          </article>

        </div>

      </section>
    `;
  }

  function boot(){
    renderIntegratedModules();
  }

  window.BRH261FINAL = {
    version: '2.6.1-final-production-merge',
    boot
  };

  setTimeout(boot, 600);
  setTimeout(boot, 1500);
  setTimeout(boot, 3000);

})();
