import { lazy, Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoadingOrError } from '@/components/LoadingOrError';
import { NewClient } from '@/pages/NewClient';
import { ClientsGallery } from '@/pages/ClientsGallery';

const ClientDetails = lazy(async () =>
  import('@/pages/ClientDetails').then((m) => ({ default: m.ClientDetails }))
);

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
  return (
    <ErrorBoundary fallbackRender={renderError}>
      <Suspense fallback={<LoadingOrError />}>
        <Routes>
          <Route path="/" element={<Navigate to="/clients" replace />} />

          <Route path="clients">
            <Route index element={<ClientsGallery />} />
            <Route path="new" element={<NewClient />} />
            <Route path=":id" element={<ClientDetails />} />
          </Route>

          <Route path="*" element={<Navigate to="/clients" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}