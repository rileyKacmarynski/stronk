import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorComponent, Router, RouterProvider } from '@tanstack/react-router'
import authService from '@/lib/auth/auth-service'
import { routeTree } from '@/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PageLoader from '@/routes/-components/page-loader'

export const queryClient = new QueryClient()

const router = new Router({
  routeTree,
  defaultPendingComponent: PageLoader,
  defaultErrorComponent: ({error}) => {
    return <ErrorComponent error={error} />
  },
  context: {
    session: null,
    queryClient,
    authService,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
