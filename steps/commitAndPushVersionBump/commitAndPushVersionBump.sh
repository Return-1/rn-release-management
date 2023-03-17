#!/bin/sh

application=$1
version=$2
buildNumber=$3
branchName=$4
commitMessage=$5


set -e # exit immediately if a command exits with a non-zero status

git add .
git commit -m "$commitMessage"
git push origin $branchName