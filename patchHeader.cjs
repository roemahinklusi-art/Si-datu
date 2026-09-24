const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/import type \{ User \} from 'firebase\/auth';\n/, '');

code = code.replace(/interface HeaderProps \{[\s\S]*?\}/, `interface HeaderProps {
  activeSheetTitle: string;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onExportCSV: () => void;
  onOpenAdminTargetModal?: () => void;
}`);

code = code.replace(/export const Header: React\.FC<HeaderProps> = \(\{[\s\S]*?\}\) => \{/, `export const Header: React.FC<HeaderProps> = ({
  activeSheetTitle,
  onRefreshData,
  isRefreshing,
  onExportCSV,
  onOpenAdminTargetModal,
}) => {`);

// Remove "Sheet Sync Status indicator" logic
code = code.replace(/\{\/\* Sheet Sync Status indicator \*\/\}[\s\S]*?\{\/\* Quick Actions \*\/\}/, `{/* Sheet Sync Status indicator */}
            <div
              id="header-sheet-status"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium bg-emerald-50 border-emerald-200 text-emerald-800"
            >
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold leading-tight">
                  Sumber Data Publik CSV
                </span>
                <span className="text-[11px] opacity-80 max-w-[190px] truncate leading-tight">
                  {activeSheetTitle}
                </span>
              </div>
            </div>

            {/* Quick Actions */}`);

// Remove Google Drive Picker Trigger
code = code.replace(/\{\/\* Google Drive Picker Trigger \*\/\}[\s\S]*?\{\/\* Auth section \*\/\}/, `{/* Auth section */}`);

// Remove Auth section entirely
code = code.replace(/\{\/\* Auth section \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/header>/, `          </div>
        </div>
      </div>
    </header>`);

fs.writeFileSync('src/components/Header.tsx', code);
