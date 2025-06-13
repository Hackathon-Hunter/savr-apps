"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ICPPriceData {
  price: number;
  change24h: number;
  changePercent24h: number;
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
}

interface ICPPriceContextType {
  priceData: ICPPriceData;
  refreshPrice: () => Promise<void>;
  formatUSD: (icpAmount: number) => string;
  formatICP: (amount: number) => string;
}

const ICPPriceContext = createContext<ICPPriceContextType | undefined>(
  undefined
);

export const useICPPrice = () => {
  const context = useContext(ICPPriceContext);
  if (context === undefined) {
    throw new Error("useICPPrice must be used within an ICPPriceProvider");
  }
  return context;
};

interface ICPPriceProviderProps {
  children: ReactNode;
}

export const ICPPriceProvider: React.FC<ICPPriceProviderProps> = ({
  children,
}) => {
  const [priceData, setPriceData] = useState<ICPPriceData>({
    price: 0,
    change24h: 0,
    changePercent24h: 0,
    lastUpdated: new Date(),
    isLoading: true,
    error: null,
  });

  const fetchICPPrice = async (): Promise<void> => {
    try {
      setPriceData((prev) => ({ ...prev, isLoading: true, error: null }));

      // Using CoinGecko API for real-time ICP price
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data["internet-computer"]) {
        throw new Error("Invalid response format from CoinGecko API");
      }

      const icpData = data["internet-computer"];
      const price = icpData.usd || 0;
      const changePercent24h = icpData.usd_24h_change || 0;
      const change24h = (price * changePercent24h) / 100;

      setPriceData({
        price,
        change24h,
        changePercent24h,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch ICP price:", error);
      setPriceData((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch ICP price",
      }));
    }
  };

  const refreshPrice = async (): Promise<void> => {
    await fetchICPPrice();
  };

  const formatUSD = (icpAmount: number): string => {
    const usdValue = icpAmount * priceData.price;
    return usdValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatICP = (amount: number): string => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchICPPrice();
  }, []);

  // Set up periodic price updates every 30 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchICPPrice();
  //   }, 30000); // 30 seconds

  //   return () => clearInterval(interval);
  // }, []);

  // Set up visibility change listener to refresh when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchICPPrice();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const contextValue: ICPPriceContextType = {
    priceData,
    refreshPrice,
    formatUSD,
    formatICP,
  };

  return (
    <ICPPriceContext.Provider value={contextValue}>
      {children}
    </ICPPriceContext.Provider>
  );
};
