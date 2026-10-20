export type AuthUser = {
  id: number;
  username: string;
  karyawanId: number;
};

export type Kelurahan = {
  id: number;
  nama: string;
  rw: number[];
};

export type Rekening = {
  periode: string; // YYYYMM
  stand: number;
  standLalu: number;
  volume: number;
  tglBaca: string | null;
  keterangan: string | null;
  status: string;
  foto: string;
};

export type Pelanggan = {
  id: number;
  noPdam: string;
  nama: string;
  alamat: string;
  rt: string | null;
  rw: number;
  kelurahan: string | null;
  golongan: string | null;
  status: string;
  rekening: Rekening[];
};

export type SearchResult = {
  total: number;
  page: number;
  pageSize: number;
  items: Pelanggan[];
};
