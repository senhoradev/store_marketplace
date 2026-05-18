import { ChevronDown, Heart, LogOut, Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { authApi } from "../../app/services/api";

export interface UserData {
  fullName: string;
  state?: string;
  city?: string;
  roles?: string[];
}

type HeaderProps = {
  user: UserData | null;
};

export function Header({user}: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSeller = user?.roles?.some((r) => r === "vendedor");

  const onCreateAd = () => {
    navigate("/anunciar")
  }
  const onLogin = () => {
    navigate("/login");
  }

  const onRegister = () => {
    navigate("/register");
  }

  const onProfile = () => {
    navigate("/profile");
  }

  const onFavorites = () => {
    navigate("/favorites");
  }

  const onLogout = () => {
    authApi.removeToken()
    window.location.reload();
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a href="/" className="text-xl font-bold text-foreground">
          MachoCar
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#categorias" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Categorias
          </a>
          <a href="#produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Produtos
          </a>
          <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Fale Conosco
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Buscar 'SUV 2010'..."
              className="h-9 w-48 rounded-md border border-ring bg-background px-3 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary lg:w-64"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {isSeller && (
            <button
              onClick={onCreateAd}
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-medium"
            >
              + Criar anúncio
            </button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 h-9 px-3 rounded-md hover:bg-accent transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
                  <User className="h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFavorites} className="cursor-pointer">
                  <Heart className="h-4 w-4" />
                  Lista de favoritos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onLogin}
                className="flex items-center gap-1.5 h-9 px-4 rounded-md border border-ring text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={onRegister}
                className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-medium"
              >
                Cadastrar
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="#categorias"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Categorias
            </a>
            <a
              href="#produtos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Produtos
            </a>
            <a
              href="#contato"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Fale Conosco
            </a>

            <div className="my-2 h-px bg-border" />

            {user ? (
              <>
                <button
                  onClick={onProfile}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Perfil
                </button>
                <button
                  onClick={onFavorites}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Heart className="h-4 w-4" />
                  Lista de favoritos
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={onLogin}
                  className="flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-foreground border border-input hover:bg-accent transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={onRegister}
                  className="flex items-center justify-center h-9 px-4 rounded-md bg-primary hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-medium"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}