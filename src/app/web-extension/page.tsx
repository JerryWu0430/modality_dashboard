import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";
import { IconPuzzle, IconDownload, IconBrowser, IconShield } from "@tabler/icons-react";

const WebExtensionContent = () => {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <IconPuzzle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Web Extension
          </h1>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
            Coming Soon
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Try on clothes directly from any website with our browser extension. Seamless integration with your favorite shopping sites.
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconBrowser className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Universal Compatibility
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Works on any e-commerce website. No integration required from merchants.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconDownload className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy Installation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              One-click installation from Chrome Web Store and Firefox Add-ons.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <IconShield className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data stays secure. No browsing history stored or shared.
            </p>
          </div>
        </div>
        
        {/* Coming Soon Interface */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 p-8 rounded-lg border border-orange-200 dark:border-orange-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Browser Extension Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're developing a powerful browser extension that will revolutionize online shopping. Be the first to try it!
          </p>
          <div className="flex flex-wrap gap-4">
            <button disabled className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed">
              Join Beta Waitlist
            </button>
            <button className="bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* Browser Support */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Supported Browsers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Chrome", status: "Ready" },
              { name: "Firefox", status: "Ready" },
              { name: "Safari", status: "In Development" },
              { name: "Edge", status: "Ready" }
            ].map((browser, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg text-center"
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {browser.name}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  browser.status === "Ready" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                }`}>
                  {browser.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            How It Works
          </h3>
          <div className="space-y-3">
            {[
              "Install the extension from your browser's store",
              "Browse any clothing website as usual",
              "Click the Modality icon when you find an item you like",
              "Upload your photo or use your saved profile",
              "See how it looks on you instantly!"
            ].map((step, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg flex items-start gap-4"
              >
                <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WebExtensionPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent>
        <WebExtensionContent />
      </SidebarComponent>
    </div>
  );
} 