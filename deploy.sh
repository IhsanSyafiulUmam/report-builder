#!/bin/bash

# Report Builder Production Deployment Script
echo "🚀 Starting Report Builder Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install production dependencies
print_status "Installing production dependencies..."
npm install --production=false
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Install production server dependencies
print_status "Installing production server dependencies..."
npm install express compression helmet --save
if [ $? -eq 0 ]; then
    print_success "Production server dependencies installed"
else
    print_error "Failed to install production server dependencies"
    exit 1
fi

# Build the application
print_status "Building application for production..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Failed to build application"
    exit 1
fi

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'report-builder',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
EOF

# Create logs directory
mkdir -p logs

print_success "PM2 configuration created"

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 is not installed globally. Installing PM2..."
    npm install -g pm2
    if [ $? -eq 0 ]; then
        print_success "PM2 installed successfully"
    else
        print_error "Failed to install PM2"
        exit 1
    fi
fi

print_success "Deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Start the application: pm2 start ecosystem.config.js --env production"
echo "2. Save PM2 configuration: pm2 save"
echo "3. Setup PM2 startup: pm2 startup"
echo "4. Check application status: pm2 status"
echo "5. View logs: pm2 logs report-builder"
echo ""
echo "🌐 Application will be available at: http://your-server-ip:3000"
echo ""
echo "🔧 Useful PM2 Commands:"
echo "   pm2 restart report-builder    # Restart application"
echo "   pm2 stop report-builder       # Stop application"
echo "   pm2 delete report-builder     # Delete application"
echo "   pm2 reload report-builder     # Reload without downtime"
echo "   pm2 monit                     # Monitor applications"
