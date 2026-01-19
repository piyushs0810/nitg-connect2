import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, IndianRupee, MessageCircle, Filter, ImagePlus, Tag } from "lucide-react";
import { useState } from "react";
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

const categories = ["All", "Books", "Electronics", "Furniture", "Clothing", "Other"];

const listings = [
  {
    id: 1,
    title: "Engineering Mathematics - Vol 1 & 2",
    description: "B.S. Grewal textbooks in excellent condition. Both volumes included.",
    price: 350,
    category: "Books",
    seller: "Rahul S.",
    date: "2024-01-12",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    title: "HP Laptop Charger (65W)",
    description: "Original HP charger, compatible with most HP laptops. Working perfectly.",
    price: 800,
    category: "Electronics",
    seller: "Priya M.",
    date: "2024-01-11",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Study Table",
    description: "Wooden study table in good condition. Includes small drawer. Pick up from Hostel A.",
    price: 1500,
    category: "Furniture",
    seller: "Amit K.",
    date: "2024-01-10",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    title: "Data Structures & Algorithms Book",
    description: "Cormen CLRS book, 3rd edition. Some highlights but in good condition.",
    price: 450,
    category: "Books",
    seller: "Sneha T.",
    date: "2024-01-09",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=200&fit=crop",
  },
  {
    id: 5,
    title: "Wireless Mouse - Logitech",
    description: "Logitech wireless mouse with USB receiver. Battery included.",
    price: 400,
    category: "Electronics",
    seller: "Vikram R.",
    date: "2024-01-08",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop",
  },
  {
    id: 6,
    title: "NIT Goa Hoodie - Size L",
    description: "Official NIT Goa hoodie, worn only twice. Like new condition.",
    price: 600,
    category: "Clothing",
    seller: "Ananya P.",
    date: "2024-01-07",
    image: null,
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom">
          {/* Header */}
          <div className="page-header">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="page-title">Buy & Sell</h1>
                <p className="page-subtitle">Student marketplace for books, electronics & more</p>
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
                  <form className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="What are you selling?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe the item..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="price" type="number" placeholder="0" className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Images (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <ImagePlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload images</p>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Post Listing
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="card-interactive overflow-hidden">
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
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="badge-primary">{listing.category}</span>
                    <span className="text-lg font-bold text-primary flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {listing.price}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      by {listing.seller}
                    </span>
                    <Button size="sm" variant="outline" className="gap-1">
                      <MessageCircle className="h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
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
