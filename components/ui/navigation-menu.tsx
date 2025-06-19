import * as React from "react";
import type { ComponentProps } from "react";

function NavigationMenu({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav className={`aduffy-navigation-menu ${className}`} {...props}>
      {children}
    </nav>
  );
}

function NavigationMenuItem({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-navigation-menu-item ${className}`} {...props}>
      {children}
    </div>
  );
}

function NavigationMenuLink({ className = "", children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`aduffy-navigation-menu-link ${className}`} {...props}>
      {children}
    </a>
  );
}

export { NavigationMenu, NavigationMenuItem, NavigationMenuLink };
