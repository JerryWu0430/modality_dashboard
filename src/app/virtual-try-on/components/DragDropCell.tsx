"use client";

import React from 'react';
import { 
  IconUser, 
  IconUpload, 
  IconBulb, 
  IconPalette, 
  IconTrash,
  IconPlayerPlay,
  IconLoader2,
  IconAlertCircle,
  IconMaximize
} from '@tabler/icons-react';
import { CellContent, TableRow } from '../types';

interface DragDropCellProps {
  cellType: 'model' | 'clothingItems' | 'prompt' | 'background' | 'result';
  content: CellContent | CellContent[];
  row: TableRow;
  isValidDropZone: boolean;
  className: string;
  onDrop: (e: React.DragEvent, rowId: number, cellType: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onClearCell: (rowId: number, cellType: string, itemIndex?: number) => void;
  onGenerateRow?: (rowId: number) => void;
  onResultClick?: (row: TableRow) => void;
}

export const DragDropCell: React.FC<DragDropCellProps> = ({
  cellType,
  content,
  row,
  isValidDropZone,
  className,
  onDrop,
  onDragOver,
  onClearCell,
  onGenerateRow,
  onResultClick,
}) => {
  const renderCellContent = () => {
    switch (cellType) {
      case 'model':
        const modelContent = content as CellContent;
        return (
          <>
            {modelContent && modelContent.type === 'model' ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="text-2xl mb-1">{modelContent.value?.avatar}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {modelContent.value?.name}
                </div>
                <button
                  onClick={() => onClearCell(row.id, 'model')}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                >
                  <IconTrash className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <IconUser className="h-8 w-8 text-gray-400 mx-auto mb-1 opacity-30" />
              </div>
            )}
          </>
        );

      case 'clothingItems':
        const clothingItems = content as CellContent[];
        return (
          <>
            {clothingItems.length > 0 ? (
              <div className="relative w-full h-full">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  {clothingItems.map((item, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={item?.value} 
                        alt={`Clothing ${index + 1}`} 
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          console.error('Image failed to load:', item?.value);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <button
                        onClick={() => onClearCell(row.id, 'clothingItems', index)}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                      >
                        <IconTrash className="h-2 w-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <IconUpload className="h-8 w-8 text-gray-400 mx-auto mb-1 opacity-30" />
              </div>
            )}
          </>
        );

      case 'prompt':
        const promptContent = content as CellContent;
        return (
          <>
            {promptContent && promptContent.type === 'prompt' ? (
              <div className="relative w-full h-full">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                    {promptContent.value?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Prompt
                  </div>
                </div>
                <button
                  onClick={() => onClearCell(row.id, 'prompt')}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                >
                  <IconTrash className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <IconBulb className="h-8 w-8 text-gray-400 mx-auto mb-1 opacity-30" />
              </div>
            )}
          </>
        );

      case 'background':
        const backgroundContent = content as CellContent;
        return (
          <>
            {backgroundContent && backgroundContent.type === 'background' ? (
              <div className="relative w-full h-full">
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-md ${backgroundContent.value?.preview} mx-auto mb-1`} />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {backgroundContent.value?.name}
                  </div>
                </div>
                <button
                  onClick={() => onClearCell(row.id, 'background')}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                >
                  <IconTrash className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <IconPalette className="h-8 w-8 text-gray-400 mx-auto mb-1 opacity-30" />
              </div>
            )}
          </>
        );

      case 'result':
        return (
          <>
            {row.isGenerating ? (
              <IconLoader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
            ) : row.generationError ? (
              <div className="text-center">
                <IconAlertCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                <div className="text-xs text-red-500">Error</div>
              </div>
            ) : row.result && row.result.type === 'image' ? (
              <div 
                className="relative w-full h-full group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onResultClick?.(row);
                }}
              >
                <img 
                  src={row.result.value} 
                  alt="Try-on result" 
                  className="w-full h-full object-cover rounded-lg transition-transform hover:scale-105"
                  onError={(e) => {
                    console.error('Result image failed to load:', row.result?.value);
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                  <IconMaximize className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => onGenerateRow?.(row.id)}
                disabled={!row.model || !row.clothingItems.length || row.isGenerating}
                className="p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate try-on for this row"
              >
                <IconPlayerPlay className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </button>
            )}
            {row.generationError && (
              <div className="absolute top-0 left-0 w-full h-full bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-xs text-red-600 dark:text-red-400 text-center p-1">
                  {row.generationError}
                </div>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  if (cellType === 'result') {
    return (
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-gray-200 dark:border-neutral-700 flex items-center justify-center relative">
        {renderCellContent()}
      </div>
    );
  }

  return (
    <div 
      className={className}
      onDrop={(e) => {
        if (isValidDropZone) {
          onDrop(e, row.id, cellType);
        } else {
          e.preventDefault();
        }
      }}
      onDragOver={onDragOver}
    >
      {renderCellContent()}
    </div>
  );
}; 