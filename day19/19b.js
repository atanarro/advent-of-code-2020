"use strict";

/**
 * https://adventofcode.com/2020/day/19
 * cat input.txt|node 19b.js
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
  // let loopShortCircuit = 0;
  // const loopShortCircuitLimit = 10;

  while (thereAreGroups) {
    const re = /\s*(\d+)\s*/;
    const exd = re.exec(rules[i]);
    if (!exd) {
      thereAreGroups = false;
    } else {
      const [, ...p] = exd;
      // DEBUG console.log(exd);
      /* if ((new RegExp('[^0-9]+' + p[0] + '[^0-9]+')).test(rules[p[0]])) {
      	console.log('loop!!!', p[0], rules[p[0]]);
      } */

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
      // parseRule("8: 42 | 42 8");
      // parseRule("11: 42 31 | 42 11 31");

      // FIXME I am not very proud of this solution
      parseRule("8: 42 | 42+");
      // parseRule("11: 42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31 | 42 42 42 42 42 31 31 31 31 31 | 42 42 42 42 42 42 31 31 31 31 31 31");
      parseRule("11: 42 31 | (42 ){2}(31 ){2}|(42 ){3}(31 ){3}|(42 ){4}(31 ){4}|(42 ){5}(31 ){5}|(42 ){6}(31 ){6}");
      // should try with xregexp http://xregexp.com/api/#matchRecursive
      // parseRule("11: 42 31 | (?<N>42 \k<N>? 31) ");

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
