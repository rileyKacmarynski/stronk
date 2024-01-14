import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { Credentials } from '@/lib/auth/auth-service'
import { cn } from '@/lib/utils'
import { AuthResponse, Session } from '@supabase/supabase-js'
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
    <>
      <main>
        <div
          className={cn('min-h-dvh font-sans antialiased bg-background text-foreground')}
        >
          <Outlet />
          <Suspense fallback="loading devtools...">
            <TanStackRouterDevtools />
          </Suspense>
        </div>
      </main>
      <Toaster />
      <TailwindIndicator />
    </>
  )
}

type AuthService = {
  getSession: () => Promise<Session | null>
  logout: () => Promise<void>
  login: (credentials: Credentials) => Promise<AuthResponse>
  signUp: (credentials: Credentials) => Promise<AuthResponse>
}

interface RouterContext {
  authService: AuthService
  session: Session | null
}

export const Route = rootRouteWithContext<RouterContext>()({ component: RootLayout })
