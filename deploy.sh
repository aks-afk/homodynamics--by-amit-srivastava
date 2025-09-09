#!/bin/bash

# Homodynamics Website Deployment Script for Cloudflare Pages

set -e

echo "🚀 Starting Homodynamics website deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm run test

# Build the project
echo "🔨 Building project for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📊 Build statistics:"
ls -lah dist/
echo ""
echo "📁 Assets breakdown:"
ls -lah dist/assets/ 2>/dev/null || echo "No assets directory found"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Connect your repository to Cloudflare Pages"
echo "2. Set build command: npm run build"
echo "3. Set build output directory: dist"
echo "4. Add environment variables from .env.production"
echo "5. Deploy!"
echo ""
echo "📖 For detailed instructions, see: https://developers.cloudflare.com/pages/"