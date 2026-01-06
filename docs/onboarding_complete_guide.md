# OnboardingBot Pro - Complete Guide with Problem Templates

Ready-to-use templates for all onboarding challenges, real-world examples, success metrics, and deployment guidance.

---

## 📋 Table of Contents

1. [Problem Templates](#problem-templates)
2. [Real-World Examples](#real-world-examples)
3. [Quick Wins](#quick-wins)
4. [Success Metrics](#success-metrics)
5. [Deployment Timeline](#deployment-timeline)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Problem Templates

### 🔴 Critical - Major Conversion Issues

#### Template 1: Design Complete Onboarding From Scratch

```markdown
DESIGN ONBOARDING

## Product Information
- **Name**: [Your product name]
- **Description**: [What your product does in 1-2 sentences]
- **Target Users**: [Who uses this and why]
- **Platform**: [Web / iOS / Android / All]

## Current State
- **Existing onboarding**: [None / Basic signup / Partial flow]
- **Current metrics**: 
  - Signup rate: [X%]
  - Activation rate: [X%]
  - Day 7 retention: [X%]

## Activation Goal
**The user is "activated" when they**: [Define your aha moment]
Example: "Plan their first week of meals"

## Constraints
- [ ] Must work on mobile
- [ ] Time limit: [X minutes max]
- [ ] Legal requirements: [GDPR, terms acceptance, etc.]
- [ ] Technical: [Any limitations]

## Questions
1. What's the optimal number of steps?
2. What information should we collect vs. skip?
3. How do we personalize the experience?
4. What's the first action users should take?
```

#### Template 2: Fix Catastrophic Dropoff

```markdown
FIX CRITICAL DROPOFF

## The Problem
**Step**: [Name of problematic step]
**Current conversion**: [X%] (users who complete this step)
**Target conversion**: [Y%]

## Context
- Users who reach this step: [X per day/week]
- Revenue impact: [$ lost per user who drops]
- This is step [X] of [Y] in the flow

## What We Know
**User feedback** (if any):
- "[Quote 1]"
- "[Quote 2]"

**Behavior data** (if any):
- Avg time on step: [X seconds]
- Rage clicks: [yes/no]
- Back button usage: [X%]
- Error rate: [X%]

## Current Step Design
**Headline**: [Current headline]
**Body**: [Current body text]
**CTA**: [Current button text]
**Inputs required**: [List all fields]
**Visual**: [Describe or attach screenshot]

## Urgency
- [ ] Blocking launch
- [ ] Major revenue impact
- [ ] Affecting growth targets
- [ ] Nice to improve

## Give me:
1. Root cause analysis
2. 3-5 specific fixes ranked by impact
3. Revised step design with copy
4. A/B test to validate
```

#### Template 3: Recover Abandoned Users

```markdown
DESIGN ABANDONMENT RECOVERY

## Situation
- Users are abandoning at: [Step name / stage]
- Abandonment rate: [X%]
- Users who abandon per [day/week]: [X]

## What We Know About Abandoners
- Last step completed: [X]
- Time spent before abandoning: [X minutes]
- Devices: [Mobile X%, Desktop Y%]
- Common patterns: [Any observations]

## Current Recovery Efforts
- [ ] None
- [ ] Email at [X hours]
- [ ] Push notification
- [ ] Retargeting ads
- [ ] In-app reminder on return

## Available Channels
- [ ] Email (have email: yes/no)
- [ ] Push notifications (opted in: X%)
- [ ] SMS (have phone: yes/no)
- [ ] In-app messaging
- [ ] Browser notifications

## Constraints
- Can't offer: [Any restrictions on incentives]
- Frequency limits: [How often we can contact]
- Brand voice: [Formal/casual/playful]

## Need:
1. Multi-channel recovery sequence
2. Message copy for each touchpoint
3. Timing strategy
4. Incentive recommendations (if appropriate)
5. Expected recovery rate
```

---

### 🟠 High Priority - Activation Problems

#### Template 4: Increase Activation Rate

```markdown
INCREASE ACTIVATION

## Current State
- **Activation event**: [What counts as activated]
- **Current activation rate**: [X%]
- **Target activation rate**: [Y%]
- **Timeframe**: Users who activate within [X days]

## Funnel
```
Signups:     [1000] (100%)
             ↓
Started:     [800]  (80%)
             ↓
Completed:   [500]  (50%)
             ↓
Activated:   [150]  (15%)  ← PROBLEM
```

## What Activated Users Do Differently
- [Behavior 1]
- [Behavior 2]
- [Behavior 3]

## What We've Tried
- [Attempt 1]: [Result]
- [Attempt 2]: [Result]

## Hypotheses
1. [Why you think activation is low]
2. [Another hypothesis]

## Need:
1. Analysis of likely causes
2. Prioritized action plan
3. Quick wins (< 1 week)
4. Medium-term improvements
5. Success metrics to track
```

#### Template 5: Improve Day 1 Retention

```markdown
IMPROVE DAY 1 RETENTION

## Current State
- **Day 1 retention**: [X%] (users who return within 24h)
- **Target**: [Y%]
- **Benchmark**: Industry average is [Z%]

## User Journey
1. User signs up at: [Typical time]
2. First session length: [X minutes]
3. Actions in first session: [List]
4. Next expected touchpoint: [What brings them back]

## Current Day 1 Strategy
- Welcome email: [Yes/No, timing]
- Push notification: [Yes/No, timing]
- In-app: [What they see on return]

## What Retained Users Did Differently
- [Behavior 1]
- [Behavior 2]

## Hypotheses
- Users don't return because: [Your guess]

## Need:
1. Day 1 retention strategy
2. Touchpoint sequence
3. Copy for each message
4. Feature changes to encourage return
5. Metrics to track
```

#### Template 6: Design Personalization Strategy

```markdown
DESIGN PERSONALIZATION

## Product
- **Name**: [Product]
- **Type**: [Consumer app / B2B SaaS / etc.]
- **User types**: [Different types of users you have]

## Available Data for Personalization
**At signup**:
- [ ] Email domain
- [ ] Signup source
- [ ] Device type
- [ ] Location
- [ ] Referral code

**Can ask**:
- [ ] Goal/use case
- [ ] Experience level
- [ ] Team size (B2B)
- [ ] Industry
- [ ] Other: [specify]

**From behavior**:
- [ ] Features used
- [ ] Time in app
- [ ] Content consumed

## Current Personalization
- [ ] None - same flow for everyone
- [ ] Basic - [what you do now]

## Goals
1. Increase relevance
2. Reduce time to value
3. Improve activation
4. [Other goals]

## Constraints
- Questions must be: [quick / detailed is ok]
- Paths available: [1 / 2-3 / unlimited]
- Dev resources: [limited / moderate / good]

## Need:
1. Segment definitions (3-5 segments)
2. Segmentation questions (1-3 questions)
3. Customized paths for each segment
4. Copy variations
5. Feature highlighting per segment
```

---

### 🟡 Standard - Optimization

#### Template 7: Audit Existing Onboarding

```markdown
AUDIT ONBOARDING FLOW

## Current Flow
**Step 1**: [Name]
- What user does: [Description]
- Conversion: [X%]

**Step 2**: [Name]
- What user does: [Description]
- Conversion: [X%]

[Continue for all steps...]

## Overall Metrics
- Start → Complete: [X%]
- Complete → Activate: [X%]
- Time to complete: [X minutes]
- Skip rate: [X%]

## User Feedback
- "[Feedback 1]"
- "[Feedback 2]"
- "[Feedback 3]"

## Screenshots/Recordings
[Attach or describe each screen]

## Concerns
1. [What you think might be wrong]
2. [Another concern]

## Industry
[Your industry for benchmarking]

## Need:
1. Score (0-100) with breakdown
2. Strengths to keep
3. Issues ranked by severity
4. Specific fixes with expected impact
5. Benchmark comparison
```

#### Template 8: Write Better Onboarding Copy

```markdown
WRITE ONBOARDING COPY

## Element
- **Type**: [Welcome headline / CTA / Form label / Email subject / etc.]
- **Location**: [Where in the flow]

## Current Copy
```
[Paste current copy]
```

## Context
- **What user just did**: [Previous action]
- **What we want them to do**: [Next action]
- **User mindset**: [Excited/skeptical/confused/etc.]

## Brand Voice
- **Tone**: [Professional / Friendly / Playful / etc.]
- **Do's**: [Words/phrases to use]
- **Don'ts**: [Words/phrases to avoid]

## Constraints
- Character limit: [If any]
- Must include: [Required elements]
- A/B testing: [Yes/No]

## Goal
- **Primary**: [What success looks like]
- **Metric**: [Click rate / completion rate / etc.]

## Need:
1. 3-5 copy variations
2. Reasoning for each
3. Top recommendation
4. A/B test suggestion
```

#### Template 9: Design Tooltips & Guides

```markdown
DESIGN IN-APP GUIDANCE

## Goal
Help users discover and use: [Feature/workflow]

## Context
- **When to show**: [First visit / Feature launch / Contextual]
- **User segment**: [All users / New users / Specific segment]
- **Trigger**: [Page load / User action / Time-based]

## Current State
- [ ] No guidance exists
- [ ] Basic tooltip
- [ ] Product tour
- [ ] Needs improvement because: [Why]

## Feature to Explain
- **Name**: [Feature name]
- **Location**: [Where in UI]
- **Complexity**: [Simple / Medium / Complex]
- **Steps to use**: [List steps]

## Constraints
- **Max steps**: [For tours]
- **Style**: [Tooltips / Modals / Coachmarks / Slideouts]
- **Dismissable**: [Yes/No/After X]
- **Frequency**: [Once / Until action / Every session]

## Need:
1. Guidance type recommendation
2. Content for each tooltip/step
3. Positioning and targeting
4. Trigger logic
5. Success metrics
```

#### Template 10: Design Email Onboarding Sequence

```markdown
DESIGN EMAIL SEQUENCE

## Trigger
- [ ] Signup (welcome sequence)
- [ ] Abandonment (recovery sequence)
- [ ] Activation (engagement sequence)
- [ ] Inactivity (re-engagement sequence)

## Product
- **Name**: [Product]
- **Activation goal**: [What user should do]
- **Current email performance**:
  - Open rate: [X%]
  - Click rate: [X%]

## User Context
- **Segment**: [Who receives this]
- **What they've done**: [Actions completed]
- **What they haven't done**: [Missing actions]

## Email Capabilities
- [ ] Personalization (name, etc.)
- [ ] Dynamic content (based on behavior)
- [ ] Deep links to app
- [ ] A/B testing

## Brand Voice
- **Tone**: [Describe]
- **From name**: [Who sends]
- **Signature**: [How to sign off]

## Constraints
- **Max emails**: [X in Y days]
- **Sending times**: [Preferred times]
- **Legal**: [Unsubscribe requirements, etc.]

## Need:
1. Email sequence (3-5 emails)
2. Timing for each
3. Subject lines with variations
4. Full email copy
5. Send/skip conditions
6. Expected metrics
```

---

### 🔧 Implementation

#### Template 11: Design Permission Flow

```markdown
DESIGN PERMISSION REQUESTS

## Permissions Needed
1. [ ] Notifications (push)
2. [ ] Camera
3. [ ] Photo library
4. [ ] Location
5. [ ] Contacts
6. [ ] Health data
7. [ ] Microphone
8. [ ] Other: [Specify]

## For Each Permission
**Permission**: [Name]
- **Why we need it**: [Feature it enables]
- **When to ask**: [Point in flow]
- **Current opt-in rate**: [X%]
- **Target opt-in rate**: [Y%]

## Current Approach
- [ ] Ask all at once during onboarding
- [ ] Ask at first use of feature
- [ ] Prime with explanation first
- [ ] No priming, system dialog only

## Platform
- [ ] iOS
- [ ] Android
- [ ] Web

## Constraints
- Must ask [Permission] before [Action]
- Cannot ask more than [X] permissions at once

## Need:
1. Optimal permission sequence
2. Priming screen design for each
3. Copy for priming screens
4. Fallback for denied permissions
5. Re-request strategy
```

#### Template 12: Design A/B Test

```markdown
DESIGN ONBOARDING EXPERIMENT

## Hypothesis
"If we [change], then [metric] will [improve/increase] by [X%] because [reasoning]"

## Current State
- **What exists**: [Current implementation]
- **Current metric**: [Baseline number]
- **Sample size available**: [Users per week/month]

## Test Details
- **Element to test**: [What specifically]
- **Variants desired**: [2 / 3 / more]
- **Primary metric**: [What determines winner]
- **Secondary metrics**: [Other things to track]

## Constraints
- **Duration**: [Max time to run]
- **Segment**: [Who to include/exclude]
- **Tech limitations**: [Any restrictions]

## Risk Assessment
- **What could go wrong**: [Risks]
- **Rollback plan**: [How to revert]

## Need:
1. Refined hypothesis
2. Variant designs with copy
3. Sample size calculation
4. Duration estimate
5. Success criteria
6. Analysis plan
```

#### Template 13: Mobile App First Launch

```markdown
DESIGN FIRST LAUNCH EXPERIENCE

## App Info
- **Name**: [App name]
- **Platform**: [iOS / Android / Both]
- **Category**: [App store category]
- **Core value**: [Main benefit in one line]

## Download Context
- **Where users find app**: [App store / Deep link / Referral]
- **What they know**: [Pre-download context]
- **Expectations**: [What they expect to see]

## First Launch Goals
1. [Goal 1: e.g., Create account]
2. [Goal 2: e.g., Complete profile]
3. [Goal 3: e.g., First core action]

## Current First Launch
[Describe or attach screenshots]

## Permissions Needed
- [ ] Notifications
- [ ] Camera
- [ ] Other: [List]

## Metrics
- **Install → Signup**: [X%]
- **Signup → First action**: [X%]
- **Day 1 retention**: [X%]

## Competitive Apps
[List 2-3 similar apps for reference]

## Need:
1. Complete first launch flow
2. Onboarding screen designs
3. Copy for each screen
4. Permission timing
5. Success metrics
```

#### Template 14: Free Trial to Paid Conversion

```markdown
DESIGN TRIAL CONVERSION FLOW

## Trial Details
- **Trial length**: [X days]
- **Trial type**: [Full access / Limited features / Usage-based]
- **Current conversion**: [X%]
- **Target conversion**: [Y%]

## User Journey During Trial
**Day 1**: [What users typically do]
**Day 3-5**: [Mid-trial behavior]
**Day 7+**: [Late trial behavior]
**Last day**: [End of trial behavior]

## Current Trial Experience
- **Onboarding**: [What we do now]
- **Trial reminders**: [When/how we remind]
- **Upgrade prompts**: [When/how we prompt]
- **Expiration handling**: [What happens at end]

## What Converts Users
- Users who convert usually: [Behaviors]
- Users who don't convert: [Behaviors]

## Constraints
- Pricing: [$X/month]
- Payment methods: [Cards / PayPal / etc.]
- Upgrade friction: [1-click / requires setup]

## Need:
1. Trial onboarding optimization
2. Touchpoint sequence throughout trial
3. Copy for trial reminders
4. Upgrade prompt strategy
5. Last-day urgency tactics
6. Post-expiration win-back
```

#### Template 15: B2B Team Onboarding

```markdown
DESIGN TEAM ONBOARDING

## Product
- **Name**: [Product]
- **Type**: [SaaS tool / Platform / etc.]
- **Team size target**: [Small teams / Enterprise / Both]

## Activation Definition
- **Individual activated**: [User does X]
- **Team activated**: [X% of team does Y]
- **Current team activation**: [X%]

## Roles Involved
1. **Admin/Buyer**: [What they need to do]
2. **End users**: [What they need to do]
3. **Other roles**: [If any]

## Onboarding Touchpoints
- **Admin setup**: [Current experience]
- **Invite flow**: [How invites work]
- **New member experience**: [What invited users see]

## Current Metrics
- Signup → First invite: [X%]
- Invite → Join: [X%]
- Join → Activated: [X%]

## Challenges
- [Challenge 1: e.g., Admins don't invite]
- [Challenge 2: e.g., Invitees don't activate]

## Need:
1. Admin onboarding flow
2. Invite optimization
3. New member onboarding
4. Team activation strategy
5. Success metrics per role
```

---

## 💡 Real-World Examples

### Example 1: BestMealMate Onboarding

```
User Segment: Busy Parents

FLOW:
1. Landing → "Plan your family's meals in 5 minutes"
2. Quick survey (1 screen): "Who are you cooking for?"
   - Just me
   - Partner & me
   - Family with kids ← Selected
3. "Any dietary restrictions?" (checkboxes)
   - None selected, skip
4. "What's your biggest challenge?"
   - No time to plan ← Selected
5. SHOW VALUE: "Here's your personalized week"
   - Display AI-generated meal plan
   - "Save this plan" button
6. Account creation (email + password)
   - "Don't lose your plan!"
7. Success screen
   - "Your first week is ready! 🎉"
   - CTA: "Add to grocery list"

METRICS:
- Landing → Survey: 65%
- Survey → See Plan: 85%
- See Plan → Signup: 75%
- Signup → Save Plan: 90%
- Overall: 37% activation

KEY INSIGHT:
Showing the meal plan BEFORE asking for signup
increased conversion by 3x vs. asking first.
```

### Example 2: Slack Onboarding Pattern

```
WHY IT WORKS:

1. Immediate value
   - Create workspace (10 seconds)
   - Instant chat available
   - No credit card required

2. Progressive disclosure
   - Basic: Channels, messaging
   - Intermediate: Integrations, threads
   - Advanced: Workflows, analytics

3. Team activation focus
   - "Invite your team" is prominent
   - Pre-written invite messages
   - Follow-up reminders

4. Contextual education
   - Slackbot teaches as you go
   - Tips appear when relevant
   - Help is searchable

COPY TO STEAL:
- "What's your team working on?" (warm)
- "Get your team on Slack" (action-oriented)
- "Pro tip: Use threads..." (helpful)
```

### Example 3: Duolingo Onboarding Pattern

```
WHY IT WORKS:

1. No signup required to start
   - Pick language
   - Take placement test
   - Complete first lesson
   - THEN create account

2. Immediate gratification
   - First lesson in <3 minutes
   - Celebration animations
   - XP and streaks start day 1

3. Habit formation
   - Daily reminders
   - Streak protection
   - Social competition

4. Personalization
   - "Why are you learning?"
   - Difficulty adaptation
   - Custom daily goals

METRICS:
- 30%+ Day 1 retention
- 10%+ Day 30 retention
- 5M+ daily active learners
```

---

## ⚡ Quick Wins

### Immediate Improvements (< 1 Day)

| Change | Expected Impact | Effort |
|--------|----------------|--------|
| Add progress indicator | +5-10% completion | 1 hour |
| Reduce form fields by 1 | +10-15% completion | 30 min |
| Add social proof | +5-10% signup | 1 hour |
| Make CTA more specific | +5-15% click rate | 15 min |
| Add "Skip" option | +10% completion | 30 min |
| Pre-fill known data | +15-20% completion | 2 hours |

### Copy Quick Fixes

```markdown
BEFORE: "Sign Up"
AFTER: "Get Your Free Meal Plan"
WHY: Benefit-focused > action-focused

BEFORE: "Create Account"
AFTER: "Save My Progress"
WHY: Shows immediate value

BEFORE: "Next"
AFTER: "See My Results →"
WHY: Creates anticipation

BEFORE: "Enter your email"
AFTER: "Where should we send your plan?"
WHY: Explains the why
```

### Form Optimization

```markdown
REMOVE:
- Phone number (unless essential)
- Separate first/last name (use single "name")
- Company name (ask later)
- Password confirmation (show/hide toggle instead)

ADD:
- Password strength indicator
- Real-time validation
- Clear error messages
- Smart defaults
```

---

## 📊 Success Metrics

### Primary Metrics

| Metric | Formula | Good | Great | World-Class |
|--------|---------|------|-------|-------------|
| Signup Rate | Signups / Visitors | 3-5% | 5-10% | 10%+ |
| Onboarding Completion | Completed / Started | 50-60% | 60-75% | 75%+ |
| Activation Rate | Activated / Completed | 30-40% | 40-60% | 60%+ |
| Time to Value | Avg time to first value | <10 min | <5 min | <2 min |
| Day 1 Retention | Return in 24h | 25-35% | 35-50% | 50%+ |
| Day 7 Retention | Return in 7 days | 10-20% | 20-35% | 35%+ |

### Secondary Metrics

| Metric | What It Tells You |
|--------|-------------------|
| Step completion rates | Where users struggle |
| Skip rates | What users find unnecessary |
| Time per step | Complexity/confusion |
| Back button usage | Mistakes or uncertainty |
| Error rates | Technical or UX issues |
| Support tickets | Confusion points |

### Calculating Impact

```
Revenue Impact = 
  (Users × Improvement) × Activation Rate × LTV

Example:
- 10,000 signups/month
- Onboarding improvement: +15%
- Users gained: 1,500
- Activation rate: 50%
- LTV: $100

Revenue Impact = 1,500 × 50% × $100 = $75,000/month
```

---

## 🗓️ Deployment Timeline

### Phase 1: Audit & Quick Wins (Week 1)

```
Day 1-2: Current State Analysis
- Document existing flow
- Gather current metrics
- Collect user feedback
- Identify biggest dropoffs

Day 3-4: Quick Wins
- Implement copy improvements
- Add progress indicators
- Remove unnecessary fields
- Add skip options

Day 5: Measure & Document
- Track quick win impact
- Document learnings
- Plan Phase 2
```

### Phase 2: Core Improvements (Week 2-3)

```
Week 2:
- Design new flow
- Create wireframes
- Write copy
- Build prototypes
- User test with 5 users

Week 3:
- Implement changes
- Set up analytics
- QA testing
- Soft launch (10% traffic)
```

### Phase 3: Optimization (Week 4+)

```
Week 4:
- Analyze soft launch data
- Fix issues found
- Full rollout
- Launch email sequence

Ongoing:
- Weekly metric review
- Monthly A/B tests
- Quarterly major updates
```

---

## 🔍 Troubleshooting

### "Users aren't signing up"

**Check:**
1. Value proposition clarity
2. Social proof presence
3. Friction in signup form
4. Page load speed
5. Mobile experience

**Try:**
- Show value before asking for signup
- Reduce form fields
- Add testimonials
- Offer social login

### "Users sign up but don't activate"

**Check:**
1. Time to first value
2. Onboarding completion rates
3. Activation event clarity
4. Email delivery rates

**Try:**
- Guide to first action
- Simplify activation path
- Add celebratory moments
- Send activation reminders

### "Users complete onboarding but don't return"

**Check:**
1. Did they reach the "aha moment"?
2. Is there a reason to return?
3. Are reminders being received?
4. Is Day 1 experience engaging?

**Try:**
- Earlier habit loop creation
- Push notification optimization
- Content/value drip
- Social features

### "Metrics look good but users complain"

**Check:**
1. Qualitative feedback
2. Support ticket themes
3. Session recordings
4. Segment-specific issues

**Try:**
- User interviews
- On-page surveys
- Rage click analysis
- A/B test alternatives

---

## 🚀 Quick Commands Reference

```
# Strategy
DESIGN ONBOARDING [product details]
AUDIT FLOW [current flow description]
COMPARE [competitor]

# Optimization
FIX DROPOFF [step details]
INCREASE ACTIVATION [current metrics]
IMPROVE RETENTION [day X]

# Implementation
CREATE FLOW [requirements]
WRITE COPY [element details]
DESIGN EXPERIMENT [hypothesis]
DESIGN EMAIL SEQUENCE [trigger]

# Analysis
ANALYZE FUNNEL [metrics]
SEGMENT USERS [data]
CALCULATE IMPACT [change]
```

---

## 📁 Files in OnboardingBot Pro

```
docs/
├── onboarding_agent_prompt.md     # System prompt (800 lines)
├── onboarding_usage_guide.md      # Integration guide (600 lines)
└── onboarding_complete_guide.md   # This file (800 lines)
```

---

**OnboardingBot Pro - Convert signups into power users! 🚀**
