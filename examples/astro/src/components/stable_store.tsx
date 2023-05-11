import { stableStore } from 'examples-library'
import { createContext, useContext, useEffect, useState } from 'react'

export const StableStoreContext = createContext(stableStore)

export function useStableStore() {
  return useContext(StableStoreContext)
}

export function StableStoreDisplay() {
  const store = useStableStore()
  const [count, setCount] = useState(store.get().count)
  useEffect(() => {
    store.onSet((state) => setCount(state.count))
  }, [])
  return <div>Count: {count}</div>
}

export function StableStoreIncrement() {
  const store = useStableStore()
  return <button className='border p-1 bg-slate-300'
    onClick={() => store.set({ count: store.get().count + 1 })}>Increment</button>
}

