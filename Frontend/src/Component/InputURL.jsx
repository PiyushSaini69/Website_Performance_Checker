import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners"; // Loading spinner

export default function InputURL() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null); // store only one result
  const [loading, setLoading] = useState(false);

  const checkScore = async () => {
    if (!url.trim()) return alert("Please enter a URL");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/sendUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([url]),
      });
      const data = await res.json();

      const newResult = {
        url,
        mobilescore: data.mobile.lighthouseResult?.categories?.performance?.score
          ? data.mobile.lighthouseResult.categories.performance.score * 100
          : "N/A",
        mobiletiming: data.mobile.lighthouseResult?.timing?.total || "N/A",
        mobileFCP:
          data.mobile.lighthouseResult?.audits["first-contentful-paint"]
            ?.displayValue || "N/A",
        mobileLCP:
          data.mobile.lighthouseResult?.audits["largest-contentful-paint"]
            ?.displayValue || "N/A",
        mobileCLS:
          data.mobile.lighthouseResult?.audits["cumulative-layout-shift"]
            ?.displayValue || "N/A",
        desktopscore: data.desktop.lighthouseResult?.categories?.performance
          ?.score
          ? data.desktop.lighthouseResult.categories.performance.score * 100
          : "N/A",
        desktoptiming: data.desktop.lighthouseResult?.timing?.total || "N/A",
        desktopFCP:
          data.desktop.lighthouseResult?.audits["first-contentful-paint"]
            ?.displayValue || "N/A",
        desktopLCP:
          data.desktop.lighthouseResult?.audits["largest-contentful-paint"]
            ?.displayValue || "N/A",
        desktopCLS:
          data.desktop.lighthouseResult?.audits["cumulative-layout-shift"]
            ?.displayValue || "N/A",
        status: "✅ Success",
      };

      setResult(newResult); // only one result
    } catch (err) {
      console.error(err);
      setResult({
        url,
        mobilescore: "Error",
        mobiletiming: "Error",
        mobileFCP: "Error",
        mobileLCP: "Error",
        mobileCLS: "Error",
        desktopscore: "Error",
        desktoptiming: "Error",
        desktopFCP: "Error",
        desktopLCP: "Error",
        desktopCLS: "Error",
        status: "❌ Failed",
      });
    }

    setUrl(""); // reset input after each run
    setLoading(false);
  };

  const downloadFile = (data, filename = "data", type = "csv") => {
    if (!data) return alert("No data to export");

    const headers = Object.keys(data);
    let blob;
    let fullFilename = filename;

    if (type === "csv") {
      const csvRows = [
        headers.join(","),
        headers.map((h) => data[h] ?? "").join(","),
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
        headers.map((h) => `<td>${data[h] ?? ""}</td>`).join("") +
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          🔗 Website Performance Checker
        </h1>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="url"
            placeholder="Enter website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={checkScore}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "🚀 Get Score"}
          </motion.button>
        </div>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              className={`p-4 mb-4 rounded-xl shadow-md border-l-4 ${
                result.status.includes("Success")
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <h2 className="font-bold text-gray-800 mb-2">{result.url}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-sm">
                <div>⚡ Mobile Score: {result.mobilescore}</div>
                <div>⏱️ Mobile Timing: {result.mobiletiming}</div>
                <div>FCP: {result.mobileFCP}</div>
                <div>LCP: {result.mobileLCP}</div>
                <div>CLS: {result.mobileCLS}</div>
                <div>⚡ Desktop Score: {result.desktopscore}</div>
                <div>⏱️ Desktop Timing: {result.desktoptiming}</div>
                <div>FCP: {result.desktopFCP}</div>
                <div>LCP: {result.desktopLCP}</div>
                <div>CLS: {result.desktopCLS}</div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadFile(result, "WebsiteScores", "csv")}
                className="px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:shadow-xl transition"
              >
                ⬇ Download CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadFile(result, "WebsiteScores", "xls")}
                className="px-5 py-2 bg-pink-500 text-white rounded-lg shadow hover:shadow-xl transition"
              >
                ⬇ Download XLS
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
