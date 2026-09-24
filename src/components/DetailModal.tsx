import React, { useState } from 'react';
import {
  X,
  School,
  User,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  Calculator,
  Target,
  FileText,
  Layers,
} from 'lucide-react';
import type { IRBEntry, PlanDetail } from '../types';

interface DetailModalProps {
  entry: IRBEntry | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ entry, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terpadu' | 'literasi' | 'numerasi'>('terpadu');

  if (!entry) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tuntas / Selesai
          </span>
        );
      case 'Sedang Berjalan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Sedang Berjalan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5" />
            Belum Terlaksana
          </span>
        );
    }
  };

  const renderPlanSection = (plan: PlanDetail | undefined, fallbackLabel: string, themeColor: 'teal' | 'indigo') => {
    if (!plan) {
      return (
        <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Data {fallbackLabel} belum tersedia untuk satuan pendidikan ini.
        </div>
      );
    }

    const isTeal = themeColor === 'teal';

    return (
      <div className="space-y-4">
        {/* Indikator Rapor */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
          <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isTeal ? 'text-teal-800' : 'text-indigo-800'}`}>
            1. Identifikasi (Indikator Rapor Pendidikan)
          </span>
          <p className="text-sm font-semibold text-slate-900">{plan.indikatorRapor}</p>
          {plan.identifikasiMasalah && (
            <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-700">Masalah Teridentifikasi: </span>
              {plan.identifikasiMasalah}
            </p>
          )}
        </div>

        {/* Akar Masalah */}
        <div className="border border-amber-200/80 rounded-xl p-4 bg-amber-50/30">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            2. Refleksi (Akar Masalah)
          </span>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {plan.akarMasalah || 'Tidak disebutkan'}
          </p>
        </div>

        {/* Kegiatan Benahi */}
        <div className={`border rounded-xl p-4 ${isTeal ? 'border-teal-200 bg-teal-50/40' : 'border-indigo-200 bg-indigo-50/40'}`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isTeal ? 'text-teal-800' : 'text-indigo-800'}`}>
            3. Benahi (Rencana Kegiatan Aksi)
          </span>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed mb-3">
            {plan.kegiatanBenahi || '-'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200/60 text-slate-600">
            <div>
              <span className="font-semibold text-slate-800">Sasaran: </span>
              {plan.sasaranKegiatan}
            </div>
            <div>
              <span className="font-semibold text-slate-800">Penanggung Jawab (PIC): </span>
              {plan.penanggungJawab}
            </div>
            <div>
              <span className="font-semibold text-slate-800">Waktu Pelaksanaan: </span>
              {plan.waktuPelaksanaan || '-'}
            </div>
            <div>
              <span className="font-semibold text-slate-800">Sumber Dana: </span>
              {plan.sumberDana}
            </div>
          </div>
        </div>

        {/* Indikator Keberhasilan */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Indikator Keberhasilan & Output
          </span>
          <p className="text-xs text-slate-800 leading-relaxed">
            {plan.indikatorKeberhasilan || '-'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-content-card"
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {entry.jenjang || 'SD'}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Kecamatan {entry.kecamatan}
                </span>
                {entry.npsn && (
                  <span className="text-xs text-slate-600 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    NPSN: {entry.npsn}
                  </span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Terpadu Literasi & Numerasi
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
                {entry.namaSekolah}
              </h2>
            </div>
          </div>
          <button
            id="modal-btn-close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('terpadu')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'terpadu'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Ikhtisar Terpadu
          </button>
          <button
            onClick={() => setActiveTab('literasi')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'literasi'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Rencana Literasi (A.1)
          </button>
          <button
            onClick={() => setActiveTab('numerasi')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'numerasi'
                ? 'border-indigo-600 text-indigo-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Rencana Numerasi (A.2)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-sm text-slate-700">
          {/* Top Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500 block">Kepala Sekolah / PIC:</span>
                <span className="font-semibold text-slate-800">{entry.namaKepalaSekolah || entry.namaResponden || '-'}</span>
                <span className="text-slate-500 block text-[11px]">({entry.jabatanResponden})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500 block">Waktu Rencana Kegiatan:</span>
                <span className="font-semibold text-slate-800">{entry.waktuRencanaKegiatan || entry.waktuPelaksanaan || '-'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500 block">Anggaran & Sumber:</span>
                <span className="font-semibold text-slate-800">{formatRupiah(entry.estimasiBiaya)}</span>
                <span className="text-emerald-700 block text-[11px] font-medium">{entry.sumberDana || 'BOS Reguler'}</span>
              </div>
            </div>
          </div>

          {/* Tab 1: Ikhtisar Terpadu */}
          {activeTab === 'terpadu' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-700">Status Keterlaksanaan:</span>
                {getStatusBadge(entry.statusPelaksanaan)}
              </div>

              {/* Grid of Literasi vs Numerasi side-by-side or stacked */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Literasi Summary Card */}
                <div className="border border-teal-200 rounded-xl p-4 bg-teal-50/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-teal-800 inline-flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        Rencana Literasi
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        Indikator A.1
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      <strong className="text-slate-800 block mb-0.5">Akar Masalah:</strong>
                      {entry.literasi?.akarMasalah || 'Kurangnya kemampuan literasi peserta didik'}
                    </div>
                    <div className="text-xs text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-teal-100">
                      <strong className="text-teal-900 block text-[11px] mb-1">Kegiatan Benahi:</strong>
                      {entry.literasi?.kegiatanBenahi || '-'}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('literasi')}
                    className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-900 self-end underline"
                  >
                    Buka Rincian Literasi →
                  </button>
                </div>

                {/* Numerasi Summary Card */}
                <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-800 inline-flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5" />
                        Rencana Numerasi
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        Indikator A.2
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      <strong className="text-slate-800 block mb-0.5">Akar Masalah:</strong>
                      {entry.numerasi?.akarMasalah || 'Kurangnya kemampuan numerasi peserta didik'}
                    </div>
                    <div className="text-xs text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-indigo-100">
                      <strong className="text-indigo-900 block text-[11px] mb-1">Kegiatan Benahi:</strong>
                      {entry.numerasi?.kegiatanBenahi || '-'}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('numerasi')}
                    className="mt-3 text-xs font-semibold text-indigo-700 hover:text-indigo-900 self-end underline"
                  >
                    Buka Rincian Numerasi →
                  </button>
                </div>
              </div>

              {/* Output & Kendala */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Indikator Keberhasilan Terpadu:</span>
                <p className="text-slate-700 leading-relaxed">
                  {entry.indikatorKeberhasilan || 'Meningkatkan kompetensi literasi dan numerasi seluruh peserta didik.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Rencana Literasi */}
          {activeTab === 'literasi' && renderPlanSection(entry.literasi, 'Literasi', 'teal')}

          {/* Tab 3: Rencana Numerasi */}
          {activeTab === 'numerasi' && renderPlanSection(entry.numerasi, 'Numerasi', 'indigo')}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Satuan Pendidikan Lombok Tengah · Data Terpadu
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
