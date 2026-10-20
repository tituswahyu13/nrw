export const KETERANGAN: Record<string, string> = {
  A: "Meter Normal",
  B: "Meter Macet",
  C: "Rumah Kunci",
  D: "Meter Buram",
  E: "Meter Terpendam",
  F: "Meter Gedeg",
  G: "Meter Mundur",
  H: "Meter Terbalik",
  I: "Ganti Meter",
  J: "Stand Belum Sampai",
  K: "Lain-lain",
  L: "Rumah Kosong",
  M: "Dibacakan",
  N: "Meter Kembali Nol",
};

export const STATUS: Record<string, { label: string; tone: "ok" | "warn" | "danger" }> = {
  A: { label: "Aktif", tone: "ok" },
  T: { label: "Tutup Sementara", tone: "warn" },
  L: { label: "Tutup Total", tone: "danger" },
};

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function formatPeriode(periode: string) {
  if (!periode || periode.length < 6) return periode;
  const y = periode.slice(0, 4);
  const m = Number(periode.slice(4, 6));
  return `${BULAN[m - 1] ?? "?"} ${y}`;
}

export function formatTanggal(value: string | null) {
  if (!value) return "-";
  const [d, t = ""] = value.split(" ");
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return value;
  return `${Number(day)} ${BULAN[Number(m) - 1]} ${y}${t ? ` ${t.slice(0, 5)}` : ""}`;
}

export function formatAngka(n: number) {
  return (n ?? 0).toLocaleString("id-ID");
}
