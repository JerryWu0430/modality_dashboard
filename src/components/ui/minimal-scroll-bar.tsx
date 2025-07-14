'use client';

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

interface MinimalScrollBarProps {
  children: React.ReactNode;
  className?: string;
  height?: string | number;
  width?: string | number;
  orientation?: "vertical" | "horizontal" | "both";
}

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

const MinimalScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  MinimalScrollBarProps
>(({ className, children, height = "100%", width = "100%", orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    style={{ height, width }}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    
    {(orientation === "vertical" || orientation === "both") && (
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        orientation="vertical"
        className="flex touch-none select-none transition-all duration-200 ease-out hover:bg-muted/20 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 h-full w-2 border-l border-l-transparent p-[1px]"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border/60 hover:bg-border transition-colors duration-200" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
    )}
    
    {(orientation === "horizontal" || orientation === "both") && (
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        orientation="horizontal"
        className="flex touch-none select-none transition-all duration-200 ease-out hover:bg-muted/20 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 h-2 flex-col border-t border-t-transparent p-[1px]"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border/60 hover:bg-border transition-colors duration-200" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
    )}
    
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

MinimalScrollBar.displayName = "MinimalScrollBar";

export { MinimalScrollBar }; 