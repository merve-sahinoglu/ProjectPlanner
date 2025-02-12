/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_FACILITY_CODE: string;
  readonly VITE_FACILITY_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
