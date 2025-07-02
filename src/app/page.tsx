import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";

// Example Dashboard Content Component
const DashboardContent = () => {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your Modality dashboard. This sidebar is fully responsive and collapsible.
        </p>
      </div>
      
      {/* Sample content to demonstrate scrolling */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Feature {i + 1}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This is a sample feature card that demonstrates the responsive layout.
              </p>
            </div>
          ))}
        </div>
        
        {/* Additional content to test scrolling */}
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg"
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                Sample Content Item {i + 1}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                This content demonstrates how the sidebar works with scrollable content.
                The sidebar remains persistent and can be collapsed for more screen space.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent>
        <DashboardContent />
      </SidebarComponent>
    </div>
  );
}
