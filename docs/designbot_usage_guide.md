# DesignBot Pro - Complete Usage Guide

This guide provides 4 implementation methods for integrating DesignBot Pro into your workflow, from quick testing to full production integration.

---

## 📋 Table of Contents

1. [Method 1: Quick Testing](#method-1-quick-testing-5-minutes)
2. [Method 2: Production Integration](#method-2-production-integration-30-minutes)
3. [Method 3: Figma Integration](#method-3-figma-integration-20-minutes)
4. [Method 4: Monitoring Dashboard](#method-4-monitoring-dashboard-45-minutes)
5. [DesignBotService Class](#designbotservice-class)
6. [React Components](#react-components)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)

---

## Method 1: Quick Testing (5 minutes)

Test DesignBot Pro immediately without any code changes.

### Step 1: Copy the System Prompt
Copy the entire contents of `designbot_agent_prompt.md`.

### Step 2: Open Claude.ai
Go to [claude.ai](https://claude.ai) and start a new conversation.

### Step 3: Set System Prompt
Paste the system prompt as your first message, or use Projects to save it.

### Step 4: Start Designing
Try these example prompts:

```
AUDIT PAGE
Here's a screenshot of my meal planning app homepage.
[Paste screenshot or describe the UI]

Please provide:
1. Visual design assessment
2. Accessibility issues
3. UX improvements
4. CSS optimization tips
```

```
CREATE TOKENS
Create a design token system for BestMealMate.
Brand: Fresh, healthy, family-friendly
Primary color: Green (#22c55e)
Style: Modern, clean, approachable
```

```
SPEC COMPONENT
Create a full specification for a "MealCard" component.
- Shows meal name, image, prep time, servings
- Has save/unsave toggle
- Expandable for ingredients
- Used in meal browser and weekly plan
```

---

## Method 2: Production Integration (30 minutes)

Integrate DesignBot Pro as a backend service in your Next.js app.

### Prerequisites
```bash
npm install @anthropic-ai/sdk
```

### Environment Variables
```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

### Step 1: Create DesignBot Service

```typescript
// lib/designbot-service.ts
import Anthropic from '@anthropic-ai/sdk';
import { DESIGNBOT_SYSTEM_PROMPT } from './prompts/designbot-prompt';

export interface DesignAuditResult {
  score: number;
  issues: DesignIssue[];
  recommendations: Recommendation[];
  summary: string;
}

export interface DesignIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'accessibility' | 'visual' | 'usability' | 'performance' | 'responsive';
  title: string;
  description: string;
  location?: string;
  fix: string;
  codeExample?: string;
}

export interface Recommendation {
  id: string;
  priority: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
}

export interface ComponentSpec {
  name: string;
  description: string;
  variants: VariantSpec[];
  states: StateSpec[];
  props: PropSpec[];
  accessibility: A11ySpec;
  responsive: ResponsiveSpec;
  examples: CodeExample[];
}

interface VariantSpec {
  name: string;
  description: string;
  styles: Record<string, string>;
}

interface StateSpec {
  name: string;
  styles: Record<string, string>;
  triggers: string[];
}

interface PropSpec {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

interface A11ySpec {
  role: string;
  ariaAttributes: Record<string, string>;
  keyboardBehavior: string[];
  focusManagement: string;
  screenReaderNotes: string;
}

interface ResponsiveSpec {
  mobile: Record<string, string>;
  tablet: Record<string, string>;
  desktop: Record<string, string>;
}

interface CodeExample {
  title: string;
  code: string;
  language: string;
}

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
  borderRadius: BorderRadiusTokens;
  animation: AnimationTokens;
}

interface ColorTokens {
  primitive: Record<string, string>;
  semantic: Record<string, string>;
  component: Record<string, Record<string, string>>;
}

interface TypographyTokens {
  fontFamilies: Record<string, string>;
  fontSizes: Record<string, string>;
  fontWeights: Record<string, number>;
  lineHeights: Record<string, string>;
}

interface SpacingTokens {
  scale: Record<string, string>;
  semantic: Record<string, string>;
}

interface ShadowTokens {
  scale: Record<string, string>;
}

interface BorderRadiusTokens {
  scale: Record<string, string>;
}

interface AnimationTokens {
  durations: Record<string, string>;
  easings: Record<string, string>;
}

export interface ContrastCheckResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  normalTextAA: boolean;
  largeTextAA: boolean;
  uiComponentsAA: boolean;
  recommendation?: string;
}

class DesignBotService {
  private client: Anthropic;
  private model = 'claude-sonnet-4-20250514';

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }

  /**
   * Perform a full design audit on a page or component
   */
  async auditDesign(input: {
    screenshot?: string; // Base64 encoded image
    html?: string;
    css?: string;
    description?: string;
    focusAreas?: ('accessibility' | 'visual' | 'usability' | 'performance' | 'responsive')[];
  }): Promise<DesignAuditResult> {
    const messages: Anthropic.MessageParam[] = [];

    // Build the content array
    const content: Anthropic.ContentBlockParam[] = [];

    // Add image if provided
    if (input.screenshot) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: input.screenshot,
        },
      });
    }

    // Build text prompt
    let textPrompt = `AUDIT PAGE\n\n`;
    
    if (input.description) {
      textPrompt += `Description: ${input.description}\n\n`;
    }
    
    if (input.html) {
      textPrompt += `HTML:\n\`\`\`html\n${input.html}\n\`\`\`\n\n`;
    }
    
    if (input.css) {
      textPrompt += `CSS:\n\`\`\`css\n${input.css}\n\`\`\`\n\n`;
    }
    
    if (input.focusAreas?.length) {
      textPrompt += `Focus areas: ${input.focusAreas.join(', ')}\n\n`;
    }

    textPrompt += `Please provide a comprehensive design audit with:
1. Overall score (0-100)
2. Issues found with severity, category, and fixes
3. Prioritized recommendations
4. Executive summary

Return your response as valid JSON matching this schema:
{
  "score": number,
  "issues": [{ "id": string, "severity": string, "category": string, "title": string, "description": string, "location": string, "fix": string, "codeExample": string }],
  "recommendations": [{ "id": string, "priority": number, "title": string, "description": string, "impact": string, "effort": string, "category": string }],
  "summary": string
}`;

    content.push({ type: 'text', text: textPrompt });
    messages.push({ role: 'user', content });

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages,
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse audit response');
    }

    return JSON.parse(jsonMatch[0]) as DesignAuditResult;
  }

  /**
   * Generate a full component specification
   */
  async specifyComponent(input: {
    name: string;
    description: string;
    useCases: string[];
    existingCode?: string;
    designSystem?: string;
  }): Promise<ComponentSpec> {
    const prompt = `SPEC COMPONENT

Component Name: ${input.name}
Description: ${input.description}
Use Cases:
${input.useCases.map((uc, i) => `${i + 1}. ${uc}`).join('\n')}

${input.existingCode ? `Existing Code:\n\`\`\`tsx\n${input.existingCode}\n\`\`\`` : ''}
${input.designSystem ? `Design System: ${input.designSystem}` : ''}

