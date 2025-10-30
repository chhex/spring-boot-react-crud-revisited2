import './global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App } from './App';

const queryClient = new QueryClient();

const USE_MOCK = import.meta.env['VITE_USE_MOCK'] === 'true';

async function maybeEnableMocking() {
  if (!USE_MOCK) return;

  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass', // don't error on routes you didn't mock
  });
}

async function bootstrap() {
  try {
    await maybeEnableMocking();

    const container = document.getElementById('root');
    if (!container) throw new Error('#root not found');

    const root = createRoot(container);
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    );
  } catch (err) {
    // If the worker can’t start (e.g., public/mockServiceWorker.js missing),
    // render the app anyway and log the issue for quick diagnosis.
    console.error('MSW init failed:', err);

    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(
        <StrictMode>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </StrictMode>
      );
    }
  }
}

bootstrap();