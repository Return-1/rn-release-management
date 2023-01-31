#!/usr/bin/env node
//cli core
//rnrm --init will create the folder structure and a template

const chalk = require('chalk');
const program = require("commander")
const fs = require('fs');
const readlineSync = require('readline-sync');

const { checkIfArchiveFolderExistsElseCreate } = require('./helpers')

const command = process.argv[2];

//COMMAND SWITCHING
if (command === "init") {

    //TODO: Provide it with a list of flavors so it can gene
    let dir = process.env.PWD;
    let templateExecFile = fs.readFileSync(`${__dirname}/templates/run-template.js`).toString()
    let templateVersioningFile = fs.readFileSync(`${__dirname}/templates/versioning-template.js`).toString()

    let { exists } = checkIfArchiveFolderExistsElseCreate(`${dir}/rnrm`)
    if (exists) {
        console.log(chalk.red("Folder rnrm already exists. Will not initialize. Exiting.."))
    } else {

        const flavorList = readlineSync.question('Please provide a comma separated list of all your flavors.\n\nFor example : myAppProduction,myAppPreview,myAppPaidProduction,myAppPaidPreview:\n\n');
        const flavorsArr = flavorList.split(",")
        console.log(`You provided`);
        flavorsArr.forEach((item, i) => console.log(i + ". " + item))

        const continueResponse = readlineSync.question('Is the above accurate?');
        if (continueResponse === "N" || continueResponse === "n") {
            //TODO: auto delete this
            console.log("Will not continue, please delete rnrm folder..")
            process.exit(1)
        }

        console.log("Very well. Creating flavors")
        fs.writeFileSync(`${dir}/rnrm/run.js`, templateExecFile)

        const versioningFileStringData = createVersioningFileData(flavorsArr)
        fs.writeFileSync(`${dir}/rnrm/versioning.js`, versioningFileStringData)
        console.log(chalk.green("RNRM project initialisation complete !!!"))
    }
}

function createVersioningFileData(flavorsArr) {
    let stringData = "module.exports = {\n";

    flavorsArr.forEach(flavor => {
        stringData += `\t${flavor}MarketingVersion:"1.0.0",\n\t${flavor}CurrentVersion:0,\n`
    })
    stringData += "}"
    console.log(stringData)
    return stringData;
}
