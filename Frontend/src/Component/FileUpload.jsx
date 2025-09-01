import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function FileUploadAI() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileUpload = () => {
    if (!file) return alert("Please select a file first!");
    setLoading(true);
    setResults([]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));

      for (const row of rows) {
        const url = row[0].trim();
        if (!url) continue;

        try {
          const res = await fetch("http://localhost:8000/sendUrl", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([url]),
          });
          const data = await res.json();
          const result = {
            url,
            mobilescore: data.mobile.lighthouseResult?.categories?.performance?.score
              ? data.mobile.lighthouseResult.categories.performance.score * 100
              : "N/A",
            mobiletiming: data.mobile.lighthouseResult?.timing?.total || "N/A",
            mobileFCP: data.mobile.lighthouseResult?.audits["first-contentful-paint"]?.displayValue || "N/A",
            mobileLCP: data.mobile.lighthouseResult?.audits["largest-contentful-paint"]?.displayValue || "N/A",
            mobileCLS: data.mobile.lighthouseResult?.audits["cumulative-layout-shift"]?.displayValue || "N/A",
            desktopscore: data.desktop.lighthouseResult?.categories?.performance?.score
              ? data.desktop.lighthouseResult.categories.performance.score * 100
              : "N/A",
            desktoptiming: data.desktop.lighthouseResult?.timing?.total || "N/A",
            desktopFCP: data.desktop.lighthouseResult?.audits["first-contentful-paint"]?.displayValue || "N/A",
            desktopLCP: data.desktop.lighthouseResult?.audits["largest-contentful-paint"]?.displayValue || "N/A",
            desktopCLS: data.desktop.lighthouseResult?.audits["cumulative-layout-shift"]?.displayValue || "N/A",
            status: "✅ Success",
          };
          setResults((prev) => [...prev, result]);
        } catch (err) {
          console.error("Error fetching PageSpeed for", url, err);
          const result = {
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
          };
          setResults((prev) => [...prev, result]);
        }
      }

      setLoading(false);
    };

    reader.readAsText(file);
  };

  const downloadFile = (data, filename = "data", type = "csv") => {
    if (!data || data.length === 0) return alert("No data to export");

    const headers = Object.keys(data[0]);
    let blob, content, fullFilename = filename;

    if (type === "csv") {
      content = [
        headers.join(","),
        ...data.map((row) => headers.map((h) => row[h] ?? "").join(",")),
      ].join("\n");
      blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      fullFilename += ".csv";
    } else if (type === "xls") {
      content = `<table><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>` +
                data.map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? ""}</td>`).join("")}</tr>`).join("") +
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🤖 Website Performance Analyzer
        </h2>

        {/* File Upload Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full sm:w-72 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-300 p-2"
          />
          <button
            onClick={fileUpload}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            {loading ? <ClipLoader size={18} color="#fff" /> : "Upload & Analyze"}
          </button>
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-inner">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2">URL</th>
                  <th className="px-4 py-2">Score (Mobile)</th>
                  <th className="px-4 py-2">Timing (Mobile)</th>
                  <th className="px-4 py-2">FCP (Mobile)</th>
                  <th className="px-4 py-2">LCP (Mobile)</th>
                  <th className="px-4 py-2">CLS (Mobile)</th>
                  <th className="px-4 py-2">Score (Desktop)</th>
                  <th className="px-4 py-2">Timing (Desktop)</th>
                  <th className="px-4 py-2">FCP (Desktop)</th>
                  <th className="px-4 py-2">LCP (Desktop)</th>
                  <th className="px-4 py-2">CLS (Desktop)</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}>
                    <td className="px-4 py-2 break-words max-w-xs">{r.url}</td>
                    <td className="px-4 py-2">{r.mobilescore}</td>
                    <td className="px-4 py-2">{r.mobiletiming}</td>
                    <td className="px-4 py-2">{r.mobileFCP}</td>
                    <td className="px-4 py-2">{r.mobileLCP}</td>
                    <td className="px-4 py-2">{r.mobileCLS}</td>
                    <td className="px-4 py-2">{r.desktopscore}</td>
                    <td className="px-4 py-2">{r.desktoptiming}</td>
                    <td className="px-4 py-2">{r.desktopFCP}</td>
                    <td className="px-4 py-2">{r.desktopLCP}</td>
                    <td className="px-4 py-2">{r.desktopCLS}</td>
                    <td className="px-4 py-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Download Buttons */}
            {!loading && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={() => downloadFile(results, "WebsitePerformance", "csv")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                >
                  ⬇ Download CSV
                </button>
                <button
                  onClick={() => downloadFile(results, "WebsitePerformance", "xls")}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                >
                  ⬇ Download XLS
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
