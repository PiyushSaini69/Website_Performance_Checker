import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function InputURL() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkScore = async () => {
    if (!url.trim()) return alert("Please enter a URL");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sendUrl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch performance data");
      }

      const newResult = {
        url,
        // Mobile Metrics
        mobilescore: data.mobile.lighthouseResult?.categories?.performance?.score
          ? Math.round(data.mobile.lighthouseResult.categories.performance.score * 100)
          : "N/A",
        mobiletiming: data.mobile.lighthouseResult?.timing?.total
          ? `${(data.mobile.lighthouseResult.timing.total / 1000).toFixed(2)}s`
          : "N/A",
        mobileFCP: data.mobile.lighthouseResult?.audits["first-contentful-paint"]?.displayValue || "N/A",
        mobileLCP: data.mobile.lighthouseResult?.audits["largest-contentful-paint"]?.displayValue || "N/A",
        mobileCLS: data.mobile.lighthouseResult?.audits["cumulative-layout-shift"]?.displayValue || "N/A",
        mobileSI: data.mobile.lighthouseResult?.audits["speed-index"]?.displayValue || "N/A",
        mobileTBT: data.mobile.lighthouseResult?.audits["total-blocking-time"]?.displayValue || "N/A",
        mobileTTI: data.mobile.lighthouseResult?.audits["interactive"]?.displayValue || "N/A",

        // Desktop Metrics
        desktopscore: data.desktop.lighthouseResult?.categories?.performance?.score
          ? Math.round(data.desktop.lighthouseResult.categories.performance.score * 100)
          : "N/A",
        desktoptiming: data.desktop.lighthouseResult?.timing?.total
          ? `${(data.desktop.lighthouseResult.timing.total / 1000).toFixed(2)}s`
          : "N/A",
        desktopFCP: data.desktop.lighthouseResult?.audits["first-contentful-paint"]?.displayValue || "N/A",
        desktopLCP: data.desktop.lighthouseResult?.audits["largest-contentful-paint"]?.displayValue || "N/A",
        desktopCLS: data.desktop.lighthouseResult?.audits["cumulative-layout-shift"]?.displayValue || "N/A",
        desktopSI: data.desktop.lighthouseResult?.audits["speed-index"]?.displayValue || "N/A",
        desktopTBT: data.desktop.lighthouseResult?.audits["total-blocking-time"]?.displayValue || "N/A",
        desktopTTI: data.desktop.lighthouseResult?.audits["interactive"]?.displayValue || "N/A",

        status: "✅ Success",
      };

      setResult(newResult);
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Failed to check website performance");
      setResult({
        url,
        mobilescore: "Error", mobiletiming: "Error",
        mobileFCP: "Error", mobileLCP: "Error", mobileCLS: "Error",
        mobileSI: "Error", mobileTBT: "Error", mobileTTI: "Error",

        desktopscore: "Error", desktoptiming: "Error",
        desktopFCP: "Error", desktopLCP: "Error", desktopCLS: "Error",
        desktopSI: "Error", desktopTBT: "Error", desktopTTI: "Error",

        status: "❌ Failed",
      });
    }

    setUrl("");
    setLoading(false);
  };

  const downloadFile = (data, filename = "data", type = "csv") => {
    if (!data) return alert("No data to export");

    // Define readable headers
    const headerMap = {
      url: "URL",
      mobilescore: "Mobile Score",
      mobiletiming: "Mobile Load Time",
      mobileFCP: "Mobile FCP",
      mobileLCP: "Mobile LCP",
      mobileCLS: "Mobile CLS",
      mobileSI: "Mobile Speed Index",
      mobileTBT: "Mobile Blocking Time",
      mobileTTI: "Mobile Interactive",
      desktopscore: "Desktop Score",
      desktoptiming: "Desktop Load Time",
      desktopFCP: "Desktop FCP",
      desktopLCP: "Desktop LCP",
      desktopCLS: "Desktop CLS",
      desktopSI: "Desktop Speed Index",
      desktopTBT: "Desktop Blocking Time",
      desktopTTI: "Desktop Interactive",
      status: "Status"
    };

    const keys = Object.keys(data);
    const headers = keys.map(key => headerMap[key] || key);
    let blob;
    let fullFilename = filename;

    if (type === "csv") {
      const csvRows = [
        headers.join(","),
        keys.map((key) => `"${data[key] ?? ""}"`).join(","), // Add quotes to handle commas in data
      ];
      blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      fullFilename += ".csv";
    } else if (type === "xls") {
      let table =
        "<table><tr>" +
        headers.map((h) => `<th>${h}</th>`).join("") +
        "</tr>";
      table +=
        "<tr>" +
        keys.map((key) => `<td>${data[key] ?? ""}</td>`).join("") +
        "</tr>";
      table += "</table>";
      blob = new Blob([table], { type: "application/vnd.ms-excel" });
      fullFilename += ".xls";
    } else return alert("Unsupported file type");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fullFilename;
    link.click();
    URL.revokeObjectURL(url); // Cleanup
  };

  const getScoreColor = (score) => {
    if (score === "N/A" || score === "Error") return "text-gray-400";
    if (score >= 90) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score === "N/A" || score === "Error") return "from-gray-500 to-gray-600";
    if (score >= 90) return "from-green-500 to-emerald-600";
    if (score >= 50) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Link to="/" className="flex items-center text-white hover:text-purple-300 transition-colors">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-4xl mx-auto pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Title */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-block mb-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">🔗</span>
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                Single URL Analysis
              </h1>
              <p className="text-purple-200 text-lg">
                Enter a website URL to analyze its performance
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkScore()}
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkScore}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <ClipLoader color="#fff" size={20} />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Analyze</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* URL Display */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${result.status.includes("Success") ? "bg-green-400" : "bg-red-400"} animate-pulse`}></div>
                      <h2 className="text-white font-semibold text-lg truncate">{result.url}</h2>
                    </div>
                  </div>

                  {/* Performance Cards */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Mobile Performance */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">📱</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Mobile</h3>
                      </div>

                      {/* Score Circle */}
                      <div className="flex justify-center mb-6">
                        <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBg(result.mobilescore)} p-1 shadow-2xl`}>
                          <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                            <span className={`text-3xl font-black ${getScoreColor(result.mobilescore)}`}>
                              {result.mobilescore}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-3">
                        <MetricRow label="⏱️ Total Time" value={result.mobiletiming} />
                        <MetricRow label="🎨 FCP" value={result.mobileFCP} />
                        <MetricRow label="🖼️ LCP" value={result.mobileLCP} />
                        <MetricRow label="📐 CLS" value={result.mobileCLS} />
                        <MetricRow label="⚡ Speed Index" value={result.mobileSI} />
                        <MetricRow label="🛑 Blocking Time" value={result.mobileTBT} />
                        <MetricRow label="👆 Interactive" value={result.mobileTTI} />
                      </div>
                    </motion.div>

                    {/* Desktop Performance */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">💻</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Desktop</h3>
                      </div>

                      {/* Score Circle */}
                      <div className="flex justify-center mb-6">
                        <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBg(result.desktopscore)} p-1 shadow-2xl`}>
                          <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                            <span className={`text-3xl font-black ${getScoreColor(result.desktopscore)}`}>
                              {result.desktopscore}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-3">
                        <MetricRow label="⏱️ Total Time" value={result.desktoptiming} />
                        <MetricRow label="🎨 FCP" value={result.desktopFCP} />
                        <MetricRow label="🖼️ LCP" value={result.desktopLCP} />
                        <MetricRow label="📐 CLS" value={result.desktopCLS} />
                        <MetricRow label="⚡ Speed Index" value={result.desktopSI} />
                        <MetricRow label="🛑 Blocking Time" value={result.desktopTBT} />
                        <MetricRow label="👆 Interactive" value={result.desktopTTI} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Export Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadFile(result, "performance-report", "csv")}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download CSV
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadFile(result, "performance-report", "xls")}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download XLS
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Metric Row Component
function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/10">
      <span className="text-purple-200 font-medium">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
