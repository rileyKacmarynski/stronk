import supabase from "@/lib/data/db"
import { useMutation } from "@tanstack/react-query"

export function useStartWorkout(title?: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await supabase.from('workouts').insert([
        {
          title: title ?? `Workout ${new Date()}`,
        },
      ])

      return result
    },
    // TODO: make sure to invalidate cache and to optimistic shit here
  })
}

export function useAddExercise(){

}

export function useEndWorkout() {

}

export function useCancelWorkout() {

}