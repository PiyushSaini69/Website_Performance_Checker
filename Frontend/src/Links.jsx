import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Links() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 text-center w-full max-w-md"
      >
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">
          🚀 Website Performance Checker
        </h1>

        {/* Buttons */}
        <div className="flex flex-col gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/FileUpload"
              className="block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              📂 Upload File
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/InputURL"
              className="block px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              🔗 Enter URL
            </Link>
          </motion.div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-sm text-gray-500">
          Analyze websites easily with just a file or a URL.
        </p>
      </motion.div>
    </div>
  );
}
