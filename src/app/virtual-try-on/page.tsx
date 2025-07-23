"use client";

import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";
import { VirtualTryOnContent } from "./components/VirtualTryOnContent";

export default function VirtualTryOnPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent>
        <VirtualTryOnContent />
      </SidebarComponent>
    </div>
  );
} 