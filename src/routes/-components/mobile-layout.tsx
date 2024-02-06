import { Button } from '@/components/ui/button'
import Typography from '@/components/ui/typography'
import { PageHeaderProps } from '@/routes/-components/page-header'
import { Link, Outlet } from '@tanstack/react-router'
import { useScroll, useTransform, useSpring, motion } from 'framer-motion'
import { User, Clock3, Plus, Dumbbell } from 'lucide-react'
import { RefObject, createContext, useContext, useRef } from 'react'
import CurrentWorkout, { useDrawerStore } from '@/routes/_app/-current-workout'
import { cn } from '@/lib/utils'
import { currentWorkoutQueries } from '@/routes/_app/-current-workout/queries'
import { useQuery } from '@tanstack/react-query'

type ContextValue = {
  scrollRef: RefObject<HTMLDivElement>
}
const LayoutContext = createContext<ContextValue | null>(null)

function useLayoutContext() {
  const context = useContext(LayoutContext)
  if (!context) throw new Error('LayoutContext must be used inside a provider')

  return context
}

export default function MobileLayout() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isOpen = useDrawerStore((store) => store.isOpen)
  const currentWorkout = useQuery(currentWorkoutQueries.currentWorkout())

  return (
    <div data-testid="layout" className="flex flex-col h-dvh">
      <div ref={scrollRef} className="h-[calc(100%-57px)] overflow-auto">
        <LayoutContext.Provider value={{ scrollRef }}>
          <Outlet />
        </LayoutContext.Provider>
      </div>
      <CurrentWorkout />
      <nav
        className={cn(
          'bg-background z-50 w-full border-border border-t py-1 fixed bottom-0 transition-all delay-200 shadow-[0_-1px_3px_0_rgba(0,0,0,0.5),0_-1px_2px_-1px_rgba(0,0,0,0.5)]',
          currentWorkout.data && {
            'border-border': isOpen,
            'border-transparent shadow-none delay-0': !isOpen,
          }
        )}
      >
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

function MobileHeader({ title, children, actions }: PageHeaderProps) {
  const { scrollRef } = useLayoutContext()
  const { scrollY } = useScroll({ container: scrollRef, layoutEffect: false })
  const progress = useTransform(scrollY, [0, 54, 64], [0, 0, 1])
  const opacity = useSpring(progress)

  return (
    <>
      <div className="container sticky top-0 z-20 h-12 shadow-md bg-background shadow-zinc-950">
        {actions}
        <motion.div style={{ opacity }}>
          <Typography
            className="absolute inline font-semibold transition -translate-x-1/2 top-3 left-1/2"
            aria-hidden
            as="p"
          >
            {title}
          </Typography>
        </motion.div>
      </div>
      <Typography className="container z-10 pt-2 pb-6" variant="h1">
        {title}
      </Typography>
      <div className="sticky z-20 space-y-4 shadow-md top-12 bg-background shadow-zinc-950 ">
        {children}
        <motion.div style={{ opacity }} className="w-full h-[1px] bg-muted" />
      </div>
    </>
  )
}

MobileLayout.PageHeader = MobileHeader

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
