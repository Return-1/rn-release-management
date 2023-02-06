const chalk = require('chalk');
var fs = require('fs');
const { spawnSync } = require('child_process');
//ours
var { getScriptParamsAsObject, DEFAULTS, envFileToObject } = require('../../helpers')

const { cliProps: {
    projectPath
}, userProps: {
    files = [], //the list of files to work on 
    injectedChangeData = {}, //change data to include, basically merge with envData
    autodetect = true,
} } = getScriptParamsAsObject(process.argv)

const envData = envFileToObject(`${process.env.PWD}/${DEFAULTS.envFilePathOutput}/env.js`);
const rnrmConfigData = envFileToObject(`${process.env.PWD}/rnrm/config.js`);
const finalChangeData = { ...rnrmConfigData, ...envData, ...injectedChangeData }

let listOfFiles = files;

//1. autodetect
if (autodetect) {
    let autodetectedFiles = autodetectTemplatesAndAddChangeData(finalChangeData)
    // console.log(autodetectedFiles)
    //TODO: IF FILE PATH EXISTS IN files, ignore in autodetect
    listOfFiles = [...autodetectedFiles, ...files,]
}

//2. generate files for these templates
generateFilesFromTemplates(listOfFiles)

///////////
//FUNCTIONS
//////////
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
            return { stringToReplace: "%%" + envFieldKey + "%%", replaceWith: changeDataInput[envFieldKey] }
        })

        return {
            filePath,
            changeData
        }
    })
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
    //
    //Data provided like this will override any data found in env files or 
    //injectedChangeData provided. This is more specific and as such receives
    //top priority

    filepathsWithChangeData.forEach(item => {

        let fileDataAsString = fs.readFileSync(item.filePath).toString()

        //Replace all placeholders with the appropriate thing from the env file
        item.changeData.forEach(changeData => {
            let text = changeData.stringToReplace;
            text = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            let regex = new RegExp(text, 'g')
            fileDataAsString = fileDataAsString.replace(regex, changeData.replaceWith)
        })

        fs.writeFileSync(item.filePath.replace(".rnrmtemplate", ""), fileDataAsString)
    })
}