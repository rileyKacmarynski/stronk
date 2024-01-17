import { Route as rootRoute } from './routes/__root'
import { Route as SignUpImport } from './routes/sign-up'
import { Route as LogoutImport } from './routes/logout'
import { Route as LoginImport } from './routes/login'
import { Route as AppImport } from './routes/_app'
import { Route as AppIndexImport } from './routes/_app/index'
import { Route as AppExercisesImport } from './routes/_app/exercises'

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

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  path: '/',
  getParentRoute: () => AppRoute,
} as any)

const AppExercisesRoute = AppExercisesImport.update({
  path: '/exercises',
  getParentRoute: () => AppRoute,
} as any)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      preLoaderRoute: typeof AppImport
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
    '/_app/exercises': {
      preLoaderRoute: typeof AppExercisesImport
      parentRoute: typeof AppImport
    }
    '/_app/': {
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  AppRoute.addChildren([AppExercisesRoute, AppIndexRoute]),
  LoginRoute,
  LogoutRoute,
  SignUpRoute,
])
