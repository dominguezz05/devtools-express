import HelpPanel from "./components/HelpPanel";

export const translations = {
  es: {
    welcome: "Bienvenido a DevTools Express",
    subtitle:
      "Automatiza tareas, crea archivos y acelera tu flujo de trabajo como desarrollador.",
    start: "🚀 Comenzar",
    toolboxTitle: "Tu Caja de Herramientas",
    toolboxSubtitle:
      "Selecciona una utilidad para crear, optimizar o automatizar tu trabajo como desarrollador.",
    back: "← Volver al Toolbox",
    selectTool: "Selecciona una herramienta",
    previewTitle: "Vista Previa del README",
    previewEmpty: "La vista previa de tu README aparecerá aquí.",
    previewInstruction: "Completa el formulario de la izquierda.",
    formTitle: "Completa la Información del README",
    tools: {
      readme: "Generador README",
      gitignore: "Generador .gitignore",
      jsoncsv: "Convertidor JSON ↔ CSV",
      minifier: "Minificador de Código",
      githelper: "Ayudante Git",
      snippeteditor: "Editor de Snippets",
    },

    help: {
      readme: {
        title:
          "Completa este formulario para generar tu README automáticamente.",
        fields: {
          title: "Nombre de tu proyecto.",
          projectVersion: "Versión actual, por ejemplo: 1.0.0",
          description: "Breve descripción del proyecto y su utilidad.",
          installation: "Pasos o comandos necesarios para instalar.",
          usage: "Cómo ejecutar o utilizar tu proyecto.",
          tests: "Comandos de testeo automatizado.",
          contributing: "Cómo pueden otros colaborar en el proyecto.",
          license:
            "Licencia del proyecto. Se generará un badge automáticamente.",
          author: "Nombre del autor o entidad responsable.",
          githubUsername: "Tu usuario de GitHub para generar enlaces.",
          repoName: "Nombre del repositorio GitHub (para los badges).",
          submit: "Generar README.md",
        },
        sectionTitles: {
          technicalDetails: "Detalles Técnicos",
          communityLicense: "Comunidad y Licencia",
          authorRepo: "Autoría y Repositorio",
        },
        defaults: {
          contributing:
            "Las contribuciones son bienvenidas. Por favor, revisa las guías de contribución y el código de conducta.",
        },
      },
      gitignore: {
        title: "Generador de Gitignore",
        subtitle:
          "Crea rápidamente archivos .gitignore para tus proyectos. Ingresa uno o más lenguajes o frameworks separados por comas.",
        label: "Lenguajes / Frameworks",
        placeholder: "Ej: node,python,react,vscode",
        generate: "Generar",
        generating: "Generando...",
        clear: "Limpiar",
        outputTitle: "Resultado generado:",
        aria: "Contenido del archivo .gitignore generado",
      },
      jsoncsv: {
        title: "Convertidor JSON ↔ CSV",
        subtitle:
          "Pega tu contenido JSON o CSV y elige la dirección de la conversión.",
        inputLabel: "Entrada:",
        outputLabel: "Salida:",
        toCSV: "JSON → CSV",
        toJSON: "CSV → JSON",
        clear: "Limpiar todo",
        placeholder: `Pega aquí JSON o CSV. Ejemplos:\nJSON: [{ "id": 1, "valor": "abc" }]\nCSV: id,valor\\n1,abc`,
        errors: {
          emptyInput: "❌ El campo de entrada está vacío.",
          invalidJSON:
            "La entrada debe ser un array de objetos JSON o un único objeto JSON.",
          noHeader: "El CSV no tiene línea de cabecera.",
          csvConversion: "❌ Error al convertir a CSV",
          jsonConversion: "❌ Error al convertir a JSON",
        },
      },
      minifier: {
        title: "Minificador de Código",
        subtitle:
          "Reduce el tamaño de tu código HTML, CSS o JavaScript para optimizar la carga.",
        inputLabel: "Código Original:",
        outputLabel: "Código Minificado:",
        languageLabel: "Lenguaje:",
        button: "Minificar Código",
        processing: "Minificando...",
        clear: "Limpiar todo",
        placeholder: {
          html: "Pega tu código HTML aquí",
          css: "Pega tu código CSS aquí",
          js: "Pega tu código JS aquí",
        },
        errors: {
          empty: "❌ El campo de código está vacío.",
          minifyFail: "❌ Error al minificar: ",
        },
      },
      snippeteditor: {
        title: "Editor de Snippets",
        description:
          "Crea, edita y gestiona tus fragmentos de código reutilizables. Se guardarán localmente.",
        form: {
          editingTitle: "Editando Snippet",
          newTitle: "Nuevo Snippet",
          titleLabel: "Título",
          titlePlaceholder: "Ej: Función Debounce en JS",
          langLabel: "Lenguaje",
          codeLabel: "Código",
          codePlaceholder: "Escribe tu código aquí...",
          updateButton: "Actualizar Snippet",
          saveButton: "Guardar Snippet",
          cancelButton: "Cancelar Edición",
        },
        list: {
          title: "Snippets Guardados ({count})",
          emptyMessage: "Aún no has guardado ningún snippet.",
          emptySuggestion: "Usa el formulario para crear tu primero.",
          editTooltip: "Editar snippet",
          deleteTooltip: "Eliminar snippet",
          searchPlaceholder: "🔍 Buscar por título o código...",
          allLanguages: "Todos los lenguajes",
        },
        deleteConfirm: {
          title: "¿Eliminar snippet?",
          message: "Esta acción no se puede deshacer. ¿Deseas continuar?",
          confirmButton: "Sí, eliminar",
          cancelButton: "Cancelar",
        },
        manage: {
          title: "Gestión de Snippets",
          description:
            "Guarda todos tus snippets en un archivo, o carga snippets desde un archivo de configuración.",
          exportButton: "Exportar Snippets",
          importButton: "Importar Snippets",
        },
        validation: {
          titleRequired: "El título no puede estar vacío.",
          titleExists: "Ya existe un snippet con este título.",
          codeRequired: "El código no puede estar vacío.",
        },
        notifications: {
          exportError: "❌ No hay snippets para exportar.",
          exportSuccess: "✅ Snippets exportados correctamente.",
          importReadError: "No se pudo leer el archivo.",
          importSuccess: "✅ {count} snippets nuevos importados.",
          importNoNew: "ℹ️ No se encontraron snippets nuevos para importar.",
          importInvalidFormat:
            "El archivo no contiene un formato de snippets válido.",
          importGenericError: "❌ Error al importar: {message}",
        },
        languages: {
          javascript: "JavaScript",
          typescript: "TypeScript",
          jsx: "JSX / TSX",
          html: "HTML",
          css: "CSS",
          python: "Python",
          java: "Java",
          csharp: "C#",
          go: "Go",
          php: "PHP",
          sql: "SQL",
          bash: "Bash / Shell",
          json: "JSON",
          yaml: "YAML",
          markdown: "Markdown",
          dockerfile: "Dockerfile",
        },
      },
      githelper: {
        title: "Ayudante de Comandos Git",
        description:
          "Copia rápidamente comandos comunes de Git o prueba y guarda los tuyos.",
        commonCommandsTitle: "Comandos Comunes:",
        customCommandTitle: "Comando Personalizado:",
        placeholder:
          "Escribe tu comando Git aquí (ej. git checkout -b nueva-rama)",
        clearCustomTitle: "Limpiar comando personalizado",
        errorEmpty: "El comando personalizado no puede estar vacío.",
        copyAndSaveButton: "Copiar y Guardar",
        copySuccess: "¡Comando Copiado!",
        copyError: "Error al Copiar",
        commands: {
          init: "Inicializa un nuevo repositorio Git.",
          add: "Añade todos los cambios al área de staging.",
          commit: "Guarda los cambios en el repositorio.",
          status: "Muestra el estado de los cambios.",
          push: "Sube los commits locales al repositorio remoto.",
          pull: "Trae y fusiona cambios del repositorio remoto.",
          log: "Muestra el historial de commits de forma concisa.",
        },
      },

      HelpPanel: {
        title: "Historial Reciente",
        clearButton: "Limpiar",
        clearTitle: "Limpiar historial",
        useEntry: "Usar esta entrada",
      },
      title: "Guía Rápida de Uso",
      button: "¿Necesitas ayuda?",
      basicUsageTitle: "Uso Básico",
      basicUsage: [
        "Selecciona una herramienta desde la pantalla principal.",
        "Introduce datos o código en el área correspondiente.",
        "Haz clic en el botón principal para ejecutar la herramienta.",
        "Visualiza, copia o descarga el resultado generado.",
      ],
      persistenceTitle: "Historial y Persistencia",
      persistence: [
        "El historial de entradas se guarda localmente en el navegador.",
        "Los snippets se guardan automáticamente y se restauran al volver.",
      ],
      snippetsTitle: "Configuración de snippets",
      snippets: [
        "Usa Exportar Snippets para tener tus snippets en un .json.",
        "Usa Importar Snippets para insertarlos desde un archivo .json.",
      ],
      shortcutTitle: "Atajo de Teclado",
      shortcutInstruction: "Pulsa ESC para cerrar esta ayuda.",
    },
    popup: {
      readme: {
        title: "Generador de README",
        details:
          "Esta herramienta te guía para crear un archivo README.md profesional. Rellena los campos del formulario y el contenido se generará automáticamente en la vista previa.",
      },
      gitignore: {
        title: "Generador de .gitignore",
        details:
          "Evita subir archivos innecesarios a tu repositorio. Escribe los nombres de las tecnologías, frameworks o sistemas operativos (separados por comas, ej: `node,react,macos`) para generar un archivo .gitignore optimizado.",
      },
      jsoncsv: {
        title: "Convertidor JSON ↔ CSV",
        details:
          "Pega tus datos en formato JSON (un array de objetos) o CSV (con cabeceras en la primera línea) en el área de entrada. Luego, presiona el botón de la dirección en la que quieras convertir.",
      },
      minifier: {
        title: "Minificador de Código",
        details:
          "Reduce el tamaño de tu código para optimizar la carga de tu web. Selecciona el lenguaje (HTML, CSS o JS), pega tu código y haz clic en 'Minificar'.",
      },
      githelper: {
        title: "Ayudante Comandos Git",
        details:
          "Una lista de los comandos de Git más utilizados para que puedas copiarlos rápidamente. También puedes guardar tus propios comandos personalizados en el historial.",
      },
      snippeteditor: {
        title: "Editor de Snippets",
        details:
          "Tu biblioteca personal de fragmentos de código. Guarda, gestiona y reutiliza tus snippets más frecuentes. Todos los datos se guardan en tu navegador.",
      },
      default: {
        title: "Ayuda General",
        details:
          "Pasa el cursor sobre los elementos o selecciona una herramienta para obtener ayuda contextual. Puedes cerrar esta ventana con la tecla 'Esc'.",
      },
      closeLabel: "Cerrar ayuda",
      checkboxLabel: "No volver a mostrar esto",
    },
    footer: {
      credits: "Desarrollado por Iker Domínguez.",
      description: "Herramientas para optimizar tu flujo de desarrollo.",
    },
    toolDescriptions: {
      readme: {
        title: "Generador de README.md",
        description: "Crea archivos README profesionales y bien estructurados.",
      },
      gitignore: {
        title: "Generador de .gitignore",
        description: "Genera archivos .gitignore optimizados para tu proyecto.",
      },
      jsoncsv: {
        title: "Convertidor JSON ↔ CSV",
        description: "Transforma datos entre formatos JSON y CSV.",
      },
      minifier: {
        title: "Minificador de Código",
        description: "Reduce el tamaño de tu HTML, CSS y JavaScript.",
      },
      githelper: {
        title: "Ayudante Comandos Git",
        description: "Accede y copia rápidamente los comandos Git más comunes.",
      },
      snippeteditor: {
        title: "Editor de Snippets",
        description:
          "Crea, guarda y gestiona tus fragmentos de código reutilizables.",
      },
    },
    download: "Descargar",
    copy: {
      button: "Copiar ",
      success: "¡Copiado!",
      error: "Error al copiar",
    },

    errors: {
      emptyInput: "Por favor, ingresa uno o más lenguajes/frameworks.",
      loadLanguages: "Error al cargar la lista de lenguajes. Estado:",
      detail: "Detalle",
      templateNotFound: "No se encontró la plantilla para",
      serverError: "Error del servidor:",
      htmlReturned: "La API devolvió una página HTML inesperada para",
      partialNotFound: "Una o más plantillas no se encontraron para",
      general: "Ocurrió un error al generar el archivo .gitignore.",
    },
  },

  en: {
    welcome: "Welcome to DevTools Express",
    subtitle:
      "Automate tasks, create files, and accelerate your developer workflow.",
    start: "🚀 Get Started",
    toolboxTitle: "Your Toolbox",
    toolboxSubtitle: "Select a tool to create, optimize or automate your work.",
    back: "← Back to Toolbox",
    selectTool: "Select a tool",
    previewTitle: "README Preview",
    previewEmpty: "Your README preview will appear here.",
    previewInstruction: "Complete the form on the left.",
    formTitle: "Complete the README Information",
    tools: {
      readme: "README Generator",
      gitignore: ".gitignore Generator",
      jsoncsv: "JSON ↔ CSV Converter",
      minifier: "Code Minifier",
      githelper: "Git Command Helper",
      snippeteditor: "Snippet Editor",
    },

    help: {
      readme: {
        title: "Fill out this form to automatically generate your README.",
        fields: {
          title: "Your project name.",
          projectVersion: "Current version, e.g., 1.0.0",
          description: "Brief description and purpose of the project.",
          installation: "Steps or commands needed to install.",
          usage: "How to run or use your project.",
          tests: "Commands for automated testing.",
          contributing: "How others can contribute to the project.",
          license: "Project license. A badge will be automatically generated.",
          author: "Name of the author or responsible entity.",
          githubUsername: "Your GitHub username to generate links.",
          repoName: "GitHub repo name (used for badges).",
          submit: "Generate README.md",
        },
        sectionTitles: {
          technicalDetails: "Technical Details",
          communityLicense: "Community and License",
          authorRepo: "Author and Repository",
        },
        defaults: {
          contributing:
            "Contributions are welcome. Please review the contribution guidelines and code of conduct.",
        },
      },
      snippeteditor: {
        title: "Snippet Editor",
        description:
          "Create, edit, and manage your reusable code snippets. They will be saved locally.",
        form: {
          editingTitle: "Editing Snippet",
          newTitle: "New Snippet",
          titleLabel: "Title",
          titlePlaceholder: "e.g., Debounce Function in JS",
          langLabel: "Language",
          codeLabel: "Code",
          codePlaceholder: "Write your code here...",
          updateButton: "Update Snippet",
          saveButton: "Save Snippet",
          cancelButton: "Cancel Edit",
        },
        list: {
          title: "Saved Snippets ({count})",
          emptyMessage: "You haven't saved any snippets yet.",
          emptySuggestion: "Use the form to create your first one.",
          editTooltip: "Edit snippet",
          deleteTooltip: "Delete snippet",
          searchPlaceholder: "🔍 Search by title or code...",
          allLanguages: "All languages",
        },
        deleteConfirm: {
          title: "Delete snippet?",
          message: "This action cannot be undone. Do you wish to continue?",
          confirmButton: "Yes, delete",
          cancelButton: "Cancel",
        },
        manage: {
          title: "Snippet Management",
          description:
            "Save all your snippets to a file, or load snippets from a configuration file.",
          exportButton: "Export Snippets",
          importButton: "Import Snippets",
        },
        validation: {
          titleRequired: "Title cannot be empty.",
          titleExists: "A snippet with this title already exists.",
          codeRequired: "Code cannot be empty.",
        },
        notifications: {
          exportError: "❌ No snippets to export.",
          exportSuccess: "✅ Snippets exported successfully.",
          importReadError: "Could not read the file.",
          importSuccess: "✅ {count} new snippets imported.",
          importNoNew: "ℹ️ No new snippets found to import.",
          importInvalidFormat:
            "The file does not contain a valid snippet format.",
          importGenericError: "❌ Error on import: {message}",
        },
        languages: {
          javascript: "JavaScript",
          typescript: "TypeScript",
          jsx: "JSX / TSX",
          html: "HTML",
          css: "CSS",
          python: "Python",
          java: "Java",
          csharp: "C#",
          go: "Go",
          php: "PHP",
          sql: "SQL",
          bash: "Bash / Shell",
          json: "JSON",
          yaml: "YAML",
          markdown: "Markdown",
          dockerfile: "Dockerfile",
        },
      },
      githelper: {
        title: "Git Command Helper",
        description:
          "Quickly copy common Git commands or test and save your own.",
        commonCommandsTitle: "Common Commands:",
        customCommandTitle: "Custom Command:",
        placeholder:
          "Type your Git command here (e.g., git checkout -b new-branch)",
        clearCustomTitle: "Clear custom command",
        errorEmpty: "The custom command cannot be empty.",
        copyAndSaveButton: "Copy and Save",
        copySuccess: "Command Copied!",
        copyError: "Error Copying",
        commands: {
          init: "Initializes a new Git repository.",
          add: "Adds all changes to the staging area.",
          commit: "Saves the changes to the repository.",
          status: "Shows the status of the changes.",
          push: "Uploads local commits to the remote repository.",
          pull: "Fetches and merges changes from the remote repository.",
          log: "Shows the commit history in a concise way.",
        },
      },

      gitignore: {
        title: "Gitignore Generator",
        subtitle:
          "Quickly create .gitignore files for your projects. Enter one or more languages or frameworks separated by commas.",
        label: "Languages / Frameworks",
        placeholder: "Ex: node,python,react,vscode",
        generate: "Generate",
        generating: "Generating...",
        clear: "Clear",
        outputTitle: "Generated Output:",
        aria: "Generated .gitignore file content",
      },
      jsoncsv: {
        title: "JSON ↔ CSV Converter",
        subtitle:
          "Paste your JSON or CSV content and choose the conversion direction.",
        inputLabel: "Input:",
        outputLabel: "Output:",
        toCSV: "JSON → CSV",
        toJSON: "CSV → JSON",
        clear: "Clear all",
        placeholder: `Paste JSON or CSV here. Examples:\nJSON: [{ "id": 1, "value": "abc" }]\nCSV: id,value\\n1,abc`,
        errors: {
          emptyInput: "❌ The input field is empty.",
          invalidJSON:
            "Input must be a JSON array of objects or a single JSON object.",
          noHeader: "The CSV is missing a header line.",
          csvConversion: "❌ Error converting to CSV",
          jsonConversion: "❌ Error converting to JSON",
        },
      },
      minifier: {
        title: "Code Minifier",
        subtitle:
          "Reduce the size of your HTML, CSS or JavaScript code to optimize load time.",
        inputLabel: "Original Code:",
        outputLabel: "Minified Code:",
        languageLabel: "Language:",
        button: "Minify Code",
        processing: "Minifying...",
        clear: "Clear all",
        placeholder: {
          html: "Paste your HTML code here",
          css: "Paste your CSS code here",
          js: "Paste your JS code here",
        },
        errors: {
          empty: "❌ Code field is empty.",
          minifyFail: "❌ Error minifying: ",
        },
      },
      HelpPanel: {
        title: "Recent History",
        clearButton: "Clear",
        clearTitle: "Clear history",
        useEntry: "Use this entry",
      },
      title: "Quick Start Guide",
      button: "Need help?",
      basicUsageTitle: "Basic Usage",
      basicUsage: [
        "Select a tool from the main screen.",
        "Enter data or code in the input area.",
        "Click the main button to run the tool.",
        "View, copy or download the generated result.",
      ],
      persistenceTitle: "History and Persistence",
      persistence: [
        "Input history is saved locally in the browser.",
        "Snippets are automatically saved and restored when you return.",
      ],
      snippetsTitle: "Snippets Configuration",
      snippets: [
        "Use Export Snippets to save your snippets to a .json file.",
        "Use Import Snippets to load them from a .json file.",
      ],
      shortcutTitle: "Keyboard Shortcut",
      shortcutInstruction: "Press ESC to close this help.",
    },

    popup: {
      readme: {
        title: "README Generator",
        details:
          "This tool guides you to create a professional README.md file. Fill in the form fields and the content will be generated automatically in the preview.",
      },
      gitignore: {
        title: ".gitignore Generator",
        details:
          "Avoid uploading unnecessary files to your repository. Type in the names of the technologies, frameworks, or operating systems (separated by commas, e.g., `node,react,macos`) to generate an optimized .gitignore file.",
      },
      jsoncsv: {
        title: "JSON ↔ CSV Converter",
        details:
          "Paste your data in JSON format (an array of objects) or CSV (with headers in the first line) in the input area. Then press the button in the direction you want to convert.",
      },
      minifier: {
        title: "Code Minifier",
        details:
          "Reduce your code size to optimize your site's load time. Select the language (HTML, CSS, or JS), paste your code, and click 'Minify'.",
      },
      githelper: {
        title: "Git Command Helper",
        details:
          "A list of the most used Git commands so you can quickly copy them. You can also save your custom commands in the history.",
      },
      snippeteditor: {
        title: "Snippet Editor",
        details:
          "Your personal code snippet library. Save, manage, and reuse your most frequent snippets. All data is stored in your browser.",
      },
      default: {
        title: "General Help",
        details:
          "Hover over elements or select a tool to get contextual help. You can close this window using the 'Esc' key.",
      },
      closeLabel: "Close help",
      checkboxLabel: "Don't show this again",
    },
    footer: {
      credits: "Developed by Iker Domínguez.",
      description: "Tools to optimize your development workflow.",
    },
    toolDescriptions: {
      readme: {
        title: "README.md Generator",
        description: "Create professional and well-structured README files.",
      },
      gitignore: {
        title: ".gitignore Generator",
        description: "Generate optimized .gitignore files for your project.",
      },
      jsoncsv: {
        title: "JSON ↔ CSV Converter",
        description: "Convert data between JSON and CSV formats.",
      },
      minifier: {
        title: "Code Minifier",
        description: "Reduce the size of your HTML, CSS, and JavaScript.",
      },
      githelper: {
        title: "Git Command Helper",
        description: "Quickly access and copy common Git commands.",
      },
      snippeteditor: {
        title: "Snippet Editor",
        description: "Create, save, and manage reusable code snippets.",
      },
    },
    download: "Download",
    copy: {
      button: "Copy ",
      success: "Copied!",
      error: "Failed to copy",
    },

    errors: {
      emptyInput: "Please enter one or more languages/frameworks.",
      loadLanguages: "Failed to load language list. Status:",
      detail: "Detail",
      templateNotFound: "Template not found for",
      serverError: "Server error:",
      htmlReturned: "Unexpected HTML page returned by API for",
      partialNotFound: "One or more templates not found for",
      general: "An error occurred while generating the .gitignore file.",
    },
  },
};
