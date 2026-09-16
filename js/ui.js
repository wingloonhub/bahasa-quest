/* ui.js — semua skrin Bahasa Quest: log masuk, pemain, pengembaraan,
   persediaan peperiksaan, sejarah & analisis, laporan ibu bapa. */
(function () {
  "use strict";
  const $ = (sel) => document.querySelector(sel);
  const screen = () => document.getElementById("screen");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = (arr) => (window.QUESTIONS && QUESTIONS.shuffle) ? QUESTIONS.shuffle(arr) : arr.slice();

  function toast(msg, type) {
    const host = document.getElementById("toast-host");
    const el = document.createElement("div");
    el.className = "toast " + (type || "");
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  /* ===================== SKRIN LOG MASUK ===================== */
  let authMode = "in";
  function renderAuth() {
    const localOnly = !AUTH.configured;
    screen().innerHTML = `
      <div class="center-wrap"><div class="card">
        <div class="crest">🗺️</div>
        <div class="title">Bahasa<br/>Quest<small>BAHASA MELAYU · TAHUN 3</small></div>
        <div class="subtitle">${authMode === "up" ? "Cipta akaun pengembara baharu" : "Log masuk untuk menyimpan kemajuan anda"}</div>
        <form id="authForm" autocomplete="on">
          ${authMode === "up" ? `<div class="field"><label>Nama pemain</label><input id="dn" type="text" placeholder="cth. Preston" required/></div>` : ""}
          <div class="field"><label>E-mel</label><input id="em" type="email" placeholder="nama@contoh.com" required/></div>
          <div class="field"><label>Kata laluan</label><input id="pw" type="password" placeholder="Sekurang-kurangnya 6 aksara" minlength="6" required/></div>
          <button class="btn primary full" type="submit">${authMode === "up" ? "Cipta akaun &amp; mula" : "Log masuk"}</button>
        </form>
        <div class="err" id="authErr"></div>
        <div class="auth-toggle">
          ${authMode === "up"
            ? `Sudah ada akaun? <a id="toIn">Log masuk</a>`
            : `Pengembara baharu? <a id="toUp">Cipta akaun</a> &nbsp;·&nbsp; <a id="forgot">Lupa kata laluan</a>`}
        </div>
        ${localOnly ? `<div class="fb-warn"><b>Log masuk awan belum disediakan.</b> Permainan tetap boleh dimainkan, tetapi data disimpan pada peranti ini sahaja. Untuk mengaktifkan log masuk e-mel + simpanan merentas peranti, ikut <b>README.md → Langkah 2 (Firebase)</b>, kemudian muat naik semula.<br/><br/><button class="btn ghost sm" id="guestBtn">Main pada peranti ini →</button></div>` : ""}
      </div></div>`;

    if ($("#toUp")) $("#toUp").onclick = () => { authMode = "up"; renderAuth(); };
    if ($("#toIn")) $("#toIn").onclick = () => { authMode = "in"; renderAuth(); };
    if ($("#guestBtn")) $("#guestBtn").onclick = () => { AUTH.startGuest(); };
    if ($("#forgot")) $("#forgot").onclick = () => {
      const em = $("#em").value.trim();
      if (!em) { $("#authErr").textContent = "Taip e-mel anda di atas dahulu, kemudian tekan Lupa kata laluan."; return; }
      AUTH.resetPassword(em)
        .then(() => toast("E-mel set semula kata laluan telah dihantar.", "good"))
        .catch(e => $("#authErr").textContent = e.message);
    };
    $("#authForm").onsubmit = (e) => {
      e.preventDefault();
      const err = $("#authErr"); err.textContent = "";
      const em = $("#em").value.trim(), pw = $("#pw").value;
      const dn = $("#dn") ? $("#dn").value.trim() : "";
      const btn = $("#authForm button"); btn.disabled = true; btn.textContent = "Sila tunggu…";
      const p = authMode === "up" ? AUTH.signUp(em, pw, dn) : AUTH.signIn(em, pw);
      p.catch(ex => { renderAuth(); $("#authErr").textContent = friendly(ex); });
    };
  }

  function friendly(ex) {
    const m = (ex && ex.code) || "";
    if (m.includes("email-already-in-use")) return "E-mel itu sudah mempunyai akaun. Cuba log masuk.";
    if (m.includes("invalid-email")) return "Alamat e-mel itu kelihatan salah.";
    if (m.includes("weak-password")) return "Kata laluan mesti sekurang-kurangnya 6 aksara.";
    if (m.includes("wrong-password") || m.includes("invalid-credential")) return "E-mel atau kata laluan salah.";
    if (m.includes("user-not-found")) return "Tiada akaun dengan e-mel itu. Cipta akaun dahulu.";
    if (m.includes("too-many-requests")) return "Terlalu banyak cubaan. Tunggu seminit dan cuba lagi.";
    return (ex && ex.message) || "Ada sesuatu yang tidak kena.";
  }

  /* ===================== MENU UTAMA ===================== */
  function renderMenu() {
    const active = STORE.active();
    const name = active ? active.name : "Pemain";
    const accountEmail = (STORE.state.account || {}).email || "";
    const sessions = ((active && active.exam && active.exam.history) || []).length;
    screen().innerHTML = `
      <div class="center-wrap"><div class="card">
        <div class="crest">🗺️</div>
        <div class="title">Bahasa<br/>Quest</div>
        <div class="subtitle">Selamat datang, <b>${esc(name)}</b>.<br/>Jelajah, jawab dengan betul dan kumpulkan harta ilmu.${sessions ? `<br/><span class="muted">${sessions} sesi latihan direkodkan</span>` : ""}</div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px">
          <button class="btn primary full" id="play">🧭 Pilih Pengembaraan</button>
          <button class="btn full" id="exam">📚 Persediaan Peperiksaan</button>
          <button class="btn full" id="report">📊 Laporan Ibu Bapa</button>
          <button class="btn full" id="switch">👥 Tukar Pemain</button>
          <button class="btn ghost full" id="how">❓ Cara Bermain</button>
          <button class="btn ghost sm" id="snd" style="align-self:center">${SOUND.isMuted() ? "🔇 Bunyi: MATI" : "🔊 Bunyi: HIDUP"}</button>
          ${AUTH.user ? `<button class="btn ghost sm" id="out" style="align-self:center">Log keluar (${esc(accountEmail)})</button>` : ""}
        </div>
      </div></div>`;
    $("#play").onclick = renderAdventures;
    $("#exam").onclick = renderExamPrep;
    $("#report").onclick = renderReport;
    $("#switch").onclick = renderProfileSelect;
    $("#how").onclick = renderHow;
    $("#snd").onclick = () => { SOUND.toggleMute(); if (!SOUND.isMuted()) SOUND.play("click"); renderMenu(); };
    if ($("#out")) $("#out").onclick = () => AUTH.signOut();
  }

  function renderHow() {
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Kembali</span><h2>❓ Cara Bermain</h2></div>
      <div class="page" style="max-width:680px;line-height:1.8">
        <p>🧭 <b>Pilih Pengembaraan</b> — mod cerita dan pertarungan. Sedang dibina, akan dibuka tidak lama lagi.</p>
        <p>📚 <b>Persediaan Peperiksaan</b> — latihan mengikut topik peperiksaan. Pilih set (cth. Tahun 3 — Semester 2), pilih topik, dan jawab satu set soalan. Tiada nyawa, tiada monster — cuma latihan.</p>
        <p>📈 <b>Sejarah &amp; Analisis</b> — setiap sesi latihan yang tamat direkodkan. Anda boleh lihat markah terbaik, terburuk, purata, arah aliran (naik/turun) dan bahagian mana yang paling banyak silap.</p>
        <p>📊 <b>Laporan Ibu Bapa</b> — ringkasan untuk ibu bapa: topik mana kukuh, topik mana perlu diberi tumpuan, dan kesilapan terkini.</p>
        <p>👥 <b>Tukar Pemain</b> — satu akaun boleh ada beberapa pemain. Setiap pemain ada kemajuan dan laporan sendiri.</p>
      </div>`;
    $("#bk").onclick = renderMenu;
  }

  /* ===================== PILIH PENGEMBARAAN (AKAN DATANG) ===================== */
  function renderAdventures() {
    const list = (window.DATA && DATA.ADVENTURES) || [];
    if (!list.length) {
      screen().innerHTML = `
        <div class="topbar"><span class="back" id="bk">← Menu</span><h2>🧭 Pilih Pengembaraan</h2></div>
        <div class="page" style="max-width:640px;margin:0 auto">
          <div class="soon-card">
            <div class="soon-badge">Akan Datang</div>
            <div style="max-width:220px;margin:0 auto 10px">${ART.chest()}</div>
            <h2>Peta masih belum lengkap</h2>
            <p>Mod pengembaraan — kuil, teka-teki dan peti harta — sedang dibina.
               Sementara menunggu, pergi ke <b>Persediaan Peperiksaan</b> untuk berlatih.</p>
            <div class="row" style="margin-top:18px">
              <button class="btn primary" id="toExam">📚 Buka Persediaan Peperiksaan</button>
              <button class="btn ghost" id="toMenu">← Kembali ke menu</button>
            </div>
          </div>
        </div>`;
      $("#bk").onclick = renderMenu;
      $("#toMenu").onclick = renderMenu;
      $("#toExam").onclick = renderExamPrep;
      return;
    }
    renderMenu();
  }

  /* ===================== PERSEDIAAN PEPERIKSAAN ===================== */
  function renderExamPrep() {
    const sets = (window.DATA && DATA.EXAM_PREP) || [];
    const cards = sets.map(s => `
      <div class="exam-set-card" data-set="${esc(s.id)}">
        <div>
          <div class="exam-set-name">${esc(s.label)}</div>
          <div class="muted" style="font-size:13px;margin-top:4px">${esc(s.desc || "")}</div>
        </div>
        <div class="exam-set-meta">${s.topics.length ? s.topics.length + " topik" : "Akan datang"}</div>
      </div>`).join("");
    const p = STORE.active();
    const historyCount = ((p && p.exam && p.exam.history) || []).length;
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Menu</span><h2>📚 Persediaan Peperiksaan</h2></div>
      <div class="page" style="max-width:680px;margin:0 auto">
        <div class="lead">Set latihan disusun mengikut tahun dan semester. Pilih satu untuk melihat topik di dalamnya.</div>
        <div class="exam-set-grid">${cards || `<p class="muted">Belum ada set latihan.</p>`}</div>
        <div style="margin-top:22px">
          <button class="btn full" id="histBtn">📈 Sejarah &amp; Analisis${historyCount ? ` <span class="muted" style="font-weight:600;font-size:13px">· ${historyCount} sesi</span>` : ""}</button>
        </div>
      </div>`;
    $("#bk").onclick = renderMenu;
    $("#histBtn").onclick = renderExamHistory;
    screen().querySelectorAll(".exam-set-card").forEach(card => {
      card.onclick = () => renderExamPrepSet(card.dataset.set);
    });
  }

  function renderExamPrepSet(setId) {
    const set = DATA.examSet(setId);
    if (!set) return renderExamPrep();
    const cards = set.topics.map(t => {
      let hint;
      if (t.challengeMode) {
        const src = challengeSources(setId);
        const ready = src.filter(s => bankFor(s.id)).length;
        hint = ready
          ? `Ketik untuk berlatih → <span class="muted">${ready}/${src.length} topik sedia</span>`
          : "Akan datang";
      } else {
        const bank = bankFor(t.id);
        hint = bank ? `Ketik untuk berlatih → <span class="muted">${Math.min((t.sessionSize || EXAM_SESSION_SIZE), bank.length)} soalan</span>` : "Akan datang";
      }
      return `
      <div class="exam-topic-card${t.challengeMode ? " challenge" : ""}" data-topic="${esc(t.id)}">
        <div class="exam-topic-name">${t.challengeMode ? "🏅 " : ""}${esc(t.label)}</div>
        ${t.desc ? `<div class="muted" style="font-size:12.5px">${esc(t.desc)}</div>` : ""}
        <div class="exam-topic-hint">${hint}</div>
      </div>`;
    }).join("");
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Persediaan Peperiksaan</span><h2>${esc(set.label)}</h2></div>
      <div class="page" style="max-width:760px;margin:0 auto">
        <div class="lead">${set.topics.length
          ? "Pilih satu topik untuk berlatih. Setiap sesi direkodkan dalam Sejarah &amp; Analisis."
          : ""}</div>
        ${set.topics.length ? `<div class="exam-topic-grid">${cards}</div>` : `
          <div class="soon-card">
            <div class="soon-badge">Akan Datang</div>
            <div class="big-emoji">📖</div>
            <h2>Topik belum dimasukkan</h2>
            <p>Rangka set <b>${esc(set.label)}</b> sudah siap. Senarai topik dan bank soalan
               akan ditambah selepas ini — skrin latihan, markah dan analisis sudah sedia menunggu.</p>
            <div class="row" style="margin-top:18px">
              <button class="btn ghost" id="backBtn">← Kembali</button>
              <button class="btn primary" id="histBtn2">📈 Sejarah &amp; Analisis</button>
            </div>
          </div>`}
      </div>`;
    $("#bk").onclick = renderExamPrep;
    if ($("#backBtn")) $("#backBtn").onclick = renderExamPrep;
    if ($("#histBtn2")) $("#histBtn2").onclick = renderExamHistory;
    screen().querySelectorAll(".exam-topic-card").forEach(card => {
      card.onclick = () => renderExamPrepTopic(setId, card.dataset.topic);
    });
  }

  /* ---------- enjin sesi latihan ---------- */
  const EXAM_SESSION_SIZE = 15;
  function bankFor(topicId) {
    return (window.QUESTIONS_EXAM && Array.isArray(window.QUESTIONS_EXAM[topicId]) && window.QUESTIONS_EXAM[topicId].length)
      ? window.QUESTIONS_EXAM[topicId] : null;
  }
  function sessionSizeFor(topic, bank) {
    const base = (topic && topic.sessionSize) || EXAM_SESSION_SIZE;
    return Math.min(base, bank.length);
  }
  function catLabel(topicId, code) {
    const t = (window.DATA && DATA.anyTopic) ? DATA.anyTopic(topicId) : null;
    if (t && t.catLabels && t.catLabels[code]) return t.catLabels[code];
    if (!code || code === "?") return "Umum";
    return String(code).replace(/_/g, " ").replace(/^./, c => c.toUpperCase());
  }

  // Ambil n soalan, cuba seimbangkan antara kategori.
  function sampleQuestions(bank, n) {
    const byCat = {};
    bank.forEach(q => {
      const c = q.cat || "?";
      (byCat[c] = byCat[c] || []).push(q);
    });
    Object.keys(byCat).forEach(c => { byCat[c] = shuffle(byCat[c]); });
    const cats = shuffle(Object.keys(byCat));
    const picked = [];
    let progressed = true;
    while (picked.length < n && progressed) {
      progressed = false;
      for (const c of cats) {
        if (picked.length >= n) break;
        if (byCat[c].length) { picked.push(byCat[c].shift()); progressed = true; }
      }
    }
    return shuffle(picked).map(shuffleOpts);
  }

  function shuffleOpts(q) {
    if (!q.options) return q;
    const order = shuffle(q.options.map((_, i) => i));
    return Object.assign({}, q, {
      options: order.map(i => q.options[i]),
      answer: order.indexOf(q.answer)
    });
  }

  /* ---------- Ujian Cabaran Akhir — campuran semua topik lain ---------- */
  function challengeSources(setId) {
    const set = DATA.examSet(setId);
    if (!set) return [];
    return set.topics.filter(t => !t.challengeMode);
  }

  function sampleChallengeQuestions(setId, perSection) {
    const out = [];
    challengeSources(setId).forEach(t => {
      const bank = bankFor(t.id);
      if (!bank) return;
      const picked = shuffle(bank).slice(0, Math.min(perSection, bank.length));
      picked.forEach(q => out.push(Object.assign({}, shuffleOpts(q), { sourceTopic: t.id })));
    });
    return shuffle(out);
  }

  function renderChallengeLanding(setId, topic) {
    const sources = challengeSources(setId);
    const per = topic.perSection || 8;
    let total = 0;
    const list = sources.map(t => {
      const bank = bankFor(t.id);
      const n = bank ? Math.min(per, bank.length) : 0;
      total += n;
      return `<div class="challenge-row">
        <span class="challenge-name">${esc(t.label)}</span>
        <span class="${bank ? "tag-strong" : "tag-mid"}">${bank ? n + " soalan" : "Akan datang"}</span>
      </div>`;
    }).join("");
    const p = STORE.active();
    const past = ((p && p.exam && p.exam.history) || []).filter(h => h.topicId === topic.id);
    const bestLine = past.length
      ? `<div class="summary-box" style="margin-top:14px;text-align:left">Percubaan lalu: <b>${past.length}</b> · Terbaik <b>${Math.max.apply(null, past.map(s => s.pct))}%</b> · Terkini <b>${past[0].pct}%</b></div>`
      : "";
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← ${esc((DATA.examSet(setId) || {}).label || "Kembali")}</span><h2>🏅 ${esc(topic.label)}</h2></div>
      <div class="page" style="max-width:640px;margin:0 auto">
        <div class="card" style="max-width:none;text-align:center">
          <div class="big-emoji">🏅</div>
          <h2 style="font-family:Georgia,serif;margin:8px 0 10px">${esc(topic.label)}</h2>
          <p class="muted" style="line-height:1.7">${esc(topic.desc || "")}<br/>
            ${total ? `Sesi ini: <b>${total} soalan</b> daripada ${sources.filter(t => bankFor(t.id)).length} topik.`
                    : "Bank soalan belum dimasukkan untuk mana-mana topik."}</p>
          <div class="challenge-list">${list}</div>
          ${bestLine}
          <div class="row" style="margin-top:18px">
            <button class="btn ghost" id="backBtn">← Kembali</button>
            <button class="btn primary" id="startBtn"${total ? "" : " disabled"}>Mula Ujian →</button>
          </div>
        </div>
      </div>`;
    $("#bk").onclick = () => renderExamPrepSet(setId);
    $("#backBtn").onclick = () => renderExamPrepSet(setId);
    $("#startBtn").onclick = () => {
      examState = {
        setId, topicId: topic.id,
        questions: sampleChallengeQuestions(setId, per),
        idx: 0, answers: [], byCat: {}, bySection: {}, challenge: true
      };
      renderExamQuestion();
    };
  }

  function renderExamPrepTopic(setId, topicId) {
    const set = DATA.examSet(setId);
    const topic = DATA.examTopic(setId, topicId);
    if (!set || !topic) return renderExamPrep();
    if (topic.challengeMode) return renderChallengeLanding(setId, topic);
    const bank = bankFor(topicId);
    if (!bank) {
      screen().innerHTML = `
        <div class="topbar"><span class="back" id="bk">← ${esc(set.label)}</span><h2>${esc(topic.label)}</h2></div>
        <div class="page" style="max-width:600px;margin:0 auto">
          <div class="soon-card">
            <div class="soon-badge">Akan Datang</div>
            <div class="big-emoji">📖</div>
            <h2>${esc(topic.label)}</h2>
            <p>Bank soalan untuk topik ini belum dimasukkan.</p>
            <div class="row" style="margin-top:18px"><button class="btn primary" id="backBtn">← Kembali</button></div>
          </div>
        </div>`;
      $("#bk").onclick = () => renderExamPrepSet(setId);
      $("#backBtn").onclick = () => renderExamPrepSet(setId);
      return;
    }
    const n = sessionSizeFor(topic, bank);
    const p = STORE.active();
    const past = ((p && p.exam && p.exam.history) || []).filter(h => h.topicId === topicId);
    const bestLine = past.length
      ? `<div class="summary-box" style="margin-top:14px">Percubaan lalu: <b>${past.length}</b> · Terbaik <b>${Math.max.apply(null, past.map(s => s.pct))}%</b> · Terkini <b>${past[0].pct}%</b></div>`
      : "";
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← ${esc(set.label)}</span><h2>${esc(topic.label)}</h2></div>
      <div class="page" style="max-width:600px;margin:0 auto">
        <div class="card" style="text-align:center">
          <div class="big-emoji">🎯</div>
          <h2 style="font-family:Georgia,serif;margin:8px 0 10px">${esc(topic.label)}</h2>
          <p class="muted" style="line-height:1.7">${esc(topic.desc || "")}<br/>
            Sesi ini mengandungi <b>${n} soalan</b> daripada ${bank.length} soalan dalam bank.</p>
          ${bestLine}
          <div class="row" style="margin-top:18px">
            <button class="btn ghost" id="backBtn">← Kembali</button>
            <button class="btn primary" id="startBtn">Mula Latihan →</button>
          </div>
        </div>
      </div>`;
    $("#bk").onclick = () => renderExamPrepSet(setId);
    $("#backBtn").onclick = () => renderExamPrepSet(setId);
    $("#startBtn").onclick = () => startExamSession(setId, topicId, bank, n);
  }

  let examState = null;
  function startExamSession(setId, topicId, bank, size) {
    examState = {
      setId, topicId,
      questions: sampleQuestions(bank, size),
      idx: 0,
      answers: [],
      byCat: {}
    };
    renderExamQuestion();
  }

  /* ---------- Sebut perkataan (untuk latihan Ejaan) ---------- */
  let cachedVoices = null;
  function malayVoice() {
    if (!("speechSynthesis" in window)) return null;
    const voices = cachedVoices && cachedVoices.length ? cachedVoices : (cachedVoices = window.speechSynthesis.getVoices() || []);
    if (!voices.length) return null;
    // Utamakan suara Bahasa Melayu; jika tiada, Bahasa Indonesia (sebutan paling hampir).
    return voices.filter(v => /^ms/i.test(v.lang))[0] ||
           voices.filter(v => /^id/i.test(v.lang))[0] || null;
  }
  if ("speechSynthesis" in window) {
    try { window.speechSynthesis.onvoiceschanged = function () { cachedVoices = window.speechSynthesis.getVoices() || []; }; } catch (e) { }
  }
  function speakWord(word) {
    if (!("speechSynthesis" in window)) return false;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      const v = malayVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "ms-MY"; }
      u.rate = 0.8;           // perlahan sedikit untuk kanak-kanak
      u.pitch = 1;
      u.volume = 1;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }

  function renderExamQuestion() {
    if (!examState) return;
    const total = examState.questions.length;
    const q = examState.questions[examState.idx];
    if (!q) return renderExamResults();
    const num = examState.idx + 1;
    const topic = DATA.examTopic(examState.setId, examState.topicId) || { label: examState.topicId };
    const correctSoFar = examState.answers.filter(a => a.correct).length;
    const isSpelling = !!q.spelling;

    // Papan kekunci sendiri — supaya cadangan/autocorrect telefon tidak membantu.
    const KB_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    const kbHtml = KB_ROWS.map((row, r) =>
      `<div class="kb-row">${row.split("").map(ch => `<button type="button" class="kb-key" data-key="${ch}">${ch}</button>`).join("")}${
        r === KB_ROWS.length - 1 ? `<button type="button" class="kb-key kb-wide kb-back" data-key="back">⌫</button>` : ""
      }</div>`).join("");

    const body = isSpelling
      ? `<div class="spell-block">
           <p class="spell-instr">Tekan pembesar suara untuk mendengar perkataan, kemudian ketik huruf di bawah untuk mengejanya.</p>
           <button class="btn primary spell-hear" id="hearBtn" type="button">🔊 Dengar perkataan</button>
           ${q.hint ? `<p class="spell-hint">💡 ${esc(q.hint)}</p>` : ""}
           <div class="spell-display" id="spellDisplay"><span class="spell-placeholder">Ketik huruf…</span></div>
           <div class="spell-keyboard" id="spellKb">${kbHtml}</div>
           <div class="spell-actions">
             <button class="btn ghost sm" id="spellClear" disabled>↺ Padam semua</button>
             <button class="btn primary sm" id="spellSubmit" disabled>Hantar jawapan</button>
           </div>
         </div>`
      : `<div class="qtext">${esc(q.q)}</div>
         <div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>`;

    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Keluar</span><h2>${esc(topic.label)}</h2></div>
      <div class="qwrap">
        <div class="exam-progress-label"><span>Soalan ${num} / ${total}</span><span>Betul ${correctSoFar}</span></div>
        <div class="exam-progress"><i style="width:${Math.round((examState.idx / total) * 100)}%"></i></div>
        ${examState.challenge
          ? `<div class="qtag">${esc(labelOfTopic(q.sourceTopic))}${q.cat ? " · " + esc(catLabel(q.sourceTopic, q.cat)) : ""}</div>`
          : (q.cat ? `<div class="qtag">${esc(catLabel(examState.topicId, q.cat))}</div>` : "")}
        ${body}
        <div id="fbk" style="margin-top:14px;min-height:24px;font-weight:700"></div>
      </div>`;
    $("#bk").onclick = () => {
      showConfirm("Keluar dari sesi ini?", "Kemajuan sesi ini tidak akan direkodkan.", "Keluar",
        () => { const s = examState.setId; examState = null; renderExamPrepSet(s); });
    };

    let busy = false;
    // Satu tempat merekod jawapan — sama untuk aneka pilihan dan ejaan.
    function finishAnswer(correct, chosenText, answerText, delayMs) {
      if (window.SOUND) SOUND.play(correct ? "correct" : "wrong");
      const c = q.cat || "?";
      if (!examState.byCat[c]) examState.byCat[c] = { correct: 0, total: 0 };
      examState.byCat[c].total++;
      if (correct) examState.byCat[c].correct++;
      if (examState.challenge) {
        const sid = q.sourceTopic || "?";
        if (!examState.bySection[sid]) examState.bySection[sid] = { correct: 0, total: 0 };
        examState.bySection[sid].total++;
        if (correct) examState.bySection[sid].correct++;
      }
      const stem = q.spelling ? ("Eja perkataan: " + q.word) : q.q;
      examState.answers.push({ q, correct, stem, chosenText, answerText });
      STORE.recordAnswer(q.sourceTopic || examState.topicId, correct, stem);
      setTimeout(() => {
        examState.idx++;
        if (examState.idx >= examState.questions.length) renderExamResults();
        else renderExamQuestion();
      }, delayMs);
    }

    if (isSpelling) {
      const spoken = speakWord(q.word);
      if (!spoken) {
        const instr = screen().querySelector(".spell-instr");
        if (instr) instr.innerHTML = "Eja perkataan ini: <b>" + esc(q.word) + "</b>";
      }
      $("#hearBtn").onclick = () => speakWord(q.word);

      const display = $("#spellDisplay");
      const clear = $("#spellClear");
      const submit = $("#spellSubmit");
      const kb = $("#spellKb");
      const MAX_LEN = Math.max(12, (q.word || "").length + 4);
      let typed = "";
      function paint() {
        display.innerHTML = typed ? esc(typed) : `<span class="spell-placeholder">Ketik huruf…</span>`;
        clear.disabled = busy || !typed.length;
        submit.disabled = busy || !typed.length;
      }
      paint();
      kb.querySelectorAll(".kb-key").forEach(btn => {
        btn.onclick = () => {
          if (busy) return;
          const key = btn.dataset.key;
          if (key === "back") typed = typed.slice(0, -1);
          else if (typed.length < MAX_LEN) typed += key;
          paint();
        };
      });
      clear.onclick = () => { if (!busy) { typed = ""; paint(); } };
      submit.onclick = () => {
        if (busy || !typed) return;
        busy = true;
        const guess = typed.trim().toLowerCase();
        const accept = [q.word.toLowerCase()].concat((q.alt || []).map(a => a.toLowerCase()));
        const correct = accept.indexOf(guess) > -1;
        kb.querySelectorAll(".kb-key").forEach(b => b.disabled = true);
        clear.disabled = true; submit.disabled = true;
        display.classList.add(correct ? "spell-ok" : "spell-bad");
        $("#fbk").innerHTML = correct
          ? `<span style="color:#9cf0b3">✅ Betul!</span>`
          : `<span style="color:#ffa6a1">❌ Ejaan yang betul: <b>${esc(q.word)}</b></span>`;
        finishAnswer(correct, typed, q.word, correct ? 900 : 2600);
      };
      return;
    }

    screen().querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        if (busy) return; busy = true;
        const chosen = parseInt(btn.dataset.i, 10);
        const correct = chosen === q.answer;
        screen().querySelectorAll(".opt").forEach(b => b.disabled = true);
        btn.classList.add(correct ? "opt-ok" : "opt-bad");
        if (!correct) {
          const good = screen().querySelector('.opt[data-i="' + q.answer + '"]');
          if (good) good.classList.add("opt-ok");
        }
        $("#fbk").innerHTML = correct
          ? `<span style="color:#9cf0b3">✅ Betul!</span>`
          : `<span style="color:#ffa6a1">❌ Jawapan betul: <b>${esc(q.options[q.answer])}</b></span>`;
        finishAnswer(correct, q.options[chosen], q.options[q.answer], correct ? 650 : 1500);
      };
    });
  }

  function renderExamResults() {
    const total = examState.answers.length;
    const correct = examState.answers.filter(a => a.correct).length;
    const pct = total ? Math.round(correct / total * 100) : 0;
    const topic = DATA.examTopic(examState.setId, examState.topicId) || { label: examState.topicId };

    const mistakes = examState.answers.filter(a => !a.correct).map(a => ({
      q: a.stem,
      chosen: a.chosenText,
      answer: a.answerText,
      cat: a.q.cat || "?"
    }));

    STORE.recordExamSession({
      setId: examState.setId, topicId: examState.topicId,
      ts: Date.now(), total, correct, byCat: examState.byCat,
      bySection: examState.challenge ? examState.bySection : null,
      mistakes,
      // Senarai penuh setiap soalan — untuk skrin butiran sesi.
      answers: examState.answers.map(a => ({
        q: a.stem, c: a.chosenText, a: a.answerText, ok: a.correct ? 1 : 0,
        cat: a.q.cat || "?", sec: a.q.sourceTopic || null
      }))
    });

    // Ujian Cabaran Akhir — pecahan mengikut topik (kukuh → lemah).
    let sectionSection = "";
    if (examState.challenge && examState.bySection) {
      const rows = Object.keys(examState.bySection).map(sid => {
        const s = examState.bySection[sid];
        const acc = s.total ? s.correct / s.total : 0;
        return { sid, label: labelOfTopic(sid), correct: s.correct, total: s.total, pct: Math.round(acc * 100), acc };
      }).sort((a, b) => b.acc - a.acc);
      if (rows.length) {
        const strong = rows[0], weak = rows[rows.length - 1];
        const list = rows.map(r => `<div class="rep-card">
          <div class="t"><span>${esc(r.label)}</span>
            <span class="${r.acc >= 0.8 ? "tag-strong" : r.acc >= 0.55 ? "tag-mid" : "tag-weak"}">${r.pct}%</span></div>
          <div class="sub">${r.correct} / ${r.total} betul</div>
          <div class="bar"><i style="width:${r.pct}%;background:${r.acc >= 0.8 ? "#4ec46a" : r.acc >= 0.55 ? "#e0a83a" : "#e2554d"}"></i></div>
        </div>`).join("");
        sectionSection = `
          <div class="summary-box" style="margin-top:18px">
            <div><span class="hist-label">💪 Paling kukuh</span> <b>${esc(strong.label)}</b> — ${strong.pct}%</div>
            <div style="margin-top:4px"><span class="hist-label">🎯 Paling lemah</span> <b>${esc(weak.label)}</b> — ${weak.pct}%</div>
          </div>
          <h1 style="font-size:20px;margin:22px 0 10px">Mengikut topik (kukuh → lemah)</h1>
          <div class="rep-grid">${list}</div>`;
      }
    }

    const catRows = Object.keys(examState.byCat).map(c => {
      const s = examState.byCat[c];
      const acc = s.total ? s.correct / s.total : 0;
      return { cat: c, label: catLabel(examState.topicId, c), pct: Math.round(acc * 100), acc, correct: s.correct, total: s.total };
    }).sort((a, b) => a.acc - b.acc);

    const band = pct >= 80 ? { emoji: "🏆", head: "Cemerlang!" }
               : pct >= 60 ? { emoji: "👍", head: "Bagus — teruskan!" }
               : { emoji: "💪", head: "Jangan putus asa" };

    const catCards = catRows.map(r => `<div class="rep-card">
      <div class="t"><span>${esc(r.label)}</span>
        <span class="${r.acc >= 0.8 ? "tag-strong" : r.acc >= 0.55 ? "tag-mid" : "tag-weak"}">${r.pct}%</span></div>
      <div class="sub">${r.correct} / ${r.total} betul</div>
      <div class="bar"><i style="width:${r.pct}%;background:${r.acc >= 0.8 ? "#4ec46a" : r.acc >= 0.55 ? "#e0a83a" : "#e2554d"}"></i></div>
    </div>`).join("");

    const mistakeCards = mistakes.slice(0, 6).map(m => `<div class="rep-card">
      <div class="sub" style="margin-bottom:6px;color:var(--ink)">${esc(m.q)}</div>
      <div class="sub" style="color:#e2554d">Jawapan anda: <b>${esc(m.chosen)}</b></div>
      <div class="sub" style="color:#4ec46a">Jawapan betul: <b>${esc(m.answer)}</b></div>
    </div>`).join("");

    let weakest = catRows[0];
    if (examState.challenge && examState.bySection) {
      weakest = Object.keys(examState.bySection).map(sid => {
        const s = examState.bySection[sid];
        const acc = s.total ? s.correct / s.total : 0;
        return { label: labelOfTopic(sid), correct: s.correct, total: s.total, acc };
      }).sort((a, b) => a.acc - b.acc)[0];
    }
    const advice = weakest && weakest.total >= 2 && weakest.acc < 0.7
      ? `<b>Beri tumpuan kepada:</b> ${esc(weakest.label)} — ${weakest.correct}/${weakest.total} betul.`
      : pct >= 80 ? `<b>Syabas!</b> Ketepatan ${pct}%. Cuba topik yang lebih mencabar.`
      : `<b>Teruskan berlatih:</b> ketepatan ${pct}%. Ulang sesi ini sekali lagi untuk melihat peningkatan.`;

    const savedSet = examState.setId, savedTopic = examState.topicId;
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Topik</span><h2>Keputusan — ${esc(topic.label)}</h2></div>
      <div class="page" style="max-width:760px;margin:0 auto">
        <div class="card" style="text-align:center">
          <div class="big-emoji">${band.emoji}</div>
          <h2 style="font-family:Georgia,serif;margin:6px 0">${band.head}</h2>
          <div class="exam-score">${pct}%</div>
          <div class="muted" style="font-weight:700">${correct} / ${total} betul</div>
          <div class="summary-box" style="margin-top:14px;text-align:left">${advice}</div>
        </div>
        ${sectionSection}
        ${catCards && !examState.challenge ? `<h1 style="font-size:20px;margin:22px 0 10px">Mengikut bahagian</h1><div class="rep-grid">${catCards}</div>` : ""}
        ${mistakeCards ? `<h1 style="font-size:20px;margin:22px 0 10px">Kesilapan dalam sesi ini</h1><div class="rep-grid">${mistakeCards}</div>` : ""}
        <div class="row" style="margin-top:22px">
          <button class="btn ghost" id="backBtn">← Senarai topik</button>
          <button class="btn" id="histBtn">📈 Sejarah &amp; Analisis</button>
          <button class="btn primary" id="againBtn">🔁 Cuba lagi</button>
        </div>
      </div>`;
    $("#bk").onclick      = () => { examState = null; renderExamPrepSet(savedSet); };
    $("#backBtn").onclick = () => { examState = null; renderExamPrepSet(savedSet); };
    $("#histBtn").onclick = () => { examState = null; renderExamHistory(); };
    $("#againBtn").onclick = () => { examState = null; renderExamPrepTopic(savedSet, savedTopic); };
  }

  /* ===================== SEJARAH & ANALISIS ===================== */
  function agoLabel(ts) {
    const s = Math.max(1, (Date.now() - ts) / 1000);
    if (s < 60)     return "baru sahaja";
    if (s < 3600)   return Math.floor(s / 60) + " minit lalu";
    if (s < 86400)  return Math.floor(s / 3600) + " jam lalu";
    if (s < 604800) return Math.floor(s / 86400) + " hari lalu";
    return Math.floor(s / 604800) + " minggu lalu";
  }
  function pctBand(p) {
    if (p >= 80) return { cls: "tag-strong", color: "#4ec46a", txt: "Kukuh" };
    if (p >= 60) return { cls: "tag-mid", color: "#e0a83a", txt: "Semakin baik" };
    return { cls: "tag-weak", color: "#e2554d", txt: "Perlu usaha" };
  }
  function labelOfTopic(topicId) {
    const t = (window.DATA && DATA.anyTopic) ? DATA.anyTopic(topicId) : null;
    return (t && t.label) || topicId;
  }

  function renderExamHistory() {
    const p = STORE.active();
    const history = (p && p.exam && p.exam.history) || [];

    if (!history.length) {
      screen().innerHTML = `
        <div class="topbar"><span class="back" id="bk">← Persediaan Peperiksaan</span><h2>📈 Sejarah &amp; Analisis</h2></div>
        <div class="page" style="max-width:560px;margin:0 auto;text-align:center">
          <div class="card" style="padding:26px;margin-top:16px">
            <div class="big-emoji">📊</div>
            <h2 style="margin:6px 0 10px;font-family:Georgia,serif">Belum ada sesi</h2>
            <p class="muted" style="line-height:1.7">
              Setiap sesi latihan yang tamat akan muncul di sini — markah terbaik, terburuk,
              purata, arah aliran dan bahagian yang paling banyak silap.
            </p>
            <div class="row" style="margin-top:16px">
              <button class="btn primary" id="backBtn">← Kembali ke Persediaan Peperiksaan</button>
            </div>
          </div>
        </div>`;
      $("#bk").onclick = renderExamPrep;
      $("#backBtn").onclick = renderExamPrep;
      return;
    }

    // Kumpul mengikut topik.
    const byTopic = {};
    for (const h of history) {
      if (!byTopic[h.topicId]) byTopic[h.topicId] = { sessions: [], byCat: {} };
      byTopic[h.topicId].sessions.push(h);
      const byC = byTopic[h.topicId].byCat;
      Object.keys(h.byCat || {}).forEach(c => {
        if (!byC[c]) byC[c] = { correct: 0, total: 0 };
        byC[c].correct += h.byCat[c].correct;
        byC[c].total += h.byCat[c].total;
      });
    }

    const topicRows = Object.keys(byTopic).map(tid => {
      const sess = byTopic[tid].sessions;
      const scores = sess.map(s => s.pct);
      const best = Math.max.apply(null, scores);
      const worst = Math.min.apply(null, scores);
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const latest = sess[0].pct;
      const prior = sess.slice(1);
      const priorAvg = prior.length ? Math.round(prior.reduce((a, b) => a + b.pct, 0) / prior.length) : latest;
      const trend = latest > priorAvg ? "up" : latest < priorAvg ? "down" : "flat";
      const catRows = Object.keys(byTopic[tid].byCat).map(c => {
        const s = byTopic[tid].byCat[c];
        const acc = s.total ? s.correct / s.total : 0;
        return { cat: c, label: catLabel(tid, c), pct: Math.round(acc * 100), correct: s.correct, total: s.total, acc };
      }).sort((a, b) => a.acc - b.acc);
      const topicDef = (window.DATA && DATA.anyTopic) ? DATA.anyTopic(tid) : null;
      const isChallenge = !!(topicDef && topicDef.challengeMode);
      let sectionAgg = null;
      if (isChallenge) {
        sectionAgg = {};
        sess.forEach(s => {
          Object.keys(s.bySection || {}).forEach(sid => {
            if (!sectionAgg[sid]) sectionAgg[sid] = { correct: 0, total: 0 };
            sectionAgg[sid].correct += s.bySection[sid].correct;
            sectionAgg[sid].total += s.bySection[sid].total;
          });
        });
        if (!Object.keys(sectionAgg).length) sectionAgg = null;
      }
      return {
        topicId: tid, label: labelOfTopic(tid), sessions: sess.length,
        latest, best, worst, avg, trend, weakestCat: catRows[0], catRows,
        isChallenge, sectionAgg
      };
    }).sort((a, b) => a.avg - b.avg);

    const totalSessions = history.length;
    const overallAvg = Math.round(history.reduce((a, b) => a + b.pct, 0) / totalSessions);
    const weakTopics = topicRows.filter(t => t.avg < 70).slice(0, 3);

    let summaryLine = weakTopics.length
      ? `Ketepatan keseluruhan: <b>${overallAvg}%</b> daripada <b>${totalSessions}</b> sesi. ` +
        `Beri tumpuan kepada: <b style="color:#e2554d">${weakTopics.map(t => esc(t.label)).join(", ")}</b>.`
      : `Ketepatan keseluruhan: <b>${overallAvg}%</b> daripada <b>${totalSessions}</b> sesi. ` +
        `Bagus — tiada topik lemah yang ketara. Teruskan!`;
    summaryLine += `<br/><span class="muted" style="font-size:12.5px;font-weight:600">👆 Ketik mana-mana kad topik untuk analisis terperinci.</span>`;

    function suggestionFor(t) {
      const parts = [];
      if (t.trend === "down" && t.sessions >= 2) parts.push("Markah terkini menurun — ulang kaji topik ini sebelum sesi seterusnya.");
      if (t.sessions < 3) parts.push("Buat " + (3 - t.sessions) + " sesi lagi untuk gambaran yang lebih tepat.");
      if (t.isChallenge && t.sectionAgg) {
        const weak = Object.keys(t.sectionAgg).map(sid => {
          const s = t.sectionAgg[sid];
          return { label: labelOfTopic(sid), acc: s.total ? s.correct / s.total : 0, pct: s.total ? Math.round(s.correct / s.total * 100) : 0, total: s.total };
        }).sort((a, b) => a.acc - b.acc)[0];
        if (weak && weak.total) {
          parts.push("Ulang topik <b>" + esc(weak.label) + "</b> dahulu — paling lemah dalam ujian ini (" + weak.pct + "%).");
        }
        return parts.join(" ") || "Teruskan berlatih untuk membina rekod yang lebih panjang.";
      }
      if (t.weakestCat && t.weakestCat.total >= 3 && t.weakestCat.acc < 0.7) {
        parts.push("Tumpukan pada <b>" + esc(t.weakestCat.label) + "</b> — di situ paling banyak silap (" + t.weakestCat.pct + "%).");
      } else if (t.avg < 60) {
        parts.push("Latih topik ini lebih kerap — cuba 2–3 sesi lagi minggu ini.");
      } else if (t.avg >= 80 && !parts.length) {
        parts.push("Prestasi kukuh. Teruskan, atau cuba topik yang lebih mencabar.");
      }
      return parts.length ? parts.join(" ") : "Teruskan berlatih untuk membina rekod yang lebih panjang.";
    }

    const topicCards = topicRows.map(t => {
      const band = pctBand(t.avg);
      const trendMark = t.trend === "up" ? '<span class="hist-trend up">▲ meningkat</span>'
                      : t.trend === "down" ? '<span class="hist-trend down">▼ menurun</span>'
                      : '<span class="hist-trend flat">— stabil</span>';
      const weakLine = t.weakestCat && t.weakestCat.total > 0
        ? (t.weakestCat.acc < 0.75
            ? `<div class="hist-weak"><span class="hist-label">🎯 Paling lemah</span> <b>${esc(t.weakestCat.label)}</b> — ${t.weakestCat.correct}/${t.weakestCat.total} betul (${t.weakestCat.pct}%)</div>`
            : `<div class="hist-weak muted"><span class="hist-label">✅ Semua bahagian ≥ 75%</span> Seimbang merentas jenis soalan.</div>`)
        : "";
      let challengeBlock = "";
      if (t.isChallenge && t.sectionAgg) {
        const rows = Object.keys(t.sectionAgg).map(sid => {
          const s = t.sectionAgg[sid];
          const acc = s.total ? s.correct / s.total : 0;
          return { label: labelOfTopic(sid), correct: s.correct, total: s.total, pct: Math.round(acc * 100), acc };
        }).sort((a, b) => b.acc - a.acc);
        if (rows.length) {
          const strong = rows[0], weak = rows[rows.length - 1];
          const list = rows.map(r => `<div class="challenge-row">
            <span class="challenge-name">${esc(r.label)}</span>
            <span class="${r.acc >= 0.8 ? "tag-strong" : r.acc >= 0.55 ? "tag-mid" : "tag-weak"}">${r.pct}%</span>
            <span class="muted" style="font-size:12px">(${r.correct}/${r.total})</span>
          </div>`).join("");
          challengeBlock = `
            <div class="hist-weak muted">
              <div><span class="hist-label">💪 Paling kukuh</span> <b>${esc(strong.label)}</b> — ${strong.pct}%</div>
              <div style="margin-top:4px"><span class="hist-label">🎯 Paling lemah</span> <b>${esc(weak.label)}</b> — ${weak.pct}%</div>
            </div>
            <details class="challenge-details">
              <summary>Semua ${rows.length} topik — gabungan ${t.sessions} percubaan</summary>
              <div class="challenge-list">${list}</div>
            </details>`;
        }
      }
      return `<div class="hist-topic-card" data-topic="${esc(t.topicId)}">
        <div class="hist-topic-head">
          <div class="hist-topic-name">${t.isChallenge ? "🏅 " : ""}${esc(t.label)}</div>
          <span class="${band.cls}">${band.txt} · ${t.avg}%</span>
        </div>
        <div class="hist-topic-stats">
          <span class="hist-stat"><b>${t.sessions}</b> percubaan</span>
          <span class="hist-stat">Terkini <b>${t.latest}%</b></span>
          <span class="hist-stat">Terbaik <b>${t.best}%</b></span>
          <span class="hist-stat">Terburuk <b>${t.worst}%</b></span>
          <span class="hist-stat">${trendMark}</span>
        </div>
        ${challengeBlock || weakLine}
        <div class="hist-suggest"><span class="hist-label">💡 Cadangan</span> ${suggestionFor(t)}</div>
      </div>`;
    }).join("");

    const recent = history.slice(0, 10).map(h => {
      const band = pctBand(h.pct);
      return `<div class="hist-session clickable" data-ts="${h.ts}">
        <div class="hist-session-row">
          <span class="hist-session-topic">${esc(labelOfTopic(h.topicId))}</span>
          <span class="${band.cls}">${h.correct}/${h.total} · ${h.pct}%</span>
        </div>
        <div class="hist-session-row">
          <span class="hist-session-when muted">${esc(agoLabel(h.ts))}</span>
          <span class="hist-session-more">Lihat butiran ›</span>
        </div>
      </div>`;
    }).join("");

    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Persediaan Peperiksaan</span><h2>📈 Sejarah &amp; Analisis</h2></div>
      <div class="page" style="max-width:760px;margin:0 auto">
        <div class="summary-box">${summaryLine}</div>
        <h1 style="font-size:20px;margin:22px 0 10px">Mengikut topik — paling lemah dahulu</h1>
        <div class="hist-topic-grid">${topicCards}</div>
        <h1 style="font-size:20px;margin:22px 0 10px">Sesi terkini</h1>
        <div class="hist-session-list">${recent}</div>
        <div class="row" style="margin-top:18px">
          <button class="btn ghost sm" id="clearBtn">🗑️ Kosongkan sejarah</button>
          <button class="btn primary" id="backBtn">← Kembali</button>
        </div>
      </div>`;
    $("#bk").onclick = renderExamPrep;
    $("#backBtn").onclick = renderExamPrep;
    $("#clearBtn").onclick = () => {
      showConfirm("Kosongkan semua sejarah?", "Semua sesi latihan yang direkodkan untuk pemain ini akan dipadam. Tindakan ini tidak boleh dibatalkan.",
        "Kosongkan", () => {
          const p2 = STORE.active();
          if (p2 && p2.exam) { p2.exam.history = []; STORE.save({ immediate: true }); }
          renderExamHistory();
        });
    };
    screen().querySelectorAll(".hist-topic-card").forEach(card => {
      card.onclick = () => renderExamTopicDetail(card.dataset.topic);
    });
    screen().querySelectorAll(".hist-session[data-ts]").forEach(row => {
      row.onclick = () => renderSessionDetail(Number(row.dataset.ts), renderExamHistory);
    });
  }

  /* ---------- butiran satu sesi ---------- */
  function fullDate(ts) {
    try {
      return new Date(ts).toLocaleString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" });
    } catch (e) { return new Date(ts).toLocaleString(); }
  }

  function renderSessionDetail(ts, onBack) {
    const p = STORE.active();
    const history = (p && p.exam && p.exam.history) || [];
    const s = history.filter(h => h.ts === ts)[0];
    if (!s) { onBack(); return; }

    const label = labelOfTopic(s.topicId);
    const band = pctBand(s.pct);
    const topicDef = (window.DATA && DATA.anyTopic) ? DATA.anyTopic(s.topicId) : null;
    const isChallenge = !!(topicDef && topicDef.challengeMode);

    // Pecahan: ikut topik (Cabaran Akhir) atau ikut bahagian (topik biasa).
    const src = isChallenge && s.bySection ? s.bySection : (s.byCat || {});
    const breakRows = Object.keys(src).map(k => {
      const r = src[k];
      const acc = r.total ? r.correct / r.total : 0;
      return { label: isChallenge ? labelOfTopic(k) : catLabel(s.topicId, k), correct: r.correct, total: r.total, pct: Math.round(acc * 100), acc };
    }).sort((a, b) => a.acc - b.acc);
    const breakCards = breakRows.map(r => `<div class="rep-card">
      <div class="t"><span>${esc(r.label)}</span>
        <span class="${r.acc >= 0.8 ? "tag-strong" : r.acc >= 0.55 ? "tag-mid" : "tag-weak"}">${r.pct}%</span></div>
      <div class="sub">${r.correct} / ${r.total} betul</div>
      <div class="bar"><i style="width:${r.pct}%;background:${r.acc >= 0.8 ? "#4ec46a" : r.acc >= 0.55 ? "#e0a83a" : "#e2554d"}"></i></div>
    </div>`).join("");

    // Senarai soalan. Sesi lama (sebelum kemas kini ini) hanya ada kesilapan.
    const hasFull = Array.isArray(s.answers) && s.answers.length > 0;
    const items = hasFull
      ? s.answers.map(a => ({ q: a.q, chosen: a.c, answer: a.a, ok: !!a.ok, sec: a.sec }))
      : (s.mistakes || []).map(m => ({ q: m.q, chosen: m.chosen, answer: m.answer, ok: false, sec: null }));
    const wrongCount = items.filter(i => !i.ok).length;

    function itemsHtml(onlyWrong) {
      const list = items.map((it, i) => ({ it, n: i + 1 })).filter(x => !onlyWrong || !x.it.ok);
      if (!list.length) return `<div class="muted" style="text-align:center;padding:14px">🎉 Tiada jawapan salah dalam sesi ini.</div>`;
      return list.map(({ it, n }) => `<div class="ans-row ${it.ok ? "ans-ok" : "ans-bad"}">
        <div class="ans-head">
          <span class="ans-num">${hasFull ? "S" + n : "❌"}</span>
          <span class="ans-q">${esc(it.q || "Soalan")}</span>
          ${hasFull ? `<span class="ans-mark">${it.ok ? "✅" : "❌"}</span>` : ""}
        </div>
        ${isChallenge && it.sec ? `<div class="ans-sec muted">${esc(labelOfTopic(it.sec))}</div>` : ""}
        ${it.ok
          ? `<div class="sub" style="color:#9cf0b3">Jawapan: <b>${esc(it.answer)}</b></div>`
          : `<div class="sub" style="color:#ffa6a1">Jawapan anak: <b>${esc(it.chosen)}</b></div>
             <div class="sub" style="color:#9cf0b3">Jawapan betul: <b>${esc(it.answer)}</b></div>`}
      </div>`).join("");
    }

    const filterBar = hasFull ? `<div class="ans-filter">
        <button class="btn sm primary" data-f="all">Semua (${items.length})</button>
        <button class="btn sm ghost" data-f="wrong">Salah sahaja (${wrongCount})</button>
      </div>` : `<div class="summary-box" style="margin-bottom:10px;font-size:13px">Sesi ini direkodkan sebelum butiran penuh disimpan — hanya kesilapan yang ditunjukkan.</div>`;

    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Kembali</span><h2>Butiran Sesi</h2></div>
      <div class="page" style="max-width:760px;margin:0 auto">
        <div class="card" style="max-width:none;text-align:center">
          <div class="hist-topic-name">${isChallenge ? "🏅 " : ""}${esc(label)}</div>
          <div class="muted" style="font-size:13px;margin-top:4px">${esc(fullDate(s.ts))} · ${esc(agoLabel(s.ts))}</div>
          <div class="exam-score">${s.pct}%</div>
          <div class="muted" style="font-weight:700">${s.correct} / ${s.total} betul</div>
          <div style="margin-top:8px"><span class="${band.cls}">${band.txt}</span></div>
        </div>
        ${breakCards ? `<h1 style="font-size:20px;margin:22px 0 10px">${isChallenge ? "Mengikut topik" : "Mengikut bahagian"} (lemah → kukuh)</h1><div class="rep-grid">${breakCards}</div>` : ""}
        <h1 style="font-size:20px;margin:22px 0 10px">${hasFull ? "Setiap soalan" : "Kesilapan"}</h1>
        ${filterBar}
        <div class="ans-list" id="ansList">${itemsHtml(false)}</div>
        <div class="row" style="margin-top:22px">
          <button class="btn ghost" id="backBtn">← Kembali</button>
        </div>
      </div>`;
    $("#bk").onclick = onBack;
    $("#backBtn").onclick = onBack;
    screen().querySelectorAll(".ans-filter [data-f]").forEach(btn => {
      btn.onclick = () => {
        screen().querySelectorAll(".ans-filter [data-f]").forEach(b => {
          b.classList.toggle("primary", b === btn);
          b.classList.toggle("ghost", b !== btn);
        });
        $("#ansList").innerHTML = itemsHtml(btn.dataset.f === "wrong");
      };
    });
    window.scrollTo(0, 0);
  }

  /* ---------- analisis terperinci satu topik ---------- */
  function renderExamTopicDetail(topicId) {
    const p = STORE.active();
    const sessions = ((p && p.exam && p.exam.history) || []).filter(h => h.topicId === topicId);
    if (!sessions.length) return renderExamHistory();
    const label = labelOfTopic(topicId);

    const scores = sessions.map(s => s.pct);
    const best = Math.max.apply(null, scores);
    const worst = Math.min.apply(null, scores);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const latest = sessions[0].pct;
    const prior = sessions.slice(1);
    const priorAvg = prior.length ? Math.round(prior.reduce((a, b) => a + b.pct, 0) / prior.length) : latest;
    const trend = latest > priorAvg ? "up" : latest < priorAvg ? "down" : "flat";
    const trendMark = trend === "up" ? '<span class="hist-trend up">▲ meningkat berbanding purata</span>'
                    : trend === "down" ? '<span class="hist-trend down">▼ markah terkini menurun</span>'
                    : '<span class="hist-trend flat">— stabil</span>';
    const band = pctBand(avg);

    const byCat = {};
    sessions.forEach(s => {
      Object.keys(s.byCat || {}).forEach(c => {
        if (!byCat[c]) byCat[c] = { correct: 0, total: 0 };
        byCat[c].correct += s.byCat[c].correct;
        byCat[c].total += s.byCat[c].total;
      });
    });
    const catRows = Object.keys(byCat).map(c => {
      const s = byCat[c];
      const acc = s.total ? s.correct / s.total : 0;
      return { label: catLabel(topicId, c), pct: Math.round(acc * 100), correct: s.correct, total: s.total, acc };
    }).sort((a, b) => a.acc - b.acc);
    const catCards = catRows.map(r => `<div class="rep-card">
      <div class="t"><span>${esc(r.label)}</span>
        <span class="${r.acc >= 0.8 ? "tag-strong" : r.acc >= 0.55 ? "tag-mid" : "tag-weak"}">${r.pct}%</span></div>
      <div class="sub">${r.correct} / ${r.total} betul merentas ${sessions.length} percubaan</div>
      <div class="bar"><i style="width:${r.pct}%;background:${r.acc >= 0.8 ? "#4ec46a" : r.acc >= 0.55 ? "#e0a83a" : "#e2554d"}"></i></div>
    </div>`).join("");

    // Graf mini — sesi lama → terkini (kiri → kanan).
    const sparkVals = sessions.slice().reverse().map(s => s.pct);
    const W = 300, H = 60, pad = 6;
    let sparkSvg = "";
    if (sparkVals.length >= 2) {
      const stepX = (W - 2 * pad) / (sparkVals.length - 1);
      const pts = sparkVals.map((v, i) => {
        const x = pad + i * stepX;
        const y = H - pad - (v / 100) * (H - 2 * pad);
        return x.toFixed(1) + "," + y.toFixed(1);
      });
      const avgY = (H - pad - (avg / 100) * (H - 2 * pad)).toFixed(1);
      sparkSvg = `
        <svg class="hist-sparkline" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
          <path d="M 0 ${avgY} L ${W} ${avgY}" stroke="rgba(224,168,58,.35)" stroke-width="1" stroke-dasharray="4 4" fill="none"/>
          <polyline points="${pts.join(" ")}" stroke="#e0a83a" stroke-width="2" fill="none" stroke-linejoin="round"/>
          ${pts.map(pt => { const xy = pt.split(","); return `<circle cx="${xy[0]}" cy="${xy[1]}" r="3" fill="#fff"/>`; }).join("")}
        </svg>
        <div class="hist-spark-cap muted">← sesi lama · sesi terkini →</div>`;
    }

    const sessionList = sessions.map((s, i) => {
      const b = pctBand(s.pct);
      const tag = i === 0 ? "Terkini" : ("#" + (sessions.length - i));
      return `<div class="hist-session clickable" data-ts="${s.ts}">
        <div class="hist-session-row">
          <span class="hist-session-topic">${tag} · <span class="muted">${esc(agoLabel(s.ts))}</span></span>
          <span class="${b.cls}">${s.correct}/${s.total} · ${s.pct}%</span>
        </div>
        <div class="hist-session-row"><span></span><span class="hist-session-more">Lihat butiran ›</span></div>
      </div>`;
    }).join("");

    const mistakes = [];
    for (const s of sessions.slice(0, 3)) {
      for (const m of (s.mistakes || [])) {
        mistakes.push({ q: m.q, chosen: m.chosen, answer: m.answer, when: agoLabel(s.ts) });
        if (mistakes.length >= 8) break;
      }
      if (mistakes.length >= 8) break;
    }
    const mistakeCards = mistakes.map(m => `<div class="rep-card">
      <div class="sub" style="margin-bottom:6px;color:var(--ink)">${esc(m.q || "Soalan")} <span class="muted" style="font-size:11px">· ${esc(m.when)}</span></div>
      <div class="sub" style="color:#e2554d">Jawapan anak: <b>${esc(m.chosen)}</b></div>
      <div class="sub" style="color:#4ec46a">Jawapan betul: <b>${esc(m.answer)}</b></div>
    </div>`).join("");

    // Ujian Cabaran Akhir — pecahan mengikut topik merentas semua percubaan.
    const topicDef = (window.DATA && DATA.anyTopic) ? DATA.anyTopic(topicId) : null;
    let sectionSection = "";
    let weakestSection = null;
    if (topicDef && topicDef.challengeMode) {
      const agg = {};
      sessions.forEach(s => {
        Object.keys(s.bySection || {}).forEach(sid => {
          if (!agg[sid]) agg[sid] = { correct: 0, total: 0 };
          agg[sid].correct += s.bySection[sid].correct;
          agg[sid].total += s.bySection[sid].total;
        });
      });
      const rows = Object.keys(agg).map(sid => {
        const s = agg[sid];
        const acc = s.total ? s.correct / s.total : 0;
        return { label: labelOfTopic(sid), correct: s.correct, total: s.total, pct: Math.round(acc * 100), acc };
      }).sort((a, b) => b.acc - a.acc);
      if (rows.length) {
        weakestSection = rows[rows.length - 1];
        sectionSection = `
          <h1 style="font-size:20px;margin:22px 0 10px">Mengikut topik (kukuh → lemah)</h1>
          <div class="rep-grid">${rows.map(r => `<div class="rep-card">
            <div class="t"><span>${esc(r.label)}</span>
              <span class="${r.acc >= 0.8 ? "tag-strong" : r.acc >= 0.55 ? "tag-mid" : "tag-weak"}">${r.pct}%</span></div>
            <div class="sub">${r.correct} / ${r.total} betul merentas ${sessions.length} percubaan</div>
            <div class="bar"><i style="width:${r.pct}%;background:${r.acc >= 0.8 ? "#4ec46a" : r.acc >= 0.55 ? "#e0a83a" : "#e2554d"}"></i></div>
          </div>`).join("")}</div>`;
      }
    }

    const weakestCat = weakestSection || catRows[0];
    let advice;
    if (weakestCat && weakestCat.total >= 3 && weakestCat.acc < 0.7) {
      advice = `<b>Beri tumpuan:</b> ${esc(weakestCat.label)} — ${weakestCat.pct}% daripada ${weakestCat.total} soalan.`;
    } else if (avg < 60) {
      advice = `<b>Beri tumpuan:</b> latih topik ini lebih kerap — purata ${avg}%.`;
    } else if (avg >= 80) {
      advice = `<b>Syabas!</b> Purata ${avg}% merentas ${sessions.length} sesi. Teruskan.`;
    } else {
      advice = `<b>Kemajuan stabil:</b> purata ${avg}%. Tolak sedikit lagi untuk mencapai 80%.`;
    }

    const setId = (DATA.setOfTopic(topicId) || {}).id;
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Sejarah &amp; Analisis</span><h2>${esc(label)}</h2></div>
      <div class="page" style="max-width:760px;margin:0 auto">
        <div class="card" style="max-width:none">
          <div class="hist-topic-head">
            <div class="hist-topic-name">${esc(label)}</div>
            <span class="${band.cls}">${band.txt} · ${avg}%</span>
          </div>
          <div class="hist-topic-stats" style="margin-top:6px">
            <span class="hist-stat"><b>${sessions.length}</b> percubaan</span>
            <span class="hist-stat">Terkini <b>${latest}%</b></span>
            <span class="hist-stat">Terbaik <b>${best}%</b></span>
            <span class="hist-stat">Terburuk <b>${worst}%</b></span>
            <span class="hist-stat">${trendMark}</span>
          </div>
          <div class="summary-box" style="margin-top:14px">${advice}</div>
          ${sparkSvg ? `<div style="margin-top:12px;text-align:center">${sparkSvg}</div>` : ""}
        </div>
        ${sectionSection}
        ${catCards && !sectionSection ? `<h1 style="font-size:20px;margin:22px 0 10px">Di mana silap berkumpul (lemah → kukuh)</h1><div class="rep-grid">${catCards}</div>` : ""}
        <h1 style="font-size:20px;margin:22px 0 10px">Setiap percubaan</h1>
        <div class="hist-session-list">${sessionList}</div>
        ${mistakeCards ? `<h1 style="font-size:20px;margin:22px 0 10px">Kesilapan terkini</h1><div class="rep-grid">${mistakeCards}</div>` : ""}
        <div class="row" style="margin-top:22px">
          <button class="btn ghost" id="backBtn">← Kembali</button>
          <button class="btn primary" id="practiceBtn">🎯 Mula Latihan</button>
        </div>
      </div>`;
    $("#bk").onclick = renderExamHistory;
    $("#backBtn").onclick = renderExamHistory;
    $("#practiceBtn").onclick = () => renderExamPrepTopic(setId, topicId);
    screen().querySelectorAll(".hist-session[data-ts]").forEach(row => {
      row.onclick = () => renderSessionDetail(Number(row.dataset.ts), () => renderExamTopicDetail(topicId));
    });
  }

  /* ===================== LAPORAN IBU BAPA ===================== */
  function renderReport() {
    const r = REPORT.build();
    const name = (STORE.active() || {}).name || "Pemain";

    const cards = r.rows.map(row => `<div class="rep-card">
      <div class="t"><span>${esc(row.label)}</span><span class="${row.band.cls}">${row.band.txt}</span></div>
      <div class="acc" style="color:${row.band.color}">${row.pct}%</div>
      <div class="sub">${row.correct} / ${row.attempts} betul · ${row.sessions} sesi${row.latest != null ? ` · terkini ${row.latest}%` : ""}</div>
      <div class="bar"><i style="width:${row.pct}%;background:${row.band.color}"></i></div>
    </div>`).join("");

    const recent = r.recent.length
      ? `<h1 style="font-size:20px;margin:26px 0 10px">Kesilapan terkini</h1>
         <div class="rep-grid">${r.recent.map(m => `<div class="rep-card">
           <div class="t"><span>${esc(m.label)}</span><span class="sub">${esc(m.when)}</span></div>
           <div class="sub" style="margin-top:8px;line-height:1.5;color:var(--ink)">${esc(m.q)}</div>
           ${m.chosen ? `<div class="sub" style="color:#e2554d">Jawapan anak: <b>${esc(m.chosen)}</b></div>` : ""}
           ${m.answer ? `<div class="sub" style="color:#4ec46a">Jawapan betul: <b>${esc(m.answer)}</b></div>` : ""}
         </div>`).join("")}</div>`
      : "";

    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Menu</span><h2>📊 Laporan Ibu Bapa — ${esc(name)}</h2></div>
      <div class="page" style="max-width:900px;margin:0 auto">
        <div class="summary-box">${r.summary}</div>
        ${r.totalQ ? `
          <div class="row" style="justify-content:flex-start;gap:22px;margin:18px 0 6px">
            <div><div class="muted" style="font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase">Sesi</div><div style="font-family:Georgia,serif;font-size:26px;font-weight:800">${r.sessions}</div></div>
            <div><div class="muted" style="font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase">Soalan</div><div style="font-family:Georgia,serif;font-size:26px;font-weight:800">${r.totalQ}</div></div>
            <div><div class="muted" style="font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase">Ketepatan</div><div style="font-family:Georgia,serif;font-size:26px;font-weight:800">${r.overallPct}%</div></div>
          </div>
          <h1 style="font-size:20px;margin:18px 0 10px">Mengikut topik — paling lemah dahulu</h1>
          <div class="rep-grid">${cards}</div>
          ${recent}
        ` : `<div class="empty-note">Belum ada data. Selesaikan satu sesi dalam <b>Persediaan Peperiksaan</b>, kemudian kembali ke sini.</div>`}
        <div class="row" style="margin-top:22px">
          <button class="btn ghost" id="toExam">📚 Persediaan Peperiksaan</button>
          <button class="btn primary" id="toHist">📈 Sejarah &amp; Analisis</button>
        </div>
      </div>`;
    $("#bk").onclick = renderMenu;
    $("#toExam").onclick = renderExamPrep;
    $("#toHist").onclick = renderExamHistory;
  }

  /* ===================== MODAL PENGESAHAN ===================== */
  function showConfirm(title, body, okLabel, onOk) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="cf"><div class="modal">
        <h2>${esc(title)}</h2><p>${esc(body)}</p>
        <div class="row"><button class="btn ghost" id="cfNo">Batal</button><button class="btn primary" id="cfYes">${esc(okLabel)}</button></div>
      </div></div>`);
    $("#cfNo").onclick = () => $("#cf").remove();
    $("#cfYes").onclick = () => { $("#cf").remove(); onOk(); };
  }

  /* ===================== TUKAR PEMAIN ===================== */
  function renderProfileSelect() {
    const profiles = STORE.profilesList();
    const cards = profiles.map(p => {
      const sessions = ((p.exam && p.exam.history) || []).length;
      const avg = sessions
        ? Math.round(p.exam.history.reduce((a, b) => a + (b.pct || 0), 0) / sessions)
        : null;
      const isActive = STORE.state.activeProfileId === p.id;
      return `<div class="profile-card ${isActive ? "active" : ""}" data-pick="${p.id}">
        <div class="profile-mini">${ART.player("explore", p.gender)}</div>
        <div class="profile-name">${esc(p.name)}</div>
        <div class="profile-meta">📚 ${sessions} sesi${avg != null ? ` · ${avg}%` : ""}</div>
        <div class="profile-actions">
          <button class="btn ghost sm" data-edit="${p.id}">Ubah</button>
          ${profiles.length > 1 ? `<button class="btn ghost sm" data-delete="${p.id}">Padam</button>` : ""}
        </div>
      </div>`;
    }).join("");
    const accountEmail = (STORE.state.account || {}).email || "";
    screen().innerHTML = `
      <div class="topbar">
        ${STORE.active() ? `<span class="back" id="bk">← Menu</span>` : `<span class="muted" style="padding:4px 8px;font-size:12px">${esc(accountEmail || "Peranti ini")}</span>`}
        <h2>👥 Siapa yang bermain?</h2>
      </div>
      <div class="page" style="max-width:760px">
        <div class="lead">Pilih pemain atau tambah pemain baharu. Setiap pemain ada kemajuan dan laporan tersendiri.</div>
        <div class="profile-grid">
          ${cards}
          <div class="profile-card add" id="addNew">
            <div class="profile-avatar plus">+</div>
            <div class="profile-name">Tambah pemain</div>
            <div class="profile-meta">Cipta profil baharu</div>
          </div>
        </div>
      </div>`;
    if ($("#bk")) $("#bk").onclick = renderMenu;

    screen().querySelectorAll("[data-pick]").forEach(card => {
      card.onclick = (ev) => {
        if (ev.target.closest("button")) return;
        STORE.selectProfile(card.dataset.pick);
        renderMenu();
      };
    });
    screen().querySelectorAll("[data-edit]").forEach(b => {
      b.onclick = (ev) => {
        ev.stopPropagation();
        const id = b.dataset.edit;
        const cur = STORE.state.profiles[id]; if (!cur) return;
        editProfileModal("Ubah pemain", cur.name, cur.gender, (name, gender) => {
          if (name == null) return;
          STORE.updateProfile(id, { name, gender });
          renderProfileSelect();
        });
      };
    });
    screen().querySelectorAll("[data-delete]").forEach(b => {
      b.onclick = (ev) => {
        ev.stopPropagation();
        const id = b.dataset.delete;
        const cur = STORE.state.profiles[id];
        showConfirm("Padam " + ((cur && cur.name) || "pemain ini") + "?",
          "Semua sejarah latihan dan laporan pemain ini akan hilang. Akaun kekal.",
          "Padam", () => { STORE.deleteProfile(id); renderProfileSelect(); });
      };
    });
    $("#addNew").onclick = () => {
      editProfileModal("Tambah pemain", "", "boy", (name, gender) => {
        if (!name) return;
        STORE.createProfile(name, gender);
        renderMenu();
      });
    };
  }

  function editProfileModal(title, initialName, initialGender, onOk) {
    let gender = initialGender === "girl" ? "girl" : "boy";
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="pm"><div class="modal" style="max-width:480px">
        <h2>${esc(title)}</h2>
        <div class="field" style="margin-top:14px;text-align:left">
          <label>Nama pemain</label>
          <input id="pmInput" type="text" value="${esc(initialName || "")}" maxlength="24" placeholder="cth. Preston"/>
        </div>
        <div class="muted" style="font-size:13px;text-align:left;margin:6px 2px 8px">Pilih watak pengembara:</div>
        <div class="char-picker">
          <div class="char-card ${gender === "boy" ? "active" : ""}" data-g="boy">
            <div class="char-art">${ART.player("explore", "boy")}</div>
            <div class="char-label">Lelaki</div>
          </div>
          <div class="char-card ${gender === "girl" ? "active" : ""}" data-g="girl">
            <div class="char-art">${ART.player("explore", "girl")}</div>
            <div class="char-label">Perempuan</div>
          </div>
        </div>
        <div class="row" style="margin-top:14px"><button class="btn ghost" id="pmNo">Batal</button><button class="btn primary" id="pmYes">OK</button></div>
      </div></div>`);
    const inp = $("#pmInput"); inp.focus(); inp.select();
    document.querySelectorAll(".char-card").forEach(c => {
      c.onclick = () => {
        gender = c.dataset.g;
        document.querySelectorAll(".char-card").forEach(x => x.classList.toggle("active", x.dataset.g === gender));
      };
    });
    function done(val) { $("#pm").remove(); onOk(val, gender); }
    $("#pmNo").onclick = () => done(null);
    $("#pmYes").onclick = () => done(inp.value.trim());
    inp.onkeydown = (e) => { if (e.key === "Enter") done(inp.value.trim()); if (e.key === "Escape") done(null); };
  }

  /* ===================== PENGHALA ===================== */
  function route() {
    const needLogin = AUTH.configured ? !AUTH.user : !AUTH.session;
    if (needLogin) { renderAuth(); return; }
    const profiles = STORE.profilesList();
    if (profiles.length === 0) { renderProfileSelect(); return; }
    if (!STORE.active()) STORE.selectProfile(profiles[0].id);
    renderMenu();
  }

  window.UI = { route, renderMenu, toast };
})();
