import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";
import { IconCameraSpark, IconVideo, IconUpload, IconPlayerPlay } from "@tabler/icons-react";

const MockVideoContent = () => {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <IconCameraSpark className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mock Video
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Create engaging mock videos with AI-powered technology. Perfect for product demonstrations and marketing content.
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconVideo className="h-8 w-8 text-red-600 dark:text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Video Generation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate professional-quality mock videos using AI technology.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconUpload className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Asset Upload
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your assets, images, and content to create custom videos.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconPlayerPlay className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Preview & Export
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Preview your videos in real-time and export in various formats.
            </p>
          </div>
        </div>
        
        {/* Video Creation Interface */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-lg border border-purple-200 dark:border-purple-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Mock Video
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to create stunning mock videos? Upload your content and let our AI do the magic.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Start Creating
            </button>
            <button className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              View Templates
            </button>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Mock Videos
          </h3>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded flex items-center justify-center">
                  <IconPlayerPlay className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Mock Video {i + 1}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Created {i + 1} day{i !== 0 ? 's' : ''} ago • 1080p
                  </p>
                </div>
              </div>
              <button className="text-purple-600 hover:text-purple-700 font-medium">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function MockVideoPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent>
        <MockVideoContent />
      </SidebarComponent>
    </div>
  );
} 