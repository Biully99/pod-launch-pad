import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App.tsx';
import './index.css';

const PRIVY_APP_ID = 'cmdg497a500mjie0mufpbqlrd';

console.log('🌱 Privy setup starting...', { PRIVY_APP_ID });

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
      <App />
    </PrivyProvider>
  </StrictMode>
)
