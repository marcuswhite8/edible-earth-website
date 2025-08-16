#!/bin/bash

# Git commands to update your GitHub repository
# Run this script from the "Edible earth" folder

echo "Initializing git repository..."
git init

echo "Adding remote repository..."
git remote add origin https://github.com/marcuswhite8/edible-earth-website.git

echo "Setting main branch..."
git branch -M main

echo "Adding all files..."
git add .

echo "Committing changes..."
git commit -m "Update mobile responsiveness and fix styling issues"

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your GitHub repository has been updated."