# ChefBot Pro - Problem Templates

Copy these templates, fill in your details, and paste into Claude with the agent prompt for instant solutions.

---

## Table of Contents

### 🔴 CRITICAL (Food Safety / Waste Prevention)
1. [Food Expiring Today](#1-food-expiring-today)
2. [Multiple Items Expiring This Week](#2-multiple-items-expiring-this-week)
3. [Suspected Spoiled Food](#3-suspected-spoiled-food)
4. [Allergy Concern](#4-allergy-concern)
5. [Cross-Contamination Question](#5-cross-contamination-question)

### 🟠 URGENT (Meal Planning / Budget)
6. [Need Dinner in 30 Minutes](#6-need-dinner-in-30-minutes)
7. [Weekly Meal Plan Request](#7-weekly-meal-plan-request)
8. [Grocery Budget Tight](#8-grocery-budget-tight)
9. [Guest Coming with Dietary Restriction](#9-guest-coming-with-dietary-restriction)
10. [Batch Cooking Session](#10-batch-cooking-session)

### 🟡 STANDARD (Daily Cooking Help)
11. [Missing Key Ingredient](#11-missing-key-ingredient)
12. [Recipe Scaling](#12-recipe-scaling)
13. [Leftover Transformation](#13-leftover-transformation)
14. [Picky Eater Accommodation](#14-picky-eater-accommodation)
15. [Healthy Swap Request](#15-healthy-swap-request)

### 🟢 OPTIMIZATION (Recipe Improvement)
16. [Recipe Modification](#16-recipe-modification)
17. [Preservation Question](#17-preservation-question)
18. [Nutrition Analysis](#18-nutrition-analysis)
19. [Meal Prep Optimization](#19-meal-prep-optimization)
20. [Seasonal Cooking](#20-seasonal-cooking)

---

## 🔴 CRITICAL Templates

---

### 1. Food Expiring Today

```
URGENT: Food expiring TODAY that I need to use

EXPIRING ITEMS:
- [Item 1]: [quantity] [unit] (location: fridge/freezer/pantry)
- [Item 2]: [quantity] [unit] (location)
- [Item 3]: [quantity] [unit] (location)

HOUSEHOLD:
- Number of people eating: [X]
- Dietary restrictions: [list any]
- Allergies: [list any]

TIME AVAILABLE:
- [ ] Less than 15 minutes
- [ ] 15-30 minutes
- [ ] 30-60 minutes
- [ ] More than 1 hour

OTHER INGREDIENTS I HAVE:
[List main staples you have available - pasta, rice, eggs, etc.]

EQUIPMENT:
- [ ] Stove
- [ ] Oven
- [ ] Instant Pot
- [ ] Air Fryer
- [ ] Grill
- [ ] Slow Cooker

Please suggest:
1. Recipe that uses ALL expiring items if possible
2. What can be frozen instead if I can't cook everything
3. Priority order if I can only save some items
```

---

### 2. Multiple Items Expiring This Week

```
HELP: Multiple ingredients expiring this week

ITEMS BY EXPIRATION:
Day 1 (tomorrow):
- [Item]: [quantity]

Day 2-3:
- [Item]: [quantity]
- [Item]: [quantity]

Day 4-7:
- [Item]: [quantity]
- [Item]: [quantity]
- [Item]: [quantity]

HOUSEHOLD DETAILS:
- Family size: [X] people
- Ages: [adults/kids]
- Dietary restrictions: [list]
- Weekly food budget: $[X]

COOKING PREFERENCES:
- Skill level: [beginner/intermediate/advanced]
- Meals needed: [breakfast/lunch/dinner]
- Prep style preference: [daily cooking / batch prep / mix]

AVAILABLE TIME THIS WEEK:
- Weekdays: [X] minutes per meal
- Weekend: [X] hours available for batch cooking

Please provide:
1. 7-day meal plan using expiring items first
2. What to freeze NOW to extend life
3. Grocery list for any missing essentials
4. Which items are lost causes (okay to discard)
```

---

### 3. Suspected Spoiled Food

```
FOOD SAFETY: Is this food still safe?

ITEM: [Name of food]
TYPE: [Meat/Dairy/Produce/Prepared food/etc.]

STORAGE:
- Stored in: [fridge/freezer/pantry/counter]
- Temperature setting: [if known]
- Original packaging: [yes/no/opened]
- Date purchased: [date]
- Best by/Use by date: [date]
- Date opened: [date, if applicable]

OBSERVATIONS:
- Color: [describe any changes]
- Smell: [describe - sour, ammonia, off, normal]
- Texture: [slimy, mushy, hard, normal]
- Visible issues: [mold color/location, discoloration, etc.]

SITUATION:
- [ ] Been in fridge the whole time
- [ ] Was left out for [X] hours
- [ ] Power outage occurred [duration]
- [ ] Not sure of storage history

Please advise:
1. Is this safe to eat?
2. What signs should have told me earlier?
3. How to prevent this in future
4. If unsafe, what's the proper disposal?
```

---

### 4. Allergy Concern

```
ALLERGY SAFETY: Need allergy-safe recipe

PERSON WITH ALLERGY:
- Name/role: [family member name]
- Age: [if child/senior]
- Allergy severity: [mild intolerance / moderate / severe anaphylaxis]

ALLERGENS TO AVOID:
- [ ] Peanuts
- [ ] Tree nuts (specify: ____________)
- [ ] Dairy
- [ ] Eggs
- [ ] Wheat/Gluten
- [ ] Soy
- [ ] Fish
- [ ] Shellfish
- [ ] Sesame
- [ ] Other: ____________

RECIPE I WANT TO MAKE:
[Paste recipe name or description]

QUESTIONS:
1. What ingredients contain hidden allergens?
2. What substitutions are safe?
3. Cross-contamination concerns in my kitchen?
4. Safe brands you recommend?

OTHER FAMILY MEMBERS EATING:
- [ ] Same dietary needs
- [ ] Different (need separate prep?)
```

---

### 5. Cross-Contamination Question

```
FOOD SAFETY: Cross-contamination concern

SITUATION:
[Describe what happened - e.g., "Used same cutting board for raw chicken then vegetables"]

RAW ITEM:
- Type: [raw chicken/beef/pork/fish/eggs]
- Contact surface: [cutting board/counter/knife/hands]

CONTAMINATED ITEM(S):
- [Item 1]: [eaten raw? / will be cooked?]
- [Item 2]: [eaten raw? / will be cooked?]

TIME ELAPSED:
- Contamination occurred: [how long ago]
- Items been sitting at room temp: [duration]

ACTIONS TAKEN:
- [ ] Washed contaminated items
- [ ] Sanitized surfaces
- [ ] Changed utensils
- [ ] Nothing yet

Please advise:
1. Is the food safe to eat?
2. What should I discard?
3. Proper cleanup procedure now
4. Prevention for next time
```

---

## 🟠 URGENT Templates

---

### 6. Need Dinner in 30 Minutes

```
QUICK MEAL: Need dinner FAST

TIME: [exact minutes available]

WHAT I HAVE (checked my pantry/fridge):
Protein:
- [ ] Chicken breast
- [ ] Ground beef
- [ ] Eggs
- [ ] Canned tuna
- [ ] Tofu
- [ ] Shrimp (frozen)
- [ ] Other: ____________

Carbs:
- [ ] Pasta
- [ ] Rice (cooked? uncooked?)
- [ ] Bread
- [ ] Tortillas
- [ ] Potatoes
- [ ] Other: ____________

Vegetables:
- [ ] Onions
- [ ] Garlic
- [ ] Bell peppers
- [ ] Spinach/greens
- [ ] Tomatoes
- [ ] Frozen vegetables
- [ ] Other: ____________

Staples:
- [ ] Olive oil
- [ ] Butter
- [ ] Soy sauce
- [ ] Canned tomatoes
- [ ] Chicken broth
- [ ] Cheese
- [ ] Other: ____________

HOUSEHOLD:
- Feeding: [X] people
- Kids: [ages if relevant]
- Must avoid: [dietary restrictions/allergies]
- Picky eater notes: ____________

EQUIPMENT READY:
- [ ] Stovetop only
- [ ] Oven (preheated?)
- [ ] Instant Pot
- [ ] Air Fryer
- [ ] Microwave

Please give me ONE recipe with:
1. Exact timing breakdown
2. Ingredients I'll need from above
3. Step-by-step instructions
4. Any shortcuts to save time
```

---

### 7. Weekly Meal Plan Request

```
MEAL PLANNING: Need full week plan

HOUSEHOLD:
- Adults: [X]
- Children: [ages]
- Total servings per meal: [X]

DIETARY REQUIREMENTS:
Person 1 ([name/role]): [restrictions]
Person 2 ([name/role]): [restrictions]
Person 3 ([name/role]): [restrictions]

MEALS TO PLAN:
- [ ] Breakfast
- [ ] Lunch  
- [ ] Dinner
- [ ] Snacks

WEEK SCHEDULE:
Monday: [available time for cooking]
Tuesday: [available time]
Wednesday: [available time]
Thursday: [available time]
Friday: [available time]
Saturday: [available time]
Sunday: [available time]

CONSTRAINTS:
- Weekly grocery budget: $[X]
- Cooking skill: [beginner/intermediate/advanced]
- Batch cooking day: [day, if any]
- Leftovers okay: [yes/no/which days]

PREFERENCES:
- Cuisine types we enjoy: ____________
- Recipes we're tired of: ____________
- Must include: ____________
- Must avoid (besides allergies): ____________

PANTRY ITEMS TO USE UP:
[List expiring or excess items]

Please provide:
1. Day-by-day meal plan
2. Prep schedule (what to prep when)
3. Complete grocery list (organized by section)
4. Estimated total cost
5. Recipes for anything complex
```

---

### 8. Grocery Budget Tight

```
BUDGET HELP: Need to stretch food budget

SITUATION:
- Budget for groceries: $[X] for [X] days/weeks
- Number of people: [X]
- Current pantry status: [well-stocked / running low / nearly empty]

WHAT I ALREADY HAVE:
[List everything you have - be thorough]

MEALS NEEDED:
- Breakfasts: [X]
- Lunches: [X]
- Dinners: [X]

DIETARY MUSTS:
- Allergies: [list]
- Restrictions: [list]
- Growing children needing nutrition: [yes/no]

RESOURCES:
- [ ] Have rice/pasta/beans
- [ ] Have basic spices
- [ ] Have cooking oil
- [ ] Access to discount grocery store
- [ ] Can buy in bulk
- [ ] Have freezer space

Please provide:
1. Optimal grocery list for budget
2. Meals I can make with what I have
3. Bulk items worth buying
4. Items to skip (not worth cost)
5. Meal plan stretching the budget
6. Protein alternatives if meat is too expensive
```

---

### 9. Guest Coming with Dietary Restriction

```
GUEST DINNER: Accommodating dietary needs

EVENT:
- Date/Time: [when]
- Meal type: [lunch/dinner/party]
- Number of guests: [X]
- Formality: [casual/nice/special occasion]

GUEST'S DIETARY NEEDS:
- Restriction type: [vegan/vegetarian/kosher/halal/keto/etc.]
- Allergies: [list]
- Severity: [preference / medical necessity / life-threatening]

OTHER GUESTS' NEEDS:
[List any other restrictions to accommodate]

MY COOKING SKILL:
[beginner/intermediate/advanced]

TIME TO PREP:
[How much time before guests arrive]

BUDGET:
$[X] for this meal

I WAS THINKING OF MAKING:
[Your original idea, if any]

EQUIPMENT I HAVE:
[List special equipment - grill, instant pot, etc.]

Please suggest:
1. Main dish everyone can eat
2. Sides that accommodate all needs
3. Dessert option
4. How to handle separate prep if needed
5. What to tell guest to make them comfortable
```

---

### 10. Batch Cooking Session

```
BATCH COOKING: Planning prep session

TIME AVAILABLE: [X] hours on [day]

GOALS:
- Meals to prep for: [X] days/week
- Storage available: [fridge space / freezer space]
- Containers: [yes/no/need to buy]

HOUSEHOLD:
- Feeding: [X] people
- Dietary needs: [list]

MEALS TO BATCH:
- [ ] Breakfasts
- [ ] Lunches (work/school)
- [ ] Dinners
- [ ] Snacks

PREFERENCES:
- Cuisines: [preferences]
- Variety needed: [same meals okay / need variety]
- Freezer meals okay: [yes/no]

EQUIPMENT:
- [ ] Large pots
- [ ] Sheet pans
- [ ] Slow cooker
- [ ] Instant Pot
- [ ] Food processor
- [ ] Stand mixer

BUDGET: $[X] for ingredients

I WANT TO PREP:
[Any specific recipes in mind]

Please provide:
1. Batch cooking schedule (order of operations)
2. Recipes optimized for batch cooking
3. Shopping list
4. Storage instructions for each item
5. Reheating instructions
6. How long each will keep
```

---

## 🟡 STANDARD Templates

---

### 11. Missing Key Ingredient

```
SUBSTITUTION: Need to replace ingredient

RECIPE I'M MAKING:
[Recipe name or brief description]

MISSING INGREDIENT:
- Item: [what's missing]
- Amount needed: [quantity + unit]
- Role in recipe: [binding/leavening/flavor/texture/liquid/etc.]

WHAT I HAVE THAT MIGHT WORK:
[List potential substitutes you have]

DIETARY CONSIDERATIONS:
[Any restrictions to consider for substitution]

QUESTIONS:
1. Best substitute from what I have?
2. Ratio/amount to use?
3. Any technique changes needed?
4. Will it affect the final result? How?
```

---

### 12. Recipe Scaling

```
SCALING: Need different serving size

ORIGINAL RECIPE:
[Name or paste recipe]

ORIGINAL SERVINGS: [X]
TARGET SERVINGS: [X]

SCALING DIRECTION:
- [ ] Scaling UP (making more)
- [ ] Scaling DOWN (making less)

CONCERNS:
- [ ] Cooking time adjustment
- [ ] Pan/pot size
- [ ] Ingredient ratio (eggs, leavening)
- [ ] Seasoning levels

EQUIPMENT I HAVE:
[List pot/pan sizes available]

Please provide:
1. Scaled ingredient list
2. Adjusted cooking time/temp if needed
3. Equipment recommendations
4. Tips for this scaled version
5. Can I make ahead/freeze extra?
```

---

### 13. Leftover Transformation

```
LEFTOVERS: Transform into new meal

WHAT I HAVE LEFT:
- [Leftover 1]: [amount]
- [Leftover 2]: [amount]
- [Leftover 3]: [amount]

ORIGINAL DISHES:
[What these leftovers came from]

HOW OLD:
[When were they cooked]

ADDITIONAL INGREDIENTS I HAVE:
[List what else is in fridge/pantry]

HOUSEHOLD:
- Feeding: [X] people
- Restrictions: [list]

PREFERENCES:
- [ ] Make it taste completely different
- [ ] Similar flavor profile okay
- [ ] Lunch vs dinner
- [ ] Kid-friendly needed

TIME AVAILABLE: [X] minutes

Please suggest:
1. 2-3 transformation ideas
2. Recipe for top choice
3. How to prevent leftover fatigue
4. What keeps well for another day
```

---

### 14. Picky Eater Accommodation

```
PICKY EATER: Need to accommodate selectiveness

PICKY PERSON:
- Age: [child/teen/adult]
- Name/role: [family member]

WILL EAT:
[List accepted foods - be specific]

WON'T EAT:
[List rejected foods]

SPECIFIC ISSUES:
- [ ] Texture sensitivity
- [ ] Color aversion
- [ ] "New food" fear
- [ ] Won't eat mixed foods
- [ ] Only eats specific brands
- [ ] Other: ____________

MEAL I WANT TO MAKE:
[What you want to cook for everyone else]

OTHER FAMILY MEMBERS:
[Their needs/preferences]

NUTRITION CONCERNS:
[Is picky eater getting enough nutrients?]

Please suggest:
1. How to adapt the meal for picky eater
2. Deconstructed version possibility
3. Hidden veggie tricks (if applicable)
4. Gradual exposure strategies
5. Separate simple option if needed
```

---

### 15. Healthy Swap Request

```
HEALTHIER VERSION: Want to modify recipe

ORIGINAL RECIPE:
[Name or paste recipe]

HEALTH GOALS:
- [ ] Reduce calories
- [ ] Lower sodium
- [ ] Reduce sugar
- [ ] Lower fat
- [ ] Lower carbs
- [ ] Add protein
- [ ] Add fiber
- [ ] Add vegetables
- [ ] Make whole grain
- [ ] Other: ____________

SPECIFIC CONDITION:
[diabetes/heart disease/etc. if relevant]

TASTE PRIORITY:
- [ ] Health is #1, taste compromise okay
- [ ] Need to taste similar to original
- [ ] Feeding picky people, must be close

INGREDIENTS I CAN'T USE:
[Any restrictions]

INGREDIENTS I HAVE:
[Healthy alternatives you have on hand]

Please provide:
1. Healthified recipe with swaps explained
2. Nutrition comparison (before/after)
3. Taste/texture impact warning
4. Tips to make it taste great despite changes
```

---

## 🟢 OPTIMIZATION Templates

---

### 16. Recipe Modification

```
MODIFY RECIPE: Want to change/improve

ORIGINAL RECIPE:
[Paste or describe recipe]

WHAT I WANT TO CHANGE:
- [ ] Make it spicier
- [ ] Make it milder
- [ ] Add more flavor
- [ ] Change cuisine style
- [ ] Make it vegetarian/vegan
- [ ] Add a protein
- [ ] Make it one-pot
- [ ] Speed it up
- [ ] Other: ____________

REASON FOR CHANGE:
[Why do you want to modify it?]

KEEPING THE SAME:
[What aspects must stay?]

INGREDIENTS I WANT TO ADD:
[Optional - anything you want included]

SKILL LEVEL: [beginner/intermediate/advanced]

Please provide:
1. Modified recipe
2. Explanation of changes
3. Any technique tips for modifications
4. How changes affect cooking time
```

---

### 17. Preservation Question

```
PRESERVATION: How to store/extend life

ITEM: [Food item]
QUANTITY: [Amount you have]

CURRENT STATE:
- Fresh / Cooked / Opened package
- Days until expiration: [X]
- Current storage: [room temp/fridge/freezer]

GOAL:
- [ ] Store longer (how long: ___ days/weeks)
- [ ] Freeze for later
- [ ] Can/preserve
- [ ] Best short-term storage
- [ ] Already frozen, need thaw instructions

EQUIPMENT I HAVE:
- [ ] Freezer space
- [ ] Vacuum sealer
- [ ] Canning supplies
- [ ] Dehydrator
- [ ] Nothing special

Please advise:
1. Best preservation method
2. Step-by-step instructions
3. How long it will keep
4. Quality impact
5. Best way to use after preservation
```

---

### 18. Nutrition Analysis

```
NUTRITION: Need nutritional information

REQUEST TYPE:
- [ ] Single recipe analysis
- [ ] Daily meal plan analysis
- [ ] Comparison between options
- [ ] Help hitting nutrition goals

RECIPE/MEAL:
[Paste recipe or describe meals]

SERVINGS: [X]

NUTRITION GOALS:
- Daily calories target: [X]
- Protein goal: [X]g
- Carb limit: [X]g
- Sodium limit: [X]mg
- Other: ____________

HEALTH CONTEXT:
[Any conditions affecting nutrition needs]

PLEASE PROVIDE:
1. Estimated nutrition per serving
2. How it fits my goals
3. Suggestions to improve nutrition
4. Comparison to alternatives if requested
```

---

### 19. Meal Prep Optimization

```
OPTIMIZE: Improve my meal prep efficiency

CURRENT ROUTINE:
[Describe your current meal prep approach]

PAIN POINTS:
- [ ] Takes too long
- [ ] Food goes bad before I eat it
- [ ] Get bored of same meals
- [ ] Don't know what to prep
- [ ] Hate certain prep tasks
- [ ] Other: ____________

TIME AVAILABLE:
- Prep day: [day] for [hours]
- Weeknight cooking time: [minutes]

HOUSEHOLD:
- Feeding: [X] people
- Different lunches needed: [yes/no]

STORAGE:
- Fridge containers: [X]
- Freezer space: [available/limited/none]

EQUIPMENT:
[List meal prep helpful equipment]

BUDGET: $[X]/week for groceries

Please help me:
1. Optimize my prep day schedule
2. Best recipes for meal prep
3. Storage tips for freshness
4. Variety strategies
5. Time-saving techniques
```

---

### 20. Seasonal Cooking

```
SEASONAL: Help with seasonal cooking

SEASON/MONTH: [current season or month]
LOCATION: [region for local produce]

WHAT'S IN SEASON:
[List seasonal produce you've seen available]

GOALS:
- [ ] Use seasonal produce
- [ ] Save money with seasonal items
- [ ] Try new seasonal recipes
- [ ] Preserve seasonal abundance
- [ ] Holiday/occasion cooking

HOUSEHOLD:
- Feeding: [X] people
- Restrictions: [list]

CUISINE PREFERENCES:
[What styles of cooking you enjoy]

SPECIFIC PRODUCE TO USE:
[Any specific seasonal items you have]

Please provide:
1. What's at peak season now
2. Recipe suggestions using seasonal items
3. How to pick the best produce
4. Preservation for off-season
5. Seasonal meal plan ideas
```

---

## Quick Reference: Which Template to Use

| Situation | Template # |
|-----------|-----------|
| Food expiring TODAY | #1 |
| Multiple items expiring | #2 |
| Is this food safe? | #3 |
| Cooking for allergies | #4 |
| Cross-contamination | #5 |
| Need dinner FAST | #6 |
| Weekly meal planning | #7 |
| Tight budget | #8 |
| Guest with diet needs | #9 |
| Batch cooking | #10 |
| Missing ingredient | #11 |
| Different serving size | #12 |
| Using leftovers | #13 |
| Picky eater help | #14 |
| Make it healthier | #15 |
| Change a recipe | #16 |
| Store food longer | #17 |
| Nutrition info | #18 |
| Better meal prep | #19 |
| Seasonal cooking | #20 |

---

## Pro Tips

1. **Be specific** - The more details you provide, the better the answer
2. **Include restrictions** - Always mention allergies/diets, even if "none"
3. **List what you have** - Helps avoid suggestions requiring a store trip
4. **State your skill level** - Prevents getting recipes too complex/simple
5. **Mention equipment** - Not everyone has an Instant Pot or air fryer
6. **Time is crucial** - Always say how much time you have
7. **Follow up** - Ask clarifying questions if the first answer isn't quite right

---

**Your AI Chef is ready to help! 👨‍🍳🍳**
