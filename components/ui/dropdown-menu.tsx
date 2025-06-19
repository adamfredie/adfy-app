"use client";

import * as React from "react";

function DropdownMenu({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`aduffy-dropdown-menu ${className}`} {...props}>{children}</div>;
}

function DropdownMenuTrigger({ children, className = '', ...props }: { children: React.ReactNode; className?: string; onClick?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`aduffy-dropdown-trigger ${className}`} {...props}>
      {children}
    </button>
  );
}

function DropdownMenuContent({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-dropdown-content absolute z-50 min-w-[8rem] rounded-md border bg-popover p-1 shadow-md ${className}`} {...props}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child)
          : child
      )}
    </div>
  );
}

function DropdownMenuItem({ children, className = '', onClick, ...props }: { children: React.ReactNode; className?: string; onClick?: () => void } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`aduffy-dropdown-item cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-aduffy-yellow/10 ${className}`}
      tabIndex={0}
      role="menuitem"
      onClick={e => {
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
