import { useState, useEffect, useCallback } from "react";
import { SavingsAnalysis } from "@/lib/getAnalyze";

interface SavingsAnalysisData {
  analysisData: SavingsAnalysis | null;
  userInput: {
    target: string;
    monthlyIncome: number;
  } | null;
  icpToUsdRate: number;
}

const STORAGE_KEY = "savr_savings_analysis";

// Default values
const defaultData: SavingsAnalysisData = {
  analysisData: null,
  userInput: null,
  icpToUsdRate: 12.45,
};

// Helper functions for localStorage
const getStoredData = (): SavingsAnalysisData => {
  if (typeof window === "undefined") return defaultData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return defaultData;
};

const setStoredData = (data: SavingsAnalysisData): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

export const useSavingsAnalysis = () => {
  const [data, setData] = useState<SavingsAnalysisData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = getStoredData();
    setData(storedData);
    setIsLoaded(true);
  }, []);

  // Update localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      setStoredData(data);
    }
  }, [data, isLoaded]);

  const setAnalysisData = useCallback((analysisData: SavingsAnalysis) => {
    setData(prev => ({ ...prev, analysisData }));
  }, []);

  const setUserInput = useCallback((userInput: { target: string; monthlyIncome: number }) => {
    setData(prev => ({ ...prev, userInput }));
  }, []);

  const setIcpToUsdRate = useCallback((icpToUsdRate: number) => {
    setData(prev => ({ ...prev, icpToUsdRate }));
  }, []);

  const clearData = useCallback(() => {
    setData(defaultData);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    // Data
    analysisData: data.analysisData,
    userInput: data.userInput,
    icpToUsdRate: data.icpToUsdRate,
    isLoaded,
    
    // Actions
    setAnalysisData,
    setUserInput,
    setIcpToUsdRate,
    clearData,
  };
}; 