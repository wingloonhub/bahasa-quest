# Bahasa Quest 🗺️

A browser game for the **Year 3 Bahasa Melayu syllabus**, built on exactly the
same stack as *The Haunted English Mansion*: plain HTML/CSS/JavaScript, no build
step, GitHub → Vercel for hosting, Firebase for email login + cloud save.

What is in this first version:

| Screen | Status |
|---|---|
| Login / create account (email + password) | ✅ built |
| Switch Player (multiple kids under one account) | ✅ built |
| Parent Report | ✅ built |
| Exam Preparation → **Tahun 3 — Semester 2** | ✅ 9 topics + final challenge test wired up, question banks to be added |
| Exam Preparation → **History & Analysis** | ✅ built (best/worst/average, trend, weakest area, per-topic deep dive) |
| Choose Your Adventure (*Pilih Pengembaraan*) | 🔒 shows **Akan Datang** (coming soon) |

The whole interface is in Bahasa Melayu. The practice engine, scoring, session
recording and analysis screens are complete — the only thing missing is the
question content, so adding questions is all that's needed to go live.

---

## What to upload

Upload **the contents of this `game` folder only** (the folder with `index.html`).

```
game/
  index.html
  vercel.json
  firestore.rules
  manifest.webmanifest
  service-worker.js
  favicon.svg
  css/style.css
  icons/...
  js/...
```

---

## Step 1 — Put it on GitHub

1. Go to <https://github.com/new> and create a repository, e.g. `bahasa-quest`
   (Public or Private — both work with Vercel). Click **Create repository**.
2. On the new repo page click **uploading an existing file**.
3. Open the `game` folder on your PC, select **everything inside it**
   (`index.html`, the `css`, `js` and `icons` folders, etc.) and drag them into
   the GitHub upload box.
4. Click **Commit changes**.

## Step 2 — Firebase (email login + cloud save)

This game uses its **own** Firebase project, separate from the English game.

1. <https://console.firebase.google.com> → **Add project** (e.g. `bahasa-quest`).
   Google Analytics can be skipped.
2. **Authentication** → *Get started* → **Sign-in method** → enable
   **Email/Password** → Save.
3. **Build → Firestore Database** → *Create database* → **Start in production
   mode** → pick a location (asia-southeast1 is closest) → *Enable*.
4. Firestore → **Rules** tab → replace everything with the contents of
   `firestore.rules` (in this folder) → **Publish**.
5. **Project settings** (gear icon) → **Your apps** → click the **`</>`** (Web)
   icon → give it a nickname → **Register app**. Firebase shows a
   `firebaseConfig = { ... }` block.
