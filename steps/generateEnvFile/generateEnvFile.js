
const chalk = require('chalk')
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

//ours
const { envFileToObject, objectStringToEnvString, getScriptParamsAsObject, createContextFile, DEFAULTS } = require("../../helpers")

let context = getScriptParamsAsObject(process.argv)
const { cliProps: {
    application,
    environment,
}, userProps: {
    withoutLogs,
    shouldObfuscate = false,
} } = context

//Find the env to read
let envToCopyFrom;
if (!application || !environment) {
    console.log(chalk.yellow("WARNING: no application or environment specified. Are you on a server environment? Falling back to env.js"));
    envToCopyFrom = `${process.env.PWD}/${DEFAULTS.envFilePath}/env.js`
} else {
    envToCopyFrom = `${process.env.PWD}/${DEFAULTS.envFilePath}/env.${application}.${environment}.js`
}
console.log(`Will use env in ${envToCopyFrom}`)

const pathToCopyTo = `${process.env.PWD}/${DEFAULTS.envFilePathOutput}/env.js`

//Read the env and make it into a js object
let jsonFromString = envFileToObject(envToCopyFrom);

//Decide on logging ( logging convention on envs)
if (withoutLogs === true || withoutLogs === false) {
    jsonFromString.WITH_LOGS = !withoutLogs
    jsonFromString.WITH_REDUX_LOGGER = !withoutLogs
}

//The js object is complete, now make into a string so we can write to .env file
let stringToJSON = JSON.stringify(jsonFromString, null, "\t")
let stringToObfuscate = objectStringToEnvString(stringToJSON)
    .replace(/\n\s*"/g, "\n")
    .replace(/":/g, ":")

//Obfuscate env ( TODO: Fix currently not working with rest of steps)
let obfuscationResult
if (shouldObfuscate) {
    obfuscationResult = JavaScriptObfuscator.obfuscate(stringToObfuscate, {
        compact: false,
        unicodeEscapeSequence: true,
        transformObjectKeys: true
    });
} else {
    obfuscationResult = stringToObfuscate;
}

console.log(`---Copying env:${envToCopyFrom}\nto\n${pathToCopyTo}`)
fs.writeFileSync(pathToCopyTo, obfuscationResult.toString());
console.log(chalk.green("Done generating env.js"))

//If everything is correct, we also wanna add everything to context
if (!context.envProps) context["envProps"] = {}
context.envProps = jsonFromString;
createContextFile(context)