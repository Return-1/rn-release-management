const chalk = require('chalk');
var fs = require('fs');
const { spawnSync } = require('child_process');
//ours
var { getScriptParamsAsObject, DEFAULTS, envFileToObject } = require('../../helpers')

const { cliProps: {
    projectPath
}, userProps: {
    files,
    autodetect,
} } = getScriptParamsAsObject(process.argv)

const envData = envFileToObject(`${process.env.PWD}/${DEFAULTS.envFilePathOutput}/env.js`);

//autodetect
autodetectTemplatesAndAddChangeData(envData)
process.exit();

//generate files for these templates
generateFilesFromTemplates(files)

//FUNCTIONS
function autodetectTemplatesAndAddChangeData(changeDataInput) {

    //autodetect file paths in ${projectPath}
    proc = spawnSync("find", [projectPath, "-name", "*.rnrmtemplate", "-not", "-path", "*node_modules*", "-prune"]);
    let autodetectedFilePaths = proc.stdout.toString().split('\n').slice(0, -1);

    //add change data
    let autodetectedFilePathsWithChangeData = autodetectedFilePaths.map(filePath => {

        //change data added is based on the object file that is provided that looks like
        // { key1: value1 }. This example
        // Will change all %%key1%% items on templates with value value1
        let changeData = Object.keys(changeDataInput).map(envFieldKey => {
            console.log(envFieldKey)
            return { stringToReplace: "%%" + envFieldKey + "%%", replaceWith: envData[envFieldKey] }
        })

        return {
            filePath,
            changeData
        }
    })

    console.log(JSON.stringify(autodetectedFilePathsWithChangeData, null, 4))
    return autodetectedFilePathsWithChangeData;
}

function generateFilesFromTemplates(filepathsWithChangeData) {

    //filepathsWithChangeData should look like: 
    // {
    //     name: "generateFilesFromTemplates", properties: {
    //         files: [
    //             {
    //                 filePath: string,
    //                 changeData: [
    //                     { stringToReplace: string, replaceWith: string },
    //                     { stringToReplace: string, replaceWith: string },
    //                 ]
    //             },
    //             ...
    //         ]
    //     }
    // },

    filepathsWithChangeData.forEach(item => {

        let fileDataAsString = fs.readFileSync(item.filePath).toString()

        //Replace all placeholders with the appropriate thing from the env file
        item.changeData.forEach(changeData => {
            let text = changeData.stringToReplace;
            text = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            let regex = new RegExp(text, 'g')
            console.log(regex)
            fileDataAsString = fileDataAsString.replace(regex, changeData.replaceWith)
        })

        fs.writeFileSync(item.filePath.replace(".rnrmtemplate", ""), fileDataAsString)
    })
}