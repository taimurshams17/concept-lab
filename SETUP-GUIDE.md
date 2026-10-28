# ConceptLab setup guide

For the recommended GitHub + Netlify workflow, use [`NETLIFY-DEPLOY.md`](./NETLIFY-DEPLOY.md).

The live admin panel is served at `/admin/`. It lets authorized administrators edit website content, chapters, simulations, games, home-page sections, text, theme, settings, media, student-related views, and other supported content. Saved content is stored in Netlify Blobs and is available across production deploys.

First-time admin setup is protected by the `CONCEPTLAB_ADMIN_SETUP_KEY` environment variable. Set a long random secret in Netlify's runtime environment variables, deploy, then open `/admin/` and use the same secret in the one-time setup form. The first admin account is created only once; subsequent access uses its username and password.

Do not store secrets in source files or commit `.env` files to GitHub.
