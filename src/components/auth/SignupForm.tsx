"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.trim() || password.length < 4) {
      setErr("Enter a valid email and password (min 4 characters).");
      return;
    }
    signup(email.trim(), password);
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="glass"
      style={{ maxWidth: 420, margin: "48px auto", padding: "32px 28px" }}
    >
      <h1 style={{ fontSize: "1.35rem", marginBottom: 8 }}>Sign up</h1>
      <p style={{ color: "var(--t4)", fontSize: "0.88rem", marginBottom: 22 }}>
        Create a local profile — data stays on this device only.
      </p>
      <form onSubmit={onSubmit}>
        <div className="modal-field" style={{ marginBottom: 14 }}>
          <label className="modal-label" htmlFor="su-email">
            Email
          </label>
          <input
            id="su-email"
            type="email"
            className="modal-input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-field" style={{ marginBottom: 18 }}>
          <label className="modal-label" htmlFor="su-pass">
            Password
          </label>
          <input
            id="su-pass"
            type="password"
            className="modal-input"
            autoComplete="new-password"
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
          Create account →
        </button>
      </form>
      <p style={{ marginTop: 18, fontSize: "0.85rem", color: "var(--t4)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--a1)", fontWeight: 600 }}>
          Login
        </Link>
      </p>
    </div>
  );
}
