# FlyRank Frontend Capstone
This repository contains the capstone project for the FlyRank internship, focusing on AI-assisted frontend development and integration.

## Interactive 3D Experience: Dynamic Cassette Tape

As part of the 3D-on-the-web integration, the playlist detail view features an interactive 3D cassette tape that serves as dynamic, customizable cover art. 

*   **What was built:** A 3D scene rendering a customizable cassette tape using React Three Fiber (`@react-three/fiber` and `@react-three/drei`). The scene includes a material configurator allowing users to change the tape's plastic shell color (e.g., Neon Pink, Matte Black). It is deeply integrated with the app's global audio state: when a track is actively playing, the cassette responds by triggering a gentle floating/bobbing animation.
*   **Performance Note (Optimization & Loading):** To maintain strict performance budgets and ensure usability on mobile devices, the original GLTF model was optimized using the `gltfjsx --transform` pipeline. This applied Draco compression, drastically shrinking the geometry footprint to just **~31KB**. Furthermore, the heavy WebGL `<Canvas>` and Three.js library are strictly lazy-loaded via Next.js `next/dynamic` (`ssr: false`) with a lightweight static CSS skeleton as a fallback. This ensures the 3D assets do not block the main thread or penalize the initial page load time.
*   **What I'd add with more time:** 
    *   **Audio-Reactive Physics:** Hooking the 3D scene into the Web Audio API so the cassette pulses or vibrates in sync with the bass frequencies of the active track.
    *   **Dynamic Texture Mapping:** Generating a 2D HTML Canvas element with the playlist's title and dynamically applying it as a texture map onto the cassette's paper label for a cleaner look than raw 3D geometry text.
    *   **Drag-to-Spin Momentum:** Adding physics-based rotational momentum so users can "flick" and spin the cassette with their cursor or touch screen.

---

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