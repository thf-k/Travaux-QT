import { test, expect } from "@playwright/test";

test("should create an account successfully", async ({ page }) => {
  // Aller sur la page locale (index.html)
  await page.goto("http://localhost:3000/index.html");

  // Remplir le formulaire
  await page.fill("#username", "john_doe");
  await page.fill("#email", "john@example.com");
  await page.fill("#password", "mypassword123");

  // Cliquer sur "S'inscrire"
  await page.click("button[type=submit]");

  // Vérifier que le message de succès s'affiche
  await expect(page.locator("#success")).toBeVisible();
  await expect(page.locator("#success")).toHaveText("Compte créé avec succès");
});
