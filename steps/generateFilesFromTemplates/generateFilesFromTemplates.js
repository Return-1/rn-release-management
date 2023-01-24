const chalk = require('chalk');
var fs = require('fs');
//ours
var { getScriptParamsAsObject, DEFAULTS } = require('../../helpers')

const { cliProps: {
    projectPath
} } = getScriptParamsAsObject(process.argv)

//find all templated files in projectPath
let templatesToGenerateFrom = []
//TODO:

//generate files for these templates
templatesToGenerateFrom.forEach(templateFilePath => {
    let fileDataAsString = fs.readFileSync(templateFilePath).toString()

    //Replace all placeholders with the appropriate thing from the env file
    fileDataAsString = fileDataAsString.replace(/\%\%SOMETHING\%\%/g, "hehe")
    fs.writeFileSync(`${projectPath}/${DEFAULTS.apkOutputPath}`, fileDataAsString)
})