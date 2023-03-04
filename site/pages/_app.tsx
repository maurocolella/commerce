import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, ReactNode, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import { Session } from 'next-auth'

const Noop: FC<{ children?: ReactNode }> = ({ children }) => <>{children}</>

type ExtendedProps = AppProps & { session: Session }

export default function MyApp({
  Component,
  session,
  pageProps,
}: ExtendedProps) {
  const Layout = (Component as any).Layout || Noop

  console.log({ pageProps })

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <Head />
      <SessionProvider session={session}>
        <ManagedUIContext>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ManagedUIContext>
      </SessionProvider>
    </>
  )
}
