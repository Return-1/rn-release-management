let { spawnSync } = require('child_process');
const chalk = require('chalk')
var fs = require('fs');
//ours
var config = require(process.env.PWD + '/scripts.config.js')
var { isVersionStringValid } = require("../../helpers");

const application = config.allowedApps[process.argv[2]];
const environment = config.allowedEnvironments[process.argv[3]];
const enviromentWithCapital = environment[0].toUpperCase() + environment.substring(1);
const version = process.argv[4]

checkIfArchiveFolderExistsElseCreate();
validateInputs(application, environment, version);

console.log(`generateAndroidApk.sh for ${application} ${enviromentWithCapital} ${version}`);

var proc = spawnSync(`bash`, [__dirname + "/" + `generateApk.sh`, `${application}`, `${environment}`, `${version}`, `${enviromentWithCapital}`], { stdio: 'inherit' })

if (proc.status === 0) {
    console.log(chalk.green("SUCCESS: generateAndroidApk.sh"))
} else {
    console.log(chalk.red("ERROR: generateAndroidApk.sh"))
    process.exit(1);
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

function checkIfArchiveFolderExistsElseCreate() {
    let dir = process.env.PWD + "/IGNORABLES/archiveAPKs"
    if (!fs.existsSync(dir)) {
        console.log(dir + " doesn't exist. Creating ...")
        fs.mkdirSync(dir, { recursive: true });
    }
}