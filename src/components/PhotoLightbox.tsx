"use client";

import { useEffect, useRef, useState } from "react";
import { Pelanggan, Rekening } from "@/lib/types";
import { formatPeriode, formatTanggal, formatAngka, KETERANGAN, STATUS } from "@/lib/format";

interface PhotoLightboxProps {
  pelanggan: Pelanggan | null;
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoLightbox({ pelanggan, initialIndex, onClose }: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setRotation(0);
  }, [initialIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (pelanggan && dialog) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog && dialog.open) {
      dialog.close();
    }
  }, [pelanggan]);

  // Reset image state when month changes
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    setZoom(1);
    setRotation(0);
  }, [currentIndex]);

  if (!pelanggan) return null;

  const list = pelanggan.rekening;
  const currentRek: Rekening | undefined = list[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < list.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const photoUrl = currentRek
    ? `/nrw/api/foto/${currentRek.periode}/${encodeURIComponent(currentRek.foto)}`
    : "";

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      style={{
        width: "95vw",
        maxWidth: "1100px",
        height: "90vh",
        borderRadius: "16px",
        background: "rgba(10, 15, 29, 0.96)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Lightbox Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(15, 23, 42, 0.7)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            fontSize: "14px",
            fontWeight: "700",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "#0284c7",
            color: "#ffffff",
            fontFamily: "monospace"
          }}>
            {pelanggan.noPdam}
          </span>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#f8fafc" }}>
              {pelanggan.nama}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              {pelanggan.alamat} (RW {String(pelanggan.rw).padStart(2, "0")}, {pelanggan.kelurahan ?? "-"})
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#f8fafc",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Month Navigation Pills */}
      <div style={{
        display: "flex",
        gap: "8px",
        padding: "10px 20px",
        background: "rgba(3, 7, 18, 0.5)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        overflowX: "auto",
      }}>
        {list.map((r, idx) => (
          <button
            key={r.periode}
            onClick={() => setCurrentIndex(idx)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              border: "1px solid",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
              background: idx === currentIndex ? "#0284c7" : "rgba(255, 255, 255, 0.04)",
              borderColor: idx === currentIndex ? "#38bdf8" : "rgba(255, 255, 255, 0.08)",
              color: idx === currentIndex ? "#ffffff" : "#94a3b8",
            }}
          >
            <span>{formatPeriode(r.periode)}</span>
            <span style={{
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: idx === currentIndex ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.06)",
              color: idx === currentIndex ? "#e0f2fe" : "#cbd5e1",
              fontFamily: "monospace"
            }}>
              {formatAngka(r.stand)} m³
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Area: Image + Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>
        {/* Left: Interactive Image Canvas */}
        <div style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030712",
          overflow: "hidden",
        }}>
          {/* Controls Overlay */}
          <div style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            display: "flex",
            gap: "6px",
            background: "rgba(15, 23, 42, 0.85)",
            padding: "6px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
          }}>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.3, 3.5))}
              title="Perbesar (+)"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >+</button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.3, 0.8))}
              title="Perkecil (-)"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >-</button>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              title="Putar 90°"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              🔄
            </button>
            <button
              onClick={() => { setZoom(1); setRotation(0); }}
              title="Reset"
              style={{
                padding: "0 8px",
                height: "32px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#94a3b8",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >Reset</button>
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#fff",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(8px)"
              }}
            >
              ◀
            </button>
          )}

          {currentIndex < list.length - 1 && (
            <button
              onClick={handleNext}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#fff",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(8px)"
              }}
            >
              ▶
            </button>
          )}

          {/* Image */}
          {currentRek ? (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: zoom > 1 ? "grab" : "default",
            }}>
              {!imgLoaded && !imgError && (
                <div style={{ color: "#38bdf8", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>Memuat foto meteran...</span>
                </div>
              )}
              {imgError && (
                <div style={{ textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>📷</div>
                  <div style={{ fontSize: "14px", color: "#f87171" }}>Foto meter tidak ditemukan</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    File: {currentRek.foto}.jpg
                  </div>
                </div>
              )}
              <img
                key={photoUrl}
                src={photoUrl}
                alt={`Meter ${pelanggan.noPdam} ${currentRek.periode}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => { setImgLoaded(true); setImgError(true); }}
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  objectFit: "contain",
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.15s ease-out",
                  display: imgError ? "none" : "block",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                }}
              />
            </div>
          ) : (
            <div style={{ color: "#64748b" }}>Tidak ada data foto</div>
          )}
        </div>

        {/* Right Sidebar: Details for Selected Month */}
        {currentRek && (
          <div style={{
            width: "320px",
            background: "rgba(15, 23, 42, 0.95)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}>
            <div>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                Periode Rekening
              </div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#38bdf8" }}>
                {formatPeriode(currentRek.periode)}
              </div>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Stand Meter Terbaca</div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", fontFamily: "monospace" }}>
                  {formatAngka(currentRek.stand)}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", paddingTop: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Stand Lalu</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#cbd5e1", fontFamily: "monospace" }}>
                    {formatAngka(currentRek.standLalu)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Pemakaian</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#38bdf8", fontFamily: "monospace" }}>
                    {formatAngka(currentRek.volume)} m³
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Status Bacaan / Keterangan</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0", marginTop: "2px" }}>
                  {currentRek.keterangan ? (KETERANGAN[currentRek.keterangan] || currentRek.keterangan) : "Normal"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Waktu Pencatatan</div>
                <div style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "2px" }}>
                  {formatTanggal(currentRek.tglBaca)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Status Rekening</div>
                <div style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "2px" }}>
                  {STATUS[currentRek.status]?.label || currentRek.status || "-"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Nama File Foto</div>
                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#94a3b8", marginTop: "2px" }}>
                  {currentRek.foto}.jpg
                </div>
              </div>
            </div>

            <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <a
                href={photoUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100%",
                  padding: "9px",
                  borderRadius: "8px",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  color: "#38bdf8",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                <span>Buka Foto Asli Tab Baru</span> ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
