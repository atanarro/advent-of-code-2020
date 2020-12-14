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

const occupiedSeats = new Set();

readInterface
  .on("line", function (line) {
    const id = boardingPassToId(line);
    occupiedSeats.add(id);
  })
  .on("close", function () {
    for (let row = 1; row < 126; row++) {
      for (let col = 0; col < 8; col++) {
        const id = positionToId(row + 1, col + 1);
        if (!occupiedSeats.has(id)) {
          console.log(`${id} is my seat!`);
          process.exit(0);
        }
      }
    }
    process.exit(1); // my seat was not found
  });
