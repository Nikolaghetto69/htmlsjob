document.addEventListener('DOMContentLoaded', function() {
    
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const displayUsername = document.getElementById('displayUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const errorMsg = document.getElementById('errorMsg');

    const requiredElements = {
        authSection, userSection, loginForm, usernameInput, 
        passwordInput, displayUsername, logoutBtn, errorMsg
    };
    
    for (const [name, el] of Object.entries(requiredElements)) {
        if (!el) {
            console.error(`❌ Элемент #${name} не найден!`);
            return;
        }
    }

    function checkAuth() {
        const storedUser = localStorage.getItem('currentUser');
        storedUser ? showUserArea(storedUser) : showLoginForm();
    }

    function showLoginForm() {
        authSection.classList.remove('hidden');
        userSection.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        hideError();
    }

    function showUserArea(username) {
        authSection.classList.add('hidden');
        userSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        displayUsername.textContent = username;
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        errorMsg.classList.remove('shake');
        void errorMsg.offsetWidth;
        errorMsg.classList.add('shake');
    }

    function hideError() {
        errorMsg.textContent = '';
        errorMsg.classList.add('hidden');
        errorMsg.classList.remove('shake');
    }

    function getAllUsers() {
        const users = localStorage.getItem('allUsers');
        return users ? JSON.parse(users) : {};
    }

    function saveAllUsers(users) {
        localStorage.setItem('allUsers', JSON.stringify(users));
    }

    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(36);
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        hideError();

        // Проверка 1: Пустые поля
        if (!username || !password) {
            showError('Заполните все поля!');
            return;
        }

        // Проверка 2: Пароль минимум 8 символов
        if (password.length < 8) {
            showError('Пароль должен состоять минимум из 8 символов.');
            return;
        }

        const allUsers = getAllUsers();

        // Проверка 3: Существует ли пользователь
        if (allUsers[username]) {
            // ✅ Пользователь существует - проверяем пароль
            if (allUsers[username].password === simpleHash(password)) {
                // ✅ Успешный вход
                localStorage.setItem('currentUser', username);
                usernameInput.value = '';
                passwordInput.value = '';
                showUserArea(username);
                alert(`Добро пожаловать, ${username}!`);
            } else {
                // ❌ Имя занято + неверный пароль
                showError('Данное имя пользователя уже занято.');
            }
        } else {
            // ✅ Пользователя нет - регистрируем нового
            allUsers[username] = { password: simpleHash(password) };
            saveAllUsers(allUsers);
            localStorage.setItem('currentUser', username);
            usernameInput.value = '';
            passwordInput.value = '';
            showUserArea(username);
            alert(`Добро пожаловать, ${username}! Вы зарегистрированы.`);
        }
    });

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        showLoginForm();
    });

    // 🔍 Функция для просмотра всех пользователей (ДЛЯ ТЕСТОВ!)
    window.showAllUsers = function() {
        const allUsers = getAllUsers();
        console.log('📋 Зарегистрированные пользователи:', allUsers);
        console.table(allUsers);
        const userList = Object.keys(allUsers).join(', ');
        alert(`Зарегистрированные пользователи:\n${userList || 'Нет пользователей'}`);
    };

    checkAuth();
});