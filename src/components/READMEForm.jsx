import { useState, useEffect } from "react";
import HelpPopup from "./HelpPopup";
import { translations } from "../i18n";

const FormField = (
  {
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    isTextarea = false,
    rows = 3,
    required = false,
    helpText,
    error,
  }
) => {
  const formElementClasses =
    "block w-full rounded-md shadow-sm sm:text-sm transition duration-150 ease-in-out";
  const paddingClasses = "py-2.5 px-3";
  const errorClasses =
    "border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";
  const defaultClasses =
    "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
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
          className={`${formElementClasses} ${paddingClasses} ${
            error ? errorClasses : defaultClasses
          }`}
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
          className={`${formElementClasses} ${paddingClasses} ${
            error ? errorClasses : defaultClasses
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : (
        helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

const commonLicenses = [
  "MIT",
  "Apache-2.0",
  "GPL-3.0",
  "LGPL-3.0",
  "BSD-3-Clause",
  "Unlicense",
  "Mozilla Public License 2.0",
  "None",
];

function READMEForm({ onGenerate, initialData = {},  lang = "es" }) {
  

  const t = translations[lang].help.readme;
    const defaults = t.defaults; // accedes a los valores por defecto
const labels = t.sectionTitles;
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    installation: initialData.installation || "",
    usage: initialData.usage || "",
    contributing:
      initialData.contributing ||
      "...",
    tests: initialData.tests || "",
    license: initialData.license || "MIT",
    githubUsername: initialData.githubUsername || "",
    repoName: initialData.repoName || "",
    author: initialData.author || "",
    projectVersion: initialData.projectVersion || "1.0.0",

  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    const dismissed = localStorage.getItem("help-dismissed-readme");
    if (!dismissed) {
      setShowHelp(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = t.fields.title;
    }
    if (!form.description.trim()) {
      newErrors.description = t.fields.description;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(form);
    }
  };

  const selectClasses =
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out py-2.5 px-3";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <FormField
        id="title"
        label={t.fields.title}
        placeholder="..."
        value={form.title}
        onChange={handleChange}
        required
        helpText={t.fields.title}
        error={errors.title}
      />
      <FormField
        id="projectVersion"
        label={t.fields.projectVersion}
        placeholder="1.0.0"
        value={form.projectVersion}
        onChange={handleChange}
        helpText={t.fields.projectVersion}
        error={errors.projectVersion}
      />
      <FormField
        id="description"
        label={t.fields.description}
        placeholder="..."
        value={form.description}
        onChange={handleChange}
        isTextarea
        rows={4}
        required
        helpText={t.fields.description}
        error={errors.description}
      />

      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">
        {labels.technicalDetails}
      </h3>
      <FormField
        id="installation"
        label={t.fields.installation}
        placeholder="npm install ..."
        value={form.installation}
        onChange={handleChange}
        isTextarea
        helpText={t.fields.installation}
        error={errors.installation}
      />
      <FormField
        id="usage"
        label={t.fields.usage}
        placeholder="npm start"
        value={form.usage}
        onChange={handleChange}
        isTextarea
        helpText={t.fields.usage}
        error={errors.usage}
      />
      <FormField
        id="tests"
        label={t.fields.tests}
        placeholder="npm test"
        value={form.tests}
        onChange={handleChange}
        isTextarea
        helpText={t.fields.tests}
        error={errors.tests}
      />

      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">
        {labels.communityLicense}
      </h3>
      <FormField
        id="contributing"
        label={t.fields.contributing}
        placeholder="..."
        value={form.contributing}
        onChange={handleChange}
        isTextarea
        rows={3}
        helpText={t.fields.contributing}
        error={errors.contributing}
      />

      <div>
        <label
          htmlFor="license"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t.fields.license}
        </label>
        <select
          id="license"
          name="license"
          value={form.license}
          onChange={handleChange}
          className={selectClasses}
        >
          {commonLicenses.map((lic) => (
            <option key={lic} value={lic}>
              {lic}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">{t.fields.license}</p>
      </div>

      <h3 className="text-lg font-medium text-gray-800 pt-4 mt-6 border-t border-gray-200">
      {labels.authorRepo}
      </h3>
      <FormField
        id="author"
        label={t.fields.author}
        placeholder="Tu Nombre"
        value={form.author}
        onChange={handleChange}
        helpText={t.fields.author}
        error={errors.author}
      />
      <FormField
        id="githubUsername"
        label={t.fields.githubUsername}
        placeholder="tu-usuario"
        value={form.githubUsername}
        onChange={handleChange}
        helpText={t.fields.githubUsername}
        error={errors.githubUsername}
      />
      <FormField
        id="repoName"
        label={t.fields.repoName}
        placeholder="nombre-repo"
        value={form.repoName}
        onChange={handleChange}
        helpText={t.fields.repoName}
        error={errors.repoName}
      />

      <div className="pt-6">
        <button
          type="submit"
          className="cursor-pointer w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-[1.02]"
        >
          <svg
            className="w-5 h-5 mr-2 -ml-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          {t.fields.submit}
        </button>
      </div>
      {showHelp && <HelpPopup helpKey="readme" onClose={() => setShowHelp(false)}  lang={lang}/>}
    </form>
  );
}

export default READMEForm;
