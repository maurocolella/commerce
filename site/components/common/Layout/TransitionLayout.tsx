import { useRouter } from 'next/router'
import {
  Dispatch,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import Layout, { Props } from './Layout'

import styles from './Transition.module.scss'

declare global {
  interface Document {
    startViewTransition: any
  }
}

export const TransitionLayout: FC<Props> = ({ children, pageProps }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
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
      // window?.scrollTo(0, 0)
      document.body.style.overflow = 'auto'
      setTransitionStage('fadeIn')
    },
    [router.pathname]
  )

  useEffect(() => {
    fadeIn()

    router.events.on('routeChangeStart', () => {
      if (document.startViewTransition) {
        const { x, y } = mousePos

        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        )

        let transition: any

        flushSync(() => {
          transition = document.startViewTransition(() => fadeIn())
        })

        transition?.ready.then(() => {
          // Animate the root's new view
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0 at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: 'ease-in',
              // Specify which pseudo-element to animate
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })
      } else fadeOut()
    })
    router.events.on('routeChangeComplete', fadeIn)
    router.events.on('routeChangeError', fadeIn)
  }, [mousePos, fadeIn, fadeOut, router])

  useEffect(() => {
    const curriedHandler =
      (handleStateChange: typeof setMousePos) => (event: PointerEvent) => {
        handleStateChange({
          x: event.clientX ?? window.innerWidth / 2,
          y: event.clientY ?? window.innerHeight / 2,
        })
      }

    const pointerListener = curriedHandler(setMousePos)

    window.addEventListener('pointerdown', pointerListener)
    return () => {
      window.removeEventListener('pointerdown', pointerListener)
    }
  }, [setMousePos])

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
