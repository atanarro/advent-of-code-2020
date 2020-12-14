"use strict";

/**
 * https://adventofcode.com/2020/day/3
 * cat input.txt|node 3a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const mountain = [];

function checkTrees(right, down) {
  const width = mountain[0].length;
  const heigth = mountain.length;

  let trees = 0;

  let currentRow = 0;
  let currentCol = 0;

  while (currentRow < heigth - 1) {
    currentRow = currentRow + down;
    currentCol = (currentCol + right) % width;
    // console.log(currentRow , '-', mountain[currentRow])
    if (mountain[currentRow][currentCol] === "#") {
      trees++;
    }
  }
  return trees;
}

readInterface
  .on("line", function (line) {
    mountain.push(line);
  })
  .on("close", function () {
    console.log(checkTrees(3, 1));
  });
