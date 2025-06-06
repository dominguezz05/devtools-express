import { useState, useEffect } from "react";
import { minify as cssoMinify } from "csso";
import { minify as jsMinify } from "terser";
import HelpPopup from "./HelpPopup";
import { saveToHistory, getHistory, clearHistory } from "../utils/historyStorage";
import HistoryPanel from "./HistoryPanel";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";


function CodeMinifier() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("html");
  const [minified, setMinified] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('idle');
  const [showHelp, setShowHelp] = useState(false);
  const [history, setHistory] = useState([]);
  const TOOL_NAME = "code-minifier";

  const cardContainerClasses = "my-8 bg-white p-6 md:p-8 rounded-xl shadow-md sm:shadow-lg space-y-6";
  const toolTitleClasses = "text-2xl font-semibold text-gray-800";
  const toolDescriptionClasses = "text-gray-600 text-sm md:text-base";
  const textareaClasses = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none";
  const primaryButtonClasses = (disabled) => `inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'}`;
  const secondaryButtonClasses = () => "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200";
  const errorAlertClasses = "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-sm mb-4";
  const ConvertIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m16 0l-4-4m0 8l4-4m-8 0l-4 4m0-8l4 4" /></svg>;
  const CopyIconMini = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2m-4-8h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4m4-4h4a2 2 0 012 2v4m-6-6V6m0-4h4a2 2 0 012 2v4m-6-6H8a2 2 0 00-2 2v4m10-10H8a2 2 0 00-2 2v4" /></svg>;
  const CheckIconMini = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
  const ClearIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
  const MinifyIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m16 0l-4-4m0 8l4-4m-8 0l-4 4m0-8l4 4" /></svg>;
  const DownloadIconMini = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0l-4-4m4 4l4-4m-8 6h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  const inputClasses = "block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500";
  
  // Función helper de copiado para mantener consistencia
  const copyToClipboard = async (text, onSuccess, onError) => {
      try { await navigator.clipboard.writeText(text); onSuccess(); }
      catch (err) { console.error("Error al copiar:", err); onError(); }
  };

  useEffect(() => {
    setHistory(getHistory(TOOL_NAME));
  }, []);

  useEffect(() => {
    setMinified("");
    setError("");
    setCopyStatus('idle');
  }, [code, language]);

  const handleMinify = async () => {
    // --- LÓGICA DE VALIDACIÓN ---
    if (!code.trim()) {
      setError("❌ El campo de código está vacío.");
      return;
    }
    // --- FIN VALIDACIÓN ---

    setIsLoading(true);
    setError(""); // Limpiamos el error si la validación pasa
    setMinified("");
    setCopyStatus('idle');

    try {
      let resultText = "";
      // Usamos una función interna simple para HTML para evitar errores de dependencias de Node
      const minifyHtmlBrowser = (htmlString) => htmlString.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();

      if (language === "html") {
        resultText = minifyHtmlBrowser(code);
      } else if (language === "css") {
        const result = cssoMinify(code);
        if (result.css) {
          resultText = result.css;
        } else {
          throw new Error("La minificación CSS no produjo resultado.");
        }
      } else if (language === "js") {
        const result = await jsMinify(code, {
          mangle: { toplevel: true },
          compress: { drop_console: true }
        });
        if (result.code) {
          resultText = result.code;
        } else {
          throw new Error("La minificación JS no produjo resultado.");
        }
      }
      setMinified(resultText);
      
      saveToHistory(TOOL_NAME, code);
      setHistory(getHistory(TOOL_NAME));
      
    } catch (err) {
      setError(`❌ Error al minificar: ${err.message}`);
      setMinified("");
    } finally {
      setIsLoading(false);
    }
  };

const handleClearAll = () => {
  setCode("");
  setMinified("");
  setError("");
  setCopyStatus("idle");
};

  const handleCopyOutput = () => { /* ...tu lógica existente... */ };
  const handleDownloadOutput = () => { /* ...tu lógica existente... */ };
const handleClearHistory = () => {
  clearHistory(TOOL_NAME);     // Borra del localStorage
  setHistory([]);              // Limpia el estado local
};
const handleSelectHistory = (historyEntry) => {
  setCode(historyEntry);       // Rellena el campo de entrada
  setMinified("");             // Resetea el minificado previo
  setError("");                // Limpia errores
};


  return (
    <div className={cardContainerClasses}>
      <div className="flex justify-between items-center mb-1">
        <h2 className={toolTitleClasses}>Minificador de Código</h2>
        
      </div>
      <p className={toolDescriptionClasses}>
        Reduce el tamaño de tu código HTML, CSS o JavaScript para optimizar la carga.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="minifier-language" className="block text-sm font-medium text-gray-700 mb-1">Lenguaje:</label>
          <select
            id="minifier-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`${inputClasses} mb-2`}
            disabled={isLoading}
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
          </select>
        </div>

        <div>
          <label htmlFor="minifier-input" className="block text-sm font-medium text-gray-700 mb-1">Código Original:</label>
          <textarea
            id="minifier-input"
            // --- ESTILO CONDICIONAL AÑADIDO ---
            className={`${textareaClasses} h-48 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
            placeholder={`Pega tu código ${language.toUpperCase()} aquí`}
            value={code}
            onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(""); // Limpiar error al escribir
            }}
            disabled={isLoading}
            aria-invalid={!!error}
            aria-describedby={error ? "minifier-error" : undefined}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button 
            type="button" 
            onClick={handleMinify} 
            className={`${primaryButtonClasses(isLoading || !code.trim())} w-full sm:w-auto`}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : <MinifyIcon />}
            <span className="ml-2">{isLoading ? "Minificando..." : "Minificar Código"}</span>
          </button>
          {(code || minified || error) && (
            <button type="button" onClick={handleClearAll} title="Limpiar todo" className="p-2.5 text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm ml-auto sm:ml-4">
              <ClearIcon />
            </button>
          )}
        </div>

        {error && <div id="minifier-error" className={errorAlertClasses} role="alert">{error}</div>}

        {minified && (
          <div>
            <div className="flex justify-between items-center mt-4 mb-1">
              <label htmlFor="minifier-output" className="block text-sm font-medium text-gray-700">Código Minificado:</label>
              <div className="flex gap-2">
               <CopyButton content={minified} buttonText="Copiar código" />
<DownloadButton content={minified} filename={`minified.${language}`} />

              </div>
            </div>
            <textarea
              id="minifier-output"
              className={`${textareaClasses} h-48 bg-slate-50`}
              readOnly
              value={minified}
            />
          </div>
        )}
        
        <HistoryPanel
          history={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
        />
      </div>
      {showHelp && (
        <HelpPopup helpKey="minifier" onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}

export default CodeMinifier;