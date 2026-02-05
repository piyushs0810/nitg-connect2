import { useEffect, useMemo, useState, ChangeEvent } from "react";

import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { usersAPI } from "@/lib/api";
import { Users } from "lucide-react";

type Person = {
  id: string;
  name?: string;
  branch?: string;
  rollNo?: string;
  roomNumber?: string;
  hostel?: string;
  contactNumber?: string;
};

export default function PeopleSearch() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await usersAPI.getAll();
        if (!isMounted) return;
        setPeople(
          data
            .map((person: any) => ({
              id: person.id,
              name: person.name,
              branch: person.branch,
              rollNo: person.rollNo,
              roomNumber: person.roomNumber,
              hostel: person.hostel,
              contactNumber: person.contactNumber,
            }))
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        );
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Failed to load people", err);
        setError(err?.message || "Failed to load people");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return people;
    return people.filter((person) => {
      const name = person.name?.toLowerCase() ?? "";
      const branch = person.branch?.toLowerCase() ?? "";
      const rollNo = person.rollNo?.toLowerCase() ?? "";
      const room = person.roomNumber?.toLowerCase() ?? "";
      const hostel = person.hostel?.toLowerCase() ?? "";
      return (
        name.includes(value) ||
        branch.includes(value) ||
        rollNo.includes(value) ||
        room.includes(value) ||
        hostel.includes(value)
      );
    });
  }, [people, query]);

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> People search
            </h1>
            <p className="text-muted-foreground text-sm">
              Search students by name, branch, roll number, hostel, or room.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="card-base p-4 space-y-4">
            <Input
              placeholder="Search by name, branch, roll number, hostel, or room"
              value={query}
              onChange={handleQueryChange}
            />

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading people directory…</p>
              ) : filteredPeople.length === 0 ? (
                <p className="text-sm text-muted-foreground">No matching students found.</p>
              ) : (
                filteredPeople.map((person) => (
                  <div key={person.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{person.name ?? "Unnamed"}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {person.branch && <span className="badge-primary">{person.branch}</span>}
                          {person.rollNo && <span className="badge">Roll: {person.rollNo}</span>}
                        </div>
                      </div>
                      {person.hostel && (
                        <span className="text-xs text-muted-foreground text-right">
                          {person.hostel}
                          {person.roomNumber ? ` • ${person.roomNumber}` : ""}
                        </span>
                      )}
                    </div>
                    {person.contactNumber && (
                      <p className="mt-2 text-xs text-muted-foreground">Contact: {person.contactNumber}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
