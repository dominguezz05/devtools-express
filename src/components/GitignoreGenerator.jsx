import { useState, useEffect, useCallback } from "react";
import HelpPopup from "./HelpPopup";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import { translations } from "../i18n";

// --- Iconos ---
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
const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L6.75 4.5m0 0L4.5 6.75M6.75 4.5l10.5 10.5m0 0L19.5 12m-2.25 2.25L15 9.75M4.5 19.5l2.25-2.25" />
  </svg>
);

// --- Componente Principal ---
function GitignoreGenerator({ lang = "es" }) {
  const t = translations[lang].help.gitignore;
  const errors = translations[lang].errors;
  const common = translations[lang].copy;

  const [languageInput, setLanguageInput] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("/toptal-api/list");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`${errors.loadLanguages} ${res.status}. ${errors.detail}: ${errorText.substring(0, 100)}`);
        }
        const text = await res.text();
        const languages = text.split(/[\n,]+/).map(lang => lang.trim()).filter(Boolean);
        setAvailableLanguages([...new Set(languages)]);
      } catch (err) {
        console.error("Error fetching language list:", err);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem("help-dismissed-gitignore");
    if (!dismissed) setShowHelp(true);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!languageInput.trim()) {
      setError(errors.emptyInput);
      return;
    }

    setIsLoading(true);
    setError(null);
    setContent("");

    const formattedLanguages = languageInput.trim().split(',').map(l => l.trim()).filter(Boolean).join(',');

    try {
      const res = await fetch(`/toptal-api/${formattedLanguages}`);
      const text = await res.text();

      if (!res.ok) {
        if (text.toLowerCase().includes("error") || text.toLowerCase().includes("unknown") || res.status === 404) {
          throw new Error(`${errors.templateNotFound}: ${formattedLanguages}.`);
        }
        throw new Error(`${errors.serverError} ${res.status}.`);
      }

      if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
        throw new Error(`${errors.htmlReturned}: ${formattedLanguages}.`);
      }

      if (text.includes("ERROR: Unrecognised project type") || text.includes("No .gitignore template found")) {
        throw new Error(`${errors.partialNotFound}: ${formattedLanguages}.`);
      }

      setContent(text);
    } catch (err) {
      console.error("Error generating .gitignore:", err);
      setError(err.message || errors.general);
      setContent('');
    } finally {
      setIsLoading(false);
    }
  }, [languageInput, errors]);

  const handleClear = () => {
    setLanguageInput("");
    setContent("");
    setError(null);
    setIsLoading(false);
  };

  const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition duration-150 ease-in-out";
  const buttonClasses = "flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out";

  return (
    <div className="my-8 p-6 bg-white shadow-xl rounded-lg w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-semibold text-gray-800">{t.title}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">{t.subtitle}</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="gitignore-language" className="block text-sm font-medium text-gray-700 mb-1">
            {t.label}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="gitignore-language"
              type="text"
              list="gitignore-languages-list"
              value={languageInput}
              onChange={(e) => {
                setLanguageInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.placeholder}
              className={`${inputClasses} ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
              disabled={isLoading}
              aria-invalid={!!error}
              aria-describedby={error ? "gitignore-error" : undefined}
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
              className={`${buttonClasses} whitespace-nowrap ${isLoading || !languageInput.trim() ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              disabled={isLoading || !languageInput.trim()}
            >
              {isLoading ? <LoadingSpinner /> : <GenerateIcon />}
              <span className="ml-2">{isLoading ? t.generating : t.generate}</span>
            </button>
            {(languageInput || content || error) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2.5 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition cursor-pointer"
                title={t.clear}
                disabled={isLoading}
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div id="gitignore-error" className="mt-3 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm" role="alert">
            {error}
          </div>
        )}
      </div>

      {content && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">{t.outputTitle}</h3>
            <div className="flex gap-2">
              <CopyButton content={content} buttonText={common.button} lang={lang}/>
              <DownloadButton content={content} filename=".gitignore" type="gitignore" lang={lang} />

            </div>
          </div>
          <textarea
            className="w-full h-72 p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-xs shadow-sm focus:ring-blue-500 focus:border-blue-500"
            readOnly
            value={content}
            aria-label={t.aria}
          />
        </div>
      )}

      {showHelp && (
        <HelpPopup helpKey="gitignore" onClose={() => setShowHelp(false)} lang={lang} />
      )}
    </div>
  );
}

export default GitignoreGenerator;
