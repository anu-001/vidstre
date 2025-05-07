#!/bin/bash

# Release script v1.0.0

# Get the app name from package.json
appName=`node -pe "require('./package.json').name"`

echo "Starting new release for $appName"

# Pull the latest changes from develop
git checkout develop
git pull

# Get the new version
version=`node -pe "require('./package.json').version"`

# Create release branch
git checkout -b release/$version

# Switch to test branch 
git checkout test

# Merge the release branch into test
GIT_MERGE_AUTOEDIT=no git merge --no-ff release/$version

git push

# Delete the release branch
git branch -d release/$version

echo "Release successful"