# Quick Setup Guide

Follow these steps to get the Payment Collection App running:

## Step 1: Backend Setup

1. **Open a terminal in the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure database**:
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env` file
   - Default settings use MySQL on localhost

4. **Set up the database**:
   - **For MySQL**:
     ```bash
     mysql -u root -p < config/schema.sql
     ```
   - **For PostgreSQL**:
     ```bash
     psql -U postgres -d payment_collection_db < config/schema-postgres.sql
     ```
   - Or manually run the SQL file in your database tool

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   
   Server should be running on `http://localhost:3000`

## Step 2: Frontend Setup

1. **Open a NEW terminal in the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Update API URL** (if needed):
   - Open `src/services/api.js`
   - For Android emulator: `http://10.0.2.2:3000/api`
   - For iOS simulator: `http://localhost:3000/api`
   - For physical device: `http://YOUR_COMPUTER_IP:3000/api`

4. **Start Metro bundler**:
   ```bash
   npm start
   ```

5. **Run the app** (in a NEW terminal):
   
   **For Android**:
   ```bash
   cd frontend
   npm run android
   ```
   
   **For iOS** (macOS only):
   ```bash
   cd frontend
   npm run ios
   ```

## Step 3: Test the Application

1. Backend should be running on port 3000
2. Mobile app should launch on your device/emulator
3. You should see a list of 5 sample customers
4. Test making a payment and viewing history

## Quick Verification

### Backend Health Check
Open in browser: `http://localhost:3000/api/health`

You should see:
```json
{
  "success": true,
  "message": "Payment Collection API is running"
}
```

### Test API Endpoints
- View customers: `http://localhost:3000/api/customers`
- View payments: `http://localhost:3000/api/payments`

## Common Issues

### Backend won't start?
- Check if database is running
- Verify database credentials in `.env`
- Make sure port 3000 is not in use

### Frontend can't connect?
- Ensure backend is running
- Check API_BASE_URL in `src/services/api.js`
- For Android emulator, use `10.0.2.2` instead of `localhost`

### React Native build errors?
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
npm install
npm start -- --reset-cache
```

## Next Steps

Once everything is running:
1. Browse the customer list
2. Select a customer to view loan details
3. Make a test payment
4. View payment history
5. Check the confirmation screen

## Database Credentials

Default configuration (update in `.env`):
- **MySQL**:
  - Host: localhost
  - Port: 3306
  - User: root
  - Password: (empty or your password)
  - Database: payment_collection_db

- **PostgreSQL**:
  - Host: localhost
  - Port: 5432
  - User: postgres
  - Password: your_password
  - Database: payment_collection_db

## Sample Accounts

The database includes 5 sample customer accounts:
- ACC001 - John Doe (EMI: ₹3,120.50)
- ACC002 - Jane Smith (EMI: ₹4,580.75)
- ACC003 - Robert Johnson (EMI: ₹2,450.25)
- ACC004 - Emily Davis (EMI: ₹3,675.80)
- ACC005 - Michael Brown (EMI: ₹5,820.90)

Use these to test payments and view history!

---

**Need Help?** Check the main README.md for detailed documentation.
