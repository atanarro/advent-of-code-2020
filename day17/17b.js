"use strict";

/**
 * https://adventofcode.com/2020/day/17
 * cat input.txt|node 17b.js --verbose --cycles 6
 */

const yargs = require("yargs/yargs");
const argv = yargs(process.argv).argv;

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const verbose = argv.verbose;
const cycles = Number(argv.cycles) || 6;
const space = new Map();
let lastSpace = new Map();

const spaceLimits = {
  x: { from: 0, to: 0 },
  y: { from: 0, to: 0 },
  z: { from: 0, to: 0 },
  w: { from: 0, to: 0 },
};

function c2k(...coords) {
  return coords.join(",");
}

function stringify(space) {
  let str = "";
  for (let k = spaceLimits.z.from; k <= spaceLimits.z.to; k++) {
    for (let l = spaceLimits.w.from; l <= spaceLimits.w.to; l++) {
      str += `z=${k}, w=${l}\n`;
      for (let i = spaceLimits.x.from; i <= spaceLimits.x.to; i++) {
        for (let j = spaceLimits.y.from; j <= spaceLimits.y.to; j++) {
          str += space.get(c2k(i, j, k, l)) === "#" ? "#" : ".";
        }
        str += `\n`;
      }
      str += `\n`;
    }
  }
  return str;
}

function clone(space) {
  return new Map(space);
}

function getSpace(space, i, j, k, l) {
  return space.get(c2k(i, j, k, l));
}

function setSpace(space, i, j, k, l, value) {
  if (value === "#") {
    if (i < spaceLimits.x.from) {
      spaceLimits.x.from = i;
    }
    if (i > spaceLimits.x.to) {
      spaceLimits.x.to = i;
    }
    if (j < spaceLimits.y.from) {
      spaceLimits.y.from = j;
    }
    if (j > spaceLimits.y.to) {
      spaceLimits.y.to = j;
    }
    if (k < spaceLimits.z.from) {
      spaceLimits.z.from = k;
    }
    if (k > spaceLimits.z.to) {
      spaceLimits.z.to = k;
    }
    if (l < spaceLimits.w.from) {
      spaceLimits.w.from = l;
    }
    if (l > spaceLimits.w.to) {
      spaceLimits.w.to = l;
    }
  }
  space.set(c2k(i, j, k, l), value);
}

function countActiveNeighbors(x, y, z, w) {
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          if (i === 0 && j === 0 && k === 0 && l === 0) {
          } else if (getSpace(lastSpace, x + i, y + j, z + k, w + l) === "#")
            count++;
        }
      }
    }
  }
  return count;
}

function applyRules() {
  for (let i = spaceLimits.x.from - 1; i <= spaceLimits.x.to + 1; i++) {
    for (let j = spaceLimits.y.from - 1; j <= spaceLimits.y.to + 1; j++) {
      for (let k = spaceLimits.z.from - 1; k <= spaceLimits.z.to + 1; k++) {
        for (let l = spaceLimits.w.from - 1; l <= spaceLimits.w.to + 1; l++) {
          const countNeighbors = countActiveNeighbors(i, j, k, l);

          if (getSpace(lastSpace, i, j, k, l) === "#") {
            if (countNeighbors < 2 || countNeighbors > 3)
              setSpace(space, i, j, k, l, ".");
          } else {
            if (countNeighbors === 3) {
              setSpace(space, i, j, k, l, "#");
            }
          }
        }
      }
    }
  }
}

function countOccupied(space) {
  let count = 0;
  space.forEach((value) => {
    if (value === "#") count++;
  });
  return count;
}

let lineCount = 0;

readInterface
  .on("line", function (line) {
    line.split("").forEach((l, y) => {
      if (l === "#") {
        setSpace(space, lineCount, y, 0, 0, "#");
      }
    });
    lineCount++;
  })
  .on("close", function () {
    let i = 0;
    if (verbose) {
      console.log("--- cycle:", i);
      console.log(stringify(space));
    }

    while (i < cycles) {
      lastSpace = clone(space);
      applyRules();
      i++;
      if (verbose) {
        console.log("--- cycle:", i);
        console.log(stringify(space));
      }
    }

    console.log(countOccupied(space));
  });
