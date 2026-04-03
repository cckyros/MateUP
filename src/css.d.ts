// CSS module declarations for TypeScript
declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
  export = classes
}
