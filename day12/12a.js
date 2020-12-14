"use strict";

/**
 * https://adventofcode.com/2020/day/12
 * cat input.txt|node 12a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const coords = { x: 0, y: 0 };
let angle = 0;

function manhattanDistance() {
  return Math.abs(coords.x) + Math.abs(coords.y);
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function parse(line) {
  const parsed = /([NSEWLRF])(\d+)/.exec(line);
  const [action, value] = [parsed[1], Number(parsed[2])];
  return { action, value };
}

function mod(a, n) {
  return ((a % n) + n) % n;
}

function turn(value) {
  angle = mod(angle + value, 360);
}

function moveWithDir(x, y, value) {
  coords.x += x * value;
  coords.y += y * value;
}

function moveForward(value) {
  // console.log(angle, value);
  if (angle === 0) {
    moveWithDir(1, 0, value);
  } else if (angle === 90) {
    moveWithDir(0, -1, value);
  } else if (angle === 180) {
    moveWithDir(-1, 0, value);
  } else {
    // 270 or -90
    moveWithDir(0, 1, value);
  }
}

function move({ action, value }) {
  const actionsMap = {
    N: () => moveWithDir(0, 1, value),
    S: () => moveWithDir(0, -1, value),
    E: () => moveWithDir(1, 0, value),
    W: () => moveWithDir(-1, 0, value),
    L: () => turn(-value),
    R: () => turn(value),
    F: () => moveForward(value),
  };
  actionsMap[action]();

  // debug console.log(action + value, "east", coords.x, "north", coords.y);
}

readInterface
  .on("line", function (line) {
    move(parse(line));
  })
  .on("close", function () {
    console.log(manhattanDistance());
  });
