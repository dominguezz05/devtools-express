import { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // Instala uuid: npm install uuid

// --- Constantes de Estilo y Iconos (movidas fuera para optimizar) ---
const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 transition duration-150 ease-in-out";
const textareaClasses = `${inputClasses} font-mono text-xs resize-y`;
const primaryButtonClasses = (disabled) => `inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-700'}`;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;


function SnippetEditor({ snippets, setSnippets, settings }) {
  // Estado local solo para los campos del formulario
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript"); // Añadido para más contexto

  const handleSave = () => {
    if (!title.trim() || !code.trim()) return;

    const newSnippet = {
      id: uuidv4(), // Usar un ID único en lugar de title para evitar colisiones
      title,
      code,
      language,
      tags: [], // Puedes añadir un input para tags si quieres
      description: "" // Puedes añadir un input para descripción
    };

    // Actualiza el estado en App.jsx, que se encargará de guardar en localStorage
    setSnippets([newSnippet, ...snippets]);

    // Limpiar formulario
    setTitle("");
    setCode("");
  };

  const handleDelete = (id) => {
    // Actualiza el estado en App.jsx
    setSnippets(snippets.filter((s) => s.id !== id));
  };

  return (
    <div className="my-8 p-6 bg-white shadow-xl rounded-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-1 text-gray-800">Editor de Snippets</h2>
      <p className="text-sm text-gray-600 mb-6">Crea y gestiona tus fragmentos de código reutilizables. Se guardarán localmente.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna del formulario */}
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Nuevo Snippet</h3>
          <div>
            <label htmlFor="snippet-title" className="block text-sm font-medium text-gray-700">Título</label>
            <input id="snippet-title" className={inputClasses} placeholder="Ej: Función Debounce en JS" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="snippet-lang" className="block text-sm font-medium text-gray-700">Lenguaje</label>
            <select id="snippet-lang" className={inputClasses} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          <div>
            <label htmlFor="snippet-code" className="block text-sm font-medium text-gray-700">Código</label>
            <textarea id="snippet-code" className={`${textareaClasses} h-48`} placeholder="Escribe tu código aquí..." value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <button onClick={handleSave} className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white">
            Guardar Snippet
          </button>
        </div>

        {/* Columna de la lista de snippets */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Snippets Guardados ({snippets.length})</h3>
          {snippets.length > 0 ? (
            <div className="max-h-[450px] overflow-y-auto space-y-3 pr-2" style={{ scrollbarWidth: 'thin' }}>
              {snippets.map((snip) => (
                <div key={snip.id} className="border p-3 rounded-lg bg-slate-50">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-gray-800">{snip.title}</strong>
                    <button onClick={() => handleDelete(snip.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full" title="Eliminar snippet">
                      <TrashIcon />
                    </button>
                  </div>
                  {/* Aquí podrías usar un editor de código como CodeMirror o Monaco para el highlighting */}
                  <pre className="bg-gray-800 text-white p-3 mt-1 rounded text-xs whitespace-pre-wrap overflow-x-auto">
                    <code>{snip.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic mt-4">Aún no has guardado ningún snippet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SnippetEditor;