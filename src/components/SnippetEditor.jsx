import { useState, useEffect } from "react";
import { saveSnippet, getSnippets, deleteSnippet } from "../utils/snippetStorage";

function SnippetEditor() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    setSnippets(getSnippets());
  }, []);

  const handleSave = () => {
    if (!title || !code) return;
    saveSnippet({ title, code });
    setSnippets(getSnippets());
    setTitle("");
    setCode("");
  };

  const handleDelete = (title) => {
    deleteSnippet(title);
    setSnippets(getSnippets());
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Editor de Snippets</h2>
      <input
        className="w-full p-2 border rounded"
        placeholder="Título del snippet"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded h-40"
        placeholder="Escribe tu código aquí..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar Snippet
      </button>

      {snippets.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Snippets guardados</h3>
          <ul className="space-y-2">
            {snippets.map((snip) => (
              <li key={snip.title} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <strong>{snip.title}</strong>
                  <button onClick={() => handleDelete(snip.title)} className="text-red-500 hover:underline text-sm">
                    Eliminar
                  </button>
                </div>
                <pre className="bg-gray-100 p-2 mt-1 rounded text-sm whitespace-pre-wrap">{snip.code}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SnippetEditor;
