"use client";

import { useCallback, useState } from "react";
import type { CompareApiData } from "@/types/compare";
import EmptyState from "./EmptyState";
import FloatingCompare from "./FloatingCompare";
import PrioritySection from "./PrioritySection";
import ResultsSection from "./ResultsSection";
import SelectorSection from "./SelectorSection";

export default function CompareWorkflow() {
  const [compareResult, setCompareResult] = useState<CompareApiData | null>(
    null,
  );

  const handleReset = useCallback(() => {
    setCompareResult(null);
  }, []);

  return (
    <>
      <SelectorSection onCompareSuccess={setCompareResult} />
      <PrioritySection />
      <ResultsSection result={compareResult} onReset={handleReset} />
      <EmptyState visible={!compareResult} />
      <FloatingCompare />
    </>
  );
}
