
const chalk = require('chalk')
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

//ours
const { getScriptParamsAsObject, DEFAULTS } = require("../../helpers")

const { cliProps: {
    currentBranchName,
}, userProps: {
    branchName
} } = getScriptParamsAsObject(process.argv)

if (currentBranchName !== branchName) {
    console.log(chalk.red(`WRONG BRANCH !!! : Branch should be ${branchName} but instead is ${currentBranchName}`))
    process.exit(1);
} else {
    console.log(chalk.green(`Working on correct branch ${branchName}`))
}