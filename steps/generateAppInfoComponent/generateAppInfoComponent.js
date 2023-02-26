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

//SETUP
checkIfArchiveFolderExistsElseCreate(`${projectPath}/rnrm/RNRMAppInfo`)

//0. GET SYSTEM INFORMATION
createSystemInformationFile()

//1. GET COMMITS AND FILTER THEM BY `commitsFilter`
createCommitHistoryFile(commitsFilter)

//2. CREATE RNRMAPPInfo file
let templateAppInfoComponent = fs.readFileSync(`${__dirname}/RNRMAppInfo-template.js`).toString()
fs.writeFileSync(`${projectPath}/rnrm/RNRMAppInfo/RNRMAppInfo.js`, templateAppInfoComponent)

///////////
//FUNCTIONS
///////////
function createSystemInformationFile() {
    // Get the date and time the script was run
    const date = new Date().toLocaleString();
    // Get the name of the computer running the script
    const hostname = os.hostname();

    // Get system information
    const os_name = execSync('uname -a').toString().trim()
    const user = execSync('whoami').toString().trim()

    let result = `{
        date:"${date}",
        hostname:"${hostname}",
        built_by:"${user}",
        os_name:"${os_name}",
    }`

    let exportableString = `export const systemInfo = ${result}`;
    fs.writeFileSync(`${projectPath}/rnrm/RNRMAppInfo/systemInfo.js`, exportableString)
}

function createCommitHistoryFile(commitsFilter) {

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

    let arrayContents = JSON.stringify(arrayOutput, null, 2)

    //BEAUTIFY ( not necessary for it to work)
    arrayContents = arrayContents
        .replace(/^\[|\]$/g, '') // remove square brackets at beginning and end
        .trim(); // remove leading/trailing whitespace

    //ALSO GET NAME OF CURRENT BRANCH
    const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()


    let exportableString = `export const commitData = [\n${arrayContents}\n];
export const branchName = "${branchName}"`;
    fs.writeFileSync(`${projectPath}/rnrm/RNRMAppInfo/commitData.js`, exportableString)
}