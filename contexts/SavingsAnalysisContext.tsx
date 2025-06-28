"use client";

import React, { createContext, useContext, useState } from 'react';
import { analyzeSavingsGoal, SavingsAnalysis } from '@/lib/savingsAnalysisService';
import { getSuggestions } from '@/lib/suggestionsService';

interface UserInput {
  target: string;
  monthlyIncome: number;
}

interface SavingsAnalysisContextType {
  // Data
  analysisData: SavingsAnalysis | null;
  userInput: UserInput | null;
  suggestions: string[];
  icpToUsdRate: number;
  
  // Loading states
  isAnalyzing: boolean;
  isLoadingSuggestions: boolean;
  
  // Error states
  analysisError: string | null;
  suggestionsError: string | null;
  
  // Actions
  analyzeTarget: (target: string, monthlyIncome: number, icpRate?: number) => Promise<void>;
  loadSuggestions: (monthlyIncome: number) => Promise<void>;
  setIcpToUsdRate: (rate: number) => void;
  clearAnalysis: () => void;
  
  // Legacy support (deprecated - use analyzeTarget instead)
  setAnalysisData?: (data: SavingsAnalysis) => void;
  setUserInput?: (input: UserInput) => void;
}

const SavingsAnalysisContext = createContext<SavingsAnalysisContextType | undefined>(undefined);

export function SavingsAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [analysisData, setAnalysisData] = useState<SavingsAnalysis | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [icpToUsdRate, setIcpToUsdRate] = useState<number>(12.45);
  
  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Error states
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const analyzeTarget = async (target: string, monthlyIncome: number, icpRate?: number) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const rate = icpRate || icpToUsdRate;
      const analysis = await analyzeSavingsGoal(target, monthlyIncome, rate);
      
      setAnalysisData(analysis);
      setUserInput({ target, monthlyIncome });
      
      if (icpRate) {
        setIcpToUsdRate(icpRate);
      }
    } catch (error) {
      console.error('Error analyzing target:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze savings goal');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSuggestions = async (monthlyIncome: number) => {
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    
    try {
      const newSuggestions = await getSuggestions(monthlyIncome);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestionsError(error instanceof Error ? error.message : 'Failed to load suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysisData(null);
    setUserInput(null);
    setAnalysisError(null);
  };

  const value: SavingsAnalysisContextType = {
    // Data
    analysisData,
    userInput,
    suggestions,
    icpToUsdRate,
    
    // Loading states
    isAnalyzing,
    isLoadingSuggestions,
    
    // Error states
    analysisError,
    suggestionsError,
    
    // Actions
    analyzeTarget,
    loadSuggestions,
    setIcpToUsdRate,
    clearAnalysis,
    
    // Legacy support (deprecated)
    setAnalysisData: setAnalysisData,
    setUserInput: setUserInput,
  };

  return (
    <SavingsAnalysisContext.Provider value={value}>
      {children}
    </SavingsAnalysisContext.Provider>
  );
}

export function useSavingsAnalysis() {
  const context = useContext(SavingsAnalysisContext);
  if (context === undefined) {
    throw new Error('useSavingsAnalysis must be used within a SavingsAnalysisProvider');
  }
  return context;
}