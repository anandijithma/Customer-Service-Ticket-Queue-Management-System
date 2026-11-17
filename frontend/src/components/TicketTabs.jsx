function TicketTabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "pending" ? "active" : ""}
        onClick={() => setActiveTab("pending")}
      >
        Pending Tickets
      </button>

      <button
        className={activeTab === "assigned" ? "active" : ""}
        onClick={() => setActiveTab("assigned")}
      >
        Assigned Tickets
      </button>

      <button
        className={activeTab === "resolved" ? "active" : ""}
        onClick={() => setActiveTab("resolved")}
      >
        Resolved Tickets
      </button>
    </div>
  );
}

export default TicketTabs;