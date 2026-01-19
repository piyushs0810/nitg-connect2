import { Layout } from "@/components/layout/Layout";
import { QuickAccessCard } from "@/components/ui/QuickAccessCard";
import { Search, IdCard, Bell, ShoppingBag, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const quickAccessItems = [
  {
    title: "Lost & Found",
    description: "Report or find lost items on campus",
    icon: Search,
    href: "/lost-found",
    color: "warning" as const,
  },
  {
    title: "Web ID Card",
    description: "Access your digital student ID",
    icon: IdCard,
    href: "/web-id",
    color: "primary" as const,
  },
  {
    title: "Notices",
    description: "Stay updated with campus announcements",
    icon: Bell,
    href: "/notices",
    color: "success" as const,
  },
  {
    title: "Buy & Sell",
    description: "Student marketplace for books & more",
    icon: ShoppingBag,
    href: "/marketplace",
    color: "accent" as const,
  },
];

const stats = [
  { label: "Active Students", value: "1,200+" },
  { label: "Items Found", value: "50+" },
  { label: "Marketplace Listings", value: "100+" },
  { label: "Daily Notices", value: "15+" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Student Utility Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Everything you need at{" "}
              <span className="text-primary">NIT Goa</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your one-stop destination for campus services. Access your ID, find lost items,
              check notices, and connect with fellow students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Quick Access
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Jump straight to the services you need most
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessItems.map((item) => (
              <QuickAccessCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Built for Students, by Students
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IdCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Digital Web ID</h3>
                    <p className="text-sm text-muted-foreground">
                      Access your student ID anytime, anywhere. No more forgetting your physical card.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Real-time Notices</h3>
                    <p className="text-sm text-muted-foreground">
                      Never miss important announcements from academics, hostels, or clubs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Student Marketplace</h3>
                    <p className="text-sm text-muted-foreground">
                      Buy and sell textbooks, electronics, and more within the campus community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12">
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Join the Community</p>
                    <p className="text-sm text-muted-foreground">1,200+ students already on board</p>
                  </div>
                </div>
                <Link to="/signup">
                  <Button className="w-full">Create Your Account</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
