# BestMealMate AI Agent System

## Complete Documentation for Your AI-Powered Meal Planning Platform

---

## 🎯 Overview

BestMealMate is powered by **three specialized AI agents** that work together to help users reduce food waste, save money, and eat better:

```
┌─────────────────────────────────────────────────────────────────┐
│                    BestMealMate AI System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 ScannerBot Pro    🍳 ChefBot Pro    💳 StripeBot Pro       │
│  ─────────────────    ──────────────    ────────────────        │
│  Receipt scanning     Meal planning     Payment processing      │
│  Barcode lookup       Recipe matching   Subscription mgmt       │
│  Inventory sync       Expiration mgmt   Billing support         │
│                                                                 │
│  ↓ Scans groceries    ↓ Uses pantry     ↓ Handles billing      │
│  → Updates pantry  →  → Suggests meals  → Manages access       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 What's Included

### Agent Files Summary

| Agent | Files | Lines | Purpose |
|-------|-------|-------|---------|
| **ScannerBot Pro** | 3 | ~1,800 | Receipt/barcode scanning, inventory |
| **ChefBot Pro** | 3 | ~2,000 | Meal planning, recipes, expiration |
| **StripeBot Pro** | 5 | ~2,500 | Payments, subscriptions, billing |
| **Total** | **11** | **~6,300** | Complete AI agent system |

### File Inventory

```
docs/
├── 🍳 ChefBot Pro (Meal Planning)
│   ├── ai_chef_agent_prompt.md      # Master system prompt
│   ├── ai_chef_usage_guide.md       # Implementation guide
│   └── ai_chef_problem_templates.md # 20 problem templates
│
├── 📱 ScannerBot Pro (Receipt Scanning)
│   ├── scanner_agent_prompt.md      # Master system prompt
│   ├── scanner_usage_guide.md       # Implementation guide
│   └── scanner_problem_templates.md # 15 problem templates
│
├── 💳 StripeBot Pro (Payments)
│   ├── stripe_agent_prompt.md       # Master system prompt
│   ├── stripe_agent_usage_guide.md  # Implementation guide
│   ├── stripe_problem_templates.md  # 17 problem templates
│   ├── STRIPE_AGENT_README.md       # Complete documentation
│   └── QUICK_REFERENCE.txt          # One-page cheat sheet
│
└── 📚 System Documentation
    └── BESTMEALMATE_AGENTS_README.md  # This file
```

---

## 🚀 Quick Start

### Option 1: Instant Testing (2 minutes)

1. Go to [claude.ai](https://claude.ai)
2. Create a new Project
3. Add these files to Project Knowledge:
   - `ai_chef_agent_prompt.md`
   - `scanner_agent_prompt.md`
   - `stripe_agent_prompt.md`
4. Start asking questions!

### Option 2: Basic API Integration (15 minutes)

```typescript
// Initialize all agents
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const agents = {
  chef: fs.readFileSync('docs/ai_chef_agent_prompt.md', 'utf-8'),
  scanner: fs.readFileSync('docs/scanner_agent_prompt.md', 'utf-8'),
  stripe: fs.readFileSync('docs/stripe_agent_prompt.md', 'utf-8'),
};

