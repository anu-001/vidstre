#!/bin/bash

# Release script v1.1.0

set -e # Exit immediately if a command exits with a non-zero status

# Default configuration
VERBOSE=true
PUSH_CHANGES=true

# Parse command line options
while getopts "qn" opt; do
  case $opt in
    q) VERBOSE=false ;; # Quiet mode
    n) PUSH_CHANGES=false ;; # No push mode (dry run)
    *) echo "Usage: $0 [-q] [-n]" >&2
       echo "  -q: Quiet mode"
       echo "  -n: No push (dry run)"
       exit 1 ;;
  esac
done

# Function for logging
log() {
  if [ "$VERBOSE" = true ]; then
    echo "$1"
  fi
}

# Function to check if working directory is clean
check_working_dir() {
  if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Working directory is not clean. Please commit or stash your changes."
    exit 1
  fi
}

# Get the app name from package.json
if [ ! -f package.json ]; then
  echo "Error: package.json not found. Make sure you're in the project root directory."
  exit 1
fi

appName=$(node -pe "require('./package.json').name")
log "Starting new release for $appName from test to production"

# Check that working directory is clean
check_working_dir

# Pull the latest changes from test
log "Checking out test branch..."
git checkout test || { echo "Failed to checkout test branch"; exit 1; }

log "Pulling latest changes..."
git pull || { echo "Failed to pull latest changes"; exit 1; }

# Get the new version
version=$(node -pe "require('./package.json').version")
log "Creating release for version $version"

# Create release branch
log "Creating release branch: release/test"
git checkout -b release/test || { echo "Failed to create release branch"; exit 1; }

# Switch to master branch 
log "Checking out master branch..."
git checkout master || { echo "Failed to checkout master branch"; exit 1; }

# Merge the release branch into master
log "Merging release/test into master..."
GIT_MERGE_AUTOEDIT=no git merge --no-ff release/test || { 
  echo "Merge conflict detected. Please resolve conflicts manually."
  exit 1
}

# Push changes if not in dry run mode
if [ "$PUSH_CHANGES" = true ]; then
  log "Pushing changes to remote..."
  git push || { echo "Failed to push changes"; exit 1; }
else
  log "(Dry run: skipping git push)"
fi

# Delete the release branch
log "Deleting release branch..."
git branch -d release/test || { echo "Failed to delete release branch"; exit 1; }

log "Release successful to master(production)"