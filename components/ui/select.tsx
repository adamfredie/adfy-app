"use client";

import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

function Select({ options, value, onChange, className = '', ...props }: SelectProps) {
  return (
    <div className={`aduffy-select ${className}`} data-slot="select">
      <select
        className="aduffy-select-trigger border-input flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm transition outline-none focus-visible:ring-2"
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="size-4 opacity-50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▼</span>
    </div>
  );
}

export { Select };
