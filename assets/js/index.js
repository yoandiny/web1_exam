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

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const feature = document.getElementById("feature");
const optionMode = document.querySelector(".optionMode")



const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
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
        span.textContent = span.textContent.split("").reverse().join("")
    },
    "Mode": () => {}
  };

// Initialize the typing test
const startTest = (wordCount = 50) => {
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
optionMode.addEventListener("click", (e)=> {
    e.preventDefault()
    
    const targetLink = e.target.closest('a')
    if(targetLink){
        if(currentMode === targetLink){
            targetLink.style.color = "#99947F";
            feature.innerHTML = "Mode";
            currentMode = null;
        }else{
            document.querySelectorAll('.optionMode a').forEach(link => {
                link.style.color = "#99947F";
            });
            targetLink.style.color = "#080909";
            const value = targetLink.textContent.trim()
            const valueWithIcon =  targetLink.innerHTML.trim()
            feature.innerHTML = valueWithIcon
            
            currentMode = targetLink
            startTest()
        }
    }
    if(feature.textContent.includes("Mode")){
        document.querySelectorAll(".shake-feature").forEach(el => {
            el.classList.remove("shake-feature");
            el.style.animationDelay = ""; 
        });
    }
    // console.log(feature.innerText);
    
})


// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    handleKeydown(event);
});    
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();
