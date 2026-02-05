import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  BookOpen,
  Clock,
  LayoutGrid,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { noticesAPI, lostFoundAPI, marketplaceAPI, usersAPI, clubsAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Notice = {
  id: string;
  title?: string;
  category?: string;
  createdAt?: Date;
};

type LostFoundItem = {
  id: string;
  title?: string;
  type?: "lost" | "found";
  createdAt?: Date;
};

type Listing = {
  id: string;
  title?: string;
  category?: string;
  createdAt?: Date;
};

type Person = {
  id: string;
  name?: string;
  branch?: string;
  rollNo?: string;
  roomNumber?: string;
  hostel?: string;
  contactNumber?: string;
  birthDate?: string;
};

type Club = {
  id: string;
  name?: string;
  president?: string;
  contact?: string | null;
  description?: string;
  leads?: string;
  createdAt?: string;
};

const toDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
  if (value.seconds) return new Date(value.seconds * 1000);
  return undefined;
};

const formatRelative = (date?: Date) => {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / (1000 * 60));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [lostFound, setLostFound] = useState<LostFoundItem[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [peopleSearchInput, setPeopleSearchInput] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [noticesData, lostFoundData, listingsData, usersData, clubsData] = await Promise.all([
          noticesAPI.getAll(),
          lostFoundAPI.getAll(),
          marketplaceAPI.getAll(),
          usersAPI.getAll(),
          clubsAPI.getAll(),
        ]);

        if (!isMounted) return;

        setNotices(
          noticesData
            .map((notice: any) => ({
              id: notice.id,
              title: notice.title,
              category: notice.category,
              createdAt: toDate(notice.createdAt),
            }))
            .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
            .slice(0, 5)
        );

        setLostFound(
          lostFoundData
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              type: item.type,
              createdAt: toDate(item.createdAt),
            }))
            .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
            .slice(0, 5)
        );

        setListings(
          listingsData
            .map((listing: any) => ({
              id: listing.id,
              title: listing.title,
              category: listing.category,
              createdAt: toDate(listing.createdAt),
            }))
            .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
            .slice(0, 4)
        );

        setPeople(
          usersData
            .map((person: any) => ({
              id: person.id,
              name: person.name,
              branch: person.branch,
              rollNo: person.rollNo,
              roomNumber: person.roomNumber,
              hostel: person.hostel,
              contactNumber: person.contactNumber,
              birthDate: person.birthDate,
            }))
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        );

        setClubs(
          clubsData
            .map((club: any) => ({
              id: club.id,
              name: club.name,
              president: club.president,
              contact: club.contact,
              description: club.description,
              leads: club.leads,
              createdAt: club.createdAt,
            }))
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        );
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Failed to load dashboard data", err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Active notices",
        value: notices.length,
        icon: Bell,
        accent: "bg-primary/10 text-primary",
      },
      {
        label: "Lost & Found",
        value: lostFound.length,
        icon: Search,
        accent: "bg-amber-100 text-amber-700",
      },
      {
        label: "Marketplace",
        value: listings.length,
        icon: TrendingUp,
        accent: "bg-emerald-100 text-emerald-700",
      },
    ],
    [lostFound.length, listings.length, notices.length]
  );

  const displayName = user?.name ?? "Student";

  const handlePeopleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPeopleSearchInput(event.target.value);
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom space-y-8">
          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="card-base p-6 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">Dashboard</p>
                  <h1 className="mt-2 text-3xl font-bold text-foreground">
                    Welcome back, {displayName}!
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Here's a quick snapshot of what's happening across campus today.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/notices">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Browse notices
                    </Button>
                  </Link>
                  <Link to="/marketplace">
                    <Button size="sm" className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Visit marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="card-base p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <LayoutGrid className="h-4 w-4" /> Quick stats
              </div>
              <div className="grid gap-3">
                {stats.map(({ label, value, icon: Icon, accent }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${accent}`}>
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-xl font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="card-base p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Latest notices</h3>
                <Link to="/notices" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading notices…</p>
              ) : notices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notices yet.</p>
              ) : (
                <ul className="space-y-4">
                  {notices.map((notice) => (
                    <li key={notice.id} className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{notice.title ?? "Untitled"}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {notice.category && <span className="badge-primary">{notice.category}</span>}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelative(notice.createdAt) || "—"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card-base p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Lost &amp; Found</h3>
                <Link to="/lost-found" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading items…</p>
              ) : lostFound.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items reported yet.</p>
              ) : (
                <ul className="space-y-4">
                  {lostFound.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          item.type === "found" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        <Search className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title ?? "Untitled"}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className={`badge ${item.type === "found" ? "badge-success" : "badge-danger"}`}>
                            {item.type === "found" ? "Found" : "Lost"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelative(item.createdAt) || "—"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/lost-found">
                <Button variant="outline" className="w-full">
                  Report an item
                </Button>
              </Link>
            </div>
          </section>

          <section className="card-base p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Marketplace highlights</h3>
              <Link to="/marketplace" className="text-sm text-primary hover:underline">
                View marketplace
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading listings…</p>
            ) : listings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No listings available yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {listings.map((listing) => (
                  <div key={listing.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge-primary">{listing.category ?? "General"}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(listing.createdAt) || "—"}
                      </span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-foreground line-clamp-2">
                      {listing.title ?? "Untitled listing"}
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div id="people-search" className="card-base p-6 space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> People search
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {people.length} students registered
                  </p>
                </div>
              </div>
              <Input
                placeholder="Search by name, branch, roll number, or room"
                value={peopleSearchInput}
                onChange={handlePeopleSearchChange}
              />
            </div>

            <div id="clubs" className="card-base p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Campus clubs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {clubs.length} clubs registered on campus
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading clubs…</p>
                ) : clubs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No clubs registered yet. Be the first!</p>
                ) : (
                  clubs.map((club) => (
                    <div key={club.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{club.name ?? "Unnamed club"}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            President: {club.president ?? "—"}
                          </p>
                        </div>
                        {club.contact && (
                          <span className="text-xs text-muted-foreground">{club.contact}</span>
                        )}
                      </div>
                      {club.leads && (
                        <p className="mt-2 text-xs text-muted-foreground">Leads: {club.leads}</p>
                      )}
                      {club.description && (
                        <p className="mt-2 text-xs text-muted-foreground">{club.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
