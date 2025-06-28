"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plane,
  Car,
  Home,
  GraduationCap,
  LogOut,
  User,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useAuth } from "@/hooks/useAuth";
import { useICPPrice } from "@/contexts/ICPPriceContext";
import { getBalanceByPrincipal, getUserSavings } from "@/service/icService";

// Icon mapping for different saving types
const getSavingIcon = (savingName: string) => {
  const name = savingName.toLowerCase();
  if (
    name.includes("vacation") ||
    name.includes("travel") ||
    name.includes("trip")
  )
    return Plane;
  if (name.includes("car") || name.includes("vehicle")) return Car;
  if (
    name.includes("emergency") ||
    name.includes("home") ||
    name.includes("house")
  )
    return Home;
  if (
    name.includes("education") ||
    name.includes("school") ||
    name.includes("study")
  )
    return GraduationCap;
  return Target; // Default icon
};

// Enhanced color mapping for modern design
const getSavingColor = (index: number) => {
  const colors = [
    "from-blue-500/20 to-cyan-500/20",
    "from-purple-500/20 to-pink-500/20",
    "from-green-500/20 to-emerald-500/20",
    "from-orange-500/20 to-amber-500/20",
    "from-rose-500/20 to-pink-500/20",
    "from-indigo-500/20 to-purple-500/20",
  ];
  return colors[index % colors.length];
};

