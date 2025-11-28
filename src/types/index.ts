// export interface Event {
//   id: string;
//   name: string;
//   date: string;
//   participants: number;
//   status: "upcoming" | "ongoing" | "completed" | "cancelled";
//   description?: string;
// }

export interface Participant {
  id: string;
  name: string;
  email: string;
  registeredEvents: number;
  status: "active" | "inactive";
  joinedDate?: string;
}
// src/types.ts
export type Odds = {
  home?: number;
  draw?: number;
  away?: number;
};

export type Score = {
  home?: number;
  away?: number;
};

export type BackendEvent = {
  _id?: string;
  tournament: string;
  homeTeam: string;
  awayTeam: string;
  startAt?: string; // string date representation
  status?: "upcoming" | "live" | "finished" | "ended";
  odds?: Odds;
  score?: Score;
  one?: string; // image URL
  two?: string; // image URL
  bg?: string; // image URL
  startingTime?: string | Date;
  endTime?: string | Date;
  duration?: string;
  isended?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
