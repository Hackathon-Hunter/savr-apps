"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Wallet,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plane,
  Car,
  Home,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function Dashboard() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  // Mock ICP to USD conversion rate (this would come from an API in real app)
  const icpToUsd = 12.45; // Example rate: 1 ICP = $12.45 USD

  // Mock data for savings plans (converted to ICP)
  const savingsPlans = [
    {
      id: 1,
      title: "Dream Vacation to Japan",
      target: 964, // ~$12,000 in ICP
      current: 193, // ~$2,400 in ICP
      monthlyTarget: 60, // ~$750 in ICP
      targetDate: "Feb 2026",
      icon: Plane,
      color: "from-blue-500/20 to-cyan-500/20",
      progress: 20,
    },
    {
      id: 2,
      title: "New Car Fund",
      target: 2008, // ~$25,000 in ICP
      current: 703, // ~$8,750 in ICP
      monthlyTarget: 96, // ~$1,200 in ICP
      targetDate: "Dec 2025",
      icon: Car,
      color: "from-green-500/20 to-emerald-500/20",
      progress: 35,
    },
    {
      id: 3,
      title: "Emergency Fund",
      target: 1205, // ~$15,000 in ICP
      current: 964, // ~$12,000 in ICP
      monthlyTarget: 40, // ~$500 in ICP
      targetDate: "Aug 2024",
      icon: Home,
      color: "from-purple-500/20 to-pink-500/20",
      progress: 80,
    },
    {
      id: 4,
      title: "Education Fund",
      target: 2410, // ~$30,000 in ICP
      current: 361, // ~$4,500 in ICP
      monthlyTarget: 64, // ~$800 in ICP
      targetDate: "Sep 2027",
      icon: GraduationCap,
      color: "from-orange-500/20 to-red-500/20",
      progress: 15,
    },
  ];

  const totalBalance = savingsPlans.reduce(
    (sum, plan) => sum + plan.current,
    0
  );
  const totalTarget = savingsPlans.reduce((sum, plan) => sum + plan.target, 0);
  const totalMonthly = savingsPlans.reduce(
    (sum, plan) => sum + plan.monthlyTarget,
    0
  );

  const formatICP = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatUSD = (icpAmount: number) => {
    return (icpAmount * icpToUsd).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCreateNew = () => {
    router.push("input-target");
  };

  const handleViewPlan = (planId: number) => {
    console.log(`Viewing plan ${planId}`);
    router.push("details");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={60}
          particleSpread={4}
          speed={0.03}
          particleBaseSize={60}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-12">
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
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                  Savings Dashboard
                </h1>
                <p className="text-white/60 text-lg font-light">
                  Track your progress toward financial freedom
                </p>
                {/* ICP Rate Display */}
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-white/40 text-sm">
                    1 ICP = ${icpToUsd} USD
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <ShimmerButton
                  className="px-6 py-3 text-lg font-medium"
                  onClick={handleCreateNew}
                  background="#ffffff"
                  shimmerColor="#0a0a0a"
                  shimmerSize="0.05em"
                >
                  <div className="flex items-center space-x-2">
                    <Plus size={20} className="text-black" />
                    <span className="text-black">Create New Saving</span>
                  </div>
                </ShimmerButton>
              </div>
            </div>
          </motion.div>

          {/* Balance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Current Balance
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wallet size={20} className="text-white/60" />
                      <p className="text-white/60 text-sm">Total Saved</p>
                    </div>
                    <p className="text-white text-3xl font-bold">
                      {showBalance
                        ? `${formatICP(totalBalance)} ICP`
                        : "••••••"}
                    </p>
                    {showBalance && (
                      <p className="text-white/50 text-sm mt-1">
                        ≈ ${formatUSD(totalBalance)} USD
                      </p>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target size={20} className="text-white/60" />
                      <p className="text-white/60 text-sm">Total Goals</p>
                    </div>
                    <p className="text-white text-3xl font-bold">
                      {showBalance ? `${formatICP(totalTarget)} ICP` : "••••••"}
                    </p>
                    {showBalance && (
                      <p className="text-white/50 text-sm mt-1">
                        ≈ ${formatUSD(totalTarget)} USD
                      </p>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp size={20} className="text-white/60" />
                      <p className="text-white/60 text-sm">Monthly Savings</p>
                    </div>
                    <p className="text-white text-3xl font-bold">
                      {showBalance
                        ? `${formatICP(totalMonthly)} ICP`
                        : "••••••"}
                    </p>
                    {showBalance && (
                      <p className="text-white/50 text-sm mt-1">
                        ≈ ${formatUSD(totalMonthly)} USD
                      </p>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar size={20} className="text-white/60" />
                      <p className="text-white/60 text-sm">Active Plans</p>
                    </div>
                    <p className="text-white text-3xl font-bold">
                      {savingsPlans.length}
                    </p>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">
                      Overall Progress
                    </span>
                    <span className="text-white font-medium">
                      {Math.round((totalBalance / totalTarget) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${(totalBalance / totalTarget) * 100}%`,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Savings Plans List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Your Savings Plans
            </h2>
            <div className="grid gap-6">
              {savingsPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                          <plan.icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-xl">
                            {plan.title}
                          </h3>
                          <p className="text-white/60 text-sm">
                            Target: {plan.targetDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ShimmerButton
                          className="px-4 py-2 text-sm"
                          onClick={() => handleViewPlan(plan.id)}
                          background="#ffffff"
                          shimmerColor="#000000"
                          shimmerSize="0.1em"
                        >
                          <span className="text-black">Details</span>
                        </ShimmerButton>
                        <ShimmerButton
                          className="px-4 py-2 text-sm"
                          onClick={() =>
                            router.push(`/customize-plan/${plan.id}`)
                          }
                          background="#1f2937"
                          shimmerColor="#ffffff"
                          shimmerSize="0.1em"
                        >
                          <span className="text-white">Customize</span>
                        </ShimmerButton>
                        <button className="text-white/60 hover:text-white transition-colors duration-300">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                          <span className="text-white/60 text-sm">
                            {formatICP(plan.current)} ICP of{" "}
                            {formatICP(plan.target)} ICP
                          </span>
                          <span className="text-white/40 text-xs">
                            ≈ ${formatUSD(plan.current)} of $
                            {formatUSD(plan.target)} USD
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {plan.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${plan.progress}%` }}
                          transition={{
                            duration: 1.5,
                            ease: "easeOut",
                            delay: 0.8 + index * 0.1,
                          }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white/60 text-xs mb-1">
                          Monthly Target
                        </p>
                        <p className="text-white font-semibold">
                          {formatICP(plan.monthlyTarget)} ICP
                        </p>
                        <p className="text-white/40 text-xs">
                          ≈ ${formatUSD(plan.monthlyTarget)} USD
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white/60 text-xs mb-1">Remaining</p>
                        <p className="text-white font-semibold">
                          {formatICP(plan.target - plan.current)} ICP
                        </p>
                        <p className="text-white/40 text-xs">
                          ≈ ${formatUSD(plan.target - plan.current)} USD
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Empty State (if no plans) */}
          {savingsPlans.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center py-16"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                  <Target size={48} className="text-white/40 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">
                    No Savings Plans Yet
                  </h3>
                  <p className="text-white/60 mb-8 max-w-md mx-auto">
                    Start your financial journey by creating your first savings
                    plan
                  </p>
                  <ShimmerButton
                    className="px-8 py-4 text-lg font-medium"
                    onClick={handleCreateNew}
                    background="rgba(255, 255, 255, 0.1)"
                    shimmerColor="#ffffff"
                    shimmerSize="0.15em"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus size={20} className="text-white" />
                      <span className="text-white">Create Your First Plan</span>
                    </div>
                  </ShimmerButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center mt-16"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
