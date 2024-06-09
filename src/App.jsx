import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { locale, loadMessages } from 'devextreme/localization'
import seMessages from 'devextreme/localization/messages/sv.json'

import { TooltipProvider } from '@/components/ui/tooltip'
import Router from './Router'

function App() {
  useEffect(() => {
    loadMessages(seMessages)
    locale(navigator.language)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <TooltipProvider>
        <main>
          <Router />
          <Toaster />
        </main>
      </TooltipProvider>
    </div>
  )
}

export default App
