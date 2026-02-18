import { FormEvent, useEffect, useState } from 'react';

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export default function App() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadEntries() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/guestbook`);
      if (!response.ok) {
        throw new Error('Failed to fetch guestbook entries');
      }
      const data = (await response.json()) as GuestbookEntry[];
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to create entry');
      }

      setName('');
      setMessage('');
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  function startEdit(entry: GuestbookEntry) {
    setEditingId(entry.id);
    setEditName(entry.name);
    setEditMessage(entry.message);
  }

  async function saveEdit(id: string) {
    setError('');

    try {
      const response = await fetch(`${API_URL}/guestbook/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, message: editMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      setEditingId(null);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  async function deleteEntry(id: string) {
    setError('');

    try {
      const response = await fetch(`${API_URL}/guestbook/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Personal Profile</h1>
        <p><strong>Name:</strong> Bogart</p>
        <p><strong>Role:</strong> Full-time doesn't know what's happening</p>
        <p><strong>Bio:</strong> i just asked copilot, please dont attack me</p>
      </section>

      <section className="card">
        <h2>Guestbook</h2>

        <form onSubmit={handleCreate} className="form">
          <input
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <textarea
            placeholder="Leave a message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          <button type="submit">Sign Guestbook</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <ul className="entries">
          {entries.map((entry) => (
            <li key={entry.id} className="entry">
              {editingId === entry.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                  />
                  <textarea
                    value={editMessage}
                    onChange={(event) => setEditMessage(event.target.value)}
                  />
                  <div className="actions">
                    <button onClick={() => void saveEdit(entry.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>{entry.name}</strong></p>
                  <p>{entry.message}</p>
                  <small>{new Date(entry.created_at).toLocaleString()}</small>
                  <div className="actions">
                    <button onClick={() => startEdit(entry)}>Edit</button>
                    <button onClick={() => void deleteEntry(entry.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
