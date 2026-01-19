import { Layout } from "@/components/layout/Layout";
import { QuickAccessCard } from "@/components/ui/QuickAccessCard";
import { Search, IdCard, Bell, ShoppingBag, Calendar, BookOpen, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Lost & Found",
    description: "Report or search for lost items",
    icon: Search,
    href: "/lost-found",
    color: "warning" as const,
  },
  {
    title: "Web ID Card",
    description: "View your digital student ID",
    icon: IdCard,
    href: "/web-id",
    color: "primary" as const,
  },
  {
    title: "Campus Notices",
    description: "Academic & hostel announcements",
    icon: Bell,
    href: "/notices",
    color: "success" as const,
  },
  {
    title: "Marketplace",
    description: "Buy & sell with students",
    icon: ShoppingBag,
    href: "/marketplace",
    color: "accent" as const,
  },
];

const recentNotices = [
  { id: 1, title: "Mid-semester examination schedule released", category: "Academic", time: "2 hours ago" },
  { id: 2, title: "Hostel maintenance work on Sunday", category: "Hostel", time: "5 hours ago" },
  { id: 3, title: "Technical fest registration open", category: "Clubs", time: "1 day ago" },
];

const recentItems = [
  { id: 1, title: "Blue Umbrella found near Library", type: "found", time: "3 hours ago" },
  { id: 2, title: "Calculator lost in LH-3", type: "lost", time: "6 hours ago" },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back, Student!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening on campus today</p>
              </div>
              <Link to="/web-id">
                <Button variant="outline" className="gap-2">
                  <IdCard className="h-4 w-4" />
                  View Web ID
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-base p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">New Notices</p>
                </div>
              </div>
            </div>
            <div className="card-base p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <p className="text-xs text-muted-foreground">Lost Items</p>
                </div>
              </div>
            </div>
            <div className="card-base p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">28</p>
                  <p className="text-xs text-muted-foreground">Marketplace</p>
                </div>
              </div>
            </div>
            <div className="card-base p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="mb-8">
            <h2 className="section-title">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <QuickAccessCard key={service.title} {...service} />
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Notices */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Recent Notices</h3>
                <Link to="/notices" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="flex gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{notice.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="badge-primary">{notice.category}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notice.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Lost & Found */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Lost & Found</h3>
                <Link to="/lost-found" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                      item.type === "found" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      <Search className={`h-5 w-5 ${item.type === "found" ? "text-green-700" : "text-red-700"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={item.type === "found" ? "badge-success" : "badge-danger"}>
                          {item.type === "found" ? "Found" : "Lost"}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/lost-found">
                <Button variant="outline" className="w-full mt-4">
                  Report an Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
