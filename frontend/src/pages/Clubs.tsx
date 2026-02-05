import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clubsAPI } from "@/lib/api";
import { PartyPopper } from "lucide-react";

type Club = {
  id: string;
  name?: string;
  president?: string;
  contact?: string | null;
  description?: string;
  leads?: string;
};

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [clubForm, setClubForm] = useState({
    name: "",
    president: "",
    contact: "",
    leads: "",
    description: "",
  });
  const [clubSubmitting, setClubSubmitting] = useState(false);
  const [clubError, setClubError] = useState<string | null>(null);
  const [clubSuccess, setClubSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await clubsAPI.getAll();
        if (!isMounted) return;
        setClubs(
          data
            .map((club: any) => ({
              id: club.id,
              name: club.name,
              president: club.president,
              contact: club.contact,
              description: club.description,
              leads: club.leads,
            }))
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        );
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Failed to load clubs", err);
        setError(err?.message || "Failed to load clubs");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClubFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setClubForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClubSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClubSubmitting(true);
    setClubError(null);
    setClubSuccess(null);
    try {
      const payload = {
        name: clubForm.name.trim(),
        president: clubForm.president.trim(),
        contact: clubForm.contact.trim() || undefined,
        description: clubForm.description.trim() || undefined,
        leads: clubForm.leads.trim() || undefined,
      };

      const created = await clubsAPI.create(payload);
      setClubs((prev) =>
        [...prev, created].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
      );
      setClubForm({ name: "", president: "", contact: "", leads: "", description: "" });
      setClubSuccess("Club registered successfully.");
    } catch (err: any) {
      console.error("Failed to register club", err);
      setClubError(err?.message || "Failed to register club");
    } finally {
      setClubSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <PartyPopper className="h-6 w-6 text-primary" /> Campus clubs
            </h1>
            <p className="text-muted-foreground text-sm">
              Browse registered clubs and register your own.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-base p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">Registered clubs</h2>
                  <p className="text-sm text-muted-foreground">
                    {clubs.length} clubs registered on campus
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading clubs…</p>
                ) : clubs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No clubs registered yet.</p>
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

            <div className="card-base p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Register a new club</h2>
              {clubError && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {clubError}
                </p>
              )}
              {clubSuccess && (
                <p className="text-xs text-emerald-600 bg-emerald-100/60 border border-emerald-200 rounded-md px-3 py-2">
                  {clubSuccess}
                </p>
              )}

              <form className="space-y-3" onSubmit={handleClubSubmit}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="club-name">Club name</Label>
                    <Input
                      id="club-name"
                      name="name"
                      value={clubForm.name}
                      onChange={handleClubFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="club-president">President</Label>
                    <Input
                      id="club-president"
                      name="president"
                      value={clubForm.president}
                      onChange={handleClubFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="club-contact">Contact (optional)</Label>
                    <Input
                      id="club-contact"
                      name="contact"
                      value={clubForm.contact}
                      onChange={handleClubFormChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="club-leads">Other leads (optional)</Label>
                    <Input
                      id="club-leads"
                      name="leads"
                      value={clubForm.leads}
                      onChange={handleClubFormChange}
                      placeholder="e.g. Secretary, Treasurer"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="club-description">Description</Label>
                  <Textarea
                    id="club-description"
                    name="description"
                    value={clubForm.description}
                    onChange={handleClubFormChange}
                    placeholder="Tell students what your club does"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={clubSubmitting}>
                  {clubSubmitting ? "Submitting…" : "Submit club"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
