
var chalk = require('chalk')
var { envFileToObject, objectStringToEnvString } = require("./helpers")
var fs = require('fs');
var JavaScriptObfuscator = require('javascript-obfuscator');
var config = require(process.env.PWD + '/scripts.config.js')

// SYNOPSIS
//     generateEvns.js [application] [environment] [withOrWithoutLogs]

// DESCRIPTION
//      This cli utility copies the appropriate .env.application.environment.js into env.js
//      and obfuscates the file so that bad hackers are sad.

//PARAMS
const application = config.allowedApps[process.argv[2]];
const environment = config.allowedEnvironments[process.argv[3]];
const withoutLogs = process.argv[4]
const shouldObfuscate = false;

let envToCopyFrom;
if (!application || !environment) {
    console.log(chalk.yellow("WARNING: no application or environment specified. Are you on a server environment? Falling back to env.js"));
    envToCopyFrom = process.env.PWD + "/src/envs/env.js"
} else {
    envToCopyFrom = `${process.env.PWD}/src/envs/env.${application}.${environment}.js`
}
console.log(`Will use env in ${envToCopyFrom}`)

const pathToCopyTo = `${process.env.PWD}/src/env.js`

let jsonFromString = envFileToObject(envToCopyFrom);
if (withoutLogs === "true") {
    console.log("GENERATING WITHOUT LOGS !!!")
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

console.log(`---Copying env ${envToCopyFrom} to ${pathToCopyTo}`)

fs.writeFileSync(pathToCopyTo, obfuscationResult.toString());
console.log(chalk.green("Done generating env.js"))