import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { authApi } from '../services/api'
import type { UserData } from '../services/types'

interface UseAuthOptions {
  redirectTo?: string
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo = '/login' } = options
  const navigate = useNavigate()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate(redirectTo)
      return
    }

    authApi
      .getMe()
      .then(setUser)
      .catch(() => navigate(redirectTo))
      .finally(() => setLoading(false))
  }, [navigate, redirectTo])

  return { user, loading, setUser }
}
