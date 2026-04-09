// Iegūst groza datus no localStorage
function getCart() {
    try {
        // Nolasa "cart" un pārvērš to par JavaScript masīvu
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
        // Ja dati ir bojāti vai nav pareizā formātā, atgriež tukšu masīvu
        return [];
    }
}

// Saglabā groza datus localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Iegūst pašreizējo lietotāju no localStorage
function getCurrentUser() {
    try {
        // Nolasa "currentUser" un pārvērš to par objektu
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
        // Ja rodas kļūda, atgriež null
        return null;
    }
}

// Saglabā vai dzēš pašreizējo lietotāju
function setCurrentUser(user) {
    if (user) {
        // Ja lietotājs eksistē, saglabā to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        // Ja lietotāja nav, izdzēš ierakstu
        localStorage.removeItem('currentUser');
    }
}

// Atjaunina groza preču skaitu visos elementus ar klasi .cart-count
function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const cart = getCart();

    // Saskaita kopējo preču daudzumu grozā
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Ievieto šo skaitu visos attiecīgajos elementos
    countElements.forEach(element => {
        element.textContent = totalCount;
    });
}

// Pievieno produktu grozam
function addToCart(product) {
    const cart = getCart();

    // Meklē, vai šāds produkts no tā paša veikala jau ir grozā
    const existingItem = cart.find(
        item => item.title === product.title && item.store === product.store
    );

    if (existingItem) {
        // Ja produkts jau ir, palielina tā daudzumu par 1
        existingItem.quantity += 1;
    } else {
        // Ja produkta nav, pievieno jaunu objektu grozam
        cart.push({
            title: product.title,
            price: Number(product.price),
            store: product.store,
            quantity: 1
        });
    }

    // Saglabā atjaunināto grozu
    saveCart(cart);

    // Atjaunina groza skaitītāju
    updateCartCount();

    // Parāda paziņojumu lietotājam
    alert(`${product.title} added to cart`);
}

// Noņem produktu no groza pēc tā indeksa
function removeFromCart(index) {
    const cart = getCart();

    // Ja tāda produkta nav, funkcija beidzas
    if (!cart[index]) return;

    if (cart[index].quantity > 1) {
        // Ja daudzums ir lielāks par 1, samazina to par 1
        cart[index].quantity -= 1;
    } else {
        // Ja daudzums ir 1, izdzēš produktu pilnībā
        cart.splice(index, 1);
    }

    // Saglabā izmaiņas un atjaunina lapu
    saveCart(cart);
    renderCartPage();
    updateCartCount();
}

// Iztīra visu grozu
function clearCart() {
    localStorage.removeItem('cart');
    renderCartPage();
    updateCartCount();
}

// Pievieno "click" notikumu visām pogām, kas pievieno produktu grozam
function initAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Izveido produkta objektu no HTML data atribūtiem
            const product = {
                title: button.dataset.title || 'Unknown product',
                price: button.dataset.price || 0,
                store: button.dataset.store || 'Unknown store'
            };

            // Pievieno produktu grozam
            addToCart(product);
        });
    });
}

// Attēlo groza saturu lapā
function renderCartPage() {
    const cartItemsContainer = document.querySelector('#cart-items');
    const cartTotalElement = document.querySelector('#cart-total');
    const clearCartButton = document.querySelector('#clear-cart-button');

    // Ja nepieciešamie elementi nav atrasti, funkcija beidzas
    if (!cartItemsContainer || !cartTotalElement) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    // Ja grozs ir tukšs, parāda paziņojumu
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

    // Izveido HTML katram produktam grozā
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

    // Attēlo kopējo cenu
    cartTotalElement.textContent = `€${total.toFixed(2)}`;

    // Pievieno notikumu pogām "Remove"
    const removeButtons = document.querySelectorAll('.cart-remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.index);
            removeFromCart(index);
        });
    });

    // Pievieno notikumu groza notīrīšanas pogai
    if (clearCartButton) {
        clearCartButton.onclick = clearCart;
    }
}

// Inicializē galvenes izvēlnes animāciju, pārejot uz citu lapu
function initHeaderMenuAnimation() {
    const menuLinks = document.querySelectorAll('.header-menu-link');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const currentLink = document.querySelector('.header-menu-link.is-current');
            if (!currentLink) return;

            const targetHref = link.getAttribute('href');
            if (!targetHref || link === currentLink) return;

            // Aptur standarta pāreju, lai vispirms nospēlētu animāciju
            e.preventDefault();
            currentLink.classList.add('is-leaving');
            document.body.classList.add('is-leaving');

            // Pēc 300 ms notiek pāreja uz jauno lapu
            setTimeout(() => {
                window.location.href = targetHref;
            }, 300);
        });
    });
}

