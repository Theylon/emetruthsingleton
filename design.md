# Design System Document: Institutional Excellence

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Ledger"**

This design system rejects the "fintech-startup" aesthetic of rounded bubbles and vibrant gradients in favor of a high-end, editorial experience rooted in institutional authority. It is inspired by the precision of architectural blueprints and the tactile quality of premium stationery.

The system moves beyond "standard" UI by employing **Intentional Asymmetry** and **Tonal Depth**. We do not use borders to define space; we use light and shadow. The layout is designed to feel "built" rather than "rendered," prioritizing massive breathing room (whitespace) to signal high-value exclusivity and clarity of execution.

---

## 2. Colors & Surface Philosophy
The palette is a sophisticated interplay of deep charcoals, crisp whites, and gold accents, structured to provide maximum contrast and legibility.

### The Palette (Material Convention)
* **Primary:** `#000000` (The Absolute)
* **Primary Container:** `#141C24` (Deep Navy Institutional)
* **Surface:** `#FCF9F8` (Crisp, warm-tinted white)
* **Tertiary Fixed Dim:** `#E9C176` (The Signature Gold)
* **On-Surface Variant:** `#44474B` (Sophisticated Gray for secondary text)

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or containment.
In this system, boundaries are defined by background shifts. To separate a hero section from a content grid, transition from `surface` to `surface-container-low` (`#F6F3F2`). This creates a "monolithic" feel where the interface feels like a single, carved object rather than a collection of boxes.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine-paper sheets.
* **Base:** `surface` (#FCF9F8)
* **Sectioning:** `surface-container-low` (#F6F3F2)
* **Interactive Cards:** `surface-container-lowest` (#FFFFFF) sitting on a `surface-dim` background.
* **Nesting:** When placing an element inside a container, use a step-up in brightness (e.g., a white card on a light gray section) to imply physical elevation without a drop shadow.

### The "Glass & Signature" Rule
For high-level navigation or modal overlays, use **Glassmorphism**. Apply `surface` at 80% opacity with a `20px` backdrop blur. For main CTA backgrounds, use a subtle linear gradient from `primary_container` (#141C24) to `primary` (#000000) at a 135-degree angle to provide a "sheen" reminiscent of polished marble.

---

## 3. Typography: The Editorial Voice
We use a dual-typeface system to balance modern execution with classic institutional trust.

* **Display & Headlines (Manrope):** Use Manrope for all `display-` and `headline-` tokens. Its geometric yet warm construction conveys precision.
* *Directorial Note:* Use `display-lg` (3.5rem) with `-0.02em` letter spacing for hero statements to create a "bold-type" editorial feel.
* **Body & Labels (Inter):** Use Inter for all functional text (`body-`, `title-`, `label-`). Its high x-height ensures legibility in complex financial data tables.
* **Hierarchy as Identity:** Maintain a strict 2:1 ratio between headline and body size. Large headlines should be paired with generous `16` (5.5rem) spacing units to allow the "Architectural Ledger" aesthetic to breathe.

---

## 4. Elevation & Depth
Traditional shadows are too "digital." We use **Tonal Layering** and **Ambient Light**.

* **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. A `surface-container-highest` (#E5E2E1) element should feel "heavy" and grounded, while `surface-container-lowest` (#FFFFFF) feels light and floating.
* **Ambient Shadows:** If a floating element (like a dropdown) is required, use a shadow color tinted with the `on-surface` color (#1C1B1B) at 4% opacity, with a 40px blur and 10px Y-offset. It should feel like a soft glow, not a hard shadow.
* **The "Ghost Border" Fallback:** If accessibility requires a container edge (e.g., in high-glare environments), use the `outline-variant` (#C5C6CB) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
* **Primary:** `primary` background with `on-primary` text. Use `DEFAULT` (0.25rem) roundedness. No gradient, just flat, high-contrast authority.
* **Secondary:** `surface-container-highest` background with `on-surface` text.
* **Tertiary (Gold Accent):** Text-only using `tertiary_fixed_dim` (#E9C176) for the label, used exclusively for "Growth" or "Opportunity" related actions.

### Cards & Lists
* **The Divider Ban:** Never use line dividers (`
`). Use a `3` (1rem) spacing gap or a `surface-container-low` background block to separate list items.

* **Data Tables:** Financial data should be set in `body-sm`. Every third row should use a `surface-container-lowest` background to assist horizontal scanning without lines.

### Input Fields
* **Style:** Minimalist. Only a bottom-aligned `outline` (#75777B) at 20% opacity. Upon focus, the line transforms into the `tertiary_fixed_dim` (Gold) to signal a "premium" interaction.

### Signature Component: The "Executive Summary Card"
A large-format card using `primary_container` (#141C24) as a background, featuring `display-sm` typography in white and `label-md` accents in Gold. This is used for high-level portfolio overviews.

---

## 6. Do’s and Don’ts

### Do:
* **Use Asymmetric Padding:** Align text-heavy blocks to the left with an intentional 20% "dead zone" on the right to mimic high-end magazine layouts.
* **Respect the Spacing Scale:** Use `20` (7rem) and `24` (8.5rem) units for top/bottom section padding. Wealth is signaled through "wasted" space.
* **Monochrome Data:** Keep charts and graphs primarily Navy and Gray, using Gold only for the "Target" or "Current Status."

### Don’t:
* **No Rounded Pills:** Never use `full` (9999px) roundedness for buttons; it feels too playful. Stick to `DEFAULT` (0.25rem) or `none`.
* **No Pure Black Text on White:** Use `on-surface` (#1C1B1B) instead of #000000 for long-form body text to reduce eye strain and feel more "ink-like."
* **No Animation Bloat:** Transitions should be "Snappy then Smooth"—a quick 150ms ease-out. No "bouncing" or "elastic" effects.