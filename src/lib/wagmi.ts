import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const projectId = 'your-wallet-connect-project-id' // Replace with your WalletConnect project ID

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Peapods Meme Launchpad',
      appLogoUrl: 'https://peapods.finance/assets/logo.png'
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'Peapods Meme Launchpad',
        description: 'The MicroStrategy of Memecoins - Launch yield-generating tokens on Base with Peapods',
        url: 'https://peapods-meme-launchpad.com',
        icons: ['https://peapods.finance/assets/logo.png']
      }
    })
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [mainnet.id]: http()
  }
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}