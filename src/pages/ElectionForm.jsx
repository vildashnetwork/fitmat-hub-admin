
import React, { useState, useEffect, useMemo } from "react";
import { CalendarIcon, ClockIcon, UsersIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
// Assuming 'api' is a pre-configured axios instance or similar.
// The path might need adjustment based on your project structure.
import api from "../utils/aps.js";

// Helper component for the checkmark in candidate cards
const SelectedCheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

export default function ElectionForm({ election, candidates = [], onCreated, onUpdated, onToast }) {
  const [formData, setFormData] = useState({
    title: "",
    startAt: "",
    endAt: "",
    status: "upcoming",
    eligibility: "",
    selectedCandidates: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = useMemo(() => !!election?._id, [election]);

  // Populate form when in edit mode
  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: election.title || "",
        // Format dates for datetime-local input
        startAt: election.startAt ? new Date(election.startAt).toISOString().slice(0, 16) : "",
        endAt: election.endAt ? new Date(election.endAt).toISOString().slice(0, 16) : "",
        status: election.status || "upcoming",
        eligibility: election.eligibility || "",
        selectedCandidates: election.candidates?.map(c => c._id || c) || [],
      });
    }
  }, [election, isEditing]);

  // Real-time validation logic
  const validate = (fieldValues = formData) => {
    let tempErrors = {};
    if ("title" in fieldValues) {
      tempErrors.title = fieldValues.title.trim() ? "" : "Election title is required.";
    }
    if ("startAt" in fieldValues) {
      tempErrors.startAt = fieldValues.startAt ? "" : "Start date is required.";
    }
    if ("endAt" in fieldValues) {
      tempErrors.endAt = fieldValues.endAt ? "" : "End date is required.";
    }
    if (fieldValues.startAt && fieldValues.endAt) {
      if (new Date(fieldValues.startAt) >= new Date(fieldValues.endAt)) {
        tempErrors.endAt = "End date must be after the start date.";
      }
    }
    if ("eligibility" in fieldValues) {
      tempErrors.eligibility = fieldValues.eligibility.trim() ? "" : "Voter eligibility is required.";
    }
    if ("selectedCandidates" in fieldValues) {
      tempErrors.selectedCandidates = fieldValues.selectedCandidates.length > 0 ? "" : "At least one candidate must be selected.";
    }

    setErrors(prevErrors => ({ ...prevErrors, ...tempErrors }));
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    validate({ [id]: value });
  };

  const toggleCandidate = (candidateId) => {
    const { selectedCandidates } = formData;
    const newSelection = selectedCandidates.includes(candidateId)
      ? selectedCandidates.filter((id) => id !== candidateId)
      : [...selectedCandidates, candidateId];

    setFormData(prev => ({ ...prev, selectedCandidates: newSelection }));
    validate({ selectedCandidates: newSelection });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      startAt: "",
      endAt: "",
      status: "upcoming",
      eligibility: "",
      selectedCandidates: [],
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      onToast?.({ type: "error", text: "Please fix the errors before submitting." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
        status: formData.status,
        eligibility: formData.eligibility.trim(),
        candidates: formData.selectedCandidates,
      };

      if (isEditing) {
        const res = await api.put(`/elect/${election._id}`, payload);
        onUpdated?.(res.data);
        onToast?.({ type: "success", text: "Election updated successfully!" });
      } else {
        const res = await api.post("/elect", payload);
        onCreated?.(res.data);
        onToast?.({ type: "success", text: "Election created successfully!" });
        resetForm();
      }
    } catch (err) {
      console.error("Save error:", err);
      const errorMessage = err.response?.data?.message || "Failed to save the election.";
      onToast?.({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormInvalid = Object.values(errors).some(x => x) || !formData.title || !formData.startAt || !formData.endAt || !formData.eligibility || formData.selectedCandidates.length === 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
              {isEditing ? "Edit Election" : "Create New Election"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">Set up your election details below. Fields marked with * are required.</p>
          </div>

          <form onSuzbmit={handleSubmit} className="p-6 space-y-6 gap-1 flex-auto" noValidate>
            {/* Global ARIA Live Region for Toasts */}
            <div aria-live="polite" className="sr-only">
              {/* This is where toast messages would be announced by screen readers */}
            </div>


            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Election Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm ${errors.title ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
                placeholder="e.g. Student Council President 2025"
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><ExclamationCircleIcon className="w-4 h-4" />{errors.title}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 "
            >
              <div>
                <label htmlFor="startAt" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="startAt"
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm ${errors.startAt ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
                  required
                />
                {errors.startAt && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><ExclamationCircleIcon className="w-4 h-4" />{errors.startAt}</p>}
              </div>
              <div>
                <label htmlFor="endAt" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="endAt"
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm ${errors.endAt ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
                  required
                />
                {errors.endAt && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><ExclamationCircleIcon className="w-4 h-4" />{errors.endAt}</p>}
              </div>
            </div>

            {/* Status & Eligibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div >
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Election Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active (Live)</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label htmlFor="eligibility" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <UsersIcon className="w-4 h-4 text-gray-500" />
                  Voter Eligibility <span className="text-red-500">*</span>
                </label>
                <input
                  id="eligibility"
                  type="text"
                  value={formData.eligibility}
                  onChange={handleChange}
                  placeholder="e.g. All registered students"
                  className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm ${errors.eligibility ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
                  required
                />
                {errors.eligibility && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><ExclamationCircleIcon className="w-4 h-4" />{errors.eligibility}</p>}
              </div>
            </div>

            {/* Candidates Selection */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Candidates <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-gray-500">
                  {formData.selectedCandidates.length} selected
                </span>
              </div>
              <div className="bg-gray-50 rounded-md p-4 ring-1 ring-gray-200 min-h-[12rem] max-h-80 overflow-y-auto">
                {candidates.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                    <UsersIcon className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="font-medium">No candidates available.</p>
                    <p className="text-sm">Please add candidates before creating an election.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {candidates.map((c) => {
                      const isSelected = formData.selectedCandidates.includes(c._id);
                      return (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => toggleCandidate(c._id)}
                          className={`relative flex items-center gap-3 p-3 rounded-md text-left ring-1 ring-inset transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSelected
                            ? "bg-blue-50 ring-blue-400 shadow-sm"
                            : "bg-white ring-gray-200 hover:ring-blue-400 hover:shadow-sm"
                            }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 text-blue-600">
                              <SelectedCheckIcon className="w-5 h-5" />
                            </div>
                          )}
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {c.photo ? (
                              <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 pr-4">
                            <h4 className="text-sm font-semibold text-gray-900">{c.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">{c.manifesto || "No manifesto provided."}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.selectedCandidates && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><ExclamationCircleIcon className="w-4 h-4" />{errors.selectedCandidates}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || isFormInvalid}
                className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />}
                {isSubmitting ? "Saving..." : isEditing ? "Update Election" : "Create Election"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-6 py-2 bg-white text-sm font-medium text-gray-700 rounded-md ring-1 ring-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
