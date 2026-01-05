'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { fetchMealPlans, saveMeal, removeMeal as removeMealFromDB, syncMealPlan } from '@/lib/meal-service';

// Dynamically import FoodScanner to avoid SSR issues with camera
const FoodScanner = dynamic(() => import('@/components/FoodScanner'), { ssr: false });

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

// Recipe database with images, ingredients, instructions, nutrition, and detailed guides
const RECIPES: Record<string, {
  name: string;
  image: string;
  time: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  ingredients: { item: string; amount: string; calories: number; buyingTip: string }[];
  prepSteps: string[];
  cookingSteps: string[];
  instructions: string[];
  nutritionBreakdown: { protein: number; carbs: number; fat: number; fiber: number };
}> = {
  'Avocado Toast': {
    name: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
    time: '10 min',
    prepTime: '5 min',
    cookTime: '5 min',
    servings: 2,
    calories: 320,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Quick', 'Healthy'],
    ingredients: [
      { item: 'Sourdough bread', amount: '2 slices', calories: 140, buyingTip: 'Choose artisan bakery bread for best texture, look for crusty exterior' },
      { item: 'Ripe avocado', amount: '1 large', calories: 120, buyingTip: 'Press gently - should yield slightly. Dark green/black skin indicates ripeness' },
      { item: 'Extra virgin olive oil', amount: '1 tbsp', calories: 40, buyingTip: 'Look for cold-pressed, dark bottle to preserve freshness' },
      { item: 'Sea salt', amount: '1/4 tsp', calories: 0, buyingTip: 'Flaky sea salt adds texture and flavor burst' },
      { item: 'Black pepper', amount: 'To taste', calories: 0, buyingTip: 'Freshly ground is more aromatic than pre-ground' },
      { item: 'Red pepper flakes', amount: '1/4 tsp', calories: 2, buyingTip: 'Korean gochugaru adds smoky depth if available' },
      { item: 'Cherry tomatoes', amount: '6-8', calories: 18, buyingTip: 'Look for firm, bright red tomatoes on the vine for best flavor' }
    ],
    prepSteps: [
      'Wash cherry tomatoes and pat dry',
      'Cut avocado in half, remove pit, scoop flesh into bowl',
      'Slice cherry tomatoes in half',
      'Gather all seasonings and olive oil'
    ],
    cookingSteps: [
      'Toast bread in toaster or under broiler until golden brown (2-3 min)',
      'While warm, drizzle each slice with olive oil',
      'Mash avocado with fork to desired consistency (chunky or smooth)',
      'Season mashed avocado with salt and pepper',
      'Spread avocado generously on warm toast',
      'Top with halved cherry tomatoes',
      'Finish with red pepper flakes and extra sea salt'
    ],
    instructions: ['Toast bread until golden', 'Mash avocado with fork', 'Add olive oil, salt, pepper', 'Spread on toast', 'Top with egg or tomatoes'],
    nutritionBreakdown: { protein: 6, carbs: 28, fat: 22, fiber: 8 }
  },
  'Overnight Oats': {
    name: 'Overnight Oats',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=600&fit=crop&q=80',
    time: '5 min prep',
    prepTime: '5 min',
    cookTime: '0 min (overnight rest)',
    servings: 1,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Meal Prep', 'No Cook'],
    ingredients: [
      { item: 'Rolled oats', amount: '1/2 cup', calories: 150, buyingTip: 'Use old-fashioned rolled oats, not instant - they hold texture better' },
      { item: 'Milk', amount: '1/2 cup', calories: 60, buyingTip: 'Any milk works - dairy, almond, oat. Oat milk makes it extra creamy' },
      { item: 'Greek yogurt', amount: '1/4 cup', calories: 35, buyingTip: 'Full-fat plain Greek yogurt adds creaminess and protein' },
      { item: 'Chia seeds', amount: '1 tbsp', calories: 60, buyingTip: 'Black or white chia both work. Store in cool, dark place' },
      { item: 'Honey', amount: '1 tbsp', calories: 60, buyingTip: 'Raw local honey has more nutrients. Maple syrup is a vegan alternative' },
      { item: 'Fresh berries', amount: '1/4 cup', calories: 15, buyingTip: 'Blueberries, raspberries, or strawberries. Frozen work great too' }
    ],
    prepSteps: [
      'Get a mason jar or container with lid (16oz works perfectly)',
      'Measure out all dry ingredients',
      'Wash fresh berries if using',
      'Have your container ready by the fridge'
    ],
    cookingSteps: [
      'Add rolled oats to jar',
      'Pour in milk and stir',
      'Add Greek yogurt and mix well',
      'Sprinkle in chia seeds and stir to distribute',
      'Drizzle honey and give final stir',
      'Seal jar and refrigerate overnight (at least 6 hours)',
      'In morning, stir and top with fresh berries',
      'Eat cold or microwave 1-2 min if you prefer warm'
    ],
    instructions: ['Mix oats, milk, yogurt in jar', 'Add chia seeds and honey', 'Refrigerate overnight', 'Top with fresh berries', 'Enjoy cold or warm'],
    nutritionBreakdown: { protein: 14, carbs: 52, fat: 10, fiber: 8 }
  },
  'Veggie Omelet': {
    name: 'Veggie Omelet',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop&q=80',
    time: '15 min',
    prepTime: '8 min',
    cookTime: '7 min',
    servings: 1,
    calories: 290,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'High Protein', 'Keto'],
    ingredients: [
      { item: 'Large eggs', amount: '3', calories: 210, buyingTip: 'Free-range or pasture-raised have richer yolks and better flavor' },
      { item: 'Bell peppers', amount: '1/4 cup diced', calories: 8, buyingTip: 'Mix colors for visual appeal - red and yellow are sweeter than green' },
      { item: 'Yellow onion', amount: '1/4 cup diced', calories: 10, buyingTip: 'Look for firm onions with dry, papery skin and no sprouting' },
      { item: 'Shredded cheese', amount: '2 tbsp', calories: 45, buyingTip: 'Cheddar, Swiss, or goat cheese work great. Shred fresh for best melt' },
      { item: 'Butter', amount: '1 tbsp', calories: 100, buyingTip: 'Unsalted butter gives you control over seasoning' },
      { item: 'Salt & pepper', amount: 'To taste', calories: 0, buyingTip: 'Season eggs before cooking for even distribution' },
      { item: 'Fresh herbs', amount: '1 tbsp', calories: 2, buyingTip: 'Chives, parsley, or dill add freshness. Use whatever is on hand' }
    ],
    prepSteps: [
      'Dice bell peppers into small, uniform pieces',
      'Dice onion finely (smaller cooks faster)',
      'Crack eggs into bowl and whisk until uniform yellow',
      'Season eggs with salt and pepper',
      'Shred cheese if using block',
      'Chop fresh herbs',
      'Have all ingredients within reach of stove'
    ],
    cookingSteps: [
      'Heat non-stick pan over medium heat',
      'Add half the butter, let it melt and foam',
      'Sauté peppers and onions 2-3 min until softened',
      'Remove veggies to plate, wipe pan clean',
      'Add remaining butter to pan over medium-low heat',
      'Pour in beaten eggs, let set 30 seconds',
      'Gently push edges toward center, tilting pan to let raw egg flow',
      'When mostly set but still slightly wet on top, add cheese and veggies to one half',
      'Fold omelet in half, slide onto plate',
      'Garnish with fresh herbs'
    ],
    instructions: ['Whisk eggs with salt & pepper', 'Sauté vegetables in butter', 'Pour eggs over veggies', 'Cook until set, fold in half', 'Top with cheese'],
    nutritionBreakdown: { protein: 21, carbs: 4, fat: 22, fiber: 1 }
  },
  'Smoothie Bowl': {
    name: 'Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop&q=80',
    time: '10 min',
    prepTime: '5 min',
    cookTime: '5 min (blending)',
    servings: 1,
    calories: 350,
    difficulty: 'Easy',
    tags: ['Vegan', 'Gluten-Free', 'Refreshing'],
    ingredients: [
      { item: 'Frozen banana', amount: '1 large', calories: 105, buyingTip: 'Peel ripe bananas, break into chunks, freeze in bags. Riper = sweeter' },
      { item: 'Frozen mixed berries', amount: '1/2 cup', calories: 35, buyingTip: 'Buy frozen bags - more economical and already frozen at peak ripeness' },
      { item: 'Almond milk', amount: '1/4 cup', calories: 8, buyingTip: 'Unsweetened works best. Use less for thicker bowl consistency' },
      { item: 'Granola', amount: '1/4 cup', calories: 120, buyingTip: 'Look for low-sugar varieties or make your own with oats and honey' },
      { item: 'Sliced fresh fruits', amount: '1/4 cup', calories: 30, buyingTip: 'Kiwi, strawberries, banana slices - whatever is in season' },
      { item: 'Chia seeds', amount: '1 tsp', calories: 20, buyingTip: 'Small amount adds omega-3s and creates nice texture' },
      { item: 'Coconut flakes', amount: '1 tbsp', calories: 35, buyingTip: 'Unsweetened coconut chips add tropical flavor and crunch' }
    ],
    prepSteps: [
      'Ensure frozen fruits are solid (not thawed)',
      'Slice fresh fruits for topping',
      'Measure out all toppings into small bowls',
      'Get your favorite bowl ready (wide, shallow works best)'
    ],
    cookingSteps: [
      'Add frozen banana chunks to blender',
      'Add frozen berries on top',
      'Pour in almond milk (start with less, add more if needed)',
      'Blend on high, using tamper to push fruit down',
      'Blend until thick and creamy - should be thicker than smoothie',
      'Pour into bowl immediately (melts fast!)',
      'Arrange granola in a stripe across top',
      'Add fresh fruit slices in rows',
      'Sprinkle chia seeds and coconut flakes',
      'Eat immediately with a spoon'
    ],
    instructions: ['Blend banana & berries with milk', 'Pour into bowl (thick consistency)', 'Top with granola', 'Add sliced fruits', 'Sprinkle seeds & coconut'],
    nutritionBreakdown: { protein: 6, carbs: 58, fat: 12, fiber: 9 }
  },
  'Pancakes': {
    name: 'Fluffy Pancakes',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80',
    time: '20 min',
    prepTime: '8 min',
    cookTime: '12 min',
    servings: 4,
    calories: 420,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Family Favorite', 'Weekend'],
    ingredients: [
      { item: 'All-purpose flour', amount: '1.5 cups', calories: 220, buyingTip: 'Unbleached flour gives slightly better flavor. Sift for fluffier results' },
      { item: 'Granulated sugar', amount: '2 tbsp', calories: 50, buyingTip: 'White sugar works best. Can reduce to 1 tbsp for less sweet' },
      { item: 'Baking powder', amount: '2 tsp', calories: 5, buyingTip: 'Check expiration - old baking powder won\'t rise properly' },
      { item: 'Whole milk', amount: '1 cup', calories: 150, buyingTip: 'Room temperature milk mixes better. Buttermilk makes tangier pancakes' },
      { item: 'Large egg', amount: '1', calories: 70, buyingTip: 'Room temperature egg incorporates better into batter' },
      { item: 'Melted butter', amount: '3 tbsp', calories: 300, buyingTip: 'Unsalted butter preferred. Melt and let cool slightly before adding' },
      { item: 'Pure maple syrup', amount: 'For serving', calories: 105, buyingTip: 'Real maple syrup (Grade A) is worth it vs pancake syrup' }
    ],
    prepSteps: [
      'Take eggs and milk out of fridge 20 min early',
      'Melt butter in microwave or small pan, set aside to cool',
      'Get griddle or large pan ready',
      'Measure all dry ingredients',
      'Set out plates and maple syrup for serving'
    ],
    cookingSteps: [
      'In large bowl, whisk flour, sugar, baking powder, and pinch of salt',
      'Make a well in center of dry ingredients',
      'In separate bowl, whisk milk, egg, and cooled melted butter',
      'Pour wet ingredients into well of dry ingredients',
      'Stir gently until just combined - lumps are okay! Overmixing = tough pancakes',
      'Heat griddle to 350°F or pan over medium heat',
      'Lightly butter the cooking surface',
      'Pour 1/4 cup batter per pancake',
      'Cook until bubbles form on surface and edges look set (2-3 min)',
      'Flip and cook until golden brown underneath (1-2 min)',
      'Keep warm in 200°F oven while cooking remaining batter',
      'Serve stacked with butter and maple syrup'
    ],
    instructions: ['Mix dry ingredients', 'Whisk wet ingredients separately', 'Combine until just mixed', 'Cook on griddle until bubbles form', 'Flip and cook golden'],
    nutritionBreakdown: { protein: 9, carbs: 52, fat: 18, fiber: 1 }
  },
  'Quinoa Salad': {
    name: 'Mediterranean Quinoa Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    time: '25 min',
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 4,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Vegan', 'Gluten-Free', 'Meal Prep'],
    ingredients: [
      { item: 'Quinoa', amount: '1 cup dry', calories: 220, buyingTip: 'Pre-rinsed quinoa saves time. White, red, or tri-color all work' },
      { item: 'English cucumber', amount: '1 medium', calories: 16, buyingTip: 'English cucumbers have fewer seeds. No need to peel' },
      { item: 'Cherry tomatoes', amount: '1 cup', calories: 27, buyingTip: 'Grape tomatoes work too. Look for firm, bright colored ones' },
      { item: 'Red onion', amount: '1/4 medium', calories: 11, buyingTip: 'Soak sliced onion in cold water 10 min to mellow sharpness' },
      { item: 'Feta cheese', amount: '1/2 cup crumbled', calories: 100, buyingTip: 'Block feta crumbled fresh tastes better than pre-crumbled' },
      { item: 'Kalamata olives', amount: '1/3 cup', calories: 45, buyingTip: 'Buy pitted for convenience. Brine-packed has best flavor' },
      { item: 'Lemon', amount: '1 large', calories: 5, buyingTip: 'Roll on counter before juicing to get more juice' },
      { item: 'Extra virgin olive oil', amount: '3 tbsp', calories: 120, buyingTip: 'Good quality oil makes a difference in this simple dressing' }
    ],
    prepSteps: [
      'Rinse quinoa in fine mesh strainer if not pre-rinsed',
      'Dice cucumber into 1/2 inch pieces',
      'Halve cherry tomatoes',
      'Thinly slice red onion, soak in cold water',
      'Pit and halve olives if not pre-pitted',
      'Juice lemon, whisk with olive oil, salt and pepper for dressing',
      'Crumble feta cheese'
    ],
    cookingSteps: [
      'Bring 2 cups water to boil with pinch of salt',
      'Add quinoa, reduce heat to low, cover',
      'Simmer 15 minutes until water is absorbed',
      'Remove from heat, fluff with fork',
      'Spread on sheet pan to cool quickly (5 min)',
      'Transfer cooled quinoa to large bowl',
      'Add cucumber, tomatoes, drained onion, and olives',
      'Pour dressing over and toss well',
      'Gently fold in feta cheese',
      'Season with salt and pepper to taste',
      'Can serve immediately or refrigerate up to 4 days'
    ],
    instructions: ['Cook quinoa per package', 'Chop all vegetables', 'Let quinoa cool', 'Mix all ingredients', 'Dress with vinaigrette'],
    nutritionBreakdown: { protein: 12, carbs: 38, fat: 18, fiber: 5 }
  },
  'Grilled Chicken Wrap': {
    name: 'Grilled Chicken Wrap',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop&q=80',
    time: '20 min',
    prepTime: '10 min',
    cookTime: '10 min',
    servings: 2,
    calories: 450,
    difficulty: 'Medium',
    tags: ['High Protein', 'Quick', 'Portable'],
    ingredients: [
      { item: 'Chicken breasts', amount: '2 (6 oz each)', calories: 280, buyingTip: 'Look for uniform thickness or pound to even. Fresh > frozen for grilling' },
      { item: 'Large flour tortillas', amount: '2 (10-inch)', calories: 180, buyingTip: 'Burrito-size tortillas. Warm them for easier rolling' },
      { item: 'Romaine lettuce', amount: '2 cups shredded', calories: 10, buyingTip: 'Romaine adds crunch. Iceberg works too but less nutritious' },
      { item: 'Roma tomatoes', amount: '2 medium', calories: 22, buyingTip: 'Roma tomatoes have less liquid, preventing soggy wraps' },
      { item: 'Greek yogurt', amount: '1/4 cup', calories: 35, buyingTip: 'Full-fat plain Greek yogurt. Mix with garlic for sauce' },
      { item: 'Ripe avocado', amount: '1', calories: 160, buyingTip: 'Should yield to gentle pressure. Slice just before assembling' },
      { item: 'Red onion', amount: '1/4 medium', calories: 11, buyingTip: 'Slice thin for milder flavor in wrap' }
    ],
    prepSteps: [
      'Pound chicken breasts to even 1/2 inch thickness',
      'Season chicken with salt, pepper, garlic powder, paprika',
      'Let chicken sit 10 min at room temp before grilling',
      'Shred lettuce into thin strips',
      'Dice tomatoes, removing excess seeds',
      'Thinly slice red onion',
      'Mix Greek yogurt with minced garlic, lemon juice, salt for sauce',
      'Slice avocado just before assembly'
    ],
    cookingSteps: [
      'Preheat grill or grill pan to medium-high heat',
      'Oil grates or pan lightly',
      'Grill chicken 4-5 minutes per side until internal temp reaches 165°F',
      'Let chicken rest 5 minutes before slicing',
      'Slice chicken into strips against the grain',
      'Warm tortillas in dry pan 30 seconds per side',
      'Spread yogurt sauce down center of each tortilla',
      'Layer lettuce, then chicken strips',
      'Add tomatoes, avocado slices, and onion',
      'Fold bottom up, then fold sides in tightly',
      'Roll up from bottom to create wrap',
      'Cut in half diagonally to serve'
    ],
    instructions: ['Season and grill chicken', 'Slice into strips', 'Warm tortillas', 'Layer ingredients', 'Roll tightly'],
    nutritionBreakdown: { protein: 38, carbs: 32, fat: 18, fiber: 6 }
  },
  'Buddha Bowl': {
    name: 'Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80',
    time: '30 min',
    prepTime: '15 min',
    cookTime: '25 min',
    servings: 2,
    calories: 520,
    difficulty: 'Medium',
    tags: ['Vegan Option', 'Nutritious', 'Colorful'],
    ingredients: [
      { item: 'Brown rice', amount: '1 cup dry', calories: 216, buyingTip: 'Short grain is stickier, long grain is fluffier. Both work well' },
      { item: 'Canned chickpeas', amount: '1 can (15 oz)', calories: 210, buyingTip: 'Drain and rinse well. Low-sodium if available' },
      { item: 'Sweet potato', amount: '1 large', calories: 112, buyingTip: 'Look for firm, smooth skin without soft spots or sprouts' },
      { item: 'Lacinato kale', amount: '1 bunch', calories: 33, buyingTip: 'Also called dinosaur kale. Curly kale works too' },
      { item: 'Ripe avocado', amount: '1', calories: 160, buyingTip: 'Should yield to gentle pressure but not be mushy' },
      { item: 'Tahini', amount: '3 tbsp', calories: 135, buyingTip: 'Stir well before using - oil separates. Store in fridge after opening' },
      { item: 'Mixed seeds', amount: '2 tbsp', calories: 90, buyingTip: 'Pumpkin, sunflower, hemp seeds - any combination adds nutrition' }
    ],
    prepSteps: [
      'Preheat oven to 400°F',
      'Peel and cube sweet potato into 1-inch pieces',
      'Drain and rinse chickpeas, pat dry with paper towels',
      'Remove kale leaves from stems, tear into pieces',
      'Make tahini dressing: whisk tahini with lemon juice, water, garlic, salt',
      'Slice avocado just before serving'
    ],
    cookingSteps: [
      'Start brown rice: bring 2 cups water to boil, add rice, reduce heat, cover, simmer 25-30 min',
      'Toss sweet potato cubes with oil, salt, spread on one side of sheet pan',
      'Toss chickpeas with oil, cumin, paprika, spread on other side of pan',
      'Roast at 400°F for 25 minutes, flipping halfway',
      'While roasting, massage kale with 1 tsp olive oil and pinch of salt for 2 min',
      'This breaks down fibers and makes kale tender and less bitter',
      'Fluff rice with fork when done',
      'To assemble: place rice in bottom of wide bowls',
      'Arrange roasted sweet potato, chickpeas, and massaged kale in sections',
      'Fan avocado slices on top',
      'Drizzle tahini dressing generously',
      'Sprinkle with mixed seeds',
      'Add hot sauce if desired'
    ],
    instructions: ['Cook rice', 'Roast sweet potato & chickpeas', 'Massage kale with oil', 'Arrange in bowl', 'Drizzle with tahini'],
    nutritionBreakdown: { protein: 18, carbs: 62, fat: 22, fiber: 14 }
  },
  'Salmon & Veggies': {
    name: 'Herb-Crusted Salmon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&q=80',
    time: '25 min',
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 2,
    calories: 480,
    difficulty: 'Medium',
    tags: ['Omega-3', 'Keto', 'Heart Healthy'],
    ingredients: [
      { item: 'Salmon fillets', amount: '2 (6 oz each)', calories: 280, buyingTip: 'Wild-caught has richer flavor. Look for bright color, no fishy smell' },
      { item: 'Fresh dill', amount: '2 tbsp chopped', calories: 2, buyingTip: 'Feathery fronds should be vibrant green, not wilted' },
      { item: 'Fresh parsley', amount: '2 tbsp chopped', calories: 2, buyingTip: 'Flat-leaf (Italian) parsley has better flavor than curly' },
      { item: 'Lemon', amount: '1 large', calories: 17, buyingTip: 'Heavy lemons have more juice. Zest before juicing' },
      { item: 'Asparagus', amount: '1 bunch', calories: 27, buyingTip: 'Thin spears are more tender. Snap off woody ends' },
      { item: 'Cherry tomatoes', amount: '1 cup', calories: 27, buyingTip: 'On the vine have best flavor. Should be firm and bright' },
      { item: 'Garlic', amount: '3 cloves', calories: 13, buyingTip: 'Fresh garlic should be firm with tight skin, not sprouting' },
      { item: 'Extra virgin olive oil', amount: '3 tbsp', calories: 120, buyingTip: 'Good quality oil adds flavor to this simple dish' }
    ],
    prepSteps: [
      'Remove salmon from fridge 15 min before cooking',
      'Pat salmon dry with paper towels - crucial for crispy skin',
      'Chop herbs finely and mix together',
      'Zest lemon, then cut into wedges',
      'Snap woody ends off asparagus',
      'Mince garlic',
      'Halve cherry tomatoes'
    ],
    cookingSteps: [
      'Preheat oven to 400°F',
      'Line baking sheet with parchment paper',
      'Toss asparagus and tomatoes with 1 tbsp olive oil, salt, pepper',
      'Arrange vegetables on outer edges of baking sheet',
      'Place salmon fillets skin-side down in center',
      'Brush salmon with 1 tbsp olive oil',
      'Season with salt, pepper, and minced garlic',
      'Press herb mixture onto top of salmon',
      'Add lemon zest on top of herbs',
      'Drizzle remaining olive oil over everything',
      'Bake 15-18 minutes until salmon flakes easily with fork',
      'Internal temp should reach 145°F',
      'Serve immediately with lemon wedges'
    ],
    instructions: ['Preheat oven to 400°F', 'Season salmon with herbs', 'Arrange veggies around fish', 'Drizzle with olive oil', 'Bake 15-18 minutes'],
    nutritionBreakdown: { protein: 40, carbs: 12, fat: 28, fiber: 4 }
  },
  'Pasta Primavera': {
    name: 'Pasta Primavera',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80',
    time: '30 min',
    prepTime: '10 min',
    cookTime: '20 min',
    servings: 4,
    calories: 420,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Family Favorite', 'Italian'],
    ingredients: [
      { item: 'Penne pasta', amount: '1 lb', calories: 400, buyingTip: 'Bronze-cut pasta has rougher texture that holds sauce better' },
      { item: 'Zucchini', amount: '2 medium', calories: 33, buyingTip: 'Look for firm, shiny skin. Smaller zucchini have fewer seeds' },
      { item: 'Bell peppers', amount: '2 (mixed colors)', calories: 37, buyingTip: 'Red and yellow are sweetest. Heavy peppers have thicker walls' },
      { item: 'Cherry tomatoes', amount: '1 pint', calories: 27, buyingTip: 'On the vine taste best. Should be firm but yield slightly' },
      { item: 'Parmesan cheese', amount: '1 cup grated', calories: 220, buyingTip: 'Parmigiano-Reggiano is authentic. Buy wedge and grate fresh' },
      { item: 'Extra virgin olive oil', amount: '4 tbsp', calories: 160, buyingTip: 'Use good quality oil - it\'s a main flavor in this dish' },
      { item: 'Fresh basil', amount: '1/2 cup leaves', calories: 1, buyingTip: 'Should be vibrant green without dark spots. Tear, don\'t chop' },
      { item: 'Garlic', amount: '4 cloves', calories: 18, buyingTip: 'Fresh garlic is essential. Don\'t substitute powder' }
    ],
    prepSteps: [
      'Bring large pot of salted water to boil',
      'Halve zucchini lengthwise, then slice into half-moons',
      'Cut bell peppers into strips',
      'Halve cherry tomatoes',
      'Mince garlic',
      'Grate parmesan cheese',
      'Wash basil and pat dry',
      'Have all ingredients ready before starting to cook'
    ],
    cookingSteps: [
      'Cook pasta in salted water according to package directions',
      'Reserve 1 cup pasta water before draining',
      'While pasta cooks, heat olive oil in large skillet over medium-high',
      'Add zucchini and bell peppers, season with salt',
      'Sauté 5-6 minutes until vegetables are tender-crisp',
      'Add minced garlic, cook 30 seconds until fragrant',
      'Add cherry tomatoes, cook 2 minutes until slightly softened',
      'Drain pasta and add to skillet with vegetables',
      'Add 1/2 cup reserved pasta water',
      'Toss everything together over low heat',
      'Add half the parmesan, toss to combine',
      'Add more pasta water if needed for sauciness',
      'Tear basil leaves over top',
      'Serve with remaining parmesan'
    ],
    instructions: ['Cook pasta al dente', 'Sauté vegetables in olive oil', 'Toss pasta with veggies', 'Add parmesan', 'Garnish with basil'],
    nutritionBreakdown: { protein: 16, carbs: 58, fat: 14, fiber: 4 }
  },
  'Stir Fry': {
    name: 'Asian Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop&q=80',
    time: '20 min',
    prepTime: '12 min',
    cookTime: '8 min',
    servings: 4,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Quick', 'High Protein', 'Asian'],
    ingredients: [
      { item: 'Chicken breast or firm tofu', amount: '1 lb', calories: 185, buyingTip: 'For tofu: extra-firm, pressed. For chicken: cut against the grain' },
      { item: 'Broccoli florets', amount: '2 cups', calories: 55, buyingTip: 'Cut into uniform bite-sized pieces for even cooking' },
      { item: 'Snap peas', amount: '1 cup', calories: 26, buyingTip: 'Should snap crisply. Remove strings from both edges' },
      { item: 'Carrots', amount: '2 medium', calories: 52, buyingTip: 'Cut into thin coins or julienne for quick cooking' },
      { item: 'Soy sauce', amount: '3 tbsp', calories: 27, buyingTip: 'Low-sodium soy sauce lets you control saltiness. Tamari is gluten-free' },
      { item: 'Fresh ginger', amount: '1 inch piece', calories: 5, buyingTip: 'Should be firm with smooth skin. Grate with microplane for best texture' },
      { item: 'Garlic', amount: '4 cloves', calories: 18, buyingTip: 'Fresh only - this dish is all about aromatics' },
      { item: 'Sesame oil', amount: '1 tbsp', calories: 40, buyingTip: 'Toasted sesame oil has stronger flavor. Use as finisher, not for frying' }
    ],
    prepSteps: [
      'THIS IS CRUCIAL: Have everything prepped before heating wok',
      'Slice chicken into thin strips against the grain (or cube tofu)',
      'Cut broccoli into small, uniform florets',
      'String and halve snap peas',
      'Slice carrots into thin coins or matchsticks',
      'Mince garlic and grate ginger',
      'Make sauce: whisk soy sauce, 2 tbsp water, 1 tsp cornstarch',
      'Arrange all ingredients within arm\'s reach of stove'
    ],
    cookingSteps: [
      'Heat wok or large skillet over HIGH heat until smoking',
      'Add 1 tbsp vegetable oil, swirl to coat',
      'Add chicken/tofu in single layer, don\'t stir for 1 minute',
      'Stir fry 2-3 minutes until cooked through, remove to plate',
      'Add another 1 tbsp oil to hot wok',
      'Add carrots first (they take longest), stir fry 1 minute',
      'Add broccoli, stir fry 2 minutes',
      'Add snap peas, stir fry 1 minute',
      'Push veggies to sides, add garlic and ginger to center',
      'Stir aromatics 30 seconds until fragrant',
      'Return protein to wok',
      'Pour sauce over, toss everything together',
      'Cook 1 minute until sauce thickens and coats everything',
      'Remove from heat, drizzle with sesame oil',
      'Serve immediately over rice'
    ],
    instructions: ['Prep all ingredients', 'Heat wok very hot', 'Cook protein first, set aside', 'Stir fry vegetables', 'Add sauce and protein back'],
    nutritionBreakdown: { protein: 28, carbs: 18, fat: 14, fiber: 4 }
  },
  'Tacos Night': {
    name: 'Street-Style Tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop&q=80',
    time: '25 min',
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 4,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Mexican', 'Family Favorite', 'Customizable'],
    ingredients: [
      { item: 'Ground beef (80/20)', amount: '1 lb', calories: 280, buyingTip: '80/20 blend has enough fat for flavor. Ground chicken or turkey also works' },
      { item: 'Corn tortillas', amount: '12 small', calories: 210, buyingTip: 'Fresh from Mexican grocery is best. Double up for sturdier tacos' },
      { item: 'White onion', amount: '1 medium', calories: 44, buyingTip: 'White onion is traditional. Should be firm with dry papery skin' },
      { item: 'Fresh cilantro', amount: '1 bunch', calories: 4, buyingTip: 'Bright green leaves, no yellowing. Some people taste soap - skip if that\'s you' },
      { item: 'Limes', amount: '3', calories: 60, buyingTip: 'Should feel heavy for size. Roll before cutting to release more juice' },
      { item: 'Fresh salsa', amount: '1 cup', calories: 36, buyingTip: 'Pico de gallo style is traditional. Or make your own with tomatoes, onion, jalapeño' },
      { item: 'Taco seasoning', amount: '3 tbsp', calories: 30, buyingTip: 'Make your own: chili powder, cumin, paprika, garlic powder, oregano' }
    ],
    prepSteps: [
      'Finely dice onion - you want small pieces',
      'Roughly chop cilantro leaves and tender stems',
      'Cut limes into wedges',
      'If making fresh salsa: dice tomatoes, mince jalapeño, mix with lime juice',
      'Set up taco bar: bowls for each topping',
      'Have paper towels ready for draining meat'
    ],
    cookingSteps: [
      'Heat large skillet over medium-high heat',
      'Add ground beef, break up with spatula',
      'Cook 5-7 minutes, breaking into small crumbles',
      'Drain excess fat if desired',
      'Add taco seasoning and 1/4 cup water',
      'Simmer 3-4 minutes until liquid reduces',
      'Taste and adjust seasoning',
      'Meanwhile, heat tortillas: dry skillet over high heat',
      'Cook each tortilla 30 seconds per side until slightly charred',
      'Stack tortillas and wrap in clean towel to keep warm',
      'Double up tortillas for serving (street-style)',
      'Spoon meat into tortillas',
      'Top with onion and cilantro',
      'Squeeze fresh lime over top',
      'Add salsa as desired'
    ],
    instructions: ['Brown meat with seasoning', 'Warm tortillas', 'Dice onion and cilantro', 'Assemble tacos', 'Squeeze lime on top'],
    nutritionBreakdown: { protein: 22, carbs: 28, fat: 16, fiber: 4 }
  },
  'Pizza Night': {
    name: 'Homemade Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80',
    time: '45 min',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4,
    calories: 520,
    difficulty: 'Medium',
    tags: ['Italian', 'Family Favorite', 'Fun'],
    ingredients: [
      { item: 'Pizza dough', amount: '1 lb', calories: 260, buyingTip: 'Buy from pizzeria or grocery deli. Or make ahead and refrigerate' },
      { item: 'San Marzano tomato sauce', amount: '1/2 cup', calories: 35, buyingTip: 'San Marzano tomatoes make best sauce. Or use quality marinara' },
      { item: 'Fresh mozzarella', amount: '8 oz', calories: 170, buyingTip: 'Fresh mozzarella packed in water melts beautifully. Slice and drain' },
      { item: 'Pepperoni', amount: '3 oz', calories: 150, buyingTip: 'Cup-and-char style curls up when cooked. Or skip for cheese pizza' },
      { item: 'Bell peppers', amount: '1', calories: 24, buyingTip: 'Slice thin so they cook through. Any color works' },
      { item: 'Cremini mushrooms', amount: '4 oz', calories: 22, buyingTip: 'Slice thin. Sauté briefly first if you don\'t like raw mushrooms' },
      { item: 'Fresh basil', amount: '8-10 leaves', calories: 1, buyingTip: 'Add AFTER baking - it burns easily. Tear, don\'t chop' },
      { item: 'Olive oil', amount: '2 tbsp', calories: 80, buyingTip: 'Drizzle on crust edges for golden, crispy finish' }
    ],
    prepSteps: [
      'Remove dough from fridge 30 min before using',
      'Preheat oven to 475°F (or as high as it goes) with pizza stone if you have one',
      'Slice fresh mozzarella, lay on paper towels to drain',
      'Slice bell peppers into thin rings',
      'Slice mushrooms thin',
      'Prep all toppings in separate bowls',
      'Flour your work surface generously',
      'Have parchment paper ready for transferring'
    ],
    cookingSteps: [
      'Stretch dough with hands - don\'t use rolling pin (compresses air)',
      'Start from center, work outward, leaving edge thicker for crust',
      'Transfer to floured parchment paper',
      'Spread thin layer of sauce, leaving 1-inch border',
      'Less is more with sauce - don\'t make it soggy',
      'Arrange mozzarella slices evenly',
      'Add pepperoni (curls up into little cups)',
      'Scatter peppers and mushrooms',
      'Drizzle olive oil on crust edges',
      'Transfer pizza (on parchment) to hot stone or baking sheet',
      'Bake 12-15 minutes until crust is golden and cheese bubbles',
      'Remove from oven, let rest 2 minutes',
      'Top with fresh torn basil',
      'Slice and serve immediately'
    ],
    instructions: ['Preheat oven to 475°F', 'Roll out dough', 'Spread sauce', 'Add cheese and toppings', 'Bake 12-15 minutes'],
    nutritionBreakdown: { protein: 22, carbs: 48, fat: 24, fiber: 3 }
  },
  'Sushi Night': {
    name: 'Homemade Sushi Rolls',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop&q=80',
    time: '45 min',
    prepTime: '25 min',
    cookTime: '20 min',
    servings: 4,
    calories: 350,
    difficulty: 'Hard',
    tags: ['Japanese', 'Healthy', 'Date Night'],
    ingredients: [
      { item: 'Sushi rice', amount: '2 cups', calories: 200, buyingTip: 'Short-grain Japanese rice is essential. Calrose rice is good substitute' },
      { item: 'Nori sheets', amount: '8 sheets', calories: 40, buyingTip: 'Should be dark green/black, crispy. Store in airtight container' },
      { item: 'Sushi-grade salmon', amount: '8 oz', calories: 200, buyingTip: 'MUST be sushi-grade/sashimi-grade from reputable fishmonger. Ask for freshest' },
      { item: 'English cucumber', amount: '1', calories: 16, buyingTip: 'English cucumbers have fewer seeds. Cut into long strips' },
      { item: 'Ripe avocado', amount: '2', calories: 320, buyingTip: 'Should yield to gentle pressure. Not too soft or it will mush' },
      { item: 'Rice vinegar', amount: '1/4 cup', calories: 8, buyingTip: 'Seasoned rice vinegar or plain with sugar added' },
      { item: 'Soy sauce', amount: 'For dipping', calories: 10, buyingTip: 'Low-sodium recommended. Japanese brands are best' },
      { item: 'Wasabi paste', amount: 'To taste', calories: 5, buyingTip: 'Real wasabi is expensive and rare. Most is horseradish-based, which is fine' }
    ],
    prepSteps: [
      'Rinse rice in cold water until water runs clear (5-6 times)',
      'Cook rice in rice cooker or pot with equal water',
      'While rice cooks, prep vegetables',
      'Cut cucumber into long thin strips',
      'Slice avocado into thin strips',
      'Slice fish into long strips (about 1/2 inch thick)',
      'Mix rice vinegar with 2 tbsp sugar, 1 tsp salt, heat until dissolved',
      'Prepare bowl of water with splash of vinegar for wetting hands',
      'Set up bamboo rolling mat wrapped in plastic wrap'
    ],
    cookingSteps: [
      'When rice is done, transfer to wide bowl',
      'Pour vinegar mixture over rice in thin stream',
      'Use cutting motion with paddle to mix (don\'t mash)',
      'Fan rice while mixing to cool and create shine',
      'Cover with damp towel until ready to use',
      'Place nori sheet shiny-side down on mat',
      'Wet hands in vinegar water',
      'Spread thin layer of rice on nori, leaving 1-inch strip at top',
      'Add strip of fish, cucumber, and avocado across center',
      'Lift bottom of mat, roll over fillings',
      'Squeeze gently to shape, then continue rolling',
      'Use damp knife to cut roll into 6-8 pieces',
      'Clean knife between cuts for clean edges',
      'Serve with soy sauce, wasabi, and pickled ginger'
    ],
    instructions: ['Cook and season rice', 'Prep fish and vegetables', 'Place nori on bamboo mat', 'Spread rice, add fillings', 'Roll tightly and slice'],
    nutritionBreakdown: { protein: 18, carbs: 42, fat: 14, fiber: 4 }
  },
  'Chicken Curry': {
    name: 'Creamy Chicken Curry',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop&q=80',
    time: '40 min',
    prepTime: '15 min',
    cookTime: '25 min',
    servings: 4,
    calories: 450,
    difficulty: 'Medium',
    tags: ['Indian', 'Comfort Food', 'Spicy'],
    ingredients: [
      { item: 'Chicken thighs', amount: '1.5 lbs boneless', calories: 275, buyingTip: 'Thighs stay juicier than breast in curry. Trim excess fat' },
      { item: 'Full-fat coconut milk', amount: '1 can (14 oz)', calories: 280, buyingTip: 'Full-fat is creamier. Shake can well before opening' },
      { item: 'Curry paste or powder', amount: '3 tbsp', calories: 30, buyingTip: 'Red curry paste is milder, green is spicier. Or use garam masala' },
      { item: 'Yellow onion', amount: '1 large', calories: 44, buyingTip: 'Dice small for faster cooking. Sweet onion also works' },
      { item: 'Garlic', amount: '4 cloves', calories: 18, buyingTip: 'Fresh garlic is essential. Mince finely or use garlic press' },
      { item: 'Fresh ginger', amount: '2 inch piece', calories: 10, buyingTip: 'Should be firm with smooth skin. Grate with microplane' },
      { item: 'Basmati rice', amount: '1.5 cups', calories: 240, buyingTip: 'Rinse until water runs clear for fluffy, separate grains' },
      { item: 'Fresh cilantro', amount: '1/4 cup', calories: 1, buyingTip: 'For garnish. Skip if you have the soap-taste gene' }
    ],
    prepSteps: [
      'Cut chicken into 1.5 inch pieces',
      'Season chicken with salt and turmeric',
      'Dice onion finely',
      'Mince garlic and grate ginger',
      'Shake coconut milk can vigorously',
      'Rinse basmati rice 3-4 times until water runs clear',
      'Measure out curry paste/powder',
      'Roughly chop cilantro for garnish'
    ],
    cookingSteps: [
      'Start rice: 1.5 cups rice with 2.25 cups water, bring to boil, reduce to low, cover 15 min',
      'Heat large skillet or Dutch oven over medium-high heat',
      'Add 2 tbsp oil, brown chicken in batches 2-3 min per side',
      'Don\'t move chicken too much - let it develop color',
      'Remove chicken to plate (it will finish cooking in sauce)',
      'Reduce heat to medium, add diced onion',
      'Sauté 5-6 minutes until golden and soft',
      'Add garlic and ginger, cook 1 minute until fragrant',
      'Add curry paste/powder, stir 30 seconds to bloom spices',
      'Pour in coconut milk, stir to combine with spices',
      'Return chicken to pan with any juices',
      'Simmer 15-20 minutes until chicken is cooked through',
      'Sauce should thicken - if too thick, add splash of water',
      'Taste and adjust salt, add pinch of sugar if needed',
      'Fluff rice with fork',
      'Serve curry over rice, garnish with cilantro'
    ],
    instructions: ['Sauté onion, garlic, ginger', 'Add curry paste, cook 1 min', 'Add chicken, brown slightly', 'Pour in coconut milk', 'Simmer 25 min, serve over rice'],
    nutritionBreakdown: { protein: 32, carbs: 28, fat: 24, fiber: 2 }
  },
};

