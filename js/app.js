// ========== 1. بيانات الأحكام (مبنية على جدول الأحكام المقترح) ==========
const GROUPS = {
  m6:'🔴 مد 6 حركات لزوماً', mj:'🟠 مد 2 أو 4 أو 6 جوازاً', mw:'🟤 مد واجب 4 أو 5 حركات', m2:'🟡 مد حركتان',
  gh:'🟢 إخفاء ومواقع الغنة', id:'⚫ إدغام وإظهار وما لا يُلفظ', tf:'🔵 تفخيم', tq:'🟣 ترقيق', ql:'🩵 قلقلة', hm:'🌸 همس'
};
// key | group | باب | المحرّك | الشرط | كيفية النطق
const RULE_TABLE = `
madd_lazim_kalimi_muthaqqal|m6|المد|حرف مد (ا و ي) + حرف مشدد|الحرف المشدد في نفس الكلمة|مد الصوت في جوف الفم ثم الانتقال لمخرج الحرف المشدد بقوة
madd_lazim_kalimi_mukhaffaf|m6|المد|حرف مد (ا و ي) + حرف ساكن|الحرف الساكن في نفس الكلمة|مد الصوت في جوف الفم ثم النطق بالساكن
madd_lazim_harfi_muthaqqal|m6|المد|حرف مقطّع في فواتح السور|حرف ممدود يليه حرف مدغم|مد الصوت في الحرف المقطع ثم إدغام الحرف التالي
madd_lazim_harfi_mukhaffaf|m6|المد|حرف مقطّع في فواتح السور|حرف ممدود يليه حرف غير مدغم|مد الصوت في الحرف المقطع دون إدغام
madd_lazim|m6|المد|حرف مد + سكون لازم|سكون أصلي بعد حرف المد|مد 6 حركات
madd_munfasil|mj|المد|حرف مد + همزة|حرف المد في آخر كلمة والهمزة في أول التالية|مد الصوت قبل الهمزة (2 أو 4 أو 5 حسب الرواية)
madd_silah_kubra|mj|المد|هاء الضمير المتحركة + همزة|الهاء بين متحركين والذي بعدها همزة|تُوصل الهاء بمد قبل الهمزة
madd_leen|mj|المد|واو أو ياء ساكنة وما قبلها مفتوح|يليها حرف متحرك في آخر الكلمة يُسكَّن للوقف|يمتد صوت الواو/الياء بلين عند الوقف
madd_ared|mj|المد|حرف مد أصلي|يليه حرف متحرك في آخر الكلمة يُسكَّن للوقف|المد 2 أو 4 أو 6 عند الوقف
madd_muttasil|mw|المد|حرف مد + همزة|الهمزة في نفس الكلمة|مد قوي قبل قطع الهمزة (4 أو 5)
madd_tabiee|m2|المد|حرف مد (ألف بعد فتحة، ياء بعد كسرة، واو بعد ضمة)|لا يليه همز ولا سكون|مد الصوت حركتين في جوف الفم
madd_silah_sughra|m2|المد|هاء الضمير المتحركة|الهاء بين متحركين والذي بعدها ليس همزة|تُوصل بياء (مكسورة) أو واو (مضمومة) حركتين
madd_badal|m2|المد|همزة قبل حرف مد|تتقدم الهمزة على حرف المد|مد حركتين
madd_iwad|m2|المد|تنوين منصوب|عند الوقف على التنوين المنصوب|يُبدل التنوين ألفاً ممدودة حركتين
ikhfa|gh|النون الساكنة والتنوين|نون ساكنة أو تنوين|يليها أحد الحروف الـ15: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك|لا تُنطق النون ويبقى صوت الغنة من الخيشوم مع تهيئة الفم لمخرج الحرف التالي
iqlab|gh|النون الساكنة والتنوين|نون ساكنة أو تنوين|يليها حرف الباء|تتحول النون إلى ميم مخفاة بغنة ثم تُنطق الباء
idgham_ghunnah|gh|النون الساكنة والتنوين|نون ساكنة أو تنوين|يليها أحد حروف (ي م و ن) بين كلمتين|يسقط صوت النون وتبقى الغنة ثم ينتقل للحرف التالي
ikhfa_shafawi|gh|الميم الساكنة|ميم ساكنة|يليها حرف الباء|تنطبق الشفتان انطباقاً خفيفاً مع غنة ثم تُنطق الباء
idgham_shafawi|gh|الميم الساكنة|ميم ساكنة|يليها ميم|تُدغم في الميم الثانية مع غنة
ghunnah|gh|الغنة|نون أو ميم عليها شدة|دائماً|صوت الغنة من الخيشوم حركتين
idgham_no_ghunnah|id|النون الساكنة والتنوين|نون ساكنة أو تنوين|يليها لام أو راء بين كلمتين|لا تُنطق النون ولا غنة، وينتقل مباشرة للحرف التالي
idhar_halqi|id|النون الساكنة والتنوين|نون ساكنة أو تنوين|يليها أحد حروف الحلق: ء ه ع ح غ خ|تخرج النون واضحة من مخرجها بلا غنة
idhar_shafawi|id|الميم الساكنة|ميم ساكنة أصلية|يليها أي حرف عدا الميم والباء|إطباق الشفتين بوضوح ثم فتحهما، مع الحذر من إخفائها عند الواو والفاء
idgham_other|id|أحكام أخرى|حرفان متماثلان أو متجانسان أو متقاربان|الأول ساكن والثاني متحرك|دمج الحرف الأول في الثاني ليصيرا حرفاً واحداً مشدداً
silent|id|أحكام أخرى|حروف زائدة في الرسم العثماني أو لام شمسية مدغمة|تُكتب ولا تُلفظ|تُتجاوز تماماً أثناء القراءة
tafkheem_general|tf|التفخيم والترقيق|حروف الاستعلاء السبعة: خ ص ض غ ط ق ظ|دائماً|يرتفع أقصى اللسان نحو الحنك فيخرج الصوت ممتلئاً
tafkheem_lam|tf|التفخيم والترقيق|لام لفظ الجلالة "الله"|بعد فتحة أو ضمة|صوت ممتلئ مفخم
tafkheem_ra|tf|التفخيم والترقيق|راء مفتوحة أو مضمومة، أو ساكنة|المفتوحة والمضمومة دائماً؛ والساكنة إذا سبقها فتح أو ضم|صوت مفخم ممتلئ مع تكرار خفيف
tarqeeq_lam|tq|التفخيم والترقيق|لام لفظ الجلالة "الله"|بعد كسرة|صوت رفيع خفيف يتجه للأمام
tarqeeq_ra|tq|التفخيم والترقيق|راء مكسورة أو ساكنة|المكسورة دائماً؛ والساكنة إذا سبقها كسر|صوت رفيع خفيف
tarqeeq_general|tq|التفخيم والترقيق|الحروف غير المستعلية|غير الراء واللام|تنحيف الحرف عند النطق به
qalqalah_sughra|ql|القلقلة|حرف من (ق ط ب ج د)|ساكن في وسط الكلمة|نبضة صوتية خفيفة تمنع موت الحرف
qalqalah_wusta|ql|القلقلة|حرف من (ق ط ب ج د)|ساكن في آخر الكلمة عند الوقف|نبضة صوتية واضحة عند الوقف
qalqalah_kubra|ql|القلقلة|حرف من (ق ط ب ج د)|مشدد في آخر الكلمة عند الوقف|نبضة قوية تمنع موت الحرف المشدد
qalqalah|ql|القلقلة|حرف من (ق ط ب ج د)|ساكن|نبضة صوتية تمنع موت الحرف
hamas|hm|الصفات|أحد حروف: فحثه شخص سكت|حرف ساكن أو متحرك|يجري معه نَفَس الهواء لضعف الاعتماد على المخرج`;
const TITLES = { madd_lazim_kalimi_muthaqqal:'المد اللازم الكلمي المثقل', madd_lazim_kalimi_mukhaffaf:'المد اللازم الكلمي المخفف', madd_lazim_harfi_muthaqqal:'المد اللازم الحرفي المثقل', madd_lazim_harfi_mukhaffaf:'المد اللازم الحرفي المخفف', madd_lazim:'المد اللازم', madd_munfasil:'المد المنفصل', madd_silah_kubra:'مد الصلة الكبرى', madd_leen:'مد اللين', madd_ared:'المد العارض للسكون', madd_muttasil:'المد المتصل', madd_tabiee:'المد الطبيعي', madd_silah_sughra:'مد الصلة الصغرى', madd_badal:'مد البدل', madd_iwad:'مد العوض', ikhfa:'الإخفاء الحقيقي', iqlab:'الإقلاب', idgham_ghunnah:'الإدغام بغنة', ikhfa_shafawi:'الإخفاء الشفوي', idgham_shafawi:'الإدغام الشفوي', ghunnah:'غنة النون والميم المشددة', idgham_no_ghunnah:'الإدغام بغير غنة', idhar_halqi:'الإظهار الحلقي', idhar_shafawi:'الإظهار الشفوي', idgham_other:'إدغام المثلين/المتجانسين/المتقاربين', silent:'تكتب ولا تُلفظ', tafkheem_general:'تفخيم الحروف المستعلية', tafkheem_lam:'تفخيم اللام', tafkheem_ra:'تفخيم الراء', tarqeeq_lam:'ترقيق اللام', tarqeeq_ra:'ترقيق الراء', tarqeeq_general:'ترقيق الحروف', qalqalah_sughra:'القلقلة الصغرى', qalqalah_wusta:'القلقلة الوسطى', qalqalah_kubra:'القلقلة الكبرى', qalqalah:'القلقلة', hamas:'الهمس' };
const RULES = {};
RULE_TABLE.trim().split('\n').forEach(l => { const [k,g,bab,eng,cond,pron] = l.split('|'); RULES[k] = { k, g, bab, eng, cond, pron, title: TITLES[k] }; });
// توحيد مسميات القاعدة القديمة (مفتوحة المصدر) مع القاموس الموحد. null = تجاهل
const ALIAS = { idghaam_ghunnah:'idgham_ghunnah', idgham_bighunnah:'idgham_ghunnah', idghaam_no_ghunnah:'idgham_no_ghunnah', idgham_bila_ghunnah:'idgham_no_ghunnah', idghaam_shafawi:'idgham_shafawi', ikhfaa:'ikhfa', ikhfaa_shafawi:'ikhfa_shafawi', lam_shamsiya:'silent', lam_qamariya:null, tafkheem:'tafkheem_general', tarqeeq:'tarqeeq_general', idghaam_mutajanisayn:'idgham_other', idghaam_mutaqaribayn:'idgham_other', idgham_mutamathil:'idgham_other' };
const NAMES = 'الفاتحة،البقرة،آل عمران،النساء،المائدة،الأنعام،الأعراف،الأنفال،التوبة،يونس،هود،يوسف،الرعد،إبراهيم،الحجر،النحل،الإسراء،الكهف،مريم،طه،الأنبياء،الحج،المؤمنون،النور،الفرقان،الشعراء،النمل،القصص،العنكبوت،الروم،لقمان،السجدة،الأحزاب،سبأ،فاطر،يس،الصافات،ص،الزمر،غافر،فصلت،الشورى،الزخرف،الدخان،الجاثية،الأحقاف،محمد،الفتح،الحجرات،ق،الذاريات،الطور،النجم،القمر،الرحمن،الواقعة،الحديد،المجادلة،الحشر،الممتحنة،الصف،الجمعة،المنافقون،التغابن،الطلاق،التحريم،الملك،القلم،الحاقة،المعارج،نوح،الجن،المزمل،المدثر،القيامة،الإنسان،المرسلات،النبأ،النازعات،عبس،التكوير،الانفطار،المطففين،الانشقاق،البروج،الطارق،الأعلى،الغاشية،الفجر،البلد،الشمس،الليل،الضحى،الشرح،التين،العلق،القدر،البينة،الزلزلة،العاديات،القارعة،التكاثر،العصر،الهمزة،الفيل،قريش،الماعون،الكوثر،الكافرون،النصر،المسد،الإخلاص،الفلق،الناس'.split('،');

