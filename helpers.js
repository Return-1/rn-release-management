const chalk = require('chalk');
const os = require('os');
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
        return { exists: false, dir }
    } else {
        return { exists: true, dir }
    }
}

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
    //context as taken from file
    let context = readContextFile()

    //arguments as passed in the script as a string in json format
    let arguments = {};
    if (scriptArgs && scriptArgs[2]) {
        let jsonParam = scriptArgs[2];
        arguments = JSON.parse(jsonParam)
    }

    context.userProps = arguments
    return context;
}

//STEP RUNNER
const runStep = ({ scriptName, params, successMessage = "", failMessage = "", scriptOrder = "" }) => {
    logStep(`${scriptOrder}. Calling ${scriptName}`)
    const scriptToExecuteDir = __dirname + "/steps/" + scriptName + "/" + scriptName + ".js"

    var procX = spawnSync("node", [scriptToExecuteDir, JSON.stringify(params || {})], { stdio: "inherit" })
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
    androidBinaryOutputPath: "IGNORABLES/archive_",
}

//CONTEXT MANAGEMENT
const tempDir = os.tmpdir();

const createContextFile = (context) => {
    console.log("Will generate context in ", `${tempDir}/context-temp.json`);
    fs.writeFileSync(`${tempDir}/context-temp.json`, JSON.stringify(context, null, 4))
}

const readContextFile = () => {
    if (!fs.existsSync(tempDir)) {
        console.log(chalk.red('Error: context file does not exist'));
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(`${tempDir}/context-temp.json`).toString())
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
    createContextFile,
    readContextFile,
    DEFAULTS,
}