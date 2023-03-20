#!/bin/sh
branchName=$1
commitMessage=$2


set -e # exit immediately if a command exits with a non-zero status

git add .
git commit -m "$commitMessage"
git push origin $branchName