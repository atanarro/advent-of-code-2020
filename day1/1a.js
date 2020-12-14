"use strict";

/**
 * https://adventofcode.com/2020/day/1
 * cat input.txt|node 1a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const numbers = new Set();

readInterface
  .on("line", function (line) {
    numbers.add(Number(line));
  })
  .on("close", function () {
    // console.log(numbers);
    numbers.forEach(function (number) {
      if (numbers.has(2020 - number)) {
        console.log((2020 - number) * number);
        process.exit(0);
      }
    });
    process.exit(1);
  });
