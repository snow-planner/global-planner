import { useCallback, useEffect, useState } from 'react'

function read<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : initial
  } catch {
    return initial
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState(() => ({ key, value: read(key, initial) }))

  // 키가 바뀌면(예: 새 계획) 그 키에 저장된 값을 다시 읽어요
  let current = state
  if (state.key !== key) {
    current = { key, value: read(key, initial) }
    setState(current)
  }

  useEffect(() => {
    try {
      localStorage.setItem(state.key, JSON.stringify(state.value))
    } catch {
      // 저장 실패해도 화면은 동작
    }
  }, [state])

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    setState((prev) => ({
      key: prev.key,
      value: typeof next === 'function' ? (next as (prev: T) => T)(prev.value) : next,
    }))
  }, [])

  return [current.value, setValue] as const
}
