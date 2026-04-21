'use client'

import { useEffect, useState } from 'react'

const CONSENT_STORAGE_KEY = 'ttn_cookie_consent_v1'

type ConsentState = 'granted' | 'denied'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function updateGoogleConsent(state: ConsentState) {
  if (!window.gtag) return

  window.gtag('consent', 'update', {
    analytics_storage: state,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentState | null

    if (!saved) {
      setVisible(true)
      return
    }

    updateGoogleConsent(saved)
  }, [])

  function handleConsent(state: ConsentState) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, state)
    updateGoogleConsent(state)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur sm:bottom-6 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-sans text-sm font-semibold text-foreground">Analytics consent</p>
          <p className="text-sm leading-6 text-muted-foreground">
            We use analytics cookies to understand which articles people read and how the site is
            performing. You can accept or reject analytics tracking.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-48">
          <button
            type="button"
            onClick={() => handleConsent('granted')}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Accept analytics
          </button>
          <button
            type="button"
            onClick={() => handleConsent('denied')}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Reject
          </button>
        </div>
      </div>
    </aside>
  )
}
