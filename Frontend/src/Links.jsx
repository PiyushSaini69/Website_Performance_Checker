import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Links() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen p-4 overflow-y-auto flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-24 h-24 mx-auto relative group">
                {/* Glass Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl opacity-80 blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                  {/* Gloss Effect */}
                  <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/40 to-transparent rotate-45 transform translate-y-full"></div>

                  {/* SVG Icon */}
                  <svg className="w-12 h-12 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#bolt-gradient)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="bolt-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FCD34D" />
                        <stop offset="1" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight"
            >
              Website Performance
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Checker
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-base md:text-lg text-purple-200 max-w-xl mx-auto"
            >
              Analyze your website's speed and performance with Google PageSpeed Insights.
              Get detailed metrics for both mobile and desktop.
            </motion.p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Single URL Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Link to="/InputURL" className="block group">
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-600/0 group-hover:from-green-400/10 group-hover:to-emerald-600/10 transition-all duration-300"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-3xl">🔗</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">Single URL Analysis</h3>
                    <p className="text-purple-200 mb-6">
                      Enter a single website URL and get instant performance metrics with detailed insights.
                    </p>

                    <div className="flex items-center text-green-400 font-semibold group-hover:translate-x-2 transition-transform">
                      Get Started
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Bulk Upload Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Link to="/FileUpload" className="block group">
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-600/0 group-hover:from-blue-400/10 group-hover:to-indigo-600/10 transition-all duration-300"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-3xl">📂</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">Bulk File Upload</h3>
                    <p className="text-purple-200 mb-6">
                      Upload a CSV file with multiple URLs and analyze them all at once. Export results easily.
                    </p>

                    <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                      Upload File
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: "📊", text: "Detailed Metrics" },
              { icon: "📱", text: "Mobile & Desktop" },
              { icon: "⚡", text: "Real-time Analysis" },
              { icon: "💾", text: "Export Results" }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center hover:bg-white/10 transition-all"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="text-sm text-purple-200 font-medium">{feature.text}</div>
              </div>
            ))}
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-12"
          >
            <p className="text-purple-300 text-sm">
              Powered by Google PageSpeed Insights API
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
