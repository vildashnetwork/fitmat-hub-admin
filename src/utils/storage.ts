import { Event, Participant } from "@/types";

// Initialize default data if not exists
export const initializeStorage = () => {
  if (!localStorage.getItem("events")) {
    localStorage.setItem("events", JSON.stringify([]));
  }
  if (!localStorage.getItem("participants")) {
    localStorage.setItem("participants", JSON.stringify([]));
  }
  if (!localStorage.getItem("votes")) {
    localStorage.setItem("votes", JSON.stringify({}));
  }
};

// Events
export const getEvents = (): Event[] => {
  return JSON.parse(localStorage.getItem("events") || "[]");
};

export const saveEvents = (events: Event[]) => {
  localStorage.setItem("events", JSON.stringify(events));
};

export const addEvent = (event: Event) => {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
};

export const updateEvent = (id: string, updatedEvent: Event) => {
  const events = getEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);
  }
};

export const deleteEvent = (id: string) => {
  const events = getEvents();
  saveEvents(events.filter((e) => e.id !== id));
};

// Participants
export const getParticipants = (): Participant[] => {
  return JSON.parse(localStorage.getItem("participants") || "[]");
};

export const saveParticipants = (participants: Participant[]) => {
  localStorage.setItem("participants", JSON.stringify(participants));
};

export const addParticipant = (participant: Participant) => {
  const participants = getParticipants();
  participants.push(participant);
  saveParticipants(participants);
};

export const updateParticipant = (id: string, updatedParticipant: Participant) => {
  const participants = getParticipants();
  const index = participants.findIndex((p) => p.id === id);
  if (index !== -1) {
    participants[index] = updatedParticipant;
    saveParticipants(participants);
  }
};

export const deleteParticipant = (id: string) => {
  const participants = getParticipants();
  saveParticipants(participants.filter((p) => p.id !== id));
};

// Votes
export const getVotes = (eventId: string): number => {
  const votes = JSON.parse(localStorage.getItem("votes") || "{}");
  return votes[eventId] || 0;
};

export const addVote = (eventId: string) => {
  const votes = JSON.parse(localStorage.getItem("votes") || "{}");
  votes[eventId] = (votes[eventId] || 0) + 1;
  localStorage.setItem("votes", JSON.stringify(votes));
};
