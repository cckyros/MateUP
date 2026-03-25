import { useCallback, useRef, useState } from 'react'

// ========== 分页加载 Hook ==========
interface UsePaginationOptions<T> {
  fetchFn: (params: { page: number; pageSize: number }) => Promise<{
    list: T[]
    total: number
    hasMore: boolean
  }>
  pageSize?: number
}

interface UsePaginationResult {
  list: T[]
  loading: boolean
  refreshing: boolean
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

export function usePagination<T>({
  fetchFn,
  pageSize = 20,
}: UsePaginationOptions<T>): UsePaginationResult {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const fetchingRef = useRef(false)

  const fetchData = useCallback(
    async (page: number, isRefresh = false) => {
      if (fetchingRef.current) return
      fetchingRef.current = true

      try {
        const result = await fetchFn({ page, pageSize })
        setList((prev) =>
          isRefresh ? result.list : [...prev, ...result.list]
        )
        setHasMore(result.hasMore)
        pageRef.current = page
      } finally {
        fetchingRef.current = false
      }
    },
    [fetchFn, pageSize]
  )

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    fetchData(pageRef.current + 1).finally(() => setLoading(false))
  }, [fetchData, loading, hasMore])

  const refresh = useCallback(() => {
    setRefreshing(true)
    pageRef.current = 1
    fetchData(1, true)
      .catch(console.error)
      .finally(() => setRefreshing(false))
  }, [fetchData])

  // 初始化
  useState(() => {
    setLoading(true)
    fetchData(1, true).finally(() => setLoading(false))
  })

  return { list, loading, refreshing, hasMore, loadMore, refresh }
}

// ========== 防抖 Hook ==========
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  const timerRef = useRef<NodeJS.Timeout>()

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => fn(...args), delay)
    },
    [fn, delay]
  )
}

// ========== WebSocket Hook ==========
interface UseWebSocketOptions {
  url: string
  onMessage?: (data: any) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(url)

    ws.onopen = () => {
      onOpen?.()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch {
        onMessage?.(event.data)
      }
    }

    ws.onclose = () => {
      onClose?.()
    }

    ws.onerror = (error) => {
      onError?.(error)
    }

    wsRef.current = ws
  }, [url, onMessage, onOpen, onClose, onError])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
  }, [])

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data))
    }
  }, [])

  return { connect, disconnect, send }
}
