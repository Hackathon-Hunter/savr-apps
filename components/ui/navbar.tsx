"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, ArrowRight, Shield, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    router.push("/connect-wallet");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    {
      name: "Features",
      href: "features",
      icon: Shield,
      description: "Discover our AI-powered tools",
    },
    {
      name: "How It Works",
      href: "how-it-works",
      icon: Brain,
      description: "4 simple steps to success",
    },
    {
      name: "Start Now",
      href: "start-now",
      icon: Sparkles,
      description: "Begin your journey",
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      {/* Enhanced Glassmorphism Background */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled
            ? "bg-white/20 backdrop-blur-xl border-b border-white/30"
            : "bg-white/10 backdrop-blur-md border-b border-white/20"
        }`}
      />

      {/* Dynamic Gradient Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10"
            : "bg-gradient-to-r from-purple-500/5 via-violet-500/5 to-indigo-500/5"
        }`}
      />

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-violet-300/15 rounded-full blur-xl animate-pulse" />
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-300/15 to-indigo-300/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-pink-300/10 to-purple-300/15 rounded-full blur-lg animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <div
            className="flex items-center justify-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative w-10 h-10 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-violet-700 group-hover:to-indigo-700 transition-all duration-300">
              SAVR
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="group relative px-4 py-2 text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <span>{link.name}</span>
                </span>

                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-violet-100/50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />

                {/* Bottom border effect */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors duration-300"
            >
              <div className="w-6 h-6 relative">
                <Menu
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen
                      ? "opacity-0 rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative">
          {/* Mobile menu background */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xl border-t border-white/20" />

          {/* Gradient overlay for mobile menu */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-violet-500/5 to-transparent" />

          <div className="relative px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="group w-full text-left px-4 py-4 text-gray-700 hover:text-purple-600 transition-all duration-300 rounded-xl hover:bg-white/20 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isMenuOpen
                    ? "slideInFromRight 0.5s ease-out forwards"
                    : "none",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-violet-200 transition-colors duration-300">
                    <link.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{link.name}</div>
                    <div className="text-sm text-gray-500 group-hover:text-purple-500 transition-colors duration-300">
                      {link.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Mobile CTA Button */}
            <div className="pt-4 px-4">
              <Button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 py-3 text-base font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom border gradient */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-purple-300/30 to-transparent"
        }`}
      />

      {/* Additional glow effect when scrolled */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      )}
    </nav>
  );
}

// Add these keyframes to your global CSS file if not already present
const styles = `
@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`;
