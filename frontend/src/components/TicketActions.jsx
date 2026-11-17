function TicketActions({
  ticketId,
  setTicketId,
  onSearch,
  onCancel,
  onAssign,
  onResolve,
  onReopen,
}) {
  return (
    <section className="panel">
      <h2>Ticket Actions</h2>

      <div className="actions">
        <input
          type="text"
          value={ticketId}
          onChange={(event) => setTicketId(event.target.value)}
          placeholder="Ticket ID e.g. T001"
        />

        <button onClick={onSearch}>Search Ticket</button>
        <button onClick={onCancel}>Cancel Pending</button>
        <button onClick={onAssign}>Assign Next</button>
        <button onClick={onResolve}>Resolve Assigned</button>
        <button onClick={onReopen}>Reopen Resolved</button>
      </div>
    </section>
  );
}

export default TicketActions;