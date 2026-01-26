# ![logo.png](static/logo.png) More Shadcn Svelte 


A collection of high-quality, copy-paste components for Svelte 5, built on top of [shadcn-svelte](https://shadcn-svelte.com/).

This library extends the philosophy of shadcn/ui by providing more components that aren't included in the base registry. These components are designed to be copy-pasted into your project and customized to your needs. You should also check out [shadcn-svelte-extras](https://www.shadcn-svelte-extras.com/) for even more components!

Explore the documentation and live previews:
[more-shadcn.noair.fun](more-shadcn.noair.fun)


---

## Installation


This library follows the shadcn-svelte registry pattern. You can add components
directly to your project using the CLI:


	npx shadcn-svelte@latest add https://more-shadcn.noair.fun/r/[component].json

For example, to add the Knob component:


	npx shadcn-svelte@latest add https://more-shadcn.noair.fun/r/knob.json


---

## Component Categories

### Forms & Inputs


Advanced input types for specialized data entry.

- Knob: Hardware-inspired rotating dial for numeric values.

- Wheel Picker: iOS-style scrollable selector.

- Autocomplete: Searchable input with suggestion highlighting.

- Color Picker: Mobile-friendly hex and preset selector.

- Scrubbable: Drag-to-adjust numeric input (Unity/Blender style).

- Date Strip: Horizontal date selection timeline.

### Visuals & Media


Built-in players and visual enhancement utilities.

- Audio: Modern audio player with scrubbing and volume popovers.

- Video: Responsive video player with custom controls.

- Audio Wave: Real-time or static audio visualization.

- Compare Slider: Image before/after comparison tool.

- Image Zoom: Medium-style image overlays.

- Spotlight Card: Radial hover effects for dashboards.

### Navigation


Structure your multi-step or complex application flow.


- Walkthrough: Interactive guided tour with spotlight focus.

- Stepper: Horizontal and vertical process indicators.

- Dock: macOS-style magnification dock.

- Bottom Nav: Mobile-first primary navigation.

### Data Display


Present information in clean, interactive formats.


- Big Calendar: Full-sized interactive monthly calendar.

- Timeline: Vertical event milestone tracker.

- Number Ticker: Animated spring-physics counters.

- Status Dot: Presence and activity indicators.

### Utilities


Interaction helpers for modern web apps.


- Verify Human: Heuristic bot protection (honeypots & velocity checks).

- Sortable: Drag-and-drop list reordering.

- Horizontal Scroll: Mouse-wheel to horizontal axis converter.


---

## Tech Stack

- Framework: Svelte 5 (Runes, Snippets)

- Styling: Tailwind CSS v4

- Icons: Lucide Svelte

- Animations: Tailwind Animate / Svelte Motion

## Contributing


Everyone is welcome to contribute new components that fit the shadcn-philosophy advanced logic wrapped in clean, copy-pasteable code.