async function askAgent(
  agent: 'chef' | 'scanner' | 'stripe',
  question: string
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: agents[agent],
    messages: [{ role: 'user', content: question }],
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Usage
const recipe = await askAgent('chef', 'What can I make with chicken and rice?');
const scanHelp = await askAgent('scanner', 'Why won\'t my receipt scan?');
const paymentHelp = await askAgent('stripe', 'Customer getting card_declined error');
```

### Option 3: Full Production Integration (1-2 hours)

See individual usage guides for complete service implementations:
- [ai_chef_usage_guide.md](ai_chef_usage_guide.md) - ChefBot Service
- [scanner_usage_guide.md](scanner_usage_guide.md) - ScannerBot Service  
- [stripe_agent_usage_guide.md](stripe_agent_usage_guide.md) - StripeBot Service

---

## 🤖 Agent Capabilities

### 📱 ScannerBot Pro

**Mission**: Effortlessly capture grocery purchases into pantry inventory.

| Capability | Description |
|------------|-------------|
| Receipt OCR | 90%+ accuracy extracting items from receipt photos |
| Barcode Lookup | UPC/EAN lookup via Open Food Facts + cache |
| Auto-Categorize | Food → category → storage location |
| Expiration Estimates | Calculate expiry based on product type |
| Pantry Sync | Merge scanned items with existing inventory |
| Multi-Store Support | Walmart, Kroger, Costco, Trader Joe's, etc. |

**Key Data Flow**:
```
Receipt Photo → OCR → Parse Items → Categorize → Estimate Expiry → Add to Pantry
```

### 🍳 ChefBot Pro

**Mission**: Turn pantry ingredients into delicious meals while reducing waste.

| Capability | Description |
|------------|-------------|
| Recipe Matching | Find recipes using available ingredients |
| Expiration Priority | Suggest meals using items expiring soonest |
| Family Profiles | Handle multiple dietary restrictions |
| Meal Planning | Weekly plans optimized for waste reduction |
| Grocery Lists | Smart lists that subtract pantry items |
| Nutrition Tracking | Calorie and macro calculations |

**Key Data Flow**:
```
Pantry Items → Filter by Expiry → Match Recipes → Adjust for Diet → Suggest Meals
```

### 💳 StripeBot Pro

**Mission**: Handle all payment and subscription challenges instantly.

| Capability | Description |
|------------|-------------|
| Checkout Sessions | Create payment flows |
| Subscription Management | Trials, upgrades, cancellations |
| Webhook Handling | Event processing patterns |
| Error Diagnosis | Decode decline codes |
| Dispute Handling | Evidence submission guidance |
| Compliance | PCI, SCA, 3DS requirements |

**Key Data Flow**:
```
Payment Request → Checkout Session → Webhook Events → Database Sync → User Access
```

---

## 🔄 Agent Integration

### How Agents Work Together

```
User Journey Example:

1. USER SHOPS
   ↓
2. 📱 ScannerBot scans receipt
   → Extracts items
   → Categorizes food
   → Calculates expiration
   → Adds to pantry
   ↓
3. 🍳 ChefBot analyzes pantry
   → Identifies expiring items
   → Suggests recipes
   → Creates meal plan
   → Generates grocery list
   ↓
4. 💳 StripeBot handles subscription
   → Processes payment
   → Manages access
   → Sends receipts
   → Handles support issues
```

### Shared Data Model

All agents work with a common data structure:

```typescript
// Shared interfaces across agents
interface PantryItem {
  id: string;
  userId: string;
  name: string;
  brand?: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  location: StorageLocation;
  purchaseDate: Date;
  expirationDate: Date;
  cost?: number;
  barcode?: string;
  receiptScanId?: string;
}

interface UserProfile {
  id: string;
  email: string;
  subscriptionStatus: 'free' | 'premium' | 'cancelled';
  stripeCustomerId?: string;
  familyMembers: FamilyMember[];
  preferences: UserPreferences;
}

interface FamilyMember {
  name: string;
  restrictions: string[];
  allergies: string[];
  preferences: {
    likes: string[];
    dislikes: string[];
  };
}
```

---

## 📊 Problem Templates

### Quick Reference Table

| Issue Type | ChefBot | ScannerBot | StripeBot |
|------------|---------|------------|-----------|
| **Critical** | 5 | 5 | 7 |
| **Urgent** | 5 | 5 | 6 |
| **Standard** | 5 | 5 | 4 |
| **Optimization** | 5 | - | - |
| **Total** | **20** | **15** | **17** |

### Most Common Issues by Agent

**ScannerBot** (Receipt/Barcode):
1. Receipt not scanning → Template #1
2. Wrong items detected → Template #2
3. Barcode not found → Template #4

**ChefBot** (Meal Planning):
1. Food expiring today → Template #1
2. Need dinner fast → Template #6
3. Missing ingredient → Template #11

**StripeBot** (Payments):
1. Payments failing → Template #1
2. Webhooks not working → Template #2
3. Customer dispute → Template #10

---

## 🛠 Implementation Methods

Each agent supports 4 implementation levels:

| Method | Setup Time | Best For |
|--------|-----------|----------|
| **1. Claude Web** | 30 seconds | Testing, one-off questions |
| **2. Claude API** | 10-15 min | Basic app integration |
| **3. Supabase Integration** | 30-60 min | Full data persistence |
| **4. Production Service** | 1-2 hours | Enterprise-grade deployment |

---

## 📁 Database Schema

Complete schema for all agents:

```sql
-- =============================================
-- PANTRY & INVENTORY (ScannerBot + ChefBot)
-- =============================================
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT DEFAULT 'pantry',
  purchase_date DATE,
  expiration_date DATE,
  cost DECIMAL,
  barcode TEXT,
  receipt_scan_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RECEIPT SCANS (ScannerBot)
-- =============================================
CREATE TABLE receipt_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  store_name TEXT,
  transaction_date DATE,
  total_amount DECIMAL,
  item_count INTEGER,
  confidence DECIMAL,
  processing_time_ms INTEGER,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FAMILY MEMBERS (ChefBot)
-- =============================================
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'adult',
  dietary_restrictions TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  likes TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MEAL HISTORY (ChefBot)
-- =============================================
CREATE TABLE meal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  cooked_at TIMESTAMPTZ DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ingredients_used JSONB
);

