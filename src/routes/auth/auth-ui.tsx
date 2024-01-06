import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa, ViewType } from '@supabase/auth-ui-shared'
import supabase from '@/lib/data/db'

// TODO: Just replace this. It's getting painful
export default function AuthUi({
  redirect,
  view,
}: {
  redirect: string | undefined
  view?: ViewType
}) {
  return (
    <Auth
      supabaseClient={supabase}
      providers={[]}
      view={view ?? 'sign_in'}
      redirectTo={redirect ?? '/'}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'hsl(var(--accent))',
              brandAccent: 'hsl(var(--accent) / 0.9)',
              brandButtonText: 'hsl(var(--foreground))',
              defaultButtonBackground: 'hsl(var(--primary))',
              defaultButtonBackgroundHover: 'hsl(var(--primary) / 0.9)',
              defaultButtonText: 'hsl(var(--primary-foreground))',
              // for some reason variables aren't working here
              defaultButtonBorder: 'hsl(240 3.7% 15.9%)',
              dividerBackground: 'hsl(240 3.7% 15.9%)',
              inputBorder: 'hsl(240 3.7% 15.9%)',
              inputText: 'hsl(var(--primary-foreground))',
              inputPlaceholder: 'hsl(240 5% 64.9%)',
              inputLabelText: 'hsl(240 5% 64.9%)',
              inputBorderFocus: 'hsl(var(--accent))',
              anchorTextColor: 'hsl(240 5% 64.9%)',
            },
          },
        },
      }}
    />
  )
}
