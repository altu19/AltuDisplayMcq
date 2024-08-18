let mcqs;
let currentQuestion = 0;
let selectedOption = null;

function fetchMCQs() {
    fetch('mcqs.json')
        .then(response => response.json())
        .then(data => {
            mcqs = data;
            updateQuestion();
        })
        .catch(error => console.error('Error fetching MCQs:', error));
}

function updateQuestion() {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const resultElement = document.getElementById("result");
    
    selectedOption = null;
    
    const currentMCQ = mcqs[currentQuestion];

    // Set the HTML content of question element with question number
    const questionNumber = currentQuestion + 1;
    const questionText = replaceImageFormat(currentMCQ.question); // Replace image format with <img> tag
    const sanitizedQuestion = sanitizeText(questionText); // Sanitize question text
    questionElement.innerHTML = `<strong>Question ${questionNumber}:</strong> ${sanitizedQuestion}`;

    // Set the HTML content of options element with option names (A), (B), (C), (D)
    optionsElement.innerHTML = "";
    const optionLetters = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < currentMCQ.options.length; i++) {
        const optionElement = document.createElement("li");
        const optionText = currentMCQ.options[i];
        const optionTextWithImage = replaceImageFormat(optionText); // Replace image format with <img> tag for options
        const sanitizedOption = sanitizeText(optionTextWithImage); // Sanitize option text
        optionElement.innerHTML = `<strong>(${optionLetters[i]})</strong> ${sanitizedOption}`;
        optionElement.setAttribute("data-option", optionLetters[i]); // Set data-option attribute
        optionElement.addEventListener("click", handleOptionClick); // Add click event listener
        optionsElement.appendChild(optionElement);
    }

    // Let MathJax process the newly added content
    MathJax.typesetPromise();

    // Clear previous result
    resultElement.textContent = "";
}


function sanitizeText(text) {
    // Remove trailing backslashes from the text
    return text.replace(/\\+$/, "");
}


function replaceImageFormat(text) {
    // Regular expression to match \includegraphics format
    const regex = /(?:\\begin{center}\s*|)\\includegraphics\[.*?\]{(.*?)}(?:\s*\\end{center}|)/g;
    return text.replace(regex, (match, imageName) => {
        // Replace \includegraphics format with <img> tag pointing to the corresponding image file
        return `<br><img src="images/${imageName}.jpg" style="max-width: 100%;"><br>`;
    });
}

function handleOptionClick(event) {
    // Remove previous selection
    const prevSelectedOption = document.querySelector('.selected');
    if (prevSelectedOption) {
        prevSelectedOption.classList.remove('selected');
    }

    // Update selected option
    const option = event.target.closest('li');
    option.classList.add('selected');
    selectedOption = option.getAttribute('data-option');
}

const prevButton = document.getElementById("prev-button");
prevButton.addEventListener("click", () => {
    currentQuestion--;
    if (currentQuestion < 0) {
        currentQuestion = mcqs.length - 1; // Wrap to the last question
    }
    updateQuestion();
});

const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion >= mcqs.length) {
        currentQuestion = 0; // Wrap to the first question
    }
    updateQuestion();
});

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {
    const currentMCQ = mcqs[currentQuestion];
    const correctOption = currentMCQ.correctoption;

    const resultElement = document.getElementById("result");
    if (!selectedOption) {
        resultElement.textContent = `The correct option is ${correctOption}.`;
    } else if (selectedOption === correctOption) {
        resultElement.textContent = "Correct!";
    } else {
        resultElement.textContent = `Incorrect! The correct option is ${correctOption}.`;
    }
});

fetchMCQs(); // Fetch MCQs when the page loads
