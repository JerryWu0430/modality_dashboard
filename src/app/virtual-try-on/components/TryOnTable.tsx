"use client";

import React from 'react';
import { MinimalScrollBar } from '@/components/ui/minimal-scroll-bar';
import { DragDropCell } from './DragDropCell';
import { TableRow } from '../types';

interface TryOnTableProps {
  tableRows: TableRow[];
  currentDragType: string | null;
  onDrop: (e: React.DragEvent, rowId: number, cellType: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onClearCell: (rowId: number, cellType: string, itemIndex?: number) => void;
  onGenerateRow: (rowId: number) => void;
  onResultClick: (row: TableRow) => void;
}

export const TryOnTable: React.FC<TryOnTableProps> = ({
  tableRows,
  currentDragType,
  onDrop,
  onDragOver,
  onClearCell,
  onGenerateRow,
  onResultClick,
}) => {
  const isValidDropZone = (cellType: string) => {
    if (!currentDragType) return true;
    
    switch (currentDragType) {
      case "model":
        return cellType === "model";
      case "image":
        return cellType === "clothingItems";
      case "prompt":
        return cellType === "prompt";
      case "background":
        return cellType === "background";
      default:
        return false;
    }
  };

  const getDropZoneClasses = (cellType: string, baseClasses: string) => {
    if (!currentDragType) return baseClasses;
    
    const isValid = isValidDropZone(cellType);
    if (isValid) {
      return `${baseClasses} opacity-100 ring-1 ring-gray-400 dark:ring-gray-500 bg-gray-50 dark:bg-neutral-700`;
    } else {
      return `${baseClasses} cursor-not-allowed opacity-30`;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="bg-white dark:bg-neutral-900 h-full flex flex-col">
        <MinimalScrollBar className="flex-1">
          <div>
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 dark:bg-neutral-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                    Model
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                    Clothing Items (2 max)
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                    Prompt
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                    Background
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {tableRows.map((row) => (
                  <tr key={row.id}>
                    {/* Model Column */}
                    <td className="px-6 py-4">
                      <DragDropCell
                        cellType="model"
                        content={row.model}
                        row={row}
                        isValidDropZone={isValidDropZone('model')}
                        className={getDropZoneClasses('model', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative")}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClearCell={onClearCell}
                      />
                    </td>

                    {/* Clothing Items Column */}
                    <td className="px-6 py-4">
                      <DragDropCell
                        cellType="clothingItems"
                        content={row.clothingItems}
                        row={row}
                        isValidDropZone={isValidDropZone('clothingItems')}
                        className={getDropZoneClasses('clothingItems', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative")}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClearCell={onClearCell}
                      />
                    </td>

                    {/* Prompt Column */}
                    <td className="px-6 py-4">
                      <DragDropCell
                        cellType="prompt"
                        content={row.prompt}
                        row={row}
                        isValidDropZone={isValidDropZone('prompt')}
                        className={getDropZoneClasses('prompt', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative p-2")}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClearCell={onClearCell}
                      />
                    </td>

                    {/* Background Column */}
                    <td className="px-6 py-4">
                      <DragDropCell
                        cellType="background"
                        content={row.background}
                        row={row}
                        isValidDropZone={isValidDropZone('background')}
                        className={getDropZoneClasses('background', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative p-2")}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClearCell={onClearCell}
                      />
                    </td>

                    {/* Result Column */}
                    <td className="px-6 py-4">
                      <DragDropCell
                        cellType="result"
                        content={row.result}
                        row={row}
                        isValidDropZone={false}
                        className=""
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClearCell={onClearCell}
                        onGenerateRow={onGenerateRow}
                        onResultClick={onResultClick}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MinimalScrollBar>
      </div>
    </div>
  );
}; 