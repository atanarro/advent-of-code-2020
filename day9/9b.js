#!/usr/bin/env node

"use strict";
/**
 * https://adventofcode.com/2020/day/9
 * cat sample.txt|node 9b.js --preamble 5
 * cat input.txt|node 9b.js
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

function sumMinMax(from, to) {
  let min = +Infinity;
  let max = -Infinity;
  for (let i = from; i <= to; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }

    if (numbers[i] < min) {
      min = numbers[i];
    }
  }
  return min + max;
}

function findEncryptionWeakness(pos) {
  const target = numbers[pos];
  for (let from = 1; from < pos; from++) {
    let sum = 0;
    for (let i = from; i < pos; i++) {
      sum += numbers[i];
      if (sum === target) {
        // console.log(numbers.slice(from, i+1), sumMinMax(from, i));
        return sumMinMax(from, i);
      }
    }
  }
}

readInterface
  .on("line", function (line) {
    numbers.push(Number(line));
  })
  .on("close", function () {
    // console.log(numbers);

    for (let i = PREABLE; i < numbers.length; i++) {
      if (!checkNumber(i)) {
        /* the first number in the list (after the preamble) which is not the sum of two of the ${PREABLE} numbers before it */
        console.log("first number without the property", numbers[i]);
        console.log("encryption weakness:", findEncryptionWeakness(i));
        process.exit(0);
      }
    }
    process.exit(-1);
  });
