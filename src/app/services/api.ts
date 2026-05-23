// ============================================================
// API Service — centraliza todas as chamadas HTTP ao backend
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
    const message =
      (data as any)?.message ||
      (data as any)?.error ||
      `Erro ${res.status}`;
    throw new Error(message);
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

  /** GET /auth/me — retorna dados do usuário autenticado */
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

  /** PUT /auth/me — atualizar perfil */
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
  /** POST /messages — Inicia ou envia mensagem */
  sendMessage(payload: { vehicleId: string; content: string; chatId?: string }): Promise<MessageData> {
    return request<MessageData>('/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** GET /messages/my-chats — lista salas de chat do usuário */
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