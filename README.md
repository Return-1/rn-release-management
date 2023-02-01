# What this tool provides for you

A set of conventions and predefined functions to automate the management of your Android and iOS releases and env management. Particularly useful if you're using flavors.

**Android:**
- building the proper flavor/environment combination on Android
- managing envs so don't need to worry if your build variant has the right env file included
- logging history of apk size per build variant and diffing apk size
- storing all your apks on a folder so you've got some apk history
- other ( WIP to write )

**iOS:**
- By using the generateEnv.js file you can also make sure your iOS scheme/target variants will always build with the proper .env file

# Assumptions to use rn-release-management

### You've got set up Flavors on Android
You have setup flavors on android/app/build.gradle file that look like
<appName><appEnvironment(staging|production|whatever)>

# Setting Up
run `releaseAndroid.js --init`

### Env files
You have set up an /envs folder that lives in /src/envs and the files look like
env.<appName><appEnvironment>

The files are supposed to look like :

```
const envData = {
    key1: asdad //whatever
}
export default envData
```

# Future work :

### High prio
1. Currently there's this issue where version provided by the cli is not respected, it's only used as a description, so find a way to unify that and see if it should be the versioning.js file that should be respected/incremented or not.

2. Make it work even without flavors. Prompt if no flavor/environment combo is provided with info saying it is suggested to do so

3. Save a list of commits in the device all that have a prefix of COMPANYNAMEDEVL_xxxx where xxxx is the number

### Low prio/later:
-3 building on iOS
-4STEP: uploading apk ssh
-5 DEFAULTS should be overrideable in scripts.config.js
-6 should make envData be allowed to add comments on first line etc and parse it better
-7 Is there really any reason to have the envs be env.flavorName.envName.js instead of going for the complete final variant like say <appName><envName>.env.js? This would help the code not need the capitalize function
-8 generate apk size history default and overrideable log output location