import { useState, useEffect } from "react";

// Imports para la funcionalidad del historial
import { saveToHistory, getHistory, clearHistory } from "../utils/historyStorage";
import HistoryPanel from "./HistoryPanel";
import HelpPopup from "./HelpPopup";

function GitCommandHelper() {
  // --- Tu código de constantes y componentes internos ---
  const [showHelp, setShowHelp] = useState(false); // Modificado para que no aparezca por defecto
  const toolTitleClasses = "text-2xl font-semibold text-gray-800";
  const toolDescriptionClasses = "text-gray-600 text-sm md:text-base";
  const cardContainerClasses = "my-8 bg-white p-6 md:p-8 rounded-xl shadow-md sm:shadow-lg space-y-6";
  const primaryButtonClasses = (disabled) => `inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'}`;
  const secondaryButtonClasses = (disabled) => `inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500";
  const GitIcon = ({ className = "w-6 h-6 text-blue-600" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-3 3m0 0l-3 3m3-3l3 3m-3-3l-3-3m9.75-3h-15a.75.75 0 00-.75.75v12.75c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75z" /></svg> );
  const ClearIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
  const CopyIconMini = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2m-4-8h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4m4-4h4a2 2 0 012 2v4m-6-6V6m0-4h4a2 2 0 012 2v4m-6-6H8a2 2 0 00-2 2v4m10-10H8a2 2 0 00-2 2v4" /></svg>;
  const CheckIconMini = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

  const copyToClipboard = async (text, onSuccess, onError) => {
    try { await navigator.clipboard.writeText(text); onSuccess(); }
    catch (err) { console.error("Error al copiar:", err); onError(); }
  };
  
  const InlineCopyButton = ({ textToCopy }) => {
    const [status, setStatus] = useState('idle');
    const handleCopy = () => {
      copyToClipboard(textToCopy, () => setStatus('copied'), () => setStatus('error'));
      setTimeout(() => setStatus('idle'), 1500);
    };
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`${secondaryButtonClasses(status === 'copied').replace('text-xs','text-[11px] leading-4').replace('px-3 py-1.5','px-2 py-1')} min-w-[70px] cursor-pointer`}
        disabled={status === 'copied'}
      >
        {status === 'copied' ? <CheckIconMini className="w-3.5 h-3.5"/> : <CopyIconMini className="w-3.5 h-3.5"/>}
        <span className="ml-1">{status === 'copied' ? 'Copiado' : 'Copiar'}</span>
      </button>
    );
  };

  const initialCommands = [
    { id: 'init', cmd: "git init", desc: "Inicializa un nuevo repositorio Git." },
    { id: 'add', cmd: "git add .", desc: "Añade todos los cambios al área de staging." },
    { id: 'commit', cmd: 'git commit -m "Tu mensaje descriptivo"', desc: "Guarda los cambios en el repositorio." },
    { id: 'status', cmd: "git status", desc: "Muestra el estado de los cambios." },
    { id: 'push', cmd: "git push origin main", desc: "Sube los commits locales al repositorio remoto." },
    { id: 'pull', cmd: "git pull origin main", desc: "Trae y fusiona cambios del repositorio remoto." },
    { id: 'log', cmd: "git log --oneline --graph --decorate", desc: "Muestra el historial de commits de forma concisa." },
  ];
  
  const [customCommand, setCustomCommand] = useState("");
  const [commands] = useState(initialCommands);
  const [customCopyStatus, setCustomCopyStatus] = useState('idle');
  const [history, setHistory] = useState([]);
  const TOOL_NAME = "git-command-helper";
  
  // --- NUEVO: Estado para el error de validación del input ---
  const [error, setError] = useState(null);

  useEffect(() => {
    setHistory(getHistory(TOOL_NAME));
  }, []);

  const handleClearHistory = () => {
    clearHistory(TOOL_NAME);
    setHistory([]);
  };

  const handleSelectHistory = (historyEntry) => {
    setCustomCommand(historyEntry);
    if (error) setError(null); // Limpiar error al seleccionar del historial
  };

  const handleCustomCopy = () => {
    // --- VALIDACIÓN AÑADIDA ---
    if (!customCommand.trim()) {
        setError("El comando personalizado no puede estar vacío.");
        return;
    }
    setError(null); // Limpiar error si la validación pasa

    copyToClipboard(customCommand,
      () => {
        setCustomCopyStatus('copied');
        saveToHistory(TOOL_NAME, customCommand);
        setHistory(getHistory(TOOL_NAME));
      },
      () => setCustomCopyStatus('error')
    );
    setTimeout(() => setCustomCopyStatus('idle'), 2000);
  };
  
  const handleClearCustom = () => {
    setCustomCommand("");
    setCustomCopyStatus('idle');
    if (error) setError(null); // Limpiar error al borrar
  };
useEffect(() => {
  const dismissed = localStorage.getItem("help-dismissed-githelper");
  if (!dismissed) {
    setShowHelp(true);
  }
}, []);
  return (
    <div className={cardContainerClasses}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
            <GitIcon />
            <h2 className={`${toolTitleClasses} ml-2`}>Ayudante de Comandos Git</h2>
        </div>
        
      </div>
      <p className={toolDescriptionClasses}>
        Copia rápidamente comandos comunes de Git o prueba y guarda los tuyos.
      </p>

      <h3 className="text-lg font-medium text-gray-700 mb-3">Comandos Comunes:</h3>
      <ul className="space-y-3">
        {commands.map(({ id, cmd, desc }) => (
          <li key={id} className="p-3 border border-gray-200 rounded-lg bg-slate-50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center">
              <code className="text-sm text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{cmd}</code>
              <InlineCopyButton textToCopy={cmd} />
            </div>
            {desc && <p className="mt-1.5 text-xs text-gray-500">{desc}</p>}
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <label htmlFor="custom-git-command" className="block text-sm font-medium text-gray-700 mb-1">
            Comando Personalizado:
        </label>
        <div className="flex items-center gap-2 mb-2">
            <input
                id="custom-git-command"
                type="text"
                // --- ESTILO CONDICIONAL AÑADIDO ---
                className={`${inputClasses} ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                placeholder="Escribe tu comando Git aquí (ej. git checkout -b nueva-rama)"
                value={customCommand}
                onChange={(e) => {
                    setCustomCommand(e.target.value);
                    if (customCopyStatus !== 'idle') setCustomCopyStatus('idle');
                    if (error) setError(null); // Limpiar error al escribir
                }}
                aria-invalid={!!error}
                aria-describedby={error ? "git-command-error" : undefined}
            />
            {customCommand && (
                <button type="button" onClick={handleClearCustom} title="Limpiar comando personalizado" className="p-2.5 text-gray-400 hover:text-red-600 rounded-md cursor-pointer">
                    <ClearIcon/>
                </button>
            )}
        </div>
        {/* --- MENSAJE DE ERROR AÑADIDO --- */}
        {error && <p id="git-command-error" className="text-xs text-red-600 mb-2">{error}</p>}
        
        <button
          type="button"
          onClick={handleCustomCopy}
          className={`${primaryButtonClasses(!customCommand.trim() || customCopyStatus !== 'idle').replace('bg-blue-600 hover:bg-blue-700 focus:ring-blue-500','bg-green-600 hover:bg-green-700 focus:ring-green-500')} w-full sm:w-auto cursor-pointer`}
          disabled={!customCommand.trim() || customCopyStatus !== 'idle'}
        >
          {customCopyStatus === 'copied' ? <CheckIconMini className="w-4 h-4"/> : <CopyIconMini className="w-4 h-4" /> }
          <span className="ml-2">
            {customCopyStatus === 'copied' ? '¡Comando Copiado!' : customCopyStatus === 'error' ? 'Error al Copiar' : 'Copiar y Guardar'}
          </span>
        </button>
        
        <HistoryPanel
          history={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
        />
      </div>
      {showHelp && (
        <HelpPopup helpKey="githelper" onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
export default GitCommandHelper;