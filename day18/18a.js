"use strict";

/**
 * https://adventofcode.com/2020/day/18
 * cat input.txt|node 18a.js
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

function lr(t) {
  // DEBUG console.log('lr(', t, ')');

  const f = t.split(/\s/);
  while (f.length > 1) {
    f.unshift(eval(f.shift() + f.shift() + f.shift()));
  }
  return f.pop();
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
  return lr(t);
}

let sum = 0;

readInterface
  .on("line", function (line) {
    sum += parse(line);
  })
  .on("close", function () {
    console.log("sum:", sum);
  });
