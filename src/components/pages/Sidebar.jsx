
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import safLogo from "../images/safLogo.png";

import {  BsGrid,  BsSend,  BsWallet2,  BsClockHistory,  BsPerson,  BsBoxArrowRight,  BsList,  BsX} from "react-icons/bs";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? <BsX /> : <BsList />}
      </button>

      {/* Background overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

        <img src={safLogo} alt="M-Pesa side logo"   width={250} height={50} />

        <nav>
          <Link to="/dashboard" onClick={closeSidebar}>
            <BsGrid /> Dashboard
          </Link>

          <Link to="/mpesa" onClick={closeSidebar}>
            <BsSend /> Make Payment
          </Link>

          
         

          <Link to="/transactions" onClick={closeSidebar}>
            <BsWallet2 /> All Transactions 
          </Link>

          <Link to="/profile" onClick={closeSidebar}>
            <BsPerson /> Profile
          </Link>
        </nav>

        <Link
          to="/login"
          className="logout"
          onClick={closeSidebar}
        >
          <BsBoxArrowRight /> Logout
        </Link>

      </div>
    </>
  );
}

export default Sidebar;
