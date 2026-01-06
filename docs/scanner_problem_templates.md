# ScannerBot Pro - Problem Templates

Copy these templates, fill in your details, and paste into Claude with the agent prompt for instant solutions.

---

## Table of Contents

### 🔴 CRITICAL (Scan Failures)
1. [Receipt Not Scanning](#1-receipt-not-scanning)
2. [Wrong Items Extracted](#2-wrong-items-extracted)
3. [Prices Not Matching](#3-prices-not-matching)
4. [Barcode Not Found](#4-barcode-not-found)
5. [Duplicate Items in Pantry](#5-duplicate-items-in-pantry)

### 🟠 URGENT (Data Quality)
6. [Wrong Category Assigned](#6-wrong-category-assigned)
7. [Wrong Expiration Date](#7-wrong-expiration-date)
8. [Quantity Parsing Error](#8-quantity-parsing-error)
9. [Store Not Recognized](#9-store-not-recognized)
10. [Multi-Language Receipt](#10-multi-language-receipt)

### 🟡 STANDARD (Feature Help)
11. [Long Receipt Handling](#11-long-receipt-handling)
12. [Weight-Based Items](#12-weight-based-items)
13. [Discount/Coupon Parsing](#13-discountcoupon-parsing)
14. [Manual Item Addition](#14-manual-item-addition)
15. [Bulk Barcode Scanning](#15-bulk-barcode-scanning)

---

## 🔴 CRITICAL Templates

---

### 1. Receipt Not Scanning

```
ISSUE: Receipt won't scan / no items detected

IMAGE DETAILS:
- File type: [JPEG / PNG / HEIC]
- File size: [X MB]
- Image dimensions: [if known]
- Source: [phone camera / screenshot / downloaded]

IMAGE QUALITY:
- [ ] Image is blurry
- [ ] Image is too dark
- [ ] Image is too bright/washed out
- [ ] Receipt is crumpled/folded
- [ ] Only partial receipt visible
- [ ] Receipt is faded
- [ ] Multiple receipts in image
- [ ] Image is rotated/sideways

RECEIPT TYPE:
- Store: [store name]
- Receipt format: [thermal paper / inkjet / digital]
- Length: [short / long / very long]

ERROR MESSAGE:
[Paste any error message received]

WHAT I'VE TRIED:
- [ ] Retaking photo
- [ ] Better lighting
- [ ] Flattening receipt
- [ ] Different angle
- [ ] Different device

Please help me:
1. Diagnose why it's not scanning
2. Tips for getting a better image
3. Alternative input method if image won't work
```

---

### 2. Wrong Items Extracted

```
ISSUE: Scanner extracted incorrect items from receipt

RECEIPT FROM: [Store name]

WHAT RECEIPT SHOWS:
1. [Actual item 1]: $[price]
2. [Actual item 2]: $[price]
3. [Actual item 3]: $[price]
[Continue for all items]

WHAT SCANNER DETECTED:
1. [Detected item 1]: $[price]
2. [Detected item 2]: $[price]
3. [Detected item 3]: $[price]
[Continue for all detected items]

SPECIFIC ERRORS:
- Item "[X]" was detected as "[Y]"
- Item "[X]" was missed entirely
- Item "[X]" was duplicated
- Price $[X] was read as $[Y]

RECEIPT CHARACTERISTICS:
- Font type: [standard / unusual]
- Abbreviations used: [list any]
- Item descriptions: [clear / abbreviated / cryptic]

CONFIDENCE SCORES:
[List confidence scores if available]

Please help me:
1. Why these specific items were misread
2. How to correct them
3. How to prevent this for future scans
```

---

### 3. Prices Not Matching

```
ISSUE: Extracted prices don't match receipt totals

RECEIPT TOTAL: $[X.XX]

EXTRACTED ITEMS:
1. [Item]: $[detected price] (actual: $[real price])
2. [Item]: $[detected price] (actual: $[real price])
[Continue for all items]

CALCULATED TOTAL FROM EXTRACTIONS: $[X.XX]
DIFFERENCE: $[X.XX]

POSSIBLE FACTORS:
- [ ] Sale/discount prices
- [ ] Weight-based items with per-lb pricing
- [ ] Buy-one-get-one deals
- [ ] Coupons applied
- [ ] Tax included in some items
- [ ] Member pricing
- [ ] Multi-buy discounts (2 for $5, etc.)

RECEIPT FORMAT:
- Price position: [end of line / beginning / after quantity]
- Discount shown: [separate line / inline]
- Tax shown: [separate / included]

Please help me:
1. Identify which prices are wrong
2. Understand the pricing format
3. Handle discounts properly
```

---

### 4. Barcode Not Found

```
ISSUE: Barcode scan returns no product information

BARCODE DETAILS:
- Barcode number: [paste barcode]
- Barcode type: [UPC-A / UPC-E / EAN-13 / EAN-8 / QR]
- Product type: [what the product actually is]

PRODUCT INFO (what I know):
- Name: [product name]
- Brand: [brand]
- Size: [size/quantity]
- Store purchased: [store name]

SCAN RESULT:
- [ ] "Product not found"
- [ ] Wrong product returned
- [ ] Partial information only
- [ ] Timeout/error

WHAT I'VE TRIED:
- [ ] Rescanning barcode
- [ ] Different lighting
- [ ] Manual barcode entry
- [ ] Different scanning angle

Please help me:
1. Why this barcode isn't in the database
2. How to add it manually
3. Alternative ways to identify this product
```

---

### 5. Duplicate Items in Pantry

```
ISSUE: Same items appearing multiple times after scan

DUPLICATE ITEMS:
1. "[Item name]" appears [X] times
   - Entry 1: [quantity, date added]
   - Entry 2: [quantity, date added]
   - Entry 3: [quantity, date added]

HOW DUPLICATES OCCURRED:
- [ ] Scanned same receipt twice
- [ ] Item was on receipt multiple times (legit)
- [ ] Scanner split one item into multiple
- [ ] Similar items detected as same

CURRENT PANTRY COUNT: [X] items
EXPECTED COUNT: [X] items

MERGE PREFERENCE:
- [ ] Combine quantities into one entry
- [ ] Keep separate (different expiration dates)
- [ ] Delete duplicates entirely
- [ ] Not sure

Please help me:
1. Identify true duplicates vs intentional multiples
2. Best way to merge or clean up
3. Prevent duplicates on future scans
```

---

## 🟠 URGENT Templates

---

### 6. Wrong Category Assigned

```
ISSUE: Items categorized incorrectly

MISCATEGORIZED ITEMS:
1. "[Item]" categorized as [assigned] - should be [correct]
2. "[Item]" categorized as [assigned] - should be [correct]
3. "[Item]" categorized as [assigned] - should be [correct]

IMPACT:
- [ ] Wrong storage location suggested
- [ ] Wrong expiration date calculated
- [ ] Recipe matching affected
- [ ] Reporting/analytics wrong

ITEM DETAILS:
For "[Item 1]":
- Raw text from receipt: [exact text]
- What it actually is: [description]
- Correct category: [category]
- Correct storage: [fridge/freezer/pantry]

Please help me:
1. Correct these categories
2. Understand why miscategorized
3. Improve future categorization
```

---

### 7. Wrong Expiration Date

```
ISSUE: Estimated expiration date is incorrect

ITEMS WITH WRONG DATES:
1. "[Item]": 
   - Assigned expiration: [date]
   - Actual expiration: [date on package or realistic estimate]
   - Off by: [X] days

2. "[Item]":
   - Assigned expiration: [date]
   - Actual expiration: [date]
   - Off by: [X] days

CONTEXT:
- Purchase date: [date]
- My storage conditions: [describe]
- Package type: [fresh/sealed/canned/frozen]

PREFERENCES:
- [ ] I prefer conservative estimates (earlier dates)
- [ ] I prefer realistic estimates
- [ ] I want to enter actual dates from packages

Please help me:
1. Correct these expiration dates
2. Understand the estimation logic
3. Adjust defaults for my preferences
```

---

### 8. Quantity Parsing Error

```
ISSUE: Item quantities are wrong

QUANTITY ERRORS:
1. "[Item]":
   - Receipt shows: [what receipt says]
   - Detected: [quantity] [unit]
   - Actual: [quantity] [unit]

2. "[Item]":
   - Receipt shows: [what receipt says]
   - Detected: [quantity] [unit]
   - Actual: [quantity] [unit]

RECEIPT FORMATS SEEN:
- "2 @ $3.99" means: [2 items at $3.99 each]
- "1.5 LB" means: [1.5 pounds]
- "ORGANIC BNLS CHICKEN 2.3#" means: [2.3 pounds]

COMMON ISSUES:
- [ ] Pounds vs count confusion
- [ ] Multi-pack not recognized
- [ ] Weight codes misread
- [ ] "Each" vs package confusion

Please help me:
1. Correct these quantities
2. Understand this store's format
3. Handle weight-based items better
```

---

### 9. Store Not Recognized

```
ISSUE: Scanner doesn't recognize my store's receipt format

STORE DETAILS:
- Store name: [name]
- Store type: [grocery/wholesale/specialty/farmers market]
- Location: [city/state]
- Chain or independent: [chain name or "independent"]

RECEIPT CHARACTERISTICS:
- Header format: [describe]
- Item line format: [describe]
- Price position: [end/start/middle]
- Uses abbreviations: [yes/no, examples]
- Has loyalty discounts: [yes/no]

SAMPLE RECEIPT LINES:
[Paste 5-10 actual lines from receipt]

CURRENT RESULTS:
- Items detected: [X] of [Y] actual
- Accuracy: [estimate %]
- Common errors: [describe]

Please help me:
1. Parse this store's format
2. Create a profile for this store
3. Handle their abbreviations
```

---

### 10. Multi-Language Receipt

```
ISSUE: Receipt contains multiple languages or non-English text

LANGUAGES ON RECEIPT:
- Primary language: [language]
- Secondary language: [if any]
- Script type: [Latin/Cyrillic/Asian/etc.]

RECEIPT FROM:
- Store: [store name]
- Country: [country]
- Store type: [local/international chain]

SAMPLE TEXT:
[Paste receipt text in original language]

WHAT I NEED:
- [ ] Translate items to English
- [ ] Keep original language
- [ ] Both (original + translation)

SPECIFIC CHALLENGES:
- [ ] Special characters not rendering
- [ ] Item names not translating
- [ ] Prices in different format (comma vs period)
- [ ] Currency conversion needed

Please help me:
1. Parse this receipt correctly
2. Translate or transliterate items
3. Handle currency/number formats
```

---

## 🟡 STANDARD Templates

---

### 11. Long Receipt Handling

```
ISSUE: Receipt is too long for single photo

RECEIPT DETAILS:
- Approximate length: [X] inches / [X] cm
- Number of items: [estimate]
- Store: [store name]

CURRENT APPROACH:
- [ ] Single photo (items cut off)
- [ ] Multiple overlapping photos
- [ ] Scrolling screenshot
- [ ] Typing manually

PHOTOS TAKEN: [X] photos

OVERLAP BETWEEN PHOTOS:
- [ ] Photos overlap by a few items
- [ ] Photos don't overlap (gap in items)
- [ ] Not sure

Please help me:
1. Best way to capture long receipts
2. How to merge multiple photos
3. Handle duplicate items from overlaps
```

---

### 12. Weight-Based Items

```
ISSUE: Weight-based items not parsing correctly

ITEMS WITH WEIGHT PRICING:
1. "[Item]":
   - Receipt shows: [exact text]
   - Weight: [X.XX] [lb/kg]
   - Price per unit: $[X.XX] /[lb/kg]
   - Total price: $[X.XX]
   - Detected as: [what scanner got]

2. "[Item]":
   - Receipt shows: [exact text]
   - Weight: [X.XX] [lb/kg]
   - Price per unit: $[X.XX] /[lb/kg]
   - Total price: $[X.XX]
   - Detected as: [what scanner got]

STORE FORMAT:
- Weight shown: [before/after item name]
- Unit price shown: [yes/no]
- Uses PLU codes: [yes/no]

Please help me:
1. Parse these items correctly
2. Store weight as quantity
3. Track cost per unit for budgeting
```

---

### 13. Discount/Coupon Parsing

```
ISSUE: Discounts and coupons not handled correctly

DISCOUNT TYPES ON RECEIPT:
- [ ] Sale prices (reduced from regular)
- [ ] BOGO (buy one get one)
- [ ] Digital coupons
- [ ] Paper coupons
- [ ] Member/loyalty discounts
- [ ] Manager markdowns
- [ ] Multi-buy (3 for $5, etc.)

SPECIFIC EXAMPLES:
1. "[Item]" - Regular: $[X], Sale: $[Y], Detected: $[Z]
2. "[Item]" - BOGO deal, detected as: [what happened]
3. "[Coupon]" - $[X] off, applied to: [item]

RECEIPT FORMAT FOR DISCOUNTS:
[Paste example of how discounts appear on receipt]

PREFERRED HANDLING:
- [ ] Track original price
- [ ] Track paid price only
- [ ] Track both with savings
- [ ] Ignore discounts

Please help me:
1. Parse discounts correctly
2. Track savings for budgeting
3. Handle complex deals (BOGO, multi-buy)
```

---

### 14. Manual Item Addition

```
HELP: Adding items manually without receipt

ITEMS TO ADD:
1. Name: [item name]
   Brand: [brand or "generic"]
   Quantity: [amount]
   Size/Unit: [e.g., "1 gallon", "2 lbs"]
   Category: [if known]
   Where stored: [fridge/freezer/pantry]
   Purchase date: [date]
   Expiration: [date if on package, or "estimate"]
   Price paid: $[X.XX]

2. [Repeat for additional items]

SOURCE:
- [ ] Farmers market (no receipt)
- [ ] Gift from someone
- [ ] Home garden
- [ ] Transferred from another location
- [ ] Lost receipt

Please help me:
1. Categorize these items correctly
2. Estimate expiration if not provided
3. Determine storage location
4. Add to pantry efficiently
```

---

### 15. Bulk Barcode Scanning

```
HELP: Need to scan many barcodes quickly

SCENARIO:
- Number of items: [X]
- Time available: [X] minutes
- Items are: [on shelf / in bags / scattered]

CURRENT METHOD:
[Describe current approach]

CHALLENGES:
- [ ] Scanning one by one is slow
- [ ] Some barcodes don't scan
- [ ] Losing track of what's scanned
- [ ] Items not in barcode database
- [ ] Battery/app performance issues

EQUIPMENT:
- [ ] Phone camera
- [ ] Dedicated barcode scanner
- [ ] Tablet
- [ ] Other: [describe]

Please help me:
1. Fastest workflow for bulk scanning
2. Handle items not in database
3. Verify all items captured
4. Batch add to pantry
```

---

## Quick Reference: Which Template to Use

| Situation | Template # |
|-----------|-----------|
| Receipt won't scan at all | #1 |
| Wrong items detected | #2 |
| Prices don't add up | #3 |
| Barcode not in database | #4 |
| Duplicate pantry entries | #5 |
| Wrong category | #6 |
| Wrong expiration | #7 |
| Wrong quantity/unit | #8 |
| Unknown store format | #9 |
| Non-English receipt | #10 |
| Very long receipt | #11 |
| Meat/produce by weight | #12 |
| Sales/coupons/BOGO | #13 |
| No receipt (manual entry) | #14 |
| Many items to scan | #15 |

---

## Pro Tips

1. **Best Photo Quality**: Flat surface, good lighting, fill the frame
2. **Long Receipts**: Take overlapping photos, better than one blurry one
3. **Review Queue**: Check uncertain items weekly
4. **Corrections Help**: Every correction improves future accuracy
5. **Barcode Fallback**: If barcode fails, photo of product helps
6. **Multiple Receipt Types**: Digital receipts often scan better than thermal

---

**ScannerBot Pro is ready to help! 📱🛒**
