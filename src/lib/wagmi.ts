import { http, createConfig } from 'wagmi'
import { base, arbitrum, mainnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Get WalletConnect project ID - you can get one free at https://cloud.walletconnect.com
const projectId = 'demo' // Replace with your actual project ID

export const config = createConfig({
  chains: [base, arbitrum, mainnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'PeapodPump',
        description: 'Meme Token Launchpad',
        url: 'https://peapodpump.com',
        icons: ['https://peapodpump.com/icon.png']
      }
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}