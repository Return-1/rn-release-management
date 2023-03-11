const fs = require('fs')
const chalk = require('chalk')
const { getScriptParamsAsObject, checkIfArchiveFolderExistsElseCreate } = require("../../helpers")

let context = getScriptParamsAsObject(process.argv)
const { cliProps: {
    application,
    environmentWithCapital,
    version,
    projectPath,
    packagingFormat,
    finalOutputFilePath
} } = context


const logFilePath = `${projectPath}/rnrm/appSizeHistory/${application}-size-${packagingFormat}.log`

const getFilesizeInMegaBytes = filename => {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats["size"]
    return (fileSizeInBytes / 1000000.0).toFixed(2)
}
const getRecordSize = record => {
    const newRecord = record.split(/['|','MB', ]+/)
    return newRecord[1]
}

const generateSizeDifferentMessage = (differntSize) => {
    if (differntSize > 0) console.log(chalk.yellow(`!! WARNING!! : the file size has been increased by ${differntSize} MB`))
    else if (differntSize < 0) console.log(chalk.green(`The file size has been reduced by ${differntSize} MB`))
}

const logSizeHistoryToFile = () => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString().replace("AM", "").replace("PM", "");
    const currentDateTime = `${currentDate.toLocaleDateString()}-${currentTime}`;

    let history;
    const currentSize = getFilesizeInMegaBytes(finalOutputFilePath);

    //TODO: This should be done sync like everything else..
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(chalk.red(`An error occurred while reading the log file: ${err}`));
            return;
        }

        const records = data.toString().split('\n');
        if (records.length === 1) {
            history = `${currentDateTime} | ${currentSize} MB | ${application} | ${environmentWithCapital} | ${version} | ${currentSize}\n`;
        } else {
            const lastLine = records[records.length - 2];
            const lastSize = getRecordSize(lastLine);
            const sizeDifference = (currentSize - lastSize).toFixed(2);
            generateSizeDifferentMessage(sizeDifference);
            history = `${currentDateTime} | ${currentSize} MB | ${application} | ${environmentWithCapital} | ${version} | ${sizeDifference}\n`;
        }

        //TODO: This too should be done sync
        fs.writeFile(logFilePath, history, { flag: 'a', encoding: 'utf8' }, (err) => {
            if (err) console.log(chalk.red(`An error occurred while writing to the log file: ${err}`));
        });
    });
};

//check if folder exists,if not create
checkIfArchiveFolderExistsElseCreate(`${projectPath}/rnrm/appSizeHistory`)

//if file doesn't exist, create an empty, else continue
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '')
}

logSizeHistoryToFile()