-- =============================================
-- USER PROFILES (StripeBot)
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_id TEXT,
  subscription_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AI AGENT LOGS (All Agents)
-- =============================================
CREATE TABLE ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  agent_type TEXT NOT NULL, -- 'chef', 'scanner', 'stripe'
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  context_size INTEGER,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Environment Variables

```bash
# .env.local

# Anthropic (All Agents)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (All Agents)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (StripeBot)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URLs
NEXT_PUBLIC_APP_URL=https://bestmealmate.com
```

---

## 📈 Success Metrics

Track these KPIs to measure agent effectiveness:

| Agent | Metric | Target |
|-------|--------|--------|
| ScannerBot | Receipt scan success rate | >90% |
| ScannerBot | Item extraction accuracy | >85% |
| ScannerBot | Barcode lookup hit rate | >80% |
| ChefBot | Expiring items used | >70% |
| ChefBot | Recipe suggestions accepted | >40% |
| ChefBot | Weekly meal plans created | >30% of users |
| StripeBot | Payment success rate | >98% |
| StripeBot | Webhook reliability | >99.9% |
| StripeBot | Support query resolution | <30 min |

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] All agent prompts loaded in production
- [ ] Supabase tables created
- [ ] Environment variables set
- [ ] Stripe webhooks configured
- [ ] API rate limits configured

### Go-Live
- [ ] ScannerBot API endpoint tested
- [ ] ChefBot recipe suggestions working
- [ ] StripeBot payments processing
- [ ] Error logging enabled
- [ ] Monitoring dashboards set up

### Post-Launch
- [ ] Track success metrics daily
- [ ] Review AI agent logs weekly
- [ ] Update prompts based on feedback
- [ ] Add new problem templates as needed

---

## 🆘 Getting Help

### For Each Agent:
- **ScannerBot**: See `scanner_problem_templates.md`
- **ChefBot**: See `ai_chef_problem_templates.md`
- **StripeBot**: See `stripe_problem_templates.md`

### Quick Questions:
1. Load relevant agent prompt into Claude
2. Describe your issue
3. Get instant guidance

### Complex Issues:
1. Find matching problem template
2. Fill in all details
3. Paste into Claude with agent prompt
4. Get comprehensive solution

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-06 | Initial release with 3 agents |

---

**Built for BestMealMate 🍽️**

*Better meals. Less waste. Happier families.*
