import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, MapPin, Clock, Filter, ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lostFoundAPI } from "@/lib/api";

type Item = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "lost" | "found";
  image?: string | null;
  createdAt?: any;
};

export default function LostFound() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"lost" | "found">("lost");

  // 🔄 FETCH ITEMS
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await lostFoundAPI.getAll();
        // Handle createdAt timestamp conversion if needed
        const formattedItems = data.map((item: any) => ({
          ...item,
          createdAt: item.createdAt
            ? typeof item.createdAt === "object" && item.createdAt.toDate
              ? item.createdAt
              : new Date(item.createdAt)
            : undefined,
        }));
        setItems(formattedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
    // Poll for updates every 5 seconds (or use WebSocket for real-time)
    const interval = setInterval(fetchItems, 5000);
    return () => clearInterval(interval);
  }, []);

  // ➕ ADD ITEM
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location) {
      alert("Fill all fields");
      return;
    }

    try {
      await lostFoundAPI.create({
        title,
        description,
        location,
        type,
        image: null,
      });

      // Refresh items list
      const data = await lostFoundAPI.getAll();
      const formattedItems = data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt
          ? typeof item.createdAt === "object" && item.createdAt.toDate
            ? item.createdAt
            : new Date(item.createdAt)
          : undefined,
      }));
      setItems(formattedItems);

      setTitle("");
      setDescription("");
      setLocation("");
      setType("lost");
      setIsDialogOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to create item");
    }
  };

  // 🔍 FILTER + SEARCH
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom">

          {/* HEADER */}
          <div className="page-header">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="page-title">Lost & Found</h1>
                <p className="page-subtitle">
                  Report or search for lost items on campus
                </p>
              </div>

              {/* ADD DIALOG */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Report Item
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Report an Item</DialogTitle>
                    <DialogDescription>
                      Fill details of the lost or found item.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={addItem} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={type} onValueChange={(v) => setType(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="found">Found</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <ImagePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Image upload coming soon
                      </p>
                    </div>

                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="card-interactive overflow-hidden">
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>

                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className={item.type === "found" ? "badge-success" : "badge-danger"}>
                      {item.type}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </span>

                    {item.createdAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.createdAt instanceof Date
                          ? item.createdAt.toLocaleDateString("en-IN")
                          : typeof item.createdAt === "object" && item.createdAt.toDate
                          ? item.createdAt.toDate().toLocaleDateString("en-IN")
                          : new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No items found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}