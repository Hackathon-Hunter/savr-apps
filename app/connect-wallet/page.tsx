"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function ConnectWallet() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConnecting(false);

    router.push("dashboard");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Mouse Follow Glow */}
      <div
        className="absolute w-96 h-96 rounded-full bg-white/5 blur-3xl transition-all duration-500 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={150}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Connect Wallet
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide">
              Connect your wallet to start your journey
            </p>
          </motion.div>

          {/* Wallet Option Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group mb-8"
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Main Card */}
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:bg-black/20 transition-all duration-500">
              {/* Wallet Icon and Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Wallet size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Bitfinity Wallet
                  </h3>
                  <p className="text-white/60 text-sm">
                    Connect using browser wallet
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-white/70">
                  <Shield size={16} />
                  <span className="text-sm">Secure & encrypted</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Zap size={16} />
                  <span className="text-sm">Fast transactions</span>
                </div>
              </div>

              {/* Connect Button */}
              <ShimmerButton
                background="#ffff"
                shimmerColor="#0a0a0a"
                shimmerSize="0.05em"
                className="w-full"
                onClick={handleConnect}
              >
                <div className="flex items-center space-x-3">
                  <Wallet size={20} className="text-black" />
                  <span className="text-lg font-medium tracking-wide text-black">
                    {isConnecting ? "Connecting ...." : "Connect Wallet"}
                  </span>
                </div>
              </ShimmerButton>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-white/50 text-sm leading-relaxed">
                By connecting your wallet, you agree to our{" "}
                <span className="text-white/70 hover:text-white cursor-pointer transition-colors duration-300">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-white/70 hover:text-white cursor-pointer transition-colors duration-300">
                  Privacy Policy
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
