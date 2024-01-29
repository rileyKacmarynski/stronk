import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { Credentials } from '@/lib/auth/auth-service'
import { cn } from '@/lib/utils'
import { AuthResponse, Session } from '@supabase/supabase-js'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import React from 'react'
import { Suspense } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
      <main
        className={cn('font-sans h-full antialiased bg-background text-foreground')}
      >
        <Outlet />
        <Suspense fallback="loading devtools...">
          <TanStackRouterDevtools />
        </Suspense>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
          position="right"
        />
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
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout })
