// // src/pages/Requests.jsx
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
//                 <div
//                     key={t.id}
//                     className={`rounded-md px-4 py-2 shadow ${t.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
//                 >
//                     {t.text}
//                 </div>
//             ))}
//         </div>
//     );
//     return { push, Toasts };
// }

// export default function Requests() {
//     const { push, Toasts } = useToast();
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [approvingId, setApprovingId] = useState(null);

//     async function fetchRequests() {
//         setLoading(true);
//         try {
//             const res = await api.get("/candidates/requests");
//             // server returns array (your router uses /requests)
//             setRequests(res.data || res.data.request || []);
//         } catch (err) {
//             console.error(err);
//             push("Failed to fetch requests", "error");
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchRequests();
//     }, []);

//     async function approveRequest(id) {
//         if (!confirm("Approve this request and create candidate?")) return;
//         setApprovingId(id);
//         try {
//             await api.post(`/candidates/requests/${id}/approve`);
//             push("Request approved");
//             // update requests list locally (mark approved)
//             setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, approved: true } : r)));
//         } catch (err) {
//             console.error(err);
//             push(err?.response?.data?.error || "Failed to approve", "error");
//         } finally {
//             setApprovingId(null);
//         }
//     }

//     return (
//         <div>
//             <Toasts />
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold">Candidate Requests</h2>
//                 <button onClick={fetchRequests} className="px-3 py-2 rounded-md border hover:bg-gray-100">Refresh</button>
//             </div>

//             {loading ? (
//                 <div className="text-center py-12">Loading...</div>
//             ) : requests.length === 0 ? (
//                 <div className="text-center py-12 text-gray-500">No requests yet.</div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {requests.map((r) => (
//                         <article key={r._id} className="bg-white rounded-2xl shadow p-4 border">
//                             <div className="h-36 w-full bg-gray-100 rounded overflow-hidden mb-4">
//                                 {r.bg ? <img src={r.bg} alt="bg" className="w-full h-full object-cover" /> : null}
//                             </div>

//                             <div className="flex items-start gap-4">
//                                 <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow">
//                                     {r.photo ? <img src={r.photo} alt={r.name} className="w-full h-full object-cover" /> : <div className="bg-gray-200 w-full h-full" />}
//                                 </div>

//                                 <div className="flex-1">
//                                     <h3 className="text-lg font-semibold">{r.name}</h3>
//                                     <div className="text-xs text-gray-500">{r.email}</div>
//                                     <p className="mt-2 text-sm text-gray-700">{r.manifesto}</p>

//                                     <div className="mt-3 flex items-center justify-between">
//                                         <div className="flex items-center gap-2">
//                                             <span className={`px-2 py-1 rounded-full text-sm ${r.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
//                                                 {r.approved ? "Approved" : "Pending"}
//                                             </span>
//                                             <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
//                                         </div>

//                                         <div className="flex gap-2">
//                                             {!r.approved && (
//                                                 <button
//                                                     onClick={() => approveRequest(r._id)}
//                                                     disabled={approvingId === r._id}
//                                                     className="px-3 py-1 rounded-md bg-wood text-white"
//                                                 >
//                                                     {approvingId === r._id ? "Approving..." : "Approve"}
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* team */}
//                             {r.aboutyourteam && r.aboutyourteam.length > 0 && (
//                                 <div className="mt-4 border-t pt-3 space-y-3">
//                                     <h4 className="font-semibold text-sm">Team</h4>
//                                     {r.aboutyourteam.map((m, i) => (
//                                         <div key={i} className="flex items-center gap-3">
//                                             <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
//                                                 {m.memberPhoto ? <img src={m.memberPhoto} alt={m.memberName} className="w-full h-full object-cover" /> : null}
//                                             </div>
//                                             <div>
//                                                 <div className="text-sm font-medium">{m.memberName}</div>
//                                                 <div className="text-xs text-gray-500">{m.memberRole}</div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </article>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }













// src/pages/Requests.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import api from "@/utils/aps.js";
import "./Requests.css";

