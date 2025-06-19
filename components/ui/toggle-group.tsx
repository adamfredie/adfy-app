"use client";

import * as React from "react";
import type { ComponentProps } from "react";

const ToggleGroupContext = React.createContext<
  { variant: string; size: string }
>({
  size: "default",
  variant: "default",
});

function ToggleGroup({ className, children, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`aduffy-toggle-group ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function ToggleGroupItem({ className, children, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <button className={`aduffy-toggle-group-item ${className || ''}`} {...props}>
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
