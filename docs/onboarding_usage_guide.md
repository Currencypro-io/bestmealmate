# OnboardingBot Pro - Complete Usage Guide

This guide provides 4 implementation methods for integrating OnboardingBot Pro into your workflow, from quick testing to full production integration.

---

## 📋 Table of Contents

1. [Method 1: Quick Testing](#method-1-quick-testing-5-minutes)
2. [Method 2: Production Integration](#method-2-production-integration-30-minutes)
3. [Method 3: Figma Integration](#method-3-figma-integration-20-minutes)
4. [Method 4: Analytics Dashboard](#method-4-analytics-dashboard-45-minutes)
5. [OnboardingBotService Class](#onboardingbotservice-class)
6. [React Components](#react-components)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)

---

## Method 1: Quick Testing (5 minutes)

Test OnboardingBot Pro immediately without any code changes.

### Step 1: Copy the System Prompt
Copy the entire contents of `onboarding_agent_prompt.md`.

### Step 2: Open Claude.ai
Go to [claude.ai](https://claude.ai) and start a new conversation.

### Step 3: Set System Prompt
Paste the system prompt as your first message, or use Projects to save it.

### Step 4: Start Designing
Try these example prompts:

```
DESIGN ONBOARDING
Product: BestMealMate - meal planning app
Target users: Busy families who want to save time and eat healthier
Current state: Basic email/password signup, no onboarding flow
Goal: Get users to plan their first week of meals

Please provide:
1. Complete onboarding flow (steps, screens, copy)
2. Personalization strategy
3. Activation metrics to track
4. Email sequence for first week
```

```
AUDIT FLOW
Current onboarding:
1. Landing page → Sign up button
2. Email + password form
3. "Welcome to BestMealMate" screen
4. Dumped on dashboard with empty state

Problems:
- 60% drop off at step 2
- Only 15% plan first meal within 7 days
- Users say they're "confused about what to do"

What's wrong and how do we fix it?
```

```
FIX DROPOFF
Step: Email/password signup form
Current conversion: 40%
Target: 65%
Context: Mobile web, US market, meal planning app

Give me specific, actionable fixes.
```

---

## Method 2: Production Integration (30 minutes)

Integrate OnboardingBot Pro as a backend service in your Next.js app.

### Prerequisites
```bash
npm install @anthropic-ai/sdk
```

### Environment Variables
```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

### Step 1: Create OnboardingBot Service

```typescript
// lib/onboardingbot-service.ts
import Anthropic from '@anthropic-ai/sdk';
import { ONBOARDINGBOT_SYSTEM_PROMPT } from './prompts/onboardingbot-prompt';

export interface OnboardingFlowDesign {
  overview: {
    totalSteps: number;
    estimatedTime: string;
    personalizationPoints: string[];
  };
  steps: OnboardingStep[];
  copyRecommendations: CopyRecommendation[];
  metrics: MetricDefinition[];
  experiments: ExperimentSuggestion[];
}

export interface OnboardingStep {
  id: string;
  order: number;
  name: string;
  type: 'info' | 'input' | 'choice' | 'action' | 'permission';
  goal: string;
  content: {
    headline: string;
    subheadline?: string;
    body?: string;
    cta: string;
    secondaryCta?: string;
  };
  inputs?: InputField[];
  choices?: Choice[];
  validation?: string[];
  skipOption: boolean;
  estimatedTime: string;
  dropoffRisk: 'low' | 'medium' | 'high';
  optimizationTips: string[];
}

interface InputField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: string;
}

interface Choice {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  leadsTo?: string;
}

interface CopyRecommendation {
  location: string;
  current?: string;
  recommended: string;
  reasoning: string;
}

interface MetricDefinition {
  name: string;
  description: string;
  formula: string;
  target: string;
  trackingEvent: string;
}

interface ExperimentSuggestion {
  name: string;
  hypothesis: string;
  metric: string;
  variants: { name: string; description: string }[];
  expectedImpact: string;
}

export interface FlowAuditResult {
  overallScore: number;
  strengths: string[];
  issues: FlowIssue[];
  recommendations: Recommendation[];
  benchmarkComparison: BenchmarkComparison;
}

interface FlowIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  step: string;
  issue: string;
  impact: string;
  fix: string;
}

interface Recommendation {
  priority: number;
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  implementation: string;
}

interface BenchmarkComparison {
  industry: string;
  yourMetrics: Record<string, number>;
  industryAverage: Record<string, number>;
  topPerformers: Record<string, number>;
}

export interface EmailSequence {
  trigger: string;
  emails: EmailTemplate[];
  expectedMetrics: {
    openRate: string;
    clickRate: string;
    conversionRate: string;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  delay: string;
  subject: string;
  preheader: string;
  body: string;
  cta: {
    text: string;
    url: string;
  };
  sendConditions: string[];
  skipConditions: string[];
}

export interface SegmentationStrategy {
  segments: UserSegment[];
  questions: SegmentQuestion[];
  pathMapping: PathMapping[];
}

interface UserSegment {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  size: string;
  value: 'high' | 'medium' | 'low';
}

interface SegmentQuestion {
  question: string;
  options: { value: string; label: string; segment: string }[];
  placement: string;
}

interface PathMapping {
  segment: string;
  customizations: {
    messaging: Record<string, string>;
    features: string[];
    skipSteps: string[];
  };
}

class OnboardingBotService {
  private client: Anthropic;
  private model = 'claude-sonnet-4-20250514';

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }

  /**
   * Design a complete onboarding flow from scratch
   */
  async designOnboardingFlow(input: {
    productName: string;
    productDescription: string;
    targetUsers: string;
    currentState?: string;
    activationGoal: string;
    constraints?: string[];
  }): Promise<OnboardingFlowDesign> {
    const prompt = `DESIGN ONBOARDING

Product: ${input.productName}
Description: ${input.productDescription}
Target Users: ${input.targetUsers}
${input.currentState ? `Current State: ${input.currentState}` : ''}
Activation Goal: ${input.activationGoal}
${input.constraints?.length ? `Constraints: ${input.constraints.join(', ')}` : ''}

Design a complete onboarding flow including:
1. Overview (steps, time, personalization points)
2. Detailed step-by-step flow with copy
3. Copy recommendations
4. Metrics to track
5. A/B test suggestions

Return as JSON:
{
  "overview": { "totalSteps": number, "estimatedTime": string, "personalizationPoints": [] },
  "steps": [{ "id": string, "order": number, "name": string, "type": string, "goal": string, "content": {}, "inputs": [], "choices": [], "skipOption": boolean, "estimatedTime": string, "dropoffRisk": string, "optimizationTips": [] }],
  "copyRecommendations": [{ "location": string, "recommended": string, "reasoning": string }],
  "metrics": [{ "name": string, "description": string, "formula": string, "target": string, "trackingEvent": string }],
  "experiments": [{ "name": string, "hypothesis": string, "metric": string, "variants": [], "expectedImpact": string }]
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse onboarding flow design');
    }

    return JSON.parse(jsonMatch[0]) as OnboardingFlowDesign;
  }

  /**
   * Audit an existing onboarding flow
   */
  async auditOnboardingFlow(input: {
    currentFlow: string;
    metrics?: {
      signupRate?: number;
      completionRate?: number;
      activationRate?: number;
      day1Retention?: number;
      day7Retention?: number;
    };
    userFeedback?: string[];
    industry?: string;
  }): Promise<FlowAuditResult> {
    const prompt = `AUDIT FLOW

Current Flow:
${input.currentFlow}

${input.metrics ? `Metrics:
- Signup Rate: ${input.metrics.signupRate || 'unknown'}%
- Completion Rate: ${input.metrics.completionRate || 'unknown'}%
- Activation Rate: ${input.metrics.activationRate || 'unknown'}%
- Day 1 Retention: ${input.metrics.day1Retention || 'unknown'}%
- Day 7 Retention: ${input.metrics.day7Retention || 'unknown'}%` : ''}

${input.userFeedback?.length ? `User Feedback:\n${input.userFeedback.map(f => `- ${f}`).join('\n')}` : ''}

${input.industry ? `Industry: ${input.industry}` : ''}

Audit this flow and provide:
1. Overall score (0-100)
2. Strengths
3. Issues with severity and fixes
4. Prioritized recommendations
5. Benchmark comparison

Return as JSON:
{
  "overallScore": number,
  "strengths": [],
  "issues": [{ "severity": string, "step": string, "issue": string, "impact": string, "fix": string }],
  "recommendations": [{ "priority": number, "title": string, "description": string, "expectedImpact": string, "effort": string, "implementation": string }],
  "benchmarkComparison": { "industry": string, "yourMetrics": {}, "industryAverage": {}, "topPerformers": {} }
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse audit result');
    }

    return JSON.parse(jsonMatch[0]) as FlowAuditResult;
  }

  /**
   * Design an email sequence for onboarding
   */
  async designEmailSequence(input: {
    trigger: 'signup' | 'abandonment' | 'activation' | 'inactivity';
    productName: string;
    activationGoal: string;
    userSegment?: string;
    tone?: string;
  }): Promise<EmailSequence> {
    const prompt = `DESIGN EMAIL SEQUENCE

Trigger: ${input.trigger}
Product: ${input.productName}
Activation Goal: ${input.activationGoal}
${input.userSegment ? `User Segment: ${input.userSegment}` : ''}
${input.tone ? `Tone: ${input.tone}` : ''}

Create an email sequence including:
1. 3-5 emails with timing
2. Subject lines and preheaders
3. Full email copy
4. CTAs with URLs
5. Send/skip conditions
6. Expected metrics

Return as JSON:
{
  "trigger": string,
  "emails": [{ "id": string, "name": string, "delay": string, "subject": string, "preheader": string, "body": string, "cta": { "text": string, "url": string }, "sendConditions": [], "skipConditions": [] }],
  "expectedMetrics": { "openRate": string, "clickRate": string, "conversionRate": string }
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse email sequence');
    }

    return JSON.parse(jsonMatch[0]) as EmailSequence;
  }

  /**
   * Create a user segmentation strategy
   */
  async designSegmentation(input: {
    productName: string;
    productDescription: string;
    knownUserTypes?: string[];
    dataAvailable?: string[];
  }): Promise<SegmentationStrategy> {
    const prompt = `DESIGN SEGMENTATION

Product: ${input.productName}
Description: ${input.productDescription}
${input.knownUserTypes?.length ? `Known User Types: ${input.knownUserTypes.join(', ')}` : ''}
${input.dataAvailable?.length ? `Data Available: ${input.dataAvailable.join(', ')}` : ''}

Create a segmentation strategy including:
1. 3-5 distinct user segments
2. Questions to identify segments
3. Customized paths for each segment

Return as JSON:
{
  "segments": [{ "id": string, "name": string, "description": string, "characteristics": [], "size": string, "value": string }],
  "questions": [{ "question": string, "options": [{ "value": string, "label": string, "segment": string }], "placement": string }],
  "pathMapping": [{ "segment": string, "customizations": { "messaging": {}, "features": [], "skipSteps": [] } }]
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse segmentation strategy');
    }

    return JSON.parse(jsonMatch[0]) as SegmentationStrategy;
  }

  /**
   * Fix a specific dropoff point
   */
  async fixDropoff(input: {
    stepName: string;
    stepDescription: string;
    currentConversion: number;
    targetConversion: number;
    context?: string;
  }): Promise<{
    analysis: string;
    issues: { issue: string; impact: string }[];
    fixes: { fix: string; expectedImpact: string; effort: string; implementation: string }[];
    revisedStep: OnboardingStep;
  }> {
    const prompt = `FIX DROPOFF

Step: ${input.stepName}
Description: ${input.stepDescription}
Current Conversion: ${input.currentConversion}%
Target Conversion: ${input.targetConversion}%
${input.context ? `Context: ${input.context}` : ''}

Analyze why users drop off and provide:
1. Root cause analysis
2. Specific issues
3. Prioritized fixes with implementation details
4. Revised step design

Return as JSON:
{
  "analysis": string,
  "issues": [{ "issue": string, "impact": string }],
  "fixes": [{ "fix": string, "expectedImpact": string, "effort": string, "implementation": string }],
  "revisedStep": { /* full step object */ }
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse dropoff fix');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Write conversion-optimized copy
   */
  async writeCopy(input: {
    element: 'headline' | 'subheadline' | 'cta' | 'body' | 'email-subject' | 'push-notification';
    context: string;
    goal: string;
    tone?: string;
    constraints?: string[];
  }): Promise<{
    options: { copy: string; reasoning: string }[];
    bestOption: number;
    testSuggestion: string;
  }> {
    const prompt = `WRITE COPY

Element: ${input.element}
Context: ${input.context}
Goal: ${input.goal}
${input.tone ? `Tone: ${input.tone}` : ''}
${input.constraints?.length ? `Constraints: ${input.constraints.join(', ')}` : ''}

Write 3-5 copy options with reasoning, identify the best one, and suggest an A/B test.

Return as JSON:
{
  "options": [{ "copy": string, "reasoning": string }],
  "bestOption": number,
  "testSuggestion": string
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse copy options');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

export const onboardingBot = new OnboardingBotService();
export default onboardingBot;
```

### Step 2: Create API Endpoints

```typescript
// app/api/onboarding/design/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { onboardingBot } from '@/lib/onboardingbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await onboardingBot.designOnboardingFlow({
      productName: body.productName,
      productDescription: body.productDescription,
      targetUsers: body.targetUsers,
      currentState: body.currentState,
      activationGoal: body.activationGoal,
      constraints: body.constraints,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Onboarding design error:', error);
    return NextResponse.json(
      { error: 'Failed to design onboarding flow' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/onboarding/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { onboardingBot } from '@/lib/onboardingbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await onboardingBot.auditOnboardingFlow({
      currentFlow: body.currentFlow,
      metrics: body.metrics,
      userFeedback: body.userFeedback,
      industry: body.industry,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Onboarding audit error:', error);
    return NextResponse.json(
      { error: 'Failed to audit onboarding flow' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/onboarding/email-sequence/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { onboardingBot } from '@/lib/onboardingbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await onboardingBot.designEmailSequence({
      trigger: body.trigger,
      productName: body.productName,
      activationGoal: body.activationGoal,
      userSegment: body.userSegment,
      tone: body.tone,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Email sequence error:', error);
    return NextResponse.json(
      { error: 'Failed to design email sequence' },
      { status: 500 }
    );
  }
}
```

---

## Method 3: Figma Integration (20 minutes)

Connect OnboardingBot Pro to your Figma workflow.

```typescript
// lib/figma-onboarding-service.ts
import Anthropic from '@anthropic-ai/sdk';
import { ONBOARDINGBOT_SYSTEM_PROMPT } from './prompts/onboardingbot-prompt';

export class FigmaOnboardingService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }

  /**
   * Generate Figma-ready onboarding specifications
   */
  async generateFigmaSpecs(input: {
    flow: any;  // Onboarding flow from designOnboardingFlow
    designSystem?: string;
    platform: 'ios' | 'android' | 'web' | 'responsive';
  }): Promise<{
    screens: FigmaScreenSpec[];
    components: FigmaComponentSpec[];
    flows: FigmaFlowSpec[];
  }> {
    const prompt = `GENERATE FIGMA SPECS

Onboarding Flow:
${JSON.stringify(input.flow, null, 2)}

Platform: ${input.platform}
${input.designSystem ? `Design System: ${input.designSystem}` : ''}

Generate Figma-ready specifications:
1. Screen layouts and content
2. Component specifications
3. Flow connections

Return as JSON:
{
  "screens": [{ "name": string, "layout": string, "content": {}, "components": [], "notes": string }],
  "components": [{ "name": string, "variants": [], "properties": {} }],
  "flows": [{ "from": string, "to": string, "trigger": string, "animation": string }]
}`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to generate Figma specs');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Audit a Figma onboarding design
   */
  async auditFigmaDesign(input: {
    screens: { name: string; imageUrl?: string; description: string }[];
  }): Promise<{
    uxScore: number;
    issues: { screen: string; issue: string; fix: string }[];
    copyFeedback: { screen: string; element: string; current: string; suggested: string }[];
  }> {
    const prompt = `AUDIT FIGMA ONBOARDING

Screens:
${input.screens.map(s => `- ${s.name}: ${s.description}`).join('\n')}

Review these onboarding screens for:
1. UX best practices
2. Copy effectiveness
3. Flow logic

Return as JSON:
{
  "uxScore": number,
  "issues": [{ "screen": string, "issue": string, "fix": string }],
  "copyFeedback": [{ "screen": string, "element": string, "current": string, "suggested": string }]
}`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: ONBOARDINGBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to audit Figma design');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

interface FigmaScreenSpec {
  name: string;
  layout: string;
  content: Record<string, any>;
  components: string[];
  notes: string;
}

interface FigmaComponentSpec {
  name: string;
  variants: string[];
  properties: Record<string, any>;
}

interface FigmaFlowSpec {
  from: string;
  to: string;
  trigger: string;
  animation: string;
}

export const figmaOnboarding = new FigmaOnboardingService();
```

---

## Method 4: Analytics Dashboard (45 minutes)

Build a real-time onboarding analytics dashboard.

### Step 1: Create Analytics Service

```typescript
// lib/onboarding-analytics-service.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface OnboardingMetrics {
  funnel: {
    visitors: number;
    signups: number;
    started: number;
    completed: number;
    activated: number;
  };
  rates: {
    signupRate: number;
    startRate: number;
    completionRate: number;
    activationRate: number;
  };
  timing: {
    avgTimeToSignup: number;
    avgTimeToComplete: number;
    avgTimeToActivate: number;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  stepMetrics: {
    stepId: string;
    stepName: string;
    views: number;
    completions: number;
    skips: number;
    avgTime: number;
    dropoffRate: number;
  }[];
}

class OnboardingAnalyticsService {
  /**
   * Get comprehensive onboarding metrics
   */
  async getMetrics(dateRange: { start: Date; end: Date }): Promise<OnboardingMetrics> {
    const [funnel, timing, retention, stepMetrics] = await Promise.all([
      this.getFunnelMetrics(dateRange),
      this.getTimingMetrics(dateRange),
      this.getRetentionMetrics(dateRange),
      this.getStepMetrics(dateRange),
    ]);

    return {
      funnel,
      rates: {
        signupRate: funnel.visitors > 0 ? (funnel.signups / funnel.visitors) * 100 : 0,
        startRate: funnel.signups > 0 ? (funnel.started / funnel.signups) * 100 : 0,
        completionRate: funnel.started > 0 ? (funnel.completed / funnel.started) * 100 : 0,
        activationRate: funnel.completed > 0 ? (funnel.activated / funnel.completed) * 100 : 0,
      },
      timing,
      retention,
      stepMetrics,
    };
  }

  private async getFunnelMetrics(dateRange: { start: Date; end: Date }) {
    // Query your analytics tables
    const { data, error } = await supabase
      .from('onboarding_events')
      .select('event_type, count')
      .gte('created_at', dateRange.start.toISOString())
      .lte('created_at', dateRange.end.toISOString());

    if (error) throw error;

    // Aggregate funnel metrics
    const funnel = {
      visitors: 0,
      signups: 0,
      started: 0,
      completed: 0,
      activated: 0,
    };

    data?.forEach((row) => {
      if (row.event_type in funnel) {
        funnel[row.event_type as keyof typeof funnel] = row.count;
      }
    });

    return funnel;
  }

  private async getTimingMetrics(dateRange: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('time_to_signup, time_to_complete, time_to_activate')
      .gte('created_at', dateRange.start.toISOString())
      .lte('created_at', dateRange.end.toISOString())
      .not('time_to_complete', 'is', null);

    if (error) throw error;

    const avgTimeToSignup = data?.reduce((sum, r) => sum + (r.time_to_signup || 0), 0) / (data?.length || 1);
    const avgTimeToComplete = data?.reduce((sum, r) => sum + (r.time_to_complete || 0), 0) / (data?.length || 1);
    const avgTimeToActivate = data?.reduce((sum, r) => sum + (r.time_to_activate || 0), 0) / (data?.length || 1);

    return {
      avgTimeToSignup: Math.round(avgTimeToSignup),
      avgTimeToComplete: Math.round(avgTimeToComplete),
      avgTimeToActivate: Math.round(avgTimeToActivate),
    };
  }

  private async getRetentionMetrics(dateRange: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('user_retention')
      .select('day1_retained, day7_retained, day30_retained')
      .gte('signup_date', dateRange.start.toISOString())
      .lte('signup_date', dateRange.end.toISOString());

    if (error) throw error;

    const total = data?.length || 1;
    const day1 = data?.filter(r => r.day1_retained).length || 0;
    const day7 = data?.filter(r => r.day7_retained).length || 0;
    const day30 = data?.filter(r => r.day30_retained).length || 0;

    return {
      day1: (day1 / total) * 100,
      day7: (day7 / total) * 100,
      day30: (day30 / total) * 100,
    };
  }

  private async getStepMetrics(dateRange: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('onboarding_step_events')
      .select('step_id, step_name, event_type, avg_time')
      .gte('created_at', dateRange.start.toISOString())
      .lte('created_at', dateRange.end.toISOString());

    if (error) throw error;

    // Group by step and calculate metrics
    const stepMap = new Map<string, any>();
    
    data?.forEach((row) => {
      if (!stepMap.has(row.step_id)) {
        stepMap.set(row.step_id, {
          stepId: row.step_id,
          stepName: row.step_name,
          views: 0,
          completions: 0,
          skips: 0,
          avgTime: 0,
        });
      }
      
      const step = stepMap.get(row.step_id);
      if (row.event_type === 'view') step.views++;
      if (row.event_type === 'complete') {
        step.completions++;
        step.avgTime = row.avg_time;
      }
      if (row.event_type === 'skip') step.skips++;
    });

    return Array.from(stepMap.values()).map(step => ({
      ...step,
      dropoffRate: step.views > 0 ? ((step.views - step.completions - step.skips) / step.views) * 100 : 0,
    }));
  }

  /**
   * Track an onboarding event
   */
  async trackEvent(event: {
    userId: string;
    eventType: string;
    stepId?: string;
    properties?: Record<string, any>;
  }) {
    const { error } = await supabase.from('onboarding_events').insert({
      user_id: event.userId,
      event_type: event.eventType,
      step_id: event.stepId,
      properties: event.properties,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
  }
}

export const onboardingAnalytics = new OnboardingAnalyticsService();
```

### Step 2: Create Dashboard Component

```tsx
// components/OnboardingDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import type { OnboardingMetrics } from '@/lib/onboarding-analytics-service';

export default function OnboardingDashboard() {
  const [metrics, setMetrics] = useState<OnboardingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  async function loadMetrics() {
    setLoading(true);
    try {
      const response = await fetch(`/api/onboarding/metrics?range=${dateRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading metrics...</div>;
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Onboarding Analytics</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Visitors" value={metrics.funnel.visitors} />
        <MetricCard 
          label="Signups" 
          value={metrics.funnel.signups} 
          rate={metrics.rates.signupRate}
        />
        <MetricCard 
          label="Started" 
          value={metrics.funnel.started} 
          rate={metrics.rates.startRate}
        />
        <MetricCard 
          label="Completed" 
          value={metrics.funnel.completed} 
          rate={metrics.rates.completionRate}
        />
        <MetricCard 
          label="Activated" 
          value={metrics.funnel.activated} 
          rate={metrics.rates.activationRate}
        />
      </div>

      {/* Retention */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Retention</h2>
        <div className="grid grid-cols-3 gap-4">
          <RetentionCard label="Day 1" value={metrics.retention.day1} target={50} />
          <RetentionCard label="Day 7" value={metrics.retention.day7} target={35} />
          <RetentionCard label="Day 30" value={metrics.retention.day30} target={20} />
        </div>
      </div>

      {/* Step Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Step-by-Step Analysis</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="pb-2">Step</th>
              <th className="pb-2">Views</th>
              <th className="pb-2">Completions</th>
              <th className="pb-2">Skips</th>
              <th className="pb-2">Avg Time</th>
              <th className="pb-2">Drop-off</th>
            </tr>
          </thead>
          <tbody>
            {metrics.stepMetrics.map((step) => (
              <tr key={step.stepId} className="border-t">
                <td className="py-2 font-medium">{step.stepName}</td>
                <td className="py-2">{step.views}</td>
                <td className="py-2">{step.completions}</td>
                <td className="py-2">{step.skips}</td>
                <td className="py-2">{step.avgTime}s</td>
                <td className="py-2">
                  <span className={step.dropoffRate > 20 ? 'text-red-600' : 'text-green-600'}>
                    {step.dropoffRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ label, value, rate }: { label: string; value: number; rate?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-3xl font-bold">{value.toLocaleString()}</div>
      <div className="text-gray-600">{label}</div>
      {rate !== undefined && (
        <div className="text-sm text-green-600">{rate.toFixed(1)}% conversion</div>
      )}
    </div>
  );
}

function RetentionCard({ label, value, target }: { label: string; value: number; target: number }) {
  const isGood = value >= target;
  return (
    <div className={`rounded-lg p-4 ${isGood ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <div className={`text-3xl font-bold ${isGood ? 'text-green-600' : 'text-yellow-600'}`}>
        {value.toFixed(1)}%
      </div>
      <div className="text-gray-600">{label} Retention</div>
      <div className="text-sm text-gray-500">Target: {target}%</div>
    </div>
  );
}
```

---

## Database Schema

```sql
-- User onboarding state
CREATE TABLE user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'abandoned')),
  current_step TEXT,
  segment TEXT,
  personalized_path TEXT,
  steps_completed TEXT[] DEFAULT '{}',
  steps_skipped TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_to_signup INTEGER,           -- seconds
  time_to_complete INTEGER,         -- seconds
  time_to_activate INTEGER,         -- seconds
  activation_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding events
CREATE TABLE onboarding_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  step_id TEXT,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step-level events
CREATE TABLE onboarding_step_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  step_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'complete', 'skip', 'error')),
  time_spent INTEGER,               -- seconds
  inputs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User retention tracking
CREATE TABLE user_retention (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  signup_date DATE NOT NULL,
  day1_retained BOOLEAN DEFAULT FALSE,
  day7_retained BOOLEAN DEFAULT FALSE,
  day30_retained BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMPTZ
);

-- Experiments
CREATE TABLE onboarding_experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hypothesis TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  variants JSONB NOT NULL,
  targeting JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  results JSONB,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX idx_user_onboarding_status ON user_onboarding(status);
CREATE INDEX idx_onboarding_events_user_id ON onboarding_events(user_id);
CREATE INDEX idx_onboarding_events_type ON onboarding_events(event_type);
CREATE INDEX idx_onboarding_events_created ON onboarding_events(created_at);
CREATE INDEX idx_user_retention_signup ON user_retention(signup_date);

-- Enable RLS
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_step_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_retention ENABLE ROW LEVEL SECURITY;
```

---

## React Hook for Onboarding

```typescript
// hooks/useOnboarding.ts
'use client';

import { useState, useCallback, useEffect } from 'react';

interface OnboardingState {
  status: 'not_started' | 'in_progress' | 'completed';
  currentStep: string;
  completedSteps: string[];
  preferences: Record<string, any>;
}

export function useOnboarding(userId: string) {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboardingState();
  }, [userId]);

  async function loadOnboardingState() {
    try {
      const response = await fetch(`/api/onboarding/state?userId=${userId}`);
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    } finally {
      setLoading(false);
    }
  }

  const completeStep = useCallback(async (stepId: string, data?: Record<string, any>) => {
    const response = await fetch('/api/onboarding/complete-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, stepId, data }),
    });
    
    const updated = await response.json();
    setState(updated);
    return updated;
  }, [userId]);

  const skipStep = useCallback(async (stepId: string) => {
    const response = await fetch('/api/onboarding/skip-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, stepId }),
    });
    
    const updated = await response.json();
    setState(updated);
    return updated;
  }, [userId]);

  const trackEvent = useCallback(async (eventType: string, properties?: Record<string, any>) => {
    await fetch('/api/onboarding/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, eventType, properties }),
    });
  }, [userId]);

  return {
    state,
    loading,
    completeStep,
    skipStep,
    trackEvent,
    reload: loadOnboardingState,
  };
}
```

---

## Environment Variables

```env
# .env.local

# Anthropic (Required)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# Supabase (For persistence)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Analytics (Optional)
MIXPANEL_TOKEN=your-mixpanel-token
AMPLITUDE_API_KEY=your-amplitude-key
```

---

**OnboardingBot Pro is ready to boost your activation rates! 🚀**
