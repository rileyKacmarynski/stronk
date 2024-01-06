import AuthProvider from '@/components/providers/auth-provider'
import supabase from '@/lib/data/db'
import { rootRoute } from '@/routes/root'
import { Outlet, Route, redirect } from '@tanstack/react-router'

export const authedRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  // TODO: use route context for DI eventually
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      throw redirect({
        to: 'login',
        params: { page: 'login' },
        search: {
          redirect: location.href,
        },
      })
    }

    return {
      session: data.session,
    }
  },
  component: () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  ),
})
