import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { cn } from './lib/utils.ts'
import {
  Outlet,
  rootRouteWithContext,
  Router,
  Route,
  RouterProvider,
} from '@tanstack/react-router'
import { Session } from '@supabase/supabase-js'
import { authRoutes, ensureAuthRoute } from '@/app/auth/routes'

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

interface RouterContext {
  session: Session | null
}

export const rootRoute = rootRouteWithContext<RouterContext>()({ component: RootLayout })

// This is a bit weird
export function AppLayout() {
  return (
    <div>
      <p>layout</p>
      <Outlet />
    </div>
  )
}
export const appLayoutRoute = new Route({
  getParentRoute: () => ensureAuthRoute,
  id: 'app-layout',
  component: AppLayout,
})

const indexRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([appLayoutRoute, indexRoute, ...authRoutes])

const router = new Router({ routeTree, context: { session: null } })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
