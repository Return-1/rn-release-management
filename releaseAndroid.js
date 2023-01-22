#!/usr/bin/env node

const chalk = require('chalk');
const program = require("commander")
//ours
const { runStep } = require('./helpers')
var config = require(process.env.PWD + '/scripts.config.js')

// SYNOPSIS
//     releaseAndroid.js [application] [environment] [version]
// [-d] to add description

// DESCRIPTION
//      This cli utility runs all the appropriate scripts in order to  generate the apks 
//      First Runs the  generateEnv.js and if the process completes succesfully then it moves on
//      the second step which to generete the apk . 

program
    .option('-d --desc <string>', "extra description for this version ")

program.parse(process.argv)
const application = config.allowedApps[process.argv[2]];
const environment = config.allowedEnvironments[process.argv[3]];
const version = process.argv[4]
const versionWithDescription = program.desc ? version + program.desc : version

//TODO: This should be same as in generateApk.js or generic enough
if (!application || !environment || !version) {
    console.log(chalk.red("Wrong application name or environment", application, environment));
    process.exit(1);
}

console.log(`Running for ${application} | ${environment} | ${version}`)
if (program.desc) { console.log(`Description: ${program.desc}`) }

runStep({
    scriptName: "generateEnvFile.js",
    params: [{ value: application }, { value: environment }, { label: "withOrWithoutLogs", value: true }],
    successMessage: "env.js generatated successfully",
    failMessage: "!!! There was an error while generating the envs",
})

runStep({
    scriptName: "generateApk.js",
    params: [{ value: application }, { value: environment }, { value: versionWithDescription, }],
    successMessage: "APKs generated succesfully",
    failMessage: "!!! There was an error while generating the apks"
})

runStep({
    scriptName: "generateApkSizeHistory.js",
    params: [{ value: application }, { value: environment }, { value: versionWithDescription, }],
    successMessage: "History apk size has been succesfully created",
    failMessage: "!!! There was an error while writing the  history apk size",
})

console.log(chalk.green("ALL DONE"))