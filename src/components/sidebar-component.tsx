"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconPhoto,
  IconVideo,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

// Custom hover sidebar link component
const HoverSidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  return (
    <div className="relative group">
      <a
        href={link.href}
        className={cn(
          "flex items-center justify-center md:justify-center gap-2 group/sidebar py-3 px-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 relative",
          className
        )}
        {...props}
      >
        {link.icon}
        {/* Show text on mobile, hide on desktop */}
        <span className="md:hidden text-neutral-700 dark:text-neutral-200 text-sm">
          {link.label}
        </span>
      </a>
      
      {/* Tooltip for desktop */}
      <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[999] hidden md:block pointer-events-none shadow-lg">
        {link.label}
        {/* Arrow pointing to the icon */}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-neutral-900 dark:border-r-neutral-100"></div>
      </div>
    </div>
  );
};

export function SidebarComponent({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Virtual Tryon Image",
      href: "#",
      icon: (
        <IconPhoto className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Virtual Tryon Video",
      href: "#",
      icon: (
        <IconVideo className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Social Media Video",
      href: "#",
      icon: (
        <IconBrandInstagram className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  // No longer need open state since we're using hover tooltips

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
      {/* Sidebar - positioned at bottom on mobile, left on desktop */}
      <div className="order-2 md:order-1">
        <Sidebar open={false} setOpen={() => {}} animate={false}>
          <SidebarBody className="justify-between gap-16 md:h-full">
            {/* Logo at top - always show icon only on desktop */}
            <div className="flex-shrink-0 hidden md:block">
              <LogoIcon />
            </div>
            
            {/* Navigation links - horizontal on mobile, vertical centered on desktop */}
            <div className="flex flex-1 flex-col md:justify-center overflow-x-hidden overflow-y-auto">
              <div className="flex flex-row md:flex-col gap-2 md:gap-6 justify-around md:justify-start">
                {links.map((link, idx) => (
                  <HoverSidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            
            {/* User profile at bottom - icon only on desktop */}
            <div className="flex-shrink-0 hidden md:block">
              <HoverSidebarLink
                link={{
                  label: "Manu Arora",
                  href: "#",
                  icon: (
                    <img
                      src="https://assets.aceternity.com/manu.png"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
      
      {/* Main content area - takes most space on mobile, flex-1 on desktop */}
      <div className="flex flex-1 overflow-hidden order-1 md:order-2">
        <div className="flex h-full w-full flex-1 flex-col border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 md:rounded-tl-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
