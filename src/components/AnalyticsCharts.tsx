import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Target,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Info,
} from 'lucide-react';
import type { IRBEntry, BenchmarkTargets } from '../types';

interface AnalyticsChartsProps {
  entries: IRBEntry[];
  targets: BenchmarkTargets;
  onOpenAdminTargetModal?: () => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  entries,
  targets,
  onOpenAdminTargetModal,
}) => {
  // 1. Data per Kecamatan
  const kecamatanMap: Record<
    string,
    { kecamatan: string; Literasi: number; Numerasi: number; Terpadu: number }
  > = {};

  entries.forEach((e) => {
    const kec = e.kecamatan || 'Lainnya';
    if (!kecamatanMap[kec]) {
      kecamatanMap[kec] = { kecamatan: kec, Literasi: 0, Numerasi: 0, Terpadu: 0 };
    }
    if (e.fokusBidang === 'Literasi') {
      kecamatanMap[kec].Literasi += 1;
    } else if (e.fokusBidang === 'Numerasi') {
      kecamatanMap[kec].Numerasi += 1;
    } else {
      kecamatanMap[kec].Terpadu += 1;
    }
  });

  const kecamatanData = Object.values(kecamatanMap).sort((a, b) => {
    const totalA = a.Literasi + a.Numerasi + a.Terpadu;
    const totalB = b.Literasi + b.Numerasi + b.Terpadu;
    return totalB - totalA;
  });

  // 2. Data Status Keterlaksanaan
  const statusCounts = {
    Selesai: entries.filter((e) => e.statusPelaksanaan === 'Selesai').length,
    'Sedang Berjalan': entries.filter((e) => e.statusPelaksanaan === 'Sedang Berjalan').length,
    'Belum Terlaksana': entries.filter((e) => e.statusPelaksanaan === 'Belum Terlaksana').length,
  };

  const statusPieData = [
    { name: 'Selesai', value: statusCounts.Selesai, color: '#059669' },
    { name: 'Sedang Berjalan', value: statusCounts['Sedang Berjalan'], color: '#d97706' },
    { name: 'Belum Terlaksana', value: statusCounts['Belum Terlaksana'], color: '#dc2626' },
  ].filter((d) => d.value > 0);

  // 3. Benchmark Calculations
  const totalEntries = entries.length;
  const actualKeterlaksanaanPct = totalEntries
    ? Math.round(
        ((statusCounts.Selesai + statusCounts['Sedang Berjalan']) / totalEntries) * 100
      )
    : 0;

  const actualLiterasiCount = entries.filter(
    (e) => (e.literasi && e.literasi.kegiatanBenahi) || e.fokusBidang === 'Literasi' || e.fokusBidang === 'Literasi & Numerasi'
  ).length;
  const actualLiterasiPct = totalEntries
    ? Math.round((actualLiterasiCount / totalEntries) * 100)
    : 0;

  const actualNumerasiCount = entries.filter(
    (e) => (e.numerasi && e.numerasi.kegiatanBenahi) || e.fokusBidang === 'Numerasi' || e.fokusBidang === 'Literasi & Numerasi'
  ).length;
  const actualNumerasiPct = totalEntries
    ? Math.round((actualNumerasiCount / totalEntries) * 100)
    : 0;

  const sekolahCount = entries.length;

  const getBenchmarkBadge = (actual: number, target: number) => {
    const diff = actual - target;
    if (diff >= 0) {
      return {
        label: `Tercapai (+${diff}%)`,
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-700" />,
      };
    }
    if (diff >= -10) {
      return {
        label: `Mendekati (${diff}%)`,
        className: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: <TrendingUp className="w-3 h-3 text-amber-700" />,
      };
    }
    return {
      label: `Perlu Akselerasi (${diff}%)`,
      className: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <AlertTriangle className="w-3 h-3 text-rose-700" />,
    };
  };

  const statusKeterlaksanaanBadge = getBenchmarkBadge(
    actualKeterlaksanaanPct,
    targets.targetKeterlaksanaanPct
  );
  const statusLiterasiBadge = getBenchmarkBadge(
    actualLiterasiPct,
    targets.targetLiterasiPct
  );
  const statusNumerasiBadge = getBenchmarkBadge(
    actualNumerasiPct,
    targets.targetNumerasiPct
  );

  return (
    <div id="analytics-section" className="space-y-5">
      {/* Benchmark Summary Card */}
      <div
        id="benchmark-comparison-card"
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Evaluasi Capaian Terhadap Benchmark Target Tahunan
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  TA {targets.tahunAjaran}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pembanding target kinerja mutu literasi & numerasi Dinas Pendidikan Lombok Tengah
              </p>
            </div>
          </div>

          {onOpenAdminTargetModal && (
            <button
              id="chart-btn-open-target-modal"
              onClick={onOpenAdminTargetModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              <span>Konfigurasi Target Admin</span>
            </button>
          )}
        </div>

        {/* 4 KPI Progress Comparisons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* 1. Keterlaksanaan RTL */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">Keterlaksanaan RTL</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusKeterlaksanaanBadge.className}`}
                >
                  {statusKeterlaksanaanBadge.icon}
                  {statusKeterlaksanaanBadge.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">
                  {actualKeterlaksanaanPct}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / Target {targets.targetKeterlaksanaanPct}%
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(actualKeterlaksanaanPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Realisasi: {statusCounts.Selesai + statusCounts['Sedang Berjalan']} RTL</span>
                <span>Ambang Batas: {targets.targetKeterlaksanaanPct}%</span>
              </div>
            </div>
          </div>

          {/* 2. Fokus Literasi */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">Partisipasi Literasi</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusLiterasiBadge.className}`}
                >
                  {statusLiterasiBadge.icon}
                  {statusLiterasiBadge.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-teal-800">
                  {actualLiterasiPct}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / Target {targets.targetLiterasiPct}%
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(actualLiterasiPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{actualLiterasiCount} Kegiatan Literasi</span>
                <span>Target: {targets.targetLiterasiPct}%</span>
              </div>
            </div>
          </div>

          {/* 3. Fokus Numerasi */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">Partisipasi Numerasi</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusNumerasiBadge.className}`}
                >
                  {statusNumerasiBadge.icon}
                  {statusNumerasiBadge.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-indigo-800">
                  {actualNumerasiPct}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / Target {targets.targetNumerasiPct}%
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(actualNumerasiPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{actualNumerasiCount} Kegiatan Numerasi</span>
                <span>Target: {targets.targetNumerasiPct}%</span>
              </div>
            </div>
          </div>

          {/* 4. Partisipasi Sekolah */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">Satuan Pendidikan</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                  <Award className="w-3 h-3 text-slate-600" />
                  {Math.round((sekolahCount / (targets.targetTotalSekolah || 1)) * 100)}% Rasio
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">{sekolahCount}</span>
                <span className="text-xs text-slate-500 font-medium">
                  / Target {targets.targetTotalSekolah} Sekolah
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.round((sekolahCount / (targets.targetTotalSekolah || 1)) * 100),
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Terdata se-Lombok Tengah</span>
                <span>Target: {targets.targetTotalSekolah}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kebijakan Note Banner */}
        {targets.catatanKebijakan && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-700">Pedoman Benchmark:</strong>{' '}
              {targets.catatanKebijakan}
            </span>
          </div>
        )}
      </div>

      {/* Main Charts Grid */}
      <div id="analytics-charts-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Distribusi Kecamatan with Benchmark Line */}
        <div
          id="chart-card-kecamatan"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-2 flex flex-col"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Sebaran Kegiatan IRB per Kecamatan vs Benchmark Target
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Garis merah putus-putus menandai target benchmark minimum (
                <strong className="text-rose-600">
                  {targets.targetKegiatanPerKecamatan} kegiatan/kecamatan
                </strong>
                )
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Target: {targets.targetKegiatanPerKecamatan}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {kecamatanData.length} Kecamatan
              </span>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={kecamatanData}
                margin={{ top: 18, right: 10, left: -20, bottom: 25 }}
              >
                <XAxis
                  dataKey="kecamatan"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  height={50}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
                />
                {/* Benchmark Reference Line */}
                <ReferenceLine
                  y={targets.targetKegiatanPerKecamatan}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Target (${targets.targetKegiatanPerKecamatan})`,
                    fill: '#dc2626',
                    fontSize: 10,
                    position: 'top',
                  }}
                />
                <Bar
                  dataKey="Literasi"
                  stackId="a"
                  fill="#0d9488"
                  radius={[0, 0, 0, 0]}
                  name="Literasi"
                />
                <Bar
                  dataKey="Numerasi"
                  stackId="a"
                  fill="#4f46e5"
                  radius={[0, 0, 0, 0]}
                  name="Numerasi"
                />
                <Bar
                  dataKey="Terpadu"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[3, 3, 0, 0]}
                  name="Literasi & Numerasi"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Pelaksanaan Donut */}
        <div
          id="chart-card-status"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Status Keterlaksanaan Tindak Lanjut
            </h2>
            <p className="text-xs text-slate-500">
              Target Keterlaksanaan:{' '}
              <strong className="text-emerald-700">{targets.targetKeterlaksanaanPct}%</strong>{' '}
              (Realisasi: <strong>{actualKeterlaksanaanPct}%</strong>)
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center my-2">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} Sekolah`, 'Jumlah']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Tidak ada data status</div>
            )}
          </div>

          {/* Legend Breakdown pills */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div className="flex flex-col items-center text-center p-1.5 rounded bg-emerald-50">
              <span className="text-[11px] font-medium text-emerald-800">Selesai</span>
              <span className="text-sm font-bold text-emerald-900">{statusCounts.Selesai}</span>
            </div>
            <div className="flex flex-col items-center text-center p-1.5 rounded bg-amber-50">
              <span className="text-[11px] font-medium text-amber-800">Berjalan</span>
              <span className="text-sm font-bold text-amber-900">
                {statusCounts['Sedang Berjalan']}
              </span>
            </div>
            <div className="flex flex-col items-center text-center p-1.5 rounded bg-rose-50">
              <span className="text-[11px] font-medium text-rose-800">Belum</span>
              <span className="text-sm font-bold text-rose-900">
                {statusCounts['Belum Terlaksana']}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
