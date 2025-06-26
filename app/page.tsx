"use client";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import { ArrowRight, Brain, Shield, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleButton = () => router.push("connect-wallet");

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
                  className="bg-gradient-to-r cursor-pointer from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg shadow-purple-500/20"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
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
            <div className="group relative">
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
              </div>
            </div>

            {/* Feature 2 - Staking Rewards */}
            <div className="group relative">
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
              </div>
            </div>

            {/* Feature 3 - Internet Identity */}
            <div className="group relative">
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
              </div>
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
              className="bg-gradient-to-r cursor-pointer from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-12 py-4 text-lg font-semibold shadow-lg shadow-purple-500/20"
            >
              Start Saving Today
              <ArrowRight className="ml-2 w-5 h-5" />
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
        </div>
      </section>
    </main>
  );
}
