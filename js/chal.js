// =============================================
//  地元の最強  挑戦状
//  ・試合のあとに「挑戦状を置く」：市町村・向き・政策を名前つきで置いていく
//  ・「挑戦状と戦う」：だれかが置いた挑戦状と、いつでも戦える（相手がその場にいなくてよい）
//  ・同じ組み合わせなら毎回同じ結果になるので、挑戦状はそのまま「その人の地元」として戦える
//  ・挑戦状には成績（置いた人から見て 何勝何敗）がつく。ランキングにはしない
//
//  データの形： jm_chal/{id} : { e: 市町村id, n: なまえ, d: 向き0-7, c: 政策（,区切り）, m: 'pol'|'nopol', t: 置いた時刻, w: 勝ち, l: 負け }
// =============================================
(function () {
  const JM = window.JM, D = JM.D;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const MINE_MAX = 10;          // 1台で置いておける挑戦状の数（古いものから自分の一覧から外れる）
  const DONE_MAX = 400;         // 成績をつけた挑戦状（同じ挑戦状で何度も成績をつけないため）
  const LIST_N = 200;           // 新しい方から何枚の中から選ぶか
  const C = JM.Chal = {};
  let cache = null, cacheAt = 0;
  const mine = () => store.get('jm_mychal', []);
  const done = () => store.get('jm_chaldone', []);
  const st = () => JM.st;
  const recText = c => (c.w || c.l) ? `${c.w}勝${c.l}敗` : 'まだだれも挑戦していない';

  async function db() { return JM.getDb(); }
  // 新しい挑戦状の一覧（1分は使い回す）
  async function list(force) {
    if (!force && cache && Date.now() - cacheAt < 60000) return cache;
    const d = await db();
    const snap = await d.ref('jm_chal').orderByChild('t').limitToLast(LIST_N).once('value');
    const out = []; snap.forEach(ch => { const v = ch.val(); if (v && D.byId.has(v.e)) out.push(Object.assign({ id: ch.key }, v)); });
    cache = out; cacheAt = Date.now(); return out;
  }

  // ---------- 挑戦状と戦う ----------
  C.open = async function (fromWait) {
    const s = st();
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
    } catch (e) { JM.toast(e.message || '挑戦状を読みこめませんでした'); return false; }
  };
  C.start = async function (c) {
    const s = st(), e = D.byId.get(c.e); if (!e) return;
    s.mode = 'local'; s.my = -1; s.reveal = true; s.chal = c; s.chalRec = false;
    s.pol = c.m === 'nopol' ? 'nopol' : 'pol'; s.cls = 'all';
    const sl = s.slots[1]; sl.dir = (c.d | 0) & 7; sl.cards = String(c.c || '').split(',').filter(k => JM.POL[k]);
    // 自分の側（左）は、前に使った市町村をそのまま。まだなければ、えらんでもらう
    JM.openSetup();
    await JM.setSlot(1, e);
    sl.cards = String(c.c || '').split(',').filter(k => JM.POL[k]); JM.renderSlots();
    C.header();
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
    if (s.chalRec || dn.includes(c.id) || winner < 0) { s.chalRec = true; return note + `（この挑戦状：${recText(c)}）`; }
    s.chalRec = true;
    dn.push(c.id); store.set('jm_chaldone', dn.slice(-DONE_MAX));
    try {
      const d = await db();
      const res = await d.ref('jm_chal/' + c.id).transaction(cur => {
        if (!cur) return cur;            // 最初は手元に値がないことがある → サーバーの値でやり直し
        if (winner === 1) cur.w = (cur.w || 0) + 1; else cur.l = (cur.l || 0) + 1;
        return cur;
      });
      const v = res.snapshot && res.snapshot.val(); if (v) { c.w = v.w; c.l = v.l; } C.header();
    } catch (e) {}
    return note + `（この挑戦状：${recText(c)}）`;
  };

  // ---------- 挑戦状を置く ----------
  C.put = function () {
    const s = st(); if (s.mode !== 'local' || s.chal) return;
    const e0 = s.slots[0].e, e1 = s.slots[1].e; if (!e0 || !e1) return;
    const nm = (() => { try { return localStorage.getItem('jm_name') || ''; } catch (e) { return ''; } })();
    const card = QM.dialog(`<h3>挑戦状を置く</h3>
      <p class="qm-sub">えらんだ市町村・向き・政策が、そのまま挑戦状になります。だれかが挑戦すると、あなたの挑戦状に成績がつきます。</p>
      <label class="qm-fld">なまえ<input id="ch-name" maxlength="8" autocomplete="off" placeholder="ななし" value="${esc(nm)}"></label>
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
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
        const ref = d.ref('jm_chal/' + id);
        const v = { e: sl.e.id, n: QM.ng(n) || 'ななし', d: sl.dir | 0, c: (s.pol === 'pol' ? sl.cards : []).join(','), m: s.pol === 'pol' ? 'pol' : 'nopol', t: { '.sv': 'timestamp' }, w: 0, l: 0 };
        await ref.set(v);
        const my = mine(); my.push(id); store.set('jm_mychal', my.slice(-MINE_MAX));
        cache = null;
        QM.dialog(`<h3>挑戦状を置きました！</h3><p><b>${esc(JM.D.fname(sl.e))}</b>（向き ${sl.dir * 45}°${v.c ? '・' + esc(v.c.split(',').map(k => JM.POL[k].n).join('・')) : ''}）</p><p class="qm-sub">だれかが挑戦すると、タイトル画面で成績が見られます。</p><button class="qm-b" id="ch-ok">OK</button>`).querySelector('#ch-ok').onclick = () => QM.close();
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

  // ---------- タイトル：あなたの挑戦状の成績 ----------
  let sumAt = 0;
  C.mineSummary = async function (force) {
    const el = $('chal-mine'); if (!el) return;
    const ids = mine(); if (!ids.length) { el.textContent = ''; return; }
    if (!force && Date.now() - sumAt < 30000) return; sumAt = Date.now();
    let w = 0, l = 0, n = 0;
    await Promise.all(ids.map(async id => { try { const v = await QM.restGet('jm_chal/' + id); if (v) { n++; w += v.w || 0; l += v.l || 0; } } catch (e) {} }));
    el.textContent = n ? `あなたの挑戦状 ${n}枚：${w}勝${l}敗` : '';
  };
})();
