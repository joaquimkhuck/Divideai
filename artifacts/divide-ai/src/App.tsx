import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DraftProvider } from '@/store/draft';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Leitura from '@/pages/leitura';
import ErroLeitura from '@/pages/erro-leitura';
import Revisar from '@/pages/revisar';
import Pessoas from '@/pages/pessoas';
import QuemComeu from '@/pages/quem-comeu';
import Role from '@/pages/role';
import Historico from '@/pages/historico';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/leitura" component={Leitura} />
        <Route path="/erro-leitura" component={ErroLeitura} />
        <Route path="/revisar" component={Revisar} />
        <Route path="/pessoas" component={Pessoas} />
        <Route path="/quem-comeu" component={QuemComeu} />
        <Route path="/roles" component={Historico} />
        <Route path="/role/:id" component={Role} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DraftProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </DraftProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
