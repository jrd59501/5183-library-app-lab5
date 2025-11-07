import { useState, useEffect } from 'react'

export default function App() {
  // health state
  const [health, setHealth] = useState(null)
  const [hLoading, setHLoading] = useState(false)
  const [hError, setHError] = useState(null)

  // books state
  const [books, setBooks] = useState([])
  const [bLoading, setBLoading] = useState(false)
  const [bError, setBError] = useState(null)

  // form state
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')

  async function checkHealth() {
    try {
      setHLoading(true); setHError(null)
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setHealth(await res.json())
    } catch (e) { setHError(e.message); setHealth(null) }
    finally { setHLoading(false) }
  }

  async function loadBooks() {
    try {
      setBLoading(true); setBError(null)
      const res = await fetch('/api/books')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setBooks(json.items || [])
    } catch (e) { setBError(e.message); setBooks([]) }
    finally { setBLoading(false) }
  }

  useEffect(() => { loadBooks() }, []) // auto-load on page open

  async function createBook(e) {
    e.preventDefault()
    try {
      setBError(null)
      const payload = {
        title: title.trim(),
        author: author.trim(),
        year: year ? Number(year) : undefined
      }
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      // optimistic: reload list
      await loadBooks()
      setTitle(''); setAuthor(''); setYear('')
    } catch (e) {
      setBError(e.message)
    }
  }

  async function deleteBook(id) {
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      // refresh list
      setBooks(prev => prev.filter(b => b.id !== id))
    } catch (e) {
      setBError(e.message)
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem', maxWidth: 900 }}>
      <h1>5183 Library</h1>

      {/* Health */}
      <section style={{ marginTop: '1.5rem' }}>
        <h2>API Health</h2>
        <button onClick={checkHealth} disabled={hLoading}>
          {hLoading ? 'Checking…' : 'Run Health Check'}
        </button>
        <pre style={{ background:'#f6f6f6', padding:'1rem', marginTop:'1rem', borderRadius:8 }}>
          {hError ? `Error: ${hError}` : health ? JSON.stringify(health, null, 2) : 'No result yet.'}
        </pre>
      </section>

      {/* Books */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Books</h2>

        <form onSubmit={createBook} style={{ display:'grid', gap:'0.5rem', maxWidth: 520 }}>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
          />
          <input
            placeholder="Year (optional, integer)"
            value={year}
            onChange={e => setYear(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <button type="submit" disabled={bLoading || !title.trim() || !author.trim()}>
            {bLoading ? 'Saving…' : 'Add Book'}
          </button>
        </form>

        {bError && <p style={{ color: 'crimson', marginTop:'0.5rem' }}>Error: {bError}</p>}

        <div style={{ marginTop:'1rem' }}>
          <button onClick={loadBooks} disabled={bLoading}>
            {bLoading ? 'Loading…' : 'Reload'}
          </button>
        </div>

        <ul style={{ marginTop: '1rem', lineHeight: 1.7 }}>
          {books.map(b => (
            <li key={b.id} style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
              <span>
                <strong>{b.title}</strong> — {b.author}{b.year ? ` (${b.year})` : ''}
              </span>
              <button onClick={() => deleteBook(b.id)} style={{ marginLeft: 'auto' }}>
                Delete
              </button>
            </li>
          ))}
          {(!books || books.length === 0) && !bLoading && <li>No books yet.</li>}
        </ul>
      </section>
    </main>
  )
}
