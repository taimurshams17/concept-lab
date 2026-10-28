# Deploy ConceptLab with GitHub + Netlify

This project should use **Netlify** for the production deployment. Its admin API uses Netlify Functions and Netlify Blobs. A Vercel deployment is not plug-and-play because Vercel does not provide Netlify Blobs; changing hosts would require replacing the persistence adapter first.

## 1. Put the project on GitHub

1. Extract the project ZIP.
2. Open the inner `ConceptLab` folder. Upload the **contents of this folder** to the root of a new GitHub repository. The repository root must contain `package.json`, `netlify.toml`, `index.html`, `admin/`, `assets/`, and `netlify/functions/`.
3. Commit and push the files to the repository's `main` branch.
4. Confirm that `.gitignore` is present. Do not upload `.env` files, `node_modules/`, or `dist/`.

## 2. Create the Netlify site

1. Sign in to Netlify and choose **Add new site → Import an existing project**.
2. Connect GitHub and select the ConceptLab repository.
3. Use these settings (they are also defined in `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
   - Node.js version: `20`
4. Deploy the site. Netlify will install the dependency in `package.json`, build the static assets, and deploy the API function.

## 3. Configure the first admin setup key

Do this before creating the first admin account:

1. In Netlify, open the site's environment-variable settings.
2. Add a **runtime** environment variable named `CONCEPTLAB_ADMIN_SETUP_KEY`.
3. Set its value to a private random secret at least 24 characters long. Use a different value from your admin password. Do not put this value in a committed file or share it publicly.
4. Make sure the variable is available to the **Functions runtime** (not only the build process).
5. Trigger a new production deploy so the Functions runtime receives the variable.

If this variable is missing or too short, initial admin creation remains disabled. That is intentional: without it, the first visitor could otherwise claim the first admin account.

## 4. Create and access the admin panel

1. Open `https://YOUR-SITE-NAME.netlify.app/admin/`.
2. On the first visit, enter the setup key from Step 3, choose an admin username (3–30 letters/numbers/`_`/`.`/`-`) and password (at least 8 characters), then create the account.
3. After setup, future visits use the admin username and password. You no longer need the setup key to sign in.
4. Use **Team & Password** inside the admin panel to add another administrator or change your password.

The setup key is only for creating the first admin account. After the first admin exists, the API rejects further setup attempts.

## 5. Verify the deployment

Check these URLs:

- `https://YOUR-SITE-NAME.netlify.app/` — public website
- `https://YOUR-SITE-NAME.netlify.app/admin/` — admin sign-in/setup
- `https://YOUR-SITE-NAME.netlify.app/api/status` — should return JSON including `setup` and `setupReady`

After logging in, make a small admin content change and save it, refresh the public site, and confirm the change appears. Check that a student account can sign up and sign in if you plan to use account sync or the leaderboard.

## Data and safety notes

- Netlify Blobs is the persistent store for admin users, content, media, history, student accounts, and student sync data. Production data persists across deploys.
- The store is site-wide. Treat deploy previews as connected to shared site data; do not use preview builds to test destructive admin edits. Use production for the initial setup.
- Keep GitHub and Netlify access limited to trusted collaborators. Admin passwords and the setup key must remain private.
- The admin panel edits website content without a code deployment. New app features or design changes still need a commit and a Netlify build.
- Keep a backup before major admin content changes. The admin panel includes backup/version-history tools.

## Future updates

1. Make changes locally or in GitHub.
2. Commit and push to the production branch.
3. Netlify builds and publishes the update automatically.
4. Admin-edited site content remains in Netlify Blobs; the code deployment does not replace it.
