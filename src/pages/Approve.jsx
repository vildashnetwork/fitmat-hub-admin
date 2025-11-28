// // src/pages/Approve.jsx
// import React, { useEffect, useState } from "react";
// import api from "@/utils/aps.js";

// function useToast() {
//     const [toasts, setToasts] = useState([]);
//     useEffect(() => {
//         if (!toasts.length) return;
//         const t = setTimeout(() => setToasts((s) => s.slice(1)), 3500);
//         return () => clearTimeout(t);
//     }, [toasts]);
//     const push = (text, type = "info") => setToasts((s) => [...s, { id: Date.now(), text, type }]);
//     const Toasts = () => (
//         <div className="fixed top-6 right-6 z-50 space-y-2">
//             {toasts.map((t) => (
//                 <div key={t.id} className={`rounded-md px-4 py-2 shadow ${t.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
//                     {t.text}
//                 </div>
//             ))}
//         </div>
//     );
//     return { push, Toasts };
// }

// export default function Approve() {
//     const { push, Toasts } = useToast();
//     const [candidates, setCandidates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [deletingId, setDeletingId] = useState(null);

//     async function fetchCandidates() {
//         setLoading(true);
//         try {
//             const res = await api.get("/candidates/candidates");
//             setCandidates(res.data || []);
//         } catch (err) {
//             console.error(err);
//             push("Failed to fetch candidates", "error");
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchCandidates();
//     }, []);

//     async function deleteCandidate(id) {
//         if (!confirm("Delete this candidate? This cannot be undone.")) return;
//         setDeletingId(id);
//         try {
//             await api.delete(`/candidates/candidates/${id}`);
//             push("Candidate deleted");
//             setCandidates((prev) => prev.filter((c) => c._id !== id));
//         } catch (err) {
//             console.error(err);
//             push("Failed to delete", "error");
//         } finally {
//             setDeletingId(null);
//         }
//     }

//     return (
//         <div>
//             <Toasts />
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold">Approved Candidates</h2>
//                 <button onClick={fetchCandidates} className="px-3 py-2 rounded-md border hover:bg-gray-100">Refresh</button>
//             </div>

//             {loading ? (
//                 <div className="text-center py-12">Loading...</div>
//             ) : candidates.length === 0 ? (
//                 <div className="text-center py-12 text-gray-500">No approved candidates yet.</div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {candidates.map((c) => (
//                         <div key={c._id} className="bg-white rounded-2xl shadow p-4 border">
//                             <div className="w-full h-44 overflow-hidden rounded mb-3">
//                                 {c.bg ? <img src={c.bg} alt={c.name} className="w-full h-full object-cover" /> : <div className="bg-gray-100 w-full h-full" />}
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h3 className="text-lg font-semibold">{c.name}</h3>
//                                     <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
//                                 </div>
//                                 <div className="w-16 h-16 rounded-full overflow-hidden">
//                                     {c.photo ? <img src={c.photo} alt={c.name} className="w-full h-full object-cover" /> : <div className="bg-gray-200 w-full h-full" />}
//                                 </div>
//                             </div>

//                             <p className="mt-3 text-sm text-gray-700">{c.manifesto}</p>

//                             <div className="mt-4 flex justify-between items-center">
//                                 <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">{c.colorIndex}</span>
//                                 <button onClick={() => deleteCandidate(c._id)} disabled={deletingId === c._id} className="px-3 py-1 rounded-md border text-sm">
//                                     {deletingId === c._id ? "Deleting..." : "Delete"}
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }



















// File: src/pages/Approve.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/aps.js";
import "./approve.css";

function useToast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((s) => s.slice(1)), 3500);
    return () => clearTimeout(t);
  }, [toasts]);

  const push = (text, type = "info") =>
    setToasts((s) => [...s, { id: Date.now(), text, type }]);

  const Toasts = () => (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type === "error" ? "toast--error" : "toast--success"}`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );

  return { push, Toasts };
}

export default function Approve() {
  const { push, Toasts } = useToast();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  async function fetchCandidates() {
    setLoading(true);
    try {
      const res = await api.get("/candidates/candidates");
      setCandidates(res.data || []);
    } catch (err) {
      console.error(err);
      push("Failed to fetch candidates", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deleteCandidate(id) {
    if (!window.confirm("Delete this candidate? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/candidates/candidates/${id}`);
      push("Candidate deleted");
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      push("Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="approve-container">
      <Toasts />

      <header className="approve-header">
        <h2 className="approve-title">Approved Candidates</h2>
        <div className="header-controls">
          <button
            onClick={fetchCandidates}
            className="btn btn--ghost"
            aria-label="Refresh candidates"
          >
            Refresh
          </button>
        </div>
      </header>

      {loading ? (
        <div className="place-holder">Loading...</div>
      ) : candidates.length === 0 ? (
        <div className="place-holder place-holder--muted">No approved candidates yet.</div>
      ) : (
        <section className="card-grid">
          {candidates.map((c) => (
            <article key={c._id} className="card" style={{background: `${c.color}`}}>
              <div className="card-media">
                {c.bg ? (
                  <img src={c.bg} alt={`${c.name} background`} className="card-bg" />
                ) : (
                  <div className="card-bg card-bg--empty" />
                )}
              </div>

              <div className="card-body">
                <div className="card-top">
                  <div>
                    <h3 className="card-name">{c.name}</h3>
                    <div className="card-date">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className="card-avatar">
                    {c.photo ? (
                      <img src={c.photo} alt={`${c.name} avatar`} className="avatar-img" />
                    ) : (
                      <div className="avatar-empty" aria-hidden />
                    )}
                  </div>
                </div>

                <p className="card-manifesto">{c.manifesto}</p>

                <div className="card-footer">
                  <span className="badge">{c.colorIndex}</span>
                  <button
                    onClick={() => deleteCandidate(c._id)}
                    disabled={deletingId === c._id}
                    className="btn btn--outline"
                    style={{background : "#333"}}
                    aria-disabled={deletingId === c._id}
                  >
                    {deletingId === c._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
