import { useState, useEffect } from "react";
import { Lightbulb, X } from "lucide-react";
import { translations } from "../i18n"; // Asegúrate de que la ruta sea correcta

function HelpPopup({ helpKey, onClose, lang = "es" }) {
  // --- TRADUCCIÓN: Obtenemos el bloque de textos para los popups ---
  const t = translations[lang]?.popup || {};
  
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // --- El contenido ahora se busca en el objeto de traducción `t` ---
  const content = t[helpKey] || t.default || {};

  useEffect(() => {
    const dismissed = localStorage.getItem(`help-dismissed-${helpKey}`);
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      onClose();
    }
  }, [helpKey, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem(`help-dismissed-${helpKey}`, "true");
    }
    setTimeout(onClose, 300);
  };
  
  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dontShowAgain]); // Se actualiza si 'dontShowAgain' cambia para que se guarde el estado correcto

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-xl shadow-2xl transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            {content.title}
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t.closeLabel} // TRADUCCIÓN
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-3 pl-12 text-sm text-slate-600">{content.details}</p>

      <div className="mt-4 pl-12 flex items-center gap-2">
        <input
          type="checkbox"
          id={`dont-show-again-${helpKey}`} // ID único por si hay varios popups
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          checked={dontShowAgain}
          onChange={() => setDontShowAgain((prev) => !prev)}
        />
        <label htmlFor={`dont-show-again-${helpKey}`} className="text-sm text-slate-600">
          {t.checkboxLabel} {/* TRADUCCIÓN */}
        </label>
      </div>
    </div>
  );
}

export default HelpPopup;