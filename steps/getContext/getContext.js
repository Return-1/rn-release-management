const program = require("commander")
const { getCurrentBranchName } = require("./helpers")
const { envFileToObject } = require("../../helpers")

const getContext = (process) => {

    //1. cli arguments to inject
    const application = process.argv[2];
    const environment = process.argv[3];
    let version = process.argv[4] || ""
    const description = process.argv[5] || ""

    //TODO: look at readme can prolly do away with this
    let enviromentWithCapital = "";
    if (environment) {
        enviromentWithCapital = environment[0].toUpperCase() + environment.substring(1);
    }

    const outputFileName = application + enviromentWithCapital + version + description + ".apk"

    console.log(`Running for ${application} | ${environment} | ${version} and will produce:\n ${outputFileName}`)
    if (description) { console.log(`WITH Description: ${description}`) }

    //2 config data
    //read the data in the config file
    const rnrmConfigData = envFileToObject(`${process.env.PWD}/rnrm/config.js`);
    //WIP get the version that corresponds to this app
    let foundVersionKey = Object.keys(rnrmConfigData).find(item => {
        return item.includes("RNRM_SEMANTIC_VERSION") && item.includes(application)
    })
    if (foundVersionKey) {
        version = rnrmConfigData[foundVersionKey]
    }

    //3. other things to inject
    const currentBranchName = getCurrentBranchName();
    if (!currentBranchName) {
        console.log("!!!Issue with getting current branch");
        process.exit();
    }

    const allContext = {
        cliProps: {
            application,
            environment,
            version,
            description,
            outputFileName,
            projectPath: process.env.PWD,
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