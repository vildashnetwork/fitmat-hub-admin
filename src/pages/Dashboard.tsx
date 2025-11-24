import { Calendar, Users, TrendingUp, Activity } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getEvents, getParticipants } from "@/utils/storage";
import { useState, useEffect } from "react";

const chartData = {
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

export default function Dashboard() {
  const [events, setEvents] = useState(getEvents());
  const [participants, setParticipants] = useState(getParticipants());

  useEffect(() => {
    setEvents(getEvents());
    setParticipants(getParticipants());
  }, []);

  const totalEvents = events.length;
  const totalParticipants = participants.length;
  const upcomingMatches = events.filter((e) => e.status === "upcoming").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with Fitmat Campus Hub.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={totalEvents}
          icon={Calendar}
          trend={{ value: "12%", isPositive: true }}
          iconColor="text-primary"
        />
        <StatsCard
          title="Total Participants"
          value={totalParticipants}
          icon={Users}
          trend={{ value: "8%", isPositive: true }}
          iconColor="text-accent"
        />
        <StatsCard
          title="Upcoming Matches"
          value={upcomingMatches}
          icon={Activity}
          iconColor="text-success"
        />
        <StatsCard
          title="Growth Rate"
          value="23%"
          icon={TrendingUp}
          trend={{ value: "5%", isPositive: true }}
          iconColor="text-warning"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.eventsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants Per Event</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.participantsPerEvent}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="event" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="participants" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
