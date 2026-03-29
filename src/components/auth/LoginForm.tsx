"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.trim() || !password) {
      setErr("Enter email and password.");
      return;
    }
    login(email.trim(), password);
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="glass"
      style={{ maxWidth: 420, margin: "48px auto", padding: "32px 28px" }}
    >
      <h1 style={{ fontSize: "1.35rem", marginBottom: 8 }}>Login</h1>
      <p style={{ color: "var(--t4)", fontSize: "0.88rem", marginBottom: 22 }}>
        Sessions are stored locally in your browser (no server).
      </p>
      <form onSubmit={onSubmit}>
        <div className="modal-field" style={{ marginBottom: 14 }}>
          <label className="modal-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="modal-input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-field" style={{ marginBottom: 18 }}>
          <label className="modal-label" htmlFor="login-pass">
            Password
          </label>
          <input
            id="login-pass"
            type="password"
            className="modal-input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err ? (
          <p className="modal-err show" style={{ marginBottom: 12 }}>
            {err}
          </p>
        ) : null}
        <button type="submit" className="modal-submit ripple-host" style={{ width: "100%" }}>
          Login →
        </button>
      </form>
      <p style={{ marginTop: 18, fontSize: "0.85rem", color: "var(--t4)" }}>
        No account?{" "}
        <Link href="/signup" style={{ color: "var(--a1)", fontWeight: 600 }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
