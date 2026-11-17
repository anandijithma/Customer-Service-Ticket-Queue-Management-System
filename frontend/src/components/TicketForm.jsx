import { useState } from "react";

const initialForm = {
  customer_name: "",
  contact: "",
  category: "Technical",
  priority: "Medium",
  description: "",
};

function TicketForm({ onAddTicket }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.customer_name.trim() || !form.contact.trim() || !form.description.trim()) {
      alert("Please fill Customer Name, Contact, and Description.");
      return;
    }

    await onAddTicket(form);
    setForm(initialForm);
  }

  return (
    <section className="panel">
      <h2>Add New Support Ticket</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="field">
          <label>Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            placeholder="Enter customer name"
          />
        </div>

        <div className="field">
          <label>Contact</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Phone number or email"
          />
        </div>

        <div className="field">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option>Technical</option>
            <option>Billing</option>
            <option>Account</option>
            <option>Product Inquiry</option>
            <option>Complaint</option>
          </select>
        </div>

        <div className="field">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="field wide">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the customer issue"
          />
        </div>

        <button className="primary-button" type="submit">
          Add Ticket
        </button>
      </form>
    </section>
  );
}

export default TicketForm;