// Food images for meal types
const MEAL_IMAGES: Record<string, string> = {
  Breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&q=80',
  Lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
  Dinner: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80',
};

// Gallery images with recipes
const FOOD_GALLERY = {
  hero: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=1920&h=800&fit=crop&q=90',
  familyEating: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop&q=80',
  familyDinner: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=400&fit=crop&q=80',
  cooking: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80',
  groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&q=80',
  healthyFood: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&q=80',
  breakfast: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80',
  dinner: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&q=80',
  calendar: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop&q=80',
};

// Meal suggestions by category
const MEAL_SUGGESTIONS: Record<string, string[]> = {
  Breakfast: ['Avocado Toast', 'Overnight Oats', 'Veggie Omelet', 'Smoothie Bowl', 'Pancakes'],
  Lunch: ['Quinoa Salad', 'Grilled Chicken Wrap', 'Buddha Bowl'],
  Dinner: ['Salmon & Veggies', 'Pasta Primavera', 'Stir Fry', 'Tacos Night', 'Pizza Night', 'Sushi Night', 'Chicken Curry'],
};

// Nutritional tips
const NUTRITION_TIPS: Record<string, { tip: string; icon: string }> = {
  Breakfast: { tip: 'Include protein to stay full longer', icon: '💪' },
  Lunch: { tip: 'Add colorful veggies for vitamins', icon: '🌈' },
  Dinner: { tip: 'Balance carbs, protein & fiber', icon: '⚖️' },
};

