"use strict";

/**
 * https://adventofcode.com/2020/day/20
 * cat input.txt|node 20a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

let currentTileId, currentTile;
const tiles = {};

function parseTile(line) {
  currentTileId = Number(line.split(/[ :]/)[1]);
  currentTile = [];
}

function parse(line) {
  currentTile.push(line);
}

function addCurrentTileToMap() {
  tiles[currentTileId] = currentTile;
}

function getSide(tile, side) {
  const ops = {
    top() {
      return tile[0];
    },
    bottom() {
      return tile[tile.length - 1].split("").reverse().join("");
    },
    left() {
      return tile
        .map((r) => r[0])
        .reverse()
        .join("");
    },
    right() {
      return tile.map((r) => r[r.length - 1]).join("");
    },
    topRev() {
      return ops.top().split("").reverse().join("");
    },
    bottomRev() {
      return ops.bottom().split("").reverse().join("");
    },
    leftRev() {
      return ops.left().split("").reverse().join("");
    },
    rightRev() {
      return ops.right().split("").reverse().join("");
    },
  };

  return ops[side]();
}

function stringify(tile) {
  return "Tile " + tile + ":\n" + tiles[tile].join("\n");
}

readInterface
  .on("line", function (line) {
    if (line === "") {
      addCurrentTileToMap();
      return;
    }
    if (line.startsWith("Tile")) {
      parseTile(line);
      return;
    }

    parse(line);
  })
  .on("close", function () {
    // DEBUG console.log(tiles);

    const squareSide = Math.sqrt(Object.keys(tiles).length);

    // DEBUG
    console.log(`${squareSide}x${squareSide}`);

    const tls = Object.keys(tiles).reduce((acc, id) => {
      acc[id] = {
        top: getSide(tiles[id], "top"),
        bottom: getSide(tiles[id], "bottom"),
        left: getSide(tiles[id], "left"),
        right: getSide(tiles[id], "right"),
        topRev: getSide(tiles[id], "topRev"),
        bottomRev: getSide(tiles[id], "bottomRev"),
        leftRev: getSide(tiles[id], "leftRev"),
        rightRev: getSide(tiles[id], "rightRev"),
      };
      return acc;
    }, {});

    // DEBUG console.log(tls);

    const grouped = Object.keys(tls).reduce((acc, id) => {
      [
        "top",
        "bottom",
        "left",
        "right",
        "topRev",
        "bottomRev",
        "leftRev",
        "rightRev",
      ].forEach((side) => {
        if (acc[tls[id][side]]) {
          acc[tls[id][side]].push(id);
        } else {
          acc[tls[id][side]] = [id];
        }
      });
      return acc;
    }, {});

    const corners = Object.keys(tls).filter((tile) => {
      // count how many sides are paired
      let count = 0;
      ["top", "bottom", "left", "right"].forEach((side) => {
        if (grouped[tls[tile][side]].length > 1) count++;
      });

      // console.log(tile, count);

      return count === 2;
    });

    console.log(corners);
    console.log(corners.map(Number).reduce((a, c) => a * c, 1));
  });
