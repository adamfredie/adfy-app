"use client";

import * as React from "react";

function Toggle({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [active, setActive] = React.useState(false);
  return (
    <button
      className={className + (active ? " aduffy-toggle-active" : "")}
      onClick={() => setActive((a) => !a)}
      {...props}
    />
  );
}

export { Toggle };
