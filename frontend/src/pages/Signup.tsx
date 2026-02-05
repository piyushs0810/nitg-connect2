import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, User, Hash, Phone, Building2, Home, IdCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    contactNumber: "",
    hostel: "",
    roomNumber: "",
    batch: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { token, user } = await authAPI.signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        rollNo: formData.rollNo,
        branch: formData.branch,
        contactNumber: formData.contactNumber,
        hostel: formData.hostel,
        roomNumber: formData.roomNumber,
        batch: formData.batch,
        bloodGroup: formData.bloodGroup,
      });
      login(user, token);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="card-base p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary mb-4">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Create Account
              </h1>
              <p className="text-muted-foreground mt-2">
                Join the NIT Goa student community
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="icon-left" />
                  <Input name="name" onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>Roll Number</Label>
                  <div className="relative">
                    <Hash className="icon-left" />
                    <Input name="rollNo" onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <Label>Branch</Label>
                  <div className="relative">
                    <Building2 className="icon-left" />
                    <Input
                      name="branch"
                      placeholder="e.g. Computer Science"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>Contact Number</Label>
                  <div className="relative">
                    <Phone className="icon-left" />
                    <Input
                      name="contactNumber"
                      placeholder="e.g. +91-9876543210"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Batch</Label>
                  <div className="relative">
                    <IdCard className="icon-left" />
                    <Input name="batch" placeholder="e.g. 2021-2025" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>Hostel</Label>
                  <div className="relative">
                    <Home className="icon-left" />
                    <Input
                      name="hostel"
                      placeholder="e.g. Hostel Block A"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Room Number</Label>
                  <div className="relative">
                    <Home className="icon-left" />
                    <Input name="roomNumber" placeholder="e.g. 204" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div>
                <Label>Blood Group</Label>
                <div className="relative">
                  <IdCard className="icon-left" />
                  <Input name="bloodGroup" placeholder="e.g. O+" onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="icon-left" />
                  <Input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="icon-left" />
                  <Input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="icon-left" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}