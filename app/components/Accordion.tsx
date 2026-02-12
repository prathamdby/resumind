"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { cn } from "@/app/lib/utils";

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
  expandAll: () => void;
  collapseAll: () => void;
  allItemIds: string[];
  registerItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined,
);

const STORAGE_VERSION = "v1";
const storageKey = (persistKey: string) =>
  `resumind-${STORAGE_VERSION}-accordion-${persistKey}`;

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string | string[];
  allowMultiple?: boolean;
  className?: string;
  persistKey?: string;
  showControls?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
  persistKey,
  showControls = false,
}) => {
  const allItemIdsRef = useRef<string[]>([]);
  const [itemsRegistered, setItemsRegistered] = useState(false);

  const getInitialState = (): string[] => {
    if (Array.isArray(defaultOpen)) {
      return defaultOpen;
    }
    if (typeof defaultOpen === "string") {
      return [defaultOpen];
    }
    return [];
  };

  const [activeItems, setActiveItems] = useState<string[]>(getInitialState);
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (itemsRegistered) return;
    const timer = setTimeout(() => {
      setItemsRegistered(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [itemsRegistered]);

  useEffect(() => {
    if (persistKey && typeof window !== "undefined") {
      try {
        const newKey = storageKey(persistKey);
        const oldKey = `accordion-${persistKey}`;
        let stored = localStorage.getItem(newKey);

        if (!stored) {
          // Migration path
          const oldStored = localStorage.getItem(oldKey);
          if (oldStored) {
            stored = oldStored;
            localStorage.setItem(newKey, oldStored);
            localStorage.removeItem(oldKey);
          }
        }

        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setActiveItems(parsed);
          }
        }
      } catch (error) {
        console.warn("Could not restore accordion state", error);
      }
    }
  }, [persistKey]);

  useEffect(() => {
    if (!persistKey || typeof window === "undefined") {
      return;
    }

    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey(persistKey),
          JSON.stringify(activeItems),
        );
      } catch (error) {
        if (error instanceof DOMException) {
          if (error.name === "QuotaExceededError") {
            try {
              const allKeys = Object.keys(localStorage);
              const accordionKeys = allKeys
                .filter((key) => key.startsWith(`resumind-${STORAGE_VERSION}-accordion-`))
                .sort();

              accordionKeys
                .slice(0, Math.max(0, accordionKeys.length - 5))
                .forEach((key) => {
                  localStorage.removeItem(key);
                });

              localStorage.setItem(
                storageKey(persistKey),
                JSON.stringify(activeItems),
              );
            } catch (retryError) {
              console.warn("Could not persist accordion state", retryError);
            }
          } else if (error.name === "SecurityError") {
            console.info("localStorage unavailable (private browsing?)");
          }
        } else {
          console.warn("Failed to save accordion state", error);
        }
      }
    }, 400);

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, [activeItems, persistKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !itemsRegistered) return;

    const hash = window.location.hash.slice(1);
    if (hash && allItemIdsRef.current.includes(hash)) {
      setActiveItems((prev) => (prev.includes(hash) ? prev : [...prev, hash]));
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [itemsRegistered]);

  const registerItem = useCallback((id: string) => {
    if (!allItemIdsRef.current.includes(id)) {
      allItemIdsRef.current = [...allItemIdsRef.current, id];
    }
  }, []);

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  const expandAll = () => {
    setActiveItems([...allItemIdsRef.current]);
  };

  const collapseAll = () => {
    setActiveItems([]);
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider
      value={{
        activeItems,
        toggleItem,
        isItemActive,
        expandAll,
        collapseAll,
        allItemIds: allItemIdsRef.current,
        registerItem,
      }}
    >
      {showControls && itemsRegistered && allItemIdsRef.current.length > 0 && (
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            onClick={expandAll}
            className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            type="button"
          >
            Expand all
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={collapseAll}
            className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            type="button"
          >
            Collapse all
          </button>
        </div>
      )}
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  className = "",
}) => {
  const { isItemActive, registerItem } = useAccordion();
  const active = isItemActive(id);

  useEffect(() => {
    registerItem(id);
  }, [id, registerItem]);

  return (
    <div
      id={id}
      data-active={active}
      className={cn(
        "overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[var(--shadow-ring)] transition-all duration-200",
        active ? "shadow-[0_22px_45px_-30px_rgba(99,102,241,0.35)]" : "",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);
  const contentId = `${itemId}-content`;
  const headerId = `${itemId}-header`;

  const defaultIcon = (
    <svg
      className={cn("h-4 w-4 transition-transform duration-200", {
        "rotate-180": isActive,
      })}
      fill="none"
      stroke="#334155"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M6 9l6 6 6-6"
      />
    </svg>
  );

  return (
    <button
      type="button"
      id={headerId}
      onClick={() => toggleItem(itemId)}
      className={cn(
        "flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-slate-700 hover:bg-slate-50/60",
        className,
      )}
      aria-expanded={isActive}
      aria-controls={contentId}
    >
      <div className="flex flex-1 items-center gap-3">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="flex-1">{children}</div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);
  const contentId = `${itemId}-content`;
  const headerId = `${itemId}-header`;

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={headerId}
      className={cn(
        "grid transition-all duration-300 ease-in-out",
        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className={cn("overflow-hidden px-6 pb-6", className)}>
        {children}
      </div>
    </div>
  );
};
