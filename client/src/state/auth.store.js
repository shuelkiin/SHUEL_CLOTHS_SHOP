import { create } from "zustand";

const USERS_KEY = "clothshop_users_v1";

// ✅ Use sessionStorage for session (per-tab)
const SESSION_KEY = "clothshop_session_v2_tab";

// Legacy key (in case you used it before) — we’ll ignore/migrate
const LEGACY_SESSION_KEY = "clothshop_session_v1";

const ADMIN_EMAIL = "shuelkiin@gmail.com";
const ADMIN_PASSWORD = "shuel@2030";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function loadTabSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTabSession(user) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

function clearTabSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// If you previously saved session in localStorage, migrate it once
function migrateLegacySessionToTab() {
  try {
    const legacy = localStorage.getItem(LEGACY_SESSION_KEY);
    if (!legacy) return null;
    const user = JSON.parse(legacy);
    // move to sessionStorage (current tab only), then delete legacy
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.removeItem(LEGACY_SESSION_KEY);
    return user;
  } catch {
    return null;
  }
}

function ensureAdminUser(users) {
  const exists = users.some(
    (u) => (u.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
  if (exists) return users;

  const admin = {
    id: "admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD, // demo only
    role: "admin",
    name: "Admin",
    phone: "",
    createdAt: new Date().toISOString(),
  };

  return [admin, ...users];
}

export const useAuthStore = create((set, get) => {
  const initialUsers = ensureAdminUser(loadUsers());
  saveUsers(initialUsers);

  const migrated = migrateLegacySessionToTab();
  const session = loadTabSession() || migrated || null;

  return {
    users: initialUsers,
    user: session,

    isLoggedIn: () => Boolean(get().user),
    isAdmin: () => (get().user?.role || "") === "admin",

    register: ({ email, password }) => {
      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanPassword = String(password || "").trim();

      if (!cleanEmail.includes("@")) return { ok: false, message: "Enter a valid email." };
      if (cleanPassword.length < 6) return { ok: false, message: "Password must be at least 6 characters." };

      if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
        return { ok: false, message: "This email is reserved for admin. Use Login instead." };
      }

      const users = get().users;
      const exists = users.some((u) => (u.email || "").toLowerCase() === cleanEmail);
      if (exists) return { ok: false, message: "Account already exists. Login instead." };

      const newUser = {
        id: `u_${Math.random().toString(16).slice(2)}`,
        email: cleanEmail,
        password: cleanPassword, // demo only
        role: "user",
        name: "",
        phone: "",
        createdAt: new Date().toISOString(),
      };

      const nextUsers = [newUser, ...users];
      const pub = publicUser(newUser);

      set({ users: nextUsers, user: pub });
      saveUsers(nextUsers);
      saveTabSession(pub);

      return { ok: true, message: "Registered successfully." };
    },

    login: ({ email, password }) => {
      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanPassword = String(password || "").trim();

      if (!cleanEmail || !cleanPassword) return { ok: false, message: "Enter email and password." };

      const users = get().users;

      // ✅ Admin login
      if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
        if (cleanPassword !== ADMIN_PASSWORD) return { ok: false, message: "Invalid admin password." };

        const ensured = ensureAdminUser(users);
        const admin = ensured.find((u) => (u.email || "").toLowerCase() === cleanEmail) || {
          id: "admin",
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          role: "admin",
          name: "Admin",
          phone: "",
          createdAt: new Date().toISOString(),
        };

        const pub = publicUser(admin);
        set({ users: ensured, user: pub });
        saveUsers(ensured);
        saveTabSession(pub);

        return { ok: true, message: "Admin login successful." };
      }

      const found = users.find((u) => (u.email || "").toLowerCase() === cleanEmail);
      if (!found) return { ok: false, message: "Account not found. Register first." };
      if (String(found.password) !== cleanPassword) return { ok: false, message: "Wrong password." };

      const pub = publicUser(found);
      set({ user: pub });
      saveTabSession(pub);

      return { ok: true, message: "Login successful." };
    },

    logout: () => {
      set({ user: null });
      clearTabSession();
    },

    updateProfile: (patch) => {
      const current = get().user;
      if (!current) return;

      const users = get().users;
      const idx = users.findIndex(
        (u) => (u.email || "").toLowerCase() === (current.email || "").toLowerCase()
      );
      if (idx === -1) return;

      const updated = { ...users[idx], ...patch };
      const nextUsers = [...users];
      nextUsers[idx] = updated;

      const pub = publicUser(updated);

      set({ users: nextUsers, user: pub });
      saveUsers(nextUsers);
      saveTabSession(pub);
    },
  };
});

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    name: u.name || "",
    phone: u.phone || "",
  };
}