import supabase from '@/lib/data/db'
import AuthProvider from './auth-provider'
import { Outlet, Route, redirect } from '@tanstack/react-router'
import { rootRoute } from '@/main'
import { signUpRoute } from './sign-up'
import { forgotPasswordRoute } from './forgot-password'
import { loginRoute } from './login'

// still playing around with this
// might be nice to have the routes by the component

export const ensureAuthRoute = new Route({
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

export const authRoutes = [
  loginRoute,
  signUpRoute,
  forgotPasswordRoute,
  ensureAuthRoute,
] as const
