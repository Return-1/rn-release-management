const fs = require('fs')
const chalk = require('chalk')
const { getScriptParamsAsObject, checkIfArchiveFolderExistsElseCreate } = require("../../helpers")
let { spawnSync } = require('child_process');

//TODO: This could be a loooot better
const { cliProps: {
    projectPath,
}, userProps: {
    filter = ""
} } = getScriptParamsAsObject(process.argv)

//1. GET COMMITS AND FILTER THEM BY `filter`

let filterCommitsBy = filter;
console.log(__dirname + "/" + `getGitLogHistory.sh`)

var proc = spawnSync(`bash`, [__dirname + "/" + `getGitLogHistory.sh`, filterCommitsBy], { stdio: 'pipe' })

if (proc.status !== 0) {
    console.log(chalk.red("ERROR: generateAndroidApk.sh"))
    process.exit(1);
} else {
    console.log("ok with getting git logs")
}

let stringOutput = proc.output[1].toString()
let arrayOutput = stringOutput?.split("\n")
arrayOutput.pop()

console.log(arrayOutput)

let arrayContents = JSON.stringify(arrayOutput, null, 2)

//BEAUTIFY ( not necessary for it to work)
arrayContents = arrayContents
    .replace(/^\[|\]$/g, '') // remove square brackets at beginning and end
    .trim(); // remove leading/trailing whitespace

let finalString = `export const commitData = [\n${arrayContents}\n];`;


//
//WRITE ALL NECESSARY FILES
//

//check if folder exists,if not create
checkIfArchiveFolderExistsElseCreate(`${projectPath}/rnrm/RNRMAppInfo`)

//CREATE FILE WITH COMMIT DATA AS REQUESTED
//THIS IS TO BE INCLUDED IN THE APP

fs.writeFileSync(`${projectPath}/rnrm/RNRMAppInfo/commitData.js`, finalString)

//TODO: make this into a template in THIS folder
fs.writeFileSync(`${projectPath}/rnrm/RNRMAppInfo/RNRMAppInfo.js`, `
import React from "react";
import {View, Text} from "react-native";
import {commitData} from "./commitData"

const RNRMAPPInfo = () => {
    return (
        <View>
            {commitData.map(item => {
                return         <Text>{item}</Text>
            })}
        </View>
        )
}

export default RNRMAPPInfo
`)