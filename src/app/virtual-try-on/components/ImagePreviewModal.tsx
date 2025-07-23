"use client";

import React, { useEffect } from 'react';
import { IconX, IconDownload } from '@tabler/icons-react';
import { SelectedImage } from '../types';

interface ImagePreviewModalProps {
  selectedImage: SelectedImage | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  selectedImage,
  onClose,
}) => {
  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        onClose();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, onClose]);

  // Handle modal background click
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Download single image
  const handleDownload = () => {
    if (!selectedImage) return;
    
    const link = document.createElement('a');
    link.href = selectedImage.url;
    link.download = `result_row${selectedImage.rowId}_${selectedImage.modelName.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!selectedImage) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={handleModalBackdropClick}
    >
      <div className="relative bg-white dark:bg-neutral-900 rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Row {selectedImage.rowId} - {selectedImage.modelName}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({selectedImage.clothingCount} clothing item{selectedImage.clothingCount !== 1 ? 's' : ''})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <IconX className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex items-center justify-center p-6 min-h-[400px] max-h-[70vh] overflow-hidden">
          <img
            src={selectedImage.url}
            alt={`Try-on result for Row ${selectedImage.rowId}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onError={(e) => {
              console.error('Modal image failed to load:', selectedImage.url);
            }}
          />
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-neutral-700">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <IconDownload className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}; 