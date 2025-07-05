"use client";

import * as React from "react";

function RadioGroup({ className = '', children, ...props }: { className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="radio-group"
      className={className + ' grid gap-3'}
      role="radiogroup"
      {...props}
    >
      {children}
    </div>
  );
}

function RadioGroupItem({ className = '', checked, onChange, ...props }: { className?: string; checked?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    // <label className={className + ' aduffy-radio-group-item border-input text-primary aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center relative'}>
    <label
    className={
      `confidence-radio-dot${checked ? ' checked' : ''} ` +
      className +
      ' aduffy-radio-group-item ...'
    }
  >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      {checked && (
        // <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">●</span>
        <span className="confidence-radio-dot-inner" />
      )}
    </label>
  );
}

export { RadioGroup, RadioGroupItem };
