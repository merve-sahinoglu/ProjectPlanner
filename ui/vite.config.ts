import ViteYaml from "@modyfi/vite-plugin-yaml";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import svgr from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/ag-grid")) {
            return "ag-grid";
          }
          if (id.includes("node_modules/@mantine")) {
            return "mantine";
          }
          if (id.includes("node_modules/@tiptap")) {
            return "tiptap";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    viteTsconfigPaths(),
    svgr(),
    eslintPlugin(),
    visualizer({ template: "treemap" }) as PluginOption,
    ViteYaml(),
    basicSsl(),
  ],
  server: {
    host: "0.0.0.0",
    open: true,
    port: 3000,
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@shared/types": path.resolve(__dirname, "./src/types/"),
      "@components": path.resolve(__dirname, "./src/components/"),
      "@hooks": path.resolve(__dirname, "./src/hooks/"),
      "@enums": path.resolve(__dirname, "./src/enums/"),
      "@constants": path.resolve(__dirname, "./src/constants/"),
      "@assets": path.resolve(__dirname, "./src/assets/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@helpers": path.resolve(__dirname, "./src/helpers/"),
      "@pages": path.resolve(__dirname, "./src/pages/"),
      "@features": path.resolve(__dirname, "./src/features/"),
    },
  },
});
