// src/utils/snippetStorage.js

const STORAGE_KEY = "devtools_snippets";

/**
 * Guarda el array COMPLETO de snippets en localStorage.
 * Esta función simplemente sobrescribe lo que hay con el nuevo array.
 * @param {Array} snippets - El array de objetos de snippets a guardar.
 */
export function saveSnippets(snippets) {
  if (!Array.isArray(snippets)) {
    console.error("La función saveSnippets esperaba recibir un array.");
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  } catch (error) {
    console.error("Error al guardar los snippets en localStorage:", error);
  }
}

/**
 * Obtiene el array de snippets desde localStorage.
 * @returns {Array} El array de snippets o un array vacío si no existe o hay un error.
 */
export function getSnippets() {
  try {
    const snippets = localStorage.getItem(STORAGE_KEY);
    return snippets ? JSON.parse(snippets) : [];
  } catch (error) {
    console.error("Error al obtener los snippets desde localStorage:", error);
    return [];
  }
}

/**
 * Elimina un snippet del localStorage basado en su ID único.
 * NOTA: Con la lógica actual en App.jsx, esta función no se usa directamente,
 * ya que la eliminación se maneja en el estado de React y `useEffect` se encarga de guardar.
 * Sin embargo, es una buena práctica tenerla para una gestión completa.
 * @param {string} snippetId - El ID del snippet a eliminar.
 */
export function deleteSnippet(snippetId) {
  try {
    const existing = getSnippets();
    const updated = existing.filter((s) => s.id !== snippetId);
    saveSnippets(updated); // Reutilizamos saveSnippets para guardar el array actualizado
  } catch (error) {
    console.error("Error al eliminar el snippet:", error);
  }
}
