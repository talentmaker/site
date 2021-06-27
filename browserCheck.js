#!/bin/node

const browserslist = require("browserslist")

const threshold = Number(process.env.THRESHOLD ?? 90)
const coverage = browserslist.coverage(browserslist()) // Check coverage from .browserslistrc

class CoverageError extends Error {
    name = "CoverageError"
}

if (coverage >= threshold) {
    console.log(`Coverage is ${coverage}%, which meets the >= ${threshold}% requirement; passing.`)
} else {
    throw new CoverageError(
        `coverage is ${coverage}%, which does not meet the >= ${threshold}% requirement; failing.`,
    )
}
