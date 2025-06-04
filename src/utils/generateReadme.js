// src/utils/generateReadme.js

export function generateReadme({
  title,
  description,
  installation, // Renamed for clarity
  usage,
  contributing, // Added new section
  tests, // Added new section
  license,
  githubUsername, // For badges/links
  repoName, // For badges/links
  author, // Added new section
  projectVersion, // For potential badges or info
}) {
  // Basic validation or default values
  const safeTitle = title || "Título del Proyecto";
  const safeDescription = description || "Una breve descripción del proyecto.";
  const safeLicense = license || "MIT"; // Default to MIT if not provided

  // Construct sections only if they have content
  const sections = [];

  sections.push(`# ${safeTitle}`);

  // License Badge (example using shields.io)
  if (githubUsername && repoName && safeLicense) {
    sections.push(
      `\n[![License: ${safeLicense}](https://img.shields.io/github/license/${githubUsername}/${repoName}.svg)](https://opensource.org/licenses/${safeLicense})`
    );
  } else if (safeLicense) {
    sections.push(
      `\n[![License: ${safeLicense}](https://img.shields.io/badge/License-${safeLicense.replace(
        "-",
        "--"
      )}-blue.svg)](https://opensource.org/licenses/${safeLicense})`
    );
  }

  if (projectVersion) {
    sections.push(
      `[![Version](https://img.shields.io/badge/version-${projectVersion}-blue.svg)]()`
    ); // The link can be to release page
  }

  sections.push(`\n## Descripción\n${safeDescription}`);

  // Table of Contents (simple version)
  const toc = [];
  if (installation) toc.push(`[Instalación](#instalación)`);
  if (usage) toc.push(`[Uso](#uso)`);
  if (contributing) toc.push(`[Contribuciones](#contribuciones)`);
  if (tests) toc.push(`[Pruebas](#pruebas)`);
  if (safeLicense) toc.push(`[Licencia](#licencia)`);
  if (author) toc.push(`[Autor](#autor)`);

  if (toc.length > 0) {
    sections.push(`\n## Tabla de Contenidos`);
    toc.forEach((item) => sections.push(`- ${item}`));
  }

  if (installation) {
    sections.push(
      `\n## Instalación\n\nSigue estos pasos para instalar el proyecto:\n\`\`\`bash\n${installation}\n\`\`\``
    );
  }

  if (usage) {
    sections.push(
      `\n## Uso\n\nPara utilizar este proyecto, ejecuta:\n\`\`\`bash\n${usage}\n\`\`\``
    );
  }

  if (contributing) {
    sections.push(
      `\n## Contribuciones\n\n${
        contributing ||
        "Las contribuciones son bienvenidas. Por favor, sigue las directrices habituales para pull requests."
      }`
    );
  }

  if (tests) {
    sections.push(
      `\n## Pruebas\n\nPara ejecutar las pruebas, usa el siguiente comando:\n\`\`\`bash\n${tests}\n\`\`\``
    );
  }

  if (safeLicense) {
    sections.push(
      `\n## Licencia\n\nEste proyecto está bajo la Licencia ${safeLicense}.`
    );
    // Consider adding a link to the license file or a standard license text.
    // Example: sections.push(`Ver el archivo [LICENSE.md](LICENSE.md) para más detalles.`);
  }

  if (author) {
    sections.push(`\n## Autor\n\n- **${author}**`);
    if (githubUsername) {
      sections.push(
        `  - GitHub: [@${githubUsername}](https://github.com/${githubUsername})`
      );
    }
  }

  // Add a "Built With" section or "Acknowledgements" if needed.

  return sections.join("\n\n").trim() + "\n"; // Ensure a trailing newline
}
