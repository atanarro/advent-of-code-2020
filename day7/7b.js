"use strict";

/**
 * https://adventofcode.com/2020/day/7
 * cat input.txt|node 7b.js
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
        const [, number, type] = /^(\d+) (.*) bags?$/.exec(bag);
        return { number: Number(number), type };
      }),
  ];
}

function addToGraph([container, contains]) {
  graph[container] = contains;
}

function countBags(bag) {
  return graph[bag].reduce(function (acc, cur) {
    return acc + cur.number * countBags(cur.type);
  }, 1);
}

readInterface
  .on("line", function (line) {
    const parsedLine = parseLine(line);
    addToGraph(parsedLine);
    // console.log(parsedLine);
  })
  .on("close", function () {
    // console.log(graph);
    console.log(countBags("shiny gold") - 1);
  });
