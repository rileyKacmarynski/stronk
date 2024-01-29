import { Button } from '@/components/ui/button'

export default function QueryError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: (...args: unknown[]) => void
}) {
  return (
    <div className="grid pt-4 space-y-6 place-items-center">
      <p>Unable to to query data</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}
