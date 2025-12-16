const { db } = require('../config/database');

// GET /customers - Retrieve all customers with loan details
const getAllCustomers = (req, res) => {
  try {
    const customers = db.prepare(
      'SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers ORDER BY id'
    ).all();
    
    // Calculate remaining EMI for each customer based on this month's payments
    const customersWithBalance = customers.map(customer => {
      // Get total payments made this month for this customer
      const payment = db.prepare(
        `SELECT COALESCE(SUM(payment_amount), 0) as total_paid 
         FROM payments 
         WHERE customer_id = ? 
         AND strftime('%m', payment_date) = strftime('%m', 'now')
         AND strftime('%Y', payment_date) = strftime('%Y', 'now')
         AND status = 'completed'`
      ).get(customer.id);
      
      const totalPaid = payment.total_paid || 0;
      const remainingEmi = Math.max(0, customer.emi_due - totalPaid);
      
      return {
        ...customer,
        total_paid_this_month: parseFloat(totalPaid),
        remaining_emi: parseFloat(remainingEmi.toFixed(2)),
        emi_status: remainingEmi <= 0 ? 'paid' : 'pending'
      };
    });
    
    res.json(customersWithBalance);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ 
      message: 'Error fetching customer data',
      error: error.message 
    });
  }
};

// GET /customers/:id - Get specific customer
const getCustomerById = (req, res) => {
  try {
    const { id } = req.params;
    const customer = db.prepare(
      'SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers WHERE id = ?'
    ).get(id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ 
      message: 'Error fetching customer data',
      error: error.message 
    });
  }
};

// GET /customers/account/:accountNumber - Get customer by account number
const getCustomerByAccountNumber = (req, res) => {
  try {
    const { accountNumber } = req.params;
    const customer = db.prepare(
      'SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers WHERE account_number = ?'
    ).get(accountNumber);
    
    if (!customer) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    // Get total payments made this month for this customer
    const payment = db.prepare(
      `SELECT COALESCE(SUM(payment_amount), 0) as total_paid 
       FROM payments 
       WHERE customer_id = ? 
       AND strftime('%m', payment_date) = strftime('%m', 'now')
       AND strftime('%Y', payment_date) = strftime('%Y', 'now')
       AND status = 'completed'`
    ).get(customer.id);
    
    const totalPaid = payment.total_paid || 0;
    const remainingEmi = Math.max(0, customer.emi_due - totalPaid);
    
    const customerWithBalance = {
      ...customer,
      total_paid_this_month: parseFloat(totalPaid),
      remaining_emi: parseFloat(remainingEmi.toFixed(2)),
      emi_status: remainingEmi <= 0 ? 'paid' : 'pending'
    };
    
    res.json(customerWithBalance);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ 
      message: 'Error fetching customer data',
      error: error.message 
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByAccountNumber
};
