// =============================================
//  地元の最強  データの読みこみと検索
//  ・名前の一覧は最初に読みこむ（検索をすぐできるように）
//  ・形は県ごとのファイルを、使うときだけ読みこむ
// =============================================
(function () {
  const JM = window.JM = window.JM || {};
  const D = JM.D = { ready: false, list: [], byId: new Map(), shapes: {}, pref: [] };
  JM.url = name => (JM.ASSETS && JM.ASSETS[name]) || ('data/' + name);
  async function getJSON(name) {
    if (JM.DATA && JM.DATA[name]) return JM.DATA[name];
    const r = await fetch(JM.url(name)); if (!r.ok) throw new Error('読みこめませんでした：' + name); return r.json();
  }
  D.load = async function () {
    const [idx, meta] = await Promise.all([getJSON('index.json'), getJSON('meta.json')]);
    D.pref = meta.pref;
    const n = idx.id.length;
    for (let i = 0; i < n; i++) {
      const e = { i, id: idx.id[i], n: idx.n[i], p: idx.p[i], c: idx.c[i], k: idx.k[i], f: idx.f[i], t: idx.t[i], s: idx.s[i], pop: idx.pop[i], py: idx.py[i], pe: idx.pe[i], a: idx.a[i], st: idx.st[i], ky: idx.ky[i] };
      e.pn = D.pref[e.p - 1] || '';
      e.full = e.pn + ' ' + e.n;
      e.key = norm(e.pn + e.n + (e.c || '')); e.kk = norm(e.k);
      D.list.push(e); D.byId.set(e.id, e);
    }
    D.ready = true;
  };
  // ひらがな・カタカナ・全角半角をそろえる
  function norm(s) {
    s = String(s || '').normalize('NFKC').toLowerCase().replace(/\s+/g, '');
    return s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/ヶ/g, 'ケ');
  }
  D.norm = norm;
  // 合併先をたどって「今は〇〇」を出す
  D.now = function (e) {
    let x = e, guard = 0;
    while (x && x.t && x.s && guard++ < 12) x = D.byId.get(x.s);
    return x && !x.t ? x : null;
  };
  D.badge = function (e) {
    if (!e.t) return { cur: true, txt: '現存' };
    const y = e.t.slice(0, 4), s = e.s && D.byId.get(e.s);
    if (!s) return { cur: false, txt: y + '年になくなった' };
    const sname = (s.p !== e.p ? s.pn : '') + s.n;
    const now = D.now(e);
    let txt = y + '年 ' + sname + 'へ';
    if (now && now !== s) txt += '（今は' + (now.p !== e.p ? now.pn : '') + now.n + '）';
    return { cur: false, txt };
  };
  D.years = e => (e.f ? e.f + '年' : '') + '〜' + (e.t ? e.t.slice(0, 4) + '年' : '');
  D.search = function (q, max = 80) {
    const n = norm(q); if (!n) return [];
    const out = [];
    for (const e of D.list) {
      let sc = -1;
      const nn = norm(e.n);
      if (nn === n || e.kk === n) sc = 0;
      else if (nn.startsWith(n) || e.kk.startsWith(n)) sc = 1;
      else if (e.key.includes(n) || e.kk.includes(n)) sc = 2;
      if (sc < 0) continue;
      out.push([sc, e.t ? 1 : 0, e.p, e.i, e]);
    }
    out.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2] || a[3] - b[3]);
    return out.slice(0, max).map(x => x[4]);
  };
  D.random = function (rnd) { return D.list[Math.floor((rnd || Math.random)() * D.list.length)]; };
  // 形（県ごとのファイル）
  D.shape = async function (id) {
    const e = D.byId.get(id); if (!e) throw new Error('見つかりません');
    const key = 'shape/' + String(e.p).padStart(2, '0') + '.json';
    if (!D.shapes[key]) D.shapes[key] = getJSON(key);
    const pack = await D.shapes[key];
    const enc = pack[id]; if (!enc) throw new Error('形がありません');
    // 差分をもとにもどす
    return enc.map(q => { const out = []; let x = 0, y = 0; for (let i = 0; i < q.length; i += 2) { x += q[i]; y += q[i + 1]; out.push(x, y); } return out; });
  };
})();
