import { useState, useEffect } from "react";

// Herramientas y utilidades (asegúrate que las rutas sean correctas)
import READMEForm from "./components/READMEForm";
import MarkdownPreview from "./components/MarkdownPreview";
import CopyButton from "./components/CopyButton";
import DownloadButton from "./components/DownloadButton";
import GitignoreGenerator from "./components/GitignoreGenerator";
import JsonCsvConverter from "./components/JsonCsvConverter";
import CodeMinifier from "./components/CodeMinifier";
import GitCommandHelper from "./components/GitCommandHelper";
import SnippetEditor from "./components/SnippetEditor";
import { generateReadme } from "./utils/generateReadme";
import { saveSnippets, getSnippets } from "./utils/snippetStorage";
import HelpPanel from './components/HelpPanel'; 

// --- Iconos para la UI y Tarjetas de Herramientas ---
const ReadmeIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
);
const GitignoreIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636M15.75 5.25V3m0 2.25h-1.5m1.5 0-1.125-1.125M15.75 5.25L14.625 4.125M9 20.25h6M10.5 16.5h3M12 12.75h.008v.008H12v-.008Z" /></svg>
);
const JsonCsvIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18M16.5 3l4.5 4.5m0 0L16.5 12m4.5-4.5H3" /></svg>
);
const CodeMinIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5H5.25A2.25 2.25 0 003 9.75v4.5A2.25 2.25 0 005.25 16.5h13.5A2.25 2.25 0 0021 14.25v-4.5A2.25 2.25 0 0018.75 7.5H17.25m-5.25 0V4.875c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125v2.625m5.25 0H9.375" /></svg>
);
const GitCmdIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25M10.5 6v12m3-12v12m3-12v12M3.75 6.75h16.5M3.75 17.25h16.5" /></svg>
);
const SnippetEditorIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
);
const PreviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const ExportIcon = ({className="w-5 h-5"}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75Z" /></svg>);
const ImportIcon = ({className="w-5 h-5"}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75Z" /></svg>);
// --- Fin Iconos ---

// --- Componente ToolCard ---
const ToolCard = ({ title, description, icon, onClick }) => (
  <button onClick={onClick} type="button" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out text-left w-full flex flex-col items-center md:items-start transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center md:text-left">{title}</h3>
    <p className="text-slate-600 text-sm text-center md:text-left">{description}</p>
  </button>
);
// --- Fin Componente ToolCard ---

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [readmeContent, setReadmeContent] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  
  // --- ESTADO INICIALIZADO CORRECTAMENTE DESDE LOCALSTORAGE ---
  const [snippets, setSnippets] = useState(() => getSnippets());
  const [settings, setSettings] = useState(() => {
    try {
      const storedSettings = localStorage.getItem('devtools-settings');
      return storedSettings ? JSON.parse(storedSettings) : { theme: 'dark', fontSize: 14 };
    } catch {
      // Si hay un error al parsear, devolvemos el valor por defecto
      return { theme: 'dark', fontSize: 14 };
    }
  });
  const [notification, setNotification] = useState({ message: '', type: null });

  // --- EFECTOS DE GUARDADO AUTOMÁTICO ---
  // Este useEffect se activa SOLO cuando el estado 'snippets' cambia
  useEffect(() => {
    saveSnippets(snippets);
  }, [snippets]);
  
  // Este useEffect se activa SOLO cuando el estado 'settings' cambia
  useEffect(() => {
    localStorage.setItem('devtools-settings', JSON.stringify(settings));
  }, [settings]);
  // --- FIN DE LA LÓGICA DE PERSISTENCIA ---


  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: null });
    }, duration);
  };
  
  const exportConfig = () => {
    const data = { snippets, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devtools-express_config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("✅ Configuración exportada correctamente.", "success");
  };

  const importConfig = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') throw new Error("No se pudo leer el archivo.");
        const parsed = JSON.parse(result);
        if (parsed.snippets && Array.isArray(parsed.snippets)) {
            setSnippets(parsed.snippets);
        }
        if (parsed.settings && typeof parsed.settings === 'object') {
            setSettings(prevSettings => ({ ...prevSettings, ...parsed.settings }));
        }
        showNotification("✅ Configuración importada correctamente.", "success");
      } catch (err) {
        showNotification(`❌ Error al leer el archivo: ${err.message}`, "error");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const handleReadmeGenerate = (formData) => {
    const result = generateReadme(formData);
    setReadmeContent(result);
    setProjectTitle(formData.title || "README");
  };

  const handleSelectTool = (toolName) => {
    setActiveTool(toolName);
    if (toolName !== 'readme') {
      setReadmeContent("");
      setProjectTitle("");
    }
  };

  const handleGoToToolbox = () => {
    setActiveTool(null);
    setReadmeContent("");
    setProjectTitle("");
  };

  const generatedReadmeFilename = projectTitle ? `${projectTitle.replace(/\s+/g, '_')}-README.md` : 'README.md';

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'readme':
        return (
          <div className="flex flex-col lg:flex-row gap-8 transition-opacity duration-500 ease-in-out">
            <div className="lg:w-1/2 bg-white p-6 md:p-8 rounded-xl shadow-2xl"><h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">1. Completa la Información del README</h2><READMEForm onGenerate={handleReadmeGenerate} /></div>
            <div className="lg:w-1/2"><div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl h-full min-h-[500px] flex flex-col"><div className="flex justify-between items-center mb-4 border-b pb-3"><h2 className="text-2xl font-semibold text-blue-700">2. Vista Previa del README</h2>{readmeContent && (<div className="flex items-center gap-3"><CopyButton content={readmeContent} /><DownloadButton content={readmeContent} filename={generatedReadmeFilename} /></div>)}</div>{readmeContent ? (<div className="prose prose-sm sm:prose-base max-w-none flex-grow overflow-y-auto p-3 border border-slate-200 rounded-md bg-slate-50" style={{scrollbarWidth: 'thin'}}><MarkdownPreview content={readmeContent} /></div>) : (<div className="flex-grow flex flex-col justify-center items-center text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-lg p-8"><PreviewIcon /><p className="text-lg font-medium">La vista previa de tu README aparecerá aquí.</p><p className="text-sm mt-2">Completa el formulario de la izquierda.</p></div>)}</div></div>
          </div>
        );
      case 'gitignore': return <GitignoreGenerator />;
      case 'jsoncsv': return <JsonCsvConverter />;
      case 'minifier': return <CodeMinifier />;
      case 'githelper': return <GitCommandHelper />;
      case 'snippeteditor': return <SnippetEditor snippets={snippets} setSnippets={setSnippets} settings={settings} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight cursor-pointer hover:opacity-90 transition-opacity" onClick={handleGoToToolbox}>DevTools Express</h1>
          {activeTool && (<button onClick={handleGoToToolbox} type="button" className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm rounded-md shadow-md transition-colors duration-300">&larr; <span className="hidden sm:inline">Volver al Toolbox</span><span className="sm:hidden">Toolbox</span></button>)}
        </div>
      </header>

      {notification.message && (<div className={`fixed top-24 right-5 z-50 p-4 rounded-md shadow-lg text-white transition-all duration-300 transform ${notification.message ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} role="alert">{notification.message}</div>)}

      <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
        {!activeTool ? (
          <>
            <div className="text-center mb-10 sm:mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-3">Tu Caja de Herramientas para Desarrolladores</h2><p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">Selecciona una herramienta para empezar a optimizar tu flujo de trabajo.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <ToolCard title="Generador de README.md" description="Crea archivos README profesionales y bien estructurados." icon={<ReadmeIcon />} onClick={() => handleSelectTool('readme')}/>
              <ToolCard title="Generador de .gitignore" description="Genera archivos .gitignore optimizados para tu proyecto." icon={<GitignoreIcon />} onClick={() => handleSelectTool('gitignore')}/>
              <ToolCard title="Convertidor JSON ↔ CSV" description="Transforma datos entre formatos JSON y CSV." icon={<JsonCsvIcon />} onClick={() => handleSelectTool('jsoncsv')}/>
              <ToolCard title="Minificador de Código" description="Reduce el tamaño de tu HTML, CSS y JavaScript." icon={<CodeMinIcon />} onClick={() => handleSelectTool('minifier')}/>
              <ToolCard title="Ayudante Comandos Git" description="Accede y copia rápidamente los comandos Git más comunes." icon={<GitCmdIcon />} onClick={() => handleSelectTool('githelper')}/>
              <ToolCard title="Editor de Snippets" description="Crea, guarda y gestiona tus fragmentos de código reutilizables." icon={<SnippetEditorIcon />} onClick={() => handleSelectTool('snippeteditor')}/>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200 text-center">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Gestión de Configuración Global</h3>
              <p className="text-sm text-slate-500 max-w-xl mx-auto mb-6">Guarda o carga la configuración de tus herramientas, incluyendo los snippets y ajustes del editor.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={exportConfig} className="inline-flex items-center justify-center gap-2 bg-slate-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"><ExportIcon />Exportar Configuración</button>
                <label className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-500 transition-all"><ImportIcon />Importar Configuración<input type="file" accept=".json,application/json" onChange={importConfig} className="hidden" /></label>
              </div>
            </div>
          </>
        ) : (
          renderActiveTool()
        )}
      </main>

  <footer className="bg-slate-800 text-slate-300 p-4">
    <div className="container mx-auto flex justify-between items-center">
      <p>&copy; {new Date().getFullYear()} DevTools Express.</p>
      <HelpPanel /> {/* Colocado aquí */}
    </div>
  </footer>
    </div>
  );
}

export default App;