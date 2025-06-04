// src/components/GitignoreGenerator.jsx
import { useState, useEffect, useCallback } from "react";

// --- Iconos (puedes reemplazarlos con tu librería de iconos o SVGs más elaborados) ---
const GenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L24.5 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L18.25 12l-2.846.813a4.5 4.5 0 00-3.09 3.09L11.5 18.75l.813-2.846a4.5 4.5 0 003.09-3.09L18.25 12z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CopyIconMini = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125V7.5m0 12.75v-7.5m0 0H3M9 7.5H6.375m0 0A2.25 2.25 0 0 1 8.625 3h6.75A2.25 2.25 0 0 1 17.625 5.25m0 2.25V11.25m0 0H21m-2.25 0H12.375M15 12H3.375" /></svg>;
const DownloadIconMini = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const ClearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L6.75 4.5m0 0L4.5 6.75M6.75 4.5l10.5 10.5m0 0L19.5 12m-2.25 2.25L15 9.75M4.5 19.5l2.25-2.25" /></svg>;
// --- Fin Iconos ---


function GitignoreGenerator() {
  const [languageInput, setLanguageInput] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [copyStatus, setCopyStatus] = useState(''); // idle, copied, error

  // Fetch available languages for datalist
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("https://www.toptal.com/developers/gitignore/api/list");
        if (!res.ok) throw new Error("No se pudo cargar la lista de lenguajes.");
        const text = await res.text();
        // The list is newline and comma separated, we want individual items
        const languages = text.split(/[\n,]+/).map(lang => lang.trim()).filter(lang => lang);
        setAvailableLanguages([...new Set(languages)]); // Remove duplicates
      } catch (err) {
        console.error(err);
        // setError("No se pudo cargar la lista de lenguajes para autocompletar."); 
        // Minor error, don't show to user as it's just for suggestions
      }
    };
    fetchLanguages();
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!languageInput.trim()) {
      setError("Por favor, introduce uno o más lenguajes/frameworks.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setContent(""); // Clear previous content

    // Sanitize input: remove extra spaces around commas and at ends
    const formattedLanguages = languageInput.trim().split(',').map(lang => lang.trim()).filter(lang => lang).join(',');

    try {
      const res = await fetch(`https://www.toptal.com/developers/gitignore/api/${formattedLanguages}`);
      const text = await res.text();
      
      if (!res.ok) {
        // Try to parse error from Toptal's response if possible, otherwise generic error
        if (text.toLowerCase().includes("error") || text.toLowerCase().includes("unknown")) {
          throw new Error(`Plantilla no encontrada para: ${formattedLanguages}. Verifica los nombres.`);
        }
        throw new Error(`Error del servidor: ${res.status}`);
      }
      
      // Check if the response is an HTML page (which Toptal might send for errors)
      if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
          throw new Error(`Plantilla no encontrada para: ${formattedLanguages}. La API devolvió una página HTML.`);
      }

      // Check for Toptal's "template not found" comments
      if (text.includes("ERROR: Unrecognised project type") || text.includes("No .gitignore template found")) {
         throw new Error(`Una o más plantillas no encontradas para: ${formattedLanguages}.`);
      }

      setContent(text);
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocurrió un error al generar el archivo .gitignore.");
      setContent(''); // Clear content on error
    } finally {
      setIsLoading(false);
    }
  }, [languageInput]);

  const handleClear = () => {
    setLanguageInput("");
    setContent("");
    setError(null);
    setIsLoading(false);
  };

  const handleCopyToClipboard = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".gitignore";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Input classes consistent with READMEForm
  const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition duration-150 ease-in-out";
  const buttonClasses = "flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out";
  const secondaryButtonClasses = "flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition";


  return (
    <div className="my-8 p-6 bg-white shadow-xl rounded-lg w-full max-w-2xl mx-auto"> {/* Card-like container */}
      <h2 className="text-2xl font-semibold mb-1 text-gray-800">Generador de <code>.gitignore</code></h2>
      <p className="text-sm text-gray-600 mb-6">
        Crea rápidamente archivos <code>.gitignore</code> para tus proyectos. Escribe uno o más lenguajes o frameworks separados por comas.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="gitignore-language" className="block text-sm font-medium text-gray-700 mb-1">
            Lenguajes / Frameworks
          </label>
          <div className="flex items-center gap-2">
            <input
              id="gitignore-language"
              type="text"
              list="gitignore-languages-list"
              value={languageInput}
              onChange={(e) => {
                setLanguageInput(e.target.value);
                if (error) setError(null); // Clear error on new input
              }}
              placeholder="Ej: node,python,react,vscode"
              className={inputClasses}
              disabled={isLoading}
            />
            {availableLanguages.length > 0 && (
              <datalist id="gitignore-languages-list">
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang} />
                ))}
              </datalist>
            )}
             <button
              type="button"
              onClick={handleGenerate}
              className={`${buttonClasses} whitespace-nowrap ${isLoading || !languageInput.trim() ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={isLoading || !languageInput.trim()}
            >
              {isLoading ? <LoadingSpinner /> : <GenerateIcon />}
              <span className="ml-2">{isLoading ? "Generando..." : "Generar"}</span>
            </button>
            {(languageInput || content || error) && (
                 <button
                    type="button"
                    onClick={handleClear}
                    className="p-2.5 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition"
                    title="Limpiar"
                    disabled={isLoading}
                >
                    <ClearIcon />
                </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm" role="alert">
            {error}
          </div>
        )}
      </div>
      
      {content && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">Resultado generado:</h3>
            <div className="flex gap-2">
              <button onClick={handleCopyToClipboard} className={`${secondaryButtonClasses} min-w-[90px]`}>
                {copyStatus === 'copied' ? <><CopyIconMini/> <span className="ml-1.5">Copiado</span></> : 
                 copyStatus === 'error' ? <><CopyIconMini/> <span className="ml-1.5">Error</span></> :
                 <><CopyIconMini/> <span className="ml-1.5">Copiar</span></>}
              </button>
              <button onClick={handleDownload} className={secondaryButtonClasses}>
                <DownloadIconMini />
                <span className="ml-1.5">Descargar</span>
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-72 p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-xs shadow-sm focus:ring-blue-500 focus:border-blue-500"
            readOnly
            value={content}
            aria-label="Contenido del archivo .gitignore generado"
          />
        </div>
      )}
    </div>
  );
}

export default GitignoreGenerator;