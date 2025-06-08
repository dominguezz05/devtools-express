import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

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
            Guía Rápida de Uso
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
              <h3 className="font-semibold text-slate-900 mb-2">Uso Básico</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Selecciona una herramienta desde la pantalla principal.</li>
                <li>Introduce datos o código en el área correspondiente.</li>
                <li>Haz clic en el botón principal para ejecutar la herramienta.</li>
                <li>Visualiza, copia o descarga el resultado generado.</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Historial y Persistencia</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>El historial de entradas se guarda localmente en el navegador.</li>
                <li>Los snippets se guardan automáticamente y se restauran al volver.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Configuración de snippets</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Usa <strong>Exportar Snippets</strong> para tener tus snippets en un  <code>.json</code>.</li>
                <li>Usa <strong>Importar Snippets</strong> para insertarlos desde un archivo <code>.json</code>.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Atajo de Teclado</h3>
              <p>
                Pulsa <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Esc</kbd> para cerrar esta ayuda.
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
        className="text-sm text-blue-500 hover:text-blue-800 hover:underline inline-flex items-center gap-1.5 p-2 rounded-md transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="Guía rápida"
      >
        <Info className="w-4 h-4" />
        ¿Necesitas ayuda?
      </button>

      {panelContent}
    </>
  );
}

export default HelpPanel;
