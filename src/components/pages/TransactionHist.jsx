
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './TransactionHist.css';
import { BsWalletFill } from 'react-icons/bs';

function TransactionHist() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'https://kellcom-mpesa.onrender.com';

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/transactions`);

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();

      console.log('API RESPONSE:', data);

      setTransactions(  Array.isArray(data) ? data : data.transactions || [] );

      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <Sidebar />

      <div className="transaction-page">

        {/* Page heading */}
        <div className="transaction-header">
          <div>
            <h2>Transactions </h2>
            <p>View all your M-Pesa transactions.</p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchTransactions}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Transactions'}
          </button>
        </div>

        {/* Total Transactions Card */}
        <div className="total-transactions-card">
          <div className="total-icon">
            <i className="fas fa-exchange-alt"><BsWalletFill/></i>
          </div>

          <div className="total-details">
            <p>Total Transactions</p>
            <h2>{transactions.length.toLocaleString()}</h2>
          </div>
        </div>

        {/* Loading message */}
        {loading && <p>Loading transactions...</p>}

        {/* Error message */}
        {error && <p className="error">{error}</p>}

        {/* Transaction Table */}
        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Phone Number</th>
                  <th>Amount (KSh)</th>
                  <th>Date & Time</th>
                  <th>M-Pesa Receipt</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{transaction.number}</td>

                      <td>
                        KSh {Number(transaction.amount).toLocaleString()}
                      </td>

                      <td>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>

                      <td>{transaction.tranx_id}</td>
 
                      <td>
                        <span className="success-status">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-message">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  );
}

export default TransactionHist;
