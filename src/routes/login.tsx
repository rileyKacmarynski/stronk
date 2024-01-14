import { Card, CardContent } from '@/components/ui/card'
import z from 'zod'
import { FileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const authSearchSchema = z.object({
  redirect: z.string().optional(),
})
export type AuthSearch = z.infer<typeof authSearchSchema>
export const Route = new FileRoute('/login').createRoute({
  component: AuthForm,
  validateSearch: authSearchSchema,
  beforeLoad: async ({ context: { authService } }) => {
    const session = await authService.getSession()

    console.log('session in route', session)

    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
})

const signUpSchema = z.object({
  email: z.string(),
  password: z.string(),
})
export default function AuthForm() {
  const { redirect } = Route.useSearch()
  const { authService } = Route.useRouteContext()
  const navigate = useNavigate({ from: '/login' })
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const res = await authService.login(values)
    if (res.error) {
      toast.error(res.error.message)
    }

    navigate({ to: redirect ?? '/' })
  }

  return (
    <div className="grid min-h-dvh place-items-center">
      <Card className="w-[380px]">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your email address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center gap-1 pt-4">
                <Button className="w-full" type="submit">
                  Log in
                </Button>
                <Button asChild variant="link" className="h-auto p-0 mt-4 text-zinc-400">
                  <Link to="/sign-up">Don't have an account? Sign up</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
