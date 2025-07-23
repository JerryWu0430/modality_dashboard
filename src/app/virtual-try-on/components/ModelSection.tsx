"use client";

import React from 'react';
import { IconUser, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { MinimalScrollBar } from '@/components/ui/minimal-scroll-bar';
import { Model } from '../types';

interface ModelSectionProps {
  models: Model[];
  selectedModel: string;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (modelId: string) => void;
  onDragStart: (e: React.DragEvent, modelId: string) => void;
  onDragEnd: () => void;
}

export const ModelSection: React.FC<ModelSectionProps> = ({
  models,
  selectedModel,
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
          <IconUser className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-gray-900 dark:text-white">Model</span>
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
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => onSelect(model.id)}
                  className={`p-2 rounded-lg cursor-move transition-all ${
                    selectedModel === model.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                  draggable
                  onDragStart={(e) => onDragStart(e, model.id)}
                  onDragEnd={onDragEnd}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{model.avatar}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {model.name}
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