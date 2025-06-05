// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Si lo añadiste así, está bien. Otra forma común es como plugin de PostCSS.

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Asegúrate que Tailwind esté configurado correctamente en tu proyecto.
  ],
  server: {
    proxy: {
      // Cuando tu frontend pida algo a '/toptal-api/...'
      // Vite lo redirigirá a 'https://www.toptal.com/developers/gitignore/api/...'
      "/toptal-api": {
        target: "https://www.toptal.com/developers/gitignore/api",
        changeOrigin: true, // Esencial para que el servidor de Toptal acepte la petición del proxy
        rewrite: (path) => path.replace(/^\/toptal-api/, ""), // Elimina '/toptal-api' de la ruta antes de enviarla
      },
    },
  },
});
