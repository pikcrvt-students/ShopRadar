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

document.addEventListener('DOMContentLoaded', () => {
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
            e.preventDefault();

            const offersSection = document.querySelector('#offers');
            if (offersSection) {
                offersSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    initHeaderMenuAnimation();
    initProfileMenu();
    initRegisterModal();
});