import { Outlet, Route } from '@tanstack/react-router'
import { authedRoute } from '@/routes/auth/index'

export const mainLayoutRoute = new Route({
  getParentRoute: () => authedRoute,
  id: 'app-layout',
  component: AppLayout,
})

function AppLayout() {
  return (
    <div>
      <p>layout</p>
      <Outlet />
    </div>
  )
}
