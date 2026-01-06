# ScannerBot Pro - Implementation Guide

This guide shows you how to deploy ScannerBot Pro in your BestMealMate application, from simple receipt parsing to full OCR integration with pantry sync.

---

## Table of Contents

1. [Method 1: Claude Web (Testing)](#method-1-claude-web-testing)
2. [Method 2: Claude API (Basic OCR)](#method-2-claude-api-basic-ocr)
3. [Method 3: Full OCR Integration](#method-3-full-ocr-integration)
4. [Method 4: Production Service](#method-4-production-service)
5. [Barcode Integration](#barcode-integration)
6. [Database Schema](#database-schema)
7. [Best Practices](#best-practices)

---

## Method 1: Claude Web (Testing)

**Best for:** Testing receipt parsing logic, manual entry
**Setup time:** 30 seconds
**Requirements:** Claude.ai account with Vision

### Steps

1. Go to [claude.ai](https://claude.ai)
2. Start a new conversation
3. Copy the entire contents of `scanner_agent_prompt.md`
4. Paste it as your first message
5. Upload a receipt image and ask to parse it

### Example Session

```
[Message 1]: <paste scanner_agent_prompt.md contents>

[Message 2]: [Upload receipt image]

Parse this grocery receipt. Extract all food items with:
- Item name
- Quantity
- Price
- Suggested category
- Estimated expiration date (purchased today)
```

### Tips
- Claude Vision can read most receipt images
- Works best with clear, straight-on photos
- Good for testing before building full integration

---

## Method 2: Claude API (Basic OCR)

**Best for:** Simple receipt parsing, MVP features
**Setup time:** 15 minutes
**Requirements:** Anthropic API key

### Basic Implementation (TypeScript)

```typescript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const systemPrompt = fs.readFileSync('docs/scanner_agent_prompt.md', 'utf-8');

interface ParsedItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  category: string;
  storageLocation: 'fridge' | 'freezer' | 'pantry' | 'counter';
  estimatedExpirationDays: number;
  confidence: number;
}

interface ReceiptParseResult {
  store: string;
  date: string;
  items: ParsedItem[];
  subtotal: number;
  tax: number;
  total: number;
  rawText?: string;
}

async function parseReceiptImage(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg'
): Promise<ReceiptParseResult> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `Parse this grocery receipt. Return a JSON object with this exact structure:
{
  "store": "Store name",
  "date": "YYYY-MM-DD",
  "items": [
    {
      "name": "Item name",
      "quantity": 1,
      "unit": "each",
      "price": 0.00,
      "category": "produce_fruit",
      "storageLocation": "fridge",
      "estimatedExpirationDays": 7,
      "confidence": 0.95
    }
  ],
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00
}

For each item:
- Categorize into: produce_fruit, produce_vegetable, dairy, meat_poultry, meat_beef, meat_pork, seafood, bakery, frozen, canned_goods, dry_goods, snacks, beverages, condiments, non_food
- Determine storage: fridge, freezer, pantry, counter
- Estimate days until expiration based on category
- Set confidence (0-1) based on how clear the item text is

Return ONLY the JSON, no other text.`,
          },
        ],
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Parse the JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse receipt JSON');
  }

  return JSON.parse(jsonMatch[0]) as ReceiptParseResult;
}

// Usage
async function main() {
  const imageBuffer = fs.readFileSync('receipt.jpg');
  const base64 = imageBuffer.toString('base64');
  
  const result = await parseReceiptImage(base64, 'image/jpeg');
  
  console.log(`Store: ${result.store}`);
  console.log(`Date: ${result.date}`);
  console.log(`Items: ${result.items.length}`);
  console.log(`Total: $${result.total}`);
  
  for (const item of result.items) {
    console.log(`- ${item.name}: $${item.price} (${item.category}, expires in ${item.estimatedExpirationDays} days)`);
  }
}
```

### Python Implementation

```python
import anthropic
import base64
import json
from pathlib import Path

client = anthropic.Anthropic(api_key="your_api_key")

with open("docs/scanner_agent_prompt.md", "r") as f:
    system_prompt = f.read()

def parse_receipt_image(image_path: str) -> dict:
    """Parse a receipt image using Claude Vision"""
    
    # Read and encode image
    image_data = Path(image_path).read_bytes()
    base64_image = base64.standard_b64encode(image_data).decode("utf-8")
    
    # Determine media type
    suffix = Path(image_path).suffix.lower()
    media_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
    }
    media_type = media_types.get(suffix, 'image/jpeg')
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": base64_image,
                        },
                    },
                    {
                        "type": "text",
                        "text": """Parse this grocery receipt. Return JSON with:
{
  "store": "string",
  "date": "YYYY-MM-DD",
  "items": [{"name", "quantity", "unit", "price", "category", "storageLocation", "estimatedExpirationDays", "confidence"}],
  "subtotal": number,
  "tax": number,
  "total": number
}
Return ONLY valid JSON."""
                    }
                ],
            }
        ],
    )
    
    # Extract JSON from response
    text = response.content[0].text
    import re
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        return json.loads(json_match.group())
    raise ValueError("Could not parse receipt")


# Usage
result = parse_receipt_image("receipt.jpg")
print(f"Found {len(result['items'])} items totaling ${result['total']}")
```

---

## Method 3: Full OCR Integration

**Best for:** Production apps with high volume
**Setup time:** 1 hour
**Requirements:** Anthropic API + Optional: Google Vision API for preprocessing

### Next.js API Route

```typescript
// app/api/scan-receipt/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const promptPath = path.join(process.cwd(), 'docs', 'scanner_agent_prompt.md');
const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

interface ScanRequest {
  image: string; // base64
  userId: string;
  autoAddToPantry?: boolean;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { image, userId, autoAddToPantry = false }: ScanRequest = await request.json();

    if (!image || !userId) {
      return NextResponse.json(
        { error: 'Image and userId required' },
        { status: 400 }
      );
    }

    // Parse receipt with Claude Vision
    const parseResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            {
              type: 'text',
              text: `Parse this grocery receipt completely. Return JSON:
{
  "store": {"name": "string", "location": "string or null"},
  "transactionDate": "YYYY-MM-DD",
  "items": [
    {
      "rawText": "original text from receipt",
      "name": "cleaned item name",
      "brand": "brand if visible or null",
      "quantity": number,
      "unit": "each|lb|oz|gal|etc",
      "unitPrice": number or null,
      "totalPrice": number,
      "category": "produce_fruit|produce_vegetable|dairy|meat_poultry|meat_beef|meat_pork|seafood|bakery|frozen|canned_goods|dry_goods|snacks|beverages|condiments|non_food",
      "storageLocation": "fridge|freezer|pantry|counter",
      "estimatedExpirationDays": number,
      "confidence": 0.0-1.0,
      "needsReview": boolean
    }
  ],
  "totals": {
    "subtotal": number,
    "tax": number,
    "total": number,
    "savings": number or null
  }
}
Only include food items. Mark non-food as category "non_food".
Return ONLY valid JSON.`,
            },
          ],
        },
      ],
    });

    const responseText = parseResponse.content[0].type === 'text' 
      ? parseResponse.content[0].text 
      : '';
    
    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse receipt');
    }

    const parsedReceipt = JSON.parse(jsonMatch[0]);
    const processingTime = Date.now() - startTime;

    // Calculate overall confidence
    const foodItems = parsedReceipt.items.filter((i: any) => i.category !== 'non_food');
    const avgConfidence = foodItems.length > 0
      ? foodItems.reduce((sum: number, i: any) => sum + i.confidence, 0) / foodItems.length
      : 0;

    // Save scan to database
    const { data: scanRecord, error: scanError } = await supabase
      .from('receipt_scans')
      .insert({
        user_id: userId,
        store_name: parsedReceipt.store.name,
        transaction_date: parsedReceipt.transactionDate,
        total_amount: parsedReceipt.totals.total,
        item_count: foodItems.length,
        confidence: avgConfidence,
        processing_time_ms: processingTime,
        raw_data: parsedReceipt,
      })
      .select()
      .single();

    if (scanError) {
      console.error('Error saving scan:', scanError);
    }

    // Auto-add to pantry if requested
    let addedToPantry = 0;
    if (autoAddToPantry && scanRecord) {
      const pantryItems = foodItems
        .filter((item: any) => item.confidence >= 0.7 && !item.needsReview)
        .map((item: any) => ({
          user_id: userId,
          name: item.name,
          brand: item.brand,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          location: item.storageLocation,
          purchase_date: parsedReceipt.transactionDate,
          expiration_date: calculateExpirationDate(
            parsedReceipt.transactionDate,
            item.estimatedExpirationDays
          ),
          cost: item.totalPrice,
          receipt_scan_id: scanRecord.id,
        }));

      if (pantryItems.length > 0) {
        const { error: pantryError } = await supabase
          .from('pantry_items')
          .insert(pantryItems);

        if (!pantryError) {
          addedToPantry = pantryItems.length;
        }
      }
    }

    // Items needing review
    const needsReview = parsedReceipt.items.filter(
      (item: any) => item.needsReview || item.confidence < 0.7
    );

    return NextResponse.json({
      success: true,
      scanId: scanRecord?.id,
      store: parsedReceipt.store,
      date: parsedReceipt.transactionDate,
      items: foodItems,
      totals: parsedReceipt.totals,
      stats: {
        totalItems: parsedReceipt.items.length,
        foodItems: foodItems.length,
        nonFoodItems: parsedReceipt.items.length - foodItems.length,
        avgConfidence: Math.round(avgConfidence * 100),
        processingTimeMs: processingTime,
        addedToPantry,
        needsReview: needsReview.length,
      },
      needsReview,
    });
  } catch (error) {
    console.error('Receipt scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan receipt', details: String(error) },
      { status: 500 }
    );
  }
}

function calculateExpirationDate(purchaseDate: string, daysToAdd: number): string {
  const date = new Date(purchaseDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}
```

### React Component with Camera

```tsx
// components/ReceiptScanner.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Check, AlertCircle, Loader2 } from 'lucide-react';

interface ScannedItem {
  name: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  category: string;
  storageLocation: string;
  estimatedExpirationDays: number;
  confidence: number;
  needsReview: boolean;
}

interface ScanResult {
  success: boolean;
  scanId?: string;
  store: { name: string };
  date: string;
  items: ScannedItem[];
  totals: { subtotal: number; tax: number; total: number };
  stats: {
    totalItems: number;
    foodItems: number;
    avgConfidence: number;
    processingTimeMs: number;
    addedToPantry: number;
    needsReview: number;
  };
  needsReview: ScannedItem[];
}

export function ReceiptScanner({ userId }: { userId: string }) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoAdd, setAutoAdd] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const processImage = async (base64Image: string) => {
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          userId,
          autoAddToPantry: autoAdd,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan receipt');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      processImage(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Could not access camera');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop camera
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);

    processImage(base64);
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      produce_fruit: '🍎',
      produce_vegetable: '🥬',
      dairy: '🥛',
      meat_poultry: '🍗',
      meat_beef: '🥩',
      meat_pork: '🥓',
      seafood: '🐟',
      bakery: '🍞',
      frozen: '🧊',
      canned_goods: '🥫',
      dry_goods: '🌾',
      snacks: '🍿',
      beverages: '🥤',
      condiments: '🧂',
      non_food: '📦',
    };
    return emojis[category] || '📦';
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📱 Scan Receipt</h2>

      {/* Controls */}
      {!showCamera && !isScanning && !result && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Upload size={24} />
              Upload Photo
            </button>
            <button
              onClick={startCamera}
              className="flex-1 flex items-center justify-center gap-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Camera size={24} />
              Take Photo
            </button>
          </div>

          <label className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <input
              type="checkbox"
              checked={autoAdd}
              onChange={(e) => setAutoAdd(e.target.checked)}
              className="w-5 h-5"
            />
            <span>Automatically add items to pantry</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {showCamera && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <button
            onClick={capturePhoto}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-full shadow-lg"
          >
            <Camera size={32} className="text-blue-500" />
          </button>
        </div>
      )}

      {/* Loading */}
      {isScanning && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
          <p className="text-lg">Scanning receipt...</p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="p-4 bg-green-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Check size={24} className="text-green-600" />
              <span className="font-bold text-green-800">Scan Complete!</span>
            </div>
            <p className="text-sm text-green-700">
              {result.store.name} • {result.date} • ${result.totals.total.toFixed(2)}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{result.stats.foodItems}</div>
              <div className="text-xs text-blue-500">Items Found</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.stats.avgConfidence}%</div>
              <div className="text-xs text-green-500">Confidence</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{result.stats.addedToPantry}</div>
              <div className="text-xs text-purple-500">Added to Pantry</div>
            </div>
          </div>

          {/* Items Needing Review */}
          {result.needsReview.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">
                ⚠️ {result.needsReview.length} items need review
              </h3>
              {result.needsReview.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-yellow-200 last:border-0">
                  <span>{item.name}</span>
                  <span className="text-sm text-yellow-600">{Math.round(item.confidence * 100)}% confident</span>
                </div>
              ))}
            </div>
          )}

          {/* All Items */}
          <div className="border rounded-lg overflow-hidden">
            <h3 className="p-3 bg-gray-100 font-bold">All Items</h3>
            <div className="divide-y">
              {result.items.map((item, i) => (
                <div key={i} className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.storageLocation} • expires in {item.estimatedExpirationDays} days
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scan Again */}
          <button
            onClick={() => setResult(null)}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Scan Another Receipt
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Method 4: Production Service

**Best for:** High-volume scanning, background processing
**Setup time:** 2 hours
**Requirements:** Full backend infrastructure

### ScannerBot Service Class

```typescript
// lib/services/scanner-bot-service.ts
import Anthropic from '@anthropic-ai/sdk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

interface ScanResult {
  scanId: string;
  success: boolean;
  store: { name: string; location?: string };
  date: string;
  items: ParsedItem[];
  totals: { subtotal: number; tax: number; total: number; savings?: number };
  stats: ScanStats;
  needsReview: ParsedItem[];
}

interface ParsedItem {
  id: string;
  rawText: string;
  name: string;
  brand?: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  totalPrice: number;
  category: string;
  storageLocation: string;
  estimatedExpirationDays: number;
  confidence: number;
  needsReview: boolean;
}

interface ScanStats {
  totalItems: number;
  foodItems: number;
  nonFoodItems: number;
  avgConfidence: number;
  processingTimeMs: number;
}

export class ScannerBotService {
  private anthropic: Anthropic;
  private supabase: SupabaseClient;
  private systemPrompt: string;

  constructor() {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const promptPath = path.join(process.cwd(), 'docs', 'scanner_agent_prompt.md');
    this.systemPrompt = fs.readFileSync(promptPath, 'utf-8');
  }

  async scanReceipt(
    imageBase64: string,
    userId: string,
    options?: {
      autoAddToPantry?: boolean;
      mediaType?: string;
    }
  ): Promise<ScanResult> {
    const startTime = Date.now();
    const { autoAddToPantry = true, mediaType = 'image/jpeg' } = options || {};

    // Clean base64 if it has data URL prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Parse with Claude Vision
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: this.systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as any,
                data: cleanBase64,
              },
            },
            {
              type: 'text',
              text: this.buildParsePrompt(),
            },
          ],
        },
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = this.extractJSON(responseText);
    const processingTime = Date.now() - startTime;

    // Generate IDs for items
    const itemsWithIds = parsed.items.map((item: any, index: number) => ({
      ...item,
      id: `item_${Date.now()}_${index}`,
      needsReview: item.confidence < 0.7 || item.needsReview,
    }));

    const foodItems = itemsWithIds.filter((i: ParsedItem) => i.category !== 'non_food');
    const avgConfidence = this.calculateAvgConfidence(foodItems);

    // Save scan record
    const { data: scanRecord } = await this.supabase
      .from('receipt_scans')
      .insert({
        user_id: userId,
        store_name: parsed.store?.name || 'Unknown',
        store_location: parsed.store?.location,
        transaction_date: parsed.transactionDate,
        subtotal: parsed.totals?.subtotal,
        tax: parsed.totals?.tax,
        total_amount: parsed.totals?.total,
        savings: parsed.totals?.savings,
        item_count: foodItems.length,
        confidence: avgConfidence,
        processing_time_ms: processingTime,
        raw_data: parsed,
      })
      .select()
      .single();

    // Auto-add to pantry
    let addedCount = 0;
    if (autoAddToPantry && scanRecord) {
      addedCount = await this.addItemsToPantry(
        userId,
        foodItems.filter((i: ParsedItem) => !i.needsReview),
        parsed.transactionDate,
        scanRecord.id
      );
    }

    return {
      scanId: scanRecord?.id || 'unknown',
      success: true,
      store: parsed.store || { name: 'Unknown' },
      date: parsed.transactionDate,
      items: foodItems,
      totals: parsed.totals || { subtotal: 0, tax: 0, total: 0 },
      stats: {
        totalItems: itemsWithIds.length,
        foodItems: foodItems.length,
        nonFoodItems: itemsWithIds.length - foodItems.length,
        avgConfidence: Math.round(avgConfidence * 100),
        processingTimeMs: processingTime,
      },
      needsReview: foodItems.filter((i: ParsedItem) => i.needsReview),
    };
  }

  async scanBarcode(barcode: string, userId: string): Promise<ParsedItem | null> {
    // First check our database
    const { data: existing } = await this.supabase
      .from('barcode_products')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (existing) {
      return this.productToItem(existing);
    }

    // If not found, use external API (Open Food Facts)
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        
        // Save to our database for future lookups
        const productData = {
          barcode,
          name: product.product_name || 'Unknown Product',
          brand: product.brands,
          category: this.mapOpenFoodFactsCategory(product.categories_tags?.[0]),
          size_value: product.quantity,
          nutrition: product.nutriments,
          image_url: product.image_url,
          source: 'openfoodfacts',
        };

        await this.supabase.from('barcode_products').insert(productData);

        return this.productToItem(productData);
      }
    } catch (error) {
      console.error('Barcode lookup error:', error);
    }

    return null;
  }

  async reviewItem(
    scanId: string,
    itemId: string,
    corrections: Partial<ParsedItem>
  ): Promise<void> {
    // Update the item in the scan record
    const { data: scan } = await this.supabase
      .from('receipt_scans')
      .select('raw_data')
      .eq('id', scanId)
      .single();

    if (scan) {
      const rawData = scan.raw_data;
      const itemIndex = rawData.items.findIndex((i: any) => i.id === itemId);
      
      if (itemIndex >= 0) {
        rawData.items[itemIndex] = { ...rawData.items[itemIndex], ...corrections };
        
        await this.supabase
          .from('receipt_scans')
          .update({ raw_data: rawData })
          .eq('id', scanId);
      }
    }

    // Log correction for learning
    await this.supabase.from('scan_corrections').insert({
      scan_id: scanId,
      item_id: itemId,
      corrections,
      created_at: new Date().toISOString(),
    });
  }

  // Private helpers
  private buildParsePrompt(): string {
    return `Parse this grocery receipt completely. Return JSON:
{
  "store": {"name": "string", "location": "string or null"},
  "transactionDate": "YYYY-MM-DD",
  "items": [
    {
      "rawText": "original receipt text",
      "name": "cleaned name",
      "brand": "brand or null",
      "quantity": number,
      "unit": "each|lb|oz|gal|etc",
      "unitPrice": number or null,
      "totalPrice": number,
      "category": "produce_fruit|produce_vegetable|dairy|meat_poultry|meat_beef|meat_pork|seafood|bakery|frozen|canned_goods|dry_goods|snacks|beverages|condiments|non_food",
      "storageLocation": "fridge|freezer|pantry|counter",
      "estimatedExpirationDays": number,
      "confidence": 0.0-1.0,
      "needsReview": boolean
    }
  ],
  "totals": {"subtotal": number, "tax": number, "total": number, "savings": number or null}
}
Return ONLY valid JSON.`;
  }

  private extractJSON(text: string): any {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in response');
    return JSON.parse(match[0]);
  }

  private calculateAvgConfidence(items: ParsedItem[]): number {
    if (items.length === 0) return 0;
    return items.reduce((sum, i) => sum + i.confidence, 0) / items.length;
  }

  private async addItemsToPantry(
    userId: string,
    items: ParsedItem[],
    purchaseDate: string,
    scanId: string
  ): Promise<number> {
    const pantryItems = items.map(item => ({
      user_id: userId,
      name: item.name,
      brand: item.brand,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      location: item.storageLocation,
      purchase_date: purchaseDate,
      expiration_date: this.addDays(purchaseDate, item.estimatedExpirationDays),
      cost: item.totalPrice,
      receipt_scan_id: scanId,
    }));

    const { error } = await this.supabase.from('pantry_items').insert(pantryItems);
    return error ? 0 : pantryItems.length;
  }

  private addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private productToItem(product: any): ParsedItem {
    return {
      id: `barcode_${product.barcode}`,
      rawText: product.name,
      name: product.name,
      brand: product.brand,
      quantity: 1,
      unit: 'each',
      totalPrice: 0,
      category: product.category || 'dry_goods',
      storageLocation: this.getStorageForCategory(product.category),
      estimatedExpirationDays: this.getExpirationForCategory(product.category),
      confidence: 0.95,
      needsReview: false,
    };
  }

  private mapOpenFoodFactsCategory(category?: string): string {
    // Map Open Food Facts categories to our categories
    const mapping: Record<string, string> = {
      'en:fruits': 'produce_fruit',
      'en:vegetables': 'produce_vegetable',
      'en:dairy': 'dairy',
      'en:meats': 'meat_beef',
      'en:seafood': 'seafood',
      'en:breads': 'bakery',
      'en:frozen': 'frozen',
      'en:canned': 'canned_goods',
      'en:beverages': 'beverages',
      'en:snacks': 'snacks',
    };
    return mapping[category || ''] || 'dry_goods';
  }

  private getStorageForCategory(category: string): string {
    const storage: Record<string, string> = {
      produce_fruit: 'fridge',
      produce_vegetable: 'fridge',
      dairy: 'fridge',
      meat_poultry: 'fridge',
      meat_beef: 'fridge',
      meat_pork: 'fridge',
      seafood: 'fridge',
      bakery: 'pantry',
      frozen: 'freezer',
      canned_goods: 'pantry',
      dry_goods: 'pantry',
      snacks: 'pantry',
      beverages: 'pantry',
      condiments: 'fridge',
    };
    return storage[category] || 'pantry';
  }

  private getExpirationForCategory(category: string): number {
    const expiration: Record<string, number> = {
      produce_fruit: 7,
      produce_vegetable: 7,
      dairy: 14,
      meat_poultry: 2,
      meat_beef: 4,
      meat_pork: 4,
      seafood: 2,
      bakery: 5,
      frozen: 90,
      canned_goods: 365,
      dry_goods: 180,
      snacks: 60,
      beverages: 30,
      condiments: 60,
    };
    return expiration[category] || 30;
  }
}

export const scannerBot = new ScannerBotService();
```

---

## Barcode Integration

### Open Food Facts API

```typescript
// lib/barcode-lookup.ts
interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  category: string;
  nutrition?: NutritionInfo;
  imageUrl?: string;
  found: boolean;
}

interface NutritionInfo {
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  sodium: number;
}

export async function lookupBarcode(barcode: string): Promise<BarcodeProduct> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();

    if (data.status === 1 && data.product) {
      const p = data.product;
      return {
        barcode,
        name: p.product_name || 'Unknown',
        brand: p.brands,
        category: mapCategory(p.categories_tags?.[0]),
        nutrition: p.nutriments ? {
          calories: p.nutriments['energy-kcal'] || 0,
          fat: p.nutriments.fat || 0,
          carbs: p.nutriments.carbohydrates || 0,
          protein: p.nutriments.proteins || 0,
          sodium: p.nutriments.sodium || 0,
        } : undefined,
        imageUrl: p.image_url,
        found: true,
      };
    }
  } catch (error) {
    console.error('Barcode lookup failed:', error);
  }

  return {
    barcode,
    name: 'Unknown Product',
    category: 'dry_goods',
    found: false,
  };
}

