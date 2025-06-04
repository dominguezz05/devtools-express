// src/components/CopyButton.jsx
import { useState, useEffect, useRef } from "react";

// --- Icons ---
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125V7.5m0 12.75v-7.5m0 0H3M9 7.5H6.375M15 12m0 0V5.25A2.25 2.25 0 0 0 12.75 3H12a2.25 2.25 0 0 0-2.25 2.25v1.5m3 0h3m-3 0h-1.5m-1.5 0H9m5.25 0h1.5m0 0V9.75m0 5.25v1.5m0 0V15m0 0v.375m1.375 0A1.125 1.125 0 0 1 18.75 15v-3.375m-3.375 0c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-9.75A1.125 1.125 0 0 1 3.375 21V11.25c0-.621.504-1.125 1.125-1.125h3.375M15 12h-3.375" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);
// --- End Icons ---

function CopyButton({ content, buttonText = "Copiar Markdown", successText = "¡Copiado!", errorText = "Error al copiar" }) {
  const [status, setStatus] = useState("idle"); // 'idle', 'copied', 'error'
  const [liveRegionMessage, setLiveRegionMessage] = useState("");
  const timeoutRef = useRef(null);

  const handleCopy = async () => {
    if (!content || status === "copied" || status === "error") return; // Prevent multiple clicks while in a temporary state

    try {
      await navigator.clipboard.writeText(content);
      setStatus("copied");
      setLiveRegionMessage("Contenido copiado al portapapeles.");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      setStatus("error");
      setLiveRegionMessage("Error al copiar al portapapeles.");
    }
  };

  useEffect(() => {
    if (status === "copied" || status === "error") {
      // Clear previous timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setStatus("idle");
        setLiveRegionMessage(""); // Clear message after timeout
      }, 2500); // Reset after 2.5 seconds
    }

    // Cleanup timeout on component unmount or if status changes before timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status]);

  let currentIcon;
  let currentText;
  let currentBgColors;

  switch (status) {
    case "copied":
      currentIcon = <CheckIcon />;
      currentText = successText;
      currentBgColors = "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500";
      break;
    case "error":
      currentIcon = <ErrorIcon />;
      currentText = errorText;
      currentBgColors = "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
      break;
    default: // idle
      currentIcon = <CopyIcon />;
      currentText = buttonText;
      currentBgColors = "bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500";
  }

  return (
    <>
      <button
        type="button" // Good practice for buttons not submitting a form
        onClick={handleCopy}
        disabled={!content || status !== "idle"} // Disable if no content or if in a temporary state
        className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
          ${currentBgColors}
          ${(!content || status !== 'idle') ? "opacity-75 cursor-not-allowed" : ""}`}
        aria-describedby="copy-status-message" // For more context if needed, though aria-live is primary
      >
        {currentIcon}
        <span className="ml-2">{currentText}</span>
      </button>
      {/* Visually hidden live region for screen reader announcements */}
      <span id="copy-status-message" className="sr-only" aria-live="polite" aria-atomic="true">
        {liveRegionMessage}
      </span>
    </>
  );
}

export default CopyButton;