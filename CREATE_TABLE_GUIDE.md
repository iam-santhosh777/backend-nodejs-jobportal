# How to Create the Users Table in Railway

## Quick Steps

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Open your project
   - Click on your **MySQL service**

2. **Open Query Editor**
   - Look for **"Query"** tab or **"Data"** tab
   - Or click **"Connect"** → **"Query"**

3. **Run the SQL**
   - Copy the SQL from `database/schema.sql` file
   - Paste it into the query editor
   - Click **"Run"** or **"Execute"**

4. **Verify**
   - You should see the table created
   - Sample data will be inserted (3 users)

## Alternative: Using MySQL Client

If you have MySQL client installed locally, you can run:

```powershell
# Connect to Railway MySQL
mysql -h yamabiko.proxy.rlwy.net -P 34702 -u root -p railway

# Then run:
source database/schema.sql
# Or copy-paste the SQL commands
```

## The SQL You Need to Run

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

## After Creating the Table

1. **Restart your Node.js server** (if it's running):
   ```powershell
   # Press Ctrl+C to stop, then:
   npm start
   ```

2. **Test the API**:
   ```powershell
   Invoke-RestMethod -Uri http://localhost:3000/api/users
   ```

   You should now see:
   ```json
   {
     "success": true,
     "data": [...],
     "count": 3
   }
   ```

## Troubleshooting

**"Access denied"**
- Make sure you're using the correct credentials from Railway

**"Database doesn't exist"**
- Railway should create the database automatically
- Check your database name in Railway variables (should be `railway`)

**"Table already exists"**
- That's fine! The `IF NOT EXISTS` clause prevents errors
- Your table is ready to use

