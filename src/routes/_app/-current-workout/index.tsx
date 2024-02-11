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
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { intervalToDuration } from 'date-fns'
import { useDeleteWorkout, useFinishWorkout } from '@/lib/commands/workouts'
import { create } from 'zustand'
import ConfirmModal from '@/components/modals/confirm-modal'

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
  const timerRefs = useRef<Map<string, HTMLElement> | null>(null)
  useAnimationFrame(() => {
    if (!workout) return

    const timerRefs = getRef()
    timerRefs.forEach((timerRef) => {
      timerRef.innerHTML = durationFrom(new Date(workout.started_at))
    })
  })

  function getRef() {
    if (!timerRefs.current) {
      timerRefs.current = new Map()
    }

    return timerRefs.current
  }

  const deleteWorkout = useDeleteWorkout()
  const cancelWorkout = useCallback((id?: string) => {
    if (!id) return
    deleteWorkout.mutate(id)
    close()
  }, [])

  const finishWorkout = useFinishWorkout()
  const finish = useCallback((id?: string) => {
    if (!id) return
    finishWorkout.mutate(id)
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
            <AnimatePresence mode="popLayout" initial={false}>
              {isOpen ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex p-4 text-center"
                >
                  <ConfirmModal
                    title="Finish workout?"
                    description="This will save all your current sets. You can go back and edit them later in the history page."
                    onConfirm={() => finish(workout?.id)}
                  >
                    <Button className="ml-auto" size="sm">
                      Finish
                    </Button>
                  </ConfirmModal>
                </motion.div>
              ) : (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid items-center content-center justify-center h-16 text-center"
                >
                  <DrawerTitle>{workout?.title}</DrawerTitle>
                  <DrawerDescription>
                    <span
                      ref={(node) => {
                        const map = getRef()
                        const key = 'header'
                        if (node) {
                          map.set(key, node)
                        } else {
                          map.delete(key)
                        }
                      }}
                    ></span>
                  </DrawerDescription>
                </motion.div>
              )}
            </AnimatePresence>
            <DrawerHeader>
              <DrawerTitle>{workout?.title}</DrawerTitle>
              <DrawerDescription className="font-mono font-medium">
                <span
                  ref={(node) => {
                    const map = getRef()
                    const key = 'body'
                    if (node) {
                      map.set(key, node)
                    } else {
                      map.delete(key)
                    }
                  }}
                ></span>
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                this is some content
              </div>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <ConfirmModal
                onConfirm={() => cancelWorkout(workout?.id)}
                destructive
                title="Cancel workout?"
                description="This will delete all the sets you've done up to this point."
              >
                <Button variant="outline">Cancel</Button>
              </ConfirmModal>
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
