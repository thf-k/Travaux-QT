import { test, expect } from "@playwright/test";

test.describe("Formulaire d'inscription - cas d'erreur", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/index.html");
  });

  test("doit afficher une erreur si l'email est invalide", async ({ page }) => {
    await page.fill("#username", "john_doe");
    await page.fill("#email", "email-invalide"); 
    await page.fill("#password", "secret123");
    await page.click("button[type='submit']");

    await expect(page.locator("#error")).toHaveText("L'email n'est pas valide!");
  });

  test("doit afficher une erreur si un champ est manquant", async ({ page }) => {
    await page.fill("#username", "john_doe");
    // pas d'email
    await page.fill("#password", "secret123");
    await page.click("button[type='submit']");
    
    await expect(page.locator("#error")).toHaveText("Tous les champs sont requis!");


  });
});
