import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { WindowSizeProvider } from '@/components/context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WindowSizeProvider>
      <Navbar />
      <Component {...pageProps} />
    </WindowSizeProvider>
  )
}
