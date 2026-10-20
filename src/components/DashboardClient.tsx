"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthUser, Kelurahan, Pelanggan, SearchResult } from "@/lib/types";
import Header from "./Header";
import FilterBar from "./FilterBar";
import PelangganCard from "./PelangganCard";
import PhotoLightbox from "./PhotoLightbox";

interface DashboardClientProps {
  user: AuthUser;
  kelurahanList: Kelurahan[];
  searchResult: SearchResult;
  noPdam: string;
  kel: number | null;
  rw: number | null;
  page: number;
}

export default function DashboardClient({
  user,
  kelurahanList,
  searchResult,
  noPdam,
  kel,
  rw,
  page,
}: DashboardClientProps) {
  const [lightboxState, setLightboxState] = useState<{
    pelanggan: Pelanggan;
    index: number;
  } | null>(null);

  const handleOpenPhoto = (pelanggan: Pelanggan, index: number) => {
    setLightboxState({ pelanggan, index });
  };

  const handleCloseLightbox = () => {
    setLightboxState(null);
  };

  const totalPages = Math.ceil(searchResult.total / searchResult.pageSize);
  const hasFilter = Boolean(noPdam.trim() || kel !== null);

  const makePageUrl = (targetPage: number) => {
    const q = new URLSearchParams();
    if (noPdam) q.set("no_pdam", noPdam);
    if (kel !== null) q.set("kel", String(kel));
    if (rw !== null) q.set("rw", String(rw));
    if (targetPage > 1) q.set("page", String(targetPage));
    const s = q.toString();
    return s ? `/?${s}` : "/";
  };

  const selectedKelName = kelurahanList.find((k) => k.id === kel)?.nama;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 20px 60px" }}>
      <Header user={user} />

      <FilterBar
        kelurahanList={kelurahanList}
        initialNoPdam={noPdam}
        initialKel={kel}
        initialRw={rw}
      />

      {/* Results Header / Summary */}
      {hasFilter ? (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          margin: "0 4px 16px"
        }}>
          <div style={{ fontSize: "14px", color: "#cbd5e1" }}>
            Menampilkan <strong style={{ color: "#38bdf8" }}>{searchResult.items.length}</strong> dari total <strong style={{ color: "#f8fafc" }}>{searchResult.total.toLocaleString("id-ID")}</strong> pelanggan
            {selectedKelName && (
              <span style={{ color: "#94a3b8" }}> · Kelurahan {selectedKelName}</span>
            )}
            {rw !== null && (
              <span style={{ color: "#94a3b8" }}> · RW {String(rw).padStart(2, "0")}</span>
            )}
            {noPdam && (
              <span style={{ color: "#94a3b8" }}> · No. PDAM &quot;{noPdam}&quot;</span>
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Halaman {page} dari {totalPages}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{
          padding: "48px 24px",
          textAlign: "center",
          color: "#94a3b8",
          margin: "20px 0"
        }}>
          <div style={{ fontSize: "42px", marginBottom: "12px" }}>🔍</div>
          <h3 style={{ fontSize: "18px", color: "#f8fafc", marginBottom: "6px" }}>
            Pilih Filter untuk Menampilkan Data
          </h3>
          <p style={{ fontSize: "13px", maxWidth: "460px", margin: "0 auto", color: "#64748b" }}>
            Silakan masukkan No. PDAM atau pilih Kelurahan dan RW pada form di atas untuk melihat data pelanggan dan foto meteran 5 bulan terakhir.
          </p>
        </div>
      )}

      {/* Customers List */}
      {searchResult.items.map((pelanggan) => (
        <PelangganCard
          key={pelanggan.id}
          pelanggan={pelanggan}
          onOpenPhoto={handleOpenPhoto}
        />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          marginTop: "32px",
          flexWrap: "wrap"
        }}>
          {page > 1 ? (
            <Link
              href={makePageUrl(page - 1)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                color: "#f8fafc",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              ← Sebelumnya
            </Link>
          ) : (
            <span style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              color: "#475569",
              fontSize: "13px",
              cursor: "not-allowed"
            }}>
              ← Sebelumnya
            </span>
          )}

          <span style={{
            fontSize: "13px",
            color: "#94a3b8",
            padding: "0 12px",
          }}>
            Hal. <strong style={{ color: "#f8fafc" }}>{page}</strong> / {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={makePageUrl(page + 1)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                color: "#f8fafc",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Selanjutnya →
            </Link>
          ) : (
            <span style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              color: "#475569",
              fontSize: "13px",
              cursor: "not-allowed"
            }}>
              Selanjutnya →
            </span>
          )}
        </div>
      )}

      {/* Photo Lightbox Dialog */}
      <PhotoLightbox
        pelanggan={lightboxState?.pelanggan ?? null}
        initialIndex={lightboxState?.index ?? 0}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
