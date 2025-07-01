import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";

// Example Dashboard Content Component
const DashboardContent = () => {
  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to your dashboard. Add your content here.
        </p>
      </div>
      
      {/* Example content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...new Array(4)].map((_, idx) => (
          <div
            key={"card-" + idx}
            className="h-32 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          />
        ))}
      </div>
      
      {/* Example larger content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...new Array(2)].map((_, idx) => (
          <div
            key={"large-card-" + idx}
            className="h-64 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          />
        ))}
      </div>
      
      {/* Add more content sections as needed */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Additional Content Section
        </h2>
        <div className="space-y-4">
          {[...new Array(3)].map((_, idx) => (
            <div
              key={"content-" + idx}
              className="p-4 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            >
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <SidebarComponent>
      <DashboardContent />
    </SidebarComponent>
  );
}
