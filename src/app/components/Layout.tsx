import { Header } from './header';
import { Footer } from './footer';
import type { UserData } from '../services/types';
import { cn } from './ui/utils';

interface LayoutProps {
  user: UserData | null;
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout principal da aplicacao com Header e Footer
 */
export function Layout({ user, children, className }: LayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
