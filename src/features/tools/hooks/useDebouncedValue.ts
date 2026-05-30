import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay = 260) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => window.clearTimeout(timerId)
  }, [delay, value])

  return debouncedValue
}
