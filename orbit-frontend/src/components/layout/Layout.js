import React from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">

      <Sidebar />

      <div className="layout-content">

        <Navbar />

        <div className="page-content animate-fade-in">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;