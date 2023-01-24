#!/usr/bin/env node

const chalk = require('chalk');
const program = require("commander")
//ours
const { runStep, logStep } = require('./helpers')
const config = require(process.env.PWD + '/scripts.config.js')

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
const version = process.argv[4] || ""
const description = program.desc || ""
const outputFileName = application + environment[0].toUpperCase() + environment.substring(1) + version + description + ".apk"

//TODO: This should be same as in generateApk.js or generic enough
if (!application || !environment || !version) {
    console.log(chalk.red("Wrong application name or environment", application, environment, version));
    process.exit(1);
}

console.log(`Running for ${application} | ${environment} | ${version} and will produce:\n ${outputFileName}`)
if (program.desc) { console.log(`Description: ${program.desc}`) }

config.stepsToRun.forEach((step, i) => {

    const allContext = { cliProps: { application, environment, version, description, outputFileName, projectPath: process.env.PWD, cliPath: __dirname, }, userProps: (step.properties || {}) }

    if (step.name === "generateEnvFile") {
        runStep({
            scriptName: "generateEnvFile", scriptOrder: i,
            params: allContext, //TODO: MISSING WITHLOGS
            successMessage: "env.js generatated successfully", failMessage: "!!! There was an error while generating the envs",
        })
    } else if (step.name === "generateApk") {
        runStep({
            scriptName: "generateApk", scriptOrder: i,
            params: allContext,
            successMessage: "APKs generated succesfully", failMessage: "!!! There was an error while generating the apks"
        })
    } else if (step.name === "generateApkSizeHistory") {
        runStep({
            scriptName: "generateApkSizeHistory", scriptOrder: i,
            params: allContext,
            successMessage: "History apk size has been succesfully created", failMessage: "!!! There was an error while writing the  history apk size",
        })
    } else if (step.name === "generateFilesFromTemplates") {
        runStep({
            scriptName: "generateFilesFromTemplates", scriptOrder: i,
            params: allContext,
            successMessage: "Template files have generated the native files accordingly", failMessage: "!!! There was an error while generating the native files from templates",
        })
    } else if (step.name === "uploadApk") {
        runStep({
            scriptName: "uploadApk", scriptOrder: i,
            params: allContext,
            successMessage: "Apk uploaded succesfully to slack channel", failMessage: "Error uploading apk to slack"
        })
    } else {
        //CUSTOM STEPS
        logStep(`${i}. Gonna run custom step named ${step.name}`)
        step.functionToRun(allContext);
    }
})

console.log(chalk.green("ALL DONE"))