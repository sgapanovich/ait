import { test, expect } from '@playwright/test';

test.describe("Report testing", async () => {
  let eventOne = "Event One - Room: 101"
  let eventTwo = "Event Two - Room: 101"

  test.beforeEach(async ({page}) => {
    await page.goto('/#/admin');
  
    await page.getByText("Let me hack!").click();
    await page.getByTestId("username").fill("admin");
    await page.getByTestId("password").fill("password");
    await page.getByTestId("submit").click();
  
    await expect(page.getByText("Logout")).toBeVisible();
  })

  test('Report is visible and events present', async ({page }) => {
    await page.locator("#reportLink").click();
    await expect(page.locator(".rbc-calendar")).toBeVisible();

    await expect(page.getByText(eventOne)).toBeVisible();
    await expect(page.getByText(eventTwo)).toBeVisible();
  });
})

