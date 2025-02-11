"use strict";

/**
 * https://adventofcode.com/2020/day/15
 * cat input.txt|node 15.js --nth 2020
 * cat input.txt|node 15.js --nth 30000000 # it takes a moment:
 * 		node 15.js --nth 30000000  15,98s user 0,43s system 155% cpu 10,577 total
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

// using this map instead of a plain {} means a significant speed improvement.
// The reason according to MDN is that
// "performs better in scenarios involving frequent additions and removals of key-value pairs."
const numbers = new Map();
let currentAge = 0;
let lastNumber = 0;

function parse(line) {
  const startingNumbers = line.split(",");
  startingNumbers.forEach((n, i) => {
    numbers.set(Number(n), { last: i + 1, beforeThanLast: i + 1 });
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
      if (!numbers.has(lastNumber)) {
        numbers.set(lastNumber, {
          last: currentAge - 1,
          beforeThanLast: currentAge - 1,
        });
        lastNumber = 0;
      } else {
        numbers.set(lastNumber, {
          beforeThanLast: numbers.get(lastNumber).last,
          last: currentAge - 1,
        });
        // DEBUG console.log(numbers[lastNumber], newLastNumber);
        lastNumber =
          numbers.get(lastNumber).last - numbers.get(lastNumber).beforeThanLast;
      }
      currentAge++;
    }

    console.log(lastNumber);
  });
