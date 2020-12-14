"use strict";

/**
 * https://adventofcode.com/2020/day/{{hyphenate day}}
 * cat input.txt|node {{hyphenate day}}a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

function parse(line) {
  // TODO
  console.log(line);
  return line;
}

readInterface
  .on("line", function (line) {
    parse(line);
  })
  .on("close", function () {
    console.log("TODO");
  });
