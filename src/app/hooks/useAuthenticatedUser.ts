import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi, type UserData } from '../services/api';

interface UseAuthenticatedUserOptions {
  redirectTo?: string;
}

interface UseAuthenticatedUserReturn {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

/**
 * Hook para gerenciar usuario autenticado
 * Redireciona para login se nao estiver autenticado
 */
export function useAuthenticatedUser(
  options: UseAuthenticatedUserOptions = {}
): UseAuthenticatedUserReturn {
  const { redirectTo = '/login' } = options;
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await authApi.getMe();
      setUser(data);
    } catch {
      authApi.removeToken();
      navigate(redirectTo);
    }
  };

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate(redirectTo);
      return;
    }
    
    refreshUser().finally(() => setLoading(false));
  }, [navigate, redirectTo]);

  return { user, loading, refreshUser };
}
