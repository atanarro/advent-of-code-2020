"use strict";

/**
 * https://adventofcode.com/2020/day/11
 * cat input.txt|node 11a.js --verbose
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

const verbose = argv.verbose;
const seats = [];
let lastSeats;

function stringify(seats) {
  return seats.map((row) => row.join("")).join("\n");
}

function clone(seats) {
  return stringify(seats)
    .split("\n")
    .map((row) => row.split(""));
}

function getSeat(i, j) {
  return (lastSeats[i] || [])[j];
}

function areThereOccupiedSeatsAdjacent(i, j) {
  return countOccupiedSeatsAdjacent(i, j) > 0;
}

function countOccupiedSeatsAdjacent(i, j) {
  let count = 0;

  if (getSeat(i - 1, j - 1) === "#") count++;
  if (getSeat(i - 1, j + 1) === "#") count++;
  if (getSeat(i - 1, j) === "#") count++;
  if (getSeat(i, j - 1) === "#") count++;
  if (getSeat(i, j + 1) === "#") count++;
  if (getSeat(i + 1, j - 1) === "#") count++;
  if (getSeat(i + 1, j + 1) === "#") count++;
  if (getSeat(i + 1, j) === "#") count++;
  return count;
}

function applyRules() {
  lastSeats = clone(seats);
  for (let i = 0; i < lastSeats.length; i++) {
    const row = lastSeats[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === "L" && !areThereOccupiedSeatsAdjacent(i, j)) {
        seats[i][j] = "#";
      } else if (row[j] === "#" && countOccupiedSeatsAdjacent(i, j) >= 4) {
        seats[i][j] = "L";
      }
    }
  }
}

function countOccupied(seats) {
  let count = 0;
  for (let i = 0; i < seats.length; i++) {
    const row = seats[i];
    for (let j = 0; j < row.length; j++) {
      if (seats[i][j] === "#") {
        count++;
      }
    }
  }
  return count;
}

readInterface
  .on("line", function (line) {
    seats.push(line.split(""));
  })
  .on("close", function () {
    lastSeats = clone(seats);

    let i = 1;

    if (verbose) console.log(stringify(seats));
    applyRules();
    if (verbose) {
      console.log("---", i++);
      console.log(stringify(seats));
    }
    while (stringify(lastSeats) !== stringify(seats)) {
      applyRules();
      if (verbose) {
        console.log("---", i++);
        console.log(stringify(seats));
      }
    }

    console.log(countOccupied(seats));
  });
