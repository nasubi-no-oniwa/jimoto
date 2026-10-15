// =============================================
//  地元の最強  あいことば対戦（Firebase Realtime Database）
//  ・お互いに市町村・向き・政策をこっそり決めて「準備OK」
//  ・2人とも同じモード（政策あり／なし）で準備OKになったら、同時に公開して試合
//  ・結果は毎回同じになるので、試合はそれぞれの画面で計算する（最後に結果が同じか確かめる）
//
//  データの形： jimoto/{あいことば}/
//    players/{0|1}: { id, name }   watchers/{id}: { name }   ready/{0|1}: 何試合目をやりたいか
//    game: { m }（0番の人が書く）   sel/{0|1}: { mode, ok }（準備OKか・どちらのモードか）
//    pick/{m}/{0|1}: { id, dir, cards, mode }（準備OKのときに書く）   res/{m}/{0|1}: 結果の要約
// =============================================
(function () {
  const JM = window.JM, D = JM.D;
  const $ = id => document.getElementById(id);
  const clean = s => String(s || '').replace(/[.#$\[\]\/\s]/g, '').slice(0, 20);
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  function loadScript(src) { return new Promise((res, rej) => { const el = document.createElement('script'); el.src = src; el.onload = res; el.onerror = () => rej(new Error('通信できませんでした。電波のよいところでもう一度ためしてください')); document.head.appendChild(el); }); }
  async function getDb() {
    if (JM._db) return JM._db;
    const v = '10.12.2';
    if (!window.firebase || !firebase.database) { await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-app-compat.js'); await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-database-compat.js'); }
    if (!firebase.apps.length) firebase.initializeApp(JM.FIREBASE_CONFIG);
    return JM._db = firebase.database();
  }
  let R = null;   // 今の部屋
  const st = () => JM.st;
  class Room {
    constructor(db, code, name) { this.db = db; this.code = clean(code); this.name = (String(name || '').trim().slice(0, 8)) || 'ななし'; this.id = uid(); this.slot = -1; this.watching = false; this.players = {}; this.subs = []; this.ms = []; this.game = null; this.sel = {}; this.left = false; this.root = db.ref('jimoto/' + this.code); }
    on(ref, ev, fn, list) { ref.on(ev, fn); (list || this.subs).push([ref, ev, fn]); }
    async join() {
      if (!this.code) throw new Error('あいことばを入れてください');
      for (const s of [0, 1]) {
        const r = await this.root.child('players/' + s).transaction(cur => (cur ? undefined : { id: this.id, name: this.name }));
        if (r.committed && r.snapshot.val() && r.snapshot.val().id === this.id) { this.slot = s; break; }
      }
      if (this.slot < 0) {
        const w = (await this.root.child('watchers').once('value')).val() || {};
        if (Object.keys(w).length >= 10) throw new Error('この部屋は観戦の人でいっぱいです（10人まで）');
        this.watching = true; const me = this.root.child('watchers/' + this.id); await me.set({ name: this.name }); me.onDisconnect().remove();
      } else {
        for (const k of ['players/', 'ready/', 'sel/']) this.root.child(k + this.slot).onDisconnect().remove();
        const other = (await this.root.child('players/' + (1 - this.slot)).once('value')).val();
        const g0 = (await this.root.child('game').once('value')).val();
        if (!other) { for (const k of ['game', 'ready', 'sel', 'pick', 'res']) await this.root.child(k).remove(); this.joinM = 1; }
        else this.joinM = ((g0 && g0.m) || 0) + 1;
      }
      this.on(this.root.child('players'), 'value', s => {
        const prev = this.players; this.players = s.val() || {}; ui.people();
        const gone = this.watching ? ((prev[0] && !this.players[0]) || (prev[1] && !this.players[1])) : (prev[1 - this.slot] && !this.players[1 - this.slot]);
        if (gone) ui.left();
        this.tryStart();
      });
      this.on(this.root.child('ready'), 'value', s => { this.ready = s.val() || {}; this.tryStart(); });
      this.on(this.root.child('game'), 'value', s => this.onGame(s.val()));
      this.on(this.root.child('sel'), 'value', s => { this.sel = s.val() || {}; ui.sel(); });
      if (this.slot >= 0) await this.root.child('ready/' + this.slot).set(this.joinM);
      return { slot: this.slot, watching: this.watching };
    }
    tryStart() {
      if (this.slot !== 0 || this.left || !this.joinM) return;
      const r = this.ready || {}, next = ((this.game && this.game.m) || 0) + 1;
      if (!this.players[0] || !this.players[1]) return;
      if (!(r[0] >= next && r[1] >= next) || this.starting === next) return;
      if (this.game && this.game.m && !this.game.done) return;
      this.starting = next;
      this.root.child('sel').remove(); this.root.child('pick').remove(); this.root.child('res').remove();
      this.root.child('game').set({ m: next });
    }
    onGame(g) {
      if (this.left) return; this.game = g; if (!g || !g.m) return;
      if (!this.watching && g.m < (this.joinM || 0)) return;
      if (this.gm === g.m) return; this.gm = g.m;
      for (const [r, e, f] of this.ms) r.off(e, f); this.ms = [];
      this.picks = {};
      this.on(this.root.child('pick/' + g.m), 'value', s => { this.picks = s.val() || {}; ui.picks(); }, this.ms);
      this.on(this.root.child('res/' + g.m), 'value', s => ui.res(s.val() || {}), this.ms);
      ui.newGame(g.m);
    }
    setSel(o) { if (this.slot >= 0 && !this.left) this.root.child('sel/' + this.slot).set(o); }
    pick(o) { if (this.slot >= 0 && this.game) this.root.child('pick/' + this.game.m + '/' + this.slot).set(o); }
    unpick() { if (this.slot >= 0 && this.game) this.root.child('pick/' + this.game.m + '/' + this.slot).remove(); }
    result(d) { if (this.slot >= 0 && this.game) this.root.child('res/' + this.game.m + '/' + this.slot).set(d); }
    done() { if (this.slot === 0 && this.game && !this.game.done) this.root.child('game').set({ m: this.game.m, done: 1 }); }
    again() { if (this.slot >= 0 && this.game) this.root.child('ready/' + this.slot).set(this.game.m + 1); }
    names() { return [0, 1].map(s => (this.players[s] ? this.players[s].name : '…')); }
    leave() {
      if (this.left) return; this.left = true;
      for (const [r, e, f] of this.subs.concat(this.ms)) r.off(e, f); this.subs = []; this.ms = [];
      if (this.watching) this.root.child('watchers/' + this.id).remove();
      else if (this.slot >= 0) for (const k of ['players/', 'ready/', 'sel/']) this.root.child(k + this.slot).remove();
    }
  }
  // ---------- 画面との橋わたし ----------
  const ui = {
    people() {
      if (!R) return; const n = R.names(); $('on-people').textContent = n[0] + ' VS ' + n[1];
      if (st().mode !== 'local') ui.status();
    },
    status() {
      if (!R) return; const s = st(), n = R.names();
      let t = n[0] + ' VS ' + n[1];
      if (!s.reveal && s.mode === 'net') {
        const fo = R.sel[1 - R.slot];
        const desc = f => '「' + (JM.CLS[f.cls || 'all'] || JM.CLS.all).n + '・' + (f.mode === 'pol' ? '政策あり' : '政策なし') + '」';
        const same = fo && fo.mode === s.pol && (fo.cls || 'all') === s.cls;
        if (fo && fo.ok && !same) t += '　あいては' + desc(fo) + 'で準備OK。合わせてね';
        else if (fo && fo.ok) t += '　あいては準備OK！';
        else if (fo) t += '　あいては' + desc(fo) + 'を選んでいます';
      }
      s.netStatus = t; $('on-st').textContent = t;
    },
    sel() {
      if (!R) return; const s = st(); const fo = R.sel[1 - R.slot];
      s.foeReady = !!(fo && fo.ok); if (s.mode === 'net' && !s.reveal) JM.renderSlots(); ui.status();
    },
    newGame(m) {
      const s = st(); s.mode = R.watching ? 'watch' : 'net'; s.my = R.slot; s.reveal = false; s.myReady = false; s.foeReady = false; s.netNote = '';
      if (!R.watching) { const o = s.slots[1 - R.slot]; o.e = null; o.parts = null; o.cards = []; o.dir = 0; }
      $('result').classList.remove('on'); JM.openSetup(); ui.status();
      if (!R.watching) R.setSel({ mode: s.pol, cls: s.cls, ok: 0 });
    },
    async picks() {
      const s = st(), P = R.picks || {};
      if (!P[0] || !P[1] || s.reveal) return;
      if (P[0].mode !== P[1].mode || (P[0].cls || 'all') !== (P[1].cls || 'all')) return;   // モード・階級がちがうときは始めない
      s.reveal = true; s.pol = P[0].mode; s.cls = P[0].cls || 'all'; JM.syncMode();
      for (const i of [0, 1]) {
        const p = P[i], e = D.byId.get(p.id); if (!e) continue;
        const sl = s.slots[i]; sl.dir = p.dir | 0; sl.cards = (p.cards || []).filter(k => JM.POL[k]);
        if (sl.e !== e || !sl.parts) { sl.e = e; sl.parts = await D.shape(e.id); }
      }
      JM.renderSlots();
      setTimeout(() => { const r = JM.startBattle(true); if (r && !R.watching) R.result(r.digest); s.myDigest = r && r.digest; }, 900);
    },
    res(v) {
      const s = st(); if (!v[0] || !v[1]) return;
      s.netNote = v[0] === v[1] ? 'ふたりの画面で同じ結果になりました。' : '※ふたりの画面で結果がずれました（お知らせください）';
      if (R && R.slot === 0) R.done();
    },
    left() { JM.toast('あいてがいなくなりました'); setTimeout(() => { Net.leave(); JM.toTitle(); }, 1500); },
  };
  const Net = JM.Net = {
    async join(name, code) {
      $('on-err').textContent = '';
      if (!clean(code)) { $('on-err').textContent = 'あいことばを入れてください'; return; }
      if (!JM.D.ready) { $('on-err').textContent = '市町村を読みこみ中です。少し待ってください'; return; }
      store('jm_name', name); store('jm_code', code);
      $('btn-join').disabled = true;
      try {
        const db = await getDb(); R = new Room(db, code, name); JM.room = R;
        const r = await R.join();
        $('on-form').classList.add('hide'); $('on-wait').classList.remove('hide');
        $('on-msg').textContent = r.watching ? '観戦します。試合を待っています…' : 'あいてを待っています…';
      } catch (e) { $('on-err').textContent = e.message || 'つながりませんでした'; R = null; }
      $('btn-join').disabled = false;
    },
    // 自分のえらびが変わった（準備OKだったら取り消す）
    changed() {
      if (!R || R.watching) return; const s = st();
      if (s.myReady) { s.myReady = false; R.unpick(); JM.toast('変更したので、準備OKを取り消しました'); }
      R.setSel({ mode: s.pol, cls: s.cls, ok: 0 }); JM.renderSlots(); ui.status();
    },
    ready() {
      if (!R || R.watching) return; const s = st(), sl = s.slots[R.slot]; if (!sl.e) return;
      s.myReady = true; R.setSel({ mode: s.pol, cls: s.cls, ok: 1 });
      R.pick({ id: sl.e.id, dir: sl.dir, cards: s.pol === 'pol' ? sl.cards : [], mode: s.pol, cls: s.cls });
      JM.renderSlots(); ui.status();
    },
    finished() { },
    again() { if (R && !R.watching) { R.again(); st().netNote = ''; JM.toast('あいてを待っています…'); } },
    leave() { if (R) { R.leave(); R = null; JM.room = null; } },
  };
  JM.cleanCode = clean;
})();
