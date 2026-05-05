'use client'

import { createContext, useContext, useTransition } from 'react'

interface Ctx {
  isPending: boolean
  startTransition: (cb: () => void) => void
}

const TransitionCtx = createContext<Ctx>({
  isPending: false,
  startTransition: (cb) => cb(),
})

/* Shared transition state for navigation-triggering components on a page.
   Wrap a page in this provider; child components use useAppTransition() to
   wrap their router.push() calls and to read isPending for fade animations. */
export function AppTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition()
  return (
    <TransitionCtx.Provider value={{ isPending, startTransition }}>
      {children}
    </TransitionCtx.Provider>
  )
}

export function useAppTransition() {
  return useContext(TransitionCtx)
}
