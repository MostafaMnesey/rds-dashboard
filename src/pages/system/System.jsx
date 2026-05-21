import { useState } from "react";
import { PageHeader } from "../../components/ui";
import SystemTabs from "./components/SystemTabs";
import SystemOverviewTab from "./overview/SystemOverviewTab";
import AdminsTab from "./admins/AdminsTab";
import RolesTab from "./roles/RolesTab";

const System = () => {
  const [activeTab, setActiveTab] = useState("admins");

  const renderTab = () => {
    switch (activeTab) {
      case "admins":
        return <AdminsTab />;
      case "roles":
        return <RolesTab />;
      case "overview":
      default:
        return <SystemOverviewTab />;
    }
  };

  return (
    <>
      <PageHeader
        title="System & Admins"
        subtitle="Manage system settings, administrators and roles."
      />

      <SystemTabs active={activeTab} onChange={setActiveTab} />

      <div className="mt-6">{renderTab()}</div>
    </>
  );
};

export default System;
