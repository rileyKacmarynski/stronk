import supabase from '../data/db'

export type Credentials = {
  email: string
  password: string
}

async function getSession() {
  const { data } = await supabase.auth.getSession()

  return data.session
}

async function logout() {
  await supabase.auth.signOut()
}

async function signUp(credentials: Credentials) {
  return await supabase.auth.signUp(credentials)
}

async function login(credentials: Credentials) {
  return await supabase.auth.signInWithPassword(credentials)
}

async function forgotPassword({ email }: { email: string }) {
  return await supabase.auth.resetPasswordForEmail(email)
}

export { getSession, logout, login, signUp, forgotPassword }
export default { getSession, logout, login, signUp, forgotPassword }
