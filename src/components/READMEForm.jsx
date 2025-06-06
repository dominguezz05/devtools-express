// src/components/READMEForm.jsx
import { useState } from "react";
import HelpPopup from "./HelpPopup";

// --- FormField MODIFICADO para aceptar y mostrar errores ---
const FormField = ({ id, label, type = "text", placeholder, value, onChange, isTextarea = false, rows = 3, required = false, helpText, error }) => {
  const formElementClasses = "block w-full rounded-md shadow-sm sm:text-sm transition duration-150 ease-in-out";
  const paddingClasses = "py-2.5 px-3";
  
  // Clases condicionales para el estilo de error
  const errorClasses = "border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";
  const defaultClasses = "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`${formElementClasses} ${paddingClasses} ${error ? errorClasses : defaultClasses}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`${formElementClasses} ${paddingClasses} ${error ? errorClasses : defaultClasses}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {/* Muestra el texto de ayuda o el mensaje de error */}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>
      ) : (
        helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

const commonLicenses = [
  "MIT", "Apache-2.0", "GPL-3.0", "LGPL-3.0", "BSD-3-Clause", "Unlicense", "Mozilla Public License 2.0", "None"
];

function READMEForm({ onGenerate, initialData = {} }) {
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    installation: initialData.installation || "",
    usage: initialData.usage || "",
    contributing: initialData.contributing || "Las contribuciones son bienvenidas. Por favor, revisa las guías de contribución y el código de conducta.",
    tests: initialData.tests || "",
    license: initialData.license || "MIT",
    githubUsername: initialData.githubUsername || "",
    repoName: initialData.repoName || "",
    author: initialData.author || "",
    projectVersion: initialData.projectVersion || "1.0.0",
  });
  
  // --- NUEVO: Estado para los errores de validación ---
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    
    // Limpiar el error para el campo actual en cuanto el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // --- NUEVO: Función para validar el formulario ---
  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "El título del proyecto es obligatorio.";
    }
    if (!form.description.trim()) {
      newErrors.description = "La descripción del proyecto es obligatoria.";
    }
    // Puedes añadir más validaciones aquí si quieres

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar el formulario antes de generar el README
    if (validateForm()) {
      onGenerate(form);
    }
  };

  const selectClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out py-2.5 px-3";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Pasamos la prop 'error' a cada FormField */}
      <FormField id="title" label="Título del Proyecto" placeholder="Mi Increíble Proyecto" value={form.title} onChange={handleChange} required helpText="El nombre principal de tu proyecto." error={errors.title} />
      <FormField id="projectVersion" label="Versión del Proyecto" placeholder="1.0.0" value={form.projectVersion} onChange={handleChange} helpText="Versión actual (ej. 1.0.0, 0.2.1)." error={errors.projectVersion} />
      <FormField id="description" label="Descripción" placeholder="Una breve descripción de lo que hace tu proyecto y por qué es útil." value={form.description} onChange={handleChange} isTextarea rows={4} required helpText="Describe tu proyecto en pocas frases." error={errors.description} />
      
      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">Detalles Técnicos</h3>
      <FormField id="installation" label="Instrucciones de Instalación" placeholder="npm install mi-proyecto\ncd mi-proyecto" value={form.installation} onChange={handleChange} isTextarea helpText="Comandos y pasos para instalar el proyecto localmente." error={errors.installation} />
      <FormField id="usage" label="Instrucciones de Uso" placeholder="npm start\n# O cualquier otro comando para ejecutar tu proyecto" value={form.usage} onChange={handleChange} isTextarea helpText="Cómo usar/ejecutar tu proyecto después de la instalación." error={errors.usage} />
      <FormField id="tests" label="Comandos de Prueba" placeholder="npm test" value={form.tests} onChange={handleChange} isTextarea helpText="Comandos para ejecutar las pruebas automatizadas." error={errors.tests} />

      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">Comunidad y Licencia</h3>
      <FormField id="contributing" label="Guía de Contribución" placeholder="Detalles sobre cómo otros pueden contribuir..." value={form.contributing} onChange={handleChange} isTextarea rows={3} helpText="Instrucciones o un enlace a tu guía de contribución." error={errors.contributing} />
      
      <div>
        <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">Licencia</label>
        <select
          id="license"
          name="license"
          value={form.license}
          onChange={handleChange}
          className={selectClasses}
        >
          {commonLicenses.map(lic => <option key={lic} value={lic}>{lic}</option>)}
        </select>
        <p className="mt-1 text-xs text-gray-500">Elige la licencia para tu proyecto. Esto generará un badge.</p>
      </div>
      
      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">Autoría y Repositorio</h3>
      <FormField id="author" label="Autor(es)" placeholder="Tu Nombre / Nombre de la Organización" value={form.author} onChange={handleChange} helpText="Nombre del autor o mantenedor principal." error={errors.author} />
      <FormField id="githubUsername" label="Usuario de GitHub" placeholder="tu-usuario" value={form.githubUsername} onChange={handleChange} helpText="Tu nombre de usuario de GitHub (para badges y enlaces)." error={errors.githubUsername} />
      <FormField id="repoName" label="Nombre del Repositorio en GitHub" placeholder="nombre-del-repo" value={form.repoName} onChange={handleChange} helpText="El nombre del repositorio en GitHub (para badges)." error={errors.repoName} />

      <div className="pt-6">
        <button
          type="submit"
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-[1.02]"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Generar README
        </button>
      </div>
      {showHelp && (
        <HelpPopup helpKey="readme" onClose={() => setShowHelp(false)} />
      )}
    </form>
  );
}

export default READMEForm;