import React, { useState } from 'react';
import {
  Eye,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { IRBEntry } from '../types';

interface DataTableProps {
  entries: IRBEntry[];
  onSelectEntry: (entry: IRBEntry) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ entries, onSelectEntry }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<'namaSekolah' | 'kecamatan' | 'estimasiBiaya' | 'statusPelaksanaan'>('namaSekolah');
  const [sortAsc, setSortAsc] = useState(true);

  // Sorting
  const sortedEntries = [...entries].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
    }
    if (typeof valA === 'number') {
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = sortedEntries.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: 'namaSekolah' | 'kecamatan' | 'estimasiBiaya' | 'statusPelaksanaan') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Selesai') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Selesai
        </span>
      );
    }
    if (status === 'Sedang Berjalan') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3" />
          Berjalan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle className="w-3 h-3" />
        Belum
      </span>
    );
  };

  return (
    <div id="data-table-container" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Table Header Bar */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Daftar Rencana Tindak Lanjut (RTL) Sekolah
          </h2>
          <p className="text-xs text-slate-500">
            Klik baris atau tombol detail untuk menelaah rencana aksi, indikator, anggaran, dan kendala
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500">Tampilkan:</span>
          <select
            id="table-select-perpage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={10}>10 data</option>
            <option value={20}>20 data</option>
            <option value={50}>50 data</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto w-full">
        <table id="main-irb-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-emerald-700 select-none min-w-[200px]"
                onClick={() => handleSort('namaSekolah')}
              >
                <div className="flex items-center gap-1">
                  <span>Satuan Pendidikan</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-emerald-700 select-none min-w-[140px]"
                onClick={() => handleSort('kecamatan')}
              >
                <div className="flex items-center gap-1">
                  <span>Kecamatan</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 min-w-[340px]">Rencana Benahi Terpadu (Literasi & Numerasi)</th>
              <th className="py-3 px-4 min-w-[140px]">Waktu Pelaksanaan</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-emerald-700 select-none text-center min-w-[110px]"
                onClick={() => handleSort('statusPelaksanaan')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {paginatedEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  Tidak ada data yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              paginatedEntries.map((entry, idx) => (
                <tr
                  key={entry.id}
                  id={`table-row-${entry.id}`}
                  onClick={() => onSelectEntry(entry)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* No */}
                  <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                    {startIndex + idx + 1}
                  </td>

                  {/* Satuan Pendidikan */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {entry.namaSekolah}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      NPSN: <span className="font-mono text-slate-700 font-medium">{entry.npsn || '-'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal truncate max-w-[220px]">
                      Kepsek: {entry.namaKepalaSekolah || entry.namaResponden || '-'}
                    </div>
                  </td>

                  {/* Kecamatan & Jenjang */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">Kec. {entry.kecamatan}</div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Jenjang {entry.jenjang || 'SD'}
                    </span>
                  </td>

                  {/* Rencana Benahi Terpadu: Literasi & Numerasi */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    {/* Literasi */}
                    {entry.literasi && entry.literasi.kegiatanBenahi ? (
                      <div className="flex items-start gap-1.5">
                        <span className="inline-flex shrink-0 items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          Literasi
                        </span>
                        <p className="line-clamp-1 text-[11px] text-slate-700 leading-snug">
                          {entry.literasi.kegiatanBenahi}
                        </p>
                      </div>
                    ) : null}

                    {/* Numerasi */}
                    {entry.numerasi && entry.numerasi.kegiatanBenahi ? (
                      <div className="flex items-start gap-1.5">
                        <span className="inline-flex shrink-0 items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Numerasi
                        </span>
                        <p className="line-clamp-1 text-[11px] text-slate-700 leading-snug">
                          {entry.numerasi.kegiatanBenahi}
                        </p>
                      </div>
                    ) : null}

                    {/* Fallback if neither specific child exists */}
                    {!entry.literasi?.kegiatanBenahi && !entry.numerasi?.kegiatanBenahi && (
                      <p className="line-clamp-2 text-[11px] text-slate-700">
                        {entry.kegiatanBenahi}
                      </p>
                    )}
                  </td>

                  {/* Waktu Pelaksanaan */}
                  <td className="py-3.5 px-4">
                    <div className="text-[11px] font-medium text-slate-800 line-clamp-2">
                      {entry.waktuRencanaKegiatan || entry.waktuPelaksanaan || '-'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sumber: {entry.sumberDana || 'BOS Reguler'}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {renderStatusBadge(entry.statusPelaksanaan)}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`btn-detail-${entry.id}`}
                      onClick={() => onSelectEntry(entry)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors"
                      title="Lihat Rincian Rencana Tindak Lanjut Terpadu"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs text-slate-600">
          <div>
            Halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span> ({sortedEntries.length} total data)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="table-btn-prev"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">{currentPage}</span>
            <button
              id="table-btn-next"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
