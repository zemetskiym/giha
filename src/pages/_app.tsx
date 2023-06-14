import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { WindowSizeProvider } from '@/components/context'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <WindowSizeProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </WindowSizeProvider>
    </SessionProvider>
  )
}
