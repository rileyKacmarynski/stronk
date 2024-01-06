import AuthProvider from '@/components/providers/auth-provider'
import { rootRoute } from '@/routes/root'
import { Outlet, Route, redirect } from '@tanstack/react-router'

export const authedRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  beforeLoad: async ({ context: { authService } }) => {
    const session = await authService.getSession()

    if (!session) {
      throw redirect({
        to: 'login',
        search: {
          redirect: location.href,
        },
      })
    }

    // from here on out we'll just have session
    return {
      session,
    }
  },
  component: () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  ),
})