// Toast component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`toast-enter fixed bottom-6 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50`}>
      <span className="font-medium">{message}</span>
    </div>
  );
}

// Progress bar
function ProgressBar({ filled, total }: { filled: number; total: number }) {
  const percentage = Math.round((filled / total) * 100);
  return (
    <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
      <div 
        className="progress-bar bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 h-full rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Recipe Modal with tabs for detailed info
function RecipeModal({ recipe, onClose, onAddToMeal }: {
  recipe: typeof RECIPES[string] | null;
  onClose: () => void;
  onAddToMeal: (name: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'prep' | 'cooking' | 'nutrition'>('ingredients');

  if (!recipe) return null;

  const totalIngredientCalories = recipe.ingredients.reduce((sum, ing) => sum + ing.calories, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Recipe Image */}
        <div className="relative h-72 w-full">
          <Image src={recipe.image} alt={recipe.name} fill className="object-cover rounded-t-2xl" sizes="800px" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-3xl font-bold text-white">{recipe.name}</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              {recipe.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Info */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <p className="text-xl">⏱️</p>
              <p className="text-xs font-semibold text-gray-800">{recipe.time}</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-xl">
              <p className="text-xl">🔪</p>
              <p className="text-xs font-semibold text-gray-800">Prep {recipe.prepTime}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-xl">🍳</p>
              <p className="text-xs font-semibold text-gray-800">Cook {recipe.cookTime}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-xl">👥</p>
              <p className="text-xs font-semibold text-gray-800">{recipe.servings} servings</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-xl">🔥</p>
              <p className="text-xs font-semibold text-gray-800">{recipe.calories} cal</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 pb-2 overflow-x-auto">
            {[
              { id: 'ingredients', label: '🛒 Ingredients & Buying', icon: '🛒' },
              { id: 'prep', label: '🔪 Prep Steps', icon: '🔪' },
              { id: 'cooking', label: '👨‍🍳 Cooking', icon: '👨‍🍳' },
              { id: 'nutrition', label: '📊 Nutrition', icon: '📊' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-xl mb-4">
                  <p className="text-sm text-amber-800">
                    <strong>🛍️ Shopping Tip:</strong> Check your pantry first! Items marked with buying tips help you select the best quality.
                  </p>
                </div>
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></span>
                          <span className="font-medium text-gray-800">{ing.item}</span>
                          <span className="text-sm text-gray-500">({ing.amount})</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-4">💡 {ing.buyingTip}</p>
                      </div>
                      <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg whitespace-nowrap">
                        {ing.calories} cal
                      </span>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-100 p-4 rounded-xl mt-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Total Ingredient Calories: <span className="text-orange-600">{totalIngredientCalories} cal</span>
                    <span className="text-gray-500 font-normal ml-2">({Math.round(totalIngredientCalories / recipe.servings)} per serving)</span>
                  </p>
                </div>
              </div>
            )}

            {/* Prep Steps Tab */}
            {activeTab === 'prep' && (
              <div>
                <div className="bg-blue-50 p-3 rounded-xl mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>🔪 Prep Time:</strong> {recipe.prepTime} - Complete these steps before you start cooking!
                  </p>
                </div>
                <ol className="space-y-3">
                  {recipe.prepSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Cooking Tab */}
            {activeTab === 'cooking' && (
              <div>
                <div className="bg-red-50 p-3 rounded-xl mb-4">
                  <p className="text-sm text-red-800">
                    <strong>🍳 Cooking Time:</strong> {recipe.cookTime} - Follow these steps carefully for best results!
                  </p>
                </div>
                <ol className="space-y-3">
                  {recipe.cookingSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div>
                <div className="bg-green-50 p-3 rounded-xl mb-4">
                  <p className="text-sm text-green-800">
                    <strong>📊 Per Serving:</strong> {recipe.calories} calories ({recipe.servings} servings per recipe)
                  </p>
                </div>

                {/* Macro Breakdown */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-3xl font-bold text-blue-600">{recipe.nutritionBreakdown.protein}g</p>
                    <p className="text-sm text-gray-600">Protein</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, recipe.nutritionBreakdown.protein * 2)}%` }}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <p className="text-3xl font-bold text-amber-600">{recipe.nutritionBreakdown.carbs}g</p>
                    <p className="text-sm text-gray-600">Carbs</p>
                    <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(100, recipe.nutritionBreakdown.carbs)}%` }}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <p className="text-3xl font-bold text-red-600">{recipe.nutritionBreakdown.fat}g</p>
                    <p className="text-sm text-gray-600">Fat</p>
                    <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(100, recipe.nutritionBreakdown.fat * 1.5)}%` }}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-3xl font-bold text-green-600">{recipe.nutritionBreakdown.fiber}g</p>
                    <p className="text-sm text-gray-600">Fiber</p>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, recipe.nutritionBreakdown.fiber * 5)}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Calorie Breakdown by Ingredient */}
                <h4 className="font-bold text-gray-800 mb-3">Calorie Breakdown by Ingredient</h4>
                <div className="space-y-2">
                  {recipe.ingredients
                    .filter(ing => ing.calories > 0)
                    .sort((a, b) => b.calories - a.calories)
                    .map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-32 truncate">{ing.item}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-amber-400 h-full rounded-full transition-all"
                            style={{ width: `${(ing.calories / totalIngredientCalories) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-16 text-right">{ing.calories} cal</span>
                      </div>
                    ))}
                </div>

                {/* Daily Value Context */}
                <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                  <h5 className="font-semibold text-gray-800 mb-2">Daily Value Context (per serving)</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>Calories: {Math.round((recipe.calories / 2000) * 100)}% of 2000 cal diet</p>
                    <p>Protein: {Math.round((recipe.nutritionBreakdown.protein / 50) * 100)}% of 50g DV</p>
                    <p>Carbs: {Math.round((recipe.nutritionBreakdown.carbs / 300) * 100)}% of 300g DV</p>
                    <p>Fiber: {Math.round((recipe.nutritionBreakdown.fiber / 25) * 100)}% of 25g DV</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add to Meal Plan */}
          <button
            onClick={() => onAddToMeal(recipe.name)}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-6"
          >
            ➕ Add to Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

// Feature Card
function FeatureCard({ icon, title, description, onClick, imageSrc }: { icon: string; title: string; description: string; onClick: () => void; imageSrc: string }) {
  return (
    <button onClick={onClick} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 card-lift text-left w-full">
      <div className="relative h-32 overflow-hidden">
        <Image src={imageSrc} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="300px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 text-4xl drop-shadow-lg">{icon}</div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </button>
  );
}

export default function Home() {
  const [mealPlan, setMealPlan] = useState<Record<string, Record<string, string>>>({});
  const [currentDay, setCurrentDay] = useState('Monday');
  const [currentMeal, setCurrentMeal] = useState('Breakfast');
  const [mealInput, setMealInput] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [groceryList, setGroceryList] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<typeof RECIPES[string] | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Load meal plan
  useEffect(() => {
    const loadMealPlan = async () => {
      try {
        const data = await fetchMealPlans();
        setMealPlan(data);
      } catch (error) {
        console.error('Failed to load meal plan:', error);
        const saved = localStorage.getItem('mealPlan');
        if (saved) {
          try { setMealPlan(JSON.parse(saved)); } catch { /* ignore */ }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadMealPlan();
  }, []);

  // Save meal plan
  useEffect(() => {
    if (Object.keys(mealPlan).length > 0 && !isLoading) {
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
      const syncTimeout = setTimeout(async () => {
        setIsSyncing(true);
        await syncMealPlan(mealPlan);
        setIsSyncing(false);
      }, 1000);
      return () => clearTimeout(syncTimeout);
    }
  }, [mealPlan, isLoading]);

  const totalSlots = DAYS.length * MEALS.length;
  const filledSlots = Object.values(mealPlan).reduce((acc, day) => acc + Object.keys(day).length, 0);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  }, []);

  const addMeal = useCallback(async () => {
    if (!mealInput.trim()) {
      setInputError(true);
      showToast('Please enter a meal name', 'error');
      setTimeout(() => setInputError(false), 500);
      return;
    }
    
    setMealPlan(prev => ({
      ...prev,
      [currentDay]: { ...prev[currentDay], [currentMeal]: mealInput }
    }));
    
    await saveMeal(currentDay, currentMeal, mealInput);
    setRecentlyAdded(`${currentDay}-${currentMeal}`);
    setTimeout(() => setRecentlyAdded(null), 600);
    showToast(`${currentMeal} added to ${currentDay}!`, 'success');
    setMealInput('');
    setShowSuggestions(false);
  }, [mealInput, currentDay, currentMeal, showToast]);

  const removeMeal = useCallback(async (day: string, meal: string) => {
    setMealPlan(prev => {
      const newPlan = { ...prev };
      if (newPlan[day]) {
        delete newPlan[day][meal];
        if (Object.keys(newPlan[day]).length === 0) delete newPlan[day];
      }
      return newPlan;
    });
    await removeMealFromDB(day, meal);
    showToast('Meal removed', 'info');
  }, [showToast]);

  const clearAllMeals = useCallback(async () => {
    if (confirm('Clear all meals?')) {
      setMealPlan({});
      localStorage.removeItem('mealPlan');
      await syncMealPlan({});
      showToast('All meals cleared', 'info');
    }
  }, [showToast]);

  const getMeal = useCallback((day: string, meal: string) => mealPlan[day]?.[meal] || '', [mealPlan]);

  const generateGroceryList = useCallback(() => {
    const meals = Object.values(mealPlan).flatMap(day => Object.values(day));
    setGroceryList([...new Set(meals)]);
    setActiveModal('grocery');
    showToast('Grocery list generated!', 'success');
  }, [mealPlan, showToast]);

  const shareMealPlan = useCallback(async () => {
    const planText = DAYS.map(day => {
      const dayMeals = MEALS.map(meal => `  ${meal}: ${getMeal(day, meal) || 'Not planned'}`).join('\n');
      return `${day}:\n${dayMeals}`;
    }).join('\n\n');
    
    const shareText = `🍽️ My Weekly Meal Plan\n\n${planText}\n\nCreated with BestMealMate`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Meal Plan', text: shareText });
        showToast('Shared!', 'success');
      } catch {
        await navigator.clipboard.writeText(shareText);
        showToast('Copied to clipboard!', 'success');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      showToast('Copied to clipboard!', 'success');
    }
  }, [showToast, getMeal]);

  const printMealPlan = useCallback(() => {
    window.print();
  }, []);

  const selectSuggestion = useCallback((suggestion: string) => {
    setMealInput(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const openRecipe = useCallback((recipeName: string) => {
    const recipe = RECIPES[recipeName];
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  }, []);

  const addRecipeToMeal = useCallback((recipeName: string) => {
    setMealInput(recipeName);
    setSelectedRecipe(null);
    inputRef.current?.focus();
    showToast(`${recipeName} selected! Choose day and meal type.`, 'info');
  }, [showToast]);

  const randomMeal = useCallback(() => {
    const allRecipes = Object.keys(RECIPES);
    const random = allRecipes[Math.floor(Math.random() * allRecipes.length)];
    setMealInput(random);
    showToast(`Random pick: ${random}!`, 'success');
  }, [showToast]);

  // Export to calendar (.ics format)
  const exportToCalendar = useCallback(() => {
    const today = new Date();
    const dayOffset = (today.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOffset);

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BestMealMate//Meal Plan//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

    DAYS.forEach((day, dayIndex) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + dayIndex);
      const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

      MEALS.forEach((mealType) => {
        const mealName = getMeal(day, mealType);
        if (mealName) {
          const startHour = mealType === 'Breakfast' ? '08' : mealType === 'Lunch' ? '12' : '18';
          icsContent += `BEGIN:VEVENT
DTSTART:${dateStr}T${startHour}0000
DTEND:${dateStr}T${startHour}3000
SUMMARY:${mealType}: ${mealName}
DESCRIPTION:Meal planned with BestMealMate
END:VEVENT
`;
        }
      });
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bestmealmate-meal-plan.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Calendar exported! Import to Google/Apple Calendar', 'success');
  }, [showToast, getMeal]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        setShowSuggestions(false);
        setSelectedRecipe(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'}`}>
      {/* Skip link */}
      <a href="#main-content" className="skip-link focus-ring">Skip to main content</a>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Recipe Modal */}
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onAddToMeal={addRecipeToMeal} />

      {/* Food Scanner Modal */}
      {showScanner && (
        <FoodScanner
          onClose={() => setShowScanner(false)}
          onAddToMealPlan={(mealName) => {
            setMealInput(mealName);
            setShowScanner(false);
            inputRef.current?.focus();
            showToast(`${mealName} added! Select day and meal type.`, 'success');
          }}
        />
      )}

      {/* Navigation Header - Mobile Optimized */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm safe-top">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl">🍽️</span>
            <span className="font-bold text-lg md:text-xl text-orange-600">BestMealMate</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors" title="Toggle dark mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={shareMealPlan} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors hidden md:flex" title="Share">📤</button>
            <button onClick={printMealPlan} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors hidden md:flex" title="Print">🖨️</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[70vh] min-h-[500px] overflow-hidden pt-14" role="banner">
        {!isLoading && (
          <>
            <Image src={FOOD_GALLERY.hero} alt="Delicious food spread" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute top-24 left-10 w-20 h-20 rounded-full overflow-hidden shadow-2xl animate-float hidden lg:block cursor-pointer" onClick={() => openRecipe('Pancakes')}>
              <Image src={FOOD_GALLERY.breakfast} alt="Breakfast" fill className="object-cover" sizes="80px" />
            </div>
            <div className="absolute top-32 right-16 w-16 h-16 rounded-full overflow-hidden shadow-2xl animate-float-delayed hidden lg:block cursor-pointer" onClick={() => openRecipe('Quinoa Salad')}>
              <Image src={FOOD_GALLERY.healthyFood} alt="Healthy" fill className="object-cover" sizes="64px" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="animate-slide-up text-center">
            <h1 className="text-5xl md:text-7xl font-bold drop-shadow-2xl mb-4">
              <span className="text-orange-400">Best</span>MealMate
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Your AI-powered meal planning assistant. Plan smarter, eat better.
            </p>
          </div>
          
          <div className="mt-8 w-80 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Weekly Progress</span>
              <span className="font-bold">{filledSlots}/{totalSlots} meals</span>
            </div>
            <ProgressBar filled={filledSlots} total={totalSlots} />
            {filledSlots === totalSlots && <p className="text-center mt-2 text-green-300 animate-pulse">🎉 Week complete!</p>}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => mainContentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-press bg-white text-orange-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
              Start Planning →
            </button>
            <button onClick={randomMeal} className="btn-press bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full border border-white/30 hover:bg-white/30 transition-all">
              🎲 Random Meal
            </button>
          </div>
        </div>
      </header>

      {/* Feature Cards - Horizontal scroll on mobile */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12 -mt-16 md:-mt-20 relative z-10">
        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-6 md:gap-4 swipe-container -mx-4 px-4 md:mx-0">
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="📷" title="AI Scanner" description="Scan ingredients" onClick={() => setShowScanner(true)} imageSrc={FOOD_GALLERY.groceries} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="📝" title="Quick Add" description="Smart suggestions" onClick={() => inputRef.current?.focus()} imageSrc={FOOD_GALLERY.healthyFood} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="🛒" title="Grocery" description="Shopping list" onClick={generateGroceryList} imageSrc={FOOD_GALLERY.groceries} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="📅" title="Calendar" description="Export to iCal" onClick={exportToCalendar} imageSrc={FOOD_GALLERY.calendar} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="📖" title="Recipes" description="15+ dishes" onClick={() => setActiveModal('recipes')} imageSrc={FOOD_GALLERY.cooking} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="❤️" title="Favorites" description="Quick-add" onClick={() => setActiveModal('favorites')} imageSrc={FOOD_GALLERY.familyDinner} />
          </div>
        </div>
      </section>

      {/* Recipe Gallery - Horizontal scroll on mobile */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          🍴 Tap Any Dish for Recipe
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-7 swipe-container -mx-4 px-4 md:mx-0">
          {Object.entries(RECIPES).slice(0, 14).map(([name, recipe]) => (
            <button key={name} onClick={() => openRecipe(name)} className="swipe-item flex-shrink-0 w-24 h-24 md:w-auto md:h-auto md:aspect-square relative rounded-xl overflow-hidden shadow-md active:scale-95 transition-transform">
              <Image src={recipe.image} alt={name} fill className="object-cover" sizes="150px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-black/0 md:hover:bg-black/50 transition-colors flex items-end md:items-center justify-center">
                <span className="text-white font-medium text-[10px] md:text-xs text-center px-1 pb-1 md:pb-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">{name.split(' ')[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Meal Type Cards - Horizontal scroll on mobile */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4 md:mb-6">Choose Meal Type</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-6 swipe-container -mx-4 px-4 md:mx-0 mb-8 md:mb-10">
          {MEALS.map((mealType) => (
            <button
              key={mealType}
              onClick={() => { setCurrentMeal(mealType); inputRef.current?.focus(); }}
              className={`swipe-item flex-shrink-0 w-[280px] md:w-auto card-lift bg-white rounded-2xl shadow-lg overflow-hidden text-left transition-all active:scale-[0.98] ${currentMeal === mealType ? 'ring-4 ring-orange-400 ring-offset-2' : ''}`}
            >
              <div className="relative h-36 md:h-48">
                <Image src={MEAL_IMAGES[mealType]} alt={mealType} fill className="object-cover" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-white font-bold text-lg md:text-xl">{mealType === 'Breakfast' ? '🌅' : mealType === 'Lunch' ? '☀️' : '🌙'} {mealType}</h3>
                  <p className="text-white/80 text-xs md:text-sm">{NUTRITION_TIPS[mealType].tip}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main id="main-content" ref={mainContentRef} className="grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Add Meal Form */}
          <section className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border-t-4 border-orange-400 order-1 md:order-none">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">➕ Add Meal</h2>
            <form onSubmit={(e) => { e.preventDefault(); addMeal(); }} className="space-y-4">
              <div>
                <label htmlFor="day-select" className="block text-sm font-semibold text-gray-700 mb-2">📅 Day</label>
                <select id="day-select" value={currentDay} onChange={(e) => setCurrentDay(e.target.value)} className="w-full p-3 md:p-3 border border-gray-200 rounded-xl bg-gray-50 text-base">
                  {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="meal-select" className="block text-sm font-semibold text-gray-700 mb-2">🍴 Meal Type</label>
                <select id="meal-select" value={currentMeal} onChange={(e) => setCurrentMeal(e.target.value)} className="w-full p-3 md:p-3 border border-gray-200 rounded-xl bg-gray-50 text-base">
                  {MEALS.map(meal => <option key={meal} value={meal}>{meal}</option>)}
                </select>
              </div>
              <div className="relative">
                <label htmlFor="meal-input" className="block text-sm font-semibold text-gray-700 mb-2">✨ Meal Name</label>
                <input 
                  ref={inputRef}
                  id="meal-input"
                  type="text" 
                  value={mealInput} 
                  onChange={(e) => setMealInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="e.g., Pasta Primavera" 
                  className={`w-full p-3 border rounded-xl bg-gray-50 text-base ${inputError ? 'animate-shake border-red-400' : 'border-gray-200'}`}
                  autoComplete="off"
                />
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border z-20 max-h-48 overflow-y-auto">
                    <p className="text-xs text-gray-400 p-2 border-b">💡 Suggestions for {currentMeal}</p>
                    {MEAL_SUGGESTIONS[currentMeal].map((suggestion, idx) => (
                      <button key={idx} type="button" onClick={() => selectSuggestion(suggestion)} className="w-full text-left px-4 py-3 hover:bg-orange-50 active:bg-orange-100 text-gray-700 text-sm flex items-center gap-2">
                        <span className="text-orange-400">+</span> {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn-press w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all">
                Add to Plan 🎯
              </button>
            </form>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
              {filledSlots > 0 && <button onClick={clearAllMeals} className="text-sm text-gray-400 hover:text-red-500 px-3 py-1.5 hover:bg-red-50 rounded">🗑️ Clear all</button>}
              <button onClick={generateGroceryList} className="text-sm text-gray-400 hover:text-green-500 px-3 py-1.5 hover:bg-green-50 rounded">🛒 Groceries</button>
            </div>
          </section>

          {/* Weekly Plan */}
          <section className="md:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-lg border-t-4 border-amber-400 order-2 md:order-none">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">📅 Your Weekly Plan</h2>
            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-4 md:max-h-[600px] md:overflow-y-auto swipe-container -mx-4 px-4 md:mx-0 md:pr-2">
              {DAYS.map((day, index) => {
                const dayMeals = MEALS.filter(meal => getMeal(day, meal));
                const dayProgress = dayMeals.length;
                return (
                  <article key={day} className={`swipe-item flex-shrink-0 w-[260px] md:w-auto bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 md:p-4 border border-orange-100 ${dayProgress === 3 ? 'ring-2 ring-green-400' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                        <span className={`w-7 h-7 md:w-8 md:h-8 ${dayProgress === 3 ? 'bg-green-500' : 'bg-orange-400'} text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold`}>
                          {dayProgress === 3 ? '✓' : index + 1}
                        </span>
                        {day.slice(0, 3)}
                      </h3>
                      <span className="text-xs text-gray-400">{dayProgress}/3</span>
                    </div>
                    <div className="space-y-2">
                      {MEALS.map(meal => {
                        const mealValue = getMeal(day, meal);
                        const isRecent = recentlyAdded === `${day}-${meal}`;
                        const hasRecipe = mealValue && RECIPES[mealValue];
                        return (
                          <div key={meal} className={`group bg-white/80 rounded-lg p-2 md:p-2.5 text-xs md:text-sm ${isRecent ? 'animate-success ring-2 ring-green-400' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-orange-600">{meal === 'Breakfast' ? '🌅' : meal === 'Lunch' ? '☀️' : '🌙'}</span>
                                {hasRecipe ? (
                                  <button onClick={() => openRecipe(mealValue)} className="ml-1 text-gray-700 font-medium hover:text-orange-600 active:text-orange-700 underline decoration-dotted truncate">
                                    {mealValue}
                                  </button>
                                ) : (
                                  <span className={`ml-1 ${mealValue ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>{mealValue || 'Not planned'}</span>
                                )}
                              </div>
                              {mealValue && (
                                <button onClick={() => removeMeal(day, meal)} className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-500 rounded">✕</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-10 mb-20 md:mb-0 bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">🍽️</span>
              <span className="font-bold text-orange-600">BestMealMate</span>
              <span className="text-gray-400 text-xs md:text-sm">© 2026</span>
            </div>
            <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
              {isSyncing && <span className="flex items-center gap-1 text-orange-500"><span className="animate-spin">⟳</span> Syncing...</span>}
              <span className="text-green-500">● {filledSlots} meals</span>
              <span className="hidden md:inline">|</span>
              <a href="/privacy" className="hover:text-orange-500 hidden md:inline">Privacy</a>
              <a href="/terms" className="hover:text-orange-500 hidden md:inline">Terms</a>
              <a href="https://x.com/bestmealmate" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500" aria-label="X">𝕏</a>
            </div>
          </div>
        </footer>
      </section>

      {/* Modals */}
      <Modal isOpen={activeModal === 'grocery'} onClose={() => setActiveModal(null)} title="🛒 Grocery List">
        {groceryList.length > 0 ? (
          <div className="space-y-4">
            <ul className="space-y-2">
              {groceryList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => { navigator.clipboard.writeText(groceryList.join('\n')); showToast('Copied!', 'success'); }} className="w-full bg-green-500 text-white font-bold py-3 rounded-xl">
              📋 Copy List
            </button>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">Add meals first to generate your grocery list!</p>
        )}
      </Modal>

      <Modal isOpen={activeModal === 'recipes'} onClose={() => setActiveModal(null)} title="📖 Recipe Book">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(RECIPES).map(([name, recipe]) => (
            <button key={name} onClick={() => { setActiveModal(null); openRecipe(name); }} className="p-3 bg-orange-50 hover:bg-orange-100 rounded-xl text-left">
              <p className="font-semibold text-gray-800 text-sm">{name}</p>
              <p className="text-xs text-gray-500">{recipe.time} • {recipe.calories} cal</p>
            </button>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'favorites'} onClose={() => setActiveModal(null)} title="❤️ Family Favorites">
        <div className="grid grid-cols-2 gap-3">
          {['Tacos Night', 'Pizza Night', 'Pancakes', 'Pasta Primavera', 'Chicken Curry', 'Stir Fry'].map((fav, idx) => (
            <button key={idx} onClick={() => { selectSuggestion(fav); setActiveModal(null); }} className="p-4 bg-orange-50 hover:bg-orange-100 active:bg-orange-200 rounded-xl text-left transition-colors">
              <p className="font-semibold text-gray-800">{fav}</p>
              <p className="text-xs text-orange-600 mt-1">Tap to add →</p>
            </button>
          ))}
        </div>
      </Modal>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav md:hidden">
        <button onClick={() => { setActiveModal(null); mainContentRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="mobile-nav-item">
          <span>🏠</span>
          <span>Home</span>
        </button>
        <button onClick={() => setActiveModal('recipes')} className={`mobile-nav-item ${activeModal === 'recipes' ? 'active' : ''}`}>
          <span>📖</span>
          <span>Recipes</span>
        </button>
        <button onClick={generateGroceryList} className={`mobile-nav-item ${activeModal === 'grocery' ? 'active' : ''}`}>
          <span>🛒</span>
          <span>Grocery</span>
        </button>
        <button onClick={shareMealPlan} className="mobile-nav-item">
          <span>📤</span>
          <span>Share</span>
        </button>
      </nav>

      {/* Mobile Floating Action Button */}
      <button onClick={() => inputRef.current?.focus()} className="mobile-fab" aria-label="Add meal">
        ➕
      </button>

      <style jsx global>{`
        @media print {
          header, footer, nav, button, .skip-link, form, .mobile-bottom-nav, .mobile-fab { display: none !important; }
        }
      `}</style>
    </div>
  );
}
