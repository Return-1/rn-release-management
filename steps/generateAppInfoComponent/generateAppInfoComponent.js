const fs = require('fs')
const chalk = require('chalk')
const { getScriptParamsAsObject, checkIfArchiveFolderExistsElseCreate } = require("../../helpers")
let { spawnSync, execSync } = require('child_process');
const os = require('os');

//TODO: This could be a loooot better
const { cliProps: {
    projectPath,
}, userProps: {
    commitsFilter = ""
} } = getScriptParamsAsObject(process.argv)

//0. GET SYSTEM INFORMATION
let systemInfo = getSystemInformation()

//1. GET COMMITS AND FILTER THEM BY `commitsFilter`
console.log(__dirname + "/" + `getGitLogHistory.sh`)

var proc = spawnSync(`bash`, [__dirname + "/" + `getGitLogHistory.sh`, commitsFilter], { stdio: 'pipe' })

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
import { View, Text, ScrollView } from "react-native";
import { commitData } from "./commitData"
import DeviceInfo from 'react-native-device-info';

const RNRMAPPInfo = () => {
    return (
        <View style={{ flex: 1 }}>
        <ScrollView>
            <Header title={"App Information"} />
            <AppInformation />

            <Header title={"Commit Data , 2 months"} />
            <CommitData />
        </ScrollView>
        </View>
    )
}

const Header = ({ title }) => {
    return <Text style={{ fontWeight: "bold", fontSize: 20 }}>{title}</Text>
}

const AppInformation = () => {
    return (<>
        <Text>Device info</Text>
        <Text>{DeviceInfo.getBundleId()}</Text>
        <Text>Build number</Text>
        <Text>{DeviceInfo.getBuildNumber()}</Text>
        <Text>Version</Text>
        <Text>{DeviceInfo.getVersion()}</Text>
        <Text>{"Environment ( WIP )"}</Text>
        <Text>{"System that build this app"}</Text>
        <Text>${systemInfo}</Text>
    </>)
}

const CommitData = () => {
    return <>
        {commitData.map((item,index) => {
            return <Text>{index+" >>> "+item}</Text>
        })}
    </>
}

export default RNRMAPPInfo
`)

//FUNCTIONS

function getSystemInformation() {
    // Get the date and time the script was run
    const date = new Date().toLocaleString();
    // Get the name of the computer running the script
    const hostname = os.hostname();

    // Get system information
    const systemInfo = execSync('uname -a').toString().trim()
    const user = execSync('whoami').toString().trim()

    let result = `
date: ${date}
on: ${hostname}
by: ${user}
System information: ${systemInfo}`;

    return result;
}