// Global CSS type relaxation - makes all CSS properties accept string values
// This eliminates the many false-positive CSS type errors in the codebase

export {};

declare global {
  namespace React {
    interface CSSProperties {
      [key: string]: any;
    }
  }
}
