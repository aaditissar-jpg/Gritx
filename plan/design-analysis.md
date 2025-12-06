# Phase A: Design Analysis & Inventory (Redesign v2)

## A1. Visual Direction: "Dark Mode Premium"
Based on the reference images (octopus, retro computer, iridescent shapes), the design direction is a **High-End Immersive Experience**.

**Key Visual Pillars:**
1.  **Midnight Backgrounds**: Replacing grays with Deep Carbon (`#0b0f10`) and Pure Black.
2.  **Neon Accents**: The primary brand color is Neon Green (`#0ea95f`), used for "glow" effects (box-shadows, text-shadows) to mimic lighting.
3.  **Glassmorphism**: UI elements (Navbar, Cards) use `backdrop-filter: blur()` with low opacity borders to feel tangible.
4.  **Editorial Typography**: Headings are massive (`text-5xl` to `text-7xl`), using `Sora` for a geometric, futuristic feel.

## A2. Component Strategy
-   **Hero Section**: Full viewport height. Text overlapping images. Background gradients.
-   **Cards**: Dark translucent surfaces (`bg-surface` or `bg-white/5`) with bright border reveals on hover.
-   **Navigation**: Floating glass pill or edge-to-edge glass bar.
-   **Micro-interactions**: Scroll-triggered fade-ups (IntersectionObserver). Buttons that glow on hover.

## A3. Color System Update
-   `bg`: #0b0f10 (Main Background)
-   `surface`: #161b1d (Card Background)
-   `primary`: #0ea95f (Neon Green)
-   `accent`: #7ef3b4 (Pale Green)
-   `text-glow`: CSS text-shadow for emphasis.

## A4. Accessibility
-   Ensure neon text has sufficient contrast against dark backgrounds.
-   Use clear focus states (neon ring).
-   All images must have alt text.

## A5. Page-by-Page Transformation
-   **Home**: Immersive hero, bento-grid features.
-   **Facilities/Events/Memberships**: Switch from white cards to dark glass cards.
-   **Admin**: Update to a "Command Center" dark aesthetic.
