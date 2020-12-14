"use strict";

/**
 * https://adventofcode.com/2020/day/6
 * cat input.txt|node 6b.js
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
  let intersection;
  group.forEach((line) => {
    const letters = new Set();
    line.split("").forEach((letter) => {
      letters.add(letter);
    });
    if (!intersection) {
      intersection = [...letters];
    } else {
      intersection = [...intersection].filter((x) => letters.has(x));
    }
  });
  return intersection;
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
      .map((set) => set.length)
      .reduce((acc, curr) => acc + curr, 0);
    console.log(sum);
  });
