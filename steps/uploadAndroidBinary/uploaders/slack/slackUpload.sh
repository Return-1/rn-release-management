#!/bin/bash 
slackChannels=$1
slackToken=$2
apkPath=$3

set -e # exit immediately if a command exits with a non-zero status

ls -lah $apkPath

## delete previous source maps in case they exist just to be sure
echo -e "====Will upload binary $apk to $slackChannels====\n"
curl -F file=@$apkPath -F channels=$slackChannels -H "Authorization: Bearer $slackToken" https://slack.com/api/files.upload --progress-bar | cat
echo -e "====Done uploading===="