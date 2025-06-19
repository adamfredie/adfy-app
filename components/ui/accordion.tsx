"use client";

import * as React from "react";

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultOpenIndex?: number;
}

function Accordion({ children, defaultOpenIndex = 0, ...props }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(defaultOpenIndex);
  return (
    <div data-slot="accordion" {...props}>
      {React.Children.map(children, (child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              open: openIndex === idx,
              onToggle: () => setOpenIndex(openIndex === idx ? null : idx),
              index: idx,
            })
          : child
      )}
    </div>
  );
}

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function AccordionItem({
  className = '',
  open = false,
  onToggle,
  title,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <div data-slot="accordion-item" className={`border-b last:border-b-0 ${className}`} {...props}>
      <div className="flex">
        <button
          type="button"
          data-slot="accordion-trigger"
          className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
          aria-expanded={open}
          onClick={onToggle}
        >
          {title}
        </button>
      </div>
      <div
        data-slot="accordion-content"
        className={`overflow-hidden text-sm transition-all ${open ? 'max-h-96' : 'max-h-0'} pt-0 pb-4`}
        style={{ maxHeight: open ? '1000px' : '0', transition: 'max-height 0.3s ease' }}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}

export { Accordion, AccordionItem };
