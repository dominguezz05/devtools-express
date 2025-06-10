import { useState, useEffect } from "react";
import { saveToHistory, getHistory, clearHistory } from "../utils/historyStorage";
import HistoryPanel from "./HistoryPanel";
import HelpPopup from "./HelpPopup";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import { translations } from "../i18n";

// --- Constantes de Estilo y Iconos (definidas fuera del componente) ---
const cardContainerClasses = "my-8 p-6 bg-white shadow-xl rounded-lg w-full max-w-2xl mx-auto";
const toolTitleClasses = "text-2xl font-semibold mb-1 text-gray-800";
const toolDescriptionClasses = "text-sm text-gray-600 mb-6";
const textareaClasses = "block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition duration-150 ease-in-out font-mono text-xs";
const primaryButtonClasses = (disabled) => `inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'}`;
const secondaryButtonClasses = () => "inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition";
const errorAlertClasses = "mt-3 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm";
const ConvertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18M16.5 3l4.5 4.5m0 0L16.5 12m4.5-4.5H3" /></svg>;
const CopyIconMini = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125V7.5m0 12.75v-7.5m0 0H3M9 7.5H6.375m0 0A2.25 2.25 0 0 1 8.625 3h6.75A2.25 2.25 0 0 1 17.625 5.25m0 2.25V11.25m0 0H21m-2.25 0H12.375M15 12H3.375" /></svg>;
const CheckIconMini = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;
const ClearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const DownloadIconMini = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const TOOL_NAME = "json-csv-converter";


function JsonCsvConverter({ lang = "es" }) {
  const t = translations[lang]?.help?.jsoncsv || {};

  const common = translations[lang].copy;


  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState('idle');
  const [history, setHistory] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setHistory(getHistory(TOOL_NAME));
    const dismissed = localStorage.getItem("help-dismissed-jsoncsv");
    if (!dismissed) setShowHelp(true);
  }, []);

  const updateAndSaveHistory = (newEntry) => {
    saveToHistory(TOOL_NAME, newEntry);
    setHistory(getHistory(TOOL_NAME));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error) setError("");
    if (output) setOutput("");
    setCopyStatus('idle');
  };

  const validateInput = () => {
    if (!input.trim()) {
      setError(t.errors.emptyInput);
      return false;
    }
    return true;
  };

const convertToCSV = () => {
  if (!validateInput()) return;
  try {
    let jsonData = JSON.parse(input);

    // 🧠 Detectar si hay una propiedad que sea un array de objetos (como "snippets")
    if (!Array.isArray(jsonData)) {
      const arrayCandidateKey = Object.keys(jsonData).find(
        key => Array.isArray(jsonData[key]) && typeof jsonData[key][0] === "object"
      );
      if (arrayCandidateKey) {
        jsonData = jsonData[arrayCandidateKey];
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        jsonData = [jsonData]; // Caso: objeto plano
      } else {
        throw new Error(t.errors.invalidJSON);
      }
    }

    if (jsonData.length === 0) return setOutput("");

    const headers = Object.keys(jsonData[0]);

    const rows = jsonData.map(obj =>
      headers.map(header => {
        let value = obj[header];
        if (Array.isArray(value)) {
          return `"${value.join(",")}"`;
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      }).join(",")
    );

    setOutput([headers.join(","), ...rows].join("\n"));
    setCopyStatus('idle');
    updateAndSaveHistory(input);
  } catch (err) {
    setOutput("");
    setError(`${t.errors.csvConversion}: ${err.message}`);
  }
};

  const convertToJSON = () => {
    if (!validateInput()) return;
    try {
      const lines = input.trim().split("\n");
      const headerLine = lines.shift();
      if (!headerLine) throw new Error(t.errors.noHeader);
      const csvRegex = /(?:^|,)(\"(?:[^"]+|\"\")*\"|[^,]*)/g;
      const parseCsvLine = (line) => {
        const values = [];
        let match;
        while ((match = csvRegex.exec(line))) {
          let value = match[1];
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
          }
          values.push(value);
        }
        return values;
      };
      const headers = parseCsvLine(headerLine);
      const result = lines.map(line => {
        if (!line.trim()) return null;
        const values = parseCsvLine(line);
        return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i] ?? ""]));
      }).filter(Boolean);
      setOutput(JSON.stringify(result, null, 2));
      setCopyStatus('idle');
      updateAndSaveHistory(input);
    } catch (err) {
      setOutput("");
      setError(`${t.errors.jsonConversion}: ${err.message}`);
    }
  };

  const handleClearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopyStatus('idle');
  };

  const handleClearHistory = () => {
    clearHistory(TOOL_NAME);
    setHistory([]);
  };

  const handleSelectHistory = (entry) => {
    setInput(entry);
    setOutput("");
    setError("");
    setCopyStatus('idle');
  };

  return (
    <div className="my-8 p-6 bg-white shadow-xl rounded-lg w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-semibold text-gray-800">{t.title}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">{t.subtitle}</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="json-csv-input" className="block text-sm font-medium text-gray-700 mb-1">{t.inputLabel}</label>
          <textarea
            id="json-csv-input"
            className={`block w-full h-40 resize-y rounded-md border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} shadow-sm py-2.5 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-xs`}
            placeholder={t.placeholder}
            value={input}
            onChange={handleInputChange}
            aria-invalid={!!error}
            aria-describedby={error ? "converter-error" : undefined}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={convertToCSV}
            className={`cursor-pointer inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md shadow-sm ${!input.trim() ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'bg-blue-600 hover:bg-blue-700 text-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={!input.trim()}
          >
            <span className="mr-2"><ConvertIcon /></span>{t.toCSV}
          </button>
          <button
            onClick={convertToJSON}
            className={`cursor-pointer inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md shadow-sm ${!input.trim() ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'bg-green-600 hover:bg-green-700 text-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            disabled={!input.trim()}
          >
            <span className="mr-2 "><ConvertIcon /></span>{t.toJSON}
          </button>
          {(input || output || error) && (
            <button
              onClick={handleClearAll}
              title={t.clear}
              className="p-2.5 text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm ml-auto sm:ml-4 cursor-pointer"
            >
              ❌
            </button>
          )}
        </div>

        {error && <div id="converter-error" className="mt-3 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">{error}</div>}

        {output && (
          <div>
            <div className="flex justify-between items-center mt-4 mb-1">
              <label htmlFor="json-csv-output" className="block text-sm font-medium text-gray-700">{t.outputLabel}</label>
              <div className="flex gap-2">
                <CopyButton content={output} buttonText={common.button} lang={lang} />
                <DownloadButton content={output} filename="converted.txt" lang={lang} />
              </div>
            </div>
            <textarea
              id="json-csv-output"
              className="block w-full h-40 resize-y rounded-md border border-gray-300 shadow-sm py-2.5 px-3 bg-slate-50 font-mono text-xs"
              readOnly
              value={output}
            />
          </div>
        )}

        <HistoryPanel history={history} onSelect={handleSelectHistory} onClear={handleClearHistory} lang={lang} />
      </div>

      {showHelp && <HelpPopup helpKey="jsoncsv" onClose={() => setShowHelp(false)} lang={lang} />}
    </div>
  );
}

export default JsonCsvConverter;