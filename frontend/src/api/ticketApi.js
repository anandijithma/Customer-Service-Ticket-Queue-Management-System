const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.detail || "Something went wrong";
    throw new Error(errorMessage);
  }

  return data;
}

export function getAllTickets() {
  return request("/tickets");
}

export function addTicket(ticketData) {
  return request("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });
}

export function assignNextTicket() {
  return request("/tickets/assign", {
    method: "POST",
  });
}

export function searchTicket(ticketId) {
  return request(`/tickets/${ticketId}`);
}

export function cancelPendingTicket(ticketId) {
  return request(`/tickets/pending/${ticketId}`, {
    method: "DELETE",
  });
}

export function resolveAssignedTicket(ticketId) {
  return request(`/tickets/assigned/${ticketId}/resolve`, {
    method: "POST",
  });
}

export function reopenResolvedTicket(ticketId) {
  return request(`/tickets/resolved/${ticketId}/reopen`, {
    method: "POST",
  });
}