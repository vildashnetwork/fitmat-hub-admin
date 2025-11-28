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
import axios from "axios";

interface Admin {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "" });
  const { admin: currentAdmin } = useAuth();

  useEffect(() => {
    loadAdmins();
  }, []);
  const [loadingadmins, setloadadmins] = useState<boolean>(false)
  const loadAdmins = async () => {
    try {
      setloadadmins(true)
      const res = await axios.get("https://faap.onrender.com/api/admin/allowners")
      if (res.status === 200) {
        setAdmins(res.data.owners);
      }
    } catch (error: any) {
      toast.error(error?.message || String(error));
    } finally {
      setloadadmins(false)
    }
  };
  const [loading, setloading] = useState<boolean>(false);
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      setloading(true)
      const res = await axios.post("https://faap.onrender.com/api/admin/register",
        {
          username: newAdmin.username,
          email: newAdmin.email,
          password: newAdmin.password
        }
      );
      if (res.status === 201) {
        toast.success(res.data?.message || res.data || "Admin added");
        setDialogOpen(false);
        setNewAdmin({ username: "", email: "", password: "" });
        loadAdmins();
      } else {
        toast.error(res.data?.message || "Failed to add admin");
      }
    } catch (error: any) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      toast.error(error?.message || String(error));
    } finally {
      setloading(false)
    }


  };

  const handleDelete = async (id: string) => {
    try {
      const del = await axios.delete(`https://faap.onrender.com/api/admin/delete/${id}`);
      if (del.status === 200) {
        toast.success(del.data?.message || "Admin deleted");
        loadAdmins();
      } else {
        toast.error(del.data?.message || "Failed to delete admin");
      }

    } catch (error: any) {
      toast.error(error)
    }
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
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
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
              <Button type="submit" className="w-full">{loading ? "loading...." : "Add Admin"}</Button>
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
                {loadingadmins && <TableRow className="center flex justify-center align-bottom ">loading admins...</TableRow>}
                {admins.map((admin) => (
                  <TableRow key={admin.id}>


                    <TableCell className="font-medium">{admin?.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(admin.id)}
                        className="hover:bg-destructive/10 hover:text-destructive pointer"
                        disabled={false}
                      // disabled={admin.id === currentAdmin?.id || admins.length === 1}
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
