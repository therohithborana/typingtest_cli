#!/usr/bin/env node

const chalk = require('chalk');
const keypress = require('keypress');
const figlet = require('figlet');

// Enable keypress events
keypress(process.stdin);

const words = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will',
  'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
  'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
  'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
  'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
  'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
  'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
  'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are',
  'has', 'had', 'were', 'been', 'being', 'have', 'do', 'does', 'did', 'will',
  'would', 'should', 'can', 'could', 'may', 'might', 'must', 'shall', 'ought'
];

let state = 'mainMenu'; // mainMenu, options, themes, typingTest, results
let wordList = [];
let currentWordIndex = 0;
let userInput = '';
let startTime = null;
let mistakes = 0;
let totalTyped = 0;
let wordCount = 30;
let lastPressedKey = '';
let creditVisible = true;
let creditInterval;

const themes = {
  default: { name: 'Default', main: chalk.cyan, secondary: chalk.gray, correct: chalk.green, incorrect: chalk.red, text: chalk.white },
  funky: { name: 'Funky', main: chalk.magenta, secondary: chalk.yellow, correct: chalk.blue, incorrect: chalk.red, text: chalk.white },
  ocean: { name: 'Ocean', main: chalk.blue, secondary: chalk.cyan, correct: chalk.green, incorrect: chalk.red, text: chalk.white },
  forest: { name: 'Forest', main: chalk.green, secondary: chalk.yellow, correct: chalk.blue, incorrect: chalk.red, text: chalk.white },
  neon: { name: 'Neon', main: chalk.rgb(255, 0, 255), secondary: chalk.rgb(0, 255, 255), correct: chalk.rgb(0, 255, 0), incorrect: chalk.rgb(255, 0, 0), text: chalk.white },
};
let currentTheme = themes.neon;

const menuOptions = ['Start Test', 'Options', 'Themes', 'Exit'];
let selectedMenuOption = 0;
const optionsMenu = ['Word Count', 'Back'];
let selectedOption = 0;
let newWordCount = '';

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

function displayMainMenu() {
  state = 'mainMenu';
  clearScreen();
  console.log(currentTheme.main(figlet.textSync('CLI Monkeytype', { font: 'Standard' })));
  console.log(currentTheme.secondary('========================================================\n'));
  menuOptions.forEach((option, index) => {
    console.log(index === selectedMenuOption ? currentTheme.main.inverse(`> ${option}`) : `  ${option}`);
  });
  console.log(currentTheme.secondary('\nUse arrow keys to navigate and ENTER to select.'));
  
  if (creditInterval) clearInterval(creditInterval);
  creditInterval = setInterval(() => {
    creditVisible = !creditVisible;
    displayMainMenu();
  }, 500);
  
  const creditText = creditVisible ? '(x.com/therohithborana)' : ' '.repeat(23);
  console.log(currentTheme.secondary(`\n\n${creditText}`));
}

function displayOptions() {
  state = 'options';
  clearInterval(creditInterval);
  clearScreen();
  console.log(currentTheme.main(figlet.textSync('Options', { font: 'Standard' })));
  console.log(currentTheme.secondary('========================================================\n'));
  optionsMenu.forEach((option, index) => {
    console.log(index === selectedOption ? currentTheme.main.inverse(`> ${option}`) : `  ${option}`);
  });
}

function displayThemes() {
  state = 'themes';
  clearInterval(creditInterval);
  clearScreen();
  console.log(currentTheme.main(figlet.textSync('Themes', { font: 'Standard' })));
  console.log(currentTheme.secondary('========================================================\n'));
  Object.values(themes).forEach((theme, index) => {
    console.log(index === selectedOption ? currentTheme.main.inverse(`> ${theme.name}`) : `  ${theme.name}`);
  });
}

function displayKeyboard() {
  let keyboard = '\n';
  const keyboardWidth = keyboardLayout[0].length * 4 + 2;
  const padding = Math.floor((process.stdout.columns - keyboardWidth) / 2);
  keyboard += ' '.repeat(padding) + currentTheme.main('┌' + '─'.repeat(keyboardWidth) + '┐\n');
  keyboardLayout.forEach(row => {
    keyboard += ' '.repeat(padding) + currentTheme.main('│ ');
    row.forEach(key => {
      if (key === lastPressedKey) {
        keyboard += currentTheme.correct.inverse(` ${key} `);
      } else {
        keyboard += currentTheme.secondary(` ${key} `);
      }
    });
    keyboard += currentTheme.main(' │\n');
  });
  keyboard += ' '.repeat(padding) + currentTheme.main('└' + '─'.repeat(keyboardWidth) + '┘');
  console.log(keyboard);
}

function displayTest() {
  state = 'typingTest';
  clearInterval(creditInterval);
  clearScreen();
  console.log(currentTheme.main(figlet.textSync('CLI Monkeytype', { font: 'Standard' })));
  console.log(currentTheme.secondary(`Words: ${wordCount} | Press ESC to quit\n`));

  if (currentWordIndex >= wordList.length) {
    showResults(new Date());
    return;
  }

  const typedWords = wordList.slice(0, currentWordIndex).map(word => currentTheme.correct(word)).join(' ');
  
  const currentWord = wordList[currentWordIndex];
  let displayedCurrentWord = '';
  for (let i = 0; i < currentWord.length; i++) {
    if (i < userInput.length) {
      if (userInput[i] === currentWord[i]) {
        displayedCurrentWord += currentTheme.correct(currentWord[i]);
      } else {
        displayedCurrentWord += currentTheme.incorrect(currentWord[i]);
      }
    } else {
      displayedCurrentWord += chalk.yellow(currentWord[i]);
    }
  }

  const upcomingWords = wordList.slice(currentWordIndex + 1).map(word => currentTheme.text(word)).join(' ');
  console.log(`${typedWords} ${chalk.underline(displayedCurrentWord)} ${upcomingWords}\n`);

  displayKeyboard();
}

