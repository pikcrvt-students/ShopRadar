let currentUser = null;

// ---------- LOAD CSV ----------
async function loadUsers() {
    const response = await fetch('csv/users.csv');
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

// ---------- SESSION ----------
function setCurrentUser(user) {
    currentUser = user;
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
}

function restoreUserSession() {
    const user = JSON.parse(localStorage.getItem('user'));
    currentUser = user || null;
    updateProfileUI();
}

// ---------- UI ----------
function updateProfileUI() {
    const name = document.querySelector('.profile-name');
    const login = document.querySelector('.profile-login-button');
    const register = document.querySelector('.profile-register-button');
    const logout = document.querySelector('.profile-logout-button');

    if (!name) return;

    if (currentUser) {
        name.textContent = currentUser.username;
        login.style.display = 'none';
        register.style.display = 'none';
        logout.style.display = 'block';
    } else {
        name.textContent = 'Guest';
        login.style.display = 'block';
        register.style.display = 'block';
        logout.style.display = 'none';
    }
}

// ---------- LOGIN ----------
async function login(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

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
    closeModal('loginModal');
}

// ---------- REGISTER (local only) ----------
function register(e) {
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

    const user = { username, email, password };

    setCurrentUser(user);
    updateProfileUI();
    closeModal('authModal');
}

// ---------- LOGOUT ----------
function logout() {
    setCurrentUser(null);
    updateProfileUI();
}

// ---------- MODALS ----------
function openModal(id) {
    document.getElementById(id).classList.add('is-open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('is-open');
}

// ---------- PROFILE MENU ----------
function initProfileMenu() {
    const btn = document.querySelector('.header-acount-button');
    const menu = document.querySelector('.profile-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('is-open');
    });

    document.addEventListener('click', () => {
        menu.classList.remove('is-open');
    });
}

// ---------- EVENTS ----------
function initEvents() {
    document.querySelector('#loginForm')?.addEventListener('submit', login);
    document.querySelector('#registerForm')?.addEventListener('submit', register);

    document.querySelector('.profile-login-button')
        ?.addEventListener('click', () => openModal('loginModal'));

    document.querySelector('.profile-register-button')
        ?.addEventListener('click', () => openModal('authModal'));

    document.querySelector('.profile-logout-button')
        ?.addEventListener('click', logout);

    document.querySelectorAll('.auth-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal('authModal');
            closeModal('loginModal');
        });
    });
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    restoreUserSession();
    initProfileMenu();
    initEvents();
});