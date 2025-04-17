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
let wordCount = 30

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const feature = document.getElementById("feature");
const optionMode = document.querySelector(".optionMode")
const btnReload = document.querySelector(".btn-reload")
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
    });
}


// Initialize the typing test
const startTest = (wordCount) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    totalCharsType = 0;
    totalErrors = 0;


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

            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

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
        // Supprime la classe après 300ms pour réactiver l'animation sur le prochain keydown
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
        }else{
            document.querySelectorAll('.optionMode a').forEach(link => {
                link.style.color = "#99947F";
            });
            targetLink.style.color = "#080909";
            const value = targetLink.textContent.trim()
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

//Reload button
btnReload.addEventListener("click",() => startTest(wordCount))

// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    handleKeydown(event);
});    

modeSelect.addEventListener("change", () => startTest(wordCount));

// Start the test
startTest(wordCount);
