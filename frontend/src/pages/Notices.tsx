import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar, User, ExternalLink, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { noticesAPI } from "@/lib/api";

const categories = ["Academic", "Hostel", "Clubs", "Placement", "General"];

const categoryColors: Record<string, string> = {
  Academic: "badge-primary",
  Hostel: "bg-orange-100 text-orange-800",
  Clubs: "bg-purple-100 text-purple-800",
  Placement: "bg-green-100 text-green-800",
  General: "bg-gray-100 text-gray-800",
};

type Notice = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt?: any;
};

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // add notice state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Academic");

  // 🔄 FETCH NOTICES
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticesAPI.getAll();
        const formattedNotices = data.map((notice: any) => ({
          ...notice,
          createdAt: notice.createdAt
            ? typeof notice.createdAt === "object" && notice.createdAt.toDate
              ? notice.createdAt
              : new Date(notice.createdAt)
            : undefined,
        }));
        setNotices(formattedNotices);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchNotices, 5000);
    return () => clearInterval(interval);
  }, []);

  // ➕ ADD NOTICE
  const addNotice = async () => {
    if (!title || !content) return alert("Fill all fields");

    try {
      await noticesAPI.create({
        title,
        content,
        category,
        author: "NIT Goa",
      });

      // Refresh notices list
      const data = await noticesAPI.getAll();
      const formattedNotices = data.map((notice: any) => ({
        ...notice,
        createdAt: notice.createdAt
          ? typeof notice.createdAt === "object" && notice.createdAt.toDate
            ? notice.createdAt
            : new Date(notice.createdAt)
          : undefined,
      }));
      setNotices(formattedNotices);

      setTitle("");
      setContent("");
    } catch (error: any) {
      alert(error.message || "Failed to create notice");
    }
  };

  // ✏️ EDIT NOTICE
  const editNotice = async (notice: Notice) => {
    const newTitle = prompt("Edit title", notice.title);
    const newContent = prompt("Edit content", notice.content);

    if (!newTitle || !newContent) return;

    try {
      await noticesAPI.update(notice.id, {
        title: newTitle,
        content: newContent,
      });

      // Refresh notices list
      const data = await noticesAPI.getAll();
      const formattedNotices = data.map((n: any) => ({
        ...n,
        createdAt: n.createdAt
          ? typeof n.createdAt === "object" && n.createdAt.toDate
            ? n.createdAt
            : new Date(n.createdAt)
          : undefined,
      }));
      setNotices(formattedNotices);
    } catch (error: any) {
      alert(error.message || "Failed to update notice");
    }
  };

  // 🗑️ DELETE NOTICE
  const deleteNotice = async (id: string) => {
    if (!confirm("Delete this notice?")) return;

    try {
      await noticesAPI.delete(id);

      // Refresh notices list
      const data = await noticesAPI.getAll();
      const formattedNotices = data.map((notice: any) => ({
        ...notice,
        createdAt: notice.createdAt
          ? typeof notice.createdAt === "object" && notice.createdAt.toDate
            ? notice.createdAt
            : new Date(notice.createdAt)
          : undefined,
      }));
      setNotices(formattedNotices);
    } catch (error: any) {
      alert(error.message || "Failed to delete notice");
    }
  };

  // 🔍 SEARCH
  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="py-8">
        <div className="container-custom">

          {/* HEADER */}
          <div className="page-header">
            <h1 className="page-title">Campus Notices</h1>
            <p className="page-subtitle">Real-time announcements</p>
          </div>

          {/* ➕ ADD NOTICE */}
          <div className="card-base p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Notice
            </h3>

            <div className="space-y-3">
              <Input
                placeholder="Notice title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                placeholder="Notice content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex gap-2 flex-wrap">
                {categories.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={category === c ? "default" : "outline"}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>

              <Button onClick={addNotice}>Publish Notice</Button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* NOTICES LIST */}
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <div key={notice.id} className="card-base p-6">
                <div className="flex flex-col gap-3">

                  <span className={`badge-base ${categoryColors[notice.category]}`}>
                    {notice.category}
                  </span>

                  <h3 className="text-lg font-semibold">{notice.title}</h3>
                  <p className="text-muted-foreground">{notice.content}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" /> {notice.author}
                    </span>

                    {notice.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {notice.createdAt instanceof Date
                          ? notice.createdAt.toLocaleDateString("en-IN")
                          : typeof notice.createdAt === "object" && notice.createdAt.toDate
                          ? notice.createdAt.toDate().toLocaleDateString("en-IN")
                          : new Date(notice.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    )}

                    <div className="ml-auto flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editNotice(notice)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteNotice(notice.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotices.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notices found</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}