# Helper script to update .env file with Railway MySQL credentials
# Based on your connection string, update your .env file with these values:

Write-Host "Updating .env file with Railway MySQL credentials..." -ForegroundColor Green

$envContent = @"
# Railway MySQL Configuration
# Option 1: Use full connection URL (recommended)
MYSQL_URL=mysql://root:ByxBEwbzDBtELKmcceAIqpCSBLzEhWeU@yamabiko.proxy.rlwy.net:34702/railway

# Option 2: Or use separate variables (uncomment if not using MYSQL_URL)
# DB_HOST=yamabiko.proxy.rlwy.net
# DB_PORT=34702
# DB_USER=root
# DB_PASSWORD=ByxBEwbzDBtELKmcceAIqpCSBLzEhWeU
# DB_NAME=railway

# Server Configuration (IMPORTANT: This is for your Node.js server!)
PORT=3000
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -Force

Write-Host "✅ .env file updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Your .env file now has:" -ForegroundColor Yellow
Write-Host "  - MYSQL_URL with full connection string" -ForegroundColor Cyan
Write-Host "  - PORT=3000 (for your Node.js server)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now restart your server with: npm start" -ForegroundColor Green

