import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock customer data
const MOCK_CUSTOMERS = {
  'ACC001': { account_number: 'ACC001', emi_due: 5000 },
  'ACC002': { account_number: 'ACC002', emi_due: 7500 },
  'ACC003': { account_number: 'ACC003', emi_due: 3500 },
  'ACC004': { account_number: 'ACC004', emi_due: 10000 },
  'ACC005': { account_number: 'ACC005', emi_due: 6000 },
};

export default function PaymentScreen({ route, navigation }) {
  const prefilledAccountNumber = route.params?.accountNumber || '';
  const suggestedAmount = route.params?.emiDue || '';

  const [accountNumber, setAccountNumber] = useState(prefilledAccountNumber);
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const validateAccountNumber = async () => {
    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter an account number');
      return false;
    }

    try {
      setVerifying(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const customer = MOCK_CUSTOMERS[accountNumber.toUpperCase()];
      if (!customer) {
        throw new Error('Customer not found');
      }
      setCustomerInfo(customer);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Invalid account number. Please check and try again.');
      return false;
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter your account number');
      return;
    }

    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }

    setLoading(true);

    try {
      // Validate account number first
      const isValid = await validateAccountNumber();
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Payment successful
      const paymentData = {
        account_number: accountNumber,
        payment_amount: parseFloat(amount),
        payment_date: new Date().toISOString(),
        status: 'completed',
      };

      setLoading(false);

      // Navigate to confirmation screen
      navigation.navigate('Confirmation', {
        paymentData: paymentData,
        customerInfo,
      });

      // Reset form
      setAccountNumber('');
      setAmount('');
      setCustomerInfo(null);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message ||
          'Unable to process payment. Please try again.'
      );
    }
  };

  const formatCurrency = (value) => {
    return `₹${parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="card-outline" size={40} color="#FFFFFF" />
          <Text style={styles.title}>Make Payment</Text>
          <Text style={styles.subtitle}>
            Process your EMI payment securely
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Account Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="person-outline" size={16} color="#636E72" /> Account Number
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter account number (e.g., ACC001)"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="default"
                autoCapitalize="characters"
                editable={!loading}
                placeholderTextColor="#B2BEC3"
              />
              {accountNumber.length > 0 && (
                <TouchableOpacity
                  onPress={validateAccountNumber}
                  style={styles.verifyButton}
                  disabled={verifying}
                >
                  {verifying ? (
                    <ActivityIndicator size="small" color="#6C5CE7" />
                  ) : (
                    <Ionicons name="checkmark-circle" size={24} color="#6C5CE7" />
                  )}
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.helper}>
              Enter the account number associated with your loan
            </Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="cash-outline" size={16} color="#636E72" /> Payment Amount
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!loading}
                placeholderTextColor="#B2BEC3"
              />
            </View>
            {suggestedAmount && (
              <Text style={styles.helper}>
                Suggested EMI: {formatCurrency(suggestedAmount)}
              </Text>
            )}
          </View>

          {/* Customer Info Card */}
          {customerInfo && (
            <View style={styles.customerInfoCard}>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#00B894" />
                <Text style={styles.verifiedText}>Account Verified</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Number:</Text>
                <Text style={styles.infoValue}>{customerInfo.account_number}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>EMI Due:</Text>
                <Text style={styles.infoValue}>{formatCurrency(customerInfo.emi_due)}</Text>
              </View>
              {customerInfo.total_paid_this_month > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Paid This Month:</Text>
                  <Text style={styles.paidAmount}>
                    {formatCurrency(customerInfo.total_paid_this_month)}
                  </Text>
                </View>
              )}
              {customerInfo.remaining_emi > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Remaining:</Text>
                  <Text style={styles.remainingAmount}>
                    {formatCurrency(customerInfo.remaining_emi)}
                  </Text>
                </View>
              )}
              {customerInfo.emi_status === 'paid' && (
                <View style={styles.fullyPaidBadge}>
                  <Ionicons name="checkmark-done" size={16} color="#00B894" />
                  <Text style={styles.fullyPaidText}>EMI Fully Paid This Month</Text>
                </View>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="card" size={24} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Process Payment</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={20} color="#00B894" />
            <Text style={styles.securityText}>
              Your payment is secure and encrypted
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#6C5CE7',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#2D3436',
  },
  verifyButton: {
    padding: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6C5CE7',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: 56,
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
  },
  helper: {
    fontSize: 13,
    color: '#636E72',
    marginTop: 8,
  },
  customerInfoCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00B894',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  paidAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00B894',
  },
  remainingAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  fullyPaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  fullyPaidText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00B894',
    marginLeft: 6,
  },
  submitButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#B2BEC3',
    shadowOpacity: 0.1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  securityText: {
    fontSize: 13,
    color: '#636E72',
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#6C5CE7',
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    padding: 16,
    fontSize: 17,
    color: '#000000',
  },
  helper: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 6,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    fontSize: 17,
    color: '#000000',
  },
  customerInfoCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  customerInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  customerInfoText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
  customerInfoPaid: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 4,
    fontWeight: '600',
  },
  customerInfoRemaining: {
    fontSize: 15,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginTop: 4,
  },
  fullyPaid: {
    color: '#2E7D32',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
