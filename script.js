
/* GAME VARIABLES */

let playerName = "";
let currentQuestion = 0;
let score = 0;
let lives = 3;
let time = 90;
let timer = null;
let hintUsed = false;
let locked = false;
let gameRunning = false;
let unlocked = 0;
let dialogAction = null;

/* QUESTIONS */

let questions = [
    {
        room: "HTML CHAMBER",
        question: "Which tag creates the largest heading?",
        options: ["<h1>", "<h6>", "<heading>", "<head>"],
        answer: 0,
        hint: "It uses the smallest number."
    },
    {
        room: "HTML CHAMBER",
        question: "Which tag creates a hyperlink?",
        options: ["<link>", "<a>", "<url>", "<href>"],
        answer: 1,
        hint: "Think about an anchor."
    },
    {
        room: "CSS CHAMBER",
        question: "Which property changes text color?",
        options: ["font-color", "text-color", "color", "font"],
        answer: 2,
        hint: "The property has only one simple word."
    },
    {
        room: "CSS CHAMBER",
        question: "Which property changes the background color?",
        options: [
            "background-color",
            "bg-color",
            "back-color",
            "color-background"
        ],
        answer: 0,
        hint: "It starts with background."
    },
    {
        room: "JAVASCRIPT CHAMBER",
        question: "Which keyword creates a variable?",
        options: ["variable", "let", "create", "new"],
        answer: 1,
        hint: "It is a three-letter JavaScript keyword."
    }
];

/* HELPER */

function get(id) {
    return document.getElementById(id);
}

/* DIALOG BOX */

function showDialog(title, message, action) {
    get("dialogTitle").innerText = title;
    get("dialogMessage").innerText = message;

    dialogAction = action || null;

    if (!get("gameDialog").open) {
        get("gameDialog").showModal();
    }
}

function closeDialog() {
    let dialog = get("gameDialog");

    if (dialog.open) {
        dialog.close();
    }

    let action = dialogAction;
    dialogAction = null;

    if (action && gameRunning) {
        action();
    }
}

/* SHOW ONE BOX */

function showOnly(boxId) {
    get("startBox").classList.add("hidden");
    get("gameBox").classList.add("hidden");
    get("winBox").classList.add("hidden");
    get("loseBox").classList.add("hidden");

    get(boxId).classList.remove("hidden");
}

/* UPDATE STATUS */

function updateStatus() {
    get("timer").innerText = time;
    get("lives").innerText = lives;
    get("score").innerText = score;

    if (time <= 20) {
        get("timeBox").classList.add("low");
        get("progressBar").classList.add("low");
    } else {
        get("timeBox").classList.remove("low");
        get("progressBar").classList.remove("low");
    }
}

/* PLAYER NAME */

function loadName() {
    let saved = localStorage.getItem("codevaultName");

    if (saved) {
        get("playerName").value = saved;
        get("welcomeText").innerText =
            "WELCOME BACK, " + saved.toUpperCase();
    } else {
        get("playerName").value = "";
        get("welcomeText").innerText = "WELCOME, CODER";
    }
}

/* GO TO GAME */

function goToGame() {
    get("game").scrollIntoView();

    if (!gameRunning) {
        get("playerName").focus({
            preventScroll: true
        });
    }
}

/* START GAME */

function startGame() {
    if (gameRunning) {
        return;
    }

    let name = get("playerName").value.trim();

    if (name.length < 2) {
        get("nameError").innerText =
            "Please enter a name with at least 2 letters.";
        get("playerName").focus();
        return;
    }

    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }

    playerName = name;
    localStorage.setItem("codevaultName", playerName);

    get("nameError").innerText = "";
    get("welcomeText").innerText =
        "WELCOME BACK, " + playerName.toUpperCase();

    currentQuestion = 0;
    score = 0;
    lives = 3;
    time = 90;
    unlocked = 0;
    locked = false;
    hintUsed = false;
    gameRunning = true;
    dialogAction = null;

    get("playerLabel").innerText = playerName;
    get("progressBar").style.width = "0%";
    get("progressBar").classList.remove("low");
    get("leaderboard").classList.add("hidden");

    updateStatus();
    showOnly("gameBox");
    get("game").scrollIntoView();

    showQuestion();

    timer = setInterval(countDown, 1000);
}

/* SHOW QUESTION */

function showQuestion() {
    let q = questions[currentQuestion];

    hintUsed = false;
    locked = false;

    get("room").innerText = q.room;
    get("question").innerText = q.question;
    get("hint").innerText = "";
    get("message").innerText = "";
    get("message").className = "";
    get("lockNumber").innerText = currentQuestion + 1;

    get("hintBtn").disabled = false;
    get("skipBtn").disabled = false;

    let options = get("options");
    options.innerHTML = "";

    for (let i = 0; i < q.options.length; i++) {
        let button = document.createElement("button");

        button.innerText = q.options[i];

        button.onclick = function () {
            checkAnswer(i, button);
        };

        options.appendChild(button);
    }

    get("progressBar").style.width =
        (unlocked / questions.length) * 100 + "%";
}

/* CHECK ANSWER */

