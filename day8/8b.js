"use strict";

/**
 * https://adventofcode.com/2020/day/8
 * cat input.txt|node 8b.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const code = [];
const versionedCode = [];
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

function reset() {
  acc = 0;
  currentLine = 0;
  for (let i = 0; i < code.length; i++) {
    versionedCode[i][EXECUTED_POSITION] = false;
    versionedCode[i][COMMAND_POSITION] = code[i][COMMAND_POSITION];
  }
}

function changeCode(targetCandidateToChange = 0) {
  // console.log("target", targetCandidateToChange);
  let candidatesToChangeCounter = 0;

  for (let i = 0; i < versionedCode.length; i++) {
    const line = versionedCode[i];
    let command = line[COMMAND_POSITION];
    if (command === "nop" || command === "jmp") {
      if (candidatesToChangeCounter === targetCandidateToChange) {
        line[COMMAND_POSITION] = command === "jmp" ? "nop" : "jmp";
      }
      candidatesToChangeCounter++;
    }
  }
}

function print(program) {
  console.log(program.map((line) => line[0] + " " + line[1]).join("\n"));
}

function run() {
  // print(versionedCode);
  while (currentLine < versionedCode.length) {
    const line = versionedCode[currentLine];
    let command = line[COMMAND_POSITION];
    // console.log("debug", command, line[ARG_POSITION]);
    if (line[EXECUTED_POSITION]) {
      throw new Error("duplicated line of code: " + currentLine);
    }

    line[EXECUTED_POSITION] = true;
    args[command](line[ARG_POSITION]);
  }
  return acc;
}

readInterface
  .on("line", function (line) {
    const [command, arg, executed] = [...line.split(" "), false];
    code.push([command, Number(arg), executed]);
    versionedCode.push([command, Number(arg), executed]);
  })
  .on("close", function () {
    for (let i = 0; i < code.length; i++) {
      try {
        reset();
        changeCode(i);
        run();
        console.log("acc:", acc, "line:", i);
        process.exit(0);
      } catch (e) {
        // console.log(e.message);
      }
    }
    process.exit(-1);
  });
