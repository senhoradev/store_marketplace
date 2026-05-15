import {Menu, Search, User, X} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router";
import type {UserData} from "@/src/app/services/api";

type props = {
  user: UserData | null;
}

export function Header({user}: props) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isSeller = user?.roles?.some((r) => r === 'vendedor');
  const goToLogin = () => {
    navigate("/login");
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a href="/" className="text-xl font-bold text-foreground">MachoCar</a>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sobre nós</a>
          <a href="#categorias" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Categorias</a>
          <a href="#produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
          <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Fale Conosco</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Buscar 'SUV 2010'..."
              className="h-9 w-48 rounded-md border border-ring border-input bg-background px-3 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none  lg:w-64"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {isSeller && (
            <button
              onClick={() => navigate('/anunciar')}
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-medium"
            >
              + Criar anúncio
            </button>
          )}
          {/* )} */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors"
            onClick={goToLogin}
          >
            <span className="px-3 text-sm">{user ? user.fullName.split(" ")[0] : "Login"}</span>
            <User className="h-5 w-5 text-foreground" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground">Sobre nós</a>
            <a href="#categorias" className="text-sm font-medium text-muted-foreground hover:text-foreground">Categorias</a>
            <a href="#produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground">Produtos</a>
            <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground">Fale Conosco</a>
          </nav>
        </div>
      )}
    </header>
  )
}