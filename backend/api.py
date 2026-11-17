from dataclasses import asdict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.services.ticket_service import TicketService


app = FastAPI(
    title="Customer Service Ticket Queue Management API",
    description="FastAPI backend for Queue-based customer support ticket system",
    version="1.0.0"
)

service = TicketService()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketCreateRequest(BaseModel):
    customer_name: str
    contact: str
    category: str
    priority: str
    description: str


def ticket_to_dict(ticket):
    if ticket is None:
        return None

    return asdict(ticket)


def ticket_list_to_dict(tickets):
    return [ticket_to_dict(ticket) for ticket in tickets]


@app.get("/")
def home():
    return {
        "message": "Customer Service Ticket Queue Management API is running"
    }


@app.get("/tickets")
def get_all_tickets():
    return {
        "pending": ticket_list_to_dict(service.get_pending_tickets()),
        "assigned": ticket_list_to_dict(service.get_assigned_tickets()),
        "resolved": ticket_list_to_dict(service.get_resolved_tickets()),
        "counts": service.get_counts()
    }


@app.post("/tickets")
def add_ticket(request: TicketCreateRequest):
    if not request.customer_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Customer name is required"
        )

    if not request.contact.strip():
        raise HTTPException(
            status_code=400,
            detail="Contact is required"
        )

    if not request.description.strip():
        raise HTTPException(
            status_code=400,
            detail="Description is required"
        )

    ticket = service.add_ticket(
        customer_name=request.customer_name,
        contact=request.contact,
        category=request.category,
        priority=request.priority,
        description=request.description
    )

    return {
        "message": "Ticket added successfully",
        "ticket": ticket_to_dict(ticket)
    }


@app.post("/tickets/assign")
def assign_next_ticket():
    ticket = service.assign_next_ticket()

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="No pending tickets available"
        )

    return {
        "message": "Ticket assigned successfully",
        "ticket": ticket_to_dict(ticket)
    }


@app.get("/tickets/{ticket_id}")
def search_ticket(ticket_id: str):
    ticket = service.search_ticket(ticket_id.upper())

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return {
        "ticket": ticket_to_dict(ticket)
    }


@app.delete("/tickets/pending/{ticket_id}")
def cancel_pending_ticket(ticket_id: str):
    ticket = service.cancel_pending_ticket(ticket_id.upper())

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found in pending queue"
        )

    return {
        "message": "Ticket cancelled successfully",
        "ticket": ticket_to_dict(ticket)
    }


@app.post("/tickets/assigned/{ticket_id}/resolve")
def resolve_assigned_ticket(ticket_id: str):
    ticket = service.resolve_assigned_ticket(ticket_id.upper())

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found in assigned queue"
        )

    return {
        "message": "Ticket resolved successfully",
        "ticket": ticket_to_dict(ticket)
    }


@app.post("/tickets/resolved/{ticket_id}/reopen")
def reopen_resolved_ticket(ticket_id: str):
    ticket = service.reopen_resolved_ticket(ticket_id.upper())

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found in resolved queue"
        )

    return {
        "message": "Ticket reopened successfully",
        "ticket": ticket_to_dict(ticket)
    }


@app.get("/tickets/pending/filter/{category}")
def filter_pending_tickets(category: str):
    tickets = service.filter_pending_by_category(category)

    return {
        "pending": ticket_list_to_dict(tickets)
    }