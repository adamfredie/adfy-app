"use client";

import * as React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <span
      className="aduffy-tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}
      {visible && (
        <span className="aduffy-tooltip" style={{ position: "absolute", bottom: "100%", left: 0, background: "#333", color: "#fff", padding: "4px 8px", borderRadius: 4, fontSize: 12, whiteSpace: "nowrap", zIndex: 10 }}>{content}</span>
      )}
    </span>
  );
}

export { Tooltip };