// ألوان الحروف تُولَّد من مجموعات الأحكام (تدعم الوضع الليلي عبر متغيرات CSS)
document.head.appendChild(Object.assign(document.createElement('style'), {
  textContent: Object.values(RULES).map(r => `.t-${r.k}{color:var(--g-${r.g})}`).join('')
}));
const col = k => `var(--g-${RULES[k].g})`;

// ========== 2. حالة التطبيق ==========
const $ = id => document.getElementById(id);
let surah = 1, mode = 'deg', sel = new Set(), tajweed = {}, quranLines = null, WR = {}, counts = {};

function normalize(list) {
  const m = {};
  list.forEach(r => {
    const t = r.type in ALIAS ? ALIAS[r.type] : r.type;
    if (!t || !RULES[t]) return;
    (m[t] ||= new Set()); r.chars.forEach(c => m[t].add(c));
  });
  return Object.entries(m).map(([type, s]) => ({ type, chars: [...s] }));
}
const MARK = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/;
function letterAt(word, i) {   // الحرف مع تشكيله
  const c = Array.from(word); while (i > 0 && MARK.test(c[i])) i--;
  let s = c[i], j = i + 1; while (j < c.length && MARK.test(c[j])) s += c[j++];
  return s;
}
function wordHTML(text, rules) {
  const ch = Array.from(text), per = ch.map(() => []);
  rules.forEach(r => r.chars.forEach(i => i < ch.length && per[i].push(r.type)));
  let out = '', i = 0;
  while (i < ch.length) {
    const key = per[i].join(' '); let j = i, s = '';
    while (j < ch.length && per[j].join(' ') === key) s += ch[j++];
    out += key ? `<span class="tc t-${per[i][0]}" data-k="${key}">${s}</span>` : s; i = j;
  }
  return out;
}

