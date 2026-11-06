
import React from "react";
import Sidebar from "./Sidebar";
import RecentTransactions from "./RecentTransactions";
import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <Sidebar />

      <main className="dashboard-content">

        <p>
          Manage your payments and transactions from one place.
        </p>

        

        {/* Display the latest 5 transactions */}
        <RecentTransactions />

      </main>

    </div>
  );
}

export default Dashboard;
