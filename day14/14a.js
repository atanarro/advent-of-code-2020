"use strict";

/**
 * https://adventofcode.com/2020/day/14
 * cat input.txt|node 14a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

let mask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const mem = {};

function sumValue() {
  return Object.values(mem).reduce((acc, cur) => acc + cur, BigInt(0));
}

function applyMask(n) {
  const andMask = BigInt("0b" + mask.replace(/[^0]/g, 1));
  const orMask = BigInt("0b" + mask.replace(/[^1]/g, 0));
  // console.log(orMask, '|', n, '=', BigInt(n) | orMask); // debug
  // console.log(andMask, '&', BigInt(n) | orMask, '=', (BigInt(n) | orMask) & andMask); // debug

  return (BigInt(n) | orMask) & andMask;
}

function setMem(pos, value) {
  mem[pos] = applyMask(value);
  // console.log(mem[pos]); // debug
}

function run(line) {
  console.log(line); // debug
  if (line.startsWith("mask")) {
    const [, newMask] = line.split(" = ");
    mask = newMask;
  } else {
    const [, pos, value] = /mem\[(\d+)\] = (\d+)/.exec(line);
    setMem(pos, Number(value));
  }

  return line;
}

readInterface
  .on("line", function (line) {
    run(line);
  })
  .on("close", function () {
    // console.log(mem); // debug
    console.log(sumValue(mem));
  });
