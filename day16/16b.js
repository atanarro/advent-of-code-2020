"use strict";

/**
 * https://adventofcode.com/2020/day/16
 * cat input.txt|node 16b.js
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
  const errors = ticket.reduce((errors, value) => {
    const validatedValue = validateValue(value, rules);

    if (!validatedValue) {
      return [...errors, value];
    }

    return errors;
  }, []);

  return errors.length;
}

function validateRule(rule, value) {
  let anyValidRange = false;
  rule.forEach((range) => {
    if (value >= range.from && value <= range.to) {
      anyValidRange = true;
    }
  });
  return anyValidRange;
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

    const validTickets = parsedNearbyTickets.filter((ticket) => {
      const isValid = !validateTicket(ticket, parsedRules);
      return isValid;
    });

    const tickets = [...validTickets, parsedMyTicket];

    const fields = Object.keys(parsedRules);
    const possibleFields = parsedMyTicket
      .map((_, index) => ({
        index,
        fields: [],
      }))
      .map((_, i) => {
        return {
          index: i,
          fields: fields.filter((field) => {
            const rule = parsedRules[field];
            return tickets.reduce((allValid, ticket) => {
              return allValid && validateRule(rule, ticket[i]);
            }, true);
          }),
        };
      })
      .sort((f1, f2) => f1.fields.length - f2.fields.length);

    const fieldsInOrder = possibleFields
      .reduce(
        (acc, cur) => [
          ...acc,
          {
            index: cur.index,
            field: cur.fields
              .filter((field) => !acc.find((f) => f.field === field))
              .pop(),
          },
        ],
        []
      )
      .sort((f1, f2) => f1.index - f2.index)
      .map((f) => f.field);
    // DEBUG console.log(fieldsInOrder)

    const solution = fieldsInOrder.reduce((solution, field, i) => {
      if (field.startsWith("departure")) {
        console.log(field, parsedMyTicket[i]);
        return solution * parsedMyTicket[i];
      }
      return solution;
    }, 1);
    console.log("solution", solution);
  });
