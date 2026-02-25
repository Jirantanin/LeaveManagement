export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const token = useState<string>('token', () => '')

  const login = async (email: string, password: string) => {
    const data = await $fetch<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    token.value = data.token
    user.value = data.user
    if (process.client) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
    }
    return data.user
  }

  const logout = () => {
    token.value = ''
    user.value = null
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    navigateTo('/login')
  }

  const loadFromStorage = () => {
    if (process.client) {
      const t = localStorage.getItem('auth_token')
      const u = localStorage.getItem('auth_user')
      if (t && u) {
        token.value = t
        user.value = JSON.parse(u)
      }
    }
  }

  const apiFetch = <T = any>(url: string, options: any = {}) => {
    return $fetch<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token.value}`
      }
    })
  }

  return { user, token, login, logout, loadFromStorage, apiFetch }
}
