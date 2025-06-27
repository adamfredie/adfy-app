import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  icon: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({ value, onChange, options, disabled, className }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find(opt => opt.value === value);

  return (
    <div className={`custom-select ${className || ""}`} ref={ref}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setOpen(o => !o)}
        disabled={disabled}
      >
        <span className="custom-select-icon">{selected?.icon}</span>
        <span>{selected?.label}</span>
        <span className="custom-select-arrow">▼</span>
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`custom-select-option${opt.value === value ? " selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span className="custom-select-icon">{opt.icon}</span>
              <span>{opt.label}</span>
              {opt.value === value && <span className="custom-select-check">✔</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 