import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/ui";
import SystemTabs from "./components/SystemTabs";
import SystemOverviewTab from "./overview/SystemOverviewTab";
import AdminsTab from "./admins/AdminsTab";
import RolesTab from "./roles/RolesTab";
import SiteInfoTab from "./site-info/SiteInfoTab";
import { SYSTEM_TABS } from "./data/constants";

const DEFAULT_TAB = "admins";
const VALID_TABS = SYSTEM_TABS.map((t) => t.key);

const System = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;

  /* If URL has no tab or an invalid one, replace it with the default
     (replace: true so it doesn't pollute history) */
  useEffect(() => {
    if (!tabFromUrl || !VALID_TABS.includes(tabFromUrl)) {
      setSearchParams({ tab: DEFAULT_TAB }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  const handleTabChange = (key) => {
    setSearchParams({ tab: key }, { replace: false });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "admins":
        return <AdminsTab />;
      case "roles":
        return <RolesTab />;
      case "site-info":
        return <SiteInfoTab />;
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

      <SystemTabs active={activeTab} onChange={handleTabChange} />

      <div className="mt-6">{renderTab()}</div>
    </>
  );
};

export default System;