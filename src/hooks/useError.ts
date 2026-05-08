import { useState, useCallback } from 'react'

export const useError = () => {
  const [error, setError] = useState<string | null>(null)
  const withError = useCallback(<T>(fn: () => Promise<T>): (() => Promise<T | undefined>) => {
    return async () => {
      try {
        setError(null)
        return await fn()
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || '操作失败'
        setError(msg)
        return undefined
      }
    }
  }, [])
  const clearError = useCallback(() => setError(null), [])
  return { error, setError: withError, clearError }
}
