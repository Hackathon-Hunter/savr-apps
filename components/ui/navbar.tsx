"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Start Now", href: "#start-now" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md border-b border-white/20" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-violet-500/5 to-indigo-500/5" />

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-violet-300/15 rounded-full blur-xl animate-pulse" />
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-300/15 to-indigo-300/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl blur-sm opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              SAVR
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
    </nav>
  );
}
