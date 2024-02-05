import { Button, buttonVariants } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { currentWorkoutQueries } from './queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAnimationFrame } from 'framer-motion'
import {  useCallback, useRef } from 'react'
import { intervalToDuration } from 'date-fns'
import { useDeleteWorkout } from '@/lib/commands/workouts'
import { create } from 'zustand'

const collapsedHeight = '161px'

export type DrawerStore = {
  isOpen: boolean
  open(): void
  close(): void
  toggle(): void
}

export const useDrawerStore = create<DrawerStore>()((set) => ({
  isOpen: false,
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export default function CurrentWorkout() {
  const { data: workout } = useSuspenseQuery(currentWorkoutQueries.currentWorkout())
  const { isOpen, toggle, close } = useDrawerStore()

  // trying to update state in animation frame is a bad idea
  const timerRef = useRef<HTMLSpanElement>(null)
  useAnimationFrame(() => {
    if (!timerRef.current || !workout) return

    timerRef.current.innerHTML = durationFrom(new Date(workout.started_at))
  })

  const deleteWorkout = useDeleteWorkout()
  const cancelWorkout = useCallback((id: string) => {
    deleteWorkout.mutate(id)
    close()
  }, [])

  return (
    <>
      <Drawer
        modal={false}
        open={true}
        dismissible={false}
        snapPoints={['0px', collapsedHeight, 1]}
        activeSnapPoint={workout === null ? '0px' : isOpen ? 1 : collapsedHeight}
        setActiveSnapPoint={toggle}
      >
        <DrawerContent onDoubleClick={toggle} className="p-b-[57px]">
          <div
            className={cn('w-full mx-auto', {
              'overflow-y-auto': isOpen,
              'overflow-y-hidden': !isOpen,
            })}
          >
            <DrawerHeader>
              <DrawerTitle>{workout?.title}</DrawerTitle>
              <DrawerDescription className="font-mono text-lg font-medium">
                <span ref={timerRef}></span>
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                this is some content
              </div>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel workout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all the sets you've done up to this point.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelWorkout(workout?.id ?? '1')}
                      className={buttonVariants({ variant: 'destructive' })}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function durationFrom(from: Date) {
  const { hours, minutes, seconds } = intervalToDuration({
    start: from,
    end: new Date().toUTCString(),
  })

  return `${hours?.toString().padStart(2, '0') ?? '00'}:${
    minutes?.toString().padStart(2, '0') ?? '00'
  }:${seconds?.toString().padStart(2, '0') ?? '00'}`
}
