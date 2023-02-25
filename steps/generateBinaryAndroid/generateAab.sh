#!/bin/sh
app=$1
#TODO: environment here isn't used
enviroment=$2
version=$3
enviromentWithCapital=$4
aabOutputPath=$5

versionName=$app$enviromentWithCapital$version
echo -e "in generate aab sh file !! version name: "$versionName
pwd
cd ./android
pwd

./gradlew clean 
echo -e "in .sh BUILDING FOR"
echo -e $environment $app
echo -e "\n\n~~~generateAab.sh: DONE WITH CLEANING\n\n"
echo -e "Will now run:\n ./gradlew assemble"$app""$enviromentWithCapital"Release"
./gradlew bundle"$app""$enviromentWithCapital"Release
echo -e "\n\n~~~generateAab.sh: DONE WITH ASSEMBLING RELEASE\n\n"
cp  app/build/outputs/bundle/"${app}""$enviromentWithCapital"Release/app-$app$enviromentWithCapital-release.aab ../$aabOutputPath/$versionName.aab
echo -e "\n\n~~~generateAab.sh: DONE WITH COPYING. Contents of archive folder:\n\n"
ls ../IGNORABLES/archiveAABs




