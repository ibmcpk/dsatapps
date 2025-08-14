
let questions = [];
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;

async function loadQuestions() {
    const res = await fetch('questions.json');
    questions = await res.json();
}

function startSprint() {
    const difficulty = document.getElementById('difficulty').value;
    const numQuestions = parseInt(document.getElementById('numQuestions').value);

    let filtered = questions;
    if (difficulty !== 'all') {
        filtered = questions.filter(q => q.difficulty == difficulty);
    }

    // Shuffle and pick numQuestions
    filtered.sort(() => Math.random() - 0.5);
    currentQuestions = filtered.slice(0, numQuestions);

    currentIndex = 0;
    score = 0;
    timeLeft = 60;
    document.getElementById('result').innerHTML = '';
    showQuestion();
    startTimer();
}

function showQuestion() {
    if (currentIndex >= currentQuestions.length) {
        endSprint();
        return;
    }

    const q = currentQuestions[currentIndex];
    const container = document.getElementById('questionContainer');
    container.innerHTML = '<h3>' + q.problem + '</h3>';

    q.choices.forEach(choice => {
        const btn = document.createElement('div');
        btn.className = 'choice';
        btn.textContent = choice;
        btn.onclick = () => {
            if (choice == q.correct) score++;
            currentIndex++;
            showQuestion();
        };
        container.appendChild(btn);
    });
}

function startTimer() {
    const bar = document.getElementById('progressBar');
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        bar.style.width = (timeLeft / 60 * 100) + '%';
        if (timeLeft <= 0) {
            clearInterval(timer);
            endSprint();
        }
    }, 1000);
}

function endSprint() {
    clearInterval(timer);
    document.getElementById('questionContainer').innerHTML = '';
    const result = document.getElementById('result');
    result.innerHTML = 'You scored ' + score + ' out of ' + currentQuestions.length + '.';

    let best = localStorage.getItem('bestScore');
    if (!best || score > parseInt(best)) {
        localStorage.setItem('bestScore', score);
        result.innerHTML += ' New personal best!';
    } else {
        result.innerHTML += ' Personal best: ' + best;
    }
}

document.getElementById('startBtn').addEventListener('click', startSprint);
loadQuestions();
