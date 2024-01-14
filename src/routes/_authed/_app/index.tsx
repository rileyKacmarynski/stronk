import { useSession } from "@/components/providers/auth-provider"
import Typography from "@/components/ui/typography"
import { FileRoute } from "@tanstack/react-router"

export const Route = new FileRoute('/_authed/_app/').createRoute({
  component: App
})

function App() {
  const session = useSession()

  return (
    <Typography as="h1" variant="h1">
      Hello from {session.user.email}
    </Typography>
  )
}
