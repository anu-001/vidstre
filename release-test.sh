#!/bin/bash

# Release script v1.0.0

# Get the app name from package.json
appName=`node -pe "require('./package.json').name"`

echo "Starting new release for $appName from test to production"

# Pull the latest changes from test
git checkout test
git pull

# Get the new version
version=`node -pe "require('./package.json').version"`

# Create release branch
git checkout -b release/test

# Switch to test branch 
git checkout master

# Merge the release branch into master
GIT_MERGE_AUTOEDIT=no git merge --no-ff release/test

git push

# Delete the release branch
git branch -d release/test

echo "Release successful to master(production)"