import AppError from "./apperror.js";
import ProductsManager from "./productsmanager.js";
class Product {
  #id;
  #title;
  #category;
  #count;
  #price;
  #taxes;
  #ad;
  #discount;
  #finalPrice;
  static get #idGen() {
    return productIdGenerator(ProductsManager.lastProductId || 0);
  }
  constructor(
    title = "",
    category = "",
    count = 1,
    price = 0,
    taxes = 0,
    ad = 0,
    discount = 0
  ) {
    // debugger;
    console.log("last-product-id", ProductsManager.lastProductId);

    console.log("price inside constructor", price);
    Product.validateInput(title, category, count, price, taxes, ad, discount);
    // console.log(Product.idGen.next());
    this.#id = Product.#idGen.next().value;
    this.#title = title;
    this.#category = category;
    this.#count = +count;
    this.#price = +price;
    this.#taxes = +taxes;
    this.#ad = +ad;
    this.#discount = +discount;
    this.#finalPrice =
      +this.#price + +this.#taxes + +this.#ad - +this.#discount;
  }
  get id() {
    return this.#id;
  }
  get finalPrice() {
    return this.#finalPrice;
  }
  static validateInput(title, category, count, price, taxes, ad, discount) {
    const titleRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
    const priceCountRegex = /^[1-9][0-9]*$/;
    const regex2 = /^(0|[1-9][0-9]*)$/;

    // Title Handle
    validateInputField(titleRegex, title, "Invalid title", "productTitleInput");
    // Price Handle
    validateInputField(priceCountRegex, price, "Invalid price", "priceInput");
    // Taxes Handle
    validateInputField(regex2, taxes, "Invalid taxes", "taxAmountInput");
    // Ads Handle
    validateInputField(regex2, ad, "Invalid ad", "adAmountInput");
    // Discount Handle
    if (+discount >= +ad + +taxes + +price) {
      throw new AppError(
        "Invalid discount",
        document.querySelector("#productDiscountInput")
      );
    }
    validateInputField(
      regex2,
      discount,
      "Invalid discount",
      "productDiscountInput"
    );
    // Count Handle
    validateInputField(
      priceCountRegex,
      count,
      "Invalid count",
      "productQuantityInput"
    );
    // Category Handle
    validateInputField(
      titleRegex,
      category,
      "Invalid category",
      "categoryInput"
    );
  }
  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      category: this.#category,
      price: this.#price,
      taxes: this.#taxes,
      ad: this.#ad,
      discount: this.#discount,
      count: this.#count,
      finalPrice: this.#finalPrice,
    };
  }
}
// function validateProductInput(
//   title,
//   category,
//   count,
//   taxes,
//   discount,
//   ad,
//   price
// ) {

// }
function validateInputField(regex, inputValue, errorMsg, elementId) {
  const inputElement = document.getElementById(elementId);
  if (!regex.test(inputValue)) {
    throw new AppError(errorMsg, inputElement); // Error Manager Responsible for handling app errors
  }
  addValidClass(inputElement);
}
function* productIdGenerator(startingId = 0) {
  let x = startingId;
  while (true) {
    yield ++x;
  }
}
function addValidClass(element) {
  element.parentElement.parentElement.nextElementSibling.classList.add(
    "d-none"
  );
  if (element.classList.contains("is-invalid")) {
    element.classList.replace("is-invalid", "is-valid");
    return;
  }
  element.classList.add("is-valid");
}

export default Product;
