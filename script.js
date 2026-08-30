import products from "./data.js";

/* =================================
   DOM ELEMENTS
================================= */

const menuDisplay = document.getElementById("menuDisplay");

const searchInput = document.getElementById("searchInput");

const foodTypeSelection =
  document.getElementById("food-type-selection");

const ratingInput =
  document.getElementById("rating-input");

const ratingValue =
  document.getElementById("rating-value");

const categoryCheckboxes =
  document.querySelectorAll(".category-checkbox");

const clearButton =
  document.getElementById("clear-btn");

const cartCount =
  document.getElementById("cart-count");

const cartDisplay =
  document.getElementById("cartDisplay");

const totalItems =
  document.getElementById("total-items");

const cartTotal =
  document.getElementById("cart-total");

const clearCartButton =
  document.getElementById("clear-cart");

const cartLink =
  document.getElementById("cart-link");

const cartSection =
  document.getElementById("cart-section");


/* =================================
   CART
================================= */

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("foodMartCart")) || [];


/* =================================
   DISPLAY PRODUCTS
================================= */

function displayProducts(productList) {

  menuDisplay.innerHTML = "";

  if (productList.length === 0) {

    menuDisplay.innerHTML = `
      <p class="no-products">
        No food items found.
      </p>
    `;

    return;
  }

  productList.forEach(product => {

    const productCard =
      document.createElement("div");

    productCard.classList.add("product-card");

    productCard.innerHTML = `

      <img
        src="${product.imgUrl}"
        alt="${product.name}"
      >

      <h3>${product.name}</h3>

      <p>${product.description}</p>

      <div class="card-rating-discount-strip">

        <span>
          ⭐ ${product.rating}
        </span>

        <span class="discount">
          ${product.discountPercentage}% OFF
        </span>

      </div>

      <div>

        <strong>
          ₹${product.discountedPrice}
        </strong>

        <span class="original-price">
          ₹${product.price}
        </span>

      </div>

      <div class="card-cart-button-strip">

        <span>
          ${product.category}
        </span>

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


/* =================================
   ADD TO CART
================================= */

function addToCart(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product) {
    return;
  }

  const existingItem =
    cart.find(item => item.id === productId);

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

  saveCart();

  renderCart();

  updateCartCount();
}


/* =================================
   SAVE CART
================================= */

function saveCart() {

  localStorage.setItem(
    "foodMartCart",
    JSON.stringify(cart)
  );
}


/* =================================
   RENDER CART
================================= */

function renderCart() {

  cartDisplay.innerHTML = "";

  if (cart.length === 0) {

    cartDisplay.innerHTML = `
      <p class="empty-cart">
        Your cart is empty.
      </p>
    `;

    totalItems.textContent = "0";
    cartTotal.textContent = "0";

    return;
  }

  cart.forEach(item => {

    const cartItem =
      document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `

      <img
        src="${item.imgUrl}"
        alt="${item.name}"
      >

      <div class="cart-item-info">

        <h3>${item.name}</h3>

        <p>
          ₹${item.price}
        </p>

        <div class="quantity-controls">

          <button
            class="quantity-btn decrease-btn"
            data-id="${item.id}"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            class="quantity-btn increase-btn"
            data-id="${item.id}"
          >
            +
          </button>

        </div>

      </div>

      <div class="cart-item-right">

        <strong>
          ₹${item.price * item.quantity}
        </strong>

        <button
          class="remove-cart-btn"
          data-id="${item.id}"
        >
          Remove
        </button>

      </div>

    `;

    cartDisplay.appendChild(cartItem);
  });


  calculateCartTotal();
}


/* =================================
   CART COUNT
================================= */

function updateCartCount() {

  const count =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  cartCount.textContent = count;
}


/* =================================
   CART TOTAL
================================= */

function calculateCartTotal() {

  const items =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const total =
    cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

  totalItems.textContent = items;

  cartTotal.textContent = total;
}


/* =================================
   INCREASE QUANTITY
================================= */

function increaseQuantity(productId) {

  const item =
    cart.find(item => item.id === productId);

  if (!item) {
    return;
  }

  item.quantity++;

  saveCart();

  renderCart();

  updateCartCount();
}


/* =================================
   DECREASE QUANTITY
================================= */

function decreaseQuantity(productId) {

  const item =
    cart.find(item => item.id === productId);

  if (!item) {
    return;
  }

  if (item.quantity > 1) {

    item.quantity++;

    item.quantity -= 2;

  } else {

    cart =
      cart.filter(
        item => item.id !== productId
      );
  }

  saveCart();

  renderCart();

  updateCartCount();
}


/* =================================
   REMOVE ITEM
================================= */

function removeFromCart(productId) {

  cart =
    cart.filter(
      item => item.id !== productId
    );

  saveCart();

  renderCart();

  updateCartCount();
}


/* =================================
   CLEAR CART
================================= */

function clearCart() {

  cart = [];

  saveCart();

  renderCart();

  updateCartCount();
}


/* =================================
   FILTER PRODUCTS
================================= */

function filterProducts() {

  const searchText =
    searchInput.value
      .toLowerCase()
      .trim();

  const selectedFoodType =
    foodTypeSelection.value;

  const selectedRating =
    Number(ratingInput.value);

  const selectedCategories =
    Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);


  const filteredProducts =
    products.filter(product => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchText);

      const matchesFoodType =
        selectedFoodType === "" ||
        product.type === selectedFoodType;

      const matchesRating =
        product.rating >= selectedRating;

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          product.category
        );

      return (
        matchesSearch &&
        matchesFoodType &&
        matchesRating &&
        matchesCategory
      );
    });


  displayProducts(filteredProducts);
}


/* =================================
   EVENT LISTENERS
================================= */


/*
   Add to Cart
*/

menuDisplay.addEventListener(
  "click",
  event => {

    if (
      event.target.classList.contains(
        "add-cart-btn"
      )
    ) {

      const productId =
        Number(
          event.target.dataset.id
        );

      addToCart(productId);
    }
  }
);


/*
   Cart buttons
*/

cartDisplay.addEventListener(
  "click",
  event => {

    const productId =
      Number(
        event.target.dataset.id
      );


    if (
      event.target.classList.contains(
        "increase-btn"
      )
    ) {

      increaseQuantity(productId);
    }


    if (
      event.target.classList.contains(
        "decrease-btn"
      )
    ) {

      decreaseQuantity(productId);
    }


    if (
      event.target.classList.contains(
        "remove-cart-btn"
      )
    ) {

      removeFromCart(productId);
    }
  }
);


/*
   Search
*/

searchInput.addEventListener(
  "input",
  filterProducts
);


/*
   Food Type
*/

foodTypeSelection.addEventListener(
  "change",
  filterProducts
);


/*
   Rating
*/

ratingInput.addEventListener(
  "input",
  () => {

    ratingValue.textContent =
      ratingInput.value;

    filterProducts();
  }
);


/*
   Category
*/

categoryCheckboxes.forEach(
  checkbox => {

    checkbox.addEventListener(
      "change",
      filterProducts
    );
  }
);


/*
   Clear Filters
*/

clearButton.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    foodTypeSelection.value = "";

    ratingInput.value = 0;

    ratingValue.textContent = 0;

    categoryCheckboxes.forEach(
      checkbox => {
        checkbox.checked = false;
      }
    );

    displayProducts(products);
  }
);


/*
   Clear Cart
*/

clearCartButton.addEventListener(
  "click",
  clearCart
);


/*
   Cart Navigation
*/

cartLink.addEventListener(
  "click",
  event => {

    event.preventDefault();

    cartSection.scrollIntoView({
      behavior: "smooth"
    });
  }
);


/* =================================
   INITIAL LOAD
================================= */

displayProducts(products);

renderCart();

updateCartCount();