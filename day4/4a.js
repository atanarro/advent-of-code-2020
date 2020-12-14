"use strict";

/**
 * https://adventofcode.com/2020/day/4
 * cat input.txt|node 4a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

const passports = [];
let currentPassport = "";

function addPassport(passport) {
  const p = passport
    .trim()
    .split(" ")
    .map((m) => m.split(":"));
  passports.push(
    p.reduce((acc, curField) => ({ ...acc, [curField[0]]: curField[1] }), {})
  );
}

function validate(passport) {
  const requiredFields = ["ecl", "pid", "eyr", "hcl", "byr", "iyr", "hgt"];
  return requiredFields.reduce(
    (acc, cur) => acc && passport.hasOwnProperty(cur),
    true
  );
}

readInterface
  .on("line", function (line) {
    if (line.length === 0) {
      addPassport(currentPassport);
      currentPassport = "";
    } else {
      currentPassport += " " + line;
    }
  })
  .on("close", function () {
    addPassport(currentPassport);
    console.log(
      passports.reduce((acc, passport) => {
        return acc + (validate(passport) ? 1 : 0);
      }, 0)
    );
  });
