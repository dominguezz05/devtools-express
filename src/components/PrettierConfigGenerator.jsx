
import { useState } from 'react';
import { translations } from '../i18n';
import CopyButton from './CopyButton'; 
import DownloadButton from './DownloadButton';

// --- Componentes de UI para el formulario ---
const Switch = ({ label, description, name, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-200">
    <div>
      <label htmlFor={name} className="font-medium text-slate-700">{label}</label>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const InputNumber = ({ label, description, name, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-200">
    <div>
      <label htmlFor={name} className="font-medium text-slate-700">{label}</label>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-20 rounded-md border-gray-300 shadow-sm px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const Select = ({ label, description, name, value, onChange, options }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <label htmlFor={name} className="font-medium text-slate-700">{label}</label>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="rounded-md border-gray-300 shadow-sm pl-3 pr-7 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);


function PrettierConfigGenerator({ lang = "es" }) {
  const t = translations[lang]?.help?.prettier || {};
  const t_options = t.options || {};

  const [config, setConfig] = useState({
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: 'es5',
    bracketSpacing: true,
  });

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const configJsonString = JSON.stringify(config, null, 2);

  return (
    <div className="my-8 bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-slate-600 mt-2">{t.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {/* Columna de Opciones */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">{t.optionsTitle}</h3>
          <InputNumber label={t_options.printWidth?.label} description={t_options.printWidth?.description} name="printWidth" value={config.printWidth} onChange={handleConfigChange} />
          <InputNumber label={t_options.tabWidth?.label} description={t_options.tabWidth?.description} name="tabWidth" value={config.tabWidth} onChange={handleConfigChange} />
          <Switch label={t_options.useTabs?.label} description={t_options.useTabs?.description} name="useTabs" checked={config.useTabs} onChange={handleConfigChange} />
          <Switch label={t_options.semi?.label} description={t_options.semi?.description} name="semi" checked={config.semi} onChange={handleConfigChange} />
          <Switch label={t_options.singleQuote?.label} description={t_options.singleQuote?.description} name="singleQuote" checked={config.singleQuote} onChange={handleConfigChange} />
          <Switch label={t_options.bracketSpacing?.label} description={t_options.bracketSpacing?.description} name="bracketSpacing" checked={config.bracketSpacing} onChange={handleConfigChange} />
          <Select label={t_options.trailingComma?.label} description={t_options.trailingComma?.description} name="trailingComma" value={config.trailingComma} onChange={handleConfigChange} options={[{value: 'es5', label: 'es5'}, {value: 'none', label: 'none'}, {value: 'all', label: 'all'}]} />
        </div>

       
        <div className="mt-8 md:mt-0">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">{t.outputTitle}</h3>
          <div className="relative bg-slate-800 rounded-lg p-4 h-[calc(100%-60px)]">
            <pre className="text-sm text-slate-200 whitespace-pre-wrap overflow-auto h-full" style={{ scrollbarWidth: 'thin' }}>
              <code>{configJsonString}</code>
            </pre>
            <div className="absolute top-3 right-3 flex gap-2">
              <CopyButton content={configJsonString} lang={lang} />
              <DownloadButton content={configJsonString} filename=".prettierrc.json" lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrettierConfigGenerator;