# Homodynamics Web Application: Comprehensive Specification

## 1. Overview

### 1.1. Purpose

The "Homodynamics" web application is an interactive, educational single-page application (SPA) designed to present a philosophical framework created by Amit Srivastava. It serves as a digital, explorable text that synthesizes ancient wisdom traditions (e.g., Platonism, Buddhism, Vedic philosophy) with modern scientific concepts (e.g., systems theory, physics, cognitive science).

### 1.2. Core Features

*   **Content-Rich Chapters:** The application is structured into distinct sections and subsections, much like a book, guiding the user through the core tenets of Homodynamics.
*   **Interactive Visualizations:** Each section and subsection is paired with a unique, dynamic visualization. These are not static images but interactive or animated graphics (primarily built with D3.js) that make abstract philosophical and scientific concepts tangible and explorable.
*   **Responsive Design:** The application provides an optimized viewing experience on both desktop and mobile devices, with distinct layouts for each.
*   **Sticky Navigation & Scroll-Spying:** The UI facilitates easy navigation. On desktop, a right-hand panel with the active visualization is "sticky," remaining in view as the user scrolls. The application tracks scroll position to update which visualization is shown, creating a seamless link between text and graphic.
*   **Animated Hero Section:** The application greets the user with an elegant, animated hero section that sets a professional and contemplative tone.

## 2. Architecture

### 2.1. Tech Stack

*   **Framework:** React 19
*   **Language:** TypeScript
*   **Rendering:** React DOM
*   **Data Visualization:** D3.js (v7)
*   **Build/Module System:** ES Modules with an `importmap` for dependency management (no bundler like Webpack/Vite is used).

### 2.2. File Structure

The application follows a standard component-based structure.

```
/
├── index.html              # Entry point, defines layout, styles, importmap
├── index.tsx               # React application root
├── App.tsx                 # Main application component, handles state and routing
├── metadata.json           # Application metadata
├── types.ts                # TypeScript type definitions for data structures
├── data.ts                 # Static content and visualization mapping for the entire site
└── components/
    ├── Header.tsx          # Top navigation bar (desktop and mobile)
    ├── Hero.tsx            # Animated hero banner
    ├── SectionPage.tsx     # Renders a full section's content and the visualization panel
    ├── ContentDisplay.tsx  # Renders the text for subsections and sub-subsections
    └── visualizations/
        ├── ...             # Numerous individual React components for each visualization
        └── ...
```

### 2.3. State Management

State management is localized and handled within the main `App.tsx` component using React Hooks:
*   `useState` is used to manage `currentSectionId` and `activeSubSectionId`.
*   `useRef` (`mainContentRef`) holds a reference to the main scrollable container, essential for scroll-spying and programmatic scrolling.
*   State is passed down to child components via props (prop-drilling).

### 2.4. Routing

The application employs a simple, client-side routing strategy using the URL hash (`#`).
*   The hash (e.g., `/#platos-cave`) determines which main `Section` is rendered.
*   The `App` component listens for `hashchange` events to update the `currentSectionId` state, triggering a re-render with the new section's content.

## 3. UI/UX Design

### 3.1. General Philosophy

The design aesthetic is clean, academic, and contemplative, reflecting the philosophical nature of the content. It prioritizes readability and focus, using a muted color palette and classical typography to avoid distraction.

### 3.2. Layout & Responsiveness

The application features two distinct layouts managed by CSS media queries.

*   **Desktop (>= 1024px):**
    *   **Fixed Header:** A 70px tall header containing the site title and primary navigation is fixed to the top.
    *   **Two-Column Grid:** The main content area is split into two columns:
        *   **Left Column (Content):** A fluid-width column (`2fr`) that contains the scrollable article text (`<article>`).
        *   **Right Column (Visualization):** A fixed-width column (`1fr`) containing a "sticky" panel (`<aside>`). This panel remains in view as the user scrolls through the left column's content. It dynamically displays the visualization corresponding to the currently active subsection.
*   **Mobile (< 1024px, primarily < 800px):**
    *   **Fixed Header:** The header remains fixed. The desktop navigation links are replaced by a hamburger menu icon.
    *   **Single-Column Layout:** The content and visualizations are stacked vertically in a single column.
    *   **Inline Visualizations:** The visualization for each section is rendered directly above its corresponding title and text, inside a bordered container.
    *   **Mobile Menu:** Toggling the hamburger icon opens a full-screen navigation overlay, allowing users to jump to any section or subsection.

