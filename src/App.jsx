import { useEffect } from 'react'

import { locale, loadMessages } from 'devextreme/localization'

import Router from './Router'
import { color } from './CONSTANTS'

import seMessages from 'devextreme/localization/messages/sv.json'
import 'devextreme/dist/css/dx.light.css'
import { Toaster } from 'sonner'

function App() {
  useEffect(() => {
    loadMessages(seMessages)
    locale(navigator.language)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Router />
        <Toaster />
      </main>
      {/* <Footer /> */}
    </div>
  )
}

export default App