// ========== 3. تحميل السورة ورسمها ==========
async function loadSurah(id) {
  surah = id; $('surahSel').value = id; location.hash = id;
  $('surahTitle').textContent = 'سُورَةُ ' + NAMES[id - 1];
  $('basmala').hidden = id === 1 || id === 9;
  $('quran').innerHTML = '<p class="muted" style="text-align:center">جاري التحميل…</p>';
  try { tajweed = await (await fetch(`./data/tajweed_db/surah_${id}.json`)).json(); } catch { tajweed = {}; }
  if (!quranLines) quranLines = (await (await fetch('./data/quran-uthmani-min.txt')).text()).split('\n');
  const box = document.createDocumentFragment(); WR = {}; counts = {};
  quranLines.filter(l => l.startsWith(id + '|')).forEach(l => {
    const [, ay, txt] = l.split('|'); let t = txt.trim();
    if (ay == 1 && id !== 1 && id !== 9) t = t.replace(/^بِسمِ اللَّهِ الرَّحمٰنِ الرَّحيمِ ?/, '');
    t.split(' ').filter(Boolean).forEach((w, n) => {
      const key = `${id}:${ay}:${n + 1}`, rules = normalize(tajweed[key] || []);
      WR[key] = { w, rules }; rules.forEach(r => counts[r.type] = (counts[r.type] || 0) + 1);
      const s = document.createElement('span'); s.className = 'w'; s.dataset.key = key; s.innerHTML = wordHTML(w, rules); box.appendChild(s);
      box.appendChild(document.createTextNode(' '));
    });
    const n = document.createElement('span'); n.className = 'ayah'; n.textContent = '﴿' + (+ay).toLocaleString('ar-EG') + '﴾'; box.appendChild(n);
  });
  $('quran').innerHTML = ''; $('quran').appendChild(box);
  hideTip(); showDetail(null); renderFilters(); applyFilter();
}

