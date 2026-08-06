import { test, expect } from '@playwright/test';

test('Primary Flow: User can interact with the AI DJ', async ({page}) => {
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`Browser Error: "${msg.text()}"`);
  });
  page.on('pageerror', error => console.log(`Page Crash: ${error.message}`));

  await page.route('**/api/chat', async route => {
    if (route.request().method() !== 'POST') {
      return route.fallback();
    }

    const mockStream =
      `data: {"type":"start"}\n\n` +
      `data: {"type":"text-start","id":"msg_1"}\n\n` +
      `data: {"type":"text-delta","id":"msg_1","delta":"Here is a great mocked track for you!"}\n\n` +
      `data: {"type":"text-end","id":"msg_1"}\n\n` +
      `data: {"type":"finish"}\n\n` +
      `data: [DONE]\n\n`;

    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: mockStream,
    });
  });

  await page.goto('/chat');

  const input = page.getByPlaceholder('Your prompt...');
  await input.fill('Play some jazz');

  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.locator('text=mocked track')).toBeVisible({ timeout: 5000 });
});