function mapCategory(offCategory?: string): string {
  // Mapping logic
  return 'dry_goods';
}
```

---

## Database Schema

```sql
-- Receipt Scans
CREATE TABLE IF NOT EXISTS receipt_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  store_name TEXT,
  store_location TEXT,
  transaction_date DATE,
  
  subtotal DECIMAL,
  tax DECIMAL,
  total_amount DECIMAL,
  savings DECIMAL,
  
  item_count INTEGER,
  confidence DECIMAL,
  processing_time_ms INTEGER,
  
  raw_data JSONB,
  image_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_receipt_scans_user ON receipt_scans(user_id);
CREATE INDEX idx_receipt_scans_date ON receipt_scans(user_id, transaction_date DESC);

-- Barcode Products Cache
CREATE TABLE IF NOT EXISTS barcode_products (
  barcode TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  size_value TEXT,
  nutrition JSONB,
  image_url TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scan Corrections (for learning)
CREATE TABLE IF NOT EXISTS scan_corrections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID REFERENCES receipt_scans(id),
  item_id TEXT,
  corrections JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Best Practices

### 1. Image Quality
- Encourage well-lit, flat photos
- Support image preprocessing
- Handle multiple receipt segments

### 2. Confidence Thresholds
- Auto-add items with confidence ≥ 0.7
- Flag items below 0.7 for review
- Track correction patterns to improve

### 3. User Corrections
- Make reviewing easy and fast
- Learn from corrections
- Update barcode database from corrections

### 4. Performance
- Cache barcode lookups
- Process in background for large receipts
- Batch similar operations

---

**ScannerBot Pro is ready to scan! 📱🛒**
