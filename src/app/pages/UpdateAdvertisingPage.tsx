import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { VehicleForm } from '../components/VehicleForm';
import {
  vehicleApi,
  type UpdateVehiclePayload,
  type UserData,
} from '../services/api';

type Props = {
  user: UserData | null;
};

export function UpdateAdvertisingPage({ user }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<UpdateVehiclePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    vehicleApi
      .getVehicleById(id)
      .then((response) => {
        setVehicle(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (
    data: UpdateVehiclePayload
  ) => {
    if (!id) return;
    await vehicleApi.updateVehicle(data, id);
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Veículo não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} />
      <VehicleForm
        initialData={vehicle}
        onSubmit={handleUpdate}
        submitText="Editar anúncio"
        title="Editar anúncio"
        description="Atualize as informações do veículo."
      />
      <Footer />
    </div>
  );
}