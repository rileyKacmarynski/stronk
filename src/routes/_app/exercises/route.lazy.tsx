import { Button } from '@/components/ui/button'
import PageHeader from '@/routes/-components/page-header'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ExerciseTable from '@/routes/_app/exercises/-components/exercise-table'
import QueryError from './-components/query-error'
import SkeletonLoader from '@/routes/_app/exercises/-components/skeleton-loader'
import Form from './-components/form'

export const Route = createLazyFileRoute('/_app/exercises')({
  component: Component,
})

function Component() {
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
