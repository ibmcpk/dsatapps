let questions = [];

function loadQuestions() {
    fetch('./questions.json')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.json();
        })
        .then(data => {
            questions = data;
            console.log("Questions loaded:", questions.length);
            startApp();
        })
        .catch(error => {
            console.error("Error loading questions.json:", error);
            document.getElementById("app").innerHTML += 
                '<p style="color:red;">Could not load questions.json. Using embedded sample questions.</p>';
            // Embedded fallback questions
            questions = [
                {
                    "question": "What is 2 + 2?",
                    "options": ["3", "4", "5", "6"],
                    "answer": "4",
                    "difficulty": 1
                }
            ];
            startApp();
        });
}

function startApp() {
    document.getElementById("app").innerHTML += 
        `<p>Loaded ${questions.length} question(s). First: ${questions[0].question}</p>`;
}

document.addEventListener("DOMContentLoaded", loadQuestions);
