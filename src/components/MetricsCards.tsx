import React from 'react';
import { School, CheckCircle2, BookOpen, Calculator, Coins, MapPin } from 'lucide-react';
import type { IRBEntry } from '../types';

interface MetricsCardsProps {
  entries: IRBEntry[];
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ entries }) => {
  const total = entries.length;

  const selesaiCount = entries.filter((e) => e.statusPelaksanaan === 'Selesai').length;
  const prosesCount = entries.filter((e) => e.statusPelaksanaan === 'Sedang Berjalan').length;
  const belumCount = entries.filter((e) => e.statusPelaksanaan === 'Belum Terlaksana').length;

  const keterlaksanaanPct = total > 0 ? Math.round(((selesaiCount + prosesCount) / total) * 100) : 0;
  const selesaiPct = total > 0 ? Math.round((selesaiCount / total) * 100) : 0;

  const literasiCount = entries.filter(
    (e) => (e.literasi && e.literasi.kegiatanBenahi) || e.fokusBidang === 'Literasi' || e.fokusBidang === 'Literasi & Numerasi'
  ).length;
  const numerasiCount = entries.filter(
    (e) => (e.numerasi && e.numerasi.kegiatanBenahi) || e.fokusBidang === 'Numerasi' || e.fokusBidang === 'Literasi & Numerasi'
  ).length;

  const totalBiaya = entries.reduce((acc, curr) => acc + (curr.estimasiBiaya || 0), 0);
  const distinctKecamatan = new Set(entries.map((e) => e.kecamatan)).size;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div id="metrics-summary-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Sekolah */}
      <div
        id="metric-card-total-sekolah"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Satuan Pendidikan</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <School className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Terpadu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            Tersebar di {distinctKecamatan} Kecamatan
          </p>
        </div>
      </div>

      {/* Keterlaksanaan Program */}
      <div
        id="metric-card-keterlaksanaan"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Keterlaksanaan RTL</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{keterlaksanaanPct}%</span>
            <span className="text-xs text-slate-500 font-medium">({selesaiPct}% Tuntas)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selesaiCount} Selesai · {prosesCount} Berjalan · {belumCount} Belum
          </p>
        </div>
      </div>

      {/* Fokus Literasi */}
      <div
        id="metric-card-literasi"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Agenda Literasi</span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-slate-900">{literasiCount}</div>
          <p className="text-xs text-slate-500 mt-1">
            {total > 0 ? Math.round((literasiCount / total) * 100) : 0}% satuan pendidikan
          </p>
        </div>
      </div>

      {/* Fokus Numerasi */}
      <div
        id="metric-card-numerasi"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Agenda Numerasi</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-slate-900">{numerasiCount}</div>
          <p className="text-xs text-slate-500 mt-1">
            {total > 0 ? Math.round((numerasiCount / total) * 100) : 0}% satuan pendidikan
          </p>
        </div>
      </div>

      {/* Total Anggaran RTL */}
      <div
        id="metric-card-anggaran"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Estimasi Total Dana RTL</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-900 truncate" title={formatRupiah(totalBiaya)}>
            {formatRupiah(totalBiaya)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rata-rata: {total > 0 ? formatRupiah(Math.round(totalBiaya / total)) : 'Rp 0'}
          </p>
        </div>
      </div>
    </div>
  );
};
