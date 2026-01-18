// Check if user is already logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
    return user;
}

// Initialize auth state
let isSignUp = false;

// DOM Elements
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authDescription = document.getElementById('authDescription');
const nameGroup = document.getElementById('nameGroup');
const submitBtn = document.getElementById('submitBtn');
const switchLink = document.getElementById('switchLink');
const switchText = document.getElementById('switchText');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const googleBtnText = document.getElementById('googleBtnText');

// Toggle between Sign In and Sign Up
switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;

    if (isSignUp) {
        authTitle.textContent = 'Create Account';
        authDescription.textContent = 'Start your German learning journey today';
        nameGroup.style.display = 'block';
        submitBtn.textContent = 'Sign Up';
        switchText.textContent = 'Already have an account?';
        switchLink.textContent = 'Sign In';
        googleBtnText.textContent = 'Sign up with Google';
    } else {
        authTitle.textContent = 'Welcome Back';
        authDescription.textContent = 'Sign in to continue your learning journey';
        nameGroup.style.display = 'none';
        submitBtn.textContent = 'Sign In';
        switchText.textContent = "Don't have an account?";
        switchLink.textContent = 'Sign Up';
        googleBtnText.textContent = 'Continue with Google';
    }
});

// Handle form submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    removeMessages();

    if (isSignUp) {
        handleSignUp(email, password, name);
    } else {
        handleSignIn(email, password);
    }
});

// Handle Sign Up
function handleSignUp(email, password, name) {
    if (!name.trim()) {
        showError('Please enter your name');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find(u => u.email === email);

    if (userExists) {
        showError('An account with this email already exists');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        email: email,
        name: name,
        password: password,
        provider: 'email',
        createdAt: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    const userSession = { ...newUser };
    delete userSession.password;
    localStorage.setItem('user', JSON.stringify(userSession));

    showSuccess('Account created successfully! Redirecting...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Handle Sign In
function handleSignIn(email, password) {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        showError('Invalid email or password');
        return;
    }

    const userSession = { ...user };
    delete userSession.password;
    localStorage.setItem('user', JSON.stringify(userSession));

    showSuccess('Sign in successful! Redirecting...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Google Sign In (Simulated)
googleAuthBtn.addEventListener('click', () => {
    simulateGoogleAuth();
});

function simulateGoogleAuth() {
    const mockGoogleUser = {
        id: 'google_' + Date.now().toString(),
        email: 'user@gmail.com',
        name: 'Google User',
        provider: 'google',
        picture: 'https://ui-avatars.com/api/?name=Google+User&background=667eea&color=fff',
        createdAt: new Date().toISOString()
    };

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let user = existingUsers.find(u => u.email === mockGoogleUser.email);

    if (!user) {
        existingUsers.push(mockGoogleUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        user = mockGoogleUser;
    }

    localStorage.setItem('user', JSON.stringify(user));

    showSuccess('Signed in with Google! Redirecting...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Helper functions
function showError(message) {
    removeMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    authForm.insertBefore(errorDiv, authForm.firstChild);
}

function showSuccess(message) {
    removeMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    authForm.insertBefore(successDiv, authForm.firstChild);
}

function removeMessages() {
    const messages = authForm.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}

checkAuth();
