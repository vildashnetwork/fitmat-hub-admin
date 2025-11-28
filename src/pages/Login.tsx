import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import axios from "axios";

const api = axios.create({
  baseURL: "https://faap.onrender.com",
  withCredentials: true, // <--- required if server uses credentials: true
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/admin/login", { email, password });

      if (res.status === 200) {
        toast.success(res.data?.message ?? "Logged in");
        localStorage.setItem("authtoken", res.data?.token ?? "")
        navigate("/");
        window.location.href = "/";
      } else {
        toast.error(res.data?.message ?? `Unexpected status: ${res.status}`);
      }
    } catch (err) {
      // improved error handling for axios
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error: any = err;

      if (error.response) {
        // server responded with a status (non 2xx)

        toast.error(error.response?.data?.message ?? `Server error: ${error.response.status}`);
      } else if (error.request) {
        // request made but no response received
        console.log("no response, request:", error.request);
        toast.error("Network issues no response from server");
      } else {
        // some other error during setup

        toast.error(error.message ?? "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Fitmat Campus Hub</CardTitle>
          <CardDescription>Admin Dashboard Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@fitmat.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  title="Toggle password visibility"
                  onClick={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    const pwd = document.getElementById("password") as HTMLInputElement | null;
                    if (!pwd) return;
                    if (pwd.type === "password") {
                      pwd.type = "text";
                      btn.innerText = "🙈";
                    } else {
                      pwd.type = "password";
                      btn.innerText = "👁️";
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-lg p-1"
                >
                  👁️
                </button>
              </div>

              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-sm select-none">Remember me</span>
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "loading..." : "Sign In"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
