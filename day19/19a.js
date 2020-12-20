"use strict";

/**
 * https://adventofcode.com/2020/day/19
 * cat input.txt|node 19a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const rules = {};

function parseRule(line) {
  const [key, val] = line.split(": ");
  rules[key] = "(" + val.replace(/"/g, "") + ")";
}

function validateMessage(message, rule) {
  return rule.test(message);
}

function getRule(i = 0) {
  let thereAreGroups = true;

  while (thereAreGroups) {
    const re = /\s*(\d+)\s*/;
    const exd = re.exec(rules[i]);
    if (!exd) {
      thereAreGroups = false;
    } else {
      const [, ...p] = exd;
      // DEBUG console.log(exd);
      rules[i] = rules[i].replace(re, rules[p[0]]);
    }
  }

  return new RegExp("^" + rules[i].replace(/\s+/g, "") + "$");
}
let mode = "rules";
let rule;
const validMessages = [];

readInterface
  .on("line", function (line) {
    if (line === "") {
      mode = "messages";
      rule = getRule();
      // DEBUG console.log(rule)
      return;
    }
    if (mode === "rules") parseRule(line);
    else if (validateMessage(line, rule)) {
      validMessages.push(line);
    }
  })
  .on("close", function () {
    // DEBUG console.log(validMessages);
    console.log(validMessages.length);
  });
