/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-svgr/client" />

// tsgo-only shims: astro check resolves these via the language server,
// but tsgo needs explicit module declarations.
declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js";
  const Component: AstroComponentFactory;
  export default Component;
}

declare module "@waline/client/style";

declare namespace NodeJS {
  interface ProcessEnv {
    /** Server-only public origin. Required only when Moments is enabled. */
    readonly KOHARU_SUITE_URL?: string;
  }
}
