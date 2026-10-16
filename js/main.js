// =============================================
//  地元の最強  画面と進行
// =============================================
(function () {
  const JM = window.JM, D = JM.D, R = JM.R;
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
    if (!e.pop) return '人口 不明';
    // 海外の州などの人口は、町の人口から割り振った大まかな推定なので、けただけ出す
    if (e.pe && e.p >= 100) { const b = [[1e7, '1000万人以上'], [1e6, '100万人以上'], [1e5, '10万人以上'], [1e4, '1万人以上'], [0, '1万人未満']].find(x => e.pop >= x[0])[1]; return `人口 ${b} <span class="est">（推定）</span>`; }
    if (e.pe) return `人口 約${fmt(e.pop)}人 <span class="est">（${e.py}年ごろの推定）</span>`;
    return e.py ? `人口 ${fmt(e.pop)}人（${e.py}年）` : `人口 ${fmt(e.pop)}人`;
  }
  function areaText(e) { return '面積 ' + (e.a >= 100 ? fmt(Math.round(e.a)) : e.a.toFixed(1)) + 'km²'; }
  JM.popText = popText; JM.areaText = areaText;
  const editable = i => (st.mode === 'local' && !(st.chal && i === 1)) || st.my === i;
  // ---------- 1つの枠を描く ----------
  function renderSlot(i) {
    const el = $('slot' + i), s = st.slots[i], side = ['左・赤', '右・青'][i];
    if (st.mode !== 'local' && i !== st.my && !st.reveal) {
      el.innerHTML = `<span class="sl-side">${side}</span><div class="hidden-foe">${st.mode === 'watch' ? 'ふたりが準備中…' : (st.foeReady ? 'あいては準備OK！' : 'あいてが準備中…')}<br>（公開まで見えません）</div>`;
      return;
    }
    if (!s.e) {
      el.innerHTML = `<span class="sl-side">${side}</span><div class="sl-empty"><div>市町村・国をえらんでください</div><div class="row"><button class="btn hot" data-pick="${i}">えらぶ</button><button class="btn" data-rand="${i}">おまかせ</button></div></div>`;
      return;
    }
    const e = s.e, bd = D.badge(e), usePol = st.pol === 'pol';
    const comp = JM.compose(e.st, usePol ? s.cards : [], e.pop);
    const ed = editable(i);
    let h = `<span class="sl-side">${side}</span>
      <div class="sl-top">
        <div class="sl-shape"><canvas width="240" height="240" style="width:120px;height:120px" data-shape="${i}"></canvas>
          ${ed ? `<div class="dir"><button class="btn sm" data-rot="${i}" data-d="-1">⟲</button><button class="btn sm" data-rot="${i}" data-d="1">⟳</button></div>` : ''}
          <div class="dir-lab">向き ${s.dir * 45}°</div></div>
        <div class="sl-info">
          <div class="sl-name"><small>${esc(e.where || (e.pn + ' ' + (e.c || '')))}</small>${esc(e.n)}<small>${esc(e.kd)}</small></div>
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
      h += `<div class="pol-h"><b>政策カード（${s.cards.length}/${JM.MAXCARDS}枚）</b><span class="bud">予算 <b>${comp.budget - comp.spent}</b>/${comp.budget}${kf ? `<span class="kof">（交付金＋${kf}）</span>` : ''}</span></div><div class="pols">`;
      let spent = 0; const kfSet = new Set();
      for (const k of s.cards) { const c = JM.POL[k].c; if (spent + c > JM.BASE_BUDGET) kfSet.add(k); spent += c; }
      for (const p of JM.POLICIES) {
        const on = s.cards.includes(p.k), can = on || JM.canAdd(s.cards, p.k, e.pop);
        h += `<button class="pol ${on ? 'on' : ''} ${kfSet.has(p.k) ? 'kf' : ''}" data-pol="${i}" data-k="${p.k}" ${(!ed || !can) ? 'disabled' : ''}><i>${p.c}</i><b>${p.n}</b><small>${p.t}</small></button>`;
      }
      h += `</div>`;
    }
    if (!JM.inClass(st.cls, e.pop)) h += `<div class="cls-warn">「${JM.CLS[st.cls].n}」（${JM.CLS[st.cls].t}）には出られません</div>`;
    if (ed) h += `<div class="sl-btns"><button class="btn sm" data-pick="${i}">べつの市町村</button><button class="btn sm" data-rand="${i}">おまかせ</button></div>`;
    el.innerHTML = h;
    const cv = el.querySelector('[data-shape]'); if (cv && s.parts) {
      const c = cv.getContext('2d'); c.clearRect(0, 0, 240, 240);
      R.shapeIcon(c, s.parts, 120, 120, 170, s.dir, i, { facing: true, lw: 3 });
      // 相手のほうの矢印
      c.fillStyle = 'rgba(60,40,20,.55)'; c.font = '900 26px sans-serif'; c.textAlign = i ? 'left' : 'right'; c.fillText(i ? '◀ 相手' : '相手 ▶', i ? 8 : 232, 228);
    }
    const rv = el.querySelector('[data-radar]'); if (rv) { const c = rv.getContext('2d'); c.clearRect(0, 0, 300, 270); c.save(); c.scale(2, 2); R.radar(c, 75, 70, 48, e.st, usePol ? comp.add : null, { fs: 10 }); c.restore(); }
  }
  function renderSlots() { renderSlot(0); renderSlot(1); updateFight(); }
  function updateFight() {
    const b = $('btn-fight');
    const okc = i => st.slots[i].e && JM.inClass(st.cls, st.slots[i].e.pop);
    if (st.mode === 'local') { b.disabled = !(okc(0) && okc(1)); b.textContent = 'はっけよい！'; return; }
    if (st.mode === 'watch') { b.disabled = true; b.textContent = '観戦中'; return; }
    const mine = st.slots[st.my];
    b.disabled = !okc(st.my) || !!st.myReady; b.textContent = st.myReady ? '準備OK（あいて待ち）' : '準備OK！';
  }
  // ---------- 市町村をセット ----------
  async function setSlot(i, e) {
    const s = st.slots[i]; s.e = e; s.parts = null; s.cards = s.cards.filter(k => JM.canAdd(s.cards.filter(x => x !== k), k, e.pop));
    renderSlot(i);
    try { s.parts = await D.shape(e.id); } catch (er) { toast('形を読みこめませんでした'); }
    if (s.e === e) renderSlot(i);
    saveSlots(); updateFight(); if (st.mode !== 'local' && JM.Net) JM.Net.changed();
  }
  JM.setSlot = setSlot;
  function saveSlots() { if (st.mode === 'local' && !st.chal) store('jm_slots', JSON.stringify(st.slots.map(s => ({ id: s.e && s.e.id, dir: s.dir, cards: s.cards })))); }
  async function loadSlots() {
    try {
      const v = JSON.parse(store('jm_slots') || 'null'); if (!v) return;
      for (let i = 0; i < 2; i++) { const e = v[i] && D.byId.get(v[i].id); if (e) { st.slots[i].dir = v[i].dir | 0; st.slots[i].cards = (v[i].cards || []).filter(k => JM.POL[k]); await setSlot(i, e); } }
    } catch (e) {}
  }
  // ---------- 検索 ----------
  let pickFor = 0;
  function openPicker(i) {
    pickFor = i; $('picker').classList.add('on'); $('pk-q').value = ''; $('pk-list').innerHTML = ''; const cl = JM.CLS[st.cls]; $('pk-hint').textContent = (st.cls === 'all' ? '全' + fmt(D.list.length) + 'の市町村・区・国から探せます。' : '「' + cl.n + '」（' + cl.t + '）から探します。') + '例：「ふちゅう」「湯布院」「広島県 安芸郡」「フランス」「昔の国」';
    setTimeout(() => $('pk-q').focus(), 50);
  }
  function runSearch() {
    const q = $('pk-q').value, res = D.search(q, 120, st.cls === 'all' ? null : st.cls), ul = $('pk-list');
    if (!q.trim()) { ul.innerHTML = ''; return; }
    if (!res.length) {
      // 階級でしぼっているせいで見つからないときは、そう伝える
      const all = st.cls !== 'all' ? D.search(q, 1, null).length : 0;
      ul.innerHTML = all ? `<li class="pk-note">「${esc(JM.CLS[st.cls].n)}」にはありません。上で「全体の部」にすると出てきます（${D.lastCount}件）</li>` : '<li class="pk-note">見つかりませんでした。漢字・ひらがなのどちらでも、空白で区切って「広島県 安芸郡」のようにしぼれます。<br>樺太（敷香町など）など、戦前の外地の町村は入っていません</li>';
      return;
    }
    const more = D.lastCount > res.length ? `<li class="pk-note">${D.lastCount}件見つかりました。多いので最初の${res.length}件だけ出しています。空白で区切って言葉を足すと、しぼれます</li>` : '';
    ul.innerHTML = more + res.map(e => { const b = D.badge(e); return `<li data-id="${e.id}"><div><span class="nm">${e.where ? '<small>' + esc(e.where) + '</small> ' : esc(e.pn) + ' ' + (e.c ? '<small>' + esc(e.c) + '</small> ' : '')}${esc(e.n)}</span><span class="kn">${esc(e.kd)}</span></div><div class="bd"><span class="badge ${b.cur ? '' : 'old'}">${esc(b.txt)}</span></div></li>`; }).join('');
  }
  // ---------- 試合 ----------
  function defOf(i) {
    const s = st.slots[i], usePol = st.pol === 'pol', comp = JM.compose(s.e.st, usePol ? s.cards : [], s.e.pop);
    return { key: s.e.id, parts: s.parts, st: comp.st, pol: usePol ? s.cards.slice() : [] };
  }
  JM.defOf = defOf;
  function shortName(e) { return e.p >= 100 ? e.pn + ' ' + e.n : e.n; }
  // 全部を先に計算して結果を知っておく → そのあと同じ計算を見せる
  function startBattle(fromNet) {
    if (!st.slots[0].parts || !st.slots[1].parts) { toast('形を読みこみ中です'); return; }
    const a = defOf(0), b = defOf(1), d0 = st.slots[0].dir, d1 = st.slots[1].dir;
    const pre = new JM.Match(a, b, d0, d1); let lastHit = 0;
    while (!pre.over) { pre.tick(); for (const e of pre.ev) if (e.k === 'hit') lastHit = pre.step; pre.ev.length = 0; }
    st.result = { winner: pre.winner, digest: pre.digest(), t: pre.t, ra: pre.A.ratio(), rb: pre.B.ratio(), endBy: pre.endBy, lastHit };
    st.live = new JM.Match(a, b, d0, d1); st.liveT = -1.4; st.acc = 0; st.done = false; st.goSaid = false; st.slow = false;
    $('hn0').textContent = shortName(st.slots[0].e); $('hn1').textContent = shortName(st.slots[1].e);
    show('s-battle'); $('result').classList.remove('on'); R.fx = [];
    call('はっけよい', 1.1); S().play('start'); S().bgm('battle');
    if (JM.Net && !fromNet) JM.Net.digest && 0;
    return st.result;
  }
  JM.startBattle = startBattle;
  let callT = null;
  function call(t, sec) { const c = $('call'); c.innerHTML = t; c.classList.add('on'); clearTimeout(callT); if (sec) callT = setTimeout(() => c.classList.remove('on'), sec * 1000); }
  function liveStep(dt) {
    const m = st.live; if (!m) return;
    st.liveT += dt;
    if (st.liveT < 0) return;
    if (st.liveT < 0.3 && !st.goSaid) { st.goSaid = true; call('のこった！', 0.7); S().play('go'); }
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
    if (r.winner < 0) { t = '引き分け'; line = `${D.fname(e0)} と ${D.fname(e1)} は引き分け！`; }
    else { const w = r.winner ? e1 : e0, l = r.winner ? e0 : e1; t = `${w.p >= 100 ? D.fname(w) : w.n}の勝ち！`; line = `${D.fname(w)}が${D.fname(l)}に勝った！`; }
    // 下剋上：もとの能力の合計がずっと下の方が勝った
    st.gk = r.winner >= 0 && (JM.statSum((r.winner ? e0 : e1).st) - JM.statSum((r.winner ? e1 : e0).st) >= JM.GEKOKUJO);
    if (st.gk) line = '【下剋上】' + line;
    call((st.gk ? '下剋上！\n' : '') + t + (r.endBy === 'time' ? '<small>時間切れ・残りの多さで勝負</small>' : ''), st.gk ? 2.2 : 1.6);
    S().play(r.winner < 0 ? 'draw' : 'win');
    if (JM.Net && st.mode !== 'local') JM.Net.finished(r);
    setTimeout(() => {
      $('res-t').innerHTML = (st.gk ? '<span class="gk">下剋上</span><br>' : '') + esc(t); $('res-line').textContent = line + (r.endBy === 'time' ? '（時間切れ判定）' : '');
      drawResultImage(t, line);
      $('res-note').textContent = st.mode === 'local' ? '同じ組み合わせ・向き・政策なら、いつでも同じ結果になります。' : (st.netNote || '');
      $('btn-chal-put').hidden = !(st.mode === 'local' && !st.chal); $('btn-chal-next').hidden = !st.chal;
      if (st.chal) { $('res-line').textContent = line + '　…成績をつけています'; JM.Chal.onResult(r.winner).then(t => { if (t) $('res-line').textContent = t; }); }
      $('btn-change').textContent = st.mode === 'local' ? (st.chal ? '自分の市町村を変える' : '組み合わせを変える') : (st.mode === 'watch' ? 'もどる' : 'もう一戦（えらびなおす）');
      $('result').classList.add('on');
    }, 1500);
  }
  // ---------- 結果の画像 ----------
  function drawResultImage(t, line) {
    const cv = $('res-img'), c = cv.getContext('2d'), W = 1200, H = 675, m = st.live, r = st.result;
    c.setTransform(1, 0, 0, 1, 0, 0);
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#f6eedb'); bg.addColorStop(1, '#e9dcbf'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(80,110,140,.12)'; c.lineWidth = 1; for (let x = 0; x < W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.fillStyle = '#2a211b'; c.fillRect(0, 0, W, 84); c.fillRect(0, H - 54, W, 54);
    c.font = '400 46px "Dela Gothic One",sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('地元の', 28, 44); c.fillStyle = '#ffcf3a'; c.fillText('最強', 28 + c.measureText('地元の').width, 44);
    c.font = '900 30px "M PLUS Rounded 1c",sans-serif'; c.fillStyle = '#fff'; c.textAlign = 'right'; c.fillText(t, W - 28, 44);
    if (st.gk) { c.save(); c.translate(600, 165); c.rotate(-0.08); c.fillStyle = '#ffcf3a'; c.strokeStyle = '#2a211b'; c.lineWidth = 6; c.beginPath(); c.roundRect ? c.roundRect(-140, -40, 280, 80, 14) : c.rect(-140, -40, 280, 80); c.fill(); c.stroke(); c.font = '400 54px "Dela Gothic One",sans-serif'; c.fillStyle = '#2a211b'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('下剋上！', 0, 4); c.restore(); }
    { const cl = JM.CLS[st.cls]; c.font = '800 20px "M PLUS Rounded 1c",sans-serif'; c.fillStyle = '#7a5a2a'; c.textAlign = 'center'; c.fillText(cl.n + (st.cls === 'all' ? '' : '（' + cl.t + '）'), 600, 108); }
    const side = (i, x) => {
      const s = st.slots[i], e = s.e, b = i ? m.B : m.A, win = r.winner === i, lose = r.winner >= 0 && !win;
      // 最後の形（割れたあと）
      const parts = []; for (const f of b.frags) if (f.alive) parts.push(f.poly.map(v => v * 1000));
      c.save(); c.globalAlpha = lose ? 0.85 : 1;
      if (parts.length) R.shapeIcon(c, parts, x, 300, 250, 0, i, { lw: 3 });
      c.restore();
      c.textAlign = 'center';
      c.font = '400 40px "Dela Gothic One",sans-serif'; c.fillStyle = win ? '#c0281c' : lose ? '#5a5048' : '#2a211b';
      c.fillText(r.winner < 0 ? '引き分け' : win ? '勝ち' : '負け', x, 130);
      c.font = '900 34px "M PLUS Rounded 1c",sans-serif'; c.fillStyle = R.COL[i].d; c.fillText(e.n, x, 465);
      c.font = '800 20px "M PLUS Rounded 1c",sans-serif'; c.fillStyle = '#4a3a2a'; c.fillText((e.where || e.pn) + '　' + D.badge(e).txt, x, 500);
      c.fillText('のこり ' + Math.round(b.ratio() * 100) + '%　向き ' + s.dir * 45 + '°', x, 530);
      const pol = st.pol === 'pol' && s.cards.length ? s.cards.map(k => JM.POL[k].n).join('・') : (st.pol === 'pol' ? '政策なし' : '政策カードなしの勝負');
      c.font = '800 18px "M PLUS Rounded 1c",sans-serif'; c.fillStyle = '#7a5a2a'; c.fillText(pol, x, 562);
      const comp = JM.compose(e.st, st.pol === 'pol' ? s.cards : [], e.pop);
      c.save(); R.radar(c, i ? x - 205 : x + 205, 300, 62, e.st, st.pol === 'pol' ? comp.add : null, { fs: 14 }); c.restore();
    };
    side(0, 300); side(1, 900);
    c.font = '400 64px "Dela Gothic One",sans-serif'; c.fillStyle = '#ffcf3a'; c.textAlign = 'center'; c.lineWidth = 8; c.strokeStyle = '#2a211b'; c.strokeText('VS', 600, 300); c.fillText('VS', 600, 300);
    c.font = '800 20px "M PLUS Rounded 1c",sans-serif'; c.fillStyle = '#fff'; c.textAlign = 'left'; c.fillText('#地元の最強', 24, H - 27); c.textAlign = 'right'; c.fillText(URL_GAME.replace('https://', ''), W - 24, H - 27);
    st.shareText = `${line}\n#地元の最強\n${URL_GAME}`;
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
    toast('画像を保存しました。投稿画面に貼りつけてください');
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
      R.draw(m, { names: [shortName(st.slots[0].e), shortName(st.slots[1].e)], dt: st.slow ? dt * 0.3 : dt, top: 46, bot: 10 });
      for (let i = 0; i < 2; i++) { const r = (i ? m.B : m.A).ratio(); $('hg' + i).style.width = Math.max(0, Math.min(100, (r - 0) * 100)) + '%'; $('hv' + i).textContent = Math.round(r * 100) + '%'; }
      $('clock').textContent = Math.max(0, Math.ceil(JM.TMAX - m.t));
    } else if (st.idle) { idleDraw(dt); }
  }
  // タイトルの後ろ：ゆっくり戦っている
  function idleDraw(dt) {
    const m = st.idle; let n = 0; st.idleAcc = (st.idleAcc || 0) + dt * 0.7;
    while (st.idleAcc >= JM.DT && n < 20) { m.tick(); st.idleAcc -= JM.DT; n++; for (const e of m.ev) if (e.k === 'hit') R.hit(e); m.ev.length = 0; }
    R.draw(m, { dt });
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
    $('btn-play').onclick = () => { S().unlock && S().unlock(); S().play('ui'); if (st.chal) { st.chal = null; loadSlots(); } st.mode = 'local'; st.my = -1; st.reveal = true; openSetup(); };
    $('btn-chal').onclick = () => { S().unlock && S().unlock(); S().play('ui'); JM.Chal.open(); };
    $('btn-chal-put').onclick = () => { S().play('ui'); JM.Chal.put(); };
    $('btn-chal-next').onclick = () => { S().play('ui'); $('result').classList.remove('on'); JM.Chal.open(); };
    $('btn-howto').onclick = () => { S().play('ui'); show('s-howto'); };
    $('btn-how-back').onclick = () => { S().play('ui'); show('s-title'); };
    $('btn-setup-back').onclick = () => { S().play('ui'); if (st.mode !== 'local' && JM.Net) JM.Net.leave(); toTitle(); };
    $('btn-snd').onclick = () => { S().unlock && S().unlock(); const m = !(JM.mute && JM.mute()); JM.mute && JM.mute(m); $('snd-name').textContent = m ? 'なし' : 'あり'; };
    for (const b of document.querySelectorAll('.seg')) b.onclick = () => { if (st.mode === 'watch' || (st.mode === 'net' && st.reveal)) return; if (st.rnd || st.chal) { toast(st.rnd ? 'だれかと対戦は「全体の部・政策あり」で戦います' : '挑戦状のルールで戦います'); return; } st.pol = b.dataset.mode; store('jm_pol', st.pol); syncMode(); renderSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); };
    document.addEventListener('click', ev => {
      const t = ev.target.closest('[data-pick],[data-rand],[data-rot],[data-pol]'); if (!t) return;
      S().play('ui');
      if (t.dataset.pick != null) openPicker(+t.dataset.pick);
      else if (t.dataset.rand != null) setSlot(+t.dataset.rand, D.random(st.cls));
      else if (t.dataset.rot != null) { const i = +t.dataset.rot, s = st.slots[i]; s.dir = (s.dir + (+t.dataset.d) + 8) % 8; renderSlot(i); saveSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); }
      else if (t.dataset.pol != null) { const i = +t.dataset.pol, s = st.slots[i], k = t.dataset.k; if (s.cards.includes(k)) s.cards = s.cards.filter(x => x !== k); else if (JM.canAdd(s.cards, k, s.e.pop)) s.cards.push(k); renderSlot(i); saveSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); }
    });
    $('pk-q').oninput = () => { clearTimeout(st.sT); st.sT = setTimeout(runSearch, 120); };
    $('pk-close').onclick = () => $('picker').classList.remove('on');
    $('pk-rand').onclick = () => { $('picker').classList.remove('on'); setSlot(pickFor, D.random(st.cls)); };
    $('pk-list').onclick = ev => { const li = ev.target.closest('li[data-id]'); if (!li) return; S().play('ui'); $('picker').classList.remove('on'); setSlot(pickFor, D.byId.get(li.dataset.id)); };
    $('btn-fight').onclick = () => { S().unlock && S().unlock(); if (st.mode === 'local') startBattle(); else if (JM.Net) JM.Net.ready(); };
    $('btn-speed').onclick = () => { st.speed = st.speed === 1 ? 2 : st.speed === 2 ? 4 : 1; $('btn-speed').textContent = '×' + st.speed; };
    $('btn-skip').onclick = () => { const m = st.live; if (!m || m.over) return; while (!m.over) { m.tick(); m.ev.length = 0; } };
    $('btn-share').onclick = () => share();
    $('btn-save').onclick = () => saveImg();
    $('btn-replay').onclick = () => { S().play('ui'); startBattle(true); };
    $('btn-change').onclick = () => { S().play('ui'); $('result').classList.remove('on'); if (st.mode === 'watch') { if (JM.Net) JM.Net.leave(); toTitle(); return; } if (st.mode !== 'local' && JM.Net) JM.Net.again(); openSetup(); };
    $('btn-online').onclick = () => { S().unlock && S().unlock(); S().play('ui'); $('in-name').value = store('jm_name') || ''; $('in-code').value = store('jm_code') || ''; $('on-form').classList.remove('hide'); $('on-wait').classList.add('hide'); $('on-err').textContent = ''; show('s-online'); };
    $('btn-on-back').onclick = () => { S().play('ui'); if (JM.Net) JM.Net.leave(); toTitle(); };
    $('btn-join').onclick = () => { if (JM.Net) JM.Net.join($('in-name').value, $('in-code').value); };
  }
  function syncMode() { for (const b of document.querySelectorAll('.seg')) b.classList.toggle('on', b.dataset.mode === st.pol); $('cls-sel').value = st.cls; $('cls-sel').disabled = st.mode === 'watch' || (st.mode === 'net' && st.reveal) || !!st.rnd || !!st.chal; }
  function openSetup() { syncMode(); show('s-setup'); $('on-st').textContent = st.mode === 'local' ? '' : st.netStatus || ''; if (JM.Chal) JM.Chal.header(); renderSlots(); S().bgm('title'); }
  JM.openSetup = openSetup; JM.renderSlots = renderSlots; JM.show = show; JM.syncMode = syncMode;
  function toTitle() { QM.ended(); st.rnd = false; if (st.chal) { st.chal = null; loadSlots(); } st.mode = 'local'; st.my = -1; st.reveal = true; st.live = null; if (JM.Chal) JM.Chal.mineSummary(); $('result').classList.remove('on'); show('s-title'); S().bgm('title'); if (!st.idle) newIdle(); }
  JM.toTitle = toTitle;
  // ---------- だれかと対戦（ランダム対戦） ----------
  function setupQM() {
    QM.setup({
      game: 'jimoto', ver: 'v3', name: '地元の最強',
      getDb: () => JM.getDb(), anchor: '#btn-online', anchorWhere: 'before', btnClass: 'btn big hot', nextClass: 'btn', nameKey: 'jm_name',
      join: (code, name) => { S().unlock && S().unlock(); JM.Net.join(name, code); },
      cpu: () => JM.Chal.open(true), cpuLabel: '挑戦状と戦いながら待つ',
      quit: () => { if (JM.Net) JM.Net.leave(); toTitle(); },
      colors: { main: 'var(--red)', alt: 'var(--blue)', bg: '#f6eedb', fg: '#2a211b' },
    });
    QM.resultSlot('#result .sheet-in', '#chal-row');
    JM.Chal.mineSummary(true);
  }
  async function boot() {
    R.init($('arena'));
    $('cls-sel').innerHTML = JM.CLASSES.map(c => `<option value="${c.k}">${c.n}${c.k === 'all' ? '' : '（' + c.t.replace('人口', '') + '）'}</option>`).join('');
    $('cls-sel').onchange = () => { st.cls = $('cls-sel').value; store('jm_cls', st.cls); S().play('ui'); renderSlots(); if (st.mode !== 'local' && JM.Net) JM.Net.changed(); };
    bind(); setupQM();
    $('snd-name').textContent = JM.mute && JM.mute() ? 'なし' : 'あり';
    requestAnimationFrame(frame);
    try { await D.load(); $('loading').textContent = '全' + fmt(D.list.length) + 'の市町村・区・国が出場できます'; } catch (e) { $('loading').textContent = '読みこめませんでした。再読みこみしてください'; return; }
    newIdle(); await loadSlots();
  }
  JM.boot = boot;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
