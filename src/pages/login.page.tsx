import { useLocation } from 'react-router-dom'

import { LoginForm } from '@/components/organisms/loginForm'
import { NollePCarousel } from '@/components/organisms/nollePCarousel'
import { SignUpForm } from '@/components/organisms/signUpForm'

import LUST from '@/assets/LUST.png'

export function LoginPage() {
  const { state } = useLocation()

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      <div className="absolute">
        <img src={LUST} alt="LUST" className="h-12 m-4" />
      </div>
      <div className="flex items-center justify-center flex-col h-full">
        {!state?.showSignUp ? <LoginForm /> : <SignUpForm />}
      </div>

      <div className="w-full h-full lg:block hidden relative">
        <NollePCarousel />
      </div>
    </div>
  )
}
