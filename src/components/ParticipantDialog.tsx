import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addParticipant, updateParticipant } from "@/utils/storage";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Participant } from "@/types";

interface ParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant?: Participant;
  onSave: (participant: Participant) => void;
}

export function ParticipantDialog({ open, onOpenChange, participant, onSave }: ParticipantDialogProps) {
  const [formData, setFormData] = useState<Participant>({
    id: "",
    name: "",
    email: "",
    registeredEvents: 0,
    status: "active",
    joinedDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (participant) {
      setFormData(participant);
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        registeredEvents: 0,
        status: "active",
        joinedDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [participant, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (participant) {
      updateParticipant(formData.id, formData);
      toast.success("Participant updated successfully");
    } else {
      addParticipant({ ...formData, id: Date.now().toString(), joinedDate: new Date().toISOString() });
      toast.success("Participant added successfully");
    }
    
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{participant ? "Edit Participant" : "Add New Participant"}</DialogTitle>
            <DialogDescription>
              {participant ? "Update the participant details below." : "Create a new participant by filling out the form below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="registeredEvents">Registered Events</Label>
              <Input
                id="registeredEvents"
                type="number"
                value={formData.registeredEvents}
                onChange={(e) =>
                  setFormData({ ...formData, registeredEvents: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Participant["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="joinedDate">Joined Date</Label>
              <Input
                id="joinedDate"
                type="date"
                value={formData.joinedDate}
                onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{participant ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
