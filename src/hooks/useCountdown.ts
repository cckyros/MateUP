// ============================================================
// useCountdown - 倒计时 hook
// ============================================================
import { useState, useEffect, useRef } from 'react'

export function useCountdown(seconds: number, onComplete?: () => void) {
  const [countdown, setCountdown] = useState(seconds)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current)
      onCompleteRef.current?.()
      return
    }

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          onCompleteRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [countdown])

  const restart = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(seconds)
  }

  return { countdown, restart }
}