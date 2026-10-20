"use client";

import { useState } from "react";
import { Pelanggan, Rekening } from "@/lib/types";
import { formatPeriode, formatTanggal, formatAngka, KETERANGAN, STATUS } from "@/lib/format";

interface PelangganCardProps {
  pelanggan: Pelanggan;
  onOpenPhoto: (pelanggan: Pelanggan, index: number) => void;
}

export default function PelangganCard({ pelanggan, onOpenPhoto }: PelangganCardProps) {
  const statusInfo = STATUS[pelanggan.status] || { label: pelanggan.status || "-", tone: "warn" };

  return (
    <div className="glass-panel" style={{ padding: "20px", marginBottom: "20px", transition: "border-color 0.2s ease" }}>
      {/* Top Section: Customer Info */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "12px",
        paddingBottom: "16px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{
            fontFamily: "monospace",
            fontSize: "16px",
            fontWeight: "800",
            padding: "5px 12px",
            borderRadius: "8px",
            background: "rgba(56, 189, 248, 0.12)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            letterSpacing: "0.05em"
          }}>
            {pelanggan.noPdam}
          </div>

          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
              {pelanggan.nama}
            </h2>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
              {pelanggan.alamat} {pelanggan.rt ? `RT ${pelanggan.rt}` : ""} · RW {String(pelanggan.rw).padStart(2, "0")} · Kel. {pelanggan.kelurahan ?? "-"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {pelanggan.golongan && (
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 10px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#cbd5e1",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              Gol. {pelanggan.golongan}
            </span>
          )}

          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            padding: "4px 10px",
            borderRadius: "6px",
            background: statusInfo.tone === "ok" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
            color: statusInfo.tone === "ok" ? "#34d399" : "#fbbf24",
            border: `1px solid ${statusInfo.tone === "ok" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
          }}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* 5-Month Meter Timeline & Photos */}
      <div style={{ marginTop: "16px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
            Riwayat Pencatatan & Foto Meter ({pelanggan.rekening.length} Periode Tersedia)
          </span>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
            *Klik foto untuk memperbesar & navigasi
          </span>
        </div>

        {pelanggan.rekening.length === 0 ? (
          <div style={{
            padding: "24px",
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            color: "#64748b",
            fontSize: "13px"
          }}>
            Belum ada rekaman rekening meter untuk pelanggan ini.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}>
            {pelanggan.rekening.map((rek, idx) => (
              <MeterMonthCard
                key={rek.periode}
                rekening={rek}
                isLatest={idx === 0}
                onClick={() => onOpenPhoto(pelanggan, idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MeterMonthCard({
  rekening,
  isLatest,
  onClick,
}: {
  rekening: Rekening;
  isLatest: boolean;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const thumbUrl = `/nrw/api/foto/${rekening.periode}/${encodeURIComponent(rekening.foto)}?w=360`;

  return (
    <div
      onClick={onClick}
      style={{
        background: isLatest ? "rgba(14, 165, 233, 0.08)" : "rgba(15, 23, 42, 0.6)",
        border: `1px solid ${isLatest ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.06)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.15s ease, border-color 0.15s ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "#38bdf8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = isLatest ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.06)";
      }}
    >
      {/* Month Header Banner */}
      <div style={{
        padding: "8px 12px",
        background: isLatest ? "rgba(2, 132, 199, 0.25)" : "rgba(255, 255, 255, 0.03)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: isLatest ? "#38bdf8" : "#e2e8f0" }}>
          {formatPeriode(rekening.periode)}
        </span>
        {isLatest && (
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase" }}>
            Terbaru
          </span>
        )}
      </div>

      {/* Photo Thumbnail */}
      <div style={{
        position: "relative",
        height: "130px",
        background: "#030712",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {!imgError ? (
          <img
            src={thumbUrl}
            alt={`Foto ${rekening.periode}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0.4,
              transition: "opacity 0.2s ease",
            }}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#64748b", padding: "8px" }}>
            <span style={{ fontSize: "22px", display: "block" }}>📷</span>
            <span style={{ fontSize: "11px" }}>Foto tidak ada</span>
          </div>
        )}

        {/* Hover Overlay Hint */}
        <div style={{
          position: "absolute",
          bottom: "6px",
          right: "6px",
          background: "rgba(0, 0, 0, 0.75)",
          padding: "3px 8px",
          borderRadius: "6px",
          fontSize: "11px",
          color: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}>
          🔍 Perbesar
        </div>
      </div>

      {/* Meter Reading Summary */}
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>Stand:</span>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", fontFamily: "monospace" }}>
            {formatAngka(rekening.stand)}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>Pakai:</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#38bdf8", fontFamily: "monospace" }}>
            {formatAngka(rekening.volume)} m³
          </span>
        </div>

        <div style={{
          marginTop: "4px",
          paddingTop: "6px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          fontSize: "11px",
          color: "#64748b",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>{rekening.keterangan ? (KETERANGAN[rekening.keterangan] || rekening.keterangan) : "Normal"}</span>
        </div>
      </div>
    </div>
  );
}
