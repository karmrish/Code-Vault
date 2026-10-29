# 🔐 CodeVault – Escape Room

CodeVault is a browser-based coding escape room game built with plain **HTML, CSS and JavaScript**. Answer coding questions, unlock all five security locks and escape the vault before the timer runs out.

## 🎮 How to Play

1. Enter your name and click **START GAME**.
2. Answer each question to open its lock.
3. Unlock all **5 locks** to escape.

| Rule | Details |
| --- | --- |
| ⏱️ Time | 90 seconds to finish the game |
| ❤️ Lives | 3 lives; a wrong answer or a skip costs one life |
| 💡 Hints | One hint per lock; using it halves your points (10 → 5) |
| ⭐ Score | 10 points per correct answer, 5 if a hint was used |
| 🏆 Leaderboard | Top players are saved in your browser |

The game has three chambers: **HTML**, **CSS** and **JavaScript**.

## ✨ Features

- Countdown timer with a low-time warning
- Lives, score and progress bar
- Hint and skip system
- Win and game-over screens
- Leaderboard saved with `localStorage`
- Remembers the last player name
- Responsive layout with a terminal-style design

## 🛠️ Tech Stack

- **HTML5** – structure and `<dialog>` popups
- **CSS3** – styling and animations
- **JavaScript (vanilla)** – game logic, timer, scoring and storage

## 📁 Project Structure


FINAL-ONE/
├── index.html   # Page layout and game screens
├── style.css    # Styling
└── script.js    # Game logic, questions and leaderboard


## 🚀 Run Locally

No installation or build step is needed.

1. Clone or download this repository:

   git clone https://github.com/karmrish/FINAL-ONE.git
  
2. Open the folder and double-click `index.html`, or use the **Live Server** extension in VS Code.

## 🌐 Live Demo

Hosted with GitHub Pages: `https://karmrish.github.io/FINAL-ONE/`

## ➕ Adding Your Own Questions

Open `script.js` and add an object to the `questions` array:

js

{
    room: "JAVASCRIPT CHAMBER",
    question: "Your question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 1,            // index of the correct option (starts at 0)
    hint: "Your hint here."
}

The lock counter and progress bar adjust automatically to the number of questions.

## 📄 License

This project is for learning purposes. Add a license of your choice (for example, MIT) if you plan to share it publicly.

## 👤 Author

Made by **Rishika Karmakar**.
