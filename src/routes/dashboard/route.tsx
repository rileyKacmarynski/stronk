import { useSession } from '@/components/providers/auth-provider'
import { mainLayoutRoute } from '../layout'
import Typography from '@/components/ui/typography'
import { Route } from '@tanstack/react-router'

export const dashboardRoute = new Route({
  getParentRoute: () => mainLayoutRoute,
  path: '/',
  component: Dashboard,
})

function Dashboard() {
  const session = useSession()

  return (
    <Typography as="h1" variant="h1">
      Hello from {session.user.email}
    </Typography>
  )
}
