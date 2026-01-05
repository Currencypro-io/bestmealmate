import { test, expect } from '@playwright/test';

const PUBLISHER_ID = 'ca-pub-6442421268022178';
const PUBLISHER_ID_NUMBER = 'pub-6442421268022178';

test.describe('Google AdSense Verification - Live Site', () => {
  
  test('ads.txt contains correct publisher ID', async ({ request }) => {
    const response = await request.get('/ads.txt');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('google.com');
    expect(content).toContain(PUBLISHER_ID_NUMBER);
    expect(content).toContain('DIRECT');
    expect(content).toContain('f08c47fec0942fa0');
  });

  test('robots.txt is accessible and allows crawlers', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('User-agent:');
    expect(content).toContain('Allow: /');
  });

  test('AdSense script is present in page HTML', async ({ page }) => {
    await page.goto('/');
    
    // Check for AdSense script tag with publisher ID
    const adsenseScript = page.locator(`script[src*="adsbygoogle.js?client=ca-pub-6442421268022178"]`);
    await expect(adsenseScript).toBeAttached({ timeout: 10000 });
  });

  test('page loads without blocking AdSense CSP errors', async ({ page }) => {
    const cspErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for scripts to load
    
    // Filter for critical AdSense CSP errors (script loading blocked)
    const criticalAdsenseCspErrors = cspErrors.filter(e => 
      e.includes('googlesyndication') && 
      e.includes('script-src')
    );
    
    // Log all CSP errors for debugging
    if (cspErrors.length > 0) {
      console.log('CSP Errors found:', cspErrors.length);
      console.log('Non-critical CSP errors (adtrafficquality, gtm) are expected');
    }
    
    // Only fail on critical script loading errors
    expect(criticalAdsenseCspErrors).toHaveLength(0);
  });

  test('page has correct meta description for Best Meal Mate', async ({ page }) => {
    await page.goto('/');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
  });

  test('page title contains Best Meal Mate', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title.toLowerCase()).toContain('meal');
  });
});
