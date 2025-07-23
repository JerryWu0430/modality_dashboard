"use client";

import React from 'react';
import { IconSettings } from '@tabler/icons-react';
import { BackgroundSection } from './BackgroundSection';
import { ModelSection } from './ModelSection';
import { PromptsSection } from './PromptsSection';
import { Background, Model, Prompt, ExpandedSections } from '../types';

interface ControlsPanelProps {
  backgrounds: Background[];
  models: Model[];
  prompts: Prompt[];
  selectedBackground: string;
  selectedModel: string;
  selectedPrompt: string;
  expandedSections: ExpandedSections;
  onBackgroundSelect: (backgroundId: string) => void;
  onModelSelect: (modelId: string) => void;
  onPromptSelect: (promptId: string) => void;
  onToggleSection: (section: keyof ExpandedSections) => void;
  onDragStart: (type: string, value: string) => void;
  onDragEnd: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  backgrounds,
  models,
  prompts,
  selectedBackground,
  selectedModel,
  selectedPrompt,
  expandedSections,
  onBackgroundSelect,
  onModelSelect,
  onPromptSelect,
  onToggleSection,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <IconSettings className="h-4 w-4" />
          Controls
        </h2>
      </div>
      
      <div className="flex-1 flex flex-col h-0">
        <BackgroundSection
          backgrounds={backgrounds}
          selectedBackground={selectedBackground}
          expanded={expandedSections.background}
          onToggle={() => onToggleSection('background')}
          onSelect={onBackgroundSelect}
          onDragStart={(e, bgId) => {
            e.dataTransfer.setData("text/plain", `background|||${bgId}`);
            onDragStart("background", bgId);
          }}
          onDragEnd={onDragEnd}
        />
        
        <ModelSection
          models={models}
          selectedModel={selectedModel}
          expanded={expandedSections.model}
          onToggle={() => onToggleSection('model')}
          onSelect={onModelSelect}
          onDragStart={(e, modelId) => {
            e.dataTransfer.setData("text/plain", `model|||${modelId}`);
            onDragStart("model", modelId);
          }}
          onDragEnd={onDragEnd}
        />
        
        <PromptsSection
          prompts={prompts}
          selectedPrompt={selectedPrompt}
          expanded={expandedSections.prompts}
          onToggle={() => onToggleSection('prompts')}
          onSelect={onPromptSelect}
          onDragStart={(e, promptId) => {
            e.dataTransfer.setData("text/plain", `prompt|||${promptId}`);
            onDragStart("prompt", promptId);
          }}
          onDragEnd={onDragEnd}
        />
      </div>
    </div>
  );
}; 