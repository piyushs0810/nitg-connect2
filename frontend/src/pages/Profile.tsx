import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Mail, User, IdCard, LogOut, Phone, Building2, Home } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom max-w-3xl">
          <Card className="card-base">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16 text-lg">
                <AvatarFallback>{initials || <User className="h-6 w-6" />}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.name ?? "Student"}</CardTitle>
                <p className="text-muted-foreground">Manage your campus profile and account</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email ?? "Email not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.contactNumber ?? "Contact not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>Roll No: {user?.rollNo ?? "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.branch ?? "Branch not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.batch ?? "Batch not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.bloodGroup ?? "Blood group not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.hostel ?? "Hostel not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.roomNumber ?? "Room not provided"}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={logout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
