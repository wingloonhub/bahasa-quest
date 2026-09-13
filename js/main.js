/* main.js — mulakan Bahasa Quest */
(function () {
  "use strict";
  STORE.init();                                  // muat cache tempatan (tetamu secara lalai)
  AUTH.onAuth(function () { UI.route(); });
  UI.route();                                    // lukis skrin pertama

  // Buka kunci Web Audio pada klik pertama (dasar pelayar).
  document.addEventListener("click", function once() {
    if (window.SOUND) SOUND.unlock();
    document.removeEventListener("click", once);
  }, { capture: true });

  // PWA — daftar service worker supaya boleh "Install" / "Add to Home Screen".
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js").catch(function (err) {
        console.warn("[PWA] pendaftaran service worker gagal:", err);
      });
    });
  }

  // ===== Butang "kembali" telefon — bergerak dalam aplikasi, bukan keluar =====
  (function () {
    var lastRootBackTs = 0;
    function pushState() { try { history.pushState({ app: true }, "", location.href); } catch (e) { } }
    pushState();

    window.addEventListener("popstate", function () {
      // 1. Ada modal terbuka? Tutup.
      var modal = document.querySelector(".overlay");
      if (modal) {
        pushState();
        var cancel = modal.querySelector("#cfNo, #pmNo");
        if (cancel) cancel.click(); else modal.remove();
        return;
      }
      // 2. Butang kembali pada bar atas.
      var bk = document.getElementById("bk");
      if (bk) { pushState(); bk.click(); return; }
      // 3. Skrin utama — tekan dua kali dalam 2 saat untuk keluar.
      var now = Date.now();
      if (now - lastRootBackTs < 2000) return;
      lastRootBackTs = now;
      pushState();
      if (window.UI && window.UI.toast) UI.toast("Tekan kembali sekali lagi untuk keluar", "");
    });
  })();
})();
