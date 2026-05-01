const API = 'http://localhost:3000/api';
let currentUser = null;
let favorites = new Set();

// INIT
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
    await loadBrands();
    await loadPhones();
});

// LOAD USERS
async function loadUsers() {
    const res = await fetch(`${API}/users`);
    const users = await res.json();
    const select = document.getElementById('userSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select user...</option>';
    users.forEach(u => {
        select.innerHTML += `<option value="${u.user_id}">${u.name}</option>`;
    });
    select.addEventListener('change', async () => {
        currentUser = select.value || null;
        localStorage.setItem('currentUser', currentUser);
        if (currentUser) await loadFavorites();
        else favorites.clear();
        renderFavButtons();
    });
}

// LOAD FAVORITES
async function loadFavorites() {
    if (!currentUser) return;
    const res = await fetch(`${API}/favorites/${currentUser}`);
    const data = await res.json();
    favorites = new Set(data.map(f => f.phone_id));
}

// LOAD BRANDS
async function loadBrands() {
    const sel = document.getElementById('brandFilter');
    if (!sel) return;
    const res = await fetch(`${API}/brands`);
    const brands = await res.json();
    brands.forEach(b => {
        sel.innerHTML += `<option value="${b.brand_name}">${b.brand_name}</option>`;
    });
}

// LOAD PHONES
async function loadPhones(params = {}) {
    const grid = document.getElementById('phonesGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading">Loading smartphones...</div>';

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API}/smartphones?${query}`);
    const phones = await res.json();

    document.getElementById('resultsCount').textContent = `${phones.length} smartphones found`;

    if (phones.length === 0) {
        grid.innerHTML = '<div class="loading">No smartphones found.</div>';
        return;
    }

    grid.innerHTML = phones.map(p => `
        <div class="phone-card" onclick="goToDetail(${p.phone_id})">
            <div class="phone-brand">${p.brand_name}</div>
            <div class="phone-name">${p.model_name}</div>
            <div class="phone-specs">
                <span class="spec-tag">📱 ${p.ram_gb}GB RAM</span>
                <span class="spec-tag">💾 ${p.storage_gb}GB</span>
                ${p.color ? `<span class="spec-tag">🎨 ${p.color}</span>` : ''}
                ${p.unlocked ? `<span class="spec-tag">🔓 Unlocked</span>` : ''}
            </div>
            <div class="phone-footer">
                <div class="phone-price">$${parseFloat(p.price).toFixed(2)}</div>
                <button class="fav-btn ${favorites.has(p.phone_id) ? 'active' : ''}" 
                    onclick="toggleFav(event, ${p.phone_id})" 
                    title="Add to favorites">♥</button>
            </div>
        </div>
    `).join('');
}

// APPLY FILTERS
function applyFilters() {
    const params = {};
    const search = document.getElementById('search')?.value;
    const brand = document.getElementById('brandFilter')?.value;
    const ram = document.getElementById('ramFilter')?.value;
    const storage = document.getElementById('storageFilter')?.value;
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;

    if (search) params.search = search;
    if (brand) params.brand = brand;
    if (ram) params.ram = ram;
    if (storage) params.storage = storage;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    loadPhones(params);
}

// RESET FILTERS
function resetFilters() {
    document.getElementById('search').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('ramFilter').value = '';
    document.getElementById('storageFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    loadPhones();
}

// TOGGLE FAVORITE
async function toggleFav(e, phoneId) {
    e.stopPropagation();
    if (!currentUser) { showToast('Please select a user first!'); return; }

    if (favorites.has(phoneId)) {
        await fetch(`${API}/favorites`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: currentUser, phone_id: phoneId })
        });
        favorites.delete(phoneId);
        showToast('Removed from favorites');
    } else {
        await fetch(`${API}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: currentUser, phone_id: phoneId })
        });
        favorites.add(phoneId);
        showToast('Added to favorites ♥');
    }
    renderFavButtons();
}

// RENDER FAV BUTTONS
function renderFavButtons() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const phoneId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        btn.classList.toggle('active', favorites.has(phoneId));
    });
}

// GO TO DETAIL
function goToDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// TOAST
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ENTER KEY ON SEARCH
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') applyFilters();
});