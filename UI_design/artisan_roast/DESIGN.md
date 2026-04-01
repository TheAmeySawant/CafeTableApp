# The Design System: Editorial Café Experience

## 1. Overview & Creative North Star: "The Digital Sommelier"
This design system moves away from the sterile, modular look of typical ordering apps to embrace the tactile, sophisticated world of a high-end roastery. Our Creative North Star is **"The Digital Sommelier"**—an experience that feels curated, authoritative, and warm.

To break the "template" feel, the system rejects rigid grids in favor of **intentional asymmetry**. Large serif headlines should overlap image containers, and white space (the "Cream" background) is treated as a premium element, not just a gap. We prioritize "Editorial Flow," where the UI feels like a high-end coffee journal rather than a database.

---

## 2. Color Palette & Surface Philosophy
The palette is rooted in the rich tonality of roasted beans and steamed milk. We use a Material-inspired logic but apply it with "High-End Editorial" restraint.

### Tonal Tokens
- **Primary (`#894d00`):** Our Caramel/Warm Amber. Used for calls to action and critical brand moments.
- **Surface (`#fdf9f2`):** The Cream base. This is the "paper" on which the experience is written.
- **On-Surface (`#1c1c18`):** The Espresso Dark Brown. Used for primary text to ensure high contrast and a premium feel.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. 
- **The Alternative:** Define boundaries through background shifts. Place a `surface-container-low` (`#f7f3ec`) section against the `surface` background to denote a change in context.
- **Signature Textures:** Use subtle gradients for Hero sections or large buttons, transitioning from `primary` (`#894d00`) to `primary-container` (`#a96413`). This adds "soul" and depth that flat hex codes cannot achieve.

### Surface Hierarchy & Glassmorphism
Treat the UI as physical layers. Floating elements (like a "View Cart" bar) must use **Glassmorphism**:
- **Token:** `surface-container-highest` at 80% opacity.
- **Effect:** `backdrop-blur: 12px`.
- This ensures the UI feels integrated and high-fidelity, allowing the rich food photography to bleed through the navigation.

---

## 3. Typography: Editorial Authority
The interplay between a romantic Serif and a technical Sans-serif creates the "Classic Café" professional vibe.

- **Display & Headlines (Playfair Display / Noto Serif):** Used for item names and section headers. High-contrast scales (e.g., `display-lg` at 3.5rem) should be used to create an "Editorial" impact.
- **Body & Labels (DM Sans / Plus Jakarta Sans):** Used for descriptions, prices, and navigation. These are set with generous line height (1.6x) to ensure readability in low-light café environments.

**Hierarchy Tip:** Always pair a `headline-sm` serif with a `label-md` uppercase sans-serif to create a sophisticated, branded "lockup."

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines. Depth is achieved through "staining" the background.

- **The Layering Principle:** To lift a card, do not reach for a shadow first. Instead, place a `surface-container-lowest` (`#ffffff`) card on a `surface-container` (`#f1ede6`) background. This "soft lift" feels more natural and premium.
- **Ambient Shadows:** For floating action buttons or menus, use a "Ghost Shadow":
  - `box-shadow: 0 20px 40px rgba(28, 28, 24, 0.06);` (a tint of our Espresso `on-surface` color).
- **The Ghost Border:** If accessibility requires a stroke (e.g., in a high-contrast mode), use `outline-variant` (`#d8c3b2`) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components
Each component must follow the "Warm & Professional" ethos.

### Buttons (The "Pill")
- **Primary:** Fully rounded (`9999px`). Background: `primary`. Text: `on-primary` (White). 
- **Secondary:** Fully rounded. Background: `surface-container-high`. Text: `primary`.
- **Interaction:** On tap, the button should scale down slightly (98%) to provide tactile feedback.

### Cards & Menu Items
- **Rule:** Forbid the use of divider lines between items. 
- **Execution:** Use vertical white space (`spacing-8`) to separate items. For high-priority items (Staff Picks), use a `surface-container-low` background with a `14px` (DEFAULT) border radius.

### Input Fields
- **Style:** Underline only or "Soft Inset." Avoid the four-sided box. 
- **State:** When active, the label should transform into `label-sm` in the `primary` (Caramel) color.

### Custom Component: The "Brewing" Status Bar
- Uses `tertiary` (`#006579`) with a soft pulse animation. 
- Employs a backdrop-blur "Glass" container to float over the order summary, ensuring the user always knows their coffee status without navigating away.

---

## 6. Do’s and Don’ts

### Do:
- **Use "Intentional Padding":** Use the `spacing-12` and `spacing-16` tokens to give elements breathing room. Luxury is defined by the space you don't fill.
- **Overlap Elements:** Let a coffee cup PNG overlap the edge of a card to break the "web box" feel.
- **Tint your Neutrals:** Ensure all grays are "warm grays" by using the `surface` tokens. Avoid `#000000` or `#FFFFFF` (unless it’s the `surface-container-lowest`).

### Don’t:
- **Don't Use 1px Borders:** It breaks the "Sommelier" vibe and makes the app look like a generic framework.
- **Don't Use Standard Shadows:** Avoid heavy, dark shadows. Use tonal shifts or very light, diffused ambient light.
- **Don't Crowd the Header:** Keep the "The Roasted Bean" logo as a focal point with significant `surface` space around it.

---

## 7. Token Quick Reference
- **Primary Action:** `#894d00` (Caramel)
- **Background:** `#fdf9f2` (Cream)
- **Text:** `#1c1c18` (Espresso)
- **Border Radius (Cards):** `1rem` (16px)
- **Border Radius (Buttons):** `full` (9999px)
- **Shadow Tint:** `rgba(28, 28, 24, 0.08)`