// Setting Game Name
let gameName = "Guess The Word";

document.title = gameName;
document.querySelector("h1").innerText = gameName;
document.querySelector("footer").innerHTML = `${gameName} &copy; ${new Date().getFullYear()} Created By Yousief Sameh`;

// Setting Game Options
let numbersOfTries = 5;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 3;

// Manage Word
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Samier", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", getHint);

// Mange Check Guess
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

// Mange Reset Button
const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", resetAllInputs);

function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");
  // Create Main Try Div
  for (let i = 1; i <= numbersOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;
    if (i !== 1) tryDiv.classList.add("disabled-inputs");
    // Create Inputes
    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.maxLength = 1;
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();
  // Diable All Inputes Except First One
  const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert Inputs To Upper Case
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus()
    })
    input.addEventListener("keydown", function(event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    })
  })
}

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];
    // Game Logic
    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place")
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }
  // Check User If Win Or Lose
  if (successGuess) {
    messageArea.innerHTML = `<p>You Win The Word Is <span>${wordToGuess}</span></p>`;
    if (numberOfHints === 3) {
      messageArea.innerHTML = `<p>Congratz You Didn't Use Hints <span>${wordToGuess}</span></p>`;
    }
    let allTries = document.querySelectorAll(".inputs > div");
    // Add Disabled Class On All Try Divs
    allTries.forEach((tryDiv) => {
      tryDiv.classList.add("disabled-inputs");
    });
    // Disable Guess Button
    guessButton.disabled = true
    hintButton.disabled = true;
    resetButton.disabled = true;
    
  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    currentTryInputs.forEach((input) => (input.disabled = true));
    currentTry++;
    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));
    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
      el.children[1].focus()
    } else {
      guessButton.disabled = true;
      hintButton.disabled = true;
      resetButton.disabled = true;
      messageArea.innerHTML = `<p>Game Over The Word Is <span>${wordToGuess}</span></p>`;
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    hintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    // console.log(randomIndex);
    // console.log(randomInput);
    // console.log(indexToFill);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }

}

function resetAllInputs() {
  const inputs = document.querySelectorAll("input:not([disabled])");
  inputs.forEach(input => input.value = "");
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
  generateInputs();
};
