import { Session } from '@supabase/supabase-js'
import { Navigate } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/lib/data/db'
import { authedRoute } from '@/routes/auth/authed'

const SessionContext = createContext<Session | null>(null)

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('UseSession must be used inside an <AuthProvider />')
  }

  return context
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const context = authedRoute.useRouteContext()
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

  // I think if we use this only in the `ensureAuthRoute`
  // this shouldn't ever be null.
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
