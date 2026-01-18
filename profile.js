// Check authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// Get user's pronunciation history
function getUserHistory(userId) {
    const allHistory = JSON.parse(localStorage.getItem('pronunciationHistory') || '{}');
    return allHistory[userId] || [];
}

// Save user's pronunciation history
function saveUserHistory(userId, history) {
    const allHistory = JSON.parse(localStorage.getItem('pronunciationHistory') || '{}');
    allHistory[userId] = history;
    localStorage.setItem('pronunciationHistory', JSON.stringify(allHistory));
}

// Calculate statistics
function calculateStats(history) {
    const correct = history.filter(h => h.correct).length;
    const incorrect = history.filter(h => !h.correct).length;
    const total = history.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, incorrect, total, accuracy };
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

// Render history item
function renderHistoryItem(item) {
    const resultIcon = item.correct ? '✓' : '✗';
    const resultClass = item.correct ? 'correct' : 'incorrect';

    return `
        <div class="history-item ${resultClass}">
            <div class="history-content">
                <div class="word-info">
                    <span class="target-word-badge">${item.targetWord}</span>
                    <span class="result-badge">${resultIcon}</span>
                </div>
                <div class="heard-word">You said: "${item.heardWord}"</div>
                <div class="timestamp">${formatDate(item.timestamp)}</div>
            </div>
        </div>
    `;
}

// Render history list
function renderHistory(filter = 'all') {
    const user = checkAuth();
    if (!user) return;

    const history = getUserHistory(user.id);
    const historyList = document.getElementById('historyList');
    const emptyState = document.getElementById('emptyState');

    let filteredHistory = history;
    if (filter === 'correct') {
        filteredHistory = history.filter(h => h.correct);
    } else if (filter === 'incorrect') {
        filteredHistory = history.filter(h => !h.correct);
    }

    if (filteredHistory.length === 0) {
        historyList.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        historyList.innerHTML = filteredHistory
            .reverse()
            .map(renderHistoryItem)
            .join('');
    }
}

// Initialize profile page
function initProfile() {
    const user = checkAuth();
    if (!user) return;

    // Set user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    if (user.picture) {
        document.getElementById('userAvatar').src = user.picture;
    } else {
        document.getElementById('userAvatar').src = 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=667eea&color=fff&size=100`;
    }

    // Set join date
    const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('joinDate').textContent = joinDate;

    // Calculate and display statistics
    const history = getUserHistory(user.id);
    const stats = calculateStats(history);

    document.getElementById('correctCount').textContent = stats.correct;
    document.getElementById('incorrectCount').textContent = stats.incorrect;
    document.getElementById('accuracyRate').textContent = stats.accuracy + '%';
    document.getElementById('totalAttempts').textContent = stats.total;

    // Render history
    renderHistory();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initProfile();

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    });

    // Clear history
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            const user = checkAuth();
            if (user) {
                saveUserHistory(user.id, []);
                initProfile();
            }
        }
    });

    // Filter tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderHistory(btn.dataset.filter);
        });
    });
});
