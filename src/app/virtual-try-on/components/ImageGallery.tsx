"use client";

import React from 'react';
import { IconTrash } from '@tabler/icons-react';
import { MinimalScrollBar } from '@/components/ui/minimal-scroll-bar';

interface ImageGalleryProps {
  uploadedImages: string[];
  onRemoveImage: (index: number) => void;
  onDragStart: (e: React.DragEvent, image: string) => void;
  onDragEnd: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  uploadedImages,
  onRemoveImage,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <MinimalScrollBar className="h-full">
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="relative group bg-gray-50 dark:bg-neutral-800 rounded-lg p-1 border border-gray-200 dark:border-neutral-700"
              >
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-20 object-cover rounded cursor-move"
                  draggable
                  onDragStart={(e) => onDragStart(e, image)}
                  onDragEnd={onDragEnd}
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IconTrash className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </MinimalScrollBar>
    </div>
  );
}; 