const fs = require('fs')
const chalk = require('chalk')
const { getScriptParamsAsObject } = require("../../helpers")
let { spawnSync } = require('child_process');

//TODO: This could be a loooot better
const { cliProps: {
    outputFileName,
} } = getScriptParamsAsObject(process.argv)

const dateString = new Date().toUTCString()
let tagName = outputFileName.replace(".apk", "").replace(/\./g, "_") + "__" + dateString.replace(/[^\w\s]/gi, '').replace(/ /g, "_");
tagName.replace("GMT", "")
console.log("Will add tagName:", tagName)
var tagCreationProc = spawnSync(`git`, [`tag`, `${tagName}`], { stdio: 'inherit' })

if (tagCreationProc.status !== 0) {
    console.log(chalk.red("ERROR: in git tag on tagBranch.js"))
    //TODO: FAIL CLEANUP LOGIC HERE
    process.exit(1)
}