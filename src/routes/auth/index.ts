import { signUpRoute } from './sign-up'
import { loginRoute } from './login'
import { logoutRoute } from './logout'
import { authedRoute } from './authed'

export { signUpRoute } from './sign-up'
export { loginRoute } from './login'
export { logoutRoute } from './logout'
export { authedRoute } from './authed'

export default [signUpRoute, loginRoute, logoutRoute, authedRoute] as const
