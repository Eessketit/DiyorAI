#!/usr/bin/env bash
set -e

# Add user's node bin to PATH if present
export PATH="/home/eessketit/.local/node/bin:$PATH"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "Building production bundle..."
npm run build

echo "Starting DiyorAI (Production mode on port 3000)..."
npm run start
