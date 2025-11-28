import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios"

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [email, setemail] = useState<string>("")
  const [name, setname] = useState<string>("")

  type AdminUser = {
    _id?: string;
    email?: string;
    name?: string;
    [key: string]: unknown;
  };

  const [user, setuser] = useState<AdminUser | null>(null)
  const [password, setpassword] = useState<string>("")


  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    const decode = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "https://faap.onrender.com/api/admin/decode/token/admin",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          const userData = response.data?.data ?? response.data;
          const normalized = userData as AdminUser;
          setuser(normalized);
          setemail(normalized?.email ?? "");
          setname(normalized?.name ?? "");
        }
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(String(error));
        }
        console.error(error);
        toast.error(error?.message ?? String(error));
      }
    };

    decode();
  }, [])

  const [loading, setLoading] = useState<boolean>(false)

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      //https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}

      const update = await axios.put(`https://faap.onrender.com/api/admin/update/${user.id}`,
        {
          username: name,
          email: email,
          password: password,
          profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}"
        }
      )
      if (update.status === 200) {
        toast.success(update.data.message)
      } else {
        toast.success(update.data.message)
      }
    } catch (error) {
      console.error(error);
      toast.error(error)
    } finally {
      setLoading(false)
    }



  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={name} onChange={(e) => setname(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={email} onChange={(e) => setemail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <Input id="email" type="password" defaultValue={password} onChange={(e) => setpassword(e.target.value)} />
            </div>


            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Administrator" disabled />
            </div>
            <Button onClick={handleSaveProfile}>{loading ? "loading.." : "Save Changes"}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Configuration</CardTitle>
            <CardDescription>Configure site-wide settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Fitmat Campus Hub" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="UTC +0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxParticipants">Max Participants Per Event</Label>
              <Input id="maxParticipants" type="number" defaultValue="50" />
            </div>
            <Button>Save Configuration</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new events and updates
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications for urgent updates
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-reports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summary reports
                </p>
              </div>
              <Switch
                id="weekly-reports"
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
