"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Kelurahan } from "@/lib/types";

interface FilterBarProps {
  kelurahanList: Kelurahan[];
  initialNoPdam: string;
  initialKel: number | null;
  initialRw: number | null;
}

export default function FilterBar({
  kelurahanList,
  initialNoPdam,
  initialKel,
  initialRw,
}: FilterBarProps) {
  const router = useRouter();
  const [noPdam, setNoPdam] = useState(initialNoPdam);
  const [kelId, setKelId] = useState<number | "">(initialKel ?? "");
  const [rwId, setRwId] = useState<number | "">(initialRw ?? "");
  const [isLoading, setIsLoading] = useState(false);

  // Find RWs for currently selected kelurahan
  const selectedKelurahan = kelurahanList.find((k) => k.id === Number(kelId));
  const availableRws = selectedKelurahan ? selectedKelurahan.rw : [];

  const handleKelChange = (newKel: string) => {
    const val = newKel ? Number(newKel) : "";
    setKelId(val);
    setRwId(""); // Reset RW when kelurahan changes
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();
    if (noPdam.trim()) params.set("no_pdam", noPdam.trim());
    if (kelId !== "") params.set("kel", String(kelId));
    if (rwId !== "") params.set("rw", String(rwId));

    router.push(`/?${params.toString()}`);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleReset = () => {
    setNoPdam("");
    setKelId("");
    setRwId("");
    router.push("/");
  };

  const hasAnyFilter = Boolean(noPdam.trim() || kelId !== "");

  return (
    <div className="glass-panel" style={{ padding: "20px 24px", marginBottom: "24px" }}>
      <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          alignItems: "flex-end",
        }}>
          {/* No PDAM */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
              No. PDAM / Pelanggan
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Contoh: 11010002..."
                value={noPdam}
                onChange={(e) => setNoPdam(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "monospace",
                }}
              />
              {noPdam && (
                <button
                  type="button"
                  onClick={() => setNoPdam("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Kelurahan */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
              Kelurahan
            </label>
            <select
              value={kelId}
              onChange={(e) => handleKelChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#0f172a",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="">-- Pilih Kelurahan --</option>
              {kelurahanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          {/* RW */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" }}>
              RW {kelId === "" ? "(Pilih Kelurahan dulu)" : ""}
            </label>
            <select
              value={rwId}
              disabled={kelId === ""}
              onChange={(e) => setRwId(e.target.value ? Number(e.target.value) : "")}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: kelId === "" ? "rgba(15, 23, 42, 0.4)" : "#0f172a",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                color: kelId === "" ? "#64748b" : "#f8fafc",
                fontSize: "14px",
                outline: "none",
                cursor: kelId === "" ? "not-allowed" : "pointer",
              }}
            >
              <option value="">Semua RW</option>
              {availableRws.map((rwNum) => (
                <option key={rwNum} value={rwNum}>
                  RW {String(rwNum).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isLoading || !hasAnyFilter}
              style={{
                flex: 1,
                padding: "10px 20px",
                borderRadius: "8px",
                background: hasAnyFilter ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" : "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: hasAnyFilter ? "#ffffff" : "#64748b",
                fontSize: "14px",
                fontWeight: "600",
                cursor: hasAnyFilter ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: hasAnyFilter ? "0 4px 12px rgba(2, 132, 199, 0.3)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {isLoading ? "Mencari..." : "Tampilkan Data"}
            </button>

            {hasAnyFilter && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-subtle)",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {!hasAnyFilter && (
          <div style={{ fontSize: "12px", color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>💡</span> Masukkan No. PDAM atau pilih Kelurahan untuk memulai pencarian.
          </div>
        )}
      </form>
    </div>
  );
}
