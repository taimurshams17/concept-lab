# Setup guide (simple)

The admin panel needs a small server part, so the site must be deployed **from GitHub**.
Dragging the `dist` folder onto Netlify will show the website but the admin panel will NOT work.

## Step 1: GitHub
1. Unzip `concept-lab.zip`. Open the `concept-lab` folder.
2. On GitHub open your repository (or make a new one).
3. Delete the old files if there are any (open each, click the bin icon, commit).
4. Click **Add file > Upload files**.
5. Drag **everything inside** `concept-lab` (not the folder itself). You must see `index.html`, `admin`, `netlify` and `package.json` at the top level of the repo.
6. Click **Commit changes**.

## Step 2: Netlify
1. Netlify > **Add new site > Import an existing project > GitHub** and pick the repo.
2. Leave the settings as they are (they are read from `netlify.toml`). Click **Deploy**.
3. If you already have a site connected to this repo, just wait: it redeploys by itself.
4. Wait until the deploy says **Published** (about 1 to 2 minutes).

## Step 3: Create your admin account (do this right away)
1. Open `https://YOUR-SITE.netlify.app/admin/`
2. The first time, you see **Create admin account**. Choose a username and a password (8+ characters).
3. Go to **Team & Password** and add your friend's username and password. Share it with them privately.

## Using the admin panel
- **Home Page**: change the title, intro and purpose text.
- **Chapters**: add a chapter, set status to **Available**, write the hook, intuition and quiz questions, pick a simulation.
- **Theme / Colors**, **Website Settings**: colours, site name, footer, about.
- Press **Save changes**. The website updates immediately. No new deploy needed.

## Notes
- Content is saved in Netlify Blobs. If you re-deploy, your saved content stays.
- Forgot the password? Netlify > Blobs > store `conceptlab` > delete the key `users`. Then open `/admin/` and create a new account.
- Simulations available: straight line graph, force and motion, flame test. New kinds of simulation need code.
- Only the first person to open `/admin/` after deploy can create the account, so do Step 3 immediately.

## New in this version
- **All Texts**: every menu, heading, button and paragraph on the site is editable.
- **Images / Media**: upload pictures once, then pick them for the logo, home picture, about page, chapter covers and content blocks.
- **Subjects**: add or rename subjects (Biology, ICT, ...).
- **Chapters**: cover image, extra content blocks (heading, paragraph, image, YouTube video, note), reference note, and a "Custom" simulation where you paste your own HTML/JS.

## New in version 3 (black theme, games, simulations)
- **Home Page**: edit the hero, then show / hide / reorder / edit / delete / add sections (goals "What we want to do", roadmap, FAQ, ticker, numbers, call to action and more).
- **Games (Arcade)**: 8 game types (Quiz Blitz, Formula Memory, True/False, Word Scramble, Balance the Equation, Projectile Cannon, Slope Sniper, Flame Detective). Edit their questions, pairs, words, equations and XP, or add more games.
- **Simulations (Lab)**: 14 simulations. Edit titles, descriptions and the "Try this" challenge, hide or reorder them. Pick any simulation inside a chapter.
- **XP & Badges**: set XP rules, level size and edit the badges.
- **Theme / Colors**: black background, sky-blue accent and bottom glow colours, and an on/off switch for the animated background.
- **Already saved content before this update?** Open **Chapters** and press **Add missing starter chapters** to get 7 new ready-made lessons (matrices, vectors, circles, trigonometry, differentiation, periodic motion, ideal gas). In **Simulations** press **Add missing simulations**. Then press Save changes.


## Student accounts and leaderboard (v5)
- In Admin Panel, open **Students & Accounts** to see the total number of registered students, their display names, email addresses, XP and signup dates. Student passwords are never shown.
- Student signup and sign-in require the deployed Netlify function and Netlify Blobs store; a static-only upload does not support accounts or shared rankings.
- The public Leaderboard sorts student accounts by XP saved on the server. XP that exists only in a browser's local storage is intentionally not included until the student signs in and earns/syncs XP.
- Content structure is **Subject → Chapter → Concept → four stages per concept**. Use **+ Add chapter** to create a chapter with its first concept, then **+ Add concept** on that chapter to add more concepts.
