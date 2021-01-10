"use strict";

/**
 * https://adventofcode.com/2020/day/20
 * cat input.txt|node 20b.js
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

function stringifyTile(tileId, tile) {
  return "Tile " + tileId + ":\n" + (tile || tiles[tileId]).join("\n");
}

function rotate(tile) {
  const matrix = tile.map((row) => row.split(""));
  return matrix[0]
    .map((val, index) => matrix.map((row) => row[index]).reverse())
    .map((row) => row.join(""));
}

function flip(tile) {
  return tile.map((row) => row.split("").reverse().join(""));
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

    // DEBUG console.log(`${squareSide}x${squareSide}`);

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

    // DEBUG console.log(grouped);

    const corners = Object.keys(tls).filter((tile) => {
      // count how many sides are paired
      let count = 0;
      ["top", "bottom", "left", "right"].forEach((side) => {
        if (grouped[tls[tile][side]].length > 1) count++;
      });
      return count === 2;
    });

    // DEBUG console.log(corners);

    function stringifyPuzzle(puzzle, hSeparator = " ", vSeparator = "\n") {
      let rows = [];

      for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
          for (let k = 0; k < puzzle[i][j].length; k++) {
            const r = i * puzzle[i][j].length + k;
            rows[r] =
              (rows[r] || (k === 0 ? vSeparator : "")) +
              hSeparator +
              puzzle[i][j][k];
          }
        }
      }
      return rows.join("\n");
    }
    function printPuzzle(puzzle) {
      console.log(stringifyPuzzle(puzzle));
    }

    function sideTiles(side) {
      return grouped[side].length;
    }

    function flipUntilOk(puzzle, x, y) {
      // DEBUG console.log('flipUntilOk', x, y)
      function matchSides(x1, y1, x2, y2) {
        const sides1 = [
          getSide(puzzle[x1][y1], "top"),
          getSide(puzzle[x1][y1], "bottom"),
          getSide(puzzle[x1][y1], "left"),
          getSide(puzzle[x1][y1], "right"),
        ];
        const sides2 = [
          getSide(puzzle[x2][y2], "topRev"),
          getSide(puzzle[x2][y2], "bottomRev"),
          getSide(puzzle[x2][y2], "leftRev"),
          getSide(puzzle[x2][y2], "rightRev"),
        ];
        return sides1.reduce((matching, side) => {
          return matching || sides2.indexOf(side) > -1;
        }, false);
      }

      if (x === 0 && y === 0) {
        return;
      }

      if (puzzle[x - 1] && puzzle[x - 1][y] && !matchSides(x - 1, y, x, y)) {
        puzzle[x][y] = flip(puzzle[x][y]);
        return;
      }

      if (puzzle[x][y - 1] && !matchSides(x, y - 1, x, y)) {
        puzzle[x][y] = flip(puzzle[x][y]);
        return;
      }

      if (puzzle[x][y + 1] && !matchSides(x, y + 1, x, y)) {
        puzzle[x][y] = flip(puzzle[x][y]);
        return;
      }

      if (puzzle[x + 1] && puzzle[x + 1][y] && !matchSides(x + 1, y, x, y)) {
        puzzle[x][y] = flip(puzzle[x][y]);
      }
    }

    function rotateUntilOk(puzzle, x, y) {
      // DEBUG console.log('rotateUntilOk', x, y)
      while (!isTileOk(puzzle, x, y)) {
        puzzle[x][y] = rotate(puzzle[x][y]);
      }
    }

    function isTileOk(tiles, x, y) {
      if (x === 0 && y === 0) {
        return (
          sideTiles(getSide(tiles[x][y], "left")) === 1 &&
          sideTiles(getSide(tiles[x][y], "top")) === 1
        );
      } else {
        // DEBUG console.log('isTileOk', x, y);
        if (tiles[x - 1] && tiles[x - 1][y]) {
          return (
            getSide(tiles[x - 1][y], "bottomRev") ===
            getSide(tiles[x][y], "top")
          );
        }

        if (tiles[x][y - 1]) {
          return (
            getSide(tiles[x][y - 1], "rightRev") ===
            getSide(tiles[x][y], "left")
          );
        }

        if (tiles[x][y + 1]) {
          return (
            getSide(tiles[x][y + 1], "leftRev") ===
            getSide(tiles[x][y], "right")
          );
        }

        if (tiles[x + 1] && tiles[x + 1][y]) {
          return (
            getSide(tiles[x + 1][y], "topRev") ===
            getSide(tiles[x][y], "bottom")
          );
        }
      }
      return false;
    }

    function findPieceId(tiles, tileIds, x, y) {
      if (x === 0 && y === 0) {
        return corners[1];
      }
      if (tiles[x - 1] && tiles[x - 1][y]) {
        return grouped[getSide(tiles[x - 1][y], "bottom")].filter(
          (i) => i !== tileIds[x - 1][y]
        )[0];
      }

      if (tiles[x][y - 1]) {
        return grouped[getSide(tiles[x][y - 1], "right")].filter(
          (i) => i !== tileIds[x][y - 1]
        )[0];
      }

      if (tiles[x][y + 1]) {
        return grouped[getSide(tiles[x][y + 1], "left")].filter(
          (i) => i !== tileIds[x][y + 1]
        )[0];
      }

      if (tiles[x + 1] && tiles[x + 1][y]) {
        return grouped[getSide(tiles[x + 1][y], "top")].filter(
          (i) => i !== tileIds[x + 1][y]
        )[0];
      }
      return -1;
    }

    function trim(image, from, to) {
      return image
        .split("\n")
        .map((row) => row.split("").slice(from, to).join(""))
        .join("\n");
    }

    const puzzleIds = new Array(squareSide)
      .fill([])
      .map((_) => new Array(squareSide));
    const puzzle = new Array(squareSide)
      .fill([])
      .map((_) => new Array(squareSide));

    const cornerId = findPieceId(puzzle, puzzleIds, 0, 0);
    puzzleIds[0][0] = cornerId;
    puzzle[0][0] = flip(tiles[cornerId]);
    rotateUntilOk(puzzle, 0, 0);

    for (let i = 0; i < squareSide; i++) {
      for (let j = 0; j < squareSide; j++) {
        if (i === 0 && j === 0) continue;
        const id = findPieceId(puzzle, puzzleIds, i, j);
        puzzleIds[i][j] = id;
        puzzle[i][j] = tiles[id];

        flipUntilOk(puzzle, i, j);
        rotateUntilOk(puzzle, i, j);
      }
    }

    // DEBUG console.log(puzzleIds);
    // DEBUG printPuzzle(puzzle);

    const removeBorders = (tile) =>
      tile
        .map((row) =>
          row
            .split("")
            .slice(1, row.length - 1)
            .join("")
        )
        .slice(1, tile.length - 1);

    const puzzleWithNoBorders = puzzle.map((row) =>
      row.map((tile) => removeBorders(tile))
    );

    const puzzleWithNoBordersAndNoSpaces = stringifyPuzzle(
      puzzleWithNoBorders,
      "",
      ""
    );
    // DEBUG console.log(puzzleWithNoBordersAndNoSpaces);
    // DEBUG console.log("------------");

    function testPattern(puzzle, patternRegex) {
      for (let i = 0; i < widthDiff; i++) {
        const trimmedImage = trim(puzzle, i, i + patternWidth);
        if (patternRegex.exec(trimmedImage)) return true;
      }
      return false;
    }

    function findPosition(puzzle, patternRegex) {
      for (let i = 0; i < 4; i++) {
        puzzle = rotate(puzzle.split("\n")).join("\n");
        if (testPattern(puzzle, patternRegex)) return puzzle;
      }
      puzzle = flip(puzzle.split("\n")).join("\n");
      for (let i = 0; i < 4; i++) {
        puzzle = rotate(puzzle.split("\n")).join("\n");
        if (testPattern(puzzle, patternRegex)) return puzzle;
      }
      return puzzle;
    }

    function countHashtags(str) {
      return str.split("").filter((l) => l === "#").length;
    }

    const monsterPattern = `                  # \n#    ##    ##    ###\n #  #  #  #  #  #   `;

    const patternWidth = monsterPattern.indexOf("\n");
    const imageWidth = puzzleWithNoBordersAndNoSpaces.indexOf("\n");
    const widthDiff = imageWidth - patternWidth;

    const patternRegex = new RegExp(monsterPattern.replace(/ /g, "."), "g");
    const puzzleWithNoBordersAndNoSpacesRotated = findPosition(
      puzzleWithNoBordersAndNoSpaces,
      patternRegex
    );

    let countPatterns = 0;
    for (let i = 0; i < widthDiff; i++) {
      const trimmedImage = trim(
        puzzleWithNoBordersAndNoSpacesRotated,
        i,
        i + patternWidth
      );

      const matches = [...trimmedImage.matchAll(patternRegex)].length;
      countPatterns += matches;
      patternRegex.lastIndex = 0;
    }
    // DEBUG console.log(countHashtags(puzzleWithNoBordersAndNoSpacesRotated), '-', countHashtags(monsterPattern), '*', countPatterns);
    console.log(
      countHashtags(puzzleWithNoBordersAndNoSpacesRotated) -
        countHashtags(monsterPattern) * countPatterns
    );
  });
