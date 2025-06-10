

import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

function Header({
  activeTool,
  tools,
  settings,
  setSettings,
  handleGoToToolbox,
  handleSelectTool,
  t // Objeto de traducción
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  const renderNavLinks = (isMobile = false) => (
    <>
      {activeTool && (
        <>
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(prev => !prev)}
              type="button"
              className="flex w-full items-center justify-center gap-x-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer sm:w-auto"
            >
              {tools.find(t => t.key === activeTool)?.name || "Herramienta"}
              <ChevronDown className={`h-5 w-5 text-blue-200 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className={`absolute ${isMobile ? 'left-0' : 'right-0'} z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                <div className="py-1">
                  {tools.map((tool) => (
                    <button
                      key={tool.key}
                      onClick={() => {
                        handleSelectTool(tool.key);
                        setIsDropdownOpen(false);
                        if (isMobile) setIsMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeTool === tool.key ? "bg-blue-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              handleGoToToolbox();
              if (isMobile) setIsMobileMenuOpen(false);
            }}
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors w-full flex justify-center cursor-pointer"
          >
            {t.back}
          </button>
        </>
      )}
      <select
        value={settings.language || "es"}
        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
        className="w-full sm:w-auto bg-slate-700 text-white text-sm pl-2 pr-7 py-2 rounded-md border border-transparent hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </>
  );

  return (
    <header ref={headerRef} className="bg-slate-800 text-white shadow-md sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleGoToToolbox}>
            <img src="/LogoDevTools.png" alt="DevTools Express Logo" className="h-10 w-auto transition-transform hover:scale-105" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">DevTools Express</h1>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            {renderNavLinks()}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 border-t border-slate-700 mt-3">
            <nav className="flex flex-col gap-4">
              {renderNavLinks(true)}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;