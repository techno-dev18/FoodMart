import products from './data.js';

const productDiplay = document.getElementById('productsDisplay');
const foodTypeSelection = document.getElementById('food-type-selection');
const foodTypeRadios = document.querySelectorAll('input[name="foodType"]');
const ratingInput = document.getElementById('rating-input');
const ratingValue = document.getElementById('rating-value');
const searchInput = document.getElementById('searchInput');
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
const clearbtn = document.getElementById('clear-btn');

const displayProducts = (products) => {
  productDiplay.innerHTML = ``;

  products.forEach((currentProduct) => {
    const card = document.createElement('div');
    card.className = 'product-card';

  
    card.innerHTML = `
  <img src=${currentProduct.imgUrl} alt=${currentProduct.name}/>
  
  <h3>${currentProduct.name}</h3>
  <p>${currentProduct.description}</p>

  <p class="card-rating-discount-strip">
    <span>${currentProduct.rating} 🌟</span>
    <span>${currentProduct.discountPercentage}% off</span>
  </p>

  <p class="card-cart-button-strip">
    <span class="price">₹${currentProduct.discountedPrice}</span>
    <span class="original-price">₹${currentProduct.price}</span>
    <button class="product-button">Add to cart</button>
  </p>
`;

    productDiplay.append(card);
  });
};

displayProducts(products);

foodTypeSelection.addEventListener('change', (e) => {
  const filter = e.target.value;

  if (filter === '') {
    displayProducts(products);
    return;
  }

  const filteredProducts = products.filter((curr) => curr.type === filter);

  displayProducts(filteredProducts);
});

foodTypeRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    const selectedType = e.target.value;

    const filteredProducts = products.filter((p) => p.type === selectedType);

    displayProducts(filteredProducts);
  });
});

ratingInput.addEventListener('input', (e) => {
  const rating = Number(e.target.value);
  ratingValue.innerText = rating;

  const filteredProducts = products.filter((curr) => curr.rating >= rating);

  displayProducts(filteredProducts);
});

searchInput.addEventListener('input', (e) => {
  const searchText = e.target.value.toLowerCase();

  if (searchText === '') {
    displayProducts(products);
    return;
  }

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  });

  displayProducts(filteredProducts);
});

categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const selectCategories = [];

    categoryCheckboxes.forEach((cb) => {
      if (cb.checked) {
        selectCategories.push(cb.value);
      }
    });

    if (selectCategories.length === 0) {
      displayProducts(products);
      return;
    }

    const filteredProducts = products.filter((p) =>
      selectCategories.includes(p.category)
    );

    displayProducts(filteredProducts);
  });
});

clearbtn.addEventListener('click', () => {
  foodTypeSelection.value = '';
  foodTypeRadios.forEach((radio) => (radio.checked = false));
  categoryCheckboxes.forEach((cb) => (cb.checked = false));
  ratingInput.value = 0;
  ratingValue.textContent = 0;
  searchInput.value = '';

  displayProducts(products);
});
