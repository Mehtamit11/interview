# 🇩🇪 German Pronunciation Checker

A simple web application to practice German pronunciation using browser speech recognition technology.

![German Pronunciation Checker](https://img.shields.io/badge/language-German-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎯 Features

- **Real-time Speech Recognition**: Uses browser's built-in speech recognition API
- **Instant Feedback**: Get immediate pronunciation feedback (correct/incorrect)
- **20 Common German Words**: Practice essential German vocabulary
- **Simple & Clean UI**: Easy-to-use interface with visual feedback
- **Similarity Algorithm**: Forgiving matching that accounts for slight variations
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Demo

Try it live: [Add your GitHub Pages URL here]

## 📋 Prerequisites

- Modern web browser (Chrome or Edge recommended for best speech recognition support)
- Microphone access
- Internet connection (for speech recognition API)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/german-pronunciation-checker.git
```

2. Navigate to the project directory:
```bash
cd german-pronunciation-checker
```

3. Open `index.html` in your browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or simply double-click the `index.html` file.

## 📱 Usage

1. **Click the microphone button** to start recording
2. **Speak the German word** displayed on screen
3. **Get instant feedback** - ✓ Correct or ✗ Try Again
4. **Click "New Word"** to practice another word

## 🎓 Included Words

The app includes 20 common German words and phrases:
- Greetings: Hallo, Guten Morgen, Guten Tag, Gute Nacht
- Common phrases: Danke, Bitte, Entschuldigung, Auf Wiedersehen, Tschüss
- Everyday words: Wasser, Brot, Schule, Haus, Straße
- Places: Bahnhof, Flughafen, Restaurant, Krankenhaus, Apotheke, Supermarkt

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full Support |
| Edge | ✅ Full Support |
| Safari | ⚠️ Limited Support |
| Firefox | ❌ Not Supported |

**Note**: Speech Recognition API works best in Chrome and Edge browsers.

## 🔧 Customization

### Adding More Words

Edit the `words` array in `script.js`:
```javascript
const words = [
    'Hallo', 
    'Danke',
    'Your New Word',
    // Add more words here
];
```

### Adjusting Similarity Threshold

Modify the similarity threshold in `script.js`:
```javascript
if (similarity > 0.8) { // Change 0.8 to your preferred value (0.0 - 1.0)
    // Correct pronunciation
}
```

## 📂 Project Structure
