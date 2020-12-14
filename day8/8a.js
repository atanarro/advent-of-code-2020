"use strict";

/**
 * https://adventofcode.com/2020/day/8
 * cat input.txt|node 8a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const code = [];
let currentLine = 0;
let acc = 0;

const [COMMAND_POSITION, ARG_POSITION, EXECUTED_POSITION] = [0, 1, 2];

const args = {
  nop() {
    currentLine++;
  },
  acc(arg) {
    acc += arg;
    currentLine++;
  },
  jmp(arg) {
    currentLine += arg;
  },
};

function run() {
  while (currentLine <= code.length) {
    const line = code[currentLine];
    // console.log("debug", line[COMMAND_POSITION], line[ARG_POSITION]);
    if (line[EXECUTED_POSITION]) {
      console.log("duplicated line of code: " + currentLine);
      return acc;
    }

    line[EXECUTED_POSITION] = true;
    args[line[COMMAND_POSITION]](line[ARG_POSITION]);
  }
}

readInterface
  .on("line", function (line) {
    const [command, arg, executed] = [...line.split(" "), false];
    code.push([command, Number(arg), executed]);
  })
  .on("close", function () {
    run();
    console.log(acc);
  });
