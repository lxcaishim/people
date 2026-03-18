/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOKEN_MINT?: string;
  readonly VITE_PUMP_FUN_URL?: string;
  readonly VITE_FOOTER_X_URL?: string;
  readonly VITE_CA_DISPLAY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
