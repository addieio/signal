/**
 * Signal Standalone CLI Scraper
 * Usage: node scripts/scrape.js
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function runScraper() {
  console.log("⚡ Signal All-India Multi-Platform Scraper Starting...");

  let devfolioCount = 0;
  let unstopCount = 0;
  let heCount = 0;

  // 1. Scrape Devfolio
  try {
    console.log("🌐 [1/3] Connecting to Devfolio Public Hackathons API...");
    const res = await fetch("https://api.devfolio.co/api/hackathons?page=1", {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      const list = data.result || [];
      devfolioCount = list.length;
      console.log(`✅ Devfolio: Fetched ${devfolioCount} live hackathons!`);
      list.slice(0, 3).forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.name} (${item.location || item.city || 'Pan-India'})`);
        if (item.cover_img) console.log(`      Banner: ${item.cover_img}`);
        console.log(`      URL: https://${item.slug}.devfolio.co`);
      });
    } else {
      console.warn("⚠️ Devfolio returned status:", res.status);
    }
  } catch (err) {
    console.error("❌ Devfolio scraping error:", err.message);
  }

  // 2. Scrape Unstop
  try {
    console.log("\n🌐 [2/3] Connecting to Unstop Opportunities API...");
    const res = await fetch("https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=1", {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      const list = data.data?.data || [];
      unstopCount = list.length;
      console.log(`✅ Unstop: Fetched ${unstopCount} live hackathons!`);
      list.slice(0, 3).forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.title} (${item.organisation?.name || 'Collegiate'})`);
        if (item.logoUrl2) console.log(`      Image: ${item.logoUrl2}`);
        console.log(`      URL: ${item.seo_url || 'https://unstop.com'}`);
      });
    } else {
      console.warn("⚠️ Unstop returned status:", res.status);
    }
  } catch (err) {
    console.error("❌ Unstop scraping error:", err.message);
  }

  // 3. Scrape HackerEarth
  try {
    console.log("\n🌐 [3/3] Connecting to HackerEarth API...");
    const res = await fetch("https://www.hackerearth.com/api/events/upcoming/", {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      const list = data.response || [];
      heCount = list.length;
      console.log(`✅ HackerEarth: Fetched ${heCount} developer hackathons!`);
      list.slice(0, 3).forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.title} (${item.url})`);
      });
    } else {
      console.warn("⚠️ HackerEarth returned status:", res.status);
    }
  } catch (err) {
    console.error("❌ HackerEarth scraping error:", err.message);
  }

  // 4. Test AI review synthesis
  if (API_KEY) {
    console.log(`\n🧠 Synthesizing Student Vibe Signals...`);
    try {
      const ai = new GoogleGenerativeAI(API_KEY);
      const model = ai.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `Synthesize 1 verified student review snippet for a college hackathon with Wi-Fi rating, mentor depth, and midnight food review in 1 sentence.`;
      const aiRes = await model.generateContent(prompt);
      console.log("✅ Synthesis Result:", aiRes.response.text().trim());
    } catch (err) {
      console.warn("⚠️ AI enrichment notice:", err.message);
    }
  }

  console.log("\n🎉 Nationwide Scraper Finished! Total hackathons indexed:", devfolioCount + unstopCount + heCount);
}

runScraper();
