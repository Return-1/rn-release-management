const chalk = require('chalk');
const fs = require('fs')
var parseLoose = require('loose-json');
let { spawnSync } = require('child_process');

const isVersionStringValid = (version) => {
    //TODO: implement this further
    if (version.length < 5) {
        return false
    }
    return true;
}

//TODO: THIS ALSO EXISTS IN GENERAL. IS IT OK TO IMPORT FRM THERE?
const versionToNumber = (val) => {
    return parseInt(val.replace(/[.]/g, ""))
}

function envFileToObject(pathToEnv) {
    //read the file
    let data = fs.readFileSync(pathToEnv).toString()
    console.log(data)
    let result = envStringToObjectString(data);
    console.log(result)
    let objectToBeReturned = parseLoose(result)
    return objectToBeReturned
}

function envStringToObjectString(data) {
    let splitArray = data.split('\n');
    splitArray.pop()
    splitArray.shift();
    splitArray.unshift("{");
    return splitArray.join('\n')
}

function objectStringToEnvString(data) {
    let splitArray = data.split('\n');
    splitArray.shift();
    splitArray.unshift("const envData = {")
    splitArray.push("export default envData;")
    return splitArray.join('\n')
}

//STEP RUNNER
const runStep = ({ scriptName, params, successMessage, failMessage }) => {
    logStep(`Calling ${scriptName}`)
    const paramValues = params.map(param => param.value)
    var procX = spawnSync("node", [__dirname + "/" + scriptName, ...paramValues], { stdio: "inherit" })
    if (procX.status !== 0) {
        console.log(chalk.red(failMessage))
        process.exit(1);
    }
    console.log(chalk.green(successMessage))
}

const logStep = (value) => {
    console.log(chalk.inverse(`
${'#'.repeat(value ? value.length + 8 : 12)}
### ${value ? value : "STEP"} ###
${'#'.repeat(value ? value.length + 8 : 12)}

`))
}

module.exports = {
    isVersionStringValid,
    versionToNumber,
    logStep,
    envFileToObject,
    objectStringToEnvString,
    runStep,
}