
const chalk = require('chalk')
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

//ours
const { envFileToObject, objectStringToEnvString, getScriptParamsAsObject, DEFAULTS } = require("../../helpers")

const { cliProps: {
    application,
    environment,
}, userProps: {
    withoutLogs = true,
    shouldObfuscate = false,
}
} = getScriptParamsAsObject(process.argv)

let envToCopyFrom;
if (!application || !environment) {
    console.log(chalk.yellow("WARNING: no application or environment specified. Are you on a server environment? Falling back to env.js"));
    envToCopyFrom = `${process.env.PWD}/${DEFAULTS.envFilePath}/env.js`
} else {
    envToCopyFrom = `${process.env.PWD}/${DEFAULTS.envFilePath}/env.${application}.${environment}.js`
}
console.log(`Will use env in ${envToCopyFrom}`)

const pathToCopyTo = `${process.env.PWD}/${DEFAULTS.envFilePathOutput}/env.js`

let jsonFromString = envFileToObject(envToCopyFrom);
if (withoutLogs) {
    console.log("GENERATING WITHOUT LOGS")
    jsonFromString.WITH_LOGS = false
    jsonFromString.WITH_REDUX_LOGGER = false
}
let stringToJSON = JSON.stringify(jsonFromString, null, "\t")
let stringToObfuscate = objectStringToEnvString(stringToJSON)
    .replace(/\n\s*"/g, "\n")
    .replace(/":/g, ":")

//obfuscator has an issue with quotes ' || "" on object keys and doesnt obfuscate those
//removing them here
//var fileContentStringSanitized = fileContentString
//  .replace(/\s\/\/.*/g, "")
// .replace(/\n\s*"/g, "")
// .replace(/":/g, ":")


// console.log(fileContentStringSanitized);
// process.exit()
//## obfuscate

//SHOULD OBFUSCATE?
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