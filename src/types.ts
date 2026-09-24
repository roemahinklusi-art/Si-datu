export type FokusType = 'Literasi' | 'Numerasi' | 'Literasi & Numerasi';
export type StatusType = 'Belum Terlaksana' | 'Sedang Berjalan' | 'Selesai';
export type JenjangType = 'SD' | 'SMP' | 'PAUD' | 'Kesetaraan' | 'Semua';

export interface PlanDetail {
  kategori: 'Literasi' | 'Numerasi';
  indikatorRapor: string;
  identifikasiMasalah: string;
  akarMasalah: string;
  kegiatanBenahi: string;
  sasaranKegiatan: string;
  penanggungJawab: string;
  waktuPelaksanaan: string;
  estimasiBiaya: number;
  sumberDana: string;
  indikatorKeberhasilan: string;
  statusPelaksanaan: StatusType;
  catatanKendala?: string;
}

export interface IRBEntry {
  id: string;
  timestamp: string;
  email?: string;
  namaSekolah: string;
  npsn?: string;
  jenjang: string;
  kecamatan: string;
  namaResponden: string;
  namaKepalaSekolah?: string;
  jabatanResponden: string;
  waktuRencanaKegiatan?: string;
  fokusBidang: FokusType;

  // Unified plans
  literasi: PlanDetail;
  numerasi: PlanDetail;

  // Flattened / summary fields for direct access and backward compatibility
  indikatorRapor: string;
  identifikasiMasalah: string;
  akarMasalah: string;
  kegiatanBenahi: string;
  sasaranKegiatan: string;
  penanggungJawab: string;
  waktuPelaksanaan: string;
  estimasiBiaya: number;
  sumberDana: string;
  indikatorKeberhasilan: string;
  statusPelaksanaan: StatusType;
  catatanKendala?: string;
}

export interface DriveSheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface FilterState {
  search: string;
  kecamatan: string;
  jenjang: string;
  fokus: string;
  status: string;
}

export interface BenchmarkTargets {
  tahunAjaran: string;
  targetKeterlaksanaanPct: number;
  targetKegiatanPerKecamatan: number;
  targetLiterasiPct: number;
  targetNumerasiPct: number;
  targetTotalSekolah: number;
  catatanKebijakan?: string;
}

