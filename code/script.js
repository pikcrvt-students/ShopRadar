function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
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
    const existingItem = cart.find(item => item.title === product.title && item.store === product.store);

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
                title: button.dataset.title,
                price: button.dataset.price,
                store: button.dataset.store
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
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const article = document.createElement('article');
        article.className = 'cart-item';

        article.innerHTML = `
            <div class="cart-item-info">
                <p class="cart-item-store">${item.store}</p>
                <h2 class="cart-item-title">${item.title}</h2>
                <p class="cart-item-price">€${item.price.toFixed(2)} × ${item.quantity}</p>
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

            if (link === currentLink) return;

            e.preventDefault();
            currentLink.classList.add('is-leaving');

            setTimeout(() => {
                window.location.href = targetHref;
            }, 350);
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

function initRegisterModal() {
    const modal = document.querySelector('#authModal');
    const openButton = document.querySelector('.profile-register-button');
    const closeButton = document.querySelector('.auth-modal-close');
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

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const username = formData.get('username').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const repeatPassword = formData.get('repeatPassword');

        if (password !== repeatPassword) {
            alert('Passwords do not match');
            return;
        }

        alert(`Registered: ${username} (${email})`);
        registerForm.reset();
        modal.classList.remove('is-open');
    });
}

function initHomeFilters() {
    const filterContainer = document.querySelector('.search-filter');
    const filters = document.querySelectorAll('.search-filter-items');
    const items = document.querySelectorAll('.product-tabel-offer');
    const input = document.querySelector('.search-input');
    const container = document.querySelector('.product-tabel');
    const viewDealsButton = document.querySelector('.button--primary');

    function applyFilters() {
        const activeFilters = [...filters]
            .filter(filter => filter.classList.contains('is-active'))
            .map(filter => filter.textContent.trim());

        const searchValue = input ? input.value.trim().toLowerCase() : '';

        items.forEach(item => {
            const store = item.dataset.store;
            const titleElement = item.querySelector('.product-offer-card-title');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';

            let visible = true;

            const activeStoreFilters = activeFilters.filter(filter => filter !== 'CHEAPEST');

            if (activeStoreFilters.length > 0 && !activeStoreFilters.includes(store)) {
                visible = false;
            }

            if (!title.includes(searchValue)) {
                visible = false;
            }

            item.style.display = visible ? 'block' : 'none';
        });

        if (activeFilters.includes('CHEAPEST') && container) {
            const sortedItems = [...items].sort((a, b) => {
                return Number(a.dataset.price) - Number(b.dataset.price);
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
            if (viewDealsButton.getAttribute('href') === '#offers') {
                e.preventDefault();

                const offersSection = document.querySelector('#offers');
                if (offersSection) {
                    offersSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
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

    if (accentColorSelect && savedSettings.accentColor) {
        accentColorSelect.value = savedSettings.accentColor;
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
document.addEventListener('DOMContentLoaded', () => {
    initHeaderMenuAnimation();
    initProfileMenu();
    initRegisterModal();
    initSettingsModal();
    initHomeFilters();
    initStoreSearch();
    initAddToCartButtons();
    renderCartPage();
    updateCartCount();
    applySavedSettings();
});