Create a comprehensive component specification including:
1. All variants (primary, secondary, ghost, danger, etc.)
2. All states (default, hover, focus, active, disabled, loading)
3. Props interface with types and defaults
4. Accessibility requirements (role, ARIA, keyboard, focus)
5. Responsive behavior
6. Code examples

Return your response as valid JSON matching this schema:
{
  "name": string,
  "description": string,
  "variants": [{ "name": string, "description": string, "styles": {} }],
  "states": [{ "name": string, "styles": {}, "triggers": [] }],
  "props": [{ "name": string, "type": string, "required": boolean, "default": string, "description": string }],
  "accessibility": { "role": string, "ariaAttributes": {}, "keyboardBehavior": [], "focusManagement": string, "screenReaderNotes": string },
  "responsive": { "mobile": {}, "tablet": {}, "desktop": {} },
  "examples": [{ "title": string, "code": string, "language": string }]
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse component specification');
    }

    return JSON.parse(jsonMatch[0]) as ComponentSpec;
  }

  /**
   * Generate design tokens for a brand
   */
  async generateTokens(input: {
    brandName: string;
    primaryColor: string;
    style: string;
    additionalColors?: Record<string, string>;
    existingTokens?: Partial<DesignTokens>;
  }): Promise<DesignTokens> {
    const prompt = `CREATE TOKENS

Brand: ${input.brandName}
Primary Color: ${input.primaryColor}
Style: ${input.style}
${input.additionalColors ? `Additional Colors: ${JSON.stringify(input.additionalColors)}` : ''}
${input.existingTokens ? `Existing Tokens: ${JSON.stringify(input.existingTokens)}` : ''}

Generate a complete design token system including:
1. Color palette (primitive, semantic, component)
2. Typography scale
3. Spacing scale
4. Shadow scale
5. Border radius scale
6. Animation tokens

Ensure all colors meet WCAG AA contrast requirements.

Return your response as valid JSON matching this schema:
{
  "colors": { "primitive": {}, "semantic": {}, "component": {} },
  "typography": { "fontFamilies": {}, "fontSizes": {}, "fontWeights": {}, "lineHeights": {} },
  "spacing": { "scale": {}, "semantic": {} },
  "shadows": { "scale": {} },
  "borderRadius": { "scale": {} },
  "animation": { "durations": {}, "easings": {} }
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse design tokens');
    }

    return JSON.parse(jsonMatch[0]) as DesignTokens;
  }

  /**
   * Check color contrast for accessibility
   */
  async checkContrast(
    foreground: string,
    background: string,
    usage: 'normal-text' | 'large-text' | 'ui-component'
  ): Promise<ContrastCheckResult> {
    const prompt = `CHECK CONTRAST

Foreground: ${foreground}
Background: ${background}
Usage: ${usage}

Calculate the contrast ratio and check WCAG compliance.

Return your response as valid JSON:
{
  "ratio": number,
  "passesAA": boolean,
  "passesAAA": boolean,
  "normalTextAA": boolean,
  "largeTextAA": boolean,
  "uiComponentsAA": boolean,
  "recommendation": string or null
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse contrast check');
    }

    return JSON.parse(jsonMatch[0]) as ContrastCheckResult;
  }

  /**
   * Optimize CSS code
   */
  async optimizeCSS(input: {
    css: string;
    framework?: 'tailwind' | 'css-modules' | 'styled-components' | 'vanilla';
    targetMethodology?: 'bem' | 'oocss' | 'smacss' | 'itcss';
  }): Promise<{
    optimizedCSS: string;
    savings: { bytes: number; percentage: number };
    changes: { before: string; after: string; reason: string }[];
    warnings: string[];
  }> {
    const prompt = `OPTIMIZE CSS

\`\`\`css
${input.css}
\`\`\`

Framework: ${input.framework || 'vanilla'}
${input.targetMethodology ? `Target Methodology: ${input.targetMethodology}` : ''}

Optimize this CSS for:
1. Reduced file size
2. Better specificity
3. Improved maintainability
4. Performance

Return your response as valid JSON:
{
  "optimizedCSS": string,
  "savings": { "bytes": number, "percentage": number },
  "changes": [{ "before": string, "after": string, "reason": string }],
  "warnings": []
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse CSS optimization');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Get accessibility fixes for a component
   */
  async getAccessibilityFixes(input: {
    html: string;
    componentName?: string;
    wcagLevel?: 'A' | 'AA' | 'AAA';
  }): Promise<{
    issues: {
      criterion: string;
      level: 'A' | 'AA' | 'AAA';
      issue: string;
      fix: string;
      fixedHTML: string;
    }[];
    fixedHTML: string;
    summary: string;
  }> {
    const prompt = `A11Y CHECK

Component: ${input.componentName || 'Unknown'}
Target Level: WCAG 2.1 ${input.wcagLevel || 'AA'}

\`\`\`html
${input.html}
\`\`\`

Audit this HTML for accessibility issues and provide fixes.

Return your response as valid JSON:
{
  "issues": [{ "criterion": string, "level": string, "issue": string, "fix": string, "fixedHTML": string }],
  "fixedHTML": string,
  "summary": string
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse accessibility audit');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

export const designBot = new DesignBotService();
export default designBot;
```

### Step 2: Create the System Prompt File

```typescript
// lib/prompts/designbot-prompt.ts
export const DESIGNBOT_SYSTEM_PROMPT = `
[Paste the entire contents of designbot_agent_prompt.md here]
`;
```

### Step 3: Create API Endpoints

```typescript
// app/api/design/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { designBot } from '@/lib/designbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await designBot.auditDesign({
      screenshot: body.screenshot,
      html: body.html,
      css: body.css,
      description: body.description,
      focusAreas: body.focusAreas,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Design audit error:', error);
    return NextResponse.json(
      { error: 'Failed to perform design audit' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/design/component-spec/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { designBot } from '@/lib/designbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await designBot.specifyComponent({
      name: body.name,
      description: body.description,
      useCases: body.useCases,
      existingCode: body.existingCode,
      designSystem: body.designSystem,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Component spec error:', error);
    return NextResponse.json(
      { error: 'Failed to generate component specification' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/design/tokens/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { designBot } from '@/lib/designbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await designBot.generateTokens({
      brandName: body.brandName,
      primaryColor: body.primaryColor,
      style: body.style,
      additionalColors: body.additionalColors,
      existingTokens: body.existingTokens,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate design tokens' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/design/contrast/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { designBot } from '@/lib/designbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await designBot.checkContrast(
      body.foreground,
      body.background,
      body.usage
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Contrast check error:', error);
    return NextResponse.json(
      { error: 'Failed to check contrast' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/design/optimize-css/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { designBot } from '@/lib/designbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await designBot.optimizeCSS({
      css: body.css,
      framework: body.framework,
      targetMethodology: body.targetMethodology,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('CSS optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize CSS' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/design/a11y/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { designBot } from '@/lib/designbot-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await designBot.getAccessibilityFixes({
      html: body.html,
      componentName: body.componentName,
      wcagLevel: body.wcagLevel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Accessibility audit error:', error);
    return NextResponse.json(
      { error: 'Failed to audit accessibility' },
      { status: 500 }
    );
  }
}
```

---

## Method 3: Figma Integration (20 minutes)

Connect DesignBot Pro to your Figma workflow for design-to-code handoff.

### Step 1: Install Figma MCP or Export Plugin

```bash
# Option 1: Use Figma API
npm install figma-api

# Option 2: Export from Figma as JSON
# Use Figma's "Export as JSON" plugin
```

### Step 2: Create Figma Service

```typescript
// lib/figma-service.ts
import Anthropic from '@anthropic-ai/sdk';
import { DESIGNBOT_SYSTEM_PROMPT } from './prompts/designbot-prompt';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  fills?: any[];
  strokes?: any[];
  effects?: any[];
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  style?: Record<string, any>;
}

export class FigmaDesignBotService {
  private client: Anthropic;
  private model = 'claude-sonnet-4-20250514';

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }

  /**
   * Convert Figma export to React/CSS code
   */
  async figmaToCode(input: {
    figmaJSON: FigmaNode;
    framework: 'react-tailwind' | 'react-css-modules' | 'react-styled';
    options?: {
      useTypeScript?: boolean;
      includeResponsive?: boolean;
      includeA11y?: boolean;
    };
  }): Promise<{
    componentCode: string;
    styleCode: string;
    usage: string;
    notes: string[];
  }> {
    const prompt = `FIGMA TO CODE

Convert this Figma component to code.

Figma JSON:
\`\`\`json
${JSON.stringify(input.figmaJSON, null, 2)}
\`\`\`

Framework: ${input.framework}
TypeScript: ${input.options?.useTypeScript ?? true}
Include Responsive: ${input.options?.includeResponsive ?? true}
Include A11y: ${input.options?.includeA11y ?? true}

Generate:
1. Component code (React)
2. Style code (Tailwind/CSS Modules/Styled Components)
3. Usage example
4. Implementation notes

Return as JSON:
{
  "componentCode": string,
  "styleCode": string,
  "usage": string,
  "notes": []
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to convert Figma to code');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Extract design tokens from Figma styles
   */
  async extractTokensFromFigma(input: {
    styles: Record<string, any>;
    components: Record<string, any>;
  }): Promise<{
    tokens: Record<string, any>;
    cssVariables: string;
    tailwindConfig: string;
  }> {
    const prompt = `EXTRACT FIGMA TOKENS

Styles:
\`\`\`json
${JSON.stringify(input.styles, null, 2)}
\`\`\`

Components:
\`\`\`json
${JSON.stringify(input.components, null, 2)}
\`\`\`

Extract design tokens and generate:
1. Token JSON structure
2. CSS custom properties
3. Tailwind config extension

Return as JSON:
{
  "tokens": {},
  "cssVariables": string,
  "tailwindConfig": string
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to extract Figma tokens');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Review Figma design for issues before handoff
   */
  async reviewFigmaDesign(input: {
    screens: { name: string; nodes: FigmaNode }[];
    designSystem?: Record<string, any>;
  }): Promise<{
    overallScore: number;
    screenReviews: {
      screenName: string;
      score: number;
      issues: { type: string; description: string; location: string; fix: string }[];
    }[];
    consistencyIssues: { issue: string; locations: string[] }[];
    recommendations: string[];
  }> {
    const prompt = `REVIEW FIGMA DESIGN

Screens to review:
${input.screens.map(s => `
## ${s.name}
\`\`\`json
${JSON.stringify(s.nodes, null, 2)}
\`\`\`
`).join('\n')}

${input.designSystem ? `Design System:\n\`\`\`json\n${JSON.stringify(input.designSystem, null, 2)}\n\`\`\`` : ''}

Review for:
1. Visual consistency across screens
2. Accessibility issues
3. Component reusability
4. Design system adherence
5. Responsive considerations

Return as JSON:
{
  "overallScore": number,
  "screenReviews": [{ "screenName": string, "score": number, "issues": [] }],
  "consistencyIssues": [{ "issue": string, "locations": [] }],
  "recommendations": []
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: DESIGNBOT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to review Figma design');
    }

    return JSON.parse(jsonMatch[0]);
  }
}

