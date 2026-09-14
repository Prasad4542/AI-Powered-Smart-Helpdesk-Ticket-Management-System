import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = '';

const navItems = [
  { key: 'dashboard', icon: '⌂', label: 'Dashboard' },
  { key: 'tickets', icon: '▤', label: 'Tickets' },
  { key: 'create', icon: '+', label: 'New Ticket' },
];

function App() {
  const [page, setPage] = useState('dashboard');
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', createdBy: 'demo@user.com' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const r = await fetch(API + '/api/tickets');
      if (!r.ok) throw new Error('Failed to load tickets');
      const data = await r.json();
      setTickets(Array.isArray(data) ? data : []);
      setMsg('');
    } catch {
      setMsg('Start the backend services first.');
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 12000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(x => x.status === 'OPEN').length,
    progress: tickets.filter(x => x.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(x => x.status === 'RESOLVED' || x.status === 'CLOSED').length,
    high: tickets.filter(x => x.priority === 'HIGH').length,
  }), [tickets]);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(t =>
      [t.title, t.description, t.category, t.priority, t.status, t.createdBy]
        .some(v => String(v ?? '').toLowerCase().includes(q))
    );
  }, [tickets, search]);

  const createTicket = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setLoading(true);
    setMsg('AI is analyzing your ticket…');
    try {
      const r = await fetch(API + '/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error('Create failed');
      setForm({ title: '', description: '', createdBy: 'demo@user.com' });
      setMsg('Ticket created successfully. AI classification completed.');
      await load();
      setPage('tickets');
    } catch {
      setMsg('Ticket could not be created. Check backend services.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, value) => {
    await fetch(`${API}/api/tickets/${id}/status?value=${encodeURIComponent(value)}`, { method: 'PUT' });
    await load();
  };

  const deleteTicket = async (id) => {
    await fetch(`${API}/api/tickets/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      <aside className="sidebar glass-panel">
        <div className="brand">
          <div className="brand-bot mini-bot"><span>AI</span></div>
          <div>
            <h2>Smart<span>Help</span></h2>
            <p>AI Helpdesk</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-item ${page === item.key ? 'active' : ''}`}
              onClick={() => { setPage(item.key); setMsg(''); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.key === 'tickets' && <span className="nav-count">{tickets.length}</span>}
            </button>
          ))}
        </nav>

        <div className="side-spacer" />
        <div className="robot-stage">
          <div className="robot-ring" />
          <div className="robot-bot big-bot">
            <div className="robot-head"><div className="eye eye-l" /><div className="eye eye-r" /></div>
            <div className="robot-body"><div className="robot-core">✦</div></div>
            <div className="robot-hand hand-l" />
            <div className="robot-hand hand-r" />
          </div>
          <p>“Smarter Support,<br/>Happier Users”</p>
        </div>
        <div className="system-status"><span className="online-dot" /> System Online</div>
        <div className="side-footer">Java • Spring Boot<br/>Microservices • React</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets, users, or keywords…" />
            <kbd>Ctrl</kbd><b>+</b><kbd>K</kbd>
          </div>
          <div className="top-actions">
            <button className="icon-btn" title="Notifications">♢<span className="alert-dot">3</span></button>
            <div className="profile-orb">PM</div>
            <div className="profile-text"><strong>Prasad Mundhe</strong><span>Admin</span></div>
            <span className="chevron">⌄</span>
          </div>
        </header>

        {msg && <div className="notice neon-border">{msg}</div>}

        {page === 'dashboard' && (
          <Dashboard
            stats={stats}
            tickets={filteredTickets}
            onCreate={() => { setPage('create'); setMsg(''); }}
            onTickets={() => { setPage('tickets'); setMsg(''); }}
            onUpdateStatus={updateStatus}
            onDelete={deleteTicket}
          />
        )}

        {page === 'tickets' && (
          <TicketsPage tickets={filteredTickets} onCreate={() => setPage('create')} onUpdateStatus={updateStatus} onDelete={deleteTicket} />
        )}

        {page === 'create' && (
          <CreatePage form={form} setForm={setForm} onSubmit={createTicket} loading={loading} />
        )}
      </main>
    </div>
  );
}

