const fs = require('fs')
const chalk = require('chalk')
const { getScriptParamsAsObject, checkIfArchiveFolderExistsElseCreate, AVAILABLE_PACKAGING_FORMATS } = require("../../helpers")

const { cliProps: {
    application,
    environment,
    version,
    projectPath,
} } = getScriptParamsAsObject(process.argv)

//TODO: This will soon go check readme
//TODO: this will soon go look at readme
let enviromentWithCapital = "";
if (environment) {
    enviromentWithCapital = environment[0].toUpperCase() + environment.substring(1);
}

let apkSizeHistoryLogFilePath = `${projectPath}/rnrm/appSizeHistory/${application}-size-apk.log`
const releaseApkPath = `${projectPath}/android/app/build/outputs/apk/${application}${enviromentWithCapital}/release`
const apk = `${releaseApkPath}/app-${application}${enviromentWithCapital}-release.apk`

const aabSizeHistoryLogFilePath = `${projectPath}/rnrm/appSizeHistory/${application}-size-aab.log`
const releaseAabPath = `${projectPath}/android/app/build/outputs/bundle/${application}${enviromentWithCapital}Release`
const aab = `${releaseAabPath}/app-${application}${enviromentWithCapital}-release.aab`

const getFilesizeInMegaBytes = filename => {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats["size"]
    return (fileSizeInBytes / 1000000.0).toFixed(2)
}
const getRecordSize = record => {
    const newRecord = record.split(/['|','MB', ]+/)
    return newRecord[1]
}

const generateSizeDifferenteMessage = (differntSize) => {
    if (differntSize > 0) console.log(chalk.yellow(`!! WARNING!! : the file size has been increased by ${differntSize} MB`))
    else if (differntSize < 0) console.log(chalk.green(`The file size has been reduced by ${differntSize} MB`))
}

const logSizeHistoryToFile = (logFilePath, package) => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString().replace("AM", "").replace("PM", "");
    const currentDateTime = `${currentDate.toLocaleDateString()}-${currentTime}`;

    let history;
    const currentSize = getFilesizeInMegaBytes(package);

    //TODO: This should be done sync like everything else..
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(chalk.red(`An error occurred while reading the log file: ${err}`));
            return;
        }

        const records = data.toString().split('\n');
        if (records.length === 1) {
            history = `${currentDateTime} | ${currentSize} MB | ${application} | ${environment} | ${version} | ${currentSize}\n`;
        } else {
            const lastLine = records[records.length - 2];
            const lastSize = getRecordSize(lastLine);
            const sizeDifference = (currentSize - lastSize).toFixed(2);
            generateSizeDifferenteMessage(sizeDifference);
            history = `${currentDateTime} | ${currentSize} MB | ${application} | ${environment} | ${version} | ${sizeDifference}\n`;
        }

        //TODO: This too should be done sync
        fs.writeFile(logFilePath, history, { flag: 'a', encoding: 'utf8' }, (err) => {
            if (err) console.log(chalk.red(`An error occurred while writing to the log file: ${err}`));
        });
    });
};

//check if folder exists,if not create
checkIfArchiveFolderExistsElseCreate(`${projectPath}/rnrm/appSizeHistory`)

if (fs.existsSync(apk)) {
    //if file doesn't exist, create an empty, else continue
    if (!fs.existsSync(apkSizeHistoryLogFilePath)) {
        fs.writeFileSync(apkSizeHistoryLogFilePath, '')
    }

    logSizeHistoryToFile(apkSizeHistoryLogFilePath, apk)
}

if (fs.existsSync(aab)) {
    //if file doesn't exist, create an empty, else continue
    if (!fs.existsSync(aabSizeHistoryLogFilePath)) {
        fs.writeFileSync(aabSizeHistoryLogFilePath, '')
    }

    logSizeHistoryToFile(aabSizeHistoryLogFilePath, aab)
}




