import supabase from '@/lib/data/db'
import { currentWorkoutQueries } from '@/routes/_app/-current-workout/queries'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useStartWorkout(title?: string) {
  const queryClient = useQueryClient()
  const queryKey = currentWorkoutQueries.key()
  // want to make sure the db workout has the
  // same id as the opimistic one
  const id = crypto.randomUUID()

  return useMutation({
    mutationFn: async () => {
      const { data } = await supabase.from('workouts').select('*').is('finished_at', null)

      if (data?.length) {
        // TODO: handle existing workout
        console.log('ope, workout already going on')
        return
      }

      const result = await supabase.from('workouts').insert([
        {
          id,
          started_at: new Date().toUTCString(),
          title: title ?? `Workout ${new Date().toLocaleDateString()}`,
        },
      ])

      return result
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const workout = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, {
        id,
        started_at: new Date().toUTCString(),
        title: title ?? `Workout ${new Date().toLocaleDateString()}`,
      })

      return { workout }
    },
    onError: (err, _, context) => {
      console.error('error', err)
      queryClient.setQueryData(queryKey, context?.workout)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: currentWorkoutQueries.key() })
    },
  })
}

export function useAddExercise() {}

export function useFinishWorkout() {
  const queryClient = useQueryClient()
  const queryKey = currentWorkoutQueries.key()

  return useMutation({
    mutationFn: async (id: string) => {
      return await supabase
        .from('workouts')
        .update({ finished_at: new Date().toISOString() })
        .eq('id', id)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const workout = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, null)

      return { workout }
    },
    onError: (err, _, context) => {
      console.error('error', err)
      toast.error('Unable to finish workout.')
      queryClient.setQueryData(queryKey, context?.workout)
    },
    onSettled: () => {
      // TODO: invalidate all workouts for the history page here
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient()
  const queryKey = currentWorkoutQueries.key()

  return useMutation({
    mutationFn: async (id: string) => {
      return await supabase.from('workouts').delete().eq('id', id)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const workout = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, null)

      return { workout }
    },
    onError: (err, _, context) => {
      console.error('error', err)
      toast.error('Unable to delete workout.')
      queryClient.setQueryData(queryKey, context?.workout)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
