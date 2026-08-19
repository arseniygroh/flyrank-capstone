"use client";

import { useState, useRef, KeyboardEvent } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  ariaLabel: string;
}

export default function Tabs({ items, defaultValue, ariaLabel }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultValue || items[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case "ArrowRight":
        newIndex = (index + 1) % items.length; 
        break;
      case "ArrowLeft":
        newIndex = (index - 1 + items.length) % items.length; 
        break;
      default:
        return;
    }
    e.preventDefault(); 
    tabRefs.current[newIndex]?.focus();
    setActiveTabId(items[newIndex].id);
  };

  return (
    <div className="w-full">
      <div 
        role="tablist" 
        aria-label={ariaLabel}
        className="flex border-b border-neutral-700 w-full"
      >
        {items.map((tab, index) => {
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1} 
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-6 py-3 text-sm font-bold transition-all focus:outline-none focus-visible:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${
                isActive 
                  ? "text-white border-b-2 border-green-500" 
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {items.map(tab => {
        const isActive = activeTabId === tab.id;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isActive}
            tabIndex={0} 
            className="p-6 bg-neutral-900 border border-t-0 border-neutral-800 rounded-b-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white text-neutral-300 leading-relaxed"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}