"use client";

import React, { useState, useCallback, useEffect } from "react";
import JSZip from 'jszip';
import { 
  apiService
} from "@/lib/api";
import { ControlsPanel } from './ControlsPanel';
import { TryOnTable } from './TryOnTable';
import { AssetsPanel } from './AssetsPanel';
import { ImagePreviewModal } from './ImagePreviewModal';
import { TableRow, SelectedImage, ExpandedSections, Background, Model, Prompt } from '../types';
import { backgrounds, models, prompts } from '../data';

export const VirtualTryOnContent: React.FC = () => {
  // Main state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState("studio");
  const [selectedModel, setSelectedModel] = useState("default");
  const [selectedPrompt, setSelectedPrompt] = useState("casual");
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    background: true,
    model: true,
    prompts: true
  });
  const [tableRows, setTableRows] = useState<TableRow[]>([
    { id: 1, model: null, clothingItems: [], prompt: null, background: null, result: null },
    { id: 2, model: null, clothingItems: [], prompt: null, background: null, result: null },
    { id: 3, model: null, clothingItems: [], prompt: null, background: null, result: null }
  ]);
  const [currentDragType, setCurrentDragType] = useState<string | null>(null);
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  
  // Modal state
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  // Section toggle handler
  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Image upload handler
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Create local preview URL
        const localUrl = URL.createObjectURL(file);
        
        // Upload to S3
        const s3Url = await apiService.uploadToS3(file, 'user-uploads');
        
        return { localUrl, s3Url };
      });

      const results = await Promise.all(uploadPromises);
      
      // Update state with both local preview URLs and S3 URLs
      setUploadedImages(prev => [...prev, ...results.map(r => r.localUrl)]);
      setUploadedImageUrls(prev => [...prev, ...results.map(r => r.s3Url)]);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  // Remove image handler
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent, rowId: number, cellType: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    
    let type: string, value: string;
    
    // Use new delimiter format (|||) or fallback to old format (:)
    const delimiterIndex = data.indexOf("|||");
    if (delimiterIndex !== -1) {
      type = data.substring(0, delimiterIndex);
      value = data.substring(delimiterIndex + 3);
    } else {
      // Fallback to old format for backward compatibility
      const colonIndex = data.indexOf(":");
      type = data.substring(0, colonIndex);
      value = data.substring(colonIndex + 1);
    }
    
    console.log('Drop data received:', { type, value, cellType, rowId, originalData: data });
    
    setTableRows(prev => prev.map(row => {
      if (row.id === rowId) {
        if (cellType === "model" && type === "model") {
          const model = models.find(m => m.id === value);
          return { ...row, model: { type: "model", value: model } };
        } else if (cellType === "clothingItems" && type === "image") {
          // Only allow 2 non-identical images
          const currentItems = row.clothingItems.filter(item => item !== null);
          // Find the corresponding S3 URL for this local preview URL
          const imageIndex = uploadedImages.indexOf(value);
          const s3Url = imageIndex >= 0 ? uploadedImageUrls[imageIndex] : value;
          const imageExists = currentItems.some(item => item?.value === s3Url);
          if (currentItems.length < 2 && !imageExists) {
            console.log('Adding image to clothing items:', s3Url);
            return { ...row, clothingItems: [...currentItems, { type: "image", value: s3Url }] };
          }
        } else if (cellType === "prompt" && type === "prompt") {
          const prompt = prompts.find(p => p.id === value);
          return { ...row, prompt: { type: "prompt", value: prompt } };
        } else if (cellType === "background" && type === "background") {
          const bg = backgrounds.find(b => b.id === value);
          return { ...row, background: { type: "background", value: bg } };
        }
      }
      return row;
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Clear cell handler
  const clearCell = (rowId: number, cellType: string, itemIndex?: number) => {
    setTableRows(prev => prev.map(row => {
      if (row.id === rowId) {
        if (cellType === "clothingItems" && itemIndex !== undefined) {
          const newItems = row.clothingItems.filter((_, index) => index !== itemIndex);
          return { ...row, clothingItems: newItems };
        } else if (cellType === "model") {
          return { ...row, model: null };
        } else if (cellType === "prompt") {
          return { ...row, prompt: null };
        } else if (cellType === "background") {
          return { ...row, background: null };
        }
      }
      return row;
    }));
  };

  // Add row handler
  const addRow = () => {
    const newId = Math.max(...tableRows.map(row => row.id)) + 1;
    const newRow: TableRow = {
      id: newId,
      model: null,
      clothingItems: [],
      prompt: null,
      background: null,
      result: null
    };
    setTableRows(prev => [...prev, newRow]);
  };

  // Generation functions
  const generateSingleRow = async (rowId: number) => {
    const row = tableRows.find(r => r.id === rowId);
    if (!row) return;

    // Validate row has required data
    if (!row.model || !row.clothingItems.length) {
      console.warn('Row missing required data for generation');
      return;
    }

    // Set loading state
    setTableRows(prev => prev.map(r => 
      r.id === rowId 
        ? { ...r, isGenerating: true, generationError: undefined, result: null }
        : r
    ));

    try {
      const clothingUrls = row.clothingItems.map(item => item?.value).filter(Boolean);
      
      // For GPT-4o try-on with model
      if (row.model.type === 'model') {
        // Use GPT-4o generate model endpoint (no need for person image)
        const request = {
          clothing_image_urls: clothingUrls,
          model_preference: row.model.value?.name || 'professional',
          quality: 'high' as const,
          size: '1024x1024' as const,
          output_format: 'jpeg' as const
        };

        const result = await apiService.gptTryOnGenerateModel(request);
        
        // Update row with result
        setTableRows(prev => prev.map(r => 
          r.id === rowId 
            ? { 
                ...r, 
                isGenerating: false, 
                result: { type: 'image', value: result.image_url },
                taskId: result.request_id
              }
            : r
        ));
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setTableRows(prev => prev.map(r => 
        r.id === rowId 
          ? { 
              ...r, 
              isGenerating: false, 
              generationError: error instanceof Error ? error.message : 'Generation failed'
            }
          : r
      ));
    }
  };

  const generateAllRows = async () => {
    const validRows = tableRows.filter(row => 
      row.model && row.clothingItems.length > 0 && !row.isGenerating
    );

    // Generate all valid rows in parallel
    await Promise.all(validRows.map(row => generateSingleRow(row.id)));
  };

  // Helper function to download image as blob
  const downloadImageAsBlob = async (imageUrl: string): Promise<Blob> => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    return response.blob();
  };

  // Export all results as ZIP
  const exportAllResults = async () => {
    setExporting(true);
    setExportError(null);

    try {
      // Get all rows with results
      const rowsWithResults = tableRows.filter(row => 
        row.result && row.result.type === 'image' && row.result.value
      );

      if (rowsWithResults.length === 0) {
        setExportError('No results to export. Please generate some images first.');
        return;
      }

      const zip = new JSZip();
      
      // Download and add each result image to the zip
      const downloadPromises = rowsWithResults.map(async (row, index) => {
        try {
          const imageUrl = row.result!.value;
          const blob = await downloadImageAsBlob(imageUrl);
          
          // Determine file extension from URL or default to jpg
          const urlParts = imageUrl.split('.');
          const extension = urlParts.length > 1 ? urlParts.pop()?.split('?')[0] : 'jpg';
          
          // Create filename with row info
          const modelName = row.model?.value?.name || 'Unknown';
          const clothingCount = row.clothingItems.length;
          const filename = `result_row${row.id}_${modelName.replace(/\s+/g, '_')}_${clothingCount}items.${extension}`;
          
          zip.file(filename, blob);
        } catch (error) {
          console.error(`Failed to download image for row ${row.id}:`, error);
          // Continue with other images even if one fails
        }
      });

      await Promise.all(downloadPromises);

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `virtual-tryon-results-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Exported ${rowsWithResults.length} result images`);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  // Handle result image click
  const handleResultImageClick = (row: TableRow) => {
    console.log('Image clicked:', row); // Debug log
    if (row.result && row.result.type === 'image') {
      const imageData = {
        url: row.result.value,
        rowId: row.id,
        modelName: row.model?.value?.name || 'Unknown Model',
        clothingCount: row.clothingItems.length
      };
      console.log('Setting selected image:', imageData); // Debug log
      setSelectedImage(imageData);
    }
  };

  // Close modal
  const closeModal = () => {
    console.log('Closing modal'); // Debug log
    setSelectedImage(null);
  };

  // Debug: Log selected image state changes
  useEffect(() => {
    console.log('Selected image state changed:', selectedImage);
  }, [selectedImage]);



  return (
    <div className="h-full flex bg-gray-50 dark:bg-neutral-950">
      {/* Left Controls Panel */}
      <ControlsPanel
        backgrounds={backgrounds}
        models={models}
        prompts={prompts}
        selectedBackground={selectedBackground}
        selectedModel={selectedModel}
        selectedPrompt={selectedPrompt}
        expandedSections={expandedSections}
        onBackgroundSelect={setSelectedBackground}
        onModelSelect={setSelectedModel}
        onPromptSelect={setSelectedPrompt}
        onToggleSection={toggleSection}
        onDragStart={setCurrentDragType}
        onDragEnd={() => setCurrentDragType(null)}
      />

      {/* Center Workspace */}
      <div className="flex-1 flex flex-col">
        <TryOnTable
          tableRows={tableRows}
          currentDragType={currentDragType}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClearCell={clearCell}
          onGenerateRow={generateSingleRow}
          onResultClick={handleResultImageClick}
        />
      </div>

      {/* Right Upload Panel */}
      <AssetsPanel
        tableRows={tableRows}
        uploadedImages={uploadedImages}
        uploading={uploading}
        uploadError={uploadError}
        exporting={exporting}
        exportError={exportError}
        onAddRow={addRow}
        onGenerateAll={generateAllRows}
        onExportAll={exportAllResults}
        onFileUpload={handleImageUpload}
        onRemoveImage={removeImage}
        onImageDragStart={(e, image) => {
          e.dataTransfer.setData("text/plain", `image|||${image}`);
          setCurrentDragType("image");
        }}
        onDragEnd={() => setCurrentDragType(null)}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        selectedImage={selectedImage}
        onClose={closeModal}
      />
    </div>
  );
}; 