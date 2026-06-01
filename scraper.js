import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({
  headless: true
});

const page = await browser.newPage();

await page.goto(
  "https://www.linkedin.com/company/loopfuture/",
  { waitUntil: "networkidle" }
);

await page.screenshot({
  path: "linkedin.png",
  fullPage: true
});

fs.writeFileSync(
  "posts.json",
  JSON.stringify([], null, 2)
);

await browser.close();
