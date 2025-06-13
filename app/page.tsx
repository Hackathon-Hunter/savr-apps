"use client";

import AnimatedContent from "@/components/reactbits/AnimatedContent/AnimatedContent";
import BlurText from "@/components/reactbits/BlurText/BlurText";
import Particles from "@/components/reactbits/Particles/Particles";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Rocket, Brain, TrendingUp, Shield, Zap } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function Home() {
  const router = useRouter();

  const handleButton = () => router.push("connect-wallet");

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Smart algorithms analyze your spending patterns and create personalized savings strategies",
      highlight: "Intelligent Planning",
    },
    {
      icon: TrendingUp,
      title: "ICP Staking Rewards",
      description:
        "Stake your ICP tokens to earn additional rewards while saving for your goals",
      highlight: "Earn While You Save",
    },
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-black to-gray-800" />

      {/* Monochrome Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={12}
          speed={0.15}
          particleBaseSize={200}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center flex-col h-full px-4 py-12 overflow-y-auto">
        {/* Enhanced Logo with SAVR branding */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-white/10 rounded-2xl blur-lg opacity-50" />
          <div className="relative flex items-center justify-center space-x-4 border border-white/20 rounded-2xl px-8 md:px-12 py-4 bg-white/5 backdrop-blur-xl">
            {/* Logo Icon */}
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10">
              <Sparkles size={24} className="text-white" />
            </div>
            {/* App Name */}
            <h4 className="text-4xl md:text-5xl italic font-bold text-white tracking-wider">
              SAVR
            </h4>
          </div>
          <motion.div
            className="absolute -top-2 -right-2 text-white/60"
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Sparkles size={20} />
          </motion.div>
        </div>

        {/* Minimalist Main Title */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-white/5 blur-3xl" />
          <BlurText
            text="Your Dreams, Unleashed"
            delay={500}
            animateBy="words"
            direction="top"
            className="relative text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight text-center"
          />
        </div>

        <AnimatedContent
          distance={150}
          direction="vertical"
          reverse={false}
          duration={2.7}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.1}
          delay={0.9}
        >
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 rounded-xl blur-xl group-hover:bg-white/10 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 hover:border-white/20 hover:bg-black/20 transition-all duration-500">
                <div className="text-center space-y-4">
                  <h4 className="text-xl md:text-2xl font-light text-white/90 tracking-wide">
                    Where ambition meets opportunity
                  </h4>
                  <h4 className="text-xl md:text-2xl font-light text-white/90 tracking-wide">
                    Break free from limits. Build wealth from your wildest
                    ideas.
                  </h4>
                  <h4 className="text-xl md:text-2xl font-light text-white/90 tracking-wide">
                    The future belongs to dreamers who act.
                  </h4>
                </div>
              </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + index * 0.2, duration: 0.8 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:bg-black/20 transition-all duration-500 h-full">
                    {/* Feature Icon */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                        <feature.icon size={28} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-white/50 uppercase tracking-wider font-medium">
                          {feature.highlight}
                        </span>
                        <h3 className="text-xl font-semibold text-white mt-1">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    {/* Feature Description */}
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature Benefits */}
                    <div className="mt-6 flex items-center space-x-4">
                      {index === 0 ? (
                        <>
                          <div className="flex items-center space-x-2 text-white/60">
                            <Shield size={16} />
                            <span className="text-sm">Personalized</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/60">
                            <Zap size={16} />
                            <span className="text-sm">Real-time</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2 text-white/60">
                            <TrendingUp size={16} />
                            <span className="text-sm">High Yield</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/60">
                            <Shield size={16} />
                            <span className="text-sm">Secure</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">
                      AI-Powered
                    </div>
                    <div className="text-white/60 text-sm">Smart Analysis</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">
                      8.5% APY
                    </div>
                    <div className="text-white/60 text-sm">
                      ICP Staking Rewards
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">
                      100% Secure
                    </div>
                    <div className="text-white/60 text-sm">
                      Blockchain Protected
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
              className="text-center"
            >
              <ShimmerButton
                background="#ffffff"
                shimmerColor="#0a0a0a"
                shimmerSize="0.2em"
                onClick={handleButton}
                className="px-8 py-4 mx-auto"
              >
                <div className="flex items-center space-x-3">
                  <Rocket size={20} className="text-black" />
                  <span className="text-lg font-medium tracking-wide text-black">
                    Start your Journey
                  </span>
                </div>
              </ShimmerButton>

              {/* Sub CTA Text */}
              <p className="text-white/50 text-sm mt-4 max-w-md mx-auto">
                Join thousands of users already building wealth with AI-powered
                savings and ICP staking rewards
              </p>
            </motion.div>
          </div>
        </AnimatedContent>
      </div>

      {/* Subtle Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Subtle Top Fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
    </div>
  );
}
