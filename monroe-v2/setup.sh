#!/bin/bash

# Monroe v2 - Quick Start Setup Script
# This script sets up Monroe v2 for development on macOS/Linux

set -e

echo "🚀 Monroe v2 - Production-Ready Trading Dashboard"
echo "=================================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ Python $(python3 --version)"
echo "✅ Node $(node --version)"
echo "✅ npm $(npm --version)"
echo ""

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "  Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "  Installing Python packages..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1

# Setup .env
if [ ! -f ".env" ]; then
    echo "  Creating .env file..."
    cp .env.example .env
    echo "  ⚠️  Update backend/.env with your database URL if needed"
fi

cd ..

echo "✅ Backend setup complete"
echo ""

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "  Installing npm packages..."
    npm install > /dev/null 2>&1
fi

cd ..

echo "✅ Frontend setup complete"
echo ""

# Summary
echo "=================================================="
echo "✨ Monroe v2 Setup Complete!"
echo "=================================================="
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python -m uvicorn app.main:app --reload"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open Dashboard:"
echo "   http://localhost:5173"
echo ""
echo "4. API Documentation:"
echo "   http://localhost:8000/docs"
echo ""
echo "📖 Documentation:"
echo "   - README.md - Project overview and features"
echo "   - DEVELOPMENT.md - Development guide"
echo "   - DEPLOYMENT.md - Production deployment"
echo ""
echo "🆘 Troubleshooting:"
echo "   - Backend errors: Check backend/.env configuration"
echo "   - WebSocket issues: Ensure backend is running on port 8000"
echo "   - Database errors: Verify DATABASE_URL in .env"
echo ""
echo "Happy trading! 📈"
