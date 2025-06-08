// src/components/HelpPanel.jsx
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react"; 

function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null); 
  const panelRef = useRef(null); 

  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Evitar scroll del body
      document.body.style.overflow = "hidden";
      // Mover el foco al panel al abrirse
      panelRef.current?.focus();
    }

    // Función de limpieza
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Efecto para devolver el foco al botón que abrió el panel cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const panelContent = (
    // Portal para renderizar el panel en el body, evitando problemas de z-index
    createPortal(
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-panel-title"
      >
        {/* Backdrop / Overlay */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Contenido del Panel Deslizante */}
        <div
          ref={panelRef}
          tabIndex={-1} // Permite que el div reciba foco
          className={`relative w-full max-w-md h-full bg-white shadow-xl ml-auto flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 id="help-panel-title" className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Guía Rápida de Uso
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Cerrar guía"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow">
            <div className="space-y-6 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Uso Básico</h3>
                <ol className="list-decimal space-y-2 pl-5 text-sm">
                  <li>En la pantalla principal, selecciona una de las herramientas disponibles haciendo clic en su tarjeta.</li>
                  <li>Introduce tu contenido (código, datos, etc.) en el área de entrada principal.</li>
                  <li>Presiona el botón de acción principal (ej. “Generar”, “Minificar”, “Convertir”).</li>
                  <li>El resultado aparecerá en el área de salida, desde donde podrás copiarlo o descargarlo.</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Historial y Persistencia</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>La mayoría de las herramientas guardan un <strong>historial de tus entradas</strong> en tu navegador para que puedas reutilizarlas fácilmente.</li>
                  <li>Los <strong>Snippets</strong> que creas también se guardan automáticamente.</li>
                  <li>Tus datos <strong>no se van</strong> al recargar la página.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Gestión de Configuración</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Usa el botón <strong>"Exportar Configuración"</strong> en la pantalla principal para guardar todos tus snippets y ajustes en un archivo <code>.json</code>.</li>
                  <li>Usa <strong>"Importar Configuración"</strong> para cargar un archivo previamente guardado y restaurar tu estado.</li>
                </ul>
              </div>

               <div>
                <h3 className="font-semibold text-slate-900 mb-2">Atajos de Teclado</h3>
                 <p className="text-sm">
                    Puedes cerrar este panel de ayuda en cualquier momento presionando la tecla <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Esc</kbd>.
                 </p>
              </div>

            </div>
          </div>
        </div>
      </div>,
      document.body 
    )
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1.5 p-2 rounded-md transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="Guía rápida de uso"
      >
        <Info className="w-4 h-4" />
        ¿Necesitas ayuda?
      </button>

      {panelContent}
    </>
  );
}

export default HelpPanel;