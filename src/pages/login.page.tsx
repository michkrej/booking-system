import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { LoginForm } from '@/components/organisms/loginForm'
import { NollePCarousel } from '@/components/organisms/nollePCarousel'
import { SignUpForm } from '@/components/organisms/signUpForm'
import { SiteLogo } from '@/components/atoms/siteLogo'
import { SiteFooter } from '@/components/molecules/siteFooter'
import { useHasUser } from '@/state'
import { ForgotPasswordForm } from '@/components/organisms/forgotPasswordForm'

export function LoginPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const hasUser = useHasUser()

  useEffect(() => {
    if (hasUser) {
      navigate('/dashboard')
    }
  }, [hasUser])

  return (
    <div className="flex min-h-screen w-full flex-col md:overflow-y-hidden lg:grid lg:grid-cols-2">
      <div className="fixed top-0 m-2">
        <SiteLogo />
      </div>
      <div className="relative mt-20 flex items-center justify-center lg:mt-0">
        {state?.mode === 'login' ? (
          <LoginForm />
        ) : state?.mode === 'signup' ? (
          <SignUpForm />
        ) : (
          <ForgotPasswordForm />
        )}
        <div className="absolute bottom-0 hidden w-full justify-center lg:flex">
          <SiteFooter />
        </div>
      </div>

      <div className="relative hidden h-full w-full lg:block">
        <NollePCarousel />
      </div>

      <div className="mt-auto lg:hidden">
        <SiteFooter />
      </div>
    </div>
  )
}
