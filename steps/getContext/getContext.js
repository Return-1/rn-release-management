const program = require("commander")
const { getCurrentBranchName } = require("./helpers")

const getContext = (process) => {
    //cli arguments to inject
    const application = process.argv[2];
    const environment = process.argv[3];
    const version = process.argv[4] || ""
    const description = process.argv[5] || ""

    //todo: look at readme can prolly do away with this

    let enviromentWithCapital = "";
    if (environment) {
        enviromentWithCapital = environment[0].toUpperCase() + environment.substring(1);
    }

    const outputFileName = application + enviromentWithCapital + version + description + ".apk"

    console.log(`Running for ${application} | ${environment} | ${version} and will produce:\n ${outputFileName}`)
    if (description) { console.log(`WITH Description: ${description}`) }

    //other things to inject
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
        },
        userProps: {}
    }

    return allContext;
}

module.exports = { getContext }