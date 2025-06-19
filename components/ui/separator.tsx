"use client";

import * as React from "react";

function Separator({ className = '', ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={`aduffy-separator ${className}`} {...props} />;
}

export { Separator };
