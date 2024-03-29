import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useTailwindMediaQuery } from '@/lib/utils'
import AuthProvider from '@/components/providers/auth-provider'
import MobileLayout from '@/routes/-components/mobile-layout'
import z from 'zod'
import { currentWorkoutQueries } from '@/routes/_app/-current-workout/queries'

const layoutSearchSchema = z.object({
  showCurrentWorkout: z.boolean().optional().catch(false)
})

export const Route = createFileRoute('/_app')({
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
  validateSearch: layoutSearchSchema,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(currentWorkoutQueries.currentWorkout())
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
