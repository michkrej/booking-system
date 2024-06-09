import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { NollePCarousel } from '@/components/organisms/nollePCarousel'
import { SiteLogo } from '@/components/atoms/siteLogo'
import { SiteFooter } from '@/components/molecules/siteFooter'
import { ForgotPasswordForm } from '@/components/organisms/forgotPasswordForm'
import { useHasUser } from '@/state'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const hasUser = useHasUser()

  useEffect(() => {
    if (hasUser) {
      navigate('/dashboard')
    }
  }, [hasUser])

  return (
    <>
      <div className="w-full md:grid lg:min-h-screen lg:grid-cols-2">
        <div className="fixed top-0">
          <SiteLogo />
        </div>
        <div className="relative mt-20 flex items-center justify-center lg:mt-0">
          <ForgotPasswordForm />
          <div className="absolute bottom-0 hidden w-full justify-center lg:flex">
            <SiteFooter />
          </div>
        </div>

        <div className="relative hidden h-full w-full lg:block">
          <NollePCarousel active={false} />
        </div>
      </div>
      <div className="fixed bottom-0 mt-10 lg:hidden">
        <SiteFooter />
      </div>
    </>
  )
}
