from dataclasses import dataclass


@dataclass
class Ticket:
    ticket_id: str
    customer_name: str
    contact: str
    category: str
    priority: str
    description: str
    status: str
    created_at: str