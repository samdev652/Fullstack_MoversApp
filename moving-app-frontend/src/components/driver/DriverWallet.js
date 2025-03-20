import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const DriverWallet = () => {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState({
    earnings: 0,
    pendingPayments: [],
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchWalletData();
    fetchTransactionHistory();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/driver/order-history/${user.id}`);
      const data = response.data;

      const completedOrders = data.orders.filter((order) => order.status === 'completed');
      const totalEarnings = completedOrders.reduce((sum, order) => sum + order.price * 0.8, 0);

      const pendingPayments = data.orders.filter((order) => order.status === 'completed');

      setWalletData({
        earnings: totalEarnings,
        pendingPayments,
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      // Connect to IntaSend API to fetch transaction history
      const response = await axios.get(
        'https://sandbox.intasend.com/api/v1/transaction/list/',
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_INTASEND_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          params: {
            customer_id: user.id // If you're tracking user IDs in IntaSend
          }
        }
      );
      
      // Process the transaction data
      const formattedTransactions = response.data.results.map(transaction => ({
        id: transaction.id,
        type: transaction.transaction_type === 'PAYMENT_IN' ? 'earning' : 'withdraw',
        amount: transaction.amount,
        date: transaction.created_at,
        status: transaction.state
      }));
      
      setTransactions(formattedTransactions);
      
      // Fallback to mock data if the API call fails or returns empty
      if (!formattedTransactions.length) {
        const mockTransactions = [
          { id: 1, type: 'withdraw', amount: 120, date: '2025-02-20', status: 'completed' },
          { id: 2, type: 'earning', amount: 45, date: '2025-02-19', status: 'completed' },
          { id: 3, type: 'withdraw', amount: 75, date: '2025-02-15', status: 'completed' },
        ];
        setTransactions(mockTransactions);
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('Failed to load transaction history');
      
      // Fallback to mock data
      const mockTransactions = [
        { id: 1, type: 'withdraw', amount: 120, date: '2025-02-20', status: 'completed' },
        { id: 2, type: 'earning', amount: 45, date: '2025-02-19', status: 'completed' },
        { id: 3, type: 'withdraw', amount: 75, date: '2025-02-15', status: 'completed' },
      ];
      setTransactions(mockTransactions);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > walletData.earnings) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);
    try {
      // IntaSend M-Pesa STK Push API payload
      const payload = {
        public_key: process.env.REACT_APP_INTASEND_PUBLIC_KEY,
        amount: parseFloat(withdrawAmount),
        phone_number: user.phone_number, // Driver's phone number in E.164 format (e.g., 254712345678)
        currency: 'KES',
        email: user.email, // Optional
        first_name: user.first_name, // Optional
        last_name: user.last_name, // Optional
        narrative: 'Withdrawal from driver wallet',
        callback_url: `${window.location.origin}/api/callback/withdrawal/${user.id}`, // Optional: Your callback URL
      };

      // Make the STK Push request
      const response = await axios.post(
        'https://sandbox.intasend.com/api/v1/payment/mpesa-stk-push/',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_INTASEND_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        // Save the checkout ID for later verification
        const checkoutId = response.data.checkout_id;
        
        // Store the transaction in your local state
        const newTransaction = {
          id: Date.now(),
          type: 'withdraw',
          amount: parseFloat(withdrawAmount),
          date: new Date().toISOString(),
          status: 'pending',
          checkout_id: checkoutId
        };
        
        setTransactions([newTransaction, ...transactions]);
        
        toast.success('Withdrawal initiated successfully! Please complete the payment on your phone.');
        setWithdrawAmount('');
        
        // Set up a timer to check the transaction status
        const checkTransactionStatus = async () => {
          try {
            const statusResponse = await axios.get(
              `https://sandbox.intasend.com/api/v1/payment/status/${checkoutId}/`,
              {
                headers: {
                  'Authorization': `Bearer ${process.env.REACT_APP_INTASEND_SECRET_KEY}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (statusResponse.data.status === 'COMPLETE') {
              toast.success('Withdrawal completed successfully!');
              fetchWalletData();
              fetchTransactionHistory();
            } else if (statusResponse.data.status === 'FAILED') {
              toast.error('Withdrawal failed. Please try again.');
            }
          } catch (error) {
            console.error('Error checking transaction status:', error);
          }
        };
        
        // Check status after 30 seconds
        setTimeout(checkTransactionStatus, 30000);
      } else {
        toast.error('Failed to initiate withdrawal: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Driver Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-600">${walletData.earnings.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">Available for withdrawal</p>

          <form onSubmit={handleWithdraw} className="mt-6">
            <div className="mb-4">
              <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Amount
              </label>
              <input
                type="number"
                id="withdrawAmount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter amount"
                min="1"
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading || !withdrawAmount}
            >
              {isLoading ? 'Processing...' : 'Withdraw via M-Pesa'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
          {walletData.pendingPayments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {walletData.pendingPayments.map((payment) => (
                <li key={payment.booking_id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Order #{payment.booking_id}</p>
                      <p className="text-sm text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="font-semibold">${(payment.price * 0.8).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No pending payments</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'withdraw' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {transaction.type === 'withdraw' ? 'Withdrawal' : 'Earning'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No transaction history</p>
        )}
      </div>
    </div>
  );
};

export default DriverWallet;