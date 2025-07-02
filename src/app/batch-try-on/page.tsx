import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";
import { IconShirtSport, IconUpload, IconUsers, IconCheck } from "@tabler/icons-react";

const BatchTryOnContent = () => {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <IconShirtSport className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Batch Try-On
          </h1>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
            Coming Soon
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Process multiple try-on requests simultaneously. Perfect for businesses and bulk operations.
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconUpload className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Bulk Upload
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload multiple images and outfits for batch processing.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconUsers className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multi-Person
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Process try-ons for multiple people simultaneously.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconCheck className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quality Control
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automated quality checks and result validation.
            </p>
          </div>
        </div>
        
        {/* Coming Soon Interface */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-lg border border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Batch Processing Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're working hard to bring you the most advanced batch try-on capabilities. Sign up to be notified when it's ready!
          </p>
          <div className="flex flex-wrap gap-4">
            <button disabled className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed">
              Join Waitlist
            </button>
            <button className="bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Benefits */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Benefits of Batch Try-On
          </h3>
          {[
            "Process hundreds of images in minutes",
            "Consistent quality across all results",
            "API integration for seamless workflow",
            "Advanced analytics and reporting",
            "Priority processing for enterprise customers"
          ].map((benefit, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg flex items-center gap-3"
            >
              <IconCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function BatchTryOnPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent>
        <BatchTryOnContent />
      </SidebarComponent>
    </div>
  );
} 