import { Event, Participant } from "@/types";

export const mockEvents: Event[] = [
  {
    id: "1",
    name: "Basketball Tournament 2024",
    date: "2024-03-15",
    participants: 24,
    status: "upcoming",
    description: "Annual basketball tournament"
  },
  {
    id: "2",
    name: "Football League Match",
    date: "2024-03-10",
    participants: 32,
    status: "ongoing",
    description: "Monthly football league"
  },
  {
    id: "3",
    name: "Tennis Championship",
    date: "2024-02-28",
    participants: 16,
    status: "completed",
    description: "Spring tennis championship"
  },
  {
    id: "4",
    name: "Swimming Competition",
    date: "2024-03-20",
    participants: 18,
    status: "upcoming",
    description: "Indoor swimming competition"
  },
  {
    id: "5",
    name: "Volleyball Match",
    date: "2024-02-15",
    participants: 12,
    status: "completed",
    description: "Team volleyball match"
  },
];

export const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@fitmat.com",
    registeredEvents: 3,
    status: "active",
    joinedDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@fitmat.com",
    registeredEvents: 5,
    status: "active",
    joinedDate: "2024-01-20"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.j@fitmat.com",
    registeredEvents: 2,
    status: "active",
    joinedDate: "2024-02-01"
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@fitmat.com",
    registeredEvents: 4,
    status: "active",
    joinedDate: "2024-01-10"
  },
  {
    id: "5",
    name: "Tom Brown",
    email: "tom.b@fitmat.com",
    registeredEvents: 1,
    status: "inactive",
    joinedDate: "2023-12-15"
  },
];

export const chartData = {
  eventsOverTime: [
    { month: "Jan", events: 4 },
    { month: "Feb", events: 6 },
    { month: "Mar", events: 5 },
    { month: "Apr", events: 8 },
    { month: "May", events: 7 },
    { month: "Jun", events: 9 },
  ],
  participantsPerEvent: [
    { event: "Basketball", participants: 24 },
    { event: "Football", participants: 32 },
    { event: "Tennis", participants: 16 },
    { event: "Swimming", participants: 18 },
    { event: "Volleyball", participants: 12 },
  ],
};
