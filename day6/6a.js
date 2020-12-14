"use strict";

/**
 * https://adventofcode.com/2020/day/6
 * cat input.txt|node 6a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

let group = [];

function processGroup(group) {
  const letters = new Set();
  group.forEach((line) => {
    line.split("").forEach((letter) => {
      letters.add(letter);
    });
  });
  return letters;
}

const groups = [];

readInterface
  .on("line", function (line) {
    if (line === "") {
      groups.push(processGroup(group));
      group = [];
    } else {
      group.push(line);
    }
  })
  .on("close", function () {
    groups.push(processGroup(group));
    const sum = groups
      .map((set) => set.size)
      .reduce((acc, curr) => acc + curr, 0);
    console.log(sum);
  });
