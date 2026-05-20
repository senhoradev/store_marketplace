import { useNavigate } from 'react-router';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { VehicleForm } from '../components/VehicleForm';
import {
  vehicleApi,
  type CreateVehiclePayload,
  type UserData,
} from '../services/api';

type Props = {
  user: UserData | null;
};

const initialForm: CreateVehiclePayload = {
  title: '',
  description: '',
  price: 0,
  brand: '',
  model: '',
  version: '',
  manufactureYear: undefined,
  modelYear: undefined,
  mileage: undefined,
  fuel: '',
  transmission: '',
  bodyType: '',
  color: '',
  doors: undefined,
  finalPlate: undefined,
  fipePrice: undefined,
  acceptsFinancing: false,
  acceptsTrade: false,
  city: '',
  state: '',
};

export function CreateAdvertisingPage({ user }: Props) {
  const navigate = useNavigate();
  const handleCreate = async (data: CreateVehiclePayload) => {
    await vehicleApi.createVehicle(data);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} />
      <VehicleForm
        initialData={initialForm}
        onSubmit={handleCreate}
        submitText="Publicar anúncio"
        title="Criar anúncio"
        description="Preencha as informações do veículo."
      />
      <Footer />
    </div>
  );
}