// ===================== DATA =====================
const productImages = [
  'assets/product-1.jpg',
  'assets/product-2.jpg',
  'assets/product-3.jpg'
];

const reviews = [
  { name: 'Samantha D.', rating: 5, verified: true, date: 'August 14, 2023',
    text: 'This t-shirt exceeded my expectations. The fabric is soft and the fit is exactly as described.' },
  { name: 'Alex M.', rating: 4, verified: true, date: 'August 15, 2023',
    text: "Great quality shirt, though it runs slightly larger than expected. Still a solid buy." },
  { name: 'Ethan R.', rating: 5, verified: true, date: 'August 16, 2023',
    text: "Comfortable, well made, and the print hasn't faded after several washes." },
  { name: 'Olivia P.', rating: 4, verified: true, date: 'August 17, 2023',
    text: 'Nice design and color. Shipping took a bit longer than expected but worth the wait.' },
  { name: 'Liam K.', rating: 5, verified: true, date: 'August 18, 2023',
    text: 'Perfect everyday t-shirt. Ordering another one in a different color.' },
  { name: 'Ava N.', rating: 4, verified: true, date: 'August 19, 2023',
    text: 'Good value for the price. The graphic print looks even better in person.' }
];

const relatedProducts = [
  { name: 'Polo with Contrast Trims', price: 212, oldPrice: 242, rating: 4, img: 'assets/related-1.jpg' },
  { name: 'Gradient Graphic T-shirt', price: 145, oldPrice: null, rating: 3.5, img: 'assets/related-2.jpg' },
  { name: 'Polo with Tipping Details', price: 180, oldPrice: null, rating: 4.5, img: 'assets/related-3.jpg' },
  { name: 'Black Striped T-shirt', price: 120, oldPrice: 160, rating: 5, img: 'assets/related-4.jpg' }
];

// ===================== HELPERS =====================
function starString(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '★'.repeat(full);
  if (half) s += '☆';
  s += '☆'.repeat(5 - full - (half ? 1 : 0));
  return s;
}

// ===================== GALLERY =====================
const mainImage = document.getElementById('mainProductImage');
document.querySelectorAll('.thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    const idx = Number(thumb.dataset.img);
    mainImage.src = productImages[idx];
  });
});

// ===================== COLOR / SIZE SELECTION =====================
document.querySelectorAll('.color-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    swatch.classList.add('selected');
  });
});

document.querySelectorAll('.size-pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.size-pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
  });
});

// ===================== QUANTITY =====================
const qtyValue = document.getElementById('qtyValue');
let quantity = 1;

document.getElementById('qtyMinus').addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    qtyValue.textContent = quantity;
  }
});

document.getElementById('qtyPlus').addEventListener('click', () => {
  quantity++;
  qtyValue.textContent = quantity;
});

// ===================== ADD TO CART =====================
const addToCartBtn = document.getElementById('addToCartBtn');
addToCartBtn.addEventListener('click', () => {
  const originalText = addToCartBtn.textContent;
  addToCartBtn.textContent = 'Added ✓';
  addToCartBtn.classList.add('added');
  setTimeout(() => {
    addToCartBtn.textContent = originalText;
    addToCartBtn.classList.remove('added');
  }, 1500);
});

// ===================== TABS =====================
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = {
  details: document.getElementById('panel-details'),
  reviews: document.getElementById('panel-reviews'),
  faq: document.getElementById('panel-faq')
};

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(panels).forEach(p => p.hidden = true);
    panels[btn.dataset.tab].hidden = false;
  });
});

// ===================== RENDER REVIEWS =====================
const reviewsGrid = document.getElementById('reviewsGrid');
let visibleReviews = 4;

function renderReviews() {
  reviewsGrid.innerHTML = '';
  reviews.slice(0, visibleReviews).forEach((r) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <span class="review-menu">⋯</span>
      <span class="stars">${starString(r.rating)}</span>
      <div class="reviewer">${r.name} ${r.verified ? '<span class="verified">✔</span>' : ''}</div>
      <p class="review-text">"${r.text}"</p>
      <span class="review-date">Posted on ${r.date}</span>
    `;
    reviewsGrid.appendChild(card);
  });

  document.getElementById('loadMoreBtn').style.display =
    visibleReviews >= reviews.length ? 'none' : 'inline-block';
}

document.getElementById('loadMoreBtn').addEventListener('click', () => {
  visibleReviews += 4;
  renderReviews();
});

document.getElementById('sortReviews').addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === 'Latest') reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (val === 'Oldest') reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (val === 'Highest Rated') reviews.sort((a, b) => b.rating - a.rating);
  renderReviews();
});

renderReviews();

// ===================== RENDER RELATED PRODUCTS =====================
const relatedGrid = document.getElementById('relatedGrid');

relatedProducts.forEach((p) => {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="thumb-img"><img src="${p.img}" alt="${p.name}"></div>
    <h3>${p.name}</h3>
    <span class="stars">${starString(p.rating)}</span>
    <div class="price-row">
      <span>$${p.price}</span>
      ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ''}
      ${p.oldPrice ? `<span class="price-badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
    </div>
  `;
  relatedGrid.appendChild(card);
});

// ===================== NEWSLETTER =====================
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  alert(`Thanks! We'll send offers to ${input.value}`);
  input.value = '';
});