import supabase from '@/lib/data/db'
import { queryOptions } from '@tanstack/react-query'

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
          .limit(1)

        return data?.length ? data[0] : null
      },
    })
  },
}
