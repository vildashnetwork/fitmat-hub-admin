// src/pages/ElectionCard.jsx
import React, { useState } from "react";
import api from "@/utils/aps.js";
import { CalendarIcon, UsersIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ElectionCard({ election, onSelect, onDeleted, onUpdated }) {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleDelete(e) {
    e.stopPropagation();
    if (!confirm("Delete this election? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/elect/${election._id}`);
      onDeleted && onDeleted(election._id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete election");
    } finally {
      setDeleting(false);
    }
  }

  async function cycleStatus(e) {
    e.stopPropagation();
    const next = election.status === "upcoming" ? "active" : election.status === "active" ? "closed" : "upcoming";
    setUpdating(true);
    try {
      const res = await api.put(`/elect/${election._id}`, { ...election, status: next });
      onUpdated && onUpdated(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  const statusColors = {
    upcoming: "bg-amber-100 text-amber-800",
    active: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const statusColor = statusColors[election.status] || "bg-gray-100 text-gray-800";

  return (
    <article
      onClick={() => onSelect && onSelect(election)}
      className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{election.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              {new Date(election.startAt).toLocaleString()} – {new Date(election.endAt).toLocaleString()}
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
          <UsersIcon className="w-4 h-4" />
          Candidates: {Array.isArray(election.candidates) ? election.candidates.length : 0} · Eligibility: {election.eligibility}
        </div>
      </div>

      <div className="border-t border-gray-200 flex items-center justify-between px-4 py-3 bg-gray-50">
        <button
          onClick={cycleStatus}
          disabled={updating}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Cycle Status"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}