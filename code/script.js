let currentUser = null;

// ---------- USERS CSV ----------
async function loadUsers() {
    const response = await fetch('../csv2/users.csv');
    const text = await response.text();

    return text
        .trim()
        .split('\n')
        .slice(1)
        .map(row => {
            const [username, email, password] = row.split(',');
            return { username, email, password };
        });
}

// ---------- CART ----------
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const cart = getCart();

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    countElements.forEach(element => {
        element.textContent = totalCount;
    });
}

function addToCart(product) {
    const cart = getCart();

    const existingItem = cart.find(
        item => item.title === product.title && item.store === product.store
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            title: product.title,
            price: Number(product.price),
            store: product.store,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    alert(`${product.title} added to cart`);
}

function removeFromCart(index) {
    const cart = getCart();

    if (!cart[index]) return;

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCartPage();
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem('cart');
    renderCartPage();
    updateCartCount();
}

function initAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                title: button.dataset.title || 'Unknown product',
                price: button.dataset.price || 0,
                store: button.dataset.store || 'Unknown store'
            };

            addToCart(product);
        });
    });
}

function renderCartPage() {
    const cartItemsContainer = document.querySelector('#cart-items');
    const cartTotalElement = document.querySelector('#cart-total');
    const clearCartButton = document.querySelector('#clear-cart-button');

    if (!cartItemsContainer || !cartTotalElement) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty.</p>
            </div>
        `;
        cartTotalElement.textContent = '€0.00';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = Number(item.price) * item.quantity;
        total += itemTotal;

        const article = document.createElement('article');
        article.className = 'cart-item';

        article.innerHTML = `
            <div class="cart-item-info">
                <p class="cart-item-store">${item.store}</p>
                <h2 class="cart-item-title">${item.title}</h2>
                <p class="cart-item-price">€${Number(item.price).toFixed(2)} × ${item.quantity}</p>
            </div>

            <div class="cart-item-actions">
                <p class="cart-item-total">€${itemTotal.toFixed(2)}</p>
                <button type="button" class="button button--secondary cart-remove-button" data-index="${index}">
                    Remove
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(article);
    });

    cartTotalElement.textContent = `€${total.toFixed(2)}`;

    const removeButtons = document.querySelectorAll('.cart-remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.index);
            removeFromCart(index);
        });
    });

    if (clearCartButton) {
        clearCartButton.onclick = clearCart;
    }
}

// ---------- USER / SESSION ----------
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    currentUser = user || null;

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

async function restoreUserSession() {
    try {
        const response = await fetch('/api/me');
        const result = await response.json();

        if (result.ok && result.user) {
            setCurrentUser(result.user);
        } else {
            setCurrentUser(getCurrentUser());
        }
    } catch (error) {
        console.error('Restore session error:', error);
        setCurrentUser(getCurrentUser());
    }

    updateProfileUI();
}

// ---------- UI ----------
function updateProfileUI() {
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');

    const registerButton = document.querySelector('.profile-register-button');
    const loginButton = document.querySelector('.profile-login-button');
    const logoutButton = document.querySelector('.profile-logout-button');
    const profileButton = document.querySelector('.profile-view-button');

    const profileUsername = document.querySelector('#profileUsername');
    const profileUserEmail = document.querySelector('#profileUserEmail');
    const profileStatus = document.querySelector('#profileStatus');
    const profileAvatar = document.querySelector('.profile-avatar');
    const profileAvatarLarge = document.querySelector('#profileAvatarLarge');
    const profileCartCount = document.querySelector('#profileCartCount');

    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const username = currentUser?.username || 'Guest';
    const email = currentUser?.email || 'Not logged in';
    const firstLetter = username.charAt(0).toUpperCase();

    if (profileName) {
        profileName.textContent = username;
    }

    if (profileEmail) {
        profileEmail.textContent = email;
    }

    if (profileUsername) {
        profileUsername.textContent = username;
    }

    if (profileUserEmail) {
        profileUserEmail.textContent = email;
    }

    if (profileStatus) {
        profileStatus.textContent = currentUser ? 'Logged in' : 'Guest account';
    }

    if (profileAvatar) {
        profileAvatar.textContent = firstLetter;
    }

    if (profileAvatarLarge) {
        profileAvatarLarge.textContent = firstLetter;
    }

    if (profileCartCount) {
        profileCartCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
    }

    if (registerButton) {
        registerButton.style.display = currentUser ? 'none' : 'block';
    }

    if (loginButton) {
        loginButton.style.display = currentUser ? 'none' : 'block';
    }

    if (logoutButton) {
        logoutButton.style.display = currentUser ? 'block' : 'none';
    }

    if (profileButton) {
        profileButton.style.display = currentUser ? 'block' : 'none';
    }
}
function initProfileModal() {
    const modal = document.querySelector('#profileModal');
    const openButton = document.querySelector('.profile-view-button');
    const closeButton = document.querySelector('.profile-modal-close');
    const settingsButton = document.querySelector('.profile-modal-settings-button');
    const settingsModal = document.querySelector('#settingsModal');
    const profileMenu = document.querySelector('.profile-menu');

    if (!modal || !openButton || !closeButton) return;

    openButton.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please login first');
            return;
        }

        updateProfileUI();
        modal.classList.add('is-open');

        if (profileMenu) {
            profileMenu.classList.remove('is-open');
        }
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('is-open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });

    if (settingsButton && settingsModal) {
        settingsButton.addEventListener('click', () => {
            modal.classList.remove('is-open');
            settingsModal.classList.add('is-open');
        });
    }
}
// ---------- MODALS ----------
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('is-open');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('is-open');
    }
}

