"use strict";

/**
 * https://adventofcode.com/2020/day/15
 * cat input.txt|node 15.js --nth 2020
 * cat input.txt|node 15.js --nth 30000000 # it takes a while:
 * 		node 15.js --nth 30000000  345,55s user 16,94s system 107% cpu 5:37,73 total
 */

const yargs = require("yargs/yargs");
const argv = yargs(process.argv).argv;
const nth = Number(argv.nth || 2020);

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const numbers = {};
let currentAge = 0;
let lastNumber = 0;

function parse(line) {
  const startingNumbers = line.split(",");
  startingNumbers.forEach((n, i) => {
    numbers[n] = { last: i + 1, beforeThanLast: i + 1 };
    lastNumber = Number(n);
  });
  currentAge = startingNumbers.length + 1;

  if (nth <= startingNumbers.length) {
    throw new Error(
      `nth should be greater than ${startingNumbers.length} for this input!`
    );
  }
}

readInterface
  .on("line", function (line) {
    parse(line);
  })
  .on("close", function () {
    // DEBUG console.log(numbers, currentAge, lastNumber);

    while (currentAge <= nth) {
      // DEBUG console.log('Turn:', currentAge, 'lastNumber:', lastNumber);
      // DEBUG if (currentAge % 100000 === 0) console.log('Turn:', currentAge, 'numbersSize');
      if (!numbers[lastNumber]) {
        numbers[lastNumber] = {
          last: currentAge - 1,
          beforeThanLast: currentAge - 1,
        };
        lastNumber = 0;
      } else {
        numbers[lastNumber].beforeThanLast = numbers[lastNumber].last;
        numbers[lastNumber].last = currentAge - 1;
        const newLastNumber =
          numbers[lastNumber].last - numbers[lastNumber].beforeThanLast;
        // DEBUG console.log(numbers[lastNumber], newLastNumber);
        lastNumber = newLastNumber;
      }

      currentAge++;
    }

    console.log(lastNumber);
  });
