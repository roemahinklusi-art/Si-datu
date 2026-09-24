import type { IRBEntry, PlanDetail, FokusType, StatusType } from '../types';

export const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSSnEgAVZnhu1lKjvLh4BAdJS_eO5EpUV-gz_2FyOoUcOUc7sNOv1EelRJnOgc97aVirxKHG1LwQdct/pub?gid=919945631&single=true&output=csv';

function parseCSVRow(str: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"') {
      if (inQuotes && str[i+1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Builds unified IRBEntry records by merging Literasi and Numerasi rows for each school.
 * In the survey dataset, each school has 2 rows (one for Literasi, one for Numerasi).
 * This combines them into 1 single unified educational unit (satuan pendidikan).
 */
export function buildUnifiedEntriesFromRows(dataRows: string[][]): IRBEntry[] {
  const entries: IRBEntry[] = [];
  let i = 0;

  while (i < dataRows.length) {
    const rowA = dataRows[i];
    const rowB = i + 1 < dataRows.length ? dataRows[i + 1] : null;

    const catA = (rowA[7] || '').trim().toLowerCase();
    const catB = rowB ? (rowB[7] || '').trim().toLowerCase() : '';

    const npsnA = (rowA[4] || '').trim();
    const npsnB = rowB ? (rowB[4] || '').trim() : '';
    const schA = (rowA[3] || '').trim().toLowerCase();
    const schB = rowB ? (rowB[3] || '').trim().toLowerCase() : '';

    // Check if rowA and rowB belong to the same school submission with opposite categories
    const isPaired = Boolean(
      rowB &&
      ((npsnA && npsnB && npsnA === npsnB) || schA === schB) &&
      ((catA.includes('literasi') && catB.includes('numerasi')) ||
       (catA.includes('numerasi') && catB.includes('literasi')))
    );

    let litRow: string[] | null = null;
    let numRow: string[] | null = null;

    if (isPaired && rowB) {
      if (catA.includes('literasi')) {
        litRow = rowA;
        numRow = rowB;
      } else {
        litRow = rowB;
        numRow = rowA;
      }
      i += 2;
    } else {
      if (catA.includes('literasi')) {
        litRow = rowA;
      } else {
        numRow = rowA;
      }
      i += 1;
    }

    const baseRow = litRow || numRow || rowA;
    const cleanKecamatan = (baseRow[2] || '').replace(/^Kecamatan\s+/i, '').trim();
    const cleanSekolah = (baseRow[3] || '').trim();
    const npsn = (baseRow[4] || '').trim();
    const namaKepsek = (baseRow[5] || '').trim();
    const waktuRencana = (baseRow[6] || '').trim();
    const timestamp = baseRow[0] || '';
    const email = baseRow[1] || '';

    const litPlan: PlanDetail = {
      kategori: 'Literasi',
      indikatorRapor: 'A.1 Kemampuan Literasi',
      identifikasiMasalah: litRow ? (litRow[8] || '').trim() : '',
      akarMasalah: litRow ? (litRow[9] || '').trim() || 'Tidak disebutkan' : 'Tidak disebutkan',
      kegiatanBenahi: litRow ? (litRow[10] || '').trim() : '',
      sasaranKegiatan: 'Peserta Didik dan Pendidik',
      waktuPelaksanaan: litRow ? (litRow[11] || '').trim() : '',
      penanggungJawab: litRow ? (litRow[12] || '').trim() : '',
      estimasiBiaya: 0,
      sumberDana: 'BOS Reguler',
      indikatorKeberhasilan: litRow ? (litRow[13] || '').trim() : '',
      statusPelaksanaan: 'Belum Terlaksana' as StatusType,
    };

    const numPlan: PlanDetail = {
      kategori: 'Numerasi',
      indikatorRapor: 'A.2 Kemampuan Numerasi',
      identifikasiMasalah: numRow ? (numRow[8] || '').trim() : '',
      akarMasalah: numRow ? (numRow[9] || '').trim() || 'Tidak disebutkan' : 'Tidak disebutkan',
      kegiatanBenahi: numRow ? (numRow[10] || '').trim() : '',
      sasaranKegiatan: 'Peserta Didik dan Pendidik',
      waktuPelaksanaan: numRow ? (numRow[11] || '').trim() : '',
      penanggungJawab: numRow ? (numRow[12] || '').trim() : '',
      estimasiBiaya: 0,
      sumberDana: 'BOS Reguler',
      indikatorKeberhasilan: numRow ? (numRow[13] || '').trim() : '',
      statusPelaksanaan: 'Belum Terlaksana' as StatusType,
    };

    const hasLit = Boolean(litPlan.kegiatanBenahi || litPlan.akarMasalah);
    const hasNum = Boolean(numPlan.kegiatanBenahi || numPlan.akarMasalah);

    let fokusBidang: FokusType = 'Literasi & Numerasi';
    if (hasLit && !hasNum) fokusBidang = 'Literasi';
    else if (!hasLit && hasNum) fokusBidang = 'Numerasi';

    const entryId = `sekolah-${(entries.length + 1).toString().padStart(3, '0')}`;

    entries.push({
      id: entryId,
      timestamp,
      email,
      namaSekolah: cleanSekolah,
      npsn,
      jenjang: 'SD',
      kecamatan: cleanKecamatan,
      namaResponden: namaKepsek,
      namaKepalaSekolah: namaKepsek,
      jabatanResponden: 'Kepala Sekolah / Guru',
      waktuRencanaKegiatan: waktuRencana,
      fokusBidang,
      literasi: litPlan,
      numerasi: numPlan,

      // Summary representations
      indikatorRapor: 'A.1 Kemampuan Literasi & A.2 Kemampuan Numerasi',
      identifikasiMasalah: litPlan.identifikasiMasalah && numPlan.identifikasiMasalah
        ? `[Literasi]: ${litPlan.identifikasiMasalah}\n[Numerasi]: ${numPlan.identifikasiMasalah}`
        : (litPlan.identifikasiMasalah || numPlan.identifikasiMasalah),
      akarMasalah: litPlan.akarMasalah && numPlan.akarMasalah
        ? `[Literasi]: ${litPlan.akarMasalah}\n[Numerasi]: ${numPlan.akarMasalah}`
        : (litPlan.akarMasalah || numPlan.akarMasalah),
      kegiatanBenahi: litPlan.kegiatanBenahi && numPlan.kegiatanBenahi
        ? `[Literasi]: ${litPlan.kegiatanBenahi}\n[Numerasi]: ${numPlan.kegiatanBenahi}`
        : (litPlan.kegiatanBenahi || numPlan.kegiatanBenahi),
      sasaranKegiatan: 'Peserta Didik dan Pendidik',
      penanggungJawab: litPlan.penanggungJawab || numPlan.penanggungJawab || 'Kepala Sekolah / Guru',
      waktuPelaksanaan: litPlan.waktuPelaksanaan || numPlan.waktuPelaksanaan || waktuRencana,
      estimasiBiaya: 0,
      sumberDana: 'BOS Reguler',
      indikatorKeberhasilan: litPlan.indikatorKeberhasilan && numPlan.indikatorKeberhasilan
        ? `[Literasi]: ${litPlan.indikatorKeberhasilan}\n[Numerasi]: ${numPlan.indikatorKeberhasilan}`
        : (litPlan.indikatorKeberhasilan || numPlan.indikatorKeberhasilan),
      statusPelaksanaan: 'Belum Terlaksana' as StatusType,
    });
  }

  return entries;
}

export async function fetchCsvData(url: string = CSV_URL): Promise<IRBEntry[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvData = await response.text();
    
    const lines = csvData.trim().split('\n');
    const parsedRows: string[][] = [];
    let currentRow = '';

    for (const line of lines) {
      currentRow += (currentRow ? '\n' : '') + line;
      const quotesCount = (currentRow.match(/"/g) || []).length;
      if (quotesCount % 2 === 0) {
        parsedRows.push(parseCSVRow(currentRow));
        currentRow = '';
      }
    }

    if (parsedRows.length < 2) return [];

    const dataRows = parsedRows.slice(1);
    return buildUnifiedEntriesFromRows(dataRows);
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    throw error;
  }
}