// ---------- LOGIN ----------
async function login(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.ok && result.user) {
            setCurrentUser(result.user);
            updateProfileUI();
            form.reset();
            closeModal('loginModal');
            alert(result.message || `Welcome back, ${result.user.username}`);
            return;
        }
    } catch (error) {
        console.error('Server login error:', error);
    }

    try {
        const users = await loadUsers();

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            alert('Wrong email or password');
            return;
        }

        setCurrentUser(user);
        updateProfileUI();
        form.reset();
        closeModal('loginModal');
    } catch (error) {
        console.error('CSV login error:', error);
        alert('Login failed');
    }
}

// ---------- REGISTER ----------
async function register(e) {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const repeat = form.repeatPassword.value;

    if (password !== repeat) {
        alert('Passwords do not match');
        return;
    }

    const userData = { username, email, password };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.ok && result.user) {
            setCurrentUser(result.user);
            updateProfileUI();
            form.reset();
            closeModal('authModal');
            alert(result.message || 'Registration successful');
            return;
        }

        if (!result.ok) {
            alert(result.message || 'Registration failed');
            return;
        }
    } catch (error) {
        console.error('Server register error:', error);
    }

    setCurrentUser(userData);
    updateProfileUI();
    form.reset();
    closeModal('authModal');
    alert('Registered locally');
}

// ---------- LOGOUT ----------
async function logout() {
    try {
        await fetch('/api/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    setCurrentUser(null);
    updateProfileUI();

    const profileMenu = document.querySelector('.profile-menu');
    if (profileMenu) {
        profileMenu.classList.remove('is-open');
    }

    alert('Logged out');
}

// ---------- PROFILE MENU ----------
function initProfileMenu() {
    const button = document.querySelector('.header-acount-button');
    const menu = document.querySelector('.profile-menu');

    if (!button || !menu) return;

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('is-open');
    });

    document.addEventListener('click', () => {
        menu.classList.remove('is-open');
    });

    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ---------- EVENTS ----------
function initEvents() {
    const profileMenu = document.querySelector('.profile-menu');

    document.querySelector('#loginForm')?.addEventListener('submit', login);
    document.querySelector('#registerForm')?.addEventListener('submit', register);

    document.querySelector('.profile-login-button')
        ?.addEventListener('click', () => {
            openModal('loginModal');
            profileMenu?.classList.remove('is-open');
        });

    document.querySelector('.profile-register-button')
        ?.addEventListener('click', () => {
            openModal('authModal');
            profileMenu?.classList.remove('is-open');
        });

    document.querySelector('.profile-logout-button')
        ?.addEventListener('click', logout);

    document.querySelectorAll('.auth-modal-close, .login-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal('authModal');
            closeModal('loginModal');
        });
    });

    document.querySelector('#authModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'authModal') {
            closeModal('authModal');
        }
    });

    document.querySelector('#loginModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'loginModal') {
            closeModal('loginModal');
        }
    });

    document.querySelector('#openRegisterFromLogin')?.addEventListener('click', () => {
        closeModal('loginModal');
        openModal('authModal');
    });

    document.querySelector('#openLoginFromRegister')?.addEventListener('click', () => {
        closeModal('authModal');
        openModal('loginModal');
    });
}

// ---------- HEADER MENU ANIMATION ----------
function initHeaderMenuAnimation() {
    const menuLinks = document.querySelectorAll('.header-menu-link');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const currentLink = document.querySelector('.header-menu-link.is-current');
            if (!currentLink) return;

            const targetHref = link.getAttribute('href');
            if (!targetHref || link === currentLink) return;

            e.preventDefault();
            currentLink.classList.add('is-leaving');
            document.body.classList.add('is-leaving');

            setTimeout(() => {
                window.location.href = targetHref;
            }, 300);
        });
    });
}

