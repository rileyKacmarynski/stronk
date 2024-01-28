import { Button } from '@/components/ui/button'
import { FileRoute, useNavigate } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import {
  QueryErrorResetBoundary,
  infiniteQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'
import supabase from '@/lib/data/db'
import PageHeader from '@/routes/-components/page-header'
import z from 'zod'
import { Combobox } from '@/components/ui/combobox'
import { ErrorBoundary } from 'react-error-boundary'
import DebouncedInput from '@/components/ui/debounced-input'
import { Fragment, Suspense, useEffect, useRef, useTransition } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useInView } from 'framer-motion'
import { Virtuoso } from 'react-virtuoso'
import { motion, AnimatePresence } from 'framer-motion'

export const exercisesQueries = {
  all: () => ['execises'],
  lists: () => [...exercisesQueries.all(), 'list'],
  list: (search: ExerciseSearch) => {
    return infiniteQueryOptions({
      queryKey: [...exercisesQueries.lists(), search],
      queryFn: async ({ pageParam }) => {
        console.log('pageParam', pageParam)

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
  loader: () => {
    // let's just show a shell while we load
    // context.queryClient.ensureQueryData(muscleGroupsQueries.muscleGroups())
    // context.queryClient.ensureQueryData(equipmentQueries.equipment())
    // context.queryClient.ensureQueryData(exerciseTypeQueries.types())
    // context.queryClient.ensureQueryData(exercisesQueries.list(deps))
  },
  component: App,
})

function App() {
  return (
    <>
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
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                fallbackRender={({ _error, resetErrorBoundary }) => (
                  <QueryError resetErrorBoundary={resetErrorBoundary} />
                )}
                onReset={reset}
              >
                <Suspense fallback={<SkeletonLoader />}>
                  <ExerciseTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </div>
      </div>
    </>
  )
}

export function SkeletonLoader({ count }: { count?: number }) {
  const items = Array(count ?? 25).fill(0)

  function getRandomNumber(min: number, max: number) {
    // Ensure that the bounds are valid numbers
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new Error('Both bounds must be numbers')
    }

    // Generate a random number within the specified range
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return (
    <ul>
      {items.map((_, i) => (
        <li className="py-2 border-b -z-10 border-border" key={i}>
          <div className="space-y-4">
            <Skeleton
              className="h-5"
              style={{ width: `${getRandomNumber(120, 240)}px` }}
            />
            <div className="flex items-center gap-1 text-muted-foreground">
              <Skeleton
                className="h-3"
                style={{ width: `${getRandomNumber(30, 100)}px` }}
              />
              <Skeleton className="rounded-full size-1" />
              <Skeleton
                className="h-3"
                style={{ width: `${getRandomNumber(30, 100)}px` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function QueryError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: (...args: any[]) => void
}) {
  return (
    <div className="grid pt-4 space-y-6 place-items-center">
      <p>Unable to to query data</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}

function Form() {
  const search = Route.useSearch()
  const equipmentQuery = useQuery(equipmentQueries.equipment())
  const typesQuery = useQuery(exerciseTypeQueries.types())
  const groupsQuery = useQuery(muscleGroupsQueries.muscleGroups())

  const navigate = useNavigate({ from: Route.fullPath })

  function handleSubmit(formSearch: Partial<ExerciseSearch>) {
    const newSearch = {
      ...search,
      ...formSearch,
    }
    // don't include empty values
    for (const key in newSearch) {
      const value = newSearch[key as keyof ExerciseSearch]
      if (!value || value?.trim() === '') {
        delete newSearch[key as keyof ExerciseSearch]
      }
    }

    navigate({ search: newSearch })
  }

  // this whole form with hidden inputs isn't my favorite
  // I want the user to be able to submit the form by hitting enter
  // maybe I won't need that functionality when I have the tranition piece working
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
          <DebouncedInput
            type="text"
            defaultValue={search.q ?? ''}
            name="q"
            onChange={(value) => {
              handleSubmit({
                q: value === '' ? undefined : value,
              })
            }}
            placeholder="search"
            className="pl-10"
          />
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

function ExerciseTable() {
  const search = Route.useSearch()
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(exercisesQueries.list(search))
  const queryRef = useRef<HTMLLIElement>(null)
  const isInView = useInView(queryRef)

  useEffect(() => {
    if (hasNextPage && isInView) {
      fetchNextPage()
    }
  }, [isInView])

  // const items = data?.pages
  //   .flatMap((g) => g.data?.map((e) => e))
  //   .filter((e) => e !== undefined)

  // should use virtuoso here, but then I have to redo the layout
  
  return (
    <ul className="h-full">
      {/* <Virtuoso
        className="h-full"
        data={items}
        itemContent={(_i, exercise) => (
          <li className="py-2 border-b last:border-b-0 border-border" key={exercise.id}>
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
        )}
      /> */}
      {data?.pages.map((group, i) => (
        <Fragment key={i}>
          {group.data?.map((exercise) => (
            <li className="py-2 border-b last:border-b-0 border-border" key={exercise.id}>
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
        </Fragment>
      ))}
      <li ref={queryRef}>
        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLoader count={1} />
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </ul>
  )
}
