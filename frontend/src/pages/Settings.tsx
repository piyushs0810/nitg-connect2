import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usersAPI } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Undo2 } from "lucide-react";

const editableFields = [
  { name: "name", label: "Full name", placeholder: "e.g. Priya Sharma" },
  { name: "rollNo", label: "Roll number", placeholder: "e.g. B21CS001" },
  { name: "branch", label: "Branch", placeholder: "e.g. Computer Science" },
  { name: "batch", label: "Batch", placeholder: "e.g. 2021" },
  { name: "bloodGroup", label: "Blood group", placeholder: "e.g. B+" },
  { name: "contactNumber", label: "Contact number", placeholder: "e.g. +91 98765 43210" },
  { name: "hostel", label: "Hostel", placeholder: "e.g. Block A" },
  { name: "roomNumber", label: "Room number", placeholder: "e.g. 205" },
  { name: "birthDate", label: "Birth date", placeholder: "YYYY-MM-DD" },
] as const;

type EditableFieldName = (typeof editableFields)[number]["name"];

type EditableFormState = {
  [key in EditableFieldName]: string;
};

const createInitialFormState = (user: Record<string, unknown> | null): EditableFormState => ({
  name: (user?.name as string) ?? "",
  rollNo: (user?.rollNo as string) ?? "",
  branch: (user?.branch as string) ?? "",
  batch: (user?.batch as string) ?? "",
  bloodGroup: (user?.bloodGroup as string) ?? "",
  contactNumber: (user?.contactNumber as string) ?? "",
  hostel: (user?.hostel as string) ?? "",
  roomNumber: (user?.roomNumber as string) ?? "",
  birthDate: (user?.birthDate as string) ?? "",
});

export default function Settings() {
  const navigate = useNavigate();
  const { user, refresh, isAuthenticated } = useAuth();

  const [formState, setFormState] = useState<EditableFormState>(() => createInitialFormState(user));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormState(createInitialFormState(user));
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return editableFields.some(({ name }) => {
      const currentValue = (user?.[name] as string | undefined) ?? "";
      return (formState[name] ?? "") !== currentValue;
    });
  }, [formState, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field: EditableFieldName, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormState(createInitialFormState(user));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.uid) {
      toast({
        title: "Unable to update profile",
        description: "Missing user identifier. Please re-login and try again.",
        variant: "destructive",
      });
      return;
    }

    const userId = user.uid;

    const payload: Partial<EditableFormState> = {};
    editableFields.forEach(({ name }) => {
      payload[name] = formState[name]?.trim() ?? "";
    });

    setSubmitting(true);
    try {
      const updated = await usersAPI.update(userId, payload);

      const nextUser = {
        ...user,
        ...payload,
        ...updated,
        uid: userId,
      };

      localStorage.setItem("user", JSON.stringify(nextUser));
      await refresh();
      toast({
        title: "Profile updated",
        description: "Your campus profile was saved successfully.",
      });
    } catch (error: any) {
      console.error("Failed to update profile", error);
      toast({
        title: "Update failed",
        description: error?.message || "We couldn't save your changes right now.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom max-w-3xl">
          <Card className="card-base">
            <CardHeader>
              <CardTitle className="text-2xl">Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update the details that appear across your ID card, profile, and campus services.
              </p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {editableFields.map(({ name, label, placeholder }) => (
                    <div key={name} className="space-y-2">
                      <Label htmlFor={name}>{label}</Label>
                      <Input
                        id={name}
                        name={name}
                        value={formState[name]}
                        onChange={(event) => handleChange(name, event.target.value)}
                        placeholder={placeholder}
                        autoComplete="off"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Changes sync across your digital ID, dashboard, and shared services.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={handleReset} disabled={!hasChanges || submitting} className="gap-2">
                    <Undo2 className="h-4 w-4" /> Reset
                  </Button>
                  <Button type="submit" disabled={!hasChanges || submitting} className="gap-2">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {submitting ? "Saving" : "Save changes"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
