// CSS type declaration - makes all style props accept any values
// Eliminates CSSProperties strict type checking noise
declare module 'react' {
  interface HTMLAttributes<T> {
    style?: any;
  }
  interface CSSProperties {
    [key: string]: any;
  }
}
