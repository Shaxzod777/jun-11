/* =========================================================
   SHOP.CO — Category page logic
   ========================================================= */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------
     1. CATALOGUE
     --------------------------------------------------------- */
  var IMG = './img/';

  /* the nine products shown in the design, in order */
  var FEATURED = [
    { name: 'Gradient Graphic T-shirt', img: 'tshirt-gradient.svg', price: 145, old: null, rating: 3.5, type: 'T-shirts', colors: ['white', 'pink', 'cyan'] },
    { name: 'Polo with Tipping Details', img: 'polo-pink.svg',      price: 180, old: null, rating: 4.5, type: 'T-shirts', colors: ['pink', 'red'] },
    { name: 'Black Striped T-shirt',    img: 'tshirt-striped.svg',  price: 120, old: 150, off: 30,  rating: 5.0, type: 'T-shirts', colors: ['black', 'white'] },
    { name: 'Skinny Fit Jeans',         img: 'jeans-blue.svg',      price: 240, old: 260, off: 20,  rating: 3.5, type: 'Jeans',    colors: ['blue'] },
    { name: 'Checkered Shirt',          img: 'shirt-checkered.svg', price: 180, old: null, rating: 4.5, type: 'Shirts',   colors: ['red', 'black'] },
    { name: 'Sleeve Striped T-shirt',   img: 'tshirt-sleeve.svg',   price: 130, old: 160, off: 30,  rating: 4.5, type: 'T-shirts', colors: ['orange', 'black'] },
    { name: 'Vertical Striped Shirt',   img: 'shirt-vertical.svg',  price: 212, old: 232, off: 20,  rating: 5.0, type: 'Shirts',   colors: ['green'] },
    { name: 'Courage Graphic T-shirt',  img: 'tshirt-courage.svg',  price: 145, old: null, rating: 4.0, type: 'T-shirts', colors: ['orange'] },
    { name: 'Loose Fit Bermuda Shorts', img: 'shorts-denim.svg',    price: 80,  old: null, rating: 3.0, type: 'Shorts',   colors: ['blue'] }
  ];

  /* artwork pool used to fill the rest of the catalogue */
  var ART = [
    { img: 'tshirt-gradient.svg', type: 'T-shirts', colors: ['white', 'pink', 'cyan'] },
    { img: 'polo-pink.svg',       type: 'T-shirts', colors: ['pink', 'red'] },
    { img: 'tshirt-striped.svg',  type: 'T-shirts', colors: ['black', 'white'] },
    { img: 'tshirt-navy.svg',     type: 'T-shirts', colors: ['blue', 'black'] },
    { img: 'tshirt-olive.svg',    type: 'T-shirts', colors: ['green'] },
    { img: 'tshirt-cream.svg',    type: 'T-shirts', colors: ['white', 'yellow'] },
    { img: 'tshirt-courage.svg',  type: 'T-shirts', colors: ['orange'] },
    { img: 'tshirt-sleeve.svg',   type: 'T-shirts', colors: ['orange', 'black'] },
    { img: 'shirt-checkered.svg', type: 'Shirts',   colors: ['red', 'black'] },
    { img: 'shirt-vertical.svg',  type: 'Shirts',   colors: ['green'] },
    { img: 'shirt-blue.svg',      type: 'Shirts',   colors: ['blue'] },
    { img: 'jeans-blue.svg',      type: 'Jeans',    colors: ['blue'] },
    { img: 'jeans-black.svg',     type: 'Jeans',    colors: ['black'] },
    { img: 'shorts-denim.svg',    type: 'Shorts',   colors: ['blue'] },
    { img: 'shorts-khaki.svg',    type: 'Shorts',   colors: ['yellow', 'orange'] },
    { img: 'hoodie-grey.svg',     type: 'Hoodie',   colors: ['black', 'blue'] },
    { img: 'hoodie-maroon.svg',   type: 'Hoodie',   colors: ['red', 'pink'] }
  ];

  var PREFIX = {
    'T-shirts': ['Relaxed', 'Oversized', 'Classic', 'Essential', 'Everyday', 'Heavyweight', 'Boxy', 'Vintage Wash', 'Soft Cotton', 'Slim Fit'],
    'Shirts':   ['Linen', 'Poplin', 'Corduroy', 'Flannel', 'Oxford', 'Relaxed', 'Camp Collar', 'Washed'],
    'Jeans':    ['Straight Leg', 'Tapered', 'Loose Fit', 'Regular', 'Stone Washed', 'Raw Denim'],
    'Shorts':   ['Cargo', 'Chino', 'Pleated', 'Drawstring', 'Sport', 'Denim'],
    'Hoodie':   ['Boxy', 'Heavyweight', 'Zip-up', 'Cropped', 'Fleece']
  };
  var NOUN = {
    'T-shirts': ['T-shirt', 'Tee', 'Graphic T-shirt', 'Polo Shirt'],
    'Shirts':   ['Shirt', 'Overshirt', 'Button-up Shirt'],
    'Jeans':    ['Jeans', 'Denim Trousers'],
    'Shorts':   ['Shorts', 'Bermuda Shorts'],
    'Hoodie':   ['Hoodie', 'Pullover Hoodie']
  };

  var SIZES = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];
  var STYLES = ['Casual', 'Formal', 'Party', 'Gym'];

  /* deterministic pseudo-random so the catalogue is stable between reloads */
  var seed = 20230611;
  function rnd() {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }

  function sizesFor(i) {
    var start = i % 3;                       // 0,1,2
    var end = SIZES.length - (i % 2);        // most items carry the big sizes too
    var list = SIZES.slice(start, end);
    return list.length ? list : SIZES.slice(0, 5);
  }

  var PRODUCTS = [];
  var id = 0;

  /* — the 90 "Casual" items: the nine from the design first — */
  FEATURED.forEach(function (p, i) {
    PRODUCTS.push({
      id: ++id, name: p.name, img: p.img, price: p.price, old: p.old,
      off: p.off || null, rating: p.rating, type: p.type, colors: p.colors, style: 'Casual',
      sizes: sizesFor(i), popularity: 1000 - i, added: 1000 - i
    });
  });

  function makeProduct(style, i) {
    var art = ART[i % ART.length];
    var name = pick(PREFIX[art.type]) + ' ' + pick(NOUN[art.type]);
    var price = 40 + Math.round(rnd() * 46) * 5;             // 40 – 270
    var discounted = rnd() < 0.35;
    var old = discounted ? price + Math.round(rnd() * 8 + 2) * 10 : null;
    return {
      id: ++id, name: name, img: art.img, price: price, old: old,
      rating: Math.round((2.5 + rnd() * 2.5) * 2) / 2,
      type: art.type, colors: art.colors.slice(), style: style,
      sizes: sizesFor(i), popularity: Math.round(rnd() * 900), added: Math.round(rnd() * 900)
    };
  }

  var k;
  for (k = FEATURED.length; k < 90; k++) PRODUCTS.push(makeProduct('Casual', k));
  for (k = 0; k < 30; k++) PRODUCTS.push(makeProduct(STYLES[1 + (k % 3)], k + 7));

  /* ---------------------------------------------------------
     2. STATE
     --------------------------------------------------------- */
  var PER_PAGE = 9;

  var applied = {           // what the grid is actually filtered by
    style: 'Casual',
    types: [],
    colors: [],
    sizes: [],
    min: 0,
    max: 500
  };
  var pending = {           // what the sidebar currently shows
    style: 'Casual',
    types: [],
    colors: ['blue'],
    sizes: ['Large'],
    min: 50,
    max: 200
  };
  var sort = 'popular';
  var page = 1;
  var query = '';

  var favs = readStore('shopco_favs', []);

  function readStore(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  /* ---------------------------------------------------------
     3. RENDERING
     --------------------------------------------------------- */
  var grid = $('#grid');
  var pager = $('#pager');
  var emptyMsg = $('#empty');
  var countEl = $('#resultsCount');
  var titleEl = $('#categoryTitle');

  function stars(rating) {
    var pct = Math.max(0, Math.min(1, rating / 5)) * 100;
    return '<span class="stars" role="img" aria-label="' + rating + ' out of 5 stars">' +
             '<span class="stars__bg"></span>' +
             '<span class="stars__fg" style="width:' + pct + '%"><i></i></span>' +
           '</span>';
  }

  function discount(p) {
    if (p.off) return p.off;                       // label taken from the design
    return p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  }

  function cardHTML(p) {
    var off = discount(p);
    var isFav = favs.indexOf(p.id) !== -1;
    return '' +
    '<article class="card" data-id="' + p.id + '">' +
      '<div class="card__media">' +
        '<img src="' + IMG + p.img + '" alt="' + p.name + '" loading="lazy" width="300" height="360">' +
        '<button class="card__fav' + (isFav ? ' is-active' : '') + '" type="button" ' +
                'aria-label="Add ' + p.name + ' to wishlist" aria-pressed="' + isFav + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
            '<path d="M12 20s-7-4.4-7-9.2A4 4 0 0112 8.6 4 4 0 0119 10.8C19 15.6 12 20 12 20z" ' +
                  'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<h3 class="card__name"><a href="#product-' + p.id + '">' + p.name + '</a></h3>' +
      '<div class="rating">' + stars(p.rating) +
        '<span class="rating__value"><b>' + p.rating.toFixed(1) + '</b>/5</span>' +
      '</div>' +
      '<p class="price">' +
        '<span class="price__now">$' + p.price + '</span>' +
        (p.old ? '<span class="price__old">$' + p.old + '</span>' : '') +
        (off ? '<span class="price__off">-' + off + '%</span>' : '') +
      '</p>' +
    '</article>';
  }

  function matches(p) {
    if (applied.style && p.style !== applied.style) return false;
    if (applied.types.length && applied.types.indexOf(p.type) === -1) return false;
    if (p.price < applied.min || p.price > applied.max) return false;
    if (applied.colors.length && !applied.colors.some(function (c) {
      return p.colors.indexOf(c) !== -1;
    })) return false;
    if (applied.sizes.length && !applied.sizes.some(function (s) {
      return p.sizes.indexOf(s) !== -1;
    })) return false;
    if (query && p.name.toLowerCase().indexOf(query) === -1) return false;
    return true;
  }

  var SORTERS = {
    popular: function (a, b) { return b.popularity - a.popularity; },
    new:     function (a, b) { return b.added - a.added; },
    low:     function (a, b) { return a.price - b.price; },
    high:    function (a, b) { return b.price - a.price; },
    rating:  function (a, b) { return b.rating - a.rating || b.popularity - a.popularity; }
  };

  function render() {
    var list = PRODUCTS.filter(matches).sort(SORTERS[sort] || SORTERS.popular);
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page > pages) page = pages;

    var start = (page - 1) * PER_PAGE;
    var slice = list.slice(start, start + PER_PAGE);

    grid.innerHTML = slice.map(cardHTML).join('');
    emptyMsg.hidden = slice.length > 0;
    grid.hidden = slice.length === 0;

    countEl.textContent = list.length
      ? 'Showing ' + (start + 1) + '-' + (start + slice.length) + ' of ' + list.length + ' Products'
      : 'No products found';

    titleEl.textContent = applied.style || 'All Products';
    document.title = (applied.style || 'Shop') + ' — SHOP.CO';

    renderPager(pages);
    syncURL();
  }

  function pageNumbers(total, current) {
    var out = [], i;
    if (total <= 7) {
      for (i = 1; i <= total; i++) out.push(i);
      return out;
    }
    if (current <= 3) {
      out = [1, 2, 3, '…', total - 2, total - 1, total];
    } else if (current >= total - 2) {
      out = [1, 2, 3, '…', total - 2, total - 1, total];
    } else {
      out = [1, '…', current - 1, current, current + 1, '…', total];
    }
    return out;
  }

  function renderPager(pages) {
    if (pages <= 1) { pager.innerHTML = ''; return; }
    var arrowL = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var arrowR = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var html = '<button class="pager__nav pager__nav--prev" type="button" data-page="' + (page - 1) + '"' +
               (page === 1 ? ' disabled' : '') + '>' + arrowL + 'Previous</button>' +
               '<div class="pager__pages">';

    pageNumbers(pages, page).forEach(function (n) {
      html += n === '…'
        ? '<span class="pager__dots">…</span>'
        : '<button class="pager__page' + (n === page ? ' is-active' : '') + '" type="button" ' +
          'data-page="' + n + '"' + (n === page ? ' aria-current="page"' : '') + '>' + n + '</button>';
    });

    html += '</div><button class="pager__nav pager__nav--next" type="button" data-page="' + (page + 1) + '"' +
            (page === pages ? ' disabled' : '') + '>Next' + arrowR + '</button>';
    pager.innerHTML = html;
  }

  function syncURL() {
    if (!window.history || !history.replaceState) return;
    var params = [];
    if (applied.style) params.push('style=' + encodeURIComponent(applied.style));
    if (sort !== 'popular') params.push('sort=' + sort);
    if (page > 1) params.push('page=' + page);
    history.replaceState(null, '', location.pathname + (params.length ? '?' + params.join('&') : ''));
  }

  function readURL() {
    var params = new URLSearchParams(location.search);
    if (params.get('style') && STYLES.indexOf(params.get('style')) !== -1) {
      applied.style = pending.style = params.get('style');
      $$('#styleList button').forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.style === applied.style);
      });
    }
    if (params.get('sort') && SORTERS[params.get('sort')]) {
      sort = params.get('sort');
      $$('#sortSelect li').forEach(function (li) {
        var on = li.dataset.sort === sort;
        li.classList.toggle('is-selected', on);
        if (on) $('#sortValue').textContent = li.textContent;
      });
    }
    var p = parseInt(params.get('page'), 10);
    if (p > 0) page = p;
  }

  function goTop() {
    var top = $('.results').getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* ---------------------------------------------------------
     4. GRID EVENTS
     --------------------------------------------------------- */
  grid.addEventListener('click', function (e) {
    var fav = e.target.closest('.card__fav');
    if (!fav) return;
    var pid = parseInt(fav.closest('.card').dataset.id, 10);
    var at = favs.indexOf(pid);
    if (at === -1) favs.push(pid); else favs.splice(at, 1);
    fav.classList.toggle('is-active', at === -1);
    fav.setAttribute('aria-pressed', String(at === -1));
    writeStore('shopco_favs', favs);
  });

  pager.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-page]');
    if (!btn || btn.disabled) return;
    page = parseInt(btn.dataset.page, 10);
    render();
    goTop();
  });

  /* ---------------------------------------------------------
     5. FILTER SIDEBAR
     --------------------------------------------------------- */
  /* accordions */
  $$('[data-acc] .acc__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var acc = head.closest('[data-acc]');
      var open = acc.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
    });
  });

  /* category list */
  $$('#catList button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.dataset.cat;
      var at = pending.types.indexOf(type);
      if (at === -1) pending.types.push(type); else pending.types.splice(at, 1);
      btn.classList.toggle('is-active', at === -1);
    });
  });

  /* dress style — single choice */
  $$('#styleList button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var style = btn.dataset.style;
      pending.style = pending.style === style ? '' : style;
      $$('#styleList button').forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.style === pending.style);
      });
    });
  });

  /* colors */
  $$('#swatches .swatch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      var color = sw.dataset.color;
      var at = pending.colors.indexOf(color);
      if (at === -1) pending.colors.push(color); else pending.colors.splice(at, 1);
      sw.classList.toggle('is-active', at === -1);
      sw.setAttribute('aria-pressed', String(at === -1));
    });
  });

  /* sizes */
  $$('#sizes .pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      var size = pill.textContent.trim();
      var at = pending.sizes.indexOf(size);
      if (at === -1) pending.sizes.push(size); else pending.sizes.splice(at, 1);
      pill.classList.toggle('is-active', at === -1);
    });
  });

  /* dual price slider */
  var minInput = $('#priceMin');
  var maxInput = $('#priceMax');
  var fill = $('#rangeFill');
  var minLabel = $('#priceMinLabel');
  var maxLabel = $('#priceMaxLabel');
  var GAP = 10;

  function updateRange(source) {
    var lo = parseInt(minInput.value, 10);
    var hi = parseInt(maxInput.value, 10);
    if (hi - lo < GAP) {
      if (source === 'min') { lo = hi - GAP; minInput.value = lo; }
      else { hi = lo + GAP; maxInput.value = hi; }
    }
    var span = parseInt(minInput.max, 10) - parseInt(minInput.min, 10);
    fill.style.left = ((lo / span) * 100) + '%';
    fill.style.right = (100 - (hi / span) * 100) + '%';
    minLabel.textContent = '$' + lo;
    maxLabel.textContent = '$' + hi;
    pending.min = lo;
    pending.max = hi;
  }
  minInput.addEventListener('input', function () { updateRange('min'); });
  maxInput.addEventListener('input', function () { updateRange('max'); });
  updateRange();

  /* apply */
  $('#applyFilter').addEventListener('click', function () {
    applied = {
      style: pending.style,
      types: pending.types.slice(),
      colors: pending.colors.slice(),
      sizes: pending.sizes.slice(),
      min: pending.min,
      max: pending.max
    };
    page = 1;
    render();
    closeFilters();
    goTop();
  });

  /* ---------------------------------------------------------
     6. SORT DROPDOWN
     --------------------------------------------------------- */
  var select = $('#sortSelect');
  var selectBtn = $('.select__btn', select);

  selectBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = select.classList.toggle('is-open');
    selectBtn.setAttribute('aria-expanded', String(open));
  });

  $$('#sortSelect li').forEach(function (li) {
    li.addEventListener('click', function () {
      sort = li.dataset.sort;
      $('#sortValue').textContent = li.textContent;
      $$('#sortSelect li').forEach(function (o) { o.classList.remove('is-selected'); });
      li.classList.add('is-selected');
      select.classList.remove('is-open');
      selectBtn.setAttribute('aria-expanded', 'false');
      page = 1;
      render();
    });
  });

  /* ---------------------------------------------------------
     7. HEADER: menu, search, drawers
     --------------------------------------------------------- */
  var overlay = $('#overlay');
  var nav = $('#nav');
  var burger = $('#burger');
  var filters = $('#filters');

  function lock(on) { document.body.classList.toggle('is-locked', on); }

  function showOverlay() {
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('is-visible'); });
  }
  function hideOverlay() {
    overlay.classList.remove('is-visible');
    setTimeout(function () { overlay.hidden = true; }, 250);
  }

  function openNav() {
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    showOverlay(); lock(true);
  }
  function closeNav() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    if (!filters.classList.contains('is-open')) { hideOverlay(); lock(false); }
  }
  function openFilters() {
    filters.classList.add('is-open');
    showOverlay(); lock(true);
  }
  function closeFilters() {
    if (!filters.classList.contains('is-open')) return;
    filters.classList.remove('is-open');
    if (!nav.classList.contains('is-open')) { hideOverlay(); lock(false); }
  }

  burger.addEventListener('click', function () {
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });
  $('#filtersOpen').addEventListener('click', openFilters);
  $('#filtersClose').addEventListener('click', closeFilters);
  overlay.addEventListener('click', function () { closeNav(); closeFilters(); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeNav(); closeFilters();
    select.classList.remove('is-open');
    $$('.has-drop').forEach(function (d) { d.classList.remove('is-open'); });
  });

  /* shop dropdown */
  $$('.has-drop > .nav__link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = link.parentElement;
      var open = item.classList.toggle('is-open');
      link.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', function () {
    select.classList.remove('is-open');
    selectBtn.setAttribute('aria-expanded', 'false');
    $$('.has-drop').forEach(function (d) {
      d.classList.remove('is-open');
      $('.nav__link', d).setAttribute('aria-expanded', 'false');
    });
  });
  nav.addEventListener('click', function (e) { e.stopPropagation(); });
  select.addEventListener('click', function (e) { e.stopPropagation(); });

  /* mobile search toggle */
  var mobileSearch = $('#mobileSearch');
  $('#searchToggle').addEventListener('click', function () {
    var open = mobileSearch.classList.toggle('is-open');
    if (open) $('input', mobileSearch).focus();
  });

  /* live search (desktop + mobile inputs) */
  var timer;
  $$('.search input').forEach(function (input) {
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        query = input.value.trim().toLowerCase();
        $$('.search input').forEach(function (other) {
          if (other !== input) other.value = input.value;
        });
        page = 1;
        render();
      }, 220);
    });
  });

  /* promo banner */
  var promo = $('#promo');
  if (readStore('shopco_promo_closed', false)) promo.classList.add('is-hidden');
  $('#promoClose').addEventListener('click', function () {
    promo.classList.add('is-hidden');
    writeStore('shopco_promo_closed', true);
  });

  /* cart badge */
  var cartCount = readStore('shopco_cart', []).length;
  if (cartCount) {
    $('#cartCount').textContent = cartCount > 99 ? '99+' : cartCount;
    $('.cart-btn').classList.add('has-items');
  }

  /* newsletter */
  $('#newsletterForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#newsletterEmail');
    var msg = $('#newsletterMsg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    msg.classList.toggle('is-error', !ok);
    msg.textContent = ok ? 'Thanks! You are subscribed.' : 'Please enter a valid email address.';
    if (ok) email.value = '';
  });

  /* ---------------------------------------------------------
     8. GO
     --------------------------------------------------------- */
  readURL();
  render();
})();
