"use client";

import React, { useState, useCallback } from "react";
import { SidebarComponent } from "@/components/sidebar-component";
import { MinimalScrollBar } from "@/components/ui/minimal-scroll-bar";
import { 
  IconUpload, 
  IconPhoto, 
  IconUser, 
  IconPalette, 
  IconBulb,
  IconTrash,
  IconDownload,
  IconPlayerPlay,
  IconSettings,
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconLoader2,
  IconAlertCircle
} from "@tabler/icons-react";
import { 
  apiService, 
  TryOnRequest, 
  GPTTryOnRequest,
  VeoFashionVideoRequest,
  isKlingTryOnComplete 
} from "@/lib/api";
import JSZip from 'jszip';

type CellContent = {
  type: 'image' | 'background' | 'model' | 'prompt';
  value: any;
} | null;

type TableRow = {
  id: number;
  model: CellContent;
  clothingItems: CellContent[];
  prompt: CellContent;
  background: CellContent;
  result: CellContent;
  isGenerating?: boolean;
  generationError?: string;
  taskId?: string;
};

const VirtualTryOnContent = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState("studio");
  const [selectedModel, setSelectedModel] = useState("default");
  const [selectedPrompt, setSelectedPrompt] = useState("casual");
  const [expandedSections, setExpandedSections] = useState({
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const backgrounds = [
    { id: "studio", name: "Studio", preview: "bg-gradient-to-br from-gray-100 to-gray-200" },
    { id: "outdoor", name: "Outdoor", preview: "bg-gradient-to-br from-green-100 to-blue-200" },
    { id: "beach", name: "Beach", preview: "bg-gradient-to-br from-yellow-100 to-blue-300" },
    { id: "urban", name: "Urban", preview: "bg-gradient-to-br from-gray-300 to-slate-400" },
    { id: "sunset", name: "Sunset", preview: "bg-gradient-to-br from-orange-200 to-red-300" },
    { id: "forest", name: "Forest", preview: "bg-gradient-to-br from-green-200 to-green-400" },
    { id: "desert", name: "Desert", preview: "bg-gradient-to-br from-yellow-200 to-orange-300" },
    { id: "arctic", name: "Arctic", preview: "bg-gradient-to-br from-blue-100 to-cyan-200" },
    { id: "nightclub", name: "Nightclub", preview: "bg-gradient-to-br from-purple-300 to-pink-400" },
    { id: "office", name: "Office", preview: "bg-gradient-to-br from-blue-100 to-gray-200" },
    { id: "cafe", name: "Cafe", preview: "bg-gradient-to-br from-amber-100 to-orange-200" },
    { id: "gym", name: "Gym", preview: "bg-gradient-to-br from-red-100 to-red-200" },
    { id: "rooftop", name: "Rooftop", preview: "bg-gradient-to-br from-indigo-200 to-purple-300" },
    { id: "garden", name: "Garden", preview: "bg-gradient-to-br from-emerald-100 to-green-200" },
    { id: "industrial", name: "Industrial", preview: "bg-gradient-to-br from-gray-400 to-zinc-500" }
  ];

  const models = [
    { id: "default", name: "Default Model", avatar: "👤" },
    { id: "athletic", name: "Athletic", avatar: "🏃" },
    { id: "casual", name: "Casual", avatar: "👕" },
    { id: "formal", name: "Formal", avatar: "👔" },
    { id: "female", name: "Female Model", avatar: "👩" },
    { id: "male", name: "Male Model", avatar: "👨" },
    { id: "young", name: "Young Adult", avatar: "🧑" },
    { id: "mature", name: "Mature Adult", avatar: "👴" },
    { id: "plus-size", name: "Plus Size", avatar: "🧑‍🦲" },
    { id: "tall", name: "Tall Model", avatar: "🧍" },
    { id: "petite", name: "Petite Model", avatar: "🙋" },
    { id: "dancer", name: "Dancer", avatar: "💃" },
    { id: "business", name: "Business Pro", avatar: "👩‍💼" },
    { id: "student", name: "Student", avatar: "🧑‍🎓" },
    { id: "artist", name: "Artist", avatar: "🧑‍🎨" },
    { id: "fitness", name: "Fitness Model", avatar: "🏋️" },
    { id: "trendy", name: "Trendy Model", avatar: "🕺" },
    { id: "classic", name: "Classic Model", avatar: "👩‍🦳" }
  ];

  const prompts = [
    { id: "casual", name: "Casual Wear", description: "Comfortable everyday clothing" },
    { id: "formal", name: "Formal Attire", description: "Professional business wear" },
    { id: "summer", name: "Summer Style", description: "Light, breathable fabrics" },
    { id: "winter", name: "Winter Collection", description: "Warm, layered clothing" }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

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

  return (
    <div className="h-full flex bg-gray-50 dark:bg-neutral-950">
      {/* Left Controls Panel */}
      <div className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <IconSettings className="h-4 w-4" />
            Controls
          </h2>
        </div>
        
        <div className="flex-1 flex flex-col h-0">
          {/* Background Section */}
          <div className="h-1/3 border-b border-gray-200 dark:border-neutral-800 flex flex-col">
            <button
              onClick={() => toggleSection('background')}
              className="w-full p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <IconPalette className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900 dark:text-white">Background</span>
              </div>
              {expandedSections.background ? 
                <IconChevronDown className="h-4 w-4" /> : 
                <IconChevronRight className="h-4 w-4" />
              }
            </button>
            
            {expandedSections.background && (
              <div className="flex-1 min-h-0">
                <MinimalScrollBar className="h-full">
                  <div className="p-2 space-y-1">
                    {backgrounds.map((bg) => (
                      <div
                        key={bg.id}
                        onClick={() => setSelectedBackground(bg.id)}
                        className={`p-2 rounded-lg cursor-move transition-all ${
                          selectedBackground === bg.id 
                            ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                        }`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", `background|||${bg.id}`);
                          setCurrentDragType("background");
                        }}
                        onDragEnd={() => {
                          setCurrentDragType(null);
                        }}
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
      
          {/* Model Section */}
          <div className="h-1/3 border-b border-gray-200 dark:border-neutral-800 flex flex-col">
            <button
              onClick={() => toggleSection('model')}
              className="w-full p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <IconUser className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Model</span>
              </div>
              {expandedSections.model ? 
                <IconChevronDown className="h-4 w-4" /> : 
                <IconChevronRight className="h-4 w-4" />
              }
            </button>
            
            {expandedSections.model && (
              <div className="flex-1 min-h-0">
                <MinimalScrollBar className="h-full">
                  <div className="p-2 space-y-1">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-2 rounded-lg cursor-move transition-all ${
                          selectedModel === model.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                        }`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", `model|||${model.id}`);
                          setCurrentDragType("model");
                        }}
                        onDragEnd={() => {
                          setCurrentDragType(null);
                        }}
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

          {/* Prompts Section */}
          <div className="h-1/3 border-b border-gray-200 dark:border-neutral-800 flex flex-col">
            <button
              onClick={() => toggleSection('prompts')}
              className="w-full p-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <IconBulb className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-gray-900 dark:text-white">Prompts</span>
              </div>
              {expandedSections.prompts ? 
                <IconChevronDown className="h-4 w-4" /> : 
                <IconChevronRight className="h-4 w-4" />
              }
            </button>
            
            {expandedSections.prompts && (
              <div className="flex-1 min-h-0">
                <MinimalScrollBar className="h-full">
                  <div className="p-2 space-y-1">
                    {prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        onClick={() => setSelectedPrompt(prompt.id)}
                        className={`p-2 rounded-lg cursor-move transition-all ${
                          selectedPrompt === prompt.id 
                            ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                        }`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", `prompt|||${prompt.id}`);
                          setCurrentDragType("prompt");
                        }}
                        onDragEnd={() => {
                          setCurrentDragType(null);
                        }}
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
        </div>
          </div>

      {/* Center Workspace */}
      <div className="flex-1 flex flex-col">
        {/* Drag & Drop Table */}
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
                      <div 
                        className={getDropZoneClasses('model', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative")}
                        onDrop={(e) => {
                          if (isValidDropZone('model')) {
                            handleDrop(e, row.id, 'model');
                          } else {
                            e.preventDefault();
                          }
                        }}
                        onDragOver={handleDragOver}
                      >
                        {row.model && row.model.type === 'model' ? (
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <div className="text-2xl mb-1">{row.model.value?.avatar}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              {row.model.value?.name}
                            </div>
                            <button
                              onClick={() => clearCell(row.id, 'model')}
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
                      </div>
                    </td>

                    {/* Clothing Items Column */}
                    <td className="px-6 py-4">
                      <div 
                        className={getDropZoneClasses('clothingItems', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative")}
                        onDrop={(e) => {
                          if (isValidDropZone('clothingItems')) {
                            handleDrop(e, row.id, 'clothingItems');
                          } else {
                            e.preventDefault();
                          }
                        }}
                        onDragOver={handleDragOver}
                        title={`Row ${row.id}: ${row.clothingItems.length} items`}
                      >
                        {row.clothingItems.length > 0 ? (
                          <div className="relative w-full h-full">
                            <div className="grid grid-cols-2 gap-1 w-full h-full">
                              {row.clothingItems.map((item, index) => (
                                <div key={index} className="relative">
                                  <img 
                                    src={item?.value} 
                                    alt={`Clothing ${index + 1}`} 
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                      console.error('Image failed to load:', item?.value);
                                      // Show broken image indicator
                                      e.currentTarget.style.display = 'none';
                                    }}
                                    onLoad={() => {
                                      console.log('Image loaded successfully:', item?.value);
                                    }}
                                  />
                                  <button
                                    onClick={() => clearCell(row.id, 'clothingItems', index)}
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
                      </div>
                    </td>

                    {/* Prompt Column */}
                    <td className="px-6 py-4">
                      <div 
                        className={getDropZoneClasses('prompt', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative p-2")}
                        onDrop={(e) => {
                          if (isValidDropZone('prompt')) {
                            handleDrop(e, row.id, 'prompt');
                          } else {
                            e.preventDefault();
                          }
                        }}
                        onDragOver={handleDragOver}
                      >
                        {row.prompt && row.prompt.type === 'prompt' ? (
                          <div className="relative w-full h-full">
                            <div className="text-center">
                              <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                                {row.prompt.value?.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Prompt
                              </div>
                            </div>
                            <button
                              onClick={() => clearCell(row.id, 'prompt')}
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
                      </div>
                    </td>

                    {/* Background Column */}
                    <td className="px-6 py-4">
                      <div 
                        className={getDropZoneClasses('background', "w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative p-2")}
                        onDrop={(e) => {
                          if (isValidDropZone('background')) {
                            handleDrop(e, row.id, 'background');
                          } else {
                            e.preventDefault();
                          }
                        }}
                        onDragOver={handleDragOver}
                      >
                        {row.background && row.background.type === 'background' ? (
                          <div className="relative w-full h-full">
                            <div className="text-center">
                              <div className={`w-8 h-8 rounded-md ${row.background.value?.preview} mx-auto mb-1`} />
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {row.background.value?.name}
                              </div>
                            </div>
                            <button
                              onClick={() => clearCell(row.id, 'background')}
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
                      </div>
                    </td>

                    {/* Result Column */}
                    <td className="px-6 py-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-gray-200 dark:border-neutral-700 flex items-center justify-center relative">
                        {row.isGenerating ? (
                          <IconLoader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                        ) : row.generationError ? (
                          <div className="text-center">
                            <IconAlertCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                            <div className="text-xs text-red-500">Error</div>
                          </div>
                        ) : row.result && row.result.type === 'image' ? (
                          <img 
                            src={row.result.value} 
                            alt="Try-on result" 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              console.error('Result image failed to load:', row.result?.value);
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => generateSingleRow(row.id)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
                </table>
              </div>
            </MinimalScrollBar>
          </div>
        </div>
      </div>

      {/* Right Upload Panel */}
      <div className="w-80 bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <IconPhoto className="h-4 w-4" />
            Assets
          </h2>
        </div>
        
        {/* Action Buttons */}
        <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex flex-col gap-2">
            <button 
              onClick={addRow}
              className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-neutral-700 text-sm"
            >
              <IconPlus className="h-4 w-4" />
              Add Row
            </button>
            <button 
              onClick={generateAllRows}
              disabled={uploading || tableRows.some(row => row.isGenerating)}
              className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tableRows.some(row => row.isGenerating) ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconPlayerPlay className="h-4 w-4" />
              )}
              {tableRows.some(row => row.isGenerating) ? 'Generating...' : 'Generate'}
            </button>
            <button 
              onClick={exportAllResults}
              disabled={exporting || tableRows.every(row => !row.result)}
              className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-neutral-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconDownload className="h-4 w-4" />
              )}
              {exporting ? 'Exporting...' : (() => {
                const resultCount = tableRows.filter(row => row.result && row.result.type === 'image').length;
                return resultCount > 0 ? `Export ZIP (${resultCount})` : 'Export ZIP';
              })()}
            </button>
          </div>
          {exportError && (
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <IconAlertCircle className="h-4 w-4" />
                {exportError}
              </div>
            </div>
          )}
        </div>
        
        {/* Upload Area */}
        <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
          <label className="block">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className={`w-full h-24 bg-gray-50 dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg flex flex-col items-center justify-center transition-colors ${
              uploading 
                ? 'cursor-not-allowed opacity-50' 
                : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700'
            }`}>
              {uploading ? (
                <>
                  <IconLoader2 className="h-6 w-6 text-gray-400 mb-1 animate-spin" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <IconUpload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Upload Images
                  </span>
                </>
              )}
            </div>
          </label>
          {uploadError && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
              <IconAlertCircle className="h-4 w-4" />
              {uploadError}
            </div>
          )}
        </div>

        {/* Uploaded Images Gallery */}
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
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", `image|||${image}`);
                    setCurrentDragType("image");
                  }}
                  onDragEnd={() => {
                    setCurrentDragType(null);
                  }}
                    />
                    <button
                      onClick={() => removeImage(index)}
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
      </div>
    </div>
  );
};

export default function VirtualTryOnPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent>
        <VirtualTryOnContent />
      </SidebarComponent>
    </div>
  );
} 