// ---------- HOME FILTERS ----------
function initHomeFilters() {
    const filterContainer = document.querySelector('.search-filter');
    const filters = document.querySelectorAll('.search-filter-items');
    const items = document.querySelectorAll('.product-tabel-offer');
    const input = document.querySelector('.search-input');
    const container = document.querySelector('.product-tabel');
    const viewDealsButton = document.querySelector('.button--primary[href="#offers"]');

    function applyFilters() {
        const activeFilters = [...filters]
            .filter(filter => filter.classList.contains('is-active'))
            .map(filter => filter.textContent.trim().toUpperCase());

        const searchValue = input ? input.value.trim().toLowerCase() : '';

        items.forEach(item => {
            const store = (item.dataset.store || '').trim().toUpperCase();
            const titleElement = item.querySelector('.product-offer-card-title');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';

            let visible = true;
            const activeStoreFilters = activeFilters.filter(filter => filter !== 'CHEAPEST');

            if (activeStoreFilters.length > 0 && !activeStoreFilters.includes(store)) {
                visible = false;
            }

            if (searchValue && !title.includes(searchValue)) {
                visible = false;
            }

            item.style.display = visible ? 'flex' : 'none';
        });

        if (activeFilters.includes('CHEAPEST') && container) {
            const sortedItems = [...items].sort((a, b) => {
                return Number(a.dataset.price || 0) - Number(b.dataset.price || 0);
            });

            sortedItems.forEach(item => container.appendChild(item));
        }
    }

    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.search-filter-items');
            if (!target) return;

            target.classList.toggle('is-active');
            applyFilters();
        });
    }

    if (input) {
        input.addEventListener('input', applyFilters);
    }

    if (viewDealsButton) {
        viewDealsButton.addEventListener('click', (e) => {
            e.preventDefault();

            const offersSection = document.querySelector('#offers');
            if (offersSection) {
                offersSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ---------- STORE SEARCH ----------
function initStoreSearch() {
    const searchInput = document.querySelector('.store-search-field input');
    const productCards = document.querySelectorAll('.store-product-card');

    if (!searchInput || productCards.length === 0) return;

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim().toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('.store-product-title')?.textContent.toLowerCase() || '';
            const isVisible = title.includes(value);

            card.style.display = isVisible ? 'flex' : 'none';
        });
    });
}

// ---------- SETTINGS ----------
function applySavedSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};

    document.body.classList.toggle('dark-mode', !!savedSettings.darkMode);
    document.body.classList.toggle('large-text', !!savedSettings.largeText);
    document.body.classList.remove('accent-blue', 'accent-green');

    if (savedSettings.accentColor === 'blue') {
        document.body.classList.add('accent-blue');
    }

    if (savedSettings.accentColor === 'green') {
        document.body.classList.add('accent-green');
    }

    const darkModeToggle = document.querySelector('#darkModeToggle');
    const largeTextToggle = document.querySelector('#largeTextToggle');
    const accentColorSelect = document.querySelector('#accentColorSelect');

    if (darkModeToggle) {
        darkModeToggle.checked = !!savedSettings.darkMode;
    }

    if (largeTextToggle) {
        largeTextToggle.checked = !!savedSettings.largeText;
    }

    if (accentColorSelect) {
        accentColorSelect.value = savedSettings.accentColor || 'orange';
    }
}

function initSettingsModal() {
    const modal = document.querySelector('#settingsModal');
    const openButton = document.querySelector('.profile-settings-button');
    const closeButton = document.querySelector('.settings-modal-close');
    const form = document.querySelector('#settingsForm');
    const profileMenu = document.querySelector('.profile-menu');

    if (!modal || !openButton || !closeButton || !form) return;

    openButton.addEventListener('click', () => {
        modal.classList.add('is-open');
        if (profileMenu) {
            profileMenu.classList.remove('is-open');
        }
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('is-open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const settings = {
            darkMode: document.querySelector('#darkModeToggle')?.checked || false,
            largeText: document.querySelector('#largeTextToggle')?.checked || false,
            accentColor: document.querySelector('#accentColorSelect')?.value || 'orange'
        };

        localStorage.setItem('settings', JSON.stringify(settings));
        applySavedSettings();
        modal.classList.remove('is-open');
    });
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', async () => {
    setCurrentUser(getCurrentUser());

    initHeaderMenuAnimation();
    initProfileMenu();
    initEvents();
    initProfileModal();
    initSettingsModal();
    initHomeFilters();
    initStoreSearch();
    initAddToCartButtons();
    renderCartPage();
    updateCartCount();
    applySavedSettings();
    updateProfileUI();

    await restoreUserSession();
});