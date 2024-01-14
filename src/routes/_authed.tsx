import AuthProvider from '@/components/providers/auth-provider'
import { FileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = new FileRoute('/_authed').createRoute({
  beforeLoad: async ({ context: { authService } }) => {
    const session = await authService.getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname === '/' ? undefined : location.pathname,
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
