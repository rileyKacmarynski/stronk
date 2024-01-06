import { Route, redirect } from '@tanstack/react-router'
import { rootRoute } from '@/routes/root'

export const logoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'logout',
  beforeLoad: async ({ context }) => {
    await context.authService.logout()

    throw redirect({
      to: '/login',
    })
  },
})
