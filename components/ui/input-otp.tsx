"use client";

import * as React from "react";

function InputOTP({ value, onChange, length = 6, className = "", ...props }: { value: string; onChange: (val: string) => void; length?: number; className?: string }) {
  return (
    <input
      type="text"
      maxLength={length}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={className}
      {...props}
    />
  );
}

export { InputOTP };
