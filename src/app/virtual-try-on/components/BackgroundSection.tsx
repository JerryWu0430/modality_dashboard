"use client";

import React from 'react';
import { IconPalette, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { MinimalScrollBar } from '@/components/ui/minimal-scroll-bar';
import { Background } from '../types';

interface BackgroundSectionProps {
  backgrounds: Background[];
  selectedBackground: string;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (backgroundId: string) => void;
  onDragStart: (e: React.DragEvent, backgroundId: string) => void;
  onDragEnd: () => void;
}

export const BackgroundSection: React.FC<BackgroundSectionProps> = ({
  backgrounds,
  selectedBackground,
  expanded,
  onToggle,
  onSelect,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div className="h-1/3 border-b border-gray-200 dark:border-neutral-800 flex flex-col">
      <button
        onClick={onToggle}
        className="w-full p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <IconPalette className="h-4 w-4 text-purple-600" />
          <span className="font-medium text-gray-900 dark:text-white">Background</span>
        </div>
        {expanded ? 
          <IconChevronDown className="h-4 w-4" /> : 
          <IconChevronRight className="h-4 w-4" />
        }
      </button>
      
      {expanded && (
        <div className="flex-1 min-h-0">
          <MinimalScrollBar className="h-full">
            <div className="p-2 space-y-1">
              {backgrounds.map((bg) => (
                <div
                  key={bg.id}
                  onClick={() => onSelect(bg.id)}
                  className={`p-2 rounded-lg cursor-move transition-all ${
                    selectedBackground === bg.id 
                      ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                  draggable
                  onDragStart={(e) => onDragStart(e, bg.id)}
                  onDragEnd={onDragEnd}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md ${bg.preview}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {bg.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </MinimalScrollBar>
        </div>
      )}
    </div>
  );
}; 