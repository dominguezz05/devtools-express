// src/components/READMEForm.jsx
import { useState } from "react";

// Helper component for form fields to reduce repetition
const FormField = ({ id, label, type = "text", placeholder, value, onChange, isTextarea = false, rows = 3, required = false, helpText }) => {
  // Consistent classes for inputs and textareas, aligned with @tailwindcss/forms and the image
  const formElementClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out";
  // @tailwindcss/forms typically handles padding, but explicit padding can be added if desired.
  // For example, you could add 'py-2 px-3' or 'p-3'. Let's use a common padding.
  const paddingClasses = "py-2.5 px-3"; // Or "p-3" if you prefer more padding

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1"> {/* Changed text-slate-700 to text-gray-700 for consistency */}
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
          className={`${formElementClasses} ${paddingClasses}`}
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
          className={`${formElementClasses} ${paddingClasses}`}
        />
      )}
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>} {/* Changed text-slate-500 to text-gray-500 */}
    </div>
  );
};

// List of common licenses
const commonLicenses = [
  "MIT", "Apache-2.0", "GPL-3.0", "LGPL-3.0", "BSD-3-Clause", "Unlicense", "Mozilla Public License 2.0", "None"
];

function READMEForm({ onGenerate, initialData = {} }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(form);
  };

  // Consistent classes for form elements, similar to FormField
  const selectClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out py-2.5 px-3"; // Matched padding

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField id="title" label="Título del Proyecto" placeholder="Mi Increíble Proyecto" value={form.title} onChange={handleChange} required helpText="El nombre principal de tu proyecto." />
      <FormField id="projectVersion" label="Versión del Proyecto" placeholder="1.0.0" value={form.projectVersion} onChange={handleChange} helpText="Versión actual (ej. 1.0.0, 0.2.1)." />
      <FormField id="description" label="Descripción" placeholder="Una breve descripción de lo que hace tu proyecto y por qué es útil." value={form.description} onChange={handleChange} isTextarea rows={4} required helpText="Describe tu proyecto en pocas frases." />
      
      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">Detalles Técnicos</h3> {/* Adjusted spacing and color */}
      <FormField id="installation" label="Instrucciones de Instalación" placeholder="npm install mi-proyecto\ncd mi-proyecto" value={form.installation} onChange={handleChange} isTextarea helpText="Comandos y pasos para instalar el proyecto localmente." />
      <FormField id="usage" label="Instrucciones de Uso" placeholder="npm start\n# O cualquier otro comando para ejecutar tu proyecto" value={form.usage} onChange={handleChange} isTextarea helpText="Cómo usar/ejecutar tu proyecto después de la instalación." />
      <FormField id="tests" label="Comandos de Prueba" placeholder="npm test" value={form.tests} onChange={handleChange} isTextarea helpText="Comandos para ejecutar las pruebas automatizadas." />

      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">Comunidad y Licencia</h3> {/* Adjusted spacing and color */}
      <FormField id="contributing" label="Guía de Contribución" placeholder="Detalles sobre cómo otros pueden contribuir..." value={form.contributing} onChange={handleChange} isTextarea rows={3} helpText="Instrucciones o un enlace a tu guía de contribución." />
      
      <div>
        <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">Licencia</label>
        <select
          id="license"
          name="license"
          value={form.license}
          onChange={handleChange}
          className={selectClasses} // Using the defined consistent class
        >
          {commonLicenses.map(lic => <option key={lic} value={lic}>{lic}</option>)}
        </select>
        <p className="mt-1 text-xs text-gray-500">Elige la licencia para tu proyecto. Esto generará un badge.</p>
      </div>
      
      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">Autoría y Repositorio</h3> {/* Adjusted spacing and color */}
      <FormField id="author" label="Autor(es)" placeholder="Tu Nombre / Nombre de la Organización" value={form.author} onChange={handleChange} helpText="Nombre del autor o mantenedor principal." />
      <FormField id="githubUsername" label="Usuario de GitHub" placeholder="tu-usuario" value={form.githubUsername} onChange={handleChange} helpText="Tu nombre de usuario de GitHub (para badges y enlaces)." />
      <FormField id="repoName" label="Nombre del Repositorio en GitHub" placeholder="nombre-del-repo" value={form.repoName} onChange={handleChange} helpText="El nombre del repositorio en GitHub (para badges)." />

      <div className="pt-6"> {/* Increased top padding for the button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-[1.02]" // Slightly larger shadow and hover scale
        >
          <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Generar README
        </button>
      </div>
    </form>
  );
}

export default READMEForm;