// ========== 4. النافذة السريعة عند المرور + تفاصيل الكلمة ==========
function rowsHTML(wr, withBtn) {
  if (!wr.rules.length) return '<div class="none muted">لا توجد أحكام مسجلة لهذه الكلمة</div>';
  return wr.rules.flatMap(r => r.chars.map(i => ({ r, i }))).sort((a, b) => b.i - a.i).map(({ r, i }) =>
    `<div class="row" style="--c:${col(r.type)}"><span class="lt">${letterAt(wr.w, i)}</span><span class="ar">←</span><b>${RULES[r.type].title}</b>${withBtn ? `<button data-rule="${r.type}">اشرح</button>` : ''}</div>`).join('');
}
const tip = $('tip');
function showTip(el) {
  const wr = WR[el.dataset.key]; if (!wr) return;
  tip.innerHTML = `<div class="word">${wordHTML(wr.w, wr.rules)}</div>${rowsHTML(wr, false)}`; tip.hidden = false;
  const b = el.getBoundingClientRect(), t = tip.getBoundingClientRect();
  let x = b.left + b.width / 2 - t.width / 2, y = b.top - t.height - 8;
  if (y < 56) y = b.bottom + 8;
  tip.style.left = Math.max(6, Math.min(x, innerWidth - t.width - 6)) + 'px'; tip.style.top = y + 'px';
}
function hideTip() { tip.hidden = true; }
function showDetail(key) {
  document.querySelectorAll('.w.sel').forEach(e => e.classList.remove('sel'));
  const d = $('detail');
  if (!key) { d.innerHTML = '<p class="muted">مرّر على أي كلمة (أو المسها) لترى أحكامها، واضغط عليها لتثبيت التفاصيل هنا.</p>'; return; }
  document.querySelector(`.w[data-key="${key}"]`)?.classList.add('sel');
  d.innerHTML = `<div class="word">${wordHTML(WR[key].w, WR[key].rules)}</div>${rowsHTML(WR[key], true)}`;
}
const q = $('quran'), canHover = matchMedia('(hover:hover)').matches;
q.addEventListener('mouseover', e => { if (!canHover) return; const w = e.target.closest('.w'); w ? showTip(w) : hideTip(); });
q.addEventListener('mouseleave', hideTip);
q.addEventListener('click', e => { const w = e.target.closest('.w'); if (!w) return; showTip(w); showDetail(w.dataset.key); });
document.addEventListener('click', e => { if (!e.target.closest('.w')) hideTip(); });
$('detail').addEventListener('click', e => { const b = e.target.closest('[data-rule]'); if (b) { setSel([b.dataset.rule]); openPanel(true); } });

