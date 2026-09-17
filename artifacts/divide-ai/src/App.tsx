import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DraftProvider } from '@/store/draft';
import { ClaimBills } from '@/components/claim-bills';
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
import Creditos from '@/pages/creditos';
import Perfil from '@/pages/perfil';
import { SignInPage, SignUpPage } from '@/pages/auth';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname so the
// same build serves multiple Clerk custom domains. Do not inline the env var, leave
// publishableKey undefined, or replace publishableKeyFromHost with anything else.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev (Clerk hits dev FAPI directly), auto-set
// in prod. Do NOT gate on import.meta.env.PROD / NODE_ENV — the empty dev value
// is intentional, and any branching breaks the prod proxy.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

// Clerk passes full paths to routerPush/routerReplace, but wouter's
// setLocation prepends the base — strip it to avoid doubling.
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#2A5CFF',
    colorForeground: '#1F2328',
    colorMutedForeground: '#6E7378',
    colorDanger: '#C4472F',
    colorBackground: '#FFFFFF',
    colorInput: '#FFFFFF',
    colorInputForeground: '#1F2328',
    colorNeutral: '#1F2328',
    fontFamily: "'Nunito', sans-serif",
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-3xl w-[400px] max-w-full overflow-hidden shadow-[0_2px_8px_rgba(31,35,40,0.06)]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#1F2328] font-bold',
    headerSubtitle: 'text-[#6E7378]',
    socialButtonsBlockButtonText: 'text-[#1F2328] font-bold',
    formFieldLabel: 'text-[#1F2328]',
    footerActionLink: 'text-[#2A5CFF] font-bold',
    footerActionText: 'text-[#6E7378]',
    dividerText: 'text-[#6E7378]',
    identityPreviewEditButton: 'text-[#2A5CFF]',
    formFieldSuccessText: 'text-[#2E9E6B]',
    alertText: 'text-[#1F2328]',
    logoBox: 'justify-center',
    logoImage: 'h-8',
    socialButtonsBlockButton: 'border-[#E7E5E0] rounded-full',
    formButtonPrimary: 'rounded-full font-bold',
    formFieldInput: 'rounded-2xl border-[#E7E5E0]',
    footerAction: 'justify-center',
    dividerLine: 'bg-[#E7E5E0]',
    alert: 'rounded-2xl',
    otpCodeFieldInput: 'border-[#E7E5E0]',
    formFieldRow: '',
    main: '',
  },
};

const clerkLocalization = {
  signIn: {
    start: {
      title: 'Bom te ver de novo',
      subtitle: 'Entre para ver seus rolês guardados',
    },
  },
  signUp: {
    start: {
      title: 'Guardar seus rolês',
      subtitle: 'Crie sua conta em segundos',
    },
  },
};

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
        <Route path="/entrar" component={Entrar} />
        <Route path="/creditos" component={Creditos} />
        <Route path="/perfil" component={Perfil} />
        {/* REQUIRED — the /*? optional wildcard matches the bare URL and Clerk's
            OAuth sub-paths (/sign-in/sso-callback, /sign-in/factor-one). */}
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkedApp() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={clerkLocalization}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DraftProvider>
            <ClaimBills />
            <Router />
            <Toaster />
          </DraftProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkedApp />
    </WouterRouter>
  );
}

export default App;
