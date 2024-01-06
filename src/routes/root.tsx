import { cn } from '@/lib/utils'
import { Session } from '@supabase/supabase-js'
import { Outlet, rootRouteWithContext } from '@tanstack/react-router'
import React from 'react'
import { Suspense } from 'react'

const TanStackRouterDevtools =
  import.meta.env.MODE === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      )

function RootLayout() {
  return (
    <main className="dark">
      <div
        className={cn('min-h-dvh font-sans antialiased bg-background text-foreground')}
      >
        <Outlet />
        <Suspense fallback="loading devtools...">
          <TanStackRouterDevtools />
        </Suspense>
      </div>
    </main>
  )
}

type AuthService = {
  getSession: () => Promise<Session | null>
  logout: () => Promise<void>
}

interface RouterContext {
  authService: AuthService
  session: Session | null
}

export const rootRoute = rootRouteWithContext<RouterContext>()({ component: RootLayout })
