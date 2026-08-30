
const cartDisplay = document.getElementById("cartDisplay");
const cartCount = document.getElementById("cart-count");
const totalItems = document.getElementById("total-items");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-btn");


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


function renderCart() {
  const cart = getCart();

  cartDisplay.innerHTML = "";

  if (cart.length === 0) {

    cartDisplay.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty.</h3>
        <p>Add some delicious food from our menu!</p>
        <br>
        <a href="index.html" class="product-button">
          Explore Menu
        </a>
      </div>
    `;

    totalItems.textContent = "0";
    cartTotal.textContent = "0";

    return;
  }


  cart.forEach((item) => {

    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `

      <img
        src="${item.imgUrl}"
        alt="${item.name}"
      >

      <div class="cart-item-info">

        <h3>${item.name}</h3>

        <p>
          Price: ₹${item.price}
        </p>

        <div class="quantity-controls">

          <button
            class="quantity-btn decrease-btn"
            data-id="${item.id}"
          >
            −
          </button>

          <span class="quantity">
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


  calculateTotal(cart);
}


function calculateTotal(cart) {

  const items = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);


  const total = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);


  totalItems.textContent = items;

  cartTotal.textContent = total;
}


function increaseQuantity(productId) {

  const cart = getCart();

  const item = cart.find((item) => item.id === productId);

  if (!item) return;

  item.quantity++;

  saveCart(cart);

  renderCart();

  updateCartCount();
}


function decreaseQuantity(productId) {

  let cart = getCart();

  const item = cart.find((item) => item.id === productId);

  if (!item) return;


  if (item.quantity > 1) {

    item.quantity--;

  } else {

    cart = cart.filter((item) => item.id !== productId);
  }


  saveCart(cart);

  renderCart();

  updateCartCount();
}


function removeFromCart(productId) {

  let cart = getCart();

  cart = cart.filter((item) => item.id !== productId);

  saveCart(cart);

  renderCart();

  updateCartCount();
}


/* Cart Item Events */

cartDisplay.addEventListener("click", (event) => {

  const productId = Number(event.target.dataset.id);


  if (event.target.classList.contains("increase-btn")) {

    increaseQuantity(productId);
  }


  if (event.target.classList.contains("decrease-btn")) {

    decreaseQuantity(productId);
  }


  if (event.target.classList.contains("remove-cart-btn")) {

    removeFromCart(productId);
  }
});


/* Clear Cart */

clearCartButton.addEventListener("click", () => {

  localStorage.removeItem("foodMartCart");

  renderCart();

  updateCartCount();
});


/* Checkout */

checkoutButton.addEventListener("click", () => {

  const cart = getCart();

  if (cart.length === 0) {

    alert("Your cart is empty!");

    return;
  }

  alert(
    "Order placed successfully! Thank you for shopping at FoodMart."
  );

  localStorage.removeItem("foodMartCart");

  renderCart();

  updateCartCount();
});


/* Initial Load */

renderCart();

updateCartCount();

