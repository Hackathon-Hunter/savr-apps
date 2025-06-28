"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { SavingsAnalysis } from "@/lib/getAnalyze";

interface SavingsAnalysisContextType {
  analysisData: SavingsAnalysis | null;
  setAnalysisData: (data: SavingsAnalysis) => void;
  userInput: {
    target: string;
    monthlyIncome: number;
  } | null;
  setUserInput: (input: { target: string; monthlyIncome: number }) => void;
  icpToUsdRate: number;
  setIcpToUsdRate: (rate: number) => void;
}

const SavingsAnalysisContext = createContext<
  SavingsAnalysisContextType | undefined
>(undefined);

export function SavingsAnalysisProvider({ children }: { children: ReactNode }) {
  const [analysisData, setAnalysisData] = useState<SavingsAnalysis | null>(
    null
  );
  const [userInput, setUserInput] = useState<{
    target: string;
    monthlyIncome: number;
  } | null>(null);
  const [icpToUsdRate, setIcpToUsdRate] = useState(12.45);

  return (
    <SavingsAnalysisContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        userInput,
        setUserInput,
        icpToUsdRate,
        setIcpToUsdRate,
      }}
    >
      {children}
    </SavingsAnalysisContext.Provider>
  );
}

export function useSavingsAnalysis() {
  const context = useContext(SavingsAnalysisContext);
  if (context === undefined) {
    throw new Error(
      "useSavingsAnalysis must be used within a SavingsAnalysisProvider"
    );
  }
  return context;
}
