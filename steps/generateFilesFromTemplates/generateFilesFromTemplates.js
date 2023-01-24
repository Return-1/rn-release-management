const chalk = require('chalk');
var fs = require('fs');
//ours
const config = require(process.env.PWD + '/scripts.config.js')
var { versionToNumber, isVersionStringValid } = require('../../helpers')

let arguments = [...process.argv]

console.log(arguments)
process.exit();

let templatesToGenerateFrom = config.templatesToGenerateFrom || [`${process.env.PWD}/aa.text.rnrmtemplate`]

templatesToGenerateFrom.forEach(templateFilePath => {
    let fileDataAsString = fs.readFileSync(templateFilePath).toString()
    fileDataAsString.replaceAll("%%SOMETHING%%", "hehe")
    fs.writeFileSync(relativePathToGradle, newGradleFileDataString)
})