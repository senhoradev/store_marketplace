
import {Header} from "../components/header";
import {Hero} from "../components/hero";
import {Categories} from "../components/categories";
import {ProductGrid} from "../components/products";
import {ContactBanner} from "../components/contact-banner";
import {Footer} from "../components/footer";
import type {UserData} from "@/src/app/services/api";

type props = {
  user: UserData | null;
}
export default function Home({user}: props) {

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header user={user}/>
      <main>
        <Hero />
        <Categories />
        <ProductGrid />
        <ContactBanner />
      </main>
      <Footer />
    </div>

  )
}
