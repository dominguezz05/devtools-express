// components/HelpPopup.jsx
import { useState, useEffect } from "react";
import { Lightbulb, X } from "lucide-react";

const helpContent = {
  readme: {
    title: "Generador de README",
    details: "Esta herramienta te guía para crear un archivo README.md profesional. Rellena los campos del formulario y el contenido se generará automáticamente en la vista previa."
  },
  gitignore: {
    title: "Generador de .gitignore",
    details: "Evita subir archivos innecesarios a tu repositorio. Escribe los nombres de las tecnologías, frameworks o sistemas operativos (separados por comas, ej: `node,react,macos`) para generar un archivo .gitignore optimizado."
  },
  jsoncsv: {
    title: "Convertidor JSON ↔ CSV",
    details: "Pega tus datos en formato JSON (un array de objetos) o CSV (con cabeceras en la primera línea) en el área de entrada. Luego, presiona el botón de la dirección en la que quieras convertir."
  },
  minifier: {
    title: "Minificador de Código",
    details: "Reduce el tamaño de tu código para optimizar la carga de tu web. Selecciona el lenguaje (HTML, CSS o JS), pega tu código y haz clic en 'Minificar'."
  },
  githelper: {
    title: "Ayudante Comandos Git",
    details: "Una lista de los comandos de Git más utilizados para que puedas copiarlos rápidamente. También puedes guardar tus propios comandos personalizados en el historial."
  },
  snippeteditor: {
    title: "Editor de Snippets",
    details: "Tu biblioteca personal de fragmentos de código. Guarda, gestiona y reutiliza tus snippets más frecuentes. Todos los datos se guardan en tu navegador."
  },
  default: {
    title: "Ayuda General",
    details: "Pasa el cursor sobre los elementos o selecciona una herramienta para obtener ayuda contextual. Puedes cerrar esta ventana con la tecla 'Esc'."
  }
};

function HelpPopup({ helpKey, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const content = helpContent[helpKey] || helpContent.default;

  // Chequear si ya fue cerrada antes
  useEffect(() => {
    const dismissed = localStorage.getItem(`help-dismissed-${helpKey}`);
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      onClose(); // cerramos automáticamente
    }
  }, [helpKey, onClose]);

  // Cerrar con la tecla Escape
  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`help-dismissed-${helpKey}`, "true"); // <- Guardar que fue cerrada
    setTimeout(onClose, 300); // esperar transición
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-xl shadow-2xl transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{content.title}</h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Cerrar ayuda"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-3 pl-12 text-sm text-slate-600">
        {content.details}
      </p>
    </div>
  );
}

export default HelpPopup;
