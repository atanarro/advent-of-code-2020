#!/usr/bin/env node

"use strict";
/**
 * https://adventofcode.com/2020/day/9
 * cat sample.txt|node 9a.js --preamble 5
 * cat input.txt|node 9a.js
 */

const yargs = require("yargs/yargs");
const argv = yargs(process.argv).argv;

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const PREABLE = argv.preamble || 25;
const numbers = [];

function checkNumber(pos) {
  const n = numbers[pos];
  const preableList = new Set(numbers.slice(pos - PREABLE, pos));
  // console.log('checking ', n, preableList);

  for (let cand of preableList) {
    const diff = n - cand;
    // console.log(n, diff, cand, preableList.has(diff))
    if (diff !== cand && preableList.has(diff)) {
      return true;
    }
  }

  return false;
}

readInterface
  .on("line", function (line) {
    numbers.push(Number(line));
  })
  .on("close", function () {
    // console.log(numbers);

    for (let i = PREABLE; i < numbers.length; i++) {
      if (!checkNumber(i)) {
        console.log(numbers[i]);
        process.exit(0);
      }
    }
    process.exit(-1);
  });
