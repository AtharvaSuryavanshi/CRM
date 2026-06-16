import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaInfoCircle } from "react-icons/fa";

import "./Navbar.css";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  
  const userRole = localStorage.getItem("userRole") || "USER";
  const userEmail = localStorage.getItem("userEmail") || "admin@orbit.com";
  
  // Extract clean first name: remove numbers and strip last name 'suryavanshi'
  let namePart = userEmail.split("@")[0].toLowerCase().replace(/[0-9]/g, "");
  if (namePart.includes("suryavanshi")) {
    namePart = namePart.split("suryavanshi")[0];
  }
  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  const notifications = [
    { id: 1, text: "New lead 'Rohan Sharma' assigned to Agent Rahul.", time: "5m ago", type: "info" },
    { id: 2, text: "Lead 'Ananya Patel' status updated to Booked.", time: "1h ago", type: "success" },
    { id: 3, text: "Monthly performance reports are now available.", time: "2h ago", type: "system" },
    { id: 4, text: "System maintenance scheduled at 12:00 AM.", time: "1d ago", type: "warning" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar glass-panel">
      <div className="navbar-search">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Quick search leads, agents..." />
      </div>

      <div className="navbar-right">
        {/* Notifications Icon with Indicator */}
        <div className="notification-wrapper" ref={dropdownRef}>
          <div className="bell-container" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell className="notification-icon" />
            <span className="notification-dot"></span>
          </div>

          {showNotifications && (
            <div className="notifications-dropdown glass-panel animate-scale-up">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="mark-read">Mark all read</span>
              </div>
              <div className="dropdown-body">
                {notifications.map((item) => (
                  <div key={item.id} className="notification-item">
                    <div className="item-icon-wrapper">
                      <FaInfoCircle className={`item-icon ${item.type}`} />
                    </div>
                    <div className="item-content">
                      <p className="item-text">{item.text}</p>
                      <span className="item-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-container">
          <div className="profile-avatar">
            {displayName.charAt(0)}
          </div>
          <div className="profile-details">
            <span className="profile-name">{displayName}</span>
            <span className={`profile-role-badge ${userRole.toLowerCase()}`}>
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;