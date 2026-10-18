import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { socketClient } from './lib/socket-client';
import { startMswWorker } from './mocks/browser';
import { routeTree } from './routeTree.gen';
import './index.css';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

async function prepareApp() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'false') {
    await startMswWorker();
  }
  socketClient.connect();
}

prepareApp().then(() => {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
});
