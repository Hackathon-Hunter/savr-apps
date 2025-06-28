#!/bin/bash

# SAVR Environment Setup Script

echo "🔧 Setting up SAVR environment variables..."

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Do you want to overwrite it? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo ""
echo "📝 Please provide the following information:"
echo ""

# Get OpenAI API Key
echo "🔑 OpenAI API Key (get from https://platform.openai.com/api-keys):"
read -r openai_key

# Get OpenRouter API Key (optional)
echo "🔑 OpenRouter API Key (optional, get from https://openrouter.ai/keys):"
read -r openrouter_key

# Get ICP Configuration
echo "🌐 ICP Host (default: https://ic0.app):"
read -r ic_host
ic_host=${ic_host:-"https://ic0.app"}

echo "🏗️  Backend Canister ID:"
read -r backend_canister_id

# Create .env.local file
cat > .env.local << EOF
# OpenAI API Configuration (Primary)
OPENAI_API_KEY=${openai_key}

# OpenRouter API Configuration (Alternative/Backup)
OPENROUTER_API_KEY=${openrouter_key}

# ICP Configuration
NEXT_PUBLIC_IC_HOST=${ic_host}
NEXT_PUBLIC_BACKEND_CANISTER_ID=${backend_canister_id}
EOF

echo ""
echo "✅ Environment variables have been set up!"
echo "📁 Created .env.local file with your configuration"
echo ""
echo "🚀 You can now run: npm run dev"
echo ""
echo "💡 Remember to:"
echo "   - Keep your .env.local file secure and never commit it to version control"
echo "   - Set up the same environment variables in your production deployment" 