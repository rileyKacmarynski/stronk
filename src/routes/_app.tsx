import { FileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { useTailwindMediaQuery } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Clock3, Dumbbell, Plus, User } from 'lucide-react'
import React from 'react'
import AuthProvider from '@/components/providers/auth-provider'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = new FileRoute('/_app').createRoute({
  beforeLoad: async ({ context: { authService } }) => {
    const session = await authService.getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname === '/' ? undefined : location.pathname,
        },
      })
    }

    return {
      session,
    }
  },
  component: () => (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  ),
})

function AppLayout() {
  console.log('in App layout')
  const matches = useTailwindMediaQuery('md')

  return matches ? <DesktopLayout /> : <MobileLayout />
}

function MobileLayout() {
  return (
    <div data-testid="layout flex flex-column">
        <ScrollArea className="h-[calc(100dvh-57px)] pb-4">
          <Outlet />
        </ScrollArea>
      <nav className="bg-background w-full border-border border-t py-1 fixed bottom-0 shadow-[0_-1px_3px_0_rgba(0,0,0,0.5),0_-1px_2px_-1px_rgba(0,0,0,0.5)]">
        <ul className="max-w-[380px] mx-auto flex gap-2 justify-between">
          <li>
            <NavLink to="/profile">
              <>
                <User className="size-5" /> Profile
              </>
            </NavLink>
          </li>
          <li>
            <NavLink to="/history">
              <>
                <Clock3 className="size-5" /> History
              </>
            </NavLink>
          </li>
          <li>
            <NavLink to="/">
              <>
                <Plus className="size-5" /> Workout
              </>
            </NavLink>
          </li>
          <li>
            <NavLink to="/exercises">
              <>
                <Dumbbell className="size-5" /> Exercises
              </>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">
              <>
                <span className="text-2xl font-bold leading-none">?</span> About
              </>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

function NavLink({
  children,
  ...linkProps
}: { children: React.ReactNode } & Omit<
  React.ComponentProps<typeof Link>,
  'activeProps' // trying to add a class this way is pain
>) {
  return (
    <Button
      asChild
      className="size-12 p-0 flex bg-background data-[status='active']:text-primary font-normal text-xs hover:bg-background text-muted-foreground flex-col gap-0.5 transition"
    >
      <Link {...linkProps}>{children}</Link>
    </Button>
  )
}

function DesktopLayout() {
  return (
    <div data-testid="layout">
      <p>desktop layout</p>
      <Outlet />
    </div>
  )
}
