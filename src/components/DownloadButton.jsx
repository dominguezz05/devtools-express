import React from 'react';
import { translations } from "../i18n";

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

function DownloadButton({ content, filename = "README.md", lang = "es" }) {
  const t = translations[lang] || translations["es"];

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!content}
      className={`cursor-pointer flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
        bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500
        ${!content ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"}`}
    >
      <DownloadIcon />
      <span className="ml-2">{t.download}</span>
    </button>
  );
}

export default DownloadButton;
