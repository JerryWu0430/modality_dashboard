"use client";

import React from 'react';
import { 
  IconPlus, 
  IconPlayerPlay, 
  IconDownload, 
  IconLoader2, 
  IconAlertCircle 
} from '@tabler/icons-react';
import { TableRow } from '../types';

interface ActionButtonsProps {
  tableRows: TableRow[];
  uploading: boolean;
  exporting: boolean;
  exportError: string | null;
  onAddRow: () => void;
  onGenerateAll: () => void;
  onExportAll: () => void;
  onTestModal: () => void; // For debugging - can be removed later
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  tableRows,
  uploading,
  exporting,
  exportError,
  onAddRow,
  onGenerateAll,
  onExportAll,
  onTestModal,
}) => {
  const resultCount = tableRows.filter(row => row.result && row.result.type === 'image').length;
  const isGenerating = tableRows.some(row => row.isGenerating);

  return (
    <>
      <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex flex-col gap-2">
          <button 
            onClick={onAddRow}
            className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-neutral-700 text-sm"
          >
            <IconPlus className="h-4 w-4" />
            Add Row
          </button>
          
          <button 
            onClick={onGenerateAll}
            disabled={uploading || isGenerating}
            className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconPlayerPlay className="h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
          
          <button 
            onClick={onExportAll}
            disabled={exporting || tableRows.every(row => !row.result)}
            className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-neutral-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconDownload className="h-4 w-4" />
            )}
            {exporting ? 'Exporting...' : (
              resultCount > 0 ? `Export ZIP (${resultCount})` : 'Export ZIP'
            )}
          </button>
          
          {/* Debug button - can be removed */}
          <button 
            onClick={onTestModal}
            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            Test Modal
          </button>
        </div>
      </div>
      
      {exportError && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 text-red-600 text-xs">
            <IconAlertCircle className="h-4 w-4" />
            {exportError}
          </div>
        </div>
      )}
    </>
  );
}; 