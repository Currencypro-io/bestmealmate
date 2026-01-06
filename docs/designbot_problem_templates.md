# DesignBot Pro - Problem Templates

Ready-to-use templates for common UX/UI and CSS problems. Copy, fill in your details, and get expert guidance.

---

## 📋 Table of Contents

1. [Critical - Design System Issues](#critical---design-system-issues)
2. [High Priority - Accessibility Problems](#high-priority---accessibility-problems)
3. [Standard - UX Improvements](#standard---ux-improvements)
4. [CSS Optimization](#css-optimization)
5. [Component Design](#component-design)

---

## 🔴 Critical - Design System Issues

### Template 1: Inconsistent Component Styles

```markdown
DESIGN CRISIS: Inconsistent Component Styles

## Problem
Our [component type] components look different across pages.

## Examples
- Page 1 ([url/name]): [describe appearance]
- Page 2 ([url/name]): [describe appearance]
- Page 3 ([url/name]): [describe appearance]

## Current CSS/Styles
```css
[paste relevant CSS]
```

## Design System
- Using: [Tailwind/CSS Modules/styled-components/vanilla]
- Design tokens: [yes/no, link if yes]
- Component library: [none/custom/MUI/etc.]

## Questions
1. How do I unify these styles?
2. Should I create a design system?
3. What's the fastest fix?

## Priority
This is affecting [number] pages and [impact on users].
```

### Template 2: Color Palette Chaos

```markdown
DESIGN CRISIS: Color Palette Chaos

## Problem
We have too many colors and no consistency.

## Current Colors in Use
```css
/* Colors I've found in the codebase */
[list all colors you can find]
```

## Brand Colors (if any)
- Primary: [color]
- Secondary: [color]
- Brand guidelines: [link or description]

## App Type
- Industry: [food/finance/health/etc.]
- Target users: [demographics]
- Mood: [professional/playful/trustworthy/etc.]

## Need
1. Unified color palette
2. Semantic color names
3. Dark mode consideration: [yes/no]
4. Accessibility compliance: [AA/AAA]
```

### Template 3: Typography Disaster

```markdown
DESIGN CRISIS: Typography Disaster

## Problem
Font sizes, weights, and families are inconsistent.

## Current Typography
```css
/* Typography styles in use */
[paste font-related CSS]
```

## Fonts Available
- Primary font: [name]
- Secondary font: [name, if any]
- Icon font: [name, if any]

## Content Types
- Headings: [h1-h6 usage]
- Body text: [description]
- UI text: [buttons, labels, etc.]
- Special: [prices, dates, etc.]

## Requirements
- Minimum readable size: [preference]
- Maximum heading size: [preference]
- Line height preference: [tight/normal/relaxed]
```

---

## 🟠 High Priority - Accessibility Problems

### Template 4: Color Contrast Failures

```markdown
A11Y CHECK: Color Contrast Issues

## Problem
Our colors may not meet WCAG contrast requirements.

## Color Pairs to Check
1. Text: [color] on Background: [color]
2. Text: [color] on Background: [color]
3. Button text: [color] on Button bg: [color]
4. Link: [color] on Background: [color]
5. Placeholder: [color] on Input bg: [color]

## Target Level
- [ ] WCAG 2.1 Level A (minimum)
- [ ] WCAG 2.1 Level AA (standard)
- [ ] WCAG 2.1 Level AAA (enhanced)

## Context
- Element types: [text/buttons/icons/etc.]
- Font sizes: [specify if known]
- Dark mode: [yes/no]

## Need
1. Pass/fail status for each pair
2. Alternative colors if failing
3. Dark mode equivalents
```

### Template 5: Keyboard Navigation Broken

```markdown
A11Y CHECK: Keyboard Navigation Issues

## Problem
Users can't navigate the app with keyboard only.

## Affected Components
```html
[paste HTML of component]
```

## Current Behavior
- Tab key: [what happens]
- Enter key: [what happens]
- Escape key: [what happens]
- Arrow keys: [what happens]

## Expected Behavior
[describe what should happen]

## Focus Indicator
- Current: [describe or "none"]
- Desired: [describe or "default browser"]

## Context
- Component type: [modal/dropdown/menu/form/etc.]
- Framework: [React/Vue/vanilla]
- Using: [headless UI/radix/custom]
```

### Template 6: Screen Reader Problems

```markdown
A11Y CHECK: Screen Reader Compatibility

## Problem
Our [component/page] doesn't work well with screen readers.

## HTML Structure
```html
[paste the relevant HTML]
```

## Current ARIA Usage
```html
[paste any ARIA attributes in use]
```

## Issues Reported
- VoiceOver (Mac): [issues]
- NVDA (Windows): [issues]
- JAWS: [issues if tested]

## Component Purpose
[describe what the component does for users]

## Interactive Elements
- Buttons: [list]
- Links: [list]
- Form inputs: [list]
- Custom controls: [list]

## Need
1. Proper ARIA implementation
2. Logical reading order
3. Meaningful announcements
```

### Template 7: Focus Management Issues

```markdown
A11Y CHECK: Focus Management

## Problem
Focus behavior is confusing or lost during [interaction].

## Scenario
1. User does: [action]
2. Focus goes to: [where]
3. Should go to: [where]

## Component HTML
```html
[paste component HTML]
```

## JavaScript Handling
```javascript
[paste focus-related JS if any]
```

## Specific Issues
- [ ] Focus trap not working in modal
- [ ] Focus lost after dynamic content
- [ ] Focus order illogical
- [ ] Skip link missing/broken
- [ ] Focus not visible
- [ ] Focus returns to wrong place

## Context
- Component: [modal/dropdown/form/wizard/etc.]
- Trigger: [button/link/auto/etc.]
```

---

## 🟡 Standard - UX Improvements

### Template 8: Page Layout Audit

```markdown
AUDIT PAGE: Layout Review

## Page
- URL: [url]
- Name: [page name]
- Purpose: [what users do here]

## Screenshot/Description
[paste screenshot or describe layout]

## Current Layout
- Grid system: [CSS Grid/Flexbox/none]
- Responsive: [yes/partially/no]
- Breakpoints: [list if known]

## Pain Points
1. [issue 1]
2. [issue 2]
3. [issue 3]

## User Feedback
[any user complaints or data]

## Competitors
[links to competitors doing it well]

## Constraints
- Must keep: [elements that can't change]
- Budget: [time available]
- Tech: [framework limitations]
```

### Template 9: Form UX Review

```markdown
AUDIT PAGE: Form UX Review

## Form Purpose
[what the form collects/does]

## Current Form HTML
```html
[paste form HTML]
```

## Form Fields
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| [name] | [type] | [y/n] | [rules] |

## Known Issues
- Validation: [issues]
- Error messages: [issues]
- Mobile: [issues]
- Submission: [issues]

## User Data
- Completion rate: [%]
- Drop-off point: [field name]
- Error rate: [%]

## Questions
1. Is field order optimal?
2. Are labels clear?
3. Is validation helpful?
4. Are error messages actionable?
```

### Template 10: Navigation Audit

```markdown
AUDIT PAGE: Navigation Review

## Current Navigation
```html
[paste navigation HTML]
```

## Structure
- Type: [top bar/sidebar/bottom/hamburger]
- Levels: [flat/nested/mega menu]
- Items: [list main items]

## Issues
1. [issue 1]
2. [issue 2]

## User Behavior
- Most clicked: [items]
- Never clicked: [items]
- Search usage: [high/medium/low/none]

## Mobile Behavior
[describe current mobile nav]

## Requirements
- Max items visible: [number]
- Must include: [items]
- Secondary nav needed: [yes/no]
```

---

## 🔧 CSS Optimization

### Template 11: CSS Performance Issues

```markdown
OPTIMIZE CSS: Performance

## Problem
CSS is [slow to load / causing layout shifts / too large].

## Metrics
- CSS file size: [KB]
- Unused CSS: [% if known]
- Load time impact: [seconds]

## Current CSS
```css
[paste problematic CSS]
```

## Framework/Tools
- CSS framework: [Tailwind/Bootstrap/none]
- Build tool: [webpack/vite/etc.]
- Minification: [yes/no]
- Purging: [yes/no]

## Symptoms
- [ ] Large bundle size
- [ ] Render blocking
- [ ] Layout shifts (CLS)
- [ ] Slow first paint
- [ ] Specificity wars

## Goal
- Target size: [KB]
- Performance budget: [ms]
```

### Template 12: CSS Architecture Cleanup

```markdown
OPTIMIZE CSS: Architecture

## Problem
CSS is unmaintainable and has conflicts.

## Current Setup
- Methodology: [none/BEM/OOCSS/etc.]
- File structure: [describe]
- Naming: [conventions if any]

## Sample of Problem CSS
```css
[paste example of messy CSS]
```

## Symptoms
- [ ] Specificity conflicts
- [ ] !important overuse
- [ ] Duplicated styles
- [ ] Dead code
- [ ] Inconsistent naming

## Desired Outcome
- Methodology: [BEM/Tailwind/CSS Modules/etc.]
- Structure: [describe desired]
- Priority: [maintainability/performance/both]
```

### Template 13: Responsive Design Fix

```markdown
OPTIMIZE CSS: Responsive Issues

## Problem
Layout breaks on [device/screen size].

## Breakpoints in Use
```css
[paste current media queries]
```

## Broken Layout
- Screen size: [width]
- Device: [phone/tablet/desktop]
- Issue: [describe]

## Screenshot/Description
[describe or paste screenshot of issue]

## Current CSS
```css
[paste relevant CSS]
```

## Expected Behavior
[describe how it should look]

## Testing Done
- [ ] Chrome DevTools
- [ ] Real device
- [ ] BrowserStack
```

---

## 🎨 Component Design

### Template 14: New Component Specification

```markdown
SPEC COMPONENT: [Component Name]

## Purpose
[what this component does]

## Use Cases
1. [use case 1]
2. [use case 2]
3. [use case 3]

## Design Requirements
- Visual style: [describe]
- Matches design: [Figma link if any]
- Existing patterns: [similar components]

## Functionality
- Interactive: [yes/no]
- States needed: [list states]
- Animation: [yes/no, describe]

## Variants
- [ ] Size variants: [sm/md/lg]
- [ ] Color variants: [primary/secondary/etc.]
- [ ] Style variants: [filled/outlined/etc.]

## Props Needed
| Prop | Type | Description |
|------|------|-------------|
| [name] | [type] | [purpose] |

## Accessibility
- Role: [button/link/etc.]
- Keyboard: [requirements]
- Screen reader: [requirements]

## Framework
- Using: [React/Vue/etc.]
- Styling: [Tailwind/CSS Modules/etc.]
- TypeScript: [yes/no]
```

### Template 15: Component Audit

```markdown
REVIEW COMPONENT: [Component Name]

## Current Implementation
```tsx
[paste current component code]
```

## Current Styles
```css
[paste current styles]
```

## Issues Noticed
1. [issue 1]
2. [issue 2]

## Missing Features
- [ ] [feature 1]
- [ ] [feature 2]

## Accessibility Status
- Keyboard navigable: [yes/no/partial]
- Screen reader tested: [yes/no]
- ARIA attributes: [present/missing]

## Questions
1. Is the API intuitive?
2. Are all states handled?
3. Is it accessible?
4. Is performance good?
5. Is it documented?
```

---

## 🚀 Quick Commands Reference

### Audit Commands
```
AUDIT PAGE [screenshot/url/description]
AUDIT COMPONENT [name/code]
CHECK CONTRAST [color1] on [color2]
REVIEW COMPONENT [name]
```

### Accessibility Commands
```
A11Y CHECK [component HTML]
FIX FOCUS [component]
ADD ARIA [component type]
```

### CSS Commands
```
OPTIMIZE CSS [code]
CONVERT TO [BEM/Tailwind/CSS Modules]
FIX RESPONSIVE [breakpoint]
```

### Design System Commands
```
CREATE TOKENS [brand/colors]
SPEC COMPONENT [name]
DOCUMENT [component]
```

---

## 📊 Template Selection Guide

| Scenario | Use Template |
|----------|--------------|
| Styles look different everywhere | #1 Inconsistent Components |
| Too many random colors | #2 Color Palette Chaos |
| Font sizes are all over | #3 Typography Disaster |
| Failed accessibility audit | #4-7 (A11Y templates) |
| Page needs redesign | #8 Layout Audit |
| Form has issues | #9 Form UX Review |
| Nav is confusing | #10 Navigation Audit |
| CSS is bloated | #11 Performance |
| CSS is messy | #12 Architecture |
| Mobile is broken | #13 Responsive |
| Building new component | #14 New Component |
| Improving component | #15 Component Audit |

---

**Copy a template, fill it in, and get expert design guidance! 🎨**
