// ============================================================
// API Service - centraliza todas as chamadas HTTP ao backend
// ============================================================


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --------------- helpers ---------------

function getToken(): string | null {
  return localStorage.getItem('token');
}

function setToken(token: string): void {
  localStorage.setItem('token', token);
}

function removeToken(): void {
  localStorage.removeItem('token');
}

// Mapa de mensagens de erro do backend -> português
const ERROR_MAP: Record<string, string> = {
  // campo obrigatório
  'Full name is required': 'Nome completo é obrigatório.',
  'Email is required': 'E-mail é obrigatório.',
  'Password is required': 'Senha é obrigatória.',
  'CPF is required': 'CPF é obrigatório.',
  'Birth date is required': 'Data de nascimento é obrigatória.',
  'Telefone is required': 'Telefone é obrigatório.',
  'fullName is required': 'Nome completo é obrigatório.',
  'email is required': 'E-mail é obrigatório.',
  'password is required': 'Senha é obrigatória.',
  'cpf is required': 'CPF é obrigatório.',
  'birthDate is required': 'Data de nascimento é obrigatória.',
  'telefone is required': 'Telefone é obrigatório.',
  // duplicatas
  'CPF already in use': 'CPF já cadastrado.',
  'Email already in use': 'E-mail já cadastrado.',
  'Email already exists': 'E-mail já cadastrado.',
  'CPF already exists': 'CPF já cadastrado.',
  // autenticação
  'Invalid credentials': 'E-mail ou senha inválidos.',
  'Unauthorized': 'Não autorizado. Faça login novamente.',
  'Token expired': 'Sessão expirada. Faça login novamente.',
  'User not found': 'Usuário não encontrado.',
  // vendedor
  'User is already a seller': 'Você já é um vendedor.',
  'Already a seller': 'Você já é um vendedor.',
  // genérico
  'Internal server error': 'Erro interno no servidor. Tente novamente.',
  'Bad request': 'Requisição inválida.',
};

function translateError(msg: string): string {
  // Busca exata
  if (ERROR_MAP[msg]) return ERROR_MAP[msg];
  // Busca case-insensitive
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(ERROR_MAP)) {
    if (lower === key.toLowerCase()) return val;
  }
  // Busca parcial (ex: array de erros do backend como "fullName is required, email is required")
  for (const [key, val] of Object.entries(ERROR_MAP)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return msg;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // O backend pode retornar array em "message" (ex: validação class-validator)
    const raw =
      (data as any)?.message ||
      (data as any)?.error ||
      `Erro ${res.status}`;
    const rawStr = Array.isArray(raw) ? raw[0] : String(raw);
    throw new Error(translateError(rawStr));
  }

  return data as T;
}

// --------------- Auth types ---------------

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;       // formato "YYYY-MM-DD"
  telefone: string;
  state?: string;
  city?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface VehicleResponse {
  page: number;
  total: number;
  limit: number;
  data: Vehicle[] | [];
}

export interface Vehicle {
  id: string
  title: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  version: string;
  manufactureYear: number;
  modelYear: number;
  mileage: number;
  fuel: string;
  transmission: string;
  bodyType: string;
  color: string;
  doors: number;
  finalPlate: number;
  fipePrice?: number;
  acceptsFinancing?: boolean;
  acceptsTrade?: boolean;
  status?: string;
  city: string;
  state: string;
  images?: string[];
  owner: { fullName: string; id: string };
}

export interface CreateVehiclePayload {
  title: string;
  description: string;
  price: number;
  brand?: string;
  model?: string;
  version?: string;
  manufactureYear?: number;
  modelYear?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  doors?: number;
  finalPlate?: number;
  fipePrice?: number;
  acceptsFinancing?: boolean;
  acceptsTrade?: boolean;
  city?: string;
  state?: string;
}

export interface UpdateVehiclePayload {
  id: string;
  title: string;
  description: string;
  price: number;
  brand?: string;
  model?: string;
  version?: string;
  manufactureYear?: number;
  modelYear?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  doors?: number;
  finalPlate?: number;
  fipePrice?: number;
  acceptsFinancing?: boolean;
  acceptsTrade?: boolean;
  city?: string;
  state?: string;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  telefone: string;
  state?: string;
  city?: string;
  roles: string[];
}

export interface BecomeSeller {
  state: string;
  city: string;
}

// --------------- Chat & Message types ---------------

export interface ChatRoom {
  id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    id: string;
    title: string;
    price: number;
  };
  buyer: {
    id: string;
    fullName: string;
  };
  seller: {
    id: string;
    fullName: string;
  };
}

export interface MessageData {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
  };
}

// --------------- Auth API ---------------

export const authApi = {
  /** POST /auth/register */
  register(payload: RegisterPayload): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** POST /auth/login */
  login(payload: LoginPayload): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** GET /auth/me - retorna dados do usuário autenticado */
  getMe(): Promise<UserData> {
    return request<UserData>('/auth/me', {
      method: 'GET',
    });
  },

  /** POST /auth/become-seller */
  becomeSeller(payload: BecomeSeller): Promise<any> {
    return request('/auth/become-seller', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** PUT /auth/me - atualizar perfil */
  updateMe(payload: Partial<RegisterPayload>): Promise<UserData> {
    return request<UserData>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /** DELETE /auth/me */
  deleteMe(): Promise<void> {
    return request<void>('/auth/me', { method: 'DELETE' });
  },
  // helpers
  getToken,
  setToken,
  removeToken,
  isLoggedIn: () => !!getToken(),
};

export const vehicleApi = {
  getAllVehicles(): Promise<VehicleResponse> {
    return request('/vehicles');
  },

  getVehicleById(id: string): Promise<Vehicle> {
    return request(`/vehicles/${id}`)
  },

  filterVehicle(params: URLSearchParams): Promise<VehicleResponse> {
    return request(`/vehicles?${params}`);
  },
  createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    return request<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateVehicle(payload: UpdateVehiclePayload, id: string): Promise<Vehicle> {
    return request<Vehicle>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
}
export const messageApi = {
  /** POST /messages - Inicia ou envia mensagem */
  sendMessage(payload: { vehicleId: string; content: string; chatId?: string }): Promise<MessageData> {
    return request<MessageData>('/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** GET /messages/my-chats - lista salas de chat do usuário */
  getMyChats(): Promise<ChatRoom[]> {
    return request<ChatRoom[]>('/messages/my-chats', {
      method: 'GET',
    });
  },

  getChatHistory(chatId: string): Promise<MessageData[]> {
    return request<MessageData[]>(`/messages/${chatId}`, {
      method: 'GET',
    });
  },
};