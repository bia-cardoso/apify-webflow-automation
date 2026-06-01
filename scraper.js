import { chromium } from "playwright";
import fs from "fs";

const URL = "https://www.linkedin.com/company/loopfuture/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(URL, { waitUntil: "domcontentloaded" });

// wait for posts to load
await page.waitForTimeout(5000);

// grab post containers
const posts = await page.locator("div.feed-shared-update-v2").all();

const results = [];

for (const post of posts) {
  try {
    // CONTENT
    const content = await post.locator(".update-components-text").innerText().catch(() => "");

    // LINK
    const linkHandle = await post.locator("a.app-aware-link").first();
    const href = await linkHandle.getAttribute("href").catch(() => "");

    // IMAGE (optional)
    const img = await post.locator("img").first();
    const imgUrl = await img.getAttribute("src").catch(() => "");

    // DATE (often tricky → fallback to "unknown")
    const date = new Date().toISOString().split("T")[0];

    if (!content || !href) continue;

    results.push({
      content,
      linkedinUrl: href,
      postedAt: {
        date
      },
      postImages: imgUrl
        ? [{ url: imgUrl }]
        : []
    });
  } catch (e) {
    console.log("Skip post due to error");
  }
}

fs.writeFileSync("posts.json", JSON.stringify(results, null, 2));

console.log("Scraped posts:", results.length);

await browser.close();
