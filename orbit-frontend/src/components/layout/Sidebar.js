import { NavLink, useNavigate } from "react-router-dom";
import {
  FaAddressBook,
  FaCog,
  FaFileAlt,
  FaHome,
  FaSignOutAlt,
  FaUsers,
  FaUserTie
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/loginpage");
  };

  return (
    <div className="sidebar shadow-xl">
      <div className="sidebar-brand">
        <div className="logo-dot"></div>
        <span>Orbit</span>
        <span className="logo-accent">CRM</span>
      </div>

      <div className="sidebar-menu">
        <div className="menu-group-label">Core Modules</div>
        
        <NavLink to="/dashboard" className="sidebar-link">
          <FaHome className="link-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/leads" className="sidebar-link">
          <FaUsers className="link-icon" />
          <span>Leads</span>
        </NavLink>

        <NavLink to="/manager" className="sidebar-link">
          <FaUserTie className="link-icon" />
          <span>Managers</span>
        </NavLink>

        <NavLink to="/agents" className="sidebar-link">
          <FaUsers className="link-icon" />
          <span>Agents</span>
        </NavLink>

        <NavLink to="/contacts" className="sidebar-link">
          <FaAddressBook className="link-icon" />
          <span>Contacts</span>
        </NavLink>

        <NavLink to="/reports" className="sidebar-link">
          <FaFileAlt className="link-icon" />
          <span>Reports</span>
        </NavLink>
      </div>

      <div className="sidebar-footer border-t border-slate-800 pt-5">
        <NavLink to="/settings" className="sidebar-link">
          <FaCog className="link-icon" />
          <span>Settings</span>
        </NavLink>

        <a href="#logout" className="sidebar-link logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="link-icon" />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;