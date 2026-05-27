export interface VehicleFilters {
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
  acceptsFinancing?: boolean;
  acceptsTrade?: boolean;
  status?: string;
  city: string;
  state: string;
  priceMin: number;
  priceMax: number;
  mileageMin: number;
  mileageMax: number;
  manufactureYearMin: number;
  manufactureYearMax: number;
}

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