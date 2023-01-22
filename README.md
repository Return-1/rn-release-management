# What this tool provides for you

**Android:**
- building the proper flavor/environment combination on Android
- managing envs so don't need to worry if your build variant has the right env file included
- logging history of apk size per build variant and diffing apk size
- storing all your apks on a folder so you've got some apk history
- other ( WIP to write )

**iOS:**
- By using the generateEnv.js file you can also make sure your iOS scheme/target variants will always build with the proper .env file

# Assumptions to use rn-release-management

### You've got set up Flavors
You have setup flavors on android/app/build.gradle file that look like
<appName><appEnvironment(staging|production|whatever)>

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

- Make it work even without flavors. Prompt if no flavor/environment combo is provided with info
saying it is suggested to do so
- a way for you to define your own tasks for building
- even better env management by utilizing templates to generate native file management
- autoincrementing versions
- building on iOS
- uploading apk to slack
- uploading apk using ssh somewhere?
- make the IGNORABLES/archiveAPKs folder configurable in scripts.config.EXAMPLE.js
- should make envData be allowed to add comments on first line etc and parse it better