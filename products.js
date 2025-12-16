// products.js — vanilla JS: fetch products and render list
const PRODUCTS_LIST_EL = document.getElementById('products-list');

async function fetchProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    PRODUCTS_LIST_EL.innerText = 'Ошибка загрузки товаров.';
    console.error(err);
  }
}

function renderProducts(items){
  PRODUCTS_LIST_EL.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}">
      <div class="product-title">${escapeHtml(item.title)}</div>
      <div class="product-price">$${item.price.toFixed(2)}</div>
      <div style="margin-top:auto;">
        <button class="btn btn-primary" data-id="${item.id}">Add to cart</button>
      </div>
    `;

    const btn = card.querySelector('button');
    btn.addEventListener('click', () => {
      // dispatch a custom event that React cart listens to
      const e = new CustomEvent('cart-add', { detail: item });
      window.dispatchEvent(e);
    });

    PRODUCTS_LIST_EL.appendChild(card);
  });
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

fetchProducts();