export const figmaDesignBot = new FigmaDesignBotService();
```

---

## Method 4: Monitoring Dashboard (45 minutes)

Build a real-time design quality monitoring dashboard.

### Step 1: Create Design Metrics Types

```typescript
// types/design-metrics.ts
export interface DesignMetrics {
  id: string;
  pageUrl: string;
  timestamp: Date;
  
  // Scores
  overallScore: number;
  accessibilityScore: number;
  visualConsistencyScore: number;
  performanceScore: number;
  responsiveScore: number;
  
  // Issues
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  
  // Details
  issues: DesignIssue[];
  recommendations: string[];
  
  // Trends
  previousScore?: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface DesignIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  location?: string;
  fix: string;
}
```

### Step 2: Create Monitoring Service

```typescript
// lib/design-monitoring-service.ts
import { createClient } from '@supabase/supabase-js';
import { designBot, DesignAuditResult } from './designbot-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DesignAuditRecord {
  id: string;
  page_url: string;
  audit_type: 'manual' | 'scheduled' | 'ci';
  overall_score: number;
  accessibility_score: number;
  visual_score: number;
  performance_score: number;
  responsive_score: number;
  issues: any;
  recommendations: any;
  created_at: string;
}

class DesignMonitoringService {
  /**
   * Run a design audit and save results
   */
  async runAndSaveAudit(input: {
    pageUrl: string;
    screenshot?: string;
    html?: string;
    css?: string;
    auditType?: 'manual' | 'scheduled' | 'ci';
  }): Promise<DesignAuditRecord> {
    // Run the audit
    const auditResult = await designBot.auditDesign({
      screenshot: input.screenshot,
      html: input.html,
      css: input.css,
      description: `Audit for ${input.pageUrl}`,
    });

    // Calculate category scores
    const categoryScores = this.calculateCategoryScores(auditResult);

    // Save to database
    const { data, error } = await supabase
      .from('design_audits')
      .insert({
        page_url: input.pageUrl,
        audit_type: input.auditType || 'manual',
        overall_score: auditResult.score,
        accessibility_score: categoryScores.accessibility,
        visual_score: categoryScores.visual,
        performance_score: categoryScores.performance,
        responsive_score: categoryScores.responsive,
        issues: auditResult.issues,
        recommendations: auditResult.recommendations,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get audit history for a page
   */
  async getAuditHistory(pageUrl: string, limit = 10): Promise<DesignAuditRecord[]> {
    const { data, error } = await supabase
      .from('design_audits')
      .select('*')
      .eq('page_url', pageUrl)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Get all pages' latest scores
   */
  async getLatestScores(): Promise<{
    pageUrl: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
    lastAudit: string;
  }[]> {
    const { data, error } = await supabase
      .from('design_audits')
      .select('page_url, overall_score, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by page and calculate trends
    const pageMap = new Map<string, { scores: number[]; dates: string[] }>();
    
    data.forEach((record) => {
      const existing = pageMap.get(record.page_url);
      if (existing) {
        existing.scores.push(record.overall_score);
        existing.dates.push(record.created_at);
      } else {
        pageMap.set(record.page_url, {
          scores: [record.overall_score],
          dates: [record.created_at],
        });
      }
    });

    return Array.from(pageMap.entries()).map(([pageUrl, { scores, dates }]) => {
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (scores.length >= 2) {
        const diff = scores[0] - scores[1];
        if (diff > 2) trend = 'up';
        else if (diff < -2) trend = 'down';
      }

      return {
        pageUrl,
        score: scores[0],
        trend,
        lastAudit: dates[0],
      };
    });
  }

  /**
   * Get issues summary across all pages
   */
  async getIssuesSummary(): Promise<{
    total: number;
    bySeverity: { critical: number; high: number; medium: number; low: number };
    byCategory: Record<string, number>;
    trending: { issue: string; count: number }[];
  }> {
    const { data, error } = await supabase
      .from('design_audits')
      .select('issues')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const allIssues = data.flatMap((d) => d.issues || []);
    
    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
    const byCategory: Record<string, number> = {};
    const issueCount: Record<string, number> = {};

    allIssues.forEach((issue: any) => {
      bySeverity[issue.severity as keyof typeof bySeverity]++;
      byCategory[issue.category] = (byCategory[issue.category] || 0) + 1;
      issueCount[issue.title] = (issueCount[issue.title] || 0) + 1;
    });

    const trending = Object.entries(issueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([issue, count]) => ({ issue, count }));

    return {
      total: allIssues.length,
      bySeverity,
      byCategory,
      trending,
    };
  }

  private calculateCategoryScores(result: DesignAuditResult): {
    accessibility: number;
    visual: number;
    performance: number;
    responsive: number;
  } {
    const categories = { accessibility: 100, visual: 100, performance: 100, responsive: 100 };
    const penalties = { critical: 20, high: 10, medium: 5, low: 2 };

    result.issues.forEach((issue) => {
      const category = issue.category as keyof typeof categories;
      if (categories[category] !== undefined) {
        categories[category] -= penalties[issue.severity];
      }
    });

    // Ensure scores don't go below 0
    Object.keys(categories).forEach((key) => {
      categories[key as keyof typeof categories] = Math.max(0, categories[key as keyof typeof categories]);
    });

    return categories;
  }
}

export const designMonitoring = new DesignMonitoringService();
```

### Step 3: Create Dashboard API

```typescript
// app/api/design/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { designMonitoring } from '@/lib/design-monitoring-service';

export async function GET(request: NextRequest) {
  try {
    const [latestScores, issuesSummary] = await Promise.all([
      designMonitoring.getLatestScores(),
      designMonitoring.getIssuesSummary(),
    ]);

    return NextResponse.json({
      pages: latestScores,
      issues: issuesSummary,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
```

### Step 4: Create Dashboard Component

```tsx
// components/DesignDashboard.tsx
'use client';

import { useState, useEffect } from 'react';

interface DashboardData {
  pages: {
    pageUrl: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
    lastAudit: string;
  }[];
  issues: {
    total: number;
    bySeverity: { critical: number; high: number; medium: number; low: number };
    byCategory: Record<string, number>;
    trending: { issue: string; count: number }[];
  };
}

export default function DesignDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const response = await fetch('/api/design/dashboard');
      if (!response.ok) throw new Error('Failed to load dashboard');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Issues"
          value={data.issues.total}
          icon="⚠️"
        />
        <StatCard
          label="Critical"
          value={data.issues.bySeverity.critical}
          icon="🔴"
          alert={data.issues.bySeverity.critical > 0}
        />
        <StatCard
          label="High Priority"
          value={data.issues.bySeverity.high}
          icon="🟠"
        />
        <StatCard
          label="Pages Monitored"
          value={data.pages.length}
          icon="📄"
        />
      </div>

      {/* Page Scores */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Page Design Scores</h2>
        <div className="space-y-3">
          {data.pages.map((page) => (
            <PageScoreRow key={page.pageUrl} {...page} />
          ))}
        </div>
      </div>

      {/* Issues by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Issues by Category</h2>
          <div className="space-y-2">
            {Object.entries(data.issues.byCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="capitalize">{category}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Trending Issues</h2>
          <div className="space-y-2">
            {data.issues.trending.slice(0, 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm truncate flex-1 mr-4">{item.issue}</span>
                <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                  {item.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  alert = false,
}: {
  label: string;
  value: number;
  icon: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-4 ${
        alert ? 'ring-2 ring-red-500' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold ${alert ? 'text-red-600' : ''}`}>
          {value}
        </span>
      </div>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}

function PageScoreRow({
  pageUrl,
  score,
  trend,
  lastAudit,
}: {
  pageUrl: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  lastAudit: string;
}) {
  const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  const scoreColor =
    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium truncate">{pageUrl}</p>
        <p className="text-xs text-gray-500">
          Last audit: {new Date(lastAudit).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl">{trendIcon}</span>
        <div
          className={`w-20 text-center font-bold text-lg ${scoreColor}`}
        >
          {score}/100
        </div>
      </div>
    </div>
  );
}
```

---

## Database Schema

```sql
-- Design audit records
CREATE TABLE design_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  audit_type TEXT DEFAULT 'manual' CHECK (audit_type IN ('manual', 'scheduled', 'ci')),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  accessibility_score INTEGER CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
  visual_score INTEGER CHECK (visual_score >= 0 AND visual_score <= 100),
  performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
  responsive_score INTEGER CHECK (responsive_score >= 0 AND responsive_score <= 100),
  issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Component specifications
CREATE TABLE component_specs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  description TEXT,
  specification JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design tokens
CREATE TABLE design_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  tokens JSONB NOT NULL,
  css_output TEXT,
  tailwind_config TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_design_audits_page_url ON design_audits(page_url);
CREATE INDEX idx_design_audits_created_at ON design_audits(created_at DESC);
CREATE INDEX idx_component_specs_name ON component_specs(name);
CREATE INDEX idx_design_tokens_name ON design_tokens(name);

-- Enable RLS
ALTER TABLE design_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_tokens ENABLE ROW LEVEL SECURITY;
```

---

## React Hook for Design Audits

```typescript
// hooks/useDesignAudit.ts
'use client';

import { useState, useCallback } from 'react';
import type { DesignAuditResult } from '@/lib/designbot-service';

export function useDesignAudit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DesignAuditResult | null>(null);

  const runAudit = useCallback(async (input: {
    screenshot?: string;
    html?: string;
    css?: string;
    description?: string;
    focusAreas?: string[];
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/design/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Failed to run design audit');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const captureAndAudit = useCallback(async (element?: HTMLElement) => {
    // Use html2canvas or similar to capture screenshot
    // Then call runAudit with the screenshot
    const html = element?.innerHTML || document.body.innerHTML;
    return runAudit({ html });
  }, [runAudit]);

  return {
    loading,
    error,
    result,
    runAudit,
    captureAndAudit,
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

# Figma (Optional - for Figma integration)
FIGMA_ACCESS_TOKEN=your-figma-token
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Design Score | ≥ 80/100 | Average across all pages |
| Accessibility | ≥ 90/100 | WCAG 2.1 AA compliance |
| Critical Issues | 0 | No critical issues open |
| High Issues | < 5 | Resolved within sprint |
| Audit Coverage | 100% | All pages audited monthly |

---

**DesignBot Pro is ready to improve your UI! 🎨**
