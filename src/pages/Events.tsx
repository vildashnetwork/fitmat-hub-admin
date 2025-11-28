// import { useState, useEffect } from "react";
// import { Plus, Search, Edit, Trash2, ThumbsUp } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Event } from "@/types";
// import { EventDialog } from "@/components/EventDialog";
// import { getEvents, deleteEvent as deleteEventStorage, addVote, getVotes } from "@/utils/storage";
// import { toast } from "sonner";

// export default function Events() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingEvent, setEditingEvent] = useState<Event | undefined>();
//   const [votes, setVotes] = useState<Record<string, number>>({});

//   useEffect(() => {
//     loadEvents();
//   }, []);

//   const loadEvents = () => {
//     const storedEvents = getEvents();
//     setEvents(storedEvents);

//     // Load votes for all events
//     const votesMap: Record<string, number> = {};
//     storedEvents.forEach((event) => {
//       votesMap[event.id] = getVotes(event.id);
//     });
//     setVotes(votesMap);
//   };

//   const filteredEvents = events.filter(
//     (event) =>
//       (statusFilter === "all" || event.status === statusFilter) &&
//       (event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         event.description?.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const handleDelete = (id: string) => {
//     deleteEventStorage(id);
//     loadEvents();
//     toast.success("Event deleted successfully");
//   };

//   const handleEdit = (event: Event) => {
//     setEditingEvent(event);
//     setDialogOpen(true);
//   };

//   const handleSave = (event: Event) => {
//     loadEvents();
//     setDialogOpen(false);
//     setEditingEvent(undefined);
//   };

//   const handleVote = (eventId: string) => {
//     addVote(eventId);
//     setVotes({ ...votes, [eventId]: (votes[eventId] || 0) + 1 });
//     toast.success("Vote added!");
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "upcoming":
//         return "bg-primary/10 text-primary border-primary/20";
//       case "ongoing":
//         return "bg-success/10 text-success border-success/20";
//       case "completed":
//         return "bg-muted text-muted-foreground border-muted";
//       case "cancelled":
//         return "bg-destructive/10 text-destructive border-destructive/20";
//       default:
//         return "bg-secondary text-secondary-foreground border-border";
//     }
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight text-foreground">Events</h2>
//           <p className="text-muted-foreground">Manage all your events and matches</p>
//         </div>
//         <Button onClick={() => setDialogOpen(true)} className="gap-2">
//           <Plus className="h-4 w-4" />
//           Add Event
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Events</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search events..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="upcoming">Upcoming</SelectItem>
//                 <SelectItem value="ongoing">Ongoing</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Event Name</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Participants</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Votes</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredEvents.map((event) => (
//                   <TableRow key={event.id}>
//                     <TableCell className="font-medium">{event.name}</TableCell>
//                     <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
//                     <TableCell>{event.participants}</TableCell>
//                     <TableCell>
//                       <Badge className={getStatusColor(event.status)} variant="outline">
//                         {event.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(event.id)}
//                           className="gap-1"
//                         >
//                           <ThumbsUp className="h-4 w-4" />
//                           {votes[event.id] || 0}
//                         </Button>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleEdit(event)}
//                           className="hover:bg-accent"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleDelete(event.id)}
//                           className="hover:bg-destructive/10 hover:text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       <EventDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         event={editingEvent}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }























// src/pages/Events.tsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { EventDialog } from "@/components/EventDialog";
import {
  fetchEvents,
  deleteEvent as deleteEventApi,
} from "@/utils/ap";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      (statusFilter === "all" || event.status === statusFilter) &&
      (event.tournament?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.homeTeam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.awayTeam?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEventApi(id);
      toast.success("Event deleted successfully");
      loadEvents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleSave = () => {
    loadEvents();
    setDialogOpen(false);
    setEditingEvent(undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/20";
      case "live":
        return "bg-success/10 text-success border-success/20";
      case "finished":
        return "bg-muted text-muted-foreground border-muted";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Events</h2>
          <p className="text-muted-foreground">Manage all your events and matches</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Home</TableHead>
                  <TableHead>Away</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.tournament}</TableCell>
                    <TableCell>{event.homeTeam}</TableCell>
                    <TableCell>{event.awayTeam}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)} variant="outline">
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(event)}
                          className="hover:bg-accent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event._id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
        onSave={handleSave}
      />
    </div>
  );
}
