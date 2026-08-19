"use client"
import {ChevronDown} from "lucide-react"
import { useState, useId } from "react";

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const panelId = useId();
    const buttonId = useId();
  
    return (
      <div className="w-full rounded-lg border border-stone-200 bg-white overflow-hidden">
        <h3 className="m-0">
          <button
            id={buttonId}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen(prev => !prev)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-stone-900 font-medium
                       bg-white hover:bg-stone-50 active:bg-stone-100
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                       transition-colors"
          >
            <span>{title}</span>
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          hidden={!isOpen}
          className="px-4 pb-4 pt-1 text-stone-600 text-sm leading-relaxed"
        >
          {children}
        </div>
      </div>
    );
}