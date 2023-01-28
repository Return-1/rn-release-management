//TODO: FIRST TIME AROUND GENERATE THOSE .rnrmtemplate files
//FOR IOS
//THIS COMMAND FINDS ALL THE PLIST FILES IN XCODE THAT
//ARE LIKELY RELEVANT. COULD USE THIS TO GENERATE .rnrmtemplate files the first time around
// find./ ios - type f - name "*.plist" | grep - vE 'Pods|xcodeproj|xcworkspace|Tests'

//FOR ANDROID
//One gradle file we care for at android/app/build.gradle

//iMPLEMENTATION
//Look for those .rnrmtemplate files