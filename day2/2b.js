"use strict";

/**
 * https://adventofcode.com/2020/day/2
 * cat input.txt|node 2b.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

let validCount = 0;

function ruleToRegExp(rule) {
  const [range, letter] = rule.split(" ");
  return new RegExp(`${letter}{${range.replace("-", ",")}}`);
}

function xor(a, b) {
  return (a && !b) || (!a && b);
}

function validate(line) {
  const [rule, password] = line.split(": ");
  const [range, letter] = rule.split(" ");
  const [position1, position2] = range.split("-").map(Number);

  // console.log([min, max, letter, password, letterCount]);

  return xor(
    password[position1 - 1] === letter,
    password[position2 - 1] === letter
  );
}

readInterface
  .on("line", function (line) {
    const valid = validate(line);
    if (valid) validCount++;
  })
  .on("close", function () {
    console.log(validCount);
  });
