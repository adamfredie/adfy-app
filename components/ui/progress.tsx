"use client";

import * as React from "react";

function Progress({
  className = "",
  value = 0,
  ...props
}: { className?: string; value?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="progress"
      className={`progress-bar-container ${className}`}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="progress-bar-fill"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export { Progress };
