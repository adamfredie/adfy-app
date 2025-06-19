"use client";

import * as React from "react";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={`aduffy-checkbox ${className || ''}`} {...props}>
      <div className="aduffy-checkbox-icon">✓</div>
    </div>
  );
}

export { Checkbox };
