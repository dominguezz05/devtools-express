import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";
import { translations } from "../i18n";

function HelpPanel({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  // Obtener idioma desde localStorage (puedes adaptarlo si ya usas context)
  
  const t = translations[lang].help;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      panelRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) triggerRef.current?.focus();
  }, [isOpen]);

  const panelContent = createPortal(
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-panel-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative ml-auto h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="help-panel-title" className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            {t.title}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 max-h-screen">
          <section className="space-y-6 text-sm text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">{t.basicUsageTitle}</h3>
              <ol className="list-decimal pl-5 space-y-1">
                {t.basicUsage.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">{t.persistenceTitle}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {t.persistence.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">{t.snippetsTitle}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {t.snippets.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">{t.shortcutTitle}</h3>
              <p>
                {t.shortcutInstruction.replace("ESC", "")}
                <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Esc</kbd>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
  <>
    <button
      ref={triggerRef}
      onClick={() => setIsOpen(true)}
      className=" cursor-pointer text-sm text-blue-500 hover:text-blue-800 hover:underline inline-flex items-center gap-1.5 p-2 rounded-md transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title={t.title}
    >
      <Info className="w-4 h-4" />
      {t.button}
    </button>

    {panelContent}
  </>
);

}

export default HelpPanel;
