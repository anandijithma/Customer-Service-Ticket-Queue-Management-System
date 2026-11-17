function TicketTable({ tickets, onSelectTicket }) {
  if (!tickets || tickets.length === 0) {
    return <div className="empty-box">No tickets available.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Customer</th>
            <th>Contact</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.ticket_id}
              onClick={() => onSelectTicket(ticket.ticket_id)}
            >
              <td>{ticket.ticket_id}</td>
              <td>{ticket.customer_name}</td>
              <td>{ticket.contact}</td>
              <td>{ticket.category}</td>
              <td>
                <span className={`priority ${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </td>
              <td>{ticket.status}</td>
              <td>{ticket.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;