import { useState, useCallback } from 'react'

export const useLoading = (initial = false) => {
  const [loading, setLoading] = useState(initial)
  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      setLoading(true)
      try {
        return await fn()
      } finally {
        setLoading(false)
      }
    },
    []
  )
  return { loading, setLoading, withLoading }
}
