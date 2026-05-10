import { useEffect, useState } from 'react';

import {Header} from "../components/header";
import {Hero} from "../components/hero";
import {Categories} from "../components/categories";
import {ProductGrid} from "../components/products";
import {ContactBanner} from "../components/contact-banner";
import {Footer} from "../components/footer";
import {Vehicle, vehicleApi, UserData} from "../services/api";

type props = {
  user: UserData | null;
}

export default function Home({user}: props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  useEffect(() => {
    vehicleApi.getAllVehicles()
      .then((vehicleResponse) => setVehicles(vehicleResponse.data))

  }, [])

  const getVehiclesByCategory = async (category: string) => {
    const urlParams = new URLSearchParams({
      bodyType: category
    });
    const vehicles = await vehicleApi.filterVehicle(urlParams);
    setVehicles(vehicles.data)
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header user={user}/>
      <main>
        <Hero />
        <Categories getVehiclesByCategory={getVehiclesByCategory}/>
        <ProductGrid vehicles={vehicles} />
        <ContactBanner />
      </main>
      <Footer />
    </div>

  )
}
