import { ImageGallery } from '../components/ImageGallery'
import { VehicleDetails } from '../components/VehicleDetails'
import { SellerCard } from '../components/SellerCard'
import { Header } from '../components/header'
import { authApi, type UserData, Vehicle, vehicleApi } from "../../app/services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {Footer} from "../components/footer";


const sampleVehicle: Vehicle = {
  id: 'ansjdkasnjdkkas',
  title: 'Honda Civic EXL 2.0 Automático',
  description: `Veículo em excelente estado de conservação. Único dono, revisões sempre feitas na concessionária autorizada.

Equipado com:
- Ar condicionado digital dual zone
- Bancos em couro
- Central multimídia com Android Auto e Apple CarPlay
- Câmera de ré
- Sensor de estacionamento
- Piloto automático adaptativo
- Faróis full LED

Documentação 100% em dia, IPVA 2024 pago. Aceito financiamento e avaliação de veículo na troca.`,
  price: 145900,
  brand: 'Honda',
  model: 'Civic',
  version: 'EXL 2.0 16V Flex Aut.',
  manufactureYear: 2022,
  modelYear: 2023,
  mileage: 32000,
  fuel: 'Flex',
  transmission: 'Automático',
  bodyType: 'Sedan',
  color: 'Prata',
  doors: 4,
  finalPlate: 7,
  fipePrice: 152000,
  acceptsFinancing: true,
  acceptsTrade: true,
  city: 'São Paulo',
  state: 'SP',
  images: [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop',
  ],
  owner: { fullName: "Grupo 2", id: "123"}
}

export interface SellerData {
  fullName: string;
  state?: string;
  city?: string;
}

const sampleSeller: SellerData = {
  fullName: 'Carlos Eduardo Silva',
  city: 'São Paulo',
  state: 'SP',
}


export default function DetailsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle>(sampleVehicle)
  const [seller, setSeller] = useState<SellerData>(sampleSeller)
  const { id } = useParams()

  useEffect(() => {
    if (authApi.isLoggedIn()) {
      authApi.getMe().then(setUser).catch(() => setUser(null))
    }
  }, [])

  useEffect(() => {
    if (id) {
      try {
        vehicleApi.getVehicleById(id)
          .then((res) => {
            setVehicle(res)
            setSeller({ ...seller, ...res.owner})
          })
      } catch (e) {
        console.log(e)
      }
    }
  }, [id]);

  return (
    <div className="bg-background">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ImageGallery
              images={sampleVehicle.images || []}
              alt={sampleVehicle.title}
            />
            <VehicleDetails vehicle={vehicle} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SellerCard seller={seller} vehicleId={id || vehicle.id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
