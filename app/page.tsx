"use client";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import {
  ArrowRight,
  Brain,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Updated to match your existing app flow
  const handleGetStarted = () => {
    router.push("/connect-wallet");
  };

  const handleStartJourney = () => {
    router.push("/connect-wallet");
  };

  const handleStartSavingToday = () => {
    router.push("/connect-wallet");
  };

  // Optional: Direct navigation to input-target if user is already authenticated
  const handleDirectStart = () => {
    // You could add authentication check here
    // For now, we'll go through the connect-wallet flow
    router.push("/connect-wallet");
  };

  return (
    <main>
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white main">
        {/* Colorful Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

        {/* Secondary Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/30 via-transparent to-indigo-100/40" />

        {/* Enhanced Blob Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/50 to-violet-300/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/60 to-indigo-300/50 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-200/40 to-purple-300/50 rounded-full blur-2xl animate-pulse delay-500" />
          <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-200/30 to-blue-300/40 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* Colorful Mesh Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-100/20 via-transparent to-blue-50/30" />

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${
                i % 3 === 0
                  ? "bg-purple-300/60"
                  : i % 3 === 1
                  ? "bg-blue-300/60"
                  : "bg-pink-300/60"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 px-48">
          <div className="flex md:flex-row items-center gap-12">
            <div className="w-full justify-start items-start">
              <div className="inline-flex gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/30 rounded-full px-4 py-2 mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700 font-medium">
                  Powered by Hackathon Hunter
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Your Dreams, Unleashed
                <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  with SAVR
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Where ambition meets opportunity, Break free from limits. Build
                wealth from your wildest ideas. The future belongs to dreamers
                who act.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleStartJourney}
                  className="bg-gradient-to-r cursor-pointer from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Optional secondary button */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const featuresSection = document.getElementById("features");
                    featuresSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="">
              <Image
                alt="hero-image"
                src="/hero-image.png"
                width={10000}
                height={10000}
                className="w-auto"
              />
            </div>
          </div>

          {/* Enhanced Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-200/40 to-violet-300/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-indigo-200/40 to-blue-300/30 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-pink-200/30 to-purple-200/40 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        {/* Colorful Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/40 via-blue-50/20 to-transparent" />
      </section>

      <section id="features" className="py-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-indigo-100" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/30 to-violet-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-indigo-300/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/30 rounded-full px-4 py-2 mb-6 shadow-sm items-center">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xl text-gray-700 font-medium">
                Powered by ICP Blockchain
              </span>
              <Image
                className="w-10 h-10"
                alt="icp-logo"
                width={300}
                height={300}
                src="/icp-logo.svg"
              />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionary Features for
              <span className="block text-purple-600">Smart Saving</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of personal finance with cutting-edge
              blockchain technology and AI-powered insights
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - AI Analysis */}
            <div
              className="group relative cursor-pointer"
              onClick={handleDirectStart}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-purple-200/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>

                <div className="inline-block bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Intelligent Planning
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI-Powered Analysis with ICP LLM
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Smart algorithms analyze your spending patterns and create
                  personalized savings strategies using advanced ICP blockchain
                  intelligence
                </p>

                {/* Try It Button */}
                <div className="mt-6">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectStart();
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm transition-all duration-300"
                  >
                    Try AI Analysis
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature 2 - Staking Rewards */}
            <div
              className="group relative cursor-pointer"
              onClick={handleDirectStart}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-blue-200/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>

                <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Earn While You Save
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ICP Staking Rewards
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Stake your ICP tokens to earn additional rewards while saving
                  for your goals. Maximize returns with automated staking
                  strategies
                </p>

                {/* Start Staking Button */}
                <div className="mt-6">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectStart();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm transition-all duration-300"
                  >
                    Start Staking
                    <TrendingUp className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature 3 - Internet Identity */}
            <div
              className="group relative cursor-pointer"
              onClick={handleGetStarted}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-pink-200/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>

                <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  Secure & Private
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Internet Identity
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience seamless, passwordless authentication with Internet
                  Identity. Your privacy and security are guaranteed by
                  blockchain technology
                </p>

                {/* Connect Button */}
                <div className="mt-6">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetStarted();
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 text-sm transition-all duration-300"
                  >
                    Connect Wallet
                    <Shield className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features CTA */}
          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105"
            >
              Experience All Features
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-purple-200/30 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-200/20 to-pink-200/30 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-200/30 to-violet-200/20 rounded-full blur-xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/30 rounded-full px-4 py-2 mb-6 shadow-sm items-center">
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700 font-medium">
                Simple 4-Step Process
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              How SAVR
              <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Works For You
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From dream to reality in four simple steps. Our AI-powered
              platform makes saving smart, secure, and rewarding.
            </p>
          </div>

          {/* Steps Container */}
          <div className="space-y-24">
            {/* Step 1: Connect Wallet */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 font-bold px-4 py-2 rounded-full mb-6">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Connect Your Wallet
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Secure Authentication with
                  <span className="block text-purple-600">
                    Internet Identity
                  </span>
                </h3>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Start your journey with passwordless, biometric
                  authentication. Your Internet Identity ensures maximum
                  security while keeping your data private and decentralized.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      WebAuthn-based biometric security
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      No passwords or private keys to manage
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Unique identity for each dApp
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleGetStarted}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Connect Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                {/* Image Placeholder with generation prompt */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-violet-200 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <Image
                        src="/wallet.png"
                        alt="wallet-secure"
                        width={1000}
                        height={1000}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-400 rounded-full animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-violet-400 rounded-full animate-pulse delay-500" />
                </div>
              </div>
            </div>

            {/* Step 2: Set Your Target */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <Image
                        src="/target.png"
                        alt="target"
                        width={1000}
                        height={1000}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400 rounded-full animate-pulse" />
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-indigo-400 rounded-full animate-pulse delay-500" />
                </div>
              </div>

              <div className="order-2">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-bold px-4 py-2 rounded-full mb-6">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Set Your Savings Goal
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Tell Us Your Dreams,
                  <span className="block text-blue-600">
                    We'll Make Them Real
                  </span>
                </h3>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Whether it's a vacation, new car, or emergency fund - simply
                  tell us what you're saving for and your monthly income. Our AI
                  will handle the rest.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      AI-powered goal suggestions
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Smart cost estimation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Personalized saving recommendations
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleDirectStart}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Set My Goal
                    <Target className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: AI Analysis */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-bold px-4 py-2 rounded-full mb-6">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  Get AI Analysis
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  AI Creates Your
                  <span className="block text-green-600">
                    Perfect Savings Plan
                  </span>
                </h3>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our advanced AI analyzes your goal and income to create a
                  personalized savings strategy. Get smart recommendations,
                  timeline predictions, and cost breakdowns instantly.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Intelligent cost analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Optimized savings rate
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Timeline predictions & milestones
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleDirectStart}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105"
                  >
                    See AI Magic
                    <Brain className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <Image
                        src="/analyze.png"
                        alt="analyze"
                        width={1000}
                        height={1000}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full animate-pulse delay-500" />
                </div>
              </div>
            </div>

            {/* Step 4: Start Saving & Staking */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-100 to-red-200 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <Image
                        src="/staking.png"
                        alt="staking"
                        width={1000}
                        height={1000}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 rounded-full animate-pulse" />
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-red-400 rounded-full animate-pulse delay-500" />
                </div>
              </div>

              <div className="order-2">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 font-bold px-4 py-2 rounded-full mb-6">
                  <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  Save & Earn Rewards
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Watch Your Money
                  <span className="block text-orange-600">
                    Grow Automatically
                  </span>
                </h3>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Start your savings plan and enable ICP staking to earn 8.5%
                  APY. Track your progress, add funds anytime, and watch your
                  dreams become reality with compound rewards.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      8.5% APY staking rewards
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Automated compound growth
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Real-time progress tracking
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleStartSavingToday}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Start Earning
                    <TrendingUp className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20 pt-16 border-t border-gray-200">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Financial Future?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of smart savers who are already building wealth
              with SAVR's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleStartJourney}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const startNowSection = document.getElementById("start-now");
                  startNowSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark */}
      <section
        className="py-20 px-4 relative overflow-hidden bg-gray-900"
        id="start-now"
      >
        {/* Dark Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-violet-500/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex gap-2 bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-full px-4 py-2 mb-8 shadow-sm items-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300 font-medium">
              Ready to Start?
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Turn Your Dreams Into
            <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Financial Reality
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the revolution of smart savers who are building wealth through
            the power of blockchain technology and AI-driven insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={handleStartSavingToday}
              className="bg-gradient-to-r cursor-pointer from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-12 py-4 text-lg font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105"
            >
              Start Saving Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Secondary CTA */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const featuresSection = document.getElementById("features");
                featuresSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900 px-12 py-4 text-lg font-semibold transition-all duration-300"
            >
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-6">Built on</p>
            <div className="flex justify-center items-center gap-8">
              <div className="flex items-center gap-2">
                <Image
                  className="w-8 h-8"
                  alt="icp-logo"
                  width={300}
                  height={300}
                  src="/icp-logo.svg"
                />
                <span className="text-white font-semibold">
                  Internet Computer
                </span>
              </div>
            </div>
          </div>

          {/* Bottom stats or trust signals */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">8.5%</div>
              <div className="text-gray-400 text-sm">APY Staking Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-gray-400 text-sm">Blockchain Secured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">AI</div>
              <div className="text-gray-400 text-sm">Powered Analysis</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
