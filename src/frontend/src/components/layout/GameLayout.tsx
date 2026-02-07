import { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="absolute inset-0 bg-[url('/assets/generated/arena-bg.dim_1920x1080.png')] opacity-5 bg-cover bg-center" />
      <div className="relative z-10">{children}</div>
      <footer className="fixed bottom-4 left-0 right-0 text-center text-sm text-muted-foreground z-20">
        © 2026. Built with ❤️ using{' '}
        <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
