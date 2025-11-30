# MediSoluce Netlify Deployment Script
# This script builds and deploys MediSoluce to Netlify

Write-Host "=== MediSoluce Netlify Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if Netlify CLI is installed
$netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue

if (-not $netlifyInstalled) {
    Write-Host "Netlify CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g netlify-cli
    Write-Host "✓ Netlify CLI installed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✓ Netlify CLI found" -ForegroundColor Green
    Write-Host ""
}

# Check if logged in
Write-Host "Checking Netlify authentication..." -ForegroundColor Yellow
$authStatus = netlify status 2>&1

if ($authStatus -match "Logged in") {
    Write-Host "✓ Already logged in to Netlify" -ForegroundColor Green
} else {
    Write-Host "⚠ Not logged in. Please authenticate:" -ForegroundColor Yellow
    Write-Host "  Run: netlify login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This will open your browser to authenticate." -ForegroundColor White
    $login = Read-Host "Do you want to login now? (y/n)"
    if ($login -eq "y" -or $login -eq "Y") {
        netlify login
    } else {
        Write-Host "Please run 'netlify login' first, then run this script again." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "=== Building MediSoluce ===" -ForegroundColor Cyan
Write-Host ""

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Build for production
Write-Host "Building for production..." -ForegroundColor Yellow
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green
Write-Host ""

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "✗ Build output (dist/) not found!" -ForegroundColor Red
    exit 1
}

Write-Host "=== Deploying to Netlify ===" -ForegroundColor Cyan
Write-Host ""

# Check if site is linked
$siteInfo = netlify status 2>&1
if ($siteInfo -match "Site ID") {
    Write-Host "✓ Site already linked" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deploying to production..." -ForegroundColor Yellow
    netlify deploy --prod --dir=dist
} else {
    Write-Host "⚠ Site not linked. Initializing..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You'll need to:" -ForegroundColor White
    Write-Host "1. Link to existing site OR create new site" -ForegroundColor White
    Write-Host "2. Set environment variables in Netlify dashboard" -ForegroundColor White
    Write-Host ""
    $link = Read-Host "Do you want to link/create site now? (y/n)"
    if ($link -eq "y" -or $link -eq "Y") {
        netlify init
        Write-Host ""
        Write-Host "Deploying to production..." -ForegroundColor Yellow
        netlify deploy --prod --dir=dist
    } else {
        Write-Host ""
        Write-Host "To deploy manually:" -ForegroundColor Yellow
        Write-Host "1. Run: netlify init" -ForegroundColor White
        Write-Host "2. Set environment variables in Netlify dashboard" -ForegroundColor White
        Write-Host "3. Run: netlify deploy --prod --dir=dist" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Important: Make sure environment variables are set in Netlify dashboard:" -ForegroundColor Yellow
Write-Host "  - VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "  - VITE_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "  - VITE_GA_TRACKING_ID (optional)" -ForegroundColor White
Write-Host "  - VITE_SENTRY_DSN (optional)" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan

