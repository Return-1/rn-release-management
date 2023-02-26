# What this tool provides for you

This CLI tool offers a collection of commonly needed steps that can be executed directly from the root of your project. It facilitates the process of building and automating your mobile releases, and simplifies the management of your environment variables. Flavor friendly.

Here's a sample recipe that demonstrates how these steps can be utilized to build your app:

```js
//checks if you're building in the correct branch, else it fails
isCorrectBranch({ ...context, userProps: { branchName: "master" } })
//set the correct environment/flavor env for your build and place proper env variables in native
//files like .plists or other configs
generateEnvFile(context);
generateAppInfoComponent(context)

//generate the apk named sensibly (e.g) myApp_staging_v1.0.0_buildNo1412_date.apk
generateApk(context)
//generate apk history log so you know if your apk has bloated in size
generateApkSizeHistory(context)
//upload the apk to slack 
uploadApk(context)
//tag the branch so you know where you've performed your build
tagBranch(context);
//create a React Native component that displays device info like build version/semantic version
//as well as a list of 2 months worth of commits and more so you can import in your app and know
//factually what this version contains ( for developers )
generateAppInfoComponent(context)
```

# Setting up ( soon on npm, follow this for now )

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

### Env files

A core concern of this library is making sure that you only need to set your env variables in one place and need not concern yourself with making sure your native files ( such as .plist files ) or your build flavor have been included the right environment. In your `.js` files, all you need to do is import a main `env.js` file from `src/env.js` and this library will make sure that file's contents are as needed.

The convention here is that you have set up a `..rootOfYourProject/src/envs` folder and the env filenames in it look like `env.<appName><appEnvironment>`

The env file contents are expected to look like :
```js
const envData = {
    key1: asdad, //whatever
}
export default envData
```

This library will pick the correct env file depending on what flavor/environment you're running in and generate an appropriate env file always named env.js so you can import it in your files.

### Initializing

Run `rnrm init` and this will create some files needed from this library to operate.

# Recipes
Currently by default `/rnrm` contains two recipies ( which is nothing more than a series of commonly used steps for changing the environment or building and distributing your android app privately)

### I wanna change my environment
`node rnrm/changeEnvironment.js [flavorName] [environment]` 

`node rnrm/releaseAndroid.js [flavorName] [environment] "some description"`

### Available Steps to make your own recipe

You can see the documentation of each individual step in the `/steps` folder

`isCorrectBranch`

`getContext`

`generateEnvFile`

`generateAppInfoComponent`

`generateFilesFromTemplates`

`generateApk`

`generateApkSizeHistory`

`uploadApk`

`tagBranch`

### Flavors

We're currently making the assumption that you've got set up flavors on Android
You have setup flavors on android/app/build.gradle file that look like
[appName][appEnvironment(e.g staging|production|whatever)]

### Other things to note:
$RNRM_SEMANTIC_VERSION
$RNRM_BUILD_NUMBER

these suffixes hold special meaning at the end of env variables on the config.js file
e.g steps that utilize those are `bumpConfigVersions` and `getContext`

# Future work :

### High prio

!!!!
!!!!
0. We need to have a centralized concept of versioning as right now command line version ( which is only used for naming and config.js version do not align in any way.)
!!!!
!!!!

1. Cli to work description flag 

2. Make sure it works without flavors and if it doesn't, see what needs to be done for it do be able to.

3. building on iOS

4. Hash envs should also be here as a step so devs know what they don't have in common. Make it also per file not one huge file and put them in the envHashes folder ( if not exist then create )

### Low prio/later:

-2 Instead of requiring a buttload of steps it would be better to just require RNRM and imperatively call the steps like RNRM.generateEnv(context)
-5 DEFAULTS should be overrideable in scripts.config.js
-6 should make envData be better. Etc. be allowed to add comments on first line etc and parse it better. Additionally now config.js in rnrm is of the same const envData = format cause it's convenient but should change that. 
-8 generate apk size history default and overrideable log output location
-9 instruct users to make index.js into index.rnrm-template.js so that we can kill logs centrally.
-10 Step to get current version from store.
ios : let requestURL = "https://itunes.apple.com/lookup?bundleId=\(bundleId)" ( it works i checked ). Maybe even make a releases tab for this.

## Concerns migrating from our current build system

Why not provide version in cli anymore?
> Because you can't easily see the commit history, only after the fact. It's better to be changing it centrally after seeing exactly what the previous version was. Description is still allowed.

Why use .rnrmtemplate files instead of file tags like before?
> Basically previous attempt was faulty in .plist files that were stripping extra comments and xcode is generally messing around. Also, this is a lot easier to code and maintain and clearer as to what changes are being made by a simple file diffing approach.

Also:
-We should probably only use the capitalized version of the environment to avoid confusion so for exmaple Production and Preview. As such it would be best to rename envs accordingly so like : 
`env.appName.Preview.js`