import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setToken, getUser, setUser } from "@/utils/auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Validation
  if (!username || !email || !password || !phone) {
    setError("All fields are required");
    return;
  }
  if (!/^[A-Za-z ]+$/.test(username)) {
    setError("Username must only contain letters and spaces");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Invalid email format");
    return;
  }
  const phoneRegex = /^\+?\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    setError("Invalid phone number format");
    return;
  }
  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {
    // 1️⃣ Register user
    const res = await fetch("https://foodiebackend-ru76.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, address, phone, password }),
    });
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data.user));

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    // 2️⃣ Auto-login after registration
    const loginRes = await fetch("https://foodiebackend-ru76.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const loginData = await loginRes.json();

    if (loginRes.ok && loginData.token && loginData.user) {
      setToken(loginData.token);

      // Redirect based on role
      if (loginData.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } else {
      setError(loginData.error || "Login failed after registration");
    }
  } catch (err) {
    setError("Server error, try again later");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Finland"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Register</Button>
            <Link to="/login" className="block w-full space-y-2">
              Already have an account? <b>Login here!</b>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
