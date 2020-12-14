"use strict";

/**
 * https://adventofcode.com/2020/day/11
 * cat input.txt|node 11b.js
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

function checkOccupied(fromI, fromJ, dirI, dirJ) {
  let seat;
  let i = dirI;
  let j = dirJ;
  while ((seat = getSeat(fromI + i, fromJ + j))) {
    i += dirI;
    j += dirJ;
    if (seat === "#") return true;
    if (seat === "L") return false;
  }

  return false;
}

function countOccupiedSeatsAdjacent(i, j) {
  let count = 0;

  if (checkOccupied(i, j, -1, -1)) count++;
  if (checkOccupied(i, j, -1, 1)) count++;
  if (checkOccupied(i, j, -1, 0)) count++;
  if (checkOccupied(i, j, 0, -1)) count++;
  if (checkOccupied(i, j, 0, 1)) count++;
  if (checkOccupied(i, j, 1, -1)) count++;
  if (checkOccupied(i, j, 1, 1)) count++;
  if (checkOccupied(i, j, 1, 0)) count++;

  return count;
}

function applyRules() {
  lastSeats = clone(seats);
  for (let i = 0; i < lastSeats.length; i++) {
    const row = lastSeats[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === "L" && !areThereOccupiedSeatsAdjacent(i, j)) {
        seats[i][j] = "#";
      } else if (row[j] === "#" && countOccupiedSeatsAdjacent(i, j) >= 5) {
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
    lastSeats = clone(seats); // end debug

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
