import { FileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useTailwindMediaQuery } from '@/lib/utils'
import AuthProvider from '@/components/providers/auth-provider'
import MobileLayout from '@/routes/-components/mobile-layout'

export const Route = new FileRoute('/_app').createRoute({
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

    return {
      session,
    }
  },
  component: () => (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  ),
})

function AppLayout() {
  const matches = useTailwindMediaQuery('md')

  return matches ? <MobileLayout /> : <MobileLayout />
}


function DesktopLayout() {
  return (
    <div data-testid="layout">
      <p>desktop layout</p>
      <Outlet />
    </div>
  )
}
