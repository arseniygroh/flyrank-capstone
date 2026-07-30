# FlyRank Frontend Capstone
This repository contains the capstone project for the FlyRank internship, focusing on AI-assisted frontend development and integration

## AI Tool Contract: `searchItunes`

*   **Name:** `searchItunes`
*   **Description:** Search the iTunes API for music tracks.
*   **Input Schema (Zod):**
    ```typescript
    {
      query: string // The search term, e.g., "The Beatles" or "Lo-fi beats"
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