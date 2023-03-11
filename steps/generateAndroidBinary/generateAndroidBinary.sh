#!/bin/sh
app=$1
enviromentWithCapital=$2
binaryOutputPath=$3
whatToNameTheApk=$4
extension=$5

set -e # exit immediately if a command exits with a non-zero status

echo -e "In generateAndroidBinary.sh file for type $extension'!!"
pwd
cd ./android
pwd

echo -e "======Building binary: "
echo -e $whatToNameTheApk

echo - "=====Will now clean"
./gradlew clean 
echo -e "======Done Cleaning"


if [ $extension = "apk" ]
then
    echo -e "Will now run:\n ./gradlew assemble"$app""$enviromentWithCapital"Release"
    ./gradlew assemble"$app""$enviromentWithCapital"Release
    echo -e "\n\n~~~generateApk.sh: DONE WITH ASSEMBLING RELEASE\n\n"
    cp  app/build/outputs/apk/"${app}""$enviromentWithCapital"/release/app-$app$enviromentWithCapital-release.apk $binaryOutputPath/$whatToNameTheApk.apk
else
    echo -e "Will now run:\n ./gradlew bundle"$app""$enviromentWithCapital"Release"
    ./gradlew bundle"$app""$enviromentWithCapital"Release
    echo -e "\n\n~~~generateApk.sh: DONE WITH COPYING. Contents of archive folder:\n\n"
    cp  app/build/outputs/bundle/"${app}""$enviromentWithCapital"Release/app-$app$enviromentWithCapital-release.aab $binaryOutputPath/$whatToNameTheApk.aab
fi

ls ../IGNORABLES/archive_$extension