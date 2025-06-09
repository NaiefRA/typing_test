const timer = document.querySelector(".timer");
const startButton = document.querySelector(".start-button");
const container = document.querySelector(".word-container");
const wpm = document.querySelector(".wpm");
const cpm = document.querySelector(".cpm");
const acc = document.querySelector(".acc");
const wpmf = document.querySelector(".wpm-f");
const cpmf = document.querySelector(".cpm-f");
const accf = document.querySelector(".acc-f");
const popup = document.querySelector(".popup-container");
const speed = document.querySelector(".speed");

const wordsString =
  "words as they leave look own play old consider word other home in mean late lead plan move year out before words as they leave look own play old consider word other home in mean late lead plan move year out before words as they leave look own play old consider word other home in mean late lead plan move year out before words as they leave look own play old consider word other home in mean late lead plan move year out before";

const words = wordsString.split(" ");
const state = words.map((word) => word.split("").map(() => ""));

const excess = words.map(() => "");

let wordNow = "";
let currWord = 0;
let currLetter = 0;
let started = false;
let htmlText;

let numWords = 0;
let numLetters = 0;

// render words

const render = (words, state) => {
  const htmlText = words
    .map((word, i) => {
      const main = word
        .split("")
        .map((letter, j) => {
          const isCurrent = i === currWord && j === currLetter;
          const extraClass = isCurrent ? "current" : "";
          return `<div class="letter ${state[i][j]} ${extraClass}">${letter}</div>`;
        })
        .join("");

      const toAdd = excess[i]
        .split("")
        .map((letter) => `<div class="letter extra">${letter}</div>`)
        .join("");

      return `<div class="word word-${i}">${main}${toAdd}</div>`;
    })
    .join("");

  container.innerHTML = `<div class="word-list">${htmlText}</div>`;
};

// typing function

const typing = (e) => {
  console.log(wordNow);
  if (started === true) {
    if (currLetter > words[currWord].length - 1) {
      e.key.length === 1 && e.key !== " " ? (excess[currWord] += e.key) : null;
    }

    // space
    if (e.key === " ") {
      if (wordNow === words[currWord]) {
        numWords++;
        numLetters += wordNow.length;
      }
      currWord++;
      currLetter = 0;
      wpm.textContent = `${numWords}`;
      cpm.textContent = `${numLetters}`;
      acc.textContent = `${((numWords / currWord) * 100).toFixed(2)}%`;
      wordNow = "";
    }
    // correct letter
    else if (e.key === words[currWord][currLetter]) {
      state[currWord][currLetter] = "correct";
      currLetter++;
      wordNow += e.key;
    }
    // backspace
    else if (e.key === "Backspace") {
      if (currLetter > 0) {
        currLetter--;
        state[currWord][currLetter] = "";
        wordNow = wordNow.slice(0, -1);
      }
      excess[currWord] = excess[currWord].slice(0, -1);
    }
    // wrong letter
    else {
      state[currWord][currLetter] = "wrong";
      currLetter++;
      e.key.length === 1 && e.key !== " " ? (wordNow += e.key) : null;
    }

    currLetter < 0 ? (currLetter = 0) : null;
  }

  render(words, state);
};

// timer

const countdown = () => {
  let t = 3;
  setInterval(() => {
    t > 0 ? (t -= 1) : end();
    timer.textContent = `Time left: ${t}`;
  }, 1000);
};

// starting

startButton.addEventListener("click", (e) => {
  if (started === false) {
    countdown();

    render(words, state);

    started = true;
  }
});

document.addEventListener("keydown", (e) => {
  if (started) {
    typing(e);
  }
});

// game end

const end = () => {
  started = false;
  let speedText;

  if (numWords < 30) {
    speedText = "Snail 🐌";
  } else if (numWords < 40) {
    speedText = "Octopus 🐙";
  } else {
    speedText = "T-Rex 🦖";
  }

  popup.classList.remove("hidden");
  wpmf.textContent = `${numWords}`;
  cpmf.textContent = `${numLetters}`;
  accf.textContent = `${((numWords / currWord) * 100).toFixed(2)}%`;
  speed.textContent = `You are a ${speedText}`;
};
