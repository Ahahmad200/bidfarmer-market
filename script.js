// ===== VIEW ELEMENTS =====
const homeView     = document.getElementById('home-view');
const registerView = document.getElementById('register-view');
const browseView   = document.getElementById('browse-view');
const addView      = document.getElementById('add-view');

// ===== NAVIGATION BUTTONS =====
const btnRegister   = document.getElementById('btn-register');
const btnBrowse     = document.getElementById('btn-browse');
const btnAddListing = document.getElementById('btn-add-listing');
const btnBackReg    = document.getElementById('btn-back-register');
const btnBackBrowse = document.getElementById('btn-back-browse');
const btnBackAdd    = document.getElementById('btn-back-add');

// ===== FORMS =====
const farmerForm   = document.getElementById('farmer-form');
const registerMsg  = document.getElementById('register-message');
const listingForm  = document.getElementById('listing-form');
const listingMsg   = document.getElementById('listing-message');

// ===== FILTERS & LISTING GRID =====
const searchText   = document.getElementById('search-text');
const filterType   = document.getElementById('filter-type');
const filterLoc    = document.getElementById('filter-location');
const filterMax    = document.getElementById('filter-max-price');
const listingGrid  = document.getElementById('listing-grid');
const noResults    = document.getElementById('no-results');

// ===== STORAGE KEY =====
const STORAGE_KEY = 'birdmarket_listings';

// ===== SAMPLE LISTINGS (first time only) =====
const sampleListings = [
  {
    id: 1,
    title: 'Racing Pigeons',
    type: 'Pigeons',
    quantity: 15,
    price: 3500,
    location: 'Kano',
    farmer: 'Musa A.',
    phone: '+2348000000001',
    photo: ''
  },
  {
    id: 2,
    title: 'Broilers (6 weeks)',
    type: 'Broilers',
    quantity: 40,
    price: 4200,
    location: 'Ibadan',
    farmer: 'Chioma O.',
    phone: '+2348000000002',
    photo: ''
  },
  {
    id: 3,
    title: 'Exotic Fowl Pair',
    type: 'Exotic Fowls',
    quantity: 4,
    price: 12000,
    location: 'Lagos',
    farmer: 'Tunde B.',
    phone: '+2348000000003',
    photo: ''
  }
];

// ===== LOAD / SAVE =====
function loadListings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleListings));
    return sampleListings;
  }
  return JSON.parse(stored);
}

function saveListings(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ===== VIEW SWITCHER =====
function showView(viewToShow) {
  [homeView, registerView, browseView, addView].forEach(v => v.classList.add('hidden'));
  viewToShow.classList.remove('hidden');
  window.scrollTo(0, 0);
}

// ===== NAV =====
btnRegister.addEventListener('click', () => showView(registerView));
btnBrowse.addEventListener('click',   () => { showView(browseView); renderListings(); });
btnAddListing.addEventListener('click', () => showView(addView));
btnBackReg.addEventListener('click',  () => showView(homeView));
btnBackBrowse.addEventListener('click',() => showView(homeView));
btnBackAdd.addEventListener('click',  () => showView(browseView));

// ===== FARMER REGISTRATION =====
farmerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name     = document.getElementById('farmer-name').value.trim();
  const phone    = document.getElementById('farmer-phone').value.trim();
  const location = document.getElementById('farmer-location').value.trim();

  if (!name || !phone || !location) {
    registerMsg.textContent = '⚠️ Please fill in all fields.';
    registerMsg.style.color = '#c62828';
    return;
  }

  registerMsg.textContent = `✅ Thanks ${name}! You're registered. Now add your first listing.`;
  registerMsg.style.color = '#2e7d32';
  farmerForm.reset();

  setTimeout(() => showView(addView), 1200);
});

// ===== ADD LISTING =====
listingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newListing = {
    id: Date.now(),
    title:    document.getElementById('list-title').value.trim(),
    type:     document.getElementById('list-type').value,
    quantity: Number(document.getElementById('list-quantity').value),
    price:    Number(document.getElementById('list-price').value),
    location: document.getElementById('list-location').value.trim(),
    farmer:   document.getElementById('list-farmer').value.trim(),
    phone:    document.getElementById('list-phone').value.trim(),
    photo:    document.getElementById('list-photo').value.trim()
  };

  if (!newListing.title || !newListing.location || !newListing.farmer) {
    listingMsg.textContent = '⚠️ Please fill in all required fields.';
    listingMsg.style.color = '#c62828';
    return;
  }

  const listings = loadListings();
  listings.unshift(newListing);
  saveListings(listings);

  listingMsg.textContent = '✅ Listing posted! Redirecting to browse...';
  listingMsg.style.color = '#2e7d32';
  listingForm.reset();

  setTimeout(() => {
    showView(browseView);
    renderListings();
  }, 1000);
});

// ===== RENDER LISTINGS =====
function renderListings() {
  const listings = loadListings();

  const text  = searchText.value.toLowerCase().trim();
  const type  = filterType.value;
  const loc   = filterLoc.value.toLowerCase().trim();
  const maxP  = filterMax.value ? Number(filterMax.value) : Infinity;

  const filtered = listings.filter(l => {
    const matchesText = !text || l.title.toLowerCase().includes(text);
    const matchesType = !type || l.type === type;
    const matchesLoc  = !loc  || l.location.toLowerCase().includes(loc);
    const matchesPrice= l.price <= maxP;
    return matchesText && matchesType && matchesLoc && matchesPrice;
  });

  listingGrid.innerHTML = '';

  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  filtered.forEach(l => {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML = `
      ${l.photo ? `<img src="${l.photo}" alt="${l.title}" onerror="this.style.display='none'">` : ''}
      <h4>${l.title}</h4>
      <p><strong>Type:</strong> ${l.type}</p>
      <p><strong>Quantity:</strong> ${l.quantity}</p>
      <p><strong>Price:</strong> ₦${l.price.toLocaleString()} each</p>
      <p><strong>Location:</strong> ${l.location}</p>
      <p><strong>Farmer:</strong> ${l.farmer}</p>
      <button data-phone="${l.phone}" data-title="${l.title}">Contact Farmer</button>
    `;
    listingGrid.appendChild(card);
  });

  // Attach contact handlers
  listingGrid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const phone = btn.dataset.phone;
      const title = btn.dataset.title;
      alert(`Contact farmer about "${title}"\n\nPhone: ${phone}`);
    });
  });
}

// ===== LIVE FILTERING =====
[searchText, filterType, filterLoc, filterMax].forEach(el => {
  el.addEventListener('input', renderListings);
});

// ===== INITIAL LOAD =====
loadListings();
