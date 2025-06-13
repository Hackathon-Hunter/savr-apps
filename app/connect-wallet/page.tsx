"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Fingerprint,
  Shield,
  Zap,
  Key,
  Globe,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useAuth } from "@/hooks/useAuth";

export default function ConnectInternetIdentity() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState(false);

  const { isAuthenticated, principal, isLoading, login, logout } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setAuthSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleAuthenticate = async () => {
    if (isAuthenticating || isLoading) return;

    setIsAuthenticating(true);
    setAuthError("");
    setAuthSuccess(false);

    try {
      await login();
      // Success will be handled by the useEffect above
    } catch (error) {
      console.error("Authentication failed:", error);
      setAuthError(
        error instanceof Error
          ? error.message
          : "Failed to authenticate with Internet Identity. Please try again."
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthSuccess(false);
      setAuthError("");
    } catch (error) {
      console.error("Logout failed:", error);
      setAuthError("Failed to logout. Please try again.");
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
          />
          <span className="text-lg font-medium tracking-wide text-black">
            Loading...
          </span>
        </>
      );
    }

    if (isAuthenticating) {
      return (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
          />
          <span className="text-lg font-medium tracking-wide text-black">
            Authenticating...
          </span>
        </>
      );
    }

    if (authSuccess) {
      return (
        <>
          <CheckCircle size={20} className="text-black" />
          <span className="text-lg font-medium tracking-wide text-black">
            Success! Redirecting...
          </span>
        </>
      );
    }

    if (isAuthenticated) {
      return (
        <>
          <CheckCircle size={20} className="text-black" />
          <span className="text-lg font-medium tracking-wide text-black">
            Already Connected
          </span>
        </>
      );
    }

    return (
      <>
        <Fingerprint size={20} className="text-black" />
        <span className="text-lg font-medium tracking-wide text-black">
          Sign In with Internet Identity
        </span>
      </>
    );
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

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
              Internet Identity
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide">
              Authenticate securely on the Internet Computer
            </p>
          </motion.div>

          {/* Success Message */}
          {authSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <CheckCircle
                  size={24}
                  className="text-green-400 mx-auto mb-2"
                />
                <p className="text-green-400 font-medium">
                  Authentication Successful!
                </p>
                <p className="text-green-400/70 text-sm mt-1">
                  Redirecting to dashboard...
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
                <p className="text-red-400 font-medium">
                  Authentication Failed
                </p>
                <p className="text-red-400/70 text-sm mt-1">{authError}</p>
              </div>
            </motion.div>
          )}

          {/* Current User Info */}
          {isAuthenticated && principal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">Connected as:</p>
                <p className="text-white text-sm font-mono break-all">
                  {principal}
                </p>
              </div>
            </motion.div>
          )}

          {/* Internet Identity Card */}
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
              {/* Internet Identity Icon and Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Fingerprint size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Internet Identity
                  </h3>
                  <p className="text-white/60 text-sm">
                    Cryptographic authentication for the IC
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-white/70">
                  <Shield size={16} />
                  <span className="text-sm">WebAuthn-based security</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Key size={16} />
                  <span className="text-sm">Register multiple devices</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Globe size={16} />
                  <span className="text-sm">Unique identity for each dapp</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Zap size={16} />
                  <span className="text-sm">No usernames or passwords</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Main Auth Button */}
                <ShimmerButton
                  background="#ffff"
                  shimmerColor="#0a0a0a"
                  shimmerSize="0.05em"
                  className="w-full"
                  onClick={handleAuthenticate}
                  disabled={isAuthenticating || isLoading || authSuccess}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {getButtonContent()}
                  </div>
                </ShimmerButton>

                {/* Logout Button (only show if authenticated) */}
                {isAuthenticated && !authSuccess && (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    Disconnect
                  </button>
                )}

                {/* Continue Button (only show if authenticated) */}
                {isAuthenticated && !authSuccess && (
                  <ShimmerButton
                    background="#1f2937"
                    shimmerColor="#ffffff"
                    shimmerSize="0.05em"
                    className="w-full"
                    onClick={() => router.push("/dashboard")}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <ArrowRight size={20} className="text-white" />
                      <span className="text-lg font-medium tracking-wide text-white">
                        Continue to Dashboard
                      </span>
                    </div>
                  </ShimmerButton>
                )}
              </div>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4 text-center">
                How Internet Identity Works
              </h4>
              <ol className="space-y-3">
                <li className="flex items-start space-x-3 text-white/70">
                  <span className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span className="text-sm">
                    You&apos;ll be redirected to the Internet Identity service
                  </span>
                </li>
                <li className="flex items-start space-x-3 text-white/70">
                  <span className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span className="text-sm">
                    Authenticate using your registered device (biometrics,
                    security key, etc.)
                  </span>
                </li>
                <li className="flex items-start space-x-3 text-white/70">
                  <span className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span className="text-sm">
                    You&apos;ll receive a unique pseudonymous identity for this
                    application
                  </span>
                </li>
                <li className="flex items-start space-x-3 text-white/70">
                  <span className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span className="text-sm">
                    You&apos;ll be redirected back to continue your session
                  </span>
                </li>
              </ol>
            </div>
          </motion.div>

          {/* New User Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-3 text-center">
                New to Internet Identity?
              </h4>
              <p className="text-white/60 text-sm mb-4 text-center">
                You&apos;ll be able to create a new Internet Identity during the
                sign-in process
              </p>
              <div className="flex justify-center">
                <a
                  href="https://identity.ic0.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-300"
                >
                  <span className="text-sm">Learn more</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-white/50 text-sm leading-relaxed">
                By authenticating with Internet Identity, you agree to our{" "}
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
