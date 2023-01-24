#!/bin/sh
app=$1
enviroment=$2
version=$3
enviromentWithCapital=$4
apkOutputPath=$5

versionName=$app$enviromentWithCapital$version
echo -e "in sh file !!"
pwd
cd ./android
pwd

./gradlew clean 
echo -e "in .sh BUILDING FOR"
echo -e $environment $app
echo -e "\n\n~~~generateApk.sh: DONE WITH CLEANING\n\n"
echo -e "Will now run:\n ./gradlew assemble"$app""$enviromentWithCapital"Release"
./gradlew assemble"$app""$enviromentWithCapital"Release
echo -e "\n\n~~~generateApk.sh: DONE WITH ASSEMBLING RELEASE\n\n"
cp  app/build/outputs/apk/"${app}""$enviromentWithCapital"/release/app-$app$enviromentWithCapital-release.apk ../$apkOutputPath/$versionName.apk
echo -e "\n\n~~~generateApk.sh: DONE WITH COPYING. Contents of archive folder:\n\n"
ls ../IGNORABLES/archiveAPKs