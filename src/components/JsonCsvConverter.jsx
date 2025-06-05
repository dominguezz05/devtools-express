import { useState } from "react";

// Iconos y clases definidos arriba o importados

function JsonCsvConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState('idle'); // idle, copied, error
  const cardContainerClasses = "bg-white p-6 md:p-8 rounded-xl shadow-md sm:shadow-lg space-y-6";
  const toolTitleClasses = "text-2xl font-semibold text-gray-800";
  const toolDescriptionClasses = "text-gray-600 text-sm md:text-base";
  const textareaClasses = "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none";
  const primaryButtonClasses = (disabled) => `inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'}`;
  const secondaryButtonClasses = () => "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200";
  const errorAlertClasses = "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-sm mb-4";
  const ConvertIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m16 0l-4-4m0 8l4-4m-8 0l-4 4m0-8l4 4" /></svg>;
  const CopyIconMini = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2m-4-8h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4m4-4h4a2 2 0 012 2v4m-6-6V6m0-4h4a2 2 0 012 2v4m-6-6H8a2 2 0 00-2 2v4m10-10H8a2 2 0 00-2 2v4" /></svg>;
  const CheckIconMini = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

  const ClearIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error) setError(""); // Limpiar error al escribir
    if (output) setOutput(""); // Limpiar output al cambiar input
    setCopyStatus('idle');
  };

  const convertToCSV = () => {
    if (!input.trim()) {
      setError("❌ El campo de entrada está vacío.");
      return;
    }
    try {
      let jsonData = JSON.parse(input);
      if (!Array.isArray(jsonData)) {
        // Si no es un array, intentar tratarlo como un solo objeto en un array
        if (typeof jsonData === 'object' && jsonData !== null) {
          jsonData = [jsonData];
        } else {
          throw new Error("La entrada debe ser un array de objetos JSON o un único objeto JSON.");
        }
      }
      if (jsonData.length === 0) {
        setOutput(""); // CSV vacío para array JSON vacío
        setError("");
        return;
      }
      const headers = Object.keys(jsonData[0]);
      const rows = jsonData.map(obj => 
        headers.map(header => {
          const value = obj[header];
          // Manejar comas y comillas en los valores
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`; // Escapar comillas dobles y envolver
          }
          return value;
        }).join(",")
      );
      setOutput([headers.join(","), ...rows].join("\n"));
      setError("");
      setCopyStatus('idle');
    } catch (err) {
      setOutput("");
      setError("❌ Error al convertir a CSV: " + err.message);
    }
  };

  const convertToJSON = () => {
    if (!input.trim()) {
      setError("❌ El campo de entrada está vacío.");
      return;
    }
    try {
      const lines = input.trim().split("\n");
      if (lines.length === 0) {
        setOutput("[]"); // JSON vacío para CSV vacío
        setError("");
        return;
      }
      const headerLine = lines.shift(); // Tomar la primera línea como cabecera
      if (!headerLine) throw new Error("El CSV no tiene línea de cabecera.");

      // Expresión regular para parsear campos CSV, manejando comillas
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
        const values = parseCsvLine(line);
        if (values.length !== headers.length && line.trim() !== "") {
            // Podría ser una línea vacía al final, ignorarla si es el caso
            console.warn(`Número de valores (${values.length}) no coincide con cabeceras (${headers.length}) en línea: ${line}`);
        }
        return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i] !== undefined ? values[i] : ""]));
      });
      setOutput(JSON.stringify(result, null, 2));
      setError("");
      setCopyStatus('idle');
    } catch (err) {
      setOutput("");
      setError("❌ Error al convertir a JSON: " + err.message);
    }
  };

  const handleClearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopyStatus('idle');
  };

  const handleCopyOutput = () => {
    copyToClipboard(output, 
      () => setCopyStatus('copied'), 
      () => setCopyStatus('error')
    );
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleDownloadOutput = () => {
    if (!output) return;
    // Determinar tipo de archivo y extensión basado en el primer carácter del output
    const isJson = output.trim().startsWith('{') || output.trim().startsWith('[');
    const MimeType = isJson ? "application/json" : "text/csv";
    const filename = isJson ? "converted.json" : "converted.csv";

    const blob = new Blob([output], { type: `${MimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cardContainerClasses}>
      <h2 className={toolTitleClasses}>Convertidor JSON ↔ CSV</h2>
      <p className={toolDescriptionClasses}>
        Pega tu contenido JSON o CSV en el área de entrada y elige la dirección de la conversión.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="json-csv-input" className="block text-sm font-medium text-gray-700 mb-1">Entrada:</label>
      <textarea
  id="json-csv-input"
  className={`${textareaClasses} h-40`}
  placeholder={`Pega aquí JSON o CSV. Ejemplos:\n\nJSON:\n[\n  { "id": 1, "valor": "abc" }\n]\n\nCSV:\nid,valor\n1,abc`}
  value={input}
  onChange={handleInputChange}
  aria-describedby={error ? "converter-error" : undefined}
/>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button type="button" onClick={convertToCSV} className={`${primaryButtonClasses(!input.trim())} w-full sm:w-auto`} disabled={!input.trim()}>
            <ConvertIcon /> <span className="ml-2">JSON → CSV</span>
          </button>
          <button type="button" onClick={convertToJSON} className={`${primaryButtonClasses(!input.trim()).replace('bg-blue-600 hover:bg-blue-700 focus:ring-blue-500','bg-green-600 hover:bg-green-700 focus:ring-green-500')} w-full sm:w-auto`} disabled={!input.trim()}>
            <ConvertIcon /> <span className="ml-2">CSV → JSON</span>
          </button>
          {(input || output || error) && (
            <button type="button" onClick={handleClearAll} title="Limpiar todo" className="p-2.5 text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm ml-auto sm:ml-4">
              <ClearIcon />
            </button>
          )}
        </div>

        {error && <div id="converter-error" className={errorAlertClasses} role="alert">{error}</div>}
        
        {output && (
          <div>
            <div className="flex justify-between items-center mt-4 mb-1">
              <label htmlFor="json-csv-output" className="block text-sm font-medium text-gray-700">Salida:</label>
              <div className="flex gap-2">
                <button onClick={handleCopyOutput} className={`${secondaryButtonClasses()} min-w-[90px]`}>
                  {copyStatus === 'copied' ? <CheckIconMini/> : <CopyIconMini/> }
                  <span className="ml-1.5">{copyStatus === 'copied' ? 'Copiado' : copyStatus === 'error' ? 'Error' : 'Copiar'}</span>
                </button>
                <button onClick={handleDownloadOutput} className={secondaryButtonClasses()}>
                  <DownloadIconMini /> <span className="ml-1.5">Descargar</span>
                </button>
              </div>
            </div>
            <textarea
              id="json-csv-output"
              className={`${textareaClasses} h-40 bg-slate-50`}
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default JsonCsvConverter;