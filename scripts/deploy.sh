#!/bin/bash

# SAVR ICP Deployment Script

echo "🚀 Starting SAVR deployment to ICP..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ dfx.json not found. Please run this script from the project root."
    exit 1
fi

# Build the Next.js application
echo "📦 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "❌ out directory not found. Build may have failed."
    exit 1
fi

# Deploy to ICP
echo "🌐 Deploying to ICP..."
dfx deploy --network ic --no-wallet

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "🎉 Your SAVR application is now live on ICP!"
echo "🔗 Check your dfx output for the canister URL" 