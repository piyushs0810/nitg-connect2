import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  IndianRupee,
  MessageCircle,
  Filter,
  Tag,
  Trash2,
  Loader2,
} from "lucide-react";
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
import { marketplaceAPI } from "@/lib/api";
import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

const categories = ["All", "Books", "Electronics", "Furniture", "Clothing", "Other"];

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  seller?: string;
  contact?: string;
  image?: string | null;
  createdAt?: Date;
}

const normalizeListing = (item: any): MarketplaceListing => {
  const toDate = (value: any): Date | undefined => {
    if (!value) return undefined;
    if (value.toDate && typeof value.toDate === "function") {
      return value.toDate();
    }
    if (typeof value === "number") {
      return new Date(value);
    }
    if (typeof value === "string") {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    if (value.seconds) {
      return new Date(value.seconds * 1000);
    }
    return undefined;
  };

  return {
    id: item.id,
    title: item.title ?? "Untitled listing",
    description: item.description ?? "No description provided.",
    price: typeof item.price === "number" ? item.price : Number(item.price) || 0,
    category: item.category ?? "Other",
    seller: item.seller ?? "Anonymous",
    contact: item.contact || undefined,
    image: item.image ?? null,
    createdAt: toDate(item.createdAt),
  };
};

const initialFormState = {
  title: "",
  description: "",
  price: "",
  category: "Books",
  seller: "",
  contact: "",
  image: "",
};

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await marketplaceAPI.getAll();
      const normalized = data.map(normalizeListing);
      setListings(normalized);
      setError(null);
    } catch (err) {
      console.error("Error fetching marketplace listings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        (listing.seller ?? "").toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        listing.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [listings, searchQuery, selectedCategory]);

  const handleFormChange = (
    field: keyof typeof initialFormState
  ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title || !form.description || !form.price || !form.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await marketplaceAPI.create({
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        seller: form.seller.trim() || undefined,
        contact: form.contact.trim() || undefined,
        image: form.image.trim() ? form.image.trim() : null,
      });

      await fetchListings();
      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this listing?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await marketplaceAPI.delete(id);
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (err) {
      console.error("Error deleting listing:", err);
      setError(err instanceof Error ? err.message : "Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom">
          {/* Header */}
          <div className="page-header">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="page-title">Buy &amp; Sell</h1>
                <p className="page-subtitle">Student marketplace for books, electronics &amp; more</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create a Listing</DialogTitle>
                    <DialogDescription>
                      List an item for sale to fellow students.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={form.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((category) => category !== "All")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="What are you selling?"
                        value={form.title}
                        onChange={handleFormChange("title")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the item..."
                        rows={3}
                        value={form.description}
                        onChange={handleFormChange("description")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          step={50}
                          placeholder="0"
                          className="pl-9"
                          value={form.price}
                          onChange={handleFormChange("price")}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seller">Seller name (optional)</Label>
                      <Input
                        id="seller"
                        placeholder="Your name"
                        value={form.seller}
                        onChange={handleFormChange("seller")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact info (email, phone or link)</Label>
                      <Input
                        id="contact"
                        placeholder="example@nitg.ac.in / +91-0000000000 / https://..."
                        value={form.contact}
                        onChange={handleFormChange("contact")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL (optional)</Label>
                      <Input
                        id="image"
                        placeholder="https://..."
                        value={form.image}
                        onChange={handleFormChange("image")}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Posting...
                        </span>
                      ) : (
                        "Post Listing"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading listings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="card-interactive overflow-hidden flex flex-col">
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Tag className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="badge-primary">{listing.category}</span>
                        {listing.createdAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(listing.createdAt)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(listing.id)}
                        disabled={deletingId === listing.id}
                        aria-label="Delete listing"
                      >
                        {deletingId === listing.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-foreground line-clamp-2">{listing.title}</h3>
                      <span className="text-lg font-bold text-primary flex items-center whitespace-nowrap">
                        <IndianRupee className="h-4 w-4" />
                        {listing.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {listing.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {listing.seller ? `by ${listing.seller}` : "Seller unknown"}
                      </span>
                      {listing.contact ? (
                        <Button size="sm" variant="outline" className="gap-1" asChild>
                          <a
                            href={listing.contact.startsWith("http") ? listing.contact : `mailto:${listing.contact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Contact
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
