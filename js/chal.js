// =============================================
//  地元の最強  挑戦状
//  ・試合のあとに「挑戦状を置く」：市町村・向き・政策を名前つきで置いていく
//  ・「挑戦状と戦う」：だれかが置いた挑戦状と、いつでも戦える（相手がその場にいなくてよい）
//  ・挑戦状ごとのリンク（?c=ID）で、その挑戦状と直接戦える
//  ・「あなたの挑戦状」：1枚ずつの成績・最近の挑戦者・引退・引き継ぎコード
//  ・破られたお知らせ（タイトル）と、仕返し
//  ・番付：県・国ごとに、この30日で挑戦者を倒した数で決まる。勝ちは試合を計算しなおして確かめる
//
//  データの形
//   jm_chal/{id}     : { e: 市町村id, n: なまえ, d: 向き0-7, c: 政策（,区切り）, m: 'pol'|'nopol', t: 置いた時刻, w: 勝ち, l: 負け, p: 地域, u: 最後に戦われた時刻 }
//   jm_res/{id}/{rid}: { e, n, d, c: 挑んだ側の市町村・なまえ・向き・政策, w: 1=挑戦状が負けた 0=挑戦状が勝った, t }
//   jm_own/{id}      : 引退の合いかぎ（だれも読めない）
//   jm_retire/{id}/{合いかぎ}: true（引退した挑戦状）
//   jm_xfer/{コード} : { v: 'id:合いかぎ,…', t }（引き継ぎ）
//   ※管理人が Firebase の画面で jm_chal/{id}/x = true をつけると、その挑戦状はどこにも出なくなる
// =============================================
(function () {
  const JM = window.JM, D = JM.D;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const URL_GAME = 'https://nasubi-no-oniwa.github.io/jimoto/';
  const DAY = 86400000, BZ_DAYS = 30;
  const MINE_MAX = 20;          // 1台で持っておける挑戦状の数
  const DONE_MAX = 400;         // 成績をつけた挑戦状（同じ挑戦状で何度も成績をつけないため）
  const LIST_N = 200;           // 新しい方から何枚の中から選ぶか
  const C = JM.Chal = {};
  let cache = null, cacheAt = 0, retired = null, retiredAt = 0;
  const mine = () => store.get('jm_mychal', []);
  const toks = () => store.get('jm_mytok', {});
  const done = () => store.get('jm_chaldone', []);
  const st = () => JM.st;
  const recText = c => (c.w || c.l) ? `${c.w || 0}勝${c.l || 0}敗` : 'まだだれも挑戦していない';
  const myName = () => { try { return localStorage.getItem('jm_name') || ''; } catch (e) { return ''; } };
  const rid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  const polText = c => { const ks = String(c.c || '').split(',').filter(k => JM.POL[k]); return c.m === 'nopol' ? '政策なし' : ks.length ? ks.map(k => JM.POL[k].n).join('・') : '政策カードなし'; };
  C.link = id => URL_GAME + '?c=' + encodeURIComponent(id);

  // ---------- 通信 ----------
  async function db() { return JM.getDb(); }
  const DBURL = () => JM.FIREBASE_CONFIG.databaseURL;
  async function rest(path, q) {
    const qs = q ? '?' + Object.entries(q).map(([k, v]) => k + '=' + encodeURIComponent(typeof v === 'string' && k !== 'shallow' ? JSON.stringify(v) : String(k === 'limitToLast' || k === 'limitToFirst' || k === 'shallow' ? v : JSON.stringify(v)))).join('&') : '';
    const r = await fetch(DBURL() + '/' + path + '.json' + qs, { cache: 'no-store' });
    if (!r.ok) throw new Error('http ' + r.status);
    return r.json();
  }
  C.rest = rest;
  // 引退した挑戦状のID（1分は使い回す）
  async function retiredSet(force) {
    if (!force && retired && Date.now() - retiredAt < 60000) return retired;
    try { const v = await rest('jm_retire', { shallow: true }); retired = new Set(Object.keys(v || {})); } catch (e) { retired = retired || new Set(); }
    retiredAt = Date.now(); return retired;
  }
  const usable = (c, ret) => c && !c.x && D.byId.has(c.e) && !ret.has(c.id);
  // 新しい挑戦状の一覧（1分は使い回す）
  async function list(force) {
    if (!force && cache && Date.now() - cacheAt < 60000) return cache;
    const [v, ret] = await Promise.all([rest('jm_chal', { orderBy: 't', limitToLast: LIST_N }), retiredSet(force)]);
    const out = []; for (const id in v || {}) { const c = Object.assign({ id }, v[id]); if (usable(c, ret)) out.push(c); }
    out.sort((a, b) => a.t - b.t);
    cache = out; cacheAt = Date.now(); return out;
  }
  async function getChal(id) { const v = await rest('jm_chal/' + id); return v ? Object.assign({ id }, v) : null; }

  // ---------- 地域（番付の単位） ----------
  // 日本：都道府県ごと（J01〜J47）。世界の国・昔の国：W。海外の州・都市・町：国ごと（C+番号）
  JM.region = e => e.p <= 47 ? 'J' + String(e.p).padStart(2, '0') : e.p === 48 ? 'W' : 'C' + e.p;
  let regions = null;
  JM.regions = function () {
    if (regions) return regions;
    const jp = D.pref.slice(0, 47).map((n, i) => ({ k: 'J' + String(i + 1).padStart(2, '0'), n })), seen = new Map();
    for (const e of D.list) if (e.p >= 100 && !seen.has(e.p)) seen.set(e.p, e.pn);
    const world = [...seen.entries()].map(([p, n]) => ({ k: 'C' + p, n })).sort((a, b) => a.n.localeCompare(b.n, 'ja'));
    regions = { jp, world, all: [...jp, { k: 'W', n: '世界の国・昔の国' }, ...world] };
    regions.name = k => (regions.all.find(r => r.k === k) || { n: '' }).n;
    return regions;
  };

  // ---------- 試合を計算しなおして、成績が本物か確かめる ----------
  const ver = () => store.get('jm_ver', {});
  async function defOf(e, d, cardsStr, pol) {
    const parts = await D.shape(e.id), cards = pol ? String(cardsStr || '').split(',').filter(k => JM.POL[k]) : [];
    return { def: { key: e.id, parts, st: JM.compose(e.st, cards, e.pop).st, pol: cards }, d: (d | 0) & 7 };
  }
  // r：jm_res の1件。挑んだ側は左（A）、挑戦状は右（B）で戦っている
  C.verify = async function (c, r, key) {
    const cache = ver(); if (key && cache[key] != null) return !!cache[key];
    const ea = D.byId.get(r.e), eb = D.byId.get(c.e); if (!ea || !eb) return false;
    const pol = c.m !== 'nopol';
    const [a, b] = await Promise.all([defOf(ea, r.d, r.c, pol), defOf(eb, c.d, c.c, pol)]);
    const m = new JM.Match(a.def, b.def, a.d, b.d);
    while (!m.over) { m.tick(); m.ev.length = 0; }
    const ok = (m.winner === 0 && r.w === 1) || (m.winner === 1 && r.w === 0);
    if (key) { const v = ver(); v[key] = ok ? 1 : 0; const ks = Object.keys(v); if (ks.length > 1500) for (const k of ks.slice(0, ks.length - 1500)) delete v[k]; store.set('jm_ver', v); }
    return ok;
  };

  // ---------- 挑戦状と戦う ----------
  C.open = async function (fromWait) {
    try {
      if (!D.ready) throw new Error('市町村を読みこみ中です。少し待ってください');
      JM.toast('挑戦状をさがしています…');
      const L = await list();
      const my = new Set(mine()), dn = new Set(done());
      let cand = L.filter(c => !my.has(c.id) && !dn.has(c.id));
      if (!cand.length) cand = L.filter(c => !my.has(c.id));       // 全部と戦ったら、もう一度（成績はつかない）
      if (!cand.length) { JM.toast(L.length ? 'いまある挑戦状は、ぜんぶあなたのものです' : 'まだ挑戦状がありません。試合のあとに置いてみよう'); if (fromWait) C.end(); return false; }
      // 新しいものほど出やすく
      let sum = 0; const wts = cand.map((c, i) => (sum += 1 + i / cand.length * 2));
      const r = Math.random() * sum; const c = cand[wts.findIndex(w => w >= r)] || cand[cand.length - 1];
      await C.start(c);
      return true;
    } catch (e) { JM.toast(e.message && !/^http/.test(e.message) ? e.message : '挑戦状を読みこめませんでした'); return false; }
  };
  C.start = async function (c) {
    const s = st(), e = D.byId.get(c.e); if (!e) return;
    s.mode = 'local'; s.my = -1; s.reveal = true; s.chal = c; s.chalRec = false; s.rnd = false;
    s.pol = c.m === 'nopol' ? 'nopol' : 'pol'; s.cls = 'all';
    const sl = s.slots[1]; sl.dir = (c.d | 0) & 7; sl.cards = String(c.c || '').split(',').filter(k => JM.POL[k]);
    // 自分の側（左）は、前に使った市町村をそのまま。まだなければ、えらんでもらう
    JM.openSetup();
    await JM.setSlot(1, e);
    sl.cards = String(c.c || '').split(',').filter(k => JM.POL[k]); JM.renderSlots();
    C.header();
  };
  // リンク（?c=ID）から来たとき
  C.fromLink = async function () {
    let id = null; try { id = new URLSearchParams(location.search).get('c'); } catch (e) {}
    if (!id || !/^[0-9a-z]{4,24}$/i.test(id)) return false;
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    try {
      const [c, ret] = await Promise.all([getChal(id), retiredSet(true)]);
      if (!c || !usable(c, ret)) { JM.toast(c && ret.has(id) ? 'この挑戦状は引退しました' : 'この挑戦状は見つかりませんでした'); return false; }
      await C.start(c);
      JM.toast(`${c.n}さんの挑戦状が届きました`);
      return true;
    } catch (e) { JM.toast('挑戦状を読みこめませんでした'); return false; }
  };
  C.header = function () {
    const s = st(), c = s.chal, el = $('on-st'); if (!el) return;
    if (!c) { if (s.mode === 'local') el.textContent = ''; return; }
    el.innerHTML = `<b>${esc(c.n)}</b>さんの挑戦状（${esc(recText(c))}）<span class="chal-h">左にあなたの市町村をえらんで、はっけよい！</span>`;
  };
  C.end = function () { const s = st(); s.chal = null; s.chalRec = false; C.header(); };

  // 試合が終わった：挑戦状の成績をつける（1つの挑戦状につき1回だけ）
  C.onResult = async function (winner) {
    const s = st(), c = s.chal; if (!c) return null;
    let note = '';
    if (winner === 0) note = `${c.n}さんの挑戦状に勝った！`;
    else if (winner === 1) note = `${c.n}さんの挑戦状に負けた…`;
    else note = `${c.n}さんの挑戦状と引き分け`;
    const dn = done();
    if (s.chalRec || dn.includes(c.id) || winner < 0 || mine().includes(c.id)) { s.chalRec = true; return note + `（この挑戦状：${recText(c)}）`; }
    s.chalRec = true;
    dn.push(c.id); store.set('jm_chaldone', dn.slice(-DONE_MAX));
    const me = s.slots[0], pol = c.m !== 'nopol';
    try {
      const d = await db();
      // 対戦の記録（番付で、計算しなおして確かめるのに使う）
      await d.ref('jm_res/' + c.id + '/' + rid()).set({ e: me.e.id, n: QM.ng(myName()) || 'ななし', d: me.dir | 0, c: pol ? me.cards.join(',') : '', w: winner === 0 ? 1 : 0, t: Date.now() });
      const res = await d.ref('jm_chal/' + c.id).transaction(cur => {
        if (!cur) return cur;            // 最初は手元に値がないことがある → サーバーの値でやり直し
        if (winner === 1) cur.w = (cur.w || 0) + 1; else cur.l = (cur.l || 0) + 1;
        if (!cur.p) { const e = D.byId.get(cur.e); if (e) cur.p = JM.region(e); }
        cur.u = Date.now();
        return cur;
      });
      const v = res.snapshot && res.snapshot.val(); if (v) { c.w = v.w; c.l = v.l; } C.header();
    } catch (e) {}
    return note + `（この挑戦状：${recText(c)}）`;
  };

  // ---------- 投稿・リンク ----------
  C.shareText = async function (text) {
    try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
  };
  async function copy(t) {
    try { await navigator.clipboard.writeText(t); JM.toast('コピーしました'); }
    catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); JM.toast('コピーしました'); } catch (e2) { JM.toast('コピーできませんでした'); } a.remove(); }
  }
  const boshu = (e, id) => `${D.fname(e)}で挑戦状を置きました。倒せるものなら倒してみて！\n${C.link(id)}\n#地元の最強`;

  // ---------- 挑戦状を置く ----------
  C.put = function () {
    const s = st(); if (s.mode !== 'local' || s.chal) return;
    const e0 = s.slots[0].e, e1 = s.slots[1].e; if (!e0 || !e1) return;
    const card = QM.dialog(`<h3>挑戦状を置く</h3>
      <p class="qm-sub">えらんだ市町村・向き・政策が、そのまま挑戦状になります。だれかが挑戦すると、あなたの挑戦状に成績がつきます。挑戦者をたくさん倒すと、県・国の番付にのります。</p>
      <label class="qm-fld">なまえ<input id="ch-name" maxlength="8" autocomplete="off" placeholder="ななし" value="${esc(myName())}"></label>
      <p class="qm-err" id="ch-err"></p>
      <button class="qm-b" id="ch-0">左：${esc(e0.n)}を置く</button>
      <button class="qm-b alt" id="ch-1">右：${esc(e1.n)}を置く</button>
      <button class="qm-b sub" id="ch-x">やめる</button>`);
    const go = async i => {
      const n = card.querySelector('#ch-name').value.trim().slice(0, 8);
      if (n && QM.isBad(n)) { card.querySelector('#ch-err').textContent = 'その名前は使えません。ほかの名前にしてね'; return; }
      try { localStorage.setItem('jm_name', n); } catch (e) {}
      card.querySelectorAll('button').forEach(b => { b.disabled = true; });
      try {
        const sl = s.slots[i], d = await db();
        const id = rid(), tok = 't' + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
        const v = { e: sl.e.id, n: QM.ng(n) || 'ななし', d: sl.dir | 0, c: (s.pol === 'pol' ? sl.cards : []).join(','), m: s.pol === 'pol' ? 'pol' : 'nopol', t: { '.sv': 'timestamp' }, w: 0, l: 0, p: JM.region(sl.e) };
        await d.ref('jm_chal/' + id).set(v);
        const my = mine(); my.push(id); store.set('jm_mychal', my.slice(-MINE_MAX));
        try { await d.ref('jm_own/' + id).set(tok); const tk = toks(); tk[id] = tok; store.set('jm_mytok', tk); } catch (e) {}
        const sn = store.get('jm_seen', {}); sn[id] = Date.now(); store.set('jm_seen', sn);
        cache = null;
        const dlg = QM.dialog(`<h3>挑戦状を置きました！</h3><p><b>${esc(D.fname(sl.e))}</b>（向き ${sl.dir * 45}°・${esc(polText(v))}）</p>
          <p class="qm-sub">この挑戦状のリンクを送ると、その人とすぐ勝負できます。成績はタイトル画面の「あなたの挑戦状」で見られます。</p>
          <button class="qm-b" id="ch-sh">挑戦者を募集する（投稿）</button><button class="qm-b alt" id="ch-cp">リンクをコピー</button><button class="qm-b sub" id="ch-ok">OK</button>`);
        dlg.querySelector('#ch-sh').onclick = () => C.shareText(boshu(sl.e, id));
        dlg.querySelector('#ch-cp').onclick = () => copy(C.link(id));
        dlg.querySelector('#ch-ok').onclick = () => QM.close();
        C.mineSummary(true);
      } catch (e) {
        card.querySelectorAll('button').forEach(b => { b.disabled = false; });
        card.querySelector('#ch-err').textContent = '置けませんでした。通信を確認してね';
      }
    };
    card.querySelector('#ch-0').onclick = () => go(0);
    card.querySelector('#ch-1').onclick = () => go(1);
    card.querySelector('#ch-x').onclick = () => QM.close();
  };

  // ---------- タイトル：あなたの挑戦状の成績と、破られたお知らせ ----------
  let sumAt = 0, news = [];
  C.mineSummary = async function (force) {
    const el = $('chal-mine'), nb = $('chal-news'); if (!el) return;
    const ids = mine();
    if (!ids.length) { el.textContent = ''; if (nb) nb.hidden = true; return; }
    if (!force && Date.now() - sumAt < 30000) return; sumAt = Date.now();
    let w = 0, l = 0, n = 0; const seen = store.get('jm_seen', {}), nw = [];
    const ret = await retiredSet();
    await Promise.all(ids.map(async id => {
      try {
        const v = await rest('jm_chal/' + id); if (!v) return;
        n++; w += v.w || 0; l += v.l || 0;
        if (ret.has(id) || !v.u || v.u <= (seen[id] || 0)) return;
        const rs = await rest('jm_res/' + id, { orderBy: 't', startAt: (seen[id] || 0) + 1, limitToLast: 30 });
        for (const k in rs || {}) nw.push(Object.assign({ id: k, cid: id, chal: Object.assign({ id }, v) }, rs[k]));
      } catch (e) {}
    }));
    news = nw.sort((a, b) => b.t - a.t);
    el.textContent = n ? `あなたの挑戦状 ${n}枚：${w}勝${l}敗` : '';
    if (nb) {
      const lost = news.filter(r => r.w === 1).length, won = news.length - lost;
      nb.hidden = !news.length;
      nb.innerHTML = lost ? `🔔 挑戦状が<b>${lost}回</b>破られました${won ? `・${won}勝` : ''}` : `🔔 挑戦状が<b>${won}回</b>勝ちました`;
    }
  };
  function markSeen() {
    const sn = store.get('jm_seen', {});
    for (const r of news) sn[r.cid] = Math.max(sn[r.cid] || 0, r.t);
    store.set('jm_seen', sn); news = []; const nb = $('chal-news'); if (nb) nb.hidden = true;
  }

  // ---------- 仕返し：自分の挑戦状（左）と、それを破った人の市町村（右）で戦う ----------
  C.revenge = async function (c, r) {
    const s = st(), ea = D.byId.get(c.e), eb = D.byId.get(r.e); if (!ea || !eb) { JM.toast('市町村が見つかりません'); return; }
    s.mode = 'local'; s.my = -1; s.reveal = true; s.chal = null; s.rnd = false; s.pol = c.m === 'nopol' ? 'nopol' : 'pol'; s.cls = 'all';
    const pol = s.pol === 'pol';
    s.slots[0].dir = (c.d | 0) & 7; s.slots[1].dir = (r.d | 0) & 7;
    JM.openSetup();
    await Promise.all([JM.setSlot(0, ea), JM.setSlot(1, eb)]);
    s.slots[0].cards = pol ? String(c.c || '').split(',').filter(k => JM.POL[k]) : [];
    s.slots[1].cards = pol ? String(r.c || '').split(',').filter(k => JM.POL[k]) : [];
    s.slots[0].dir = (c.d | 0) & 7; s.slots[1].dir = (r.d | 0) & 7;
    JM.renderSlots();
    JM.toast(`仕返し！右が${r.n}さんの${eb.n}です。向きや政策を変えて勝ちにいこう`);
  };

  // ---------- あなたの挑戦状（画面） ----------
  function shapeCanvas(e, dir, side, px) {
    const cv = document.createElement('canvas'); cv.width = cv.height = px * 2; cv.style.width = cv.style.height = px + 'px'; cv.className = 'mc-shape';
    D.shape(e.id).then(parts => { const g = cv.getContext('2d'); if (g) JM.R.shapeIcon(g, parts, px, px, px * 1.6, dir, side, { lw: 2.5 }); }).catch(() => {});
    return cv;
  }
  const ago = t => { const m = (Date.now() - t) / 60000; return m < 60 ? Math.max(1, Math.round(m)) + '分前' : m < 1440 ? Math.round(m / 60) + '時間前' : Math.round(m / 1440) + '日前'; };
  C.openMine = async function () {
    JM.show('s-mine');
    const box = $('mine-list'); JM.R.freeIn(box); box.innerHTML = '<p class="mc-empty">読みこみ中…</p>';
    const newIds = new Set(news.map(r => r.id)); markSeen();
    const ids = mine().slice().reverse(), tk = toks();
    if (!ids.length) { box.innerHTML = '<p class="mc-empty">まだ挑戦状を置いていません。<br>試合のあとの「挑戦状を置く」から置けます。</p>'; return; }
    let ret; try { ret = await retiredSet(true); } catch (e) { ret = new Set(); }
    const rows = await Promise.all(ids.map(async id => {
      try { const [c, rs] = await Promise.all([getChal(id), rest('jm_res/' + id, { orderBy: 't', limitToLast: 5 })]); return { id, c, rs: Object.entries(rs || {}).map(([k, v]) => Object.assign({ id: k }, v)).sort((a, b) => b.t - a.t) }; }
      catch (e) { return { id, err: true }; }
    }));
    box.innerHTML = '';
    for (const { id, c, rs, err } of rows) {
      const el = document.createElement('div'); el.className = 'mc';
      if (err) { el.innerHTML = '<p class="mc-empty">読みこめませんでした。通信を確認してね</p>'; box.appendChild(el); continue; }
      const e = c && D.byId.get(c.e);
      if (!c || !e) { el.classList.add('gone'); el.innerHTML = '<p class="mc-empty">この挑戦状は見つかりませんでした</p>'; box.appendChild(el); continue; }
      const isRet = ret.has(id), hid = !!c.x;
      el.classList.toggle('gone', isRet || hid);
      const head = document.createElement('div'); head.className = 'mc-head';
      head.appendChild(shapeCanvas(e, c.d, 0, 64));
      const info = document.createElement('div'); info.className = 'mc-info';
      info.innerHTML = `<small>${esc(e.where || e.pn)}</small><b>${esc(e.n)}</b><small>向き ${c.d * 45}°・${esc(polText(c))}</small>
        <div class="mc-rec"><span class="w">${c.w || 0}勝</span><span class="l">${c.l || 0}敗</span>${isRet ? '<em>引退</em>' : hid ? '<em>非表示</em>' : ''}<small>${ago(c.t)}に置いた</small></div>`;
      head.appendChild(info); el.appendChild(head);
      const ul = document.createElement('ul'); ul.className = 'mc-res';
      if (!rs.length) ul.innerHTML = '<li class="none">まだだれも挑戦していません</li>';
      for (const r of rs) {
        const re = D.byId.get(r.e); const li = document.createElement('li'); if (newIds.has(r.id)) li.classList.add('new');
        li.innerHTML = `<span class="mk ${r.w ? 'l' : 'w'}">${r.w ? '負' : '勝'}</span><span class="who"><b>${esc(r.n)}</b>さんの${esc(re ? D.fname(re) : '（わからない市町村）')}${r.w ? 'に破られた' : 'を倒した'}<small>${ago(r.t)}</small></span>`;
        if (r.w && re && !isRet) { const b = document.createElement('button'); b.className = 'btn sm hot'; b.textContent = '仕返し'; b.onclick = () => { JM.S && JM.S.play && JM.S.play('ui'); C.revenge(c, r); }; li.appendChild(b); }
        ul.appendChild(li);
      }
      el.appendChild(ul);
      if (!isRet && !hid) {
        const bt = document.createElement('div'); bt.className = 'mc-btns';
        bt.innerHTML = `<button class="btn sm hot" data-a="sh">挑戦者を募集</button><button class="btn sm" data-a="cp">リンクをコピー</button>${tk[id] ? '<button class="btn sm" data-a="rt">引退させる</button>' : ''}`;
        if (!tk[id]) bt.insertAdjacentHTML('beforeend', '<small class="mc-note">前の版で置いた挑戦状は、引退できません</small>');
        bt.onclick = ev => {
          const a = ev.target.closest('button'); if (!a) return;
          if (a.dataset.a === 'sh') C.shareText(boshu(e, id));
          else if (a.dataset.a === 'cp') copy(C.link(id));
          else if (a.dataset.a === 'rt') retire(id, e);
        };
        el.appendChild(bt);
      }
      box.appendChild(el);
    }
  };
  function retire(id, e) {
    const dlg = QM.dialog(`<h3>引退させますか？</h3><p><b>${esc(D.fname(e))}</b>の挑戦状は、もうだれとも戦わず、番付からも外れます。<br>もとにもどせません。</p><p class="qm-err" id="rt-err"></p><button class="qm-b" id="rt-ok">引退させる</button><button class="qm-b sub" id="rt-x">やめる</button>`);
    dlg.querySelector('#rt-x').onclick = () => QM.close();
    dlg.querySelector('#rt-ok').onclick = async () => {
      const tok = toks()[id]; if (!tok) return;
      dlg.querySelectorAll('button').forEach(b => { b.disabled = true; });
      try { const d = await db(); await d.ref('jm_retire/' + id + '/' + tok).set(true); retired = null; cache = null; QM.close(); JM.toast('引退させました'); C.openMine(); C.mineSummary(true); }
      catch (er) { dlg.querySelectorAll('button').forEach(b => { b.disabled = false; }); dlg.querySelector('#rt-err').textContent = 'できませんでした。通信を確認してね'; }
    };
  }
  // ---------- 引き継ぎコード ----------
  const CODE_CH = 'abcdefghjkmnpqrstuvwxyz23456789';
  C.xferOut = async function () {
    const ids = mine(); if (!ids.length) { JM.toast('まだ挑戦状がありません'); return; }
    const tk = toks(), v = ids.map(id => id + ':' + (tk[id] || '')).join(',');
    let code = ''; for (let i = 0; i < 10; i++) code += CODE_CH[Math.floor(Math.random() * CODE_CH.length)];
    try {
      const d = await db(); await d.ref('jm_xfer/' + code).set({ v, t: Date.now() });
      const shown = code.slice(0, 5) + '-' + code.slice(5);
      const dlg = QM.dialog(`<h3>引き継ぎコード</h3><p class="xf-code">${shown}</p><p class="qm-sub">新しい端末の「あなたの挑戦状」→「コードを入れる」に入力すると、挑戦状（${ids.length}枚）を引き継げます。<br>コードは人に教えないでください（引退もできてしまいます）。</p><button class="qm-b" id="xf-cp">コピー</button><button class="qm-b sub" id="xf-ok">とじる</button>`);
      dlg.querySelector('#xf-cp').onclick = () => copy(shown);
      dlg.querySelector('#xf-ok').onclick = () => QM.close();
    } catch (e) { JM.toast('コードを作れませんでした。通信を確認してね'); }
  };
  C.xferIn = function () {
    const dlg = QM.dialog(`<h3>コードを入れる</h3><p class="qm-sub">前の端末で出した引き継ぎコード（10文字）を入れてください。</p><label class="qm-fld">コード<input id="xf-in" maxlength="16" autocomplete="off" autocapitalize="off" placeholder="abcde-fghjk"></label><p class="qm-err" id="xf-err"></p><button class="qm-b" id="xf-go">引き継ぐ</button><button class="qm-b sub" id="xf-x">やめる</button>`);
    dlg.querySelector('#xf-x').onclick = () => QM.close();
    dlg.querySelector('#xf-go').onclick = async () => {
      const code = dlg.querySelector('#xf-in').value.toLowerCase().replace(/[^a-z0-9]/g, ''), err = dlg.querySelector('#xf-err');
      if (code.length !== 10) { err.textContent = '10文字のコードを入れてください'; return; }
      try {
        const v = await rest('jm_xfer/' + code); if (!v || !v.v) { err.textContent = 'そのコードは見つかりませんでした'; return; }
        const my = mine(), tk = toks(); let add = 0;
        for (const it of String(v.v).split(',')) { const [id, t] = it.split(':'); if (!id) continue; if (!my.includes(id)) { my.push(id); add++; } if (t) tk[id] = t; }
        store.set('jm_mychal', my.slice(-MINE_MAX)); store.set('jm_mytok', tk);
        QM.close(); JM.toast(add ? `${add}枚の挑戦状を引き継ぎました` : 'もう全部この端末にあります'); C.openMine(); C.mineSummary(true);
      } catch (e) { err.textContent = '読みこめませんでした。通信を確認してね'; }
    };
  };

  // ---------- 番付 ----------
  const RANKS = ['横綱', '大関', '関脇', '小結'];
  const rankName = i => i < 4 ? RANKS[i] : '前頭' + '一二三四五六'[i - 4] + '枚目';
  let bzToken = 0;
  C.openBanzuke = async function (key) {
    JM.show('s-bz');
    const R = JM.regions(), sel = $('bz-reg');
    if (!sel.options.length) {
      sel.innerHTML = `<optgroup label="日本（都道府県）">${R.jp.map(r => `<option value="${r.k}">${esc(r.n)}</option>`).join('')}</optgroup><optgroup label="世界"><option value="W">世界の国・昔の国</option>${R.world.map(r => `<option value="${r.k}">${esc(r.n)}</option>`).join('')}</optgroup>`;
      sel.onchange = () => { store.set('jm_bzreg', sel.value); C.openBanzuke(sel.value); };
    }
    if (!key) { key = store.get('jm_bzreg', null); const e0 = st().slots[0].e; if (!key && e0) key = JM.region(e0); if (!key || !R.all.some(r => r.k === key)) key = 'J13'; }
    sel.value = key;
    const tokn = ++bzToken, box = $('bz-list'), stt = $('bz-st');
    JM.R.freeIn(box); box.innerHTML = ''; stt.textContent = '読みこみ中…';
    let v, ret;
    try { [v, ret] = await Promise.all([rest('jm_chal', { orderBy: 'p', equalTo: key }), retiredSet()]); }
    catch (e) { stt.textContent = '読みこめませんでした。通信を確認してね'; return; }
    if (tokn !== bzToken) return;
    const since = Date.now() - BZ_DAYS * DAY;
    let cand = Object.entries(v || {}).map(([id, c]) => Object.assign({ id }, c)).filter(c => usable(c, ret) && (c.u || 0) >= since && (c.w || 0) > 0);
    cand.sort((a, b) => (b.w || 0) - (a.w || 0) || a.t - b.t); cand = cand.slice(0, 30);
    if (!cand.length) { stt.textContent = ''; box.innerHTML = `<p class="mc-empty">まだ「${esc(R.name(key))}」の番付にのった挑戦状はありません。<br>挑戦状を置いて挑戦者を倒すと、番付にのります。</p>`; return; }
    // この30日の勝ち（同じ市町村・向き・政策で何度も負けたものは1回だけ数える）
    await Promise.all(cand.map(async c => {
      try { const rs = await rest('jm_res/' + c.id, { orderBy: 't', startAt: since, limitToLast: 200 }); c.res = Object.entries(rs || {}).map(([k, r]) => Object.assign({ id: k }, r)); }
      catch (e) { c.res = []; }
      const seen = new Set(); c.wins = [];
      for (const r of c.res.sort((a, b) => b.t - a.t)) { if (r.w !== 0) continue; const k = r.e + '|' + r.d + '|' + r.c; if (seen.has(k)) continue; seen.add(k); c.wins.push(r); }
      c.state = 'check';
    }));
    if (tokn !== bzToken) return;
    const VMAX = 30;   // 1枚あたり確かめる勝ちの数の上限（それ以上は「30勝以上」）
    for (const c of cand) { c.vw = 0; c.vi = 0; }
    const draw = () => {
      const show = cand.filter(c => c.vw > 0).sort((a, b) => b.vw - a.vw || (b.w || 0) - (a.w || 0) || a.t - b.t).slice(0, 10);
      JM.R.freeIn(box); box.innerHTML = '';
      if (!show.length) { if (!busy) box.innerHTML = `<p class="mc-empty">この30日、「${esc(R.name(key))}」で挑戦者を倒した挑戦状はまだありません。</p>`; return; }
      show.forEach((c, i) => {
        const e = D.byId.get(c.e), row = document.createElement('div'); row.className = 'bz-row' + (i === 0 ? ' top' : '');
        row.innerHTML = `<div class="bz-rank">${esc(rankName(i))}</div>`;
        row.appendChild(shapeCanvas(e, c.d, 1, 52));
        const info = document.createElement('div'); info.className = 'bz-info';
        const more = c.vi < Math.min(VMAX, c.wins.length);
        info.innerHTML = `<small><b>${esc(c.n)}</b>さんの</small><b class="nm">${esc(e.n)}</b><small>${esc(e.where || e.pn)}${e.c ? ' ' + esc(e.c) : ''}</small><span class="bz-w"><span>30日で<b>${c.vw}${c.vw >= VMAX ? '勝以上' : '勝'}</b></span><span>通算${c.w || 0}勝${c.l || 0}敗</span>${more ? '<i>確認中</i>' : ''}</span>`;
        row.appendChild(info);
        const b = document.createElement('button'); b.className = 'btn sm hot'; b.textContent = '挑む';
        if (mine().includes(c.id)) { b.textContent = 'あなた'; b.disabled = true; } else b.onclick = () => { JM.S && JM.S.play && JM.S.play('ui'); C.start(c); };
        row.appendChild(b); box.appendChild(row);
      });
    };
    // 勝ちを1つずつ確かめる（計算と合わない勝ちは数えない）。確かめた結果はこの端末に覚えておく
    let busy = true;
    const jobs = []; for (let i = 0; i < VMAX; i++) for (const c of cand) if (c.wins[i]) jobs.push([c, c.wins[i]]);
    let k = 0, lastDraw = 0;
    for (const [c, r] of jobs) {
      if (tokn !== bzToken) return;
      const key2 = c.id + '/' + r.id, known = ver()[key2] != null;
      if (!known) { stt.textContent = `勝ちを確かめています… ${k + 1}/${jobs.length}`; await new Promise(res => setTimeout(res, 15)); }
      let ok = false; try { ok = await C.verify(c, r, key2); } catch (e) { ok = false; }
      k++; c.vi++; if (ok) c.vw++;
      if (!known || Date.now() - lastDraw > 400 || k === jobs.length) { draw(); lastDraw = Date.now(); }
    }
    if (tokn !== bzToken) return;
    busy = false; draw(); stt.textContent = '';
  };

  // ---------- 画面のボタン ----------
  C.bind = function () {
    const bk = () => { JM.S && JM.S.play && JM.S.play('ui'); JM.toTitle(); };
    $('btn-mine').onclick = () => { JM.S && JM.S.play && JM.S.play('ui'); C.openMine(); };
    $('chal-news').onclick = () => { JM.S && JM.S.play && JM.S.play('ui'); C.openMine(); };
    $('btn-bz').onclick = () => { JM.S && JM.S.play && JM.S.play('ui'); C.openBanzuke(); };
    $('btn-mine-back').onclick = bk; $('btn-bz-back').onclick = () => { bzToken++; bk(); };
    $('btn-xf-out').onclick = () => C.xferOut(); $('btn-xf-in').onclick = () => C.xferIn();
  };
})();
