"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  filterCatalogPhones,
  type CatalogFilterOpts,
  type CatalogPhone,
} from "@/lib/catalog-filter";

export type CatalogFiltersContextValue = CatalogFilterOpts & {
  setBudgetRange: (min: number, max: number) => void;
  setSelectedBrand: (brand: string | null) => void;
  setSearchQuery: (q: string) => void;
  setActiveFeatureKey: (key: string | null) => void;
  togglePriority: (key: string) => void;
  compareBusy: boolean;
  setCompareBusy: (v: boolean) => void;
  budgetResultsQuery: string;
  setBudgetResultsQuery: (q: string) => void;
  showBudgetResults: boolean;
  setShowBudgetResults: (v: boolean) => void;
  filteredCatalog: CatalogPhone[];
  budgetGridPhones: CatalogPhone[];
  comparePhoneA: string;
  comparePhoneB: string;
  setComparePhoneA: (v: string) => void;
  setComparePhoneB: (v: string) => void;
  registerExecuteCompare: (fn: (() => Promise<void>) | null) => void;
  runRegisteredCompare: () => Promise<void>;
  catalogSectionRef: React.RefObject<HTMLElement | null>;
};

const CatalogFiltersContext = createContext<
  CatalogFiltersContextValue | undefined
>(undefined);

export function CatalogFiltersProvider({ children }: { children: ReactNode }) {
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(999999);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFeatureKey, setActiveFeatureKey] = useState<string | null>(null);
  const [budgetResultsQuery, setBudgetResultsQuery] = useState("");
  const [showBudgetResults, setShowBudgetResults] = useState(false);
  const [comparePhoneA, setComparePhoneA] = useState("");
  const [comparePhoneB, setComparePhoneB] = useState("");
  const [priorityKeys, setPriorityKeys] = useState<string[]>([]);
  const [compareBusy, setCompareBusy] = useState(false);

  const catalogSectionRef = useRef<HTMLElement | null>(null);
  const compareExecutorRef = useRef<(() => Promise<void>) | null>(null);

  const setBudgetRange = useCallback((min: number, max: number) => {
    setBudgetMin(min);
    setBudgetMax(max);
  }, []);

  const togglePriority = useCallback((key: string) => {
    setPriorityKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  const registerExecuteCompare = useCallback(
    (fn: (() => Promise<void>) | null) => {
      compareExecutorRef.current = fn;
    },
    [],
  );

  const runRegisteredCompare = useCallback(async () => {
    await compareExecutorRef.current?.();
  }, []);

  const filterOpts = useMemo(
    (): CatalogFilterOpts => ({
      budgetMin,
      budgetMax,
      selectedBrand,
      searchQuery,
      activeFeatureKey,
      priorityKeys,
    }),
    [
      budgetMin,
      budgetMax,
      selectedBrand,
      searchQuery,
      activeFeatureKey,
      priorityKeys,
    ],
  );

  const filteredCatalog = useMemo(
    () => filterCatalogPhones(filterOpts),
    [filterOpts],
  );

  const budgetGridPhones = useMemo(() => {
    const q = budgetResultsQuery.trim().toLowerCase();
    if (!q) return filteredCatalog;
    return filteredCatalog.filter((p) =>
      p.name.toLowerCase().includes(q),
    );
  }, [filteredCatalog, budgetResultsQuery]);

  const value = useMemo(
    (): CatalogFiltersContextValue => ({
      budgetMin,
      budgetMax,
      selectedBrand,
      searchQuery,
      activeFeatureKey,
      priorityKeys,
      setBudgetRange,
      setSelectedBrand,
      setSearchQuery,
      setActiveFeatureKey,
      togglePriority,
      compareBusy,
      setCompareBusy,
      budgetResultsQuery,
      setBudgetResultsQuery,
      showBudgetResults,
      setShowBudgetResults,
      filteredCatalog,
      budgetGridPhones,
      comparePhoneA,
      comparePhoneB,
      setComparePhoneA,
      setComparePhoneB,
      registerExecuteCompare,
      runRegisteredCompare,
      catalogSectionRef,
    }),
    [
      budgetMin,
      budgetMax,
      selectedBrand,
      searchQuery,
      activeFeatureKey,
      priorityKeys,
      setBudgetRange,
      budgetResultsQuery,
      compareBusy,
      showBudgetResults,
      filteredCatalog,
      budgetGridPhones,
      comparePhoneA,
      comparePhoneB,
      registerExecuteCompare,
      runRegisteredCompare,
      togglePriority,
      setCompareBusy,
    ],
  );

  return (
    <CatalogFiltersContext.Provider value={value}>
      {children}
    </CatalogFiltersContext.Provider>
  );
}

export function useCatalogFilters(): CatalogFiltersContextValue {
  const ctx = useContext(CatalogFiltersContext);
  if (!ctx) {
    throw new Error(
      "useCatalogFilters must be used within CatalogFiltersProvider",
    );
  }
  return ctx;
}
