import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileRoute, useNavigate } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import supabase from '@/lib/data/db'
import PageHeader from '@/routes/-components/page-header'
import z from 'zod'
import { Combobox } from '@/components/ui/combobox'
import { useTransition, useRef } from 'react'
import { Loader } from '@/routes/-components/page-loader'
import LoadingCombobox from '@/components/ui/loading-combobox'

export const exercisesQueries = {
  all: () => ['execises'],
  lists: () => [...exercisesQueries.all(), 'list'],
  // TODO: add filters
  list: (search: ExerciseSearch) => {
    return queryOptions({
      queryKey: [...exercisesQueries.lists(), search],
      queryFn: async () => {
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

        const { data } = await query.order('title').range(0, 25).throwOnError()

        return data
      },
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

const exerciseSearchSchema = z.object({
  q: z.string().optional(),
  equipment: z.string().optional(),
  type: z.string().optional(),
  group: z.string().optional(),
})

type ExerciseSearch = z.infer<typeof exerciseSearchSchema>

export const Route = new FileRoute('/_app/exercises').createRoute({
  validateSearch: exerciseSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    // context.queryClient.ensureQueryData(muscleGroupsQueries.muscleGroups())
    // context.queryClient.ensureQueryData(equipmentQueries.equipment())
    // context.queryClient.ensureQueryData(exerciseTypeQueries.types())
    // context.queryClient.ensureQueryData(exercisesQueries.list(deps))
  },
  component: App,
})

function App() {
  const search = Route.useSearch()
  const exercisesQuery = useQuery(exercisesQueries.list(search))

  return (
    <div>
      <div className="pb-2">
        <PageHeader
          title="Exercises"
          actions={
            <Button variant="link" className="p-0 text-sky-600">
              New
            </Button>
          }
        >
          <Form />
        </PageHeader>
        <div className="container h-full">
          <ul>
            {exercisesQuery.data?.map((exercise) => (
              <li className="py-2 border-b border-border" key={exercise.id}>
                <div className="space-y-1">
                  <p className="font-medium">
                    {exercise.title}{' '}
                    {exercise.required_equipment ? `(${exercise.equipment?.name})` : ''}
                  </p>
                  <div className="flex text-sm font-medium text-muted-foreground">
                    <p className="">
                      {exercise.muscle_groups?.name} • {exercise.exercise_types?.type}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Form() {
  const search = Route.useSearch()
  const equipmentQuery = useQuery(equipmentQueries.equipment())
  const typesQuery = useQuery(exerciseTypeQueries.types())
  const groupsQuery = useQuery(muscleGroupsQueries.muscleGroups())

  const navigate = useNavigate({ from: Route.fullPath })

  // I feel like we should use this for searching
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formSearch: Partial<ExerciseSearch>) {

    const newSearch = {
      ...search,
      ...formSearch,
    }
    console.log('handleSubmit', newSearch)
    // don't include empty values
    for (const key in newSearch) {
      const value = newSearch[key as keyof ExerciseSearch]
      if (!value || value?.trim() === '') {
        delete newSearch[key as keyof ExerciseSearch]
      }
    }

    console.log('final search', newSearch)
    return navigate({ search: newSearch })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const search = Object.fromEntries(data)
        return handleSubmit(search)
      }}
    >
      <input type="hidden" name="type" value={search.type ?? ''} />
      <input type="hidden" name="equipment" value={search.equipment ?? ''} />
      <input type="hidden" name="group" value={search.group ?? ''} />
      <div className="container mx-auto space-y-2">
        <div className="relative">
          <SearchIcon className="absolute size-5 text-muted-foreground top-3 left-3" />
          <Input
            type="text"
            defaultValue={search.q ?? ''}
            name="q"
            // do some type of hype debounce?
            onBlur={(e) => {
              return handleSubmit({
                q: e.target.value === '' ? undefined : e.target.value,
              })
            }}
            placeholder="search"
            className="pl-10"
          />
          <button type="submit">submit</button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Combobox
            value={search.type}
            items={
              typesQuery.data?.map((type) => ({
                label: type.type ?? '',
                value: type.id,
              })) ?? []
            }
            onValueChange={(type) => {
              return handleSubmit({ type })
            }}
            placeholder="Select type"
            emptyText="No type found."
            isLoading={typesQuery.isLoading}
          />
          <Combobox
            value={search.group}
            items={
              groupsQuery.data?.map((group) => ({
                label: group.name ?? '',
                value: group.id,
              })) ?? []
            }
            onValueChange={(group) => {
              return handleSubmit({ group })
            }}
            placeholder="Select group"
            emptyText="No group found."
            isLoading={groupsQuery.isLoading}
          />
          <Combobox
            value={search.equipment}
            items={
              equipmentQuery.data?.map((equipment) => ({
                label: equipment.name ?? '',
                value: equipment.id,
              })) ?? []
            }
            onValueChange={(equipment) => {
              return handleSubmit({ equipment })
            }}
            placeholder="Select equpment"
            emptyText="No equipment found."
            isLoading={equipmentQuery.isLoading}
          />
        </div>
      </div>
    </form>
  )
}
