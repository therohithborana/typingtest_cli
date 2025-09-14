# CLI Monkeytype

A command-line typing test application inspired by Monkeytype, built with Node.js.

## Features

- Real-time typing test in your terminal
- Word-per-minute (WPM) calculation
- Accuracy tracking
- Colorful terminal interface
- Customizable word count

## Installation

### Method 1: Local Installation (Recommended for now)
Clone or download this repository, then navigate to the project directory and run:

```bash
npm install -g .
```

### Method 2: Direct Execution
Clone or download this repository, then navigate to the project directory and run:

```bash
npm start
```
or
```bash
node ./bin/monkeytype.js
```

### Published 
This package is published to npm, therefore simply run

```bash
npm install -g cli-monkeytype
```

Or direct execution with npx:

```bash
npx cli-monkeytype
```

## Usage

After installation, simply run:

```bash
monkeytype
```

You can also customize the number of words for the test:

```bash
monkeytype --words 50
```

Or get help with:

```bash
monkeytype --help
```

Then press any key to start the test. Type the words as they appear highlighted in yellow. Press SPACE to submit each word. Press ESC to quit at any time.

## Development

To run the application from source:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```
   or
   ```bash
   node ./bin/monkeytype.js
   ```

## How It Works

1. The application generates a sequence of random words
2. You type each word exactly as shown
3. Correct words turn green, incorrect typing turns red
4. After completing all words, you'll see your results:
   - Time taken
   - Words per minute (WPM)
   - Accuracy percentage
   - Total characters typed
   - Number of mistakes

## Requirements

- Node.js 12 or higher
- A terminal that supports TTY mode for the best experience

## License

MIT