function Dashboard({ stats, tickets, onCreate, onTickets, onUpdateStatus, onDelete }) {
  return (
    <>
      <section className="hero glass-panel">
        <div className="hero-copy">
          <span className="eyebrow">AI-POWERED SUPPORT OPERATIONS</span>
          <h1>Good Morning, <span>Prasad!</span> <i>👋</i></h1>
          <p>AI is here to help you manage, analyse and resolve tickets faster.</p>
          <div className="hero-actions"><button className="primary-btn" onClick={onCreate}>+ Create New Ticket</button><button className="ghost-btn" onClick={onTickets}>View All Tickets →</button></div>
        </div>
        <div className="hero-art">
          <div className="holo-ring ring-1" /><div className="holo-ring ring-2" />
          <div className="laptop"><div className="screen"><span>AI</span><small>SMART</small></div><div className="base" /></div>
          <div className="float-chip chip-1">✦ AI Analysis</div>
          <div className="float-chip chip-2">⚡ Live</div>
        </div>
        <div className="hero-mini-card"><span className="mini-icon">⚡</span><div><strong>Let's make support<br/>smarter together</strong></div><span className="round-arrow">→</span></div>
      </section>

      <section className="dashboard-grid">
        <div className="left-column">
          <section className="stats-grid">
            <StatCard label="Total Tickets" value={stats.total} change="↑ 12%" tone="violet" icon="▣" data={[2,5,4,7,6,10,8,13]} />
            <StatCard label="Open" value={stats.open} change="↑ 8%" tone="cyan" icon="◈" data={[4,3,5,4,7,5,9,8]} />
            <StatCard label="In Progress" value={stats.progress} change="↑ 5%" tone="orange" icon="◷" data={[2,3,3,6,4,7,6,9]} />
            <StatCard label="Resolved" value={stats.resolved} change="↑ 20%" tone="purple" icon="✓" data={[2,3,2,4,5,4,8,10]} />
          </section>

          <section className="table-panel glass-panel">
            <div className="section-head"><div><span className="section-kicker">LIVE SUPPORT QUEUE</span><h2>Recent Tickets</h2><p>Latest support requests from users</p></div><button className="small-outline" onClick={onTickets}>View All →</button></div>
            <div className="ticket-table">
              <div className="table-row table-head"><span>#</span><span>Title</span><span>Category</span><span>Priority</span><span>Status</span><span>Created</span><span /></div>
              {tickets.slice(0, 7).map(t => <TicketRow key={t.id} t={t} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />)}
              {!tickets.length && <div className="empty-row">No tickets found. Create your first support ticket.</div>}
            </div>
          </section>
          <div className="live-bar"><span className="live-dot" /> <strong>Live Updates</strong><span>Ticket feed refreshes automatically every 12 seconds</span><span className="bars">▁▃▆▇</span></div>
        </div>

        <aside className="right-column">
          <section className="assistant-card glass-panel">
            <div className="assistant-top"><div><span className="section-kicker">INTELLIGENT COPILOT</span><h2>AI Assistant</h2></div><button className="chat-btn">Chat Now →</button></div>
            <p>Get instant help, suggest solutions, and auto-categorize tickets with AI.</p>
            <div className="assistant-bubble"><div className="bot-avatar">AI</div><div><strong>Hello Prasad! 👋</strong><span>I can help you analyse tickets, suggest categories, set priorities and more!</span></div></div>
            <div className="scan-line" />
          </section>

          <section className="quick-card glass-panel">
            <div className="section-head compact"><div><span className="section-kicker">PRODUCTIVITY</span><h2>Quick Actions</h2></div></div>
            <div className="quick-grid">
              <button onClick={onCreate} className="quick-item violet"><span>＋</span><strong>New Ticket</strong><small>Create a new support request</small></button>
              <button className="quick-item cyan"><span>✦</span><strong>AI Analyze</strong><small>Let AI categorize & prioritize</small></button>
              <button className="quick-item green"><span>◔</span><strong>View Reports</strong><small>Check ticket stats and trends</small></button>
              <button className="quick-item orange"><span>⚙</span><strong>Manage Settings</strong><small>Configure your helpdesk</small></button>
            </div>
            <div className="powered">✦ Powered by AI</div>
          </section>
        </aside>
      </section>
    </>
  );
}

