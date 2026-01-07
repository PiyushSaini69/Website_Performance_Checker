# ⚡ Website Performance Checker

A modern, high-performance web application that analyzes website speed and metrics using the **Google PageSpeed Insights API**. Built with a premium UI/UX, it offers both single URL analysis and bulk CSV processing.

![Project Banner](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern frosted glass effects with vibrant gradients.
- **Smooth Animations**: Powered by `framer-motion` for delightful interactions.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop.
- **Dark Mode Aesthetic**: A professional, tech-focused dark theme.

### 🚀 Core Functionalities
1.  **Single URL Analysis**:
    *   Instant analysis of any public URL.
    *   Detailed breakdown of Core Web Vitals (LCP, FID, CLS).
    *   Separate scores for **Mobile** and **Desktop**.
    *   Visual score indicators (Green/Yellow/Red).

2.  **Bulk File Upload**:
    *   Upload CSV files to analyze hundreds of URLs at once.
    *   Real-time progress tracking with a visual progress bar.
    *   **Export Results**: Download reports in CSV or Excel (XLS) formats.
    *   Summary dashboard showing success/failure rates.

---

## 🛠️ Tech Stack

### Frontend
- **React 19**: Latest React version for optimal performance.
- **Vite**: Blazing fast build tool and dev server.
- **Tailwind CSS 4**: Utility-first styling for the modern web.
- **Framer Motion**: Production-ready animation library.
- **React Router**: Seamless client-side navigation.

### Backend
- **Node.js & Express**: Robust REST API handling.
- **Google PageSpeed Insights API**: The core engine for performance data.
- **Cors**: secure cross-origin resource sharing.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Google PageSpeed Insights API Key (Optional but recommended for higher limits)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Website_Performance_Checker.git
cd Website_Performance_Checker
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=8000
Google_API=YOUR_GOOGLE_API_KEY
```
*Note: You can get an API key from the [Google Cloud Console](https://developers.google.com/speed/docs/insights/v5/get-started).*

Start the backend server:
```bash
npm run dev
```
The server will run on `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:8000
```

Start the frontend development server:
```bash
npm run dev
```
The app will open at `http://localhost:5173`.

---

## 📂 Project Structure

```
Website_Performance_Checker/
├── Backend/                 # Express Server
│   ├── index.js             # API Routes & Server Logic
│   └── package.json         # Backend Dependencies
│
└── Frontend/                # React Vite App
    ├── public/              # Static Assets (Favicon, Logo)
    ├── src/
    │   ├── Component/
    │   │   ├── InputURL.jsx     # Single URL Analysis Component
    │   │   └── FileUpload.jsx   # Bulk Upload Component
    │   ├── Links.jsx            # Home Page (Landing)
    │   ├── App.jsx              # Main Router
    │   ├── main.jsx             # Entry Point
    │   └── index.css            # Tailwind Imports
    └── package.json         # Frontend Dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).