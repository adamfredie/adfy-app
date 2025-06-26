"use client";

import * as React from "react";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

Tabs.displayName = "Tabs";

function Tabs({ children, defaultTab, className = '', ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || '0');
  return (
    <div data-slot="tabs" className={`aduffy-tabs ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const type = child.type;
        const displayName = (type as any).displayName;
        if (displayName === "TabsList" || displayName === "TabsTrigger" || displayName === "TabsContent") {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  className?: string;
}

TabsList.displayName = "TabsList";

function TabsList({ children, className = '', activeTab, setActiveTab, ...props }: TabsListProps) {
  const { activeTab: _a, setActiveTab: _b, ...rest } = props as any;
  return (
    <div data-slot="tabs-list" className={className} {...rest}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        const type = child.type;
        const displayName = (type as any).displayName;
        if (displayName === "TabsTrigger") {
          const existingTabValue = child.props.tabValue;
          const tabValue = existingTabValue || idx.toString();
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab, tabValue });
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  tabValue?: string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  className?: string;
}

TabsTrigger.displayName = "TabsTrigger";

function TabsTrigger({ children, className = '', tabValue = '', activeTab, setActiveTab, ...props }: TabsTriggerProps) {
  const { activeTab: _a, setActiveTab: _b, ...rest } = props as any;
  return (
    <button
      data-slot="tabs-trigger"
      className={`${className} ${activeTab === tabValue ? 'aduffy-tab-active' : ''}`}
      onClick={() => setActiveTab && setActiveTab(tabValue)}
      aria-selected={activeTab === tabValue}
      {...rest}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  tabValue?: string;
  activeTab?: string;
  className?: string;
}

TabsContent.displayName = "TabsContent";

function TabsContent({ children, className = '', tabValue = '', activeTab, ...props }: TabsContentProps) {
  if (activeTab !== tabValue) return null;
  const { activeTab: _a, setActiveTab: _b, ...rest } = props as any;
  return (
    <div data-slot="tabs-content" className={className} {...rest}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
