import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router, RouterProvider } from '@tanstack/react-router'
import { rootRoute } from '@/routes/root'
import routes from '@/routes'

const routeTree = rootRoute.addChildren(routes)

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
