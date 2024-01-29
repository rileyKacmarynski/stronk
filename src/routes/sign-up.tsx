import { Card, CardContent } from '@/components/ui/card'
import { z } from 'zod'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const authSearchSchema = z.object({
  redirect: z.string().optional(),
})
export type AuthSearch = z.infer<typeof authSearchSchema>
export const Route = createFileRoute('/sign-up')({
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

const signUpSchema = z.object({
  email: z.string().email({ message: 'must be a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'password must be greater than 6 characters.' })
    .max(72, { message: 'password must be less than 72 characters.' }),
})

export default function AuthForm() {
  const { authService } = Route.useRouteContext()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const { error } = await authService.signUp(values)
    if (error) {
      toast.error('Error Signing Up', {
        description: 'Unable to create account. Try again later.',
      })

      return
    }

    toast.success('Check your inbox', {
      description: `Confirmation email send to ${values.email}.`,
    })
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
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center gap-1 pt-4">
                <Button className="w-full" type="submit">
                  Sign up
                </Button>
                <Button asChild variant="link" className="p-0 text-zinc-400">
                  <Link to="/login">Already have an account? Sign in</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
