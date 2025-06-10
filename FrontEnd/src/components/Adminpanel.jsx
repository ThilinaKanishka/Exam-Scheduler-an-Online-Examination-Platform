import React from "react";
import AdminPanelHeader from "./AdminPanelHeader";
import AdminPanelFooter from "./AdminPanelFooter"; // <-- Added import

function Adminpanel() {
  return (
    <div>
      <AdminPanelHeader />
      <h1>This Is Admin Panel</h1>
      <AdminPanelFooter /> {/* <-- Fixed typo here */}
    </div>
  );
}

export default Adminpanel;
