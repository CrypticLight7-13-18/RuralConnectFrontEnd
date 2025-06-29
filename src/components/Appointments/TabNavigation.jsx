import React from "react";

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "appointments", label: "My Appointments" },
    { id: "doctors", label: "Find Doctors" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6">
      <div className="flex border-b" style={{ borderColor: "#c2dfe3" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === tab.id ? "border-b-2" : "hover:bg-opacity-50"
            }`}
            style={{
              color: activeTab === tab.id ? "#5c6b73" : "#9db4c0",
              borderBottomColor:
                activeTab === tab.id ? "#5c6b73" : "transparent",
              backgroundColor: activeTab === tab.id ? "#e0fbfc" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "#e0fbfc";
                e.target.style.color = "#5c6b73";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#9db4c0";
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
