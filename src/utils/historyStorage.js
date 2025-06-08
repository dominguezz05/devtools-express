const STORAGE_KEY_PREFIX = "devtools-express-history-";

/**
 * Guarda una nueva entrada en el historial de una herramienta.
 * Mantiene un máximo de 10 entradas únicas.
 * @param {string} toolName
 * @param {string} entry
 */
export function saveToHistory(toolName, entry) {
  if (!entry || !entry.trim()) return;
  const key = STORAGE_KEY_PREFIX + toolName;
  try {
    const existing = JSON.parse(localStorage.getItem(key)) || [];

    const updated = [entry, ...existing.filter((e) => e !== entry)].slice(
      0,
      10
    );
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save to history:", error);
  }
}

/**
 * Obtiene el historial de una herramienta.
 * @param {string} toolName - El nombre de la herramienta.
 * @returns {string[]} El array del historial o un array vacío.
 */
export function getHistory(toolName) {
  const key = STORAGE_KEY_PREFIX + toolName;
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    console.error("Failed to get history:", error);
    return [];
  }
}

/**
 * Limpia el historial de una herramienta.
 * @param {string} toolName
 */
export function clearHistory(toolName) {
  const key = STORAGE_KEY_PREFIX + toolName;
  localStorage.removeItem(key);
}