6. Open `js/firebase-config.js` and paste the 6 values between the quotes
   (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
   Save.
7. Re-upload **`js/firebase-config.js`** to GitHub (open the file on GitHub →
   pencil icon → paste → Commit).

> Until Step 2 is done the app still runs, but it saves on one device only and
> there is no login (it shows a "Main pada peranti ini" button).

## Step 3 — Deploy on Vercel

1. <https://vercel.com> → **Add New… → Project**.
2. **Import** the repo from Step 1.
3. Leave everything default (Framework Preset: *Other*, no build command) →
   **Deploy**.
4. You get a live URL like `https://bahasa-quest.vercel.app`.

### One last Firebase setting (so login works on the live site)

Firebase console → **Authentication → Settings → Authorized domains → Add
domain** → paste the Vercel domain (e.g. `bahasa-quest.vercel.app`). Without
this, login is blocked on the live site.

## Step 4 — Play

Open the Vercel URL, create an account, add a player, then go to
**Persediaan Peperiksaan**. Sign in with the same email on a phone and the
player, sessions and Parent Report follow.

---

## Tahun 3 — Semester 2 topics (already wired up)

| Topic id (use this in the question bank) | Shown as | Session |
|---|---|---|
| `kosa_kata` | Kosa Kata | 15 questions |
| `kata_tanya` | Kata Tanya | 15 questions |
| `kata_pasif` | Kata Pasif | 15 questions |
| `kata_hubung` | Kata Hubung | 15 questions |
| `kata_arah` | Kata Arah | 15 questions |
| `kata_waktu` | Kata Waktu — adjektif waktu | 15 per session (80 loaded) |
| `kata_perintah` | Kata Perintah | 15 questions |
| `bina_ayat` | Bina Ayat | 15 questions |
| `penulisan` | Penulisan | 15 questions |
| `timbul_tenggelam` | Timbul atau Tenggelam | 15 questions |
| `ejaan` | Ejaan — **listen & spell** | 10 words (already filled in) |
| `cabaran_akhir` | 🏅 Ujian Cabaran Akhir | **8 questions from each of the 11 topics above (88 total)** |

The challenge test has no bank of its own — it draws from the eleven topic banks,
so it grows automatically as banks are filled in. Topics with no bank yet show
**Akan datang**, and the challenge landing screen lists which topics are ready.
After a challenge run, the results, History & Analysis and the topic deep-dive
all break the score down **per topic**, strongest → weakest.

## Adding the questions

One file: **`js/questions_exam.js`** — add a bank with the **same id** as the
topic:

```js
window.QUESTIONS_EXAM = {
  kosa_kata: [
    { q: "Pilih maksud perkataan 'rajin'.", options: ["malas","tekun","lambat","penat"], answer: 1, cat: "maksud" },
    { q: "Lengkapkan: Ayah ___ kereta ke pejabat.", options: ["memandu","memakan","membaca","menulis"], answer: 0, cat: "isi_tempat_kosong" }
  ],
  kata_tanya: [
    { q: "___ nama adik kamu?", options: ["Bila","Apakah","Siapakah","Mengapa"], answer: 2, cat: "orang" }
  ]
};
```

- `answer` is the **index** of the correct option (0-based). Options are
  shuffled at runtime, so the order here doesn't matter.
- `cat` is optional but recommended: it is what makes History & Analysis able to
  say *"most mistakes are in kata nama khas"*. Questions with no `cat` are
  grouped as "Umum".
- Put 40–80 questions per topic so a 15-question session rarely repeats.

### Spelling questions (listen & spell)

The **Ejaan** topic uses the second format — same mechanic as the English
game's spelling drill:

```js
{ spelling: true, word: "hadapan", hint: "Lawan bagi 'belakang'", cat: "kata_arah" }
```

The child taps **🔊 Dengar perkataan** to hear it (Web Speech API — a Malay
voice if the device has one, otherwise an Indonesian voice, which is close
enough for these words) and spells it on an **on-screen keyboard**, so the
phone's autocorrect strip can't help. If the device has no voice at all, the
word is shown instead so the drill still works. `hint` is optional; `alt: [...]`
accepts alternative spellings.

Already loaded: atas, bawah, luar, dalam, kiri, kanan, hadapan, belakang,
sebelah, tepi.
- To change how many questions a topic asks, add `sessionSize: 20` to that topic
  in `js/data.js`; to rename a `cat` code nicely, add
  `catLabels: { maksud: "Maksud perkataan" }` to the topic.

Re-upload the file to GitHub — Vercel redeploys automatically, and every
session recorded afterwards flows straight into History & Analysis and the
Parent Report.

## Where things live

| File | What it does |
|---|---|
| `js/data.js` | Sets, topics, and the (empty) adventure list |
| `js/questions_exam.js` | Question banks |
| `js/store.js` | Players, saves, session history (localStorage + Firestore) |
| `js/firebase.js` | Email login + cloud sync |
| `js/report.js` | Parent Report analytics |
| `js/ui.js` | Every screen |
| `js/art.js` | Explorer avatars + treasure chest artwork |
| `css/style.css` | The treasure-hunt theme (one palette at the top) |
