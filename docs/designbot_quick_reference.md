# DesignBot Pro - Quick Reference Card

One-page summary of DesignBot Pro capabilities and commands.

---

## 🎨 What is DesignBot Pro?

**DesignBot Pro** is an AI UX/UI expert that helps you:
- Audit designs for issues
- Create design systems
- Ensure accessibility
- Optimize CSS performance
- Specify components
- Fix responsive layouts

---

## 🔟 10 Things DesignBot Can Do

| # | Capability | Command | Output |
|---|------------|---------|--------|
| 1 | **Full Design Audit** | `AUDIT PAGE [screenshot/url]` | Score, issues, fixes, roadmap |
| 2 | **Accessibility Check** | `A11Y CHECK [HTML]` | WCAG issues + fixed code |
| 3 | **Color Contrast** | `CHECK CONTRAST [fg] on [bg]` | Ratio, pass/fail, alternatives |
| 4 | **CSS Optimization** | `OPTIMIZE CSS [code]` | Smaller, faster CSS |
| 5 | **Design Tokens** | `CREATE TOKENS [brand]` | Colors, typography, spacing |
| 6 | **Component Specs** | `SPEC COMPONENT [name]` | Variants, states, props, a11y |
| 7 | **Responsive Fixes** | `FIX RESPONSIVE [breakpoint]` | Media queries, fluid layouts |
| 8 | **Dark Mode Design** | `CREATE DARK THEME` | Accessible dark palette |
| 9 | **Figma to Code** | `FIGMA TO CODE [JSON]` | React + CSS components |
| 10 | **UX Review** | `REVIEW UX [flow]` | Heuristic evaluation |

---

## 🚀 Quick Start (5 Minutes)

### Option A: Claude.ai (Fastest)
```
1. Copy designbot_agent_prompt.md
2. Paste into Claude.ai
3. Ask: "Audit my app's homepage"
```

### Option B: API Integration
```typescript
import { designBot } from '@/lib/designbot-service';

const audit = await designBot.auditDesign({
  screenshot: base64Image,
  focusAreas: ['accessibility', 'visual']
});
```

### Option C: Problem Templates
```
1. Open designbot_problem_templates.md
2. Find your scenario
3. Copy, fill in, submit
```

---

## 📁 Files Included

```
docs/
├── designbot_agent_prompt.md      # System prompt (500 lines)
├── designbot_usage_guide.md       # Full integration guide (800 lines)
├── designbot_problem_templates.md # 15 templates (400 lines)
└── designbot_quick_reference.md   # This file
```

---

## 🎯 Core Competencies

### UX Design
- Nielsen's 10 heuristics
- User journey optimization
- Cognitive load reduction
- Conversion optimization

### Visual Design
- Color theory & psychology
- Typography hierarchy
- Grid systems & layout
- Visual hierarchy

### CSS Architecture
- BEM, OOCSS, SMACSS
- Tailwind optimization
- Specificity management
- Performance optimization

### Accessibility
- WCAG 2.1 AA/AAA
- Screen reader support
- Keyboard navigation
- Focus management

### Design Systems
- Token architecture
- Component libraries
- Documentation
- Version management

---

## 🔧 Quick Commands

```
# Audits
AUDIT PAGE [screenshot]
AUDIT COMPONENT [code]
CHECK CONTRAST [#fff] on [#000]

# Accessibility
A11Y CHECK [html]
FIX FOCUS [component]
ADD ARIA [element]

# CSS
OPTIMIZE CSS [code]
CONVERT TO BEM [css]
FIX SPECIFICITY [selector]

# Design System
CREATE TOKENS [brand]
SPEC COMPONENT [name]
DOCUMENT [component]
```

---

## 📊 Severity Levels

| Level | Icon | Meaning | Action |
|-------|------|---------|--------|
| Critical | 🔴 | A11y blocker, broken UI | Fix immediately |
| High | 🟠 | Major UX issue | This sprint |
| Medium | 🟡 | Inconsistency | Next sprint |
| Low | 🟢 | Enhancement | Backlog |

---

## ✅ Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Design Score | ≥ 80 | DesignBot audit |
| Accessibility | ≥ 90 | A11Y CHECK |
| CSS Size | < 50KB | Bundle analysis |
| Contrast | 4.5:1+ | CHECK CONTRAST |
| Critical Issues | 0 | Audit results |

---

## 🗓️ Deployment Timeline

| Phase | Time | Tasks |
|-------|------|-------|
| 1. Test | 5 min | Copy prompt to Claude.ai |
| 2. First Audit | 10 min | Audit one page |
| 3. Fix Critical | 1 day | Address 🔴 issues |
| 4. Integrate | 30 min | Add API service |
| 5. Dashboard | 45 min | Build monitoring |

---

## 📚 Template Quick Index

| # | Template | Use When |
|---|----------|----------|
| 1 | Inconsistent Styles | Components look different |
| 2 | Color Chaos | Too many colors |
| 3 | Typography | Font inconsistency |
| 4 | Contrast | Colors failing a11y |
| 5 | Keyboard Nav | Tab key broken |
| 6 | Screen Reader | NVDA/VoiceOver issues |
| 7 | Focus | Focus lost/wrong |
| 8 | Page Layout | Layout needs review |
| 9 | Form UX | Form has problems |
| 10 | Navigation | Nav is confusing |
| 11 | CSS Perf | CSS is slow/big |
| 12 | CSS Architecture | CSS is messy |
| 13 | Responsive | Mobile broken |
| 14 | New Component | Building something |
| 15 | Component Audit | Improving existing |

---

## 🎨 Color Psychology Cheat Sheet

| Color | Emotion | Best For |
|-------|---------|----------|
| 🔵 Blue | Trust | Finance, Tech |
| 🟢 Green | Health | Food, Eco |
| 🔴 Red | Urgency | CTAs, Errors |
| 🟠 Orange | Friendly | Food, Fun |
| 🟣 Purple | Luxury | Premium |
| 🟡 Yellow | Attention | Warnings |

---

## ⌨️ WCAG Quick Reference

| Level | Contrast | Touch Target |
|-------|----------|--------------|
| A | 3:1 (large) | - |
| AA | 4.5:1 (normal) | 44×44px |
| AAA | 7:1 (normal) | 44×44px |

---

**DesignBot Pro - Beautiful, Accessible, Performant UI 🎨**
