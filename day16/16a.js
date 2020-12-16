"use strict";

/**
 * https://adventofcode.com/2020/day/16
 * cat input.txt|node 16a.js
 */

const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("/dev/stdin"),
  // output: process.stdout,
  console: false,
});

let file = "";

function parseRule(text) {
  return text.split(" or ").map((range) => {
    const [from, to] = range.split("-").map(Number);
    return { from, to };
  });
}

function parseRules(text) {
  return text.split("\n").reduce((acc, cur) => {
    const [key, value] = cur.split(": ");
    return {
      [key]: parseRule(value),
      ...acc,
    };
  }, {});
}

function parseTicket(text) {
  return text.split(",").map(Number);
}

function parseMyTicket(text) {
  const ticket = text.split("\n");
  return parseTicket(ticket.pop());
}

function parseNearbyTickets(text) {
  const tickets = text.split("\n");
  tickets.shift();
  return tickets.map(parseTicket);
}

function validateValue(value, rules) {
  let isValid = false;

  Object.values(rules)
    .flat()
    .forEach((rule) => {
      if (!isValid && value >= rule.from && value <= rule.to) {
        // console.log(value, rule);
        isValid = true;
      }
    });

  return isValid;
}

function validateTicket(ticket, rules) {
  let error;

  // console.log(ticket);

  const errors = ticket.reduce((errors, value) => {
    const validatedValue = validateValue(value, rules);

    if (!validatedValue) {
      return [...errors, value];
    }

    return errors;
  }, []);

  return errors;
}

readInterface
  .on("line", function (line) {
    file += line + "\n";
  })
  .on("close", function () {
    const [rules, myTicket, nearbyTickets] = file.trim().split("\n\n");

    const parsedRules = parseRules(rules);
    const parsedMyTicket = parseMyTicket(myTicket);
    const parsedNearbyTickets = parseNearbyTickets(nearbyTickets);

    const errorRate = parsedNearbyTickets
      .map((ticket) => {
        const errors = validateTicket(ticket, parsedRules);
        if (errors.length) {
          return errors[0];
        } else return 0;
      })
      .reduce((acc, cur) => acc + cur, 0);
    console.log(errorRate);
  });
