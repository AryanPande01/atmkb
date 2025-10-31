#!/bin/bash

# Production Deployment Script
# Usage: bash scripts/deploy.sh [platform]

set -e  # Exit on error

PLATFORM=${1:-help}

echo "🚀 E-Summit 2026 App - Production Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found!${NC}"
    echo "Please copy .env.example to .env.local and configure your Firebase credentials."
    exit 1
fi

# Build for production
echo -e "${GREEN}📦 Building for production...${NC}"
npm run build:production

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed! dist directory not created.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Platform-specific deployment
case $PLATFORM in
    vercel)
        echo -e "${YELLOW}Deploying to Vercel...${NC}"
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo -e "${RED}❌ Vercel CLI not installed.${NC}"
            echo "Install it with: npm install -g vercel"
            exit 1
        fi
        ;;
    
    netlify)
        echo -e "${YELLOW}Deploying to Netlify...${NC}"
        if command -v netlify &> /dev/null; then
            netlify deploy --prod
        else
            echo -e "${RED}❌ Netlify CLI not installed.${NC}"
            echo "Install it with: npm install -g netlify-cli"
            exit 1
        fi
        ;;
    
    firebase)
        echo -e "${YELLOW}Deploying to Firebase Hosting...${NC}"
        if command -v firebase &> /dev/null; then
            firebase deploy --only hosting
        else
            echo -e "${RED}❌ Firebase CLI not installed.${NC}"
            echo "Install it with: npm install -g firebase-tools"
            exit 1
        fi
        ;;
    
    docker)
        echo -e "${YELLOW}Building Docker image...${NC}"
        if command -v docker &> /dev/null; then
            docker build -t esummit-app .
            echo -e "${GREEN}✅ Docker image built successfully!${NC}"
            echo "Run with: docker run -p 80:80 esummit-app"
        else
            echo -e "${RED}❌ Docker not installed.${NC}"
            exit 1
        fi
        ;;
    
    preview)
        echo -e "${YELLOW}Starting preview server...${NC}"
        npm run preview
        ;;
    
    help|*)
        echo ""
        echo "Usage: bash scripts/deploy.sh [platform]"
        echo ""
        echo "Available platforms:"
        echo "  vercel    - Deploy to Vercel"
        echo "  netlify   - Deploy to Netlify"
        echo "  firebase  - Deploy to Firebase Hosting"
        echo "  docker    - Build Docker image"
        echo "  preview   - Start preview server"
        echo "  help      - Show this help message"
        echo ""
        echo "Examples:"
        echo "  bash scripts/deploy.sh vercel"
        echo "  bash scripts/deploy.sh firebase"
        echo "  bash scripts/deploy.sh preview"
        exit 0
        ;;
esac

echo -e "${GREEN}✅ Deployment complete!${NC}"

