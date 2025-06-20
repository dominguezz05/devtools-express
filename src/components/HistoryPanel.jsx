import React from "react";
import { translations } from "../i18n";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

// CORRECCIÓN: 'lang' se recibe junto con las demás props en el primer argumento.
function HistoryPanel({
  history,
  onSelect,
  onClear,
  lang = "es",
  maxSnippetLength = 80,
}) {
// DESPUÉS (correcto)
const t = translations[lang]?.help?.HelpPanel || {};

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center mb-2">
        {/* CORRECCIÓN: Se accede a la propiedad con t.title */}
        <h3 className="text-md font-medium text-gray-700">{t.title}</h3>
        <button
          type="button"
          onClick={onClear}
          title={t.clearTitle} // CORRECCIÓN
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <TrashIcon />
          <span>{t.clearButton}</span> {/* CORRECCIÓN */}
        </button>
      </div>
      <div
        className="space-y-1 max-h-36 overflow-y-auto pr-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {history.map((item, index) => (
          <button
            key={`${index}-${item.substring(0, 10)}`}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full text-left p-2 rounded-md bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            title={t.useEntry} // CORRECCIÓN
          >
            <code className="text-xs text-gray-600 break-all whitespace-pre-wrap">
              {item.length > maxSnippetLength
                ? `${item.substring(0, maxSnippetLength)}...`
                : item}
            </code>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryPanel;