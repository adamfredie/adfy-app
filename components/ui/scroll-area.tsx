"use client";

import * as React from "react";

function ScrollArea({ className = '', children, ...props }: { className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="scroll-area"
      className={`aduffy-scroll-area overflow-auto ${className}`}
      {...props}
    >
      <div data-slot="scroll-area-viewport" className="aduffy-scroll-area-viewport size-full rounded-inherit">
        {children}
      </div>
    </div>
  );
}

function ScrollBar() {
  // Custom scrollbars are handled via CSS for .aduffy-scroll-area
  return null;
}

export { ScrollArea, ScrollBar };
