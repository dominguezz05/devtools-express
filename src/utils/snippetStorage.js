const STORAGE_KEY = "devtools_snippets";

export function saveSnippet(snippet) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = [
    ...existing.filter((s) => s.title !== snippet.title),
    snippet,
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSnippets() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function deleteSnippet(title) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = existing.filter((s) => s.title !== title);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
