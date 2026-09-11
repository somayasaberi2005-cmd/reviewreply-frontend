const sections = [
  { title: "Getting Started", desc: "How to connect your review sites and send your first request." },
  { title: "Managing Reviews", desc: "Approving, editing, and rejecting AI-drafted replies." },
  { title: "Reports", desc: "Understanding NPS, Success, and Performance reports." },
  { title: "Team & Roles", desc: "What each role (Owner, Regional Manager, Location Manager, Viewer) can access." },
];

export default function UserguidePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Userguide</h1>
        <p className="page-subtitle">Browse documentation for using ReviewReply.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <div key={s.title} className="card">
            <p className="font-semibold text-slate-900 mb-1">{s.title}</p>
            <p className="text-sm text-slate-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
