#!/bin/bash
filterCommitsBy=$1

set -e # exit immediately if a command exits with a non-zero status

# Get the commit log for the past two months, formatted with commit hash, author name, date, and subject
commit_log=$(git log --since="2 months ago" --pretty=format:'%h %an %ad %s')
# echo -e "$commit_log"

# Filter the commit log to only show entries that include the substring "NVDEVEL" (if filterCommitsBy is not empty)
if [[ -n "$filterCommitsBy" ]]; then
  nvdevel_log=$(echo -e "$commit_log" | grep "$filterCommitsBy")
else
  nvdevel_log="$commit_log"
fi

echo -e "$nvdevel_log"