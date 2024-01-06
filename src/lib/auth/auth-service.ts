import supabase from '../data/db'

async function getSession() {
  {
    const { data } = await supabase.auth.getSession()

    return data.session
  }
}

async function logout() {
  await supabase.auth.signOut()
}

export { getSession, logout }
export default { getSession, logout }
