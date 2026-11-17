from datetime import datetime

from backend.models.ticket import Ticket
from backend.data_structures.ticket_queue import TicketQueue


class TicketService:
    def __init__(self):
        self.pending_queue = TicketQueue()
        self.assigned_queue = TicketQueue()
        self.resolved_queue = TicketQueue()
        self.ticket_counter = 1

    def generate_ticket_id(self):
        ticket_id = f"T{self.ticket_counter:03d}"
        self.ticket_counter += 1
        return ticket_id

    def add_ticket(self, customer_name, contact, category, priority, description):
        ticket = Ticket(
            ticket_id=self.generate_ticket_id(),
            customer_name=customer_name,
            contact=contact,
            category=category,
            priority=priority,
            description=description,
            status="Pending",
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

        self.pending_queue.enqueue(ticket)
        return ticket

    def assign_next_ticket(self):
        ticket = self.pending_queue.dequeue()

        if ticket is None:
            return None

        ticket.status = "Assigned"
        self.assigned_queue.enqueue(ticket)
        return ticket

    def search_in_queue(self, queue, ticket_id):
        temp_queue = TicketQueue()
        found_ticket = None

        while not queue.is_empty():
            ticket = queue.dequeue()

            if ticket.ticket_id == ticket_id:
                found_ticket = ticket

            temp_queue.enqueue(ticket)

        queue.restore_from(temp_queue)
        return found_ticket

    def search_ticket(self, ticket_id):
        return (
            self.search_in_queue(self.pending_queue, ticket_id)
            or self.search_in_queue(self.assigned_queue, ticket_id)
            or self.search_in_queue(self.resolved_queue, ticket_id)
        )

    def remove_ticket_from_queue(self, queue, ticket_id):
        temp_queue = TicketQueue()
        removed_ticket = None

        while not queue.is_empty():
            ticket = queue.dequeue()

            if ticket.ticket_id == ticket_id and removed_ticket is None:
                removed_ticket = ticket
            else:
                temp_queue.enqueue(ticket)

        queue.restore_from(temp_queue)
        return removed_ticket

    def cancel_pending_ticket(self, ticket_id):
        return self.remove_ticket_from_queue(self.pending_queue, ticket_id)

    def resolve_assigned_ticket(self, ticket_id):
        ticket = self.remove_ticket_from_queue(self.assigned_queue, ticket_id)

        if ticket is None:
            return None

        ticket.status = "Resolved"
        self.resolved_queue.enqueue(ticket)
        return ticket

    def reopen_resolved_ticket(self, ticket_id):
        ticket = self.remove_ticket_from_queue(self.resolved_queue, ticket_id)

        if ticket is None:
            return None

        ticket.status = "Pending"
        self.pending_queue.enqueue(ticket)
        return ticket

    def filter_pending_by_category(self, category):
        result = []
        temp_queue = TicketQueue()

        while not self.pending_queue.is_empty():
            ticket = self.pending_queue.dequeue()

            if category == "All" or ticket.category == category:
                result.append(ticket)

            temp_queue.enqueue(ticket)

        self.pending_queue.restore_from(temp_queue)
        return result

    def get_pending_tickets(self):
        return self.pending_queue.get_all_items()

    def get_assigned_tickets(self):
        return self.assigned_queue.get_all_items()

    def get_resolved_tickets(self):
        return self.resolved_queue.get_all_items()

    def get_counts(self):
        return {
            "pending": self.pending_queue.size(),
            "assigned": self.assigned_queue.size(),
            "resolved": self.resolved_queue.size()
        }