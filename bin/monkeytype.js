#!/usr/bin/env node

const chalk = require('chalk');
const keypress = require('keypress');

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
    console.log(chalk.blue('CLI Monkeytype - Typing Test'));
    console.log(chalk.gray('============================\n'));
    console.log(chalk.white('Usage: monkeytype [options]\n'));
    console.log(chalk.white('Options:'));
    console.log(chalk.white('  -w, --words <number>   Set the number of words for the test (default: 30)'));
    console.log(chalk.white('  -h, --help             Display this help message\n'));
    console.log(chalk.white('Controls:'));
    console.log(chalk.white('  Type words as they appear highlighted in yellow'));
    console.log(chalk.white('  Press SPACE to submit each word'));
    console.log(chalk.white('  Press ESC to quit at any time\n'));
    process.exit(0);
  }
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
  // Clear terminal (cross-platform)
  if (process.platform === 'win32') {
    process.stdout.write('\x1Bc');
  } else {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
  }
  
  console.log(chalk.blue('CLI Monkeytype - Typing Test'));
  console.log(chalk.gray(`Words: ${wordCount} | Press ESC to quit\n`));
  
  // Display words with highlighting
  for (let i = 0; i < wordList.length; i++) {
    if (i < currentWordIndex) {
      // Already typed words
      process.stdout.write(chalk.green(wordList[i] + ' '));
    } else if (i === currentWordIndex) {
      // Current word
      process.stdout.write(chalk.yellow.underline(wordList[i] + ' '));
    } else {
      // Upcoming words
      process.stdout.write(chalk.white(wordList[i] + ' '));
    }
  }
  
  process.stdout.write('\n\n');
  
  // Display user input with feedback
  if (userInput.length > 0) {
    const currentWord = wordList[currentWordIndex];
    if (userInput === currentWord.substring(0, userInput.length)) {
      process.stdout.write(chalk.green(userInput));
    } else {
      process.stdout.write(chalk.red(userInput));
      mistakes++;
    }
  }
  
  process.stdout.write('\n');
}

// Calculate and display results
function showResults(wordList, endTime) {
  const timeTaken = (endTime - startTime) / 1000; // in seconds
  const wordsPerMinute = Math.round((totalTyped / 5) / (timeTaken / 60));
  const accuracy = Math.round(((totalTyped - mistakes) / totalTyped) * 100);
  
  // Clear terminal (cross-platform)
  if (process.platform === 'win32') {
    process.stdout.write('\x1Bc');
  } else {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
  }
  
  console.log(chalk.blue('Test Results:'));
  console.log(chalk.gray('============='));
  console.log(chalk.white(`Time: ${timeTaken.toFixed(2)} seconds`));
  console.log(chalk.white(`Words Per Minute (WPM): ${wordsPerMinute}`));
  console.log(chalk.white(`Accuracy: ${accuracy}%`));
  console.log(chalk.white(`Characters Typed: ${totalTyped}`));
  console.log(chalk.white(`Mistakes: ${mistakes}`));
  console.log('\n' + chalk.green('Press any key to exit...'));
  
  // Wait for a keypress to exit
  process.stdin.once('keypress', () => {
    process.exit(0);
  });
}

// Main function to run the typing test
function runTypingTest() {
  const wordList = generateWords(wordCount);
  
  console.log(chalk.blue('CLI Monkeytype - Typing Test'));
  console.log(chalk.gray(`Words: ${wordCount} | Press any key to start...`));
  
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
      userInput = userInput.slice(0, -1);
      displayTest(wordList);
      return;
    }
    
    // Handle space (move to next word)
    if (ch === ' ') {
      if (userInput === wordList[currentWordIndex]) {
        currentWordIndex++;
        userInput = '';
        totalTyped++;
        
        // Check if test is complete
        if (currentWordIndex >= wordList.length) {
          const endTime = new Date();
          showResults(wordList, endTime);
          return;
        }
        
        displayTest(wordList);
      }
      return;
    }
    
    // Handle regular character input
    if (ch) {
      userInput += ch;
      totalTyped++;
      displayTest(wordList);
    }
  });
  
  // Check if we're running in TTY mode and setRawMode is available before setting raw mode
  if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(true);
    process.stdin.resume();
  } else {
    // Try to run anyway, but warn the user
    console.log(chalk.yellow('Warning: Not running in a TTY terminal or setRawMode is not available. Some features may not work correctly.'));
    console.log(chalk.yellow('For best experience, run this application in a terminal that supports TTY mode.'));
    process.exit(1);
  }
}

// Run the typing test
runTypingTest();
