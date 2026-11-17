import { useEffect, useMemo, useState } from "react";
import "./App.css";

import StatCard from "./components/StatCard";
import TicketActions from "./components/TicketActions";
import TicketForm from "./components/TicketForm";
import TicketTable from "./components/TicketTable";
import TicketTabs from "./components/TicketTabs";

import {
  addTicket,
  assignNextTicket,
  cancelPendingTicket,
  getAllTickets,
  reopenResolvedTicket,
  resolveAssignedTicket,
  searchTicket,
} from "./api/ticketApi";

function App() {
  const [tickets, setTickets] = useState({
    pending: [],
    assigned: [],
    resolved: [],
    counts: {
      pending: 0,
      assigned: 0,
      resolved: 0,
    },
  });

  const [activeTab, setActiveTab] = useState("pending");
  const [ticketId, setTicketId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const data = await getAllTickets();
      setTickets(data);
    } catch {
      setMessage("Backend is not running. Start FastAPI backend first.");
    }
  }

  function getCleanTicketId() {
    const id = ticketId.trim().toUpperCase();

    if (!id) {
      setMessage("Please enter or select a Ticket ID.");
      return null;
    }

    return id;
  }

  async function handleAddTicket(ticketData) {
    try {
      const data = await addTicket(ticketData);

      setMessage(`Ticket ${data.ticket.ticket_id} added successfully.`);
      setActiveTab("pending");

      await loadTickets();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleAssignNextTicket() {
    try {
      const data = await assignNextTicket();

      setMessage(`Ticket ${data.ticket.ticket_id} assigned successfully.`);
      setActiveTab("assigned");

      await loadTickets();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSearchTicket() {
    const id = getCleanTicketId();

    if (!id) return;

    try {
      const data = await searchTicket(id);
      const ticket = data.ticket;

      setMessage(
        `Found ${ticket.ticket_id}: ${ticket.customer_name}, ${ticket.category}, ${ticket.priority}, ${ticket.status}`
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCancelPendingTicket() {
    const id = getCleanTicketId();

    if (!id) return;

    try {
      await cancelPendingTicket(id);

      setMessage(`Ticket ${id} cancelled successfully.`);
      setActiveTab("pending");
      setTicketId("");

      await loadTickets();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleResolveAssignedTicket() {
    const id = getCleanTicketId();

    if (!id) return;

    try {
      await resolveAssignedTicket(id);

      setMessage(`Ticket ${id} resolved successfully.`);
      setActiveTab("resolved");
      setTicketId("");

      await loadTickets();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleReopenResolvedTicket() {
    const id = getCleanTicketId();

    if (!id) return;

    try {
      await reopenResolvedTicket(id);

      setMessage(`Ticket ${id} reopened and moved back to pending queue.`);
      setActiveTab("pending");
      setTicketId("");

      await loadTickets();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredPendingTickets = useMemo(() => {
    if (selectedCategory === "All") {
      return tickets.pending;
    }

    return tickets.pending.filter(
      (ticket) => ticket.category === selectedCategory
    );
  }, [tickets.pending, selectedCategory]);

  const visibleTickets =
    activeTab === "pending"
      ? filteredPendingTickets
      : activeTab === "assigned"
      ? tickets.assigned
      : tickets.resolved;

  const activeTitle =
    activeTab === "pending"
      ? "Pending Ticket Queue"
      : activeTab === "assigned"
      ? "Assigned Ticket Queue"
      : "Resolved Ticket Queue";

  return (
    <div className="app">
      <header className="header">
        <h1>Customer Service Ticket Queue Management System</h1>
        <p>Queue-Based Customer Support Ticket Handling Application</p>
      </header>

      <section className="dashboard">
        <StatCard title="Pending Tickets" value={tickets.counts.pending} />
        <StatCard title="Assigned Tickets" value={tickets.counts.assigned} />
        <StatCard title="Resolved Tickets" value={tickets.counts.resolved} />
      </section>

      {message && <div className="message">{message}</div>}

      <TicketForm onAddTicket={handleAddTicket} />

      <TicketActions
        ticketId={ticketId}
        setTicketId={setTicketId}
        onSearch={handleSearchTicket}
        onCancel={handleCancelPendingTicket}
        onAssign={handleAssignNextTicket}
        onResolve={handleResolveAssignedTicket}
        onReopen={handleReopenResolvedTicket}
      />

      <section className="panel">
        <TicketTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="table-header">
          <h2>{activeTitle}</h2>

          {activeTab === "pending" && (
            <div className="filter">
              <label>Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option>All</option>
                <option>Technical</option>
                <option>Billing</option>
                <option>Account</option>
                <option>Product Inquiry</option>
                <option>Complaint</option>
              </select>
            </div>
          )}
        </div>

        <TicketTable
          tickets={visibleTickets}
          onSelectTicket={(id) => setTicketId(id)}
        />
      </section>
    </div>
  );
}

export default App;