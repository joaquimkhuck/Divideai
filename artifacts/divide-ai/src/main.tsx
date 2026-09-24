import { createRoot } from 'react-dom/client';

import App from './App';
import { initAnalytics } from '@/lib/analytics';
import { initNativeApi } from '@/lib/native';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

initAnalytics();
initNativeApi();

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
