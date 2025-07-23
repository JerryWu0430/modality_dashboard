"use client";

import React from 'react';
import { IconUpload, IconLoader2, IconAlertCircle } from '@tabler/icons-react';

interface UploadAreaProps {
  uploading: boolean;
  uploadError: string | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  uploading,
  uploadError,
  onFileUpload,
}) => {
  return (
    <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
      <label className="block">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <div className={`w-full h-24 bg-gray-50 dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg flex flex-col items-center justify-center transition-colors ${
          uploading 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700'
        }`}>
          {uploading ? (
            <>
              <IconLoader2 className="h-6 w-6 text-gray-400 mb-1 animate-spin" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <IconUpload className="h-6 w-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Upload Images
              </span>
            </>
          )}
        </div>
      </label>
      {uploadError && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
          <IconAlertCircle className="h-4 w-4" />
          {uploadError}
        </div>
      )}
    </div>
  );
}; 