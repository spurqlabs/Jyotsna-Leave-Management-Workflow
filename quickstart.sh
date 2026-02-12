#!/bin/bash

# OrangeHRM Test Automation - Quick Start Script

echo "=================================================="
echo "OrangeHRM Test Automation Framework"
echo "Quick Start Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Playwright browsers are installed
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo "🎭 Installing Playwright browsers..."
    npx playwright install chromium
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  npm test              - Run all tests (headless)"
echo "  npm run test:headed   - Run tests with visible browser"
echo "  npm run test:smoke    - Run smoke tests only"
echo ""
echo "=================================================="
echo "Ready to run tests! Try: npm run test:headed"
echo "=================================================="
