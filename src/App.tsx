import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCsvData, CSV_URL } from './services/csvParser';
import { INITIAL_MOCK_DATA } from './data/mockLombokTengahData';
import type { IRBEntry, FilterState, BenchmarkTargets } from './types';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { FilterToolbar } from './components/FilterToolbar';
import { DataTable } from './components/DataTable';
import { DetailModal } from './components/DetailModal';
import { AdminTargetModal, DEFAULT_BENCHMARK_TARGETS } from './components/AdminTargetModal';
import {
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Data State
  const [entries, setEntries] = useState<IRBEntry[]>([]);
  const [activeSheetTitle, setActiveSheetTitle] = useState(
    'RENCANA TINDAK LANJUT - IRB LITERASI DAN NUMERASI KABUPATEN LOMBOK TENGAH (Jawaban)'
  );

  // Loading & Error States
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detail Modal
  const [selectedEntry, setSelectedEntry] = useState<IRBEntry | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    kecamatan: 'Semua',
    jenjang: 'Semua',
    fokus: 'Semua',
    status: 'Semua',
  });

  // Admin Benchmark Targets State
  const [targets, setTargets] = useState<BenchmarkTargets>(() => {
    try {
      const saved = localStorage.getItem('sidatu_benchmark_targets');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load targets from localStorage', e);
    }
    return DEFAULT_BENCHMARK_TARGETS;
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleSaveTargets = (newTargets: BenchmarkTargets) => {
    setTargets(newTargets);
    try {
      localStorage.setItem('sidatu_benchmark_targets', JSON.stringify(newTargets));
    } catch (e) {
      console.error('Failed to save targets to localStorage', e);
    }
    setSuccessMessage('Target indikator benchmark admin berhasil diperbarui.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleResetDefaultTargets = () => {
    setTargets(DEFAULT_BENCHMARK_TARGETS);
    try {
      localStorage.removeItem('sidatu_benchmark_targets');
    } catch (e) {
      console.error('Failed to reset targets', e);
    }
    setSuccessMessage('Target benchmark dikembalikan ke pengaturan standar dinas.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Fetch CSV Data on Mount
  useEffect(() => {
    const loadCsvData = async () => {
      setIsLoadingData(true);
      setErrorMessage(null);
      try {
        const data = await fetchCsvData(CSV_URL);
        if (data.length > 0) {
          setEntries(data);
          setSuccessMessage(`Berhasil memuat ${data.length} satuan pendidikan terpadu dari sumber data.`);
        } else {
          setEntries(INITIAL_MOCK_DATA);
        }
      } catch (err: any) {
        console.error('Error loading CSV data:', err);
        setErrorMessage(
          err.message || 'Gagal memuat data dari CSV. Menggunakan data simulasi lokal.'
        );
        setEntries(INITIAL_MOCK_DATA);
      } finally {
        setIsLoadingData(false);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    };

    loadCsvData();
  }, []);

  // Refresh current data
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    try {
      const data = await fetchCsvData(CSV_URL);
      if (data.length > 0) {
        setEntries(data);
        setSuccessMessage(`Data berhasil diperbarui: ${data.length} satuan pendidikan terpadu.`);
      } else {
        setEntries(INITIAL_MOCK_DATA);
      }
    } catch (err: any) {
      setErrorMessage('Gagal memperbarui data.');
      setEntries(INITIAL_MOCK_DATA);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesSchool = entry.namaSekolah.toLowerCase().includes(q);
        const matchesPic = (entry.penanggungJawab || '').toLowerCase().includes(q);
        const matchesKegiatan = (entry.kegiatanBenahi || '').toLowerCase().includes(q);
        const matchesResponden = (entry.namaResponden || '').toLowerCase().includes(q);
        const matchesKepsek = (entry.namaKepalaSekolah || '').toLowerCase().includes(q);
        const matchesNpsn = (entry.npsn || '').toLowerCase().includes(q);
        const matchesLit = (entry.literasi?.kegiatanBenahi || '').toLowerCase().includes(q);
        const matchesNum = (entry.numerasi?.kegiatanBenahi || '').toLowerCase().includes(q);

        if (
          !matchesSchool &&
          !matchesPic &&
          !matchesKegiatan &&
          !matchesResponden &&
          !matchesKepsek &&
          !matchesNpsn &&
          !matchesLit &&
          !matchesNum
        ) {
          return false;
        }
      }

      // Kecamatan
      if (filters.kecamatan !== 'Semua' && entry.kecamatan !== filters.kecamatan) {
        return false;
      }

      // Jenjang
      if (filters.jenjang !== 'Semua' && entry.jenjang !== filters.jenjang) {
        return false;
      }

      // Fokus
      if (filters.fokus !== 'Semua') {
        if (filters.fokus === 'Literasi') {
          if (!entry.literasi?.kegiatanBenahi && entry.fokusBidang !== 'Literasi' && entry.fokusBidang !== 'Literasi & Numerasi') {
            return false;
          }
        } else if (filters.fokus === 'Numerasi') {
          if (!entry.numerasi?.kegiatanBenahi && entry.fokusBidang !== 'Numerasi' && entry.fokusBidang !== 'Literasi & Numerasi') {
            return false;
          }
        } else if (entry.fokusBidang !== filters.fokus) {
          return false;
        }
      }

      // Status
      if (filters.status !== 'Semua' && entry.statusPelaksanaan !== filters.status) {
        return false;
      }

      return true;
    });
  }, [entries, filters]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredEntries.length === 0) return;

    const headers = [
      'No',
      'Waktu Pengisian',
      'Nama Satuan Pendidikan',
      'NPSN',
      'Jenjang',
      'Kecamatan',
      'Kepala Sekolah / Responden',
      'Fokus Bidang',
      'Kegiatan Benahi Literasi',
      'Waktu Pelaksanaan Literasi',
      'Indikator Keberhasilan Literasi',
      'Kegiatan Benahi Numerasi',
      'Waktu Pelaksanaan Numerasi',
      'Indikator Keberhasilan Numerasi',
      'Estimasi Biaya (Rp)',
      'Sumber Dana',
      'Status Keterlaksanaan',
    ];

    const csvRows = [
      headers.join(','),
      ...filteredEntries.map((e, idx) => {
        return [
          idx + 1,
          `"${e.timestamp || ''}"`,
          `"${(e.namaSekolah || '').replace(/"/g, '""')}"`,
          `"${e.npsn || ''}"`,
          `"${e.jenjang || ''}"`,
          `"${e.kecamatan || ''}"`,
          `"${(e.namaKepalaSekolah || e.namaResponden || '').replace(/"/g, '""')}"`,
          `"${e.fokusBidang || ''}"`,
          `"${(e.literasi?.kegiatanBenahi || '').replace(/"/g, '""')}"`,
          `"${(e.literasi?.waktuPelaksanaan || '').replace(/"/g, '""')}"`,
          `"${(e.literasi?.indikatorKeberhasilan || '').replace(/"/g, '""')}"`,
          `"${(e.numerasi?.kegiatanBenahi || '').replace(/"/g, '""')}"`,
          `"${(e.numerasi?.waktuPelaksanaan || '').replace(/"/g, '""')}"`,
          `"${(e.numerasi?.indikatorKeberhasilan || '').replace(/"/g, '""')}"`,
          e.estimasiBiaya || 0,
          `"${e.sumberDana || ''}"`,
          `"${e.statusPelaksanaan || ''}"`,
        ].join(',');
      }),
    ];

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RTL_IRB_Terpadu_Lombok_Tengah_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* App Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Alerts & Notice Banners */}
        {errorMessage && (
          <div
            id="app-error-banner"
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <strong className="font-semibold block">Pemberitahuan Sistem:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div
            id="app-success-banner"
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-500 hover:text-emerald-800 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* KPI Metrics */}
        <MetricsCards entries={filteredEntries} />

        {/* Analytics Charts with Benchmark Targets */}
        <AnalyticsCharts
          entries={filteredEntries}
          targets={targets}
          onOpenAdminTargetModal={() => setIsAdminModalOpen(true)}
        />

        {/* Filter Toolbar */}
        <FilterToolbar
          filters={filters}
          onFilterChange={setFilters}
          onReset={() =>
            setFilters({
              search: '',
              kecamatan: 'Semua',
              jenjang: 'Semua',
              fokus: 'Semua',
              status: 'Semua',
            })
          }
          totalResults={filteredEntries.length}
          allResultsCount={entries.length}
        />

        {/* Data Table */}
        <DataTable
          entries={filteredEntries}
          onSelectEntry={(entry) => setSelectedEntry(entry)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} Dinas Pendidikan dan Kebudayaan Kabupaten Lombok Tengah · SI DATU (Sistem Informasi Data Terpadu)
          </span>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>Rapor Pendidikan</span>
            <span>·</span>
            <span>Perencanaan Berbasis Data (PBD)</span>
            <span>·</span>
            <span>Literasi & Numerasi</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />

      <AdminTargetModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        targets={targets}
        onSaveTargets={handleSaveTargets}
        onResetDefaults={handleResetDefaultTargets}
      />
    </div>
  );
}
