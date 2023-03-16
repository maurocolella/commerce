import { useRouter } from 'next/router'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import Layout, { Props } from './Layout'

import styles from './Transition.module.scss'

declare global {
  interface Document {
    startViewTransition: any
  }
}

export const TransitionLayout: FC<Props> = ({ children, pageProps }) => {
  const [transitionStage, setTransitionStage] = useState('fadeOut')
  const router = useRouter()

  const fadeOut = useCallback(
    (url?: string) => {
      if (router.pathname === url) return
      document.body.style.overflow = 'hidden'
      setTransitionStage('fadeOut')
    },
    [router.pathname]
  )

  const fadeIn = useCallback(
    (url?: string) => {
      if (router.pathname === url) return
      window?.scrollTo(0, 0)
      document.body.style.overflow = 'auto'
      setTransitionStage('fadeIn')
    },
    [router.pathname]
  )

  useEffect(() => {
    fadeIn()

    router.events.on('routeChangeStart', () => {
      if (document.startViewTransition) {
        flushSync(() => {
          document.startViewTransition(() => fadeIn())
        })
      } else fadeOut()
    })
    router.events.on('routeChangeComplete', () => {
      fadeIn()
    })
    router.events.on('routeChangeError', () => {
      fadeIn()
    })
  }, [fadeIn, fadeOut, router])

  return (
    <div>
      {transitionStage === 'fadeOut' && <></>}
      <div className={`${styles.wrapper} ${styles[transitionStage]}`}>
        <Layout pageProps={pageProps}>{children}</Layout>
      </div>
    </div>
  )
}

export default TransitionLayout
