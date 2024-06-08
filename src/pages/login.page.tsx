import { useLocation } from 'react-router-dom'

import { LoginForm } from '@/components/organisms/loginForm'
import { NollePCarousel } from '@/components/organisms/nollePCarousel'
import { SignUpForm } from '@/components/organisms/signUpForm'
import { SiteLogo } from '@/components/atoms/siteLogo'
import { SiteFooter } from '@/components/molecules/siteFooter'

export function LoginPage() {
  const { state } = useLocation()

  return (
    <>
      <div className="w-full md:grid lg:min-h-screen lg:grid-cols-2">
        <div className="fixed top-0">
          <SiteLogo />
        </div>
        <div className="relative mt-20 flex items-center justify-center lg:mt-0">
          {!state?.showSignUp ? <LoginForm /> : <SignUpForm />}
          <div className="absolute bottom-0 hidden w-full justify-center lg:flex">
            <SiteFooter />
          </div>
        </div>

        <div className="relative hidden h-full w-full lg:block">
          <NollePCarousel />
        </div>
      </div>
      <div className="fixed bottom-0 mt-10 lg:hidden">
        <SiteFooter />
      </div>
    </>
  )
}
