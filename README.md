# THE GIFT UNASKED
*A Philosophical Dialogue Between Dust and Doctrine* — David Oyetayo

Static site: HTML + CSS + vanilla JS. No build step, no backend, no dependencies (only Google Fonts, with serif/sans fallbacks).
Open `index.html` directly, or deploy to GitHub Pages.

## 1. Where the eight images go
Put them in `assets/images/`. By default the site looks for `scene-01.jpg` … `scene-08.jpg`.
Use landscape JPG/WebP, ~1920px wide, compressed under ~400 KB each. If a file is missing, that chapter simply falls back to the star field.

## 2. Renaming / reassigning images
Edit `js/config.js`:
- `images` is the list of the eight filenames (story order).
- `chapterImage` says which image (1–8) sits behind each of the 12 chapters, e.g. `[1,2,3,3,4,5,5,6,7,7,8,8]`.

Also replace `assets/images/og-preview.jpg` (1200×630) with your best image for social previews.

## 3. GitHub Pages
1. Create a repo, push this folder to the `main` branch.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) publishes on every push. Your URL: `https://USERNAME.github.io/REPO/`.
4. In `index.html`, replace `YOUR-USERNAME.github.io/YOUR-REPO` in the four `og:` / `twitter:` URLs with your real address so link previews work.

## 4. Browser voices
Narration uses the browser's built-in voices (Web Speech API). Click **Voice** in the reading bar to choose a voice for each character; choices are remembered locally.
To change defaults, edit `voiceHints` (name fragments tried in order) and `voices` (rate, pitch) in `js/config.js`. Available voices differ by device; Chrome, Edge and Safari have the best selection.

## 5. Optional background audio
Drop files in `assets/audio/` named as in `js/config.js`: `ambient-wind.mp3`, `ambient-room.mp3`, `ambient-low.mp3`, `page-turn.mp3` (any names work if you edit the config). Sound never autoplays; the visitor taps the wave icon. With no files, a very quiet synthesised room tone is used.

## 6. Editing the dialogue
All text lives in `js/dialogue.js`, inside `GU.manuscript`.
- `THE POET` / `THE THEOLOGIAN` on their own line begin a speech; a blank line separates stanzas.
- `@4` starts chapter 4 at the next speech; chapter names are in `GU.chapters`.
- `>>ask` before a speech inserts "You may answer before they do".
- `~line` = emphasis; `!line` = the stanza appears alone for a few seconds first.
Scripture panels are in `js/interactions.js` (`GU.refs`). Each has `at: [...]` phrases (lower-case) that make its chip appear beside matching speeches.

## Controls
→ / Space / tap: next · ←: previous · Esc: close panels · Chapters menu: jump anywhere.
