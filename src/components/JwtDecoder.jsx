// src/components/JwtDecoder.jsx

import { useState, useEffect } from 'react';
import { translations } from '../i18n';
import CopyButton from './CopyButton';

// Función auxiliar para decodificar Base64Url
function base64UrlDecode(str) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: break;
    case 2: output += '=='; break;
    case 3: output += '='; break;
    default: throw new Error('Illegal base64url string!');
  }
  try {
    return decodeURIComponent(atob(output).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return atob(output);
  }
}

function JwtDecoder({ lang = "es" }) {
  const t = translations[lang]?.help?.jwtDecoder || {};
  
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setError('');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error(t.errorInvalidFormat);
      }
      
      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError('');
    } catch (e) {
      setHeader(null);
      setPayload(null);
      setError(t.errorInvalidToken || 'Error: El token no es válido o está malformado.');
      console.error(e);
    }
  }, [token, t]);

  const CodeBlock = ({ title, data }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        {data && <CopyButton content={data} lang={lang} />}
      </div>
      <pre className="text-sm bg-slate-800 text-slate-200 p-4 rounded-lg whitespace-pre-wrap overflow-auto" style={{ scrollbarWidth: 'thin' }}>
        <code>{data}</code>
      </pre>
    </div>
  );

  return (
    <div className="my-8 bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-slate-600 mt-2">{t.description}</p>
      </div>

      <div>
        <label htmlFor="jwt-input" className="block text-sm font-medium text-gray-700">{t.inputLabel}</label>
        <textarea
          id="jwt-input"
          rows="8"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t.placeholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono p-3"
        />
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!error && (header || payload) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {header && <CodeBlock title="Header" data={header} />}
          {payload && <CodeBlock title="Payload" data={payload} />}
        </div>
      )}
    </div>
  );
}

export default JwtDecoder;