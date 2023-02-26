const fs = require('fs')
const chalk = require('chalk')
const { getScriptParamsAsObject, checkIfArchiveFolderExistsElseCreate } = require("../../helpers")
let { spawnSync, execSync } = require('child_process');
const os = require('os');

//TODO: This could be a loooot better
const { cliProps: {
    projectPath,
    currentBranchName,
}, userProps: {
    commitsFilter = ""
} } = getScriptParamsAsObject(process.argv)

//SETUP
checkIfArchiveFolderExistsElseCreate(`${projectPath}/rnrm/RNRMAppInfo`)

//1. GET SYSTEM INFORMATION
createSystemInformationFile()

//2. GET GIT INFORMATION (branch,commits) AND FILTER COMMITS BY `commitsFilter`
createGitInformationFile(commitsFilter)

//3. CREATE RNRMAPPInfo FILE
createRNRMAPPInfoFile();

///////////
//FUNCTIONS------
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

function createGitInformationFile(commitsFilter) {

    function getCommitHistoryJSONString() {
        var proc = spawnSync(`bash`, [__dirname + "/" + `getGitLogHistory.sh`, commitsFilter], { stdio: 'pipe' })

        if (proc.status !== 0) {
            console.log(chalk.red("ERROR: generateAndroidApk.sh"))
            process.exit(1);
        } else {
            console.log("ok with getting git logs")
        }


        let commitHistoryStringOutput = proc.output[1].toString()
        let commitHistoryArrayOutput = commitHistoryStringOutput?.split("\n")
        commitHistoryArrayOutput.pop()

        //make commit history into json string so we can store in file and beautify
        let commitHistoryJSONArrayString = JSON.stringify(commitHistoryArrayOutput, null, 2)
        commitHistoryJSONArrayString = commitHistoryJSONArrayString
            .replace(/^\[|\]$/g, '') // remove square brackets at beginning and end
            .trim(); // remove leading/trailing whitespace

        return commitHistoryJSONArrayString;
    }

    //1. get commit history as a json array string
    let commitHistoryJSONArrayString = getCommitHistoryJSONString();

    let exportableString = `export const commitData = [\n${commitHistoryJSONArrayString}\n];
export const branchName = "${currentBranchName}"`;

    fs.writeFileSync(`${projectPath}/rnrm/RNRMAppInfo/commitData.js`, exportableString)
}

function createRNRMAPPInfoFile() {
    let templateAppInfoComponent = fs.readFileSync(`${__dirname}/RNRMAppInfo-template.js`).toString()
    fs.writeFileSync(`${projectPath}/rnrm/RNRMAppInfo/RNRMAppInfo.js`, templateAppInfoComponent)

}