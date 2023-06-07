import Product from "./product.js";
import ProductsManager from "./productsmanager.js";
import ErrorManager from "./errormanager.js";
class App {
  #productTitleInput;
  #priceInput;
  #taxAmountInput;
  #productQuantityInput;
  #categoryInput;
  #searchInput;
  #searchBtns;
  #deleteProductsBtn;
  #createProductBtn;
  #updateProductBtn;
  #totalAddedProductsEl;
  #productDiscountInput;
  #adAmountInput;
  #totalPrice;
  constructor() {
    [
      this.#productTitleInput,
      this.#priceInput,
      this.#adAmountInput,
      this.#taxAmountInput,
      this.#productDiscountInput,
      this.#productQuantityInput,
      this.#categoryInput,
      this.#createProductBtn,
      this.#updateProductBtn,
      this.#searchInput,
      this.#deleteProductsBtn,
      this.#totalPrice,
    ] = [
      "productTitleInput",
      "priceInput",
      "adAmountInput",
      "taxAmountInput",
      "productDiscountInput",
      "productQuantityInput",
      "categoryInput",
      "createProductBtn",
      "updateProductBtn",
      "searchInput",
      "deleteAllProductsBtn",
      "totalPrice",
    ].map((id) => document.getElementById(id));
    this.#searchBtns = document.querySelectorAll(".search-btn");
    this.#totalAddedProductsEl = this.#deleteProductsBtn.firstElementChild;
    this.#createProductBtn.addEventListener(
      "click",
      this.#handleCreateProduct.bind(this)
    );
    // Retrieve products
    if (ProductsManager.productsList.length) {
      ProductsManager.drawProductsUI();
      this.#updateProductsCount();
    }
    // Event Listeners
    [
      this.#categoryInput,
      this.#productTitleInput,
      this.#priceInput,
      this.#adAmountInput,
      this.#taxAmountInput,
      this.#productQuantityInput,
      this.#productDiscountInput,
    ].forEach((input) => {
      input.addEventListener("input", this.#handleInput.bind(this));
    });
    // delete all btn
    this.#deleteProductsBtn.addEventListener(
      "click",
      this.#deleteAllProducts.bind(this)
    );
    // Update Btn
    this.#updateProductBtn.addEventListener("click", () => {
      this.#handleUpdateProduct();
    });
    // Search Input
    this.#searchInput.addEventListener("input", function () {
      console.log(this.value.trim());
      console.log(this.dataset.searchmode);
      ProductsManager.searchProducts(
        +this.dataset.searchmode,
        this.value.trim()
      );
    });
    // Search Btns
    this.#searchBtns.forEach((searchBtn) => {
      searchBtn.addEventListener("click", () => {
        this.#searchInput.dataset.searchmode = searchBtn.dataset.searchmode;
        this.#searchInput.nextElementSibling.textContent =
          searchBtn.textContent;
      });
    });
    document.addEventListener("click", ({ target }) => {
      // product delete button
      if (target.matches(".delete-product-btn")) {
        console.log("last product id ", ProductsManager.lastProductId);
        ProductsManager.removeProduct(+target.dataset.productid);
        this.#updateProductsCount();
        ProductsManager.drawProductsUI();
        // dispatching input event to redraw products again
        this.#searchInput.dispatchEvent(new Event("input"));
        console.log("after last product id ", ProductsManager.lastProductId);
        if (
          !this.#updateProductBtn.matches(".d-none") &&
          this.#updateProductBtn.dataset.productid === target.dataset.productid
        ) {
          this.#handleUpdateBtnVisibility();
          this.#resetInputsValue();
        }
        return;
      }
      // product update button
      if (target.matches(".update-product-btn")) {
        // Hide createproductbtn and show update btn
        this.#createProductBtn.classList.add("d-none");
        this.#updateProductBtn.classList.remove("d-none");
        document
          .getElementById("countElementContainer")
          .classList.add("d-none");
        this.#updateProductBtn.dataset.productid = target.dataset.productid;
        const product = ProductsManager.getProduct(+target.dataset.productid);
        // Setting product current values into input fields
        this.#categoryInput.value = product.category;
        this.#productTitleInput.value = product.title;
        this.#priceInput.value = product.price;
        this.#adAmountInput.value = product.ad;
        this.#taxAmountInput.value = product.taxes;
        this.#productDiscountInput.value = product.discount;
        this.#totalPrice.textContent = product.finalPrice;
        console.log(product);
        console.log(ProductsManager.productsList);
      }
    });
  }
  #handleUpdateProduct() {
    try {
      const title = this.#productTitleInput.value.trim();
      const category = this.#categoryInput.value.trim();
      const price = this.#priceInput.value.trim();
      const taxes = this.#taxAmountInput.value.trim();
      const ad = this.#adAmountInput.value.trim();
      const discount = this.#productDiscountInput.value.trim();
      Product.validateInput(title, category, 1, price, taxes, ad, discount);
      const updatedValues = {
        title,
        category,
        price: +price,
        taxes: +taxes,
        ad: +ad,
        discount: +discount,
        finalPrice: +this.#totalPrice.textContent,
      };
      ProductsManager.updateProduct(
        +this.#updateProductBtn.dataset.productid,
        updatedValues
      );
      ProductsManager.drawProductsUI();
      this.#resetInputsValue();
      // show count element & create product button  & hide update button
      this.#handleUpdateBtnVisibility();
    } catch (e) {
      ErrorManager.handleError(e);
    }
  }
  #updateProductsCount() {
    this.#totalAddedProductsEl.textContent =
      ProductsManager.productsList.length;
  }
  #deleteAllProducts() {
    ProductsManager.clearAllProducts();
    this.#updateProductsCount();
    ProductsManager.drawProductsUI();
  }
  #handleInput() {
    try {
      const title = this.#productTitleInput.value.trim();
      const category = this.#categoryInput.value.trim();
      const count = this.#productQuantityInput.value.trim();
      const price = this.#priceInput.value.trim();
      const taxes = this.#taxAmountInput.value.trim();
      const ad = this.#adAmountInput.value.trim();
      const discount = this.#productDiscountInput.value.trim();
      Product.validateInput(title, category, count, price, taxes, ad, discount);
      this.#handleFinalProductPriceUI(price, taxes, discount, ad);
    } catch (error) {
      ErrorManager.handleError(error);
    }
  }
  #handleFinalProductPriceUI(price, taxes, discount, ad) {
    this.#totalPrice.textContent = +price + +taxes + +ad - discount;
  }
  #handleCreateProduct() {
    try {
      const title = this.#productTitleInput.value.trim();
      const category = this.#categoryInput.value.trim();
      const count = this.#productQuantityInput.value.trim();
      const price = this.#priceInput.value.trim();
      const taxes = this.#taxAmountInput.value.trim();
      const ad = this.#adAmountInput.value.trim();
      const discount = this.#productDiscountInput.value.trim();
      console.log("count is", count);
      if (count > 1) {
        for (let i = 0; i < count; i++) {
          const product = new Product(
            title,
            category,
            count,
            price,
            taxes,
            ad,
            discount
          );
          ProductsManager.addProduct(product);
        }
      } else {
        const product = new Product(
          title,
          category,
          count,
          price,
          taxes,
          ad,
          discount
        );
        ProductsManager.addProduct(product);
      }
      ProductsManager.drawProductsUI();
      this.#updateProductsCount();
      this.#resetInputsValue();
      console.log(ProductsManager.productsList);
    } catch (error) {
      ErrorManager.handleError(error);
    }
  }
  #resetInputsValue() {
    this.#categoryInput.value = "";
    this.#productTitleInput.value = "";
    this.#priceInput.value = 1;
    this.#adAmountInput.value = 0;
    this.#taxAmountInput.value = 0;
    this.#productQuantityInput.value = 1;
    this.#productDiscountInput.value = 0;
    this.#totalPrice.textContent = 1;
  }
  #handleUpdateBtnVisibility() {
    document.getElementById("countElementContainer").classList.remove("d-none");
    this.#createProductBtn.classList.remove("d-none");
    this.#updateProductBtn.classList.add("d-none");
  }
}

export default App;
