import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";
import { IconUserBolt, IconUpload, IconCamera, IconWand } from "@tabler/icons-react";

const VirtualTryOnContent = () => {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <IconUserBolt className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Virtual Try-On
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Experience our AI-powered virtual try-on technology. Upload your photo and see how different outfits look on you.
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconUpload className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload Photo
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your photo to get started with virtual try-on experience.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconCamera className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Take Photo
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Use your device camera to capture a photo for instant try-on.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconWand className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI technology processes your image for realistic try-on results.
            </p>
          </div>
        </div>
        
        {/* Try-On Interface */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Start Your Virtual Try-On
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to see how you look in different outfits? Get started by uploading a photo or taking one with your camera.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Upload Photo
            </button>
            <button className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Take Photo
            </button>
          </div>
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