# Phase 2 Workflow Comparison: Vague vs. Precise AI Delegation

## Correctness & Edge Cases

In Round 1, the AI generated a basic form with standard state handling, but it completely neglected core concepts like strict validation and accessability. It allowed users to create `Public` playlists with empty descriptions and permitted the submission of a form without any data provided at all. 

In Round 2, the AI provided a much more robust architectural solution. It correctly abstracted the validation logic into an `isFormValid` helper function and tracked component state to properly enforce the conditional rule: public and collaborative playlists strictly require a description. It also enforced that a playlist name must be at least 3 characters long. Additionally, it introduced an `isTouched` state pattern. This prevents users from receiving errors before they even start typing, an edge case the vague prompt completely missed.

## Accessibility

While the vague prompt did manage to link `<label>` tags to their corresponding `<input>` tags and provided basic placeholders, it entirely ignored modern accessibility standards for dynamic forms. 

The precise prompt, however, explicitly implemented accessible states based on my constraints. It properly utilized specific `aria` attributes, adding `aria-required={descriptionRequired}` to the text area when a public privacy state was selected, and `aria-disabled={!formValid}` to the submit button. Furthermore, it wrapped the inline error text in a `role="alert"` tag, ensuring screen readers immediately announce validation failures.

The AI Mistake Caught: In Round 1, the AI failed to disable the submit button by default, allowing incomplete data submission. It also failed to implement inline validation, which would result in a poor user experience.

## Review Effort

Reviewing Round 1 would require actively rewriting the component to add the required `aria` attributes, building custom validation states from scratch, and manually writing tests. It was effectively just a boilerplate generation. 

Reviewing Round 2 was practically effortless because of the verification step. The inclusion of the React Testing Library test (`PlaylistForm.test.jsx`) meant I did not have to manually click through the UI to verify the edge cases. The test itself proved that the conditional logic (disabling the button when 'Public' is selected with an empty description) worked correctly before the code was ever rendered in the browser.