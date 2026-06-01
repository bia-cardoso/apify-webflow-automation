import { chromium } from "playwright";
import fs from "fs";

// Portuguese company page (public-facing)
const URL = "https://pt.linkedin.com/company/loopfuture";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(URL, { waitUntil: "domcontentloaded" });

// give LinkedIn time to hydrate content
await page.waitForTimeout(6000);

// scroll a bit to trigger lazy loading of posts
await page.evaluate(() => window.scrollBy(0, 1500));
await page.waitForTimeout(3000);

// grab post containers (same structure globally)
const posts = await page.locator("div.feed-shared-update-v2").all();

const results = [];

for (const post of posts) {
  try {
    // CONTENT
    const content = await post
      .locator(".update-components-text")
      .innerText()
      .catch(() => "");

    // POST LINK (fallback safe)
    const linkHandle = post.locator("a.app-aware-link").first();
    const href = await linkHandle.getAttribute("href").catch(() => "");

    // IMAGE (optional)
    const imgHandle = post.locator("img").first();
    const imgUrl = await imgHandle.getAttribute("src").catch(() => "");

    // DATE (LinkedIn DOM date parsing is unreliable without login)
    const date = new Date().toISOString().split("T")[0];

    if (!content || !href) continue;

    results.push({
      content,
      linkedinUrl: href,
      postedAt: {
        date
      },
      postImages: imgUrl ? [{ url: imgUrl }] : []
    });
  } catch (e) {
    console.log("Skip post due to error");
  }
}

fs.writeFileSync("posts.json", JSON.stringify(results, null, 2));

console.log("Scraped posts:", results.length);

await browser.close();
