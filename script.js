
import products from "./data.js";

const menuDisplay = document.getElementById("menuDisplay");
const searchInput = document.getElementById("searchInput");
const foodTypeSelection = document.getElementById("food-type-selection");
const ratingInput = document.getElementById("rating-input");
const ratingValue = document.getElementById("rating-value");
const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
const foodTypeRadios = document.querySelectorAll('input[name="foodType"]');
const clearButton = document.getElementById("clear-btn");
const cartCount = document.getElementById("cart-count");


function getCart() {
  return JSON.parse(localStorage.getItem("foodMartCart")) || [];
}


function saveCart(cart) {
  localStorage.setItem("foodMartCart", JSON.stringify(cart));
}


function updateCartCount() {
  const cart = getCart();

  const totalQuantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cartCount.textContent = totalQuantity;
}


function displayProducts(productList) {
  menuDisplay.innerHTML = "";

  if (productList.length === 0) {
    menuDisplay.innerHTML = `
      <p class="no-products">No food items found.</p>
    `;
    return;
  }

  productList.forEach((product) => {
    const productCard = document.createElement("div");

    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.imgUrl}" alt="${product.name}">

      <h3>${product.name}</h3>

      <p>${product.description}</p>

      <div class="card-rating-discount-strip">
        <span>⭐ ${product.rating}</span>
        <span class="discount">${product.discountPercentage}% OFF</span>
      </div>

      <div class="price-section">
        <strong>₹${product.discountedPrice}</strong>

        <span class="original-price">
          ₹${product.price}
        </span>
      </div>

      <div class="card-cart-button-strip">
        <span>${product.category}</span>

        <button
          class="product-button add-cart-btn"
          data-id="${product.id}"
        >
          Add to Cart
        </button>
      </div>
    `;

    menuDisplay.appendChild(productCard);
  });
}


function addToCart(productId) {
  const cart = getCart();

  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.discountedPrice,
      imgUrl: product.imgUrl,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}


function filterProducts() {
  const searchText = searchInput.value.toLowerCase().trim();

  const selectedDropdownFoodType = foodTypeSelection.value;

  const selectedRadio = document.querySelector(
    'input[name="foodType"]:checked'
  );

  const selectedRadioFoodType = selectedRadio
    ? selectedRadio.value
    : "";

  const selectedRating = Number(ratingInput.value);

  const selectedCategories = Array.from(categoryCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.name.toLowerCase().includes(searchText);

    const matchesDropdownFoodType =
      selectedDropdownFoodType === "" ||
      product.type === selectedDropdownFoodType;

    const matchesRadioFoodType =
      selectedRadioFoodType === "" ||
      product.type === selectedRadioFoodType;

    const matchesRating =
      product.rating >= selectedRating;

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    return (
      matchesSearch &&
      matchesDropdownFoodType &&
      matchesRadioFoodType &&
      matchesRating &&
      matchesCategory
    );
  });

  displayProducts(filteredProducts);
}


/* Add to Cart */

menuDisplay.addEventListener("click", (event) => {

  if (event.target.classList.contains("add-cart-btn")) {

    const productId = Number(event.target.dataset.id);

    addToCart(productId);
  }
});


/* Search */

searchInput.addEventListener("input", filterProducts);


/* Dropdown Food Type */

foodTypeSelection.addEventListener("change", filterProducts);


/* Radio Food Type */

foodTypeRadios.forEach((radio) => {
  radio.addEventListener("change", filterProducts);
});


/* Rating */

ratingInput.addEventListener("input", () => {

  ratingValue.textContent = ratingInput.value;

  filterProducts();
});


/* Categories */

categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});


/* Clear Filters */

clearButton.addEventListener("click", () => {

  searchInput.value = "";

  foodTypeSelection.value = "";

  ratingInput.value = "0";

  ratingValue.textContent = "0";

  foodTypeRadios.forEach((radio) => {
    radio.checked = false;
  });

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  displayProducts(products);
});


/* Initial Load */

displayProducts(products);

updateCartCount();

