import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data - built-in database
const MOCK_CUSTOMERS = [
  {
    id: 1,
    account_number: 'ACC001',
    emi_due: 5000,
    interest_rate: 12.5,
    tenure: 24,
    remaining_emi: 50000,
    emi_status: 'pending',
    issue_date: '2024-01-15',
  },
  {
    id: 2,
    account_number: 'ACC002',
    emi_due: 7500,
    interest_rate: 10.8,
    tenure: 36,
    remaining_emi: 120000,
    emi_status: 'paid',
    issue_date: '2024-02-20',
  },
  {
    id: 3,
    account_number: 'ACC003',
    emi_due: 3500,
    interest_rate: 11.2,
    tenure: 18,
    remaining_emi: 35000,
    emi_status: 'pending',
    issue_date: '2024-03-10',
  },
  {
    id: 4,
    account_number: 'ACC004',
    emi_due: 10000,
    interest_rate: 9.5,
    tenure: 48,
    remaining_emi: 200000,
    emi_status: 'paid',
    issue_date: '2024-01-05',
  },
  {
    id: 5,
    account_number: 'ACC005',
    emi_due: 6000,
    interest_rate: 13.0,
    tenure: 30,
    remaining_emi: 75000,
    emi_status: 'pending',
    issue_date: '2024-04-12',
  },
];

export default function HomeScreen({ navigation }) {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setCustomers(MOCK_CUSTOMERS);
      setRefreshing(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `â‚¹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const totalPending = customers.reduce((sum, c) => sum + (c.remaining_emi || 0), 0);
  const paidCount = customers.filter(c => c.emi_status === 'paid').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome Back!</Text>
          <Text style={styles.title}>Loan Management</Text>
        </View>
        
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="wallet-outline" size={24} color="#6C5CE7" />
            <Text style={styles.summaryValue}>{customers.length}</Text>
            <Text style={styles.summaryLabel}>Total Loans</Text>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#00B894" />
            <Text style={styles.summaryValue}>{paidCount}</Text>
            <Text style={styles.summaryLabel}>Paid This Month</Text>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="cash-outline" size={24} color="#FDCB6E" />
            <Text style={styles.summaryValue}>{formatCurrency(totalPending)}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Loans List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#6C5CE7"
            colors={['#6C5CE7']}
          />
        }
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>
          <Text style={styles.sectionSubtitle}>{customers.length} active loans</Text>
        </View>

        {customers.map((customer) => (
          <TouchableOpacity
            key={customer.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('LoanDetails', { customer })
            }
            activeOpacity={0.7}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconContainer}>
                <Ionicons name="card-outline" size={24} color="#6C5CE7" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.accountNumber}>{customer.account_number}</Text>
                <Text style={styles.issueDate}>Issued: {formatDate(customer.issue_date)}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                customer.emi_status === 'paid' ? styles.paidBadge : styles.pendingBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  customer.emi_status === 'paid' ? styles.paidText : styles.pendingText
                ]}>
                  {customer.emi_status === 'paid' ? 'Paid' : 'Pending'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBottom}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>EMI Amount</Text>
                  <Text style={styles.detailValue}>{formatCurrency(customer.emi_due)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Interest Rate</Text>
                  <Text style={styles.detailValue}>{customer.interest_rate}% p.a.</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Tenure</Text>
                  <Text style={styles.detailValue}>{customer.tenure} months</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Remaining</Text>
                  <Text style={[styles.detailValue, styles.remainingAmount]}>
                    {formatCurrency(customer.remaining_emi || 0)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.viewDetailsBtn}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons name="chevron-forward" size={18} color="#6C5CE7" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    backgroundColor: '#6C5CE7',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#636E72',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  issueDate: {
    fontSize: 13,
    color: '#636E72',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paidBadge: {
    backgroundColor: '#D5F4E6',
  },
  pendingBadge: {
    backgroundColor: '#FFE5D9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paidText: {
    color: '#00B894',
  },
  pendingText: {
    color: '#FF6B6B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 15,
  },
  cardBottom: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  remainingAmount: {
    color: '#6C5CE7',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewDetailsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6C5CE7',
    marginRight: 4,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#636E72',
  },
  errorText: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
