import { useSession } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Typography from '@/components/ui/typography'
import { useStartWorkout } from '@/lib/commands/workouts'
import PageHeader from '@/routes/-components/page-header'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: App,
})

function App() {
  const session = useSession()

  return (
    <div>
      <PageHeader title="Start Workout" />
      <div className="container pt-4 space-y-10">
        <div className="space-y-8">
          <Typography variant="h3" as="h2">
            Quick Start
          </Typography>
          <StartWorkoutButton />
        </div>
        <div className="space-y-4">
          <Typography variant="h3" as="h2">
            Start from a Template
          </Typography>
          <div className="space-y-2">
            <Typography variant="h4" as="h3">
              My Templates
            </Typography>
            <div>templates go here</div>
          </div>
          <div className="space-y-2">
            <Typography variant="h4" as="h3">
              Example Templates
            </Typography>
            <div>templates go here</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StartWorkoutButton() {
  const startWorkout = useStartWorkout()

  return (
    <Button onClick={() => startWorkout.mutate()} className="w-full sm:w-auto bg-sky-700 text-sky-100 hover:bg-sky-800">
      Start an Empty Workout
    </Button>
  )
}
