# Accessibility Foundations

After building a Disclosure, Tabs, and Modal Dialog from scratch using W3C ARIA guidelines, I installed the `shadcn/ui` (Radix UI) versions to see how the pros do it. 

Here are the biggest differences I noticed between my manual code and shadcn's generated source code:

### 1. Where the Modal Actually Lives (DOM Portals)
*   **My Version:** I just rendered the modal exactly where I called it in the React tree. I used CSS (`fixed inset-0` and `z-50`) to make it float on top, but it could still easily break if a parent container has `overflow: hidden` or weird `z-index` rules.
*   **Shadcn's Version:** It uses React Portals to literally teleport the modal's HTML out of the parent component and attach it directly to the end of the `<body>` tag. This completely sidesteps any CSS conflicts and guarantees it always sits on top.

### 2. Handling the Background (Scroll & Clicks)
*   **My Version:** To stop the user from scrolling the page behind the open modal, I just set `document.body.style.overflow = "hidden"`. It works, but making the scrollbar disappear suddenly causes the whole page layout to abruptly shift.
*   **Shadcn's Version:** It handles this way more elegantly. It adds temporary padding to the body to replace the missing scrollbar (preventing the layout jump). It also strictly disables pointer events on the background so users can't accidentally click things behind the modal mask.

### 3. Flexibility and Prop Passing (Compound Components)
*   **My Version:** I built my Tabs to be pretty strict. You have to pass it a highly specific array of data (like `items={myTabs}`) for it to render anything. 
*   **Shadcn's Version:** It uses a "compound component" pattern (breaking it down into `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, etc.). This is much more flexible because it lets you attach standard HTML attributes, custom CSS, or React refs directly to the individual pieces without having to wire up custom props for every little thing.

### 4. Keyboard Navigation Edge Cases (Tabs)
*   **My Version:** I implemented a basic "roving tabindex" that assumes tabs are laid out horizontally and automatically switches the active tab as you press the left/right arrow keys.
*   **Shadcn's Version:** It handles basically every edge case you can think of. It supports both horizontal *and* vertical arrow key navigation, lets you configure whether tabs open automatically or require a manual "Enter" press, and safely skips over disabled tabs.