'use client'

import NProgress from 'nprogress'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

let timeout;

export default function ProgressBar() {
  const pathname = usePathname()

  useEffect(() => {
    NProgress.start()
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      NProgress.done()
    }, 100) // Simulate page load duration

    return () => {
      clearTimeout(timeout)
    }
  }, [pathname])

  return null
}
