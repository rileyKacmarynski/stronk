import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { cn } from './lib/utils.ts'
import { Outlet, RootRoute, Router, Route, RouterProvider } from '@tanstack/react-router'

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
        className={cn('min-h-screen font-sans antialiased bg-background text-foreground')}
      >
        <p>layout</p>
        <Outlet />
        <Suspense fallback="loading devtools...">
          <TanStackRouterDevtools />
        </Suspense>
      </div>
    </main>
  )
}
const rootRoute = new RootRoute({ component: RootLayout })

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = new Router({ routeTree })

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
