let { spawnSync } = require('child_process');
const chalk = require('chalk')

//ours
var { isVersionStringValid, getScriptParamsAsObject, checkIfArchiveFolderExistsElseCreate, DEFAULTS, createContextFile } = require("../../helpers");
const { AVAILABLE_PACKAGING_FORMATS } = require('./helpers');

let context = getScriptParamsAsObject(process.argv)
const { cliProps: {
    application,
    environmentWithCapital,
    version,
    outputFileName,
}, userProps: {
    packagingFormat = AVAILABLE_PACKAGING_FORMATS.apk, //.aab or .apk
} } = context;

const { dir: binaryArchiveOutputPath } = checkIfArchiveFolderExistsElseCreate(`${process.env.PWD}/${DEFAULTS.androidBinaryOutputPath}${packagingFormat}`);

//PACKAGE EVERYTHING INTO CONTEXT cliProps so it's available for later steps
generateContextForAndroidBinaryStep(packagingFormat, outputFileName, binaryArchiveOutputPath);

console.log(`generateAndroidBinary.sh for ${application} ${environmentWithCapital} ${version}`);

var proc = spawnSync(`bash`,
    [__dirname + "/" + `generateAndroidBinary.sh`,
    `${application}`,
    `${environmentWithCapital}`,
    `${binaryArchiveOutputPath}`,
    `${outputFileName}`,
        packagingFormat], { stdio: 'inherit' })


if (proc.status === 0) {
    console.log(chalk.green("SUCCESS: generateAndroidBinary.sh"))
} else {
    console.log(chalk.red("ERROR: generateAndroidBinary.sh"))
    process.exit(1);
}

//FUNCTIONS
function generateContextForAndroidBinaryStep(packagingFormat, outputFileName, binaryArchiveOutputPath) {
    context.cliProps["binaryArchiveOutputPath"] = binaryArchiveOutputPath;
    context.cliProps["packagingFormat"] = packagingFormat;
    context.cliProps["outputFileNameWithExtension"] = outputFileName + "." + packagingFormat
    context.cliProps["finalOutputFilePath"] = `${binaryArchiveOutputPath}/${outputFileName}.${packagingFormat}`;
    createContextFile(context)
}

//currently unused
// function validateInputs(application, environment, version) {
//     if (!application || !environment) {
//         console.error(chalk.red("Wrong application name or environment "));
//         process.exit(1);
//     }

//     if (!isVersionStringValid(version)) {
//         console.error(chalk.red(`Version ${version} provided invalid.`));
//         process.exit(1);
//     }
// }