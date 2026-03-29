"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthNav() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <span
        className="nav-pill"
        style={{ fontSize: "0.75rem", opacity: 0.6 }}
      >
        …
      </span>
    );
  }

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--t3)",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={user.email}
        >
          {user.email}
        </span>
        <button
          type="button"
          className="nav-auth-btn logout-mode"
          onClick={() => {
            logout();
            router.refresh();
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Link
        href="/login"
        className="nav-auth-btn"
        style={{ textDecoration: "none", display: "inline-flex" }}
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="nav-auth-btn"
        style={{ textDecoration: "none", display: "inline-flex" }}
      >
        Sign Up
      </Link>
    </div>
  );
}
