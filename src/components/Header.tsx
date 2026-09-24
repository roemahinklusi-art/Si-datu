import React from 'react';
import {
  RefreshCw,
  Download,
  LogOut,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Database,
  Sliders,
} from 'lucide-react';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header id="app-main-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Title branding */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              id="header-brand-icon"
              className="w-12 h-12 flex items-center justify-center shrink-0 drop-shadow-sm"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Lambang_Kabupaten_Lombok_Tengah.gif" 
                alt="Logo Kabupaten Lombok Tengah" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 id="header-main-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                SI DATU
              </h1>
              <p className="text-sm font-medium text-slate-700 line-clamp-1 mt-0.5">
                Sistem Informasi Data Terpadu
              </p>
              <p className="text-xs text-slate-500 line-clamp-1">
                Dinas Dikbud Kab. Lombok Tengah
              </p>
            </div>
          </div>

          {/* Right Action Toolbar Removed */}
        </div>
      </div>
    </header>
  );
};
