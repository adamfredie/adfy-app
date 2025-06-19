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
      className={`aduffy-progress relative h-2 w-full overflow-hidden rounded-full bg-muted ${className}`}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="aduffy-progress-indicator bg-primary h-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export { Progress };
