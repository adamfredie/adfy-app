import * as React from "react";
import type { ComponentProps } from "react";

function Breadcrumb({ ...props }: ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={`text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5 ${className || ""}`}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={`inline-flex items-center gap-1.5 ${className || ""}`}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? "div" : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={`hover:text-foreground transition-colors ${className || ""}`}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={`text-foreground font-normal ${className || ""}`}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={`[&>svg]:size-3.5 ${className || ""}`}
      {...props}
    >
      {children ?? "→"}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={`flex size-9 items-center justify-center ${className || ""}`}
      {...props}
    >
      {"..."}
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
