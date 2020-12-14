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

function validateValue(key, value) {
  /*
	byr (Birth Year) - four digits; at least 1920 and at most 2002.
	iyr (Issue Year) - four digits; at least 2010 and at most 2020.
	eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
	hgt (Height) - a number followed by either cm or in:
- If cm, the number must be at least 150 and at most 193.
- If in, the number must be at least 59 and at most 76.
	hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
	ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
	pid (Passport ID) - a nine-digit number, including leading zeroes.
*/
  switch (key) {
    case "byr":
      return value.length === 4 && value >= "1920" && value <= "2002";
    case "iyr":
      return value.length === 4 && value >= "2010" && value <= "2020";
    case "eyr":
      return value.length === 4 && value >= "2020" && value <= "2030";
    case "hgt":
      if (value.endsWith("cm")) {
        const n = Number(value.replace("cm", ""));
        return n >= 150 && n <= 193;
      } else if (value.endsWith("in")) {
        const n = Number(value.replace("in", ""));
        return n >= 59 && n <= 76;
      }
      return false;
    case "hcl":
      return /^#[0-9a-f]{6}$/.test(value);
    case "ecl":
      return (
        ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].indexOf(value) > -1
      );
    case "pid":
      return /^[0-9]{9}$/.test(value);
  }
  return true;
}

function validate(passport) {
  const requiredFields = ["ecl", "pid", "eyr", "hcl", "byr", "iyr", "hgt"];
  return requiredFields.reduce(
    (acc, cur) =>
      acc && passport.hasOwnProperty(cur) && validateValue(cur, passport[cur]),
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
