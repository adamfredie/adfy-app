"use client";

import * as React from "react";
import type { ComponentProps } from "react";

function ContextMenu({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-context-menu ${className}`} {...props}>
      {children}
    </div>
  );
}

function ContextMenuItem({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-context-menu-item ${className}`} {...props}>
      {children}
    </div>
  );
}

function ContextMenuContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-context-menu-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export { ContextMenu, ContextMenuItem, ContextMenuContent };
