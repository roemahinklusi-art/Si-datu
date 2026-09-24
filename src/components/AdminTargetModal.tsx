import React, { useState } from 'react';
import {
  X,
  Sliders,
  Target,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { BenchmarkTargets } from '../types';

interface AdminTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targets: BenchmarkTargets;
  onSaveTargets: (newTargets: BenchmarkTargets) => void;
  onResetDefaults: () => void;
}

export const DEFAULT_BENCHMARK_TARGETS: BenchmarkTargets = {
  tahunAjaran: '2024/2025',
  targetKeterlaksanaanPct: 85,
  targetKegiatanPerKecamatan: 40,
  targetLiterasiPct: 80,
  targetNumerasiPct: 80,
  targetTotalSekolah: 588,
  catatanKebijakan:
    'Target Indikator Kinerja Utama (IKU) Dinas Pendidikan & Kebudayaan Kabupaten Lombok Tengah dalam Program Perencanaan Berbasis Data (PBD) IRB Satuan Pendidikan.',
};

export const AdminTargetModal: React.FC<AdminTargetModalProps> = ({
  isOpen,
  onClose,
  targets,
  onSaveTargets,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<BenchmarkTargets>({ ...targets });
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTargets(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  const handleApplyPreset = (preset: 'standar' | 'akselerasi' | 'pemula') => {
    if (preset === 'standar') {
      setFormData({
        ...formData,
        targetKeterlaksanaanPct: 85,
        targetKegiatanPerKecamatan: 40,
        targetLiterasiPct: 80,
        targetNumerasiPct: 80,
        targetTotalSekolah: 588,
      });
    } else if (preset === 'akselerasi') {
      setFormData({
        ...formData,
        targetKeterlaksanaanPct: 95,
        targetKegiatanPerKecamatan: 50,
        targetLiterasiPct: 90,
        targetNumerasiPct: 90,
        targetTotalSekolah: 588,
      });
    } else {
      setFormData({
        ...formData,
        targetKeterlaksanaanPct: 70,
        targetKegiatanPerKecamatan: 30,
        targetLiterasiPct: 70,
        targetNumerasiPct: 70,
        targetTotalSekolah: 500,
      });
    }
  };

  return (
    <div
      id="admin-target-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="admin-target-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Panel Konfigurasi Target Admin
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Benchmark SI DATU
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tetapkan target indikator tahunan sebagai garis pembanding analitik
              </p>
            </div>
          </div>
          <button
            id="admin-btn-close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-600 font-medium">Pilihan Preset Cepat:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset('pemula')}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 transition-colors"
            >
              Realistis (70%)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('standar')}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-[11px] font-semibold text-emerald-700 transition-colors"
            >
              Standar PBD (85%)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('akselerasi')}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-indigo-700 transition-colors"
            >
              Akselerasi (95%)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {/* Tahun Ajaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-target-tahun"
                className="block font-semibold text-slate-800 mb-1"
              >
                Tahun Ajaran / Periode
              </label>
              <input
                id="input-target-tahun"
                type="text"
                value={formData.tahunAjaran}
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                placeholder="2024/2025"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="input-target-sekolah"
                className="block font-semibold text-slate-800 mb-1"
              >
                Target Partisipasi Sekolah (Unit)
              </label>
              <input
                id="input-target-sekolah"
                type="number"
                min="1"
                max="500"
                value={formData.targetTotalSekolah}
                onChange={(e) =>
                  setFormData({ ...formData, targetTotalSekolah: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Target Keterlaksanaan & Kegiatan per Kecamatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-target-keterlaksanaan"
                className="block font-semibold text-slate-800 mb-1 flex items-center justify-between"
              >
                <span>Target Keterlaksanaan RTL</span>
                <span className="font-bold text-emerald-700">
                  {formData.targetKeterlaksanaanPct}%
                </span>
              </label>
              <input
                id="input-target-keterlaksanaan"
                type="range"
                min="30"
                max="100"
                step="5"
                value={formData.targetKeterlaksanaanPct}
                onChange={(e) =>
                  setFormData({ ...formData, targetKeterlaksanaanPct: Number(e.target.value) })
                }
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">
                Ambang batas keberhasilan program tindak lanjut selesai & berjalan.
              </span>
            </div>

            <div>
              <label
                htmlFor="input-target-kegiatan"
                className="block font-semibold text-slate-800 mb-1"
              >
                Target Kegiatan / Kecamatan (Benchmark Chart)
              </label>
              <input
                id="input-target-kegiatan"
                type="number"
                min="1"
                max="20"
                value={formData.targetKegiatanPerKecamatan}
                onChange={(e) =>
                  setFormData({ ...formData, targetKegiatanPerKecamatan: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <span className="text-[10px] text-slate-400">
                Garis referensi pada grafik sebaran kecamatan.
              </span>
            </div>
          </div>

          {/* Target Literasi & Numerasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label
                htmlFor="input-target-literasi"
                className="block font-semibold text-slate-800 mb-1 flex items-center justify-between"
              >
                <span>Target Partisipasi Literasi</span>
                <span className="font-bold text-teal-700">{formData.targetLiterasiPct}%</span>
              </label>
              <input
                id="input-target-literasi"
                type="range"
                min="30"
                max="100"
                step="5"
                value={formData.targetLiterasiPct}
                onChange={(e) =>
                  setFormData({ ...formData, targetLiterasiPct: Number(e.target.value) })
                }
                className="w-full accent-teal-600"
              />
              <span className="text-[10px] text-slate-400">
                Persentase sekolah dengan agenda benahi literasi.
              </span>
            </div>

            <div>
              <label
                htmlFor="input-target-numerasi"
                className="block font-semibold text-slate-800 mb-1 flex items-center justify-between"
              >
                <span>Target Partisipasi Numerasi</span>
                <span className="font-bold text-indigo-700">{formData.targetNumerasiPct}%</span>
              </label>
              <input
                id="input-target-numerasi"
                type="range"
                min="30"
                max="100"
                step="5"
                value={formData.targetNumerasiPct}
                onChange={(e) =>
                  setFormData({ ...formData, targetNumerasiPct: Number(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">
                Persentase sekolah dengan agenda benahi numerasi.
              </span>
            </div>
          </div>

          {/* Catatan Kebijakan */}
          <div className="pt-2 border-t border-slate-100">
            <label
              htmlFor="input-target-catatan"
              className="block font-semibold text-slate-800 mb-1"
            >
              Dasar Kebijakan / Catatan Indikator Mutu
            </label>
            <textarea
              id="input-target-catatan"
              rows={2}
              value={formData.catatanKebijakan || ''}
              onChange={(e) => setFormData({ ...formData, catatanKebijakan: e.target.value })}
              placeholder="Dasar keputusan atau nomor surat edaran..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Actions Bar */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onResetDefaults();
                setFormData(DEFAULT_BENCHMARK_TARGETS);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                id="admin-btn-save"
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Target Benchmark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
