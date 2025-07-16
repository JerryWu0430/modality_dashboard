"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false); // Default to collapsed

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar className={className} children={children} {...props} />
      <MobileSidebar className={className} children={children} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof motion.div>, 'children'>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0 border-r border-neutral-200 dark:border-neutral-700 relative",
          "h-screen overflow-hidden", // Using h-screen for full viewport height
          className
        )}
        animate={{
          width: animate ? (open ? "280px" : "72px") : "280px",
        }}
        initial={false}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        {...props}
      >
        {/* Toggle Button Removed - Sidebar is always collapsed */}

        {/* Sidebar Content */}
        <div className="flex h-full flex-col overflow-hidden px-4 py-4">
          {children}
        </div>
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Mobile Toggle Button Removed - Sidebar is always collapsed */}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[40] bg-black/20 backdrop-blur-sm md:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed left-0 top-0 z-[50] h-screen w-80 bg-white shadow-xl dark:bg-neutral-900 md:hidden",
                "border-r border-neutral-200 dark:border-neutral-700",
                className
              )}
            >
              <div className="flex h-full flex-col overflow-hidden px-4 py-4 pt-16">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
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
          className
        )}
        {...props}
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
              transition={{ duration: 0.2, delay: open ? 0.1 : 0 }}
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
