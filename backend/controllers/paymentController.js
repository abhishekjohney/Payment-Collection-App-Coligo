const { db } = require('../config/database');

// POST /payments - Create a new payment
const makePayment = (req, res) => {
  try {
    const { account_number, payment_amount, payment_date, status } = req.body;

    // Validate required fields
    if (!account_number || !payment_amount) {
      return res.status(400).json({ 
        message: 'Account number and payment amount are required' 
      });
    }

    // Verify customer exists
    const customer = db.prepare(
      'SELECT id FROM customers WHERE account_number = ?'
    ).get(account_number);

    if (!customer) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const customerId = customer.id;

    // Format date for SQLite
    const formattedDate = payment_date 
      ? new Date(payment_date).toISOString().slice(0, 19).replace('T', ' ')
      : new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert payment
    const result = db.prepare(
      'INSERT INTO payments (customer_id, account_number, payment_amount, payment_date, status) VALUES (?, ?, ?, ?, ?)'
    ).run(
      customerId,
      account_number,
      payment_amount,
      formattedDate,
      status || 'completed'
    );

    // Fetch the created payment
    const payment = db.prepare(
      'SELECT * FROM payments WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Payment successful',
      payment: payment
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      message: 'Error processing payment',
      error: error.message 
    });
  }
};

// GET /payments/:accountNumber - Get payment history for an account
const getPaymentHistory = (req, res) => {
  try {
    const { accountNumber } = req.params;

    const payments = db.prepare(
      'SELECT * FROM payments WHERE account_number = ? ORDER BY payment_date DESC'
    ).all(accountNumber);

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ 
      message: 'Error fetching payment history',
      error: error.message 
    });
  }
};

module.exports = {
  makePayment,
  getPaymentHistory
};
