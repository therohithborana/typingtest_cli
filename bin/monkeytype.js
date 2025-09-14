#!/usr/bin/env node

const chalk = require('chalk');
const keypress = require('keypress');
const figlet = require('figlet');

// Enable keypress events
keypress(process.stdin);

// Sample words for the typing test
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

let currentWordIndex = 0;
let userInput = '';
let startTime = null;
let mistakes = 0;
let totalTyped = 0;

// Get command line arguments
const args = process.argv.slice(2);
let wordCount = 30; // Default word count

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--words' || args[i] === '-w') {
    const count = parseInt(args[i + 1]);
    if (!isNaN(count) && count > 0) {
      wordCount = count;
    }
  }
  
  if (args[i] === '--help' || args[i] === '-h') {
    displayHelp();
    process.exit(0);
  }
}

// Display help message
function displayHelp() {
  console.log(chalk.cyan(figlet.textSync('CLI Monkeytype', { horizontalLayout: 'full' })));
  console.log(chalk.gray('========================================================\n'));
  console.log(chalk.white('A command-line typing test application inspired by Monkeytype\n'));
  console.log(chalk.cyan('Usage:'));
  console.log(chalk.white('  monkeytype [options]\n'));
  console.log(chalk.cyan('Options:'));
  console.log(chalk.white('  -w, --words <number>   Set the number of words for the test (default: 30)'));
  console.log(chalk.white('  -h, --help             Display this help message\n'));
  console.log(chalk.cyan('Controls:'));
  console.log(chalk.white('  - Type the words as they appear.'));
  console.log(chalk.white('  - Press `SPACE` to move to the next word.'));
  console.log(chalk.white('  - Press `ESC` to exit the test at any time.'));
}

// Get a random word from the list
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Generate a sequence of words for the test
function generateWords(count) {
  const wordList = [];
  for (let i = 0; i < count; i++) {
    wordList.push(getRandomWord());
  }
  return wordList;
}

// Display the current state of the test
function displayTest(wordList) {
  // Clear terminal
  if (process.platform === 'win32') {
    process.stdout.write('\x1Bc');
  } else {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
  }

  console.log(chalk.cyan(figlet.textSync('CLI Monkeytype', { horizontalLayout: 'full' })));
  console.log(chalk.gray(`Words: ${wordCount} | Press ESC to quit\n`));

  // Display words with highlighting
  const typedWords = wordList.slice(0, currentWordIndex).map(word => chalk.green(word)).join(' ');
  const currentWord = chalk.yellow.underline(wordList[currentWordIndex]);
  const upcomingWords = wordList.slice(currentWordIndex + 1).map(word => chalk.white(word)).join(' ');

  console.log(`${typedWords} ${currentWord} ${upcomingWords}\n`);

  // Display user input with feedback
  const currentWordToMatch = wordList[currentWordIndex];
  let feedback = '';
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === currentWordToMatch[i]) {
      feedback += chalk.green(userInput[i]);
    } else {
      feedback += chalk.red(userInput[i]);
    }
  }
  console.log(`> ${feedback}`);
}

// Calculate and display results
function showResults(endTime) {
  const timeTaken = (endTime - startTime) / 1000; // in seconds
  const wordsPerMinute = Math.round((totalTyped / 5) / (timeTaken / 60));
  const accuracy = Math.round(((totalTyped - mistakes) / totalTyped) * 100);

  // Clear terminal
  if (process.platform === 'win32') {
    process.stdout.write('\x1Bc');
  } else {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
  }
  
  console.log(chalk.cyan(figlet.textSync('Results', { horizontalLayout: 'full' })));
  console.log(chalk.gray('=================================\n'));
  console.log(chalk.cyan(`Time:       ${timeTaken.toFixed(2)}s`));
  console.log(chalk.magenta(`WPM:        ${wordsPerMinute}`));
  console.log(chalk.green(`Accuracy:   ${accuracy}%`));
  console.log(chalk.yellow(`Characters: ${totalTyped}`));
  console.log(chalk.red(`Mistakes:   ${mistakes}\n`));
  console.log(chalk.gray('Press any key to exit...'));

  // Wait for a keypress to exit
  process.stdin.once('keypress', () => {
    process.exit(0);
  });
}

// Main function to run the typing test
function runTypingTest() {
  const wordList = generateWords(wordCount);

  console.log(chalk.cyan(figlet.textSync('CLI Monkeytype', { horizontalLayout: 'full' })));
  console.log(chalk.gray('Press any key to start...'));

  process.stdin.on('keypress', (ch, key) => {
    // Handle initial start
    if (!startTime && key) {
      startTime = new Date();
      displayTest(wordList);
      return;
    }

    // Handle ESC key to quit
    if (key && key.name === 'escape') {
      process.exit(0);
    }

    // Handle backspace
    if (key && key.name === 'backspace') {
      if (userInput.length > 0) {
        userInput = userInput.slice(0, -1);
      }
      displayTest(wordList);
      return;
    }

    // Handle space (move to next word)
    if (ch === ' ') {
      if (userInput.length > 0) {
        if (userInput !== wordList[currentWordIndex]) {
          mistakes += Math.abs(wordList[currentWordIndex].length - userInput.length);
          for(let i = 0; i < Math.min(userInput.length, wordList[currentWordIndex].length); i++) {
            if(userInput[i] !== wordList[currentWordIndex][i]) {
              mistakes++;
            }
          }
        }
        totalTyped += wordList[currentWordIndex].length + 1;
        currentWordIndex++;
        userInput = '';

        if (currentWordIndex >= wordList.length) {
          const endTime = new Date();
          showResults(endTime);
          return;
        }
        displayTest(wordList);
      }
      return;
    }

    // Handle regular character input
    if (ch && !ch.match(/[^\x20-\x7e]/)) {
      userInput += ch;
      displayTest(wordList);
    }
  });

  if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(true);
    process.stdin.resume();
  } else {
    console.log(chalk.yellow('Warning: Not running in a TTY terminal. Some features might not work correctly.'));
    process.exit(1);
  }
}

// Display help if no arguments are provided
if (args.length === 0) {
  displayHelp();
  console.log(chalk.cyan('\nStarting test with default settings...'));
  setTimeout(() => {
    runTypingTest();
  }, 2000)
} else {
  runTypingTest();
}
