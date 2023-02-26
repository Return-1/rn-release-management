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

function checkIfArchiveFolderExistsElseCreate(dir) {
    if (!fs.existsSync(dir)) {
        console.log(dir + " doesn't exist. Creating ...")
        fs.mkdirSync(dir, { recursive: true });
        return { exists: false }
    } else {
        return { exists: true }
    }
}

//TODO: THIS ALSO EXISTS IN GENERAL. IS IT OK TO IMPORT FRM THERE?
const versionToNumber = (val) => {
    return parseInt(val.replace(/[.]/g, ""))
}

function envFileToObject(pathToEnv) {

    //This turns the env string of the form const envData = {...}
    //into a string that is basically a simple object {...}
    const envStringToObjectString = (data) => {
        let splitArray = data.split('\n');
        splitArray.pop()
        splitArray.shift();
        splitArray.unshift("{");
        return splitArray.join('\n')
    }

    //read the env file
    let envDataFileString = fs.readFileSync(pathToEnv).toString()
    //turn it into a js object
    let envObjectString = envStringToObjectString(envDataFileString);
    let envObject = parseLoose(envObjectString)
    //finally this is a javascript string
    return envObject
}

//This turns a string that containts js object {...}
//formatted data into the const envData = {...}
//structure that the app modules expect on import
//TODO: This expect stuff to be passed in here after JSON.stringify(the data we care about, null, "\t") has been run on them and i don't like it, need to change.
function objectStringToEnvString(data) {
    let splitArray = data.split('\n');
    splitArray.shift();
    splitArray.unshift("const envData = {")
    splitArray.push("export default envData;")
    return splitArray.join('\n')
}

const getScriptParamsAsObject = scriptArgs => {
    if (scriptArgs && scriptArgs[2]) {
        let jsonParam = scriptArgs[2];
        let arguments = JSON.parse(jsonParam)
        return arguments;
    }
    return {}
}

//STEP RUNNER
const runStep = ({ scriptName, params, successMessage = "", failMessage = "", scriptOrder = "" }) => {
    logStep(`${scriptOrder}. Calling ${scriptName}`)
    const scriptToExecuteDir = __dirname + "/steps/" + scriptName + "/" + scriptName + ".js"

    var procX = spawnSync("node", [scriptToExecuteDir, JSON.stringify(params)], { stdio: "inherit" })
    if (procX.status !== 0) {
        console.log(chalk.red(failMessage))
        process.exit(1);
    } else {
        console.log(chalk.green(successMessage))
    }
}

//SIMPLY DISPLAY
const logStep = (value) => {
    console.log(chalk.inverse(`
${'#'.repeat(value ? value.length + 8 : 12)}
### ${value ? value : "STEP"} ###
${'#'.repeat(value ? value.length + 8 : 12)}

`))
}

//TODO: Make sure this is needed. Warning untested code
function wrapWithContext(funcArr, context) {
    return funcArr.map(func => {
        return function () {
            func({
                ...context, userProps: {
                    ...arguments
                }
            })
        }
    })
}

//TODO: Change this to a function like getParam() or something
//and make sure it also reads the config file so it can be overwritten
const DEFAULTS = {
    envFilePath: "src/envs",
    envFilePathOutput: "src",
    apkOutputPath: "IGNORABLES/archiveAPKs"
}

module.exports = {
    isVersionStringValid,
    versionToNumber,
    logStep,
    envFileToObject,
    objectStringToEnvString,
    getScriptParamsAsObject,
    runStep,
    checkIfArchiveFolderExistsElseCreate,
    wrapWithContext,
    DEFAULTS,
}