# Payment Collection App

A full-stack mobile application for managing personal loan payments with React Native frontend and Node.js backend.

## Project Overview

This application allows customers with personal loans to:
- View their loan details (account number, issue date, interest rate, tenure, EMI due)
- Make EMI payments
- View payment history
- Receive payment confirmations

## Technology Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MySQL / PostgreSQL (configurable)
- **API**: RESTful API
- **Dependencies**: cors, dotenv, body-parser, mysql2, pg

### Frontend
- **Framework**: React Native
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **UI**: Native Components with custom styling

## Project Structure

```
Payment-Collection-App-Coligo/
├── backend/
│   ├── config/
│   │   ├── database.js              # Database connection
│   │   ├── schema.sql               # MySQL schema
│   │   └── schema-postgres.sql      # PostgreSQL schema
│   ├── controllers/
│   │   ├── customerController.js    # Customer logic
│   │   └── paymentController.js     # Payment logic
│   ├── routes/
│   │   ├── customerRoutes.js        # Customer endpoints
│   │   └── paymentRoutes.js         # Payment endpoints
│   ├── .env.example
│   ├── server.js                    # Main server file
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── screens/
    │   │   ├── HomeScreen.js
    │   │   ├── LoanDetailsScreen.js
    │   │   ├── PaymentScreen.js
    │   │   ├── PaymentConfirmationScreen.js
    │   │   └── PaymentHistoryScreen.js
    │   └── services/
    │       └── api.js               # API service layer
    ├── App.js
    ├── index.js
    └── package.json
```

## Features

### Backend Features
✅ RESTful API with Express.js  
✅ Support for both MySQL and PostgreSQL  
✅ Customer loan management  
✅ Payment processing with transaction IDs  
✅ Payment history tracking  
✅ Automatic balance updates  
✅ Error handling and validation  
✅ CORS enabled for frontend integration  

### Frontend Features
✅ Responsive mobile UI  
✅ Customer loan list view  
✅ Detailed loan information screen  
✅ Payment form with validation  
✅ Payment confirmation screen  
✅ Payment history with transaction details  
✅ Pull-to-refresh functionality  
✅ Loading states and error handling  

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers with loan details
- `GET /api/customers/:account_number` - Get customer by account number

### Payments
- `POST /api/payments` - Process a payment
  ```json
  {
    "account_number": "ACC001",
    "payment_amount": 3120.50
  }
  ```
- `GET /api/payments/:account_number` - Get payment history for an account
- `GET /api/payments` - Get all payments

### Utility
- `GET /api/health` - Health check endpoint
- `GET /` - API information

## Database Schema

### Customers Table
| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key |
| account_number | VARCHAR(50) | Unique account identifier |
| customer_name | VARCHAR(100) | Customer name |
| issue_date | DATE | Loan issue date |
| interest_rate | DECIMAL(5,2) | Interest rate percentage |
| tenure | INT | Loan tenure in months |
| emi_due | DECIMAL(10,2) | Monthly EMI amount |
| total_loan_amount | DECIMAL(12,2) | Total loan amount |
| remaining_balance | DECIMAL(12,2) | Current remaining balance |

### Payments Table
| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key |
| customer_id | INT | Foreign key to customers |
| account_number | VARCHAR(50) | Account number |
| payment_date | TIMESTAMP | Payment timestamp |
| payment_amount | DECIMAL(10,2) | Payment amount |
| status | ENUM | success/pending/failed |
| transaction_id | VARCHAR(100) | Unique transaction ID |
| notes | TEXT | Payment notes |

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL or PostgreSQL database
- React Native development environment (Android Studio / Xcode)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your database credentials
```

4. Set up the database:
```bash
# For MySQL: Import schema.sql into your database
# For PostgreSQL: Import schema-postgres.sql into your database
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:3000/api';
```

4. Run the app:
```bash
# Start Metro bundler
npm start

# Run on Android (in new terminal)
npm run android

# Run on iOS (in new terminal, macOS only)
npm run ios
```

## Environment Variables

### Backend (.env)
```
PORT=3000
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=payment_collection_db
DB_PORT=3306
```

## Testing the Application

### Backend Testing
1. Start the backend server
2. Use tools like Postman or cURL to test API endpoints
3. Check sample data in the database

### Frontend Testing
1. Ensure backend is running
2. Launch the React Native app
3. Navigate through screens:
   - Home screen shows all customers
   - Tap a customer to view details
   - Use "Pay EMI" to make a payment
   - View payment history

## Sample Data

The application comes with 5 sample customer accounts:
- ACC001 - John Doe
- ACC002 - Jane Smith
- ACC003 - Robert Johnson
- ACC004 - Emily Davis
- ACC005 - Michael Brown

Each has sample payment history for testing.

## Future Enhancements (Not Implemented Yet)

- User authentication and authorization
- Push notifications for payment reminders
- PDF receipt generation
- Advanced payment analytics
- Multiple payment methods
- Auto-debit setup
- Email notifications
- Dark mode support

## Troubleshooting

### Backend Issues
- **Database connection failed**: Check database credentials in .env
- **Port already in use**: Change PORT in .env file
- **Module not found**: Run `npm install` again

### Frontend Issues
- **Cannot connect to backend**: Update API_BASE_URL in api.js
  - For Android emulator: Use `http://10.0.2.2:3000/api`
  - For iOS simulator: Use `http://localhost:3000/api`
  - For physical devices: Use your computer's IP address
- **Build errors**: Clear cache with `npm start -- --reset-cache`

## License

This project is created for educational purposes.

## Author

Payment Collection App - Colligo
