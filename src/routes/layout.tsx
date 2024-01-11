import { Link, Outlet, Route } from '@tanstack/react-router'
import { authedRoute } from '@/routes/auth/index'
import { useTailwindMediaQuery } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Clock3, Dumbbell, Plus, User } from 'lucide-react'
export const mainLayoutRoute = new Route({
  getParentRoute: () => authedRoute,
  id: 'app-layout',
  component: AppLayout,
})

function AppLayout() {
  const matches = useTailwindMediaQuery('md')

  return matches ? <DesktopLayout /> : <MobileLayout />
}

function MobileLayout() {
  return (
    <div>
      <p>mobile layout</p>
      <section className="pt-[900px] h-[1000px]">
        <Outlet />
      </section>
      <nav className="bg-background w-full fixed bottom-0 shadow-[0_-1px_3px_0_rgba(0,0,0,0.5),0_-1px_2px_-1px_rgba(0,0,0,0.5)]">
        <ul className="max-w-[380px] mx-auto flex gap-2 justify-between">
          <li>
            <NavButton>
              <Link>
                <User className="size-6" /> Profile
              </Link>
            </NavButton>
          </li>
          <li>
            <NavButton>
              <Link>
                <Clock3 className="size-6" /> Profile
              </Link>
            </NavButton>
          </li>
          <li>
            <NavButton>
              <Link>
                <Plus className="size-6" /> Workout
              </Link>
            </NavButton>
          </li>
          <li>
            <NavButton>
              <Link>
                <Dumbbell className="size-6" /> Exercises
              </Link>
            </NavButton>
          </li>
          <li>
            <NavButton>
              <Link>
                <span className="font-bold text-2xl leading-none">?</span> About
              </Link>
            </NavButton>
          </li>
        </ul>
      </nav>
    </div>
  )
}

function NavButton({
  children,
  active,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Button
      asChild
      className="size-12 p-0 flex bg-background font-normal text-xs hover:bg-background text-muted-foreground flex-col gap-0.5"
    >
      {children}
    </Button>
  )
}

function DesktopLayout() {
  return (
    <div>
      <p>desktop layout</p>
      <Outlet />
    </div>
  )
}
