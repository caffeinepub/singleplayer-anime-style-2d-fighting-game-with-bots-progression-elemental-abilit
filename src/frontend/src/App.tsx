import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import MainMenuPage from './pages/MainMenuPage';
import LoadoutPage from './pages/LoadoutPage';
import FightPage from './pages/FightPage';
import ResultsPage from './pages/ResultsPage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div id="router-outlet-container">
        <RouterOutlet />
      </div>
      <Toaster />
    </>
  ),
});

function RouterOutlet() {
  return <div className="min-h-screen">{/* Router will render here */}</div>;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainMenuPage,
});

const loadoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loadout',
  component: LoadoutPage,
});

const fightRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fight',
  component: FightPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loadoutRoute, fightRoute, resultsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
