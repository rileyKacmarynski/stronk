import supabase from '@/lib/data/db'
import { currentWorkoutQueries } from '@/routes/_app/-current-workout/queries'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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

export function useEndWorkout() {}

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
