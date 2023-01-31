const program = require("commander")

const getContext = (process) => {
    const application = process.argv[2];
    const environment = process.argv[3];
    const version = process.argv[4] || ""
    const description = program.desc || ""
    //todo: look at readme can prolly do away with this
    const outputFileName = application + environment[0].toUpperCase() + environment.substring(1) + version + description + ".apk"

    console.log(`Running for ${application} | ${environment} | ${version} and will produce:\n ${outputFileName}`)
    if (program.desc) { console.log(`Description: ${program.desc}`) }

    const allContext = { cliProps: { application, environment, version, description, outputFileName, projectPath: process.env.PWD, cliPath: __dirname, }, userProps: {} }
    // console.log(allContext);
    return allContext;
}

module.exports = { getContext }