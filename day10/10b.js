"use strict";

/**
 * https://adventofcode.com/2020/day/10
 * cat input.txt|node 10b.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const input = [];
let max = 0;

function findWays() {
  return input.reduce(
    (ways, n) => {
      ways[n] = 0;
      if (ways[n - 1]) ways[n] += ways[n - 1];
      if (ways[n - 2]) ways[n] += ways[n - 2];
      if (ways[n - 3]) ways[n] += ways[n - 3];
      return ways;
    },
    {
      0: 1,
    }
  )[max];
}

readInterface
  .on("line", function (line) {
    const n = Number(line);
    input.push(n);
    if (n > max) {
      max = n;
    }
  })
  .on("close", function () {
    input.sort((a, b) => a - b);

    const ways = findWays();

    console.log(ways);
  });
