import { useState } from "react";
import "./App.css";

function App() {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emails, subject, message }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email failed.");
      }

      setStatus(data.message);
    } catch (error) {
      setStatus(
        error.message === "Failed to fetch"
          ? "Cannot connect to backend. Check the server."
          : error.message
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container">
      <h1>Bulk Mail App</h1>
      <p>Send your emails easily</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="emails">Recipient Emails</label>
        <textarea
          id="emails"
          placeholder="Enter emails separated by commas"
          rows={3}
          value={emails}
          onChange={(event) => setEmails(event.target.value)}
          required
        />

        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          placeholder="Enter email subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          placeholder="Type your message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />

        <button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send Email"}
        </button>
      </form>

      <p role="status">{status}</p>
    </div>
  );
}

export default App;