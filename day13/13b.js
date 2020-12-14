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
  const buses = lines[1]
    .split(",")
    .map((n, i) => (n === "x" ? "x" : { i, n: Number(n) }))
    .filter((bus) => bus !== "x");
  // console.log(buses);
  return buses;
}

function mod(a, n) {
  return ((a % n) + n) % n;
}

function testSolution(n, buses) {
  return buses.reduce((acc, cur) => {
    // debug console.log(`(${n} + ${cur.i}) % ${cur.n} = ${((n + cur.i) % cur.n)}`)
    return acc && (n + cur.i) % cur.n === 0;
  }, true);
}

// Chinese Remainder Theorem
// Returns the smallest number x such that:
//  x % num[0] = rem[0],
//  x % num[1] = rem[1],
//  ..................
//  x % num[k-2] = rem[k-1]
function chineseRemainderTheorem(num, rem) {
  const crt = require("./chinese-remainder-theorem");

  // DEBUG https://www.dcode.fr/chinese-remainder
  // DEBUG console.log(num);
  // DEBUG console.log(rem);

  return crt(num, rem);
}

function solver(buses) {
  const num = buses.map((bus) => bus.n);
  const rem = buses.map((bus) => mod(bus.n - bus.i, bus.n));

  const n = chineseRemainderTheorem(num, rem);

  console.log("solution:", n);
}

function solverBruteForce(buses) {
  let n = 0;
  let found = false;

  while (!found) {
    // debug console.log(n);
    if (testSolution(n, buses)) {
      console.log("solution:", n);
      found = true;
    }
    n++;
  }
}

readInterface
  .on("line", function (line) {
    lines.push(line);
  })
  .on("close", function () {
    solver(parse(lines));
  });
