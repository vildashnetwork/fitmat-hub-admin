import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const { admin: currentAdmin } = useAuth();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const storedAdmins = localStorage.getItem("admins");
    if (storedAdmins) {
      setAdmins(JSON.parse(storedAdmins));
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");
    const passwords = JSON.parse(localStorage.getItem("adminPasswords") || "{}");
    
    // Check if email already exists
    if (admins.find((a: Admin) => a.email === newAdmin.email)) {
      toast.error("Admin with this email already exists");
      return;
    }
    
    const admin: Admin = {
      id: Date.now().toString(),
      email: newAdmin.email,
      name: newAdmin.name,
      createdAt: new Date().toISOString(),
    };
    
    admins.push(admin);
    passwords[newAdmin.email] = newAdmin.password;
    
    localStorage.setItem("admins", JSON.stringify(admins));
    localStorage.setItem("adminPasswords", JSON.stringify(passwords));
    
    loadAdmins();
    setDialogOpen(false);
    setNewAdmin({ name: "", email: "", password: "" });
    toast.success("Admin added successfully");
  };

  const handleDelete = (id: string) => {
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");
    const adminToDelete = admins.find((a: Admin) => a.id === id);
    
    if (admins.length === 1) {
      toast.error("Cannot delete the last admin");
      return;
    }
    
    if (adminToDelete?.id === currentAdmin?.id) {
      toast.error("Cannot delete your own account");
      return;
    }
    
    const passwords = JSON.parse(localStorage.getItem("adminPasswords") || "{}");
    delete passwords[adminToDelete.email];
    
    const updatedAdmins = admins.filter((a: Admin) => a.id !== id);
    localStorage.setItem("admins", JSON.stringify(updatedAdmins));
    localStorage.setItem("adminPasswords", JSON.stringify(passwords));
    
    loadAdmins();
    toast.success("Admin deleted successfully");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Admins</h2>
          <p className="text-muted-foreground">Manage administrator accounts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>Create a new administrator account</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Admin</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Administrators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(admin.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        disabled={admin.id === currentAdmin?.id || admins.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
