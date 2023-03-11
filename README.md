# Overview

This CLI tool facilitates the process of building and automating your mobile releases by providing a collection of commonly used build/config steps that can be executed directly from the root of your project.
Easy env management, from the js to the native realm, aab, apk generation, uploading to slack and lots of other utilities. Flavor friendly.

### **Example recipe**

Here's a sample recipe that demonstrates how these steps can be utilized to build your app:

```js
//[In some .js file place the following]

var {isCorrectBranch...} = require("rn-release-management")
// Check if the build is being done on the correct branch, otherwise fail
isCorrectBranch({ branchName: "master" })

// Generate the environment file with appropriate environment/flavor and
// configure native files like .plists or build.gradle
generateEnvFile();
generateFilesFromTemplates();
generateAppInfoComponent()

// Generate the binary (default apk ) with a sensible name convention (e.g., myApp_staging_v1.0.0_buildNo1412_date.apk)
generateAndroidBinary()

// Populate a cumulative log of binary size history to track if the binary has bloated in size
generateAndroidBinarySizeHistory()

// Upload the binary. Defaulting to Slack
uploadAndroidBinary()

// Tag the branch to identify where the build was performed
tagBranch();

// Create a React Native component that displays device info such as build version, semantic version,
// and a list of two months' worth of commits. Useful for developers to know
// what the current version contains when imported in the app and where it was built.
generateAppInfoComponent(context)
```

# Setting up ( soon on npm, follow this for now )

### **Manual install**
Clone this project on the same folder level as your project.

```
cd rn-release-management
npm install
npm link
```

Then go to your own project and run
```
npm link rn-release-management
```

### **Env files**

This library ensures that you only need to set your environment variables in one location. You don't have to worry about adding the correct environment to your native files (e.g., .plist files) or build flavors. Simply import a main `env.js` file from `src/env.js` in your `.js` files, and the library takes care of everything.

The convention is to create a `..rootOfYourProject/src/envs` folder with environment filenames in the format `env.<appName><appEnvironment>.js`.

The env file contents are expected to look like :
```js
const envData = {
    key1: asdad, //whatever
}
export default envData
```

This library automatically selects the correct environment file based on your flavor/environment and generates an env.js file accordingly, which you can import into your files.

### Initializing

Execute `rnrm init` to create the necessary files required for this library to function.

# Recipes

Recipes are prebuilt `.js` files located in `/rnrm` that execute common sequences of steps.

Currently, `/rnrm` contains two default recipes:
`changeEnvironment.js` for changing the environment
`releaseAndroid.js` for building and privately distributing your Android app.

After executing initializing, you can locate these recipes in your project. Feel free to customize them or create new ones to suit your needs.

### Example execution of recipe for changing the environment
`node rnrm/changeEnvironment.js [flavorName] [environment]` 
### Example execution of for releasing an android binary
`node rnrm/releaseAndroid.js [flavorName] [environment] "some description"`

# Available steps

Steps are nothing more than premade functions that are commonly used in the building/releasing process either locally or by your CI/CD system. They are found in the `/steps` folder.
Refer to the corresponding README.md file on each step to access the documentation.

A list of some common available steps can be found below:

- `isCorrectBranch`
- `getContext`
- `generateEnvFile`
- `generateAppInfoComponent`
- `generateFilesFromTemplates`
- `generateAndroidBinary`
- `generateAndroidBinarySizeHistory`
- `uploadAndroidBinary`
- `tagBranch`

### Flavors

We're currently making the assumption that you've got set up flavors on Android
You have setup flavors on android/app/build.gradle file that look like
[appName][appEnvironment(e.g staging|production|whatever)]

### Other things to note ( definitely need to rewrite this part and move some of it to getContext ):

We do enforce the convention that the semantic version and build number will be derived by the config.js file. For more information refer to the `getContext` step. The convention looks like this

If you're trying to build with flavorName = myApp then getContext will look into the config.js file for
myApp_$RNRM_BUILD_NUMBER and increment it. It will also look for myApp_$RNRM_SEMANTIC_VERSION and use it to set the semantic version of the app

These suffixes hold special meaning at the end of env variables on the config.js file
e.g steps that utilize those are `bumpConfigVersions` and `getContext`

Suggested things to add to .gitignore:
/rnrm/RNRMAppInfo/commitData.js
/rnrm/RNRMAppInfo/systemInfo.js

# Future work :

### High prio

1. step to commit version bumping.

2. Make sure it works without flavors and if it doesn't, see what needs to be done for it do be able to.

3. building on iOS

4. Hash envs should also be here as a step so devs know what they don't have in common. Make it also per file not one huge file and put them in the envHashes folder ( if not exist then create )

### Low prio/later:

-1 .rnrmtemplate to be before the file extension because it breaks formatting and linting
-2 Instead of requiring a buttload of steps it would be better to just require RNRM and imperatively call the steps like RNRM.generateEnv(context)
--We should probably only use the capitalized version of the environment to avoid confusion so for exmaple Production and Preview. As such it would be best to rename envs accordingly so like : 
`env.appName.Preview.js`

-5 DEFAULTS should be overrideable in scripts.config.js
-6 should make envData be better. Etc. be allowed to add comments on first line etc and parse it better. Additionally now config.js in rnrm is of the same const envData = format cause it's convenient but should change that. 
-8 generate apk size history default and overrideable log output location
-9 instruct users to make index.js into index.rnrm-template.js so that we can kill logs centrally.
-10 Step to get current version from store.
ios : let requestURL = "https://itunes.apple.com/lookup?bundleId=\(bundleId)" ( it works i checked ). Maybe even make a releases tab for this.
000 -  Cleanup context-temp.json at the end with a cleanup() step
## OTHER

(move to appropriate step)
Why use .rnrmtemplate files?
> Lots of native files in many places require env management, it's hard to be changing all the .plists build.gradle files and whatever flavor specific file needed all the time. Adding meta tags helps