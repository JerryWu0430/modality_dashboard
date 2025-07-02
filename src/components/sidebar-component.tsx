"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, useSidebar } from "@/components/ui/sidebar";
import {
  IconUserBolt,
  IconHelp,
  IconCameraSpark,
  IconShirtSport,
  IconPuzzle,
  IconSettings,
  IconSelector,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarComponent({ children }: { children: React.ReactNode }) {
  // MIDDLE section links
  const middleLinks = [
    {
      label: "Virtual Try-On",
      href: "/virtual-try-on",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Mock Video",
      href: "/mock-video",
      icon: (
        <IconCameraSpark className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Batch Try-On",
      href: "/batch-try-on",
      icon: (
        <IconShirtSport className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
      ),
    },
    {
      label: "Web Extension",
      href: "/web-extension",
      icon: (
        <IconPuzzle className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
      ),
    },
  ];

  // BOTTOM section links
  const bottomLinks = [
    {
      label: "Help",
      href: "/help",
      icon: (
        <IconHelp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(true);
  
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "min-h-screen" // Using min-h-screen for fluid height
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody>
          <SidebarContent middleLinks={middleLinks} bottomLinks={bottomLinks} />
        </SidebarBody>
      </Sidebar>
      
      {/* Main Content Area - Lower z-index to not interfere with sidebar tooltips */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <div className="flex h-screen w-full flex-1 flex-col bg-white dark:bg-neutral-900 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Separate component for sidebar content to access sidebar context
const SidebarContent = ({ 
  middleLinks, 
  bottomLinks 
}: { 
  middleLinks: any[], 
  bottomLinks: any[] 
}) => {
  const { open } = useSidebar();

  return (
    <>
      {/* TOP SECTION - Company Logo */}
      <div className={cn(
        "flex border-b border-neutral-200 dark:border-neutral-700 transition-all duration-300",
        open ? "py-4 px-0" : "py-4 px-0 justify-center"
      )}>
        <Logo />
      </div>

      {/* MIDDLE SECTION - Main Navigation (Vertically Centered, Left-aligned items) */}
      <div className="flex-1 flex items-center">
        <div className="flex flex-col gap-2 w-full">
          {middleLinks.map((link, idx) => (
            <ResponsiveSidebarLink key={idx} link={link} />
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION - Help, Settings & User */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 pb-4">
        <div className="flex flex-col gap-2">
          {bottomLinks.map((link, idx) => (
            <ResponsiveSidebarLink key={idx} link={link} />
          ))}
          <UserProfile />
        </div>
      </div>
    </>
  );
};

// Responsive Sidebar Link Component that works with collapsed state
const ResponsiveSidebarLink = ({ 
  link 
}: { 
  link: { 
    label: string; 
    href: string; 
    icon: React.ReactNode; 
  } 
}) => {
  const { open } = useSidebar();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (!open && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 8,
        y: rect.top + rect.height / 2
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  return (
    <>
      <a
        ref={linkRef}
        href={link.href}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          "text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900",
          "dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          "relative",
          !open && "justify-center"
        )}
      >
        <div className="shrink-0">
          {link.icon}
        </div>

        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {link.label}
            </motion.span>
          )}
        </AnimatePresence>
      </a>

      {/* Tooltip for collapsed state - Using fixed positioning */}
      {!open && showTooltip && (
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-white dark:text-neutral-900 whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200">
            {link.label}
          </div>
        </div>
      )}
    </>
  );
};

// User Profile Component with responsive behavior
const UserProfile = () => {
  const { open } = useSidebar();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const profileRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!open && profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 8,
        y: rect.top + rect.height / 2
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleProfileClick = () => {
    if (open && profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      // Position the dropdown in the main dashboard area, bottom left
      setDropdownPosition({
        x: rect.right + 25, // Small offset from sidebar edge
        y: window.innerHeight - 330 // Fixed distance from bottom of screen
      });
      setShowDropdown(!showDropdown);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <>
      <div 
        ref={profileRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleProfileClick}
        className={cn(
          "flex items-center w-full bg-gray-50 dark:bg-neutral-800 rounded-lg transition-all duration-200 relative cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700",
          open ? "gap-3 p-3" : "p-3 justify-center"
        )}
      >
        <div className="shrink-0">
          <img
            src="https://assets.aceternity.com/manu.png"
            className="h-8 w-8 rounded-full object-cover"
            width={32}
            height={32}
            alt="User Avatar"
          />
        </div>
        
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex flex-col flex-1 overflow-hidden min-w-0"
            >
              <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200 leading-tight truncate">
                Jerry Wu
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight truncate">
                jerry@example.com
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="shrink-0"
            >
              <IconSelector className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tooltip for collapsed state - Using fixed positioning */}
      {!open && showTooltip && (
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-white dark:text-neutral-900 whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200">
            Jerry Wu
          </div>
        </div>
      )}

      {/* Profile Dropdown Overlay */}
      <AnimatePresence>
        {open && showDropdown && (
          <div 
            ref={dropdownRef}
            className="fixed z-[9999]"
            style={{
              left: `${dropdownPosition.x}px`,
              top: `${dropdownPosition.y}px`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 min-w-[220px] py-2"
            >
              {/* Profile Header */}
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-10 w-10 rounded-full object-cover"
                    width={40}
                    height={40}
                    alt="User Avatar"
                  />
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Jerry Wu
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      jerry@example.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <ProfileMenuItem 
                  icon={<IconUserBolt className="h-4 w-4" />}
                  label="Account Settings"
                  href="/settings"
                />
                <ProfileMenuItem 
                  icon={<IconHelp className="h-4 w-4" />}
                  label="History"
                  href="#" // TODO: Add history page
                />
                
                <div className="border-t border-neutral-100 dark:border-neutral-700 my-2"></div>
                
                <ProfileMenuItem 
                  icon={<IconSelector className="h-4 w-4 text-yellow-600" />}
                  label="Upgrade to Pro"
                  href="#" // TODO: Add upgrade page
                  highlight={true}
                />
                
                <div className="border-t border-neutral-100 dark:border-neutral-700 my-2"></div>
                
                <ProfileMenuItem 
                  icon={<IconSettings className="h-4 w-4" />}
                  label="Logout"
                  href="/"
                  onClick={() => {
                    // Handle logout logic here
                    setShowDropdown(false);
                  }}
                />
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-700">
                <div className="text-xs text-neutral-400 dark:text-neutral-500">
                  v1.5.69 • <a href="/terms" className="hover:text-neutral-600 dark:hover:text-neutral-300">Terms & Conditions</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Profile Menu Item Component
const ProfileMenuItem = ({ 
  icon, 
  label, 
  href, 
  highlight = false,
  rightElement,
  onClick 
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  highlight?: boolean;
  rightElement?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-1.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700",
        highlight ? "text-yellow-600 dark:text-yellow-400" : "text-neutral-700 dark:text-neutral-300"
      )}
    >
      <div className="shrink-0">
        {icon}
      </div>
      <span className="flex-1">
        {label}
      </span>
      {rightElement && (
        <div className="shrink-0">
          {rightElement}
        </div>
      )}
    </a>
  );
};

export const Logo = () => {
  const { open } = useSidebar();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const logoRef = React.useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (!open && logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 8,
        y: rect.top + rect.height / 2
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <a
        ref={logoRef}
        href="/"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative z-20 flex text-sm font-normal text-black transition-all duration-200",
          open ? "items-center gap-2" : "items-center justify-center"
        )}
      >
        <div className="shrink-0">
          <img 
            src="/icon.png"
            alt="Modality Logo"
            className="h-8 w-8 rounded-lg object-cover"
          />
        </div>
        
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="font-bold text-xl text-black dark:text-white leading-tight whitespace-nowrap overflow-hidden"
            >
              odality
            </motion.span>
          )}
        </AnimatePresence>
      </a>

      {/* Tooltip for collapsed state - Using fixed positioning */}
      {!open && showTooltip && (
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-white dark:text-neutral-900 whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200">
            odality
          </div>
        </div>
      )}
    </>
  );
}; 