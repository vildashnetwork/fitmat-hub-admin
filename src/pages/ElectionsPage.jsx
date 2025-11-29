// src/pages/ElectionsPage.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/aps.js";
import ElectionForm from "./ElectionForm";
import ElectionCard from "./ElectionCard";

export default function ElectionsPage() {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [loadingElections, setLoadingElections] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [toast, setToast] = useState(null);
  const [increase, setincrease] = useState(false)

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

  async function fetchCandidates() {
    setLoadingCandidates(true);
    try {
      const res = await api.get("/candidates/candidates");
      setCandidates(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Failed to load candidates" });
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  }

  async function fetchElections() {
    setLoadingElections(true);
    try {
      // backend may not provide GET /elect — we try; if not present we'll show empty list
      const res = await api.get("/elect");
      setElections(res.data || []);
    } catch (err) {
      console.warn("GET /elect error (maybe not implemented):", err.message || err);
      setElections([]);
    } finally {
      setLoadingElections(false);
    }
  }

  function showToast(type, text, ms = 3000) {
    setToast({ type, text });
    setTimeout(() => setToast(null), ms);
  }

  const handleCreated = (newElection) => {
    setElections((s) => [newElection, ...s]);
    showToast("success", "Election created");
  };

  const handleUpdated = (updated) => {
    setElections((s) => s.map((e) => (e._id === updated._id ? updated : e)));
    if (selectedElection && selectedElection._id === updated._id) setSelectedElection(updated);
    showToast("success", "Election updated");
  };

  const handleDeleted = (id) => {
    setElections((s) => s.filter((e) => e._id !== id));
    if (selectedElection && selectedElection._id === id) setSelectedElection(null);
    showToast("success", "Election deleted");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Election Management</h1>
          <button
            onClick={() => { fetchCandidates(); fetchElections(); }}
            className="px-4 py-2 bg-white text-sm font-medium
             text-gray-700 rounded-md border border-gray-300 
             shadow-sm hover:bg-gray-50 focus:outline-none 
             focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "

            style={
              {
                margin: "10px"
              }
            }
          >
            Refresh
          </button>
        </header>

        {toast && (
          <div
            className={`mb-6 p-4 rounded-md text-sm font-medium 
              ${toast.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
              }`}
            role="status"
          >
            {toast.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: form + candidates */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                {/* <h2 className="text-lg font-semibold text-gray-900">Create / Edit Election</h2> */}
              </div>
              <div className="p-6">
                <ElectionForm
                  candidates={candidates}
                  onCreated={handleCreated}
                  onUpdated={handleUpdated}
                  onToast={(t) => showToast(t.type, t.text)}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="py-3 px-2 text-base font-semibold text-gray-900">All Candidates</h3>
              </div>
              <div className="p-6">
                {loadingCandidates ? (
                  <p className="text-sm text-gray-500">Loading candidates...</p>
                ) : candidates.length === 0 ? (
                  <p className="text-sm text-gray-500">No candidates found.</p>
                ) : (
                  <ul className="space-y-4 max-h-80 overflow-y-auto">
                    {candidates.map((c) => (
                      <li key={c._id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {c.photo ? <img src={c.photo} alt={c.name} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {increase ? c.manifesto : c.manifesto.slice(0, 80)}
                            {c.manifesto.length > 80 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  setincrease(!increase)
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium transition-all"
                              >
                                {increase ? "....See less" : ".....See more"}
                              </button>
                            )}

                          </p>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </aside>

          {/* Right column: elections list + selected election details */}
          <main className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className=" py-3 px-4 text-lg font-semibold text-gray-900">Existing Elections</h2>
                <p className=" py-1 px-4  mt-1 text-sm text-gray-500">Manage your elections. Select one to view details.</p>
              </div>
              <div className="p-6">
                {loadingElections ? (
                  <p className="text-sm text-gray-500">Loading elections...</p>
                ) : elections.length === 0 ? (
                  <p className="text-sm text-gray-500">No elections yet. Create one to get started.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {elections.map((e) => (
                      <ElectionCard
                        key={e._id}
                        election={e}
                        onSelect={() => setSelectedElection(e)}
                        onDeleted={handleDeleted}
                        onUpdated={handleUpdated}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Election details & results */}
            {selectedElection && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <ElectionDetail election={selectedElection} candidates={candidates} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ElectionDetail component (inside same file for clarity) */
function ElectionDetail({ election, candidates }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchResults() {
    setLoading(true);
    try {
      const res = await api.get(`/vote/results/${election._id}`);
      const data = res.data || [];
      // Map candidate ids to candidate objects (if available)
      const mapped = data.map((r) => {
        const cand = candidates.find((c) => String(c._id) === String(r._id));
        return {
          candidateId: r._id,
          votes: r.votes,
          candidate: cand || null,
        };
      });
      setResults(mapped);
    } catch (err) {
      console.error("Failed to load results", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResults();
    const iv = setInterval(fetchResults, 10000); // poll every 10s while open
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [election._id]);

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(election.startAt).toLocaleString()} – {new Date(election.endAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
            </span>
            <p className="text-sm text-gray-500">Eligibility: {election.eligibility}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4">Results</h4>

        {loading ? (
          <p className="text-sm text-gray-500">Loading results...</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-gray-500">No votes yet.</p>
        ) : (
          <ul className="space-y-4">
            {results.map((r) => (
              <li key={r.candidateId} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {r.candidate?.photo ? <img src={r.candidate.photo} alt={r.candidate.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {r.candidate?.name || `Candidate (${r.candidateId.slice(0, 6)})`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {r.candidate?.manifesto?.slice(0, 80) || ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">{r.votes} votes</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}