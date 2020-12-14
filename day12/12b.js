"use strict";

/**
 * https://adventofcode.com/2020/day/12
 * cat input.txt|node 12b.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const coords = { x: 0, y: 0 };
const waypoint = { x: 10, y: 1 };
let angle = 0;

function manhattanDistance() {
  return Math.abs(coords.x) + Math.abs(coords.y);
}

function parse(line) {
  const parsed = /([NSEWLRF])(\d+)/.exec(line);
  const [action, value] = [parsed[1], Number(parsed[2])];
  return { action, value };
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function rotatePoint(cx, cy, angle, p) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  // translate point back to origin
  p.x -= cx;
  p.y -= cy;

  // rotate point
  const xnew = p.x * c - p.y * s;
  const ynew = p.x * s + p.y * c;

  // translate point back
  return {
    x: Math.round(xnew + cx),
    y: Math.round(ynew + cy),
  };
}

function turnWaypoint(value) {
  const rotated = rotatePoint(0, 0, degToRad(-value), waypoint);
  waypoint.x = rotated.x;
  waypoint.y = rotated.y;
}

function moveWaypoint(x, y, value) {
  waypoint.x += x * value;
  waypoint.y += y * value;
}

function moveShip(value) {
  coords.x += waypoint.x * value;
  coords.y += waypoint.y * value;
}

function move({ action, value }) {
  const actionsMap = {
    N: () => moveWaypoint(0, 1, value),
    S: () => moveWaypoint(0, -1, value),
    E: () => moveWaypoint(1, 0, value),
    W: () => moveWaypoint(-1, 0, value),
    L: () => turnWaypoint(-value),
    R: () => turnWaypoint(value),
    F: () => moveShip(value),
  };
  actionsMap[action]();

  // debug
  console.log(
    action + value,
    "\t| waypoint east",
    waypoint.x,
    "north",
    waypoint.y,
    "\t| ship east",
    coords.x,
    "north",
    coords.y
  );
}

readInterface
  .on("line", function (line) {
    move(parse(line));
  })
  .on("close", function () {
    console.log(manhattanDistance());
  });
