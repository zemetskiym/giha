import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WindowSizeProvider } from '@/components/context'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <WindowSizeProvider>
        <Component {...pageProps} />
      </WindowSizeProvider>
    </SessionProvider>
  )
}
