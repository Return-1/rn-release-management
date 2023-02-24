#!/bin/bash
filterCommitsBy=$1

# Get the commit log for the past two months, formatted with commit hash, author name, date, and subject
commit_log=$(git log --since="2 months ago" --pretty=format:'%h %an %ad %s')
# echo -e "$commit_log"

# Filter the commit log to only show entries that include the substring "NVDEVEL"
nvdevel_log=$(echo -e "$commit_log" | grep "$filterCommitsBy")

echo -e "$nvdevel_log"