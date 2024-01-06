import { Card, CardContent } from '@/components/ui/card'
import z from 'zod'
import { Route, redirect } from '@tanstack/react-router'
import AuthUi from './auth-ui'
import { rootRoute } from '@/routes/root'

// TODO: test what happens if this throws
const authSearchSchema = z.object({
  redirect: z.string().optional(),
})
export type AuthSearch = z.infer<typeof authSearchSchema>
export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: AuthForm,
  validateSearch: authSearchSchema,
  beforeLoad: async ({ context: { authService } }) => {
    const session = await authService.getSession()

    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
})

export default function AuthForm() {
  // I guess this redirect stuff doesn't work anyways
  const { redirect } = loginRoute.useSearch()

  return (
    <div className="grid min-h-dvh place-items-center">
      <Card className="w-[380px]">
        <CardContent>
          <AuthUi view="sign_in" redirect={redirect} />
        </CardContent>
      </Card>
    </div>
  )
}
