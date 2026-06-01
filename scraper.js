import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const url = "https://www.linkedin.com/company/loopfuture/";

await page.goto(url, { waitUntil: "domcontentloaded" });

await page.waitForTimeout(5000);

// 🔥 DEBUG 1: HTML snapshot
const html = await page.content();
fs.writeFileSync("debug.html", html);

// 🔥 DEBUG 2: visible text
const text = await page.locator("body").innerText().catch(() => "");
console.log("===== PAGE TEXT PREVIEW =====");
console.log(text.slice(0, 2000));
console.log("============================");

// 🔥 DEBUG 3: post count attempt
const posts = await page.locator("div").all();
console.log("Total divs found:", posts.length);

await browser.close();
