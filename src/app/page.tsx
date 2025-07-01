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
      </div>
      
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="h-screen">
      <SidebarComponent>
        <DashboardContent />
      </SidebarComponent>
    </div>
  );
}
