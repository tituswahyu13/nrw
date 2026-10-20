"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        marginTop: "8px",
        padding: "12px",
        borderRadius: "8px",
        background: pending ? "rgba(2, 132, 199, 0.5)" : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
        border: "none",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "700",
        cursor: pending ? "not-allowed" : "pointer",
        boxShadow: "0 6px 16px rgba(2, 132, 199, 0.35)",
        transition: "all 0.15s ease"
      }}
    >
      {pending ? "Memverifikasi..." : "Masuk ke Aplikasi"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative Glow Orbs */}
      <div style={{
        position: "absolute",
        width: "450px",
        height: "450px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)",
        top: "10%",
        left: "15%",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)",
        bottom: "15%",
        right: "15%",
        pointerEvents: "none",
      }} />

      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "420px",
        padding: "36px 32px",
        position: "relative",
        zIndex: 1,
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)",
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "54px",
            height: "54px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(2, 132, 199, 0.4)",
            marginBottom: "16px"
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", color: "#f8fafc" }}>
            SIMPADU · Meter Air
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px" }}>
            Masuk dengan akun SIMPADU Anda
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: "13px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>⚠️</span>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              autoFocus
              placeholder="Username SIMPADU"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <SubmitButton />
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "#64748b" }}>
          Menggunakan basis data resmi PDAM (Tabel SPD_USER)
        </div>
      </div>
    </main>
  );
}