// Inicializē profila izvēlni
function initProfileMenu() {
    const button = document.querySelector('.header-acount-button');
    const menu = document.querySelector('.profile-menu');

    if (!button || !menu) return;

    // Atver vai aizver profila izvēlni, nospiežot pogu
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('is-open');
    });

    // Klikšķis ārpus izvēlnes to aizver
    document.addEventListener('click', () => {
        menu.classList.remove('is-open');
    });

    // Klikšķis izvēlnes iekšpusē neaizver izvēlni
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Atjaunina profila informāciju interfeisā
function updateProfileUI() {
    const currentUser = getCurrentUser();

    const profileName = document.querySelector('.profile-name');
    const registerButton = document.querySelector('.profile-register-button');
    const loginButton = document.querySelector('.profile-login-button');
    const logoutButton = document.querySelector('.profile-logout-button');

    // Parāda lietotājvārdu vai "Guest", ja lietotājs nav ielogojies
    if (profileName) {
        profileName.textContent = currentUser ? currentUser.username : 'Guest';
    }

    // Ja lietotājs ir ielogojies, paslēpj reģistrācijas pogu
    if (registerButton) {
        registerButton.style.display = currentUser ? 'none' : '';
    }

    // Ja lietotājs ir ielogojies, paslēpj pieteikšanās pogu
    if (loginButton) {
        loginButton.style.display = currentUser ? 'none' : '';
    }

    // Ja lietotājs ir ielogojies, parāda atteikšanās pogu
    if (logoutButton) {
        logoutButton.style.display = currentUser ? '' : 'none';
    }
}

// Inicializē atteikšanās pogu
function initLogoutButton() {
    const logoutButton = document.querySelector('.profile-logout-button');
    const profileMenu = document.querySelector('.profile-menu');

    if (!logoutButton) return;

    logoutButton.addEventListener('click', async () => {
        try {
            // Sūta pieprasījumu serverim, lai izrakstītu lietotāju
            await fetch('/api/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Dzēš lietotāju no localStorage
        setCurrentUser(null);

        // Aizver profila izvēlni
        if (profileMenu) {
            profileMenu.classList.remove('is-open');
        }

        // Atjaunina interfeisu
        updateProfileUI();
        alert('Logged out');
    });
}

// Inicializē reģistrācijas modālo logu
function initRegisterModal() {
    const modal = document.querySelector('#authModal');
    const openButton = document.querySelector('.profile-register-button');
    const closeButton = modal?.querySelector('.auth-modal-close');
    const registerForm = document.querySelector('#registerForm');
    const profileMenu = document.querySelector('.profile-menu');

    if (!modal || !openButton || !closeButton || !registerForm) return;

    // Atver reģistrācijas logu
    openButton.addEventListener('click', () => {
        modal.classList.add('is-open');
        if (profileMenu) {
            profileMenu.classList.remove('is-open');
        }
    });

    // Aizver logu ar aizvēršanas pogu
    closeButton.addEventListener('click', () => {
        modal.classList.remove('is-open');
    });

    // Aizver logu, klikšķinot uz fona
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });

    // Apstrādā reģistrācijas formas iesniegšanu
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Iegūst formas datus
        const formData = Object.fromEntries(new FormData(registerForm).entries());

        try {
            // Sūta reģistrācijas datus uz serveri
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // Ja reģistrācija neizdevās, parāda kļūdu
            if (!result.ok) {
                alert(result.message || 'Registration failed');
                return;
            }

            // Saglabā lietotāju, aizver logu un atjaunina interfeisu
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

// Inicializē pieteikšanās modālo logu
function initLoginModal() {
    const modal = document.querySelector('#loginModal');
    const openButton = document.querySelector('.profile-login-button');
    const closeButton = modal?.querySelector('.login-modal-close');
    const loginForm = document.querySelector('#loginForm');
    const profileMenu = document.querySelector('.profile-menu');

    if (!modal || !openButton || !closeButton || !loginForm) return;

    // Atver pieteikšanās logu
    openButton.addEventListener('click', () => {
        modal.classList.add('is-open');
        if (profileMenu) {
            profileMenu.classList.remove('is-open');
        }
    });

    // Aizver logu ar aizvēršanas pogu
    closeButton.addEventListener('click', () => {
        modal.classList.remove('is-open');
    });

    // Aizver logu, klikšķinot ārpus tā
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });

    // Apstrādā pieteikšanās formas iesniegšanu
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Iegūst ievadītos datus no formas
        const formData = Object.fromEntries(new FormData(loginForm).entries());

        try {
            // Sūta pieteikšanās pieprasījumu serverim
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // Ja pieteikšanās neizdevās, parāda kļūdu
            if (!result.ok) {
                alert(result.message || 'Login failed');
                return;
            }

            // Saglabā lietotāju, notīra formu un aizver logu
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

// Inicializē filtrus un meklēšanu sākumlapā
function initHomeFilters() {
    const filterContainer = document.querySelector('.search-filter');
    const filters = document.querySelectorAll('.search-filter-items');
    const items = document.querySelectorAll('.product-tabel-offer');
    const input = document.querySelector('.search-input');
    const container = document.querySelector('.product-tabel');
    const viewDealsButton = document.querySelector('.button--primary[href="#offers"]');

    // Funkcija, kas piemēro izvēlētos filtrus
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

            // Ja izvēlēti veikala filtri un veikals neatbilst, paslēpj produktu
            if (activeStoreFilters.length > 0 && !activeStoreFilters.includes(store)) {
                visible = false;
            }

            // Ja meklēšanas teksts neatbilst nosaukumam, paslēpj produktu
            if (searchValue && !title.includes(searchValue)) {
                visible = false;
            }

            item.style.display = visible ? 'flex' : 'none';
        });

        // Ja ir izvēlēts "CHEAPEST", sakārto produktus pēc cenas augošā secībā
        if (activeFilters.includes('CHEAPEST') && container) {
            const sortedItems = [...items].sort((a, b) => {
                return Number(a.dataset.price || 0) - Number(b.dataset.price || 0);
            });

            sortedItems.forEach(item => container.appendChild(item));
        }
    }

    // Filtru pogu klikšķi
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.search-filter-items');
            if (!target) return;

            target.classList.toggle('is-active');
            applyFilters();
        });
    }

    // Meklēšanas ievade
    if (input) {
        input.addEventListener('input', applyFilters);
    }

    // Gluda pāreja uz piedāvājumu sadaļu
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

