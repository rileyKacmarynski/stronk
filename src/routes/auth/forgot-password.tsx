import { Card, CardContent } from '@/components/ui/card'
import z from 'zod'
import { Route } from '@tanstack/react-router'
import AuthUi from './auth-ui'
import { rootRoute } from '@/routes/root'

const authSearchSchema = z.object({
  redirect: z.string().optional(),
})
export type AuthSearch = z.infer<typeof authSearchSchema>
export const forgotPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'forgot-password',
  component: AuthForm,
  validateSearch: authSearchSchema,
})

export default function AuthForm() {
  const { redirect } = forgotPasswordRoute.useSearch()

  return (
    <div className="min-h-dvh grid place-items-center">
      <Card className="w-[380px]">
        <CardContent>
          <AuthUi view="forgotten_password" redirect={redirect} />
        </CardContent>
      </Card>
    </div>
  )
}
