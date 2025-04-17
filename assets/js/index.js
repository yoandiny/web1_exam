/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let totalCharsType = 0
let totalErrors = 0
let currentMode = null; 
let flashTimeouts = [];
let wordCount = 25
let scoreChartInstance = null;
let currentPlaying = null;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const feature = document.getElementById("feature");
const featureMusic = document.getElementById("featureMusic");
const optionMode = document.querySelector(".optionMode")
const optionMusic = document.querySelector(".optionMusic")
const btnReload = document.querySelector(".btn-reload")
const scoreChartContainer = document.getElementById("scoreChartContainer")
document.querySelector('.time-feature a:nth-child(2)').style.color = "#080909";
document.getElementById("word").style.color = "#080909";


const words = {
    lv1: ["cat", "dog", "sun", "red", "book"], 
    lv2: ["apple", "grape", "chair", "house", "green"], 
    lv3: ["banana", "monitor", "rocket", "garden", "window"], 
    lv4: ["keyboard", "printer", "charger", "battery", "picture"], 
    lv5: ["elegant", "frequent", "holiday", "capture", "library"],
    lv6: ["development", "extravagant", "imagination", "dictionary", "situation"], 
    lv7: ["synchronize", "misconception", "architecture", "transparency", "exaggeration"],
    lv8: ["System42", "file_2023", "codeReview", "update-v1", "userLogin"],
    lv9: ["check,please", "let's-go!", "error.404", "run();", "name@email.com"], 
    lv10: ["console.log('done!')", "if(x===10){return;}", "let $var=42;", "Math.PI*radius", "user#1234"] 
};
const musicTracks = {
    metal: new Audio("assets/audio/Pop_Metal.mp3"),
    heavy: new Audio("assets/audio/Heavy_Action.mp3"),
    lead: new Audio("assets/audio/Take_the_Lead.mp3"),
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};


//The Different Mode
const modes = {
    "Shake": (span) => {
      span.classList.add("shake-feature");
      span.style.animationDelay = `${(Math.random() * 0.3).toFixed(2)}s`;
    },
    "Reverse": (span) => {
        if (!span.dataset.originalText) {
            span.dataset.originalText = span.textContent;
        }
        span.textContent = span.textContent.split("").reverse().join("")
    },
    "rCaSe": (span) => {
        if (!span.dataset.originalText) {
            span.dataset.originalText = span.textContent;
        }
        span.textContent = span.textContent
            .split('')
            .map(char => Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase())
            .join('');
    },
    "Flash": () => {
        const allWords = wordDisplay.querySelectorAll("span");

        setTimeout(() => {
            allWords.forEach((span, index) => {
                const timeoutId = setTimeout(() => {
                    span.style.visibility = "hidden";
                    span.style.opacity = "0";
                }, 2800 * index);

                flashTimeouts.push(timeoutId);
            });
        }, 3000); 
    },
    
    "Mode": () => {}
};

//Desactivation des modes 
const disableModes = () =>{
    document.querySelectorAll(".shake-feature").forEach(el => {
        el.classList.remove("shake-feature");
        el.style.animationDelay = ""; 
    });
    document.querySelectorAll("span").forEach(el => {
        if (el.dataset.originalText) {
            el.textContent = el.dataset.originalText;
            delete el.dataset.originalText;
        }
    });
    flashTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    flashTimeouts = [];
    wordDisplay.querySelectorAll("span").forEach(span => {
        span.style.visibility = "visible"; 
        span.style.opacity = "1";
    });
}


// Initialize the typing test
const startTest = (wordCount) => {
    disableModes()

    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    totalCharsType = 0;
    totalErrors = 0;
    inputField.disabled = false;
    scoreChartContainer.style.display = "none";

    if (scoreChartInstance) {
        scoreChartInstance.destroy();
        scoreChartInstance = null;
    }



    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word ;
        span.classList.add("second-color")

        //Si mode activer
        const currentModeName = feature.textContent.trim();
        if (modes[currentModeName]) {
            modes[currentModeName](span); 
        }
        
        if (index === 0) span.classList.add("current-word"); // Highlight first word
        wordDisplay.appendChild(span);
        wordDisplay.append(" ")
    });

    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = totalCharsType === 0 ? 100 : ((totalCharsType - totalErrors) / totalCharsType) *100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            if (currentWordIndex === wordsToType.length - 1) {
                const { wpm, accuracy } = getCurrentStats();
                inputField.disabled = true;
                previousEndTime = Date.now();
                const finalTime = (previousEndTime - startTime) / 1000;

                scoreChartContainer.style.display = "flex";

                scoreChartInstance = new Chart(document.getElementById('scoreChart'), {
                    type: 'bar',
                    data: {
                        labels: ['WPM', 'Accuracy'],
                        datasets: [{
                            label: 'Résultats',
                            data: [wpm, accuracy],
                            backgroundColor: ['#7fa480', '#c87e74'],
                            borderRadius: 5,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'x', // met 'x' si tu veux des barres verticales
                        responsive: true,
                        scales: {
                            x: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                    font: {
                                        weight: 600,
                                        size: 14
                                    }
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        weight: 600,
                                        size: 14
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: true }
                        }
                    }
                });


                //Stockage score with localStorage
                const history = JSON.parse(localStorage.getItem("typingHistory")) || [];
                history.push({
                    date: new Date().toLocaleString(),
                    mode: feature.textContent.trim(),
                    difficulty: modeSelect.value,
                    wordCount: wordCount,
                    wpm: parseFloat(wpm),
                    accuracy: parseFloat(accuracy)
                });
                localStorage.setItem("typingHistory", JSON.stringify(history));
            }

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
};

