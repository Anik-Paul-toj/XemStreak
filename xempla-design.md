---
version: alpha
name: Xempla Light
description: A polished B2B SaaS system with airy spacing, crisp blue accents, and confident editorial typography.
colors:
  primary: "#1D8DEA"
  secondary: "#000000"
  tertiary: "#D9E8FF"
  neutral: "#FFFFFF"
  surface: "#F6F9FE"
  on-surface: "#000000"
  muted: "#5E6677"
  border: "#D9E8FF"
  success: "#18B85A"
  error: "#D64545"
typography:
  headline-display:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "50px"
    fontWeight: 800
    lineHeight: "57.5px"
    letterSpacing: "0px"
  headline-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "38px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "0px"
  headline-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: "30px"
    letterSpacing: "0px"
  headline-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0px"
  body-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0px"
  body-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  body-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0px"
  label-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
    letterSpacing: "0px"
  label-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.08em"
  overline:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.16em"
  stat-value:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "0px"
rounded:
  none: 0px
  sm: 4px
  md: 10px
  lg: 14px
  xl: 24px
  full: 9999px
spacing:
  xs: 6px
  sm: 16px
  md: 26px
  lg: 40px
  xl: 120px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "14px 15px"
    height: "64px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "14px 15px"
    height: "64px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "#333333"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "14px 15px"
    height: "48px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  stat-tile:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Xempla Light

## Overview
Xempla presents itself as a confident, enterprise-friendly SaaS brand: precise, modern, and outcome-driven rather than playful. The page uses a spacious hero, sharp black typography, and bright blue accents to communicate clarity, control, and trust. Overall density is low-to-medium, with generous white space and highly legible content blocks that feel designed for decision-makers and operators.

## Colors
- **Primary (#1D8DEA):** A vivid electric blue used for key calls to action, highlighted words in headlines, link-like accents, and positive performance states. It gives the interface its most recognizable energy and signals action and credibility.
- **Secondary (#000000):** Deep black used for the strongest headline text, button labels on outlined controls, and high-contrast hierarchy. It anchors the system and keeps the brand feeling assertive and direct.
- **Tertiary (#D9E8FF):** A pale blue border and tint color used for subtle outlines, card edges, and gentle separation between content regions. It reinforces the primary blue without overwhelming the layout.
- **Neutral (#FFFFFF):** Pure white surfaces dominate the system, from the main page background to cards and navigation areas. This creates a clean, open canvas for the content and keeps the experience lightweight.
- **Surface (#F6F9FE):** A very soft cool background wash for low-emphasis regions and elevated container backgrounds. It helps sections feel distinct while preserving the airy tone.
- **On-surface (#000000):** Primary text color on light backgrounds, used for body copy, labels, and interface controls. It ensures maximum readability with minimal visual noise.
- **Muted (#5E6677):** A cool gray-blue for supportive copy, metadata, and secondary labels. It softens the hierarchy without losing the brand’s crispness.
- **Border (#D9E8FF):** The default line color for cards, panels, and structured UI blocks. It is intentionally subtle so layout remains clean and editorial rather than boxy.
- **Success (#18B85A):** A vivid green used for positive deltas and healthy metrics. It stands apart from the primary blue, making performance gains instantly scannable.
- **Error (#D64545):** A restrained red reserved for destructive or failure states, though it is not visually dominant in the source. It should be used sparingly to preserve the system’s calm tone.

## Typography
The system is built around **Plus Jakarta Sans**, which gives the brand a modern, professional, and slightly premium feel. Headlines use strong weights and tight line heights: the display hero is bold and assertive, while the mid-level headings stay clean and balanced for section titles and cards. Body text remains at 16px/24px for comfortable reading, with smaller 14px labels and 12px overlines used for navigation, metadata, and supporting UI text.

The typography style is mostly sentence case with no heavy decorative treatment. Uppercase is used selectively for micro-labels and section tags, often with increased letter spacing to create a precise, systems-oriented tone. Emphasis is achieved primarily through weight and color rather than italics or excessive size jumps.

## Layout
The layout relies on a wide desktop container with a strong two-column hero: content on the left, supporting system mockup on the right. Vertical rhythm is generous, using the 6px, 16px, 26px, 40px, and 120px spacing scale to separate sections, cards, and call-to-action groups. Cards and grouped items use consistent internal padding, with 20px card padding and 14px/15px button padding creating a compact but not cramped feel.

The page favors clear section boundaries over dense grid packing. Large negative space around the hero makes the main message feel premium and deliberate, while the trust-logo strip below uses centered alignment and even spacing to signal credibility.

## Elevation & Depth
Depth is handled lightly. The system avoids heavy shadows and instead uses white cards, pale blue borders, and subtle separation to define layers. Where shadow appears, it is soft and diffuse, supporting the feeling of a calm, enterprise dashboard rather than a glossy consumer app.

Tonal contrast does most of the work: white surfaces on a soft cool background, black text on white, and bright blue highlights against neutral fields. This makes hierarchy feel crisp without introducing visual clutter.

## Shapes
The shape language is softly rounded and highly consistent. Buttons and cards use moderate corner radii, with 10px for controls and 14px for cards, creating a friendly but still businesslike profile. Full pills are reserved for chips and compact status elements, while most structural containers stay subtly squared-off for clarity.

The overall effect is architectural softness rather than playful curvature.

## Components
Buttons are the clearest branded component. Use `button-primary` for the main action: solid blue background, white text, 64px height, and a rounded 10px shape. Use `button-secondary` for supporting actions: transparent background, black border/text, same height and padding, and equal visual weight without competing with the primary CTA. Use `button-tertiary` for text-only actions and links, keeping it minimal and unboxed.

Cards should follow `card`: white background, 1px pale-blue border, 14px radius, 20px padding, and a subtle shadow only when elevation is needed. Cards in this system should feel like organized information panels, not floating widgets.

Inputs should match the button radius language with a clean, understated treatment: white background, 10px radius, and generous internal padding. Focus states should rely on the primary blue and border change rather than heavy shadow.

Chips and small status pills should be compact and rounded to `rounded.full`, using either the surface tint or a lightly tinted background with blue text. They should read as labels rather than buttons.

Stat tiles and KPI blocks should stay highly legible: white cards, modest padding, strong numeric emphasis, and color-coded values for performance direction. Positive metrics should use `success`, while primary financial or action-linked numbers can use `primary`.

Navigation links and header items should remain restrained, with medium-weight typography and no decorative underlines unless indicating an active or tertiary action. The UI should feel structured, simple, and business-forward.

## Do's and Don'ts
- Do keep primary actions blue and visually dominant.
- Do use white space generously to preserve the premium, enterprise feel.
- Do maintain consistent 10px–14px rounding across buttons and cards.
- Do emphasize hierarchy with weight, size, and color before adding shadows.
- Don't introduce saturated secondary colors that compete with the primary blue.
- Don't make cards overly shadowed or glossy; keep depth subtle.
- Don't use playful, rounded, or whimsical typography styles that weaken the professional tone.
- Don't crowd sections or compress vertical spacing; the layout should breathe.