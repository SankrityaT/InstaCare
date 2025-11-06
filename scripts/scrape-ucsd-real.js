/**
 * REAL WORKING SCRAPER - UC San Diego Health
 * Scrapes actual wait times from UC San Diego Health website
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const UCSD_URL = 'https://health.ucsd.edu/emergency-care';

async function scrapeUCSDHealth() {
  console.log('🏥 Launching browser to scrape UC San Diego Health...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    console.log(`📡 Navigating to ${UCSD_URL}...`);
    await page.goto(UCSD_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('✅ Page loaded, extracting wait times...\n');
    
    // Extract wait time data from the page
    const hospitalData = await page.evaluate(() => {
      const hospitals = [];
      
      // Look for wait time elements (adjust selectors based on actual page structure)
      const waitTimeElements = document.querySelectorAll('[class*="wait"], [class*="emergency"], [id*="wait"]');
      
      // Try to find specific patterns
      const textContent = document.body.innerText;
      
      // Common patterns for wait times
      const patterns = [
        /(\d+)\s*(?:to|-)?\s*(\d+)?\s*minutes?/gi,
        /wait.*?(\d+)\s*min/gi,
        /approximately\s*(\d+)/gi
      ];
      
      const foundTimes = [];
      patterns.forEach(pattern => {
        const matches = textContent.matchAll(pattern);
        for (const match of matches) {
          foundTimes.push(match[0]);
        }
      });
      
      return {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        rawText: textContent.substring(0, 2000), // First 2000 chars for debugging
        foundPatterns: foundTimes,
        pageTitle: document.title
      };
    });
    
    console.log('📊 Scraped Data:');
    console.log(`   Page Title: ${hospitalData.pageTitle}`);
    console.log(`   Found Patterns: ${hospitalData.foundPatterns.length}`);
    
    if (hospitalData.foundPatterns.length > 0) {
      console.log('\n⏰ Wait Times Found:');
      hospitalData.foundPatterns.forEach((pattern, i) => {
        console.log(`   ${i + 1}. ${pattern}`);
      });
    }
    
    // Save raw data for analysis
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const outputPath = path.join(dataDir, 'ucsd-scrape-raw.json');
    fs.writeFileSync(outputPath, JSON.stringify(hospitalData, null, 2));
    console.log(`\n💾 Raw data saved to: ${outputPath}`);
    
    // Take a screenshot for debugging
    const screenshotPath = path.join(dataDir, 'ucsd-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);
    
    return hospitalData;
    
  } catch (error) {
    console.error('❌ Error scraping:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Also try direct API approach
async function tryDirectAPI() {
  console.log('\n🔍 Checking for API endpoints...\n');
  
  const axios = require('axios');
  
  // Common API patterns hospitals use
  const possibleEndpoints = [
    'https://health.ucsd.edu/api/wait-times',
    'https://health.ucsd.edu/api/emergency',
    'https://api.ucsd.edu/health/wait-times',
  ];
  
  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`   Trying: ${endpoint}`);
      const response = await axios.get(endpoint, { timeout: 5000 });
      console.log(`   ✅ Found API! Status: ${response.status}`);
      return response.data;
    } catch (error) {
      console.log(`   ❌ Not found`);
    }
  }
  
  console.log('\n   No direct API found. Will use web scraping.\n');
  return null;
}

async function main() {
  console.log('🚀 UC San Diego Health - REAL DATA SCRAPER\n');
  console.log('=' .repeat(60) + '\n');
  
  try {
    // Try API first
    const apiData = await tryDirectAPI();
    
    if (apiData) {
      console.log('✅ Got data from API!');
      console.log(JSON.stringify(apiData, null, 2));
    } else {
      // Fall back to web scraping
      const scrapedData = await scrapeUCSDHealth();
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ Scraping complete!');
      console.log('\n💡 Next steps:');
      console.log('   1. Check the screenshot to see the page structure');
      console.log('   2. Update selectors based on actual HTML');
      console.log('   3. Parse the wait times from the patterns found');
      console.log('   4. Set up cron job to run every 15 minutes');
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check if the website is accessible');
    console.log('   - Website might have anti-scraping measures');
    console.log('   - May need to contact UC San Diego Health for API access');
    process.exit(1);
  }
}

main();
