import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router, RouterProvider } from '@tanstack/react-router'
import { rootRoute } from '@/routes/root'
import routes from '@/routes'
import authService from '@/lib/auth/auth-service'

// @ts-expect-error have no idea here
const routeTree = rootRoute.addChildren(routes)

const router = new Router({
  routeTree,
  context: {
    session: null,
    authService,
  },
})

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
