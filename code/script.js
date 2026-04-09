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

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
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

function updateProfileUI() {
    const currentUser = getCurrentUser();

    const profileName = document.querySelector('.profile-name');
    const registerButton = document.querySelector('.profile-register-button');
    const loginButton = document.querySelector('.profile-login-button');
    const logoutButton = document.querySelector('.profile-logout-button');

    if (profileName) {
        profileName.textContent = currentUser ? currentUser.username : 'Guest';
    }

    if (registerButton) {
        registerButton.style.display = currentUser ? 'none' : '';
    }

    if (loginButton) {
        loginButton.style.display = currentUser ? 'none' : '';
    }

    if (logoutButton) {
        logoutButton.style.display = currentUser ? '' : 'none';
    }
}

function initLogoutButton() {
    const logoutButton = document.querySelector('.profile-logout-button');
    const profileMenu = document.querySelector('.profile-menu');

    if (!logoutButton) return;

    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        setCurrentUser(null);

        if (profileMenu) {
            profileMenu.classList.remove('is-open');
        }

        updateProfileUI();
        alert('Logged out');
    });
}

function initRegisterModal() {
    const modal = document.querySelector('#authModal');
    const openButton = document.querySelector('.profile-register-button');
    const closeButton = modal?.querySelector('.auth-modal-close');
    const registerForm = document.querySelector('#registerForm');
    const profileMenu = document.querySelector('.profile-menu');

    if (!modal || !openButton || !closeButton || !registerForm) return;

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

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(registerForm).entries());

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!result.ok) {
                alert(result.message || 'Registration failed');
                return;
            }

            setCurrentUser(result.user);
            registerForm.reset();
            modal.classList.remove('is-open');
            updateProfileUI();
            alert(result.message || 'Registration successful');
        } catch (error) {
            console.error('Register error:', error);
            alert('Server error');
        }
    });
}

function initLoginModal() {
    const modal = document.querySelector('#loginModal');
    const openButton = document.querySelector('.profile-login-button');
    const closeButton = modal?.querySelector('.login-modal-close');
    const loginForm = document.querySelector('#loginForm');
    const profileMenu = document.querySelector('.profile-menu');

    if (!modal || !openButton || !closeButton || !loginForm) return;

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

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(loginForm).entries());

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!result.ok) {
                alert(result.message || 'Login failed');
                return;
            }

            setCurrentUser(result.user);
            loginForm.reset();
            modal.classList.remove('is-open');
            updateProfileUI();
            alert(result.message || `Welcome back, ${result.user.username}`);
        } catch (error) {
            console.error('Login error:', error);
            alert('Server error');
        }
    });
}

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

async function restoreUserSession() {
    try {
        const response = await fetch('/api/me');
        const result = await response.json();

        if (result.ok && result.user) {
            setCurrentUser(result.user);
        } else {
            setCurrentUser(null);
        }
    } catch (error) {
        console.error('Restore session error:', error);
    }

    updateProfileUI();
}

document.addEventListener('DOMContentLoaded', () => {
    initHeaderMenuAnimation();
    initProfileMenu();
    initRegisterModal();
    initLoginModal();
    initLogoutButton();
    initSettingsModal();
    initHomeFilters();
    initStoreSearch();
    initAddToCartButtons();
    renderCartPage();
    updateCartCount();
    applySavedSettings();
    restoreUserSession();
});