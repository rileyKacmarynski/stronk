import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { currentWorkoutQueries } from './queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion'
import { useRef } from 'react'
import { format } from 'date-fns'

const Route = getRouteApi('/_app')

export default function CurrentWorkout() {
  const navigate = useNavigate()
  const { showCurrentWorkout } = Route.useSearch()
  const { data: workout } = useSuspenseQuery(currentWorkoutQueries.currentWorkout())

  const collapsedHeight = '161px'
  function toggleDrawer() {
    navigate({
      search: (s) => ({
        ...s,
        showCurrentWorkout: showCurrentWorkout ? undefined : true,
      }),
      mask: {
        search: (s) => ({
          ...s,
          showCurrentWorkout: undefined,
        }),
      },
    })
  }

  console.log('workout', workout)

  // trying to update state in animation frame is a bad idea
  const timerRef = useRef<HTMLSpanElement>(null)
  useAnimationFrame(() => {
    if (!timerRef.current || !workout) return

    const started = new Date(workout.started_at)
    // @ts-expect-error why does typescript not like this?
    const elapsed = new Date() - started
    timerRef.current.innerHTML = format(elapsed, 'h:mm:ss')
  })

  return (
    <AnimatePresence initial={false}>
      {workout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Drawer
            modal={false}
            open={true}
            dismissible={false}
            snapPoints={[collapsedHeight, 1]}
            activeSnapPoint={showCurrentWorkout ? 1 : collapsedHeight}
            setActiveSnapPoint={toggleDrawer}
          >
            <DrawerContent onDoubleClick={toggleDrawer} className="p-b-[57px]">
              <div
                className={cn('w-full mx-auto', {
                  'overflow-y-auto': showCurrentWorkout,
                  'overflow-y-hidden': !showCurrentWorkout,
                })}
              >
                <DrawerHeader>
                  <DrawerTitle>{workout.title}</DrawerTitle>
                  <DrawerDescription className="font-mono text-lg font-medium">
                    <span ref={timerRef}>Set your daily activity goal.</span>
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-center space-x-2">
                    this is some content
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <Button onClick={toggleDrawer} variant="outline">
                    Cancel
                  </Button>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
