export interface Event {
  id: string;
  name: string;
  date: string;
  participants: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  description?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  registeredEvents: number;
  status: "active" | "inactive";
  joinedDate?: string;
}
