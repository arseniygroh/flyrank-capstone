# FlyRank Frontend Capstone
This repository contains the capstone project for the FlyRank internship, focusing on AI-assisted frontend development and integration

## AI Tool Contract: `searchItunes`

*   **Name:** `searchItunes`
*   **Description:** Search the iTunes API for music tracks.
*   **Input Schema (Zod):**
    ```typescript
    {
      query: string // The search term
    }
    ```
*   **Return Shape:**
    Array of mapped track objects or an error object:
    ```typescript
    Array<{
      trackId: number,
      title: string,
      artist: string,
      coverArt: string
    }> | { error: string }
    ```

## Stateful Button Interaction Design

The `StatefulButton` component manages a 5-step lifecycle (Idle, Hover/Focus, Loading, Success, Error) with intentional motion logic:

*   **Compositor-Only Animations:** The inner content transitions exclusively use `opacity`, `scale`, and `y` transforms inside an `AnimatePresence (mode="wait")` block. This ensures the browser only repaints textures without triggering expensive layout recalculations.
*   **Easings & Durations:** 
    *   **Content Swaps:** A quick `0.2s` duration for standard content swaps (idle to loading) keeps the UI feeling responsive.
    *   **Success State:** The checkmark utilizes a `spring` transition (`stiffness: 300`, `damping: 20`).
    *   **Error Shake:** The horizontal shake uses a custom keyframe array `[0, -8, 8, -6, 6, 0]` over `0.4s` to mimic a shake of denial.
*   **Accessibility:** The shake animation is wrapped in a `useReducedMotion` hook. If a user prefers reduced motion, the shake is disabled entirely, but the red color and "Failed" text swap still occur, ensuring feedback is never removed, only the motion.