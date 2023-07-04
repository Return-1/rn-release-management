#!/bin/bash 
serverIPAddress=$1 
serverUploadDirectory=$2 
apkPath=$3


set -e # exit immediately if a command exits with a non-zero status

ls -lah $apkPath

## delete previous source maps in case they exist just to be sure
echo -e "====Will upload binary $apkPath to $serverIPAddress:$serverUploadDirectory====\n"
scp $apkPath $serverIPAddress:$serverUploadDirectory 
echo -e "====Done uploading===="
