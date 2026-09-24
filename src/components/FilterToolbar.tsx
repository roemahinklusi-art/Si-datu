import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { FilterState } from '../types';

interface FilterToolbarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
  allResultsCount: number;
}

export const KECAMATAN_LIST = [
  'Semua Kecamatan',
  'Praya',
  'Praya Barat',
  'Praya Barat Daya',
  'Praya Tengah',
  'Praya Timur',
  'Pujut',
  'Jonggat',
  'Batukliang',
  'Batukliang Utara',
  'Janapria',
  'Kopang',
  'Pringgarata',
];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  allResultsCount,
}) => {
  const isFiltered =
    Boolean(filters.search.trim()) ||
    filters.kecamatan !== 'Semua' ||
    filters.jenjang !== 'Semua' ||
    filters.fokus !== 'Semua' ||
    filters.status !== 'Semua';

  return (
    <div id="filter-toolbar-card" className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-col gap-3.5">
        {/* Top bar: Search input + Results Badge */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="filter-input-search"
              type="text"
              placeholder="Cari nama sekolah, NPSN, nama responden, atau kegiatan benahi..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <div id="filter-result-count" className="text-xs text-slate-600 font-medium">
              Menampilkan <span className="font-bold text-slate-900">{totalResults}</span> dari{' '}
              <span className="text-slate-500">{allResultsCount}</span> sekolah
            </div>

            {isFiltered && (
              <button
                id="filter-btn-reset"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Kecamatan */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-select-kecamatan" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Kecamatan
            </label>
            <select
              id="filter-select-kecamatan"
              value={filters.kecamatan}
              onChange={(e) => onFilterChange({ ...filters, kecamatan: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Kecamatan ({KECAMATAN_LIST.length - 1})</option>
              {KECAMATAN_LIST.slice(1).map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>
          </div>

          {/* Jenjang */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-select-jenjang" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Jenjang Pendidikan
            </label>
            <select
              id="filter-select-jenjang"
              value={filters.jenjang}
              onChange={(e) => onFilterChange({ ...filters, jenjang: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Jenjang</option>
              <option value="SD">Sekolah Dasar (SD)</option>
              <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
              <option value="PAUD">PAUD / TK</option>
            </select>
          </div>

          {/* Fokus Bidang */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-select-fokus" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Fokus Benahi
            </label>
            <select
              id="filter-select-fokus"
              value={filters.fokus}
              onChange={(e) => onFilterChange({ ...filters, fokus: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Fokus</option>
              <option value="Literasi">Literasi</option>
              <option value="Numerasi">Numerasi</option>
              <option value="Literasi & Numerasi">Literasi & Numerasi</option>
            </select>
          </div>

          {/* Status Keterlaksanaan */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-select-status" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Status Keterlaksanaan
            </label>
            <select
              id="filter-select-status"
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai">Tuntas / Selesai</option>
              <option value="Sedang Berjalan">Sedang Berjalan</option>
              <option value="Belum Terlaksana">Belum Terlaksana</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
