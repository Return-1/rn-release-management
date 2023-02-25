let { spawnSync } = require('child_process');
const chalk = require('chalk')

//ours
var { isVersionStringValid, getScriptParamsAsObject, checkIfArchiveFolderExistsElseCreate, DEFAULTS, AVAILABLE_PACKAGING_FORMATS } = require("../../helpers");

const { cliProps: {
    application,
    environment,
    version,
    description,
}, userProps: {
    packagingFormat = AVAILABLE_PACKAGING_FORMATS.apk,
} } = getScriptParamsAsObject(process.argv)

//TODO: this will soon go look at readme
let enviromentWithCapital = "";
if (environment) {
    enviromentWithCapital = environment[0].toUpperCase() + environment.substring(1);
}

validateInputs(application, environment, version);

if (packagingFormat === AVAILABLE_PACKAGING_FORMATS.apk) {
    checkIfArchiveFolderExistsElseCreate(process.env.PWD + "/" + DEFAULTS.apkOutputPath);
    generateApk();
}

if (packagingFormat === AVAILABLE_PACKAGING_FORMATS.aab) {
    checkIfArchiveFolderExistsElseCreate(process.env.PWD + "/" + DEFAULTS.aabOutputPath);
    generateAab();
}

function validateInputs(application, environment, version) {
    if (!application || !environment) {
        console.error(chalk.red("Wrong application name or environment "));
        process.exit(1);
    }

    if (!isVersionStringValid(version)) {
        console.error(chalk.red(`Version ${version} provided invalid.`));
        process.exit(1);
    }
}

function generateApk() {
    console.log(`generateAndroidApk.sh for ${application} ${enviromentWithCapital} ${version}`);
    var proc = spawnSync(`bash`, [__dirname + "/" + `generateApk.sh`, `${application}`, `${environment}`, `${version + description}`, `${enviromentWithCapital}`, `${DEFAULTS.apkOutputPath}`], { stdio: 'inherit' })

    if (proc.status === 0) {
        console.log(chalk.green("SUCCESS: generateAndroidApk.sh"))
    } else {
        console.log(chalk.red("ERROR: generateAndroidApk.sh"))
        process.exit(1);
    }
}

function generateAab() {
    console.log(`generateAndroidAab.sh for ${application} ${enviromentWithCapital} ${version}`);
    var proc = spawnSync(`bash`, [__dirname + "/" + `generateAab.sh`, `${application}`, `${environment}`, `${version + description}`, `${enviromentWithCapital}`, `${DEFAULTS.aabOutputPath}`], { stdio: 'inherit' })

    if (proc.status === 0) {
        console.log(chalk.green("SUCCESS: generateAndroidAab.sh"))
    } else {
        console.log(chalk.red("ERROR: generateAndroidAab.sh"))
        process.exit(1);
    }
}