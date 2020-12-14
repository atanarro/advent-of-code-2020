"use strict";

/**
 * https://adventofcode.com/2020/day/10
 * cat input.txt|node 10a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const input = [];

readInterface
  .on("line", function (line) {
    input.push(Number(line));
  })
  .on("close", function () {
    input.sort((a, b) => a - b);
    const count = input.reduce(
      function (acc, n) {
        acc["joltDiff" + (n - acc.prev)]++;
        acc.prev = n;
        return acc;
      },
      {
        prev: 0,
        joltDiff1: 0,
        joltDiff2: 0,
        joltDiff3: 0,
      }
    );

    count.joltDiff3++;

    console.log(count);
    console.log(count.joltDiff1 * count.joltDiff3);
  });
