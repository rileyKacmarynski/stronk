import { Route as rootRoute } from './routes/__root'
import { Route as SignUpImport } from './routes/sign-up'
import { Route as LogoutImport } from './routes/logout'
import { Route as LoginImport } from './routes/login'
import { Route as AuthedImport } from './routes/_authed'
import { Route as AuthedappImport } from './routes/_authed._app'
import { Route as AuthedappIndexImport } from './routes/_authed/_app'

const SignUpRoute = SignUpImport.update({
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any)

const LogoutRoute = LogoutImport.update({
  path: '/logout',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthedRoute = AuthedImport.update({
  id: '/_authed',
  getParentRoute: () => rootRoute,
} as any)

const AuthedappRoute = AuthedappImport.update({
  id: '/_app',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedappIndexRoute = AuthedappIndexImport.update({
  path: '/',
  getParentRoute: () => AuthedappRoute,
} as any)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authed': {
      preLoaderRoute: typeof AuthedImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/logout': {
      preLoaderRoute: typeof LogoutImport
      parentRoute: typeof rootRoute
    }
    '/sign-up': {
      preLoaderRoute: typeof SignUpImport
      parentRoute: typeof rootRoute
    }
    '/_authed/_app': {
      preLoaderRoute: typeof AuthedappImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/_app/': {
      preLoaderRoute: typeof AuthedappIndexImport
      parentRoute: typeof AuthedappImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  AuthedRoute.addChildren([AuthedappRoute.addChildren([AuthedappIndexRoute])]),
  LoginRoute,
  LogoutRoute,
  SignUpRoute,
])
