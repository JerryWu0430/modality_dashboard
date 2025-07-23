"use client";

import React from 'react';
import { IconPhoto } from '@tabler/icons-react';
import { ActionButtons } from './ActionButtons';
import { UploadArea } from './UploadArea';
import { ImageGallery } from './ImageGallery';
import { TableRow } from '../types';

interface AssetsPanelProps {
  tableRows: TableRow[];
  uploadedImages: string[];
  uploading: boolean;
  uploadError: string | null;
  exporting: boolean;
  exportError: string | null;
  onAddRow: () => void;
  onGenerateAll: () => void;
  onExportAll: () => void;
  onTestModal: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onImageDragStart: (e: React.DragEvent, image: string) => void;
  onDragEnd: () => void;
}

export const AssetsPanel: React.FC<AssetsPanelProps> = ({
  tableRows,
  uploadedImages,
  uploading,
  uploadError,
  exporting,
  exportError,
  onAddRow,
  onGenerateAll,
  onExportAll,
  onTestModal,
  onFileUpload,
  onRemoveImage,
  onImageDragStart,
  onDragEnd,
}) => {
  return (
    <div className="w-80 bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800 flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <IconPhoto className="h-4 w-4" />
          Assets
        </h2>
      </div>
      
      <ActionButtons
        tableRows={tableRows}
        uploading={uploading}
        exporting={exporting}
        exportError={exportError}
        onAddRow={onAddRow}
        onGenerateAll={onGenerateAll}
        onExportAll={onExportAll}
        onTestModal={onTestModal}
      />
      
      <UploadArea
        uploading={uploading}
        uploadError={uploadError}
        onFileUpload={onFileUpload}
      />

      <ImageGallery
        uploadedImages={uploadedImages}
        onRemoveImage={onRemoveImage}
        onDragStart={onImageDragStart}
        onDragEnd={onDragEnd}
      />
    </div>
  );
}; 