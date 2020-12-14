"use strict";

/**
 * https://adventofcode.com/2020/day/2
 * cat input.txt|node 2a.js
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
const validate = function (line) {
  const [rule, password] = line.split(": ");
  const [range, letter] = rule.split(" ");
  const [min, max] = range.split("-").map(Number);

  const letterCount =
    password.length - password.replace(new RegExp(letter, "g"), "").length;

  // console.log([min, max, letter, password, letterCount]);

  return letterCount >= min && letterCount <= max; // ruleToRegExp(rule).test(password);
};

readInterface
  .on("line", function (line) {
    const valid = validate(line);
    if (valid) validCount++;
  })
  .on("close", function () {
    console.log(validCount);
  });
