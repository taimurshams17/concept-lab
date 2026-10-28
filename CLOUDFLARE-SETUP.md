# ConceptLab on Cloudflare Pages — free-plan friendly setup

This build is prepared for **Cloudflare Pages + Pages Functions + D1 + R2**. Pages serves the public site, `functions/api/[[path]].js` handles `/api/*`, D1 stores editable content/student records, and R2 stores uploaded images. The Admin Panel is ConceptLab's `/admin/` page—not Cloudflare's account dashboard.

## One-time setup (do this before connecting GitHub)

1. Install Node.js 20+ on a computer, open a terminal in the `ConceptLab` project folder, and run `npm install`.
2. Sign in to Cloudflare from the terminal: `npx wrangler login`.
3. Create the D1 database: `npx wrangler d1 create conceptlab-db`. Copy the returned database ID into `wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`. Save this edit.
4. Create the image/media bucket: `npx wrangler r2 bucket create conceptlab-media`.
5. Apply the D1 schema: `npx wrangler d1 migrations apply conceptlab-db --remote`.

## Connect GitHub to Cloudflare Pages

6. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git** and authorize/select your GitHub repository.
7. Set the framework preset to **None**, build command to `npm run build`, and build output directory to `dist`. Set the root directory to `ConceptLab` only if that is a subfolder in your repository; if you uploaded the *contents* of the project folder at the repository root, leave root directory blank. Configure the build environment variable `NODE_VERSION` as `20` if Cloudflare does not pick it automatically.
8. The repository's `wrangler.jsonc` declares the production bindings: D1 variable name `DB` connected to `conceptlab-db`, and R2 variable name `MEDIA` connected to `conceptlab-media`. After the first deploy, open the Pages project **Settings → Bindings** and verify both bindings are shown. If not, add them with those exact names, save and redeploy. Configure Preview bindings only if you want preview deployments to use a database/bucket.
9. Wait for the first successful deployment, then open `https://YOUR-PROJECT.pages.dev/admin/`. Create the first administrator account and use a strong, unique password. Only the first successful setup can create the first admin account.

## Will every GitHub update cost credits?

Cloudflare Pages Free currently allows **500 builds per month**, one build at a time. Each push to GitHub that triggers deployment uses a build, but this is not Netlify's 300-credit-per-month system. Ordinary text/image edits saved inside ConceptLab's Admin Panel go directly to D1/R2, so they do not trigger a new build. See the official [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

## What the Admin Panel can edit

The existing Admin Panel supports the content structures already present in ConceptLab: site text, homepage sections, themes/colours, images/media, subjects, chapters/concepts, games, simulations, missions/rewards and related structured settings. Those supported content/image changes persist via D1/R2 without code deployment. A completely new type of feature or a change to underlying app logic still needs a code update and new deployment.

## Important notes

- A ZIP cannot connect your GitHub or Cloudflare accounts itself. You must connect GitHub and create/attach the D1 database and R2 bucket once.
- Netlify Blobs data does **not** automatically move to Cloudflare. Create the first admin account on Cloudflare. Existing student accounts/progress require a separate authenticated export/import if you need to retain them.
- The Cloudflare API version uses WebCrypto PBKDF2-SHA256 for newly created password hashes. Do not copy old Netlify password hash records directly into D1.
- D1 and R2 have free usage allowances/limits beyond the Pages build limit. See [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

## Student accounts, profile pictures, and admin count
- Student sign-up and sign-in use `/api/student-signup` and `/api/student-login`; student profile edits use `/api/student-profile`.
- The Admin Panel's Student Accounts section calls the protected `/api/student-stats` endpoint to show total registered accounts, names, email addresses, institutes, XP, and signup dates. Passwords are not returned.
- Profile images are currently stored as validated JPG/PNG/WebP data URLs in the student record (maximum upload size enforced by the API). For a larger production user base, move these to R2 and store only the object key in D1.
- Existing Netlify account records are not automatically imported. Test sign-up, sign-in, profile edits, profile image upload, and the Admin student count after configuring D1/R2.
