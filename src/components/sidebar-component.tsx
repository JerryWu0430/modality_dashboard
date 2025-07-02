"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import {
  IconUserBolt,
  IconHelp,
  IconCameraSpark,
  IconShirtSport,
  IconPuzzle,
  IconSettings,
  IconSelector,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarComponent({ children }: { children: React.ReactNode }) {
  // MIDDLE section links
  const middleLinks = [
    {
      label: "Virtual Try-On",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Mock Video",
      href: "#",
      icon: (
        <IconCameraSpark className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Batch Try-On",
      href: "#",
      subtitle: "(coming soon)",
      icon: (
        <IconShirtSport className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
      ),
    },
    {
      label: "Web Extension",
      href: "#",
      subtitle: "(coming soon)",
      icon: (
        <IconPuzzle className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
      ),
    },
  ];

  // BOTTOM section links
  const bottomLinks = [
    {
      label: "Help",
      href: "#",
      icon: (
        <IconHelp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(true); // Always open
  
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen" // Using h-screen for full height
      )}
    >
      <Sidebar open={true} setOpen={setOpen} animate={false}>
        <SidebarBody className="flex flex-col h-full">
          {/* TOP SECTION - Company Logo */}
          <div className="flex py-4 px-3 border-b border-neutral-200 dark:border-neutral-700">
            <Logo />
          </div>

          {/* MIDDLE SECTION - Main Navigation (Vertically Centered, Left-aligned items) */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col gap-5 w-full">
              {middleLinks.map((link, idx) => (
                <HorizontalSidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* BOTTOM SECTION - Help & User */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 pb-4">
            <div className="flex flex-col gap-0">
              {bottomLinks.map((link, idx) => (
                <HorizontalSidebarLink key={idx} link={link} />
              ))}
              <UserProfile />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col bg-white dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
}

// Horizontal Sidebar Link Component (icon beside text, left-aligned)
const HorizontalSidebarLink = ({ 
  link 
}: { 
  link: { 
    label: string; 
    href: string; 
    icon: React.ReactNode; 
    subtitle?: string; 
  } 
}) => {
  const isComingSoon = link.subtitle === "(coming soon)";
  
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg transition-colors group",
        isComingSoon 
          ? "cursor-not-allowed opacity-60" 
          : "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
      )}
    >
      {link.icon}
      <div className="flex flex-col">
        <div className={cn(
          "text-sm font-medium leading-tight",
          isComingSoon 
            ? "text-neutral-500 dark:text-neutral-400" 
            : "text-neutral-700 dark:text-neutral-200"
        )}>
          {link.label}
        </div>
        {link.subtitle && (
          <div className="text-xs text-neutral-400 dark:text-neutral-500 leading-tight">
            {link.subtitle}
          </div>
        )}
      </div>
    </a>
  );
};

// User Profile Component
const UserProfile = () => {
  return (
    <div className="flex items-center gap-3 p-3 w-full bg-gray-50 dark:bg-neutral-800 rounded-lg">
      <img
        src="https://assets.aceternity.com/manu.png"
        className="h-8 w-8 shrink-0 rounded-full"
        width={32}
        height={32}
        alt="User Avatar"
      />
      <div className="flex flex-col flex-1">
        <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200 leading-tight">
          Jerry Wu
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight">
          jerry@example.com
        </div>
      </div>
      <IconSelector className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
    </div>
  );
};

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center gap-1 text-sm font-normal text-black"
    >
      <img 
        src="/icon.png"
        alt="Modality Logo"
        className="h-8 w-8 shrink-0 rounded-lg"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-xl text-black dark:text-white leading-tight"
      >
        odality
      </motion.span>
    </a>
  );
}; 