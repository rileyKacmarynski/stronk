import { mainLayoutRoute } from './layout'
import dashboardRoutes from './dashboard'
import authRoutes from './auth'

export default [mainLayoutRoute, ...authRoutes, ...dashboardRoutes]
