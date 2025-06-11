"use client";
import AnimatedContent from "@/components/reactbits/AnimatedContent/AnimatedContent";
import BlurText from "@/components/reactbits/BlurText/BlurText";
import Particles from "@/components/reactbits/Particles/Particles";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Rocket } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleButton = () => router.push("connect-wallet");

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Mouse Follow Subtle Glow */}
      <div
        className="absolute w-96 h-96 rounded-full bg-white/5 blur-3xl transition-all duration-500 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Monochrome Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "ffffff"]}
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
      <div className="relative z-10 flex justify-center items-center flex-col h-full px-4">
        {/* Minimalist Logo */}
        <div className="absolute inset-0 bg-white/10 rounded-2xl blur-lg opacity-50" />
        <h4 className="relative text-4xl md:text-5xl italic font-bold border border-white/20 rounded-2xl px-12 md:px-20 py-4 bg-white/5 backdrop-blur-xl text-white tracking-wider">
          SAVR
        </h4>
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

        {/* Minimalist Main Title */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-white/5 blur-3xl" />
          <BlurText
            text="Your Dreams, Unleashed"
            delay={500}
            animateBy="words"
            direction="top"
            className="relative text-4xl md:text-6xl lg:text-7xl mt-5 font-bold text-white tracking-tight"
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
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex flex-col justify-center items-center space-y-8">
              {/* Minimalist Description Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/5 rounded-xl blur-xl group-hover:bg-white/10 transition-all duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 hover:border-white/20 hover:bg-black/20 transition-all duration-500">
                  <h4 className="text-xl md:text-2xl font-light text-center text-white/90 tracking-wide">
                    Where ambition meets opportunity
                  </h4>
                  <h4 className="text-xl md:text-2xl font-light text-center text-white/90 tracking-wide">
                    Break free from limits. Build wealth from your wildest
                    ideas.
                  </h4>
                  <h4 className="text-xl md:text-2xl font-light text-center text-white/90 tracking-wide">
                    The future belongs to dreamers who act.
                  </h4>
                </div>
              </motion.div>

              {/* Minimalist CTA Button */}
              <ShimmerButton
                background="#ffff"
                shimmerColor="#0a0a0a"
                shimmerSize="0.2em"
                onClick={handleButton}
              >
                <div className="flex items-center space-x-3">
                  <Rocket size={20} className="text-black" />
                  <span className="text-lg font-medium tracking-wide text-black">
                    Start your Journey
                  </span>
                </div>
              </ShimmerButton>
            </div>
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
