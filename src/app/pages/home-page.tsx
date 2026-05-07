
import {Header} from "../components/header";
import {Hero} from "../components/hero";
import {Categories} from "../components/categories";
import {ProductGrid} from "../components/products";
import {ContactBanner} from "../components/contact-banner";
import {Footer} from "../components/footer";

export default function Home() {

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
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
