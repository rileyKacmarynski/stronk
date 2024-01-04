import { Card, CardContent } from '@/components/ui/card'
import { rootRoute } from '@/main'
import z from 'zod'
import { Route } from '@tanstack/react-router'
import AuthUi from './auth-ui'

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
})

export default function AuthForm() {
  const { redirect } = loginRoute.useSearch()

  return (
    <div className="min-h-dvh grid place-items-center">
      <Card className="w-[380px]">
        <CardContent>
          <AuthUi view="sign_in" redirect={redirect} />
        </CardContent>
      </Card>
    </div>
  )
}
