"use client";

import * as React from "react";
import type { ComponentProps } from "react";

function Menubar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-menubar ${className || ''}`} {...props} />
  );
}

function MenubarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`aduffy-menubar-menu ${className || ''}`} {...props} />;
}

function MenubarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`aduffy-menubar-group ${className || ''}`} {...props} />;
}

function MenubarPortal({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`aduffy-menubar-portal ${className || ''}`} {...props} />;
}

function MenubarRadioGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`aduffy-menubar-radio-group ${className || ''}`} {...props} />;
}

function MenubarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`aduffy-menubar-trigger ${className || ''}`} {...props} />;
}

function MenubarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-menubar-content ${className || ''}`} {...props} />
  );
}

function MenubarItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-menubar-item ${className || ''}`} {...props} />
  );
}

function MenubarCheckboxItem({ className, children, checked, ...props }: React.PropsWithChildren<{ className?: string; checked?: boolean }>) {
  return (
    <div className={`aduffy-menubar-checkbox-item ${className || ''}`} {...props}>
      <span className="aduffy-menubar-checkbox-indicator">{checked ? '✓' : ''}</span>
      {children}
    </div>
  );
}

function MenubarRadioItem({ className, children, checked, ...props }: React.PropsWithChildren<{ className?: string; checked?: boolean }>) {
  return (
    <div className={`aduffy-menubar-radio-item ${className || ''}`} {...props}>
      <span className="aduffy-menubar-radio-indicator">{checked ? '●' : ''}</span>
      {children}
    </div>
  );
}

function MenubarLabel({ className, inset, ...props }: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return <div className={`aduffy-menubar-label ${inset ? 'aduffy-menubar-label-inset' : ''} ${className || ''}`} {...props} />;
}

function MenubarSeparator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={`aduffy-menubar-separator ${className || ''}`} {...props} />;
}

function MenubarShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`aduffy-menubar-shortcut ${className || ''}`} {...props} />;
}

function MenubarSub({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`aduffy-menubar-sub ${className || ''}`} {...props} />;
}

function MenubarSubTrigger({ className, inset, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean }) {
  return (
    <button className={`aduffy-menubar-sub-trigger ${inset ? 'aduffy-menubar-label-inset' : ''} ${className || ''}`} {...props}>
      {children}
      <span className="aduffy-menubar-chevron">›</span>
    </button>
  );
}

function MenubarSubContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`aduffy-menubar-sub-content ${className || ''}`} {...props} />;
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
