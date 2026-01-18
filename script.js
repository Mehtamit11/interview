const words = [
    'Hallo', 'Danke', 'Bitte', 'Guten Morgen', 'Auf Wiedersehen',
    'Entschuldigung', 'Wasser', 'Brot', 'Schule', 'Haus',
    'Straße', 'Bahnhof', 'Flughafen', 'Restaurant', 'Krankenhaus',
    'Apotheke', 'Supermarkt', 'Guten Tag', 'Gute Nacht', 'Tschüss'
];

let currentWord = words[0];
let recognition;
let isListening = false;
let currentUser = null;

const micBtn = document.getElementById('micBtn');
const targetWordEl = document.getElementById('targetWord');
const resultEl = document.getElementById('result');
const statusEl = document.getElementById('status');
const newWordBtn = document.getElementById('newWordBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');

// Check authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// Save pronunciation attempt to history
function savePronunciationAttempt(targetWord, heardWord, isCorrect) {
    if (!currentUser) return;

    const attempt = {
        targetWord: targetWord,
        heardWord: heardWord,
        correct: isCorrect,
        timestamp: new Date().toISOString()
    };

    // Get all history
    const allHistory = JSON.parse(localStorage.getItem('pronunciationHistory') || '{}');
    
    // Get user's history
    if (!allHistory[currentUser.id]) {
        allHistory[currentUser.id] = [];
    }
    
    // Add new attempt
    allHistory[currentUser.id].push(attempt);
    
    // Save back to localStorage
    localStorage.setItem('pronunciationHistory', JSON.stringify(allHistory));
}

// Initialize user profile
function initUserProfile() {
    currentUser = checkAuth();
    if (!currentUser) return;

    userName.textContent = currentUser.name;
    
    if (currentUser.picture) {
        userAvatar.src = currentUser.picture;
    } else {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=667eea&color=fff`;
    }
}

// Logout functionality
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
});

// Initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        resultEl.innerHTML = '<div class="error">Speech recognition not supported in this browser. Please use Chrome or Edge.</div>';
        micBtn.disabled = true;
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        statusEl.textContent = 'Listening... Speak now!';
        resultEl.textContent = '';
        resultEl.className = 'result';
    };

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        const confidence = e.results[0][0].confidence;
        checkPronunciation(transcript, confidence);
    };

    recognition.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        statusEl.textContent = 'Error: ' + e.error;
        micBtn.classList.remove('listening');
        isListening = false;
    };

    recognition.onend = () => {
        micBtn.classList.remove('listening');
        isListening = false;
        if (resultEl.textContent === '') {
            statusEl.textContent = 'No speech detected. Try again.';
        }
    };

    return true;
}

// Check pronunciation accuracy
function checkPronunciation(heard, confidence) {
    const heardLower = heard.toLowerCase().trim();
    const targetLower = currentWord.toLowerCase().trim();
    
    const similarity = calculateSimilarity(heardLower, targetLower);
    const isCorrect = similarity > 0.8 || heardLower === targetLower;
    
    // Save to history
    savePronunciationAttempt(currentWord, heard, isCorrect);
    
    if (isCorrect) {
        resultEl.className = 'result correct';
        resultEl.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">✓ Correct!</div>
            <div class="heard-text">You said: "${heard}"</div>
        `;
        statusEl.textContent = 'Great pronunciation!';
    } else {
        resultEl.className = 'result incorrect';
        resultEl.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">✗ Try Again</div>
            <div class="heard-text">You said: "${heard}"</div>
            <div class="heard-text">Expected: "${currentWord}"</div>
        `;
        statusEl.textContent = 'Keep practicing!';
    }
}

// Calculate string similarity
function calculateSimilarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance algorithm
function levenshteinDistance(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

// Get random word
function getNewWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    targetWordEl.textContent = currentWord;
    resultEl.textContent = '';
    resultEl.className = 'result';
    statusEl.textContent = 'Click the microphone to start';
}

// Event Listeners
micBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

newWordBtn.addEventListener('click', getNewWord);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initUserProfile();
    initSpeechRecognition();
});
