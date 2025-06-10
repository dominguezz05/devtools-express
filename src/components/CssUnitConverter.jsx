import { useState, useEffect } from 'react';
import { translations } from '../i18n';
import CopyButton from './CopyButton';

const UnitInput = ({ label, unit, value, onChange }) => (
  <div>
    <label htmlFor={`${unit}-${label}`} className="block text-sm font-medium text-slate-600">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type="number"
        id={`${unit}-${label}`}
        name={unit}
        value={value}
        onChange={onChange}
        className="block w-full pr-12 pl-4 py-2 sm:text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="0"
        step="any"
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <span className="text-gray-500 sm:text-sm px-4">{unit}</span>
      </div>
    </div>
  </div>
);

function CssUnitConverter({ lang = "es" }) {
  const t = translations[lang]?.help?.cssUnitConverter || {};

  const [baseSize, setBaseSize] = useState(16);
  const [parentSize, setParentSize] = useState(16);

  // Estado para el conversor PX <-> REM
  const [pxForRem, setPxForRem] = useState('16');
  const [remValue, setRemValue] = useState('1');
  
  // Estado para el conversor PX <-> EM
  const [pxForEm, setPxForEm] = useState('16');
  const [emValue, setEmValue] = useState('1');

  // --- Lógica Unidireccional: Actualizar el otro valor cuando uno cambia ---
  
  // Si cambia el PX del bloque REM, recalcula el REM
  const handlePxForRemChange = (e) => {
    const newPx = e.target.value;
    setPxForRem(newPx);
    if (newPx === '' || isNaN(parseFloat(newPx)) || baseSize <= 0) {
      setRemValue('');
    } else {
      setRemValue(String(parseFloat(newPx) / baseSize));
    }
  };

  // Si cambia el REM, recalcula el PX
  const handleRemChange = (e) => {
    const newRem = e.target.value;
    setRemValue(newRem);
    if (newRem === '' || isNaN(parseFloat(newRem))) {
      setPxForRem('');
    } else {
      setPxForRem(String(parseFloat(newRem) * baseSize));
    }
  };

  // Si cambia el PX del bloque EM, recalcula el EM
  const handlePxForEmChange = (e) => {
    const newPx = e.target.value;
    setPxForEm(newPx);
    if (newPx === '' || isNaN(parseFloat(newPx)) || parentSize <= 0) {
      setEmValue('');
    } else {
      setEmValue(String(parseFloat(newPx) / parentSize));
    }
  };

  // Si cambia el EM, recalcula el PX
  const handleEmChange = (e) => {
    const newEm = e.target.value;
    setEmValue(newEm);
    if (newEm === '' || isNaN(parseFloat(newEm))) {
      setPxForEm('');
    } else {
      setPxForEm(String(parseFloat(newEm) * parentSize));
    }
  };
  
  // Recalcular cuando los tamaños base cambian
  useEffect(() => {
    if (pxForRem !== '' && !isNaN(parseFloat(pxForRem)) && baseSize > 0) {
      setRemValue(String(parseFloat(pxForRem) / baseSize));
    }
  }, [baseSize, pxForRem]);
  
  useEffect(() => {
    if (pxForEm !== '' && !isNaN(parseFloat(pxForEm)) && parentSize > 0) {
      setEmValue(String(parseFloat(pxForEm) / parentSize));
    }
  }, [parentSize, pxForEm]);

  return (
    <div className="my-8 bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-slate-600 mt-2">{t.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna de PX <-> REM */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t.remTitle}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.baseSizeLabel}</label>
              <p className="text-xs text-slate-500 mb-2">{t.baseSizeDescription}</p>
              <UnitInput unit="px" value={baseSize} onChange={(e) => setBaseSize(parseFloat(e.target.value) || 0)} />
            </div>
            <hr />
            <UnitInput label={t.pixelsLabel} unit="px" value={pxForRem} onChange={handlePxForRemChange} />
            <UnitInput label="REM" unit="rem" value={remValue} onChange={handleRemChange} />
          </div>
        </div>

        {/* Columna de PX <-> EM */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t.emTitle}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.parentSizeLabel}</label>
              <p className="text-xs text-slate-500 mb-2">{t.parentSizeDescription}</p>
              <UnitInput unit="px" value={parentSize} onChange={(e) => setParentSize(parseFloat(e.target.value) || 0)} />
            </div>
            <hr />
            <UnitInput label={t.pixelsLabel} unit="px" value={pxForEm} onChange={handlePxForEmChange} />
            <UnitInput label="EM" unit="em" value={emValue} onChange={handleEmChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CssUnitConverter;