# Testing Your API

Your server is running and connected to the database! 🎉

## Step 1: Create the Users Table (if not done)

1. Go to Railway dashboard → Your MySQL service
2. Click on "Query" or "Data" tab
3. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Or copy the entire content from `database/schema.sql` and run it.

## Step 2: Test API Endpoints

### Using Browser (for GET requests)

Open these URLs in your browser:

- **API Info:** http://localhost:3000/
- **Health Check:** http://localhost:3000/api/health
- **Get All Users:** http://localhost:3000/api/users

### Using PowerShell (curl equivalent)

**Get all users:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Get
```

**Create a new user:**
```powershell
$body = @{
    name = "John Doe"
    email = "john.doe@example.com"
    age = 30
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Post -Body $body -ContentType "application/json"
```

**Get user by ID:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/users/1 -Method Get
```

**Update user:**
```powershell
$body = @{
    name = "Jane Doe"
    email = "jane.doe@example.com"
    age = 25
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/users/1 -Method Put -Body $body -ContentType "application/json"
```

**Delete user:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/users/1 -Method Delete
```

### Using Postman or Thunder Client

1. **GET** `http://localhost:3000/api/users` - Get all users
2. **POST** `http://localhost:3000/api/users` - Create user
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "age": 30
   }
   ```
3. **GET** `http://localhost:3000/api/users/1` - Get user by ID
4. **PUT** `http://localhost:3000/api/users/1` - Update user
5. **DELETE** `http://localhost:3000/api/users/1` - Delete user

## Quick Test Script

Save this as `test-api.ps1` and run it:

```powershell
Write-Host "Testing API endpoints..." -ForegroundColor Green

# Health check
Write-Host "`n1. Health Check:" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/api/health | ConvertTo-Json

# Get all users
Write-Host "`n2. Get All Users:" -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:3000/api/users | ConvertTo-Json

# Create a user
Write-Host "`n3. Create User:" -ForegroundColor Yellow
$newUser = @{
    name = "Test User"
    email = "test@example.com"
    age = 25
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Post -Body $newUser -ContentType "application/json"
$created | ConvertTo-Json

Write-Host "`n✅ API is working!" -ForegroundColor Green
```

## Expected Responses

**Get All Users (empty initially):**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**Create User:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## Troubleshooting

**"Table 'users' doesn't exist"**
- Run the CREATE TABLE SQL in Railway's query editor

**"Empty response" or "Cannot GET /api/users"**
- Make sure your server is running (`npm start`)
- Check the server is on port 3000

**"Connection timeout"**
- Railway free tier databases might sleep - first request might be slow
- Check Railway dashboard to ensure MySQL service is running

