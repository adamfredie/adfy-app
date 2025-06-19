"use client";

import * as React from "react";

function HoverCard({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-hover-card ${className}`} {...props}>
      {children}
    </div>
  );
}

function HoverCardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-hover-card-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export { HoverCard, HoverCardContent };
