"use strict";

/**
 * https://adventofcode.com/2020/day/14
 * cat input.txt|node 14b.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

let mask = "000000000000000000000000000000000000";
const mem = {};

function sumValue() {
  return Object.values(mem).reduce((acc, cur) => acc + cur, 0);
}

function getVariantsOfX(s, combs) {
  if (s.indexOf("X") === -1) {
    combs.add(s);
  } else {
    getVariantsOfX(s.replace("X", "0"), combs);
    getVariantsOfX(s.replace("X", "1"), combs);
  }
}

function padWithZeros(s) {
  return ("000000000000000000000000000000000000" + s).slice(-36);
}

function applyMask(n) {
  // console.log(orMask, '|', n, '=', BigInt(n) | orMask); // debug
  // console.log(andMask, '&', BigInt(n) | orMask, '=', (BigInt(n) | orMask) & andMask); // debug

  // (BigInt(n) | orMask) & andMask;
  const m = mask.split("");
  padWithZeros(n.toString(2))
    .split("")
    .forEach((v, i) => {
      if (v === "1" && m[i] === "0") {
        m[i] = 1;
      }
    });
  const combinations = new Set();
  getVariantsOfX(m.join(""), combinations);
  // console.log(combinations); // debug

  return [...combinations];
}

function setMem(pos, value) {
  const memPositions = applyMask(pos);
  memPositions.forEach((p) => {
    mem[p] = value;
  });

  // console.log(memPositions); // debug
}

function run(line) {
  console.log(line); // debug
  if (line.startsWith("mask")) {
    const [, newMask] = line.split(" = ");
    mask = newMask;
  } else {
    const [, pos, value] = /mem\[(\d+)\] = (\d+)/.exec(line);
    setMem(Number(pos), Number(value));
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
