#!/usr/bin/env bash
set -e

echo "🚀 Deploying DiyorAI on Debian VPS..."

# 1. Pull latest code
if [ -d ".git" ]; then
    echo "📥 Pulling latest git changes..."
    git pull origin main
fi

# 2. Install dependencies
echo "📦 Installing production dependencies..."
npm ci --include=dev

# 3. Build optimized Next.js bundle
echo "🔨 Building Next.js production build..."
npm run build

# 4. Restart or Start PM2
if command -v pm2 &> /dev/null; then
    echo "🔄 Reloading PM2 process..."
    pm2 startOrReload ecosystem.config.js --update-env
    pm2 save
    echo "✅ PM2 process reloaded successfully!"
else
    echo "⚠️ PM2 not found. Run: npm install -g pm2"
fi

echo "🎉 Deployment completed! App is live on port 3000."