// Inicializē veikala meklēšanu pēc produkta nosaukuma
function initStoreSearch() {
    const searchInput = document.querySelector('.store-search-field input');
    const productCards = document.querySelectorAll('.store-product-card');

    if (!searchInput || productCards.length === 0) return;

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim().toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('.store-product-title')?.textContent.toLowerCase() || '';
            const isVisible = title.includes(value);

            // Parāda vai paslēpj produktu atkarībā no meklēšanas rezultāta
            card.style.display = isVisible ? 'flex' : 'none';
        });
    });
}

// Pielieto saglabātos iestatījumus no localStorage
function applySavedSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};

    // Pievieno vai noņem attiecīgās klases dokumenta body elementam
    document.body.classList.toggle('dark-mode', !!savedSettings.darkMode);
    document.body.classList.toggle('large-text', !!savedSettings.largeText);
    document.body.classList.remove('accent-blue', 'accent-green');

    // Uzstāda akcenta krāsu
    if (savedSettings.accentColor === 'blue') {
        document.body.classList.add('accent-blue');
    }

    if (savedSettings.accentColor === 'green') {
        document.body.classList.add('accent-green');
    }

    const darkModeToggle = document.querySelector('#darkModeToggle');
    const largeTextToggle = document.querySelector('#largeTextToggle');
    const accentColorSelect = document.querySelector('#accentColorSelect');

    // Atjauno iestatījumu vērtības formā
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

// Inicializē iestatījumu modālo logu
function initSettingsModal() {
    const modal = document.querySelector('#settingsModal');
    const openButton = document.querySelector('.profile-settings-button');
    const closeButton = document.querySelector('.settings-modal-close');
    const form = document.querySelector('#settingsForm');
    const profileMenu = document.querySelector('.profile-menu');

    if (!modal || !openButton || !closeButton || !form) return;

    // Atver iestatījumu logu
    openButton.addEventListener('click', () => {
        modal.classList.add('is-open');
        if (profileMenu) {
            profileMenu.classList.remove('is-open');
        }
    });

    // Aizver logu ar pogu
    closeButton.addEventListener('click', () => {
        modal.classList.remove('is-open');
    });

    // Aizver logu, klikšķinot uz fona
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });

    // Saglabā iestatījumus pēc formas iesniegšanas
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

// Atjauno lietotāja sesiju no servera
async function restoreUserSession() {
    try {
        // Pieprasa informāciju par pašreizējo lietotāju
        const response = await fetch('/api/me');
        const result = await response.json();

        if (result.ok && result.user) {
            // Ja sesija ir aktīva, saglabā lietotāju
            setCurrentUser(result.user);
        } else {
            // Ja sesijas nav, dzēš lietotāju
            setCurrentUser(null);
        }
    } catch (error) {
        console.error('Restore session error:', error);
    }

    // Atjaunina profila interfeisu
    updateProfileUI();
}

// Palaiž visas inicializācijas funkcijas pēc HTML ielādes
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