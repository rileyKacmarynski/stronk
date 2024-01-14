import { FileRoute, redirect } from '@tanstack/react-router'

export const Route = new FileRoute('/logout').createRoute({
  beforeLoad: async ({ context }) => {
    await context.authService.logout()

    throw redirect({
      to: '/login',
    })
  },
})