/* ---------- small toast hook ---------- */
function useToast() {
    const [toasts, setToasts] = useState([]);
    useEffect(() => {
        if (!toasts.length) return;
        const t = setTimeout(() => setToasts((s) => s.slice(1)), 3500);
        return () => clearTimeout(t);
    }, [toasts]);
    const push = (text, type = "info") =>
        setToasts((s) => [...s, { id: Date.now() + Math.random(), text, type }]);
    const Toasts = () => (
        <div id="toasts">
            {toasts.map((t) => (
                <div key={t.id} id={`toast-${t.id}`} data-type={t.type}>
                    {t.text}
                </div>
            ))}
        </div>
    );
    return { push, Toasts };
}

/* ---------- TeamCarousel component (per-card) ---------- */
function TeamCarousel({ team = [], uid = "" }) {
    const containerRef = useRef(null);
    const pointer = useRef({ active: false, startX: 0, lastX: 0, scrollStart: 0 });
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    // update nav button state
    const updateNav = () => {
        const el = containerRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 5);
        setCanNext(el.scrollLeft + el.clientWidth + 5 < el.scrollWidth);
    };

    useEffect(() => {
        updateNav();
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => updateNav();
        const onResize = () => updateNav();
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [team.length]);

    // scroll by a page (78% of container width)
    const scrollByPage = (dir = 1) => {
        const el = containerRef.current;
        if (!el) return;
        const amount = Math.round(el.clientWidth * 0.78) * dir;
        el.scrollBy({ left: amount, behavior: "smooth" });
    };

    // pointer/touch handlers
    const onPointerDown = (e) => {
        const el = containerRef.current;
        if (!el) return;
        pointer.current.active = true;
        pointer.current.startX = (e.clientX ?? e.touches?.[0]?.clientX) || 0;
        pointer.current.lastX = pointer.current.startX;
        pointer.current.scrollStart = el.scrollLeft;
        if (e.pointerId && el.setPointerCapture) {
            try { el.setPointerCapture(e.pointerId); } catch { }
        }
    };

    const onPointerMove = (e) => {
        if (!pointer.current.active) return;
        const el = containerRef.current;
        if (!el) return;
        const x = (e.clientX ?? e.touches?.[0]?.clientX) || pointer.current.lastX;
        const dx = x - pointer.current.lastX;
        pointer.current.lastX = x;
        el.scrollLeft -= dx;
    };

    const snapToClosest = () => {
        const el = containerRef.current;
        if (!el) return;
        const children = Array.from(el.children);
        if (!children.length) return;
        const scrollCenter = el.scrollLeft + el.clientWidth / 2;
        let closest = children[0];
        let minDist = Infinity;
        for (const c of children) {
            const cLeft = c.offsetLeft + c.offsetWidth / 2;
            const dist = Math.abs(cLeft - scrollCenter);
            if (dist < minDist) {
                minDist = dist;
                closest = c;
            }
        }
        const target = Math.max(0, closest.offsetLeft - (el.clientWidth - closest.offsetWidth) / 2);
        el.scrollTo({ left: target, behavior: "smooth" });
    };

    const onPointerUp = (e) => {
        if (!pointer.current.active) return;
        pointer.current.active = false;
        const el = containerRef.current;
        if (!el) return;
        const clientX = (e.clientX ?? (e.changedTouches?.[0]?.clientX || pointer.current.lastX)) || pointer.current.lastX;
        const dxTotal = clientX - pointer.current.startX;
        const threshold = 40;
        if (dxTotal < -threshold) scrollByPage(+1);
        else if (dxTotal > threshold) scrollByPage(-1);
        else snapToClosest();
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); scrollByPage(-1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); scrollByPage(+1); }
        else if (e.key === "Home") containerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
        else if (e.key === "End") containerRef.current?.scrollTo({ left: containerRef.current.scrollWidth, behavior: "smooth" });
    };

    return (
        <div className="team-carousel-wrapper">
            <button
                aria-label="Previous"
                onClick={() => scrollByPage(-1)}
                disabled={!canPrev}
                className={`team-arrow left ${canPrev ? "enabled" : "disabled"}`}
            >
                ‹
            </button>

            <div
                ref={containerRef}
                className="slide"
                role="list"
                aria-label="Team members"
                tabIndex={0}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onTouchStart={(e) => onPointerDown(e)}
                onTouchMove={(e) => onPointerMove(e)}
                onTouchEnd={(e) => onPointerUp(e)}
            >
                {team.length === 0 ? (
                    <div className="team-empty">No team members</div>
                ) : (
                    team.map((m, i) => (
                        <div key={`${uid}-${i}`} className="team-member" role="listitem" aria-label={m.memberName || `member-${i}`}>
                            <div className="tm-photo">
                                {m.memberPhoto ? <img src={m.memberPhoto} alt={m.memberName} /> : <div className="tm-photo-placeholder">No photo</div>}
                            </div>
                            <div className="tm-info">
                                <div className="tm-name">{m.memberName}</div>
                                <div className="tm-role muted small">{m.memberRole} • {m.Info}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                aria-label="Next"
                onClick={() => scrollByPage(+1)}
                disabled={!canNext}
                className={`team-arrow right ${canNext ? "enabled" : "disabled"}`}
            >

            </button>

            <div className="mobile-arrows">
                <button onClick={() => scrollByPage(-1)} className="mobile-btn">Prev</button>
                <button onClick={() => scrollByPage(+1)} className="mobile-btn">Next</button>
            </div>
        </div>
    );
}

/* ---------- Main Requests page ---------- */
export default function Requests() {
    const { push, Toasts } = useToast();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);

    async function fetchRequests() {
        setLoading(true);
        try {
            const res = await api.get("/candidates/requests");
            const data = Array.isArray(res.data) ? res.data : res.data.request ? res.data.request : res.data;
            setRequests(data || []);
        } catch (err) {
            console.error(err);
            push("Failed to fetch requests", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function approveRequest(id) {
        if (!confirm("Approve this request and create candidate?")) return;
        setApprovingId(id);
        try {
            await api.post(`/candidates/requests/${id}/approve`);
            push("Request approved");
            setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, approved: true } : r)));
        } catch (err) {
            console.error(err);
            push(err?.response?.data?.error || "Failed to approve", "error");
        } finally {
            setApprovingId(null);
        }
    }

    const grid = useMemo(() => requests || [], [requests]);

    return (
        <div id="requests-root">
            <Toasts />
            <div id="header">
                <h2 id="title">Candidate Requests</h2>
                <button id="refresh-btn" onClick={fetchRequests}>Refresh</button>
            </div>

            {loading ? (
                <div id="loading">Loading...</div>
            ) : grid.length === 0 ? (
                <div id="empty">No requests yet.</div>
            ) : (
                <div id="requests-grid">
                    {grid.map((r) => (
                        <article key={r._id} id={`request-${r._id}`} style={{background: `${r.color}`}} className="request-card">
                            <div id={`bg-${r._id}`} className="background-wrapper">
                                {r.bg ? <img src={r.bg} alt="bg" id={`bgimg-${r._id}`} /> : null}
                            </div>

                            <div id={`row-${r._id}`} className="row">
                                <div id={`photo-${r._id}`} className="photo-wrap">
                                    {r.photo ? <img src={r.photo} alt={r.name} id={`avatar-${r._id}`} /> : <div id={`avatar-placeholder-${r._id}`} />}
                                </div>

                                <div id={`info-${r._id}`} className="info">
                                    <h3 id={`name-${r._id}`}>{r.name}</h3>
                                    <div id={`email-${r._id}`} className="muted">{r.email}</div>
                                    <p id={`manifesto-${r._id}`} className="manifesto">{r.manifesto}</p>

                                    <div id={`meta-${r._id}`} className="meta">
                                        <div className="left">
                                            <span id={`status-${r._id}`} data-approved={r.approved ? "true" : "false"}>
                                                {r.approved ? "Approved" : "Pending"}
                                            </span>
                                            <div id={`created-${r._id}`} className="muted small">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</div>
                                        </div>

                                        <div className="right">
                                            {!r.approved && (
                                                <button id={`approve-${r._id}`} onClick={() => approveRequest(r._id)} disabled={approvingId === r._id}>
                                                    {approvingId === r._id ? "Approving..." : "Approve"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team carousel */}
                            {r.aboutyourteam && r.aboutyourteam.length > 0 && (
                                <div id={`team-${r._id}`} className="team">
                                    <TeamCarousel team={r.aboutyourteam} uid={r._id} />
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
