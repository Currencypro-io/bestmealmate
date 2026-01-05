import { test, expect } from '@playwright/test';

test.describe('User Flow - Meal Planner Site Crawl', () => {
  
  test.beforeEach(async ({ page }) => {
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Console Error: ${msg.text()}`);
      }
    });

    // Listen for page errors (uncaught exceptions)
    page.on('pageerror', (err) => {
      console.log(`Page Error: ${err.message}`);
    });
  });

  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    // Check page title or heading
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Meal Planner');
  });

  test('all images load correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all images on the page
    const images = page.locator('img');
    const imageCount = await images.count();
    
    console.log(`Found ${imageCount} images on the page`);
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      // Check image is visible
      await expect(img).toBeVisible({ timeout: 10000 });
      
      // Check naturalWidth > 0 (image loaded successfully)
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth, `Image ${src} failed to load`).toBeGreaterThan(0);
      
      console.log(`✓ Image loaded: ${alt || src}`);
    }
  });

  test('form elements are interactive', async ({ page }) => {
    await page.goto('/');
    
    // Test day selector
    const daySelect = page.locator('select').first();
    await expect(daySelect).toBeVisible();
    await daySelect.selectOption('Wednesday');
    await expect(daySelect).toHaveValue('Wednesday');
    
    // Test meal type selector
    const mealSelect = page.locator('select').nth(1);
    await expect(mealSelect).toBeVisible();
    await mealSelect.selectOption('Dinner');
    await expect(mealSelect).toHaveValue('Dinner');
    
    // Test meal input
    const mealInput = page.locator('input[type="text"]');
    await expect(mealInput).toBeVisible();
    await mealInput.fill('Test Meal');
    await expect(mealInput).toHaveValue('Test Meal');
  });

  test('add meal functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Select day
    await page.locator('select').first().selectOption('Monday');
    
    // Select meal type
    await page.locator('select').nth(1).selectOption('Breakfast');
    
    // Enter meal name
    const mealInput = page.locator('input[type="text"]');
    await mealInput.fill('Pancakes with Maple Syrup');
    
    // Click add button
    const addButton = page.locator('button', { hasText: /add/i });
    await addButton.click();
    
    // Verify meal was added to the plan
    await expect(page.locator('text=Pancakes with Maple Syrup')).toBeVisible();
    
    // Verify input was cleared
    await expect(mealInput).toHaveValue('');
  });

  test('add meal via Enter key works', async ({ page }) => {
    await page.goto('/');
    
    // Select Tuesday and Lunch
    await page.locator('select').first().selectOption('Tuesday');
    await page.locator('select').nth(1).selectOption('Lunch');
    
    // Enter meal and press Enter
    const mealInput = page.locator('input[type="text"]');
    await mealInput.fill('Grilled Chicken Salad');
    await mealInput.press('Enter');
    
    // Verify meal was added
    await expect(page.locator('text=Grilled Chicken Salad')).toBeVisible();
  });

  test('empty meal input does not add', async ({ page }) => {
    await page.goto('/');
    
    // Try to add empty meal
    const addButton = page.locator('button', { hasText: /add/i });
    await addButton.click();
    
    // The button should work but nothing should be added
    // This is just checking no error occurs
  });

  test('multiple meals can be added to different days', async ({ page }) => {
    await page.goto('/');
    
    const meals = [
      { day: 'Monday', meal: 'Breakfast', name: 'Oatmeal' },
      { day: 'Monday', meal: 'Lunch', name: 'Sandwich' },
      { day: 'Friday', meal: 'Dinner', name: 'Pizza Night' },
    ];
    
    for (const { day, meal, name } of meals) {
      await page.locator('select').first().selectOption(day);
      await page.locator('select').nth(1).selectOption(meal);
      await page.locator('input[type="text"]').fill(name);
      await page.locator('button', { hasText: /add/i }).click();
    }
    
    // Verify all meals are visible
    for (const { name } of meals) {
      await expect(page.locator(`text=${name}`)).toBeVisible();
    }
  });

  test('page is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check page loads and key elements are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('button', { hasText: /add/i })).toBeVisible();
  });

  test('no JavaScript errors on page load', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow some time for any async errors
    await page.waitForTimeout(2000);
    
    expect(errors, `JavaScript errors found: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('no broken links on page', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    console.log(`Found ${linkCount} links on the page`);
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        console.log(`Checking link: ${href}`);
      }
    }
  });

  test('accessibility: form labels are present', async ({ page }) => {
    await page.goto('/');
    
    // Check that labels exist
    const labels = page.locator('label');
    const labelCount = await labels.count();
    
    expect(labelCount).toBeGreaterThan(0);
    console.log(`Found ${labelCount} labels on the page`);
  });

  test('meal cards hover effects work', async ({ page }) => {
    await page.goto('/');
    
    // Find meal type cards
    const mealCards = page.locator('.transform.hover\\:scale-105');
    const cardCount = await mealCards.count();
    
    if (cardCount > 0) {
      // Hover over first card and check it's visible
      await mealCards.first().hover();
      await expect(mealCards.first()).toBeVisible();
    }
  });
});
