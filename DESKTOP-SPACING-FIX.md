# Desktop spacing correction — v10.2.8

This update fixes the CSS cascade conflict that made the previous desktop spacing patch appear unchanged. `main.css` uses the more specific `#app section` selector, so the earlier generic `section` rule could not reliably compact those sections. The updated `#app[data-page] section` rule now applies a compact 12–18px vertical padding on desktop.

The formula ribbon now uses a large desktop top gap of 160–210px and the footer is kept 18px below the ribbon. Mobile spacing remains unchanged. CSS query versions and the service-worker cache version were bumped to ensure updated styles are requested after deployment.

After replacing the repository files and pushing to GitHub, wait for Netlify's deployment to finish, then hard-refresh the site with Ctrl+Shift+R. If an installed PWA still shows old styling, close its window and reopen it after the deploy.
