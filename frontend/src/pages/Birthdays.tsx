import { useEffect, useMemo, useState, ChangeEvent } from "react";

import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { birthdaysAPI } from "@/lib/api";
import { Cake } from "lucide-react";

type Person = {
  id: string;
  name?: string;
  branch?: string;
  rollNo?: string;
  birthDate?: string;
};

const parseBirthDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const getNextBirthdayTimestamp = (value?: string) => {
  const birthDate = parseBirthDate(value);
  if (!birthDate) return Number.POSITIVE_INFINITY;
  const now = new Date();
  const next = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next.getTime() < now.getTime()) {
    next.setFullYear(next.getFullYear() + 1);
  }
  return next.getTime();
};

const daysUntilBirthday = (value?: string) => {
  const timestamp = getNextBirthdayTimestamp(value);
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24)));
};

const formatBirthday = (value?: string) => {
  const birthDate = parseBirthDate(value);
  if (!birthDate) return "—";
  return birthDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function Birthdays() {
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
        const data = await birthdaysAPI.getAll();
        if (!isMounted) return;
        setPeople(
          data
            .map((person: any) => ({
              id: person.id,
              name: person.name,
              branch: person.branch,
              rollNo: person.rollNo,
              birthDate: person.birthDate,
            }))
            .sort((a, b) => (a.birthDate ?? "").localeCompare(b.birthDate ?? ""))
        );
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Failed to load birthdays", err);
        setError(err?.message || "Failed to load birthdays");
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

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return people;
    return people.filter((person) => {
      const name = person.name?.toLowerCase() ?? "";
      const branch = person.branch?.toLowerCase() ?? "";
      const rollNo = person.rollNo?.toLowerCase() ?? "";
      return name.includes(value) || branch.includes(value) || rollNo.includes(value);
    });
  }, [people, query]);

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Cake className="h-6 w-6 text-pink-600" /> Upcoming birthdays
            </h1>
            <p className="text-muted-foreground text-sm">
              See upcoming birthdays and search by name, branch, or roll number.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="card-base p-4 space-y-4">
            <Input
              placeholder="Search birthdays by name, branch, or roll number"
              value={query}
              onChange={handleQueryChange}
            />

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading birthdays…</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming birthdays found.</p>
              ) : (
                filtered.map((person) => {
                  const days = daysUntilBirthday(person.birthDate);
                  return (
                    <div key={person.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{person.name ?? "Unnamed"}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            {person.branch && <span className="badge-primary">{person.branch}</span>}
                            {person.rollNo && <span className="badge">{person.rollNo}</span>}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p className="font-semibold text-foreground">{formatBirthday(person.birthDate)}</p>
                          {days != null && <p>{days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"}`}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
