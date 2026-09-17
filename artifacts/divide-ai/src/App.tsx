import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, useAuth } from '@clerk/react';
import { shadcn } from '@clerk/ui/themes';
import { setAuthTokenGetter } from '@workspace/api-client-react';
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
import Entrar from '@/pages/entrar';
import PagamentoSucesso from '@/pages/pagamento-sucesso';
import { Button } from '@workspace/divide-ai-ds/components/ui/button';
import { PhoneShell } from '@/components/phone-shell';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkEnabled = Boolean(clerkPublishableKey);

function AuthBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  return null;
}

function Router({ authEnabled }: { authEnabled: boolean }) {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/entrar/*?">
          {authEnabled ? <Entrar /> : <EntrarUnavailable />}
        </Route>
        <Route path="/pagamento/sucesso" component={PagamentoSucesso} />
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

function EntrarUnavailable() {
  const [, setLocation] = useLocation();
  return (
    <PhoneShell className="px-6 pb-8 pt-14">
      <h1 className="text-[26px] font-bold leading-tight">Entrar</h1>
      <p className="mt-3 text-[17px] text-muted-foreground">
        O login ainda não foi configurado neste ambiente.
      </p>
      <Button className="mt-auto" size="lg" onClick={() => setLocation("/")}>
        Voltar ao início
      </Button>
    </PhoneShell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function AppContent({ authEnabled }: { authEnabled: boolean }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DraftProvider>
          {authEnabled && <AuthBridge />}
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router authEnabled={authEnabled} />
          </WouterRouter>
          <Toaster />
        </DraftProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  const content = <AppContent authEnabled={clerkEnabled} />;
  if (!clerkPublishableKey) return content;

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{ theme: shadcn }}
    >
      {content}
    </ClerkProvider>
  );
}

export default App;
