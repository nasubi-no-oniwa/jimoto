// =============================================
//  地元の最強  画面と進行
// =============================================
(function () {
  const JM = window.JM, D = JM.D, R = JM.R;
  const T = (k, v) => I18N.t(k, v);
  const JA = () => I18N.lang === 'ja';
  // 能力・政策・階級の名前（rules.js）を、いまの言語の表示にする。中身の数字はそのまま
  function relabelRules() {
    for (const x of JM.STATS) { x.n = T('st_' + x.k); x.from = T('stf_' + x.k); }
    for (const p of JM.POLICIES) { p.n = T('pol_' + p.k); p.t = T('polt_' + p.k); }
    for (const c of JM.CLASSES) { c.n = T('cls_' + c.k); c.t = T('clst_' + c.k); }
  }
  relabelRules();
  const $ = id => document.getElementById(id);
  const URL_GAME = 'https://nasubi-no-oniwa.github.io/jimoto/';
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const S = () => JM.S || { play() {}, bgm() {} };
  // ---------- 状態 ----------
  const st = {
    mode: 'local', pol: store('jm_pol') || 'pol', cls: store('jm_cls') || 'all',
    slots: [{ e: null, parts: null, dir: 0, cards: [] }, { e: null, parts: null, dir: 0, cards: [] }],
    my: -1,              // オンラインで自分が受け持つ側（ローカルは -1 ＝両方）
    match: null, live: null, speed: 1, result: null,
  };
  JM.st = st;
  function show(id) { for (const s of document.querySelectorAll('.screen')) s.classList.toggle('active', s.id === id); }
  let toastT = null;
  function toast(t) { const e = $('toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('on'), 2200); }
  JM.toast = toast;
  // ---------- 表示用 ----------
  const fmt = n => n.toLocaleString('ja-JP');
  function popText(e) {
    if (!e.pop) return T('pop_unknown');
    // 海外の州などの人口は、町の人口から割り振った大まかな推定なので、けただけ出す
    if (e.pe && e.p >= 100) { const b = [[1e7, 'pop_b0'], [1e6, 'pop_b1'], [1e5, 'pop_b2'], [1e4, 'pop_b3'], [0, 'pop_b4']].find(x => e.pop >= x[0])[1]; return T('pop_band', { b: T(b) }); }
    if (e.pe) return T('pop_est', { n: fmt(e.pop), y: e.py });
    return e.py ? T('pop_n_y', { n: fmt(e.pop), y: e.py }) : T('pop_n', { n: fmt(e.pop) });
  }
  function areaText(e) { return T('area', { a: e.a >= 100 ? fmt(Math.round(e.a)) : e.a.toFixed(1) }); }
  JM.popText = popText; JM.areaText = areaText;
  const editable = i => (st.mode === 'local' && !(st.chal && i === 1)) || st.my === i;
  // ---------- 1つの枠を描く ----------
  function renderSlot(i) { renderSlot0(i); renderTabs(); }
  function renderSlot0(i) {
    const el = $('slot' + i), s = st.slots[i], side = T('side' + i);
    R.freeIn(el);   // 前の絵のキャンバスを片づけてから描きなおす
    if (st.mode !== 'local' && i !== st.my && !st.reveal) {
      el.innerHTML = `<span class="sl-side">${side}</span><div class="hidden-foe">${T(st.mode === 'watch' ? 'foe_both' : (st.foeReady ? 'foe_ready' : 'foe_prep'))}<br>${T('foe_hidden')}</div>`;
      return;
    }
    if (!s.e) {
      el.innerHTML = `<span class="sl-side">${side}</span><div class="sl-empty"><div>${T('pick_prompt')}</div><div class="row"><button class="btn hot" data-pick="${i}">${T('pick')}</button><button class="btn" data-rand="${i}">${T('random')}</button></div></div>`;
      return;
    }
    const e = s.e, bd = D.badge(e), usePol = st.pol === 'pol';
    const comp = JM.compose(e.st, usePol ? s.cards : [], e.pop);
    const ed = editable(i);
    let h = `<span class="sl-side">${side}</span>
      <div class="sl-top">
        <div class="sl-shape"><canvas width="240" height="240" style="width:120px;height:120px" data-shape="${i}"></canvas>
          ${ed ? `<div class="dir"><button class="btn sm" data-rot="${i}" data-d="-1">⟲</button><button class="btn sm" data-rot="${i}" data-d="1">⟳</button></div>` : ''}
          <div class="dir-lab">${T('dir_lab', { d: s.dir * 45 })}</div></div>
        <div class="sl-info">
          <div class="sl-name"><small>${esc(e.dwhere || (e.dpn + ' ' + (e.dc || '')))}</small>${esc(e.dn)}<small>${JA() ? esc(e.kd) : ''}</small></div>
          <span class="badge ${bd.cur ? '' : 'old'}">${esc(bd.txt)}</span>
          <div class="sl-data">${areaText(e)}<br>${popText(e)}<br>${esc(D.years(e))}</div>
        </div>
      </div>
      <div class="sl-mid"><canvas width="300" height="270" style="width:150px;height:135px" data-radar="${i}"></canvas><div class="st-list">`;
    JM.STATS.forEach((x, k) => {
      const a = comp.add[x.k], tot = a[0] + a[1], v = comp.st[x.k];
      h += `<div><b>${x.n} <span>${x.from}</span></b><b>${v}${tot ? `<em class="${tot > 0 ? (a[1] > 0 ? 'kf' : 'up') : 'dn'}">${tot > 0 ? '＋' : '−'}${Math.abs(tot)}</em>` : ''}</b></div>`;
    });
    h += `</div></div>`;
    if (usePol) {
      const kf = JM.kofukin(e.pop);
      h += `<div class="pol-h"><b>${T('pol_head', { n: s.cards.length, m: JM.MAXCARDS })}</b><span class="bud">${T('budget', { a: comp.budget - comp.spent, b: comp.budget })}${kf ? `<span class="kof">${T('kof', { n: kf })}</span>` : ''}</span></div><div class="pols">`;
      let spent = 0; const kfSet = new Set();
      for (const k of s.cards) { const c = JM.POL[k].c; if (spent + c > JM.BASE_BUDGET) kfSet.add(k); spent += c; }
      for (const p of JM.POLICIES) {
        const on = s.cards.includes(p.k), can = on || JM.canAdd(s.cards, p.k, e.pop);
        h += `<button class="pol ${on ? 'on' : ''} ${kfSet.has(p.k) ? 'kf' : ''} ${can ? '' : 'no'}" data-pol="${i}" data-k="${p.k}" ${!ed ? 'disabled' : ''} ${can ? '' : 'aria-disabled="true"'}><i>${p.c}</i><b>${p.n}</b><small>${p.t}</small></button>`;
      }
      h += `</div>`;
    }
    if (!JM.inClass(st.cls, e.pop)) h += `<div class="cls-warn">${T('cls_warn', { n: JM.CLS[st.cls].n, t: JM.CLS[st.cls].t })}</div>`;
    if (ed) h += `<div class="sl-btns"><button class="btn sm" data-pick="${i}">${T('pick_other')}</button><button class="btn sm" data-rand="${i}">${T('random')}</button></div>`;
    el.innerHTML = h;
    const cv = el.querySelector('[data-shape]'); if (cv && s.parts) {
      const c = cv.getContext('2d'); if (c) { c.clearRect(0, 0, 240, 240);
      R.shapeIcon(c, s.parts, 120, 120, 170, s.dir, i, { facing: true, lw: 3 });
      // 相手のほうの矢印
      c.fillStyle = 'rgba(60,40,20,.55)'; c.font = '900 26px sans-serif'; c.textAlign = i ? 'left' : 'right'; c.fillText(T(i ? 'foe_l' : 'foe_r'), i ? 8 : 232, 228); }
    }
    const rv = el.querySelector('[data-radar]'); if (rv && rv.getContext('2d')) { const c = rv.getContext('2d'); c.clearRect(0, 0, 300, 270); c.save(); c.scale(2, 2); R.radar(c, 75, 70, 48, e.st, usePol ? comp.add : null, { fs: 10 }); c.restore(); }
  }
  function renderSlots() { renderSlot(0); renderSlot(1); updateFight(); }
  // スマホ縦：左右を上のつまみで切りかえる（2つ目を探して下までスクロールしなくてよいように）
  function setTab(i) { st.tab = i; $('slots').dataset.tab = i; renderTabs(); const el = $('slot' + i); if (el) el.scrollTop = 0; }
  JM.setTab = setTab;
  function renderTabs() {
    const box = $('side-tabs'); if (!box) return;
    R.freeIn(box);
    const one = i => {
      const s = st.slots[i], hide = st.mode !== 'local' && i !== st.my && !st.reveal;
      const nm = hide ? T(st.foeReady ? 'foe_ready' : 'foe_prep') : (s.e ? esc(s.e.dn) : T('tab_empty'));
      return `<button class="stab s${i} ${st.tab === i ? 'on' : ''} ${!s.e && !hide ? 'empty' : ''}" data-tab="${i}"><canvas width="88" height="88" data-tabshape="${i}"></canvas><span class="st-t"><small>${T('side' + i)}</small><b>${nm}</b></span></button>`;
    };
    box.innerHTML = one(0) + '<span class="st-vs">VS</span>' + one(1);
    for (let i = 0; i < 2; i++) {
      const s = st.slots[i], cv = box.querySelector(`[data-tabshape="${i}"]`), hide = st.mode !== 'local' && i !== st.my && !st.reveal;
      const c = cv && cv.getContext('2d'); if (!c) continue;
      c.clearRect(0, 0, 88, 88);
      if (s.parts && !hide) R.shapeIcon(c, s.parts, 44, 44, 70, s.dir, i, { facing: true, lw: 2 });
      else { c.fillStyle = 'rgba(60,40,20,.25)'; c.font = '900 44px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 44, 47); }
    }
  }
  function updateFight() {
    const b = $('btn-fight');
    const okc = i => st.slots[i].e && JM.inClass(st.cls, st.slots[i].e.pop);
    if (st.mode === 'local') { b.disabled = !(okc(0) && okc(1)); b.textContent = T('fight_btn'); return; }
    if (st.mode === 'watch') { b.disabled = true; b.textContent = T('watching'); return; }
    const mine = st.slots[st.my];
    b.disabled = !okc(st.my) || !!st.myReady; b.textContent = T(st.myReady ? 'ready_wait' : 'ready_ok');
  }
  // ---------- 市町村をセット ----------
  async function setSlot(i, e) {
    const s = st.slots[i]; s.e = e; s.parts = null; s.cards = s.cards.filter(k => JM.canAdd(s.cards.filter(x => x !== k), k, e.pop));
    renderSlot(i);
    try { s.parts = await D.shape(e.id); } catch (er) { toast(T('shape_err')); }
    if (s.e === e) renderSlot(i);
    saveSlots(); updateFight(); if (st.mode !== 'local' && JM.Net) JM.Net.changed();
  }
  JM.setSlot = setSlot;
  function saveSlots() { if (st.mode === 'local' && !st.chal && !st.tmp) store('jm_slots', JSON.stringify(st.slots.map(s => ({ id: s.e && s.e.id, dir: s.dir, cards: s.cards })))); }
  async function loadSlots() {
    try {
      const v = JSON.parse(store('jm_slots') || 'null'); if (!v) return;
      for (let i = 0; i < 2; i++) { const e = v[i] && D.byId.get(v[i].id); if (e) { st.slots[i].dir = v[i].dir | 0; st.slots[i].cards = (v[i].cards || []).filter(k => JM.POL[k]); await setSlot(i, e); } }
    } catch (e) {}
  }
  // ---------- 検索 ----------
  let pickFor = 0;
  function openPicker(i) {
    pickFor = i; $('picker').classList.add('on'); $('pk-q').value = ''; $('pk-list').innerHTML = ''; const cl = JM.CLS[st.cls]; $('pk-hint').textContent = (st.cls === 'all' ? T('pk_all', { n: fmt(D.list.length) }) : T('pk_cls', { c: cl.n, t: cl.t })) + T('pk_eg');
    setTimeout(() => $('pk-q').focus(), 50);
  }
  function runSearch() {
    const q = $('pk-q').value, res = D.search(q, 120, st.cls === 'all' ? null : st.cls), ul = $('pk-list');
    if (!q.trim()) { ul.innerHTML = ''; return; }
    if (!res.length) {
      // 階級でしぼっているせいで見つからないときは、そう伝える
      const all = st.cls !== 'all' ? D.search(q, 1, null).length : 0;
      ul.innerHTML = all ? `<li class="pk-note">${T('pk_notcls', { c: esc(JM.CLS[st.cls].n), n: D.lastCount })}</li>` : '<li class="pk-note">' + T('pk_nf') + '</li>';
      return;
    }
    const more = D.lastCount > res.length ? `<li class="pk-note">${T('pk_more', { n: D.lastCount, m: res.length })}</li>` : '';
    const ja = JA();
    // 外国語：名前を大きく、その下に「どこの何か」（県・国・郡）
    const nmOf = e => ja ? `${e.where ? '<small>' + esc(e.where) + '</small> ' : esc(e.pn) + ' ' + (e.c ? '<small>' + esc(e.c) + '</small> ' : '')}${esc(e.n)}` : esc(e.dn);
    const knOf = e => ja ? esc(e.kd) : esc(e.dwhere || (e.dpn + (e.dc ? ' ' + e.dc : '')));
    ul.innerHTML = more + res.map(e => { const b = D.badge(e); return `<li data-id="${e.id}"><div><span class="nm">${nmOf(e)}</span><span class="kn">${knOf(e)}</span></div><div class="bd"><span class="badge ${b.cur ? '' : 'old'}">${esc(b.txt)}</span></div></li>`; }).join('');
  }
  // ---------- 試合 ----------
  function defOf(i) {
    const s = st.slots[i], usePol = st.pol === 'pol', comp = JM.compose(s.e.st, usePol ? s.cards : [], s.e.pop);
    return { key: s.e.id, parts: s.parts, st: comp.st, pol: usePol ? s.cards.slice() : [] };
  }
  JM.defOf = defOf;
  function shortName(e) { return JA() ? (e.p >= 100 ? e.pn + ' ' + e.n : e.n) : (e.p >= 100 ? D.fname(e) : e.dn); }
  // 全部を先に計算して結果を知っておく → そのあと同じ計算を見せる
  function startBattle(fromNet) {
    if (!st.slots[0].parts || !st.slots[1].parts) { toast(T('shape_loading')); return; }
    const a = defOf(0), b = defOf(1), d0 = st.slots[0].dir, d1 = st.slots[1].dir;
    const pre = new JM.Match(a, b, d0, d1); let lastHit = 0, lastEv = null;
    while (!pre.over) { pre.tick(); for (const e of pre.ev) if (e.k === 'hit') { lastHit = pre.step; lastEv = e; } pre.ev.length = 0; }
    st.result = { winner: pre.winner, digest: pre.digest(), t: pre.t, ra: pre.A.ratio(), rb: pre.B.ratio(), endBy: pre.endBy, lastHit, lastEv, hitN: pre.hitN };
    st.live = new JM.Match(a, b, d0, d1); st.liveT = -1.4; st.acc = 0; st.done = false; st.goSaid = false; st.slow = false;
    $('hn0').textContent = shortName(st.slots[0].e); $('hn1').textContent = shortName(st.slots[1].e);
    show('s-battle'); $('result').classList.remove('on'); R.fx = [];
    st.recKey = st.result.digest + '|' + d0 + d1 + '|' + (a.pol.join(',')) + '|' + (b.pol.join(','));
    if (st.recWant) {
      st.recWant = false;
      if (JM.Rec.start(st.recKey)) { st.recLive = true; recBar(); }
      else { st.recLive = false; st.makingVid = false; toast(T('vid_nosup')); }
    } else if (JM.Rec.recording()) { JM.Rec.cancel(); st.recLive = false; st.makingVid = false; }
    recBar();
    call(T('call_ready'), 1.1); S().play('start'); S().bgm('battle');
    if (JM.Net && !fromNet) JM.Net.digest && 0;
    return st.result;
  }
  JM.startBattle = startBattle;
  let callT = null;
  function call(t, sec) { const c = $('call'); c.innerHTML = t; c.classList.add('on'); st.callTxt = t; clearTimeout(callT); if (sec) callT = setTimeout(() => { c.classList.remove('on'); st.callTxt = ''; }, sec * 1000); }
  function liveStep(dt) {
    const m = st.live; if (!m) return;
    st.liveT += dt;
    if (st.liveT < 0) return;
    if (st.liveT < 0.3 && !st.goSaid) { st.goSaid = true; call(T('call_go'), 0.7); S().play('go'); }
    // 決着の少し前からスロー
    let k = st.speed; const toEnd = st.result.lastHit - m.step;
    if (st.result.endBy === 'break' && toEnd >= 0 && toEnd < 60) k = 0.22;
    st.slow = k < 0.5;
    st.acc += dt * k; let n = 0;
    while (st.acc >= JM.DT && !m.over && n < 40) {
      m.tick(); st.acc -= JM.DT; n++;
      for (const e of m.ev) {
        if (e.k === 'hit') { R.hit(e); const br = e.br[0] + e.br[1]; S().play(br > 0.4 ? 'break' : br > 0 ? 'crack' : 'hit', Math.min(1, e.v / 14)); }
        else if (e.k === 'wall') S().play('wall', Math.min(1, e.v / 10));
      }
      m.ev.length = 0;
    }
    if (m.over && !st.done) { st.done = true; setTimeout(finish, 900); }
  }
  function finish() {
    const m = st.live, r = st.result;
    const e0 = st.slots[0].e, e1 = st.slots[1].e;
    let t, line;
    if (r.winner < 0) { t = T('draw'); line = T('draw_line', { a: D.fname(e0), b: D.fname(e1) }); }
    else { const w = r.winner ? e1 : e0, l = r.winner ? e0 : e1; t = T('wins', { n: w.p >= 100 ? D.fname(w) : w.dn }); line = T('win_line', { w: D.fname(w), l: D.fname(l) }); }
    // 下剋上：もとの能力の合計がずっと下の方が勝った
    st.gk = r.winner >= 0 && (JM.statSum((r.winner ? e0 : e1).st) - JM.statSum((r.winner ? e1 : e0).st) >= JM.GEKOKUJO);
    if (st.gk) line = T('gk_prefix') + line;
    call((st.gk ? T('gk_call') + '\n' : '') + t + (r.endBy === 'time' ? '<small>' + T('time_small') + '</small>' : ''), st.gk ? 2.2 : 1.6);
    S().play(r.winner < 0 ? 'draw' : 'win');
    if (JM.Net && st.mode !== 'local') JM.Net.finished(r);
    setTimeout(() => {
      $('res-t').innerHTML = (st.gk ? '<span class="gk">' + T('gk_badge') + '</span><br>' : '') + esc(t); $('res-line').textContent = line + (r.endBy === 'time' ? T('time_judge') : '');
      prepareImage(line);
      $('res-note').textContent = st.mode === 'local' ? T('res_note_local') : (st.netNote || '');
      $('btn-chal-put').hidden = !(st.mode === 'local' && !st.chal); $('btn-chal-next').hidden = !st.chal;
      if (st.chal) { $('res-line').textContent = line + T('rec_ing'); JM.Chal.onResult(r.winner).then(t => { if (t) $('res-line').textContent = t; }); }
      $('btn-change').textContent = T(st.mode === 'local' ? (st.chal ? 'change_mine' : 'change_pair') : (st.mode === 'watch' ? 'back' : 'rematch_re'));
      $('result').classList.add('on');
      if (st.recLive && JM.Rec.recording()) {
        const k = st.recKey, making = st.makingVid; st.recLive = false; recBar();
        JM.Rec.stop(b => { if (making) { st.makingVid = false; if (st.speedKeep) { st.speed = st.speedKeep; st.speedKeep = 0; $('btn-speed').textContent = '×' + st.speed; } } vidBtn(); if (b && making && st.recKey === k) openVid(); else if (!b && making) toast(T('vid_fail')); });
      }
      vidBtn();
    }, 1500);
  }
  // ---------- 試合の動画 ----------
  // はっけよいの前に「録画しますか？」と聞く（録画できないブラウザでは聞かない）
  function askRec(go) {
    if (!JM.Rec.supported()) { st.recWant = false; go(); return; }
    const q = $('recq'); q.classList.add('on');
    const last = store('jm_rec') === '1';
    $('rq-yes').classList.toggle('pick', last); $('rq-no').classList.toggle('pick', !last);
    const done = v => { q.classList.remove('on'); store('jm_rec', v ? '1' : '0'); st.recWant = v; st.makingVid = false; S().play('ui'); go(); };
    $('rq-yes').onclick = () => done(true); $('rq-no').onclick = () => done(false);
  }
  // 録画しなかった試合を、あとから動画にするときにかかる秒数（途中は2倍速、決着はスロー）
  function vidSecs() {
    const r = st.result; if (!r) return 0;
    const sp = 2, end = r.t, slowS = r.endBy === 'break' ? Math.min(60, r.lastHit) * JM.DT : 0, lh = r.lastHit * JM.DT;
    const before = Math.max(0, (r.endBy === 'break' ? lh - slowS : end)) / sp, after = r.endBy === 'break' ? Math.max(0, end - lh) / sp : 0;
    return Math.ceil(1.4 + before + slowS / 0.22 + after + 0.9 + 1.5);
  }
  function vidBtn() {
    const b = $('btn-vid'); if (!b) return;
    if (!JM.Rec.supported()) { b.hidden = true; return; }
    b.hidden = false;
    const ready = JM.Rec.blob(st.recKey);
    if (ready) { b.disabled = false; b.textContent = T('vid_post'); }
    else if (JM.Rec.state() === 'stopping' && JM.Rec.key() === st.recKey) { b.disabled = true; b.textContent = T('vid_finishing'); }
    else { b.disabled = false; b.textContent = T('vid_make', { s: vidSecs() }); }
  }
  // 録画中の帯（動画には映らない）
  function recBar() {
    const bar = $('rec-bar'); if (!bar) return;
    const on = JM.Rec.recording();
    bar.hidden = !on;
    if (!on) return;
    if (st.makingVid) {
      const left = Math.max(1, Math.ceil(st.vidEnd - performance.now() / 1000));
      $('rec-txt').textContent = T('vid_making', { s: left }); $('rec-cancel').hidden = false;
    } else { $('rec-txt').textContent = T('rec_on'); $('rec-cancel').hidden = false; }
  }
  function makeVid() {
    if (!JM.Rec.supported()) { toast(T('vid_nosup')); return; }
    $('result').classList.remove('on');
    st.makingVid = true; st.recWant = true; st.vidEnd = performance.now() / 1000 + vidSecs();
    st.speedKeep = st.speed; st.speed = 2; $('btn-speed').textContent = '×2';
    startBattle(true);
  }
  function openVid() {
    const blob = JM.Rec.blob(st.recKey); if (!blob) { vidBtn(); return; }
    const v = $('vv'), old = v.src; if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
    v.src = URL.createObjectURL(blob); try { v.play(); } catch (e) {}
    $('vv-note').textContent = !JM.Rec.isMp4() ? T('vid_webm') : JM.Rec.xSafe() ? '' : T('vid_maybe');
    $('vidview').classList.add('on');
  }
  function vidFile() { const b = JM.Rec.blob(st.recKey); return b ? new File([b], 'jimoto-saikyo.' + JM.Rec.ext(), { type: b.type }) : null; }
  function saveVid() {
    const b = JM.Rec.blob(st.recKey); if (!b) return;
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'jimoto-saikyo.' + JM.Rec.ext(); document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  async function shareVid() {
    const f = vidFile(); if (!f) return;
    try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: st.shareText }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    saveVid();
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(st.shareText), '_blank');
    toast(T('vid_saved_paste'));
  }
  // ---------- 結果の画像 ----------
  // 結果画像：「勝利画像を出す」を押したときに作る（決着の瞬間の絵を使うので、試合の最後の状態から描く）
  function prepareImage(line) {
    const r = st.result, me = st.mode === 'local' ? -1 : st.my;
    st.imgReady = false; st.imgLine = line;
    r.gk = st.gk;
    const lose = me >= 0 && r.winner >= 0 && r.winner !== me;
    $('btn-img').textContent = T(r.winner < 0 || lose ? 'img_result' : 'img_win');
    // 投稿文
    const c = st.chal, tags = JM.resultTags(r, st.slots[0].e, st.slots[1].e).map(x => x.t.replace(/[！!]$/, ''));
    let text = (tags.length ? T('sh_tags', { t: tags.join(T('sh_tag_sep')) }) : '') + line;
    if (c) text += T('sh_chal', { n: JM.who(c.n), u: JM.Chal.link(c.id) });
    else text += '\n' + URL_GAME;
    st.shareText = text + '\n' + T('hashtag');
  }
  async function openImage() {
    const r = st.result; if (!r || !st.live) return;
    const cv = $('res-img'), btn = $('btn-img'); btn.disabled = true; const t0 = btn.textContent; btn.textContent = T('img_making');
    try {
      if (!st.imgReady) {
        await JM.drawResultImage(cv, { m: st.live, r, e: [st.slots[0].e, st.slots[1].e], cards: [st.slots[0].cards, st.slots[1].cards], pol: st.pol === 'pol', chal: st.chal, url: URL_GAME });
        st.imgReady = true;
      }
      const old = $('iv-img').src; if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
      $('iv-img').src = await new Promise(res => cv.toBlob(b => res(b ? URL.createObjectURL(b) : cv.toDataURL('image/png')), 'image/png'));
      $('imgview').classList.add('on');
    } catch (e) { toast(T('img_fail')); }
    btn.disabled = false; btn.textContent = t0;
  }
  async function share() {
    const cv = $('res-img');
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    const file = new File([blob], 'jimoto.png', { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: st.shareText }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    saveImg(blob);
    const u = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(st.shareText);
    window.open(u, '_blank');
    toast(T('img_saved_paste'));
  }
  function saveImg(blob) {
    const go = b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'jimoto-saikyo.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
    if (blob) go(blob); else $('res-img').toBlob(go, 'image/png');
  }
  // ---------- 毎フレーム ----------
  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const scr = document.querySelector('.screen.active');
    if (scr && scr.id === 's-battle' && st.live) {
      liveStep(dt);
      const m = st.live;
      const nms = [shortName(st.slots[0].e), shortName(st.slots[1].e)];
      try { R.draw(m, { names: nms, dt: st.slow ? dt * 0.3 : dt, top: 46, bot: 10 }); } catch (e) { if (!st.drawErr) { st.drawErr = 1; console.error(e); } }
      if (JM.Rec.recording()) { try { JM.Rec.frame(m, { names: nms, call: st.callTxt }); } catch (e) {} if (st.makingVid) recBar(); }
      for (let i = 0; i < 2; i++) { const r = (i ? m.B : m.A).ratio(); $('hg' + i).style.width = Math.max(0, Math.min(100, (r - 0) * 100)) + '%'; $('hv' + i).textContent = Math.round(r * 100) + '%'; }
      $('clock').textContent = Math.max(0, Math.ceil(JM.TMAX - m.t));
    } else {
      if (JM.Rec.recording()) { JM.Rec.cancel(); st.recLive = false; st.makingVid = false; recBar(); }
      if (st.idle) idleDraw(dt);
    }
  }
  // タイトルの後ろ：ゆっくり戦っている
  function idleDraw(dt) {
    const m = st.idle; let n = 0; st.idleAcc = (st.idleAcc || 0) + dt * 0.7;
    while (st.idleAcc >= JM.DT && n < 20) { m.tick(); st.idleAcc -= JM.DT; n++; for (const e of m.ev) if (e.k === 'hit') R.hit(e); m.ev.length = 0; }
    try { R.draw(m, { dt }); } catch (e) {}
    if (m.over) { st.idleWait = (st.idleWait || 0) + dt; if (st.idleWait > 2) { st.idleWait = 0; newIdle(); } }
  }
  async function newIdle() {
    const picks = ['01202A1968', '21203A1968', '13101A1968', '44B0100003', '42201A1968', '17204A1968', '39B0020014', '01100A1972', '26100A1968', '47201A1968'];
    const c = picks.filter(id => D.byId.has(id)); const pool = c.length >= 2 ? c : D.list.slice(0, 50).map(e => e.id);
    const k = (st.idleN = (st.idleN || 0) + 1);
    const a = D.byId.get(pool[k % pool.length]), b = D.byId.get(pool[(k * 3 + 1) % pool.length]);
    try {
      const [pa, pb] = await Promise.all([D.shape(a.id), D.shape(b.id)]);
      st.idle = new JM.Match({ key: a.id, parts: pa, st: JM.compose(a.st, [], a.pop).st, pol: [] }, { key: b.id, parts: pb, st: JM.compose(b.st, [], b.pop).st, pol: [] }, k % 8, (k * 5) % 8);
    } catch (e) {}
  }
  // ---------- ボタン ----------
  function bind() {
    $('btn-play').onclick = () => { S().unlock && S().unlock(); S().play('ui'); if (st.chal || st.tmp || st.mode !== 'local') { st.chal = null; st.tmp = false; st.mode = 'local'; loadSlots(); } st.mode = 'local'; st.my = -1; st.reveal = true; openSetup(); };
    $('btn-chal').onclick = () => { S().unlock && S().unlock(); S().play('ui'); JM.Chal.open(); };
    $('btn-chal-put').onclick = () => { S().play('ui'); JM.Chal.put(); };
    $('btn-chal-next').onclick = () => { S().play('ui'); $('result').classList.remove('on'); JM.Chal.open(); };
    $('btn-howto').onclick = () => { S().play('ui'); show('s-howto'); };
    $('btn-how-back').onclick = () => { S().play('ui'); show('s-title'); };
    $('btn-setup-back').onclick = () => { S().play('ui'); if (st.mode !== 'local' && JM.Net) JM.Net.leave(); toTitle(); };
    $('btn-snd').onclick = () => { S().unlock && S().unlock(); const m = !(JM.mute && JM.mute()); JM.mute && JM.mute(m); $('snd-name').textContent = T(m ? 'snd_off' : 'snd_on'); };
    for (const b of document.querySelectorAll('.seg')) b.onclick = () => { if (st.mode === 'watch' || (st.mode === 'net' && st.reveal)) return; if (st.rnd || st.chal) { toast(T(st.rnd ? 'rnd_rule' : 'chal_rule')); return; } st.pol = b.dataset.mode; store('jm_pol', st.pol); syncMode(); renderSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); };
    document.addEventListener('click', ev => {
      const t = ev.target.closest('[data-pick],[data-rand],[data-rot],[data-pol]'); if (!t) return;
      S().play('ui');
      if (t.dataset.pick != null) openPicker(+t.dataset.pick);
      else if (t.dataset.rand != null) setSlot(+t.dataset.rand, D.random(st.cls));
      else if (t.dataset.rot != null) { const i = +t.dataset.rot, s = st.slots[i]; s.dir = (s.dir + (+t.dataset.d) + 8) % 8; renderSlot(i); saveSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); }
      else if (t.dataset.pol != null) { const i = +t.dataset.pol, s = st.slots[i], k = t.dataset.k; if (s.cards.includes(k)) s.cards = s.cards.filter(x => x !== k); else if (JM.canAdd(s.cards, k, s.e.pop)) s.cards.push(k); else { toast(T(s.cards.length >= JM.MAXCARDS ? 'pol_full' : 'pol_nobudget', { m: JM.MAXCARDS })); return; } renderSlot(i); saveSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); }
    });
    $('side-tabs').onclick = ev => { const b = ev.target.closest('[data-tab]'); if (!b) return; S().play('ui'); setTab(+b.dataset.tab); };
    $('pk-q').oninput = () => { clearTimeout(st.sT); st.sT = setTimeout(runSearch, 120); };
    $('pk-close').onclick = () => $('picker').classList.remove('on');
    $('pk-rand').onclick = () => { $('picker').classList.remove('on'); setSlot(pickFor, D.random(st.cls)); };
    $('pk-list').onclick = ev => { const li = ev.target.closest('li[data-id]'); if (!li) return; S().play('ui'); $('picker').classList.remove('on'); setSlot(pickFor, D.byId.get(li.dataset.id)); };
    $('btn-fight').onclick = () => { S().unlock && S().unlock(); if (st.mode === 'local') askRec(() => startBattle()); else if (JM.Net) askRec(() => JM.Net.ready()); };
    $('btn-vid').onclick = () => { S().play('ui'); if (JM.Rec.blob(st.recKey)) openVid(); else if (JM.Rec.state() !== 'stopping') makeVid(); };
    $('rec-cancel').onclick = () => { S().play('ui'); JM.Rec.cancel(); st.recLive = false; recBar(); if (st.makingVid) { st.makingVid = false; if (st.speedKeep) { st.speed = st.speedKeep; st.speedKeep = 0; $('btn-speed').textContent = '×' + st.speed; } const m = st.live; if (m && !m.over) { while (!m.over) { m.tick(); m.ev.length = 0; } } } };
    $('vv-share').onclick = () => shareVid();
    $('vv-save').onclick = () => saveVid();
    $('vv-close').onclick = () => { $('vidview').classList.remove('on'); try { $('vv').pause(); } catch (e) {} };
    $('vidview').onclick = ev => { if (ev.target.id === 'vidview') $('vv-close').onclick(); };
    $('btn-speed').onclick = () => { st.speed = st.speed === 1 ? 2 : st.speed === 2 ? 4 : 1; $('btn-speed').textContent = '×' + st.speed; };
    $('btn-skip').onclick = () => { const m = st.live; if (!m || m.over) return; while (!m.over) { m.tick(); m.ev.length = 0; } };
    $('btn-share').onclick = () => share();
    $('btn-img').onclick = () => { S().play('ui'); openImage(); };
    $('iv-close').onclick = () => $('imgview').classList.remove('on');
    $('imgview').onclick = ev => { if (ev.target.id === 'imgview') $('imgview').classList.remove('on'); };
    $('btn-save').onclick = () => saveImg();
    $('btn-replay').onclick = () => { S().play('ui'); startBattle(true); };
    $('btn-change').onclick = () => { S().play('ui'); $('result').classList.remove('on'); if (st.mode === 'watch') { if (JM.Net) JM.Net.leave(); toTitle(); return; } if (st.mode !== 'local' && JM.Net) JM.Net.again(); openSetup(); };
    $('btn-online').onclick = () => { S().unlock && S().unlock(); S().play('ui'); $('in-name').value = store('jm_name') || ''; $('in-code').value = store('jm_code') || ''; $('on-form').classList.remove('hide'); $('on-wait').classList.add('hide'); $('on-err').textContent = ''; show('s-online'); };
    $('btn-on-back').onclick = () => { S().play('ui'); if (JM.Net) JM.Net.leave(); toTitle(); };
    $('btn-join').onclick = () => { if (JM.Net) JM.Net.join($('in-name').value, $('in-code').value); };
  }
  function syncMode() { for (const b of document.querySelectorAll('.seg')) b.classList.toggle('on', b.dataset.mode === st.pol); $('cls-sel').value = st.cls; $('cls-sel').disabled = st.mode === 'watch' || (st.mode === 'net' && st.reveal) || !!st.rnd || !!st.chal; }
  function openSetup() { syncMode(); setTab(st.mode !== 'local' && st.my >= 0 ? st.my : (st.tab || 0)); show('s-setup'); $('on-st').textContent = st.mode === 'local' ? '' : st.netStatus || ''; if (JM.Chal) JM.Chal.header(); renderSlots(); S().bgm('title'); }
  JM.openSetup = openSetup; JM.renderSlots = renderSlots; JM.show = show; JM.syncMode = syncMode;
  function toTitle() { QM.ended(); st.rnd = false; if (st.chal || st.mode !== 'local' || st.tmp) { st.chal = null; st.tmp = false; st.mode = 'local'; loadSlots(); } st.mode = 'local'; st.my = -1; st.reveal = true; st.live = null; if (JM.Chal) JM.Chal.mineSummary(); $('result').classList.remove('on'); show('s-title'); S().bgm('title'); if (!st.idle) newIdle(); }
  JM.toTitle = toTitle;
  // ---------- だれかと対戦（ランダム対戦） ----------
  function setupQM() {
    QM.setup({
      game: 'jimoto', ver: 'v5', name: '地元の最強',
      getDb: () => JM.getDb(), anchor: '#btn-online', anchorWhere: 'before', btnClass: 'btn big hot', nextClass: 'btn', nameKey: 'jm_name',
      join: (code, name) => { S().unlock && S().unlock(); JM.Net.join(name, code); },
      cpu: () => JM.Chal.open(true), cpuLabel: () => T('cpu_wait_chal'),
      quit: () => { if (JM.Net) JM.Net.leave(); toTitle(); },
      colors: { main: 'var(--red)', alt: 'var(--blue)', bg: '#f6eedb', fg: '#2a211b' },
    });
    QM.resultSlot('#result .sheet-in', '#chal-row');
    JM.Chal.mineSummary(true);
  }
  async function boot() {
    R.init($('arena'));
    clsOptions();
    $('cls-sel').onchange = () => { st.cls = $('cls-sel').value; store('jm_cls', st.cls); S().play('ui'); renderSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); };
    bind(); JM.Chal.bind(); setupQM();
    $('snd-name').textContent = T(JM.mute && JM.mute() ? 'snd_off' : 'snd_on');
    requestAnimationFrame(frame);
    $('loading').textContent = T('loading');
    try { await D.load(); $('loading').textContent = T('loaded_n', { n: fmt(D.list.length) }); } catch (e) { st.loadErr = true; $('loading').textContent = T('load_err2'); return; }
    newIdle(); await loadSlots();
    JM.Chal.fromLink();
  }
  JM.boot = boot;
  // 階級のえらび（ことばで作りなおす。えらんでいるものはそのまま）
  function clsOptions() {
    const sel = $('cls-sel'), v = sel.value || st.cls;
    sel.innerHTML = JM.CLASSES.map(c => `<option value="${c.k}">${esc(T('cls_opt_' + c.k))}</option>`).join('');
    sel.value = v;
  }
  // ---------- ことばの切りかえ ----------
  const onScreen = id => { const s = document.querySelector('.screen.active'); return s && s.id === id; };
  document.addEventListener('langchange', () => {
    relabelRules(); clsOptions();
    $('snd-name').textContent = T(JM.mute && JM.mute() ? 'snd_off' : 'snd_on');
    $('loading').textContent = D.ready ? T('loaded_n', { n: fmt(D.list.length) }) : T(st.loadErr ? 'load_err2' : 'loading');
    if (onScreen('s-setup')) { renderSlots(); if (JM.Chal) JM.Chal.header(); }
    vidBtn(); recBar();
  });
  // 地名の表示がかわったら（data.js が出す）、地名を出している画面を描きなおす
  document.addEventListener('namesrelabeled', () => { if (onScreen('s-setup')) renderSlots(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
