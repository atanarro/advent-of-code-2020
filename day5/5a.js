"use strict";

/**
 * https://adventofcode.com/2020/day/5
 * cat input.txt|node 5a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

let maxId = 0;

function positionToId(row, col) {
  return row * 8 + col;
}

function binarySearch(seq) {
  const size = 2 ** seq.length;
  let min = 0;
  let max = size - 1;
  for (let i = 0; i < seq.length; i++) {
    const diff = max - min;
    // console.log('diff', diff, 'min', min, ';max', max, 'seq[i]',seq[i])
    if (seq[i] === "<") {
      max = min + Math.floor(diff / 2);
    } else {
      min = min + Math.ceil(diff / 2);
    }
  }
  return min; // mix === max now
}

function boardingPassToId(binarySeat) {
  const row = binarySearch(
    binarySeat.substr(0, 7).replace(/F/g, "<").replace(/B/g, ">")
  );
  const col = binarySearch(
    binarySeat.substr(-3).replace(/L/g, "<").replace(/R/g, ">")
  );
  return positionToId(row, col);
}

readInterface
  .on("line", function (line) {
    const id = boardingPassToId(line);
    if (id > maxId) {
      maxId = id;
    }
  })
  .on("close", function () {
    console.log(maxId);
  });
