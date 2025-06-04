import { useState } from "react";

// Herramientas y utilidades
import READMEForm from "./components/READMEForm";
import MarkdownPreview from "./components/MarkdownPreview";
import CopyButton from "./components/CopyButton";
import DownloadButton from "./components/DownloadButton";
import GitignoreGenerator from "./components/GitignoreGenerator"; // Importar el nuevo generador
import { generateReadme } from "./utils/generateReadme";

// --- Iconos para la UI y Tarjetas de Herramientas ---
const ReadmeIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const GitignoreIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636M15.75 5.25V3m0 2.25h-1.5m1.5 0-1.125-1.125M15.75 5.25L14.625 4.125M9 20.25h6M10.5 16.5h3M12 12.75h.008v.008H12v-.008Z" />
  </svg>
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
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out text-left w-full flex flex-col items-center md:items-start transform hover:scale-[1.03]"
  >
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center md:text-left">{title}</h3>
    <p className="text-slate-600 text-sm text-center md:text-left">{description}</p>
  </button>
);
// --- Fin Componente ToolCard ---


function App() {
  const [activeTool, setActiveTool] = useState(null); // 'readme', 'gitignore', etc.
  
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
    // Podrías tener resets similares para otros estados de herramientas aquí
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
            {/* README Form Section Card */}
            <div className="lg:w-1/2 bg-white p-6 md:p-8 rounded-xl shadow-2xl">
              <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
                1. Completa la Información del README
              </h2>
              <READMEForm onGenerate={handleReadmeGenerate} />
            </div>

            {/* README Preview Section Card */}
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
                  <div className="prose prose-sm sm:prose lg:prose-base max-w-none flex-grow overflow-y-auto p-1 border border-slate-200 rounded-md bg-slate-50 custom-scrollbar">
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
        return <GitignoreGenerator />; // El componente GitignoreGenerator se renderiza aquí
      default:
        return null; // No debería llegar aquí si activeTool es null
    }
  };
  // --- Fin Renderizado de Herramienta Activa ---

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight cursor-pointer" onClick={handleGoToToolbox}>
            DevTools Express
          </h1>
          {activeTool && ( // Mostrar botón "Volver" solo si una herramienta está activa
            <button
              onClick={handleGoToToolbox}
              type="button"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md shadow-md transition-colors duration-300"
            >
              &larr; Volver al Toolbox
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 md:p-8 flex-grow">
        {!activeTool ? (
          // --- Vista del Toolbox ---
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-700 mb-3">Tu Caja de Herramientas para Desarrolladores</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Selecciona una herramienta para empezar a optimizar tu flujo de trabajo.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              {/* Añade más ToolCards aquí para futuras herramientas */}
              {/*
              <ToolCard
                title="Próxima Herramienta Increíble"
                description="Descripción de la futura herramienta que facilitará aún más tu vida."
                icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
                onClick={() => handleSelectTool('proxima')}
              />
              */}
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