"use client";

import React, { useState } from "react";
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
  IconPlus
} from "@tabler/icons-react";

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
};

const VirtualTryOnContent = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent, rowId: number, cellType: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const [type, value] = data.split(":");
    
    setTableRows(prev => prev.map(row => {
      if (row.id === rowId) {
        if (cellType === "model" && type === "model") {
          const model = models.find(m => m.id === value);
          return { ...row, model: { type: "model", value: model } };
        } else if (cellType === "clothingItems" && type === "image") {
          // Only allow 2 non-identical images
          const currentItems = row.clothingItems.filter(item => item !== null);
          const imageExists = currentItems.some(item => item?.value === value);
          if (currentItems.length < 2 && !imageExists) {
            return { ...row, clothingItems: [...currentItems, { type: "image", value }] };
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
                          e.dataTransfer.setData("text/plain", `background:${bg.id}`);
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
                          e.dataTransfer.setData("text/plain", `model:${model.id}`);
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
                          e.dataTransfer.setData("text/plain", `prompt:${prompt.id}`);
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
        {/* Workspace Header */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Virtual Try-On Workspace
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={addRow}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-neutral-700"
              >
                <IconPlus className="h-4 w-4" />
                Add Row
              </button>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                <IconPlayerPlay className="h-4 w-4" />
                Generate
              </button>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-200 dark:border-neutral-700">
                <IconDownload className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Drag & Drop Table */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 h-full flex flex-col">
            <MinimalScrollBar className="flex-1">
              <div className="p-4">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50 dark:bg-neutral-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                      Clothing Items (2 max)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                      Prompt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                      Background
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
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
                        className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative"
                        onDrop={(e) => handleDrop(e, row.id, 'model')}
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
                        className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative"
                        onDrop={(e) => handleDrop(e, row.id, 'clothingItems')}
                        onDragOver={handleDragOver}
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
                        className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative p-2"
                        onDrop={(e) => handleDrop(e, row.id, 'prompt')}
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
                        className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors relative p-2"
                        onDrop={(e) => handleDrop(e, row.id, 'background')}
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
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-gray-200 dark:border-neutral-700 flex items-center justify-center">
                        <IconPlayerPlay className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
        
        {/* Upload Area */}
        <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
          <label className="block">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="w-full h-24 bg-gray-50 dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
              <IconUpload className="h-6 w-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Upload Images
              </span>
            </div>
          </label>
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
                        e.dataTransfer.setData("text/plain", `image:${image}`);
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