function StatCard({ label, value, change, tone, icon, data }) {
  return <div className={`stat-card ${tone} glass-panel`}><div className="stat-icon">{icon}</div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><div className="stat-bottom"><span>{change}</span><MiniChart data={data} /></div></div>;
}

function MiniChart({ data }) {
  const max = Math.max(...data), min = Math.min(...data);
  const points = data.map((v, i) => `${(i/(data.length-1))*100},${38-((v-min)/(max-min||1))*28}`).join(' ');
  return <svg className="mini-chart" viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TicketRow({ t, onUpdateStatus }) {
  return <div className="table-row">
    <span className="id-cell">#{t.id}</span>
    <span className="title-cell"><strong>{t.title}</strong><small>{t.createdBy}</small></span>
    <span><Badge type="category" value={t.category} /></span>
    <span><Badge type="priority" value={t.priority} /></span>
    <span><Badge type="status" value={t.status} /></span>
    <span className="time-cell">{formatTime(t.createdAt)}</span>
    <span className="row-arrow">›</span>
    <select className="status-select" value={t.status} onChange={e => onUpdateStatus(t.id, e.target.value)} aria-label="Update ticket status"><option>OPEN</option><option>IN_PROGRESS</option><option>RESOLVED</option><option>CLOSED</option></select>
  </div>;
}

function Badge({ type, value }) {
  const cls = String(value || '').toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  return <span className={`badge badge-${type} ${cls}`}>{value}</span>;
}

function TicketsPage({ tickets, onCreate, onUpdateStatus }) {
  return <section className="page-panel glass-panel"><div className="page-head"><div><span className="section-kicker">SUPPORT MANAGEMENT</span><h1>All Tickets</h1><p>Track every issue from creation to resolution.</p></div><button className="primary-btn" onClick={onCreate}>+ New Ticket</button></div><div className="ticket-list">{tickets.map(t => <TicketCard key={t.id} t={t} onUpdateStatus={onUpdateStatus} />)}{!tickets.length && <div className="empty-state">No tickets found.</div>}</div></section>;
}

function TicketCard({ t, onUpdateStatus }) {
  return <article className="ticket-card glass-panel"><div className="ticket-main"><span className="ticket-id">#{t.id}</span><div><h3>{t.title}</h3><p>{t.description}</p><small>{t.category} • AI Priority: <b>{t.priority}</b> • {t.createdBy}</small></div></div><div className="ticket-side"><Badge type="priority" value={t.priority} /><Badge type="status" value={t.status} /><select className="status-select" value={t.status} onChange={e => onUpdateStatus(t.id, e.target.value)}><option>OPEN</option><option>IN_PROGRESS</option><option>RESOLVED</option><option>CLOSED</option></select></div></article>;
}

function CreatePage({ form, setForm, onSubmit, loading }) {
  return <section className="page-panel create-page glass-panel"><div className="page-head"><div><span className="section-kicker">AI-ASSISTED INTAKE</span><h1>Create Support Ticket</h1><p>Describe the issue and let AI detect category and priority automatically.</p></div><div className="ai-pulse">✦ AI READY</div></div><form className="create-form" onSubmit={onSubmit}><label>Issue title<input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Production API is down" /></label><label>Description<textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the issue in simple words…" /></label><label>Created by<input value={form.createdBy} onChange={e => setForm({...form, createdBy: e.target.value})} /></label><button className="primary-btn submit-btn" disabled={loading}>{loading ? 'Analysing with AI…' : '✦ Create & Analyze with AI'}</button></form></section>;
}

function formatTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const diff = Math.max(0, Date.now() - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

createRoot(document.getElementById('root')).render(<App />);
