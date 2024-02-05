import supabase from "@/lib/data/db"
import { ExerciseSearch } from "@/routes/_app/exercises/route"
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

export const exercisesQueries = {
  all: () => ['execises'],
  lists: () => [...exercisesQueries.all(), 'list'],
  list: (search: ExerciseSearch) => {
    return infiniteQueryOptions({
      queryKey: [...exercisesQueries.lists(), search],
      queryFn: async ({ pageParam }) => {

        // I don't love this much sql in js, but it works for now
        let query = supabase
          .from('exercises')
          .select(
            '*, equipment!inner(*), exercise_types!inner(*), muscle_groups!inner(*)'
          )

        if (search.equipment) {
          query = query.eq('equipment.id', search.equipment)
        }
        if (search.group) {
          query = query.eq('muscle_groups.id', search.group)
        }
        if (search.type) {
          query = query.eq('exercise_types.id', search.type)
        }
        if (search.q) {
          // TODO: create a computed combining title and desc
          // create an index and search over that
          query = query.textSearch('title', search.q, {
            type: 'websearch',
          })
        }

        const take = 50

        const { data } = await query
          .order('title')
          .range(take * pageParam, take * (pageParam + 1) - 1)
          .throwOnError()

        return { data, nextCursor: pageParam + 1 }
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
  },
}

export const muscleGroupsQueries = {
  muscleGroupsKey: () => ['muscleGroups'],
  muscleGroups: () => {
    return queryOptions({
      queryKey: [...muscleGroupsQueries.muscleGroupsKey()],
      queryFn: async () => {
        const { data } = await supabase.from('muscle_groups').select('*').order('name')

        return data
      },
    })
  },
}

export const equipmentQueries = {
  equipmentKey: () => ['equipment'],
  equipment: () => {
    return queryOptions({
      queryKey: [...equipmentQueries.equipmentKey()],
      queryFn: async () => {
        const { data } = await supabase.from('equipment').select('*').order('name')

        return data
      },
    })
  },
}

export const exerciseTypeQueries = {
  typeKey: () => ['type'],
  types: () => {
    return queryOptions({
      queryKey: [...exerciseTypeQueries.typeKey()],
      queryFn: async () => {
        const { data } = await supabase.from('exercise_types').select('*').order('type')

        return data
      },
    })
  },
}