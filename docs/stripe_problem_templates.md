# StripeBot Pro - Problem Templates

Copy these templates, fill in your details, and paste into Claude with the agent prompt for instant solutions.

---

## Table of Contents

### 🔴 CRITICAL (Business Impact)
1. [Payments Suddenly Failing](#1-payments-suddenly-failing)
2. [Webhooks Not Firing](#2-webhooks-not-firing)
3. [Account Restricted/Frozen](#3-account-restrictedforzen)
4. [Checkout Session 500 Errors](#4-checkout-session-500-errors)
5. [Subscription Charges Not Processing](#5-subscription-charges-not-processing)
6. [Customer Cannot Complete Payment](#6-customer-cannot-complete-payment)
7. [Production API Key Compromised](#7-production-api-key-compromised)

### 🟠 URGENT (Revenue Impact)
8. [High Decline Rate](#8-high-decline-rate)
9. [Refund Not Processing](#9-refund-not-processing)
10. [Customer Disputed Charge](#10-customer-disputed-charge)
11. [Payout Delayed](#11-payout-delayed)
12. [Duplicate Charges](#12-duplicate-charges)
13. [Subscription Not Canceling](#13-subscription-not-canceling)

### 🟡 HIGH PRIORITY (Operational)
14. [Rate Limiting Errors](#14-rate-limiting-errors)

---

## 🔴 CRITICAL Templates

---

### 1. Payments Suddenly Failing

```
ISSUE: Payments suddenly stopped working

TIMELINE:
- Last working: [date/time]
- First failure: [date/time]
- Current status: [all failing / intermittent / specific cards]

ERROR DETAILS:
- Error message: [exact error from logs]
- Error code: [e.g., card_declined, api_error]
- Decline code: [e.g., insufficient_funds, do_not_honor]

WHAT CHANGED:
- [ ] Deployed new code
- [ ] Updated Stripe SDK
- [ ] Changed API keys
- [ ] Modified webhook handlers
- [ ] Updated Stripe Dashboard settings
- [ ] Nothing I know of

AFFECTED:
- Payment type: [one-time / subscription / both]
- Customer segment: [all / new / existing / specific region]
- Payment method: [cards / bank / all]

CODE CONTEXT:
[Paste your checkout/payment code here]

Please diagnose the issue and provide step-by-step fix.
```

---

### 2. Webhooks Not Firing

```
ISSUE: Webhook events not being received

WEBHOOK CONFIG:
- Endpoint URL: [your webhook URL]
- Events subscribed: [list events, e.g., checkout.session.completed]
- Using: [Stripe CLI / Dashboard webhook]

SYMPTOMS:
- [ ] Events show as sent in Dashboard but not received
- [ ] Events show delivery failures in Dashboard
- [ ] No events appearing in Dashboard at all
- [ ] Events received but handler not processing

DASHBOARD STATUS:
- Last successful delivery: [date/time or "never"]
- Recent delivery attempts: [succeeded / failed / pending]
- Response code from your server: [200 / 400 / 500 / timeout]

ENVIRONMENT:
- Framework: [Next.js / Express / etc.]
- Deployment: [Vercel / AWS / local / etc.]
- HTTPS: [yes / no]

WEBHOOK CODE:
[Paste your webhook handler code here]

Please diagnose why webhooks aren't working and provide fix.
```

---

### 3. Account Restricted/Frozen

```
ISSUE: Stripe account restricted or frozen

RESTRICTION TYPE:
- [ ] Payouts disabled
- [ ] Payments disabled
- [ ] Account under review
- [ ] Verification required
- [ ] Full suspension

BUSINESS CONTEXT:
- Business type: [SaaS / e-commerce / marketplace / etc.]
- Account age: [how long you've had the account]
- Monthly volume: [approximate $ amount]
- Recent changes: [new product, price change, etc.]

COMMUNICATION FROM STRIPE:
[Paste any email or Dashboard notice you received]

CURRENT STATUS:
- Can accept payments: [yes / no]
- Can process payouts: [yes / no]
- Outstanding balance: [$X]

COMPLIANCE ACTIONS TAKEN:
- [ ] Submitted requested documents
- [ ] Updated business information
- [ ] Responded to Stripe support
- [ ] None yet

Please advise on:
1. What likely triggered this
2. Steps to resolve
3. Timeline expectations
4. How to prevent in future
```

---

### 4. Checkout Session 500 Errors

```
ISSUE: Creating checkout sessions returns 500 errors

ERROR RESPONSE:
[Paste the full error response]

REQUEST PAYLOAD:
[Paste your checkout session create request]

FREQUENCY:
- [ ] All requests fail
- [ ] Intermittent failures
- [ ] Specific products/prices fail

RECENT CHANGES:
- [ ] Added new line items
- [ ] Changed success/cancel URLs
- [ ] Updated metadata
- [ ] Added new price IDs
- [ ] Changed from test to live mode

PRICE/PRODUCT INFO:
- Price IDs being used: [list them]
- Are prices active? [yes / no / unsure]
- Mode: [payment / subscription / setup]

CODE:
[Paste your checkout session creation code]

Please diagnose and fix.
```

---

### 5. Subscription Charges Not Processing

```
ISSUE: Subscription renewal payments not going through

SUBSCRIPTION DETAILS:
- Subscription ID: [sub_xxx]
- Customer ID: [cus_xxx]
- Status in Dashboard: [active / past_due / canceled / etc.]
- Price ID: [price_xxx]

PAYMENT HISTORY:
- Last successful charge: [date]
- Last failed charge: [date]
- Failure reason: [decline code if known]

RETRY SETTINGS:
- Smart Retries enabled: [yes / no / unsure]
- Custom dunning: [yes / no]

CUSTOMER STATUS:
- Payment method attached: [yes / no]
- Payment method type: [card / bank / etc.]
- Card expiration: [if known]

INVOICE STATUS:
- Open invoices: [count]
- Past due invoices: [count]

Please diagnose why renewals are failing and provide recovery steps.
```

---

### 6. Customer Cannot Complete Payment

```
ISSUE: Specific customer unable to complete payment

CUSTOMER INFO:
- Customer ID: [cus_xxx if exists]
- Email: [customer email]
- Country: [customer's country]
- Is new/existing: [new / existing customer]

PAYMENT ATTEMPT:
- Amount: [$X.XX]
- Currency: [USD / EUR / etc.]
- Product: [what they're buying]
- Payment method: [card type if known]

ERROR SHOWN:
- To customer: [what they see]
- In logs: [error code/message]
- Decline code: [if available]

WHAT CUSTOMER TRIED:
- [ ] Multiple cards
- [ ] Different browser
- [ ] Different device
- [ ] Cleared cache
- [ ] Contacted their bank

CHECKOUT TYPE:
- [ ] Stripe Checkout (hosted)
- [ ] Embedded Checkout
- [ ] Payment Element
- [ ] Card Element
- [ ] Direct API

Please diagnose and provide customer-facing solution.
```

---

### 7. Production API Key Compromised

```
ISSUE: Production API key may have been exposed

HOW DISCOVERED:
- [ ] Key found in public repo
- [ ] Key found in client-side code
- [ ] Suspicious API activity
- [ ] Stripe security alert
- [ ] Other: [explain]

EXPOSURE SCOPE:
- Key type exposed: [secret key / publishable key / restricted key]
- Exposure location: [GitHub / logs / frontend / etc.]
- Duration exposed: [estimate]

IMMEDIATE ACTIONS TAKEN:
- [ ] Rotated the key
- [ ] Reviewed recent API activity
- [ ] Checked for unauthorized charges
- [ ] Enabled 2FA on Stripe account

OBSERVED SUSPICIOUS ACTIVITY:
[Describe any unusual charges, refunds, or API calls]

Please provide:
1. Complete incident response checklist
2. How to audit for damage
3. Prevention measures for future
```

---

## 🟠 URGENT Templates

---

### 8. High Decline Rate

```
ISSUE: Payment decline rate increased significantly

METRICS:
- Previous success rate: [X%]
- Current success rate: [X%]
- Timeframe of change: [when it started]

TOP DECLINE CODES (from Dashboard):
1. [code]: [X%]
2. [code]: [X%]
3. [code]: [X%]

CUSTOMER SEGMENTS AFFECTED:
- [ ] All customers equally
- [ ] New customers more
- [ ] International customers
- [ ] Specific card brands
- [ ] Mobile vs desktop

RECENT CHANGES:
- [ ] Changed checkout flow
- [ ] Added new payment methods
- [ ] Changed pricing
- [ ] Deployed new code
- [ ] Updated Radar rules

CURRENT CHECKOUT FLOW:
[Brief description of your checkout UX]

Please analyze decline patterns and provide optimization strategy.
```

---

### 9. Refund Not Processing

```
ISSUE: Refund not appearing to customer

REFUND DETAILS:
- Refund ID: [re_xxx]
- Charge ID: [ch_xxx]
- Amount: [$X.XX]
- Created: [date]
- Status in Dashboard: [succeeded / pending / failed]

ORIGINAL CHARGE:
- Charge date: [date]
- Payment method: [card / bank]
- Customer ID: [cus_xxx]

REFUND TYPE:
- [ ] Full refund
- [ ] Partial refund
- [ ] Refund to different method

CUSTOMER COMPLAINT:
- Days since refund initiated: [X]
- Customer's bank: [if known]
- What customer sees: [describe]

Please diagnose refund status and provide customer communication.
```

---

### 10. Customer Disputed Charge

```
ISSUE: Received chargeback/dispute notification

DISPUTE DETAILS:
- Dispute ID: [dp_xxx]
- Charge ID: [ch_xxx]
- Amount: [$X.XX]
- Dispute reason: [fraudulent / duplicate / product_not_received / etc.]
- Response deadline: [date]

CUSTOMER INFO:
- Customer ID: [cus_xxx]
- Email: [email]
- Previous orders: [X orders totaling $X]
- Previous disputes: [yes / no]

TRANSACTION DETAILS:
- Purchase date: [date]
- Product/service: [what they bought]
- Delivery method: [digital / physical / service]
- Delivery status: [delivered / pending / n/a]

EVIDENCE AVAILABLE:
- [ ] Shipping/delivery proof
- [ ] Customer communication
- [ ] Terms of service acceptance
- [ ] IP address / device info
- [ ] Previous successful orders
- [ ] Refund policy shown at checkout

CUSTOMER CONTACT:
- [ ] Customer contacted support before dispute
- [ ] We offered refund before dispute
- [ ] No prior communication

Please provide:
1. Should I fight or accept this dispute?
2. What evidence to submit
3. Evidence submission code example
```

---

### 11. Payout Delayed

```
ISSUE: Expected payout not received

PAYOUT DETAILS:
- Expected payout date: [date]
- Payout amount: [$X.XX]
- Payout ID: [po_xxx if available]
- Status in Dashboard: [pending / in_transit / paid / failed]

BANK ACCOUNT:
- Bank verified: [yes / no]
- Bank account type: [checking / savings]
- Country: [country]
- Recently changed: [yes / no]

ACCOUNT STATUS:
- Account verification: [complete / pending / restricted]
- Available balance: [$X.XX]
- Pending balance: [$X.XX]
- Reserve: [$X.XX]

PAYOUT SCHEDULE:
- Schedule type: [daily / weekly / monthly / manual]
- Normal payout timing: [T+X days]

RECENT ISSUES:
- [ ] Failed payouts recently
- [ ] High dispute rate
- [ ] Large refunds
- [ ] Account under review

Please diagnose payout delay and provide resolution steps.
```

---

### 12. Duplicate Charges

```
ISSUE: Customer charged multiple times for same purchase

CHARGES:
- First charge ID: [ch_xxx], amount: [$X.XX], time: [timestamp]
- Second charge ID: [ch_xxx], amount: [$X.XX], time: [timestamp]
- (Additional charges if any)

CUSTOMER:
- Customer ID: [cus_xxx]
- Email: [email]

CHECKOUT FLOW:
- Checkout type: [Stripe Checkout / Payment Intent / etc.]
- User action: [describe what customer did]

POTENTIAL CAUSES:
- [ ] Customer clicked pay multiple times
- [ ] Network timeout caused retry
- [ ] Webhook processed twice
- [ ] No idempotency key used

IDEMPOTENCY:
- Using idempotency keys: [yes / no]
- How key is generated: [describe]

RELEVANT CODE:
[Paste payment creation code]

Please:
1. Diagnose root cause
2. Provide refund strategy
3. Fix to prevent future duplicates
```

---

### 13. Subscription Not Canceling

```
ISSUE: Subscription cancellation not working as expected

SUBSCRIPTION:
- Subscription ID: [sub_xxx]
- Customer ID: [cus_xxx]
- Current status: [active / canceled / past_due / etc.]

CANCELLATION REQUEST:
- How initiated: [Customer Portal / API / Dashboard]
- Expected behavior: [immediate / end of period]
- Actual behavior: [describe what happened]

CUSTOMER PORTAL:
- Portal enabled: [yes / no]
- Cancellation allowed: [yes / no]
- URL customer used: [if applicable]

SUBSCRIPTION STATE:
- cancel_at_period_end: [true / false]
- current_period_end: [date]
- canceled_at: [date or null]

CANCELLATION CODE:
[Paste your cancellation code if using API]

WEBHOOK HANDLERS:
- [ ] Handling customer.subscription.updated
- [ ] Handling customer.subscription.deleted

Please diagnose why cancellation isn't working correctly.
```

---

## 🟡 HIGH PRIORITY Templates

---

### 14. Rate Limiting Errors

```
ISSUE: Receiving rate_limit_error from Stripe API

ERROR DETAILS:
- Error message: [exact message]
- Endpoint affected: [which API endpoint]
- Frequency: [X errors per hour/minute]

API USAGE:
- Estimated API calls/minute: [X]
- Peak usage times: [describe]
- Account type: [standard / custom rate limits]

COMMON OPERATIONS:
1. [operation]: [frequency]
2. [operation]: [frequency]
3. [operation]: [frequency]

CURRENT MITIGATION:
- [ ] Using retry with backoff
- [ ] Caching responses
- [ ] Batching requests
- [ ] Using webhooks instead of polling

CODE MAKING CALLS:
[Paste the code making frequent API calls]

Please:
1. Identify which calls can be optimized
2. Provide retry logic implementation
3. Suggest caching strategy
4. Advise on rate limit increase request
```

---

## 💡 OPTIMIZATION Templates

---

### 15. Checkout Conversion Optimization

```
GOAL: Improve checkout completion rate

CURRENT METRICS:
- Checkout initiated: [X/month]
- Checkout completed: [X/month]
- Conversion rate: [X%]
- Average order value: [$X]

CHECKOUT IMPLEMENTATION:
- Type: [Stripe Checkout / Embedded / Elements]
- Payment methods: [list enabled methods]
- 3D Secure: [automatic / required / off]

USER EXPERIENCE:
- Steps to checkout: [describe flow]
- Mobile experience: [describe]
- Guest checkout: [allowed / required account]

DROP-OFF POINTS:
[Describe where users abandon if known]

CURRENT CODE:
[Paste checkout code]

Please analyze and provide optimization recommendations.
```

---

### 16. Fraud Prevention Setup

```
GOAL: Reduce fraudulent transactions and chargebacks

CURRENT STATE:
- Monthly transactions: [X]
- Fraud rate: [X%]
- Chargeback rate: [X%]
- Using Radar: [yes / no]

RADAR RULES:
[List current rules if any]

FRAUD PATTERNS SEEN:
- [ ] Card testing attacks
- [ ] High-value fraud
- [ ] International fraud
- [ ] Friendly fraud
- [ ] Account takeover

CUSTOMER BASE:
- Geographic distribution: [describe]
- Average transaction: [$X]
- High-risk indicators: [describe]

Please provide:
1. Recommended Radar rules
2. 3D Secure strategy
3. Manual review workflow
4. Fraud monitoring setup
```

---

### 17. Subscription Dunning Optimization

```
GOAL: Reduce involuntary churn from failed payments

CURRENT METRICS:
- Monthly renewals: [X]
- Failed first attempt: [X%]
- Eventually recovered: [X%]
- Lost to failed payment: [X%]

CURRENT DUNNING:
- Smart Retries: [enabled / disabled]
- Custom retry schedule: [describe if any]
- Email notifications: [list which ones]
- Customer Portal: [enabled / disabled]

PAYMENT METHOD UPDATER:
- Card Account Updater: [enabled / disabled]

CUSTOMER COMMUNICATION:
- Pre-failure notification: [yes / no]
- Post-failure emails: [describe]
- SMS notifications: [yes / no]

Please provide:
1. Optimal retry schedule
2. Email sequence recommendations
3. Pre-dunning best practices
4. Recovery workflow code
```

---

## 📋 How to Use These Templates

1. **Find your issue** - Scroll to the relevant template
2. **Copy the template** - Select all text in the code block
3. **Fill in details** - Replace bracketed items with your specifics
4. **Add context** - Include any additional information
5. **Submit to Claude** - Paste with the agent prompt loaded
6. **Iterate** - Answer follow-up questions for better solutions

---

## 💡 Tips for Better Responses

1. **Include error messages verbatim** - Don't paraphrase
2. **Provide IDs when possible** - Helps with specific guidance
3. **Describe timeline** - When did it start? What changed?
4. **Share code** - Real code gets real solutions
5. **Be specific about environment** - Framework, deployment, etc.

---

**Need a template for a different issue? Just describe your problem and ask for a diagnostic template!**
