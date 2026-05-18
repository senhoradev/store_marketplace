import { useParams } from "react-router";

type Car = {
    id: number;
    name: string;
    model: string;
    year: number;
    km: number;
    price: number;
    category: string;
    image: string;
    location?: string;
};

const cars: Car[] = [
    {
        id: 1,
        name: "JEEP COMPASS",
        model: "1.3 Turbo Longitude",
        year: 2024,
        km: 12500,
        price: 159990,
        category: "suv",
        image: "/cars/compass.png",
        location: "Fortaleza (CE)",
    },
    {
        id: 2,
        name: "TOYOTA COROLLA",
        model: "2.0 XEi CVT",
        year: 2025,
        km: 3200,
        price: 182990,
        category: "sedan",
        image: "/cars/corolla.png",
        location: "Recife (PE)",
    },
    {
        id: 3,
        name: "CHEVROLET ONIX",
        model: "1.0 Turbo LT",
        year: 2024,
        km: 8700,
        price: 82990,
        category: "hatch",
        image: "/cars/onix.png",
        location: "Natal (RN)",
    },
    {
        id: 4,
        name: "FIAT TORO",
        model: "1.3 Turbo Freedom",
        year: 2023,
        km: 24500,
        price: 149990,
        category: "picape",
        image: "/cars/toro.png",
        location: "João Pessoa (PB)",
    },
    {
        id: 5,
        name: "BMW M3",
        model: "3.0 Competition",
        year: 2025,
        km: 0,
        price: 689990,
        category: "esportivo",
        image: "/cars/m3.png",
        location: "Salvador (BA)",
    },
    {
        id: 6,
        name: "BYD DOLPHIN",
        model: "EV GS 180CV",
        year: 2025,
        km: 0,
        price: 149990,
        category: "elétrico",
        image: "/cars/dolphin.png",
        location: "Fortaleza (CE)",
    },
    {
        id: 7,
        name: "HYUNDAI CRETA",
        model: "1.0 Turbo Platinum",
        year: 2024,
        km: 9800,
        price: 169990,
        category: "suv",
        image: "/cars/creta.png",
        location: "Teresina (PI)",
    },
    {
        id: 8,
        name: "HONDA CIVIC",
        model: "2.0 e:HEV Touring",
        year: 2025,
        km: 1500,
        price: 244990,
        category: "sedan",
        image: "/cars/civic.png",
        location: "Maceió (AL)",
    },
    {
        id: 9,
        name: "PEUGEOT 208",
        model: "1.0 Turbo Allure",
        year: 2024,
        km: 5400,
        price: 98990,
        category: "hatch",
        image: "/cars/208.png",
        location: "Aracaju (SE)",
    },
    {
        id: 10,
        name: "FORD RANGER",
        model: "3.0 V6 Limited",
        year: 2025,
        km: 0,
        price: 289990,
        category: "picape",
        image: "/cars/ranger.png",
        location: "São Luís (MA)",
    },
    {
        id: 11,
        name: "PORSCHE 911",
        model: "Carrera S",
        year: 2024,
        km: 4200,
        price: 899990,
        category: "esportivo",
        image: "/cars/911.png",
        location: "Recife (PE)",
    },
    {
        id: 12,
        name: "TESLA MODEL 3",
        model: "Performance AWD",
        year: 2025,
        km: 0,
        price: 379990,
        category: "elétrico",
        image: "/cars/model3.png",
        location: "Fortaleza (CE)",
    },
];

export function CategoryCarsPage() {
    const {category }= useParams();



    const filteredCars = cars.filter(
        (car) => car.category.toLowerCase() === category?.toLowerCase()
    );

    return (
        <main className="min-h-screen bg-gray-100 px-8 py-6">
            <h1 className="mb-2 text-4xl font-bold text-gray-800">
                Carros da categoria: {category}
            </h1>

            <p className="mb-6 text-gray-600">
                {filteredCars.length} anúncios encontrados
            </p>

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filteredCars.map((car) => (
                    <div
                        key={car.id}
                        className="rounded-lg bg-white p-3 shadow-sm"
                    >
                        <img
                            src={car.image}
                            alt={car.name}
                            className="h-48 w-full rounded-md object-cover"
                        />

                        <div className="mt-4">
              <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                Oferta destaque
              </span>

                            <h2 className="mt-3 font-bold text-gray-800">{car.name}</h2>

                            <p className="text-sm text-gray-500">{car.model}</p>

                            <div className="mt-3 flex gap-3 text-sm text-gray-500">
                                <span>{car.year}</span>
                                <span>{car.km.toLocaleString("pt-BR")} Km</span>
                            </div>

                            {car.location && (
                                <p className="mt-2 text-sm text-gray-500">{car.location}</p>
                            )}

                            <p className="mt-4 text-xl font-bold text-gray-900">
                                R$ {car.price.toLocaleString("pt-BR")}
                            </p>

                            <button className="mt-4 w-full rounded-lg bg-gray-900 py-3 font-bold text-white">
                                Ver oferta
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}