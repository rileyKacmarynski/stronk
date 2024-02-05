import { Session } from '@supabase/supabase-js'
import { Navigate } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/lib/data/db'
// ehhh, this is a little weird
import { Route } from '@/routes/_app'

const SessionContext = createContext<Session | null>(null)

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('UseSession must be used inside an <AuthProvider />')
  }

  return context
}

// I think I have to use a provider here so I can
// subscribe to realtime changes from supabase
function AuthProvider({ children }: { children: React.ReactNode }) {
  const context = Route.useRouteContext()
  const [session, setSession] = useState<Session | null>(context.session)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return data.subscription.unsubscribe
  }, [])

  useEffect(() => {
    setSession(context.session)
  }, [context.session])

  if (!session) {
    return (
      <Navigate
        to="/login"
        search={{
          redirect: location.href,
        }}
      />
    )
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

export default AuthProvider