//Hangle keydown for total cumul and check in live
const handleKeydown = (event) => {
    startTimer(); //start the chrono if it's not done yet

    if (feature.textContent.trim() === "Bounce") {
        inputField.classList.add("bounce");
        setTimeout(() => inputField.classList.remove("bounce"), 300);
    }
    if (event.key !== "Backspace" && event.key !== " " && event.key.length === 1) {
        const currentInput = inputField.value; 
        const expectedChar = wordsToType[currentWordIndex][currentInput.length];
        totalCharsType++; 
        if (event.key !== expectedChar) {
            totalErrors++; 
        }
    }

    updateWord(event);
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "#080909";
        }
        wordElements[currentWordIndex].classList.add("current-word");
    }
};


// Event listeners
// Handle wod count option clickss 15 / 30 / 60 / 120
document.querySelector(".time-feature").addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target.closest("a");
    if (!target) return;

    document.querySelectorAll(".time-feature a").forEach(link => {
        link.style.color = "#99947F";
    });
    target.style.color = "#080909";

    wordCount = parseInt(target.textContent.trim());
    startTest(wordCount);
});

//Handle option mode
optionMode.addEventListener("click", (e)=> {
    e.preventDefault()
    
    const targetLink = e.target.closest('a')
    if(targetLink){
        if(currentMode === targetLink || targetLink.innerHTML === `<i class="fa-solid fa-ban"></i>`){
            targetLink.style.color = "#99947F";
            feature.innerHTML = "Mode";
            feature.style.setProperty("color", "#99947F", "important");
            currentMode = null;
            document.querySelectorAll('.optionMode a').forEach(link => {
                link.style.color = "#99947F";
            });
        }else{
            document.querySelectorAll('.optionMode a').forEach(link => {
                link.style.color = "#99947F";
            });
            targetLink.style.color = "#080909";
            const valueWithIcon =  targetLink.innerHTML.trim()
            feature.innerHTML = valueWithIcon
            feature.style.setProperty("color", "#080909", "important");

            
            currentMode = targetLink
            startTest(wordCount)
        }
    }
    if(feature.textContent.includes("Mode")){
        disableModes()
    }
    
})


//Handle option music
let currentTrack = null; // Ce sera le son actuellement joué

optionMusic.addEventListener("click", (e) => {
    e.preventDefault();
    
    const targetLink = e.target.closest('a');
    if (targetLink) {
        const value = targetLink.textContent.trim().toLowerCase();
        const valueWithIcon = targetLink.innerHTML.trim();
        const iconHTML = targetLink.querySelector('i').outerHTML;

        if (currentPlaying === targetLink || valueWithIcon.includes('fa-ban')) {
            if (currentTrack) {
                currentTrack.pause();
                currentTrack.currentTime = 0;
                currentTrack = null;
            }
            document.querySelectorAll('.optionMusic a').forEach(link => {
                link.style.color = "#99947F";
            });
            targetLink.style.color = "#99947F";
            featureMusic.innerHTML = `<i class="fa-solid fa-music"></i>`;
            featureMusic.style.setProperty("color", "#99947F", "important");
            currentPlaying = null;
        } else {
            document.querySelectorAll('.optionMusic a').forEach(link => {
                link.style.color = "#99947F";
            });

            const selectedTrack = musicTracks[value];
            if (!selectedTrack) return;

            if (currentTrack) {
                currentTrack.pause();
                currentTrack.currentTime = 0;
            }

            selectedTrack.play();
            selectedTrack.loop = true;
            currentTrack = selectedTrack;

            targetLink.style.color = "#080909";
            featureMusic.innerHTML = iconHTML;
            featureMusic.style.setProperty("color", "#080909", "important");

            currentPlaying = targetLink;
        }
    }
});



//Reload button
btnReload.addEventListener("click",() => startTest(wordCount))

// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    handleKeydown(event);
});    

modeSelect.addEventListener("change", () => startTest(wordCount));

// Start the test
startTest(wordCount);


window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.getElementById('intro');
        if (intro) {
            intro.remove();
        }
    }, 1800); 
});