const program = require("commander")
const fs = require('fs');

const { getCurrentBranchName } = require("./helpers")
const { envFileToObject, objectStringToEnvString } = require("../../helpers")

const getContext = (process, bumpBuildNumber = true,) => {

    //=================
    //===1. cli arguments to inject
    //=================

    //TODO: Make those parseable with flags instead of order
    const application = process.argv[2];
    const environment = process.argv[3];
    const description = process.argv[4] || ""
    let semanticVersion = "";
    let buildNumber = "_unset";

    //TODO: look at readme can prolly do away with this
    let enviromentWithCapital = "";
    if (environment) {
        enviromentWithCapital = environment[0].toUpperCase() + environment.substring(1);
    }

    //the root of the project utilizing rnrm
    const projectPath = process.env.PWD;

    //================
    //===1.1. Potentially bump version/build number
    //================
    if (bumpBuildNumber) {
        const rnrmConfigData = envFileToObject(`${projectPath}/rnrm/config.js`);
        console.log(rnrmConfigData)
        let foundBuildNumber = Object.keys(rnrmConfigData).find(item => {
            return item.includes("RNRM_BUILD_NUMBER") && item.includes(application)
        })
        //Only run if there's an RNRM_BUILD_NUMBER key in there.
        if (foundBuildNumber) {
            rnrmConfigData[foundBuildNumber] += 1;
            fs.writeFileSync(`${projectPath}/rnrm/config.js`, objectStringToEnvString(JSON.stringify(rnrmConfigData, null, "\t")))
        }
    }

    //=================
    //====2 config data
    //=================

    //read the data in the config file
    const rnrmConfigData = envFileToObject(`${process.env.PWD}/rnrm/config.js`);
    //WIP get the semanticVersion that corresponds to this app
    let foundsemanticVersionKey = Object.keys(rnrmConfigData).find(item => {
        return item.includes("RNRM_SEMANTIC_VERSION") && item.includes(application)
    })
    if (foundsemanticVersionKey) semanticVersion = rnrmConfigData[foundsemanticVersionKey]

    let foundBuildNumber = Object.keys(rnrmConfigData).find(item => {
        return item.includes("RNRM_BUILD_NUMBER") && item.includes(application)
    })
    if (foundBuildNumber) buildNumber = rnrmConfigData[foundBuildNumber]

    //=================
    //===3. other things to inject
    //=================

    const currentBranchName = getCurrentBranchName();
    if (!currentBranchName) {
        console.log("!!!Issue in getContext while attemptiong to get current branch");
        process.exit();
    }

    //=================
    //===4. set output file name
    //=================

    const outputFileName = application + enviromentWithCapital + "V" + semanticVersion + "_buildNo" + buildNumber + description + ".apk"
    console.log(`Running for
    application: ${application}
    environment: ${environment}
    semantic version: ${semanticVersion}
    build number: ${buildNumber}
    and will produce:\n ${outputFileName}`)

    if (description) { console.log(`WITH Description: ${description}`) }

    const allContext = {
        cliProps: {
            application,
            environment,
            version: semanticVersion, //TODO: Rename in other places of the code version to semanticVersion
            buildNumber,
            description,
            outputFileName,
            projectPath,
            cliPath: __dirname,
            //other things to inject
            currentBranchName,
            rnrmConfigData,
        },
        userProps: {}
    }

    return allContext;
}

module.exports = { getContext }