"use strict";

/**
 * https://adventofcode.com/2020/day/18
 * cat input.txt|node 18b.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

function parse(line) {
  const solved = solve(line);
  console.log("expression:", line, solved);
  return solved;
}

function sumPrecedence(t) {
  // DEBUG console.log("sumPrecedence(", t, ")");

  let thereAreGroups = true;

  while (thereAreGroups) {
    const re = /(\d+\s*\+\s*\d+)/;
    const exd = re.exec(t);
    if (!exd) {
      thereAreGroups = false;
    } else {
      const [, ...p] = exd;
      t = t.replace(re, eval(p[0]));
    }
  }
  return eval(t);
}

function solve(t) {
  // DEBUG console.log('solve(', t, ')');

  let thereAreGroups = true;

  while (thereAreGroups) {
    const re = /\(([^)(]+)\)/;
    const exd = re.exec(t);
    if (!exd) {
      thereAreGroups = false;
    } else {
      const [, ...p] = exd;
      t = t.replace(re, solve(...p));
    }
  }
  return sumPrecedence(t);
}

let sum = 0;

readInterface
  .on("line", function (line) {
    sum += parse(line);
  })
  .on("close", function () {
    console.log("sum:", sum);
  });
