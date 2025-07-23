import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { Toaster } from "@/components/ui/sonner";
import App from './App.tsx';
import './index.css';

const PRIVY_APP_ID = 'cmdg497a500mjie0mufpbqlrd';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#22c55e',
          logo: '🌱',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        loginMethods: ['email', 'wallet'],
      }}
    >
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </PrivyProvider>
  </StrictMode>
)