// ========== 5. الفلاتر: طريقتان (بحسب الدرجة / بحسب الباب) ==========
function renderFilters() {
  const bucket = {}; Object.values(RULES).forEach(r => (bucket[mode === 'deg' ? GROUPS[r.g] : r.bab] ||= []).push(r));
  $('filters').innerHTML = Object.entries(bucket).map(([name, list]) => `
    <details open><summary>${name}<span class="all" data-all="${list.map(r => r.k).join(',')}">الكل</span></summary>
    <div class="chips">${list.map(r => `<button class="chip ${counts[r.k] ? '' : 'zero'} ${sel.has(r.k) ? 'on' : ''}" data-k="${r.k}" style="--c:${col(r.k)}"><i style="background:${col(r.k)}"></i>${r.title}<small>${counts[r.k] || 0}</small></button>`).join('')}</div></details>`).join('');
}
$('filters').addEventListener('click', e => {
  const a = e.target.closest('[data-all]'); if (a) { e.preventDefault(); return setSel(a.dataset.all.split(',')); }
  const c = e.target.closest('.chip'); if (c) setSel(sel.size === 1 && sel.has(c.dataset.k) ? [] : [c.dataset.k]);
});
document.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
  mode = b.dataset.mode; document.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b)); renderFilters();
});
$('clearBtn').onclick = () => setSel([]);
function setSel(keys) { sel = new Set(keys); renderFilters(); applyFilter(); }
function applyFilter() {
  const on = sel.size > 0; q.classList.toggle('filtering', on); $('clearBtn').hidden = !on;
  q.querySelectorAll('.tc').forEach(s => s.classList.toggle('on', on && s.dataset.k.split(' ').some(k => sel.has(k))));
  q.querySelectorAll('.w').forEach(w => w.classList.toggle('dim', on && !w.querySelector('.tc.on')));
  const info = $('ruleInfo'); info.hidden = !on; if (!on) return;
  if (sel.size === 1) {
    const r = RULES[[...sel][0]];
    info.innerHTML = `<h3 style="color:${col(r.k)}">${r.title}</h3><dl>
      <dt>الباب</dt><dd>${r.bab} — ${GROUPS[r.g]}</dd>
      <dt>المحرّك (سبب الحكم)</dt><dd>${r.eng}</dd>
      <dt>شروط التطبيق</dt><dd>${r.cond}</dd>
      <dt>كيفية النطق</dt><dd>${r.pron}</dd>
      <dt>عدد المواضع في هذه السورة</dt><dd>${counts[r.k] || 0} كلمة</dd></dl>`;
  } else info.innerHTML = `<h3>أحكام المجموعة</h3><p class="muted">${[...sel].map(k => RULES[k].title).join(' · ')}<br>اختر حكماً واحداً لعرض شرحه المفصل.</p>`;
}

// ========== 6. الواجهة: السورة، الوضع الليلي، لوحة الموبايل ==========
$('surahSel').innerHTML = NAMES.map((n, i) => `<option value="${i + 1}">${i + 1}. ${n}</option>`).join('');
$('surahSel').onchange = e => loadSurah(+e.target.value);
$('themeBtn').onclick = () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t; $('themeBtn').textContent = t === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', t); } catch {}
};
$('themeBtn').textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
function openPanel(o) { $('panel').classList.toggle('open', o && innerWidth <= 900); $('scrim').hidden = !(o && innerWidth <= 900); }
$('panelBtn').onclick = () => openPanel(true); $('closePanel').onclick = $('scrim').onclick = () => openPanel(false);
loadSurah(Math.min(114, Math.max(1, parseInt(location.hash.slice(1)) || 1)));
