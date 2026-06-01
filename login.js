const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.linkedin.com/login');

  console.log("👉 Please log in manually...");

  // Wait until you're fully logged in
  await page.waitForURL('**/feed/**', { timeout: 0 });

  console.log("✅ Logged in!");

  await context.storageState({ path: 'storageState.json' });

  console.log("💾 Session saved to storageState.json");

  await browser.close();
})();
