
import React, { useEffect, useState } from "react";
import "./RecentTransactions.css";

function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "https://kellcom-mpesa.onrender.com";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/transactions`);

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();

        const allTransactions = Array.isArray(data)
          ? data
          : data.transactions || [];

        const sorted = [...allTransactions].sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTransactions(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate payment totals for the last 7 days
  const today = new Date();

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");

    const total = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);

        const transactionKey = [
          transactionDate.getFullYear(),
          String(transactionDate.getMonth() + 1).padStart(2, "0"),
          String(transactionDate.getDate()).padStart(2, "0")
        ].join("-");

        return transactionKey === dateKey;
      })
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount || 0),
        0
      );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short"
      }),
      total
    };
  });

  const maxPayment = Math.max(
    ...lastSevenDays.map((day) => day.total),
    1
  );

  const totalPaid = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="recent-transactions">

      {/* Payment Overview */}
      <div className="payment-overview">

        <div className="overview-heading">
          <div>
            <h3>Payment Overview</h3>
            <p>Payments made over the last 7 days</p>
          </div>

          <div className="overview-total">
            <span>Total Recorded</span>
            <h2>
              KSh {totalPaid.toLocaleString("en-KE")}
            </h2>
          </div>
        </div>

        <div className="payment-chart">
          {lastSevenDays.map((day, index) => (
            <div className="chart-column" key={index}>

              <span className="chart-amount">
                {day.total > 0
                  ? day.total.toLocaleString("en-KE")
                  : ""}
              </span>

              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${day.total > 0
                      ? Math.max((day.total / maxPayment) * 100, 5)
                      : 0}%`
                  }}
                  title={`KSh ${day.total.toLocaleString("en-KE")}`}
                />
              </div>

              <span className="chart-day">{day.day}</span>

            </div>
          ))}
        </div>

      </div>
       <br /><br />
      {/* Recent Transactions */}
      <div className="recent-heading">
        <div>
          <h3>Recent Transactions</h3>
          <p>Your latest 5 M-Pesa transactions</p>
        </div>

        <a href="/transactions" className="view-all">
          View All
        </a>
      </div>

      {loading && <p>Loading transactions...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="recent-table-container">
          <table>
            <thead>
              <tr>
                <th>Phone Number</th>
                <th>Amount (KSh)</th>
                <th>Date</th>
                <th>Receipt Number</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.number}</td>

                    <td>
                      KSh {Number(transaction.amount).toLocaleString("en-KE")}
                    </td>

                    <td>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>

                    <td>{transaction.tranx_id}</td>

                    <td className="success-status">
                      SUCCESS
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default RecentTransactions;