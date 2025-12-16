const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function setupDatabase() {
  try {
    console.log('🔧 Setting up Payment Collection Database...\n');

    const dbPath = path.join(__dirname, 'database', 'payment_collection.db');
    
    // Remove existing database if exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('🗑️  Removed existing database');
    }

    // Create new database
    const db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    console.log('✅ Connected to SQLite');

    // Create customers table
    db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_number TEXT UNIQUE NOT NULL,
        issue_date DATE NOT NULL,
        interest_rate REAL NOT NULL,
        tenure INTEGER NOT NULL,
        emi_due REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_account_number ON customers(account_number);
    `);

    console.log('✅ Customers table created');

    // Create payments table
    db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        account_number TEXT NOT NULL,
        payment_amount REAL NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_payment_account ON payments(account_number);
      CREATE INDEX IF NOT EXISTS idx_payment_date ON payments(payment_date);
    `);

    console.log('✅ Payments table created');

    // Insert sample customers
    const insertCustomer = db.prepare(`
      INSERT INTO customers (account_number, issue_date, interest_rate, tenure, emi_due)
      VALUES (?, ?, ?, ?, ?)
    `);

    const customers = [
      ['ACC001', '2024-01-15', 8.50, 24, 4500.00],
      ['ACC002', '2024-02-20', 9.00, 36, 3200.00],
      ['ACC003', '2024-03-10', 7.75, 12, 8500.00],
      ['ACC004', '2024-04-05', 8.25, 48, 2800.00],
      ['ACC005', '2024-05-18', 9.50, 24, 5200.00]
    ];

    const insertMany = db.transaction((customers) => {
      for (const customer of customers) {
        insertCustomer.run(customer);
      }
    });

    insertMany(customers);
    console.log('✅ Sample customers inserted');

    // Insert sample payments
    const insertPayment = db.prepare(`
      INSERT INTO payments (customer_id, account_number, payment_amount, payment_date, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const payments = [
      [1, 'ACC001', 4500.00, '2024-06-01 10:30:00', 'completed'],
      [1, 'ACC001', 4500.00, '2024-07-01 11:15:00', 'completed'],
      [2, 'ACC002', 3200.00, '2024-06-15 14:20:00', 'completed'],
      [3, 'ACC003', 8500.00, '2024-06-10 09:45:00', 'completed']
    ];

    const insertManyPayments = db.transaction((payments) => {
      for (const payment of payments) {
        insertPayment.run(payment);
      }
    });

    insertManyPayments(payments);
    console.log('✅ Sample payments inserted');

    db.close();

    console.log('\n═══════════════════════════════════════════');
    console.log('  Database Setup Complete! 🎉');
    console.log('═══════════════════════════════════════════\n');
    console.log('Database file created at:');
    console.log(`  ${dbPath}`);
    console.log('\nYou can now start the server with:');
    console.log('  npm start');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

setupDatabase();
