import supabase from '@/lib/data/db'
import { queryOptions, useMutation } from '@tanstack/react-query'

export const currentWorkoutQueries = {
  key: () => ['currentWorkout'],
  currentWorkout: () => {
    return queryOptions({
      queryKey: [...currentWorkoutQueries.key()],
      queryFn: async () => {
        const { data } = await supabase
          .from('workouts')
          .select('*, sets(id, weight, reps, created_at, exercises(*))')
          .is('finished_at', null)
          .single()
          .throwOnError()

        return data
      },
    })
  },
}

