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
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

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

  const handleBack = () => {
    router.back();
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
    <div className="relative min-h-screen w-screen overflow-hidden bg-white">
      {/* Colorful Background Gradient - Same as landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

      {/* Secondary Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/30 via-transparent to-indigo-100/40" />

      {/* Enhanced Blob Shapes - Same as landing page */}
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

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-20"
      >
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 group bg-white/80 backdrop-blur-sm border border-purple-200/30 rounded-full px-4 py-2 shadow-sm"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="text-sm font-medium">Back</span>
        </button>
      </motion.div>

      {/* Colorful Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b"]}
          particleCount={50}
          particleSpread={8}
          speed={0.02}
          particleBaseSize={40}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header - Light theme style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-60"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                  <Fingerprint size={36} className="text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl"
                />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Internet Identity
              </span>
            </h1>
            <p className="text-gray-700 text-xl font-light max-w-md mx-auto leading-relaxed">
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-xl border border-green-200 rounded-3xl p-6 text-center shadow-lg shadow-green-500/10">
                <CheckCircle
                  size={28}
                  className="text-green-600 mx-auto mb-3"
                />
                <p className="text-green-700 font-medium text-lg">
                  Authentication Successful!
                </p>
                <p className="text-green-600 text-sm mt-1">
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
              <div className="bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-xl border border-red-200 rounded-3xl p-6 text-center shadow-lg shadow-red-500/10">
                <AlertCircle size={28} className="text-red-600 mx-auto mb-3" />
                <p className="text-red-700 font-medium text-lg">
                  Authentication Failed
                </p>
                <p className="text-red-600 text-sm mt-1">{authError}</p>
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
              <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg shadow-purple-500/5">
                <p className="text-gray-600 mb-2">Connected as:</p>
                <p className="text-gray-800 font-mono break-all bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {principal}
                </p>
              </div>
            </motion.div>
          )}

          {/* Internet Identity Card - Light theme */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group mb-8"
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Main Card */}
            <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
              {/* Internet Identity Icon and Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl flex items-center justify-center">
                  <Fingerprint size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Internet Identity
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Cryptographic authentication for the IC
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl flex items-center justify-center">
                    <Shield size={16} className="text-purple-600" />
                  </div>
                  <span>WebAuthn-based security</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center">
                    <Key size={16} className="text-blue-600" />
                  </div>
                  <span>Register multiple devices</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center">
                    <Globe size={16} className="text-green-600" />
                  </div>
                  <span>Unique identity for each dapp</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-xl flex items-center justify-center">
                    <Zap size={16} className="text-orange-600" />
                  </div>
                  <span>No usernames or passwords</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Main Auth Button */}
                <Button
                  className="w-full rounded-2xl py-10 bg-purple-100"
                  onClick={handleAuthenticate}
                  disabled={isAuthenticating || isLoading || authSuccess}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {getButtonContent()}
                  </div>
                </Button>

                {/* Logout Button (only show if authenticated) */}
                {isAuthenticated && !authSuccess && (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-4 text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all duration-300"
                  >
                    Disconnect
                  </button>
                )}

                {/* Continue Button (only show if authenticated) */}
                {isAuthenticated && !authSuccess && (
                  <ShimmerButton
                    background="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                    shimmerColor="#ffffff"
                    shimmerSize="0.05em"
                    className="w-full rounded-2xl py-5"
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

          {/* How It Works Section - Light theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
              <h4 className="text-gray-800 font-semibold text-xl mb-6 text-center flex items-center justify-center space-x-2">
                <Sparkles size={20} className="text-purple-600" />
                <span>How Internet Identity Works</span>
              </h4>
              <ol className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-700">
                  <span className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 text-blue-700 font-medium">
                    1
                  </span>
                  <span>
                    You&apos;ll be redirected to the Internet Identity service
                  </span>
                </li>
                <li className="flex items-start space-x-3 text-gray-700">
                  <span className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 text-blue-700 font-medium">
                    2
                  </span>
                  <span>
                    Authenticate using your registered device (biometrics,
                    security key, etc.)
                  </span>
                </li>
                <li className="flex items-start space-x-3 text-gray-700">
                  <span className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 text-blue-700 font-medium">
                    3
                  </span>
                  <span>
                    You&apos;ll receive a unique pseudonymous identity for this
                    application
                  </span>
                </li>
                <li className="flex items-start space-x-3 text-gray-700">
                  <span className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 text-blue-700 font-medium">
                    4
                  </span>
                  <span>
                    You&apos;ll be redirected back to continue your session
                  </span>
                </li>
              </ol>
            </div>
          </motion.div>

          {/* New User Section - Light theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500">
              <h4 className="text-gray-800 font-semibold text-xl mb-3 text-center">
                New to Internet Identity?
              </h4>
              <p className="text-gray-600 mb-4 text-center">
                You&apos;ll be able to create a new Internet Identity during the
                sign-in process
              </p>
              <div className="flex justify-center">
                <a
                  href="https://identity.ic0.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-300 group"
                >
                  <span>Learn more</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Security Notice - Light theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-500">
              <p className="text-gray-600 leading-relaxed">
                By authenticating with Internet Identity, you agree to our{" "}
                <span className="text-purple-600 hover:text-purple-800 cursor-pointer transition-colors duration-300">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-purple-600 hover:text-purple-800 cursor-pointer transition-colors duration-300">
                  Privacy Policy
                </span>
              </p>
            </div>
          </motion.div>

          {/* Light theme Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full" />
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Light theme Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 via-purple-50/20 to-transparent pointer-events-none" />
    </div>
  );
}
