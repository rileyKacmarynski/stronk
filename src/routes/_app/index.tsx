import { useSession } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Typography from '@/components/ui/typography'
import { FileRoute } from '@tanstack/react-router'

export const Route = new FileRoute('/_app/').createRoute({
  component: App,
})

function App() {
  const session = useSession()

  return (
    <div className="container">
      <div className="sticky top-0 items-center h-10 bg-background">
        <Button variant="link" className="p-0 text-secondary">
          New
        </Button>
        <Typography
          className="absolute inline font-semibold -translate-x-1/2 top-2 left-1/2"
          as="h1"
        >
          Start Workout
        </Typography>
      </div>
      <div>
        <Typography className="py-2" variant="h1">
          Start Workout
        </Typography>
        <div className="sticky top-10 bg-background">
          <div className="pb-1">form goes here</div>
        </div>
        <section className="pt-2 h-[1000px]">there's stuff here</section>
      </div>
    </div>
  )
}
