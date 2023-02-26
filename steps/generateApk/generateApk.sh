#!/bin/sh
app=$1
enviromentWithCapital=$2
apkOutputPath=$3
whatToNameTheApk=$4

set -e # exit immediately if a command exits with a non-zero status

echo -e "in generate apk sh file !! version name: "$versionName
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
cp  app/build/outputs/apk/"${app}""$enviromentWithCapital"/release/app-$app$enviromentWithCapital-release.apk ../$apkOutputPath/$whatToNameTheApk.apk
echo -e "\n\n~~~generateApk.sh: DONE WITH COPYING. Contents of archive folder:\n\n"
ls ../IGNORABLES/archiveAPKs