### 3.3. Color Palette

The palette is minimalist and earthy, promoting a calm, focused reading experience.

| Color          | Hex       | Usage                                          |
|----------------|-----------|------------------------------------------------|
| Primary BG     | `#FDFBF6` | Main page background                           |
| Primary Text   | `#3A3A3A` | Headings, key elements, dark viz components    |
| Secondary Text | `#5A5A5A` | Body text, sub-headings, medium viz components |
| Muted Accent   | `#8A8A8A` | Secondary viz components, UI hints             |
| Light Border   | `#C1C1C1` | Borders, dividers, disabled states             |
| Lighter BG     | `#EAE8E1` | Lighter border elements                      |
| Focus BG       | `#F1F0EC` | Hover/active states on UI elements             |
| Component BG   | `#FCFBF8` | Header, visualization panel backgrounds        |


### 3.4. Typography

*   **Primary Font:** `Georgia`, serif. Evokes a classic, literary, and academic feel.
*   **Headings:**
    *   `h1` (Title): 1.5rem (Header)
    *   `h2` (Section Title): 2.5rem
    *   `h3` (SubSection Title): 1.75rem
    *   `h4` (SubSubSection Title): 1.4rem
*   **Body Text:** 1.1rem with a generous `line-height` of 1.8 for excellent readability.

## 4. Component Breakdown

### 4.1. `App.tsx` (Core Container)

*   **Responsibilities:** Acts as the central controller. It initializes state, manages the main layout, and handles the core routing logic.
*   **Functionality:**
    *   Listens to `hashchange` to set the current section.
    *   Resets scroll position to the top when the main section changes.
    *   Provides the `handleSelectSection` function to child components for navigation. This function updates the URL hash and can scroll to specific sub-section `id`s.
    *   Renders the main structural elements: `Header`, `Hero`, `SectionPage`, and `Footer`.

### 4.2. `Header.tsx` (Navigation)

*   **Responsibilities:** Provides global navigation.
*   **Desktop Functionality:**
    *   Displays a horizontal list of top-level sections ("About", "Introduction") and section groups ("Part I", "Part II").
    *   Section groups are dropdown menus that reveal their child sections on hover.
*   **Mobile Functionality:**
    *   Displays a hamburger menu button.
    *   Toggling the button shows/hides a full-screen `mobile-nav-overlay`.
    *   The overlay contains a comprehensive, hierarchical list of all sections and subsections, allowing deep-linking into the content.

### 4.3. `Hero.tsx` (Animated Introduction)

*   **Responsibilities:** Provides an engaging, animated introduction to the site.
*   **Functionality:** On component mount, it triggers a timed, multi-step CSS transition animation:
    1.  The words "Homo" and "Dynamics" slide in from the sides.
    2.  A "+" symbol fades in between them.
    3.  The "+" symbol fades out and collapses, merging the two words into "HomoDynamics".
    4.  The byline "By Amit Srivastava" fades in below.

### 4.4. `SectionPage.tsx` (Main Content View)

*   **Responsibilities:** Renders the content for the currently active section and manages the active visualization.
*   **Functionality:**
    *   **Scroll-Spying:** It attaches a throttled `scroll` event listener to the main scroll container. It checks the position of `h3` and `h4` elements relative to the viewport. When a heading passes a certain threshold, it updates the `activeSubSectionId` in the parent `App` component.
    *   **Dynamic Visualization:** It uses `useMemo` to determine which visualization component to render in the right-hand panel. The logic traverses the data structure to find the component associated with the `activeSubSectionId`. If none is found for the active subsection, it defaults to the main section's visualization.
    *   Renders the section `h2` title and iterates through its subsections, passing them to `ContentDisplay`.

### 4.5. `ContentDisplay.tsx` (Content Renderer)

*   **Responsibilities:** Renders the HTML content for a subsection and its children.
*   **Functionality:**
    *   Renders the `h3` title for the main subsection.
    *   Renders paragraph content using `dangerouslySetInnerHTML` to support the HTML tags (e.g., `<strong>`, `<u>`, `<ul>`) in the `data.ts` strings.
    *   Renders any nested sub-subsections with an `h4` title and their own content, visually indented with a left border.
    *   **On mobile**, it renders the subsection's associated visualization directly above the `h3` title.

