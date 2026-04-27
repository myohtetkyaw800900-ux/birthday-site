import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "birthdaySiteGuestbookV1";

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return "";
  }
}

export default function Guestbook() {
  const [entries, setEntries] = useState(() => {
    const stored = safeParse(window.localStorage.getItem(STORAGE_KEY));
    return stored;
  });
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const limits = useMemo(
    () => ({
      name: 32,
      message: 200,
      maxEntries: 25,
    }),
    [],
  );

  const submit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim().slice(0, limits.name);
    const trimmedMessage = message.trim().slice(0, limits.message);
    if (!trimmedMessage) return;

    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    const entry = {
      id,
      name: trimmedName,
      message: trimmedMessage,
      createdAt: Date.now(),
    };

    setEntries((current) => [entry, ...current].slice(0, limits.maxEntries));
    setMessage("");
  };

  return (
    <section className="guestbook">
      <form className="guestbook-form" onSubmit={submit}>
        <label className="guestbook-field">
          <span>Name (optional)</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={limits.name}
          />
        </label>

        <label className="guestbook-field">
          <span>Wish</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a sweet birthday wish…"
            maxLength={limits.message}
            rows={3}
            required
          />
          <div className="guestbook-meta">
            <span />
            <span>
              {message.trim().length}/{limits.message}
            </span>
          </div>
        </label>

        <button className="guestbook-submit" type="submit">
          Post wish
        </button>
      </form>

      {entries.length > 0 && (
        <div className="guestbook-entries" role="list">
          {entries.map((entry) => (
            <article key={entry.id} className="guestbook-entry" role="listitem">
              <div className="guestbook-entry-head">
                <strong>{entry.name || "Anonymous"}</strong>
                <span>{formatDate(entry.createdAt)}</span>
              </div>
              <p>{entry.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
