const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
type SignupPayload = {
  email: string;
  password: string;
  name?: string;
  rollNo?: string;
  branch?: string;
  contactNumber?: string;
  hostel?: string;
  roomNumber?: string;
  batch?: string;
  bloodGroup?: string;
  birthDate?: string;
};

export const usersAPI = {
  getAll: async () => {
    return apiRequest<Array<any>>("/users");
  },

  update: async (
    id: string,
    payload: {
      name?: string;
      rollNo?: string;
      branch?: string;
      contactNumber?: string;
      hostel?: string;
      roomNumber?: string;
      batch?: string;
      bloodGroup?: string;
      birthDate?: string;
    }
  ) => {
    return apiRequest<Record<string, unknown>>(`/users/${id}` as const, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export const clubsAPI = {
  getAll: async () => {
    return apiRequest<Array<any>>("/clubs");
  },

  create: async (payload: {
    name: string;
    president: string;
    contact?: string;
    description?: string;
    leads?: string;
  }) => {
    return apiRequest<{ id: string } & typeof payload & { createdAt?: string }>("/clubs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const birthdaysAPI = {
  getAll: async () => {
    return apiRequest<Array<any>>("/birthdays");
  },
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  signup: async (payload: SignupPayload) => {
    const data = await apiRequest<{ token: string; user: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  verifyToken: async (token: string) => {
    return apiRequest("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: () => localStorage.getItem("token"),
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Lost & Found API
export const lostFoundAPI = {
  getAll: async () => {
    return apiRequest<Array<any>>("/lost-found");
  },

  getById: async (id: string) => {
    return apiRequest(`/lost-found/${id}`);
  },

  create: async (item: {
    title: string;
    description: string;
    location: string;
    type: "lost" | "found";
    image?: string | null;
  }) => {
    return apiRequest<{ id: string } & typeof item>("/lost-found", {
      method: "POST",
      body: JSON.stringify(item),
    });
  },

  update: async (id: string, updates: Partial<{
    title: string;
    description: string;
    location: string;
    type: "lost" | "found";
    image: string | null;
  }>) => {
    return apiRequest(`/lost-found/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/lost-found/${id}`, {
      method: "DELETE",
    });
  },
};

// Notices API
export const noticesAPI = {
  getAll: async () => {
    return apiRequest<Array<any>>("/notices");
  },

  getById: async (id: string) => {
    return apiRequest(`/notices/${id}`);
  },

  create: async (notice: {
    title: string;
    content: string;
    category: string;
    author?: string;
  }) => {
    return apiRequest<{ id: string } & typeof notice>("/notices", {
      method: "POST",
      body: JSON.stringify(notice),
    });
  },

  update: async (id: string, updates: Partial<{
    title: string;
    content: string;
    category: string;
  }>) => {
    return apiRequest(`/notices/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/notices/${id}`, {
      method: "DELETE",
    });
  },
};

// Marketplace API
export const marketplaceAPI = {
  getAll: async () => {
    return apiRequest<Array<any>>("/marketplace");
  },

  getById: async (id: string) => {
    return apiRequest(`/marketplace/${id}`);
  },

  create: async (listing: {
    title: string;
    description: string;
    price: number;
    category: string;
    seller?: string;
    contact?: string;
    image?: string | null;
  }) => {
    return apiRequest<{ id: string } & typeof listing>("/marketplace", {
      method: "POST",
      body: JSON.stringify(listing),
    });
  },

  update: async (
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      price: number;
      category: string;
      seller?: string;
      contact?: string;
      image?: string | null;
    }>
  ) => {
    return apiRequest(`/marketplace/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/marketplace/${id}`, {
      method: "DELETE",
    });
  },
};
