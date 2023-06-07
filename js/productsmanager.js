class ProductsManager {
  // Properties
  static #productsList = retrieveProductsList() ?? [];
  // Methods
  static get productsList() {
    return this.#productsList;
  }
  static get lastProductId() {
    if (this.#productsList.length) {
      return this.#productsList[this.#productsList.length - 1].id;
    }
    return null;
  }
  static isProductsListEmpty() {
    // Not used currently
    return !this.#productsList.length;
  }
  static drawProductsUI(products = this.#productsList) {
    const tableBodyEl = document.querySelector(".table tbody");
    tableBodyEl.innerHTML = "";
    products.forEach((product) => {
      const productTemplate = `
    <tr class="product-row">
      <td class="product-id">${product.id}</td>
      <td class="product-title">${product.title}</td>
      <td class="product-price">${product.price}</td>
      <td class="product-taxes">${product.taxes}</td>
      <td class="product-ads">${product.ad}</td>
      <td class="product-discount">${product.discount}</td>
      <td class="product-total-price">${product.finalPrice}</td>
      <td class="product-category">${product.category}</td>
      <td><button class="btn btn-sm btn-primary update-product-btn fw-bold text-uppercase" data-productid='${product.id}'>update</button></td>
      <td><button class="btn btn-sm btn-danger delete-product-btn fw-bold text-uppercase" data-productid='${product.id}'>delete</button></td>
    </tr>
      `;
      tableBodyEl.innerHTML += productTemplate;
    });
  }

  static clearAllProducts() {
    this.#productsList = [];
    saveProductsToLocalStorage(this.#productsList);
  }
  static searchProducts(searchMode = 0, searchValue) {
    if (searchValue === "") {
      this.drawProductsUI();
      return;
    }
    let products;
    if (searchMode) {
      // category search
      products = this.#productsList.filter(({ category }) =>
        category.includes(searchValue.toLowerCase())
      );
    } else {
      // title search
      products = this.#productsList.filter(({ title }) =>
        title.includes(searchValue.toLowerCase())
      );
    }
    this.drawProductsUI(products);
  }
  static getProduct(productId) {
    return this.#productsList.find(({ id }) => id === productId);
  }
  static updateProduct(productId, updatedValues) {
    const product = this.#productsList.find(({ id }) => id === productId);
    console.log(updatedValues);
    console.log(product);
    for (let key in updatedValues) {
      product[key] = updatedValues[key];
    }
    saveProductsToLocalStorage(this.#productsList);
  }
  static removeProduct(productId) {
    const newProductsList = this.#productsList.filter(
      ({ id }) => id !== productId
    );
    this.#productsList = newProductsList;
    saveProductsToLocalStorage(this.#productsList);
  }
  static addProduct(product) {
    this.#productsList = [...this.#productsList, product.toJSON()];
    saveProductsToLocalStorage(this.#productsList);
  }
}
function saveProductsToLocalStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}
function retrieveProductsList() {
  const productsList = JSON.parse(localStorage.getItem("products"));
  return productsList?.length ? productsList : null;
}
export default ProductsManager;
