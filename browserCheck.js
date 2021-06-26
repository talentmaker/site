#!/usr/bin/node

const browserslist = require("browserslist")

const threshold = Number(process.env.THRESHOLD ?? 90)
const coverage = browserslist.coverage(browserslist()) // Check coverage from .browserslistrc

if (coverage >= threshold) {
    console.log(`Coverage is ${coverage}%, passing`)
} else {
    throw new Error(
        `Coverage is ${coverage}%, which does not meet the >= ${threshold}% requirement.`,
    )
}
