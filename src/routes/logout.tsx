import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/logout')({
  beforeLoad: async ({ context }) => {
    await context.authService.logout()

    throw redirect({
      to: '/login',
    })
  },
})
