#!/bin/bash
# Installation and Setup Script for HabitGuard
# Run this script to automatically set up the project

echo "================================"
echo "HabitGuard Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Check if MongoDB is running (optional warning)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB doesn't appear to be installed."
    echo "   Please ensure MongoDB is running on localhost:27017"
    echo "   Or update MONGODB_URI in .env for remote connection"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habitguard
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "================================"
echo "Setup Complete! 🎉"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Ensure MongoDB is running"
echo "2. Start the server: npm start"
echo "3. Test API: GET http://localhost:5000/api/health"
echo "4. See API_EXAMPLES.md for test cases"
echo ""
echo "Documentation:"
echo "- README.md - Full API documentation"
echo "- QUICK_START.md - Detailed setup guide"
echo "- ARCHITECTURE.md - Architecture and design"
echo "- API_EXAMPLES.md - Test cases and examples"
echo ""