function showResults(endTime) {
  state = 'results';
  clearInterval(creditInterval);
  const timeTaken = (endTime - startTime) / 1000;
  const wpm = timeTaken > 0 ? Math.round((totalTyped / 5) / (timeTaken / 60)) : 0;
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - mistakes) / totalTyped) * 100) : 0;
  clearScreen();
  console.log(currentTheme.main(figlet.textSync('Results', { font: 'Standard' })));
  console.log(currentTheme.secondary('=================================\n'));
  console.log(currentTheme.main(`Time:       ${timeTaken.toFixed(2)}s`));
  console.log(chalk.magenta(`WPM:        ${wpm}`));
  console.log(currentTheme.correct(`Accuracy:   ${accuracy}%`));
  console.log(chalk.yellow(`Characters: ${totalTyped}`));
  console.log(currentTheme.incorrect(`Mistakes:   ${mistakes}\n`));
  console.log(currentTheme.secondary('Press any key to return to the main menu...'));
}

function resetTestState() {
  currentWordIndex = 0;
  userInput = '';
  startTime = null;
  mistakes = 0;
  totalTyped = 0;
  lastPressedKey = '';
}

function startTypingTest() {
  resetTestState();
  wordList = Array.from({ length: wordCount }, () => words[Math.floor(Math.random() * words.length)]);
  displayTest();
}

function clearScreen() {
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
} else {
  console.log(chalk.yellow('Warning: Not running in a TTY terminal.'));
  process.exit(1);
}

displayMainMenu();

process.stdin.on('keypress', (ch, key) => {
  if (key && key.ctrl && key.name === 'c') process.exit(0);
  lastPressedKey = ch;

  switch (state) {
    case 'mainMenu':
      if (key && key.name === 'up') selectedMenuOption = (selectedMenuOption - 1 + menuOptions.length) % menuOptions.length;
      if (key && key.name === 'down') selectedMenuOption = (selectedMenuOption + 1) % menuOptions.length;
      if (key && key.name === 'return') {
        if (selectedMenuOption === 0) startTypingTest();
        if (selectedMenuOption === 1) displayOptions();
        if (selectedMenuOption === 2) displayThemes();
        if (selectedMenuOption === 3) process.exit(0);
      } else {
        displayMainMenu();
      }
      break;

    case 'options':
      if (key && key.name === 'escape') displayMainMenu();
      if (key && key.name === 'return') {
        if (selectedOption === 0) {
          state = 'wordCount';
          newWordCount = String(wordCount);
          clearScreen();
          console.log(currentTheme.main('Set Word Count'));
          console.log(currentTheme.secondary(`Current: ${wordCount}`));
          console.log(currentTheme.main(`> ${newWordCount}`));
        } else {
          displayMainMenu();
        }
      } else if (key && key.name === 'up') {
        selectedOption = (selectedOption - 1 + optionsMenu.length) % optionsMenu.length;
        displayOptions();
      } else if (key && key.name === 'down') {
        selectedOption = (selectedOption + 1) % optionsMenu.length;
        displayOptions();
      }
      break;

    case 'wordCount':
      if (key && key.name === 'escape') displayOptions();
      if (key && key.name === 'return') {
        const count = parseInt(newWordCount);
        if (!isNaN(count) && count > 0) wordCount = count;
        displayOptions();
      }
      if (key && key.name === 'backspace') newWordCount = newWordCount.slice(0, -1);
      if (ch && ch.match(/[0-9]/)) newWordCount += ch;
      clearScreen();
      console.log(currentTheme.main('Set Word Count'));
      console.log(currentTheme.secondary(`Current: ${wordCount}`));
      console.log(currentTheme.main(`> ${newWordCount}`));
      break;

    case 'themes':
      if (key && key.name === 'escape') displayMainMenu();
      if (key && key.name === 'return') {
        currentTheme = Object.values(themes)[selectedOption];
        displayMainMenu();
      }
      if (key && key.name === 'up') {
        selectedOption = (selectedOption - 1 + Object.values(themes).length) % Object.values(themes).length;
        displayThemes();
      } else if (key && key.name === 'down') {
        selectedOption = (selectedOption + 1) % Object.values(themes).length;
        displayThemes();
      }
      break;

    case 'typingTest':
      if (key && key.name === 'escape') {
        displayMainMenu();
        return;
      }
      
      if (key && key.name === 'backspace') {
        userInput = userInput.slice(0, -1);
      } else if (ch === ' ') {
        if (userInput.length > 0) {
          if (userInput !== wordList[currentWordIndex]) mistakes++;
          totalTyped += wordList[currentWordIndex].length + 1;
          currentWordIndex++;
          userInput = '';
          if (currentWordIndex >= wordList.length) {
            showResults(new Date());
            return;
          }
        }
      } else if (ch && !ch.match(/[^ -~]/)) {
        if (!startTime) startTime = new Date();
        userInput += ch;
      }
      displayTest();
      break;

    case 'results':
      displayMainMenu();
      break;
  }
});
