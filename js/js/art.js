/* art.js — lukisan SVG ringkas untuk Bahasa Quest (pengembara harta karun).
   Hanya avatar pemain + hiasan kecil; watak pengembaraan akan ditambah
   bersama mod "Pilih Pengembaraan" nanti. */
(function () {
  "use strict";

  // Pengembara — topi kulit, jaket khaki, beg galas. gender: "lelaki" | "perempuan"
  function explorer(gender) {
    const girl = gender === "girl" || gender === "perempuan";
    const hair = girl
      ? '<path d="M22 30 q-7 16 -3 31 l6 -3 q-3 -14 2 -25 z" fill="#3a2514"/>' +
        '<path d="M58 30 q7 16 3 31 l-6 -3 q3 -14 -2 -25 z" fill="#3a2514"/>'
      : "";
    return `
<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="bqJacket" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a6a3c"/><stop offset="1" stop-color="#5d461f"/>
    </linearGradient>
    <linearGradient id="bqHat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7b5527"/><stop offset="1" stop-color="#4a3317"/>
    </linearGradient>
  </defs>
  <!-- badan -->
  <path d="M26 58 h28 q6 0 6 7 v28 q0 6 -6 6 h-28 q-6 0 -6 -6 v-28 q0 -7 6 -7 z" fill="url(#bqJacket)"/>
  <!-- tali beg galas -->
  <path d="M32 58 l6 42" stroke="#3c2a12" stroke-width="4" fill="none"/>
  <path d="M48 58 l-6 42" stroke="#3c2a12" stroke-width="4" fill="none"/>
  <!-- tangan -->
  <rect x="14" y="62" width="8" height="26" rx="4" fill="#6f5327"/>
  <rect x="58" y="62" width="8" height="26" rx="4" fill="#6f5327"/>
  <!-- obor kecil di tangan kanan -->
  <rect x="60" y="52" width="4" height="14" rx="2" fill="#4a3317"/>
  <path d="M62 52 q-6 -8 0 -14 q6 6 0 14 z" fill="#ffb545"/>
  <path d="M62 50 q-3 -5 0 -9 q3 4 0 9 z" fill="#fff0b8"/>
  ${hair}
  <!-- muka -->
  <circle cx="40" cy="40" r="15" fill="#e8b98d"/>
  <circle cx="35" cy="39" r="1.9" fill="#2b1a0c"/>
  <circle cx="45" cy="39" r="1.9" fill="#2b1a0c"/>
  <path d="M35 46 q5 4 10 0" stroke="#2b1a0c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <!-- topi pengembara -->
  <path d="M18 32 q22 -10 44 0 q2 3 -2 4 h-40 q-4 -1 -2 -4 z" fill="#6b4a22"/>
  <path d="M25 32 q3 -16 15 -16 q12 0 15 16 z" fill="#7a5527"/>
  <path d="M25 30 h30 v4 h-30 z" fill="#3f2b12"/>
</svg>`;
  }

  // Peti harta — dipakai pada skrin "akan datang" dan hiasan hasil latihan.
  function chest() {
    return `
<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M14 40 q46 -30 92 0 v6 h-92 z" fill="#7a5527"/>
  <rect x="14" y="46" width="92" height="34" rx="6" fill="#5d461f"/>
  <rect x="14" y="52" width="92" height="7" fill="#c9962b"/>
  <rect x="52" y="44" width="16" height="22" rx="3" fill="#e0a83a"/>
  <circle cx="60" cy="56" r="3.4" fill="#2b1a0c"/>
</svg>`;
  }

  window.ART = {
    player: function (_pose, gender) { return explorer(gender); },
    explorer,
    chest
  };
})();