function checkAnswer(selected, button) {
    if (!gameRunning || locked ||
        get("gameDialog").open) {
        return;
    }

    let correct = questions[currentQuestion].answer;

    if (selected === correct) {
        locked = true;
        button.classList.add("correct");

        if (hintUsed) {
            score += 5;
        } else {
            score += 10;
        }

        unlocked++;

        get("message").className = "";
        get("message").innerText =
            "ACCESS GRANTED - LOCK UNLOCKED";

        updateStatus();

        get("progressBar").style.width =
            (unlocked / questions.length) * 100 + "%";

        setTimeout(function () {
            if (gameRunning) {
                nextQuestion();
            }
        }, 800);

    } else {
        lives--;

        button.classList.add("wrong");
        button.disabled = true;

        get("message").className = "bad";
        get("message").innerText =
            "ACCESS DENIED - LIFE LOST";

        updateStatus();

        if (lives <= 0) {
            locked = true;

            showDialog(
                "Game Over",
                "You lost all three lives.",
                function () {
                    gameOver("You lost all three lives.");
                }
            );
        } else {
            showDialog(
                "Wrong Answer!",
                "You lost one life. Try another answer."
            );
        }
    }
}

/* NEXT QUESTION */

function nextQuestion() {
    if (!gameRunning) {
        return;
    }

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        finishGame();
    } else {
        showQuestion();
    }
}

/* FINISH GAME */

function finishGame() {
    if (unlocked === questions.length) {
        winGame();
    } else {
        gameOver("You did not unlock every lock.");
    }
}

/* HINT */

function showHint() {
    if (!gameRunning || locked ||
        hintUsed || get("gameDialog").open) {
        return;
    }

    hintUsed = true;
    get("hintBtn").disabled = true;

    get("hint").innerText =
        "HINT: " + questions[currentQuestion].hint;
}

/* SKIP QUESTION */

function skipQuestion() {
    if (!gameRunning || locked ||
        get("gameDialog").open) {
        return;
    }

    lives--;
    locked = true;
    updateStatus();

    if (lives <= 0) {
        showDialog(
            "Game Over",
            "You used all your lives.",
            function () {
                gameOver("You used all your lives.");
            }
        );
    } else {
        showDialog(
            "Question Skipped",
            "You lost one life. Press OK to continue.",
            function () {
                nextQuestion();
            }
        );
    }
}

/* TIMER */

function countDown() {
    if (!gameRunning) {
        return;
    }

    time--;

    if (time <= 0) {
        time = 0;
        updateStatus();
        gameOver("The security timer reached zero.");
        return;
    }

    updateStatus();
}

/* WIN GAME */

function winGame() {
    if (!gameRunning) {
        return;
    }

    gameRunning = false;
    clearInterval(timer);
    timer = null;

    get("finalScore").innerText = score;
    get("finalLives").innerText = lives;
    get("finalTime").innerText = time;
    get("winName").innerText = playerName;

    saveScore();
    showOnly("winBox");
    showLeaderboard();
}

/* GAME OVER */

function gameOver(reason) {
    if (!gameRunning) {
        return;
    }

    gameRunning = false;
    clearInterval(timer);
    timer = null;
    dialogAction = null;

    let dialog = get("gameDialog");

    if (dialog.open) {
        dialog.close();
    }

    get("loseName").innerText = playerName;
    get("loseMessage").innerText = reason;
    get("loseLocks").innerText = unlocked;
    get("loseScore").innerText = score;

    saveScore();
    showOnly("loseBox");
    showLeaderboard();
}

/* PLAY AGAIN */

function playAgain() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }

    gameRunning = false;
    locked = false;
    dialogAction = null;

    if (get("gameDialog").open) {
        get("gameDialog").close();
    }

    currentQuestion = 0;
    score = 0;
    lives = 3;
    time = 90;
    unlocked = 0;
    hintUsed = false;

    updateStatus();

    get("progressBar").style.width = "0%";
    get("progressBar").classList.remove("low");
    get("hint").innerText = "";
    get("message").innerText = "";
    get("nameError").innerText = "";

    showOnly("startBox");
    get("leaderboard").classList.remove("hidden");
    loadName();

    get("playerName").focus();
}

/* GET SAVED SCORES */

function getScores() {
    let saved = localStorage.getItem("codevaultScores");

    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            return [];
        }
    }

    return [];
}

/* SAVE SCORE */

function saveScore() {
    let scores = getScores();

    scores.push({
        name: playerName,
        score: score
    });

    scores.sort(function (a, b) {
        return b.score - a.score;
    });

    scores = scores.slice(0, 5);

    localStorage.setItem(
        "codevaultScores",
        JSON.stringify(scores)
    );
}

/* SHOW LEADERBOARD */

function showLeaderboard() {
    let scores = getScores();
    let list = get("boardList");

    list.innerHTML = "";

    get("leaderboard").classList.remove("hidden");

    if (scores.length === 0) {
        list.innerHTML =
            "<li>No scores yet. Be the first!</li>";

        get("clearBoard").classList.add("hidden");
        return;
    }

    get("clearBoard").classList.remove("hidden");

    for (let i = 0; i < scores.length; i++) {
        let item = document.createElement("li");
        let points = document.createElement("span");

        item.innerText = scores[i].name;
        points.innerText = scores[i].score;

        if (scores[i].name === playerName) {
            item.classList.add("me");
        }

        item.appendChild(points);
        list.appendChild(item);
    }
}

/* CLEAR SCORES */

function clearScores() {
    localStorage.removeItem("codevaultScores");
    localStorage.removeItem("codevaultName");

    playerName = "";

    get("playerName").value = "";
    get("welcomeText").innerText = "WELCOME, CODER";

    showLeaderboard();
}

/* PAGE LOAD */

loadName();
showLeaderboard();

/* ENTER KEY TO START */

get("playerName").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        startGame();
    }
});

/* KEYBOARD ANSWERS: PRESS 1, 2, 3 OR 4 */

document.addEventListener("keydown", function (e) {
    if (!gameRunning || locked ||
        get("gameDialog").open) {
        return;
    }

    let number = Number(e.key);

    if (number >= 1 && number <= 4) {
        let button = get("options").children[number - 1];

        if (button && !button.disabled) {
            button.click();
        }
    }
});