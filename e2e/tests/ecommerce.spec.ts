import { test, expect, Page } from "@playwright/test";

async function acceptCookies(page: Page) {
  //localise le bouton "accepter les cookies" et on clique dessus
  const acceptCookiesButton = page.getByRole("button", { name: "Consent" });
 
  // On verif si le bouton est visible avant de cliquer
  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
}
 
test.describe("Ecommerce's product page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://automationexercise.com/");
    await acceptCookies(page);
  });
 
test("should go to product page", async ({ page }) => {
  // on clique sur le lien "Products"
  await page.getByRole("link", { name: " Products" }).click();

  // verif que l’URL est bien celle de la page des produits
  await expect(page).toHaveURL("https://automationexercise.com/products");

  // verif que le titre de la page correspond
  await expect(await page.title()).toBe("Automation Exercise - All Products");
});

test("should find a t-shirt", async ({ page }) => {
    await page.goto("https://automationexercise.com/");

    // aller sur la page "Products"
    await page.getByRole("link", { name: " Products" }).click();

    // écrire "t-shirt" dans la barre de recherche
    await page.getByRole("textbox", { name: "Search Product" }).fill("t-shirt");

    // Clique sur le bouton recherche (plus fiable avec l’ID)
    await page.locator("#submit_search").click();


    // verif qu’il y a 3 produits affichés
    const products = page.locator(".features_items .product-image-wrapper");
    await expect(products).toHaveCount(3);
  });


  test("should contains product's details like title and price", async ({ page }) => {
    await page.goto("https://automationexercise.com/product_details/30");

    // verif le titre de l’onglet du navigateur
    expect(await page.title()).toBe("Automation Exercise - Product Details");

    // verif le titre du produit
    await expect(
      page.getByRole("heading", { name: "Premium Polo T-Shirts" })
    ).toBeVisible();

    // verif que le prix est affiché (il contient "Rs.")
    await expect(page.getByText("Rs.")).toBeVisible();

    // verif que le bouton "Add to cart" est présent
    await expect(page.getByText("Add to cart")).toBeVisible();
  });

});

test.describe("Ecommerce's cart", () => {
  test("should add product to cart and display it in cart page", async ({ page }) => {
    await page.goto("https://automationexercise.com/product_details/30");
    await acceptCookies(page);

    await page.getByText("Add to cart").click();

    // cliquer sur "View Cart" 
    await page.getByRole("link", { name: "View Cart" }).click();

    // verif l’URL du panier
    await expect(page).toHaveURL("https://automationexercise.com/view_cart");

    // verif que le produit ajouté apparaît bien
    await expect(page.getByText("Premium Polo T-Shirts")).toBeVisible();
    
    // verif le prix (plus précis que getByText)
    await expect(page.locator("td.cart_price")).toHaveText("Rs. 1500")
    await expect(page.locator(".cart_quantity")).toHaveText("1");
  });
  });