import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import { useCommerce } from '@vercel/commerce-swell'

interface Link {
  href: string
  label: string
}

interface NavbarProps {
  links?: Link[]
}

const Navbar: FC<NavbarProps> = ({ links }) => {
  const {
    providerRef: {
      current: { swell },
    },
  } = useCommerce()
  const [storeName, setStoreName] = useState<string | null>()

  useEffect(() => {
    const runAsyncOp = async (setter: typeof setStoreName) => {
      const settings = await swell.settings.get()

      setStoreName(settings.store.name)
    }

    runAsyncOp(setStoreName)
  }, [swell, setStoreName])

  return (
    <NavbarRoot>
      <Container clean className="mx-auto px-6">
        <div className={s.nav}>
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <Link href="/" aria-label="Site name">
              {storeName && (
                <h1
                  className={'ml-3 text-2xl md:text-3xl xl:text-4xl font-bold'}
                >
                  {storeName}
                </h1>
              )}
            </Link>
            <nav className={s.navMenu}>
              <Link href="/search" className={s.link}>
                View categories
              </Link>
            </nav>
          </div>
          {process.env.COMMERCE_SEARCH_ENABLED && (
            <div className="justify-center flex-1 hidden lg:flex mr-3">
              <Searchbar />
            </div>
          )}
          <div className="flex items-center justify-end space-x-8">
            <UserNav />
          </div>
        </div>
        {process.env.COMMERCE_SEARCH_ENABLED && (
          <div className="flex pb-4 lg:px-6 lg:hidden">
            <Searchbar id="mobile-search" />
          </div>
        )}
      </Container>
    </NavbarRoot>
  )
}

export default Navbar
