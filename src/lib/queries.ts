import { RowDataPacket } from "mysql2";
import { pool } from "./db";
import { Kelurahan, Pelanggan, Rekening, SearchResult } from "./types";

export const PAGE_SIZE = 12;

export async function getWilayah(): Promise<Kelurahan[]> {
  try {
    const [kel] = await pool.query<RowDataPacket[]>(
      "SELECT ID, NAMA FROM SPD_KELURAHAN WHERE IS_DELETE = 0 ORDER BY NAMA"
    );
    const [rw] = await pool.query<RowDataPacket[]>(
      "SELECT DISTINCT KELURAHAN_ID, ID FROM SPD_RW WHERE IS_DELETE = 0 ORDER BY ID"
    );

    const rwByKel = new Map<number, number[]>();
    for (const r of rw) {
      const k = Number(r.KELURAHAN_ID);
      const list = rwByKel.get(k) ?? [];
      list.push(Number(r.ID));
      rwByKel.set(k, list);
    }

    return kel.map((k) => ({
      id: Number(k.ID),
      nama: String(k.NAMA),
      rw: rwByKel.get(Number(k.ID)) ?? [],
    }));
  } catch (err) {
    console.error("Error fetching wilayah:", err);
    return [];
  }
}

export async function searchPelanggan(
  noPdam: string,
  kelId: number | null,
  rwId: number | null,
  page: number = 1
): Promise<SearchResult> {
  const cleanNoPdam = (noPdam || "").replace(/[^0-9A-Za-z]/g, "").slice(0, 10);
  const targetPage = Math.max(1, page);

  // Require at least one filter
  if (!cleanNoPdam && !kelId) {
    return { total: 0, page: 1, pageSize: PAGE_SIZE, items: [] };
  }

  const where: string[] = ["p.IS_DELETE = 0"];
  const args: (string | number)[] = [];

  if (cleanNoPdam) {
    where.push("p.NO_PDAM LIKE ?");
    args.push(`%${cleanNoPdam}%`);
  }
  if (kelId) {
    where.push("p.KELURAHAN_ID = ?");
    args.push(kelId);
  }
  if (rwId) {
    where.push("p.RW_ID = ?");
    args.push(rwId);
  }

  const whereSql = where.join(" AND ");

  try {
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM SPD_STLGN p WHERE ${whereSql}`,
      args
    );
    const total = Number(countRows[0]?.total ?? 0);

    const offset = (targetPage - 1) * PAGE_SIZE;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.ID, p.NO_PDAM, p.NAMA, p.ALAMAT, p.RT, p.RW_ID, p.FLAG,
              k.NAMA AS KELURAHAN, g.KODE AS GOLONGAN
         FROM SPD_STLGN p
         LEFT JOIN SPD_KELURAHAN k ON k.ID = p.KELURAHAN_ID
         LEFT JOIN SPD_STGOL g ON g.ID = p.STGOL_ID
        WHERE ${whereSql}
        ORDER BY p.NO_PDAM
        LIMIT ? OFFSET ?`,
      [...args, PAGE_SIZE, offset]
    );

    const ids = rows.map((r) => Number(r.ID));
    const rekeningById = new Map<number, Rekening[]>();

    if (ids.length > 0) {
      const [rek] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM (
           SELECT r.STLGN_ID, r.NO_PDAM, r.PERIODE, r.METER, r.EDITMETER, r.METERLALU,
                  r.VOLUME_REAL, r.TGL_BACA, r.IMAGE, r.KETERANGAN, r.STATUS,
                  ROW_NUMBER() OVER (PARTITION BY r.STLGN_ID ORDER BY r.PERIODE DESC) AS rn
             FROM SPD_REKENING r
            WHERE r.STLGN_ID IN (?)
         ) x
         WHERE x.rn <= 5
         ORDER BY x.STLGN_ID, x.PERIODE DESC`,
        [ids]
      );

      for (const r of rek) {
        const id = Number(r.STLGN_ID);
        const list = rekeningById.get(id) ?? [];
        const editMeter = Number(r.EDITMETER ?? 0);
        list.push({
          periode: String(r.PERIODE),
          stand: editMeter > 0 ? editMeter : Number(r.METER ?? 0),
          standLalu: Number(r.METERLALU ?? 0),
          volume: Number(r.VOLUME_REAL ?? 0),
          tglBaca: r.TGL_BACA ? String(r.TGL_BACA) : null,
          keterangan: r.KETERANGAN ? String(r.KETERANGAN).trim() : null,
          status: String(r.STATUS ?? ""),
          foto: String(r.IMAGE || r.NO_PDAM || "").trim(),
        });
        rekeningById.set(id, list);
      }
    }

    const items: Pelanggan[] = rows.map((r) => ({
      id: Number(r.ID),
      noPdam: String(r.NO_PDAM).trim(),
      nama: String(r.NAMA ?? "").trim(),
      alamat: String(r.ALAMAT ?? "").trim(),
      rt: r.RT ? String(r.RT).trim() : null,
      rw: Number(r.RW_ID),
      kelurahan: r.KELURAHAN ? String(r.KELURAHAN) : null,
      golongan: r.GOLONGAN ? String(r.GOLONGAN).trim() : null,
      status: String(r.FLAG ?? "").trim(),
      rekening: rekeningById.get(Number(r.ID)) ?? [],
    }));

    return { total, page: targetPage, pageSize: PAGE_SIZE, items };
  } catch (err) {
    console.error("Error searching pelanggan:", err);
    return { total: 0, page: 1, pageSize: PAGE_SIZE, items: [] };
  }
}
