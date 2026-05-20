#!/bin/bash
# script/install-deps.sh
# Installs system dependencies required by Puppeteer's Chromium browser
# on Debian/Ubuntu systems. This is useful for running in CI (GitHub Actions)
# or local container environments like docker/act.

set -e # Exit immediately if a command exits with a non-zero status

# Check if the system is Debian/Ubuntu-based
if [ -f /etc/debian_version ]; then
  echo "Debian/Ubuntu system detected. Checking Puppeteer dependencies..."
  
  # Determine if 'sudo' is available (used on GitHub runners) or if we run as root directly (in 'act' docker container)
  SUDO=""
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  fi
  
  # Update package lists
  $SUDO apt-get update
  
  # List of common libraries required by Chromium.
  # Includes both older names (e.g. libasound2) and newer names (e.g. libasound2t64 for Ubuntu 24.04+)
  packages="libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 libgbm1 libasound2 libasound2t64"
  install_list=""
  
  # Check which packages are actually installable (have a candidate) in the repository.
  # This filters out virtual packages (like libasound2 on Ubuntu 24.04+) that would fail direct installation.
  for pkg in $packages; do
    if apt-get install -s "$pkg" >/dev/null 2>&1; then
      install_list="$install_list $pkg"
    fi
  done
  
  # Install only the valid packages that are missing or require updates
  if [ -n "$install_list" ]; then
    echo "Installing dependencies: $install_list"
    $SUDO apt-get install -y $install_list
  else
    echo "All dependencies are already installed!"
  fi
else
  echo "Non-Debian/Ubuntu system. Skipping Puppeteer dependencies installation."
fi
