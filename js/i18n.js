// =============================================
//  ことば（日本語・English・繁體中文・한국어）
//  ===========================================

(function () {
  var LANGS = ['ja', 'en', 'zh', 'ko'];
  var KEY = 'jimoto-lang';
  var D = {
 "lang_label": [
  "ことば",
  "Language",
  "語言",
  "언어"
 ],
 "home": [
  "なすびのお庭へ",
  "Nasubi's Garden (more games)",
  "前往茄子的庭院",
  "가지의 정원으로"
 ],
 "howto": [
  "あそびかた",
  "How to play",
  "玩法",
  "플레이 방법"
 ],
 "close": [
  "とじる",
  "Close",
  "關閉",
  "닫기"
 ],
 "back": [
  "もどる",
  "Back",
  "返回",
  "돌아가기"
 ],
 "to_title": [
  "タイトルへ",
  "Back to title",
  "回到標題",
  "타이틀로"
 ],
 "again": [
  "もう一回",
  "Play again",
  "再來一局",
  "한 판 더"
 ],
 "easy": [
  "よわい",
  "Easy",
  "簡單",
  "약함"
 ],
 "normal": [
  "ふつう",
  "Normal",
  "普通",
  "보통"
 ],
 "hard": [
  "つよい",
  "Hard",
  "困難",
  "강함"
 ],
 "vs_cpu": [
  "CPUとたいせん",
  "VS CPU",
  "對戰CPU",
  "CPU와 대전"
 ],
 "online": [
  "あいことばで対戦",
  "Play with a passcode",
  "用暗號對戰",
  "암호로 대전"
 ],
 "passcode": [
  "あいことば",
  "Passcode",
  "暗號",
  "암호"
 ],
 "name": [
  "なまえ",
  "Name",
  "名字",
  "이름"
 ],
 "noname": [
  "ななし",
  "Anonymous",
  "無名氏",
  "익명"
 ],
 "online_hint": [
  "同じあいことばを入れた人と対戦。3人目からは観戦になります。",
  "Play against whoever enters the same passcode. From the 3rd person on, you watch.",
  "和輸入相同暗號的人對戰。第3個人開始為觀戰。",
  "같은 암호를 입력한 사람과 대전. 3번째 사람부터는 관전이 됩니다."
 ],
 "join": [
  "はいる",
  "Join",
  "進入",
  "입장"
 ],
 "wait_pre": [
  "あいことば「",
  "Passcode: ",
  "暗號「",
  "암호 「"
 ],
 "wait_post": [
  "」",
  "",
  "」",
  "」"
 ],
 "waiting": [
  "あいてを待っています…",
  "Waiting for an opponent…",
  "等待對手中…",
  "상대를 기다리는 중…"
 ],
 "copy_link": [
  "さそうリンクをコピー",
  "Copy invite link",
  "複製邀請連結",
  "초대 링크 복사"
 ],
 "copied": [
  "コピーしました！",
  "Copied!",
  "已複製！",
  "복사했어요!"
 ],
 "send_link": [
  "このリンクを送ってください",
  "Send this link",
  "請傳送這個連結",
  "이 링크를 보내 주세요"
 ],
 "err_code": [
  "あいことばを入れてください（. # $ / [ ] は使えません）",
  "Enter a passcode (. # $ / [ ] are not allowed)",
  "請輸入暗號（不能使用 . # $ / [ ]）",
  "암호를 입력해 주세요 (. # $ / [ ] 는 사용할 수 없어요)"
 ],
 "err_code_short": [
  "あいことばを入れてください",
  "Enter a passcode",
  "請輸入暗號",
  "암호를 입력해 주세요"
 ],
 "connecting": [
  "つないでいます…",
  "Connecting…",
  "連線中…",
  "연결 중…"
 ],
 "err_net": [
  "通信できませんでした。電波のよいところでもう一度ためしてください",
  "Couldn't connect. Please try again where the signal is better.",
  "無法連線。請在訊號好的地方再試一次。",
  "연결하지 못했어요. 신호가 좋은 곳에서 다시 시도해 주세요."
 ],
 "err_notready": [
  "オンライン対戦はまだ準備中です",
  "Online play isn't ready yet",
  "線上對戰還在準備中",
  "온라인 대전은 아직 준비 중이에요"
 ],
 "err_conn": [
  "つながりませんでした",
  "Couldn't connect",
  "無法連線",
  "연결되지 않았어요"
 ],
 "left_win": [
  "相手が抜けたので、あなたの勝ち！",
  "Your opponent left, so you win!",
  "對手離開了，你贏了！",
  "상대가 나가서 당신의 승리!"
 ],
 "left": [
  "あいてが退室しました",
  "Your opponent left",
  "對手已離開",
  "상대가 퇴장했어요"
 ],
 "watch_in": [
  "観戦で入りました。試合が始まるのを待っています…",
  "You joined as a spectator. Waiting for the game to start…",
  "已用觀戰身分進入。等待比賽開始…",
  "관전으로 입장했어요. 경기 시작을 기다리는 중…"
 ],
 "wait_next": [
  "次の試合が始まるのを待っています…",
  "Waiting for the next game…",
  "等待下一局開始…",
  "다음 경기를 기다리는 중…"
 ],
 "wait_rematch": [
  "あいての「もう一回」を待っています…",
  "Waiting for your opponent to choose \"Play again\"…",
  "等待對手按「再來一局」…",
  "상대의 '한 판 더'를 기다리는 중…"
 ],
 "you": [
  "あなた",
  "You",
  "你",
  "나"
 ],
 "cpu": [
  "CPU",
  "CPU",
  "CPU",
  "CPU"
 ],
 "your_turn": [
  "あなたの番",
  "Your turn",
  "輪到你",
  "내 차례"
 ],
 "cpu_wait_label": [
  "CPU（ふつう）と遊びながら待つ",
  "Play the CPU (Normal) while waiting",
  "一邊和CPU（普通）玩一邊等",
  "기다리는 동안 CPU(보통)와 플레이"
 ],
 "qm_btn": [
  "だれかと対戦",
  "Play someone online",
  "隨機對戰",
  "아무나와 대전"
 ],
 "qm_stat": [
  "対戦待ち <b>{w}</b>人・対戦中 <b>{p}</b>組",
  "<b>{w}</b> waiting · <b>{p}</b> playing",
  "等待中 <b>{w}</b>人・對戰中 <b>{p}</b>組",
  "대기 <b>{w}</b>명 · 대전 중 <b>{p}</b>쌍"
 ],
 "qm_prime_hot": [
  "🔥 いま対戦タイム！（22時まで）",
  "🔥 Battle time now! (until 22:00 JST)",
  "🔥 現在是對戰時間！（到日本時間22點）",
  "🔥 지금은 대전 타임! (일본 시간 22시까지)"
 ],
 "qm_prime": [
  "🌙 毎晩21時〜22時は対戦タイム",
  "🌙 Battle time every night 21:00–22:00 JST",
  "🌙 每晚日本時間21〜22點是對戰時間",
  "🌙 매일 밤 일본 시간 21~22시는 대전 타임"
 ],
 "qm_sub": [
  "いま待っている人と、自動でつながります。",
  "You'll be matched automatically with someone who's waiting.",
  "自動和正在等待的人配對。",
  "기다리고 있는 사람과 자동으로 연결돼요."
 ],
 "qm_go": [
  "さがす",
  "Find a match",
  "尋找",
  "찾기"
 ],
 "qm_badname": [
  "その名前は使えません。ほかの名前にしてね",
  "That name can't be used. Please choose another.",
  "這個名字不能使用，請換一個。",
  "그 이름은 사용할 수 없어요. 다른 이름으로 해 주세요."
 ],
 "qm_searching": [
  "相手をさがしています",
  "Looking for an opponent",
  "正在尋找對手",
  "상대를 찾는 중"
 ],
 "qm_wait_pre": [
  "いま対戦待ち ",
  "Waiting now: ",
  "目前等待中 ",
  "현재 대기 "
 ],
 "qm_wait_post": [
  "人",
  "",
  "人",
  "명"
 ],
 "qm_cpu": [
  "CPUと遊びながら待つ",
  "Play the CPU while waiting",
  "一邊和CPU玩一邊等",
  "기다리는 동안 CPU와 플레이"
 ],
 "qm_cancel": [
  "やめる",
  "Cancel",
  "取消",
  "그만두기"
 ],
 "qm_retry": [
  "もう一度さがす",
  "Search again",
  "再找一次",
  "다시 찾기"
 ],
 "qm_searching_t": [
  "相手をさがしています… {t}",
  "Looking for an opponent… {t}",
  "正在尋找對手… {t}",
  "상대를 찾는 중… {t}"
 ],
 "qm_calling": [
  "CPUと遊んでいる人に声をかけています…",
  "Inviting someone who is playing the CPU…",
  "正在邀請正在和CPU玩的人…",
  "CPU와 플레이 중인 사람에게 신청하는 중…"
 ],
 "qm_declined": [
  "相手が見送りました。ほかの人をさがします",
  "They passed. Looking for someone else.",
  "對方跳過了，改找其他人。",
  "상대가 넘겼어요. 다른 사람을 찾을게요."
 ],
 "qm_found": [
  "相手が見つかりました！",
  "Opponent found!",
  "找到對手了！",
  "상대를 찾았어요!"
 ],
 "qm_avail": [
  "対戦できる相手がいます！",
  "Someone is ready to play!",
  "有可以對戰的對手！",
  "대전할 수 있는 상대가 있어요!"
 ],
 "qm_play": [
  "対戦する",
  "Play",
  "對戰",
  "대전하기"
 ],
 "qm_pass": [
  "見送る",
  "Pass",
  "跳過",
  "넘기기"
 ],
 "qm_taken": [
  "さっきの相手は、ほかの人と対戦を始めました。もう少し待ってね",
  "That player started a match with someone else. Please wait a little longer.",
  "剛才的對手已經和別人開始對戰了。請再等一下。",
  "방금 상대는 다른 사람과 대전을 시작했어요. 조금만 더 기다려 주세요."
 ],
 "qm_fail": [
  "相手とつながりませんでした（{c}）",
  "Couldn't connect to your opponent ({c})",
  "無法和對手連線（{c}）",
  "상대와 연결되지 않았어요 ({c})"
 ],
 "qm_nojoin": [
  "入れませんでした",
  "Couldn't join",
  "無法進入",
  "들어가지 못했어요"
 ],
 "qm_next": [
  "次の相手をさがす",
  "Find next opponent",
  "尋找下一位對手",
  "다음 상대 찾기"
 ],
 "snd": [
  "音：",
  "Sound: ",
  "聲音：",
  "소리: "
 ],
 "snd_on": [
  "あり",
  "On",
  "開",
  "켬"
 ],
 "snd_off": [
  "なし",
  "Off",
  "關",
  "끔"
 ],
 "loading": [
  "市町村を読みこみ中…",
  "Loading places…",
  "正在讀取市町村…",
  "지명을 불러오는 중…"
 ],
 "loading_wait": [
  "市町村を読みこみ中です。少し待ってください",
  "Still loading places. Please wait a moment.",
  "正在讀取市町村，請稍候。",
  "지명을 불러오는 중이에요. 잠시 기다려 주세요."
 ],
 "back_arrow": [
  "← もどる",
  "← Back",
  "← 返回",
  "← 돌아가기"
 ],
 "shape_err": [
  "形を読みこめませんでした",
  "Couldn't load the shape",
  "無法讀取形狀",
  "모양을 불러오지 못했어요"
 ],
 "loading_s": [
  "読みこみ中…",
  "Loading…",
  "讀取中…",
  "불러오는 중…"
 ],
 "random": [
  "おまかせ",
  "Random",
  "隨機",
  "랜덤"
 ],
 "colon": [
  "：",
  ": ",
  "：",
  ": "
 ],
 "dot": [
  "・",
  " · ",
  "・",
  " · "
 ],
 "ok": [
  "OK",
  "OK",
  "OK",
  "OK"
 ],
 "copy": [
  "コピー",
  "Copy",
  "複製",
  "복사"
 ],
 "code": [
  "コード",
  "Code",
  "代碼",
  "코드"
 ],
 "n_w": [
  "{n}勝",
  "{n}W",
  "{n}勝",
  "{n}승"
 ],
 "n_l": [
  "{n}敗",
  "{n}L",
  "{n}敗",
  "{n}패"
 ],
 "retired": [
  "引退",
  "Retired",
  "已退役",
  "은퇴"
 ],
 "hidden_s": [
  "非表示",
  "Hidden",
  "隱藏",
  "숨김"
 ],
 "put_ago": [
  "{a}に置いた",
  "posted {a}",
  "{a}發出",
  "{a} 올림"
 ],
 "none_challenged": [
  "まだだれも挑戦していません",
  "No one has tried it yet",
  "還沒有人挑戰",
  "아직 아무도 도전하지 않았어요"
 ],
 "mk_w": [
  "勝",
  "W",
  "勝",
  "승"
 ],
 "mk_l": [
  "負",
  "L",
  "負",
  "패"
 ],
 "recruit": [
  "挑戦者を募集",
  "Find challengers",
  "募集挑戰者",
  "도전자 모집"
 ],
 "retire": [
  "引退させる",
  "Retire",
  "讓它退役",
  "은퇴시키기"
 ],
 "retire_q": [
  "引退させますか？",
  "Retire this challenge?",
  "要讓它退役嗎？",
  "은퇴시킬까요?"
 ],
 "retired_toast": [
  "引退させました",
  "Retired",
  "已退役",
  "은퇴시켰어요"
 ],
 "fail_net": [
  "できませんでした。通信を確認してね",
  "Couldn't do it. Check your connection.",
  "無法完成。請確認網路。",
  "하지 못했어요. 연결을 확인해 주세요."
 ],
 "chal_none_s": [
  "まだ挑戦状がありません",
  "No challenges yet",
  "還沒有挑戰書",
  "아직 도전장이 없어요"
 ],
 "xf_h": [
  "ほかの端末に引き継ぐ",
  "Move to another device",
  "轉移到其他裝置",
  "다른 기기로 옮기기"
 ],
 "xf_out": [
  "コードを出す",
  "Get code",
  "產生代碼",
  "코드 만들기"
 ],
 "xf_in": [
  "コードを入れる",
  "Enter code",
  "輸入代碼",
  "코드 입력"
 ],
 "xf_code_h": [
  "引き継ぎコード",
  "Transfer code",
  "轉移代碼",
  "이전 코드"
 ],
 "xf_code_sub": [
  "新しい端末の「あなたの挑戦状」→「コードを入れる」に入力すると、挑戦状（{n}枚）を引き継げます。<br>コードは人に教えないでください（引退もできてしまいます）。",
  "On your new device, open \"Your challenges\" → \"Enter code\" to bring over your challenges ({n}).<br>Don't share this code (it can also retire them).",
  "在新裝置的「你的挑戰書」→「輸入代碼」輸入，就能轉移挑戰書（{n}張）。<br>請不要把代碼告訴別人（別人也能讓它退役）。",
  "새 기기의 \"내 도전장\" → \"코드 입력\"에 입력하면 도전장({n}장)을 옮길 수 있어요.<br>코드는 다른 사람에게 알려주지 마세요 (은퇴도 시킬 수 있어요)."
 ],
 "xf_fail": [
  "コードを作れませんでした。通信を確認してね",
  "Couldn't create a code. Check your connection.",
  "無法產生代碼。請確認網路。",
  "코드를 만들지 못했어요. 연결을 확인해 주세요."
 ],
 "xf_in_sub": [
  "前の端末で出した引き継ぎコード（10文字）を入れてください。",
  "Enter the transfer code (10 characters) from your old device.",
  "請輸入在舊裝置產生的轉移代碼（10個字）。",
  "이전 기기에서 만든 이전 코드(10자)를 입력해 주세요."
 ],
 "xf_go": [
  "引き継ぐ",
  "Transfer",
  "轉移",
  "옮기기"
 ],
 "xf_len": [
  "10文字のコードを入れてください",
  "Enter the 10-character code",
  "請輸入10個字的代碼",
  "10자 코드를 입력해 주세요"
 ],
 "xf_notfound": [
  "そのコードは見つかりませんでした",
  "That code wasn't found",
  "找不到這個代碼",
  "그 코드를 찾지 못했어요"
 ],
 "xf_added": [
  "{n}枚の挑戦状を引き継ぎました",
  "Transferred {n} challenge(s)",
  "已轉移{n}張挑戰書",
  "도전장 {n}장을 옮겼어요"
 ],
 "xf_already": [
  "もう全部この端末にあります",
  "They are all on this device already",
  "已經全部在這個裝置上了",
  "이미 전부 이 기기에 있어요"
 ],
 "rk0": [
  "横綱",
  "Yokozuna",
  "橫綱",
  "요코즈나"
 ],
 "rk1": [
  "大関",
  "Ozeki",
  "大關",
  "오제키"
 ],
 "rk2": [
  "関脇",
  "Sekiwake",
  "關脇",
  "세키와케"
 ],
 "rk3": [
  "小結",
  "Komusubi",
  "小結",
  "고무스비"
 ],
 "rk_mae": [
  "前頭{n}枚目",
  "Maegashira {n}",
  "前頭{n}",
  "마에가시라 {n}"
 ],
 "og_jp": [
  "日本（都道府県）",
  "Japan (prefectures)",
  "日本（都道府縣）",
  "일본 (도도부현)"
 ],
 "og_world": [
  "世界",
  "World",
  "世界",
  "세계"
 ],
 "w_region": [
  "世界の国・昔の国",
  "World countries & former countries",
  "世界各國・昔日國家",
  "세계의 나라·옛 나라"
 ],
 "verifying": [
  "勝ちを確かめています… {k}/{n}",
  "Verifying wins… {k}/{n}",
  "正在確認勝場… {k}/{n}",
  "승리를 확인하는 중… {k}/{n}"
 ],
 "bz_whose": [
  "<b>{n}</b>さんの",
  "<b>{n}</b>'s",
  "<b>{n}</b>的",
  "<b>{n}</b>님의"
 ],
 "bz_30w": [
  "30日で<b>{w}勝</b>",
  "<b>{w}W</b> in 30 days",
  "30天<b>{w}勝</b>",
  "30일간 <b>{w}승</b>"
 ],
 "bz_30wp": [
  "30日で<b>{w}勝以上</b>",
  "<b>{w}+ W</b> in 30 days",
  "30天<b>{w}勝以上</b>",
  "30일간 <b>{w}승 이상</b>"
 ],
 "bz_total": [
  "通算{w}勝{l}敗",
  "Total {w}W {l}L",
  "累計{w}勝{l}敗",
  "통산 {w}승 {l}패"
 ],
 "checking": [
  "確認中",
  "checking",
  "確認中",
  "확인 중"
 ],
 "challenge": [
  "挑む",
  "Fight",
  "挑戰",
  "도전"
 ],
 "wl": [
  "{w}勝{l}敗",
  "{w}W {l}L",
  "{w}勝{l}敗",
  "{w}승 {l}패"
 ],
 "no_chal_yet": [
  "まだだれも挑戦していない",
  "No challengers yet",
  "還沒有人挑戰",
  "아직 아무도 도전하지 않음"
 ],
 "chal_searching": [
  "挑戦状をさがしています…",
  "Finding a challenge…",
  "正在尋找挑戰書…",
  "도전장을 찾는 중…"
 ],
 "chal_allmine": [
  "いまある挑戦状は、ぜんぶあなたのものです",
  "All current challenges are yours",
  "目前的挑戰書都是你的",
  "지금 있는 도전장은 전부 당신 거예요"
 ],
 "chal_none": [
  "まだ挑戦状がありません。試合のあとに置いてみよう",
  "No challenges yet. Post one after a match!",
  "還沒有挑戰書。比賽後發一張吧！",
  "아직 도전장이 없어요. 경기 후에 올려 보세요!"
 ],
 "chal_loadfail": [
  "挑戦状を読みこめませんでした",
  "Couldn't load challenges",
  "無法讀取挑戰書",
  "도전장을 불러오지 못했어요"
 ],
 "chal_retired": [
  "この挑戦状は引退しました",
  "This challenge has been retired",
  "這張挑戰書已退役",
  "이 도전장은 은퇴했어요"
 ],
 "chal_notfound": [
  "この挑戦状は見つかりませんでした",
  "This challenge wasn't found",
  "找不到這張挑戰書",
  "이 도전장을 찾지 못했어요"
 ],
 "chal_arrived": [
  "{n}さんの挑戦状が届きました",
  "{n}'s challenge has arrived",
  "收到{n}的挑戰書",
  "{n}님의 도전장이 도착했어요"
 ],
 "chal_won": [
  "{n}さんの挑戦状に勝った！",
  "You beat {n}'s challenge!",
  "贏了{n}的挑戰書！",
  "{n}님의 도전장에 이겼다!"
 ],
 "chal_lost": [
  "{n}さんの挑戦状に負けた…",
  "Lost to {n}'s challenge…",
  "輸給{n}的挑戰書…",
  "{n}님의 도전장에 졌다…"
 ],
 "chal_draw": [
  "{n}さんの挑戦状と引き分け",
  "Drew with {n}'s challenge",
  "和{n}的挑戰書平手",
  "{n}님의 도전장과 무승부"
 ],
 "this_chal_rec": [
  "（この挑戦状：{r}）",
  " (This challenge: {r})",
  "（這張挑戰書：{r}）",
  " (이 도전장: {r})"
 ],
 "copy_fail": [
  "コピーできませんでした",
  "Couldn't copy",
  "無法複製",
  "복사하지 못했어요"
 ],
 "recruit_post": [
  "挑戦者を募集する（投稿）",
  "Find challengers (post)",
  "募集挑戰者（發文）",
  "도전자 모집 (게시)"
 ],
 "copy_link2": [
  "リンクをコピー",
  "Copy link",
  "複製連結",
  "링크 복사"
 ],
 "put_fail": [
  "置けませんでした。通信を確認してね",
  "Couldn't post. Check your connection.",
  "無法發出。請確認網路。",
  "올리지 못했어요. 연결을 확인해 주세요."
 ],
 "mine_sum": [
  "あなたの挑戦状 {n}枚：{w}勝{l}敗",
  "Your challenges ({n}): {w}W {l}L",
  "你的挑戰書 {n}張：{w}勝{l}敗",
  "내 도전장 {n}장: {w}승 {l}패"
 ],
 "news_lost": [
  "🔔 挑戦状が<b>{n}回</b>破られました{x}",
  "🔔 Your challenges were beaten <b>{n}×</b>{x}",
  "🔔 挑戰書被打敗了<b>{n}次</b>{x}",
  "🔔 도전장이 <b>{n}번</b> 깨졌어요{x}"
 ],
 "news_wonx": [
  "・{w}勝",
  " · {w}W",
  "・{w}勝",
  " · {w}승"
 ],
 "news_won": [
  "🔔 挑戦状が<b>{n}回</b>勝ちました",
  "🔔 Your challenges won <b>{n}×</b>",
  "🔔 挑戰書贏了<b>{n}次</b>",
  "🔔 도전장이 <b>{n}번</b> 이겼어요"
 ],
 "min_ago": [
  "{n}分前",
  "{n}m ago",
  "{n}分鐘前",
  "{n}분 전"
 ],
 "hr_ago": [
  "{n}時間前",
  "{n}h ago",
  "{n}小時前",
  "{n}시간 전"
 ],
 "day_ago": [
  "{n}日前",
  "{n}d ago",
  "{n}天前",
  "{n}일 전"
 ],
 "load_fail_net": [
  "読みこめませんでした。通信を確認してね",
  "Couldn't load. Check your connection.",
  "無法讀取。請確認網路。",
  "불러오지 못했어요. 연결을 확인해 주세요."
 ],
 "room_full": [
  "この部屋は観戦の人でいっぱいです（10人まで）",
  "This room is full of spectators (max 10)",
  "這個房間的觀戰人數已滿（最多10人）",
  "이 방은 관전자가 가득 찼어요 (최대 10명)"
 ],
 "net_same": [
  "ふたりの画面で同じ結果になりました。",
  "Both screens got the same result.",
  "兩邊畫面的結果相同。",
  "두 화면의 결과가 같았어요."
 ],
 "net_diff": [
  "※ふたりの画面で結果がずれました（お知らせください）",
  "※ The two screens got different results (please let us know)",
  "※兩邊畫面的結果不同（請告訴我們）",
  "※두 화면의 결과가 달라요 (알려 주세요)"
 ],
 "opp_left_room": [
  "相手が部屋から出ました",
  "Your opponent left the room",
  "對手離開了房間",
  "상대가 방에서 나갔어요"
 ],
 "you_win": [
  "あなたの勝ち！",
  "You win!",
  "你贏了！",
  "당신의 승리!"
 ],
 "play_other": [
  "また別の人と対戦できます。",
  "You can play someone else.",
  "可以再和其他人對戰。",
  "다른 사람과 또 대전할 수 있어요."
 ],
 "opp_gone": [
  "あいてがいなくなりました",
  "Your opponent is gone",
  "對手不見了",
  "상대가 사라졌어요"
 ],
 "watch_wait": [
  "観戦します。試合を待っています…",
  "Spectating. Waiting for the match…",
  "觀戰中。等待比賽…",
  "관전합니다. 경기를 기다리는 중…"
 ],
 "opp_ready": [
  "　あいては準備OK！",
  " Opponent is ready!",
  "　對手已準備好！",
  " 상대는 준비 완료!"
 ],
 "ph_name8": [
  "8文字まで",
  "Up to 8 chars",
  "最多8個字",
  "8자까지"
 ],
 "join_in": [
  "入る",
  "Join",
  "進入",
  "입장"
 ],
 "draw": [
  "引き分け",
  "Draw",
  "平手",
  "무승부"
 ],
 "img_result": [
  "結果画像を出す",
  "Show result image",
  "顯示結果圖片",
  "결과 이미지 보기"
 ],
 "img_win": [
  "勝利画像を出す",
  "Show victory image",
  "顯示勝利圖片",
  "승리 이미지 보기"
 ],
 "img_making": [
  "画像を作っています…",
  "Making image…",
  "正在製作圖片…",
  "이미지 만드는 중…"
 ],
 "img_fail": [
  "画像を作れませんでした",
  "Couldn't make the image",
  "無法製作圖片",
  "이미지를 만들지 못했어요"
 ],
 "img_saved_paste": [
  "画像を保存しました。投稿画面に貼りつけてください",
  "Image saved. Attach it to your post.",
  "圖片已儲存，請貼到發文畫面。",
  "이미지를 저장했어요. 게시 화면에 붙여 주세요."
 ],
 "res_img": [
  "結果画像",
  "Result image",
  "結果圖片",
  "결과 이미지"
 ],
 "post_x": [
  "Xに投稿",
  "Post to X",
  "發到X",
  "X에 올리기"
 ],
 "save_img": [
  "画像を保存",
  "Save image",
  "儲存圖片",
  "이미지 저장"
 ],
 "long_press": [
  "画像を長押しでも保存できます",
  "You can also long-press the image to save it",
  "長按圖片也可以儲存",
  "이미지를 길게 눌러도 저장할 수 있어요"
 ],
 "stamp_win": [
  "勝負|あり",
  "GAME|SET",
  "勝負|已分",
  "승부|결정"
 ],
 "stamp_draw": [
  "痛み|分け",
  "DEAD|HEAT",
  "不分|勝負",
  "무승부|"
 ],
 "img_and": [
  "{a} と {b}",
  "{a} & {b}",
  "{a} 與 {b}",
  "{a} · {b}"
 ],
 "img_wins": [
  "の勝ち！",
  "WINS!",
  "獲勝！",
  "승리!"
 ],
 "img_beat": [
  "{n} を破る",
  "beat {n}",
  "打敗 {n}",
  "{n} 격파"
 ],
 "tg_close": [
  "ギリギリの勝ち",
  "Narrow win",
  "險勝",
  "아슬아슬한 승리"
 ],
 "tg_time": [
  "時間切れ判定",
  "Won on time",
  "時間到判定",
  "시간 종료 판정"
 ],
 "tg_chal": [
  "{n}さんの挑戦状",
  "{n}'s challenge",
  "{n}的挑戰書",
  "{n}님의 도전장"
 ],
 "sh_tags": [
  "【{t}】",
  "[{t}] ",
  "【{t}】",
  "[{t}] "
 ],
 "sh_chal": [
  "\n{n}さんの挑戦状に挑戦！あなたも→ {u}",
  "\nTook on {n}'s challenge! Your turn → {u}",
  "\n挑戰了{n}的挑戰書！你也來→ {u}",
  "\n{n}님의 도전장에 도전! 당신도→ {u}"
 ],
 "cpu_wait_chal": [
  "挑戦状と戦いながら待つ",
  "Fight challenges while waiting",
  "一邊迎戰挑戰書一邊等",
  "기다리는 동안 도전장과 싸우기"
 ],
 "put_chal": [
  "挑戦状を置く",
  "Post challenge",
  "發出挑戰書",
  "도전장 올리기"
 ],
 "putting": [
  "置いています…",
  "Posting…",
  "發出中…",
  "올리는 중…"
 ],
 "put_done": [
  "挑戦状を置きました！",
  "Challenge posted!",
  "挑戰書已發出！",
  "도전장을 올렸어요!"
 ],
 "bz_empty30": [
  "この30日、「{r}」で挑戦者を倒した挑戦状はまだありません。",
  "No \"{r}\" challenge has beaten a challenger in the last 30 days.",
  "這30天內，「{r}」還沒有打倒挑戰者的挑戰書。",
  "최근 30일간 \"{r}\"에서 도전자를 쓰러뜨린 도전장은 아직 없어요."
 ],
 "revenge": [
  "仕返し",
  "Revenge",
  "報仇",
  "복수"
 ],
 "retire_body": [
  "<b>{n}</b>の挑戦状は、もうだれとも戦わず、番付からも外れます。<br>もとにもどせません。",
  "The <b>{n}</b> challenge will no longer fight anyone and leaves the Rankings.<br>This can't be undone.",
  "<b>{n}</b>的挑戰書將不再和任何人對戰，也會從排行榜移除。<br>無法復原。",
  "<b>{n}</b> 도전장은 더 이상 누구와도 싸우지 않고 순위표에서도 빠져요.<br>되돌릴 수 없어요."
 ],
 "res_lost": [
  "<b>{n}</b>さんの{t}に破られた",
  "Beaten by <b>{n}</b>'s {t}",
  "被<b>{n}</b>的{t}打敗",
  "<b>{n}</b>님의 {t}에게 깨짐"
 ],
 "res_won": [
  "<b>{n}</b>さんの{t}を倒した",
  "Beat <b>{n}</b>'s {t}",
  "打倒了<b>{n}</b>的{t}",
  "<b>{n}</b>님의 {t} 격파"
 ],
 "btn_chal": [
  "挑戦状と戦う",
  "Take a challenge",
  "迎戰挑戰書",
  "도전장과 싸우기"
 ],
 "btn_mine": [
  "あなたの挑戦状",
  "Your challenges",
  "你的挑戰書",
  "내 도전장"
 ],
 "btn_bz": [
  "番付",
  "Rankings",
  "排行榜",
  "순위표"
 ],
 "doc_title": [
  "地元の最強",
  "Hometown Champion",
  "家鄉最強",
  "우리 동네 최강"
 ],
 "doc_desc": [
  "全国の市町村と世界の国の「本物の形」でぶつかり合う。明治から今まで、なくなった町村も昔の国も出られる。あなたの地元は最強か？",
  "Pit the real shapes of Japanese towns and countries of the world against each other. Towns that no longer exist and former countries can fight too. Is your hometown the strongest?",
  "用日本市町村與世界各國的「真實形狀」互相碰撞。從明治到現在，已消失的町村和昔日國家也能出場。你的家鄉是最強的嗎？",
  "일본 시정촌과 세계 나라의 \"진짜 모양\"으로 맞붙는다. 사라진 마을과 옛 나라도 출전 가능. 당신의 동네가 최강일까?"
 ],
 "logo": [
  "<span class=\"l1\">地元の</span><span class=\"l2\">最強</span>",
  "<span class=\"l1\">HOMETOWN</span><span class=\"l2\">CHAMPION</span>",
  "<span class=\"l1\">家鄉</span><span class=\"l2\">最強</span>",
  "<span class=\"l1\">우리 동네</span><span class=\"l2\">최강</span>"
 ],
 "logo1": [
  "地元の",
  "HOMETOWN ",
  "家鄉",
  "우리 동네 "
 ],
 "logo2": [
  "最強",
  "CHAMPION",
  "最強",
  "최강"
 ],
 "tagline": [
  "市町村の<b>本物の形</b>でぶつかり合え。<br>明治から今まで、なくなった町村もぜんぶ出られる。<br><b>世界の国</b>も参戦！",
  "Battle with the <b>real shapes</b> of Japanese towns, even ones long gone. <b>World countries</b> join too!",
  "用市町村的<b>真實形狀</b>互相碰撞。<br>從明治到現在，已消失的町村也全都能出場。<br><b>世界各國</b>也參戰！",
  "시정촌의 <b>진짜 모양</b>으로 맞붙어라.<br>메이지부터 오늘까지, 사라진 마을도 출전.<br><b>세계의 나라</b>도 참전!"
 ],
 "btn_play": [
  "好きな2つを戦わせる",
  "Pick any 2 and fight",
  "選兩個來對戰",
  "아무거나 2개 골라 싸우기"
 ],
 "btn_online": [
  "あいことば対戦",
  "Passcode battle",
  "暗號對戰",
  "암호 대전"
 ],
 "dangan_link": [
  "新作：3つをくっつけてコマにする「弾丸合併」→",
  "New: stick 3 together into a spinning top in \"Bullet Merger\" →",
  "新作：把3個黏成陀螺的「子彈合併」→",
  "신작: 3개를 붙여 팽이로 만드는 \"탄환 합병\" →"
 ],
 "loaded_n": [
  "全{n}の市町村・区・国が出場できます",
  "{n} towns, wards and countries can fight",
  "共{n}個市町村・區・國家可以出場",
  "총 {n}개의 시정촌·구·나라가 출전할 수 있어요"
 ],
 "load_err2": [
  "読みこめませんでした。再読みこみしてください",
  "Couldn't load. Please reload the page.",
  "無法讀取，請重新整理頁面。",
  "불러오지 못했어요. 새로고침해 주세요."
 ],
 "pol_on": [
  "政策あり",
  "Policies",
  "有政策",
  "정책 있음"
 ],
 "pol_off": [
  "政策なし",
  "No policies",
  "無政策",
  "정책 없음"
 ],
 "fight_btn": [
  "はっけよい！",
  "FIGHT!",
  "開打！",
  "시작!"
 ],
 "side0": [
  "左・赤",
  "Left · Red",
  "左・紅",
  "왼쪽 · 빨강"
 ],
 "side1": [
  "右・青",
  "Right · Blue",
  "右・藍",
  "오른쪽 · 파랑"
 ],
 "foe_both": [
  "ふたりが準備中…",
  "Both players are getting ready…",
  "兩人準備中…",
  "두 사람이 준비 중…"
 ],
 "foe_ready": [
  "あいては準備OK！",
  "Opponent is ready!",
  "對手已準備好！",
  "상대는 준비 완료!"
 ],
 "foe_prep": [
  "あいてが準備中…",
  "Opponent is getting ready…",
  "對手準備中…",
  "상대가 준비 중…"
 ],
 "foe_hidden": [
  "（公開まで見えません）",
  "(hidden until the reveal)",
  "（公開前看不到）",
  "(공개 전까지 보이지 않아요)"
 ],
 "pick_prompt": [
  "市町村・国をえらんでください",
  "Choose a town or country",
  "請選擇市町村或國家",
  "시정촌이나 나라를 골라 주세요"
 ],
 "pick": [
  "えらぶ",
  "Choose",
  "選擇",
  "고르기"
 ],
 "pick_other": [
  "べつの市町村",
  "Change",
  "換一個",
  "다른 곳"
 ],
 "dir_lab": [
  "向き {d}°",
  "Facing {d}°",
  "方向 {d}°",
  "방향 {d}°"
 ],
 "foe_l": [
  "◀ 相手",
  "◀ Foe",
  "◀ 對手",
  "◀ 상대"
 ],
 "foe_r": [
  "相手 ▶",
  "Foe ▶",
  "對手 ▶",
  "상대 ▶"
 ],
 "area": [
  "面積 {a}km²",
  "Area {a} km²",
  "面積 {a}km²",
  "면적 {a}km²"
 ],
 "pop_unknown": [
  "人口 不明",
  "Population unknown",
  "人口 不明",
  "인구 불명"
 ],
 "pop_b0": [
  "1000万人以上",
  "10M+",
  "1000萬人以上",
  "1000만 명 이상"
 ],
 "pop_b1": [
  "100万人以上",
  "1M+",
  "100萬人以上",
  "100만 명 이상"
 ],
 "pop_b2": [
  "10万人以上",
  "100k+",
  "10萬人以上",
  "10만 명 이상"
 ],
 "pop_b3": [
  "1万人以上",
  "10k+",
  "1萬人以上",
  "1만 명 이상"
 ],
 "pop_b4": [
  "1万人未満",
  "Under 10k",
  "未滿1萬人",
  "1만 명 미만"
 ],
 "pop_band": [
  "人口 {b} <span class=\"est\">（推定）</span>",
  "Pop. {b} <span class=\"est\">(est.)</span>",
  "人口 {b} <span class=\"est\">（推估）</span>",
  "인구 {b} <span class=\"est\">(추정)</span>"
 ],
 "pop_est": [
  "人口 約{n}人 <span class=\"est\">（{y}年ごろの推定）</span>",
  "Pop. ~{n} <span class=\"est\">(est. c.{y})</span>",
  "人口 約{n}人 <span class=\"est\">（約{y}年的推估）</span>",
  "인구 약 {n}명 <span class=\"est\">({y}년경 추정)</span>"
 ],
 "pop_n_y": [
  "人口 {n}人（{y}年）",
  "Pop. {n} ({y})",
  "人口 {n}人（{y}年）",
  "인구 {n}명 ({y}년)"
 ],
 "pop_n": [
  "人口 {n}人",
  "Pop. {n}",
  "人口 {n}人",
  "인구 {n}명"
 ],
 "pol_head": [
  "政策カード（{n}/{m}枚）",
  "Policy cards ({n}/{m})",
  "政策卡（{n}/{m}張）",
  "정책 카드 ({n}/{m}장)"
 ],
 "budget": [
  "予算 <b>{a}</b>/{b}",
  "Budget <b>{a}</b>/{b}",
  "預算 <b>{a}</b>/{b}",
  "예산 <b>{a}</b>/{b}"
 ],
 "kof": [
  "（交付金＋{n}）",
  " (grant +{n})",
  "（補助款＋{n}）",
  " (교부금 +{n})"
 ],
 "cls_warn": [
  "「{n}」（{t}）には出られません",
  "Can't enter the {n} ({t})",
  "不能參加「{n}」（{t}）",
  "\"{n}\"({t})에는 나갈 수 없어요"
 ],
 "watching": [
  "観戦中",
  "Watching",
  "觀戰中",
  "관전 중"
 ],
 "ready_wait": [
  "準備OK（あいて待ち）",
  "Ready (waiting for opponent)",
  "準備好了（等待對手）",
  "준비 완료 (상대 대기)"
 ],
 "ready_ok": [
  "準備OK！",
  "Ready!",
  "準備好了！",
  "준비 완료!"
 ],
 "rnd_rule": [
  "だれかと対戦は「全体の部・政策あり」で戦います",
  "Online matches use \"Open · Policies\"",
  "隨機對戰固定為「無差別級・有政策」",
  "아무나와 대전은 \"전체 부문 · 정책 있음\"으로 싸워요"
 ],
 "chal_rule": [
  "挑戦状のルールで戦います",
  "You fight under the challenge's rules",
  "依照挑戰書的規則對戰",
  "도전장의 규칙으로 싸워요"
 ],
 "st_hp": [
  "体力",
  "Stamina",
  "體力",
  "체력"
 ],
 "st_atk": [
  "勢い",
  "Power",
  "氣勢",
  "기세"
 ],
 "st_def": [
  "かたさ",
  "Tough",
  "硬度",
  "단단함"
 ],
 "st_shp": [
  "鋭さ",
  "Sharp",
  "銳利",
  "날카로움"
 ],
 "st_spd": [
  "速さ",
  "Speed",
  "速度",
  "속도"
 ],
 "stf_hp": [
  "面積",
  "area",
  "面積",
  "면적"
 ],
 "stf_atk": [
  "人口",
  "pop.",
  "人口",
  "인구"
 ],
 "stf_def": [
  "形のまとまり",
  "compact",
  "集中度",
  "응집도"
 ],
 "stf_shp": [
  "形のトゲ",
  "spikes",
  "尖刺",
  "가시"
 ],
 "stf_spd": [
  "人口密度",
  "density",
  "密度",
  "밀도"
 ],
 "pol_road": [
  "道路整備",
  "Road works",
  "道路建設",
  "도로 정비"
 ],
 "polt_road": [
  "速さ↑↑ 体力↓",
  "Speed↑↑ Stamina↓",
  "速度↑↑ 體力↓",
  "속도↑↑ 체력↓"
 ],
 "pol_dam": [
  "ダム建設",
  "Build a dam",
  "興建水壩",
  "댐 건설"
 ],
 "polt_dam": [
  "かたさ↑ 速さ↓",
  "Tough↑ Speed↓",
  "硬度↑ 速度↓",
  "단단함↑ 속도↓"
 ],
 "pol_redev": [
  "再開発",
  "Redevelopment",
  "都市更新",
  "재개발"
 ],
 "polt_redev": [
  "鋭さ↑↑ 体力↓",
  "Sharp↑↑ Stamina↓",
  "銳利↑↑ 體力↓",
  "날카로움↑↑ 체력↓"
 ],
 "pol_port": [
  "港湾整備",
  "Port works",
  "港灣建設",
  "항만 정비"
 ],
 "polt_port": [
  "かべで跳ね返ると加速し、次の一撃が強い",
  "Bouncing off a wall speeds you up and powers your next hit",
  "撞牆反彈會加速，下一擊更強",
  "벽에 튕기면 가속하고 다음 일격이 강해진다"
 ],
 "pol_pr": [
  "観光PR",
  "Tourism PR",
  "觀光宣傳",
  "관광 홍보"
 ],
 "polt_pr": [
  "勢い↑ 相手を強く引き寄せる",
  "Power↑ Pulls the foe in hard",
  "氣勢↑ 強力吸引對手",
  "기세↑ 상대를 강하게 끌어당긴다"
 ],
 "pol_drill": [
  "防災訓練",
  "Disaster drill",
  "防災演習",
  "방재 훈련"
 ],
 "polt_drill": [
  "大きな一撃を1回だけ防ぐ",
  "Blocks one big hit",
  "擋下一次大的撞擊",
  "큰 일격을 한 번 막는다"
 ],
 "pol_shinkansen": [
  "新幹線開通",
  "Bullet train",
  "新幹線通車",
  "신칸센 개통"
 ],
 "polt_shinkansen": [
  "最初の一撃だけ超強力",
  "Your first hit is super strong",
  "只有第一擊超強",
  "첫 일격만 초강력"
 ],
 "pol_gappei": [
  "合併協議",
  "Merger talks",
  "合併協議",
  "합병 협의"
 ],
 "polt_gappei": [
  "割った欠片の分だけ回復",
  "Heal by the pieces you break off",
  "依打碎的碎片回復",
  "깨뜨린 조각만큼 회복"
 ],
 "pol_furusato": [
  "ふるさと納税",
  "Hometown tax",
  "故鄉納稅",
  "고향 납세"
 ],
 "polt_furusato": [
  "当てるたびに勢いが増す",
  "Power grows with every hit",
  "每次命中氣勢都會增加",
  "맞힐 때마다 기세가 커진다"
 ],
 "pol_castle": [
  "城下町保存",
  "Castle town",
  "城下町保存",
  "성곽 마을 보존"
 ],
 "polt_castle": [
  "中心部だけは絶対に割れない",
  "The core can never break",
  "中心部絕對不會碎",
  "중심부는 절대 깨지지 않는다"
 ],
 "cls_all": [
  "全体の部",
  "Open",
  "無差別級",
  "전체 부문"
 ],
 "cls_s": [
  "村の部",
  "Village div.",
  "村級",
  "마을 부문"
 ],
 "cls_m": [
  "町の部",
  "Town div.",
  "町級",
  "소도시 부문"
 ],
 "cls_l": [
  "市の部",
  "City div.",
  "市級",
  "시 부문"
 ],
 "cls_xl": [
  "大都市の部",
  "Metro div.",
  "大都市級",
  "대도시 부문"
 ],
 "clst_all": [
  "すべての市町村",
  "everyone",
  "所有市町村",
  "모든 시정촌"
 ],
 "clst_s": [
  "人口1万人まで",
  "pop. up to 10k",
  "人口1萬人以下",
  "인구 1만 명까지"
 ],
 "clst_m": [
  "人口1万〜5万人",
  "pop. 10k–50k",
  "人口1萬〜5萬人",
  "인구 1만~5만 명"
 ],
 "clst_l": [
  "人口5万〜30万人",
  "pop. 50k–300k",
  "人口5萬〜30萬人",
  "인구 5만~30만 명"
 ],
 "clst_xl": [
  "人口30万人以上",
  "pop. 300k+",
  "人口30萬人以上",
  "인구 30만 명 이상"
 ],
 "cls_opt_all": [
  "全体の部",
  "Open",
  "無差別級",
  "전체 부문"
 ],
 "cls_opt_s": [
  "村の部（1万人まで）",
  "Village (≤10k)",
  "村級（1萬人以下）",
  "마을 (1만 명까지)"
 ],
 "cls_opt_m": [
  "町の部（1万〜5万人）",
  "Town (10k–50k)",
  "町級（1萬〜5萬人）",
  "소도시 (1만~5만)"
 ],
 "cls_opt_l": [
  "市の部（5万〜30万人）",
  "City (50k–300k)",
  "市級（5萬〜30萬人）",
  "시 (5만~30만)"
 ],
 "cls_opt_xl": [
  "大都市の部（30万人以上）",
  "Metro (300k+)",
  "大都市級（30萬人以上）",
  "대도시 (30만 이상)"
 ],
 "ph_pk": [
  "市町村の名前（ひらがなでもOK）",
  "Town or country name",
  "市町村或國家名稱",
  "시정촌·나라 이름"
 ],
 "pk_hint0": [
  "例：「ふちゅう」「湯布院」「北海道 村」",
  "e.g. \"Sapporo\", \"Yufuin\", \"Hokkaido village\"",
  "例：「札幌」「湯布院」「北海道 村」",
  "예: \"삿포로\", \"유후인\", \"홋카이도 촌\""
 ],
 "pk_all": [
  "全{n}の市町村・区・国から探せます。",
  "Search all {n} towns, wards and countries. ",
  "可從全部{n}個市町村・區・國家中搜尋。",
  "전체 {n}개의 시정촌·구·나라에서 찾을 수 있어요. "
 ],
 "pk_cls": [
  "「{c}」（{t}）から探します。",
  "Searching the {c} ({t}). ",
  "從「{c}」（{t}）中搜尋。",
  "\"{c}\"({t})에서 찾아요. "
 ],
 "pk_eg": [
  "例：「ふちゅう」「湯布院」「広島県 安芸郡」「フランス」「昔の国」",
  "e.g. \"Sapporo\", \"Yufuin\", \"Hokkaido village\", \"France\", \"former country\"",
  "例：「札幌」「湯布院」「北海道 村」「法國」「昔日國家」",
  "예: \"삿포로\", \"유후인\", \"홋카이도 촌\", \"프랑스\", \"옛 나라\""
 ],
 "pk_notcls": [
  "「{c}」にはありません。上で「全体の部」にすると出てきます（{n}件）",
  "Not in the {c}. Switch to \"Open\" at the top to see it ({n} found)",
  "「{c}」裡沒有。在上方改成「無差別級」就會出現（{n}筆）",
  "\"{c}\"에는 없어요. 위에서 \"전체 부문\"으로 바꾸면 나와요 ({n}건)"
 ],
 "pk_nf": [
  "見つかりませんでした。漢字・ひらがなのどちらでも、空白で区切って「広島県 安芸郡」のようにしぼれます。<br>樺太（敷香町など）など、戦前の外地の町村は入っていません",
  "Nothing found. Add words separated by spaces to narrow it down, like \"Hokkaido village\".<br>Towns in prewar overseas territories (such as Karafuto) are not included.",
  "找不到。可以用空格分隔，像「北海道 村」這樣縮小範圍。<br>樺太（敷香町等）等戰前外地的町村沒有收錄。",
  "찾지 못했어요. \"홋카이도 촌\"처럼 띄어쓰기로 단어를 더해 좁힐 수 있어요.<br>가라후토(시스카초 등) 등 전쟁 전 외지의 마을은 들어 있지 않아요."
 ],
 "pk_more": [
  "{n}件見つかりました。多いので最初の{m}件だけ出しています。空白で区切って言葉を足すと、しぼれます",
  "{n} found. Showing the first {m}. Add words separated by spaces to narrow it down.",
  "找到{n}筆。因為太多，只顯示前{m}筆。用空格分隔加上關鍵字就能縮小範圍",
  "{n}건 찾았어요. 많아서 처음 {m}건만 보여 줘요. 띄어쓰기로 단어를 더하면 좁힐 수 있어요"
 ],
 "skip": [
  "結果へ",
  "Skip",
  "看結果",
  "결과로"
 ],
 "shape_loading": [
  "形を読みこみ中です",
  "Still loading shapes",
  "正在讀取形狀",
  "모양을 불러오는 중이에요"
 ],
 "call_ready": [
  "はっけよい",
  "READY…",
  "預備",
  "준비"
 ],
 "call_go": [
  "のこった！",
  "GO!",
  "開打！",
  "시작!"
 ],
 "draw_line": [
  "{a} と {b} は引き分け！",
  "{a} and {b} drew!",
  "{a} 和 {b} 平手！",
  "{a}와(과) {b}, 무승부!"
 ],
 "wins": [
  "{n}の勝ち！",
  "{n} wins!",
  "{n}獲勝！",
  "{n} 승리!"
 ],
 "win_line": [
  "{w}が{l}に勝った！",
  "{w} beat {l}!",
  "{w}打敗了{l}！",
  "{w}, {l}에 승리!"
 ],
 "gk_prefix": [
  "【下剋上】",
  "[UPSET] ",
  "【下剋上】",
  "[하극상] "
 ],
 "gk_call": [
  "下剋上！",
  "UPSET!",
  "下剋上！",
  "하극상!"
 ],
 "gk_badge": [
  "下剋上",
  "UPSET",
  "下剋上",
  "하극상"
 ],
 "time_small": [
  "時間切れ・残りの多さで勝負",
  "Time up · decided by what remains",
  "時間到・比剩餘多寡",
  "시간 종료 · 남은 양으로 판정"
 ],
 "time_judge": [
  "（時間切れ判定）",
  " (won on time)",
  "（時間到判定）",
  " (시간 종료 판정)"
 ],
 "res_note_local": [
  "同じ組み合わせ・向き・政策なら、いつでも同じ結果になります。",
  "Same matchup, facing and policies always give the same result.",
  "相同的組合・方向・政策，結果永遠相同。",
  "같은 조합·방향·정책이면 언제나 같은 결과가 나와요."
 ],
 "rec_ing": [
  "　…成績をつけています",
  " …recording the result",
  "　…正在記錄戰績",
  " …전적을 기록하는 중"
 ],
 "replay": [
  "もう一度見る",
  "Watch again",
  "再看一次",
  "다시 보기"
 ],
 "change_pair": [
  "組み合わせを変える",
  "Change matchup",
  "更換組合",
  "조합 바꾸기"
 ],
 "change_mine": [
  "自分の市町村を変える",
  "Change your side",
  "更換自己的市町村",
  "내 쪽 바꾸기"
 ],
 "rematch_re": [
  "もう一戦（えらびなおす）",
  "Rematch (choose again)",
  "再一局（重新選擇）",
  "한 판 더 (다시 고르기)"
 ],
 "chal_next": [
  "べつの挑戦状と戦う",
  "Another challenge",
  "迎戰其他挑戰書",
  "다른 도전장과 싸우기"
 ],
 "hashtag": [
  "#地元の最強",
  "#HometownChampion",
  "#家鄉最強",
  "#우리동네최강"
 ],
 "sh_tag_sep": [
  "・",
  ", ",
  "・",
  ", "
 ],
 "nopol": [
  "政策なし",
  "No policies",
  "無政策",
  "정책 없음"
 ],
 "no_cards": [
  "政策カードなし",
  "No policy cards",
  "沒有政策卡",
  "정책 카드 없음"
 ],
 "chal_head": [
  "<b>{n}</b>さんの挑戦状（{r}）",
  "<b>{n}</b>'s challenge ({r})",
  "<b>{n}</b>的挑戰書（{r}）",
  "<b>{n}</b>님의 도전장 ({r})"
 ],
 "chal_h": [
  "左にあなたの市町村をえらんで、はっけよい！",
  "Choose your town on the left, then FIGHT!",
  "在左邊選擇你的市町村，開打！",
  "왼쪽에 내 시정촌을 고르고, 시작!"
 ],
 "boshu": [
  "{n}で挑戦状を置きました。倒せるものなら倒してみて！\n{u}\n#地元の最強",
  "I posted a challenge with {n} in Hometown Champion. Beat it if you can!\n{u}\n#HometownChampion",
  "我在家鄉最強用{n}發出了挑戰書。有本事就來打倒它！\n{u}\n#家鄉最強",
  "우리 동네 최강에서 {n}(으)로 도전장을 올렸어요. 이길 수 있으면 이겨 봐!\n{u}\n#우리동네최강"
 ],
 "put_sub": [
  "えらんだ市町村・向き・政策が、そのまま挑戦状になります。だれかが挑戦すると、あなたの挑戦状に成績がつきます。挑戦者をたくさん倒すと、県・国の番付にのります。",
  "Your chosen place, facing and policies become a challenge as-is. Each challenger adds to its record. Beat many challengers to get into the Rankings for its prefecture or country.",
  "選擇的市町村・方向・政策會直接變成挑戰書。有人挑戰就會記錄戰績。打倒很多挑戰者，就能登上縣・國家的排行榜。",
  "고른 시정촌·방향·정책이 그대로 도전장이 됩니다. 누군가 도전하면 전적이 쌓여요. 도전자를 많이 쓰러뜨리면 현·나라 순위표에 올라요."
 ],
 "put_l": [
  "左：{n}を置く",
  "Post left: {n}",
  "發出左方：{n}",
  "왼쪽: {n} 올리기"
 ],
 "put_r": [
  "右：{n}を置く",
  "Post right: {n}",
  "發出右方：{n}",
  "오른쪽: {n} 올리기"
 ],
 "put_desc": [
  "<b>{n}</b>（向き {d}°・{p}）",
  "<b>{n}</b> (facing {d}° · {p})",
  "<b>{n}</b>（方向 {d}°・{p}）",
  "<b>{n}</b> (방향 {d}° · {p})"
 ],
 "put_done_sub": [
  "この挑戦状のリンクを送ると、その人とすぐ勝負できます。成績はタイトル画面の「あなたの挑戦状」で見られます。",
  "Send this challenge link to battle that person right away. See its record under \"Your challenges\" on the title screen.",
  "傳送這張挑戰書的連結，就能馬上和對方對決。戰績可以在標題畫面的「你的挑戰書」查看。",
  "이 도전장 링크를 보내면 그 사람과 바로 승부할 수 있어요. 전적은 타이틀 화면의 \"내 도전장\"에서 볼 수 있어요."
 ],
 "place_nf": [
  "市町村が見つかりません",
  "Place not found",
  "找不到市町村",
  "시정촌을 찾을 수 없어요"
 ],
 "revenge_toast": [
  "仕返し！右が{n}さんの{t}です。向きや政策を変えて勝ちにいこう",
  "Revenge! Right is {n}'s {t}. Change your facing or policies and go win!",
  "報仇！右邊是{n}的{t}。改變方向或政策去贏回來吧",
  "복수! 오른쪽이 {n}님의 {t}예요. 방향이나 정책을 바꿔 이기러 가자"
 ],
 "mine_empty": [
  "まだ挑戦状を置いていません。<br>試合のあとの「挑戦状を置く」から置けます。",
  "You haven't posted a challenge yet.<br>Use \"Post challenge\" after a match.",
  "還沒有發出挑戰書。<br>可以在比賽後按「發出挑戰書」。",
  "아직 도전장을 올리지 않았어요.<br>경기 후 \"도전장 올리기\"로 올릴 수 있어요."
 ],
 "dir_pol": [
  "向き {d}°・{p}",
  "Facing {d}° · {p}",
  "方向 {d}°・{p}",
  "방향 {d}° · {p}"
 ],
 "unknown_place": [
  "（わからない市町村）",
  "(unknown place)",
  "（不明的市町村）",
  "(알 수 없는 곳)"
 ],
 "old_noretire": [
  "前の版で置いた挑戦状は、引退できません",
  "Challenges posted with an older version cannot be retired",
  "舊版發出的挑戰書無法退役",
  "이전 버전에서 올린 도전장은 은퇴시킬 수 없어요"
 ],
 "bz_empty": [
  "まだ「{r}」の番付にのった挑戦状はありません。<br>挑戦状を置いて挑戦者を倒すと、番付にのります。",
  "No challenges in the \"{r}\" Rankings yet.<br>Post a challenge and beat challengers to get listed.",
  "「{r}」的排行榜還沒有挑戰書。<br>發出挑戰書並打倒挑戰者，就能上榜。",
  "아직 \"{r}\" 순위표에 오른 도전장이 없어요.<br>도전장을 올리고 도전자를 쓰러뜨리면 순위표에 올라요."
 ],
 "xf_note": [
  "挑戦状は、この端末に覚えています。スマホを変えるときは、コードで引き継げます。",
  "Your challenges are remembered on this device. When you change phones, move them with a code.",
  "挑戰書記錄在這個裝置上。換手機時，可以用代碼轉移。",
  "도전장은 이 기기에 기억돼요. 폰을 바꿀 때는 코드로 옮길 수 있어요."
 ],
 "bz_reg": [
  "地域",
  "Region",
  "地區",
  "지역"
 ],
 "bz_note": [
  "この30日で挑戦者を倒した数で決まります（同じ市町村・向き・政策の相手は1回だけ数えます）。勝ちは試合を計算しなおして確かめ、合わないものは外します。",
  "Ranked by challengers beaten in the last 30 days (the same place, facing and policies count once). Wins are verified by re-simulating the match; mismatches are dropped.",
  "依這30天內打倒的挑戰者數排名（相同市町村・方向・政策的對手只算1次）。勝場會重新計算比賽來確認，不符的會被排除。",
  "최근 30일간 쓰러뜨린 도전자 수로 정해져요 (같은 시정촌·방향·정책의 상대는 1번만 셉니다). 승리는 경기를 다시 계산해 확인하고, 맞지 않는 것은 제외해요."
 ],
 "on_note": [
  "同じ「あいことば」を入れた人と1対1。お互いに市町村・向き・政策をこっそり決めて、同時に公開します。3人目からは観戦です。",
  "Go 1-on-1 with whoever enters the same passcode. Each of you secretly picks a place, facing and policies; both are revealed at once. From the 3rd person on, you watch.",
  "和輸入相同「暗號」的人1對1。雙方偷偷決定市町村・方向・政策，同時公開。第3個人開始為觀戰。",
  "같은 '암호'를 입력한 사람과 1대1. 서로 시정촌·방향·정책을 몰래 정하고 동시에 공개합니다. 3번째 사람부터는 관전입니다."
 ],
 "ex_code": [
  "例：ちもとたいけつ",
  "e.g. hometownduel",
  "例：hometownduel",
  "예: hometownduel"
 ],
 "desc_q": [
  "「{c}・{m}」",
  "\"{c} · {m}\"",
  "「{c}・{m}」",
  "\"{c} · {m}\""
 ],
 "opp_ready_diff": [
  "　あいては{d}で準備OK。合わせてね",
  " Opponent is ready with {d}. Please match it.",
  "　對手以{d}準備好了，請配合",
  " 상대는 {d}(으)로 준비 완료. 맞춰 주세요"
 ],
 "opp_choosing": [
  "　あいては{d}を選んでいます",
  " Opponent has chosen {d}",
  "　對手選了{d}",
  " 상대는 {d}을(를) 골랐어요"
 ],
 "ready_cancel": [
  "変更したので、準備OKを取り消しました",
  "You made a change, so \"Ready\" was canceled",
  "因為有變更，已取消準備",
  "변경해서 준비 완료를 취소했어요"
 ],
 "tg_gk": [
  "下剋上！",
  "Upset!",
  "下剋上！",
  "하극상!"
 ],
 "tg_country": [
  "国を倒した！",
  "Beat a country!",
  "打倒國家！",
  "나라를 쓰러뜨렸다!"
 ],
 "tg_era": [
  "時代をこえて",
  "Across eras",
  "跨越時代",
  "시대를 넘어"
 ],
 "tg_onehit": [
  "一撃！",
  "One hit!",
  "一擊！",
  "일격!"
 ],
 "tg_local": [
  "地元対決",
  "Local derby",
  "同鄉對決",
  "지역 대결"
 ],
 "tg_domestic": [
  "国内対決",
  "Same country",
  "國內對決",
  "국내 대결"
 ],
 "pop_note": [
  "人口は相手の{k}分の1",
  "1/{k} of the foe's population",
  "人口只有對手的{k}分之1",
  "인구는 상대의 {k}분의 1"
 ],
 "how1": [
  "<b>2つの市町村をえらぶ。</b>名前（漢字でもひらがなでも）で探せます。明治から今までの市町村・区、なくなった町村もぜんぶ出られます。<b>世界の国・地域</b>（「フランス」「アメリカ」など）、カリフォルニア州・バイエルン自由州などの<b>州・省・県</b>、テヘラン・フィラデルフィアなどの<b>都市</b>、アルベロベッロ・オンフルールなどの<b>町</b>、ソビエト連邦などの<b>昔の国</b>（「昔の国」で探せます）とも戦えます。",
  "<b>Choose 2 places.</b> Search by name. Every Japanese municipality and ward from the Meiji era (1870s) to today can fight, including ones that no longer exist. You can also fight with <b>countries and regions</b> (like \"France\" or \"United States\"), <b>states and provinces</b> like California or Bavaria, <b>cities</b> like Tehran or Philadelphia, <b>towns</b> like Alberobello or Honfleur, and <b>former countries</b> like the Soviet Union (search \"former country\").",
  "<b>選擇2個市町村。</b>可以用名稱搜尋。從明治到現在的市町村・區，已消失的町村也全都能出場。也能和<b>世界各國・地區</b>（「法國」「美國」等）、加州・巴伐利亞自由邦等<b>州・省・縣</b>、德黑蘭・費城等<b>城市</b>、阿爾貝羅貝洛・翁弗勒爾等<b>城鎮</b>，以及蘇聯等<b>昔日國家</b>（搜尋「昔日國家」）對戰。",
  "<b>시정촌 2개를 고른다.</b> 이름으로 찾을 수 있어요. 메이지 시대부터 지금까지의 시정촌·구, 사라진 마을도 전부 출전할 수 있어요. <b>세계의 나라·지역</b>(\"프랑스\", \"미국\" 등), 캘리포니아주·바이에른 자유주 같은 <b>주·성·현</b>, 테헤란·필라델피아 같은 <b>도시</b>, 알베로벨로·옹플뢰르 같은 <b>마을</b>, 소련 같은 <b>옛 나라</b>(\"옛 나라\"로 검색)와도 싸울 수 있어요."
 ],
 "how2": [
  "<b>階級をえらぶ。</b>人口で「村の部（1万人まで）」「町の部（1万〜5万）」「市の部（5万〜30万）」「大都市の部（30万〜）」に分かれています。「全体の部」はだれでも出られます。",
  "<b>Choose a division.</b> By population: \"Village (up to 10k)\", \"Town (10k–50k)\", \"City (50k–300k)\" and \"Metro (300k+)\". Anyone can enter \"Open\".",
  "<b>選擇級別。</b>依人口分為「村級（1萬人以下）」「町級（1萬〜5萬）」「市級（5萬〜30萬）」「大都市級（30萬〜）」。「無差別級」誰都能參加。",
  "<b>부문을 고른다.</b> 인구에 따라 \"마을 부문(1만 명까지)\", \"소도시 부문(1만~5만)\", \"시 부문(5만~30만)\", \"대도시 부문(30만~)\"으로 나뉘어요. \"전체 부문\"은 누구나 나갈 수 있어요."
 ],
 "how3": [
  "<b>向きを決める。</b>45度ずつ8方向。どこから相手に当たるかで結果が変わります。",
  "<b>Set the facing.</b> 8 directions in 45° steps. Which side hits the foe changes the result.",
  "<b>決定方向。</b>每次45度，共8個方向。從哪裡撞到對手會改變結果。",
  "<b>방향을 정한다.</b> 45도씩 8방향. 어디로 상대와 부딪히느냐에 따라 결과가 달라져요."
 ],
 "how4": [
  "<b>政策カードで味付け（3枚まで）。</b>予算は10。人口が少ない市町村には<b>交付金</b>がつき、予算が増えます（5千人未満＋10、2万人未満＋6、5万人未満＋3）。",
  "<b>Add policy cards (up to 3).</b> The budget is 10. Places with small populations get a <b>grant</b> that raises the budget (under 5k: +10, under 20k: +6, under 50k: +3).",
  "<b>用政策卡調味（最多3張）。</b>預算為10。人口少的市町村會得到<b>補助款</b>，預算增加（未滿5千人＋10、未滿2萬人＋6、未滿5萬人＋3）。",
  "<b>정책 카드로 양념 (3장까지).</b> 예산은 10. 인구가 적은 시정촌은 <b>교부금</b>을 받아 예산이 늘어요 (5천 명 미만 +10, 2만 명 미만 +6, 5만 명 미만 +3)."
 ],
 "how5": [
  "<b>はっけよい！</b>あとは全自動。ぶつかるたびに割れて欠けていき、先に65％を失った方の負け。60秒たったら残りが多い方の勝ちです。もとの能力がずっと下の方が勝つと<b>「下剋上！」</b>",
  "<b>FIGHT!</b> The rest is automatic. Each clash cracks and chips the shapes; whoever loses 65% first loses. After 60 seconds, whoever has more left wins. When a much weaker side wins, it's an <b>\"UPSET!\"</b>",
  "<b>開打！</b>之後全自動。每次碰撞都會碎裂缺角，先失去65％的一方輸。60秒後剩餘較多的一方獲勝。原本能力差很多的一方獲勝時，就是<b>「下剋上！」</b>",
  "<b>시작!</b> 나머지는 전자동. 부딪힐 때마다 깨지고 떨어져 나가며, 먼저 65%를 잃은 쪽이 패배. 60초가 지나면 남은 양이 많은 쪽이 승리. 원래 능력이 훨씬 낮은 쪽이 이기면 <b>\"하극상!\"</b>"
 ],
 "how6": [
  "<b>同じ組み合わせ・同じ向き・同じ政策なら、いつでも必ず同じ結果</b>になります。いろいろ試して、最強の地元を見つけてください。",
  "<b>The same matchup, facing and policies always give exactly the same result.</b> Try all kinds of combos and find the strongest hometown.",
  "<b>相同的組合・方向・政策，結果一定相同。</b>多方嘗試，找出最強的家鄉吧。",
  "<b>같은 조합·같은 방향·같은 정책이면 언제나 반드시 같은 결과</b>가 나와요. 여러 가지 시험해서 최강의 동네를 찾아보세요."
 ],
 "how7": [
  "<b>だれかと対戦</b>：待っている人と自動でつながります（全体の部・政策ありで勝負）。相手がいないときは、挑戦状と戦いながら待てます。毎晩21時〜22時は対戦タイム！",
  "<b>Play someone online</b>: you're matched automatically with someone waiting (Open division, with policies). If no one is around, fight challenges while you wait. Battle time every night 21:00–22:00 JST!",
  "<b>隨機對戰</b>：自動和正在等待的人配對（無差別級・有政策）。沒有對手時，可以一邊迎戰挑戰書一邊等。每晚日本時間21〜22點是對戰時間！",
  "<b>아무나와 대전</b>: 기다리는 사람과 자동으로 연결돼요 (전체 부문·정책 있음으로 승부). 상대가 없을 때는 도전장과 싸우며 기다릴 수 있어요. 매일 밤 일본 시간 21~22시는 대전 타임!"
 ],
 "how8": [
  "<b>挑戦状</b>：試合のあとに「挑戦状を置く」と、あなたの市町村・向き・政策が挑戦状になります。「挑戦状と戦う」で、だれかの挑戦状といつでも勝負。挑戦状ごとのリンクを送れば、その人とすぐ戦えます。「あなたの挑戦状」で1枚ずつの成績や、だれに破られたかが見られ、そこから<b>仕返し</b>もできます。",
  "<b>Challenges</b>: after a match, press \"Post challenge\" and your place, facing and policies become a challenge. With \"Take a challenge\" you can fight someone's challenge any time. Send a challenge's link to fight that person right away. In \"Your challenges\" you can see each one's record and who beat it, and take <b>revenge</b> from there.",
  "<b>挑戰書</b>：比賽後按「發出挑戰書」，你的市町村・方向・政策就會變成挑戰書。用「迎戰挑戰書」可以隨時和別人的挑戰書對決。傳送挑戰書的連結，就能馬上和對方對戰。在「你的挑戰書」可以看到每張的戰績和被誰打敗，還能從那裡<b>報仇</b>。",
  "<b>도전장</b>: 경기 후 \"도전장 올리기\"를 누르면 내 시정촌·방향·정책이 도전장이 돼요. \"도전장과 싸우기\"로 누군가의 도전장과 언제든 승부. 도전장마다 있는 링크를 보내면 그 사람과 바로 싸울 수 있어요. \"내 도전장\"에서 장마다 전적과 누구에게 깨졌는지 볼 수 있고, 거기서 <b>복수</b>도 할 수 있어요."
 ],
 "how9": [
  "<b>番付</b>：都道府県・国ごとに、この30日で挑戦者を多く倒した挑戦状が「横綱」「大関」…と並びます。勝ちは試合を計算しなおして確かめています。",
  "<b>Rankings</b>: for each prefecture or country, the challenges that beat the most challengers in the last 30 days are ranked like sumo: \"Yokozuna\", \"Ozeki\"… Wins are verified by re-simulating the match.",
  "<b>排行榜</b>：依都道府縣・國家，這30天內打倒最多挑戰者的挑戰書會依「橫綱」「大關」…排列。勝場會重新計算比賽來確認。",
  "<b>순위표</b>: 도도부현·나라별로, 최근 30일간 도전자를 많이 쓰러뜨린 도전장이 \"요코즈나\", \"오제키\"… 순으로 나열돼요. 승리는 경기를 다시 계산해서 확인해요."
 ],
 "how_st_h": [
  "強さの決まり方",
  "How strength is decided",
  "強度的決定方式",
  "강함이 정해지는 방식"
 ],
 "how_st": [
  "体力＝面積、勢い＝人口、速さ＝人口密度、かたさ＝形のまとまり、鋭さ＝形のトゲ。1980年より前になくなった町村の人口は、まわりの人口密度から出した<b>推定</b>です。読みがなにも推定のものがあります。<br>樺太（敷香町など）や台湾・朝鮮半島など、戦前の日本の外地にあった町村は、もとにしている地図データにふくまれていないため入っていません。<br>昔の国の形は、今の国や州の境界を組み合わせた<b>おおよその形</b>です。昔の国の人口は、その時代のおおよその人口です。海外の州・省・県の人口は、その中の町の人口から割り振った推定で、けただけ表示しています。区分は地図データの時点のもので、少し古いものがあります。国境は日本の立場にもとづく地図データを使っています。",
  "Stamina = area, Power = population, Speed = population density, Tough = how compact the shape is, Sharp = how spiky the shape is. Populations of towns that disappeared before 1980 are <b>estimates</b> based on the surrounding population density. Some name readings (and the romanized names based on them) are also estimates.<br>Towns in Japan's prewar overseas territories, such as Karafuto (Sakhalin), Taiwan and the Korean Peninsula, are not included because the map data does not cover them.<br>Former countries' shapes are <b>approximate</b>, combined from today's country and state borders, and their populations are rough figures for their era. Populations of overseas states and provinces are estimates allocated from their towns' populations, so only the order of magnitude is shown. Divisions reflect the map data at the time and some are a little out of date. Borders follow map data based on Japan's official position.",
  "體力＝面積、氣勢＝人口、速度＝人口密度、硬度＝形狀集中度、銳利＝形狀尖刺。1980年以前消失的町村人口，是由周邊人口密度算出的<b>推估值</b>。部分讀音（以及據此產生的名稱）也是推估的。<br>樺太（敷香町等）以及台灣・朝鮮半島等戰前日本外地的町村，因為作為依據的地圖資料沒有收錄，所以沒有加入。<br>昔日國家的形狀是組合現今國家或州的邊界而成的<b>大略形狀</b>，人口也是那個時代的大略人口。海外州・省・縣的人口，是由其中城鎮人口分配而來的推估值，只顯示位數。區分依據地圖資料當時的狀態，有些稍微過時。國界使用以日本立場為準的地圖資料。",
  "체력=면적, 기세=인구, 속도=인구 밀도, 단단함=모양의 응집도, 날카로움=모양의 가시. 1980년 이전에 사라진 마을의 인구는 주변 인구 밀도로 계산한 <b>추정치</b>예요. 이름 읽기(와 그것을 바탕으로 만든 표기)에도 추정한 것이 있어요.<br>가라후토(시스카초 등)나 타이완·한반도 등 전쟁 전 일본의 외지에 있던 마을은 바탕이 된 지도 데이터에 들어 있지 않아서 넣지 않았어요.<br>옛 나라의 모양은 지금의 나라나 주의 경계를 조합한 <b>대략적인 모양</b>이고, 인구도 그 시대의 대략적인 인구예요. 해외 주·성·현의 인구는 그 안의 마을 인구로부터 배분한 추정치라서 자릿수만 표시해요. 구분은 지도 데이터 시점의 것이라 조금 오래된 것도 있어요. 국경은 일본의 입장에 따른 지도 데이터를 사용했어요."
 ],
 "data_h": [
  "データ",
  "Data",
  "資料",
  "데이터"
 ],
 "credit": [
  "「国土数値情報（行政区域データ）」（国土交通省）をもとに、ROIS-DS人文学オープンデータ共同利用センター「歴史的行政区域データセットβ版」（CC BY 4.0）を加工して作成<br>人口：総務省統計局「国勢調査」（e-Stat）を加工して作成<br>読みがな：日本郵便「郵便番号データ」、総務省「標準地域コード」（e-Stat）をもとに作成<br>世界の国の形・人口：Natural Earth（パブリックドメイン）<br>国の名前：外務省「国・地域」の表記、海外領土などはUnicode CLDRの日本語名<br>州・省・県の名前：Natural Earth と Unicode CLDR の日本語名が一致したもの<br>都市の名前：Natural Earth と GeoNames の日本語名が一致したもの　都市の形：geoBoundaries（CC BY 4.0 など）　都市の人口：GeoNames<br>町の名前：GeoNames の日本語名のうち、日本語の固有名詞辞書 mecab-ipadic-NEologd（Apache License 2.0）にもあるもの<br>海外の人口の推定：GeoNames（CC BY 4.0）<br>効果音：Kenney「Impact Sounds」（CC0）　音楽：自作",
  "Created by processing the ROIS-DS Center for Open Data in the Humanities \"Historical Administrative Boundary Dataset (beta)\" (CC BY 4.0), based on the MLIT \"National Land Numerical Information (Administrative Boundaries)\"<br>Population: processed from the Statistics Bureau of Japan \"Census\" (e-Stat)<br>Readings: based on Japan Post \"Postal Code Data\" and MIC \"Standard Area Codes\" (e-Stat)<br>Country shapes and populations: Natural Earth (public domain)<br>Place names in other languages: Unicode CLDR, Natural Earth, GeoNames; Japanese place names romanized/transliterated from their readings<br>State/province names: Natural Earth and Unicode CLDR<br>City names: Natural Earth and GeoNames　City shapes: geoBoundaries (CC BY 4.0, etc.)　City populations: GeoNames<br>Town names: GeoNames, checked against the mecab-ipadic-NEologd dictionary (Apache License 2.0)<br>Overseas population estimates: GeoNames (CC BY 4.0)<br>Sound effects: Kenney \"Impact Sounds\" (CC0)　Music: original",
  "以國土交通省「國土數值資訊（行政區域資料）」為基礎，加工ROIS-DS人文學開放資料共同利用中心「歷史的行政區域資料集β版」（CC BY 4.0）製作<br>人口：加工總務省統計局「國勢調查」（e-Stat）製作<br>讀音：依據日本郵便「郵遞區號資料」、總務省「標準地域代碼」（e-Stat）製作<br>世界各國的形狀・人口：Natural Earth（公有領域）<br>各語言的地名：Unicode CLDR、Natural Earth、GeoNames；日本地名部分由讀音轉寫<br>州・省・縣的名稱：Natural Earth 與 Unicode CLDR<br>城市名稱：Natural Earth 與 GeoNames　城市形狀：geoBoundaries（CC BY 4.0 等）　城市人口：GeoNames<br>城鎮名稱：GeoNames，並以 mecab-ipadic-NEologd 辭典（Apache License 2.0）確認<br>海外人口推估：GeoNames（CC BY 4.0）<br>音效：Kenney「Impact Sounds」（CC0）　音樂：自製",
  "국토교통성 \"국토수치정보(행정구역 데이터)\"를 바탕으로 ROIS-DS 인문학 오픈데이터 공동이용센터 \"역사적 행정구역 데이터셋 β판\"(CC BY 4.0)을 가공해 제작<br>인구: 총무성 통계국 \"국세조사\"(e-Stat)를 가공해 제작<br>읽기: 일본우편 \"우편번호 데이터\", 총무성 \"표준지역코드\"(e-Stat)를 바탕으로 제작<br>세계 나라의 모양·인구: Natural Earth (퍼블릭 도메인)<br>각 언어의 지명: Unicode CLDR, Natural Earth, GeoNames / 일본 지명은 읽기를 바탕으로 표기<br>주·성·현의 이름: Natural Earth 와 Unicode CLDR<br>도시 이름: Natural Earth 와 GeoNames　도시 모양: geoBoundaries (CC BY 4.0 등)　도시 인구: GeoNames<br>마을 이름: GeoNames (mecab-ipadic-NEologd 사전(Apache License 2.0)으로 확인)<br>해외 인구 추정: GeoNames (CC BY 4.0)<br>효과음: Kenney \"Impact Sounds\" (CC0)　음악: 자작"
 ]
};
  function pick() {
    try { var q = new URLSearchParams(location.search).get('lang'); if (q && LANGS.indexOf(q) >= 0) { try { localStorage.setItem(KEY, q); } catch (e) {} return q; } } catch (e) {}
    try { var s = localStorage.getItem(KEY); if (s && LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    var n = (navigator.language || 'ja').toLowerCase();
    if (n.indexOf('ja') === 0) return 'ja'; if (n.indexOf('ko') === 0) return 'ko'; if (n.indexOf('zh') === 0) return 'zh'; return 'en';
  }
  var L = pick();
  function t(k, v) {
    var row = D[k]; var i = LANGS.indexOf(L);
    var s = row ? (row[i] != null ? row[i] : row[0]) : k;
    if (v) for (var x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  }
  // 韓国語：題字の Dela Gothic One にハングルがないので Black Han Sans を読む
  function koFont() {
    if (L !== 'ko' || document.getElementById('ko-font')) return;
    var l = document.createElement('link'); l.id = 'ko-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap'; document.head.appendChild(l);
  }
  // 繁體中文の題字（Dela Gothic One にない字があるので、題字の4文字だけ Noto Sans TC を読む）
  function zhFont() {
    if (L !== 'zh' || document.getElementById('zh-font')) return;
    var l = document.createElement('link'); l.id = 'zh-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@900&display=swap&text=' + encodeURIComponent('家鄉最強'); document.head.appendChild(l);
  }
  function apply() {
    koFont(); zhFont();
    var de = document.documentElement;
    de.lang = L === 'zh' ? 'zh-Hant' : L; de.setAttribute('data-lang', L);
    document.querySelectorAll('[data-i]').forEach(function (e) { e.textContent = t(e.dataset.i); });
    document.querySelectorAll('[data-ih]').forEach(function (e) { e.innerHTML = t(e.dataset.ih); });
    document.querySelectorAll('[data-ip]').forEach(function (e) { e.placeholder = t(e.dataset.ip); });
    document.querySelectorAll('[data-ia]').forEach(function (e) { e.setAttribute('aria-label', t(e.dataset.ia)); });
    document.querySelectorAll('.langs button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === L ? 'true' : 'false'); });
    document.title = t('doc_title');
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t('doc_desc'));
    try { document.dispatchEvent(new CustomEvent('langchange', { detail: L })); } catch (e) {}
  }
  function set(l) { if (LANGS.indexOf(l) < 0) return; L = l; try { localStorage.setItem(KEY, l); } catch (e) {} apply(); }
  function bind() {
    document.querySelectorAll('.langs button').forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.lang); }); });
    apply();
  }
  window.I18N = { t: t, set: set, apply: apply, get lang() { return L; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
