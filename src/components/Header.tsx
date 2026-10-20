"use client";

import { AuthUser } from "@/lib/types";
import { logoutAction } from "@/app/actions";

export default function Header({ user }: { user: AuthUser }) {
  return (
    <header className="glass-panel" style={{ padding: "14px 24px", marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.35)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.02em", color: "#f8fafc" }}>
                SIMPADU · Meter Air
              </h1>
              <span style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "2px 7px",
                borderRadius: "6px",
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.3)"
              }}>
                5 Bulan Terakhir
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Sistem Pemantauan Data Pelanggan & Arsip Foto Meter
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "6px 14px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.06)"
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.2)",
              color: "#38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "600"
            }}>
              {user.username.slice(0, 1).toUpperCase()}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>
                {user.username}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Petugas PDAM
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#f87171",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
