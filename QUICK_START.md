# Payment Collection App - Quick Start Guide

## ✅ Application is Now Running!

### Backend (SQLite Database)
- **Status**: ✅ Running on `http://192.168.227.70:3000`
- **Database**: SQLite (file-based, no MySQL required!)
- **Database File**: `backend/database/payment_collection.db`

### Frontend (React Native/Expo)
- **Status**: ✅ Expo development server running
- **Access Methods**:
  - **Web Browser**: Press `w` in the terminal
  - **Mobile (Android)**: Press `a` for Android emulator
  - **Mobile (iOS)**: Press `i` for iOS simulator
  - **Physical Device**: Scan the QR code with Expo Go app

## 📱 How to Access the App

### Option 1: Web Browser (Easiest)
1. In the frontend terminal, press **`w`**
2. The app will open in your web browser

### Option 2: Physical Device
1. Install **Expo Go** app from Play Store (Android) or App Store (iOS)
2. Scan the QR code shown in the terminal
3. The app will load on your device

### Option 3: Emulator
- **Android**: Press `a` in the frontend terminal
- **iOS**: Press `i` in the frontend terminal (Mac only)

## 🔄 If You Need to Restart

### Stop All Servers
```powershell
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force
```

### Start Backend
```powershell
cd "d:\Abhishek Johney\Colligo\Payment-Collection-App-Coligo\backend"
npm start
```

### Start Frontend
```powershell
cd "d:\Abhishek Johney\Colligo\Payment-Collection-App-Coligo\frontend"
npm start
```

## 📊 Sample Data Available

The database has been pre-populated with 5 sample customers:
- **ACC001** - ₹4,500 EMI
- **ACC002** - ₹3,200 EMI
- **ACC003** - ₹8,500 EMI
- **ACC004** - ₹2,800 EMI
- **ACC005** - ₹5,200 EMI

## 🎯 App Features

1. **Home Screen**: View all loan accounts with EMI status
2. **Loan Details**: See detailed loan information and payment history
3. **Make Payment**: Process EMI payments
4. **Payment Confirmation**: View payment receipt

## 🗄️ Database Location

Your SQLite database file is stored at:
```
backend/database/payment_collection.db
```

This is a single file that contains all your data. No MySQL installation needed!

## 🔧 Reset Database

If you want to reset the database with fresh sample data:
```powershell
cd backend
npm run setup
```

## 📡 API Endpoints

- `GET /customers` - List all customers
- `GET /customers/:id` - Get customer by ID
- `GET /customers/account/:accountNumber` - Get customer by account number
- `POST /payments` - Make a payment
- `GET /payments/:accountNumber` - Get payment history

## ⚡ Quick Tips

1. The database is file-based, so no MySQL setup required
2. Pull down on screens to refresh data
3. The app automatically refreshes when you navigate back to a screen
4. All data persists in the SQLite database file

## 🎉 You're All Set!

Both servers are running. Open the app and start exploring!
