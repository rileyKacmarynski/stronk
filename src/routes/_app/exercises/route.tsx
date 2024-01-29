import {  createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const exerciseSearchSchema = z.object({
  q: z.string().optional(),
  equipment: z.string().optional(),
  type: z.string().optional(),
  group: z.string().optional(),
})

export type ExerciseSearch = z.infer<typeof exerciseSearchSchema>

export const Route = createFileRoute('/_app/exercises')({
  validateSearch: exerciseSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: () => {
    // let's just show a shell while we load
    // context.queryClient.ensureQueryData(muscleGroupsQueries.muscleGroups())
    // context.queryClient.ensureQueryData(equipmentQueries.equipment())
    // context.queryClient.ensureQueryData(exerciseTypeQueries.types())
    // context.queryClient.ensureQueryData(exercisesQueries.list(deps))
  },
})
