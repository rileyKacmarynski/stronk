import { createContext, useContext } from 'react'

export type ModalContext = {}

const ModalContext = createContext<ModalContext | null>(null)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used inside an <ModalProvider />')
  }

  return context
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return <ModalContext.Provider value={null}>{children}</ModalContext.Provider>
}
