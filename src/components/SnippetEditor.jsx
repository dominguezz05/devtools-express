import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import HelpPopup from "./HelpPopup";

// --- Iconos ---
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const ExportIcon = ({className="w-5 h-5"}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75Z" /></svg>);
const ImportIcon = ({className="w-5 h-5"}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75Z" /></svg>);

// --- Constantes de Estilo ---
const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition duration-150 ease-in-out";
const textareaClasses = `${inputClasses} font-mono text-xs resize-y`;
const primaryButtonClasses = (disabled) => `flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${!disabled ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white' : 'bg-gray-400 cursor-not-allowed'}`;

// --- Lista de Lenguajes ---
const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX / TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'php', label: 'PHP' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'dockerfile', label: 'Dockerfile' },
];

function SnippetEditor({ snippets, setSnippets, settings, showNotification }) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [showHelp, setShowHelp] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
const [languageFilter, setLanguageFilter] = useState("");



  const resetForm = () => {
    setTitle("");
    setCode("");
    setLanguage("javascript");
    setEditingId(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "El título no puede estar vacío.";
    }
    if (snippets.some(s => s.title.toLowerCase() === title.trim().toLowerCase() && s.id !== editingId)) {
      newErrors.title = "Ya existe un snippet con este título.";
    }
    if (!code.trim()) {
      newErrors.code = "El código no puede estar vacío.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingId) {
      const updatedSnippets = snippets.map(s =>
        s.id === editingId ? { ...s, title: title.trim(), code, language } : s
      );
      setSnippets(updatedSnippets);
    } else {
      const newSnippet = {
        id: uuidv4(),
        title: title.trim(),
        code,
        language,
        tags: [],
        description: "",
      };
      setSnippets([newSnippet, ...snippets]);
    }
    resetForm();
  };

  const handleEdit = (snippet) => {
    setEditingId(snippet.id);
    setTitle(snippet.title);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setErrors({});
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

const confirmDelete = (id) => {
  setConfirmDeleteId(id);
};

const performDelete = () => {
  setSnippets(snippets.filter((s) => s.id !== confirmDeleteId));
  if (confirmDeleteId === editingId) resetForm();
  setConfirmDeleteId(null);
};


  // --- LÓGICA DE IMPORT/EXPORT ---
  const exportSnippets = () => {
    if (snippets.length === 0) {
      showNotification("❌ No hay snippets para exportar.", "error");
      return;
    }
    const dataToExport = { snippets, settings };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devtools-snippets.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("✅ Snippets exportados correctamente.", "success");
  };

  const importSnippets = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') throw new Error("No se pudo leer el archivo.");
        const parsed = JSON.parse(result);
        
        if (parsed.snippets && Array.isArray(parsed.snippets)) {
          const incomingSnippets = parsed.snippets;
          const existingIds = new Set(snippets.map(s => s.id));
          const uniqueNewSnippets = incomingSnippets.filter(incoming => incoming.id && !existingIds.has(incoming.id));
          
          if (uniqueNewSnippets.length > 0) {
            setSnippets(prevSnippets => [...prevSnippets, ...uniqueNewSnippets]);
            showNotification(`✅ ${uniqueNewSnippets.length} snippets nuevos importados.`, "success");
          } else {
            showNotification("ℹ️ No se encontraron snippets nuevos para importar.", "info");
          }
        } else {
            throw new Error("El archivo no contiene un formato de snippets válido.");
        }
      } catch (err) {
        showNotification(`❌ Error al importar: ${err.message}`, "error");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  useEffect(() => {
  const dismissed = localStorage.getItem("help-dismissed-snippeteditor");
  if (!dismissed) {
    setShowHelp(true);
  }
}, []);

  return (
    <div className="my-8 p-6 bg-white shadow-xl rounded-lg w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-semibold text-gray-800">Editor de Snippets</h2>
     
      </div>
      <p className="text-sm text-gray-600 mb-6">Crea, edita y gestiona tus fragmentos de código reutilizables. Se guardarán localmente.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div ref={formRef} className="space-y-4 p-4 border border-gray-200 rounded-lg self-start sticky top-24">
          <h3 className="text-lg font-medium text-gray-900">{editingId ? "Editando Snippet" : "Nuevo Snippet"}</h3>
          <div>
            <label htmlFor="snippet-title" className="block text-sm font-medium text-gray-700">Título</label>
            <input id="snippet-title" className={`${inputClasses} ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`} placeholder="Ej: Función Debounce en JS" value={title} onChange={(e) => setTitle(e.target.value)} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="snippet-lang" className="block text-sm font-medium text-gray-700">Lenguaje</label>
            <select id="snippet-lang" className={inputClasses} value={language} onChange={(e) => setLanguage(e.target.value)}>
              {supportedLanguages.map(lang => (<option key={lang.value} value={lang.value}>{lang.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="snippet-code" className="block text-sm font-medium text-gray-700">Código</label>
            <textarea id="snippet-code" className={`${textareaClasses} h-48 ${errors.code ? 'border-red-500 ring-1 ring-red-500' : ''}`} placeholder="Escribe tu código aquí..." value={code} onChange={(e) => setCode(e.target.value)} />
            {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className={primaryButtonClasses(false)}>
              {editingId ? "Actualizar Snippet" : "Guardar Snippet"}
            </button>
            {editingId && (
              <button onClick={resetForm} className="cursor-pointer flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancelar Edición
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Snippets Guardados ({snippets.length})</h3>
          {snippets.length > 0 ? (
            <div className="max-h-[calc(80vh-150px)] overflow-y-auto space-y-3 pr-2" style={{ scrollbarWidth: 'thin' }}>
              {snippets
  .filter((s) =>
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!languageFilter || s.language === languageFilter)
  )
  .map((snip) => (

                <div key={snip.id} className={`p-3 rounded-lg bg-slate-50 transition-shadow ${editingId === snip.id ? 'shadow-lg ring-2 ring-blue-500' : 'border shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-gray-800 break-all">{snip.title}</strong>
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      <button onClick={() => handleEdit(snip)} className="p-1 text-blue-600 hover:bg-blue-100 rounded-full cursor-pointer " title="Editar snippet"><EditIcon /></button>
                      <button onClick={() => confirmDelete(snip.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full cursor-pointer" title="Eliminar snippet"> <TrashIcon /></button>

                    </div>
                  </div>
                  <pre className="bg-gray-800 text-white p-3 mt-1 rounded text-xs whitespace-pre-wrap overflow-x-auto"><code className={`language-${snip.language}`}>{snip.code}</code></pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm text-gray-500">Aún no has guardado ningún snippet.</p>
              <p className="text-xs text-gray-400 mt-2">Usa el formulario para crear tu primero.</p>
            </div>
          )}
    {confirmDeleteId && (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md w-[90vw] sm:w-full p-5">
      <h4 className="text-base font-semibold text-gray-800 mb-1">¿Eliminar snippet?</h4>
      <p className="text-sm text-gray-600 mb-4">Esta acción no se puede deshacer. ¿Deseas continuar?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setConfirmDeleteId(null)}
          className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={performDelete}
          className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
)}


          {/* --- SECCIÓN DE IMPORT/EXPORT  --- */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-3">Gestión de Snippets</h3>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
  <input
    type="text"
    placeholder="🔍 Buscar por título o código..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
  />
  <select
    value={languageFilter}
    onChange={(e) => setLanguageFilter(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
  >
    <option value="">Todos los lenguajes</option>
    {supportedLanguages.map((lang) => (
      <option key={lang.value} value={lang.value}>{lang.label}</option>
    ))}
  </select>
</div>

            <p className="text-xs text-slate-500 mb-4">Guarda todos tus snippets en un archivo, o carga snippets desde un archivo de configuración.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={exportSnippets} className="inline-flex items-center justify-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-slate-800 transition-colors w-full sm:w-auto text-sm cursor-pointer">
                <ExportIcon />
                Exportar Snippets
              </button>
              <label className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 transition-colors w-full sm:w-auto text-sm cursor-pointer">
                <ImportIcon />
                Importar Snippets
                <input type="file" accept=".json,application/json" onChange={importSnippets} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
      {showHelp && ( <HelpPopup helpKey="snippeteditor" onClose={() => setShowHelp(false)} /> )}
    </div>
  );
}

export default SnippetEditor;