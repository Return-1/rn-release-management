const fs = require('fs')
const chalk = require('chalk')

const config = require(process.env.PWD + '/scripts.config.js')

const version = process.argv[4]
const application = config.allowedApps[process.argv[2]]
const environment = config.allowedEnvironments[process.argv[3]]
const enviromentForApk = config.enviromentTranslations[environment]
const enviromentWithCapital = enviromentForApk[0].toUpperCase() + enviromentForApk.substring(1)

let loggerFile;
const d = new Date();
const time = d.toLocaleTimeString()
const appDirectory = `${process.env.PWD}/android/app`
const dateTime = `${d.toLocaleDateString()}-${time.replace("AM", "").replace("PM", "")}`
const releasePath = `${appDirectory}/build/outputs/apk/${application}${enviromentWithCapital}/release`
const apk = `${releasePath}/app-${application}${enviromentWithCapital}-release.apk`

const getFilesizeInMegaBytes = filename => {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats["size"]
    return (fileSizeInBytes / 1000000.0).toFixed(2)
}
const getRecordApkSize = record => {
    const newRecord = record.split(/['|','MB', ]+/)
    return newRecord[1]
}
const handleMessages = (differntSize) => {
    if (differntSize > 0) console.log(chalk.yellow(`WARNING:the file size has been increased by ${differntSize} MB`))
    else if (differntSize < 0) console.log(chalk.green(`The file size has been reduced by ${differntSize} MB`))
}
const createHistory = () => {
    let history;
    const currentApkSize = getFilesizeInMegaBytes(apk)
    fs.readFile(loggerFile, 'utf8', (err, data) => {
        const records = data.toString().split('\n')
        if (err) console.log(chalk.red(`something went wrong: ${err}`))
        if (records.length === 1) {
            history = `${dateTime} | ${currentApkSize} MB | ${application} | ${enviromentForApk} | ${version} | ${currentApkSize}\n`
        } else {
            const lastLine = records[records.length - 2]
            const lastApkSize = getRecordApkSize(lastLine)
            const differntSize = (currentApkSize - lastApkSize).toFixed(2)
            handleMessages(differntSize)
            history = `${dateTime} | ${currentApkSize} MB | ${application} | ${enviromentForApk} | ${version} | ${differntSize}\n`
        }
        fs.writeFile(loggerFile, history, { flag: 'a', encoding: 'utf8' }, (err) => {
            if (err) console.log(chalk.red(`something went wrong: ${err}`))
        })
    });
}

if (application === 'collaborateDoctor') {
    loggerFile = `${appDirectory}/collaborateDoctor-size.log`
} else loggerFile = `${appDirectory}/collaboratePatient-size.log`

if (fs.existsSync(loggerFile)) {
    createHistory()
} else {
    fs.writeFileSync(loggerFile, '')
    createHistory()
}