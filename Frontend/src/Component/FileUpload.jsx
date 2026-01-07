import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function FileUploadAI() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileUpload = () => {
    if (!file) return alert("Please select a file first!");
    setLoading(true);
    setResults([]);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));
      const totalRows = rows.filter(row => row[0]?.trim()).length;
      let completed = 0;

      for (const row of rows) {
        const url = row[0].trim();
        if (!url) continue;

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

          const result = {
            url,
            // Mobile Data
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

            // Desktop Data
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
          setResults((prev) => [...prev, result]);
        } catch (err) {
          console.error("Error fetching PageSpeed for", url, err);
          const result = {
            url,
            mobilescore: "Error", mobiletiming: "Error",
            mobileFCP: "Error", mobileLCP: "Error", mobileCLS: "Error",
            mobileSI: "Error", mobileTBT: "Error", mobileTTI: "Error",

            desktopscore: "Error", desktoptiming: "Error",
            desktopFCP: "Error", desktopLCP: "Error", desktopCLS: "Error",
            desktopSI: "Error", desktopTBT: "Error", desktopTTI: "Error",

            status: "❌ Failed",
          };
          setResults((prev) => [...prev, result]);
        }

        completed++;
        setProgress(Math.round((completed / totalRows) * 100));
      }

      setLoading(false);
    };

    reader.readAsText(file);
  };

  const downloadFile = (data, filename = "data", type = "csv") => {
    if (!data || data.length === 0) return alert("No data to export");

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

    const keys = Object.keys(data[0]);
    const headers = keys.map(key => headerMap[key] || key);
    let blob, content, fullFilename = filename;

    if (type === "csv") {
      content = [
        headers.join(","),
        ...data.map((row) => keys.map((key) => `"${row[key] ?? ""}"`).join(",")),
      ].join("\n");
      blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      fullFilename += ".csv";
    } else if (type === "xls") {
      content = `<table><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>` +
        data.map((row) => `<tr>${keys.map((key) => `<td>${row[key] ?? ""}</td>`).join("")}</tr>`).join("") +
        `</table>`;
      blob = new Blob([content], { type: "application/vnd.ms-excel" });
      fullFilename += ".xls";
    } else return alert("Unsupported file type");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fullFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Cleanup
  };

  const getScoreColor = (score) => {
    if (score === "N/A" || score === "Error") return "text-gray-400";
    if (score >= 90) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Link to="/" className="flex items-center text-white hover:text-blue-300 transition-colors">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-6xl mx-auto pb-10">
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">📂</span>
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                Bulk File Upload
              </h1>
              <p className="text-indigo-200 text-lg">
                Upload a CSV file with multiple URLs for batch analysis
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="block w-full cursor-pointer">
                    <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 border-2 border-dashed border-white/30 rounded-2xl hover:border-blue-400 hover:bg-white/20 transition-all">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-white font-medium">
                        {file ? file.name : "Choose CSV file"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fileUpload}
                  disabled={loading || !file}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <ClipLoader size={20} color="#fff" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Analyze All</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Progress Bar */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="flex justify-between text-sm text-indigo-200 mb-2">
                    <span>Processing URLs...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Results */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
                      <div className="text-3xl font-black text-white">{results.length}</div>
                      <div className="text-sm text-indigo-200">Total Analyzed</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
                      <div className="text-3xl font-black text-green-400">
                        {results.filter(r => r.status.includes("Success")).length}
                      </div>
                      <div className="text-sm text-indigo-200">Successful</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
                      <div className="text-3xl font-black text-red-400">
                        {results.filter(r => r.status.includes("Failed")).length}
                      </div>
                      <div className="text-sm text-indigo-200">Failed</div>
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                          <tr>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-white sticky left-0 bg-blue-600/90 backdrop-blur-md z-10 w-48">URL</th>

                            {/* Mobile Headers */}
                            <th className="px-2 py-4 text-center text-xs font-bold text-blue-200 uppercase tracking-wider border-l border-white/10">Mobile</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">Score</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">Time</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">FCP</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">LCP</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">CLS</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">SI</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">TBT</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">TTI</th>

                            {/* Desktop Headers */}
                            <th className="px-2 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider border-l border-white/10">Desktop</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">Score</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">Time</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">FCP</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">LCP</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">CLS</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">SI</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">TBT</th>
                            <th className="px-2 py-4 text-center text-xs font-semibold text-white">TTI</th>

                            <th className="px-4 py-4 text-center text-xs font-semibold text-white border-l border-white/10">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((r, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`border-b border-white/10 ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'} hover:bg-white/10 transition-colors`}
                            >
                              <td className="px-4 py-3 text-white text-xs sticky left-0 bg-slate-900/40 backdrop-blur-md border-r border-white/10 truncate max-w-[200px]" title={r.url}>
                                {r.url}
                              </td>

                              {/* Mobile Data */}
                              <td className="px-2 py-3 text-center border-l border-white/10">📱</td>
                              <td className={`px-2 py-3 text-center font-bold ${getScoreColor(r.mobilescore)}`}>
                                {r.mobilescore}
                              </td>
                              <td className="px-2 py-3 text-center text-indigo-200 text-xs">{r.mobiletiming}</td>
                              <td className="px-2 py-3 text-center text-indigo-200 text-xs">{r.mobileFCP}</td>
                              <td className="px-2 py-3 text-center text-indigo-200 text-xs">{r.mobileLCP}</td>
                              <td className="px-2 py-3 text-center text-indigo-200 text-xs">{r.mobileCLS}</td>
                              <td className="px-2 py-3 text-center text-indigo-200 text-xs">{r.mobileSI}</td>
                              <td className="px-2 py-3 text-center text-indigo-200 text-xs">{r.mobileTBT}</td>
                              <td className="px-2 py-3 text-center text-indigo-200 text-xs">{r.mobileTTI}</td>

                              {/* Desktop Data */}
                              <td className="px-2 py-3 text-center border-l border-white/10">💻</td>
                              <td className={`px-2 py-3 text-center font-bold ${getScoreColor(r.desktopscore)}`}>
                                {r.desktopscore}
                              </td>
                              <td className="px-2 py-3 text-center text-purple-200 text-xs">{r.desktoptiming}</td>
                              <td className="px-2 py-3 text-center text-purple-200 text-xs">{r.desktopFCP}</td>
                              <td className="px-2 py-3 text-center text-purple-200 text-xs">{r.desktopLCP}</td>
                              <td className="px-2 py-3 text-center text-purple-200 text-xs">{r.desktopCLS}</td>
                              <td className="px-2 py-3 text-center text-purple-200 text-xs">{r.desktopSI}</td>
                              <td className="px-2 py-3 text-center text-purple-200 text-xs">{r.desktopTBT}</td>
                              <td className="px-2 py-3 text-center text-purple-200 text-xs">{r.desktopTTI}</td>

                              <td className="px-4 py-3 text-center text-xs border-l border-white/10">
                                <span className={`px-2 py-1 rounded-full ${r.status.includes("Success") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                                  {r.status === "✅ Success" ? "Success" : "Failed"}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Export Buttons */}
                  {!loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap justify-center gap-4 mt-8"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadFile(results, "bulk-performance-report", "csv")}
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
                        onClick={() => downloadFile(results, "bulk-performance-report", "xls")}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download XLS
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
