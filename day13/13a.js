"use strict";

/**
 * https://adventofcode.com/2020/day/13
 * cat input.txt|node 13a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const lines = [];
function parse(lines) {
  const params = {};
  params.earliestTimestamp = Number(lines[0]);
  params.buses = lines[1]
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
  // console.log(params);
  return params;
}

function findFirstBus(params) {
  let timestamp = params.earliestTimestamp;
  while (timestamp) {
    params.buses.forEach((bus) => {
      if (timestamp % bus === 0) {
        console.log("first bus", bus, "at", timestamp);
        console.log("solution:", bus * (timestamp - params.earliestTimestamp));
        process.exit(0);
      }
    });
    timestamp++;
  }
}

readInterface
  .on("line", function (line) {
    lines.push(line);
  })
  .on("close", function () {
    findFirstBus(parse(lines));
  });