interface DashboardSaving {
  id: number;
  title: string;
  target: number;
  current: number;
  monthlyTarget: number;
  targetDate: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  progress: number;
  status: string;
  isStaking: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);
  const [icpBalance, setIcpBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingSavings, setIsLoadingSavings] = useState(true);
  const [savingsPlans, setSavingsPlans] = useState<DashboardSaving[]>([]);
  const [savingsError, setSavingsError] = useState<string>("");
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const { actor, isAuthenticated, principal, isLoading, logout } = useAuth();
  const { priceData, refreshPrice, formatUSD, formatICP } = useICPPrice();

  // Redirect to connect-wallet if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/connect-wallet");
    }
  }, [isAuthenticated, isLoading, router]);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setShowAccountMenu(false);
      }
    };

    if (showAccountMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showAccountMenu]);

  useEffect(() => {
    const fetchICPBalance = async () => {
      if (!actor || !isAuthenticated || !principal) return;

      setIsLoadingBalance(true);
      try {
        const balance = await getBalanceByPrincipal(actor, principal);

        setIcpBalance(Number(balance) / 100000000);
      } catch (error) {
        console.error("Failed to fetch ICP balance:", error);
        setIcpBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchICPBalance();
  }, [actor, isAuthenticated, principal]);

  // Fetch savings data from IC backend
  useEffect(() => {
    const fetchSavingsData = async () => {
      if (!actor || !isAuthenticated || !principal) return;

      setIsLoadingSavings(true);
      setSavingsError("");

      try {
        // Fetch user savings
        const userSavingsData = await getUserSavings(actor, principal);

        // Convert backend savings to dashboard format
        const dashboardSavings: DashboardSaving[] = userSavingsData.map(
          (saving, index) => {
            // Convert nanoseconds timestamps to readable dates
            const targetDate = new Date(
              Number(saving.deadline) / 1000000
            ).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });

            // Convert amounts from e8s (1 ICP = 100,000,000 e8s) to ICP
            const targetAmount = Number(saving.totalSaving) / 100000000;
            const currentAmount = Number(saving.currentAmount) / 100000000;
            const monthlyTarget = Number(saving.amount) / 100000000; // This is the target monthly saving

            const progress =
              targetAmount > 0
                ? Math.round((currentAmount / targetAmount) * 100)
                : 0;

            // Map status
            let status = "Active";
            if ("Completed" in saving.status) status = "Completed";
            if ("Cancelled" in saving.status) status = "Cancelled";

            return {
              id: Number(saving.id),
              title: saving.savingName,
              target: targetAmount,
              current: currentAmount,
              monthlyTarget: monthlyTarget,
              targetDate: targetDate,
              icon: getSavingIcon(saving.savingName),
              color: getSavingColor(index),
              progress: Math.min(progress, 100), // Cap at 100%
              status: status,
              isStaking: saving.isStaking,
            };
          }
        );

        setSavingsPlans(dashboardSavings);
      } catch (error) {
        console.error("Failed to fetch savings data:", error);
        setSavingsError(
          "Failed to load savings data. Please try refreshing the page."
        );
      } finally {
        setIsLoadingSavings(false);
      }
    };

    fetchSavingsData();
  }, [actor, isAuthenticated, principal]);

  const refreshSavingsData = async () => {
    if (!actor || !isAuthenticated || !principal) return;

    setIsLoadingSavings(true);
    try {
      // Re-fetch savings data
      const userSavingsData = await getUserSavings(actor, principal);

      // Convert to dashboard format
      const dashboardSavings: DashboardSaving[] = userSavingsData.map(
        (saving, index) => {
          const targetDate = new Date(
            Number(saving.deadline) / 1000000
          ).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });

          const targetAmount = Number(saving.totalSaving) / 100000000;
          const currentAmount = Number(saving.currentAmount) / 100000000;
          const monthlyTarget = Number(saving.amount) / 100000000;

          const progress =
            targetAmount > 0
              ? Math.round((currentAmount / targetAmount) * 100)
              : 0;

          let status = "Active";
          if ("Completed" in saving.status) status = "Completed";
          if ("Cancelled" in saving.status) status = "Cancelled";

          return {
            id: Number(saving.id),
            title: saving.savingName,
            target: targetAmount,
            current: currentAmount,
            monthlyTarget: monthlyTarget,
            targetDate: targetDate,
            icon: getSavingIcon(saving.savingName),
            color: getSavingColor(index),
            progress: Math.min(progress, 100),
            status: status,
            isStaking: saving.isStaking,
          };
        }
      );

      setSavingsPlans(dashboardSavings);
      setSavingsError("");
    } catch (error) {
      console.error("Failed to refresh savings data:", error);
      setSavingsError("Failed to refresh savings data.");
    } finally {
      setIsLoadingSavings(false);
    }
  };

  const totalBalance = savingsPlans.reduce(
    (sum, plan) => sum + plan.current,
    0
  );
  const totalTarget = savingsPlans.reduce((sum, plan) => sum + plan.target, 0);
  const totalMonthly = savingsPlans.reduce(
    (sum, plan) => sum + plan.monthlyTarget,
    0
  );

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 20) return principal;
    return `${principal.slice(0, 8)}...${principal.slice(-8)}`;
  };

  const copyPrincipal = async () => {
    if (!principal) return;

    try {
      await navigator.clipboard.writeText(principal);
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2000);
    } catch (error) {
      console.error("Failed to copy principal:", error);
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log("Logout button clicked");
      setShowAccountMenu(false);
      await logout();
      router.push("/connect-wallet");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreateNew = () => {
    router.push("input-target");
  };

  // Updated to pass the saving plan ID to the details page
  const handleViewPlan = (planId: number) => {
    console.log(`Viewing plan ${planId}`);
    router.push(`/details?id=${planId}`);
  };

  const refreshBalance = async () => {
    if (!actor || !isAuthenticated || !principal) return;
    
    setIsLoadingBalance(true);
    try {
      const balance = await getBalanceByPrincipal(actor, principal);

      setIcpBalance(Number(balance) / 100000000);
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleRefreshPrice = async () => {
    await refreshPrice();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Colorful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />

      {/* Colorful Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b"]}
          particleCount={40}
          particleSpread={8}
          speed={0.015}
          particleBaseSize={30}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Top Account Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-20 p-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Modern Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Target size={20} className="text-white" />
              </div>
            </div>
            <div>
              <span className="text-gray-800 font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SAVR</span>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>

          {/* Modern Account Info */}
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="group flex items-center space-x-4 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-500"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-gray-800 text-sm font-semibold">
                  {formatPrincipal(principal || "")}
                </p>
                <p className="text-purple-600 text-xs font-medium">
                  {isLoadingBalance
                    ? "Loading..."
                    : `${formatICP(icpBalance)} ICP`}
                </p>
              </div>
              <MoreHorizontal size={16} className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
            </button>

            {/* Modern Account Dropdown */}
            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-96 bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-2xl shadow-purple-500/10 z-50"
              >
                {/* Modern ICP Balance */}
                <div className="mb-6 p-5 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl border border-purple-300/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-800 font-semibold text-lg flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span>ICP Balance</span>
                    </h4>
                    <button
                      onClick={refreshBalance}
                      disabled={isLoadingBalance}
                      className="p-2 rounded-lg bg-purple-500/20 text-purple-600 hover:bg-purple-500/30 hover:text-purple-700 transition-all duration-300 disabled:opacity-50"
                    >
                      <RefreshCw
                        size={16}
                        className={isLoadingBalance ? "animate-spin" : ""}
                      />
                    </button>
                  </div>
                  {isLoadingBalance ? (
                    <div className="animate-pulse">
                      <div className="h-7 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-lg mb-2"></div>
                      <div className="h-5 bg-gradient-to-r from-blue-300/20 to-transparent rounded-lg w-32"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {formatICP(icpBalance)} ICP
                      </p>
                      <p className="text-blue-600 text-sm font-medium">
                        ≈ ${formatUSD(icpBalance)} USD
                      </p>
                    </>
                  )}
                </div>

                {/* Modern Principal ID */}
                <div className="mb-6 p-5 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-2xl border border-blue-300/20 backdrop-blur-sm">
                  <h4 className="text-gray-800 font-semibold text-lg mb-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Principal ID</span>
                  </h4>
                  <div className="flex items-center space-x-3">
                    <p className="text-gray-700 text-sm font-mono flex-1 break-all bg-white/70 rounded-xl p-3 border border-blue-200/50 shadow-inner">
                      {principal}
                    </p>
                    <button
                      onClick={copyPrincipal}
                      className="p-3 rounded-xl bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 hover:text-blue-700 transition-all duration-300"
                    >
                      {copiedPrincipal ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                  {copiedPrincipal && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm mt-3 font-semibold flex items-center space-x-2"
                    >
                      <Check size={16} />
                      <span>Copied to clipboard!</span>
                    </motion.p>
                  )}
                </div>

                {/* Modern Live ICP Price */}
                <div className="mb-6 p-5 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 rounded-2xl border border-orange-300/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-800 font-semibold text-lg flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span>ICP Price</span>
                    </h4>
                    <button
                      onClick={handleRefreshPrice}
                      disabled={priceData.isLoading}
                      className="p-2 rounded-lg bg-orange-500/20 text-orange-600 hover:bg-orange-500/30 hover:text-orange-700 transition-all duration-300 disabled:opacity-50"
                    >
                      <RefreshCw
                        size={16}
                        className={priceData.isLoading ? "animate-spin" : ""}
                      />
                    </button>
                  </div>

                  {priceData.error ? (
                    <div className="flex items-center space-x-3 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <AlertCircle size={18} />
                      <span className="text-sm font-medium">Failed to load price</span>
                    </div>
                  ) : priceData.isLoading && priceData.price === 0 ? (
                    <div className="animate-pulse">
                      <div className="h-7 bg-gradient-to-r from-orange-300/20 to-amber-300/20 rounded-lg mb-2"></div>
                      <div className="h-5 bg-gradient-to-r from-green-300/20 to-transparent rounded-lg w-28"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <p className="text-gray-800 text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                          ${priceData.price.toFixed(2)}
                        </p>
                        <div
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl font-semibold ${
                            priceData.changePercent24h >= 0
                              ? "text-green-600 bg-green-100 border border-green-200"
                              : "text-red-600 bg-red-100 border border-red-200"
                          }`}
                        >
                          {priceData.changePercent24h >= 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          <span className="text-sm">
                            {Math.abs(priceData.changePercent24h).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-gray-500 text-sm font-medium">
                          Updated {formatTimeAgo(priceData.lastUpdated)}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Modern Logout Button */}
                <button
                  onClick={handleLogout}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-pink-500 border border-red-300 rounded-2xl p-4 text-white font-semibold hover:from-red-600 hover:to-pink-600 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 cursor-pointer select-none active:scale-95"
                  style={{ pointerEvents: "auto" }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-20 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                  <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Savings Dashboard
                  </span>
                </h1>
                <p className="text-gray-700 text-xl font-light max-w-2xl leading-relaxed">
                  Track your progress toward financial freedom with AI-powered insights
                </p>
                {/* Modern Live ICP Rate Display */}
                <div className="mt-6 flex items-center space-x-4 p-5 bg-gradient-to-r from-slate-100/80 to-gray-100/60 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
                  {priceData.error ? (
                    <div className="flex items-center space-x-3 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <AlertCircle size={18} />
                      <span className="text-sm font-medium">Price unavailable</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/40"></div>
                      <span className="text-gray-700 text-base font-medium">
                        1 ICP = <span className="text-gray-900 font-bold text-lg">${priceData.price.toFixed(2)}</span> USD
                      </span>
                      <div
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl font-semibold ${
                          priceData.changePercent24h >= 0
                            ? "text-green-600 bg-green-100 border border-green-200"
                            : "text-red-600 bg-red-100 border border-red-200"
                        }`}
                      >
                        {priceData.changePercent24h >= 0 ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        <span className="text-sm">
                          {Math.abs(priceData.changePercent24h).toFixed(2)}%
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">Live</span>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <ShimmerButton
                  className="px-8 py-4 text-lg font-bold"
                  onClick={handleCreateNew}
                  background="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                  shimmerColor="#ffffff"
                  shimmerSize="0.05em"
                >
                  <div className="flex items-center space-x-3">
                    <Plus size={24} className="text-white" />
                    <span className="text-white">Create New Saving</span>
                  </div>
                </ShimmerButton>
              </div>
            </div>
          </motion.div>

          {/* Modern Balance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl shadow-purple-500/5">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Account Overview
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-3 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 hover:text-purple-700 transition-colors duration-300"
                  >
                    {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Wallet size={20} className="text-white" />
                        </div>
                        <p className="text-blue-700 text-sm font-medium">ICP Wallet</p>
                      </div>
                      <p className="text-gray-800 text-3xl font-bold mb-1">
                        {showBalance
                          ? isLoadingBalance
                            ? "••••••"
                            : `${formatICP(icpBalance)} ICP`
                          : "••••••"}
                      </p>
                      {showBalance && !isLoadingBalance && (
                        <p className="text-blue-600 text-sm font-medium">
                          ≈ ${formatUSD(icpBalance)} USD
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Target size={20} className="text-white" />
                        </div>
                        <p className="text-purple-700 text-sm font-medium">Total Saved</p>
                      </div>
                      <p className="text-gray-800 text-3xl font-bold mb-1">
                        {showBalance
                          ? `${formatICP(totalBalance)} ICP`
                          : "••••••"}
                      </p>
                      {showBalance && (
                        <p className="text-purple-600 text-sm font-medium">
                          ≈ ${formatUSD(totalBalance)} USD
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 hover:border-green-300 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <TrendingUp size={20} className="text-white" />
                        </div>
                        <p className="text-green-700 text-sm font-medium">Monthly Savings</p>
                      </div>
                      <p className="text-gray-800 text-3xl font-bold mb-1">
                        {showBalance
                          ? `${formatICP(totalMonthly)} ICP`
                          : "••••••"}
                      </p>
                      {showBalance && (
                        <p className="text-green-600 text-sm font-medium">
                          ≈ ${formatUSD(totalMonthly)} USD
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50 hover:border-orange-300 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                          <Calendar size={20} className="text-white" />
                        </div>
                        <p className="text-orange-700 text-sm font-medium">Active Plans</p>
                      </div>
                      <p className="text-gray-800 text-3xl font-bold mb-1">
                        {savingsPlans.length}
                      </p>
                      <p className="text-orange-600 text-sm font-medium">
                        {savingsPlans.length === 1 ? 'Plan' : 'Plans'} Active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modern Overall Progress */}
                {totalTarget > 0 && (
                  <div className="mt-10 p-6 bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-2xl border border-purple-200/50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700 text-lg font-semibold">
                          Overall Progress
                        </span>
                      </div>
                      <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                        <span className="text-white font-bold text-lg">
                          {Math.round((totalBalance / totalTarget) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${(totalBalance / totalTarget) * 100}%`,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-lg"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-gray-600">
                        {formatICP(totalBalance)} ICP saved
                      </span>
                      <span className="text-gray-600">
                        {formatICP(totalTarget)} ICP target
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Savings Plans List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Savings Plans
                </h2>
              </div>
              {savingsPlans.length > 0 && (
                <button
                  onClick={refreshSavingsData}
                  disabled={isLoadingSavings}
                  className="flex items-center space-x-3 px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl text-gray-700 hover:text-gray-900 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={isLoadingSavings ? "animate-spin" : ""}
                  />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              )}
            </div>

            {/* Modern Error State */}
            {savingsError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-3xl p-8 text-center shadow-lg shadow-red-500/5">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-2xl"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle size={32} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-gray-800 text-xl font-bold mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text">
                    Error Loading Savings
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">{savingsError}</p>
                  <button
                    onClick={refreshSavingsData}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 border border-red-300 rounded-2xl text-white font-semibold hover:from-red-600 hover:to-pink-600 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

            {/* Modern Loading State */}
            {isLoadingSavings && savingsPlans.length === 0 && (
              <div className="grid gap-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-white/80 rounded-3xl p-8 border border-gray-200 shadow-lg">
                      <div className="flex items-center space-x-6 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-2xl"></div>
                        <div className="flex-1">
                          <div className="h-7 bg-gradient-to-r from-purple-200/60 to-pink-200/60 rounded-lg mb-3 w-64"></div>
                          <div className="h-5 bg-gradient-to-r from-blue-200/60 to-cyan-200/60 rounded-lg w-32"></div>
                        </div>
                        <div className="flex space-x-3">
                          <div className="h-10 bg-gradient-to-r from-blue-200/60 to-cyan-200/60 rounded-xl w-24"></div>
                          <div className="h-10 bg-gradient-to-r from-green-200/60 to-emerald-200/60 rounded-xl w-28"></div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="h-5 bg-gradient-to-r from-gray-200/60 to-gray-300/60 rounded-lg mb-3"></div>
                        <div className="h-3 bg-gradient-to-r from-purple-200/60 to-pink-200/60 rounded-full"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="h-20 bg-gradient-to-br from-blue-100/80 to-cyan-100/80 rounded-2xl"></div>
                        <div className="h-20 bg-gradient-to-br from-green-100/80 to-emerald-100/80 rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modern Savings Plans Grid */}
            {!isLoadingSavings && savingsPlans.length > 0 && (
              <div className="grid gap-8">
                {savingsPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                    <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} rounded-2xl blur-lg opacity-60`}></div>
                            <div className={`relative w-16 h-16 bg-gradient-to-br ${plan.color.replace('/20', '')} rounded-2xl flex items-center justify-center shadow-lg`}>
                              <plan.icon size={28} className="text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-gray-800 font-bold text-2xl">
                                {plan.title}
                              </h3>
                              {plan.isStaking && (
                                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1 rounded-xl font-semibold shadow-lg">
                                  Staking
                                </span>
                              )}
                              <span
                                className={`text-sm px-3 py-1 rounded-xl font-semibold ${
                                  plan.status === "Active"
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                    : plan.status === "Completed"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                }`}
                              >
                                {plan.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-base font-medium">
                              Target: {plan.targetDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <ShimmerButton
                            className="px-6 py-3 text-sm font-semibold"
                            onClick={() => handleViewPlan(plan.id)}
                            background="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                            shimmerColor="#ffffff"
                            shimmerSize="0.05em"
                          >
                            <span className="text-white">Details</span>
                          </ShimmerButton>
                          <ShimmerButton
                            className="px-6 py-3 text-sm font-semibold"
                            onClick={() =>
                              router.push(`/customize-plan?id=${plan.id}`)
                            }
                            background="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                            shimmerColor="#ffffff"
                            shimmerSize="0.05em"
                          >
                            <span className="text-white">Customize</span>
                          </ShimmerButton>
                          <button className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300">
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Modern Progress Section */}
                      <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex flex-col">
                            <span className="text-gray-700 text-base font-semibold">
                              {formatICP(plan.current)} ICP of{" "}
                              {formatICP(plan.target)} ICP
                            </span>
                            <span className="text-gray-500 text-sm font-medium">
                              ≈ ${formatUSD(plan.current)} of $
                              {formatUSD(plan.target)} USD
                            </span>
                          </div>
                          <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <span className="text-white font-bold text-lg">
                              {plan.progress}%
                            </span>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${plan.progress}%` }}
                            transition={{
                              duration: 1.5,
                              ease: "easeOut",
                              delay: 0.8 + index * 0.1,
                            }}
                            className={`h-full bg-gradient-to-r ${plan.color.replace('/20', '')} rounded-full shadow-lg`}
                          />
                        </div>
                      </div>

                      {/* Modern Stats */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200/50 hover:border-blue-300 transition-all duration-300">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                              <p className="text-blue-700 text-sm font-semibold">
                                Monthly Target
                              </p>
                            </div>
                            <p className="text-gray-800 text-xl font-bold mb-1">
                              {formatICP(plan.monthlyTarget)} ICP
                            </p>
                            <p className="text-blue-600 text-sm font-medium">
                              ≈ ${formatUSD(plan.monthlyTarget)} USD
                            </p>
                          </div>
                        </div>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200/50 hover:border-green-300 transition-all duration-300">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                              <p className="text-green-700 text-sm font-semibold">
                                Remaining
                              </p>
                            </div>
                            <p className="text-gray-800 text-xl font-bold mb-1">
                              {formatICP(Math.max(0, plan.target - plan.current))}{" "}
                              ICP
                            </p>
                            <p className="text-green-600 text-sm font-medium">
                              ≈ $
                              {formatUSD(Math.max(0, plan.target - plan.current))}{" "}
                              USD
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Modern Additional Info */}
                      {plan.isStaking && (
                        <div className="mt-6 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg opacity-60"></div>
                          <div className="relative p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <TrendingUp size={18} className="text-white" />
                              </div>
                              <div>
                                <span className="text-green-700 text-base font-bold">
                                  Earning ICP Staking Rewards
                                </span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-green-600 text-sm font-semibold">
                                    8.5% APY
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Modern Empty State */}
            {!isLoadingSavings &&
              savingsPlans.length === 0 &&
              !savingsError && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-center py-20"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-80" />
                    <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-16 shadow-xl shadow-purple-500/5">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                          <Target size={40} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-gray-800 text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        No Savings Plans Yet
                      </h3>
                      <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                        Start your financial journey by creating your first
                        savings plan with AI-powered recommendations
                      </p>
                      <ShimmerButton
                        className="px-10 py-5 text-lg font-semibold mx-auto"
                        onClick={handleCreateNew}
                        background="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                        shimmerColor="#ffffff"
                        shimmerSize="0.05em"
                      >
                        <div className="flex items-center space-x-3">
                          <Plus size={22} className="text-white" />
                          <span className="text-white">
                            Create Your First Plan
                          </span>
                        </div>
                      </ShimmerButton>
                    </div>
                  </div>
                </motion.div>
              )}
          </motion.div>

          {/* Modern Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center mt-20"
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full" />
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 via-slate-50/20 to-transparent pointer-events-none" />
    </div>
  );
}
