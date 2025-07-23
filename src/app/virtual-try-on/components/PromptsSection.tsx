"use client";

import React from 'react';
import { IconBulb, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { MinimalScrollBar } from '@/components/ui/minimal-scroll-bar';
import { Prompt } from '../types';

interface PromptsSectionProps {
  prompts: Prompt[];
  selectedPrompt: string;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (promptId: string) => void;
  onDragStart: (e: React.DragEvent, promptId: string) => void;
  onDragEnd: () => void;
}

export const PromptsSection: React.FC<PromptsSectionProps> = ({
  prompts,
  selectedPrompt,
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
          <IconBulb className="h-4 w-4 text-orange-600" />
          <span className="font-medium text-gray-900 dark:text-white">Prompts</span>
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
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => onSelect(prompt.id)}
                  className={`p-2 rounded-lg cursor-move transition-all ${
                    selectedPrompt === prompt.id 
                      ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                  draggable
                  onDragStart={(e) => onDragStart(e, prompt.id)}
                  onDragEnd={onDragEnd}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {prompt.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {prompt.description}
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