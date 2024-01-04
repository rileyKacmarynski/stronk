import { useSession } from '@/app/auth/auth-provider'
import Typography from './components/ui/typography'

function App() {
  const session = useSession()
  return (
    <Typography as="h1" variant="h1">
      Hello from {session.user.email}
    </Typography>
  )
}

export default App
