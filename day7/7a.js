"use strict";

/**
 * https://adventofcode.com/2020/day/7
 * cat input.txt|node 7a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const graph = {};

function parseLine(line) {
  const [container, contains] = line.split(" contain ");
  return [
    container.replace(/ bags?/, ""),
    contains
      .replace(".", "")
      .split(", ")
      .filter((m) => m !== "no other bags")
      .map((bag) => {
        return bag.replace(/^\d+ /, "").replace(/ bags?/, "");
      }),
  ];
}

function addToGraph([container, contains]) {
  contains.forEach((bag) => {
    graph[bag] = graph[bag] || new Set();
    graph[bag].add(container);
  });
}

function canContain(bagType) {
  const solution = graph[bagType];
  const pending = [...solution];

  while (pending.length) {
    const indirectBag = pending.pop();
    (graph[indirectBag] || []).forEach((bagType) => {
      if (!solution.has(bagType)) {
        solution.add(bagType);
        pending.push(bagType);
      }
    });
  }

  return solution;
}

readInterface
  .on("line", function (line) {
    addToGraph(parseLine(line));
  })
  .on("close", function () {
    console.log(canContain("shiny gold").size);
  });
