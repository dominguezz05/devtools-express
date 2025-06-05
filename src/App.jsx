import { useState } from "react";

// Herramientas y utilidades
import READMEForm from "./components/READMEForm";
import MarkdownPreview from "./components/MarkdownPreview";
import CopyButton from "./components/CopyButton";
import DownloadButton from "./components/DownloadButton";
import GitignoreGenerator from "./components/GitignoreGenerator";
import JsonCsvConverter from "./components/JsonCsvConverter";   // NUEVO
import CodeMinifier from "./components/CodeMinifier";       // NUEVO
import GitCommandHelper from "./components/GitCommandHelper"; // NUEVO
import { generateReadme } from "./utils/generateReadme";


// --- Iconos para la UI y Tarjetas de Herramientas ---
const ReadmeIcon = ({ className = "w-12 h-12 text-blue-600" }) => ( // Añadido color base
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const GitignoreIcon = ({ className = "w-12 h-12 text-blue-600" }) => ( // Añadido color base
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636M15.75 5.25V3m0 2.25h-1.5m1.5 0-1.125-1.125M15.75 5.25L14.625 4.125M9 20.25h6M10.5 16.5h3M12 12.75h.008v.008H12v-.008Z" />
  </svg>
);

// Iconos para las nuevas herramientas
const JsonCsvIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18M16.5 3l4.5 4.5m0 0L16.5 12m4.5-4.5H3" /></svg>
);
const CodeMinIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5H5.25A2.25 2.25 0 003 9.75v4.5A2.25 2.25 0 005.25 16.5h13.5A2.25 2.25 0 0021 14.25v-4.5A2.25 2.25 0 0018.75 7.5H17.25m-5.25 0V4.875c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125v2.625m5.25 0H9.375" /></svg>
);
const GitCmdIcon = ({ className = "w-12 h-12 text-blue-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25M10.5 6v12m3-12v12m3-12v12M3.75 6.75h16.5M3.75 17.25h16.5" /></svg>
);

const PreviewIcon = () => ( // Icono de placeholder para la vista previa del README
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
// --- Fin Iconos ---

// --- Componente ToolCard ---
const ToolCard = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out text-left w-full flex flex-col items-center md:items-start transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    {/* El color del icono se define ahora en el propio componente del icono */}
    <div className="mb-4">{icon}</div> 
    <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center md:text-left">{title}</h3>
    <p className="text-slate-600 text-sm text-center md:text-left">{description}</p>
  </button>
);
// --- Fin Componente ToolCard ---


function App() {
  const [activeTool, setActiveTool] = useState(null); // 'readme', 'gitignore', 'jsoncsv', 'minifier', 'githelper'
  
  // Estados específicos para el generador de README
  const [readmeContent, setReadmeContent] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  const handleReadmeGenerate = (formData) => {
    const result = generateReadme(formData);
    setReadmeContent(result);
    setProjectTitle(formData.title || "README");
  };

  const handleSelectTool = (toolName) => {
    setActiveTool(toolName);
    // Resetear estados de herramientas específicas si es necesario al cambiar de herramienta
    if (toolName !== 'readme') {
      setReadmeContent("");
      setProjectTitle("");
    }
    // Aquí podrías añadir resets para otros estados de herramientas si los gestionas en App.jsx
  };

  const handleGoToToolbox = () => {
    setActiveTool(null);
    // Opcionalmente resetear todos los estados de herramientas aquí también
    setReadmeContent("");
    setProjectTitle("");
  };

  const generatedReadmeFilename = projectTitle ? `${projectTitle.replace(/\s+/g, '_')}-README.md` : 'README.md';

  // --- Renderizado del Contenido de la Herramienta Activa ---
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'readme':
        return (
          <div className="flex flex-col lg:flex-row gap-8 transition-opacity duration-500 ease-in-out">
            <div className="lg:w-1/2 bg-white p-6 md:p-8 rounded-xl shadow-2xl">
              <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
                1. Completa la Información del README
              </h2>
              <READMEForm onGenerate={handleReadmeGenerate} />
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl h-full min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h2 className="text-2xl font-semibold text-blue-700">
                    2. Vista Previa del README
                  </h2>
                  {readmeContent && (
                    <div className="flex items-center gap-3">
                      <CopyButton content={readmeContent} />
                      <DownloadButton content={readmeContent} filename={generatedReadmeFilename} />
                    </div>
                  )}
                </div>
                {readmeContent ? (
                  <div className="prose prose-sm sm:prose lg:prose-base max-w-none flex-grow overflow-y-auto p-3 border border-slate-200 rounded-md bg-slate-50 custom-scrollbar">
                    <MarkdownPreview content={readmeContent} />
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-center items-center text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-lg p-8">
                    <PreviewIcon />
                    <p className="text-lg font-medium">La vista previa de tu README aparecerá aquí.</p>
                    <p className="text-sm mt-2">Completa el formulario de la izquierda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'gitignore':
        return <GitignoreGenerator />;
      case 'jsoncsv': // NUEVO CASO
        return <JsonCsvConverter />;
      case 'minifier': // NUEVO CASO
        return <CodeMinifier />;
      case 'githelper': // NUEVO CASO
        return <GitCommandHelper />;
      default:
        // Podríamos mostrar un mensaje o redirigir si la herramienta no es válida,
        // pero si activeTool es null, se muestra el toolbox.
        return (
            <div className="text-center py-10">
                <p className="text-xl text-slate-600">Herramienta no encontrada o no seleccionada.</p>
                <button 
                    onClick={handleGoToToolbox} 
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
                >
                    Volver al Toolbox
                </button>
            </div>
        );
    }
  };
  // --- Fin Renderizado de Herramienta Activa ---

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight cursor-pointer hover:opacity-90 transition-opacity" onClick={handleGoToToolbox}>
            DevTools Express
          </h1>
          {activeTool && ( 
            <button
              onClick={handleGoToToolbox}
              type="button"
              className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm rounded-md shadow-md transition-colors duration-300"
            >
              &larr; <span className="hidden sm:inline">Volver al Toolbox</span>
              <span className="sm:hidden">Toolbox</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
        {!activeTool ? (
          // --- Vista del Toolbox ---
          <>
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-3">Tu Caja de Herramientas para Desarrolladores</h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                Selecciona una herramienta para empezar a optimizar tu flujo de trabajo.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <ToolCard
                title="Generador de README.md"
                description="Crea archivos README profesionales y bien estructurados en minutos."
                icon={<ReadmeIcon />}
                onClick={() => handleSelectTool('readme')}
              />
              <ToolCard
                title="Generador de .gitignore"
                description="Genera archivos .gitignore optimizados para tu proyecto y lenguaje."
                icon={<GitignoreIcon />}
                onClick={() => handleSelectTool('gitignore')}
              />
              <ToolCard // NUEVA TARJETA
                title="Convertidor JSON ↔ CSV"
                description="Transforma datos entre formatos JSON y CSV fácilmente."
                icon={<JsonCsvIcon />}
                onClick={() => handleSelectTool('jsoncsv')}
              />
              <ToolCard // NUEVA TARJETA
                title="Minificador de Código"
                description="Reduce el tamaño de tu HTML, CSS y JavaScript para optimizar la carga."
                icon={<CodeMinIcon />}
                onClick={() => handleSelectTool('minifier')}
              />
              <ToolCard // NUEVA TARJETA
                title="Ayudante Comandos Git"
                description="Accede y copia rápidamente los comandos Git más comunes."
                icon={<GitCmdIcon />}
                onClick={() => handleSelectTool('githelper')}
              />
              {/* Puedes añadir una tarjeta placeholder para futuras herramientas si quieres */}
              {/* <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                <div className="text-slate-400 mb-4">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Próximamente</h3>
                <p className="text-slate-500 text-sm">Nuevas herramientas en camino...</p>
              </div> */}
            </div>
          </>
        ) : (
          // --- Vista de la Herramienta Activa ---
          renderActiveTool()
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} DevTools Express. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;